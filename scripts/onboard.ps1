# n8n-auto onboarding script for Windows
# Usage: .\scripts\onboard.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 n8n-auto Project Onboarding" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green
Write-Host ""

# Check prerequisites
Write-Host "✓ Checking prerequisites..." -ForegroundColor Cyan

$missing = @()

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    $missing += "Docker (https://docs.docker.com/get-docker/)"
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    $missing += "Git (https://git-scm.com/)"
}

if (-not (Get-Command op -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️  1Password CLI not found. Installing..." -ForegroundColor Yellow
    winget install 1password-cli
    # Refresh PATH
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}

if ($missing.Count -gt 0) {
    Write-Host "❌ Missing prerequisites:" -ForegroundColor Red
    foreach ($item in $missing) {
        Write-Host "   - $item" -ForegroundColor Red
    }
    exit 1
}

Write-Host "✅ All prerequisites found" -ForegroundColor Green
Write-Host ""

# Setup 1Password
Write-Host "🔐 Setting up 1Password..." -ForegroundColor Cyan

try {
    $null = op account get 2>$null
    Write-Host "✅ 1Password CLI already authenticated" -ForegroundColor Green
} catch {
    Write-Host "Please authenticate with 1Password:" -ForegroundColor Yellow
    op account add
}

# Check if Programing vault exists
try {
    $null = op vault get Programing 2>$null
    Write-Host "✅ Vault exists: Programing" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Programing vault not found. This vault should be shared via your organization." -ForegroundColor Yellow
    Write-Host "To create a personal vault for development:" -ForegroundColor Yellow
    Write-Host "  op vault create n8n-auto-dev --allow-admins-to-manage-additional-vaults" -ForegroundColor Yellow
}

Write-Host ""

# Setup environment
Write-Host "🔧 Setting up environment..." -ForegroundColor Cyan

if (Test-Path ".env") {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
} else {
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created (please review and update passwords)" -ForegroundColor Green
}

Write-Host ""

# Docker setup
Write-Host "🐳 Checking Docker..." -ForegroundColor Cyan

try {
    $null = docker ps 2>$null
    Write-Host "✅ Docker daemon is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker daemon not running. Please start Docker and try again." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Initialize n8n
Write-Host "🎯 Initializing n8n..." -ForegroundColor Cyan

try {
    $null = docker compose config 2>$null
    Write-Host "✅ docker-compose.yml is valid" -ForegroundColor Green
} catch {
    Write-Host "❌ docker-compose.yml has errors" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Onboarding Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Review .env and update passwords: notepad .env"
Write-Host "2. Start n8n: docker compose up -d"
Write-Host "3. Access n8n: http://localhost:5678"
Write-Host "4. Read the agents guide: docs/AGENTS_GUIDE.md"
Write-Host ""
Write-Host "For help:" -ForegroundColor Yellow
Write-Host "- Agents guide: docs/AGENTS_GUIDE.md"
Write-Host "- 1Password setup: docs/1PASSWORD_SETUP.md"
Write-Host "- Secrets manager: docs/SECRETS_MANAGER.md"
