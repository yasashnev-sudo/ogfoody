#!/bin/bash

# ===========================================
# Скрипт для создания .env.local
# ===========================================

echo "🚀 Настройка переменных окружения для локальной разработки"
echo ""

# Проверяем, существует ли уже файл .env.local
if [ -f ".env.local" ]; then
    echo "⚠️  Файл .env.local уже существует!"
    read -p "Перезаписать? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Отменено"
        exit 0
    fi
fi

# Запрашиваем токен у пользователя
echo ""
echo "📝 Введите ваш NocoDB токен"
echo "   (Найти его можно в: https://noco.povarnakolesah.ru → Settings → API Tokens)"
echo ""
read -p "NOCODB_TOKEN: " token

# Проверяем, что токен не пустой
if [ -z "$token" ]; then
    echo "❌ Токен не может быть пустым!"
    exit 1
fi

# Создаем файл .env.local
cat > .env.local << EOF
# ===========================================
# ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ ДЛЯ ЛОКАЛЬНОЙ РАЗРАБОТКИ
# ===========================================
# Автоматически создано: $(date)
# ===========================================

# NocoDB Configuration
NOCODB_URL=https://noco.povarnakolesah.ru
NOCODB_TOKEN=$token

# NocoDB Table IDs
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

echo ""
echo "✅ Файл .env.local успешно создан!"
echo ""
echo "📋 Следующие шаги:"
echo "   1. Перезапустите dev сервер (Ctrl+C, затем npm run dev)"
echo "   2. Откройте http://localhost:3000"
echo "   3. Товары должны загрузиться!"
echo ""
echo "🔍 Для проверки конфигурации откройте: http://localhost:3000/api/diagnose"
echo ""

