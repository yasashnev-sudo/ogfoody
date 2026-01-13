'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';

interface LogEntry {
  timestamp: string;
  level: 'log' | 'error' | 'warn' | 'info';
  message: string;
  data?: any;
}

interface CaptureErrorOptions {
  errorMessage?: string;
  data?: any;
  includeScreenshot?: boolean;
  userComment?: string; // ✅ Добавлен комментарий пользователя
}

export function useDebugRecorder(userId?: string, userEmail?: string) {
  const logsRef = useRef<LogEntry[]>([]);
  const maxLogs = 100; // Храним последние 100 логов
  const [isCapturing, setIsCapturing] = useState(false);

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
                                message.includes('Capturing screenshot') || 
                                message.includes('Screenshot captured') ||
                                message.includes('Sending debug report');
    
    if (!isDebugInternalLog) {
      if (data !== undefined) {
        originalConsole[level](`[DEBUG] ${message}`, data);
      } else {
        originalConsole[level](`[DEBUG] ${message}`);
      }
    }
  }, []);

  // Перехватываем консоль при монтировании
  useEffect(() => {
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

    // Перехватываем методы
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

    // Восстанавливаем при размонтировании
    return () => {
      if (originalConsole) {
        console.log = originalConsole.log;
        console.error = originalConsole.error;
        console.warn = originalConsole.warn;
        console.info = originalConsole.info;
      }
    };
  }, [addLog]);

  // Функция для создания скриншота
  const captureScreenshot = useCallback(async (): Promise<string | null> => {
    try {
      // ✅ УЛУЧШЕНИЕ: Таймаут для мобильных устройств
      const screenshotPromise = html2canvas(document.body, {
        allowTaint: true,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        scale: window.devicePixelRatio > 1 ? 1 : window.devicePixelRatio, // ✅ Оптимизация для retina
        // ✅ Игнорируем ошибки с современными CSS функциями
        ignoreElements: (element) => {
          // Пропускаем элементы, которые могут вызывать проблемы
          return false;
        },
        onclone: (clonedDoc) => {
          // Убираем проблемные стили из клона
          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach((el: any) => {
            const style = el.style;
            if (style) {
              // Заменяем lab() на fallback цвет
              if (style.backgroundColor && style.backgroundColor.includes('lab(')) {
                style.backgroundColor = '#ffffff';
              }
              if (style.color && style.color.includes('lab(')) {
                style.color = '#000000';
              }
            }
          });
        }
      });
      
      // ✅ УЛУЧШЕНИЕ: Таймаут 10 секунд для мобильных
      const timeoutPromise = new Promise<null>((resolve) => {
        setTimeout(() => {
          console.warn('[DEBUG] Screenshot timeout (10s) - continuing without screenshot');
          resolve(null);
        }, 10000);
      });
      
      const canvas = await Promise.race([screenshotPromise, timeoutPromise]);
      if (!canvas) {
        console.warn('[DEBUG] Screenshot timed out, sending report without screenshot');
        return null;
      }
      
      return canvas.toDataURL('image/png');
    } catch (error: any) {
      // ✅ Более информативная ошибка, но не критичная
      const originalConsole = (window as any).__originalConsole || console;
      originalConsole.warn('[DEBUG] Screenshot failed (not critical, logs will still be saved):', error.message || error);
      return null;
    }
  }, []);

  // Основная функция для захвата ошибки и отправки отчета
  const captureError = useCallback(async (options: CaptureErrorOptions = {}) => {
    if (isCapturing) {
      console.warn('[DEBUG] Already capturing error, skipping...');
      return;
    }

    setIsCapturing(true);

    try {
      const { errorMessage = 'Unknown error', data, includeScreenshot = true, userComment } = options;

      // Логируем ошибку (но не как ERROR, чтобы не пугать Next.js)
      addLog('warn', `🐞 Capturing error report: ${errorMessage}`, data);

      // Создаем скриншот
      let screenshot: string | null = null;
      if (includeScreenshot) {
        addLog('info', 'Capturing screenshot...');
        screenshot = await captureScreenshot();
        if (screenshot) {
          addLog('info', 'Screenshot captured successfully');
        } else {
          addLog('warn', 'Screenshot capture failed, but continuing with logs only');
        }
      }

      // Получаем последние 50 логов (увеличено для лучшего контекста)
      const recentLogs = logsRef.current.slice(-50).map(log => 
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
  }, [isCapturing, addLog, captureScreenshot, userId, userEmail]);

  // Ручная отправка отчета
  const sendManualReport = useCallback(async (userComment?: string) => {
    return captureError({
      errorMessage: 'Manual report submission',
      includeScreenshot: true,
      userComment, // ✅ Передаём комментарий
    });
  }, [captureError]);

  // 🔥 НОВОЕ: Перехват глобальных ошибок (отдельный useEffect после определения captureError)
  useEffect(() => {
    // Перехват необработанных JS ошибок
    const handleGlobalError = (event: ErrorEvent) => {
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
    addLog('info', 'Logs cleared');
  }, [addLog]);

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

  return {
    // Основные методы
    captureError,
    sendManualReport,
    captureScreenshot,
    
    // Управление логами
    getLogs,
    clearLogs,
    
    // Методы логирования
    log,
    error,
    warn,
    info,
    
    // Состояние
    isCapturing,
  };
}

