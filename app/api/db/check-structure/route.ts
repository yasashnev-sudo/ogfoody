// API route для проверки структуры таблиц NocoDB
// Сравнивает реальную структуру таблиц с ожидаемой в коде

import { NextResponse } from "next/server"

// Ожидаемые структуры таблиц на основе интерфейсов в lib/nocodb.ts
const expectedSchemas: Record<string, Array<{ name: string; type: string; required?: boolean; description?: string }>> = {
  Meals: [
    { name: "Id", type: "number", required: true, description: "Primary key" },
    { name: "name", type: "string", required: true },
    { name: "category", type: "string", required: true },
    { name: "ingredients", type: "string", required: true },
    { name: "description", type: "string", required: false },
    { name: "price", type: "number|string", required: false, description: "Legacy field" },
    { name: "price_single", type: "number|string", required: false },
    { name: "price_medium", type: "number|string", required: false },
    { name: "price_large", type: "number|string", required: false },
    { name: "weight", type: "number|string", required: false, description: "Legacy field" },
    { name: "weight_single", type: "number|string", required: false },
    { name: "weight_medium", type: "number|string", required: false },
    { name: "weight_large", type: "number|string", required: false },
    { name: "image", type: "string", required: false },
    { name: "needs_garnish", type: "boolean|string", required: false },
    { name: "calories", type: "number|string", required: false },
    { name: "protein", type: "number|string", required: false },
    { name: "fats", type: "number|string", required: false },
    { name: "carbs", type: "number|string", required: false },
    { name: "is_current_week", type: "boolean|string", required: false },
    { name: "is_next_week", type: "boolean|string", required: false },
  ],
  Extras: [
    { name: "Id", type: "number", required: true, description: "Primary key" },
    { name: "name", type: "string", required: true },
    { name: "category", type: "string", required: true },
    { name: "ingredients", type: "string", required: false },
    { name: "description", type: "string", required: false },
    { name: "price", type: "number|string", required: true },
    { name: "image", type: "string", required: false },
    { name: "calories", type: "number|string", required: false },
    { name: "protein", type: "number|string", required: false },
    { name: "fats", type: "number|string", required: false },
    { name: "carbs", type: "number|string", required: false },
    { name: "weight", type: "number|string", required: false },
    { name: "is_current_week", type: "boolean|string", required: false },
    { name: "is_next_week", type: "boolean|string", required: false },
  ],
  Delivery_Zones: [
    { name: "Id", type: "number", required: true, description: "Primary key" },
    { name: "city", type: "string", required: true },
    { name: "district", type: "string", required: false },
    { name: "delivery_fee", type: "number|string", required: true },
    { name: "min_order_amount", type: "number|string", required: true },
    { name: "is_available", type: "boolean|string", required: false },
    { name: "available_intervals", type: "string", required: false, description: "JSON array as string" },
  ],
  Users: [
    { name: "Id", type: "number", required: true, description: "Primary key" },
    { name: "phone", type: "string", required: true },
    { name: "password_hash", type: "string", required: false },
    { name: "name", type: "string", required: true },
    { name: "additional_phone", type: "string", required: false },
    { name: "street", type: "string", required: false },
    { name: "building", type: "string", required: false },
    { name: "building_section", type: "string", required: false },
    { name: "apartment", type: "string", required: false },
    { name: "entrance", type: "string", required: false },
    { name: "floor", type: "string", required: false },
    { name: "intercom", type: "string", required: false },
    { name: "district", type: "string", required: false },
    { name: "delivery_comment", type: "string", required: false },
    { name: "loyalty_points", type: "number|string", required: true },
    { name: "total_spent", type: "number|string", required: true },
    { name: "created_at", type: "string", required: true },
    { name: "updated_at", type: "string", required: true },
  ],
  Orders: [
    { name: "Id", type: "number", required: true, description: "Primary key" },
    { name: "user_id", type: "number", required: false },
    { name: "order_number", type: "string", required: true },
    { name: "start_date", type: "string", required: true },
    { name: "delivery_time", type: "string", required: true },
    { name: "payment_status", type: "string", required: true, description: "pending|paid|refunded|failed" },
    { name: "payment_method", type: "string", required: true, description: "cash|card|sbp|online" },
    { name: "paid", type: "boolean|string", required: false },
    { name: "paid_at", type: "string", required: false },
    { name: "payment_id", type: "string", required: false },
    { name: "order_status", type: "string", required: true, description: "pending|confirmed|preparing|ready|cancelled" },
    { name: "promo_code", type: "string", required: false },
    { name: "promo_discount", type: "number|string", required: false },
    { name: "loyalty_points_used", type: "number|string", required: true },
    { name: "loyalty_points_earned", type: "number|string", required: true },
    { name: "subtotal", type: "number|string", required: true },
    { name: "total", type: "number|string", required: true },
    { name: "guest_phone", type: "string", required: false },
    { name: "guest_address", type: "string", required: false },
    { name: "created_at", type: "string", required: true },
    { name: "updated_at", type: "string", required: true },
  ],
  Order_Persons: [
    { name: "Id", type: "number", required: true, description: "Primary key" },
    { name: "order_id", type: "number", required: true },
    { name: "person_number", type: "number", required: true },
  ],
  Order_Meals: [
    { name: "Id", type: "number", required: true, description: "Primary key" },
    { name: "order_person_id", type: "number", required: true },
    { name: "day", type: "string", required: true, description: "day1|day2" },
    { name: "meal_time", type: "string", required: true, description: "breakfast|lunch|dinner" },
    { name: "meal_type", type: "string", required: true, description: "dish|salad|soup|main" },
    { name: "meal_id", type: "number", required: true },
    { name: "portion_size", type: "string", required: true, description: "single|medium|large" },
    { name: "price", type: "number|string", required: true },
    { name: "garnish_id", type: "number", required: false },
    { name: "garnish_portion_size", type: "string", required: false, description: "single|medium|large" },
    { name: "garnish_price", type: "number|string", required: false },
  ],
  Order_Extras: [
    { name: "Id", type: "number", required: true, description: "Primary key" },
    { name: "order_id", type: "number", required: true },
    { name: "extra_id", type: "number", required: true },
    { name: "quantity", type: "number|string", required: true },
    { name: "price", type: "number|string", required: true },
  ],
  Promo_Codes: [
    { name: "Id", type: "number", required: true, description: "Primary key" },
    { name: "code", type: "string", required: true },
    { name: "discount_type", type: "string", required: true, description: "percentage|fixed" },
    { name: "discount_value", type: "number|string", required: true },
    { name: "min_order_amount", type: "number|string", required: false },
    { name: "max_discount", type: "number|string", required: false },
    { name: "valid_from", type: "string", required: false },
    { name: "valid_until", type: "string", required: false },
    { name: "usage_limit", type: "number|string", required: false },
    { name: "times_used", type: "number|string", required: true },
    { name: "active", type: "boolean|string", required: false },
  ],
  Reviews: [
    { name: "Id", type: "number", required: true, description: "Primary key" },
    { name: "order_id", type: "number", required: true },
    { name: "user_id", type: "number", required: true },
    { name: "rating", type: "number|string", required: true },
    { name: "text", type: "string", required: false },
    { name: "created_at", type: "string", required: true },
    { name: "updated_at", type: "string", required: true },
  ],
  Loyalty_Points_Transactions: [
    { name: "Id", type: "number", required: true, description: "Primary key" },
    { name: "user_id", type: "number", required: true },
    { name: "order_id", type: "number", required: false },
    { name: "transaction_type", type: "string", required: true, description: "earned|spent|refunded" },
    { name: "points", type: "number|string", required: true },
    { name: "description", type: "string", required: false },
    { name: "created_at", type: "string", required: true },
    { name: "updated_at", type: "string", required: true },
  ],
}

function getTableId(tableName: string): string {
  const tableIds: Record<string, string | undefined> = {
    Meals: process.env.NOCODB_TABLE_MEALS,
    Extras: process.env.NOCODB_TABLE_EXTRAS,
    Delivery_Zones: process.env.NOCODB_TABLE_DELIVERY_ZONES,
    Users: process.env.NOCODB_TABLE_USERS,
    Orders: process.env.NOCODB_TABLE_ORDERS,
    Order_Persons: process.env.NOCODB_TABLE_ORDER_PERSONS,
    Order_Meals: process.env.NOCODB_TABLE_ORDER_MEALS,
    Order_Extras: process.env.NOCODB_TABLE_ORDER_EXTRAS,
    Promo_Codes: process.env.NOCODB_TABLE_PROMO_CODES,
    Reviews: process.env.NOCODB_TABLE_REVIEWS,
    Loyalty_Points_Transactions: process.env.NOCODB_TABLE_LOYALTY_POINTS_TRANSACTIONS,
  }
  return tableIds[tableName] || ""
}

function mapNocoDBTypeToExpected(nocoType: string): string {
  const typeMap: Record<string, string> = {
    Number: "number",
    Decimal: "number",
    Float: "number",
    Int: "number",
    BigInt: "number",
    Text: "string",
    String: "string",
    Varchar: "string",
    LongText: "string",
    Boolean: "boolean",
    Checkbox: "boolean",
    Date: "string",
    DateTime: "string",
    Time: "string",
    JSON: "string",
    JSONB: "string",
  }
  return typeMap[nocoType] || nocoType.toLowerCase()
}

interface ColumnInfo {
  column_name: string
  dt?: string
  uidt?: string
  required?: boolean
  pk?: boolean
}

export async function GET() {
  const NOCODB_URL = process.env.NOCODB_URL
  const NOCODB_TOKEN = process.env.NOCODB_TOKEN
  const NOCODB_BASE_ID = process.env.NOCODB_PROJECT_ID || process.env.NOCODB_BASE_ID

  if (!NOCODB_URL || !NOCODB_TOKEN) {
    return NextResponse.json(
      {
        error: "NocoDB not configured",
        message: "NOCODB_URL и NOCODB_TOKEN должны быть установлены",
      },
      { status: 500 },
    )
  }

  if (!NOCODB_BASE_ID) {
    return NextResponse.json(
      {
        error: "NOCODB_BASE_ID not configured",
        message: "NOCODB_PROJECT_ID или NOCODB_BASE_ID должны быть установлены",
      },
      { status: 500 },
    )
  }

  const baseUrl = NOCODB_URL.replace(/\/api\/v2\/?$/, "")
  const results: Record<string, any> = {}

  // Проверяем каждую таблицу
  for (const [tableName, expectedColumns] of Object.entries(expectedSchemas)) {
    const tableId = getTableId(tableName)
    
    if (!tableId) {
      results[tableName] = {
        status: "not_configured",
        error: `NOCODB_TABLE_${tableName.toUpperCase()} не установлен`,
      }
      continue
    }

    try {
      // Получаем структуру таблицы из примера записи
      let actualColumns: any[] = []
      let sampleRecord: any = null
      
      try {
        const recordsUrl = `${baseUrl}/api/v2/tables/${tableId}/records?limit=1`
        const recordsResponse = await fetch(recordsUrl, {
          headers: {
            "xc-token": NOCODB_TOKEN,
            "Content-Type": "application/json",
          },
        })
        
        if (recordsResponse.ok) {
          const recordsData = await recordsResponse.json()
          sampleRecord = recordsData?.list?.[0] || null
          
          if (sampleRecord) {
            // Создаем список колонок на основе ключей записи
            actualColumns = Object.keys(sampleRecord).map((key) => {
              const value = sampleRecord[key]
              let uidt = 'Text'
              if (typeof value === 'number') {
                uidt = Number.isInteger(value) ? 'Int' : 'Float'
              } else if (typeof value === 'boolean') {
                uidt = 'Boolean'
              } else if (value instanceof Date || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value))) {
                uidt = 'DateTime'
              }
              return {
                column_name: key,
                uidt,
                required: false,
              }
            })
          }
        } else {
          const errorText = await recordsResponse.text()
          results[tableName] = {
            status: "error",
            error: `Не удалось получить данные таблицы: ${recordsResponse.status} - ${errorText}`,
          }
          continue
        }
      } catch (e) {
        results[tableName] = {
          status: "error",
          error: `Ошибка при получении данных: ${e instanceof Error ? e.message : String(e)}`,
        }
        continue
      }

      if (actualColumns.length === 0) {
        results[tableName] = {
          status: "warning",
          error: "Таблица пуста или недоступна. Не удалось определить структуру.",
        }
        continue
      }

      // Создаем карту реальных колонок
      const actualColumnsMap = new Map<string, ColumnInfo>()
      actualColumns.forEach((col: any) => {
        const colName = col.column_name || col.title || col.name
        if (colName) {
          actualColumnsMap.set(colName.toLowerCase(), {
            column_name: colName,
            dt: col.dt,
            uidt: col.uidt,
            required: col.rqd || col.required || false,
            pk: col.pk || col.primary || false,
          })
        }
      })

      // Сравниваем с ожидаемыми
      const missingColumns: string[] = []
      const extraColumns: string[] = []
      const typeMismatches: Array<{ column: string; expected: string; actual: string }> = []
      const requiredMismatches: Array<{ column: string; expected: boolean; actual: boolean }> = []

      // Проверяем ожидаемые колонки
      for (const expectedCol of expectedColumns) {
        const colKey = expectedCol.name.toLowerCase()
        const actualCol = actualColumnsMap.get(colKey)

        if (!actualCol) {
          if (expectedCol.required) {
            missingColumns.push(expectedCol.name)
          }
        } else {
          // Проверяем тип
          const actualType = mapNocoDBTypeToExpected(actualCol.uidt || actualCol.dt || "unknown")
          const expectedTypes = expectedCol.type.split("|")
          
          if (!expectedTypes.some((t) => actualType.includes(t) || t.includes(actualType))) {
            typeMismatches.push({
              column: expectedCol.name,
              expected: expectedCol.type,
              actual: actualType,
            })
          }

          // Проверяем required
          if (expectedCol.required && !actualCol.required && !actualCol.pk) {
            requiredMismatches.push({
              column: expectedCol.name,
              expected: true,
              actual: false,
            })
          }

          // Удаляем из карты, чтобы найти лишние колонки
          actualColumnsMap.delete(colKey)
        }
      }

      // Оставшиеся в карте - лишние колонки (но это не ошибка)
      actualColumnsMap.forEach((col) => {
        extraColumns.push(col.column_name)
      })


      const hasIssues = missingColumns.length > 0 || typeMismatches.length > 0 || requiredMismatches.length > 0

      results[tableName] = {
        status: hasIssues ? "issues" : "ok",
        tableId,
        columns: {
          expected: expectedColumns.length,
          actual: actualColumns.length,
          missing: missingColumns,
          extra: extraColumns,
          typeMismatches,
          requiredMismatches,
        },
        sampleRecord: sampleRecord ? Object.keys(sampleRecord).slice(0, 5) : null,
        recommendations: hasIssues
          ? [
              ...(missingColumns.length > 0
                ? [`Добавьте отсутствующие обязательные колонки: ${missingColumns.join(", ")}`]
                : []),
              ...(typeMismatches.length > 0
                ? [
                    `Проверьте типы колонок: ${typeMismatches.map((m) => `${m.column} (ожидается ${m.expected}, фактически ${m.actual})`).join(", ")}`,
                  ]
                : []),
              ...(requiredMismatches.length > 0
                ? [
                    `Сделайте обязательными колонки: ${requiredMismatches.map((m) => m.column).join(", ")}`,
                  ]
                : []),
            ]
          : ["✅ Структура таблицы соответствует ожиданиям"],
      }
    } catch (error) {
      results[tableName] = {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }

  // Подсчитываем общую статистику
  const stats = {
    total: Object.keys(expectedSchemas).length,
    ok: Object.values(results).filter((r) => r.status === "ok").length,
    issues: Object.values(results).filter((r) => r.status === "issues").length,
    errors: Object.values(results).filter((r) => r.status === "error").length,
    notConfigured: Object.values(results).filter((r) => r.status === "not_configured").length,
  }

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    summary: {
      ...stats,
      overallStatus: stats.errors > 0 || stats.notConfigured > 0 ? "error" : stats.issues > 0 ? "issues" : "ok",
    },
    tables: results,
    note: "Проверьте результаты для каждой таблицы. Статус 'ok' означает, что структура подходит для работы проекта.",
  })
}

