#!/bin/bash

# Скрипт для полной очистки NocoDB

NOCODB_URL="https://noco.povarnakolesah.ru"
NOCODB_TOKEN="eppmI3qJq8ahGaCzPmjmZGIze9NgJxEFQzu6Ps1r"
USER_ID=5

echo "🗑️  Очистка NocoDB для пользователя ID=$USER_ID"
echo "================================================"

# 1. Удаление всех заказов
echo ""
echo "1️⃣  Удаление заказов..."
ORDERS=$(curl -s "${NOCODB_URL}/api/v2/tables/m96i4ai2yelbboh/records?where=(User%20ID,eq,${USER_ID})&limit=1000" \
  -H "xc-token: ${NOCODB_TOKEN}")

ORDER_IDS=$(echo $ORDERS | python3 -c "
import json, sys
data = json.load(sys.stdin)
ids = [str(item['Id']) for item in data.get('list', [])]
print(','.join(ids))
")

if [ -n "$ORDER_IDS" ]; then
  IFS=',' read -ra IDS <<< "$ORDER_IDS"
  for id in "${IDS[@]}"; do
    echo "   Удаление заказа ID=$id..."
    curl -s -X DELETE "${NOCODB_URL}/api/v2/tables/m96i4ai2yelbboh/records" \
      -H "xc-token: ${NOCODB_TOKEN}" \
      -H "Content-Type: application/json" \
      -d "[\"$id\"]" > /dev/null
  done
  echo "   ✅ Удалено заказов: ${#IDS[@]}"
else
  echo "   ℹ️  Заказов не найдено"
fi

# 2. Удаление всех транзакций баллов
echo ""
echo "2️⃣  Удаление транзакций баллов..."
TRANSACTIONS=$(curl -s "${NOCODB_URL}/api/v2/tables/mn244txmccpwmhx/records?where=(User%20ID,eq,${USER_ID})&limit=10000" \
  -H "xc-token: ${NOCODB_TOKEN}")

TRANSACTION_IDS=$(echo $TRANSACTIONS | python3 -c "
import json, sys
data = json.load(sys.stdin)
ids = [str(item['Id']) for item in data.get('list', [])]
print(','.join(ids))
")

if [ -n "$TRANSACTION_IDS" ]; then
  IFS=',' read -ra IDS <<< "$TRANSACTION_IDS"
  for id in "${IDS[@]}"; do
    echo "   Удаление транзакции ID=$id..."
    curl -s -X DELETE "${NOCODB_URL}/api/v2/tables/mn244txmccpwmhx/records" \
      -H "xc-token: ${NOCODB_TOKEN}" \
      -H "Content-Type: application/json" \
      -d "[\"$id\"]" > /dev/null
  done
  echo "   ✅ Удалено транзакций: ${#IDS[@]}"
else
  echo "   ℹ️  Транзакций не найдено"
fi

# 3. Сброс баланса пользователя
echo ""
echo "3️⃣  Сброс баланса пользователя..."
curl -s -X PATCH "${NOCODB_URL}/api/v2/tables/mg9dm2m41bjv8ar/records" \
  -H "xc-token: ${NOCODB_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "[{\"Id\": ${USER_ID}, \"Loyalty Points\": 0}]" > /dev/null
echo "   ✅ Баланс пользователя ID=$USER_ID сброшен на 0"

echo ""
echo "================================================"
echo "✅ Очистка завершена!"
echo ""
echo "Проверьте результат:"
echo "curl http://localhost:3000/api/orders?userId=$USER_ID"



