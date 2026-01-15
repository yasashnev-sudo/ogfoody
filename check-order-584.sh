#!/bin/bash
# Проверка заказа #584 и расчет правильных баллов

echo "🔍 Проверка заказа ORD-20260115-G448PY (ID: 584)"
echo ""

ORDER_DATA=$(curl -s "https://ogfoody.ru/api/db/Orders/records/584")

echo "📦 Данные заказа:"
echo "$ORDER_DATA" | python3 -c "
import sys, json
data = json.load(sys.stdin)
order = data
print(f\"  ID: {order.get('Id', 'N/A')}\")
print(f\"  Номер: {order.get('Order Number', 'N/A')}\")
print(f\"  Дата: {order.get('Start Date', 'N/A')}\")
print(f\"  Subtotal: {order.get('Subtotal', 0)}₽\")
print(f\"  Delivery Fee: {order.get('Delivery Fee', 0)}₽\")
print(f\"  Promo Code: {order.get('Promo Code', 'null')}\")
print(f\"  Promo Discount: {order.get('Promo Discount', 'null')}₽\")
print(f\"  Total: {order.get('Total', 0)}₽\")
print(f\"  Loyalty Points Used: {order.get('Loyalty Points Used', 0)}\")
print(f\"  Loyalty Points Earned: {order.get('Loyalty Points Earned', 0)}\")
print(f\"  Paid: {order.get('Paid', False)}\")
"

echo ""
echo "📊 Расчет правильных баллов:"
SUBTOTAL=$(echo "$ORDER_DATA" | python3 -c "import sys, json; print(json.load(sys.stdin).get('Subtotal', 0))")
DELIVERY_FEE=$(echo "$ORDER_DATA" | python3 -c "import sys, json; print(json.load(sys.stdin).get('Delivery Fee', 0))")
PROMO_DISCOUNT=$(echo "$ORDER_DATA" | python3 -c "import sys, json; print(json.load(sys.stdin).get('Promo Discount') or 0)")
TOTAL_SPENT=$(curl -s "https://ogfoody.ru/api/db/Users/records/122" | python3 -c "import sys, json; print(json.load(sys.stdin).get('Total Spent', 0) or 0)" 2>/dev/null || echo "0")

echo "  Subtotal: ${SUBTOTAL}₽"
echo "  Delivery Fee: ${DELIVERY_FEE}₽"
echo "  Promo Discount: ${PROMO_DISCOUNT}₽"
echo "  Total Spent (до заказа): ${TOTAL_SPENT}₽"

# Расчет orderTotal с учетом промокода
ORDER_TOTAL=$((SUBTOTAL + DELIVERY_FEE - PROMO_DISCOUNT))
echo "  Order Total (с учетом промокода): ${ORDER_TOTAL}₽"

# Расчет процента кэшбека
if [ "$TOTAL_SPENT" -ge 50000 ]; then
  CASHBACK_PERCENT=7
  LEVEL="Gold"
elif [ "$TOTAL_SPENT" -ge 20000 ]; then
  CASHBACK_PERCENT=5
  LEVEL="Silver"
else
  CASHBACK_PERCENT=3
  LEVEL="Bronze"
fi

echo "  Уровень лояльности: ${LEVEL} (${CASHBACK_PERCENT}%)"

# Расчет правильных баллов
CORRECT_POINTS=$(python3 -c "print(int($ORDER_TOTAL * $CASHBACK_PERCENT / 100))")
CURRENT_POINTS=$(echo "$ORDER_DATA" | python3 -c "import sys, json; print(json.load(sys.stdin).get('Loyalty Points Earned', 0))")

echo ""
echo "💰 Баллы:"
echo "  Текущие начисленные: ${CURRENT_POINTS}"
echo "  Правильные (с учетом промокода): ${CORRECT_POINTS}"
if [ "$CORRECT_POINTS" != "$CURRENT_POINTS" ]; then
  DIFF=$((CORRECT_POINTS - CURRENT_POINTS))
  echo "  ⚠️ Разница: ${DIFF} баллов"
else
  echo "  ✅ Баллы начислены правильно"
fi

echo ""
echo "🔍 Проверка статистики промокодов:"
STATS=$(curl -s "https://ogfoody.ru/api/db/Orders/records?limit=1000")
ORDERS_WITH_PROMO=$(echo "$STATS" | python3 -c "
import sys, json
data = json.load(sys.stdin)
orders = data.get('list', [])
count = sum(1 for o in orders if o.get('Promo Code') or o.get('promo_code'))
print(count)
" 2>/dev/null || echo "0")

echo "  Заказов с промокодом: ${ORDERS_WITH_PROMO}"
