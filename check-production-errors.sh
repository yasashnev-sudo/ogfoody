#!/bin/bash
# Скрипт для подключения к production и проверки ошибок

echo "🔐 Подключаемся к production серверу..."
echo ""

# Создаем временный expect скрипт
cat > /tmp/check_errors.expect << 'EOF'
#!/usr/bin/expect -f
set timeout 30

spawn ssh root@5.129.194.168

expect {
    "password:" {
        send "pULRoAvF@P-@4Y\r"
        exp_continue
    }
    "# " {
        # Проверяем debug_reports
        send "echo '=== DEBUG REPORTS ==='\r"
        expect "# "
        
        send "ls -lah /var/www/ogfoody/debug_reports/ 2>/dev/null || echo 'Directory not found'\r"
        expect "# "
        
        send "echo '\n=== INDEX.JSON ==='\r"
        expect "# "
        
        send "cat /var/www/ogfoody/debug_reports/index.json 2>/dev/null | head -50 || echo 'No index.json'\r"
        expect "# "
        
        send "echo '\n=== PM2 LOGS (последние 100 строк) ==='\r"
        expect "# "
        
        send "pm2 logs ogfoody --lines 100 --nostream 2>&1 | tail -100\r"
        expect "# "
        
        send "echo '\n=== ERROR LOG (последние 50 строк) ==='\r"
        expect "# "
        
        send "tail -50 /var/www/ogfoody/logs/err.log 2>/dev/null || echo 'No error log'\r"
        expect "# "
        
        send "exit\r"
    }
}

expect eof
EOF

chmod +x /tmp/check_errors.expect
/tmp/check_errors.expect
rm /tmp/check_errors.expect

