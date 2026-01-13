#!/bin/bash
# Скрипт деплоя исправления viewport на production
# Bug #8: Неверное масштабирование на iPhone

set -e

echo "🚀 Деплой исправления viewport на ogfoody.ru"
echo "=============================================="
echo ""

/usr/bin/expect << 'EOF'
set timeout 180
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

puts "📂 Переходим в директорию проекта..."
send "cd /var/www/ogfoody\r"
expect "# "

puts "📥 Загружаем изменения с GitHub..."
send "git pull origin main\r"
expect {
    "Already up to date" {
        puts "⚠️  Код уже актуален"
    }
    "Updating" {
        puts "✅ Изменения загружены"
    }
}
expect "# "

puts "📋 Последний коммит:"
send "git log -1 --oneline\r"
expect "# "

puts "\n🔨 Сборка проекта (это займет ~15 секунд)..."
send "npm run build 2>&1 | grep -E '(Compiled|Ready|Error|✓)'\r"
expect "# " timeout 180

puts "\n🔄 Перезапуск PM2..."
send "pm2 restart ogfoody\r"
expect "# "

puts "\n⏳ Ждем запуска сервера..."
send "sleep 3\r"
expect "# "

puts "\n📊 Статус PM2:"
send "pm2 list | grep ogfoody\r"
expect "# "

puts "\n🔍 Проверка работы сервера..."
send "curl -s -o /dev/null -w 'HTTP Status: %{http_code}\\n' http://localhost:3000\r"
expect "# "

puts "\n✅ Деплой завершен!"
send "exit\r"
expect eof
EOF

echo ""
echo "=============================================="
echo "🎉 Деплой завершен!"
echo ""
echo "Проверьте сайт на iPhone:"
echo "  1. Откройте https://ogfoody.ru в Safari"
echo "  2. Масштаб должен быть 1:1 (без увеличения)"
echo "  3. Пинч-зум должен быть отключен"
echo ""
echo "Если нужны логи:"
echo "  ssh root@5.129.194.168"
echo "  pm2 logs ogfoody --lines 50"
echo ""

