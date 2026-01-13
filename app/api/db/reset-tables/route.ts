// API route для удаления всех таблиц в NocoDB
// ВНИМАНИЕ: Это удалит все данные в таблицах!
// Используйте только для полной перестройки структуры базы данных

import { NextResponse } from "next/server"

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

  // Получаем список всех таблиц
  const tablesUrl = `${baseUrl}/api/v2/meta/bases/${NOCODB_BASE_ID}/tables`
  const tablesResponse = await fetch(tablesUrl, {
    headers: {
      "xc-token": NOCODB_TOKEN,
      "Content-Type": "application/json",
    },
  })

  if (!tablesResponse.ok) {
    return NextResponse.json(
      {
        error: "Failed to fetch tables",
        status: tablesResponse.status,
        message: await tablesResponse.text().catch(() => "Unknown error"),
      },
      { status: 500 },
    )
  }

  const tablesData = await tablesResponse.json()
  const tables = tablesData?.list || []

  console.log(`🗑️ Найдено таблиц для удаления: ${tables.length}`)

  // Удаляем все таблицы (кроме системных, если они есть)
  for (const table of tables) {
    const tableName = table.title || table.table_name
    console.log(`🗑️ Удаление таблицы: ${tableName} (${table.id})`)
    
    const deleteUrl = `${baseUrl}/api/v2/meta/tables/${table.id}`
    const deleteResponse = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        "xc-token": NOCODB_TOKEN,
        "Content-Type": "application/json",
      },
    })

    const errorText = deleteResponse.ok ? null : await deleteResponse.text().catch(() => "Unknown error")

    results[tableName] = {
      deleted: deleteResponse.ok,
      status: deleteResponse.status,
      error: errorText,
    }

    if (deleteResponse.ok) {
      console.log(`✅ Таблица ${tableName} удалена`)
    } else {
      console.error(`❌ Ошибка при удалении ${tableName}: ${deleteResponse.status} - ${errorText}`)
    }
  }

  const deletedCount = Object.values(results).filter((r) => r.deleted).length
  const errorCount = Object.values(results).filter((r) => !r.deleted).length

  return NextResponse.json({
    success: errorCount === 0,
    message: `Удалено ${deletedCount} таблиц из ${tables.length}`,
    deletedCount,
    errorCount,
    totalTables: tables.length,
    results,
    nextStep: "Теперь запустите POST /api/db/setup-tables для создания новых таблиц с правильной структурой",
  })
}






