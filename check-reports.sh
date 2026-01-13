#!/bin/bash

cat > /tmp/check_reports.expect << 'EOF'
#!/usr/bin/expect -f
set timeout 30

spawn ssh root@5.129.194.168

expect "password:"
send "pULRoAvF@P-@4Y\r"

expect "# "
send "echo '=== ТЕКУЩЕЕ ВРЕМЯ НА СЕРВЕРЕ ==='\r"

expect "# "
send "date\r"

expect "# "
send "echo '\n=== СПИСОК ОТЧЕТОВ (последние 10) ==='\r"

expect "# "
send "ls -lht /var/www/ogfoody/debug_reports/*.txt 2>/dev/null | head -10\r"

expect "# "
send "echo '\n=== INDEX.JSON ==='\r"

expect "# "
send "cat /var/www/ogfoody/debug_reports/index.json 2>/dev/null\r"

expect "# "
send "exit\r"

expect eof
EOF

chmod +x /tmp/check_reports.expect
/tmp/check_reports.expect
rm /tmp/check_reports.expect

