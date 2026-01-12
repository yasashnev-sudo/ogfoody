// API route для выгрузки всех данных из таблиц NocoDB
// Помогает проверить, что реально сохранено в базе

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
    Loyalty_Points_Transactions: process.env.NOCODB_TABLE_LOYALTY_POINTS_TRANSACTIONS,
  }
  return tableIds[tableName] || ""
}

export async function GET() {
  const NOCODB_URL = process.env.NOCODB_URL
  const NOCODB_TOKEN = process.env.NOCODB_TOKEN

  if (!NOCODB_URL || !NOCODB_TOKEN) {
    return NextResponse.json(
      {
        error: "NocoDB not configured",
        message: "NOCODB_URL и NOCODB_TOKEN должны быть установлены",
      },
      { status: 500 },
    )
  }

  const baseUrl = NOCODB_URL.replace(/\/api\/v2\/?$/, "")
  const apiUrl = baseUrl.endsWith("/api/v2") ? baseUrl : `${baseUrl}/api/v2`
  
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

  const results: Record<string, any> = {}

  for (const tableName of tableNames) {
    const tableId = getTableId(tableName)
    
    if (!tableId) {
      results[tableName] = {
        status: "not_configured",
        error: `NOCODB_TABLE_${tableName.toUpperCase()} не установлен`,
        count: 0,
        data: [],
      }
      continue
    }

    try {
      const recordsUrl = `${apiUrl}/tables/${tableId}/records?limit=1000`
      const response = await fetch(recordsUrl, {
        headers: {
          "xc-token": NOCODB_TOKEN,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        results[tableName] = {
          status: "error",
          error: `HTTP ${response.status}: ${errorText}`,
          count: 0,
          data: [],
        }
        continue
      }

      const data = await response.json()
      const records = data?.list || []
      
      results[tableName] = {
        status: "ok",
        tableId,
        count: records.length,
        data: records,
        sample: records.length > 0 ? records[0] : null,
      }
    } catch (error) {
      results[tableName] = {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
        count: 0,
        data: [],
      }
    }
  }

  // Подсчитываем общую статистику
  const stats = {
    totalTables: tableNames.length,
    configuredTables: Object.values(results).filter((r) => r.status !== "not_configured").length,
    accessibleTables: Object.values(results).filter((r) => r.status === "ok").length,
    totalRecords: Object.values(results).reduce((sum, r) => sum + (r.count || 0), 0),
    tablesWithData: Object.values(results).filter((r) => r.status === "ok" && r.count > 0).length,
  }

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    stats,
    tables: results,
    summary: {
      message: `Найдено ${stats.totalRecords} записей в ${stats.tablesWithData} таблицах`,
      emptyTables: tableNames.filter((name) => results[name]?.status === "ok" && results[name]?.count === 0),
      tablesWithData: tableNames.filter((name) => results[name]?.status === "ok" && results[name]?.count > 0),
    },
  })
}


