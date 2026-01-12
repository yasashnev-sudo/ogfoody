#!/bin/bash

# Скрипт для тестирования работы с пользователями в NocoDB

ORDER_NUMBER="${1:-ORD-20260105-13QGDU}"
PHONE="${2:-+79991234567}"
TEST_TYPE="${3:-all}"

echo "🧪 Тестирование работы с пользователями"
echo "=========================================="
echo "Телефон: $PHONE"
echo "Тип теста: $TEST_TYPE"
echo ""

# Получаем userId из заказа, если указан номер заказа
if [ -n "$ORDER_NUMBER" ]; then
  echo "📋 Получаем userId из заказа $ORDER_NUMBER..."
  ORDER_RESPONSE=$(curl -s -X GET "http://localhost:3000/api/orders?orderNumber=$ORDER_NUMBER")
  USER_ID=$(echo "$ORDER_RESPONSE" | grep -o '"user_id":[0-9]*' | head -1 | cut -d: -f2)
  if [ -n "$USER_ID" ]; then
    echo "✅ User ID из заказа: $USER_ID"
  fi
fi

echo ""
echo "🔍 Тест получения пользователя по телефону..."
RESPONSE=$(curl -s -X POST "http://localhost:3000/api/db/test-user" \
  -H "Content-Type: application/json" \
  -d "{
    \"phone\": \"$PHONE\",
    \"testType\": \"fetch\"
  }")

echo "$RESPONSE" | jq '.'

echo ""
echo "📝 Тест создания пользователя..."
CREATE_RESPONSE=$(curl -s -X POST "http://localhost:3000/api/db/test-user" \
  -H "Content-Type: application/json" \
  -d "{
    \"phone\": \"+7$(shuf -i 1000000000-9999999999 -n 1)\",
    \"testType\": \"create\"
  }")

echo "$CREATE_RESPONSE" | jq '.'

if [ -n "$USER_ID" ]; then
  echo ""
  echo "🔄 Тест обновления пользователя (ID: $USER_ID)..."
  UPDATE_RESPONSE=$(curl -s -X POST "http://localhost:3000/api/db/test-user" \
    -H "Content-Type: application/json" \
    -d "{
      \"userId\": $USER_ID,
      \"testType\": \"update\"
    }")
  
  echo "$UPDATE_RESPONSE" | jq '.'
fi

echo ""
echo "⭐ Финальный тест (все операции)..."
FINAL_RESPONSE=$(curl -s -X POST "http://localhost:3000/api/db/test-user" \
  -H "Content-Type: application/json" \
  -d "{
    \"phone\": \"$PHONE\",
    \"testType\": \"all\"
  }")

echo "$FINAL_RESPONSE" | jq '.'





