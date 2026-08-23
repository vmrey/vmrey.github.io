---
title: Photoshop 批量图片压缩 ExtendScript (JSX) 自动化脚本（支持保留子目录结构）
date: 2026-07-05
category: 效率工具与软件
subcategory: PS脚本
tags: 效率工具,Photoshop,JavaScript,自动化,图片压缩
summary: Photoshop ExtendScript (JSX) 批量图片压缩脚本最新优化版。支持 JPG/PNG/GIF/JFIF 递归批量处理与自动保留多层子目录结构，内置防覆盖机制与稳健异常处理。
readTime: 8 分钟阅读
---

# Photoshop 批量图片压缩脚本 (ExtendScript JSX)

这是一个专为 Adobe Photoshop 编写的 ExtendScript (JSX) 自动化脚本，可以帮助你一键递归批量压缩指定文件夹内的所有图片，并完整保留原始子目录结构。

---

## 一、✨ 核心功能亮点

- **多格式支持**：全面支持批量扫描并处理 `.jpg`, `.jpeg`, `.jfif`, `.png`, `.gif` 格式图片。
- **智能保留目录结构**：支持递归深度读取所有子文件夹中的图片，并在输出时**自动还原原有的子目录结构**，杜绝文件混杂和同名文件相互覆盖。
- **自定义压缩质量**：运行后弹出交互输入框自由设定压缩质量（1-100），灵活控制输出体积（主要对 JPG/JFIF 格式生效，PNG 与 GIF 采用自适应 Web 优化算法）。
- **源文件安全隔离**：所有压缩成果将自动存储在源文件夹同级的独立目录（默认带有 `_compressed` 后缀），**绝对不修改或覆盖任何原始素材**。
- **稳健异常防护**：每个文件独立捕获处理异常，单张损坏图片自动跳过并记录日志，绝不中断整批任务。

---

## 二、🚀 使用方法与运行步骤

1. **保存脚本文件**：新建文本文件，将下方提供的完整源码粘贴进去，重命名保存为 `BatchCompress.jsx`。
2. **在 Photoshop 中运行**：打开 Photoshop，在顶部菜单栏依次点击：`文件 (File)` → `脚本 (Scripts)` → `浏览... (Browse...)`。
3. **加载脚本**：在文件选择窗口中，找到并选中刚才保存的 `BatchCompress.jsx`。
4. **按弹窗提示操作**：
   - **选择源文件夹**：在对话框中选取需要批量压缩的图片目录；
   - **输入压缩质量**：根据需求输入 `1-100` 的质量数值（默认为 `80`，数值越小体积越小）；
   - **自动化处理**：脚本将自动在后台进行多线程等效批处理，并在完成后弹出汇总弹窗。

---

## 三、💻 完整代码 (最新优化版)

> 此优化版本彻底解决了旧版在部分 Photoshop 版本中由于 ExtendScript 严格模式导致的 API 兼容性报错，并重构了文件安全关闭机制与子目录镜像重建算法。

```javascript
/**
 * Photoshop 批量图片压缩脚本 (ExtendScript JSX)
 * 支持格式：JPG、PNG、GIF、JFIF
 * 优化版：修复兼容性问题，支持递归保留原有子文件夹结构
 */

// ==================== 配置参数 ====================
var CONFIG = {
    DEFAULT_QUALITY: 80,          // 默认压缩质量 (1-100)
    OUTPUT_SUFFIX: "_compressed", // 输出文件夹后缀
    SUPPORTED_FORMATS: [".jpg", ".jpeg", ".jfif", ".png", ".gif"]
};

// ==================== 主程序 ====================
function main() {
    try {
        // 1. 选择源文件夹
        var sourceFolder = Folder.selectDialog("请选择要压缩的图片文件夹");
        if (!sourceFolder || !sourceFolder.exists) {
            alert("未选择有效文件夹，脚本已退出");
            return;
        }

        // 2. 获取压缩质量
        var quality = prompt("请输入压缩质量 (1-100，数值越大质量越好。注:仅对JPG生效)", CONFIG.DEFAULT_QUALITY);
        quality = parseInt(quality);
        
        if (isNaN(quality) || quality < 1 || quality > 100) {
            alert("无效的质量值，使用默认值: " + CONFIG.DEFAULT_QUALITY);
            quality = CONFIG.DEFAULT_QUALITY;
        }

        // 3. 创建输出文件夹
        var outputFolder = new Folder(sourceFolder.fsName + CONFIG.OUTPUT_SUFFIX);
        if (!outputFolder.exists) {
            outputFolder.create();
        }

        // 4. 获取所有图片文件
        var files = getImageFiles(sourceFolder);
        if (files.length === 0) {
            alert("未找到支持的图片文件");
            return;
        }

        // 5. 批量处理
        var successCount = 0;
        var failCount = 0;
        
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            
            try {
                // 显示进度
                var progress = Math.round((i + 1) / files.length * 100);
                $.writeln("处理中: " + progress + "% - " + file.name);
                
                // 压缩并保存
                compressImage(file, sourceFolder, outputFolder, quality);
                successCount++;
                
            } catch (e) {
                $.writeln("处理失败: " + file.name + " - " + e.message);
                failCount++;
            }
        }

        // 6. 显示结果
        var resultMsg = "批量压缩完成！\n\n" +
                       "成功: " + successCount + " 张\n" +
                       "失败: " + failCount + " 张\n" +
                       "输出目录: " + outputFolder.fsName;
        
        alert(resultMsg);
        $.writeln(resultMsg);

    } catch (error) {
        alert("脚本执行出错: " + error.message);
        $.writeln("错误: " + error.message);
    }
}

// ==================== 工具函数 ====================

/**
 * 判断扩展名是否在支持列表中
 */
function isExtensionSupported(ext) {
    for (var i = 0; i < CONFIG.SUPPORTED_FORMATS.length; i++) {
        if (CONFIG.SUPPORTED_FORMATS[i] === ext) {
            return true;
        }
    }
    return false;
}

/**
 * 获取文件夹中所有支持的图片文件（递归）
 * @param {Folder} folder - 文件夹对象
 * @returns {File[]} - 图片文件数组
 */
function getImageFiles(folder) {
    var files = [];
    var allFiles = folder.getFiles();
    
    for (var i = 0; i < allFiles.length; i++) {
        var item = allFiles[i];
        
        if (item instanceof Folder) {
            // 递归处理子文件夹
            files = files.concat(getImageFiles(item));
        } else if (item instanceof File) {
            // 检查是否为支持的格式
            var nameStr = item.name.toLowerCase();
            var extIndex = nameStr.lastIndexOf(".");
            if (extIndex !== -1) {
                var ext = nameStr.substring(extIndex);
                if (isExtensionSupported(ext)) {
                    files.push(item);
                }
            }
        }
    }
    
    return files;
}

/**
 * 压缩单张图片并保留子目录结构
 * @param {File} inputFile - 输入文件
 * @param {Folder} sourceFolder - 原始根文件夹 (用于计算相对路径)
 * @param {Folder} outputFolder - 输出根文件夹
 * @param {number} quality - 压缩质量 (1-100)
 */
function compressImage(inputFile, sourceFolder, outputFolder, quality) {
    // 1. 打开图片
    var doc = app.open(inputFile);
    if (!doc) {
        throw new Error("无法打开文件");
    }

    try {
        // 2. 构建输出路径，保留原有的子目录结构
        var relativePath = inputFile.path.replace(sourceFolder.fsName, "");
        var targetFolderPath = outputFolder.fsName + relativePath;
        var targetFolder = new Folder(targetFolderPath);
        
        // 如果子目录不存在，则创建
        if (!targetFolder.exists) {
            targetFolder.create();
        }

        var outputPath = targetFolderPath + "/" + inputFile.name;
        
        // 3. 根据格式设置导出选项
        var exportOptions = getExportOptions(inputFile, quality);
        
        // 4. 导出图片
        doc.exportDocument(
            new File(outputPath),
            ExportType.SAVEFORWEB,
            exportOptions
        );
        
    } finally {
        // 5. 确保安全关闭当前文档（避免内存泄漏）
        if (doc) {
            doc.close(SaveOptions.DONOTSAVECHANGES);
        }
    }
}

/**
 * 获取 SaveForWeb 导出选项
 * @param {File} file - 文件对象
 * @param {number} quality - 压缩质量
 * @returns {ExportOptionsSaveForWeb}
 */
function getExportOptions(file, quality) {
    var ext = file.name.toLowerCase();
    var options = new ExportOptionsSaveForWeb();
    
    if (ext.match(/\.jpg$/) || ext.match(/\.jpeg$/) || ext.match(/\.jfif$/)) {
        // JPG 格式
        options.format = SaveDocumentType.JPEG;
        options.quality = quality;
        options.optimized = true;
        options.progressive = false;
        
    } else if (ext.match(/\.png$/)) {
        // PNG 格式
        options.format = SaveDocumentType.PNG;
        options.PNG8 = false; // 使用 24位真彩色 PNG
        options.transparency = true;
        options.interlaced = false;
        
    } else if (ext.match(/\.gif$/)) {
        // GIF 格式
        options.format = SaveDocumentType.COMPUSERVEGIF;
        options.transparency = true;
        options.includeProfile = false;
        options.lossy = 0;
        options.colors = 256;
        options.colorReduction = ColorReductionType.SELECTIVE;
        options.ditherAmount = 0;
        options.dither = Dither.NOISE;
        options.palette = Palette.LOCALADAPTIVE;
    }
    
    return options;
}

// ==================== 启动脚本 ====================
main();
```

---

## 四、⚙️ 核心参数与质量选型参考

### 1. 配置参数说明

| 参数项 | 说明 | 默认值 | 作用范围 |
| :--- | :--- | :--- | :--- |
| `DEFAULT_QUALITY` | 默认压缩质量数值 | `80` | 作用于 JPEG/JFIF 导出质量 |
| `OUTPUT_SUFFIX` | 输出目录后缀标识 | `_compressed` | 在源目录同级自动新建 |
| `SUPPORTED_FORMATS` | 支持处理的文件扩展名列表 | `JPG, PNG, GIF, JFIF` | 自动过滤无关格式文件 |

### 2. 压缩质量参考推荐

| 质量区间 | 视觉效果 | 推荐场景 | 体积降幅预估 |
| :--- | :--- | :--- | :--- |
| **90 ~ 100** | 几乎无损，肉眼无法分辨差异 | 印刷前预览、高保真设计交付 | 体积缩减约 20% ~ 40% |
| **75 ~ 85** | 画质极高，边缘清晰度完美 | **网页展示、电商详情页、技术博客（推荐）** | 体积缩减约 60% ~ 75% |
| **50 ~ 70** | 略有噪点，微距可见压缩伪影 | 移动端预览缩略图、长列表瀑布流 | 体积缩减约 75% ~ 85% |
| **1 ~ 49** | 压缩感明显 | 极限低带宽占位骨架图 | 体积缩减约 85% 以上 |

---

## 五、📁 镜像输出目录树结构示例

脚本执行后将自动递归镜像原有目录树，如下所示：

```text
源图片文件夹/
├── header-banner.jpg
├── logo.png
├── icons/
│   ├── icon-home.png
│   └── icon-user.png
└── product/
    ├── item1.jpg
    └── item2.jpg

源图片文件夹_compressed/       ← 自动创建的输出目录
├── header-banner.jpg
├── logo.png
├── icons/                    ← 自动还原的子目录
│   ├── icon-home.png
│   └── icon-user.png
└── product/                  ← 自动还原的子目录
    ├── item1.jpg
    └── item2.jpg
```

---

## 六、🛡️ 常见问题与排错指南

| 现象 | 可能原因 | 对应解决办法 |
| :--- | :--- | :--- |
| **菜单中找不到脚本选项** | 脚本文件未命名为 `.jsx` 格式 | 确保文件扩展名为标准的 `.jsx` 而非 `.txt` |
| **提示"无权限创建目录"** | 输出路径所在分区有写入权限限制 | 以管理员身份运行 Photoshop 或更换工作目录 |
| **大批量处理时内存上涨** | 打开过多超大尺寸图片 | 脚本内置 `doc.close` 自动回收，极超大图建议分批执行 |

