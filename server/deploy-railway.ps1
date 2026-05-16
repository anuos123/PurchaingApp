# 采购系统后端部署到 Railway 的脚本
# 作者：你的名字
# 日期：2026-05-16

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  采购系统后端 - Railway 部署脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js 环境
Write-Host "[1/6] 检查 Node.js 环境..." -ForegroundColor Yellow
try {
  $nodeVersion = node -v
  $npmVersion = npm -v
  Write-Host "    ✓ Node.js: $nodeVersion" -ForegroundColor Green
  Write-Host "    ✓ npm: $npmVersion" -ForegroundColor Green
} catch {
  Write-Host "    ✗ Node.js 未安装或不在 PATH 中" -ForegroundColor Red
  Write-Host "    请先安装 Node.js: https://nodejs.org" -ForegroundColor Red
  exit 1
}

# 检查是否安装 Railway CLI
Write-Host ""
Write-Host "[2/6] 检查 Railway CLI..." -ForegroundColor Yellow
try {
  $railwayVersion = railway version 2>$null
  Write-Host "    ✓ Railway CLI: $railwayVersion" -ForegroundColor Green
} catch {
  Write-Host "    ⚠ Railway CLI 未安装" -ForegroundColor Yellow
  Write-Host ""
  Write-Host "    正在安装 Railway CLI..." -ForegroundColor Cyan
  Write-Host "    方式一 (推荐): winget install Railway.RailwayCLI" -ForegroundColor White
  Write-Host "    方式二 (npm): npm install -g @railway/cli" -ForegroundColor White
  Write-Host "    方式三 (手动): 访问 https://railway.app/docs/cli/install" -ForegroundColor White
  Write-Host ""
  Write-Host "    安装完成后，请重新运行此脚本" -ForegroundColor Yellow
  exit 0
}

# 检查是否登录 Railway
Write-Host ""
Write-Host "[3/6] 检查 Railway 登录状态..." -ForegroundColor Yellow
try {
  # 尝试获取当前用户，如果失败则提示登录
  $railwayUser = railway whoami 2>$null
  Write-Host "    ✓ 已登录: $railwayUser" -ForegroundColor Green
} catch {
  Write-Host "    ⚠ 未登录 Railway" -ForegroundColor Yellow
  Write-Host ""
  Write-Host "    正在打开浏览器进行登录..." -ForegroundColor Cyan
  railway login
  if ($LASTEXITCODE -ne 0) {
    Write-Host "    ✗ 登录失败，请重试" -ForegroundColor Red
    exit 1
  }
}

# 检查项目是否已关联
Write-Host ""
Write-Host "[4/6] 检查 Railway 项目关联..." -ForegroundColor Yellow
try {
  $railwayStatus = railway status 2>$null
  if ($LASTEXITCODE -eq 0) {
    Write-Host "    ✓ 项目已关联" -ForegroundColor Green
    Write-Host "    $railwayStatus" -ForegroundColor Gray
  } else {
    Write-Host "    ⚠ 项目未关联" -ForegroundColor Yellow
    Write-Host ""
    $choice = Read-Host "    是否要初始化新项目? (Y/n)"
    if ($choice -eq "" -or $choice -eq "Y" -or $choice -eq "y") {
      Write-Host ""
      Write-Host "    正在初始化新项目..." -ForegroundColor Cyan
      railway init
      if ($LASTEXITCODE -ne 0) {
        Write-Host "    ✗ 初始化失败" -ForegroundColor Red
        exit 1
      }
    } else {
      Write-Host "    请在 https://railway.app/new 创建项目后，运行 'railway link' 关联" -ForegroundColor Yellow
      exit 0
    }
  }
} catch {
  Write-Host "    ⚠ 检查项目状态时出错" -ForegroundColor Yellow
}

# 检查并添加环境变量
Write-Host ""
Write-Host "[5/6] 配置环境变量..." -ForegroundColor Yellow
$envVariables = @(
  @{ key = "PORT"; value = "3000" },
  @{ key = "MONGODB_URI"; value = "" },
  @{ key = "JWT_SECRET"; value = "e59adccec84a8ababb1d97f64719deea966e622848deb24891af712ea0225007" },
  @{ key = "JWT_EXPIRE"; value = "7d" }
)

# 读取本地 .env 文件获取 MongoDB URI
if (Test-Path ".env") {
  Write-Host "    ✓ 找到 .env 文件，读取 MongoDB 连接字符串..." -ForegroundColor Green
  $envFile = Get-Content ".env"
  foreach ($line in $envFile) {
    if ($line -match "^MONGODB_URI=(.*)$") {
      $envVariables[1].value = $matches[1].Trim()
      Write-Host "    ✓ 已获取 MongoDB URI" -ForegroundColor Green
    }
  }
}

# 设置环境变量到 Railway
foreach ($envVar in $envVariables) {
  if ($envVar.value -ne "") {
    Write-Host "    设置 $($envVar.key)..." -ForegroundColor Gray
    # 直接通过命令行设置环境变量
    railway variables set $($envVar.key) $($envVar.value) 2>$null
    Write-Host "      ✓ 已设置" -ForegroundColor Green
  }
}

# 部署项目
Write-Host ""
Write-Host "[6/6] 开始部署项目..." -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "    确认要部署到 Railway? (Y/n)"
if ($confirm -ne "" -and $confirm -ne "Y" -and $confirm -ne "y") {
  Write-Host "    部署已取消" -ForegroundColor Red
  exit 0
}

Write-Host ""
Write-Host "    正在上传和构建..." -ForegroundColor Cyan
Write-Host "    这可能需要几分钟时间，请耐心等待..." -ForegroundColor Gray
Write-Host ""

railway up

if ($LASTEXITCODE -eq 0) {
  Write-Host ""
  Write-Host "========================================" -ForegroundColor Green
  Write-Host "  ✓ 部署成功!" -ForegroundColor Green
  Write-Host "========================================" -ForegroundColor Green
  Write-Host ""
  Write-Host "  获取部署地址请运行:" -ForegroundColor Cyan
  Write-Host "    railway domain" -ForegroundColor White
  Write-Host ""
  Write-Host "  查看日志请运行:" -ForegroundColor Cyan
  Write-Host "    railway logs" -ForegroundColor White
  Write-Host ""
} else {
  Write-Host ""
  Write-Host "✗ 部署失败，请检查错误信息" -ForegroundColor Red
  exit 1
}
