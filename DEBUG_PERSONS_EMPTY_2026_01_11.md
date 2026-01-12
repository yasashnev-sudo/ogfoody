# 🔍 ОТЛАДКА: persons пуст при автооформлении

**Дата:** 2026-01-11 (03:00+)
**Статус:** ОТЛАДКА

## 📋 Воспроизведенная ошибка

```
❌ КРИТИЧЕСКАЯ ОШИБКА: persons пуст при автооформлении!
```

Логи показывают:
```
📦 Обновленный заказ: id = undefined тип = undefined total = NaN
👥 Проверка persons: Object  ← persons пуст
❌ КРИТИЧЕСКАЯ ОШИБКА: persons пуст при автооформлении!
```

## 🔧 Добавлено критическое логирование

### 1. В `onRequestAuth` (app/page.tsx, строка ~2958)

Логирует что ИМЕННО сохраняется в `pendingCheckout`:

```typescript
console.log("🔍 [onRequestAuth] Получен order с persons:", {
  personsCount: order.persons?.length || 0,
  persons: order.persons?.map(p => ({
    id: p.id,
    hasDay1: !!p.day1,
    hasDay2: !!p.day2,
  })),
  subtotal: order.subtotal,
  total: order.total
})

setPendingCheckout({ order, total })
console.log("💾 [onRequestAuth] Сохранен pendingCheckout с persons:", order.persons?.length || 0)
```

### 2. В `handleAutoCheckout` (app/page.tsx, строка ~2293)

Логирует что ИЗВЛЕКАЕТСЯ из `pendingCheckout`:

```typescript
console.log("📦 [handleAutoCheckout] pendingCheckout:", {
  hasPendingCheckout: !!pendingCheckout,
  orderPersonsCount: pendingCheckout?.order?.persons?.length || 0,
  orderPersons: pendingCheckout?.order?.persons?.map(p => ({
    id: p.id,
    hasDay1: !!p.day1,
    hasDay2: !!p.day2,
  })),
  orderSubtotal: pendingCheckout?.order?.subtotal,
  orderTotal: pendingCheckout?.order?.total,
  pendingTotal: pendingCheckout?.total
})
```

## 📝 Следующие шаги

1. **Повторить сценарий:**
   - Гость создает заказ с блюдами
   - Нажимает "Оформить заказ"
   - Авторизуется
   - Заполняет профиль

2. **Проверить логи:**
   - `🔍 [onRequestAuth]` - сколько persons было передано?
   - `💾 [onRequestAuth]` - сколько persons было сохранено?
   - `📦 [handleAutoCheckout]` - сколько persons извлечено?

3. **Определить где теряются данные:**
   - Если в `onRequestAuth` persons есть, но в `handleAutoCheckout` их нет → проблема в сохранении состояния
   - Если уже в `onRequestAuth` persons пуст → проблема в `OrderModal`

## 🎯 Ожидаемый результат логов

### Правильный сценарий:
```
🔍 [onRequestAuth] Получен order с persons: { personsCount: 1, ... }
💾 [onRequestAuth] Сохранен pendingCheckout с persons: 1
... (авторизация, профиль)
📦 [handleAutoCheckout] pendingCheckout: { orderPersonsCount: 1, ... }
👥 Проверка persons: { personsCount: 1, ... }
✅ Все ОК, заказ создан
```

### Проблемный сценарий:
```
🔍 [onRequestAuth] Получен order с persons: { personsCount: 0, ... }
💾 [onRequestAuth] Сохранен pendingCheckout с persons: 0
... (авторизация, профиль)
📦 [handleAutoCheckout] pendingCheckout: { orderPersonsCount: 0, ... }
👥 Проверка persons: { personsCount: 0, ... }
❌ КРИТИЧЕСКАЯ ОШИБКА: persons пуст!
```

ИЛИ

```
🔍 [onRequestAuth] Получен order с persons: { personsCount: 1, ... }
💾 [onRequestAuth] Сохранен pendingCheckout с persons: 1
... (авторизация, профиль)
📦 [handleAutoCheckout] pendingCheckout: { orderPersonsCount: 0, ... }
👥 Проверка persons: { personsCount: 0, ... }
❌ КРИТИЧЕСКАЯ ОШИБКА: persons пуст!
```
(данные потерялись между сохранением и извлечением)

## 🚨 ПОЖАЛУЙСТА, ПОВТОРИТЕ СЦЕНАРИЙ И ОТПРАВЬТЕ ЛОГИ


