// Диагностический endpoint для проверки конфигурации NocoDB
// Помогает выявить проблемы с переменными окружения и доступностью NocoDB

import { NextResponse } from "next/server"
import { fetchMeals, fetchExtras, fetchDeliveryZones, isNocoDBConfigured } from "@/lib/nocodb"

interface DiagnosticResult {
  timestamp: string
  environment: {
    nodeEnv: string
    vercelEnv?: string
  }
  variables: {
    NOCODB_URL: {
      set: boolean
      value?: string
      masked?: string
    }
    NOCODB_TOKEN: {
      set: boolean
      value?: string
      masked?: string
    }
    tables: Record<string, {
      set: boolean
      value?: string
    }>
  }
  connectivity: {
    nocoDBReachable: boolean
    error?: string
    responseTime?: number
  }
  tables: Record<string, {
    accessible: boolean
    recordCount?: number
    error?: string
  }>
  summary: {
    configured: boolean
    issues: string[]
    recommendations: string[]
  }
}

export async function GET() {
  const startTime = Date.now()
  const result: DiagnosticResult = {
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV || "unknown",
      vercelEnv: process.env.VERCEL_ENV,
    },
    variables: {
      NOCODB_URL: {
        set: false,
      },
      NOCODB_TOKEN: {
        set: false,
      },
      tables: {},
    },
    connectivity: {
      nocoDBReachable: false,
    },
    tables: {},
    summary: {
      configured: false,
      issues: [],
      recommendations: [],
    },
  }

  // Проверка переменных окружения
  const nocodbUrl = process.env.NOCODB_URL
  const nocodbToken = process.env.NOCODB_TOKEN

  result.variables.NOCODB_URL = {
    set: !!nocodbUrl,
    value: nocodbUrl,
    masked: nocodbUrl ? `${nocodbUrl.substring(0, 30)}...` : undefined,
  }

  result.variables.NOCODB_TOKEN = {
    set: !!nocodbToken,
    value: nocodbToken,
    masked: nocodbToken ? `${nocodbToken.substring(0, 10)}...${nocodbToken.slice(-4)}` : undefined,
  }

  // Проверка ID таблиц
  const tableNames = [
    "Meals",
    "Extras",
    "Delivery_Zones",
    "Users",
    "Orders",
    "Order_Persons",
    "Order_Meals",
    "Order_Extras",
    "Promo_Codes",
    "Reviews",
  ]

  for (const tableName of tableNames) {
    const envVarName = `NOCODB_TABLE_${tableName.toUpperCase()}`
    const tableId = process.env[envVarName]
    result.variables.tables[tableName] = {
      set: !!tableId,
      value: tableId,
    }
  }

  // Проверка базовой конфигурации
  if (!nocodbUrl) {
    result.summary.issues.push("NOCODB_URL не установлен")
    result.summary.recommendations.push("Добавьте переменную окружения NOCODB_URL в Vercel Dashboard → Settings → Environment Variables")
  }

  if (!nocodbToken) {
    result.summary.issues.push("NOCODB_TOKEN не установлен")
    result.summary.recommendations.push("Добавьте переменную окружения NOCODB_TOKEN в Vercel Dashboard → Settings → Environment Variables")
  }

  // Проверка отсутствующих ID таблиц
  const missingTables = tableNames.filter((name) => !result.variables.tables[name].set)
  if (missingTables.length > 0) {
    result.summary.issues.push(`Отсутствуют ID таблиц: ${missingTables.join(", ")}`)
    result.summary.recommendations.push(
      `Добавьте переменные окружения для таблиц: ${missingTables.map((name) => `NOCODB_TABLE_${name.toUpperCase()}`).join(", ")}`,
    )
  }

  // Если базовая конфигурация не настроена, возвращаем результат без проверки подключения
  if (!nocodbUrl || !nocodbToken) {
    result.summary.configured = false
    return NextResponse.json(result, { status: 503 })
  }

  // Проверка доступности NocoDB
  try {
    const testUrl = nocodbUrl.replace(/\/$/, "")
    const apiUrl = testUrl.endsWith("/api/v2") ? testUrl : `${testUrl}/api/v2`
    const healthUrl = `${apiUrl}/health` // Попробуем health endpoint, если есть

    const connectStartTime = Date.now()
    let testResponse: Response | null = null

    // Пробуем несколько вариантов проверки доступности
    try {
      testResponse = await fetch(`${apiUrl}/tables`, {
        method: "GET",
        headers: {
          "xc-token": nocodbToken,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(5000), // 5 секунд таймаут
      })
    } catch (fetchError) {
      // Если /tables не работает, пробуем просто базовый URL
      try {
        testResponse = await fetch(testUrl, {
          method: "GET",
          signal: AbortSignal.timeout(5000),
        })
      } catch {
        // Игнорируем ошибку
      }
    }

    const connectEndTime = Date.now()
    result.connectivity.responseTime = connectEndTime - connectStartTime

    if (testResponse && testResponse.ok) {
      result.connectivity.nocoDBReachable = true
    } else {
      result.connectivity.nocoDBReachable = false
      const status = testResponse?.status || "unknown"
      const statusText = testResponse?.statusText || "connection failed"
      result.connectivity.error = `HTTP ${status}: ${statusText}`
      result.summary.issues.push(`NocoDB недоступен: ${result.connectivity.error}`)
      result.summary.recommendations.push(
        "Проверьте, что NocoDB доступен из интернета и не блокирует запросы с серверов Vercel",
      )
    }
  } catch (error) {
    result.connectivity.nocoDBReachable = false
    const errorMessage = error instanceof Error ? error.message : String(error)
    result.connectivity.error = errorMessage

    if (errorMessage.includes("timeout") || errorMessage.includes("TIMEOUT")) {
      result.summary.issues.push("Таймаут при подключении к NocoDB")
      result.summary.recommendations.push("Проверьте доступность NocoDB и настройки firewall")
    } else if (errorMessage.includes("ENOTFOUND") || errorMessage.includes("DNS")) {
      result.summary.issues.push("Не удалось разрешить DNS для NocoDB URL")
      result.summary.recommendations.push("Проверьте правильность NOCODB_URL")
    } else {
      result.summary.issues.push(`Ошибка подключения к NocoDB: ${errorMessage}`)
      result.summary.recommendations.push("Проверьте настройки NocoDB и доступность сервера")
    }
  }

  // Проверка доступности таблиц (только если NocoDB доступен)
  if (result.connectivity.nocoDBReachable && isNocoDBConfigured()) {
    // Проверяем таблицу Meals
    try {
      const mealsStartTime = Date.now()
      const meals = await fetchMeals()
      const mealsEndTime = Date.now()
      result.tables.Meals = {
        accessible: true,
        recordCount: meals.length,
      }
      if (mealsEndTime - mealsStartTime > 3000) {
        result.summary.issues.push("Таблица Meals загружается медленно (>3 сек)")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      result.tables.Meals = {
        accessible: false,
        error: errorMessage,
      }
      result.summary.issues.push(`Таблица Meals недоступна: ${errorMessage}`)
      if (errorMessage.includes("TABLE_NOT_FOUND")) {
        result.summary.recommendations.push("Проверьте правильность NOCODB_TABLE_MEALS")
      }
    }

    // Проверяем таблицу Extras
    try {
      const extras = await fetchExtras()
      result.tables.Extras = {
        accessible: true,
        recordCount: extras.length,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      result.tables.Extras = {
        accessible: false,
        error: errorMessage,
      }
      result.summary.issues.push(`Таблица Extras недоступна: ${errorMessage}`)
    }

    // Проверяем таблицу Delivery_Zones
    try {
      const zones = await fetchDeliveryZones()
      result.tables.Delivery_Zones = {
        accessible: true,
        recordCount: zones.length,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      result.tables.Delivery_Zones = {
        accessible: false,
        error: errorMessage,
      }
      result.summary.issues.push(`Таблица Delivery_Zones недоступна: ${errorMessage}`)
    }
  }

  // Формируем итоговую оценку
  const hasAllVariables = nocodbUrl && nocodbToken && missingTables.length === 0
  const canConnect = result.connectivity.nocoDBReachable
  const canAccessTables = Object.values(result.tables).every((t) => t.accessible !== false)

  result.summary.configured = hasAllVariables && canConnect && canAccessTables

  if (result.summary.configured) {
    result.summary.recommendations.push("✅ Конфигурация выглядит правильно! Если товары все еще не загружаются, проверьте логи Vercel.")
  } else {
    result.summary.recommendations.push("После исправления проблем пересоберите проект в Vercel (Redeploy)")
  }

  const totalTime = Date.now() - startTime
  const statusCode = result.summary.configured ? 200 : 503

  return NextResponse.json(
    {
      ...result,
      diagnostics: {
        totalTime: `${totalTime}ms`,
        version: "1.0.0",
      },
    },
    { status: statusCode },
  )
}

