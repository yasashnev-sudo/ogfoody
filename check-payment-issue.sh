#!/bin/bash
# Проверка проблемы с оплатой на продакшене

echo "🔍 Проверка статуса оплаты на продакшене..."
echo ""

# Проверка последнего коммита локально
echo "=== Локальный последний коммит ==="
cd "/Users/sergejasasnev/Downloads/my-project (1)"
git log --oneline -1
echo ""

# Проверка на сервере через expect
echo "=== Проверка на сервере ==="
expect << 'EXPECT_SCRIPT'
set timeout 60
spawn ssh root@5.129.194.168
expect {
    "password:" { send "pULRoAvF@P-@4Y\r"; exp_continue }
    "yes/no" { send "yes\r"; exp_continue }
    "root@" {
        send "cd /var/www/ogfoody 2>/dev/null || cd /root/my-project\r"
        expect "root@"
        
        send "echo '=== Git Last Commit ==='\r"
        expect "root@"
        send "git log --oneline -1\r"
        expect "root@"
        
        send "echo '=== PM2 Status ==='\r"
        expect "root@"
        send "pm2 status\r"
        expect "root@"
        
        send "echo '=== Payment Errors (Last 30) ==='\r"
        expect "root@"
        send "pm2 logs ogfoody --err --lines 100 --nostream 2>/dev/null | grep -i -E '(payment|yookassa|error)' | tail -30\r"
        expect "root@"
        
        send "echo '=== Recent Payment Logs ==='\r"
        expect "root@"
        send "pm2 logs ogfoody --lines 200 --nostream 2>/dev/null | grep -i -E '(payment|yookassa|Creating|confirmation|widget)' | tail -50\r"
        expect "root@"
        
        send "echo '=== Check useWidget in code ==='\r"
        expect "root@"
        send "grep -n 'useWidget' app/api/payments/yookassa/create/route.ts 2>/dev/null | head -2 || echo 'NOT FOUND'\r"
        expect "root@"
        
        send "exit\r"
    }
}
expect eof
EXPECT_SCRIPT

echo ""
echo "✅ Проверка завершена"
