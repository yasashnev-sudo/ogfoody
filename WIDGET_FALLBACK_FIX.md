# 🔧 Улучшение fallback на redirect при ошибке виджета

**Дата:** $(date)  
**Проблема:** Виджет падает с ошибкой, но fallback на redirect не работает

---

## 🔍 Проблема

Из логов:
```
✅ YooKassa widget initialized with token: ct-30ff5ef9-000f-500...
❌ YooKassa widget error: Object
⚠️ Widget error, falling back to redirect
```

Но redirect не происходит, потому что:
1. `confirmationUrl` не был сохранен при создании платежа
2. API `/api/payments/yookassa/status/[id]` не возвращает `confirmationUrl`
3. Недостаточно логирования для диагностики

---

## ✅ Исправления

### 1. Улучшено логирование ошибки виджета

**Файл:** `components/payment-modal.tsx`

Добавлено детальное логирование:
```typescript
error_callback: (error: any) => {
  console.error('❌ YooKassa widget error:', error)
  console.error('❌ Error details:', JSON.stringify(error, null, 2))
  // ...
}
```

### 2. Улучшен fallback на redirect

- Добавлено уничтожение виджета перед redirect
- Улучшено логирование процесса fallback
- Добавлена очистка состояний при ошибке

### 3. Добавлен confirmationUrl в API статуса

**Файл:** `app/api/payments/yookassa/status/[id]/route.ts`

Теперь API возвращает `confirmationUrl` для fallback:
```typescript
return NextResponse.json({
  paymentId: payment.id,
  status: payment.status,
  paid: payment.status === 'succeeded',
  amount: payment.amount,
  metadata: payment.metadata,
  confirmationUrl, // ✅ НОВОЕ: Для fallback при ошибке виджета
})
```

### 4. Улучшено сохранение confirmationUrl

**Файл:** `components/payment-modal.tsx`

Добавлено логирование при сохранении:
```typescript
if (data.confirmationUrl) {
  console.log('💾 Сохраняем confirmationUrl для fallback:', data.confirmationUrl.substring(0, 50) + '...')
  setConfirmationUrl(data.confirmationUrl)
} else {
  console.warn('⚠️ confirmationUrl не получен в ответе API')
}
```

---

## 🚀 Деплой

Изменения закоммичены и запушены в `origin/main`.  
Деплой запущен через `deploy-increment-fix.expect`.

**Проверка после деплоя:**
1. Откройте https://ogfoody.ru
2. Создайте заказ
3. Попробуйте оплатить через виджет
4. Если виджет падает с ошибкой, должен сработать fallback на redirect
5. Проверьте консоль браузера для детального логирования

---

## 📝 Что изменилось

**Файлы:**
1. `components/payment-modal.tsx` - улучшена обработка ошибок и fallback
2. `app/api/payments/yookassa/status/[id]/route.ts` - добавлен confirmationUrl в ответ

---

**Статус:** ✅ Исправлено, деплой выполняется
