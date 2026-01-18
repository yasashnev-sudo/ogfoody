# 📍 ГДЕ ОТОБРАЖАЮТСЯ СПИСАННЫЕ И НАЧИСЛЕННЫЕ БАЛЛЫ

**Дата создания:** 2026-01-15  
**Статус:** ✅ Полный обзор мест отображения

---

## 📋 СОДЕРЖАНИЕ

1. [Клиентская часть (для пользователей)](#1-клиентская-часть-для-пользователей)
2. [Админ-панель](#2-админ-панель)
3. [Страница отладки](#3-страница-отладки)
4. [Источник данных](#4-источник-данных)

---

## 1. КЛИЕНТСКАЯ ЧАСТЬ (ДЛЯ ПОЛЬЗОВАТЕЛЕЙ)

### 1.1. История заказов (`components/order-history.tsx`)

**Место:** Строки 541-552

**Что отображается:**
- ✅ **Списанные баллы** (`loyaltyPointsUsed`) — красным цветом
  - Формат: `-{количество}₽`
  - Пример: `-100₽`
- ✅ **Начисленные баллы** (`loyaltyPointsEarned`) — зеленым цветом
  - Формат: `+{количество}🎁`
  - Пример: `+60🎁`

**Код:**
```tsx
{order.loyaltyPointsUsed !== undefined && order.loyaltyPointsUsed > 0 && (
  <div className="flex items-center justify-between" data-test="loyalty-used-block">
    <span className="text-purple-700">Списано:</span>
    <span className="font-black text-purple-700">-{order.loyaltyPointsUsed}₽</span>
  </div>
)}
{order.loyaltyPointsEarned && order.loyaltyPointsEarned > 0 && (
  <div className="flex items-center justify-between">
    <span className="text-green-700">Начислено:</span>
    <span className="font-black text-green-700">+{order.loyaltyPointsEarned}🎁</span>
  </div>
)}
```

**Источник данных:** Поля заказа `loyaltyPointsUsed` и `loyaltyPointsEarned` из API `/api/orders`

---

### 1.2. Страница успешной оплаты (`app/payment/success/page.tsx`)

**Место:** Строки 219-243

**Что отображается:**
- ✅ **Списанные баллы** (`order.loyalty_points_used`) — красный блок
  - Формат: `-{количество} баллов`
  - Стиль: `bg-red-50`, `border-red-200`
- ✅ **Начисленные баллы** (`order.loyalty_points_earned`) — зеленый блок
  - Формат: `+{количество} баллов`
  - Стиль: `bg-green-50`, `border-green-200`

**Код:**
```tsx
{order?.loyalty_points_used && order.loyalty_points_used > 0 && (
  <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-3">
    <div className="text-center">
      <p className="text-xs text-red-700 dark:text-red-300 mb-1 font-semibold">Списано</p>
      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
        -{order.loyalty_points_used}
      </p>
      <p className="text-xs text-red-600 dark:text-red-400 mt-1">баллов</p>
    </div>
  </div>
)}

{order?.loyalty_points_earned && order.loyalty_points_earned > 0 && (
  <div className="bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:bg-green-800 rounded-lg p-3">
    <div className="text-center">
      <p className="text-xs text-green-700 dark:text-green-300 mb-1 font-semibold">Начислено</p>
      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
        +{order.loyalty_points_earned}
      </p>
      <p className="text-xs text-green-600 dark:text-green-400 mt-1">баллов</p>
    </div>
  </div>
)}
```

**Источник данных:** Заказ из URL параметра или localStorage

---

### 1.3. Диалог успешного заказа (`components/success-order-dialog.tsx`)

**Место:** Строки 43-75

**Что отображается:**
- ✅ **Списанные баллы** (`loyaltyPointsUsed`) — красный блок
  - Формат: `-{количество} баллов`
  - Стиль: `bg-red-50`, `border-red-200`
- ✅ **Начисленные баллы** (`loyaltyPointsEarned`) — основной блок
  - Формат: `+{количество} баллов`
  - Показывает статус: "Начислено" или "К начислению" (если `loyaltyPointsStatus === 'pending'`)

**Код:**
```tsx
{loyaltyPointsUsed !== undefined && loyaltyPointsUsed !== null && loyaltyPointsUsed > 0 && (
  <div className="w-full bg-red-50 border-2 border-red-200 rounded-lg p-3">
    <div className="text-center">
      <p className="text-xs text-red-700 mb-1 font-semibold">Списано</p>
      <p className="text-2xl font-black text-red-600">-{loyaltyPointsUsed}</p>
      <p className="text-xs text-red-600 mt-1">баллов</p>
    </div>
  </div>
)}

{loyaltyPointsEarned && loyaltyPointsEarned > 0 && (
  <div className="w-full">
    <div className="text-center">
      <p className="text-sm text-muted-foreground mb-1">
        {loyaltyPointsStatus === 'pending' ? 'К начислению' : 'Начислено'}
      </p>
      <p className="text-3xl font-black text-primary">+{loyaltyPointsEarned}</p>
      <p className="text-sm text-muted-foreground mt-1">баллов</p>
      
      {loyaltyPointsStatus === 'pending' && (
        <div className="mt-3 bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
          <div className="flex gap-2 items-center justify-center text-center">
            <Clock className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-900">
              Баллы будут начислены на следующий день после доставки
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
)}
```

**Источник данных:** Пропсы компонента (передаются из `OrderModal` или `PaymentModal`)

---

### 1.4. Профиль пользователя (`components/profile-modal.tsx`)

**Место:** Строки 516-534

**Что отображается:**
- ✅ **Только общий баланс** (`loyaltyPoints`)
  - Формат: `{количество} баллов = {количество} ₽`
  - Стиль: Градиентный блок с иконкой монет
- ❌ **История транзакций НЕ отображается**

**Код:**
```tsx
<div className="p-6 bg-gradient-to-br from-[#9D00FF] to-[#7000CC] rounded-xl border-2 border-black shadow-brutal">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-black shadow-brutal">
        <Coins className="w-8 h-8 text-[#9D00FF]" strokeWidth={3} />
      </div>
      <div>
        <p className="text-sm font-bold text-white/80">Ваши баллы</p>
        <p className="text-4xl font-black text-white drop-shadow-[2px_2px_0px_#000000]">
          {loyaltyPoints.toLocaleString()}
        </p>
      </div>
    </div>
    <div className="text-right bg-white px-4 py-2 rounded-lg border-2 border-black">
      <p className="text-sm font-black text-[#9D00FF]">= {loyaltyPoints.toLocaleString()} ₽</p>
      <p className="text-xs font-bold text-black">1 балл = 1 ₽</p>
    </div>
  </div>
</div>
```

**Источник данных:** `userProfile.loyaltyPoints` (вычисляется из транзакций через `calculateUserBalance`)

---

### 1.5. Главная страница (`app/page.tsx`)

**Место:** Строки 3859-3861

**Что отображается:**
- ✅ **Только общий баланс** в шапке профиля
  - Формат: `{количество} баллов`
  - Стиль: Фиолетовый бейдж

**Код:**
```tsx
{userProfile && (
  <span className="text-xs bg-[#9D00FF] text-white px-2 py-0.5 rounded-lg font-black">
    {userProfile.loyaltyPoints || 0} баллов
  </span>
)}
```

**Источник данных:** `userProfile.loyaltyPoints`

---

## 2. АДМИН-ПАНЕЛЬ

### 2.1. Детали пользователя (`components/admin/UserDetailModal.tsx`)

**Место:** Строки 84-90

**Что отображается:**
- ✅ **Только общий баланс** (`points`)
  - Формат: `{количество} баллов`
  - Стиль: Карточка с иконкой звезды
- ❌ **История транзакций НЕ отображается**

**Код:**
```tsx
<div className="flex items-center gap-3 p-3 bg-gray-50 border-2 border-black rounded-lg">
  <Star className="w-5 h-5 text-yellow-500" />
  <div>
    <p className="text-xs text-black/70">Баллы лояльности</p>
    <p className="font-bold text-black">{points} баллов</p>
  </div>
</div>
```

**Источник данных:** Проп `points` (передается из админ-панели)

---

## 3. СТРАНИЦА ОТЛАДКИ

### 3.1. Диагностика баллов (`app/debug/loyalty/page.tsx`)

**Место:** Строки 217-234

**Что отображается:**
- ✅ **Полная история транзакций** (для отладки)
  - Показывает все типы: `earned`, `used`, `refunded`, `cancelled`
  - Формат: `{transaction_type}: {points} баллов - {description}`
  - Пример: `earned: 97 баллов - Начислено 97 баллов за заказ на сумму 2189 руб.`

**Код:**
```tsx
{result.transactions && (
  <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-md">
    <h3 className="font-medium mb-2">Транзакции:</h3>
    <p className="text-sm mb-2">Всего транзакций: {result.transactions.count}</p>
    {result.transactions.list && result.transactions.list.length > 0 && (
      <div className="text-xs">
        <p className="font-medium mb-1">Последние транзакции:</p>
        <ul className="space-y-1">
          {result.transactions.list.map((t: any, i: number) => (
            <li key={i} className="bg-white p-2 rounded border">
              {t.transaction_type}: {t.points} баллов - {t.description}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
)}
```

**Источник данных:** API `/api/debug/loyalty-points?userId={userId}&checkTransactions=true`

**Доступ:** Только для отладки (не для обычных пользователей)

---

## 4. ИСТОЧНИК ДАННЫХ

### 4.1. Баланс баллов

**Функция:** `calculateUserBalance(userId, noCache)`  
**Файл:** `lib/nocodb.ts` (строки 662-738)

**Логика:**
1. Получает все транзакции из таблицы `Loyalty_Points_Transactions`
2. Фильтрует только `completed` транзакции
3. Суммирует значения `Points` (положительные для `earned`, отрицательные для `used`)

**Используется в:**
- `fetchUserById()` — автоматически пересчитывает баланс
- `userProfile.loyaltyPoints` — берется из пересчитанного баланса

---

### 4.2. Начисленные/списанные баллы для заказа

**Источник:** Поля заказа в БД:
- `loyalty_points_earned` — начисленные баллы
- `loyalty_points_used` — списанные баллы

**Обновляются:**
- При создании заказа (`POST /api/orders`)
- При оплате заказа (`PATCH /api/orders/[id]`)
- При отмене заказа (`DELETE /api/orders/[id]`)

---

### 4.3. Полная история транзакций

**Функция:** `fetchLoyaltyPointsTransactions(userId)`  
**Файл:** `lib/nocodb.ts` (строки 2953-2965)

**Возвращает:**
- Массив всех транзакций пользователя
- Типы: `earned`, `used`, `refunded`, `cancelled`
- Статусы: `pending`, `completed`, `cancelled`

**Используется:**
- ❌ **НЕ используется в клиентской части** (только в отладке)
- ✅ Используется в `calculateUserBalance()` для расчета баланса

---

## 📊 ИТОГОВАЯ ТАБЛИЦА

| Место | Что показывается | Источник данных |
|-------|------------------|-----------------|
| **История заказов** | Списанные и начисленные баллы для каждого заказа | `order.loyaltyPointsUsed`, `order.loyaltyPointsEarned` |
| **Страница успешной оплаты** | Списанные и начисленные баллы | `order.loyalty_points_used`, `order.loyalty_points_earned` |
| **Диалог успешного заказа** | Списанные и начисленные баллы + статус (pending/completed) | Пропсы компонента |
| **Профиль пользователя** | Только общий баланс | `userProfile.loyaltyPoints` (из `calculateUserBalance`) |
| **Главная страница** | Только общий баланс в шапке | `userProfile.loyaltyPoints` |
| **Админ-панель** | Только общий баланс | Проп `points` |
| **Страница отладки** | Полная история всех транзакций | API `/api/debug/loyalty-points` |

---

## ⚠️ ВАЖНЫЕ ЗАМЕЧАНИЯ

1. **История транзакций НЕ отображается пользователям**
   - Пользователи видят только баланс и баллы по каждому заказу
   - Полная история доступна только в отладке

2. **Баланс всегда пересчитывается из транзакций**
   - Поле `Users.Loyalty Points` НЕ является источником правды
   - Используется функция `calculateUserBalance()`

3. **Типы транзакций:**
   - `earned` — начисление (положительное значение)
   - `used` — списание (отрицательное значение)
   - `refunded` — возврат использованных баллов (положительное значение)
   - `cancelled` — отмена начисленных баллов (отрицательное значение)

4. **Статусы транзакций:**
   - `completed` — учитывается в балансе
   - `pending` — НЕ учитывается в балансе (ждет оплаты)
   - `cancelled` — НЕ учитывается в балансе (отменена)

---

**Статус:** ✅ Документ актуален на 2026-01-15
