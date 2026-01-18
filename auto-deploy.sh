#!/bin/bash
# Автоматический деплой: коммит, пуш и деплой на сервер
# Использование: ./auto-deploy.sh "описание изменений"

set -e  # Остановка при ошибке

cd "/Users/sergejasasnev/Downloads/my-project (1)"

# Получаем описание изменений из аргумента или используем дефолтное
COMMIT_MESSAGE="${1:-fix: автоматический деплой изменений}"

echo "🚀 === АВТОМАТИЧЕСКИЙ ДЕПЛОЙ ==="
echo ""

# Шаг 1: Проверка статуса Git
echo "📋 === Шаг 1: Проверка изменений ==="
git status --short
CHANGES=$(git status --short | wc -l | tr -d ' ')

if [ "$CHANGES" -eq 0 ]; then
    echo "⚠️ Нет изменений для коммита"
    echo ""
else
    echo "✅ Найдено изменений: $CHANGES"
    echo ""
    
    # Шаг 2: Добавление всех изменений
    echo "📦 === Шаг 2: Добавление изменений ==="
    git add -A
    echo "✅ Изменения добавлены"
    echo ""
    
    # Шаг 3: Коммит
    echo "💾 === Шаг 3: Создание коммита ==="
    git commit -m "$COMMIT_MESSAGE" || {
        echo "⚠️ Коммит не создан (возможно, нет изменений или уже закоммичено)"
    }
    echo ""
    
    # Шаг 4: Пуш в GitHub
    echo "📤 === Шаг 4: Отправка в GitHub ==="
    git push origin main || {
        echo "❌ Ошибка при push в GitHub"
        exit 1
    }
    echo "✅ Изменения отправлены в GitHub"
    echo ""
fi

# Шаг 5: Деплой на сервер
echo "🚀 === Шаг 5: Деплой на сервер ==="
echo "Подключение к серверу..."
echo ""

# Используем expect для автоматического деплоя
/usr/bin/expect << 'EXPECT_SCRIPT'
set timeout 300

spawn ssh root@5.129.194.168

expect {
    "password:" {
        send "pULRoAvF@P-@4Y\r"
        exp_continue
    }
    "yes/no" {
        send "yes\r"
        exp_continue
    }
    "root@" {
        # Определяем директорию проекта
        send "cd /root/my-project 2>/dev/null || cd /var/www/ogfoody\r"
        expect "root@"
        
        send "echo '=== Step 1/7: Pulling latest code ==='\r"
        expect "root@"
        send "git fetch origin\r"
        expect "root@"
        send "git reset --hard origin/main 2>/dev/null || git reset --hard origin/master\r"
        expect "root@"
        
        send "echo '=== Step 2/7: Installing dependencies ==='\r"
        expect "root@"
        send "npm install --production=false\r"
        expect "root@"
        
        send "echo '=== Step 3/7: Stopping application ==='\r"
        expect "root@"
        send "pm2 stop all 2>/dev/null || true\r"
        expect "root@"
        send "sleep 2\r"
        expect "root@"
        
        send "echo '=== Step 4/7: Building project ==='\r"
        expect "root@"
        send "npm run build\r"
        expect {
            -timeout 180
            "Compiled successfully" {
                expect "root@"
            }
            "Build error" {
                expect "root@"
            }
            "root@" { }
            timeout {
                send "\r"
                expect "root@"
            }
        }
        
        send "echo '=== Step 5/7: Waiting for build to complete ==='\r"
        expect "root@"
        send "sleep 3\r"
        expect "root@"
        
        send "echo '=== Step 6/7: Checking build ==='\r"
        expect "root@"
        send "test -f .next/BUILD_ID && echo 'Build successful' || echo 'Build failed'\r"
        expect "root@"
        
        send "echo '=== Step 7/7: Restarting application ==='\r"
        expect "root@"
        send "pm2 delete all 2>/dev/null || true\r"
        expect "root@"
        send "pm2 start ecosystem.config.js\r"
        expect "root@"
        
        send "echo '=== Checking status ==='\r"
        expect "root@"
        send "pm2 status\r"
        expect "root@"
        
        send "echo '=== Verifying code update ==='\r"
        expect "root@"
        send "grep 'shouldUseRedirect' components/payment-modal.tsx | head -1\r"
        expect "root@"
        
        send "echo '=== DEPLOYMENT COMPLETED ==='\r"
        expect "root@"
        send "exit\r"
    }
}

expect eof
EXPECT_SCRIPT

echo ""
echo "✅ === ДЕПЛОЙ ЗАВЕРШЕН ==="
echo ""
echo "Проверьте сайт: https://ogfoody.ru"
echo "Проверьте логи: pm2 logs ogfoody --lines 50"
