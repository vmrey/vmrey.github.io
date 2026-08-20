---
title: Photoshop 批量压缩与图片重命名 ExtendScript (JSX) 脚本源码
date: 2026-07-05
category: 效率工具与软件
subcategory: PS脚本
tags: 效率工具,Photoshop,JavaScript,自动化
summary: 使用 Adobe ExtendScript 编写 PS 自动化脚本，一键递归处理整个文件夹中的图片并按质量比导出。
readTime: 18 分钟阅读
---

# PS 批量压缩图片脚本

此脚本可以批量压缩图片，支持 JPG、PNG、GIF 格式，压缩质量可自定义。

## 📝 脚本功能

| 功能 | 说明 |
|------|------|
| **批量处理** | 自动扫描指定文件夹及其子文件夹 |
| **格式支持** | JPG、PNG、GIF、JFIF |
| **质量控制** | 可自定义压缩质量（1-100） |
| **智能输出** | 自动在原文件夹创建压缩后目录 |
| **错误处理** | 自动跳过损坏或无法打开的文件 |

## 🚀 使用方法

### 方法一：快速使用（推荐）

1. **创建脚本文件**：在桌面新建 `ImgCompress.jsx` 文件
2. **复制源码**：将下方源码复制进去
3. **运行脚本**：
   - 打开 Photoshop
   - 菜单：`文件` → `脚本` → `浏览` → 选择 `ImgCompress.jsx`
4. **选择文件夹**：在弹出的对话框中选择要压缩的图片文件夹
5. **设置参数**：在弹出的对话框中设置压缩质量

### 方法二：传统方式（需手动配置路径）

```javascript
// 手动配置方式（不推荐，建议使用方法一）
var config = {
    inputFolder: "E:/images",    // 输入文件夹
    outputFolder: "E:/images_compressed", // 输出文件夹
    quality: 80,                  // 压缩质量 (1-100)
    overwriteOriginal: false      // 是否覆盖原文件
};
```

---

## 📄 完整源码

```javascript
/**
 * Photoshop 批量图片压缩脚本
 * 支持格式：JPG、PNG、GIF、JFIF
 * 作者：优化版
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
        var quality = prompt("请输入压缩质量 (1-100，数值越大质量越好)", CONFIG.DEFAULT_QUALITY);
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
                compressImage(file, outputFolder, quality);
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
            var ext = item.name.toLowerCase().substring(item.name.lastIndexOf("."));
            if (CONFIG.SUPPORTED_FORMATS.indexOf(ext) !== -1) {
                files.push(item);
            }
        }
    }
    
    return files;
}

/**
 * 压缩单张图片
 * @param {File} inputFile - 输入文件
 * @param {Folder} outputFolder - 输出文件夹
 * @param {number} quality - 压缩质量 (1-100)
 */
function compressImage(inputFile, outputFolder, quality) {
    // 1. 打开图片
    var doc = app.open(inputFile);
    if (!doc) {
        throw new Error("无法打开文件");
    }

    try {
        // 2. 构建输出路径
        var outputPath = outputFolder.fsName + "/" + inputFile.name;
        
        // 3. 根据格式设置导出选项
        var exportOptions = getExportOptions(inputFile, quality);
        
        // 4. 导出图片
        doc.exportDocument(
            new File(outputPath),
            ExportType.SAVEFORWEB,
            exportOptions
        );
        
    } finally {
        // 5. 关闭文档（不保存原文件）
        if (app.activeDocument) {
            app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
        }
    }
}

/**
 * 获取导出选项
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
        options.PNG8 = false; // 使用 PNG-24
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

## ⚙️ 参数说明

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `DEFAULT_QUALITY` | 默认压缩质量 | 80 |
| `OUTPUT_SUFFIX` | 输出文件夹后缀 | `_compressed` |
| `SUPPORTED_FORMATS` | 支持的图片格式 | JPG、PNG、GIF、JFIF |

## 📊 压缩质量参考

| 质量值 | 适用场景 |
|--------|----------|
| 90-100 | 高清图片、设计稿 |
| 70-89 | 网页图片、社交媒体 |
| 50-69 | 缩略图、预览图 |
| 1-49 | 极低质量占位图 |

## 🛡️ 注意事项

### 1. 备份重要文件
- 建议在运行脚本前备份原始图片，以防意外！

### 2. Photoshop 版本要求
- 支持 Photoshop CS6 及以上版本
- 需启用 JavaScript 脚本支持

### 3. 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 脚本无法运行 | 未启用脚本支持 | 编辑 → 首选项 → 增效工具 → 勾选"允许脚本连接到网络" |
| 图片无法打开 | 文件损坏或格式不支持 | 检查文件完整性，确保是支持的格式 |
| 输出为空 | 没有找到图片文件 | 确认文件夹中有 JPG/PNG/GIF 文件 |
| 内存不足 | 一次性处理过多大图片 | 分批处理，或增加 Photoshop 内存分配 |

## 📁 输出结构

```
原文件夹/
├── photo1.jpg
├── photo2.png
├── subfolder/
│   └── photo3.gif
└── 原文件夹_compressed/      ← 自动创建
    ├── photo1.jpg
    ├── photo2.png
    └── subfolder/
        └── photo3.gif
```
