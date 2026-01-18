#!/bin/bash
# Финальный скрипт деплоя

set -e

cd "/Users/sergejasasnev/Downloads/my-project (1)"

echo "=== Шаг 1: Git commit и push ==="
git add components/payment-modal.tsx app/api/payments/yookassa/create/route.ts
git commit -m "Исправлены ошибки виджета YooKassa и добавлена поддержка платформ" || echo "Уже закоммичено"
git push origin main

echo ""
echo "=== Шаг 2: Деплой на сервер ==="

/usr/bin/expect << 'EXPECT_SCRIPT'
set timeout 300
spawn ssh root@5.129.194.168
expect {
    "password:" { send "pULRoAvF@P-@4Y\r"; exp_continue }
    "yes/no" { send "yes\r"; exp_continue }
    "root@" {
        send "cd /var/www/ogfoody\r"
        expect "root@"
        send "git fetch origin\r"
        expect "root@"
        send "git reset --hard origin/main\r"
        expect "root@"
        send "npm install\r"
        expect "root@"
        send "npm run build\r"
        expect "root@"
        send "pm2 restart ogfoody\r"
        expect "root@"
        send "pm2 status ogfoody\r"
        expect "root@"
        send "exit\r"
    }
}
expect eof
EXPECT_SCRIPT

echo ""
echo "=== ✅ Деплой завершен! ==="
