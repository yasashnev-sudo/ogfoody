#!/bin/bash

echo "🚀 Deploying YooKassa integration..."

# SSH команды для деплоя
ssh root@5.129.194.168 << 'ENDSSH'
cd /var/www/ogfoody

echo "=== Pulling latest code ==="
git pull origin main

echo "=== Installing dependencies ==="
npm install

echo "=== Updating environment variables ==="
# Добавляем переменные ЮKassa в .env.production если их еще нет
if ! grep -q "YOOKASSA_SHOP_ID" .env.production 2>/dev/null; then
  echo "" >> .env.production
  echo "# YooKassa Payment Configuration" >> .env.production
  echo "YOOKASSA_SHOP_ID=1251656" >> .env.production
  echo "YOOKASSA_SECRET_KEY=test_sDZCHKIUGwEiXpsq0REALRWgsdPY9wCGBdYCRvCH4QE" >> .env.production
  echo "YOOKASSA_TEST_MODE=true" >> .env.production
else
  # Обновляем существующие значения
  sed -i 's/YOOKASSA_SHOP_ID=.*/YOOKASSA_SHOP_ID=1251656/' .env.production
  sed -i 's/YOOKASSA_SECRET_KEY=.*/YOOKASSA_SECRET_KEY=test_sDZCHKIUGwEiXpsq0REALRWgsdPY9wCGBdYCRvCH4QE/' .env.production
fi

echo "=== Building project ==="
npm run build

echo "=== Restarting application ==="
pm2 restart ogfoody --update-env

echo "=== Checking status ==="
pm2 status

echo "=== DEPLOYMENT COMPLETED ==="
ENDSSH

echo "✅ Deployment finished!"
