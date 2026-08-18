---
title: Windows 批量修改文件名与字符替换批处理 (.bat) 脚本
date: 2026-06-28
category: 效率工具与软件
subcategory: 实用软件与脚本
tags: 效率工具,Windows,批处理,自动化
summary: 无需安装第三方软件，利用原生 Bat 批处理脚本一键完成指定文件夹下海量文件的前缀添加与文本替换。
readTime: 15 分钟阅读
---

# 批量修改文件名方法

## 功能说明

这是一个Windows批处理脚本，用于批量修改文件名和文件夹名，主要功能包括：

1. **批量替换文件名**：替换指定文件名中的字符串
2. **批量删除字符**：删除文件名中的指定字符（汉字、字母、数字等）
3. **支持文件夹重命名**：同时处理文件和文件夹
4. **递归处理**：自动处理子目录中的文件

## 脚本源码

```batch
@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

title 批量修改文件名工具

echo ========================================
echo    批量修改文件名工具
echo ========================================
echo.
echo 此批处理可批量替换当前文件夹下所有文件(文件夹)名。
echo.
echo 注意事项：
echo 1. 建议先备份重要文件
echo 2. 脚本会递归处理子目录
echo 3. 文件名冲突时会跳过
echo.

set /p str1= 请输入要替换的文件(文件夹)名字符串（可替换空格）：
if "%str1%"=="" (
    echo 错误：替换字符串不能为空！
    pause
    exit /b
)

set /p str2= 请输入替换后的文件(文件夹)名字符串（去除则直接回车）：

echo.
echo 正在替换文件名……
set file_count=0
set skip_count=0

for /f "delims=" %%a in ('dir /a-d /s /b 2^>nul') do (
    if "%%~nxa" neq "%~nx0" (
        set "f=%%~na"
        set "new_name=!f:%str1%=%str2%!"
        if "!new_name!" neq "%%~na" (
            if not exist "%%~dpa!new_name!%%~xa" (
                ren "%%a" "!new_name!%%~xa" 2>nul
                if !errorlevel! equ 0 (
                    echo 已重命名: "%%~nxa" -^> "!new_name!%%~xa"
                    set /a file_count+=1
                ) else (
                    echo 跳过: "%%~nxa" (权限不足)
                    set /a skip_count+=1
                )
            ) else (
                echo 跳过: "%%~nxa" (文件名已存在)
                set /a skip_count+=1
            )
        )
    )
)

echo 文件名替换完成！共处理 !file_count! 个文件，跳过 !skip_count! 个文件
echo.
echo 正在替换文件夹名……
set folder_count=0
set folder_skip=0

:folder_loop
set n=0
for /f "delims=" %%i in ('dir /ad /s /b 2^>nul ^|find "%str1%"') do (
    set "t=%%~ni"
    set "new_folder=!t:%str1%=%str2%!"
    if "!new_folder!" neq "%%~ni" (
        if not exist "%%~dpi!new_folder!" (
            ren "%%i" "!new_folder!" 2>nul
            if !errorlevel! equ 0 (
                echo 已重命名文件夹: "%%~ni" -^> "!new_folder!"
                set /a folder_count+=1
                set /a n+=1
            ) else (
                echo 跳过文件夹: "%%~ni" (权限不足)
                set /a folder_skip+=1
            )
        ) else (
            echo 跳过文件夹: "%%~ni" (文件夹名已存在)
            set /a folder_skip+=1
        )
    )
)

if "!n!" neq "0" goto folder_loop

echo 文件夹名替换完成！共处理 !folder_count! 个文件夹，跳过 !folder_skip! 个文件夹
echo.
echo ========================================
echo 处理完成！
echo 文件: !file_count! 个成功，!skip_count! 个跳过
echo 文件夹: !folder_count! 个成功，!folder_skip! 个跳过
echo ========================================
echo.
pause
```

## 使用方法

### 第一步：创建脚本文件

1. 新建一个文本文件（文件名可自定义，如 `rename_files.bat`）
2. 将上述脚本内容复制到文件中
3. 保存文件

### 第二步：修改文件后缀名

将文件后缀名从 `.txt` 改为 `.bat`

**Windows 10/11 启用文件扩展名显示：**
1. 按 `Win + E` 打开文件资源管理器
2. 点击顶部菜单栏的"查看"选项卡
3. 勾选"文件扩展名"复选框
4. 现在可以修改文件后缀名了

### 第三步：使用脚本

1. 将脚本文件放入需要修改文件名的目录中
2. 双击运行脚本文件
3. 按照提示输入：
   - **要替换的字符串**：输入原文件名中需要替换的内容
   - **替换后的字符串**：输入新的内容（直接回车表示删除）

### 第四步：查看结果

脚本会显示每个文件的修改结果和统计信息。

## 使用示例

### 示例1：批量替换文件名中的文字

```
要替换的字符串: photo
替换后的字符串: picture
```

**效果：**
- `photo_001.jpg` → `picture_001.jpg`
- `my_photo.png` → `my_picture.png`

### 示例2：批量删除文件名中的字符

```
要替换的字符串: copy
替换后的字符串: (直接回车)
```

**效果：**
- `copy_document.txt` → `_document.txt`
- `file_copy_2.doc` → `file__2.doc`

### 示例3：批量添加前缀

```
要替换的字符串: (文件名开头)
替换后的字符串: 2024_
```

**效果：**
- `document.txt` → `2024_document.txt`
- `image.jpg` → `2024_image.jpg`

## 注意事项

### ⚠️ 重要提醒

1. **备份重要文件**：在使用脚本前，建议先备份重要文件
2. **测试环境**：先在测试文件夹中试用，确认效果后再在正式文件中使用
3. **文件名冲突**：如果目标文件名已存在，脚本会跳过该文件
4. **权限问题**：某些系统文件或受保护的文件可能无法修改
5. **编码问题**：脚本已设置UTF-8编码，支持中文文件名

### 🔧 常见问题

**问题1：脚本运行后没有反应**
- 解决：确保脚本文件放在正确的目录中
- 检查是否有足够的权限修改文件

**问题2：某些文件没有被修改**
- 原因：可能是文件名冲突或权限不足
- 解决：检查文件是否被其他程序占用

**问题3：中文显示乱码**
- 原因：系统编码设置问题
- 解决：脚本已包含 `chcp 65001` 命令，如仍有问题请检查系统编码设置

**问题4：无法修改系统文件**
- 原因：权限不足
- 解决：以管理员身份运行脚本

## 高级用法

### 1. 只处理文件，不处理文件夹

修改脚本，注释掉文件夹处理部分：

```batch
REM 注释掉文件夹处理部分
REM :folder_loop
REM ...
```

### 2. 只处理特定类型的文件

修改文件处理部分，添加文件类型过滤：

```batch
for /f "delims=" %%a in ('dir /a-d /s /b *.txt *.doc *.docx 2^>nul') do (
    ...
)
```

### 3. 添加日期时间前缀

```batch
for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set mydate=%%c%%a%%b
set /p str1= 请输入要替换的字符串：
set /p str2= 请输入替换后的字符串：
set "prefix=%mydate%_"
```

## 替代方案

### PowerShell 脚本（推荐）

```powershell
# PowerShell 批量重命名脚本
$oldName = Read-Host "请输入要替换的字符串"
$newName = Read-Host "请输入替换后的字符串"

Get-ChildItem -Recurse | ForEach-Object {
    if ($_.Name -like "*$oldName*") {
        $newFileName = $_.Name -replace [regex]::Escape($oldName), $newName
        if ($_.Name -ne $newFileName -and -not (Test-Path (Join-Path $_.DirectoryName $newFileName))) {
            Rename-Item -Path $_.FullName -NewName $newFileName
            Write-Host "已重命名: $($_.Name) -> $newFileName"
        }
    }
}
```

### Python 脚本

```python
import os
import sys

def batch_rename(directory, old_str, new_str):
    count = 0
    for root, dirs, files in os.walk(directory):
        for filename in files:
            if old_str in filename:
                new_filename = filename.replace(old_str, new_str)
                old_path = os.path.join(root, filename)
                new_path = os.path.join(root, new_filename)
                
                if not os.path.exists(new_path):
                    os.rename(old_path, new_path)
                    print(f"已重命名: {filename} -> {new_filename}")
                    count += 1
    print(f"共处理 {count} 个文件")

if __name__ == "__main__":
    directory = input("请输入目录路径（当前目录请直接回车）: ") or "."
    old_str = input("请输入要替换的字符串: ")
    new_str = input("请输入替换后的字符串（删除请直接回车）: ")
    batch_rename(directory, old_str, new_str)
```

## 下载脚本

[**脚本下载地址**](../assets/files/fileNameReplaScrip.bat)

## 总结

这个批量修改文件名工具具有以下特点：

- ✅ 操作简单，适合小白用户
- ✅ 支持文件和文件夹批量重命名
- ✅ 递归处理子目录
- ✅ 支持中文字符
- ✅ 提供详细的处理反馈
- ⚠️ 建议先备份重要文件
- ⚠️ 注意文件名冲突处理

使用前请仔细阅读注意事项，确保数据安全！
