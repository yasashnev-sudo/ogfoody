#!/bin/bash

# 🚀 Deploy Debug System to Production
# Автоматический деплой на production сервер

set -e  # Останавливаться при ошибке

SERVER="root@5.129.194.168"
PROJECT_DIR="/root/my-project"

echo "🚀 Deploying Debug System to Production..."
echo "=========================================="
echo ""

# Проверка доступности сервера
echo "📡 Checking server availability..."
if ! ping -c 1 -W 2 5.129.194.168 > /dev/null 2>&1; then
    echo "⚠️  Server не отвечает на ping (это нормально, ping может быть отключён)"
    echo "Пробуем SSH..."
fi

# Деплой через SSH
ssh $SERVER << 'ENDSSH'
set -e

PROJECT_DIR="/root/my-project"

echo ""
echo "📂 Navigating to project directory..."
cd $PROJECT_DIR

echo ""
echo "📥 Pulling latest code from GitHub..."
git pull origin main

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔧 Creating .env.local if not exists..."
if [ ! -f .env.local ]; then
    echo "Creating .env.local..."
    cat > .env.local << 'EOF'
# Telegram уведомления для Debug системы
TELEGRAM_BOT_TOKEN=8581334096:AAG2-h00EDRFj9kXiYCf5jpRw6WQjheTpUY
TELEGRAM_CHAT_ID=163996864
EOF
    echo "✅ .env.local created"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🔨 Building project..."
npm run build

echo ""
echo "🔄 Restarting application..."
pm2 restart all || pm2 start ecosystem.config.js || pm2 start npm --name "ogfoody" -- start

echo ""
echo "📊 Checking application status..."
pm2 list

echo ""
echo "📂 Creating debug_reports directory..."
mkdir -p debug_reports
chmod 755 debug_reports

echo ""
echo "✅ Deployment completed successfully!"
ENDSSH

echo ""
echo "=========================================="
echo "🎉 Debug System deployed to production!"
echo ""
echo "📝 Next steps:"
echo "1. Open: https://t.me/myproject_debug_bot"
echo "2. Click 'Start' to activate Telegram bot"
echo "3. Test: Open your site and trigger an error"
echo "4. Check Telegram for notification! 📱"
echo ""
echo "🔍 Monitor logs:"
echo "   ssh $SERVER 'pm2 logs'"
echo ""
echo "📁 View debug reports:"
echo "   ssh $SERVER 'ls -lh /root/my-project/debug_reports/'"
echo ""

