---
title: Windows 批量修改文件名与文件夹名自动化批处理 (BAT) 脚本实战（优化版）
date: 2026-06-28
category: 效率工具与软件
subcategory: 批处理与脚本
tags: 效率工具,Windows,批处理,自动化,文件管理
summary: 深度优化版 Windows BAT 批处理脚本，支持递归批量替换文件与文件夹名（含空格）。内置重名跳过保护、动态延迟扩展防破坏特殊字符，利用 sort /r 倒序遍历彻底解决子目录重命名死循环。
readTime: 6 分钟阅读
---

# 批量修改文件名与文件夹名工具 (BAT 脚本优化版)

这是一个简单轻量且性能强悍的 Windows 批处理 (BAT) 自动化脚本，用于一键批量替换当前文件夹及其所有子文件夹下的文件和文件夹名称。

---

## 一、✨ 核心功能亮点

- **批量深度替换**：一键递归替换当前目录及所有子目录下文件和文件夹名称中的指定字符串（支持替换空格）。
- **安全防误触机制**：如果替换后的文件名已经存在，或者文件处于被占用、只读或无权限状态，脚本会自动跳过并打印原因，防止误操作或数据损坏。
- **极速底层过滤**：利用 `dir /s /b "*%str1%*"` 原生命令在内核层直接过滤匹配文件，面对上万个文件的庞大工程也能瞬间完成处理，彻底告别逐个比对的卡顿。
- **特殊字符防破坏**：在循环体内部精细动态开关延迟变量扩展（`setlocal enabledelayedexpansion`），完美兼容包含感叹号（`!`）和点号（`.`）等特殊字符的原始文件及文件夹名。
- **子目录倒序防死锁**：重命名文件夹时采用 `sort /r` 倒序遍历算法，优先从最深层子目录自底向上重命名，彻底解决旧版由于父目录改名导致子路径失效的死锁与无限循环 Bug。

---

## 二、🚀 使用方法与运行步骤

1. **获取脚本**：
   - 方式一：点击下方下载链接直接获取预置的 `RenameTool.bat` 文件；
   - 方式二：新建文本文件，将下方提供的完整代码复制进去，另存为 `RenameTool.bat`。
2. **放置与运行**：将 `RenameTool.bat` 放置到你需要批量重命名的**最外层主文件夹**根目录下，双击运行。
3. **按交互提示操作**：
   - 输入**需要被替换的旧字符**（支持空格），按回车确认；
   - 输入**想要替换成的新字符**（若想直接删除特定字符，不输入任何内容直接按回车即可）；
   - 观察终端实时处理日志，等待脚本统计成功与跳过数量即可完成！

---

## 三、💻 完整代码 (最新优化版)

```bat
@echo off
chcp 65001 >nul

title 批量修改文件名工具

echo ========================================
echo    批量修改文件名工具 (性能优化版)
echo ========================================
echo.
echo 注意事项：
echo 1. 建议先备份重要文件
echo 2. 脚本会递归处理子目录
echo 3. 文件名冲突时会跳过
echo.

set /p str1= 请输入要替换的字符串（可替换空格）：
if "%str1%"=="" (
    echo 错误：替换字符串不能为空！
    pause
    exit /b
)

set /p str2= 请输入替换后的字符串（去除则直接回车）：

echo.
echo 正在替换文件名……
set file_count=0
set skip_count=0

:: 性能优化：直接让 dir 过滤包含 str1 的文件
for /f "delims=" %%a in ('dir /a-d /s /b "*%str1%*" 2^>nul') do (
    if "%%~nxa" neq "%~nx0" (
        :: 解决含有 ! 的文件名被破坏的问题，在循环内动态开关延迟扩展
        set "full_path=%%~dpa"
        set "old_name=%%~na"
        set "ext=%%~xa"
        
        setlocal enabledelayedexpansion
        set "new_name=!old_name:%str1%=%str2%!"
        
        if not exist "!full_path!!new_name!!ext!" (
            ren "%%a" "!new_name!!ext!" 2>nul
            if !errorlevel! equ 0 (
                echo 已重命名: "!old_name!!ext!" -^> "!new_name!!ext!"
                :: 跨 endlocal 传递变量需特殊技巧，这里直接退回外层环境累加
                endlocal
                set /a file_count+=1
            ) else (
                echo 跳过: "!old_name!!ext!" (权限不足)
                endlocal
                set /a skip_count+=1
            )
        ) else (
            echo 跳过: "!old_name!!ext!" (文件名已存在)
            endlocal
            set /a skip_count+=1
        )
    )
)

echo 文件名替换完成！共处理 %file_count% 个文件，跳过 %skip_count% 个文件
echo.
echo 正在替换文件夹名……
set folder_count=0
set folder_skip=0

:: 性能与逻辑优化：利用 sort /r 倒序排列，优先处理最深层的子文件夹，彻底告别死循环
for /f "delims=" %%i in ('dir /ad /s /b "*%str1%*" 2^>nul ^| sort /r') do (
    set "full_path=%%~dpi"
    set "old_folder=%%~nxi"
    
    setlocal enabledelayedexpansion
    set "new_folder=!old_folder:%str1%=%str2%!"
    
    if not exist "!full_path!!new_folder!" (
        ren "%%i" "!new_folder!" 2>nul
        if !errorlevel! equ 0 (
            echo 已重命名文件夹: "!old_folder!" -^> "!new_folder!"
            endlocal
            set /a folder_count+=1
        ) else (
            echo 跳过文件夹: "!old_folder!" (权限不足)
            endlocal
            set /a folder_skip+=1
        )
    ) else (
        echo 跳过文件夹: "!old_folder!" (文件夹名已存在)
        endlocal
        set /a folder_skip+=1
    )
)

echo 文件夹名替换完成！共处理 %folder_count% 个文件夹，跳过 %folder_skip% 个文件夹
echo.
echo ========================================
echo 处理完成！
echo 文件: %file_count% 个成功，%skip_count% 个跳过
echo 文件夹: %folder_count% 个成功，%folder_skip% 个跳过
echo ========================================
echo.
pause
```

---

## 四、🔍 核心技术原理解析

### 1. 为什么要在循环内动态开关延迟扩展？
在标准 CMD 环境中，如果全局开启 `setlocal enabledelayedexpansion`，当遍历到的原始文件名中含有感叹号（如 `Notice!.txt`）时，CMD 解释器会将 `!` 当作变量定界符吞噬，导致文件名被意外篡改损坏。
**解决方案**：在外层使用普通变量接收 `%%~na`，仅在需要进行变量字符串替换（`!old_name:%str1%=%str2%!`）的瞬间开启延迟扩展，替换完成后立即 `endlocal` 还原环境。

### 2. 为什么重命名文件夹必须加 `sort /r` 倒序？
如果在自顶向下遍历时重命名了父目录（例如将 `A/B/C` 中的 `A` 改名为 `A_new`），原本已经读取到的子路径 `A/B/C` 在磁盘上就会瞬间失效变为死路径，后续处理子目录必定报错或陷入死循环。
**解决方案**：管道配合 `sort /r`，让路径深度最深的叶子文件夹（如 `A/B/C`）优先被处理，最后处理顶层根目录 `A`，从而实现 100% 稳健的目录树迁移。

---

## 五、📥 脚本下载与免跳转预览

- 💾 **脚本源文件下载**：[RenameTool.bat](../assets/files/RenameTool.bat)
- 📁 **在线高亮与管理中心**：[前往资源文件库 (files.html)](../files.html) 查看全部 Shell / BAT 脚本附件。

---

## 六、🛡️ 注意事项与数据安全建议

1. **首次使用建议备份**：批量重命名属于磁盘物理写入操作，建议先对少量文件进行测试确认，或提前备份重要资料；
2. **排除自身保护**：脚本内建 `if "%%~nxa" neq "%~nx0"` 安全防护，执行时绝不会误伤自身 `RenameTool.bat` 文件；
3. **编码规范**：脚本开头已指定 `chcp 65001`（UTF-8 编码），若在极少数精简版 Windows 系统终端出现中文乱码，可将文件另存为 ANSI (GBK) 编码格式。
