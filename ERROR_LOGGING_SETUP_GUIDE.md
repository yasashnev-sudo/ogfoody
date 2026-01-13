# 🐛 Инструкция: Настройка системы логирования ошибок

## 📋 Цель
Настроить систему логирования и отслеживания ошибок на production сервере для проекта ogfoody.ru

---

## 🔐 Доступы (из SERVER_ACCESS_INFO.md)

```bash
SSH: ssh root@5.129.194.168
Пароль: pULRoAvF@P-@4Y
Директория проекта: /var/www/ogfoody
```

---

## 🎯 Требования к системе логирования

### Что должно логироваться:

1. **JavaScript ошибки в браузере**
   - Uncaught exceptions
   - Promise rejections
   - Network errors
   - Component errors (React Error Boundaries)

2. **API ошибки на сервере**
   - HTTP 500 errors
   - Database connection errors
   - NocoDB API errors
   - Validation errors

3. **Бизнес-логика ошибки**
   - Ошибки создания заказов
   - Ошибки обработки платежей
   - Ошибки отправки уведомлений

4. **Performance issues**
   - Медленные API запросы (>3 sec)
   - Memory leaks
   - High CPU usage

### Что НЕ должно логироваться:
- Пароли пользователей
- Токены API (полностью)
- Номера кредитных карт
- Полные адреса и телефоны (можно анонимизировать)

---

## 🛠️ Рекомендуемые решения

### Вариант 1: Sentry (рекомендуется) ⭐

**Преимущества:**
- Облачное решение (не нагружает сервер)
- Автоматическая группировка ошибок
- Source maps для отладки
- Интеграции (Slack, email, и т.д.)
- 5,000 events/месяц бесплатно

**Установка:**

```bash
# 1. Подключись к серверу
ssh root@5.129.194.168

# 2. Перейди в проект
cd /var/www/ogfoody

# 3. Установи Sentry SDK
npm install @sentry/nextjs

# 4. Инициализируй Sentry
npx @sentry/wizard@latest -i nextjs

# 5. Следуй инструкциям wizard'а
```

**Конфигурация:**

Создай файлы:

1. `sentry.client.config.js`:
```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
  environment: process.env.NODE_ENV,
  beforeSend(event) {
    // Анонимизируй чувствительные данные
    if (event.request) {
      delete event.request.cookies;
    }
    return event;
  },
});
```

2. `sentry.server.config.js`:
```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
  environment: process.env.NODE_ENV,
});
```

3. Добавь в `.env.production`:
```bash
NEXT_PUBLIC_SENTRY_DSN=https://ваш_dsn@sentry.io/проект_id
SENTRY_DSN=https://ваш_dsn@sentry.io/проект_id
SENTRY_AUTH_TOKEN=ваш_токен
SENTRY_ORG=ваша_организация
SENTRY_PROJECT=ogfoody
```

4. Деплой:
```bash
npm run build
pm2 restart ogfoody
```

---

### Вариант 2: Winston + File Logging

**Преимущества:**
- Полный контроль над данными
- Бесплатно
- Работает офлайн

**Недостатки:**
- Нужно самому анализировать логи
- Занимает место на диске
- Нужно настраивать ротацию логов

**Установка:**

```bash
# Подключись к серверу
ssh root@5.129.194.168
cd /var/www/ogfoody

# Установи Winston
npm install winston winston-daily-rotate-file
```

**Конфигурация:**

Создай `lib/logger.ts`:
```typescript
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const fileRotateTransport = new DailyRotateFile({
  filename: '/var/www/ogfoody/logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d', // Хранить 14 дней
  maxSize: '20m',
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  )
});

const logger = winston.createLogger({
  transports: [
    fileRotateTransport,
    new winston.transports.File({
      filename: '/var/www/ogfoody/logs/combined.log',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    })
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
```

**Использование в API:**

```typescript
import logger from '@/lib/logger';

export async function POST(request: Request) {
  try {
    // ваш код
  } catch (error) {
    logger.error('Failed to create order', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userId: userId, // если есть
      // НЕ логируй: пароли, токены, карты
    });
    
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
```

**Деплой:**
```bash
npm run build
pm2 restart ogfoody
```

---

### Вариант 3: Custom Error Tracking API

Создай собственный endpoint для логирования ошибок.

**Создай** `app/api/log-error/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: body.level || 'error',
      message: body.message,
      stack: body.stack,
      url: body.url,
      userAgent: request.headers.get('user-agent'),
      // Анонимизируй IP (последний октет)
      ip: request.headers.get('x-forwarded-for')?.split('.').slice(0, 3).join('.') + '.xxx',
    };
    
    const logPath = '/var/www/ogfoody/error-logs/errors.json';
    
    // Append to log file
    fs.appendFileSync(
      logPath,
      JSON.stringify(logEntry) + '\n',
      'utf-8'
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to log error:', error);
    return NextResponse.json({ error: 'Failed to log' }, { status: 500 });
  }
}
```

**На клиенте** (в `app/layout.tsx`):

```typescript
'use client';

import { useEffect } from 'react';

export default function RootLayout({ children }) {
  useEffect(() => {
    // Логируем JS ошибки
    window.addEventListener('error', (event) => {
      fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: 'error',
          message: event.message,
          stack: event.error?.stack,
          url: window.location.href,
        }),
      }).catch(console.error);
    });
    
    // Логируем unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: 'error',
          message: 'Unhandled Promise Rejection: ' + event.reason,
          url: window.location.href,
        }),
      }).catch(console.error);
    });
  }, []);
  
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

**Настрой директорию для логов:**
```bash
ssh root@5.129.194.168
mkdir -p /var/www/ogfoody/error-logs
chmod 755 /var/www/ogfoody/error-logs
```

---

## 📊 Мониторинг логов

### Просмотр логов:

```bash
# SSH на сервер
ssh root@5.129.194.168

# Смотри логи PM2
pm2 logs ogfoody --lines 100

# Смотри error logs
tail -f /var/www/ogfoody/logs/err.log

# Смотри custom error logs (если используешь вариант 3)
tail -f /var/www/ogfoody/error-logs/errors.json

# Поиск конкретной ошибки
grep -i "error_keyword" /var/www/ogfoody/logs/err.log

# Статистика ошибок за сегодня
grep "$(date +%Y-%m-%d)" /var/www/ogfoody/logs/err.log | wc -l
```

### Экспорт логов:

```bash
# Экспортировать логи за период
cat /var/www/ogfoody/logs/err.log > /tmp/errors-export.log

# Скачать на локальную машину
scp root@5.129.194.168:/tmp/errors-export.log ./
```

---

## 🚨 React Error Boundary

Добавь Error Boundary для отлова ошибок компонентов.

**Создай** `components/error-boundary.tsx`:

```typescript
'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Логируй ошибку
    console.error('ErrorBoundary caught:', error, errorInfo);
    
    // Отправь на сервер
    fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level: 'error',
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        url: window.location.href,
      }),
    }).catch(console.error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Что-то пошло не так</h2>
          <p>Мы уже работаем над исправлением</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Используй в layout:**

```typescript
import { ErrorBoundary } from '@/components/error-boundary';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

---

## 📈 Мониторинг Performance

Добавь логирование медленных запросов.

**В API роутах:**

```typescript
export async function GET(request: Request) {
  const startTime = Date.now();
  
  try {
    // твой код
    const result = await fetchData();
    
    const duration = Date.now() - startTime;
    
    // Логируй если медленно
    if (duration > 3000) {
      console.warn(`Slow API call: ${request.url} took ${duration}ms`);
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}
```

---

## 🔄 Ротация логов

Настрой автоматическую очистку старых логов.

**Создай cron job:**

```bash
ssh root@5.129.194.168

# Открой crontab
crontab -e

# Добавь строку (удалять логи старше 30 дней каждую ночь в 2:00)
0 2 * * * find /var/www/ogfoody/logs -name "*.log" -mtime +30 -delete
0 2 * * * find /var/www/ogfoody/error-logs -name "*.json" -mtime +30 -delete
```

---

## ✅ Чеклист установки

- [ ] Выбрал решение для логирования (Sentry / Winston / Custom)
- [ ] Установил необходимые пакеты
- [ ] Создал конфигурационные файлы
- [ ] Добавил переменные в `.env.production`
- [ ] Добавил Error Boundary
- [ ] Настроил логирование в API роутах
- [ ] Пересобрал проект (`npm run build`)
- [ ] Перезапустил PM2 (`pm2 restart ogfoody`)
- [ ] Протестировал (вызвал тестовую ошибку)
- [ ] Проверил что логи появляются
- [ ] Настроил ротацию логов
- [ ] Задокументировал для команды

---

## 🧪 Тестирование

### Создай тестовый endpoint:

```typescript
// app/api/test-error/route.ts
export async function GET() {
  throw new Error('Test error from API');
}
```

### Проверь:

```bash
# Вызови ошибку
curl https://ogfoody.ru/api/test-error

# Проверь логи
ssh root@5.129.194.168
pm2 logs ogfoody --lines 10
```

---

## 📞 Полезные ссылки

- **Sentry Docs**: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- **Winston Docs**: https://github.com/winstonjs/winston
- **Next.js Error Handling**: https://nextjs.org/docs/advanced-features/error-handling

---

**Удачи с настройкой! 🚀**


