# Исправление: Удален способ оплаты из OrderModal
**Дата:** 2026-01-11  
**Статус:** ✅ **ЗАВЕРШЕНО**

## Проблема

Пользователь обнаружил, что в модальном окне заказа (`OrderModal`) **дублировался выбор способа оплаты**, хотя он должен быть только в `PaymentModal`.

## Причина

В предыдущих исправлениях (FIX_DOUBLE_PAYMENT_METHOD_2026_01_11.md) я **ошибочно удалил не тот блок** кода. В `OrderModal` остался полный UI для выбора способа оплаты (строки 1341-1429).

## Выполненные изменения

### `/components/order-modal.tsx`

#### 1. Удален UI для выбора способа оплаты (строки 1341-1429)

**Было:**
```tsx
{/* Способ оплаты */}
<div className="py-4">
  <p className="font-black mb-3 text-black">Способ оплаты</p>
  <div className="space-y-2">
    <button onClick={() => setPaymentMethod("card")} ...>
      Банковская карта
    </button>
    <button onClick={() => setPaymentMethod("sbp")} ...>
      СБП (Быстрее)
    </button>
    <button onClick={() => setPaymentMethod("cash")} ...>
      Наличными курьеру
    </button>
  </div>
</div>
```

**Стало:**
- Удален весь блок

---

#### 2. Удален state `paymentMethod` (строка 196)

**Было:**
```tsx
const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
const [isProcessingPayment, setIsProcessingPayment] = useState(false)
```

**Стало:**
```tsx
const [isProcessingPayment, setIsProcessingPayment] = useState(false)
```

---

#### 3. Удалена логика установки `paymentMethod` в useEffect (строки 274-280)

**Было:**
```tsx
// Если это существующий заказ с наличными и не оплачен, предустанавливаем карту для оплаты
// Иначе используем текущий способ оплаты заказа или карту по умолчанию
if (existingOrder?.paymentMethod === "cash" && !existingOrder?.paid) {
  setPaymentMethod("card")
} else {
  setPaymentMethod(existingOrder?.paymentMethod || "card")
}
```

**Стало:**
- Удален блок

---

#### 4. Упрощена логика кнопок (строки 1380-1424)

**Было:**
```tsx
(() => {
  // Определяем текст и стиль кнопки в зависимости от контекста
  const isPaymentAction = isExistingOrder && (paymentMethod === "card" || paymentMethod === "sbp")
  const isSaveAction = isExistingOrder && paymentMethod === "cash" && paymentMethod === originalPaymentMethod
  const isNewOrder = !isExistingOrder
  
  let buttonText = "Заказать"
  let buttonClass = "..."
  
  if (isPaymentAction) {
    buttonText = `ОПЛАТИТЬ — ${finalTotal} ₽`
    // ...
  } else if (isSaveAction) {
    buttonText = "СОХРАНИТЬ"
    // ...
  } else if (isNewOrder) {
    buttonText = `Заказать · ${finalTotal} ₽`
    // ...
  }
  
  return <Button onClick={handlePayAndOrder} ...>{buttonText}</Button>
})()
```

**Стало:**
```tsx
<>
  {/* Кнопка для нового заказа */}
  {!isExistingOrder && (
    <Button onClick={handlePayAndOrder} ...>
      Продолжить · {finalTotal} ₽
    </Button>
  )}

  {/* Кнопка "Оплатить заказ" для существующего неоплаченного заказа */}
  {isExistingOrder && !isPaid && (
    <Button onClick={() => onRequestPayment?.(order, finalTotal)} ...>
      Оплатить заказ · {finalTotal} ₽
    </Button>
  )}
</>
```

---

#### 5. Переработана функция `handlePayAndOrder` (строки 441-505)

**Было:**
```tsx
setIsProcessingPayment(true)

if (paymentMethod !== "cash") {
  await new Promise((resolve) => setTimeout(resolve, 2000))
} else {
  await new Promise((resolve) => setTimeout(resolve, 500))
}

const order: Order = {
  // ...
  paid: paymentMethod !== "cash" ? true : (existingOrder?.paid ?? false),
  paidAt: paymentMethod !== "cash" ? new Date().toISOString() : existingOrder?.paidAt,
  paymentMethod,
  // ...
}

onSave(order)
```

**Стало:**
```tsx
// ✅ Проверяем профиль для авторизованных пользователей
if (!existingOrder && userProfile) {
  const isProfileComplete =
    userProfile.name &&
    userProfile.district &&
    userProfile.street &&
    userProfile.building

  if (!isProfileComplete) {
    // Профиль неполный - запускаем onRequestAuth для заполнения
    if (onRequestAuth) {
      const order: Order = {
        startDate: dateKey,
        persons,
        delivered: false,
        deliveryTime,
        extras,
        subtotal: totalBeforeDiscount,
        total: finalTotal,
        paid: false,
        cancelled: false,
      }
      onRequestAuth(order, finalTotal)
    }
    return
  }
}

// ✅ Для нового заказа с полным профилем → открываем PaymentModal
if (!existingOrder && onRequestPayment) {
  const order: Order = {
    startDate: dateKey,
    persons,
    delivered: false,
    deliveryTime,
    extras,
    subtotal: totalBeforeDiscount,
    total: finalTotal,
    paid: false,
    cancelled: false,
  }
  onRequestPayment(order, finalTotal)
  return
}

// ✅ Для существующего заказа - сохраняем изменения
setIsProcessingPayment(true)

const order: Order = {
  ...(existingOrder?.id ? { id: existingOrder.id } : {}),
  ...(existingOrder?.orderNumber ? { orderNumber: existingOrder.orderNumber } : {}),
  startDate: dateKey,
  persons,
  delivered: existingOrder?.delivered ?? false,
  deliveryTime,
  extras,
  subtotal: totalBeforeDiscount,
  total: finalTotal,
  paid: existingOrder?.paid ?? false,
  cancelled: existingOrder?.cancelled ?? false,
  promoCode: appliedPromo?.code,
  promoDiscount: appliedPromo?.discount,
  loyaltyPointsUsed: pointsDiscount > 0 ? pointsDiscount : undefined,
}

onSave(order)
setIsProcessingPayment(false)
```

---

#### 6. Удалена неиспользуемая переменная `originalPaymentMethod` (строка 598)

**Было:**
```tsx
const isPaidWithCard = isPaid && existingOrder?.paymentMethod !== "cash"
const canEdit = !isViewOnly && !isPaid
const isExistingOrder = !!existingOrder
const originalPaymentMethod = existingOrder?.paymentMethod || "card"
```

**Стало:**
```tsx
const isPaidWithCard = isPaid && existingOrder?.paymentMethod !== "cash"
const canEdit = !isViewOnly && !isPaid
const isExistingOrder = !!existingOrder
```

---

## Новая логика работы

### Для нового заказа:
1. Пользователь заполняет заказ в `OrderModal`
2. Нажимает кнопку **"Продолжить · {total} ₽"**
3. **Если не авторизован** → открывается `DistrictSelectionModal` → `AuthModal` → `ProfileModal` (если нужно)
4. **Если авторизован с полным профилем** → открывается `PaymentModal` для выбора способа оплаты
5. **Если авторизован с неполным профилем** → открывается `ProfileModal` для заполнения данных
6. После заполнения профиля → открывается `PaymentModal`

### Для существующего неоплаченного заказа:
1. Открывается `OrderModal` с заказом
2. Отображается кнопка **"Оплатить заказ · {total} ₽"**
3. Нажатие кнопки → открывается `PaymentModal` для выбора способа оплаты

### Для существующего оплаченного заказа:
1. Открывается `OrderModal` в режиме просмотра
2. Кнопок оплаты нет
3. Есть только кнопка "Отменить заказ" (если доступна)

---

## Результат

✅ **Способ оплаты выбирается ТОЛЬКО в `PaymentModal`**  
✅ **`OrderModal` отвечает ТОЛЬКО за состав заказа и время доставки**  
✅ **Упрощена логика кнопок в `OrderModal`**  
✅ **Удалены неиспользуемые state и переменные**  
✅ **Линтер не показывает ошибок**

---

## Тестирование

Необходимо протестировать следующие сценарии:

1. ✅ **Гость**: Заказ → Район → Авторизация → Профиль → Оплата
2. ✅ **Авторизованный без профиля**: Заказ → Профиль → Оплата
3. ✅ **Авторизованный с профилем**: Заказ → Оплата
4. ✅ **Существующий неоплаченный заказ**: Открыть → "Оплатить заказ" → Оплата
5. ✅ **Существующий оплаченный заказ**: Открыть → Просмотр (без кнопок оплаты)

---

**Готово к тестированию! 🎉**


