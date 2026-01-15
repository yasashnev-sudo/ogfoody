#!/bin/bash
# Тест промокодов на продакшене

echo "🚀 Запуск тестов промокодов на продакшене..."
echo ""

# Запускаем тест через API продакшена
curl -s "https://ogfoody.ru/api/health" > /dev/null && echo "✅ API доступен" || echo "❌ API недоступен"

echo ""
echo "📝 Тест 1: Создание тестового промокода..."
TEST_CODE="TEST-$(date +%s)"
PROMO_RESPONSE=$(curl -s -X POST "https://ogfoody.ru/api/db/Promo_Codes/records" \
  -H "Content-Type: application/json" \
  -d "[{
    \"Code\": \"$TEST_CODE\",
    \"Discount Type\": \"percentage\",
    \"Discount Value\": 10,
    \"Min Order Amount\": 1000,
    \"Max Discount\": 500,
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

echo ""
echo "📦 Тест 2: Поиск неоплаченного заказа для теста..."
# Ищем неоплаченный заказ
UNPAID_ORDERS=$(curl -s "https://ogfoody.ru/api/db/Orders/records?where=(Paid,eq,false)&limit=10")
EXISTING_ORDER_ID=$(echo "$UNPAID_ORDERS" | grep -oE '"(Id|id)":[0-9]*' | head -1 | cut -d: -f2)

if [ -z "$EXISTING_ORDER_ID" ]; then
  echo "⚠️ Неоплаченных заказов не найдено, создаем новый на дату через 30 дней..."
  FUTURE_DATE=$(date -d '+30 days' +%Y-%m-%d 2>/dev/null || date -v+30d +%Y-%m-%d 2>/dev/null || echo "2026-02-15")
  ORDER_RESPONSE=$(curl -s -X POST "https://ogfoody.ru/api/orders" \
    -H "Content-Type: application/json" \
    -d "{
      \"order\": {
        \"startDate\": \"$FUTURE_DATE\",
        \"deliveryTime\": \"17:30-22:00\",
        \"paymentMethod\": \"cash\",
        \"paid\": false,
        \"paymentStatus\": \"pending\",
        \"orderStatus\": \"pending\",
        \"promoCode\": \"$TEST_CODE\",
        \"promoDiscount\": 100,
        \"loyaltyPointsUsed\": 0,
        \"loyaltyPointsEarned\": 0,
        \"subtotal\": 2000,
        \"total\": 1900,
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
                \"price\": 200,
                \"portion\": \"single\"
              }
            }
          },
          \"day2\": {
            \"breakfast\": {
              \"dish\": {
                \"id\": 1455,
                \"name\": \"Тестовое блюдо\",
                \"price\": 200,
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
    echo "✅ Заказ создан с промокодом"
    ORDER_ID=$(echo "$ORDER_RESPONSE" | grep -oE '"(Id|id)":[0-9]*' | head -1 | cut -d: -f2)
  else
    echo "❌ Ошибка создания заказа: $ORDER_RESPONSE"
    curl -s -X DELETE "https://ogfoody.ru/api/db/Promo_Codes/records/$PROMO_ID" > /dev/null
    exit 1
  fi
else
  echo "   Найден неоплаченный заказ ID: $EXISTING_ORDER_ID"
  # Сначала проверяем текущее состояние заказа
  CURRENT_ORDER=$(curl -s "https://ogfoody.ru/api/db/Orders/records/$EXISTING_ORDER_ID")
  CURRENT_PROMO=$(echo "$CURRENT_ORDER" | grep -oE '"(Promo Code|promo_code)":"[^"]*"' | cut -d: -f2 | tr -d '"' | head -1)
  echo "   Текущий промокод в заказе: ${CURRENT_PROMO:-нет}"
  
  # Обновляем заказ с промокодом
  UPDATE_RESPONSE=$(curl -s -X PATCH "https://ogfoody.ru/api/orders/$EXISTING_ORDER_ID" \
    -H "Content-Type: application/json" \
    -d "{
      \"order\": {
        \"promoCode\": \"$TEST_CODE\",
        \"promoDiscount\": 100
      }
    }")
  
  if echo "$UPDATE_RESPONSE" | grep -q "\"order\"" || echo "$UPDATE_RESPONSE" | grep -q "\"id\""; then
    echo "✅ Заказ обновлен с промокодом"
    ORDER_ID=$EXISTING_ORDER_ID
  else
    echo "❌ Ошибка обновления заказа: $UPDATE_RESPONSE"
    curl -s -X DELETE "https://ogfoody.ru/api/db/Promo_Codes/records/$PROMO_ID" > /dev/null
    exit 1
  fi
fi

echo ""
echo "🔍 Тест 3: Проверка загрузки заказа и промокода..."
ORDER_CHECK=$(curl -s "https://ogfoody.ru/api/db/Orders/records/$ORDER_ID")

# Проверяем оба формата: "Promo Code" и promo_code
PROMO_CODE_FOUND=$(echo "$ORDER_CHECK" | grep -oE '"(Promo Code|promo_code)":"[^"]*"' | cut -d: -f2 | tr -d '"' | head -1)
PROMO_DISCOUNT_FOUND=$(echo "$ORDER_CHECK" | grep -oE '"(Promo Discount|promo_discount)":[0-9.]*' | cut -d: -f2 | head -1)

if [ -n "$PROMO_CODE_FOUND" ] && [ "$PROMO_CODE_FOUND" = "$TEST_CODE" ] && [ -n "$PROMO_DISCOUNT_FOUND" ] && [ "$PROMO_DISCOUNT_FOUND" = "100" ]; then
  echo "✅ Промокод правильно сохранен: $PROMO_CODE_FOUND, скидка: $PROMO_DISCOUNT_FOUND"
else
  echo "❌ Промокод не найден или неправильно сохранен"
  echo "   Ожидалось: $TEST_CODE, скидка: 100"
  echo "   Найдено: $PROMO_CODE_FOUND, скидка: $PROMO_DISCOUNT_FOUND"
  echo "   Полный ответ: $ORDER_CHECK"
fi

echo ""
echo "🔄 Тест 4: Повторное обновление заказа с новым промокодом..."
UPDATE_RESPONSE=$(curl -s -X PATCH "https://ogfoody.ru/api/orders/$ORDER_ID" \
  -H "Content-Type: application/json" \
  -d "{
    \"order\": {
      \"promoCode\": \"$TEST_CODE\",
      \"promoDiscount\": 200
    }
  }")

if echo "$UPDATE_RESPONSE" | grep -q "\"order\"" || echo "$UPDATE_RESPONSE" | grep -q "\"id\""; then
  echo "✅ Заказ обновлен повторно"
  # Проверяем обновленный заказ
  UPDATED_ORDER=$(curl -s "https://ogfoody.ru/api/db/Orders/records/$ORDER_ID")
  UPDATED_PROMO_DISCOUNT=$(echo "$UPDATED_ORDER" | grep -oE '"(Promo Discount|promo_discount)":[0-9.]*' | cut -d: -f2 | head -1)
  if [ "$UPDATED_PROMO_DISCOUNT" = "200" ]; then
    echo "✅ Промокод правильно обновлен, новая скидка: $UPDATED_PROMO_DISCOUNT"
  else
    echo "❌ Промокод не обновился правильно, ожидалось: 200, найдено: $UPDATED_PROMO_DISCOUNT"
  fi
else
  echo "❌ Ошибка обновления заказа: $UPDATE_RESPONSE"
fi

echo ""
echo "📊 Тест 5: Проверка статистики..."
STATS_CHECK=$(curl -s "https://ogfoody.ru/api/db/Orders/records?limit=1000")
ORDERS_WITH_PROMO=$(echo "$STATS_CHECK" | grep -o "\"Promo Code\"" | wc -l)
echo "✅ Найдено заказов с промокодом: $ORDERS_WITH_PROMO"

echo ""
echo "🧹 Очистка тестовых данных..."
curl -s -X DELETE "https://ogfoody.ru/api/db/Promo_Codes/records/$PROMO_ID" > /dev/null && echo "✅ Промокод удален" || echo "⚠️ Не удалось удалить промокод"
# Не удаляем заказ, так как это существующий заказ, только убираем промокод
curl -s -X PATCH "https://ogfoody.ru/api/orders/$ORDER_ID" \
  -H "Content-Type: application/json" \
  -d "{\"order\": {\"promoCode\": null, \"promoDiscount\": 0}}" > /dev/null && echo "✅ Промокод удален из заказа" || echo "⚠️ Не удалось удалить промокод из заказа"

echo ""
echo "✅ Тестирование завершено"
