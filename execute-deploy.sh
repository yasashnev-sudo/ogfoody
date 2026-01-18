#!/bin/bash
# Скрипт деплоя по инструкции AGENT_DEPLOYMENT_GUIDE.md

set -e

cd "/Users/sergejasasnev/Downloads/my-project (1)"

echo "🚀 Начало деплоя по инструкции AGENT_DEPLOYMENT_GUIDE.md"
echo ""

# Шаг 1: Проверка сборки
echo "📦 Проверка сборки проекта..."
if npm run build > /tmp/build-check.log 2>&1; then
    echo "✅ Сборка успешна"
else
    echo "❌ Ошибка сборки. Смотрите /tmp/build-check.log"
    exit 1
fi

# Шаг 2: Git операции
echo ""
echo "📤 Коммит и push изменений..."
git add -A
git commit -m "fix: исправлены ошибки виджета YooKassa и добавлена поддержка платформ" || echo "Уже закоммичено"
git push origin main

echo ""
echo "📥 Запуск деплоя на сервер..."
echo "Используется скрипт: deploy-increment-fix.expect"
echo ""

# Шаг 3: Деплой
chmod +x deploy-increment-fix.expect
./deploy-increment-fix.expect

echo ""
echo "✅ Деплой завершен!"
echo ""
echo "🔍 Проверка статуса..."
sleep 2

# Проверка статуса
expect check-deploy.expect

echo ""
echo "🌐 Проверка сайта..."
curl -I https://ogfoody.ru 2>&1 | head -3

echo ""
echo "✅ Все проверки завершены!"
