#!/usr/bin/env node
/**
 * 🧭 全站导航管理、智能查重与死链自动熔断清理引擎 (Navigation Manager, Dedup & Health Pruner)
 * 支持对 GitHub 导航、工具导航、AI 导航的 增、删、改、查、跨库查重、实时可访问性探测与失效链接自动熔断删除。
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT_DIR = path.resolve(__dirname, "../../../../");
const NAV_FILES = {
  ai: {
    name: "AI 导航",
    file: path.join(ROOT_DIR, "data", "ai-nav.json"),
    type: "ai"
  },
  tools: {
    name: "工具导航",
    file: path.join(ROOT_DIR, "data", "tools-nav.json"),
    type: "tools"
  },
  github: {
    name: "GitHub 导航",
    file: path.join(ROOT_DIR, "data", "github-nav.json"),
    type: "github"
  }
};

const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

function normalizeUrl(rawUrl) {
  if (!rawUrl) return "";
  let u = rawUrl.trim().toLowerCase();
  u = u.replace(/^https?:\/\//, "");
  u = u.replace(/^www\./, "");
  u = u.replace(/\/+$/, "");
  return u;
}

function normalizeName(name) {
  if (!name) return "";
  return name.trim().toLowerCase().replace(/[\s_-]+/g, "");
}

function loadAllNavData() {
  const allData = {};
  for (const [key, meta] of Object.entries(NAV_FILES)) {
    if (fs.existsSync(meta.file)) {
      try {
        allData[key] = JSON.parse(fs.readFileSync(meta.file, "utf8"));
      } catch (err) {
        console.error(`❌ 解析 ${meta.name} (${meta.file}) 失败: ${err.message}`);
        allData[key] = [];
      }
    } else {
      allData[key] = [];
    }
  }
  return allData;
}

function saveNavData(targetType, data) {
  const meta = NAV_FILES[targetType];
  if (!meta) throw new Error(`未知导航类型: ${targetType}`);
  fs.writeFileSync(meta.file, JSON.stringify(data, null, 2) + "\n", "utf8");
}

/**
 * 探测单个 URL 是否存活可用
 */
async function checkUrlAlive(url, timeoutMs = 7000) {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
      },
      signal: AbortSignal.timeout(timeoutMs),
      redirect: "follow"
    });
    if (res.status === 404 || res.status === 410) {
      return { alive: false, status: res.status, reason: `HTTP ${res.status} (页面不存在)` };
    }
    return { alive: true, status: res.status };
  } catch (err) {
    return { alive: false, status: null, reason: err.message || "连接超时或域名解析失败" };
  }
}

/**
 * 全局查重检测
 */
function findDuplicates(itemToCheck = null) {
  const allData = loadAllNavData();
  const indexByUrl = new Map();
  const indexByName = new Map();
  const allDuplicates = [];

  for (const [typeKey, categories] of Object.entries(allData)) {
    const navMeta = NAV_FILES[typeKey];
    for (const cat of categories) {
      for (const item of (cat.items || [])) {
        const normUrl = normalizeUrl(item.url);
        const normName = normalizeName(item.name);
        const entry = {
          navType: typeKey,
          navName: navMeta.name,
          category: cat.category,
          name: item.name,
          url: item.url,
          itemRef: item
        };

        if (normUrl) {
          if (indexByUrl.has(normUrl)) {
            allDuplicates.push({
              reason: "URL 重复",
              key: normUrl,
              itemA: indexByUrl.get(normUrl),
              itemB: entry
            });
          } else {
            indexByUrl.set(normUrl, entry);
          }
        }

        if (normName) {
          if (indexByName.has(normName)) {
            allDuplicates.push({
              reason: "名称相似/重复",
              key: normName,
              itemA: indexByName.get(normName),
              itemB: entry
            });
          } else {
            indexByName.set(normName, entry);
          }
        }
      }
    }
  }

  if (itemToCheck) {
    const targetNormUrl = normalizeUrl(itemToCheck.url);
    const targetNormName = normalizeName(itemToCheck.name);
    const conflicts = [];

    if (targetNormUrl && indexByUrl.has(targetNormUrl)) {
      const match = indexByUrl.get(targetNormUrl);
      conflicts.push({ reason: "网址已存在 (URL conflict)", match });
    }
    if (targetNormName && indexByName.has(targetNormName)) {
      const match = indexByName.get(targetNormName);
      conflicts.push({ reason: "名称已存在 (Name conflict)", match });
    }
    return { hasConflict: conflicts.length > 0, conflicts };
  }

  return { allDuplicates, totalItems: indexByUrl.size };
}

function rebuildSite() {
  console.log("🔄 正在全自动执行静态博客编译与死链审计...");
  try {
    execSync("node build.js && npm run audit", { cwd: ROOT_DIR, stdio: "inherit" });
    console.log("✅ 全站编译与审计通过！");
  } catch (err) {
    console.error("❌ 编译或审计失败:", err.message);
  }
}

/**
 * 批量探测所有导航站点的可访问性
 */
async function checkAllNavigationUrls(autoDeleteDead = false) {
  const allData = loadAllNavData();
  const allItems = [];

  for (const [key, categories] of Object.entries(allData)) {
    categories.forEach(cat => {
      cat.items.forEach(item => {
        allItems.push({
          navKey: key,
          navName: NAV_FILES[key].name,
          category: cat.category,
          name: item.name,
          url: item.url
        });
      });
    });
  }

  console.log(`📡 正在对全站 ${allItems.length} 个导航站点发起并行可访问性健康度检测...\n`);
  
  const concurrency = 6;
  const deadItems = [];
  let checkedCount = 0;

  for (let i = 0; i < allItems.length; i += concurrency) {
    const batch = allItems.slice(i, i + concurrency);
    const results = await Promise.all(batch.map(async (item) => {
      const health = await checkUrlAlive(item.url);
      return { item, health };
    }));

    results.forEach(({ item, health }) => {
      checkedCount++;
      if (health.alive) {
        console.log(`[${checkedCount}/${allItems.length}] ✅ 可正常访问 | ${item.name} (${item.url}) ${health.status ? `[HTTP ${health.status}]` : ""}`);
      } else {
        console.warn(`[${checkedCount}/${allItems.length}] ❌ 无法访问/死链 | ${item.name} (${item.url}) 原因: ${health.reason}`);
        deadItems.push(item);
      }
    });
  }

  console.log(`\n📊 巡检完成: 共检测 ${allItems.length} 个站点，正常: ${allItems.length - deadItems.length}，失效/无法访问: ${deadItems.length}`);

  if (deadItems.length > 0) {
    if (autoDeleteDead) {
      console.log(`\n🗑️ 正在自动熔断清理 ${deadItems.length} 个失效站点...`);
      const deadUrls = new Set(deadItems.map(d => normalizeUrl(d.url)));

      for (const [key, categories] of Object.entries(allData)) {
        for (const cat of categories) {
          cat.items = cat.items.filter(item => !deadUrls.has(normalizeUrl(item.url)));
        }
        allData[key] = categories.filter(c => c.items && c.items.length > 0);
        saveNavData(key, allData[key]);
      }
      console.log("✅ 失效站点已全部物理剔除！");
      rebuildSite();
    } else {
      console.log("💡 提示: 若要一键自动删除上述失效站点，请运行: node .agents/skills/nav-manager/scripts/manage-nav.js prune");
    }
  } else {
    console.log("🎉 太棒了！全站所有导航站点 100% 畅通可用！\n");
  }

  return { total: allItems.length, deadCount: deadItems.length, deadItems };
}

// -------------------------------------------------------------
// CLI 命令解析与执行
// -------------------------------------------------------------
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "check";

  if (command === "check" || command === "dedup") {
    console.log("🔍 开始全库导航跨表查重检测 (AI导航 / 工具导航 / GitHub导航)...\n");
    const { allDuplicates, totalItems } = findDuplicates();
    
    if (allDuplicates.length === 0) {
      console.log(`🎉 完美无重复！全库共 ${totalItems} 个导航站点，未发现任何网址或名称重复项。\n`);
    } else {
      console.warn(`⚠️ 发现 ${allDuplicates.length} 处潜在重复项:\n`);
      allDuplicates.forEach((dup, idx) => {
        console.log(`[${idx + 1}] ${dup.reason} (关键词: ${dup.key})`);
        console.log(`    1️⃣ [${dup.itemA.navName}] [${dup.itemA.category}] ${dup.itemA.name} -> ${dup.itemA.url}`);
        console.log(`    2️⃣ [${dup.itemB.navName}] [${dup.itemB.category}] ${dup.itemB.name} -> ${dup.itemB.url}\n`);
      });
    }
  } else if (command === "check-alive" || command === "ping" || command === "health") {
    await checkAllNavigationUrls(false);
  } else if (command === "prune" || command === "clean-dead") {
    await checkAllNavigationUrls(true);
  } else if (command === "list") {
    const allData = loadAllNavData();
    console.log("📋 当前收录全站导航汇总清单:\n");
    for (const [key, categories] of Object.entries(allData)) {
      const meta = NAV_FILES[key];
      const totalCount = categories.reduce((sum, c) => sum + (c.items ? c.items.length : 0), 0);
      console.log(`📌 ${meta.name} (共 ${categories.length} 个分类 · ${totalCount} 个站点):`);
      categories.forEach(c => {
        console.log(`  📁 ${c.category} (${c.items.length} 个):`);
        c.items.forEach(i => console.log(`     - ${i.name} (${i.url})`));
      });
      console.log("");
    }
  } else if (command === "add") {
    const targetType = (args[1] || "").toLowerCase();
    const categoryName = args[2];
    const name = args[3];
    const url = args[4];
    const tagline = args[5] || name;
    const description = args[6] || tagline;
    const tagsStr = args[7] || name;
    const badge = args[8] || categoryName;

    if (!NAV_FILES[targetType] || !categoryName || !name || !url) {
      console.log(`用法: node manage-nav.js add <ai|tools|github> <分类名称> <名称> <URL> [一句话描述] [详细介绍] [逗号标签] [徽标文字]`);
      console.log(`示例: node manage-nav.js add tools "实用生成与办公工具" "草料二维码" "https://cli.im/" "专业二维码在线生成平台" "支持文本链接扫码生成..." "二维码,生成器" "二维码首选"`);
      process.exit(1);
    }

    const newItem = {
      name,
      url,
      tagline,
      description,
      category: categoryName,
      badge,
      tags: tagsStr.split(",").map(t => t.trim()).filter(Boolean)
    };

    if (targetType === "github") {
      newItem.repo = url.replace(/^https?:\/\/github\.com\//, "").replace(/\/+$/, "");
      newItem.language = args[9] || "OpenSource";
    }

    // 1. 跨库查重检测
    console.log(`🔍 正在对新站点 [${name}] (${url}) 进行全局智能跨库查重...`);
    const checkResult = findDuplicates(newItem);
    if (checkResult.hasConflict) {
      console.error(`\n❌ 查重失败！该站点与已有导航记录冲突:`);
      checkResult.conflicts.forEach(c => {
        console.error(`  - 原因: ${c.reason}`);
        console.error(`  - 已存在于: [${c.match.navName}] [${c.match.category}] ${c.match.name} (${c.match.url})`);
      });
      console.error(`\n🚫 为保障数据严谨性，已取消添加。若确需更新，请使用 modify 命令。\n`);
      process.exit(1);
    }

    // 2. 实时可访问性检测 (确保链接有效)
    console.log(`📡 正在对 URL 进行实时可访问性验证 (${url})...`);
    const health = await checkUrlAlive(url);
    if (!health.alive) {
      console.error(`\n❌ 访问测试失败！目标网址无法正常打开/连接失败:`);
      console.error(`  - 原因: ${health.reason}`);
      console.error(`\n🚫 导航收录规则要求所有链接必须真实可访问，已终止添加。\n`);
      process.exit(1);
    }
    console.log(`✅ 访问测试通过 ${health.status ? `[HTTP ${health.status}]` : ""}！`);

    // 3. 执行添加
    const allData = loadAllNavData();
    const targetCategories = allData[targetType];
    let targetCat = targetCategories.find(c => c.category === categoryName);
    if (!targetCat) {
      targetCat = {
        category: categoryName,
        description: `${categoryName}精选工具与资源`,
        icon: "grid",
        items: []
      };
      targetCategories.push(targetCat);
    }
    targetCat.items.push(newItem);
    saveNavData(targetType, targetCategories);
    console.log(`\n✅ 成功将 [${name}] 添加到 [${NAV_FILES[targetType].name} -> ${categoryName}]！\n`);
    rebuildSite();

  } else if (command === "delete" || command === "remove") {
    const keyword = args[1];
    if (!keyword) {
      console.log("用法: node manage-nav.js delete <名称或网址关键词>");
      process.exit(1);
    }

    const normTarget = normalizeUrl(keyword) || normalizeName(keyword);
    const allData = loadAllNavData();
    let deletedCount = 0;

    for (const [key, categories] of Object.entries(allData)) {
      for (const cat of categories) {
        cat.items = cat.items.filter(item => {
          const matches = normalizeUrl(item.url) === normTarget || 
                          normalizeName(item.name) === normTarget ||
                          item.name.toLowerCase().includes(keyword.toLowerCase()) ||
                          item.url.toLowerCase().includes(keyword.toLowerCase());
          if (matches) {
            console.log(`🗑️ 从 [${NAV_FILES[key].name} -> ${cat.category}] 删除站点: ${item.name} (${item.url})`);
            deletedCount++;
            return false;
          }
          return true;
        });
      }
      allData[key] = categories.filter(c => c.items && c.items.length > 0);
      saveNavData(key, allData[key]);
    }

    if (deletedCount === 0) {
      console.log(`⚠️ 未找到匹配关键词 [${keyword}] 的导航站点。`);
    } else {
      console.log(`\n✅ 共成功删除 ${deletedCount} 个导航站点！\n`);
      rebuildSite();
    }

  } else if (command === "modify" || command === "update") {
    const searchKeyword = args[1];
    const field = args[2];
    const newValue = args[3];

    if (!searchKeyword || !field || newValue === undefined) {
      console.log("用法: node manage-nav.js modify <名称或网址关键词> <name|url|tagline|desc|tags|badge|category> <新值>");
      process.exit(1);
    }

    const allData = loadAllNavData();
    let modifiedCount = 0;

    for (const [key, categories] of Object.entries(allData)) {
      for (const cat of categories) {
        for (const item of cat.items) {
          if (item.name.toLowerCase().includes(searchKeyword.toLowerCase()) || item.url.toLowerCase().includes(searchKeyword.toLowerCase())) {
            console.log(`✏️ 正在修改 [${NAV_FILES[key].name} -> ${cat.category}] 中的 ${item.name}...`);
            if (field === "name") item.name = newValue;
            else if (field === "url") item.url = newValue;
            else if (field === "tagline") item.tagline = newValue;
            else if (field === "desc" || field === "description") item.description = newValue;
            else if (field === "badge") item.badge = newValue;
            else if (field === "tags") item.tags = newValue.split(",").map(t => t.trim()).filter(Boolean);
            modifiedCount++;
          }
        }
      }
      saveNavData(key, categories);
    }

    if (modifiedCount > 0) {
      console.log(`\n✅ 成功修改 ${modifiedCount} 处导航站点信息！\n`);
      rebuildSite();
    } else {
      console.log(`⚠️ 未找到匹配关键词 [${searchKeyword}] 的导航项。`);
    }
  } else {
    console.log(`
🧭 导航管理脚本 (manage-nav.js) 帮助说明:
--------------------------------------------------
1. 全库智能查重:
   node .agents/skills/nav-manager/scripts/manage-nav.js check

2. 全站可访问性健康巡检 (仅检测不删除):
   node .agents/skills/nav-manager/scripts/manage-nav.js check-alive

3. 全站死链自动熔断清理 (检测并自动删除所有无法打开的死链):
   node .agents/skills/nav-manager/scripts/manage-nav.js prune

4. 查看全站导航汇总清单:
   node .agents/skills/nav-manager/scripts/manage-nav.js list

5. 添加新导航 (自动跨库查重 + 自动可访问性测试):
   node .agents/skills/nav-manager/scripts/manage-nav.js add <ai|tools|github> <分类> <名称> <URL> [一句话] [详细描述] [标签1,标签2] [徽标]

6. 修改已有导航:
   node .agents/skills/nav-manager/scripts/manage-nav.js modify <关键词> <name|url|tagline|desc|tags|badge> <新值>

7. 删除导航:
   node .agents/skills/nav-manager/scripts/manage-nav.js delete <关键词>
`);
  }
}

main().catch(err => {
  console.error("❌ 执行出错:", err);
  process.exit(1);
});
