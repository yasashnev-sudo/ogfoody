#!/bin/bash
# Выполните этот скрипт для деплоя

cd "/Users/sergejasasnev/Downloads/my-project (1)"

echo "🚀 Начало деплоя исправлений виджета YooKassa"
echo ""

# Шаг 1: Git операции
echo "📤 Коммит и push изменений..."
git add components/payment-modal.tsx app/api/payments/yookassa/create/route.ts
git commit -m "Исправлены ошибки виджета YooKassa и добавлена поддержка платформ" || echo "Уже закоммичено"
git push origin main

echo ""
echo "📥 Деплой на сервер..."
echo "Пароль: pULRoAvF@P-@4Y"
echo ""

# Шаг 2: Деплой
expect deploy-to-production.expect

echo ""
echo "✅ Деплой завершен!"
echo "Проверьте сайт: https://ogfoody.ru"
