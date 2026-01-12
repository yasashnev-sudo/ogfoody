# КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Двойное начисление баллов

**Дата**: 2026-01-09  
**Проблема**: При изменении способа оплаты с наличных на карту/СБП баллы начислялись **дважды**

## Обнаруженная проблема

Пользователь создал заказ #309 с оплатой наличными (создалась pending транзакция на +75 баллов), затем изменил способ оплаты на карту. В результате:

1. **Pending транзакция обработалась** (ID=357): +75 баллов
2. **Создалась НОВАЯ транзакция** (ID=360): +75 баллов

**Итог**: +150 баллов вместо +75!

## Причина

В PATCH endpoint (`app/api/orders/[id]/route.ts`) **порядок выполнения был неправильный**:

### ДО исправления:

```typescript
// 1. СНАЧАЛА проверялось: !wasPaid && willBePaid
if (!wasPaid && willBePaid && currentOrder.user_id) {
  if (existingPointsEarned > 0) {
    // Защита сработает
  } else {
    // ❌ Для заказа за наличные loyalty_points_earned = 0!
    // Потому что баллы в статусе pending, не записаны в поле заказа
    await awardLoyaltyPoints(...)  // Создается НОВАЯ транзакция
  }
}

// 2. ПОТОМ проверялось: изменился ли способ оплаты
if (oldPaymentMethod === 'cash' && (newMethod === 'card' || 'sbp')) {
  await processPendingTransactionsForOrder(...)  // Обрабатывается pending
}
```

**Результат**: Обе функции выполнялись, создавая дубликат транзакции!

## Решение

### 1. Добавлена проверка способа оплаты ДО начисления баллов

```typescript
// ✅ СНАЧАЛА определяем, был ли заказ за наличные
const oldPaymentMethod = currentOrder.payment_method || (currentOrder as any)["Payment Method"]
const isPaymentMethodChangedFromCash = oldPaymentMethod === 'cash' && 
  order?.paymentMethod && 
  (order.paymentMethod === 'card' || order.paymentMethod === 'sbp')

// Начисление баллов при оплате заказа
if (!wasPaid && willBePaid && currentOrder.user_id) {
  if (existingPointsEarned > 0) {
    // Баллы уже начислены
  } else if (isPaymentMethodChangedFromCash) {
    // ✅ НОВАЯ ЗАЩИТА: Если был cash → card/sbp,
    // НЕ начисляем новые баллы, только обрабатываем pending ниже
    console.log(`Pending транзакции будут обработаны ниже, новые баллы НЕ начисляем.`)
    loyaltyPointsEarned = 0
  } else {
    // Только для заказов, которые не были за наличные
    await awardLoyaltyPoints(...)
  }
}

// ✅ Обрабатываем pending транзакции для cash → card/sbp
if (isPaymentMethodChangedFromCash) {
  pendingPointsEarned = await processPendingTransactionsForOrder(...)
  if (pendingPointsEarned > 0) {
    loyaltyPointsEarned = pendingPointsEarned // Используем из pending
  }
}
```

### 2. Исправлен баланс пользователя

Создана компенсирующая транзакция для удаления дубликата:
- **ID=362**: `type=cancelled`, `points=-75`, `description="Корректировка: удаление дублирующегося начисления баллов"`

## Логика работы

### Сценарий 1: Новый заказ с оплатой картой/СБП
1. `!wasPaid && willBePaid` = TRUE
2. `isPaymentMethodChangedFromCash` = FALSE (нет старого заказа)
3. ✅ Вызывается `awardLoyaltyPoints` → создается транзакция `earned`

### Сценарий 2: Новый заказ с оплатой наличными
1. POST /api/orders создает pending транзакцию
2. Баллы не начисляются сразу

### Сценарий 3: Изменение cash → card/sbp (ИСПРАВЛЕНО)
1. `!wasPaid && willBePaid` = TRUE
2. `isPaymentMethodChangedFromCash` = TRUE
3. ✅ **НЕ** вызывается `awardLoyaltyPoints`
4. ✅ Вызывается `processPendingTransactionsForOrder` → pending транзакция становится completed

### Сценарий 4: Оплата существующего заказа (не меняя способ оплаты)
1. `!wasPaid && willBePaid` = TRUE
2. `isPaymentMethodChangedFromCash` = FALSE
3. ✅ Вызывается `awardLoyaltyPoints`

## Измененные файлы

- `app/api/orders/[id]/route.ts` (строки 177-233, 265-284)

## Транзакции до исправления

```
ID=357 | Order=309 | earned    | +75 | pending → completed ✅
ID=360 | Order=309 | earned    | +75 | NEW (дубликат!) ❌
```

## Транзакции после исправления

```
ID=357 | Order=309 | earned    | +75 | pending → completed ✅
ID=362 | Order=309 | cancelled | -75 | Корректировка ✅
```

## Тестирование

### Тест 1: Создание заказа за наличные, затем оплата картой

1. Создать заказ за наличные → pending транзакция создана
2. Изменить способ оплаты на карту
3. **Ожидаемый результат**: Только 1 транзакция `earned`, баллы начислены 1 раз
4. **Проверить в БД**: Должна быть 1 транзакция type=earned для этого заказа

### Тест 2: Создание заказа с оплатой картой сразу

1. Создать заказ с оплатой картой
2. **Ожидаемый результат**: 1 транзакция `earned`, баллы начислены сразу
3. **Проверить в БД**: Должна быть 1 транзакция type=earned для этого заказа

## Важное примечание

Этот баг затрагивал **только** сценарий изменения способа оплаты с `cash` на `card/sbp`. Другие сценарии работали правильно.

## История

- **2026-01-09 13:11**: Заказ #309 создан за наличные (pending транзакция ID=357)
- **2026-01-09 13:12**: Способ оплаты изменен на карту
- **2026-01-09 13:12:22**: Создана НОВАЯ транзакция ID=360 (БАГ!)
- **2026-01-09 13:12:26**: Pending транзакция ID=357 обработана
- **2026-01-09 13:15**: Создана корректировка ID=362 (-75 баллов)
- **2026-01-09 13:20**: Код исправлен



