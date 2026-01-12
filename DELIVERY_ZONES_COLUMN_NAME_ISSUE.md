# Проблема с названиями колонок в Delivery_Zones

## 🔍 Обнаруженная проблема

В таблице `Delivery_Zones` в NocoDB колонки имеют названия с заглавными буквами и пробелами (это `title` колонок), но код ожидает `column_name` в формате snake_case.

### Реальные данные из NocoDB API:

```json
{
  "Id": 39,
  "City": "Санкт-Петербург",
  "District": "Адмиралтейский район",
  "Delivery Fee": 0,
  "Min Order Amount": 2000,
  "Available": true,
  "Available Intervals": ["17:30-22:00"]
}
```

### Ожидаемые в коде (snake_case):

```typescript
{
  Id: number
  city: string
  district?: string
  delivery_fee: number | string
  min_order_amount: number | string
  is_available?: boolean | string
  available_intervals?: string
}
```

## 📍 Где используется в коде:

### 1. `app/api/menu/route.ts` (строка 370):
```typescript
const deliveryZones = nocoZones
  .filter((zone) => parseBoolean(zone.is_available))  // ❌ Проблема!
  .map((zone) => ({
    id: zone.Id || zone.id,
    city: zone.city || "",  // ❌ Проблема!
    district: zone.district || "",  // ❌ Проблема!
    deliveryFee: parsePrice(zone.delivery_fee),  // ❌ Проблема!
    minOrderAmount: parsePrice(zone.min_order_amount),  // ❌ Проблема!
    isAvailable: true,
    availableIntervals: parseIntervals(zone.available_intervals),  // ❌ Проблема!
  }))
```

### 2. `lib/nocodb.ts` (интерфейс NocoDBDeliveryZone):
```typescript
export interface NocoDBDeliveryZone {
  Id: number
  city: string  // ❌ Ожидает snake_case, но получает "City"
  district?: string  // ❌ Ожидает snake_case, но получает "District"
  delivery_fee: number | string  // ❌ Ожидает snake_case, но получает "Delivery Fee"
  min_order_amount: number | string  // ❌ Ожидает snake_case, но получает "Min Order Amount"
  is_available?: boolean | string  // ❌ Ожидает snake_case, но получает "Available"
  available_intervals?: string  // ❌ Ожидает snake_case, но получает "Available Intervals"
}
```

## ✅ Решение

NocoDB API v2 возвращает данные с ключами как `title` колонок (с заглавными буквами и пробелами), а не `column_name`.

**Варианты решения:**

1. **Использовать правильные ключи из API** (рекомендуется):
   - `zone["Available"]` вместо `zone.is_available`
   - `zone["City"]` вместо `zone.city`
   - `zone["Delivery Fee"]` вместо `zone.delivery_fee`

2. **Исправить структуру таблицы в NocoDB**:
   - Убедиться, что `column_name` соответствует ожидаемому формату
   - Проверить, что API возвращает данные с правильными ключами

3. **Добавить маппинг** в функции обработки данных

## 🔧 Проверка

Нужно проверить:
1. Какие ключи реально возвращает NocoDB API для Delivery_Zones
2. Использует ли NocoDB `column_name` или `title` в качестве ключей в JSON ответе
3. Работает ли код сейчас или падает с ошибками





