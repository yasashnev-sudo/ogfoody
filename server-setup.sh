#!/bin/bash

# Автоматическая настройка сервера для ogfoody.ru
# Запускать на сервере от root: bash server-setup.sh

set -e

echo "🚀 Настройка сервера для ogfoody.ru"
echo "===================================="

# Цвета
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Проверка что запущено от root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Запустите скрипт от root: sudo bash server-setup.sh${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Запущено от root${NC}"

# Обновление системы
echo -e "${BLUE}📦 Обновление системы...${NC}"
apt update
apt upgrade -y

# Установка базовых утилит
echo -e "${BLUE}🔧 Установка базовых утилит...${NC}"
apt install -y curl wget git build-essential ufw

# Установка Node.js 20.x
echo -e "${BLUE}📦 Установка Node.js 20.x...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
    echo -e "${GREEN}✅ Node.js установлен: $(node -v)${NC}"
else
    echo -e "${YELLOW}⚠️  Node.js уже установлен: $(node -v)${NC}"
fi

# Установка PM2
echo -e "${BLUE}📦 Установка PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    pm2 startup systemd -u root --hp /root
    echo -e "${GREEN}✅ PM2 установлен${NC}"
else
    echo -e "${YELLOW}⚠️  PM2 уже установлен${NC}"
fi

# Установка Nginx
echo -e "${BLUE}📦 Установка Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
    systemctl enable nginx
    systemctl start nginx
    echo -e "${GREEN}✅ Nginx установлен${NC}"
else
    echo -e "${YELLOW}⚠️  Nginx уже установлен${NC}"
fi

# Установка Certbot для SSL
echo -e "${BLUE}🔒 Установка Certbot...${NC}"
if ! command -v certbot &> /dev/null; then
    apt install -y certbot python3-certbot-nginx
    echo -e "${GREEN}✅ Certbot установлен${NC}"
else
    echo -e "${YELLOW}⚠️  Certbot уже установлен${NC}"
fi

# Настройка firewall
echo -e "${BLUE}🔥 Настройка firewall...${NC}"
ufw --force enable
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw allow 22/tcp
echo -e "${GREEN}✅ Firewall настроен${NC}"

# Создание директории для проекта
echo -e "${BLUE}📁 Создание директорий...${NC}"
mkdir -p /var/www/ogfoody
mkdir -p /var/www/ogfoody/logs
mkdir -p /var/www/letsencrypt
chown -R www-data:www-data /var/www/letsencrypt

# Клонирование проекта (если еще не склонирован)
echo -e "${BLUE}📥 Клонирование проекта...${NC}"
if [ ! -d "/var/www/ogfoody/.git" ]; then
    read -p "Клонировать проект из GitHub? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd /var/www/ogfoody
        git clone https://github.com/yasashnev-sudo/ogfoody.git .
        echo -e "${GREEN}✅ Проект склонирован${NC}"
    fi
fi

# Настройка переменных окружения
echo -e "${BLUE}⚙️  Настройка переменных окружения...${NC}"
if [ ! -f "/var/www/ogfoody/.env.production" ]; then
    echo -e "${YELLOW}⚠️  Создайте файл .env.production${NC}"
    echo "Используйте шаблон из .env.production.example"
    
    cat > /var/www/ogfoody/.env.production << 'EOF'
# Базовая конфигурация - ЗАМЕНИТЕ НА СВОИ ЗНАЧЕНИЯ!
NODE_ENV=production
PORT=3000

NOCODB_URL=https://noco.povarnakolesah.ru
NOCODB_TOKEN=YOUR_TOKEN_HERE

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
EOF
    
    echo -e "${GREEN}✅ Создан шаблон .env.production${NC}"
    echo -e "${RED}⚠️  ВАЖНО: Отредактируйте /var/www/ogfoody/.env.production${NC}"
fi

# Установка зависимостей и сборка (если проект уже есть)
if [ -f "/var/www/ogfoody/package.json" ]; then
    echo -e "${BLUE}📦 Установка зависимостей...${NC}"
    cd /var/www/ogfoody
    npm install
    
    echo -e "${BLUE}🏗️  Сборка проекта...${NC}"
    npm run build
    
    echo -e "${GREEN}✅ Проект собран${NC}"
fi

# Настройка Nginx для ogfoody.ru
echo -e "${BLUE}🌐 Настройка Nginx...${NC}"
echo "Скопируйте конфигурацию из nginx-ogfoody.conf"
echo "Команды:"
echo "  1. Скопируйте nginx-ogfoody.conf в /etc/nginx/sites-available/ogfoody.conf"
echo "  2. ln -s /etc/nginx/sites-available/ogfoody.conf /etc/nginx/sites-enabled/"
echo "  3. nginx -t"
echo "  4. systemctl reload nginx"

# Установка SSL сертификата
echo -e "${BLUE}🔒 Получение SSL сертификата...${NC}"
read -p "Получить SSL сертификат для ogfoody.ru? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Сначала нужна базовая конфигурация Nginx
    cat > /etc/nginx/sites-available/ogfoody-temp.conf << 'EOF'
server {
    listen 80;
    server_name ogfoody.ru www.ogfoody.ru;
    
    location /.well-known/acme-challenge/ {
        root /var/www/letsencrypt;
    }
    
    location / {
        return 301 https://ogfoody.ru$request_uri;
    }
}
EOF
    
    ln -sf /etc/nginx/sites-available/ogfoody-temp.conf /etc/nginx/sites-enabled/
    nginx -t && systemctl reload nginx
    
    certbot certonly --webroot -w /var/www/letsencrypt -d ogfoody.ru -d www.ogfoody.ru --agree-tos --no-eff-email --email admin@ogfoody.ru
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ SSL сертификат получен${NC}"
        echo "Теперь используйте полную конфигурацию nginx-ogfoody.conf"
    fi
fi

# Запуск приложения через PM2
if [ -f "/var/www/ogfoody/ecosystem.config.js" ]; then
    echo -e "${BLUE}🚀 Запуск приложения...${NC}"
    cd /var/www/ogfoody
    pm2 start ecosystem.config.js
    pm2 save
    echo -e "${GREEN}✅ Приложение запущено${NC}"
fi

echo ""
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}✅ Настройка сервера завершена!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo -e "${YELLOW}📋 Что нужно сделать дальше:${NC}"
echo ""
echo "1. Отредактируйте .env.production:"
echo "   nano /var/www/ogfoody/.env.production"
echo ""
echo "2. Скопируйте конфигурацию Nginx:"
echo "   # Загрузите nginx-ogfoody.conf на сервер"
echo "   cp nginx-ogfoody.conf /etc/nginx/sites-available/ogfoody.conf"
echo "   ln -s /etc/nginx/sites-available/ogfoody.conf /etc/nginx/sites-enabled/"
echo "   nginx -t && systemctl reload nginx"
echo ""
echo "3. Проверьте работу приложения:"
echo "   pm2 status"
echo "   pm2 logs ogfoody"
echo ""
echo "4. Откройте в браузере: https://ogfoody.ru"
echo ""
echo -e "${BLUE}Полезные команды:${NC}"
echo "  pm2 status          - статус приложений"
echo "  pm2 logs ogfoody    - логи приложения"
echo "  pm2 restart ogfoody - перезапуск"
echo "  nginx -t            - проверка конфига Nginx"
echo "  systemctl status nginx - статус Nginx"
echo ""

