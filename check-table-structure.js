// Скрипт для проверки реальной структуры таблицы Users
const checkTableStructure = async () => {
  console.log("🔍 Проверка реальной структуры таблицы Users...\n")

  try {
    const nocodbUrl = process.env.NOCODB_URL || "http://localhost:8080"
    const nocodbToken = process.env.NOCODB_TOKEN
    const tableId = process.env.NOCODB_TABLE_USERS

    if (!nocodbUrl || !nocodbToken || !tableId) {
      console.error("❌ Переменные окружения не настроены")
      console.log("NOCODB_URL:", nocodbUrl)
      console.log("NOCODB_TOKEN:", nocodbToken ? "установлен" : "не установлен")
      console.log("NOCODB_TABLE_USERS:", tableId)
      return
    }

    let baseUrl = nocodbUrl.replace(/\/$/, "")
    if (!baseUrl.endsWith("/api/v2")) {
      baseUrl = `${baseUrl}/api/v2`
    }

    // Получаем структуру таблицы (колонки)
    console.log("📋 Получение структуры таблицы (колонок)...")
    const columnsUrl = `${baseUrl}/tables/${tableId}/columns`
    console.log("URL:", columnsUrl)
    
    const columnsResponse = await fetch(columnsUrl, {
      headers: {
        "xc-token": nocodbToken,
        "Content-Type": "application/json",
      },
    })

    if (columnsResponse.ok) {
      const columnsData = await columnsResponse.json()
      console.log("\n✅ Колонки таблицы:")
      console.log(JSON.stringify(columnsData, null, 2))
      
      // Ищем поле ID
      const idColumn = (columnsData.list || []).find((col) => 
        (col.column_name && col.column_name.toLowerCase() === 'id') || 
        (col.title && col.title.toLowerCase() === 'id') ||
        col.uidt === 'ID'
      )
      
      if (idColumn) {
        console.log("\n✅ Найдено поле ID:")
        console.log("  column_name:", idColumn.column_name)
        console.log("  title:", idColumn.title)
        console.log("  uidt:", idColumn.uidt)
        console.log("  pk:", idColumn.pk)
      } else {
        console.log("\n❌ Поле ID не найдено в колонках!")
        console.log("Доступные колонки:")
        (columnsData.list || []).forEach((col) => {
          console.log(`  - ${col.column_name} (${col.title}) [${col.uidt}] ${col.pk ? '(PK)' : ''}`)
        })
      }
    } else {
      const errorText = await columnsResponse.text()
      console.error("❌ Ошибка при получении колонок:", columnsResponse.status, errorText)
    }

    // Получаем несколько записей для проверки структуры
    console.log("\n📊 Получение записей из таблицы...")
    const recordsUrl = `${baseUrl}/tables/${tableId}/records?limit=2`
    const recordsResponse = await fetch(recordsUrl, {
      headers: {
        "xc-token": nocodbToken,
        "Content-Type": "application/json",
      },
    })

    if (recordsResponse.ok) {
      const recordsData = await recordsResponse.json()
      console.log("\n✅ Получены записи:")
      if (recordsData.list && recordsData.list.length > 0) {
        const firstRecord = recordsData.list[0]
        console.log("\nСтруктура первой записи:")
        console.log("Ключи:", Object.keys(firstRecord))
        console.log("\nВсе поля:")
        Object.keys(firstRecord).forEach(key => {
          console.log(`  ${key}: ${JSON.stringify(firstRecord[key])} (тип: ${typeof firstRecord[key]})`)
        })
      }
    } else {
      const errorText = await recordsResponse.text()
      console.error("❌ Ошибка при получении записей:", recordsResponse.status, errorText)
    }

  } catch (error) {
    console.error("❌ Критическая ошибка:", error)
  }
}

checkTableStructure()

