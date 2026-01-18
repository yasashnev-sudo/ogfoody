#!/bin/bash

# Скрипт для проверки webhook ЮKassa

echo "🔍 Проверка webhook ЮKassa"
echo "=========================="
echo ""

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Проверка доступности endpoint
echo "1️⃣ Проверка доступности webhook endpoint..."
WEBHOOK_URL="https://ogfoody.ru/api/payments/yookassa/webhook"
TEST_URL="https://ogfoody.ru/api/payments/yookassa/webhook/check"

response=$(curl -s -o /dev/null -w "%{http_code}" "$TEST_URL")
if [ "$response" = "200" ]; then
    echo -e "${GREEN}✅ Webhook endpoint доступен${NC}"
    curl -s "$TEST_URL" | jq '.' 2>/dev/null || curl -s "$TEST_URL"
else
    echo -e "${RED}❌ Webhook endpoint недоступен (HTTP $response)${NC}"
fi

echo ""
echo "2️⃣ Инструкция по настройке:"
echo "   - Откройте https://yookassa.ru/my"
echo "   - Выберите тестовый магазин"
echo "   - Интеграция → HTTP-уведомления"
echo "   - URL: $WEBHOOK_URL"
echo "   - События: payment.succeeded, payment.canceled"
echo ""

echo "3️⃣ Для проверки логов на сервере:"
echo "   ssh root@5.129.194.168"
echo "   pm2 logs ogfoody --lines 100 | grep -i webhook"
echo ""

echo "4️⃣ Тестовый endpoint:"
echo "   $TEST_URL"
echo ""

echo "✅ Проверка завершена"
