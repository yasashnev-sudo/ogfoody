#!/bin/bash
# Быстрая проверка и деплой

cd "/Users/sergejasasnev/Downloads/my-project (1)"

echo "=== 1. Проверка локального кода ==="
LOCAL_COMMIT=$(git log --oneline -1)
echo "Локальный коммит: $LOCAL_COMMIT"
echo ""

echo "=== 2. Проверка наличия useWidget в коде ==="
if grep -q "useWidget" app/api/payments/yookassa/create/route.ts; then
    echo "✅ useWidget найден в коде"
else
    echo "❌ useWidget НЕ найден в коде!"
fi
echo ""

echo "=== 3. Проверка на сервере ==="
/usr/bin/expect << 'EXPECT_SCRIPT'
set timeout 60
spawn ssh root@5.129.194.168
expect {
    "password:" { send "pULRoAvF@P-@4Y\r"; exp_continue }
    "yes/no" { send "yes\r"; exp_continue }
    "root@" {
        send "cd /var/www/ogfoody 2>/dev/null || cd /root/my-project\r"
        expect "root@"
        
        send "echo '=== Server Git Commit ==='\r"
        expect "root@"
        send "git log --oneline -1\r"
        expect "root@"
        
        send "echo '=== Check useWidget ==='\r"
        expect "root@"
        send "grep -n 'useWidget' app/api/payments/yookassa/create/route.ts 2>/dev/null | head -2 || echo 'NOT FOUND'\r"
        expect "root@"
        
        send "echo '=== PM2 Status ==='\r"
        expect "root@"
        send "pm2 status\r"
        expect "root@"
        
        send "echo '=== Last 20 Payment Errors ==='\r"
        expect "root@"
        send "pm2 logs ogfoody --err --lines 100 --nostream 2>/dev/null | grep -i payment | tail -20\r"
        expect "root@"
        
        send "exit\r"
    }
}
expect eof
EXPECT_SCRIPT

echo ""
echo "=== 4. Если код не обновлен, выполним деплой ==="
read -p "Выполнить деплой? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Запуск деплоя..."
    ./deploy-increment-fix.expect
fi
