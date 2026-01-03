# Инструкция по настройке проекта на Vercel

## Проблема: товары не загружаются

Если после деплоя на Vercel товары не подгружаются, скорее всего проблема в переменных окружения.

## Шаг 1: Настройка переменных окружения в Vercel

### Как добавить переменные окружения:

1. Зайдите в [Vercel Dashboard](https://vercel.com/dashboard)
2. Выберите ваш проект
3. Перейдите в **Settings** → **Environment Variables**
4. Добавьте следующие переменные для **всех окружений** (Production, Preview, Development):

### Обязательные переменные:

```bash
NOCODB_URL=https://noco.povarnakolesah.ru
NOCODB_TOKEN=ваш_токен_доступа
```

### ID таблиц NocoDB:

```bash
NOCODB_TABLE_MEALS=mmtctn4flssh2ua
NOCODB_TABLE_EXTRAS=mksy21hmttmo855
NOCODB_TABLE_DELIVERY_ZONES=mpoppulqhsz1der
NOCODB_TABLE_USERS=mvrp4r9o3z69c45
NOCODB_TABLE_ORDERS=meddiicl0gr0r8y
NOCODB_TABLE_ORDER_PERSONS=mvr08d33zm5i8oi
NOCODB_TABLE_ORDER_MEALS=mz9uw5by177ygug
NOCODB_TABLE_ORDER_EXTRAS=mksy21hmttmo855
NOCODB_TABLE_PROMO_CODES=mgov8ce836696fy
NOCODB_TABLE_REVIEWS=mv8c69ib9muz9ki
```

### Как найти ID таблиц:

1. Откройте вашу базу данных в NocoDB
2. Откройте нужную таблицу
3. Посмотрите в URL браузера - ID таблицы будет в формате `md_xxxxx` или `mmtctn4flssh2ua`
4. Скопируйте этот ID и используйте его в переменной окружения

**Альтернативный способ:** Используйте endpoint `/api/db/tables` для получения списка всех таблиц с их ID.

## Шаг 2: Пересборка проекта

**ВАЖНО:** После добавления или изменения переменных окружения необходимо пересобрать проект:

1. В Vercel Dashboard перейдите в **Deployments**
2. Найдите последний деплой
3. Нажмите на три точки (⋯) → **Redeploy**
4. Или создайте новый деплой через Git push

## Шаг 3: Проверка конфигурации

### Использование диагностического endpoint

После деплоя откройте в браузере:

```
https://ваш-домен.vercel.app/api/diagnose
```

Этот endpoint покажет:
- ✅ Какие переменные окружения установлены
- ✅ Доступность NocoDB сервера
- ✅ Доступность каждой таблицы
- ❌ Список проблем и рекомендации по их решению

### Пример успешного ответа:

```json
{
  "summary": {
    "configured": true,
    "issues": [],
    "recommendations": ["✅ Конфигурация выглядит правильно!"]
  },
  "tables": {
    "Meals": {
      "accessible": true,
      "recordCount": 50
    }
  }
}
```

### Пример ответа с ошибками:

```json
{
  "summary": {
    "configured": false,
    "issues": [
      "NOCODB_URL не установлен",
      "NOCODB_TABLE_MEALS не установлен"
    ],
    "recommendations": [
      "Добавьте переменную окружения NOCODB_URL в Vercel Dashboard",
      "Добавьте переменную окружения NOCODB_TABLE_MEALS"
    ]
  }
}
```

## Шаг 4: Проверка логов

Если проблема сохраняется, проверьте логи:

1. В Vercel Dashboard → ваш проект → **Logs**
2. Ищите сообщения с префиксом `[MENU API]` или `[v0]`
3. Ошибки будут помечены как `❌`

### Типичные ошибки:

#### 1. "NocoDB not configured"
**Решение:** Проверьте, что все переменные окружения добавлены и проект пересобран.

#### 2. "TABLE_NOT_FOUND"
**Решение:** Проверьте правильность ID таблиц в переменных окружения.

#### 3. "Таймаут при подключении к NocoDB"
**Решение:** 
- Проверьте доступность NocoDB сервера
- Проверьте настройки firewall
- Убедитесь, что NocoDB не блокирует запросы с IP адресов Vercel

#### 4. "Ошибка аутентификации (401)"
**Решение:** Проверьте правильность `NOCODB_TOKEN`. Токен мог истечь или быть неверным.

## Шаг 5: Проверка доступа к NocoDB

### CORS настройки

Если NocoDB блокирует запросы:
1. В настройках NocoDB найдите раздел CORS
2. Добавьте домен Vercel в список разрешенных доменов
3. Или отключите CORS проверку (если безопасность позволяет)

### IP Whitelist

Если в NocoDB включен IP whitelist:
1. Узнайте IP адреса Vercel (они могут меняться)
2. Добавьте их в whitelist NocoDB
3. **Или** отключите IP whitelist для API токенов

### Firewall

Убедитесь, что:
- NocoDB доступен из интернета
- Порт 443 (HTTPS) открыт
- Нет блокировки по географическому расположению

## Быстрая проверка

Выполните следующие шаги для быстрой диагностики:

1. ✅ Проверьте переменные окружения в Vercel Dashboard
2. ✅ Пересоберите проект (Redeploy)
3. ✅ Откройте `/api/diagnose` для проверки конфигурации
4. ✅ Проверьте логи в Vercel Dashboard
5. ✅ Проверьте доступность NocoDB из браузера

## Полезные ссылки

- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)
- [NocoDB API Documentation](https://docs.nocodb.com/developer-resources/rest-apis)
- Диагностический endpoint: `/api/diagnose`
- Endpoint для получения списка таблиц: `/api/db/tables`

## Поддержка

Если проблема не решается:
1. Проверьте логи Vercel
2. Используйте `/api/diagnose` для детальной диагностики
3. Проверьте ответы API endpoints в Network tab браузера
4. Убедитесь, что NocoDB работает и доступен

