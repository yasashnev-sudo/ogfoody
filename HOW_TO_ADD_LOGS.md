# 🔧 Как добавить специальные логи для отладки

## 💡 Главное правило

**Debug система автоматически перехватывает ВСЕ:**
- `console.log()` → попадёт в отчёт
- `console.error()` → попадёт в отчёт  
- `console.warn()` → попадёт в отчёт
- `console.info()` → попадёт в отчёт

**Просто добавь логи в код - они автоматически появятся в Debug Console!**

---

## 🎯 Где добавлять логи

### Принцип: "Логируй до, во время и после"

```javascript
// ДО действия
console.log("🔵 Начинаем расчёт баллов")

// ВО ВРЕМЯ
console.log("📊 Данные для расчёта:", { total, userId })

// ПОСЛЕ
console.log("✅ Баллы рассчитаны:", loyaltyPoints)
```

---

## 📝 Примеры добавления логов

### Пример 1: Отладка начисления баллов

**Где:** `app/api/orders/[id]/route.ts`

**Что добавить:**

```typescript
// ✅ ХОРОШИЕ логи для отладки баллов
async function awardLoyaltyPoints(userId: number, orderTotal: number) {
  // Лог ПЕРЕД расчётом
  console.log("💰 [LOYALTY] Начинаем начисление баллов:", {
    userId,
    orderTotal,
  })

  // Получаем пользователя
  const user = await fetchUserById(userId)
  
  // Лог данных пользователя
  console.log("👤 [LOYALTY] Данные пользователя:", {
    userId,
    currentPoints: user.loyaltyPoints,
    currentTotalSpent: user.totalSpent,
  })

  // Рассчитываем баллы
  const pointsToAward = Math.floor(orderTotal * 0.1)
  
  // Лог расчёта
  console.log("🧮 [LOYALTY] Расчёт:", {
    formula: "orderTotal * 0.1",
    orderTotal,
    pointsToAward,
  })

  // Обновляем пользователя
  const newPoints = user.loyaltyPoints + pointsToAward
  const newTotalSpent = user.totalSpent + orderTotal
  
  // Лог ПЕРЕД обновлением
  console.log("💾 [LOYALTY] Обновляем пользователя:", {
    oldPoints: user.loyaltyPoints,
    newPoints,
    oldTotalSpent: user.totalSpent,
    newTotalSpent,
  })

  await updateUser(userId, {
    loyaltyPoints: newPoints,
    totalSpent: newTotalSpent,
  })

  // Лог ПОСЛЕ обновления
  console.log("✅ [LOYALTY] Баллы начислены успешно:", {
    userId,
    awarded: pointsToAward,
    newTotal: newPoints,
  })

  return pointsToAward
}
```

**Что это даёт:**
- Видно каждый шаг расчёта
- Понятно, где именно ошибка
- Все значения видны в логах

### Пример 2: Отладка создания заказа

**Где:** `components/order-modal.tsx`

```typescript
const handleCheckout = async () => {
  // Лог начала
  console.log("🛒 [ORDER] Начинаем оформление заказа")
  
  // Лог данных заказа
  console.log("📦 [ORDER] Данные заказа:", {
    personsCount: order.persons.length,
    subtotal: order.subtotal,
    total: order.total,
  })

  // Проверка persons
  if (!order.persons || order.persons.length === 0) {
    console.error("❌ [ORDER] ОШИБКА: persons пуст!")
    return
  }
  
  console.log("✅ [ORDER] Проверка persons пройдена:", order.persons.length)

  // Отправка на API
  console.log("📤 [ORDER] Отправляем на API:", {
    endpoint: "/api/orders",
    method: "POST",
    payload: { order, userId },
  })

  const response = await fetch("/api/orders", {
    method: "POST",
    body: JSON.stringify({ order, userId }),
  })

  // Лог ответа
  console.log("📥 [ORDER] Ответ от API:", {
    status: response.status,
    ok: response.ok,
  })

  if (!response.ok) {
    const error = await response.json()
    console.error("❌ [ORDER] Ошибка API:", error)
    return
  }

  const result = await response.json()
  console.log("✅ [ORDER] Заказ создан:", {
    orderId: result.orderId,
    orderNumber: result.orderNumber,
  })
}
```

### Пример 3: Отладка оплаты

**Где:** `components/payment-modal.tsx`

```typescript
const handlePayment = async (method: string) => {
  // Лог начала оплаты
  console.log("💳 [PAYMENT] Начинаем оплату:", {
    method,
    orderId: order.id,
    total: order.total,
  })

  // Валидация
  if (!order.id) {
    console.error("❌ [PAYMENT] ОШИБКА: order.id отсутствует!")
    return
  }

  console.log("✅ [PAYMENT] Валидация пройдена")

  // Отправка на API
  console.log("📤 [PAYMENT] Отправляем на API /api/orders/[id]")
  
  const response = await fetch(`/api/orders/${order.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      paid: true,
      paymentMethod: method,
    }),
  })

  console.log("📥 [PAYMENT] Ответ API:", {
    status: response.status,
    ok: response.ok,
  })

  if (response.ok) {
    console.log("✅ [PAYMENT] Оплата успешна!")
    onPaymentComplete()
  } else {
    const error = await response.json()
    console.error("❌ [PAYMENT] Ошибка оплаты:", error)
  }
}
```

---

## 🎨 Лучшие практики логирования

### 1. Используй префиксы (эмодзи + категория)

```javascript
// ✅ Хорошо - сразу видно категорию
console.log("💰 [LOYALTY] Начисляем баллы")
console.log("🛒 [ORDER] Создаём заказ")
console.log("💳 [PAYMENT] Обрабатываем оплату")
console.log("👤 [USER] Обновляем профиль")
console.log("📦 [API] Отправляем запрос")

// ❌ Плохо - непонятно откуда
console.log("Начисляем баллы")
```

### 2. Логируй объекты, не строки

```javascript
// ✅ Хорошо - все данные видны
console.log("💰 Расчёт баллов:", {
  total: 1500,
  rate: 0.1,
  points: 150,
})

// ❌ Плохо - нужно угадывать значения
console.log("Расчёт баллов")
```

### 3. Логируй ДО и ПОСЛЕ

```javascript
// ✅ Хорошо
console.log("💾 [ДО] Обновление пользователя:", {
  oldPoints: 0,
  newPoints: 150,
})

await updateUser(userId, { loyaltyPoints: 150 })

console.log("✅ [ПОСЛЕ] Пользователь обновлён")

// ❌ Плохо - непонятно, где ошибка
await updateUser(userId, { loyaltyPoints: 150 })
console.log("Обновлено")
```

### 4. Используй разные уровни

```javascript
// Обычная информация
console.log("📊 Начинаем процесс")

// Предупреждение
console.warn("⚠️ Подозрительное значение:", value)

// Ошибка
console.error("❌ КРИТИЧЕСКАЯ ОШИБКА:", error)

// Доп. информация
console.info("ℹ️ Дополнительно:", details)
```

---

## 🎯 Быстрые шаблоны

### Для функции с расчётами:

```javascript
function calculateSomething(input) {
  // 1. Лог входа
  console.log("🔵 [CALC] Начало:", { input })
  
  // 2. Лог расчёта
  const result = input * 0.1
  console.log("🧮 [CALC] Расчёт:", { input, result })
  
  // 3. Валидация
  if (isNaN(result)) {
    console.error("❌ [CALC] ОШИБКА: result is NaN", { input })
    return 0
  }
  
  // 4. Лог выхода
  console.log("✅ [CALC] Результат:", result)
  return result
}
```

### Для API запроса:

```javascript
async function apiRequest(endpoint, data) {
  // 1. Лог запроса
  console.log("📤 [API] Отправка:", { endpoint, data })
  
  const response = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  })
  
  // 2. Лог ответа
  console.log("📥 [API] Ответ:", {
    status: response.status,
    ok: response.ok,
  })
  
  // 3. Обработка ошибки
  if (!response.ok) {
    const error = await response.json()
    console.error("❌ [API] Ошибка:", error)
    throw error
  }
  
  // 4. Успех
  const result = await response.json()
  console.log("✅ [API] Успех:", result)
  return result
}
```

### Для условной логики:

```javascript
if (condition) {
  console.log("✅ [CHECK] Условие выполнено:", { condition })
  // код
} else {
  console.warn("⚠️ [CHECK] Условие НЕ выполнено:", { condition })
  // код
}
```

---

## 🚀 Как использовать с Debug System

### Шаги:

```
1. Добавь логи в код (где хочешь отладить)
   ↓
2. Воспроизведи проблему
   ↓
3. Ctrl+Shift+D (все твои логи УЖЕ в консоли!)
   ↓
4. Напиши комментарий
   ↓
5. Ctrl+Enter → отчёт с ТВОИМИ логами!
```

### Пример:

**Добавил логи:**
```typescript
console.log("💰 [LOYALTY] Начинаем начисление")
console.log("📊 [LOYALTY] Данные:", { total: 1500 })
console.log("🧮 [LOYALTY] Результат:", { points: 150 })
```

**Воспроизвёл проблему → Ctrl+Shift+D**

**В консоли увидишь:**
```
[12:30:00] [LOG] 💰 [LOYALTY] Начинаем начисление
[12:30:01] [LOG] 📊 [LOYALTY] Данные: {"total":1500}
[12:30:02] [LOG] 🧮 [LOYALTY] Результат: {"points":150}
```

**Ctrl+Enter → отчёт с этими логами!**

---

## 💡 Когда добавлять логи

### Обязательно логируй:

1. **Перед важными операциями:**
   ```javascript
   console.log("💾 Начинаем сохранение заказа")
   ```

2. **При расчётах:**
   ```javascript
   console.log("🧮 Расчёт:", { formula, input, result })
   ```

3. **При ошибках:**
   ```javascript
   console.error("❌ Ошибка:", error)
   ```

4. **При проверках:**
   ```javascript
   if (!data) {
     console.warn("⚠️ Данные отсутствуют!")
   }
   ```

5. **При API запросах:**
   ```javascript
   console.log("📤 Отправка на API:", payload)
   console.log("📥 Ответ API:", response)
   ```

---

## 🎯 Итого

**Добавить логи = просто!**

```javascript
// В любом месте кода добавляй:
console.log("💡 [CATEGORY] Что происходит:", { данные })

// Логи автоматически попадут в Debug Console!
// Ctrl+Shift+D → увидишь их
// Ctrl+Enter → отправишь с отчётом
```

**Debug система ВСЁ перехватывает автоматически!** 🎉

---

## 📋 Шпаргалка эмодзи для логов

```
🔵 Начало процесса
📊 Данные/параметры
🧮 Расчёты
💾 Сохранение
📤 Отправка
📥 Получение
✅ Успех
❌ Ошибка
⚠️ Предупреждение
ℹ️ Информация
💰 Баллы/деньги
🛒 Заказ
💳 Оплата
👤 Пользователь
📦 API
🔍 Проверка
```

Копируй и используй! 🎯


