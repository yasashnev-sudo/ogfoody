#!/bin/bash

# Скрипт для ручного деплоя на ogfoody.ru
# Используйте когда нужно задеплоить без git push
# Использование: ./deploy-manual.sh

set -e

echo "🚀 Ручной деплой на ogfoody.ru"
echo "================================"

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Конфигурация
SERVER_HOST="5.129.194.168"
SERVER_USER="root"
SERVER_PATH="/var/www/ogfoody"
PROJECT_NAME="ogfoody"

# Проверка что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Ошибка: package.json не найден${NC}"
    echo "Запустите скрипт из корневой директории проекта"
    exit 1
fi

# Проверка что есть незакоммиченные изменения
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  У вас есть незакоммиченные изменения${NC}"
    read -p "Продолжить? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Сборка проекта локально
echo -e "${GREEN}📦 Установка зависимостей...${NC}"
npm install

echo -e "${GREEN}🏗️  Сборка проекта...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка при сборке проекта${NC}"
    exit 1
fi

# Создание архива (исключаем ненужные файлы)
echo -e "${GREEN}📦 Создание архива...${NC}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ARCHIVE_NAME="ogfoody_${TIMESTAMP}.tar.gz"

tar --exclude='node_modules' \
    --exclude='.git' \
    --exclude='.next/cache' \
    --exclude='*.log' \
    --exclude='.env*.local' \
    --exclude='debug_reports' \
    --exclude='test-results' \
    --exclude='playwright-report' \
    -czf "/tmp/${ARCHIVE_NAME}" .

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка при создании архива${NC}"
    exit 1
fi

echo -e "${GREEN}📤 Загрузка на сервер...${NC}"
scp "/tmp/${ARCHIVE_NAME}" "${SERVER_USER}@${SERVER_HOST}:/tmp/"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка при загрузке на сервер${NC}"
    rm "/tmp/${ARCHIVE_NAME}"
    exit 1
fi

# Деплой на сервере
echo -e "${GREEN}🔄 Деплой на сервере...${NC}"
ssh "${SERVER_USER}@${SERVER_HOST}" << EOF
set -e

echo "🔄 Начинаем деплой..."

# Переходим в директорию проекта
cd ${SERVER_PATH}

# Создаем бэкап
echo "💾 Создание бэкапа..."
mkdir -p ../backups
tar -czf ../backups/ogfoody_backup_${TIMESTAMP}.tar.gz \
    --exclude=node_modules \
    --exclude=.next \
    . 2>/dev/null || true

# Сохраняем .env файлы
cp .env.production .env.production.backup 2>/dev/null || true
cp .env.local .env.local.backup 2>/dev/null || true

# Распаковываем новую версию
echo "📦 Распаковка новой версии..."
tar -xzf /tmp/${ARCHIVE_NAME}

# Восстанавливаем .env файлы
mv .env.production.backup .env.production 2>/dev/null || true
mv .env.local.backup .env.local 2>/dev/null || true

# Устанавливаем зависимости
echo "📦 Установка зависимостей..."
npm ci --production=false

# Перезапускаем приложение
echo "🔄 Перезапуск приложения..."
pm2 restart ${PROJECT_NAME} || pm2 start ecosystem.config.js

# Проверяем статус
echo "✅ Проверка статуса..."
pm2 status ${PROJECT_NAME}

# Очистка
rm /tmp/${ARCHIVE_NAME}

# Удаляем старые бэкапы (оставляем последние 5)
echo "🧹 Очистка старых бэкапов..."
cd ../backups
ls -t ogfoody_backup_*.tar.gz | tail -n +6 | xargs -r rm

echo "🎉 Деплой завершен успешно!"
EOF

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка при деплое на сервере${NC}"
    rm "/tmp/${ARCHIVE_NAME}"
    exit 1
fi

# Очистка локального архива
rm "/tmp/${ARCHIVE_NAME}"

echo ""
echo -e "${GREEN}✅ Деплой на ogfoody.ru завершен успешно!${NC}"
echo ""
echo "Проверьте сайт: https://ogfoody.ru"
echo "Логи: ssh ${SERVER_USER}@${SERVER_HOST} 'pm2 logs ${PROJECT_NAME}'"
echo ""

