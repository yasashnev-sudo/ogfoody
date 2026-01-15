#!/bin/bash
# Скрипт для тестирования, что API не кешируется

echo "🧪 Тестирование API - проверка отсутствия кеширования"
echo "=================================================="
echo ""

BASE_URL="https://ogfoody.ru"

echo "1. Проверка заголовков Cache-Control для /api/menu:"
curl -s -I "${BASE_URL}/api/menu" | grep -i "cache-control" || echo "❌ Заголовок не найден"
echo ""

echo "2. Проверка заголовков Cache-Control для /api/orders:"
curl -s -I "${BASE_URL}/api/orders?userId=1" | grep -i "cache-control" || echo "❌ Заголовок не найден"
echo ""

echo "3. Проверка заголовков Cache-Control для /api/db/users/records:"
curl -s -I "${BASE_URL}/api/db/users/records" | grep -i "cache-control" || echo "❌ Заголовок не найден"
echo ""

echo "4. Проверка работы /api/health:"
HEALTH=$(curl -s "${BASE_URL}/api/health")
if echo "$HEALTH" | grep -q '"status":"ok"'; then
  echo "✅ API работает"
else
  echo "❌ API не работает"
  echo "$HEALTH"
fi
echo ""

echo "5. Проверка, что данные обновляются (два запроса подряд):"
TIMESTAMP1=$(curl -s "${BASE_URL}/api/menu" | grep -o '"timestamp":"[^"]*"' | head -1)
sleep 1
TIMESTAMP2=$(curl -s "${BASE_URL}/api/menu" | grep -o '"timestamp":"[^"]*"' | head -1)
if [ "$TIMESTAMP1" != "$TIMESTAMP2" ] || [ -z "$TIMESTAMP1" ]; then
  echo "✅ Данные обновляются (или нет timestamp в ответе - это нормально)"
else
  echo "⚠️  Timestamp одинаковый (возможно кеширование)"
fi
echo ""

echo "✅ Тестирование завершено"
