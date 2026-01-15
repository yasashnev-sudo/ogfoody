#!/bin/bash
# Автоматический деплой с использованием expect для SSH

set -e

echo "🚀 Автоматический деплой исправлений инкремента промокода"
echo "=========================================================="

# Проверяем наличие expect
if ! command -v expect &> /dev/null; then
    echo "❌ expect не установлен. Устанавливаю..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if ! command -v brew &> /dev/null; then
            echo "❌ Homebrew не установлен. Установите expect вручную: brew install expect"
            exit 1
        fi
        brew install expect
    else
        echo "❌ Установите expect: sudo apt-get install expect"
        exit 1
    fi
fi

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ Ошибка: package.json не найден. Запустите скрипт из корня проекта."
    exit 1
fi

echo ""
echo "📋 Инструкция:"
echo "Скрипт попытается подключиться к серверу через SSH."
echo "Вам будет предложено ввести пароль от сервера."
echo ""

# Создаем временный expect скрипт
cat > /tmp/deploy_expect.exp << 'EXPECT_SCRIPT'
#!/usr/bin/expect -f

set timeout 300
set server "root@5.129.194.168"
set commands {
    "cd /root/my-project 2>/dev/null || cd /var/www/ogfoody"
    "pwd"
    "git fetch origin"
    "git reset --hard origin/main 2>/dev/null || git reset --hard origin/master"
    "echo '✅ Code updated'"
    "npm install --production=false"
    "echo '✅ Dependencies installed'"
    "npm run build"
    "echo '✅ Build completed'"
    "pm2 restart all 2>/dev/null || pm2 start ecosystem.config.js"
    "echo '✅ PM2 restarted'"
    "pm2 status"
    "pm2 logs --lines 20 --nostream"
}

spawn ssh -o StrictHostKeyChecking=no $server

expect {
    "password:" {
        send_user "Введите пароль от сервера: "
        stty -echo
        expect_user -timeout 3600 -re "(.*)\n"
        stty echo
        set password $expect_out(1,string)
        send "$password\r"
        exp_continue
    }
    "Permission denied" {
        send_user "\n❌ Ошибка аутентификации. Проверьте пароль или SSH ключ.\n"
        exit 1
    }
    "$ " {
        # Успешное подключение
    }
    timeout {
        send_user "\n❌ Таймаут подключения\n"
        exit 1
    }
}

# Выполняем команды
foreach cmd $commands {
    expect "$ "
    send "$cmd\r"
    expect {
        "$ " {
            # Команда выполнена
        }
        timeout {
            send_user "\n⚠️ Таймаут выполнения команды: $cmd\n"
        }
    }
}

expect "$ "
send "exit\r"
expect eof

EXPECT_SCRIPT

chmod +x /tmp/deploy_expect.exp

echo "🔐 Подключение к серверу..."
echo ""

# Запускаем expect скрипт
/tmp/deploy_expect.exp

# Удаляем временный скрипт
rm -f /tmp/deploy_expect.exp

echo ""
echo "✅ Деплой завершен!"
echo ""
echo "🧪 Для тестирования запустите:"
echo "   npm run test:fixes:prod"
