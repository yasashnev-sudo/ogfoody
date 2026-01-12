# Реальные поля таблиц NocoDB

Документ содержит реальные поля, полученные из NocoDB API. 
**Внимание:** NocoDB API v2 возвращает **titles** (заголовки колонок), а не `column_name` (имена полей в БД).

---

## Таблица: **Meals**

### Поля из API (titles):
1. `Id`
2. `Calories`
3. `Carbs`
4. `Category`
5. `Current Week`
6. `Description`
7. `Fats`
8. `Image (URL)`
9. `Ingredients`
10. `Name`
11. `Needs Garnish`
12. `Next Week`
13. `Price (Large)`
14. `Price (Medium)`
15. `Price (Single)`
16. `Protein`
17. `Weight (Large)`
18. `Weight (Medium)`
19. `Weight (Single)`

**Всего: 19 полей**

### Соответствие column_name (из кода):
- `Id` → `Id`
- `Name` → `name`
- `Category` → `category`
- `Ingredients` → `ingredients`
- `Description` → `description`
- `Price (Single)` → `price_single`
- `Price (Medium)` → `price_medium`
- `Price (Large)` → `price_large`
- `Weight (Single)` → `weight_single`
- `Weight (Medium)` → `weight_medium`
- `Weight (Large)` → `weight_large`
- `Image (URL)` → `image`
- `Needs Garnish` → `needs_garnish`
- `Calories` → `calories`
- `Protein` → `protein`
- `Fats` → `fats`
- `Carbs` → `carbs`
- `Current Week` → `is_current_week`
- `Next Week` → `is_next_week`

---

## Таблица: **Extras**

### Поля из API (titles):
1. `Id`
2. `Calories`
3. `Carbs`
4. `Category`
5. `Current Week`
6. `Description`
7. `Fats`
8. `Image (URL)`
9. `Ingredients`
10. `Name`
11. `Next Week`
12. `Price`
13. `Protein`
14. `Weight`

**Всего: 14 полей**

### Соответствие column_name (из кода):
- `Id` → `Id`
- `Name` → `name`
- `Category` → `category`
- `Ingredients` → `ingredients`
- `Description` → `description`
- `Price` → `price`
- `Image (URL)` → `image`
- `Calories` → `calories`
- `Protein` → `protein`
- `Fats` → `fats`
- `Carbs` → `carbs`
- `Weight` → `weight`
- `Current Week` → `is_current_week`
- `Next Week` → `is_next_week`

---

## Таблица: **Delivery_Zones**

### Поля из API (titles):
1. `Id`
2. `Available`
3. `Available Intervals`
4. `City`
5. `Delivery Fee`
6. `District`
7. `Min Order Amount`

**Всего: 7 полей**

### Соответствие column_name (из кода):
- `Id` → `Id`
- `City` → `city`
- `District` → `district`
- `Delivery Fee` → `delivery_fee`
- `Min Order Amount` → `min_order_amount`
- `Available` → `is_available`
- `Available Intervals` → `available_intervals`

---

## Таблица: **Users**

### Поля из API (titles):
1. `Id`
2. `Additional Phone`
3. `Apartment`
4. `Building`
5. `Building Section`
6. `Created At`
7. `Delivery Comment`
8. `District`
9. `Entrance`
10. `Floor`
11. `Intercom`
12. `Loyalty Points`
13. `Name`
14. `Password Hash`
15. `Phone`
16. `Street`
17. `Total Spent`
18. `Updated At`

**Всего: 18 полей**

### Соответствие column_name (из кода):
- `Id` → `Id`
- `Phone` → `phone`
- `Password Hash` → `password_hash`
- `Name` → `name`
- `Additional Phone` → `additional_phone`
- `Street` → `street`
- `Building` → `building`
- `Building Section` → `building_section`
- `Apartment` → `apartment`
- `Entrance` → `entrance`
- `Floor` → `floor`
- `Intercom` → `intercom`
- `District` → `district`
- `Delivery Comment` → `delivery_comment`
- `Loyalty Points` → `loyalty_points`
- `Total Spent` → `total_spent`
- `Created At` → `created_at`
- `Updated At` → `updated_at`

---

## Таблица: **Orders**

### Поля из API (titles):
1. `Id`
2. `Created At`
3. `Delivery Time`
4. `Guest Address`
5. `Guest Phone`
6. `Loyalty Points Earned`
7. `Loyalty Points Used`
8. `Order Number`
9. `Order Status`
10. `Paid`
11. `Paid At`
12. `Payment ID`
13. `Payment Method`
14. `Payment Status`
15. `Promo Code`
16. `Promo Discount`
17. `Start Date`
18. `Subtotal`
19. `Total`
20. `Updated At`
21. `User ID`

**Всего: 21 поле**

### Соответствие column_name (из кода):
- `Id` → `Id`
- `User ID` → `user_id`
- `Order Number` → `order_number`
- `Start Date` → `start_date`
- `Delivery Time` → `delivery_time`
- `Payment Status` → `payment_status`
- `Payment Method` → `payment_method`
- `Paid` → `paid`
- `Paid At` → `paid_at`
- `Payment ID` → `payment_id`
- `Order Status` → `order_status`
- `Promo Code` → `promo_code`
- `Promo Discount` → `promo_discount`
- `Loyalty Points Used` → `loyalty_points_used`
- `Loyalty Points Earned` → `loyalty_points_earned`
- `Subtotal` → `subtotal`
- `Total` → `total`
- `Guest Phone` → `guest_phone`
- `Guest Address` → `guest_address`
- `Created At` → `created_at`
- `Updated At` → `updated_at`

---

## Таблица: **Order_Persons**

### Поля из API (titles):
1. `Id`
2. `Order ID`
3. `Person Number`

**Всего: 3 поля**

### Соответствие column_name (из кода):
- `Id` → `Id`
- `Order ID` → `order_id`
- `Person Number` → `person_number`

---

## Таблица: **Order_Meals**

### Поля из API (titles):
1. `Id`
2. `Day`
3. `Garnish ID`
4. `Garnish Portion Size`
5. `Garnish Price`
6. `Meal ID`
7. `Meal Time`
8. `Meal Type`
9. `Order Person ID`
10. `Portion Size`
11. `Price`

**Всего: 11 полей**

### Соответствие column_name (из кода):
- `Id` → `Id`
- `Order Person ID` → `order_person_id`
- `Day` → `day`
- `Meal Time` → `meal_time`
- `Meal Type` → `meal_type`
- `Meal ID` → `meal_id`
- `Portion Size` → `portion_size`
- `Price` → `price`
- `Garnish ID` → `garnish_id`
- `Garnish Portion Size` → `garnish_portion_size`
- `Garnish Price` → `garnish_price`

---

## Таблица: **Order_Extras**

**Статус:** Таблица пуста или недоступна

### Ожидаемые поля (из кода):
1. `Id`
2. `Order ID` → `order_id`
3. `Extra ID` → `extra_id`
4. `Quantity` → `quantity`
5. `Price` → `price`

**Всего: 5 полей**

---

## Таблица: **Promo_Codes**

**Статус:** Таблица пуста или недоступна

### Ожидаемые поля (из кода):
1. `Id`
2. `Code` → `code`
3. `Discount Type` → `discount_type`
4. `Discount Value` → `discount_value`
5. `Min Order Amount` → `min_order_amount`
6. `Max Discount` → `max_discount`
7. `Valid From` → `valid_from`
8. `Valid Until` → `valid_until`
9. `Usage Limit` → `usage_limit`
10. `Times Used` → `times_used`
11. `Active` → `active`

**Всего: 11 полей**

---

## Таблица: **Reviews**

### Поля из API (titles):
1. `Id`
2. `Order ID`
3. `Rating`
4. `Review Text`
5. `User ID`

**Всего: 5 полей**

**Примечание:** В API не возвращаются `Created At` и `Updated At`, но они должны быть в таблице согласно коду.

### Соответствие column_name (из кода):
- `Id` → `Id`
- `Order ID` → `order_id`
- `User ID` → `user_id`
- `Rating` → `rating`
- `Review Text` → `text`
- `Created At` → `created_at` (не видно в API, но должно быть)
- `Updated At` → `updated_at` (не видно в API, но должно быть)

---

## Итого

- **Всего таблиц:** 10
- **Таблиц с данными:** 8
- **Пустых таблиц:** 2 (Order_Extras, Promo_Codes)

---

## Важные замечания

1. **NocoDB API v2 возвращает titles, а не column_name**
   - В запросах к API нужно использовать titles (например, `"Name"`, `"Phone"`)
   - В коде есть преобразование из titles в column_name (snake_case)

2. **Регистр важен:**
   - Titles: `"Current Week"`, `"Order ID"`, `"Payment Status"`
   - column_name: `is_current_week`, `order_id`, `payment_status`

3. **Для запросов к NocoDB API используйте titles:**
   ```javascript
   where: `(Phone,eq,${phone})`  // ✅ Правильно
   where: `(phone,eq,${phone})`   // ❌ Неправильно
   ```

4. **Для работы с данными в коде используйте column_name:**
   ```typescript
   user.phone        // ✅ Правильно (после преобразования)
   user["Phone"]     // ✅ Также работает (из API)
   ```





