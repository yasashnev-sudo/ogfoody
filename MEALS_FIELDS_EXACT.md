# Точный список полей таблицы Meals

## Все поля в порядке определения (19 полей):

```
1. Id                    - ID (автоинкремент, первичный ключ)
2. name                  - SingleLineText (обязательное)
3. category              - SingleLineText (обязательное)
4. ingredients           - LongText (обязательное)
5. description           - LongText (необязательное)
6. price_single          - Decimal (необязательное)
7. price_medium          - Decimal (необязательное)
8. price_large           - Decimal (необязательное)
9. weight_single         - Number (необязательное)
10. weight_medium        - Number (необязательное)
11. weight_large         - Number (необязательное)
12. image                - SingleLineText (необязательное) - URL ссылка
13. needs_garnish        - Checkbox (необязательное, по умолчанию: false)
14. calories             - Number (необязательное)
15. protein              - Decimal (необязательное)
16. fats                 - Decimal (необязательное)
17. carbs                - Decimal (необязательное)
18. is_current_week      - Checkbox (необязательное)
19. is_next_week         - Checkbox (необязательное)
```

## Для Google Sheets (порядок колонок):

```
A: name
B: category
C: ingredients
D: description
E: price_single
F: price_medium
G: price_large
H: weight_single
I: weight_medium
J: weight_large
K: image
L: needs_garnish
M: calories
N: protein
O: fats
P: carbs
Q: is_current_week
R: is_next_week
```

**НЕ заполнять:**
- `Id` - генерируется автоматически

## ❌ Удаленные поля:
- ~~`available`~~ - удалено, доступность через `is_current_week` и `is_next_week`

## ✅ Изменения:
- `image` - теперь `SingleLineText` (URL ссылка), не `Attachment`





