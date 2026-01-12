// API route для обновления структуры таблицы Meals
// Удаляет колонку available и изменяет тип image с Attachment на URL

import { NextResponse } from "next/server"

export async function POST() {
  const NOCODB_URL = process.env.NOCODB_URL
  const NOCODB_TOKEN = process.env.NOCODB_TOKEN
  const NOCODB_BASE_ID = process.env.NOCODB_PROJECT_ID || process.env.NOCODB_BASE_ID
  const TABLE_ID = process.env.NOCODB_TABLE_MEALS

  if (!NOCODB_URL || !NOCODB_TOKEN) {
    return NextResponse.json(
      {
        error: "NocoDB not configured",
        message: "NOCODB_URL и NOCODB_TOKEN должны быть установлены",
      },
      { status: 500 },
    )
  }

  if (!NOCODB_BASE_ID || !TABLE_ID) {
    return NextResponse.json(
      {
        error: "Table not configured",
        message: "NOCODB_TABLE_MEALS должен быть установлен",
      },
      { status: 500 },
    )
  }

  const baseUrl = NOCODB_URL.replace(/\/api\/v2\/?$/, "")
  const results: Record<string, any> = {}

  try {
    // Получаем текущие колонки таблицы через bases endpoint
    const columnsUrl = `${baseUrl}/api/v2/meta/bases/${NOCODB_BASE_ID}/tables/${TABLE_ID}/columns`
    const columnsResponse = await fetch(columnsUrl, {
      headers: {
        "xc-token": NOCODB_TOKEN,
        "Content-Type": "application/json",
      },
    })

    if (!columnsResponse.ok) {
      return NextResponse.json(
        {
          error: "Failed to fetch columns",
          status: columnsResponse.status,
          message: await columnsResponse.text().catch(() => "Unknown error"),
        },
        { status: 500 },
      )
    }

    const columnsData = await columnsResponse.json()
    const columns = columnsData?.list || []

    // Ищем колонку available для удаления
    const availableColumn = columns.find((col: any) => col.column_name === "available")
    if (availableColumn) {
      console.log(`🗑️ Найдена колонка available (${availableColumn.id}), удаляем...`)
      const deleteUrl = `${baseUrl}/api/v2/meta/bases/${NOCODB_BASE_ID}/tables/${TABLE_ID}/columns/${availableColumn.id}`
      const deleteResponse = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          "xc-token": NOCODB_TOKEN,
          "Content-Type": "application/json",
        },
      })

      results.deleteAvailable = {
        success: deleteResponse.ok,
        status: deleteResponse.status,
        error: deleteResponse.ok ? null : await deleteResponse.text().catch(() => "Unknown error"),
      }

      if (deleteResponse.ok) {
        console.log("✅ Колонка available удалена")
      } else {
        console.error(`❌ Ошибка при удалении available: ${deleteResponse.status}`)
      }
    } else {
      results.deleteAvailable = {
        success: true,
        message: "Колонка available не найдена (уже удалена или не существовала)",
      }
    }

    // Ищем колонку image для изменения типа
    const imageColumn = columns.find((col: any) => col.column_name === "image")
    if (imageColumn) {
      console.log(`🔄 Найдена колонка image (${imageColumn.id}), изменяем тип на URL...`)
      
      // Пробуем обновить через bases endpoint
      const updateUrl1 = `${baseUrl}/api/v2/meta/bases/${NOCODB_BASE_ID}/tables/${TABLE_ID}/columns/${imageColumn.id}`
      const updateResponse1 = await fetch(updateUrl1, {
        method: "PATCH",
        headers: {
          "xc-token": NOCODB_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uidt: "URL",
          title: "Изображение (URL)",
        }),
      })

      if (!updateResponse1.ok) {
        // Пробуем через прямой endpoint (без bases)
        const updateUrl2 = `${baseUrl}/api/v2/meta/tables/${TABLE_ID}/columns/${imageColumn.id}`
        const updateResponse2 = await fetch(updateUrl2, {
          method: "PATCH",
          headers: {
            "xc-token": NOCODB_TOKEN,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uidt: "URL",
            title: "Изображение (URL)",
          }),
        })

        results.updateImage = {
          success: updateResponse2.ok,
          status: updateResponse2.status,
          error: updateResponse2.ok ? null : await updateResponse2.text().catch(() => "Unknown error"),
        }

        if (updateResponse2.ok) {
          console.log("✅ Тип колонки image изменен на URL")
        } else {
          console.error(`❌ Ошибка при изменении типа image: ${updateResponse2.status}`)
        }
      } else {
        results.updateImage = {
          success: true,
          message: "Тип колонки image изменен на URL",
        }
        console.log("✅ Тип колонки image изменен на URL")
      }
    } else {
      results.updateImage = {
        success: false,
        error: "Колонка image не найдена",
      }
    }

    return NextResponse.json({
      success: true,
      message: "Обновление структуры таблицы Meals завершено",
      results,
      note: "Если изменения не применились автоматически, выполните их вручную через интерфейс NocoDB",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

