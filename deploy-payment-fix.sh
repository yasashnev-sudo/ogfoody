#!/bin/bash
# Деплой исправлений виджета YooKassa

set -e

echo "🚀 Деплой исправлений виджета YooKassa"
echo "========================================"
echo ""

# 1. Коммит и push изменений
echo "📤 Коммит и push изменений..."
cd "/Users/sergejasasnev/Downloads/my-project (1)"
git add components/payment-modal.tsx app/api/payments/yookassa/create/route.ts
git commit -m "Исправлены ошибки виджета YooKassa и добавлена поддержка платформ" || echo "Нет изменений для коммита"
git push origin main

echo ""
echo "📥 Деплой на сервер..."
echo ""

# 2. Деплой на сервер через expect
expect << 'EOF'
set timeout 300
spawn ssh root@5.129.194.168
expect {
    "password:" {
        send "pULRoAvF@P-@4Y\r"
        exp_continue
    }
    "yes/no" {
        send "yes\r"
        exp_continue
    }
    "root@" {
        send "cd /var/www/ogfoody\r"
        expect "root@"
        
        send "echo '=== Pulling latest code ==='\r"
        expect "root@"
        send "git fetch origin\r"
        expect "root@"
        send "git reset --hard origin/main\r"
        expect "root@"
        
        send "echo '=== Installing dependencies ==='\r"
        expect "root@"
        send "npm install\r"
        expect "root@"
        
        send "echo '=== Building project ==='\r"
        expect "root@"
        send "npm run build\r"
        expect "root@"
        
        send "echo '=== Restarting application ==='\r"
        expect "root@"
        send "pm2 restart ogfoody\r"
        expect "root@"
        
        send "echo '=== Checking status ==='\r"
        expect "root@"
        send "pm2 status ogfoody\r"
        expect "root@"
        
        send "exit\r"
    }
}
expect eof
EOF

echo ""
echo "✅ Деплой завершен!"
echo "Проверьте сайт: https://ogfoody.ru"
