'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useDebugRecorder } from '@/hooks/useDebugRecorder';

interface DebugContextType {
  captureError: (options?: any) => Promise<any>;
  sendManualReport: (userComment?: string) => Promise<any>; // ✅ Добавлен параметр
  captureScreenshot: () => Promise<string | null>;
  getLogs: () => any[];
  clearLogs: () => void;
  log: (message: string, data?: any) => void;
  error: (message: string, data?: any) => void;
  warn: (message: string, data?: any) => void;
  info: (message: string, data?: any) => void;
  isCapturing: boolean;
  // 🔥 НОВОЕ: Управление записью логов браузера
  isLoggingEnabled: boolean;
  enableLogging: () => void;
  disableLogging: () => void;
}

const DebugContext = createContext<DebugContextType | null>(null);

interface DebugProviderProps {
  children: ReactNode;
  userId?: string;
  userEmail?: string;
}

export function DebugProvider({ children, userId, userEmail }: DebugProviderProps) {
  const debugRecorder = useDebugRecorder(userId, userEmail);

  return (
    <DebugContext.Provider value={debugRecorder}>
      {children}
    </DebugContext.Provider>
  );
}

export function useDebug() {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error('useDebug must be used within DebugProvider');
  }
  return context;
}

