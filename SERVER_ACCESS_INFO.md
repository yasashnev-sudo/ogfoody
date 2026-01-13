# 🔐 Информация о доступах к серверу ogfoody.ru

## 📡 SSH Доступ к серверу

### Основные данные:
```bash
Хост: 5.129.194.168
Пользователь: root
Пароль: pULRoAvF@P-@4Y
Порт: 22 (стандартный)
```

### Команда подключения:
```bash
ssh root@5.129.194.168
```

---

## 🌐 Домены

### Основной сайт:
- **URL**: https://ogfoody.ru
- **IP**: 5.129.194.168
- **SSL**: Let's Encrypt (автопродление)
- **Срок действия**: до апреля 2026

### База данных (NocoDB):
- **URL**: https://noco.povarnakolesah.ru
- **Внутренний URL**: http://172.20.0.2:8080
- **SSL**: Let's Encrypt (автопродление)
- **Срок действия**: до апреля 2026

---

## 📁 Структура проекта на сервере

### Основная директория:
```
/var/www/ogfoody/
```

### Важные файлы и папки:
```bash
/var/www/ogfoody/
├── .env.production          # Переменные окружения (секретные!)
├── .next/                   # Собранное приложение Next.js
├── app/                     # Исходный код приложения
├── components/              # React компоненты
├── lib/                     # Библиотеки (включая nocodb.ts)
├── public/                  # Статические файлы
├── node_modules/            # Зависимости
├── package.json             # Зависимости проекта
├── next.config.mjs          # Конфигурация Next.js
├── logs/                    # Логи PM2
│   ├── err.log             # Ошибки приложения
│   ├── out.log             # Стандартный вывод
│   └── pm2.log             # Логи PM2
└── ecosystem.config.js      # Конфигурация PM2
```

---

## 🔧 Управление приложением

### PM2 (Process Manager)

**Приложение запущено через PM2 под именем**: `ogfoody`

#### Основные команды:
```bash
# Статус приложения
pm2 status

# Подробная информация
pm2 info ogfoody

# Логи в реальном времени
pm2 logs ogfoody

# Последние N строк логов
pm2 logs ogfoody --lines 100

# Только ошибки
pm2 logs ogfoody --err

# Перезапуск
pm2 restart ogfoody

# Остановка
pm2 stop ogfoody

# Запуск
pm2 start ogfoody

# Перезагрузка без даунтайма
pm2 reload ogfoody

# Очистить логи
pm2 flush ogfoody
```

#### Конфигурация PM2:
```javascript
// /var/www/ogfoody/ecosystem.config.js
module.exports = {
  apps: [{
    name: 'ogfoody',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    cron_restart: '0 4 * * *', // Ежедневный перезапуск в 4 утра
    log_file: '/var/www/ogfoody/logs/pm2.log',
    error_file: '/var/www/ogfoody/logs/err.log',
    out_file: '/var/www/ogfoody/logs/out.log',
    merge_logs: true,
    max_memory_restart: '500M',
    instances: 1,
    exec_mode: 'fork',
  }]
}
```

---

## 📊 Логи

### Расположение логов:

#### Логи приложения (PM2):
```bash
# Ошибки приложения
/var/www/ogfoody/logs/err.log

# Стандартный вывод (console.log)
/var/www/ogfoody/logs/out.log

# Логи PM2
/var/www/ogfoody/logs/pm2.log

# Просмотр в реальном времени
tail -f /var/www/ogfoody/logs/err.log
tail -f /var/www/ogfoody/logs/out.log
```

#### Логи Nginx:
```bash
# Логи доступа
/var/log/nginx/access.log

# Логи ошибок Nginx
/var/log/nginx/error.log

# Логи для ogfoody.ru (если настроены отдельно)
/var/log/nginx/ogfoody_access.log
/var/log/nginx/ogfoody_error.log

# Логи для NocoDB
/var/log/nginx/nocodb_access.log
/var/log/nginx/nocodb_error.log

# Просмотр последних записей
tail -100 /var/log/nginx/error.log
tail -100 /var/log/nginx/access.log

# Поиск ошибок
grep -i error /var/log/nginx/error.log | tail -50
```

#### Логи системы:
```bash
# Системные логи
/var/log/syslog

# Логи авторизации
/var/log/auth.log
```

---

## 🗄️ База данных (NocoDB)

### Docker контейнеры:

```bash
# Список контейнеров
docker ps

# Логи NocoDB
docker logs nocodb-nocodb-1

# Логи PostgreSQL
docker logs nocodb-db-1

# Войти в контейнер NocoDB
docker exec -it nocodb-nocodb-1 sh

# Войти в PostgreSQL
docker exec -it nocodb-db-1 psql -U postgres -d nocodb
```

### Подключение к PostgreSQL:

```bash
# Из Docker контейнера
docker exec -it nocodb-db-1 psql -U postgres -d nocodb

# Информация о подключении
Хост: nocodb-db-1 (внутри Docker сети)
Пользователь: postgres
Пароль: your_password (см. /root/nocodb/docker-compose.yml)
База данных: nocodb
Порт: 5432 (внутри Docker)
```

### База данных проекта:
```bash
База: FooD
ID: p9id5v4q0ukk9iz
Схема PostgreSQL: p9id5v4q0ukk9iz

# Пример запроса
docker exec nocodb-db-1 psql -U postgres -d nocodb -c "
SELECT COUNT(*) FROM \"p9id5v4q0ukk9iz\".\"orders\";
"
```

### Backup базы данных:
```bash
# Создать backup
docker exec nocodb-db-1 pg_dump -U postgres nocodb > /root/nocodb_backup_$(date +%Y%m%d).sql

# Восстановить из backup
docker exec -i nocodb-db-1 psql -U postgres nocodb < /root/nocodb_backup_20260112.sql
```

---

## 🌐 Nginx конфигурация

### Конфигурационные файлы:

```bash
# Конфигурация для ogfoody.ru
/etc/nginx/sites-available/ogfoody.conf
/etc/nginx/sites-enabled/ogfoody.conf -> /etc/nginx/sites-available/ogfoody.conf

# Конфигурация для noco.povarnakolesah.ru
/etc/nginx/sites-available/nocodb
/etc/nginx/sites-enabled/nocodb -> /etc/nginx/sites-available/nocodb

# Основная конфигурация
/etc/nginx/nginx.conf
```

### Управление Nginx:

```bash
# Проверка конфигурации
nginx -t

# Перезагрузка конфигурации (без даунтайма)
systemctl reload nginx

# Перезапуск
systemctl restart nginx

# Статус
systemctl status nginx

# Просмотр активных соединений
netstat -tulpn | grep nginx
```

### Конфигурация ogfoody.ru:
```nginx
# /etc/nginx/sites-enabled/ogfoody.conf
server {
    listen 80;
    server_name ogfoody.ru www.ogfoody.ru;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ogfoody.ru www.ogfoody.ru;

    ssl_certificate /etc/letsencrypt/live/ogfoody.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ogfoody.ru/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔐 Переменные окружения

### Файл на сервере:
```bash
/var/www/ogfoody/.env.production
```

### Содержимое (актуальное):
```bash
# === NocoDB Configuration ===
NOCODB_URL=http://172.20.0.2:8080
NOCODB_TOKEN=JxMXciv6zpc7jhRrdFWlZW_lD3h6dWv0Z7mLpULV

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
```

### Просмотр переменных:
```bash
# Просмотр файла (осторожно - содержит секреты!)
cat /var/www/ogfoody/.env.production

# Переменные PM2 процесса
pm2 env ogfoody
```

---

## 🔄 Git репозиторий

### Информация о репозитории:

```bash
cd /var/www/ogfoody

# Текущая ветка
git branch

# Последние коммиты
git log --oneline -10

# Статус
git status

# Обновить код
git pull origin main
```

### GitHub репозиторий:
```
URL: (необходимо уточнить у пользователя)
Ветка: main
```

---

## 📡 API Endpoints

### Основные endpoints:

```bash
# Health check
GET https://ogfoody.ru/api/health

# Меню
GET https://ogfoody.ru/api/menu
GET https://ogfoody.ru/api/menu?week=current
GET https://ogfoody.ru/api/menu?week=next

# Заказы
GET https://ogfoody.ru/api/orders
POST https://ogfoody.ru/api/orders
GET https://ogfoody.ru/api/orders/[id]
PATCH https://ogfoody.ru/api/orders/[id]

# Пользователи (если есть)
GET https://ogfoody.ru/api/users
POST https://ogfoody.ru/api/users

# Debug endpoints (если нужно создать)
GET https://ogfoody.ru/api/debug/logs
GET https://ogfoody.ru/api/debug/status
```

---

## 🛠️ Системная информация

### Операционная система:
```bash
# Информация о системе
uname -a
# Linux ... Ubuntu

# Версия Ubuntu
lsb_release -a

# Версия ядра
uname -r
```

### Установленное ПО:

```bash
# Node.js
node --version
# v18.x или v20.x

# npm
npm --version

# PM2
pm2 --version

# Nginx
nginx -v

# Docker
docker --version

# Docker Compose
docker-compose --version

# Git
git --version
```

### Ресурсы сервера:

```bash
# Использование диска
df -h

# Использование памяти
free -h

# Нагрузка CPU
top -n 1

# Процессы
ps aux | grep -E "node|nginx|docker"

# Открытые порты
netstat -tulpn
```

---

## 📝 Workflow для деплоя

### Полный процесс деплоя:

```bash
# 1. Подключение к серверу
ssh root@5.129.194.168

# 2. Переход в директорию проекта
cd /var/www/ogfoody

# 3. Обновление кода
git pull origin main

# 4. Установка зависимостей (если добавлялись новые)
npm install

# 5. Сборка проекта
npm run build

# 6. Перезапуск приложения
pm2 restart ogfoody

# 7. Проверка логов
pm2 logs ogfoody --lines 50

# 8. Проверка статуса
pm2 status

# 9. Проверка доступности
curl https://ogfoody.ru/api/health
```

---

## 🚨 Для настройки системы логирования ошибок

### Рекомендуемые решения:

#### Вариант 1: Sentry (рекомендуется)
```bash
# Установить Sentry SDK
npm install @sentry/nextjs

# Создать файлы конфигурации:
# - sentry.client.config.js
# - sentry.server.config.js
# - sentry.edge.config.js

# Добавить в .env.production
SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_token
```

#### Вариант 2: Простая система логирования в файлы
```bash
# Создать директорию для error logs
mkdir -p /var/www/ogfoody/error-logs

# Дать права на запись
chown -R root:root /var/www/ogfoody/error-logs
chmod 755 /var/www/ogfoody/error-logs
```

#### Вариант 3: Winston Logger
```bash
# Установить Winston
npm install winston

# Конфигурация будет логировать в файлы:
# /var/www/ogfoody/logs/error.log
# /var/www/ogfoody/logs/combined.log
```

### Доступ к логам для анализа:

```bash
# Просмотр логов ошибок
tail -f /var/www/ogfoody/logs/err.log

# Поиск конкретной ошибки
grep -i "error_text" /var/www/ogfoody/logs/err.log

# Логи за определенный период
journalctl -u pm2-root --since "2026-01-12 00:00:00" --until "2026-01-12 23:59:59"

# Экспорт логов
cat /var/www/ogfoody/logs/err.log > /tmp/error-export.log
```

---

## 🔒 Безопасность

### ⚠️ ВАЖНО для другого агента:

1. **НЕ коммитить в Git**:
   - `.env.production`
   - Логи с персональными данными
   - Секретные ключи

2. **НЕ публиковать**:
   - SSH пароль
   - Database пароли
   - API токены
   - NOCODB_TOKEN

3. **Рекомендации**:
   - Хранить логи с ошибками временно (7-30 дней)
   - Анонимизировать персональные данные в логах
   - Использовать HTTPS для передачи логов
   - Ограничить доступ к error logs по IP если возможно

---

## 📞 Полезные команды для диагностики

### Быстрая проверка здоровья системы:

```bash
#!/bin/bash
echo "=== Статус PM2 ==="
pm2 status

echo -e "\n=== Статус Nginx ==="
systemctl status nginx --no-pager

echo -e "\n=== Docker контейнеры ==="
docker ps

echo -e "\n=== Последние ошибки PM2 ==="
pm2 logs ogfoody --err --lines 10 --nostream

echo -e "\n=== Использование диска ==="
df -h | grep -E "Filesystem|/dev/sda"

echo -e "\n=== Использование памяти ==="
free -h

echo -e "\n=== API Health Check ==="
curl -s https://ogfoody.ru/api/health | head -5
```

---

## 📊 Мониторинг

### PM2 Monitoring:
```bash
# Real-time мониторинг
pm2 monit

# Метрики
pm2 describe ogfoody

# Список всех процессов
pm2 list
```

### Nginx Status:
```bash
# Проверка конфигурации
nginx -t

# Статус сервиса
systemctl status nginx
```

---

## ⚡ Quick Reference

### SSH:
```bash
ssh root@5.129.194.168
```

### Важные пути:
```bash
Проект: /var/www/ogfoody
Логи PM2: /var/www/ogfoody/logs/
Логи Nginx: /var/log/nginx/
Конфиг Nginx: /etc/nginx/sites-enabled/
.env: /var/www/ogfoody/.env.production
```

### Быстрые команды:
```bash
# Деплой
cd /var/www/ogfoody && git pull && npm run build && pm2 restart ogfoody

# Логи
pm2 logs ogfoody

# Перезапуск
pm2 restart ogfoody

# Проверка
curl https://ogfoody.ru/api/health
```

---

**Эта информация содержит секретные данные! Храни безопасно! 🔒**


