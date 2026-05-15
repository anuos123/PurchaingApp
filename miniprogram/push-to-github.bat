@echo off
chcp 65001
echo ========================================
echo   采购系统-食材端 小程序 Git推送脚本
echo ========================================
echo.

REM 检查Git是否安装
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] Git 未安装！
    echo 请先安装 Git: https://git-scm.com/download/win
    echo 安装完成后请重新运行此脚本
    pause
    exit /b 1
)

echo [检查] Git 已安装
echo.

REM 检查SSH密钥
echo [提示] 推送代码到GitHub需要配置SSH密钥或使用Personal Access Token
echo.
set /p GH_TOKEN="请输入 GitHub Personal Access Token (或按Enter跳过手动推送): "

REM 进入小程序目录
cd /d "%~dp0"

REM 初始化Git仓库（如果尚未初始化）
if not exist ".git" (
    echo [步骤] 初始化Git仓库...
    git init
    git config user.name "Your Name"
    git config user.email "your.email@example.com"
    echo.
) else (
    echo [检查] Git仓库已存在
    echo.
)

REM 添加所有文件
echo [步骤] 添加文件到暂存区...
git add .

REM 检查是否有文件变更
git status --porcelain >nul
if %errorlevel% neq 0 (
    echo [检查] 没有新的文件变更需要提交
) else (
    echo [步骤] 提交文件...
    git commit -m "feat: 采购系统-食材端微信小程序 v1.0.0
    - 食材清单管理（支持分类筛选）
    - 采购任务跟踪
    - 历史采购记录
    - 客户名单管理"
    echo.
)

REM 显示提交状态
echo ========================================
echo   提交完成！
echo ========================================
echo.
echo 接下来请手动执行以下命令推送到GitHub:
echo.
if not "%GH_TOKEN%"=="" (
    echo git remote add origin https://github.com/YOUR_USERNAME/miniprogram.git
    echo git push -u origin master
) else (
    echo 1. 创建GitHub仓库
    echo 2. 添加远程仓库:
    echo    git remote add origin https://github.com/YOUR_USERNAME/miniprogram.git
    echo 3. 推送代码:
    echo    git push -u origin master
)
echo.
pause