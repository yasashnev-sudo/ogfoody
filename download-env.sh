#!/bin/bash

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}📥 Скачивание .env.production с сервера${NC}"
echo ""

# Скачиваем .env.production с сервера
scp root@5.129.194.168:/var/www/ogfoody/.env.production ./.env.production.temp

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Файл скачан как .env.production.temp${NC}"
    
    # Создаём .env.local для разработки
    cp .env.production.temp .env.local
    
    # Меняем URL на публичный для локальной разработки
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' 's|NOCODB_URL=http://172.20.0.2:8080|NOCODB_URL=https://noco.povarnakolesah.ru|g' .env.local
        sed -i '' 's|NODE_ENV=production|NODE_ENV=development|g' .env.local
        sed -i '' 's|NEXT_PUBLIC_APP_URL=https://ogfoody.ru|NEXT_PUBLIC_APP_URL=http://localhost:3000|g' .env.local
    else
        # Linux
        sed -i 's|NOCODB_URL=http://172.20.0.2:8080|NOCODB_URL=https://noco.povarnakolesah.ru|g' .env.local
        sed -i 's|NODE_ENV=production|NODE_ENV=development|g' .env.local
        sed -i 's|NEXT_PUBLIC_APP_URL=https://ogfoody.ru|NEXT_PUBLIC_APP_URL=http://localhost:3000|g' .env.local
    fi
    
    echo -e "${GREEN}✅ Создан .env.local для локальной разработки${NC}"
    echo ""
    echo -e "${BLUE}📋 Содержимое .env.local:${NC}"
    cat .env.local
    
    # Удаляем временный файл
    rm .env.production.temp
    
    echo ""
    echo -e "${YELLOW}================================${NC}"
    echo -e "${GREEN}Готово! Теперь можешь запустить:${NC}"
    echo -e "${BLUE}npm run dev${NC}"
    echo -e "${YELLOW}================================${NC}"
else
    echo -e "${RED}❌ Ошибка при скачивании файла${NC}"
fi


