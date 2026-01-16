#!/bin/bash
# Скрипт установки systemd timer для обработки pending транзакций баллов лояльности

set -e

echo "🔧 Установка systemd timer для обработки pending транзакций баллов лояльности"
echo ""

# Проверяем, что скрипт запущен от root
if [ "$EUID" -ne 0 ]; then 
  echo "❌ Ошибка: скрипт должен быть запущен от root"
  echo "Используйте: sudo bash scripts/install-systemd-timer.sh"
  exit 1
fi

# Путь к файлам проекта
PROJECT_DIR="/var/www/ogfoody"
SYSTEMD_DIR="/etc/systemd/system"

# Проверяем, что проект существует
if [ ! -d "$PROJECT_DIR" ]; then
  echo "❌ Ошибка: директория проекта не найдена: $PROJECT_DIR"
  exit 1
fi

echo "📁 Копируем systemd файлы..."

# Копируем service файл
cp "$PROJECT_DIR/systemd/ogfoody-loyalty-points.service" "$SYSTEMD_DIR/"
echo "✅ Скопирован: ogfoody-loyalty-points.service"

# Копируем timer файл
cp "$PROJECT_DIR/systemd/ogfoody-loyalty-points.timer" "$SYSTEMD_DIR/"
echo "✅ Скопирован: ogfoody-loyalty-points.timer"

# Перезагружаем systemd для загрузки новых файлов
echo ""
echo "🔄 Перезагружаем systemd daemon..."
systemctl daemon-reload
echo "✅ Systemd daemon перезагружен"

# Включаем и запускаем timer
echo ""
echo "🚀 Включаем и запускаем timer..."
systemctl enable ogfoody-loyalty-points.timer
systemctl start ogfoody-loyalty-points.timer
echo "✅ Timer включен и запущен"

# Показываем статус
echo ""
echo "📊 Статус timer:"
systemctl status ogfoody-loyalty-points.timer --no-pager -l

echo ""
echo "📅 Следующий запуск:"
systemctl list-timers ogfoody-loyalty-points.timer --no-pager

echo ""
echo "✅ Установка завершена!"
echo ""
echo "📝 Полезные команды:"
echo "  - Статус timer: systemctl status ogfoody-loyalty-points.timer"
echo "  - Логи service: journalctl -u ogfoody-loyalty-points.service -f"
echo "  - Запуск вручную: systemctl start ogfoody-loyalty-points.service"
echo "  - Остановка timer: systemctl stop ogfoody-loyalty-points.timer"
echo "  - Отключение timer: systemctl disable ogfoody-loyalty-points.timer"
