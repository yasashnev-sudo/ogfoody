# Проект доставки еды

## 🚀 Быстрый старт

### Настройка NocoDB

Проект использует NocoDB для хранения данных. Вы можете автоматически создать все необходимые таблицы:

1. **Установите переменные окружения:**
   ```env
   NOCODB_URL=https://your-nocodb-instance.com
   NOCODB_TOKEN=your-access-token
   NOCODB_BASE_ID=your-base-id
   ```

2. **Запустите сервер:**
   ```bash
   npm run dev
   ```

3. **Создайте таблицы автоматически:**
   ```bash
   curl -X POST http://localhost:3000/api/db/setup-tables
   ```
   
   Или откройте в браузере: `http://localhost:3000/api/db/setup-tables`

4. **Обновите переменные окружения** с новыми ID таблиц из ответа

Подробная инструкция: [NOCODB_AUTO_SETUP.md](./NOCODB_AUTO_SETUP.md)

### Проверка структуры таблиц

После настройки проверьте структуру таблиц:
```bash
curl http://localhost:3000/api/db/check-structure
```

## 📚 Документация

- [Автоматическое создание таблиц](./NOCODB_AUTO_SETUP.md)
- [Анализ структуры таблиц](./NOCODB_STRUCTURE_ANALYSIS.md)

---

Get started by customizing your environment (defined in the .idx/dev.nix file) with the tools and IDE extensions you'll need for your project!

Learn more at https://developers.google.com/idx/guides/customize-idx-env