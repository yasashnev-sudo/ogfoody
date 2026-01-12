// API route для детальной проверки структуры всех таблиц
// Загружает структуру из NocoDB и сравнивает с ожидаемой

import { NextResponse } from "next/server"

// Ожидаемые структуры таблиц (из setup-tables)
const expectedStructures: Record<string, Array<{ column_name: string; title: string; uidt: string; rqd?: boolean }>> = {
  Meals: [
    { column_name: "Id", title: "Id", uidt: "ID" },
    { column_name: "name", title: "Name", uidt: "SingleLineText", rqd: true },
    { column_name: "category", title: "Category", uidt: "SingleLineText", rqd: true },
    { column_name: "ingredients", title: "Ingredients", uidt: "LongText", rqd: true },
    { column_name: "description", title: "Description", uidt: "LongText" },
    { column_name: "price_single", title: "Price (Single)", uidt: "Decimal" },
    { column_name: "price_medium", title: "Price (Medium)", uidt: "Decimal" },
    { column_name: "price_large", title: "Price (Large)", uidt: "Decimal" },
    { column_name: "weight_single", title: "Weight (Single)", uidt: "Number" },
    { column_name: "weight_medium", title: "Weight (Medium)", uidt: "Number" },
    { column_name: "weight_large", title: "Weight (Large)", uidt: "Number" },
    { column_name: "image", title: "Image (URL)", uidt: "SingleLineText" },
    { column_name: "needs_garnish", title: "Needs Garnish", uidt: "Checkbox" },
    { column_name: "calories", title: "Calories", uidt: "Number" },
    { column_name: "protein", title: "Protein", uidt: "Decimal" },
    { column_name: "fats", title: "Fats", uidt: "Decimal" },
    { column_name: "carbs", title: "Carbs", uidt: "Decimal" },
    { column_name: "is_current_week", title: "Current Week", uidt: "Checkbox" },
    { column_name: "is_next_week", title: "Next Week", uidt: "Checkbox" },
  ],
  Extras: [
    { column_name: "Id", title: "Id", uidt: "ID" },
    { column_name: "name", title: "Name", uidt: "SingleLineText", rqd: true },
    { column_name: "category", title: "Category", uidt: "SingleLineText", rqd: true },
    { column_name: "ingredients", title: "Ingredients", uidt: "LongText" },
    { column_name: "description", title: "Description", uidt: "LongText" },
    { column_name: "price", title: "Price", uidt: "Decimal", rqd: true },
    { column_name: "image", title: "Image (URL)", uidt: "SingleLineText" },
    { column_name: "calories", title: "Calories", uidt: "Number" },
    { column_name: "protein", title: "Protein", uidt: "Decimal" },
    { column_name: "fats", title: "Fats", uidt: "Decimal" },
    { column_name: "carbs", title: "Carbs", uidt: "Decimal" },
    { column_name: "weight", title: "Weight", uidt: "Number" },
    { column_name: "is_current_week", title: "Current Week", uidt: "Checkbox" },
    { column_name: "is_next_week", title: "Next Week", uidt: "Checkbox" },
  ],
  Delivery_Zones: [
    { column_name: "Id", title: "Id", uidt: "ID" },
    { column_name: "city", title: "City", uidt: "SingleLineText", rqd: true },
    { column_name: "district", title: "District", uidt: "SingleLineText" },
    { column_name: "delivery_fee", title: "Delivery Fee", uidt: "Decimal", rqd: true },
    { column_name: "min_order_amount", title: "Min Order Amount", uidt: "Decimal", rqd: true },
    { column_name: "is_available", title: "Available", uidt: "Checkbox" },
    { column_name: "available_intervals", title: "Available Intervals", uidt: "JSON" },
  ],
  Users: [
    { column_name: "Id", title: "Id", uidt: "ID" },
    { column_name: "phone", title: "Phone", uidt: "PhoneNumber", rqd: true },
    { column_name: "password_hash", title: "Password Hash", uidt: "SingleLineText" },
    { column_name: "name", title: "Name", uidt: "SingleLineText", rqd: true },
    { column_name: "additional_phone", title: "Additional Phone", uidt: "PhoneNumber" },
    { column_name: "street", title: "Street", uidt: "SingleLineText" },
    { column_name: "building", title: "Building", uidt: "SingleLineText" },
    { column_name: "building_section", title: "Building Section", uidt: "SingleLineText" },
    { column_name: "apartment", title: "Apartment", uidt: "SingleLineText" },
    { column_name: "entrance", title: "Entrance", uidt: "SingleLineText" },
    { column_name: "floor", title: "Floor", uidt: "SingleLineText" },
    { column_name: "intercom", title: "Intercom", uidt: "SingleLineText" },
    { column_name: "district", title: "District", uidt: "SingleLineText" },
    { column_name: "delivery_comment", title: "Delivery Comment", uidt: "LongText" },
    { column_name: "loyalty_points", title: "Loyalty Points", uidt: "Number", rqd: true },
    { column_name: "total_spent", title: "Total Spent", uidt: "Decimal", rqd: true },
    { column_name: "created_at", title: "Created At", uidt: "DateTime", rqd: true },
    { column_name: "updated_at", title: "Updated At", uidt: "DateTime", rqd: true },
  ],
  Orders: [
    { column_name: "Id", title: "Id", uidt: "ID" },
    { column_name: "user_id", title: "User ID", uidt: "Number" },
    { column_name: "order_number", title: "Order Number", uidt: "SingleLineText", rqd: true },
    { column_name: "start_date", title: "Start Date", uidt: "Date", rqd: true },
    { column_name: "delivery_time", title: "Delivery Time", uidt: "SingleLineText", rqd: true },
    { column_name: "payment_status", title: "Payment Status", uidt: "SingleLineText", rqd: true },
    { column_name: "payment_method", title: "Payment Method", uidt: "SingleLineText", rqd: true },
    { column_name: "paid", title: "Paid", uidt: "Checkbox" },
    { column_name: "paid_at", title: "Paid At", uidt: "DateTime" },
    { column_name: "payment_id", title: "Payment ID", uidt: "SingleLineText" },
    { column_name: "order_status", title: "Order Status", uidt: "SingleLineText", rqd: true },
    { column_name: "promo_code", title: "Promo Code", uidt: "SingleLineText" },
    { column_name: "promo_discount", title: "Promo Discount", uidt: "Decimal" },
    { column_name: "loyalty_points_used", title: "Loyalty Points Used", uidt: "Number", rqd: true },
    { column_name: "loyalty_points_earned", title: "Loyalty Points Earned", uidt: "Number", rqd: true },
    { column_name: "subtotal", title: "Subtotal", uidt: "Decimal", rqd: true },
    { column_name: "total", title: "Total", uidt: "Decimal", rqd: true },
    { column_name: "guest_phone", title: "Guest Phone", uidt: "PhoneNumber" },
    { column_name: "guest_address", title: "Guest Address", uidt: "LongText" },
    { column_name: "created_at", title: "Created At", uidt: "DateTime", rqd: true },
    { column_name: "updated_at", title: "Updated At", uidt: "DateTime", rqd: true },
  ],
  Order_Persons: [
    { column_name: "Id", title: "Id", uidt: "ID" },
    { column_name: "order_id", title: "Order ID", uidt: "Number", rqd: true },
    { column_name: "person_number", title: "Person Number", uidt: "Number", rqd: true },
  ],
  Order_Meals: [
    { column_name: "Id", title: "Id", uidt: "ID" },
    { column_name: "order_person_id", title: "Order Person ID", uidt: "Number", rqd: true },
    { column_name: "day", title: "Day", uidt: "SingleLineText", rqd: true },
    { column_name: "meal_time", title: "Meal Time", uidt: "SingleLineText", rqd: true },
    { column_name: "meal_type", title: "Meal Type", uidt: "SingleLineText", rqd: true },
    { column_name: "meal_id", title: "Meal ID", uidt: "Number", rqd: true },
    { column_name: "portion_size", title: "Portion Size", uidt: "SingleLineText", rqd: true },
    { column_name: "price", title: "Price", uidt: "Decimal", rqd: true },
    { column_name: "garnish_id", title: "Garnish ID", uidt: "Number" },
    { column_name: "garnish_portion_size", title: "Garnish Portion Size", uidt: "SingleLineText" },
    { column_name: "garnish_price", title: "Garnish Price", uidt: "Decimal" },
  ],
  Order_Extras: [
    { column_name: "Id", title: "Id", uidt: "ID" },
    { column_name: "order_id", title: "Order ID", uidt: "Number", rqd: true },
    { column_name: "extra_id", title: "Extra ID", uidt: "Number", rqd: true },
    { column_name: "quantity", title: "Quantity", uidt: "Number", rqd: true },
    { column_name: "price", title: "Price", uidt: "Decimal", rqd: true },
  ],
  Promo_Codes: [
    { column_name: "Id", title: "Id", uidt: "ID" },
    { column_name: "code", title: "Code", uidt: "SingleLineText", rqd: true },
    { column_name: "discount_type", title: "Discount Type", uidt: "SingleLineText", rqd: true },
    { column_name: "discount_value", title: "Discount Value", uidt: "Decimal", rqd: true },
    { column_name: "min_order_amount", title: "Min Order Amount", uidt: "Decimal" },
    { column_name: "max_discount", title: "Max Discount", uidt: "Decimal" },
    { column_name: "valid_from", title: "Valid From", uidt: "Date" },
    { column_name: "valid_until", title: "Valid Until", uidt: "Date" },
    { column_name: "usage_limit", title: "Usage Limit", uidt: "Number" },
    { column_name: "times_used", title: "Times Used", uidt: "Number", rqd: true },
    { column_name: "active", title: "Active", uidt: "Checkbox" },
  ],
  Reviews: [
    { column_name: "Id", title: "Id", uidt: "ID" },
    { column_name: "order_id", title: "Order ID", uidt: "Number", rqd: true },
    { column_name: "user_id", title: "User ID", uidt: "Number", rqd: true },
    { column_name: "rating", title: "Rating", uidt: "Number", rqd: true },
    { column_name: "text", title: "Review Text", uidt: "LongText" },
  ],
}

function getTableId(tableName: string): string | undefined {
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
  }
  return tableIds[tableName]
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
  for (const [tableName, expectedColumns] of Object.entries(expectedStructures)) {
    const tableId = getTableId(tableName)

    if (!tableId) {
      results[tableName] = {
        status: "error",
        error: `NOCODB_TABLE_${tableName.toUpperCase()} не установлен`,
      }
      continue
    }

    try {
      // Получаем структуру таблицы из NocoDB
      // Сначала пробуем получить через список таблиц (там могут быть колонки)
      let actualColumns: any[] = []
      
      const tablesUrl = `${baseUrl}/api/v2/meta/bases/${NOCODB_BASE_ID}/tables`
      const tablesResponse = await fetch(tablesUrl, {
        headers: {
          "xc-token": NOCODB_TOKEN,
          "Content-Type": "application/json",
        },
      })

      if (tablesResponse.ok) {
        const tablesData = await tablesResponse.json()
        const table = tablesData?.list?.find((t: any) => t.id === tableId)
        
        if (table && table.columns && Array.isArray(table.columns)) {
          actualColumns = table.columns
        } else {
          // Если колонок нет в структуре таблицы, пробуем получить через отдельный endpoint
          let columnsUrl = `${baseUrl}/api/v2/meta/bases/${NOCODB_BASE_ID}/tables/${tableId}/columns`
          let columnsResponse = await fetch(columnsUrl, {
            headers: {
              "xc-token": NOCODB_TOKEN,
              "Content-Type": "application/json",
            },
          })

          if (!columnsResponse.ok) {
            // Пробуем альтернативный endpoint
            columnsUrl = `${baseUrl}/api/v2/meta/tables/${tableId}/columns`
            columnsResponse = await fetch(columnsUrl, {
              headers: {
                "xc-token": NOCODB_TOKEN,
                "Content-Type": "application/json",
              },
            })
          }

          if (columnsResponse.ok) {
            const columnsData = await columnsResponse.json()
            actualColumns = columnsData?.list || columnsData || []
          } else {
            // Если не получилось, пробуем получить через записи (fallback)
            const recordsUrl = `${baseUrl}/api/v2/tables/${tableId}/records?limit=1`
            const recordsResponse = await fetch(recordsUrl, {
              headers: {
                "xc-token": NOCODB_TOKEN,
                "Content-Type": "application/json",
              },
            })

            if (recordsResponse.ok) {
              const recordsData = await recordsResponse.json()
              const sampleRecord = recordsData?.list?.[0]
              if (sampleRecord) {
                // Создаем список колонок на основе ключей записи
                actualColumns = Object.keys(sampleRecord).map((key) => ({
                  column_name: key,
                  title: key, // Заголовок будет равен имени колонки
                  uidt: typeof sampleRecord[key] === 'number' 
                    ? (Number.isInteger(sampleRecord[key]) ? 'Number' : 'Decimal')
                    : typeof sampleRecord[key] === 'boolean' 
                    ? 'Checkbox'
                    : 'SingleLineText',
                  rqd: false,
                }))
              }
            }
          }
        }
      }

      if (actualColumns.length === 0) {
        results[tableName] = {
          status: "error",
          error: "Не удалось получить структуру таблицы",
          tableId,
        }
        continue
      }

      // Функция для нормализации названий колонок
      const normalizeColumnName = (name: string): string => {
        let normalized = name
          .toLowerCase()
          .replace(/\(url\)/gi, "")
          .replace(/\(single\)/gi, "single")
          .replace(/\(medium\)/gi, "medium")
          .replace(/\(large\)/gi, "large")
          .replace(/\s+/g, "_")
          .replace(/[()]/g, "")
          .replace(/_+/g, "_")
          .replace(/^_|_$/g, "")
        
        // Специальные маппинги
        if (normalized === "image_url") normalized = "image"
        if (normalized === "current_week") normalized = "is_current_week"
        if (normalized === "next_week") normalized = "is_next_week"
        if (normalized === "needs_garnish") normalized = "needs_garnish"
        
        return normalized
      }

      // Создаем мапы для сравнения (нормализуем названия)
      const expectedMap = new Map(
        expectedColumns.map((col) => [normalizeColumnName(col.column_name), col]),
      )
      const actualMap = new Map(
        actualColumns
          .filter((col: any) => {
            // Игнорируем системные колонки
            const colName = (col.column_name || "").toLowerCase()
            return colName !== "createdat" && colName !== "updatedat"
          })
          .map((col: any) => [normalizeColumnName(col.column_name || ""), col]),
      )

      // Проверяем наличие всех ожидаемых колонок
      const missingColumns: string[] = []
      const extraColumns: string[] = []
      const incorrectColumns: Array<{
        column_name: string
        issue: string
        expected: any
        actual: any
      }> = []

      // Проверяем ожидаемые колонки
      for (const [colName, expectedCol] of expectedMap.entries()) {
        const actualCol = actualMap.get(colName)

        if (!actualCol) {
          missingColumns.push(expectedCol.column_name)
        } else {
          // Проверяем тип данных (игнорируем разницу между ID и Number для Id)
          if (actualCol.uidt !== expectedCol.uidt) {
            // Исключения: ID может быть Number в NocoDB
            if (expectedCol.column_name === "Id" && actualCol.uidt === "Number") {
              // Это нормально, пропускаем
            } else {
              incorrectColumns.push({
                column_name: expectedCol.column_name,
                issue: `Type mismatch: expected ${expectedCol.uidt}, got ${actualCol.uidt}`,
                expected: expectedCol.uidt,
                actual: actualCol.uidt,
              })
            }
          }

          // Проверяем заголовок (должен быть на английском)
          const expectedTitle = expectedCol.title
          const actualTitle = actualCol.title || ""
          if (actualTitle !== expectedTitle) {
            incorrectColumns.push({
              column_name: expectedCol.column_name,
              issue: `Title mismatch: expected "${expectedTitle}", got "${actualTitle}"`,
              expected: expectedTitle,
              actual: actualTitle,
            })
          }

          // Проверяем обязательность
          if (expectedCol.rqd && !actualCol.rqd) {
            incorrectColumns.push({
              column_name: expectedCol.column_name,
              issue: `Required field is not marked as required`,
              expected: "required",
              actual: "optional",
            })
          }
        }
      }

      // Проверяем лишние колонки (кроме системных)
      for (const [colName, actualCol] of actualMap.entries()) {
        if (!expectedMap.has(colName) && normalizeColumnName(colName) !== "id") {
          extraColumns.push(actualCol.column_name || colName)
        }
      }

      // Определяем статус
      let status = "ok"
      if (missingColumns.length > 0 || incorrectColumns.length > 0) {
        status = "error"
      } else if (extraColumns.length > 0) {
        status = "warning"
      }

      results[tableName] = {
        status,
        tableId,
        expectedCount: expectedColumns.length,
        actualCount: actualColumns.length,
        missingColumns: missingColumns.length > 0 ? missingColumns : undefined,
        extraColumns: extraColumns.length > 0 ? extraColumns : undefined,
        incorrectColumns: incorrectColumns.length > 0 ? incorrectColumns : undefined,
        columns: actualColumns.map((col: any) => ({
          column_name: col.column_name,
          title: col.title,
          uidt: col.uidt,
          rqd: col.rqd || false,
        })),
      }
    } catch (error) {
      results[tableName] = {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
        tableId,
      }
    }
  }

  // Подсчитываем статистику
  const stats = {
    total: Object.keys(expectedStructures).length,
    ok: Object.values(results).filter((r) => r.status === "ok").length,
    warning: Object.values(results).filter((r) => r.status === "warning").length,
    error: Object.values(results).filter((r) => r.status === "error").length,
  }

  return NextResponse.json({
    success: stats.error === 0,
    stats,
    results,
    timestamp: new Date().toISOString(),
  })
}

