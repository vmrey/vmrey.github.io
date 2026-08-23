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
