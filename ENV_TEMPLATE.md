# 📝 Шаблон переменных окружения

## Для локальной разработки (`.env.local`)

Создайте файл `.env.local` в корне проекта:

```bash
# === NocoDB Configuration ===
# URL вашего NocoDB инстанса
NOCODB_URL=https://noco.povarnakolesah.ru
NOCODB_TOKEN=your_nocodb_token_here

# === NocoDB Base & Table IDs ===
NOCODB_BASE_ID=p9id5v4q0ukk9iz
NOCODB_TABLE_MEALS=m6h073y33i44nwx
NOCODB_TABLE_EXTRAS=m43rjzbwcon7a9p
NOCODB_TABLE_DELIVERY_ZONES=mozhmlebwluzna4
NOCODB_TABLE_USERS=mg9dm2m41bjv8ar
NOCODB_TABLE_ORDERS=m96i4ai2yelbboh
NOCODB_TABLE_ORDER_PERSONS=m6jccosyrdiz2bm
NOCODB_TABLE_ORDER_MEALS=mvwp0iaqj2tne15
NOCODB_TABLE_ORDER_EXTRAS=mm5yxpaojbtjs4v
NOCODB_TABLE_PROMO_CODES=mbm55wmm3ok48n8
NOCODB_TABLE_REVIEWS=mrfo7gyp91oq77b
NOCODB_TABLE_LOYALTY_POINTS_TRANSACTIONS=mn244txmccpwmhx
NOCODB_TABLE_FRAUD_ALERTS=mr9txejs65nk1yi

# === Application Settings ===
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# === YooKassa Payment Configuration ===
# Получите shop_id в личном кабинете ЮKassa: https://yookassa.ru/my
# Создайте магазин и скопируйте shop_id
YOOKASSA_SHOP_ID=your_shop_id_here
YOOKASSA_SECRET_KEY=test_sDZCHKIUGwEiXpsq0REALRWgsdPY9wCGBdYCRvCH4QE
YOOKASSA_TEST_MODE=true
# Webhook URL для настройки в личном кабинете ЮKassa:
# https://ogfoody.ru/api/payments/yookassa/webhook
```

## Для продакшена на сервере (`.env.production`)

```bash
# === NocoDB Configuration ===
# Внутренний Docker IP
NOCODB_URL=http://172.20.0.2:8080
NOCODB_TOKEN=your_nocodb_token_here

# === NocoDB Base & Table IDs ===
NOCODB_BASE_ID=p9id5v4q0ukk9iz
NOCODB_TABLE_MEALS=m6h073y33i44nwx
NOCODB_TABLE_EXTRAS=m43rjzbwcon7a9p
NOCODB_TABLE_DELIVERY_ZONES=mozhmlebwluzna4
NOCODB_TABLE_USERS=mg9dm2m41bjv8ar
NOCODB_TABLE_ORDERS=m96i4ai2yelbboh
NOCODB_TABLE_ORDER_PERSONS=m6jccosyrdiz2bm
NOCODB_TABLE_ORDER_MEALS=mvwp0iaqj2tne15
NOCODB_TABLE_ORDER_EXTRAS=mm5yxpaojbtjs4v
NOCODB_TABLE_PROMO_CODES=mbm55wmm3ok48n8
NOCODB_TABLE_REVIEWS=mrfo7gyp91oq77b
NOCODB_TABLE_LOYALTY_POINTS_TRANSACTIONS=mn244txmccpwmhx
NOCODB_TABLE_FRAUD_ALERTS=mr9txejs65nk1yi

# === Application Settings ===
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://ogfoody.ru

# === YooKassa Payment Configuration ===
# Получите shop_id в личном кабинете ЮKassa: https://yookassa.ru/my
# Создайте магазин и скопируйте shop_id
YOOKASSA_SHOP_ID=your_shop_id_here
YOOKASSA_SECRET_KEY=test_sDZCHKIUGwEiXpsq0REALRWgsdPY9wCGBdYCRvCH4QE
YOOKASSA_TEST_MODE=true
# Webhook URL для настройки в личном кабинете ЮKassa:
# https://ogfoody.ru/api/payments/yookassa/webhook
```

## 🔐 Где взять значения:

### NOCODB_TOKEN
1. Откройте https://noco.povarnakolesah.ru
2. Account Settings → Tokens
3. Create Token → Скопируйте

### Table IDs
Указаны актуальные ID для базы FooD. Если нужно получить заново:
```bash
ssh root@5.129.194.168
docker exec nocodb-db-1 psql -U postgres -d nocodb -c "
SELECT m.title, m.id 
FROM nc_models_v2 m
JOIN nc_sources_v2 s ON m.source_id = s.id
WHERE s.base_id = 'p9id5v4q0ukk9iz'
ORDER BY m.title;
"
```

## 📥 Быстрая настройка

```bash
# Скачать .env с сервера и создать .env.local
chmod +x download-env.sh
./download-env.sh
```


