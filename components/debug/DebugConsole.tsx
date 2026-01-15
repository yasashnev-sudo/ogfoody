'use client';

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface LogEntry {
  timestamp: string;
  level: 'log' | 'error' | 'warn' | 'info';
  message: string;
  data?: any;
}

interface DebugConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  logs: LogEntry[];
  onClearLogs: () => void;
  onSendReport: (comment: string) => void;
  isSending: boolean;
  // 🔥 НОВОЕ: Управление записью логов браузера
  isLoggingEnabled?: boolean;
  onEnableLogging?: () => void;
  onDisableLogging?: () => void;
}

export function DebugConsole({
  isOpen,
  onClose,
  logs,
  onClearLogs,
  onSendReport,
  isSending,
  isLoggingEnabled = false,
  onEnableLogging,
  onDisableLogging,
}: DebugConsoleProps) {
  const [filter, setFilter] = useState<'all' | 'log' | 'error' | 'warn' | 'info'>('all');
  const [comment, setComment] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendReport = () => {
    onSendReport(comment);
    setComment(''); // Очищаем комментарий после отправки
  };

  // ✅ Автофокус на поле комментария при открытии
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      // Небольшая задержка, чтобы модалка успела отрендериться
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // ✅ Закрытие по Escape + Ctrl+Enter для отправки
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape - закрыть
      if (e.key === 'Escape') {
        onClose();
      }
      
      // Ctrl+Enter - отправить отчёт
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isSending && comment.trim()) {
          onSendReport(comment);
          setComment('');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isSending, comment, onSendReport]);

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.level === filter);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-600';
      case 'warn': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-700';
    }
  };

  const getLevelBg = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-50';
      case 'warn': return 'bg-yellow-50';
      case 'info': return 'bg-blue-50';
      default: return 'bg-gray-50';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐞</span>
            <h2 className="text-xl font-bold">Debug Console</h2>
            <span className="text-sm text-gray-500">({logs.length} logs)</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 p-4 border-b bg-gray-50">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          {(['all', 'log', 'error', 'warn', 'info'] as const).map(level => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filter === level
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {level === 'all' ? 'All' : level.toUpperCase()}
            </button>
          ))}
          <div className="flex-1" />
          
          {/* 🔥 НОВОЕ: Переключатель записи логов браузера */}
          {onEnableLogging && onDisableLogging && (
            <div className="flex items-center gap-2 mr-2">
              <span className="text-xs text-gray-600">Запись логов:</span>
              <button
                onClick={isLoggingEnabled ? onDisableLogging : onEnableLogging}
                className={`px-3 py-1 text-xs rounded-lg transition-colors font-medium ${
                  isLoggingEnabled
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
                title={isLoggingEnabled ? 'Выключить запись логов браузера' : 'Включить запись логов браузера'}
              >
                {isLoggingEnabled ? '🟢 ВКЛ' : '⚪ ВЫКЛ'}
              </button>
            </div>
          )}
          
          <button
            onClick={onClearLogs}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            Clear Logs
          </button>
        </div>

        {/* Logs */}
        <div className="flex-1 overflow-y-auto p-4 font-mono text-sm bg-gray-900 text-gray-100 min-h-[200px] max-h-[40vh]">
          {filteredLogs.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              No logs to display
            </div>
          ) : (
            <div className="space-y-1">
              {filteredLogs.map((log, index) => (
                <div
                  key={index}
                  className={`p-2 rounded ${getLevelBg(log.level)} border-l-4 ${
                    log.level === 'error' ? 'border-red-600' :
                    log.level === 'warn' ? 'border-yellow-600' :
                    log.level === 'info' ? 'border-blue-600' :
                    'border-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 text-xs whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={`font-bold text-xs uppercase ${getLevelColor(log.level)}`}>
                      [{log.level}]
                    </span>
                    <div className="flex-1">
                      <div className={getLevelColor(log.level)}>{log.message}</div>
                      {log.data && (
                        <pre className="mt-1 text-xs text-gray-600 overflow-x-auto">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comment Section */}
        <div className="p-4 border-t bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            💬 Комментарий к отчёту (опционально):
          </label>
          <textarea
            ref={textareaRef}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Например: 'Оплатил заказ на 1500₽, баллы должны были показать 150, но показало 0. Уведомление не появилось.'"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">
            Опиши, что пошло не так или что ты ожидал увидеть • <strong>Ctrl+Enter</strong> для отправки
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={handleSendReport}
            disabled={isSending}
            className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isSending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Отправляю...
              </>
            ) : (
              <>
                <span>📤</span>
                Отправить отчёт
                <span className="text-xs opacity-75">(Ctrl+Enter)</span>
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Отчёт включает: скриншот + последние 20 логов
            {comment && ' + твой комментарий'}
          </p>
        </div>
      </div>
    </div>
  );
}
