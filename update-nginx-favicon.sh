#!/bin/bash

# Скрипт для обновления nginx конфигурации на сервере
# и исправления конфликтующих файлов favicon

SERVER="root@5.129.194.168"
PROJECT_DIR="/var/www/ogfoody"

echo "🔧 Обновление nginx конфигурации для favicon..."
echo "=========================================="
echo ""

ssh $SERVER << 'ENDSSH'
set -e

PROJECT_DIR="/var/www/ogfoody"

echo ""
echo "📂 Переход в директорию проекта..."
cd $PROJECT_DIR

echo ""
echo "🗑️  Удаление конфликтующих файлов favicon из app/..."
rm -f app/favicon.ico app/icon.png app/apple-icon.png 2>/dev/null || true
echo "✅ Файлы удалены"

echo ""
echo "📥 Обновление кода из git..."
git fetch origin
git reset --hard origin/main

echo ""
echo "📋 Копирование nginx конфигурации..."
cp nginx-ogfoody.conf /etc/nginx/sites-available/ogfoody.conf

echo ""
echo "🔍 Проверка конфигурации nginx..."
nginx -t

if [ $? -eq 0 ]; then
    echo ""
    echo "🔄 Перезагрузка nginx..."
    systemctl reload nginx
    echo "✅ Nginx перезагружен"
else
    echo "❌ Ошибка в конфигурации nginx!"
    exit 1
fi

echo ""
echo "✅ Обновление завершено!"
ENDSSH

echo ""
echo "=========================================="
echo "🎉 Nginx обновлен, favicon должен обновиться!"
echo ""
echo "📝 Проверьте:"
echo "   1. Откройте https://ogfoody.ru"
echo "   2. Очистите кеш браузера (Ctrl+Shift+R)"
echo "   3. Проверьте favicon в вкладке"
echo ""
