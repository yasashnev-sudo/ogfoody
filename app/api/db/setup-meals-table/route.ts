// API route для создания/обновления только таблицы Meals в NocoDB
// Создает таблицу Meals с правильной структурой (без available, image как SingleLineText)

import { NextResponse } from "next/server"

interface TableColumn {
  column_name: string
  title: string
  uidt: string
  dt?: string
  rqd?: boolean
  pk?: boolean
  ai?: boolean
  cdf?: string
  un?: boolean
  dtx?: string
  ct?: string
  meta?: Record<string, any>
}

const mealsColumns: TableColumn[] = [
  { column_name: "Id", title: "Id", uidt: "ID", pk: true, ai: true },
  { column_name: "name", title: "Название", uidt: "SingleLineText", rqd: true },
  { column_name: "category", title: "Категория", uidt: "SingleLineText", rqd: true },
  { column_name: "ingredients", title: "Ингредиенты", uidt: "LongText", rqd: true },
  { column_name: "description", title: "Описание", uidt: "LongText", rqd: false },
  { column_name: "price_single", title: "Цена (стандарт)", uidt: "Decimal", rqd: false },
  { column_name: "price_medium", title: "Цена (средний)", uidt: "Decimal", rqd: false },
  { column_name: "price_large", title: "Цена (большой)", uidt: "Decimal", rqd: false },
  { column_name: "weight_single", title: "Вес (стандарт)", uidt: "Number", rqd: false },
  { column_name: "weight_medium", title: "Вес (средний)", uidt: "Number", rqd: false },
  { column_name: "weight_large", title: "Вес (большой)", uidt: "Number", rqd: false },
  { column_name: "image", title: "Изображение (ссылка)", uidt: "SingleLineText", rqd: false },
  { column_name: "needs_garnish", title: "Нужен гарнир", uidt: "Checkbox", rqd: false, cdf: "false" },
  { column_name: "calories", title: "Калории", uidt: "Number", rqd: false },
  { column_name: "protein", title: "Белки", uidt: "Decimal", rqd: false },
  { column_name: "fats", title: "Жиры", uidt: "Decimal", rqd: false },
  { column_name: "carbs", title: "Углеводы", uidt: "Decimal", rqd: false },
  { column_name: "is_current_week", title: "Текущая неделя", uidt: "Checkbox", rqd: false },
  { column_name: "is_next_week", title: "Следующая неделя", uidt: "Checkbox", rqd: false },
]

async function createOrUpdateMealsTable(
  baseUrl: string,
  token: string,
  baseId: string,
): Promise<{ success: boolean; tableId?: string; error?: string; action?: string }> {
  try {
    // Получаем список всех таблиц
    const tablesUrl = `${baseUrl}/api/v2/meta/bases/${baseId}/tables`
    const tablesResponse = await fetch(tablesUrl, {
      headers: {
        "xc-token": token,
        "Content-Type": "application/json",
      },
    })

    if (!tablesResponse.ok) {
      return {
        success: false,
        error: `Failed to fetch tables: ${tablesResponse.status}`,
      }
    }

    const tablesData = await tablesResponse.json()
    const existingTable = tablesData?.list?.find(
      (t: any) => t.title === "Meals" || t.table_name === "meals",
    )

    // Если таблица существует, удаляем её
    if (existingTable) {
      console.log(`🗑️ Удаление существующей таблицы Meals (${existingTable.id})...`)
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
      console.log(`✅ Таблица Meals удалена`)
    }

    // Создаем таблицу заново
    console.log(`📝 Создание таблицы Meals с правильной структурой...`)
    const createTableUrl = `${baseUrl}/api/v2/meta/bases/${baseId}/tables`
    const createResponse = await fetch(createTableUrl, {
      method: "POST",
      headers: {
        "xc-token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table_name: "meals",
        title: "Meals",
        columns: mealsColumns.map((col) => ({
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
      return {
        success: false,
        error: `Failed to create table: ${createResponse.status} - ${errorText}`,
      }
    }

    const tableData = await createResponse.json()
    console.log(`✅ Таблица Meals создана с ID: ${tableData.id}`)
    
    return {
      success: true,
      tableId: tableData.id,
      action: existingTable ? "recreated" : "created",
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function POST() {
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
  const result = await createOrUpdateMealsTable(baseUrl, NOCODB_TOKEN, NOCODB_BASE_ID)

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        error: result.error,
        message: "Не удалось создать таблицу Meals",
      },
      { status: 500 },
    )
  }

  return NextResponse.json({
    success: true,
    message: `Таблица Meals ${result.action === "recreated" ? "пересоздана" : "создана"} успешно`,
    tableId: result.tableId,
    envVar: `NOCODB_TABLE_MEALS=${result.tableId}`,
    instructions: `Обновите переменную окружения: NOCODB_TABLE_MEALS=${result.tableId}`,
    columns: mealsColumns.length,
    fields: mealsColumns.map((col) => ({
      name: col.column_name,
      type: col.uidt,
      required: col.rqd || false,
    })),
  })
}






