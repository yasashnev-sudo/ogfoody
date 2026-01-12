import { NextResponse } from "next/server"

export async function POST() {
  try {
    const nocodbUrl = process.env.NOCODB_URL
    const nocodbToken = process.env.NOCODB_TOKEN
    const tableId = process.env.NOCODB_TABLE_USERS
    const baseId = process.env.NOCODB_BASE_ID || process.env.NOCODB_PROJECT_ID

    if (!nocodbUrl || !nocodbToken || !tableId) {
      return NextResponse.json(
        { error: "NocoDB not configured" },
        { status: 500 }
      )
    }

    if (!baseId) {
      return NextResponse.json(
        { error: "NOCODB_BASE_ID or NOCODB_PROJECT_ID not configured" },
        { status: 500 }
      )
    }

    let baseUrl = nocodbUrl.replace(/\/$/, "")
    if (baseUrl.endsWith("/api/v2")) {
      baseUrl = baseUrl.replace("/api/v2", "")
    }

    // Сначала проверяем текущую структуру
    const columnsUrl = `${baseUrl}/api/v2/meta/bases/${baseId}/tables/${tableId}/columns`
    const columnsResponse = await fetch(columnsUrl, {
      headers: {
        "xc-token": nocodbToken,
        "Content-Type": "application/json",
      },
    })

    let columnsData = null
    if (columnsResponse.ok) {
      columnsData = await columnsResponse.json()
    } else {
      const errorText = await columnsResponse.text()
      return NextResponse.json(
        {
          error: "Failed to fetch columns",
          status: columnsResponse.status,
          details: errorText,
        },
        { status: columnsResponse.status }
      )
    }

    // Проверяем, есть ли уже колонка с ID
    const existingIdColumn = (columnsData?.list || []).find((col: any) => 
      col.uidt === 'ID' || col.pk === true
    )

    if (existingIdColumn) {
      return NextResponse.json({
        success: true,
        message: "Колонка ID уже существует",
        column: {
          id: existingIdColumn.id,
          column_name: existingIdColumn.column_name,
          title: existingIdColumn.title,
          uidt: existingIdColumn.uidt,
          pk: existingIdColumn.pk,
        }
      })
    }

    // Создаем колонку ID как первичный ключ через правильный endpoint
    const createColumnUrl = `${baseUrl}/api/v2/meta/bases/${baseId}/tables/${tableId}/columns`
    const newColumn = {
      column_name: "Id",
      title: "Id",
      uidt: "ID", // NocoDB ID type
      dt: "int4",
      pk: true,
      ai: true, // auto increment
      rqd: true, // required
      meta: {},
    }

    console.log("Создание колонки ID:", newColumn)
    console.log("URL:", createColumnUrl)

    const createResponse = await fetch(createColumnUrl, {
      method: "POST",
      headers: {
        "xc-token": nocodbToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newColumn),
    })

    if (!createResponse.ok) {
      const errorText = await createResponse.text()
      return NextResponse.json(
        {
          error: "Failed to create ID column",
          status: createResponse.status,
          details: errorText,
          url: createColumnUrl,
        },
        { status: createResponse.status }
      )
    }

    const createdColumn = await createResponse.json()

    return NextResponse.json({
      success: true,
      message: "Колонка ID успешно создана",
      column: createdColumn,
    })
  } catch (error) {
    console.error("Error fixing users table:", error)
    return NextResponse.json(
      {
        error: "Failed to fix users table",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
