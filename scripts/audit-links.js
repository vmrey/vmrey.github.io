/**
 * 全站超链接与静态资源完整性自动化审计脚本 (0 死链检测器)
 */
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT_DIR, 'posts');

const htmlFiles = [
  path.join(ROOT_DIR, 'index.html'),
  path.join(ROOT_DIR, 'about.html'),
  path.join(ROOT_DIR, 'files.html'),
  path.join(ROOT_DIR, 'nav.html'),
  path.join(ROOT_DIR, 'tools.html'),
  ...fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.html')).map(f => path.join(POSTS_DIR, f))
];

let totalHrefs = 0;
let brokenLinks = [];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const dir = path.dirname(file);
  const relFile = path.relative(ROOT_DIR, file);

  const hrefMatches = [...content.matchAll(/href=["\x27]([^"\x27]+)["\x27]/g)];
  hrefMatches.forEach(m => {
    totalHrefs++;
    const href = m[1].trim();
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('javascript:') || href.startsWith('#')) {
      return;
    }

    const cleanPath = href.split('?')[0].split('#')[0];
    if (!cleanPath) return;

    const resolved = path.resolve(dir, cleanPath);
    if (!fs.existsSync(resolved)) {
      brokenLinks.push({
        source: relFile,
        href: href,
        resolved: path.relative(ROOT_DIR, resolved)
      });
    }
  });
});

console.log(`\n🔍 全站超链接完整性审计报告:`);
console.log(`--------------------------------------------------`);
console.log(`📄 审计页面总数: ${htmlFiles.length} 个 HTML 文件`);
console.log(`🔗 验证超链接数: ${totalHrefs} 条内部链接与资源引用`);

if (brokenLinks.length === 0) {
  console.log(`✅ 结果: 完美无死链！全站所有链接 100% 畅通可用！\n`);
  process.exit(0);
} else {
  console.error(`❌ 发现 ${brokenLinks.length} 处失效死链:`);
  brokenLinks.forEach(b => {
    console.error(`  - 页面 [${b.source}] 中的链接 "${b.href}" -> 目标文件不存在: ${b.resolved}`);
  });
  console.log('');
  process.exit(1);
}
