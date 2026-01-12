'use client';

import { useState, useEffect } from 'react';
import { useDebug } from './DebugContext';
import { DebugConsole } from './DebugConsole';

export function DebugFloatingButton() {
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const debug = useDebug();

  // ✅ Горячая клавиша: Ctrl+Shift+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+D (Windows/Linux) или Cmd+Shift+D (Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsConsoleOpen(prev => !prev); // Переключаем открыто/закрыто
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSendReport = async (comment: string) => {
    const result = await debug.sendManualReport(comment);
    
    // ✅ Показываем уведомление об успехе
    if (result?.success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // Скрываем через 3 секунды
    }
  };

  const logs = debug.getLogs();
  const errorCount = logs.filter(l => l.level === 'error').length;

  return (
    <>
      {/* Плавающая кнопка */}
      <button
        onClick={() => setIsConsoleOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-2xl z-[99999] group"
        title="Open Debug Console (Ctrl+Shift+D)"
      >
        🐞
        {errorCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-black">
            {errorCount}
          </span>
        )}
      </button>

      {/* Подсказка о горячей клавише (показывается при наведении) */}
      <div className="fixed bottom-24 right-6 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[99999]">
        Ctrl+Shift+D
      </div>

      {/* Уведомление об успехе */}
      {showSuccess && (
        <div className="fixed bottom-24 right-6 bg-green-500 text-white px-4 py-3 rounded-lg shadow-xl z-[99999] animate-bounce">
          <div className="flex items-center gap-2">
            <span className="text-xl">✅</span>
            <div>
              <p className="font-bold">Отчёт отправлен!</p>
              <p className="text-xs opacity-90">Проверь папку debug_reports/</p>
            </div>
          </div>
        </div>
      )}

      {/* Консоль */}
      <DebugConsole
        isOpen={isConsoleOpen}
        onClose={() => setIsConsoleOpen(false)}
        logs={logs}
        onClearLogs={debug.clearLogs}
        onSendReport={handleSendReport}
        isSending={debug.isCapturing}
      />
    </>
  );
}

