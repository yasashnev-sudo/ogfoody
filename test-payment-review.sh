#!/bin/bash

# Тестовый скрипт для проверки обновления статуса оплаты и создания отзыва

BASE_URL="http://localhost:3000"
ORDER_NUMBER="${1:-ORD-20260105-13QGDU}"
PHONE="${2:-}"

echo "🧪 Тест обновления статуса оплаты и создания отзыва"
echo "=================================================="
echo "Номер заказа: $ORDER_NUMBER"
echo "Телефон: ${PHONE:-не указан}"
echo ""

# Тест 1: Найти заказ по номеру
echo "📋 Шаг 1: Поиск заказа по номеру..."
FIND_RESPONSE=$(curl -s -X GET "$BASE_URL/api/orders?orderNumber=$ORDER_NUMBER")
echo "Ответ: $FIND_RESPONSE"
echo ""

# Извлекаем ID заказа из ответа (простой парсинг)
ORDER_ID=$(echo "$FIND_RESPONSE" | grep -o '"Id":[0-9]*' | head -1 | grep -o '[0-9]*')

if [ -z "$ORDER_ID" ]; then
    echo "❌ Заказ не найден. Попробуйте другой номер заказа."
    exit 1
fi

echo "✅ Заказ найден: ID=$ORDER_ID"
echo ""

# Тест 2: Обновить статус оплаты
echo "💳 Шаг 2: Обновление статуса оплаты..."
NOW=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")
UPDATE_PAYLOAD=$(cat <<EOF
{
  "paid": true,
  "paid_at": "$NOW",
  "payment_method": "card",
  "payment_status": "paid",
  "updated_at": "$NOW"
}
EOF
)

UPDATE_RESPONSE=$(curl -s -X PATCH "$BASE_URL/api/orders/$ORDER_ID" \
  -H "Content-Type: application/json" \
  -d "$UPDATE_PAYLOAD")

echo "Ответ обновления: $UPDATE_RESPONSE"
echo ""

if echo "$UPDATE_RESPONSE" | grep -q '"success":true\|"Id"'; then
    echo "✅ Статус оплаты успешно обновлен!"
else
    echo "❌ Ошибка обновления статуса оплаты"
    echo "$UPDATE_RESPONSE"
    exit 1
fi

echo ""

# Тест 3: Создать отзыв (если указан телефон)
if [ -n "$PHONE" ]; then
    echo "⭐ Шаг 3: Создание отзыва..."
    
    # Найти пользователя по телефону
    USER_RESPONSE=$(curl -s -X GET "$BASE_URL/api/db/[...path]?path=Users&where=(Phone,eq,$PHONE)")
    USER_ID=$(echo "$USER_RESPONSE" | grep -o '"Id":[0-9]*' | head -1 | grep -o '[0-9]*')
    
    if [ -z "$USER_ID" ]; then
        echo "⚠️ Пользователь с телефоном $PHONE не найден. Пропускаем создание отзыва."
    else
        echo "✅ Пользователь найден: ID=$USER_ID"
        
        REVIEW_TEXT="Тестовый отзыв от $(date '+%Y-%m-%d %H:%M:%S')"
        REVIEW_PAYLOAD=$(cat <<EOF
{
  "order_id": $ORDER_ID,
  "user_id": $USER_ID,
  "rating": 5,
  "text": "$REVIEW_TEXT"
}
EOF
)
        
        REVIEW_RESPONSE=$(curl -s -X POST "$BASE_URL/api/db/test-payment-review" \
          -H "Content-Type: application/json" \
          -d "{\"orderNumber\": \"$ORDER_NUMBER\", \"phone\": \"$PHONE\", \"testType\": \"review\"}")
        
        echo "Ответ создания отзыва: $REVIEW_RESPONSE"
        echo ""
        
        if echo "$REVIEW_RESPONSE" | grep -q '"success":true'; then
            echo "✅ Отзыв успешно создан!"
        else
            echo "❌ Ошибка создания отзыва"
            echo "$REVIEW_RESPONSE"
        fi
    fi
else
    echo "⚠️ Телефон не указан. Пропускаем создание отзыва."
    echo "Использование: $0 <номер_заказа> <телефон>"
fi

echo ""
echo "✅ Тестирование завершено!"





