#!/bin/bash
# Полный тест цикла промокода: создание заказа с промокодом и проверка сохранения

echo "🚀 Полный тест цикла промокода"
echo ""

# Шаг 1: Создание тестового промокода
echo "📝 Шаг 1: Создание тестового промокода..."
TEST_CODE="FULLTEST-$(date +%s)"
PROMO_RESPONSE=$(curl -s -X POST "https://ogfoody.ru/api/db/Promo_Codes/records" \
  -H "Content-Type: application/json" \
  -d "[{
    \"Code\": \"$TEST_CODE\",
    \"Discount Type\": \"fixed\",
    \"Discount Value\": 200,
    \"Min Order Amount\": 1000,
    \"Max Discount\": 200,
    \"Valid From\": \"$(date +%Y-%m-%d)\",
    \"Valid Until\": \"$(date -d '+30 days' +%Y-%m-%d 2>/dev/null || date -v+30d +%Y-%m-%d 2>/dev/null || echo $(date +%Y-%m-%d))\",
    \"Usage Limit\": 100,
    \"Times Used\": 0,
    \"Active\": true
  }]")

if echo "$PROMO_RESPONSE" | grep -q "\"Id\""; then
  echo "✅ Промокод $TEST_CODE создан"
  PROMO_ID=$(echo "$PROMO_RESPONSE" | grep -o '"Id":[0-9]*' | head -1 | cut -d: -f2)
else
  echo "❌ Ошибка создания промокода: $PROMO_RESPONSE"
  exit 1
fi

# Шаг 2: Создание заказа с промокодом (имитация создания через API)
echo ""
echo "📦 Шаг 2: Создание заказа с промокодом через API..."
FUTURE_DATE=$(date -d '+35 days' +%Y-%m-%d 2>/dev/null || date -v+35d +%Y-%m-%d 2>/dev/null || echo "2026-02-20")
ORDER_RESPONSE=$(curl -s -X POST "https://ogfoody.ru/api/orders" \
  -H "Content-Type: application/json" \
  -d "{
    \"order\": {
      \"startDate\": \"$FUTURE_DATE\",
      \"deliveryTime\": \"17:30-22:00\",
      \"paymentMethod\": \"card\",
      \"paid\": true,
      \"paymentStatus\": \"paid\",
      \"orderStatus\": \"pending\",
      \"promoCode\": \"$TEST_CODE\",
      \"promoDiscount\": 200,
      \"loyaltyPointsUsed\": 0,
      \"loyaltyPointsEarned\": 0,
      \"subtotal\": 2000,
      \"total\": 1800,
      \"deliveryFee\": 0,
      \"deliveryDistrict\": \"Тестовый район\",
      \"deliveryAddress\": \"Тестовый адрес\",
      \"persons\": [{
        \"id\": 1,
        \"day1\": {
          \"breakfast\": {
            \"dish\": {
              \"id\": 1455,
              \"name\": \"Тестовое блюдо\",
              \"price\": 600,
              \"portion\": \"single\"
            }
          },
          \"lunch\": {
            \"main\": {
              \"id\": 1308,
              \"name\": \"Тестовое горячее\",
              \"price\": 500,
              \"portion\": \"single\"
            }
          }
        },
        \"day2\": {
          \"breakfast\": {
            \"dish\": {
              \"id\": 1455,
              \"name\": \"Тестовое блюдо\",
              \"price\": 600,
              \"portion\": \"single\"
            }
          },
          \"lunch\": {
            \"main\": {
              \"id\": 1308,
              \"name\": \"Тестовое горячее\",
              \"price\": 500,
              \"portion\": \"single\"
            }
          }
        }
      }],
      \"extras\": []
    },
    \"userId\": 122
  }")

if echo "$ORDER_RESPONSE" | grep -q "\"order\"" || echo "$ORDER_RESPONSE" | grep -q "\"id\""; then
  echo "✅ Заказ создан"
  ORDER_ID=$(echo "$ORDER_RESPONSE" | grep -oE '"(Id|id)":[0-9]*' | head -1 | cut -d: -f2)
  echo "   Order ID: $ORDER_ID"
else
  echo "❌ Ошибка создания заказа: $ORDER_RESPONSE"
  curl -s -X DELETE "https://ogfoody.ru/api/db/Promo_Codes/records/$PROMO_ID" > /dev/null
  exit 1
fi

# Шаг 3: Проверка сохранения промокода
echo ""
echo "🔍 Шаг 3: Проверка сохранения промокода в заказе..."
ORDER_CHECK=$(curl -s "https://ogfoody.ru/api/db/Orders/records/$ORDER_ID")

PROMO_CODE_FOUND=$(echo "$ORDER_CHECK" | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(data.get('Promo Code') or data.get('promo_code') or 'null')
" 2>/dev/null || echo "null")

PROMO_DISCOUNT_FOUND=$(echo "$ORDER_CHECK" | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(data.get('Promo Discount') or data.get('promo_discount') or 0)
" 2>/dev/null || echo "0")

SUBTOTAL=$(echo "$ORDER_CHECK" | python3 -c "import sys, json; print(json.load(sys.stdin).get('Subtotal', 0))" 2>/dev/null || echo "0")
TOTAL=$(echo "$ORDER_CHECK" | python3 -c "import sys, json; print(json.load(sys.stdin).get('Total', 0))" 2>/dev/null || echo "0")
DELIVERY_FEE=$(echo "$ORDER_CHECK" | python3 -c "import sys, json; print(json.load(sys.stdin).get('Delivery Fee', 0))" 2>/dev/null || echo "0")

echo "   Promo Code: $PROMO_CODE_FOUND"
echo "   Promo Discount: ${PROMO_DISCOUNT_FOUND}₽"
echo "   Subtotal: ${SUBTOTAL}₽"
echo "   Delivery Fee: ${DELIVERY_FEE}₽"
echo "   Total: ${TOTAL}₽"
echo "   Ожидаемый Total: $((SUBTOTAL + DELIVERY_FEE - PROMO_DISCOUNT_FOUND))₽"

if [ "$PROMO_CODE_FOUND" = "$TEST_CODE" ] && [ "$PROMO_DISCOUNT_FOUND" = "200" ]; then
  echo "✅ Промокод правильно сохранен"
else
  echo "❌ Промокод НЕ сохранен правильно!"
  echo "   Ожидалось: $TEST_CODE, 200₽"
  echo "   Найдено: $PROMO_CODE_FOUND, ${PROMO_DISCOUNT_FOUND}₽"
fi

# Шаг 4: Проверка расчета баллов
echo ""
echo "💰 Шаг 4: Проверка расчета баллов..."
TOTAL_SPENT=$(curl -s "https://ogfoody.ru/api/db/Users/records/122" | python3 -c "import sys, json; print(json.load(sys.stdin).get('Total Spent', 0) or 0)" 2>/dev/null || echo "0")

if [ "$TOTAL_SPENT" -ge 50000 ]; then
  CASHBACK_PERCENT=7
elif [ "$TOTAL_SPENT" -ge 20000 ]; then
  CASHBACK_PERCENT=5
else
  CASHBACK_PERCENT=3
fi

EXPECTED_TOTAL=$((SUBTOTAL + DELIVERY_FEE - PROMO_DISCOUNT_FOUND))
CORRECT_POINTS=$(python3 -c "print(int($EXPECTED_TOTAL * $CASHBACK_PERCENT / 100))")
CURRENT_POINTS=$(echo "$ORDER_CHECK" | python3 -c "import sys, json; print(json.load(sys.stdin).get('Loyalty Points Earned', 0))" 2>/dev/null || echo "0")

echo "   Order Total (с промокодом): ${EXPECTED_TOTAL}₽"
echo "   Кэшбек: ${CASHBACK_PERCENT}%"
echo "   Правильные баллы: ${CORRECT_POINTS}"
echo "   Текущие баллы: ${CURRENT_POINTS}"

if [ "$CORRECT_POINTS" = "$CURRENT_POINTS" ]; then
  echo "✅ Баллы начислены правильно"
else
  echo "❌ Баллы начислены неправильно!"
  echo "   Разница: $((CORRECT_POINTS - CURRENT_POINTS)) баллов"
fi

# Шаг 5: Проверка статистики
echo ""
echo "📊 Шаг 5: Проверка статистики..."
STATS_CHECK=$(curl -s "https://ogfoody.ru/api/db/Orders/records?limit=1000")
ORDERS_WITH_PROMO=$(echo "$STATS_CHECK" | python3 -c "
import sys, json
data = json.load(sys.stdin)
orders = data.get('list', [])
count = sum(1 for o in orders if (o.get('Promo Code') or o.get('promo_code')) and (o.get('Promo Discount') or o.get('promo_discount') or 0) > 0)
print(count)
" 2>/dev/null || echo "0")

echo "   Заказов с промокодом: ${ORDERS_WITH_PROMO}"

# Очистка
echo ""
echo "🧹 Очистка тестовых данных..."
curl -s -X DELETE "https://ogfoody.ru/api/db/Promo_Codes/records/$PROMO_ID" > /dev/null && echo "✅ Промокод удален" || echo "⚠️ Не удалось удалить промокод"
curl -s -X DELETE "https://ogfoody.ru/api/db/Orders/records/$ORDER_ID" > /dev/null && echo "✅ Заказ удален" || echo "⚠️ Не удалось удалить заказ"

echo ""
echo "✅ Тестирование завершено"
