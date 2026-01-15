#!/bin/bash
# Скрипт проверки логов и дебаг отчетов на сервере

echo "🔍 Проверка логов и дебаг отчетов на сервере"
echo "=============================================="
echo ""

/usr/bin/expect << 'EOF'
set timeout 60
log_user 1

puts "📡 Подключаемся к серверу 5.129.194.168..."
spawn ssh -o StrictHostKeyChecking=no root@5.129.194.168

expect {
    "password:" {
        send "pULRoAvF@P-@4Y\r"
    }
    timeout {
        puts "\n❌ Не удалось подключиться к серверу"
        exit 1
    }
}

expect "# "
puts "✅ Подключено к серверу\n"

send "cd /var/www/ogfoody\r"
expect "# "

puts "📊 Проверка 1: Статус PM2"
send "pm2 status ogfoody\r"
expect "# "

puts "\n📋 Проверка 2: Последние ошибки PM2 (50 строк)"
send "pm2 logs ogfoody --err --lines 50 --nostream 2>&1\r"
expect "# "

puts "\n📋 Проверка 3: Последние логи PM2 (30 строк)"
send "pm2 logs ogfoody --lines 30 --nostream 2>&1 | tail -30\r"
expect "# "

puts "\n🐞 Проверка 4: Дебаг отчеты"
send "test -d debug_reports && echo '✅ Папка debug_reports существует' || echo '❌ Папка debug_reports НЕ существует'\r"
expect "# "

send "test -f debug_reports/index.json && echo '✅ index.json существует' || echo '❌ index.json НЕ существует'\r"
expect "# "

puts "\n📄 Последние 3 дебаг отчета из index.json:"
send "test -f debug_reports/index.json && cat debug_reports/index.json | head -50 || echo 'index.json не найден'\r"
expect "# "

puts "\n📁 Список последних 5 дебаг файлов:"
send "ls -lht debug_reports/*.txt 2>/dev/null | head -5 || echo 'Нет дебаг файлов'\r"
expect "# "

puts "\n🔍 Проверка 5: Последний дебаг отчет (если есть)"
send "LATEST_LOG=\$(ls -t debug_reports/*_logs.txt 2>/dev/null | head -1) && if [ -n \"\$LATEST_LOG\" ]; then echo 'Последний отчет:' \$LATEST_LOG; head -100 \"\$LATEST_LOG\"; else echo 'Нет дебаг отчетов'; fi\r"
expect "# "

puts "\n🌐 Проверка 6: Работает ли сайт"
send "curl -s -o /dev/null -w 'HTTP Status: %{http_code}\\n' http://localhost:3000 || echo 'Ошибка curl'\r"
expect "# "

puts "\n✅ Проверка завершена!"
send "exit\r"
expect eof
EOF

echo ""
echo "=============================================="
echo "🎉 Проверка завершена!"
echo ""
