# 🚀 СРОЧНЫЙ ДЕПЛОЙ - Исправления виджета YooKassa

## ✅ Изменения готовы:
- `app/api/payments/yookassa/create/route.ts` - исправлена обработка типов confirmation
- `components/payment-modal.tsx` - добавлена поддержка платформ и исправлены ошибки

## 📋 Выполните команды:

```bash
cd "/Users/sergejasasnev/Downloads/my-project (1)"

# 1. Коммит и push
git add components/payment-modal.tsx app/api/payments/yookassa/create/route.ts
git commit -m "Исправлены ошибки виджета YooKassa и добавлена поддержка платформ"
git push origin main

# 2. Деплой на сервер
expect deploy-payment-fix.expect
```

## 🔧 Или через SSH напрямую:

```bash
ssh root@5.129.194.168
# Пароль: pULRoAvF@P-@4Y

cd /var/www/ogfoody
git fetch origin
git reset --hard origin/main
npm install
npm run build
pm2 restart ogfoody
pm2 status ogfoody
```

## ✅ После деплоя проверьте:
1. Откройте https://ogfoody.ru
2. Попробуйте создать заказ и оплатить
3. Проверьте логи: `pm2 logs ogfoody --lines 50`
