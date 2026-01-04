// Простой логгер запросов в память

interface RequestLog {
  timestamp: string
  method: string
  path: string
  status?: number
  error?: string
  data?: any
}

const logs: RequestLog[] = []
const MAX_LOGS = 50

export function logRequest(method: string, path: string, data?: any) {
  logs.push({
    timestamp: new Date().toISOString(),
    method,
    path,
    data,
  })
  
  // Ограничиваем размер лога
  if (logs.length > MAX_LOGS) {
    logs.shift()
  }
}

export function logResponse(method: string, path: string, status: number, error?: string) {
  const lastLog = logs[logs.length - 1]
  if (lastLog && lastLog.method === method && lastLog.path === path) {
    lastLog.status = status
    if (error) {
      lastLog.error = error
    }
  }
}

export function getRecentLogs(limit: number = 20): RequestLog[] {
  return logs.slice(-limit).reverse()
}

export function clearLogs() {
  logs.length = 0
}

