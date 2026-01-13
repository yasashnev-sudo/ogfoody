#!/bin/bash
# Скачиваем последний отчет с production

cat > /tmp/download_report.expect << 'EOF'
#!/usr/bin/expect -f
set timeout 30

spawn ssh root@5.129.194.168

expect "password:"
send "pULRoAvF@P-@4Y\r"

expect "# "
send "cat /var/www/ogfoody/debug_reports/2026-01-13T13-18-35-739Z_user-121_logs.txt\r"

expect "# "
send "exit\r"

expect eof
EOF

chmod +x /tmp/download_report.expect
/tmp/download_report.expect > /tmp/production_report.txt
cat /tmp/production_report.txt
rm /tmp/download_report.expect /tmp/production_report.txt

