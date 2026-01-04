// API route для настройки связей между таблицами в NocoDB

import { NextResponse } from "next/server"

interface Relationship {
  fromTable: string
  fromColumn: string
  toTable: string
  toColumn: string
  type: "hm" | "bt" | "mm" // hasMany, belongsTo, manyToMany
  title: string
}

const relationships: Relationship[] = [
  // Orders -> Users (многие к одному) - создаем belongsTo в Orders
  {
    fromTable: "Orders",
    fromColumn: "user_id",
    toTable: "Users",
    toColumn: "Id",
    type: "bt",
    title: "Пользователь",
  },
  // Order_Persons -> Orders (многие к одному)
  {
    fromTable: "Order_Persons",
    fromColumn: "order_id",
    toTable: "Orders",
    toColumn: "Id",
    type: "bt",
    title: "Заказ",
  },
  // Order_Meals -> Order_Persons (многие к одному)
  {
    fromTable: "Order_Meals",
    fromColumn: "order_person_id",
    toTable: "Order_Persons",
    toColumn: "Id",
    type: "bt",
    title: "Персона",
  },
  // Order_Extras -> Orders (многие к одному)
  {
    fromTable: "Order_Extras",
    fromColumn: "order_id",
    toTable: "Orders",
    toColumn: "Id",
    type: "bt",
    title: "Заказ",
  },
  // Order_Meals -> Meals (многие к одному)
  {
    fromTable: "Order_Meals",
    fromColumn: "meal_id",
    toTable: "Meals",
    toColumn: "Id",
    type: "bt",
    title: "Блюдо",
  },
  // Order_Extras -> Extras (многие к одному)
  {
    fromTable: "Order_Extras",
    fromColumn: "extra_id",
    toTable: "Extras",
    toColumn: "Id",
    type: "bt",
    title: "Дополнение",
  },
  // Reviews -> Orders (многие к одному)
  {
    fromTable: "Reviews",
    fromColumn: "order_id",
    toTable: "Orders",
    toColumn: "Id",
    type: "bt",
    title: "Заказ",
  },
]

function getTableId(tableName: string): string {
  const envKey = `NOCODB_TABLE_${tableName.toUpperCase()}`
  const tableId = process.env[envKey]
  if (!tableId) {
    throw new Error(`Table ID not found for ${tableName}. Set ${envKey} environment variable.`)
  }
  return tableId
}

async function createRelationship(
  baseUrl: string,
  token: string,
  baseId: string,
  relationship: Relationship,
): Promise<{ success: boolean; error?: string; message?: string }> {
  try {
    const fromTableId = getTableId(relationship.fromTable)
    const toTableId = getTableId(relationship.toTable)

    // Получаем информацию о таблице и её колонках
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
    const table = tablesData?.list?.find((t: any) => t.id === fromTableId)

    if (!table) {
      return {
        success: false,
        error: `Table ${relationship.fromTable} not found`,
      }
    }

    // Получаем колонки через несколько способов
    let columns: any[] = []
    let existingColumn: any = null
    
    // Способ 1: из структуры таблицы
    if (table.columns && table.columns.length > 0) {
      columns = table.columns
    } else {
      // Способ 2: через endpoint для колонок
      const columnsUrl1 = `${baseUrl}/api/v2/meta/bases/${baseId}/tables/${fromTableId}/columns`
      const columnsResponse1 = await fetch(columnsUrl1, {
        headers: {
          "xc-token": token,
          "Content-Type": "application/json",
        },
      })
      
      if (columnsResponse1.ok) {
        const columnsData1 = await columnsResponse1.json()
        columns = columnsData1?.list || []
      } else {
        // Способ 3: через прямой endpoint таблицы
        const columnsUrl2 = `${baseUrl}/api/v2/meta/tables/${fromTableId}/columns`
        const columnsResponse2 = await fetch(columnsUrl2, {
          headers: {
            "xc-token": token,
            "Content-Type": "application/json",
          },
        })
        
        if (columnsResponse2.ok) {
          const columnsData2 = await columnsResponse2.json()
          columns = columnsData2?.list || []
        } else {
          // Способ 4: получаем через запись и анализируем структуру
          const recordsUrl = `${baseUrl}/api/v2/tables/${fromTableId}/records?limit=1`
          const recordsResponse = await fetch(recordsUrl, {
            headers: {
              "xc-token": token,
              "Content-Type": "application/json",
            },
          })
          
          if (recordsResponse.ok) {
            const recordsData = await recordsResponse.json()
            const sampleRecord = recordsData?.list?.[0]
            if (sampleRecord) {
              // Создаем список колонок на основе ключей записи
              columns = Object.keys(sampleRecord).map((key) => ({
                column_name: key,
                title: key,
                id: key, // Временный ID
              }))
            }
          }
        }
      }
    }
    
    // Ищем колонку по разным вариантам названий
    existingColumn = columns.find(
      (col: any) => col.column_name === relationship.fromColumn || col.title === relationship.fromColumn,
    )
    
    // Если не нашли, пробуем найти по другим вариантам
    if (!existingColumn) {
      existingColumn = columns.find(
        (col: any) => col.column_name?.replace(/_/g, "") === relationship.fromColumn.replace(/_/g, ""),
      )
    }
    
    // Если все еще не нашли, выводим список доступных колонок
    if (!existingColumn) {
      const availableColumns = columns.map((col: any) => col.column_name || col.title).join(", ")
      return {
        success: false,
        error: `Column ${relationship.fromColumn} not found in table ${relationship.fromTable}. Available columns: ${availableColumns || "none"}`,
      }
    }
    
    // Получаем реальный ID колонки через метаданные
    // Пробуем несколько способов получения ID
    let columnId = existingColumn.id
    
    if (!columnId || columnId === existingColumn.column_name || typeof columnId === 'string' && !columnId.match(/^[a-z0-9]+$/i)) {
      // Пробуем получить ID через endpoint метаданных
      const metaUrl1 = `${baseUrl}/api/v2/meta/tables/${fromTableId}/columns`
      const metaResponse1 = await fetch(metaUrl1, {
        headers: {
          "xc-token": token,
          "Content-Type": "application/json",
        },
      })
      
      if (metaResponse1.ok) {
        const metaData1 = await metaResponse1.json()
        const metaColumn1 = metaData1?.list?.find(
          (col: any) => col.column_name === relationship.fromColumn || col.title === relationship.fromColumn,
        )
        if (metaColumn1 && metaColumn1.id) {
          columnId = metaColumn1.id
          existingColumn = metaColumn1
        }
      }
      
      // Если не получилось, пробуем через bases
      if (!columnId || columnId === existingColumn.column_name) {
        const metaUrl2 = `${baseUrl}/api/v2/meta/bases/${baseId}/tables/${fromTableId}/columns`
        const metaResponse2 = await fetch(metaUrl2, {
          headers: {
            "xc-token": token,
            "Content-Type": "application/json",
          },
        })
        
          if (metaResponse2.ok) {
          const metaData2 = await metaResponse2.json()
          const metaColumn2 = metaData2?.list?.find(
            (col: any) => col.column_name === relationship.fromColumn || col.title === relationship.fromColumn,
          )
          if (metaColumn2) {
            if (metaColumn2.id) {
              columnId = metaColumn2.id
            }
            existingColumn = { ...existingColumn, ...metaColumn2 }
          }
        }
      }
    }
    
    if (!columnId || columnId === existingColumn.column_name) {
      return {
        success: false,
        error: `Could not find column ID for ${relationship.fromColumn} in table ${relationship.fromTable}`,
      }
    }

    // Проверяем, есть ли уже связь
    if (existingColumn.uidt === "LinkToAnotherRecord") {
      const existingLink = existingColumn.meta?.foreign_table
      if (existingLink === toTableId) {
        return {
          success: true,
          message: `Relationship already exists: ${relationship.fromTable}.${relationship.fromColumn} -> ${relationship.toTable}`,
        }
      }
    }

    // Обновляем колонку на LinkToAnotherRecord
    // Пробуем разные endpoints
    let updateResponse: Response | null = null
    
    // Вариант 1: через bases
    const updateColumnUrl1 = `${baseUrl}/api/v2/meta/bases/${baseId}/tables/${fromTableId}/columns/${columnId}`
    updateResponse = await fetch(updateColumnUrl1, {
      method: "PATCH",
      headers: {
        "xc-token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uidt: "LinkToAnotherRecord",
        title: relationship.title,
        meta: {
          type: relationship.type,
          foreign_key: relationship.toColumn,
          foreign_table: toTableId,
          foreign_table_column: relationship.toColumn,
        },
      }),
    })
    
    // Если не сработало, пробуем вариант 2: напрямую через tables
    if (!updateResponse.ok) {
      const updateColumnUrl2 = `${baseUrl}/api/v2/meta/tables/${fromTableId}/columns/${columnId}`
      updateResponse = await fetch(updateColumnUrl2, {
        method: "PATCH",
        headers: {
          "xc-token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uidt: "LinkToAnotherRecord",
          title: relationship.title,
          meta: {
            type: relationship.type,
            foreign_key: relationship.toColumn,
            foreign_table: toTableId,
            foreign_table_column: relationship.toColumn,
          },
        }),
      })
    }

    if (!updateResponse || !updateResponse.ok) {
      const errorText = updateResponse ? await updateResponse.text() : "No response"
      return {
        success: false,
        error: `Failed to update column: ${updateResponse?.status || "unknown"} - ${errorText}`,
      }
    }

    return {
      success: true,
      message: `Relationship created: ${relationship.fromTable}.${relationship.fromColumn} -> ${relationship.toTable}.${relationship.toColumn}`,
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
  const results: Record<string, any> = {}

  // Создаем каждую связь
  for (const relationship of relationships) {
    const key = `${relationship.fromTable}.${relationship.fromColumn}->${relationship.toTable}`
    console.log(`🔗 Настройка связи: ${key}`)
    const result = await createRelationship(baseUrl, NOCODB_TOKEN, NOCODB_BASE_ID, relationship)
    results[key] = result
    if (result.success) {
      console.log(`✅ ${result.message}`)
    } else {
      console.error(`❌ ${result.error}`)
    }
  }

  const summary = {
    total: relationships.length,
    created: Object.values(results).filter((r) => r.success).length,
    errors: Object.values(results).filter((r) => !r.success).length,
    existing: Object.values(results).filter((r) => r.success && r.message?.includes("already exists")).length,
  }

  return NextResponse.json({
    success: summary.errors === 0,
    summary,
    results,
    message: `Настроено ${summary.created} связей из ${summary.total}`,
  })
}

