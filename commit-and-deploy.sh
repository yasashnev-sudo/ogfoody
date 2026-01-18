#!/bin/bash
cd "/Users/sergejasasnev/Downloads/my-project (1)"
git add components/payment-modal.tsx app/api/payments/yookassa/create/route.ts
git commit -m "Исправлены ошибки виджета YooKassa и добавлена поддержка платформ"
git push origin main
echo "✅ Git operations completed"
expect deploy-to-production.expect
