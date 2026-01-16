// API route для получения реальной структуры всех таблиц из NocoDB
// Возвращает точные имена полей (column_name) в правильном регистре

import { NextResponse } from "next/server"

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
    Loyalty_Points_Transactions: process.env.NOCODB_TABLE_LOYALTY_POINTS_TRANSACTIONS || "mn244txmccpwmhx",
  }
  return tableIds[tableName] || ""
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
    "Loyalty_Points_Transactions",
  ]

  // Получаем структуру каждой таблицы
  for (const tableName of tableNames) {
    const tableId = getTableId(tableName)

    if (!tableId) {
      results[tableName] = {
        status: "not_configured",
        error: `NOCODB_TABLE_${tableName.toUpperCase()} не установлен`,
        fields: [],
      }
      continue
    }

    try {
      // Получаем структуру из реальных записей таблицы
      const recordsUrl = `${baseUrl}/api/v2/tables/${tableId}/records?limit=1`
      const recordsResponse = await fetch(recordsUrl, {
        headers: {
          "xc-token": NOCODB_TOKEN,
          "Content-Type": "application/json",
        },
      })

      if (!recordsResponse.ok) {
        const errorText = await recordsResponse.text()
        results[tableName] = {
          status: "error",
          error: `Не удалось получить записи: ${recordsResponse.status} - ${errorText}`,
          fields: [],
        }
        continue
      }

      const recordsData = await recordsResponse.json()
      const sampleRecord = recordsData?.list?.[0] || recordsData?.[0] || null

      // Пробуем получить column_name из метаданных таблицы
      let columnNames: string[] = []
      try {
        const columnsUrl = `${baseUrl}/api/v2/meta/bases/${NOCODB_BASE_ID}/tables/${tableId}/columns`
        const columnsResponse = await fetch(columnsUrl, {
          headers: {
            "xc-token": NOCODB_TOKEN,
            "Content-Type": "application/json",
          },
        })

        if (columnsResponse.ok) {
          const columnsData = await columnsResponse.json()
          const columns = columnsData?.list || columnsData || []
          columnNames = columns
            .map((col: any) => col.column_name || null)
            .filter((name: string | null) => name !== null)
        }
      } catch (e) {
        // Игнорируем ошибку meta API
      }

      // Если получили column_name из метаданных, используем их
      if (columnNames.length > 0) {
        const fields = columnNames.sort((a, b) => {
          if (a === "Id") return -1
          if (b === "Id") return 1
          return a.localeCompare(b)
        })

        results[tableName] = {
          status: "ok",
          tableId,
          fields,
          count: fields.length,
          source: "meta_api",
        }
        continue
      }

      // Если таблица пуста, возвращаем предупреждение
      if (!sampleRecord) {
        results[tableName] = {
          status: "warning",
          error: "Таблица пуста или недоступна",
          fields: [],
        }
        continue
      }

      // Fallback: извлекаем имена полей из реальной записи (это будут titles, не column_name)
      const fields = Object.keys(sampleRecord)
        .filter((key) => {
          // Исключаем служебные поля NocoDB, если они есть
          return !key.startsWith("__") && key !== "CreatedAt" && key !== "UpdatedAt"
        })
        .sort((a, b) => {
          // Сортируем: Id всегда первый, остальные по алфавиту
          if (a === "Id") return -1
          if (b === "Id") return 1
          return a.localeCompare(b)
        })

      results[tableName] = {
        status: "ok",
        tableId,
        fields,
        count: fields.length,
        source: "sample_record_titles",
        note: "Использованы titles из записей, не column_name. Попробуйте получить через meta API.",
      }
    } catch (error) {
      results[tableName] = {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
        fields: [],
      }
    }
  }

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    tables: results,
  })
}

