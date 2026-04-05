#!/usr/bin/env bash
# n8n-auto onboarding script
# Usage: ./scripts/onboard.sh

set -euo pipefail

echo "🚀 n8n-auto Project Onboarding"
echo "=============================="
echo ""

# Check prerequisites
echo "✓ Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Install from https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo "❌ Git not found. Install from https://git-scm.com/"
    exit 1
fi

if ! command -v op &> /dev/null; then
    echo "⚠️  1Password CLI not found. Installing..."
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        winget install 1password-cli
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install 1password-cli
    else
        echo "Please install 1Password CLI from https://developer.1password.com/docs/cli"
        exit 1
    fi
fi

echo "✅ All prerequisites found"
echo ""

# Setup 1Password
echo "🔐 Setting up 1Password..."

if op account get > /dev/null 2>&1; then
    echo "✅ 1Password CLI already authenticated"
else
    echo "Please authenticate with 1Password:"
    op account add
fi

# Check if Programing vault exists
if op vault get Programing > /dev/null 2>&1; then
    echo "✅ Vault exists: Programing"
else
    echo "⚠️  Programing vault not found. This vault should be shared via your organization."
    echo "To create a personal vault for development:"
    echo "  op vault create n8n-auto-dev --allow-admins-to-manage-additional-vaults"
fi

echo ""

# Setup environment
echo "🔧 Setting up environment..."

if [ -f ".env" ]; then
    echo "✅ .env file already exists"
else
    cp .env.example .env
    echo "✅ .env file created (please review and update passwords)"
fi

echo ""

# Docker setup
echo "🐳 Checking Docker..."

if docker ps > /dev/null 2>&1; then
    echo "✅ Docker daemon is running"
else
    echo "❌ Docker daemon not running. Please start Docker and try again."
    exit 1
fi

echo ""

# Initialize n8n
echo "🎯 Initializing n8n..."

if docker compose config > /dev/null 2>&1; then
    echo "✅ docker-compose.yml is valid"
else
    echo "❌ docker-compose.yml has errors"
    exit 1
fi

echo ""
echo "✅ Onboarding Complete!"
echo ""
echo "Next steps:"
echo "1. Review .env and update passwords: nano .env"
echo "2. Start n8n: docker compose up -d"
echo "3. Access n8n: http://localhost:5678"
echo "4. Read the agents guide: docs/AGENTS_GUIDE.md"
echo ""
echo "For help:"
echo "- Agents guide: docs/AGENTS_GUIDE.md"
echo "- 1Password setup: docs/1PASSWORD_SETUP.md"
echo "- Secrets manager: docs/SECRETS_MANAGER.md"
