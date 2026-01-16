// API route для автоматического создания таблиц в NocoDB
// Создает все необходимые таблицы с правильной структурой

import { NextResponse } from "next/server"

// Определения структуры таблиц
interface TableColumn {
  column_name: string
  title: string
  uidt: string // NocoDB column type
  dt?: string
  rqd?: boolean // required
  pk?: boolean // primary key
  ai?: boolean // auto increment
  cdf?: string // default value
  un?: boolean // unique
  dtx?: string // data type extra
  ct?: string // column type
  meta?: Record<string, any>
}

interface TableDefinition {
  title: string
  table_name: string
  columns: TableColumn[]
}

const tableDefinitions: Record<string, TableColumn[]> = {
  Meals: [
    { column_name: "Id", title: "Id", uidt: "ID", pk: true, ai: true },
    { column_name: "name", title: "Name", uidt: "SingleLineText", rqd: true },
    { column_name: "category", title: "Category", uidt: "SingleLineText", rqd: true },
    { column_name: "ingredients", title: "Ingredients", uidt: "LongText", rqd: true },
    { column_name: "description", title: "Description", uidt: "LongText", rqd: false },
    { column_name: "price_single", title: "Price (Single)", uidt: "Decimal", rqd: false },
    { column_name: "price_medium", title: "Price (Medium)", uidt: "Decimal", rqd: false },
    { column_name: "price_large", title: "Price (Large)", uidt: "Decimal", rqd: false },
    { column_name: "weight_single", title: "Weight (Single)", uidt: "Number", rqd: false },
    { column_name: "weight_medium", title: "Weight (Medium)", uidt: "Number", rqd: false },
    { column_name: "weight_large", title: "Weight (Large)", uidt: "Number", rqd: false },
    { column_name: "image", title: "Image (URL)", uidt: "SingleLineText", rqd: false },
    { column_name: "needs_garnish", title: "Needs Garnish", uidt: "Checkbox", rqd: false, cdf: "false" },
    { column_name: "calories", title: "Calories", uidt: "Number", rqd: false },
    { column_name: "protein", title: "Protein", uidt: "Decimal", rqd: false },
    { column_name: "fats", title: "Fats", uidt: "Decimal", rqd: false },
    { column_name: "carbs", title: "Carbs", uidt: "Decimal", rqd: false },
    { column_name: "is_current_week", title: "Current Week", uidt: "Checkbox", rqd: false },
    { column_name: "is_next_week", title: "Next Week", uidt: "Checkbox", rqd: false },
  ],
  Extras: [
    { column_name: "Id", title: "Id", uidt: "ID", pk: true, ai: true },
    { column_name: "name", title: "Name", uidt: "SingleLineText", rqd: true },
    { column_name: "category", title: "Category", uidt: "SingleLineText", rqd: true },
    { column_name: "ingredients", title: "Ingredients", uidt: "LongText", rqd: false },
    { column_name: "description", title: "Description", uidt: "LongText", rqd: false },
    { column_name: "price", title: "Price", uidt: "Decimal", rqd: true },
    { column_name: "image", title: "Image (URL)", uidt: "SingleLineText", rqd: false },
    { column_name: "calories", title: "Calories", uidt: "Number", rqd: false },
    { column_name: "protein", title: "Protein", uidt: "Decimal", rqd: false },
    { column_name: "fats", title: "Fats", uidt: "Decimal", rqd: false },
    { column_name: "carbs", title: "Carbs", uidt: "Decimal", rqd: false },
    { column_name: "weight", title: "Weight", uidt: "Number", rqd: false },
    { column_name: "is_current_week", title: "Current Week", uidt: "Checkbox", rqd: false },
    { column_name: "is_next_week", title: "Next Week", uidt: "Checkbox", rqd: false },
  ],
  Delivery_Zones: [
    { column_name: "Id", title: "Id", uidt: "ID", pk: true, ai: true },
    { column_name: "city", title: "City", uidt: "SingleLineText", rqd: true },
    { column_name: "district", title: "District", uidt: "SingleLineText", rqd: false },
    { column_name: "delivery_fee", title: "Delivery Fee", uidt: "Decimal", rqd: true },
    { column_name: "min_order_amount", title: "Min Order Amount", uidt: "Decimal", rqd: true },
    { column_name: "is_available", title: "Available", uidt: "Checkbox", rqd: false, cdf: "true" },
    { column_name: "available_intervals", title: "Available Intervals", uidt: "JSON", rqd: false },
  ],
  Users: [
    { column_name: "Id", title: "Id", uidt: "ID", pk: true, ai: true },
    { column_name: "phone", title: "Phone", uidt: "PhoneNumber", rqd: true, un: true },
    { column_name: "password_hash", title: "Password Hash", uidt: "SingleLineText", rqd: false },
    { column_name: "name", title: "Name", uidt: "SingleLineText", rqd: true },
    { column_name: "additional_phone", title: "Additional Phone", uidt: "PhoneNumber", rqd: false },
    { column_name: "street", title: "Street", uidt: "SingleLineText", rqd: false },
    { column_name: "building", title: "Building", uidt: "SingleLineText", rqd: false },
    { column_name: "building_section", title: "Building Section", uidt: "SingleLineText", rqd: false },
    { column_name: "apartment", title: "Apartment", uidt: "SingleLineText", rqd: false },
    { column_name: "entrance", title: "Entrance", uidt: "SingleLineText", rqd: false },
    { column_name: "floor", title: "Floor", uidt: "SingleLineText", rqd: false },
    { column_name: "intercom", title: "Intercom", uidt: "SingleLineText", rqd: false },
    { column_name: "district", title: "District", uidt: "SingleLineText", rqd: false },
    { column_name: "delivery_comment", title: "Delivery Comment", uidt: "LongText", rqd: false },
    { column_name: "loyalty_points", title: "Loyalty Points", uidt: "Number", rqd: true, cdf: "0" },
    { column_name: "total_spent", title: "Total Spent", uidt: "Decimal", rqd: true, cdf: "0" },
    { column_name: "created_at", title: "Created At", uidt: "DateTime", rqd: true },
    { column_name: "updated_at", title: "Updated At", uidt: "DateTime", rqd: true },
  ],
  Orders: [
    { column_name: "Id", title: "Id", uidt: "ID", pk: true, ai: true },
    { column_name: "user_id", title: "User ID", uidt: "Number", rqd: false },
    { column_name: "order_number", title: "Order Number", uidt: "SingleLineText", rqd: true, un: true },
    { column_name: "start_date", title: "Start Date", uidt: "Date", rqd: true },
    { column_name: "delivery_time", title: "Delivery Time", uidt: "SingleLineText", rqd: true },
    
    // Улучшенные статусы оплаты
    { column_name: "payment_status", title: "Payment Status", uidt: "SingleLineText", rqd: true, cdf: "pending" },
    // Возможные значения: "pending" (ожидает оплаты), "paid" (оплачено), "refunded" (возврат), "failed" (ошибка оплаты)
    
    { column_name: "payment_method", title: "Payment Method", uidt: "SingleLineText", rqd: true, cdf: "cash" },
    // Возможные значения: "cash" (наличные), "card" (карта), "sbp" (СБП), "online" (онлайн)
    
    { column_name: "paid", title: "Paid", uidt: "Checkbox", rqd: false, cdf: "false" },
    { column_name: "paid_at", title: "Paid At", uidt: "DateTime", rqd: false },
    { column_name: "payment_id", title: "Payment ID", uidt: "SingleLineText", rqd: false },
    
    // Общий статус заказа (без статусов доставки)
    { column_name: "order_status", title: "Order Status", uidt: "SingleLineText", rqd: true, cdf: "pending" },
    // Возможные значения: "pending" (в обработке), "confirmed" (подтвержден), "preparing" (готовится), "ready" (готов), "cancelled" (отменен)
    
    // УДАЛЕНО: delivered, cancelled - статусы доставки убраны (нет интеграции с логистикой)
    
    { column_name: "promo_code", title: "Promo Code", uidt: "SingleLineText", rqd: false },
    { column_name: "promo_discount", title: "Promo Discount", uidt: "Decimal", rqd: false },
    { column_name: "loyalty_points_used", title: "Loyalty Points Used", uidt: "Number", rqd: true, cdf: "0" },
    { column_name: "loyalty_points_earned", title: "Loyalty Points Earned", uidt: "Number", rqd: true, cdf: "0" },
    { column_name: "subtotal", title: "Subtotal", uidt: "Decimal", rqd: true, cdf: "0" },
    { column_name: "total", title: "Total", uidt: "Decimal", rqd: true, cdf: "0" },
    { column_name: "guest_phone", title: "Guest Phone", uidt: "PhoneNumber", rqd: false },
    { column_name: "guest_address", title: "Guest Address", uidt: "LongText", rqd: false },
    { column_name: "created_at", title: "Created At", uidt: "DateTime", rqd: true },
    { column_name: "updated_at", title: "Updated At", uidt: "DateTime", rqd: true },
  ],
  Order_Persons: [
    { column_name: "Id", title: "Id", uidt: "ID", pk: true, ai: true },
    { column_name: "order_id", title: "Order ID", uidt: "Number", rqd: true },
    { column_name: "person_number", title: "Person Number", uidt: "Number", rqd: true },
  ],
  Order_Meals: [
    { column_name: "Id", title: "Id", uidt: "ID", pk: true, ai: true },
    { column_name: "order_person_id", title: "Order Person ID", uidt: "Number", rqd: true },
    { column_name: "day", title: "Day", uidt: "SingleLineText", rqd: true },
    { column_name: "meal_time", title: "Meal Time", uidt: "SingleLineText", rqd: true },
    { column_name: "meal_type", title: "Meal Type", uidt: "SingleLineText", rqd: true },
    { column_name: "meal_id", title: "Meal ID", uidt: "Number", rqd: true },
    { column_name: "portion_size", title: "Portion Size", uidt: "SingleLineText", rqd: true },
    { column_name: "price", title: "Price", uidt: "Decimal", rqd: true },
    { column_name: "garnish_id", title: "Garnish ID", uidt: "Number", rqd: false },
    { column_name: "garnish_portion_size", title: "Garnish Portion Size", uidt: "SingleLineText", rqd: false },
    { column_name: "garnish_price", title: "Garnish Price", uidt: "Decimal", rqd: false },
  ],
  Order_Extras: [
    { column_name: "Id", title: "Id", uidt: "ID", pk: true, ai: true },
    { column_name: "order_id", title: "Order ID", uidt: "Number", rqd: true },
    { column_name: "extra_id", title: "Extra ID", uidt: "Number", rqd: true },
    { column_name: "quantity", title: "Quantity", uidt: "Number", rqd: true, cdf: "1" },
    { column_name: "price", title: "Price", uidt: "Decimal", rqd: true },
  ],
  Promo_Codes: [
    { column_name: "Id", title: "Id", uidt: "ID", pk: true, ai: true },
    { column_name: "code", title: "Code", uidt: "SingleLineText", rqd: true, un: true },
    { column_name: "discount_type", title: "Discount Type", uidt: "SingleLineText", rqd: true },
    { column_name: "discount_value", title: "Discount Value", uidt: "Decimal", rqd: true },
    { column_name: "min_order_amount", title: "Min Order Amount", uidt: "Decimal", rqd: false },
    { column_name: "max_discount", title: "Max Discount", uidt: "Decimal", rqd: false },
    { column_name: "valid_from", title: "Valid From", uidt: "Date", rqd: false },
    { column_name: "valid_until", title: "Valid Until", uidt: "Date", rqd: false },
    { column_name: "usage_limit", title: "Usage Limit", uidt: "Number", rqd: false },
    { column_name: "times_used", title: "Times Used", uidt: "Number", rqd: true, cdf: "0" },
    { column_name: "active", title: "Active", uidt: "Checkbox", rqd: false, cdf: "true" },
  ],
  Reviews: [
    { column_name: "Id", title: "Id", uidt: "ID", pk: true, ai: true },
    { column_name: "order_id", title: "Order ID", uidt: "Number", rqd: true },
    { column_name: "user_id", title: "User ID", uidt: "Number", rqd: true },
    { column_name: "rating", title: "Rating", uidt: "Number", rqd: true },
    { column_name: "text", title: "Review Text", uidt: "LongText", rqd: false },
    { column_name: "created_at", title: "Created At", uidt: "DateTime", rqd: true },
    { column_name: "updated_at", title: "Updated At", uidt: "DateTime", rqd: true },
  ],
  Loyalty_Points_Transactions: [
    { column_name: "Id", title: "Id", uidt: "ID", pk: true, ai: true },
    { column_name: "user_id", title: "User ID", uidt: "Number", rqd: true },
    { column_name: "order_id", title: "Order ID", uidt: "Number", rqd: false },
    { column_name: "transaction_type", title: "Transaction Type", uidt: "SingleLineText", rqd: true },
    // Возможные значения: "earned" (начислено), "used" (использовано), "refunded" (возвращено), "cancelled" (отменено)
    { column_name: "transaction_status", title: "Transaction Status", uidt: "SingleLineText", rqd: true, cdf: "completed" },
    // Возможные значения: "pending" (ожидает), "completed" (завершено), "cancelled" (отменено)
    { column_name: "points", title: "Points", uidt: "Number", rqd: true },
    { column_name: "description", title: "Description", uidt: "LongText", rqd: false },
    { column_name: "created_at", title: "Created At", uidt: "DateTime", rqd: true },
    { column_name: "updated_at", title: "Updated At", uidt: "DateTime", rqd: true },
    { column_name: "processed_at", title: "Processed At", uidt: "DateTime", rqd: false },
  ],
  Fraud_Alerts: [
    { column_name: "Id", title: "Id", uidt: "ID", pk: true, ai: true },
    { column_name: "user_id", title: "User ID", uidt: "Number", rqd: true },
    { column_name: "alert_type", title: "Alert Type", uidt: "SingleLineText", rqd: true },
    // Возможные значения: "excessive_cancellations" (чрезмерные отмены)
    { column_name: "paid_orders_count", title: "Paid Orders Count", uidt: "Number", rqd: true, cdf: "0" },
    { column_name: "cancelled_paid_orders_count", title: "Cancelled Paid Orders Count", uidt: "Number", rqd: true, cdf: "0" },
    { column_name: "cancellation_rate", title: "Cancellation Rate", uidt: "Decimal", rqd: true, cdf: "0" },
    { column_name: "last_incident_date", title: "Last Incident Date", uidt: "DateTime", rqd: true },
    { column_name: "status", title: "Status", uidt: "SingleLineText", rqd: true, cdf: "active" },
    // Возможные значения: "active" (активный), "reviewed" (проверен), "resolved" (решен)
    { column_name: "admin_notes", title: "Admin Notes", uidt: "LongText", rqd: false },
    { column_name: "created_at", title: "Created At", uidt: "DateTime", rqd: true },
    { column_name: "updated_at", title: "Updated At", uidt: "DateTime", rqd: true },
  ],
}

async function createTable(
  baseUrl: string,
  token: string,
  baseId: string,
  tableName: string,
  columns: TableColumn[],
  forceRecreate: boolean = false,
): Promise<{ success: boolean; tableId?: string; error?: string; action?: string }> {
  try {
    // Сначала проверяем, существует ли таблица
    const tablesUrl = `${baseUrl}/api/v2/meta/bases/${baseId}/tables`
    const tablesResponse = await fetch(tablesUrl, {
      headers: {
        "xc-token": token,
        "Content-Type": "application/json",
      },
    })

    if (tablesResponse.ok) {
      const tablesData = await tablesResponse.json()
      const existingTable = tablesData?.list?.find(
        (t: any) => t.title === tableName || t.table_name === tableName.toLowerCase().replace(/_/g, ""),
      )
      if (existingTable) {
        // Если нужно пересоздать, удаляем существующую таблицу
        if (forceRecreate) {
          console.log(`🗑️ Удаление существующей таблицы ${tableName} (${existingTable.id})...`)
          const deleteUrl = `${baseUrl}/api/v2/meta/tables/${existingTable.id}`
          const deleteResponse = await fetch(deleteUrl, {
            method: "DELETE",
            headers: {
              "xc-token": token,
              "Content-Type": "application/json",
            },
          })

          if (!deleteResponse.ok) {
            const errorText = await deleteResponse.text()
            return {
              success: false,
              error: `Failed to delete existing table: ${deleteResponse.status} - ${errorText}`,
            }
          }
          console.log(`✅ Таблица ${tableName} удалена`)
        } else {
          return { success: true, tableId: existingTable.id, action: "existing" }
        }
      }
    }

    // Создаем таблицу
    const createTableUrl = `${baseUrl}/api/v2/meta/bases/${baseId}/tables`
    const createResponse = await fetch(createTableUrl, {
      method: "POST",
      headers: {
        "xc-token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table_name: tableName.toLowerCase().replace(/_/g, ""),
        title: tableName,
        columns: columns.map((col) => ({
          column_name: col.column_name,
          title: col.title,
          uidt: col.uidt,
          dt: col.dt,
          rqd: col.rqd || false,
          pk: col.pk || false,
          ai: col.ai || false,
          cdf: col.cdf,
          un: col.un || false,
          dtx: col.dtx,
          ct: col.ct,
          meta: col.meta || {},
        })),
      }),
    })

    if (!createResponse.ok) {
      const errorText = await createResponse.text()
      return { success: false, error: `Failed to create table: ${createResponse.status} - ${errorText}` }
    }

    const tableData = await createResponse.json()
    return { success: true, tableId: tableData.id, action: "created" }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export async function POST(request: Request) {
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

  // Проверяем параметры
  const { searchParams } = new URL(request.url)
  const forceRecreate = searchParams.get("force") === "true"
  const specificTable = searchParams.get("table")

  const baseUrl = NOCODB_URL.replace(/\/api\/v2\/?$/, "")
  const results: Record<string, any> = {}
  const createdTableIds: Record<string, string> = {}

  // Определяем, какие таблицы создавать
  const tablesToCreate = specificTable 
    ? (tableDefinitions[specificTable] ? { [specificTable]: tableDefinitions[specificTable] } : {})
    : tableDefinitions

  if (specificTable && !tableDefinitions[specificTable]) {
    return NextResponse.json(
      {
        error: "Table not found",
        message: `Таблица "${specificTable}" не найдена в определениях`,
        availableTables: Object.keys(tableDefinitions),
      },
      { status: 404 },
    )
  }

  // Создаем таблицы
  for (const [tableName, columns] of Object.entries(tablesToCreate)) {
    const result = await createTable(baseUrl, NOCODB_TOKEN, NOCODB_BASE_ID, tableName, columns, forceRecreate)
    results[tableName] = result

    if (result.success && result.tableId) {
      createdTableIds[tableName] = result.tableId
    }
  }

  // Формируем переменные окружения для обновления
  const envVars = Object.entries(createdTableIds)
    .map(([name, id]) => `NOCODB_TABLE_${name.toUpperCase()}=${id}`)
    .join("\n")

  const summary = {
    total: Object.keys(tablesToCreate).length,
    created: Object.values(results).filter((r) => r.success).length,
    errors: Object.values(results).filter((r) => !r.success).length,
    existing: Object.values(results).filter((r) => r.success && !r.tableId).length,
  }

  return NextResponse.json({
    success: summary.errors === 0,
    summary,
    results,
    createdTableIds,
    envVars,
    instructions: `
Обновите переменные окружения следующими значениями:

${envVars}

Или скопируйте и вставьте в ваш .env файл или .env.production на сервере.
    `.trim(),
  })
}

// GET endpoint для просмотра плана создания таблиц
export async function GET(request: Request) {
  // Для удобства GET тоже создаёт таблицы
  return POST(request)
}

