#!/bin/bash
# Прямой деплой на сервер с использованием expect

set -e

SERVER="root@5.129.194.168"
SERVER_PATH="/var/www/ogfoody"
PASSWORD="pULRoAvF@P-@4Y"

echo "🚀 Прямой деплой на ogfoody.ru"
echo "================================"
echo ""

# Создаем expect скрипт
cat > /tmp/deploy_direct.exp << 'EXPECT_SCRIPT'
#!/usr/bin/expect -f

set timeout 300
set server [lindex $argv 0]
set password [lindex $argv 1]

spawn ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=60 $server

expect {
    "password:" {
        send "$password\r"
        exp_continue
    }
    "Permission denied" {
        send_user "\n❌ Ошибка аутентификации\n"
        exit 1
    }
    "$ " {
        # Успешное подключение
    }
    "# " {
        # Успешное подключение (root)
    }
    timeout {
        send_user "\n❌ Таймаут подключения\n"
        exit 1
    }
}

# Команды для выполнения
send "cd /var/www/ogfoody 2>/dev/null || cd /root/my-project\r"
expect {
    "$ " { }
    "# " { }
    timeout { }
}

send "pwd\r"
expect {
    "$ " { }
    "# " { }
    timeout { }
}

send "echo '📥 Обновление кода из GitHub...'\r"
expect {
    "$ " { }
    "# " { }
    timeout { }
}

send "git fetch origin\r"
expect {
    "$ " { }
    "# " { }
    timeout { }
}

send "git reset --hard origin/main 2>/dev/null || git reset --hard origin/master\r"
expect {
    "$ " { }
    "# " { }
    timeout { }
}

send "echo '✅ Код обновлен'\r"
expect {
    "$ " { }
    "# " { }
    timeout { }
}

send "echo '📦 Установка зависимостей...'\r"
expect {
    "$ " { }
    "# " { }
    timeout { }
}

send "npm ci --production=false\r"
expect {
    "$ " { }
    "# " { }
    timeout { }
}

send "echo '✅ Зависимости установлены'\r"
expect {
    "$ " { }
    "# " { }
    timeout { }
}

send "echo '🏗️ Сборка проекта...'\r"
expect {
    "$ " { }
    "# " { }
    timeout { }
}

send "npm run build\r"
expect {
    "$ " { }
    "# " { }
    timeout { }
}

send "echo '✅ Сборка завершена'\r"
expect {
    "$ " { }
    "# " { }
    timeout { }
}

send "echo '🔄 Перезапуск приложения...'\r"
expect {
    "$ " { }
    "# " { }
    timeout { }
}

send "pm2 restart ogfoody 2>/dev/null || pm2 start ecosystem.config.js\r"
expect {
    "$ " { }
    "# " { }
    timeout { }
}

send "echo '✅ Приложение перезапущено'\r"
expect {
    "$ " { }
    "# " { }
    timeout { }
}

send "pm2 status ogfoody\r"
expect {
    "$ " { }
    "# " { }
    timeout { }
}

send "echo '🎉 Деплой успешно завершен!'\r"
expect {
    "$ " { }
    "# " { }
    timeout { }
}

send "exit\r"
expect eof

EXPECT_SCRIPT

chmod +x /tmp/deploy_direct.exp

echo "🔐 Подключение к серверу и выполнение деплоя..."
echo ""

# Запускаем expect скрипт
/tmp/deploy_direct.exp "$SERVER" "$PASSWORD"

# Удаляем временный скрипт
rm -f /tmp/deploy_direct.exp

echo ""
echo "✅ Деплой завершен!"
echo "Проверьте сайт: https://ogfoody.ru"
