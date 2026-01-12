import { NextResponse } from "next/server"

export async function GET() {
  try {
    const nocodbUrl = process.env.NOCODB_URL
    const nocodbToken = process.env.NOCODB_TOKEN
    const tableId = process.env.NOCODB_TABLE_USERS

    if (!nocodbUrl || !nocodbToken || !tableId) {
      return NextResponse.json(
        { 
          error: "NocoDB not configured",
          config: {
            hasUrl: !!nocodbUrl,
            hasToken: !!nocodbToken,
            hasTableId: !!tableId,
          }
        },
        { status: 500 }
      )
    }

    let baseUrl = nocodbUrl.replace(/\/$/, "")
    if (!baseUrl.endsWith("/api/v2")) {
      baseUrl = `${baseUrl}/api/v2`
    }

    // Получаем структуру таблицы (колонки)
    const columnsUrl = `${baseUrl}/tables/${tableId}/columns`
    const columnsResponse = await fetch(columnsUrl, {
      headers: {
        "xc-token": nocodbToken,
        "Content-Type": "application/json",
      },
    })

    let columnsData = null
    if (columnsResponse.ok) {
      columnsData = await columnsResponse.json()
    }

    // Получаем несколько записей для проверки структуры
    const recordsUrl = `${baseUrl}/tables/${tableId}/records?limit=2`
    const recordsResponse = await fetch(recordsUrl, {
      headers: {
        "xc-token": nocodbToken,
        "Content-Type": "application/json",
      },
    })

    let recordsData = null
    if (recordsResponse.ok) {
      recordsData = await recordsResponse.json()
    }

    // Ищем поле ID
    const idColumn = (columnsData?.list || []).find((col: any) => 
      (col.column_name && col.column_name.toLowerCase() === 'id') || 
      (col.title && col.title.toLowerCase() === 'id') ||
      col.uidt === 'ID' ||
      col.pk === true
    )

    const firstRecord = recordsData?.list?.[0] || null
    const recordKeys = firstRecord ? Object.keys(firstRecord) : []

    return NextResponse.json({
      success: true,
      tableId,
      columns: {
        total: columnsData?.list?.length || 0,
        list: columnsData?.list || [],
        idColumn: idColumn ? {
          column_name: idColumn.column_name,
          title: idColumn.title,
          uidt: idColumn.uidt,
          pk: idColumn.pk,
        } : null,
      },
      records: {
        count: recordsData?.list?.length || 0,
        firstRecord: firstRecord,
        recordKeys: recordKeys,
        hasId: firstRecord ? ('Id' in firstRecord || 'id' in firstRecord || '_id' in firstRecord) : false,
        idValue: firstRecord ? (firstRecord.Id || firstRecord.id || firstRecord._id || null) : null,
      },
      analysis: {
        idFieldName: firstRecord ? (
          'Id' in firstRecord ? 'Id' :
          'id' in firstRecord ? 'id' :
          '_id' in firstRecord ? '_id' : null
        ) : null,
        primaryKeyColumn: idColumn ? idColumn.column_name : null,
        recommendation: idColumn ? 
          `Используйте поле "${idColumn.column_name}" (title: "${idColumn.title}") как ID` :
          "Поле ID не найдено! Нужно создать первичный ключ в таблице.",
      }
    })
  } catch (error) {
    console.error("Error checking table structure:", error)
    return NextResponse.json(
      { 
        error: "Failed to check table structure",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}





