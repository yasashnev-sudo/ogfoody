#!/bin/bash
set -e

echo "🚀 Начало деплоя..."

cd "/Users/sergejasasnev/Downloads/my-project (1)"

echo "📤 Коммит изменений..."
git add components/payment-modal.tsx app/api/payments/yookassa/create/route.ts
git commit -m "Исправлены ошибки виджета YooKassa и добавлена поддержка платформ" || true
git push origin main

echo "📥 Деплой на сервер..."
sshpass -p 'pULRoAvF@P-@4Y' ssh -o StrictHostKeyChecking=no root@5.129.194.168 << 'ENDSSH'
cd /var/www/ogfoody
echo "=== Pulling latest code ==="
git fetch origin
git reset --hard origin/main
echo "=== Installing dependencies ==="
npm install
echo "=== Building project ==="
npm run build
echo "=== Restarting application ==="
pm2 restart ogfoody
echo "=== Status ==="
pm2 status ogfoody
echo "=== DEPLOYMENT COMPLETED ==="
ENDSSH

echo "✅ Деплой завершен!"
