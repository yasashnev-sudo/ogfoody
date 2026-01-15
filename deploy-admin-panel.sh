#!/bin/bash

# Скрипт для деплоя админ-панели на сервер

set -e

echo "🚀 Деплой админ-панели на ogfoody.ru"
echo ""

# Параметры подключения
SERVER="root@5.129.194.168"
SERVER_PATH="/var/www/ogfoody"

# Проверяем что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ Запустите скрипт из корня проекта"
    exit 1
fi

# Пушим изменения в GitHub
echo "📤 Отправка изменений в GitHub..."
git push origin main

echo ""
echo "📥 Подключение к серверу и деплой..."
echo ""

# Деплой на сервер
ssh $SERVER << 'ENDSSH'
set -e

cd /var/www/ogfoody

echo "🔄 Получение последних изменений..."
git pull origin main

echo "📦 Установка зависимостей..."
npm install

echo "🏗️ Сборка проекта..."
npm run build

echo "🔄 Перезапуск приложения..."
pm2 restart ogfoody || pm2 start ecosystem.config.js

echo "✅ Деплой завершен!"
echo ""
echo "📊 Статус приложения:"
pm2 status ogfoody

echo ""
echo "📝 Следующие шаги:"
echo "1. Создайте таблицы Messages и Push_Notifications в NocoDB"
echo "2. Добавьте Table ID в .env.production:"
echo "   NOCODB_TABLE_MESSAGES=md_xxxxx"
echo "   NOCODB_TABLE_PUSH_NOTIFICATIONS=md_xxxxx"
echo "3. Перезапустите: pm2 restart ogfoody"
echo ""
echo "Или запустите скрипт настройки таблиц:"
echo "cd /var/www/ogfoody && node scripts/setup-admin-tables.js"

ENDSSH

echo ""
echo "✅ Деплой завершен!"
echo ""
echo "🌐 Админ-панель доступна по адресу: https://ogfoody.ru/admin/login"
echo "🔑 Пароль по умолчанию: admin123"
