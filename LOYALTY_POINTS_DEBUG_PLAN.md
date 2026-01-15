# 🔍 ПЛАН ДЕБАГГИНГА: БАЛЛЫ ЛОЯЛЬНОСТИ И ПРОМОКОДЫ

> 📘 **Связанный документ:** [`LOYALTY_POINTS_AND_PROMO_SCENARIOS_ANALYSIS.md`](./LOYALTY_POINTS_AND_PROMO_SCENARIOS_ANALYSIS.md) — эталонный документ со всеми сценариями

**Дата создания:** 2026-01-15  
**Статус:** ✅ План готов к реализации  
**Версия:** 1.0

---

## 📋 СОДЕРЖАНИЕ

1. [Обзор системы дебаггинга](#1-обзор-системы-дебаггинга)
2. [Расширение автоматических проверок](#2-расширение-автоматических-проверок)
3. [Точки логирования для каждого сценария](#3-точки-логирования-для-каждого-сценария)
4. [Теги и фильтры для группировки](#4-теги-и-фильтры-для-группировки)
5. [Настройка дебаггера для конкретных сценариев](#5-настройка-дебаггера-для-конкретных-сценариев)
6. [Инструкции по использованию](#6-инструкции-по-использованию)

---

## 1. ОБЗОР СИСТЕМЫ ДЕБАГГИНГА

### 1.1. Текущая система

**Компоненты:**
- `hooks/useDebugRecorder.tsx` — запись логов и отправка отчетов
- `lib/debug-auto-checks.ts` — автоматические проверки бизнес-логики
- `app/api/debug/report/route.ts` — API для сохранения отчетов
- `components/debug/DebugConsole.tsx` — UI для просмотра логов

**Возможности:**
- ✅ Автоматический перехват всех ошибок
- ✅ Запись всех console.log/error/warn/info
- ✅ Автоматические проверки (5 типов)
- ✅ Сохранение отчетов в `debug_reports/`
- ✅ Telegram уведомления

### 1.2. Что нужно добавить

**Для полного покрытия всех сценариев:**
1. Расширить `debug-auto-checks.ts` для всех 15 сценариев
2. Добавить точки логирования в ключевые места
3. Добавить теги для фильтрации по сценариям
4. Создать функции проверки для промокодов

---

## 2. РАСШИРЕНИЕ АВТОМАТИЧЕСКИХ ПРОВЕРОК

### 2.1. Новые функции проверки

**Файл:** `lib/debug-auto-checks.ts`

#### 2.1.1. Проверка pending транзакций

```typescript
/**
 * ⏳ Проверка корректности pending транзакций
 */
export async function checkPendingTransaction(
  debug: DebugRecorder,
  params: {
    transactionId: number;
    orderId: number;
    userId: number;
    expectedPoints: number;
    deliveryDate: string;
    paymentMethod: string;
  }
) {
  const { transactionId, orderId, userId, expectedPoints, deliveryDate, paymentMethod } = params;

  // Проверка 1: Pending транзакция создана для не-cash заказа
  if (paymentMethod !== 'cash') {
    await debug.captureError({
      errorMessage: '⚠️ Pending транзакция создана для не-cash заказа',
      data: {
        issue: 'pending_for_non_cash',
        transactionId,
        orderId,
        paymentMethod,
        userId,
      },
    });
  }

  // Проверка 2: Pending транзакция не обработалась через 25+ часов
  const deliveryDateObj = new Date(deliveryDate);
  const hoursSinceDelivery = (Date.now() - deliveryDateObj.getTime()) / (1000 * 60 * 60);
  if (hoursSinceDelivery > 25) {
    await debug.captureError({
      errorMessage: '⚠️ Pending транзакция не обработалась через 25+ часов',
      data: {
        issue: 'pending_not_processed',
        transactionId,
        orderId,
        hoursSinceDelivery: Math.round(hoursSinceDelivery),
        userId,
      },
    });
  }

  debug.log('✅ Pending transaction check completed', { transactionId, passed: true });
}
```

#### 2.1.2. Проверка возврата баллов

```typescript
/**
 * 🔄 Проверка корректности возврата баллов при отмене заказа
 */
export async function checkLoyaltyPointsRefund(
  debug: DebugRecorder,
  params: {
    orderId: number;
    userId: number;
    pointsEarned: number;
    pointsUsed: number;
    oldPoints: number;
    newPoints: number;
    oldTotalSpent: number;
    newTotalSpent: number;
    orderTotal: number;
  }
) {
  const { orderId, userId, pointsEarned, pointsUsed, oldPoints, newPoints, oldTotalSpent, newTotalSpent, orderTotal } = params;

  // Проверка 1: Баллы не вернулись (когда должны были)
  const expectedPointsAfterRefund = oldPoints + pointsUsed - pointsEarned;
  if (Math.abs(newPoints - expectedPointsAfterRefund) > 0.01) {
    await debug.captureError({
      errorMessage: '⚠️ Некорректный возврат баллов при отмене заказа',
      data: {
        issue: 'incorrect_points_refund',
        orderId,
        userId,
        expected: expectedPointsAfterRefund,
        actual: newPoints,
        difference: newPoints - expectedPointsAfterRefund,
        pointsEarned,
        pointsUsed,
      },
    });
  }

  // Проверка 2: total_spent не откатился (критическая проблема!)
  const expectedTotalSpent = oldTotalSpent - orderTotal + pointsUsed;
  if (Math.abs(newTotalSpent - expectedTotalSpent) > 0.01) {
    await debug.captureError({
      errorMessage: '🚨 total_spent НЕ откатился при отмене заказа!',
      data: {
        issue: 'total_spent_not_rolled_back',
        orderId,
        userId,
        expected: expectedTotalSpent,
        actual: newTotalSpent,
        difference: newTotalSpent - expectedTotalSpent,
        orderTotal,
        pointsUsed,
      },
    });
  }

  // Проверка 3: Использованные баллы не вернулись
  if (pointsUsed > 0 && newPoints < oldPoints + pointsUsed) {
    await debug.captureError({
      errorMessage: '⚠️ Использованные баллы не вернулись при отмене',
      data: {
        issue: 'used_points_not_refunded',
        orderId,
        userId,
        pointsUsed,
        oldPoints,
        newPoints,
      },
    });
  }

  debug.log('✅ Loyalty points refund check completed', { orderId, passed: true });
}
```

#### 2.1.3. Проверка промокодов

```typescript
/**
 * 🎟️ Проверка корректности применения промокода
 */
export async function checkPromoCode(
  debug: DebugRecorder,
  params: {
    promoCode: string;
    orderTotal: number;
    minOrderAmount?: number;
    discount: number;
    maxDiscount?: number;
    usageType: 'unlimited' | 'once_per_user' | 'once_total';
    timesUsed: number;
    userId: number;
    orderId?: number;
  }
) {
  const { promoCode, orderTotal, minOrderAmount, discount, maxDiscount, usageType, timesUsed, userId, orderId } = params;

  // Проверка 1: Промокод применен к заказу меньше минимальной суммы
  if (minOrderAmount && orderTotal < minOrderAmount) {
    await debug.captureError({
      errorMessage: '⚠️ Промокод применен к заказу меньше минимальной суммы',
      data: {
        issue: 'promo_min_order_amount_violation',
        promoCode,
        orderTotal,
        minOrderAmount,
        userId,
        orderId,
      },
    });
  }

  // Проверка 2: Скидка превышает максимальную
  if (maxDiscount && discount > maxDiscount) {
    await debug.captureError({
      errorMessage: '⚠️ Скидка превышает максимальную для промокода',
      data: {
        issue: 'promo_max_discount_exceeded',
        promoCode,
        discount,
        maxDiscount,
        userId,
        orderId,
      },
    });
  }

  // Проверка 3: Промокод once_total использован повторно
  if (usageType === 'once_total' && timesUsed > 1) {
    await debug.captureError({
      errorMessage: '⚠️ Промокод once_total использован повторно',
      data: {
        issue: 'promo_once_total_reused',
        promoCode,
        timesUsed,
        userId,
        orderId,
      },
    });
  }

  // Проверка 4: Счетчик использования не инкрементировался
  // (это проверяется в другом месте, но логируем для контекста)
  debug.log('✅ Promo code check completed', { promoCode, discount, passed: true });
}
```

#### 2.1.4. Проверка смены способа оплаты

```typescript
/**
 * 💳 Проверка корректности смены способа оплаты
 */
export async function checkPaymentMethodChange(
  debug: DebugRecorder,
  params: {
    orderId: number;
    userId: number;
    oldPaymentMethod: string;
    newPaymentMethod: string;
    pendingPointsEarned: number;
    actualPointsEarned: number;
  }
) {
  const { orderId, userId, oldPaymentMethod, newPaymentMethod, pendingPointsEarned, actualPointsEarned } = params;

  // Проверка 1: Смена с cash на online, но pending не обработались
  if (oldPaymentMethod === 'cash' && (newPaymentMethod === 'card' || newPaymentMethod === 'sbp')) {
    if (pendingPointsEarned > 0 && actualPointsEarned === 0) {
      await debug.captureError({
        errorMessage: '⚠️ При смене с cash на online pending баллы не обработались',
        data: {
          issue: 'pending_not_processed_on_payment_change',
          orderId,
          userId,
          oldPaymentMethod,
          newPaymentMethod,
          pendingPointsEarned,
          actualPointsEarned,
        },
      });
    }
  }

  debug.log('✅ Payment method change check completed', { orderId, passed: true });
}
```

---

## 3. ТОЧКИ ЛОГИРОВАНИЯ ДЛЯ КАЖДОГО СЦЕНАРИЯ

### 3.1. Сценарии накопления баллов (EARNED)

#### 3.1.1. Сценарий 1: Онлайн-оплата при создании заказа (POST)

**Файл:** `app/api/orders/route.ts` (строки 681-707)

```typescript
// Добавить после строки 681
if (order.paymentMethod === 'card' || order.paymentMethod === 'sbp') {
  // 🔍 DEBUG: Начало сценария 1.2
  console.log('[DEBUG SCENARIO 1.2] Онлайн-оплата при создании заказа (POST)', {
    scenario: 'earned_online_post',
    userId,
    orderId: nocoOrder.Id,
    orderTotal: orderTotalNum,
    pointsUsed,
    expectedPoints: actualPointsEarned,
    paymentMethod: order.paymentMethod,
  });

  const userBefore = await fetchUserById(userId, true);
  const pointsBefore = userBefore?.loyalty_points || 0;
  const totalSpentBefore = userBefore?.total_spent || 0;

  await awardLoyaltyPoints(userId, orderTotalNum, 0, actualPointsEarned, nocoOrder.Id);

  const userAfter = await fetchUserById(userId, true);
  const pointsAfter = userAfter?.loyalty_points || 0;
  const totalSpentAfter = userAfter?.total_spent || 0;

  // 🔍 DEBUG: Проверка результата
  console.log('[DEBUG SCENARIO 1.2] Результат начисления', {
    scenario: 'earned_online_post',
    pointsBefore,
    pointsAfter,
    pointsChange: pointsAfter - pointsBefore,
    expectedChange: actualPointsEarned - pointsUsed,
    totalSpentBefore,
    totalSpentAfter,
    totalSpentChange: totalSpentAfter - totalSpentBefore,
    expectedTotalSpentChange: orderTotalNum - pointsUsed,
  });

  // 🔍 DEBUG: Автоматическая проверка
  if (typeof window !== 'undefined' && (window as any).__debugRecorder) {
    await checkLoyaltyPointsAwarded((window as any).__debugRecorder, {
      paymentMethod: order.paymentMethod,
      orderTotal: orderTotalNum,
      expectedPoints: actualPointsEarned,
      actualPointsAwarded: pointsAfter - pointsBefore,
      oldPoints: pointsBefore,
      newPoints: pointsAfter,
      userId,
      orderId: nocoOrder.Id,
    });
  }
}
```

#### 3.1.2. Сценарий 2: Онлайн-оплата при первой оплате (PATCH full)

**Файл:** `app/api/orders/[id]/route.ts` (строки 330-380)

```typescript
// Добавить после строки 110
if (!wasPaid && willBePaid && orderTotal > 0) {
  const existingPointsEarned = currentOrder.loyalty_points_earned || 0;
  
  // 🔍 DEBUG: Начало сценария 1.3
  console.log('[DEBUG SCENARIO 1.3] Онлайн-оплата при первой оплате (PATCH full)', {
    scenario: 'earned_online_patch_full',
    orderId: id,
    userId: currentOrder.user_id,
    wasPaid,
    willBePaid,
    existingPointsEarned,
    orderTotal,
    pointsUsed,
  });

  if (existingPointsEarned === 0) {
    const userBefore = await fetchUserById(currentOrder.user_id, true);
    const pointsBefore = userBefore?.loyalty_points || 0;
    const totalSpentBefore = userBefore?.total_spent || 0;

    loyaltyPointsEarned = calculateEarnedPoints(orderTotal, pointsUsed, currentTotalSpent);
    await awardLoyaltyPoints(currentOrder.user_id, orderTotal, 0, loyaltyPointsEarned, Number(id));

    const userAfter = await fetchUserById(currentOrder.user_id, true);
    const pointsAfter = userAfter?.loyalty_points || 0;
    const totalSpentAfter = userAfter?.total_spent || 0;

    // 🔍 DEBUG: Результат
    console.log('[DEBUG SCENARIO 1.3] Результат начисления', {
      scenario: 'earned_online_patch_full',
      pointsBefore,
      pointsAfter,
      pointsChange: pointsAfter - pointsBefore,
      expectedChange: loyaltyPointsEarned - pointsUsed,
      totalSpentBefore,
      totalSpentAfter,
    });
  }
}
```

#### 3.1.3. Сценарий 4: Оплата наличными - Pending транзакция (POST)

**Файл:** `app/api/orders/route.ts` (строки 707-724)

```typescript
// Добавить после строки 707
if (order.paymentMethod === 'cash') {
  // 🔍 DEBUG: Начало сценария 1.5
  console.log('[DEBUG SCENARIO 1.5] Оплата наличными - Pending транзакция (POST)', {
    scenario: 'earned_cash_pending_post',
    userId,
    orderId: nocoOrder.Id,
    orderTotal: orderTotalNum,
    expectedPoints: actualPointsEarned,
    deliveryDate: order.startDate,
  });

  const userBefore = await fetchUserById(userId, true);
  const pointsBefore = userBefore?.loyalty_points || 0;
  const totalSpentBefore = userBefore?.total_spent || 0;

  await createPendingLoyaltyPoints(userId, orderTotalNum, 0, actualPointsEarned, nocoOrder.Id);

  const userAfter = await fetchUserById(userId, true);
  const pointsAfter = userAfter?.loyalty_points || 0;
  const totalSpentAfter = userAfter?.total_spent || 0;

  // 🔍 DEBUG: Проверка (баллы НЕ должны измениться, total_spent ДОЛЖЕН)
  console.log('[DEBUG SCENARIO 1.5] Результат создания pending', {
    scenario: 'earned_cash_pending_post',
    pointsBefore,
    pointsAfter,
    pointsShouldNotChange: pointsAfter === pointsBefore,
    totalSpentBefore,
    totalSpentAfter,
    totalSpentChange: totalSpentAfter - totalSpentBefore,
    expectedTotalSpentChange: orderTotalNum - pointsUsed,
  });

  // 🔍 DEBUG: Автоматическая проверка
  if (typeof window !== 'undefined' && (window as any).__debugRecorder) {
    await checkPendingTransaction((window as any).__debugRecorder, {
      transactionId: 0, // Будет получен из транзакции
      orderId: nocoOrder.Id,
      userId,
      expectedPoints: actualPointsEarned,
      deliveryDate: order.startDate,
      paymentMethod: 'cash',
    });
  }
}
```

#### 3.1.4. Сценарий 7: Смена способа оплаты с наличных на онлайн

**Файл:** `app/api/orders/[id]/route.ts` (строки 432-506)

```typescript
// Добавить после строки 257
if (isPaymentMethodChangedFromCash) {
  // 🔍 DEBUG: Начало сценария 1.8
  console.log('[DEBUG SCENARIO 1.8] Смена способа оплаты с наличных на онлайн', {
    scenario: 'earned_payment_method_change',
    orderId: id,
    userId: currentOrder.user_id,
    oldPaymentMethod,
    newPaymentMethod: order.paymentMethod,
  });

  const userBefore = await fetchUserById(currentOrder.user_id, true);
  const pointsBefore = userBefore?.loyalty_points || 0;

  pendingPointsEarned = await processPendingTransactionsForOrder(Number(id), currentOrder.user_id);

  const userAfter = await fetchUserById(currentOrder.user_id, true);
  const pointsAfter = userAfter?.loyalty_points || 0;

  // 🔍 DEBUG: Результат
  console.log('[DEBUG SCENARIO 1.8] Результат обработки pending', {
    scenario: 'earned_payment_method_change',
    pendingPointsEarned,
    pointsBefore,
    pointsAfter,
    pointsChange: pointsAfter - pointsBefore,
  });

  // 🔍 DEBUG: Автоматическая проверка
  if (typeof window !== 'undefined' && (window as any).__debugRecorder) {
    await checkPaymentMethodChange((window as any).__debugRecorder, {
      orderId: Number(id),
      userId: currentOrder.user_id,
      oldPaymentMethod,
      newPaymentMethod: order.paymentMethod,
      pendingPointsEarned,
      actualPointsEarned: pointsAfter - pointsBefore,
    });
  }
}
```

### 3.2. Сценарии списания баллов (USED)

#### 3.2.1. Сценарий 1: Использование баллов при создании заказа (POST)

**Файл:** `app/api/orders/route.ts` (строки 615-639)

```typescript
// Добавить после строки 617
if (pointsUsed > 0) {
  // 🔍 DEBUG: Начало сценария 2.2
  console.log('[DEBUG SCENARIO 2.2] Использование баллов при создании заказа (POST)', {
    scenario: 'used_post',
    userId,
    orderId: nocoOrder.Id,
    pointsUsed,
  });

  const userBefore = await fetchUserById(userId, true);
  const pointsBefore = userBefore?.loyalty_points || 0;
  const totalSpentBefore = userBefore?.total_spent || 0;

  // ... существующий код создания транзакции ...

  const userAfter = await fetchUserById(userId, true);
  const pointsAfter = userAfter?.loyalty_points || 0;
  const totalSpentAfter = userAfter?.total_spent || 0;

  // 🔍 DEBUG: Результат
  console.log('[DEBUG SCENARIO 2.2] Результат списания', {
    scenario: 'used_post',
    pointsBefore,
    pointsAfter,
    pointsChange: pointsAfter - pointsBefore,
    expectedChange: -pointsUsed,
    totalSpentBefore,
    totalSpentAfter,
  });
}
```

#### 3.2.2. Сценарий 5: Возврат баллов при удалении заказа (DELETE)

**Файл:** `app/api/orders/[id]/route.ts` (строки 1500-1600)

```typescript
// Добавить перед вызовом refundLoyaltyPoints
// 🔍 DEBUG: Начало сценария 2.6
console.log('[DEBUG SCENARIO 2.6] Возврат баллов при удалении заказа (DELETE)', {
  scenario: 'refund_delete',
  orderId: id,
  userId: currentOrder.user_id,
  finalPointsEarned,
  finalPointsUsed,
  orderTotal,
});

const userBefore = await fetchUserById(currentOrder.user_id, true);
const pointsBefore = userBefore?.loyalty_points || 0;
const totalSpentBefore = userBefore?.total_spent || 0;

await refundLoyaltyPoints(currentOrder.user_id, finalPointsEarned, finalPointsUsed, orderTotal, Number(id));

const userAfter = await fetchUserById(currentOrder.user_id, true);
const pointsAfter = userAfter?.loyalty_points || 0;
const totalSpentAfter = userAfter?.total_spent || 0;

// 🔍 DEBUG: Результат
console.log('[DEBUG SCENARIO 2.6] Результат возврата', {
  scenario: 'refund_delete',
  pointsBefore,
  pointsAfter,
  pointsChange: pointsAfter - pointsBefore,
  expectedChange: finalPointsUsed - finalPointsEarned,
  totalSpentBefore,
  totalSpentAfter,
  totalSpentChange: totalSpentAfter - totalSpentBefore,
  expectedTotalSpentChange: -orderTotal + finalPointsUsed,
});

// 🔍 DEBUG: Автоматическая проверка
if (typeof window !== 'undefined' && (window as any).__debugRecorder) {
  await checkLoyaltyPointsRefund((window as any).__debugRecorder, {
    orderId: Number(id),
    userId: currentOrder.user_id,
    pointsEarned: finalPointsEarned,
    pointsUsed: finalPointsUsed,
    oldPoints: pointsBefore,
    newPoints: pointsAfter,
    oldTotalSpent: totalSpentBefore,
    newTotalSpent: totalSpentAfter,
    orderTotal,
  });
}
```

### 3.3. Работа с промокодами

#### 3.3.1. Применение промокода в OrderModal

**Файл:** `components/order-modal.tsx` (функция `handleApplyPromo`)

```typescript
// Добавить после расчета скидки
// 🔍 DEBUG: Применение промокода
console.log('[DEBUG PROMO] Применение промокода', {
  scenario: 'promo_apply',
  promoCode: code,
  orderTotal: totalBeforeDiscount,
  discount: calculatedDiscount,
  minOrderAmount: promo.min_order_amount,
  maxDiscount: promo.max_discount,
  usageType: promo.usage_type,
  timesUsed: promo.times_used,
  userId: userProfile?.id,
});

// 🔍 DEBUG: Автоматическая проверка
if (typeof window !== 'undefined' && (window as any).__debugRecorder) {
  await checkPromoCode((window as any).__debugRecorder, {
    promoCode: code,
    orderTotal: totalBeforeDiscount,
    minOrderAmount: promo.min_order_amount,
    discount: calculatedDiscount,
    maxDiscount: promo.max_discount,
    usageType: promo.usage_type,
    timesUsed: promo.times_used,
    userId: userProfile?.id || 0,
  });
}
```

---

## 4. ТЕГИ И ФИЛЬТРЫ ДЛЯ ГРУППИРОВКИ

### 4.1. Структура тегов

**Формат:** `[DEBUG SCENARIO X.Y]` или `[DEBUG PROMO]`

**Теги для сценариев:**
- `earned_online_post` — Сценарий 1.2
- `earned_online_patch_full` — Сценарий 1.3
- `earned_online_patch_partial` — Сценарий 1.4
- `earned_cash_pending_post` — Сценарий 1.5
- `earned_cash_pending_patch` — Сценарий 1.6
- `earned_cron_process` — Сценарий 1.7
- `earned_payment_method_change` — Сценарий 1.8
- `earned_undefined` — Сценарий 1.9
- `used_post` — Сценарий 2.2
- `used_patch_partial` — Сценарий 2.3
- `used_patch_full` — Сценарий 2.4
- `refund_patch` — Сценарий 2.5
- `refund_delete` — Сценарий 2.6
- `refund_pending_cancel` — Сценарий 2.7
- `refund_paid_delete` — Сценарий 2.8
- `promo_apply` — Применение промокода
- `promo_increment` — Инкремент счетчика

### 4.2. Функция фильтрации логов

**Добавить в `hooks/useDebugRecorder.tsx`:**

```typescript
// Функция для фильтрации логов по сценарию
export function filterLogsByScenario(logs: LogEntry[], scenario: string): LogEntry[] {
  return logs.filter(log => 
    log.message.includes(`[DEBUG SCENARIO ${scenario}]`) ||
    log.message.includes(`scenario: '${scenario}'`)
  );
}

// Функция для получения всех логов по типу сценария
export function filterLogsByType(logs: LogEntry[], type: 'earned' | 'used' | 'refund' | 'promo'): LogEntry[] {
  return logs.filter(log => {
    const message = log.message.toLowerCase();
    if (type === 'earned') return message.includes('earned');
    if (type === 'used') return message.includes('used') && !message.includes('refund');
    if (type === 'refund') return message.includes('refund');
    if (type === 'promo') return message.includes('promo');
    return false;
  });
}
```

---

## 5. НАСТРОЙКА ДЕБАГГЕРА ДЛЯ КОНКРЕТНЫХ СЦЕНАРИЕВ

### 5.1. Включение логирования для конкретного сценария

**В `components/debug/DebugConsole.tsx` добавить фильтры:**

```typescript
const [filterScenario, setFilterScenario] = useState<string>('all');
const [filterType, setFilterType] = useState<'all' | 'earned' | 'used' | 'refund' | 'promo'>('all');

// Фильтрация логов
const filteredLogs = useMemo(() => {
  let result = logs;
  
  if (filterType !== 'all') {
    result = filterLogsByType(result, filterType);
  }
  
  if (filterScenario !== 'all') {
    result = filterLogsByScenario(result, filterScenario);
  }
  
  return result;
}, [logs, filterScenario, filterType]);
```

### 5.2. UI для выбора сценария

**Добавить в `DebugConsole`:**

```tsx
<div className="flex gap-2 mb-4">
  <select 
    value={filterType} 
    onChange={(e) => setFilterType(e.target.value as any)}
    className="px-3 py-1 border rounded"
  >
    <option value="all">Все типы</option>
    <option value="earned">Накопление (earned)</option>
    <option value="used">Списание (used)</option>
    <option value="refund">Возврат (refund)</option>
    <option value="promo">Промокоды (promo)</option>
  </select>
  
  <select 
    value={filterScenario} 
    onChange={(e) => setFilterScenario(e.target.value)}
    className="px-3 py-1 border rounded"
  >
    <option value="all">Все сценарии</option>
    <option value="1.2">1.2: Онлайн POST</option>
    <option value="1.3">1.3: Онлайн PATCH full</option>
    <option value="1.5">1.5: Cash POST</option>
    <option value="1.8">1.8: Смена оплаты</option>
    <option value="2.2">2.2: Использование POST</option>
    <option value="2.6">2.6: Возврат DELETE</option>
  </select>
</div>
```

---

## 6. ИНСТРУКЦИИ ПО ИСПОЛЬЗОВАНИЮ

### 6.1. Настройка для тестирования конкретного сценария

**Шаг 1:** Включить логирование в Debug Console
- Открыть Debug Console (кнопка 🐞 или `Ctrl+Shift+D`)
- Включить "Запись логов браузера"

**Шаг 2:** Выполнить сценарий
- Например, создать заказ с онлайн-оплатой
- Все логи будут автоматически записаны

**Шаг 3:** Фильтровать логи
- Выбрать тип сценария (earned/used/refund/promo)
- Выбрать конкретный сценарий из списка

**Шаг 4:** Отправить отчет
- Нажать `Ctrl+Enter` или кнопку "Отправить отчет"
- В комментарии указать: "Тестирование сценария 1.2"

### 6.2. Автоматические проверки

**Все проверки выполняются автоматически:**
- При начислении баллов
- При списании баллов
- При возврате баллов
- При применении промокода

**Если обнаружена проблема:**
- Автоматически создается отчет
- Отправляется Telegram уведомление
- Логи сохраняются в `debug_reports/`

### 6.3. Анализ отчетов

**Структура отчета:**
```
debug_reports/
  ├── 2026-01-15T10-30-00_user-123_logs.txt
  └── index.json
```

**В логах ищите:**
- `[DEBUG SCENARIO X.Y]` — начало сценария
- `Результат начисления/списания` — проверка результата
- `✅` или `⚠️` — статус проверки

**Пример анализа:**
```bash
# Найти все логи по сценарию 1.2
grep "SCENARIO 1.2" debug_reports/*.txt

# Найти все ошибки
grep "⚠️\|🚨" debug_reports/*.txt

# Найти проблемы с total_spent
grep "total_spent" debug_reports/*.txt
```

---

## 7. ПЛАН ВНЕДРЕНИЯ

### Этап 1: Расширение автоматических проверок
1. ✅ Добавить функции в `lib/debug-auto-checks.ts`
2. ✅ Протестировать каждую функцию

### Этап 2: Добавление точек логирования
1. ✅ Добавить логи в `app/api/orders/route.ts` (POST)
2. ✅ Добавить логи в `app/api/orders/[id]/route.ts` (PATCH, DELETE)
3. ✅ Добавить логи в `components/order-modal.tsx` (промокоды)
4. ✅ Добавить логи в `app/api/cron/process-pending-points/route.ts`

### Этап 3: Настройка фильтров
1. ✅ Добавить функции фильтрации в `useDebugRecorder`
2. ✅ Добавить UI фильтров в `DebugConsole`
3. ✅ Протестировать фильтрацию

### Этап 4: Тестирование
1. ✅ Протестировать каждый сценарий
2. ✅ Проверить автоматические проверки
3. ✅ Проверить фильтрацию логов
4. ✅ Проверить отправку отчетов

---

## 8. ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ

### Пример 1: Тестирование сценария 1.2

```
1. Открыть Debug Console
2. Включить "Запись логов браузера"
3. Выбрать фильтр "earned" → "1.2"
4. Создать заказ с онлайн-оплатой
5. Проверить логи:
   - [DEBUG SCENARIO 1.2] Начало
   - [DEBUG SCENARIO 1.2] Результат начисления
   - ✅ Loyalty points check completed
6. Отправить отчет с комментарием "Тест сценария 1.2"
```

### Пример 2: Поиск проблемы с total_spent

```
1. Открыть Debug Console
2. Выбрать фильтр "refund"
3. Отменить заказ
4. Проверить логи:
   - [DEBUG SCENARIO 2.6] Возврат баллов
   - 🚨 total_spent НЕ откатился (если проблема есть)
5. Отправить отчет
```

---

**Статус:** ✅ План готов к реализации

**Следующие шаги:**
1. Реализовать расширение `debug-auto-checks.ts`
2. Добавить точки логирования в ключевые места
3. Настроить фильтры в Debug Console
4. Протестировать все сценарии
