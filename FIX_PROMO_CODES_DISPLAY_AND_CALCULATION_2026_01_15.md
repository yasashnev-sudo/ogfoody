# Исправление отображения промокодов и расчета баллов

**Дата:** 2026-01-15  
**Проблема:** Промокод не отображается в окне заказа, в статистике 0 заказов с промокодом, баллы начисляются неправильно

## Проблемы

1. **Промокод не сохранялся в заказе** при создании через PaymentModal
2. **Промокод не отображался** в блоке "Информация о заказе"
3. **В статистике показывалось 0** заказов с промокодом
4. **Баллы начислялись неправильно** - не учитывался промокод при расчете `orderTotal`

## Исправления

### 1. Расчет `finalTotal` с учетом промокода

**Файл:** `app/api/orders/route.ts`

```typescript
// БЫЛО:
const finalTotal = calculatedTotal + deliveryFee

// СТАЛО:
const promoDiscount = order.promoDiscount || 0
const finalTotal = calculatedTotal + deliveryFee - promoDiscount
```

**Результат:** Итоговая сумма заказа теперь правильно рассчитывается с учетом промокода.

### 2. Сохранение промокода при обновлении заказа

**Файл:** `app/api/orders/route.ts`

```typescript
await updateOrder(nocoOrder.Id, {
  subtotal: calculatedTotal,
  total: finalTotal,
  delivery_fee: deliveryFee,
  delivery_district: deliveryDistrict,
  delivery_address: deliveryAddress,
  promo_code: order.promoCode, // ✅ ДОБАВЛЕНО
  promo_discount: promoDiscount, // ✅ ДОБАВЛЕНО
})
```

**Результат:** Промокод сохраняется в базе данных при создании заказа.

### 3. Передача промокода в `handleAutoCheckout`

**Файл:** `app/page.tsx`

```typescript
const updatedOrder: Order = {
  ...(shouldCreateNewOrder ? pendingCheckout.order : lastOrder),
  deliveryFee,
  deliveryDistrict: district,
  deliveryAddress: `${userProfile.street}, ${userProfile.building}${userProfile.apartment ? ', кв. ' + userProfile.apartment : ''}`,
  subtotal: pendingCheckout.order.subtotal || pendingCheckout.total,
  total: (pendingCheckout.order.subtotal || pendingCheckout.total) + deliveryFee - (pendingCheckout.order.promoDiscount || 0), // ✅ ИСПРАВЛЕНО
  promoCode: pendingCheckout.order.promoCode, // ✅ ДОБАВЛЕНО
  promoDiscount: pendingCheckout.order.promoDiscount, // ✅ ДОБАВЛЕНО
}
```

**Результат:** Промокод передается при создании нового заказа через автооформление.

### 4. Передача промокода при оплате

**Файл:** `app/page.tsx`

```typescript
body: JSON.stringify({
  order: {
    paid: isPaid,
    paidAt: isPaid ? new Date().toISOString() : undefined,
    paymentStatus: paymentStatus,
    paymentMethod: paymentMethod,
    loyaltyPointsUsed: pointsUsed,
    promoCode: order.promoCode, // ✅ ДОБАВЛЕНО
    promoDiscount: order.promoDiscount, // ✅ ДОБАВЛЕНО
  },
}),
```

**Результат:** Промокод сохраняется при оплате заказа.

### 5. Сохранение промокода в состояние после оплаты

**Файл:** `app/page.tsx`

```typescript
promoCode: updatedOrderFromAPI.promo_code || 
          updatedOrderFromAPI["Promo Code"] || 
          order.promoCode,
promoDiscount: updatedOrderFromAPI.promo_discount || 
               updatedOrderFromAPI["Promo Discount"] || 
               order.promoDiscount || 0,
```

**Результат:** Промокод отображается в UI после оплаты.

### 6. Проверка промокода при расчете `orderTotal` в PATCH

**Файл:** `app/api/orders/[id]/route.ts`

```typescript
// ✅ ИСПРАВЛЕНО: Проверяем, что orderTotal учитывает промокод
if (orderTotal > 0) {
  const promoDiscount = typeof currentOrder.promo_discount === 'number'
    ? currentOrder.promo_discount
    : typeof (currentOrder as any)['Promo Discount'] === 'number'
    ? (currentOrder as any)['Promo Discount']
    : parseFloat(String(currentOrder.promo_discount || (currentOrder as any)['Promo Discount'] || 0)) || 0
  
  // Если промокод есть, но total не учитывает его, пересчитываем
  if (promoDiscount > 0) {
    const expectedTotal = subtotal + deliveryFee - promoDiscount
    if (Math.abs(orderTotal - expectedTotal) > 0.01) {
      console.log(`⚠️ orderTotal не учитывает промокод, пересчитываем: ${orderTotal} → ${expectedTotal}`)
      orderTotal = expectedTotal
    }
  }
}
```

**Результат:** Баллы начисляются правильно с учетом промокода.

### 7. Учет промокода при расчете `total` для PaymentModal

**Файл:** `app/page.tsx`

```typescript
// ✅ ИСПРАВЛЕНО: Учитываем промокод при расчете total для PaymentModal
const promoDiscount = pendingCheckout.order.promoDiscount || 0
const totalForPayment = (pendingCheckout.order.subtotal || pendingCheckout.total) + deliveryFee - promoDiscount
setPaymentOrder({ 
  order: updatedOrder, 
  total: totalForPayment,
  isNewOrder: true
})
```

**Результат:** Правильная сумма к оплате отображается в PaymentModal.

## Результаты тестирования

### Тест полного цикла промокода

```
✅ Промокод создан
✅ Заказ создан с промокодом
✅ Промокод правильно сохранен в заказе
✅ Баллы начислены правильно (с учетом промокода)
✅ Статистика показывает заказы с промокодом
```

### Проверка заказа #584

- **Промокод:** null (не был применен при создании)
- **Баллы:** 172 (начислены правильно на сумму 3448₽)
- **Статус:** Баллы начислены корректно, но промокод не был применен

## Выводы

1. **Промокод теперь сохраняется** при создании заказа через API
2. **Промокод отображается** в блоке "Информация о заказе"
3. **Статистика работает** - показывает заказы с промокодом
4. **Баллы начисляются правильно** - учитывается промокод при расчете `orderTotal`

## Рекомендации

1. **Для заказа #584:** Промокод не был применен при создании. Это может быть связано с тем, что заказ был создан до исправлений или промокод не был передан из UI.

2. **Мониторинг:** Следить за логами в `onRequestAuth` для проверки передачи промокода из OrderModal.

3. **Тестирование:** Использовать `test-promo-full-cycle.sh` для проверки полного цикла промокода.

## Файлы изменены

- `app/api/orders/route.ts` - расчет finalTotal и сохранение промокода
- `app/api/orders/[id]/route.ts` - проверка промокода при расчете баллов
- `app/page.tsx` - передача промокода в handleAutoCheckout, handlePaymentComplete, расчет total для PaymentModal
- `components/order-modal.tsx` - инициализация промокода из existingOrder (исправлено ранее)

## Commit hashes

- `df1ad249` - исправлено сохранение промокода и расчет баллов
- `61fc0abe` - добавлена проверка промокода при расчете orderTotal в PATCH
- `354a7208` - промокод учитывается при расчете total для PaymentModal
- `d333d988` - добавлено логирование промокода в onRequestAuth
