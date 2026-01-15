#!/bin/bash
# Тест начисления баллов при оплате заказа с промокодом

echo "🚀 Тест начисления баллов при оплате заказа"
echo ""

# Шаг 1: Создание тестового промокода
echo "📝 Шаг 1: Создание тестового промокода..."
TEST_CODE="LOYALTYTEST-$(date +%s)"
PROMO_RESPONSE=$(curl -s -X POST "https://ogfoody.ru/api/db/Promo_Codes/records" \
  -H "Content-Type: application/json" \
  -d "[{
    \"Code\": \"$TEST_CODE\",
    \"Discount Type\": \"fixed\",
    \"Discount Value\": 300,
    \"Min Order Amount\": 1000,
    \"Max Discount\": 300,
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

# Шаг 2: Получаем данные пользователя
echo ""
echo "👤 Шаг 2: Получение данных пользователя..."
USER_DATA=$(curl -s "https://ogfoody.ru/api/db/Users/records/125")
OLD_LOYALTY_POINTS=$(echo "$USER_DATA" | python3 -c "import sys, json; print(json.load(sys.stdin).get('Loyalty Points', 0) or 0)" 2>/dev/null || echo "0")
OLD_TOTAL_SPENT=$(echo "$USER_DATA" | python3 -c "import sys, json; print(json.load(sys.stdin).get('Total Spent', 0) or 0)" 2>/dev/null || echo "0")
echo "   Старые баллы: ${OLD_LOYALTY_POINTS}"
echo "   Total Spent: ${OLD_TOTAL_SPENT}"

# Шаг 3: Создание заказа с промокодом (неоплаченного)
echo ""
echo "📦 Шаг 3: Создание неоплаченного заказа с промокодом..."
# Используем дату через 60 дней, чтобы избежать конфликтов
FUTURE_DATE=$(date -d '+60 days' +%Y-%m-%d 2>/dev/null || date -v+60d +%Y-%m-%d 2>/dev/null || echo "2026-03-15")
ORDER_RESPONSE=$(curl -s -X POST "https://ogfoody.ru/api/orders" \
  -H "Content-Type: application/json" \
  -d "{
    \"order\": {
      \"startDate\": \"$FUTURE_DATE\",
      \"deliveryTime\": \"17:30-22:00\",
      \"paymentMethod\": null,
      \"paid\": false,
      \"paymentStatus\": \"pending\",
      \"orderStatus\": \"pending\",
      \"promoCode\": \"$TEST_CODE\",
      \"promoDiscount\": 300,
      \"loyaltyPointsUsed\": 0,
      \"loyaltyPointsEarned\": 0,
      \"subtotal\": 2500,
      \"total\": 2200,
      \"deliveryFee\": 0,
      \"deliveryDistrict\": \"Красносельский район\",
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
    \"userId\": 125
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

# Шаг 4: Проверка заказа до оплаты
echo ""
echo "🔍 Шаг 4: Проверка заказа до оплаты..."
ORDER_BEFORE=$(curl -s "https://ogfoody.ru/api/db/Orders/records/$ORDER_ID")
PROMO_BEFORE=$(echo "$ORDER_BEFORE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('Promo Code') or 'null')" 2>/dev/null || echo "null")
POINTS_BEFORE=$(echo "$ORDER_BEFORE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('Loyalty Points Earned', 0) or 0)" 2>/dev/null || echo "0")
PAID_BEFORE=$(echo "$ORDER_BEFORE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('Paid', False))" 2>/dev/null || echo "False")
echo "   Promo Code: $PROMO_BEFORE"
echo "   Loyalty Points Earned: ${POINTS_BEFORE}"
echo "   Paid: ${PAID_BEFORE}"

# Шаг 5: Оплата заказа
echo ""
echo "💳 Шаг 5: Оплата заказа..."
PAYMENT_RESPONSE=$(curl -s -X PATCH "https://ogfoody.ru/api/orders/$ORDER_ID" \
  -H "Content-Type: application/json" \
  -d "{
    \"order\": {
      \"paid\": true,
      \"paidAt\": \"$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)\",
      \"paymentStatus\": \"paid\",
      \"paymentMethod\": \"card\",
      \"promoCode\": \"$TEST_CODE\",
      \"promoDiscount\": 300,
      \"loyaltyPointsUsed\": 0
    }
  }")

echo "   Ответ от API:"
echo "$PAYMENT_RESPONSE" | python3 -m json.tool 2>/dev/null | head -30

# Шаг 6: Проверка заказа после оплаты
echo ""
echo "🔍 Шаг 6: Проверка заказа после оплаты..."
sleep 2
ORDER_AFTER=$(curl -s "https://ogfoody.ru/api/db/Orders/records/$ORDER_ID")
PROMO_AFTER=$(echo "$ORDER_AFTER" | python3 -c "import sys, json; print(json.load(sys.stdin).get('Promo Code') or 'null')" 2>/dev/null || echo "null")
POINTS_AFTER=$(echo "$ORDER_AFTER" | python3 -c "import sys, json; print(json.load(sys.stdin).get('Loyalty Points Earned', 0) or 0)" 2>/dev/null || echo "0")
PAID_AFTER=$(echo "$ORDER_AFTER" | python3 -c "import sys, json; print(json.load(sys.stdin).get('Paid', False))" 2>/dev/null || echo "False")
SUBTOTAL=$(echo "$ORDER_AFTER" | python3 -c "import sys, json; print(json.load(sys.stdin).get('Subtotal', 0) or 0)" 2>/dev/null || echo "0")
TOTAL=$(echo "$ORDER_AFTER" | python3 -c "import sys, json; print(json.load(sys.stdin).get('Total', 0) or 0)" 2>/dev/null || echo "0")
PROMO_DISCOUNT=$(echo "$ORDER_AFTER" | python3 -c "import sys, json; print(json.load(sys.stdin).get('Promo Discount', 0) or 0)" 2>/dev/null || echo "0")

echo "   Promo Code: $PROMO_AFTER"
echo "   Promo Discount: ${PROMO_DISCOUNT}₽"
echo "   Subtotal: ${SUBTOTAL}₽"
echo "   Total: ${TOTAL}₽"
echo "   Paid: ${PAID_AFTER}"
echo "   Loyalty Points Earned: ${POINTS_AFTER}"

# Шаг 7: Проверка баллов пользователя
echo ""
echo "💰 Шаг 7: Проверка баллов пользователя..."
sleep 2
USER_DATA_AFTER=$(curl -s "https://ogfoody.ru/api/db/Users/records/125")
NEW_LOYALTY_POINTS=$(echo "$USER_DATA_AFTER" | python3 -c "import sys, json; print(json.load(sys.stdin).get('Loyalty Points', 0) or 0)" 2>/dev/null || echo "0")
NEW_TOTAL_SPENT=$(echo "$USER_DATA_AFTER" | python3 -c "import sys, json; print(json.load(sys.stdin).get('Total Spent', 0) or 0)" 2>/dev/null || echo "0")

echo "   Старые баллы: ${OLD_LOYALTY_POINTS}"
echo "   Новые баллы: ${NEW_LOYALTY_POINTS}"
echo "   Разница: $((NEW_LOYALTY_POINTS - OLD_LOYALTY_POINTS))"

# Шаг 8: Расчет правильных баллов
echo ""
echo "📊 Шаг 8: Расчет правильных баллов..."
ORDER_TOTAL=$((SUBTOTAL - PROMO_DISCOUNT))
CASHBACK_PERCENT=5  # Silver level для totalSpent >= 20000
EXPECTED_POINTS=$(python3 -c "print(int($ORDER_TOTAL * $CASHBACK_PERCENT / 100))")

echo "   Order Total (с промокодом): ${ORDER_TOTAL}₽"
echo "   Cashback: ${CASHBACK_PERCENT}%"
echo "   Ожидаемые баллы: ${EXPECTED_POINTS}"
echo "   Фактические баллы в заказе: ${POINTS_AFTER}"
echo "   Фактическое увеличение баллов: $((NEW_LOYALTY_POINTS - OLD_LOYALTY_POINTS))"

# Шаг 9: Проверка результатов
echo ""
echo "✅ Шаг 9: Проверка результатов..."
SUCCESS=true

if [ "$POINTS_AFTER" != "$EXPECTED_POINTS" ]; then
  echo "❌ Баллы в заказе не совпадают: ожидалось ${EXPECTED_POINTS}, получено ${POINTS_AFTER}"
  SUCCESS=false
fi

if [ "$((NEW_LOYALTY_POINTS - OLD_LOYALTY_POINTS))" != "$EXPECTED_POINTS" ]; then
  echo "❌ Баллы пользователя не увеличились правильно: ожидалось +${EXPECTED_POINTS}, получено +$((NEW_LOYALTY_POINTS - OLD_LOYALTY_POINTS))"
  SUCCESS=false
fi

if [ "$PROMO_AFTER" != "$TEST_CODE" ]; then
  echo "❌ Промокод не сохранился: ожидалось $TEST_CODE, получено $PROMO_AFTER"
  SUCCESS=false
fi

if [ "$PAID_AFTER" != "True" ]; then
  echo "❌ Заказ не оплачен: ожидалось True, получено $PAID_AFTER"
  SUCCESS=false
fi

if [ "$SUCCESS" = true ]; then
  echo "✅ Все проверки пройдены!"
else
  echo "❌ Некоторые проверки не пройдены"
fi

# Очистка
echo ""
echo "🧹 Очистка тестовых данных..."
curl -s -X DELETE "https://ogfoody.ru/api/db/Promo_Codes/records/$PROMO_ID" > /dev/null && echo "✅ Промокод удален" || echo "⚠️ Не удалось удалить промокод"
# Не удаляем заказ, чтобы можно было проверить вручную

echo ""
if [ "$SUCCESS" = true ]; then
  echo "✅ Тестирование завершено успешно"
  exit 0
else
  echo "❌ Тестирование завершено с ошибками"
  exit 1
fi
