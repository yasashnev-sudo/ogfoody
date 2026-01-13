# ⚡ Быстрый старт: Деплой ogfoody.ru за 15 минут

## 📋 Что у вас уже есть:
- ✅ Домен: ogfoody.ru (reg.ru)
- ✅ Сервер: 5.129.194.168 (TimewebCloud)
- ✅ Git: github.com/yasashnev-sudo/ogfoody
- ✅ NocoDB: noco.povarnakolesah.ru

---

## 🚀 Шаг 1: Настройте DNS (2 минуты)

На reg.ru добавьте A-записи:
```
@ → 5.129.194.168
www → 5.129.194.168
```

---

## 🖥️ Шаг 2: Настройте сервер (5 минут)

```bash
# Подключитесь к серверу
ssh root@5.129.194.168

# Скачайте и запустите скрипт установки
curl -o server-setup.sh https://raw.githubusercontent.com/yasashnev-sudo/ogfoody/main/server-setup.sh
chmod +x server-setup.sh
bash server-setup.sh
```

Скрипт установит: Node.js, PM2, Nginx, Certbot

---

## 📦 Шаг 3: Загрузите проект (3 минуты)

```bash
cd /var/www/ogfoody
git clone https://github.com/yasashnev-sudo/ogfoody.git .

# Создайте .env.production
nano .env.production
```

Вставьте:
```env
NODE_ENV=production
PORT=3000
NOCODB_URL=https://noco.povarnakolesah.ru
NOCODB_TOKEN=ваш_токен

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

Сохраните: `Ctrl+O`, `Enter`, `Ctrl+X`

---

## 🏗️ Шаг 4: Соберите и запустите (2 минуты)

```bash
npm install
npm run build
pm2 start ecosystem.config.js
pm2 save
```

---

## 🌐 Шаг 5: Настройте Nginx (3 минуты)

```bash
# Временная конфигурация
cat > /etc/nginx/sites-available/ogfoody.conf << 'EOF'
server {
    listen 80;
    server_name ogfoody.ru www.ogfoody.ru;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
    }
}
EOF

ln -s /etc/nginx/sites-available/ogfoody.conf /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Получите SSL
certbot --nginx -d ogfoody.ru -d www.ogfoody.ru
```

---

## ✅ Готово!

Откройте: **https://ogfoody.ru**

---

## 🔄 Настройте автодеплой (опционально)

### На GitHub:

1. Откройте: https://github.com/yasashnev-sudo/ogfoody/settings/secrets/actions
2. Добавьте secrets:
   - `SERVER_HOST` = `5.129.194.168`
   - `SERVER_USER` = `root`
   - `SERVER_PASSWORD` = `ваш_пароль`
   - `SERVER_PATH` = `/var/www/ogfoody`

### Теперь при `git push` - автоматический деплой!

---

## 📱 Полезные команды

```bash
# Статус
pm2 status
pm2 logs ogfoody

# Перезапуск
pm2 restart ogfoody

# Проверка
curl https://ogfoody.ru/api/health
```

---

## 📖 Подробная документация

Полная инструкция: `DEPLOYMENT_GUIDE_OGFOODY.md`

---

**Проблемы?** Проверьте:
- DNS: `ping ogfoody.ru`
- PM2: `pm2 status`
- Nginx: `systemctl status nginx`
- Логи: `pm2 logs ogfoody`


