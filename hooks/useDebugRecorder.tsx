'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface LogEntry {
  timestamp: string;
  level: 'log' | 'error' | 'warn' | 'info';
  message: string;
  data?: any;
}

interface CaptureErrorOptions {
  errorMessage?: string;
  data?: any;
  userComment?: string; // ✅ Комментарий пользователя
}

export function useDebugRecorder(userId?: string, userEmail?: string) {
  const logsRef = useRef<LogEntry[]>([]);
  const maxLogs = 1000; // Храним последние 1000 логов (увеличено для полной записи)
  const [isCapturing, setIsCapturing] = useState(false);
  // Состояние для принудительного обновления компонентов при изменении логов
  const [logsVersion, setLogsVersion] = useState(0);
  
  // 🔥 НОВОЕ: Режим записи логов браузера (по умолчанию выключен)
  const [isLoggingEnabled, setIsLoggingEnabledState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('debug_logging_enabled');
      return saved === 'true';
    }
    return false;
  });

  // Добавляем лог в массив
  const addLog = useCallback((level: LogEntry['level'], message: string, data?: any) => {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };

    logsRef.current.push(logEntry);

    // Ограничиваем размер массива
    if (logsRef.current.length > maxLogs) {
      logsRef.current = logsRef.current.slice(-maxLogs);
    }

    // ✅ ИСПРАВЛЕНО: Выводим в оригинальную консоль ТОЛЬКО если это НЕ внутренний лог Debug системы
    const originalConsole = (window as any).__originalConsole || console;
    const isDebugInternalLog = message.includes('[DEBUG]') || 
                                message.includes('Sending debug report');
    
    if (!isDebugInternalLog) {
      if (data !== undefined) {
        originalConsole[level](`[DEBUG] ${message}`, data);
      } else {
        originalConsole[level](`[DEBUG] ${message}`);
      }
    }
  }, []);

  // 🔥 НОВОЕ: Функция для установки перехвата консоли
  const setupConsoleInterception = useCallback((enabled: boolean) => {
    // Сохраняем оригинальные методы консоли
    if (!(window as any).__originalConsole) {
      (window as any).__originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info,
      };
    }

    const originalConsole = (window as any).__originalConsole;

    if (enabled) {
      // Перехватываем методы только если логирование включено
      console.log = (...args: any[]) => {
        addLog('log', args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
        originalConsole.log(...args);
      };

      console.error = (...args: any[]) => {
        addLog('error', args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
        originalConsole.error(...args);
      };

      console.warn = (...args: any[]) => {
        addLog('warn', args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
        originalConsole.warn(...args);
      };

      console.info = (...args: any[]) => {
        addLog('info', args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
        originalConsole.info(...args);
      };
    } else {
      // Восстанавливаем оригинальные методы если логирование выключено
      if (originalConsole) {
        console.log = originalConsole.log;
        console.error = originalConsole.error;
        console.warn = originalConsole.warn;
        console.info = originalConsole.info;
      }
    }
  }, [addLog]);

  // Перехватываем консоль при монтировании и при изменении isLoggingEnabled
  useEffect(() => {
    setupConsoleInterception(isLoggingEnabled);

    // Восстанавливаем при размонтировании
    return () => {
      const originalConsole = (window as any).__originalConsole;
      if (originalConsole) {
        console.log = originalConsole.log;
        console.error = originalConsole.error;
        console.warn = originalConsole.warn;
        console.info = originalConsole.info;
      }
    };
  }, [isLoggingEnabled, setupConsoleInterception]);

  // ❌ УБРАНО: Функция создания скриншота (тратила время, не всегда работала)
  // Screenshots disabled to save time and improve reliability

  // Основная функция для захвата ошибки и отправки отчета
  const captureError = useCallback(async (options: CaptureErrorOptions = {}) => {
    if (isCapturing) {
      console.warn('[DEBUG] Already capturing error, skipping...');
      return;
    }

    setIsCapturing(true);

    try {
      const { errorMessage = 'Unknown error', data, userComment } = options;

      // Логируем ошибку (но не как ERROR, чтобы не пугать Next.js)
      addLog('warn', `🐞 Capturing error report: ${errorMessage}`, data);

      // ❌ УБРАНО: Создание скриншота (экономим время)
      const screenshot: string | null = null;

      // Получаем ВСЕ накопленные логи
      const recentLogs = logsRef.current.map(log => 
        `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}${
          log.data ? `\nData: ${JSON.stringify(log.data, null, 2)}` : ''
        }`
      );

      // Формируем метаданные
      const meta = {
        userId: userId || 'guest',
        userEmail: userEmail || 'N/A',
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        errorMessage,
        errorData: data,
        userComment: userComment || null, // ✅ Добавляем комментарий пользователя
      };

      // ✅ УЛУЧШЕНИЕ: Проверка сети перед отправкой
      if (!navigator.onLine) {
        addLog('error', '❌ Нет подключения к интернету');
        throw new Error('No internet connection');
      }

      // Отправляем отчет на сервер
      addLog('info', 'Sending debug report to server...');
      console.log('[DEBUG] Отправка отчета:', {
        logsCount: recentLogs.length,
        hasScreenshot: !!screenshot,
        screenshotSize: screenshot ? `${(screenshot.length / 1024).toFixed(0)} KB` : 'N/A',
        url: meta.url,
        userAgent: meta.userAgent?.substring(0, 50) + '...',
      });
      
      const response = await fetch('/api/debug/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logs: recentLogs,
          screenshot,
          meta,
        }),
      });

      console.log('[DEBUG] Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[DEBUG] Server error response:', errorText);
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        addLog('info', `✅ Debug report saved: ${result.files.logs}`);
        console.log('[DEBUG] Report saved successfully:', result.files);
      } else {
        addLog('error', `❌ Failed to save debug report: ${result.error}`);
      }

      return result;
    } catch (error: any) {
      addLog('error', `Failed to capture error: ${error.message}`);
      console.error('[DEBUG] Capture error failed:', error);
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing, addLog, userId, userEmail]);

  // Ручная отправка отчета
  const sendManualReport = useCallback(async (userComment?: string) => {
    return captureError({
      errorMessage: 'Manual report submission',
      userComment, // ✅ Передаём комментарий
    });
  }, [captureError]);

  // 🔥 НОВОЕ: Перехват глобальных ошибок (отдельный useEffect после определения captureError)
  useEffect(() => {
    // Перехват необработанных JS ошибок
    const handleGlobalError = (event: ErrorEvent) => {
      // ✅ ИСПРАВЛЕНО 2026-01-13: Игнорируем "Script error" без деталей (CORS/cross-origin)
      // Такие ошибки возникают когда скрипт с другого домена падает, браузер скрывает детали
      // Это не критичные ошибки и засоряют логи (например, от Vercel Analytics на не-Vercel сервере)
      if (event.message === 'Script error.' && !event.filename && !event.lineno && !event.colno) {
        return; // Не логируем такие ошибки
      }

      addLog('error', `🚨 Uncaught Error: ${event.message}`, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      });

      // 🔥 Автоотправка ВСЕГДА (и в dev, и в prod)
      captureError({
        errorMessage: `Uncaught Error: ${event.message}`,
        data: { 
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno, 
          stack: event.error?.stack,
          environment: process.env.NODE_ENV,
        },
      });
    };

    // Перехват необработанных Promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason?.message || event.reason || 'Unknown rejection';
      addLog('error', `🚨 Unhandled Promise Rejection: ${reason}`, {
        reason: event.reason,
        stack: event.reason?.stack,
      });

      // 🔥 Автоотправка ВСЕГДА (и в dev, и в prod)
      captureError({
        errorMessage: `Unhandled Promise Rejection: ${reason}`,
        data: { 
          reason: event.reason,
          stack: event.reason?.stack,
          environment: process.env.NODE_ENV,
        },
      });
    };

    // Подписываемся на глобальные ошибки
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Делаем доступным для Error Boundary
    (window as any).__debugRecorder = {
      captureError,
      addLog,
    };

    // Восстанавливаем при размонтировании
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [addLog, captureError]);

  // Получить текущие логи
  const getLogs = useCallback(() => {
    return [...logsRef.current];
  }, []);

  // Очистить логи
  const clearLogs = useCallback(() => {
    logsRef.current = [];
    setLogsVersion(prev => prev + 1); // Принудительно обновляем компоненты
    // Не добавляем лог о очистке, чтобы не создавать новый лог после очистки
    // Пользователь увидит, что логи очищены через UI
  }, []);

  // Методы для логирования (альтернатива перехвату консоли)
  const log = useCallback((message: string, data?: any) => {
    addLog('log', message, data);
  }, [addLog]);

  const error = useCallback((message: string, data?: any) => {
    addLog('error', message, data);
  }, [addLog]);

  const warn = useCallback((message: string, data?: any) => {
    addLog('warn', message, data);
  }, [addLog]);

  const info = useCallback((message: string, data?: any) => {
    addLog('info', message, data);
  }, [addLog]);

  // Заглушка для обратной совместимости (если где-то вызывается)
  const captureScreenshot = useCallback(async (): Promise<string | null> => {
    console.log('[DEBUG] Screenshot disabled - saving time');
    return null;
  }, []);

  // 🔥 НОВОЕ: Методы для включения/выключения записи логов браузера
  const enableLogging = useCallback(() => {
    setIsLoggingEnabledState(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('debug_logging_enabled', 'true');
    }
    addLog('info', '✅ Запись логов браузера включена');
  }, [addLog]);

  const disableLogging = useCallback(() => {
    setIsLoggingEnabledState(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('debug_logging_enabled', 'false');
    }
    addLog('info', '⏸️ Запись логов браузера выключена');
  }, [addLog]);

  return {
    // Основные методы
    captureError,
    sendManualReport,
    captureScreenshot, // Оставляем для обратной совместимости, но возвращает null
    
    // Управление логами
    getLogs,
    clearLogs,
    
    // Методы логирования
    log,
    error,
    warn,
    info,
    
    // 🔥 НОВОЕ: Управление записью логов браузера
    isLoggingEnabled,
    enableLogging,
    disableLogging,
    
    // Состояние
    isCapturing,
    logsVersion, // Версия логов для принудительного обновления компонентов
  };
}

