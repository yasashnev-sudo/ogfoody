# Полный перечень полей таблиц NocoDB

Документ содержит точный список всех полей (column_name) из таблиц NocoDB в правильном регистре.

---

## Таблица: **Meals**

1. `Id`
2. `name`
3. `category`
4. `ingredients`
5. `description`
6. `price_single`
7. `price_medium`
8. `price_large`
9. `weight_single`
10. `weight_medium`
11. `weight_large`
12. `image`
13. `needs_garnish`
14. `calories`
15. `protein`
16. `fats`
17. `carbs`
18. `is_current_week`
19. `is_next_week`

**Всего: 19 полей**

---

## Таблица: **Extras**

1. `Id`
2. `name`
3. `category`
4. `ingredients`
5. `description`
6. `price`
7. `image`
8. `calories`
9. `protein`
10. `fats`
11. `carbs`
12. `weight`
13. `is_current_week`
14. `is_next_week`

**Всего: 14 полей**

---

## Таблица: **Delivery_Zones**

1. `Id`
2. `city`
3. `district`
4. `delivery_fee`
5. `min_order_amount`
6. `is_available`
7. `available_intervals`

**Всего: 7 полей**

---

## Таблица: **Users**

1. `Id`
2. `phone`
3. `password_hash`
4. `name`
5. `additional_phone`
6. `street`
7. `building`
8. `building_section`
9. `apartment`
10. `entrance`
11. `floor`
12. `intercom`
13. `district`
14. `delivery_comment`
15. `loyalty_points`
16. `total_spent`
17. `created_at`
18. `updated_at`

**Всего: 18 полей**

---

## Таблица: **Orders**

1. `Id`
2. `user_id`
3. `order_number`
4. `start_date`
5. `delivery_time`
6. `payment_status`
7. `payment_method`
8. `paid`
9. `paid_at`
10. `payment_id`
11. `order_status`
12. `promo_code`
13. `promo_discount`
14. `loyalty_points_used`
15. `loyalty_points_earned`
16. `subtotal`
17. `total`
18. `guest_phone`
19. `guest_address`
20. `created_at`
21. `updated_at`

**Всего: 21 поле**

---

## Таблица: **Order_Persons**

1. `Id`
2. `order_id`
3. `person_number`

**Всего: 3 поля**

---

## Таблица: **Order_Meals**

1. `Id`
2. `order_person_id`
3. `day`
4. `meal_time`
5. `meal_type`
6. `meal_id`
7. `portion_size`
8. `price`
9. `garnish_id`
10. `garnish_portion_size`
11. `garnish_price`

**Всего: 11 полей**

---

## Таблица: **Order_Extras**

1. `Id`
2. `order_id`
3. `extra_id`
4. `quantity`
5. `price`

**Всего: 5 полей**

---

## Таблица: **Promo_Codes**

1. `Id`
2. `code`
3. `discount_type`
4. `discount_value`
5. `min_order_amount`
6. `max_discount`
7. `valid_from`
8. `valid_until`
9. `usage_limit`
10. `times_used`
11. `active`

**Всего: 11 полей**

---

## Таблица: **Reviews**

1. `Id`
2. `order_id`
3. `user_id`
4. `rating`
5. `text`
6. `created_at`
7. `updated_at`

**Всего: 7 полей**

---

## Итого по всем таблицам

- **Всего таблиц:** 10
- **Всего полей:** 116

---

## Примечания

1. Все имена полей указаны в том регистре, который используется в NocoDB API (column_name).
2. Поле `Id` во всех таблицах является первичным ключом (Primary Key) с автоинкрементом.
3. Поля `created_at` и `updated_at` присутствуют в таблицах Users, Orders и Reviews.
4. Поля с префиксом `is_` являются булевыми (Checkbox в NocoDB).
5. Поля с суффиксом `_id` являются внешними ключами (Foreign Keys).





