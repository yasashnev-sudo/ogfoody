// API route для исправления русских заголовков таблиц и колонок на английские
// Обновляет title таблиц и колонок в NocoDB

import { NextResponse } from "next/server"

// Маппинг русских заголовков колонок на английские
const columnTitleMap: Record<string, string> = {
  // Meals
  "Название": "Name",
  "Категория": "Category",
  "Ингредиенты": "Ingredients",
  "Описание": "Description",
  "Цена (стандарт)": "Price (Single)",
  "Цена (средний)": "Price (Medium)",
  "Цена (большой)": "Price (Large)",
  "Вес (стандарт)": "Weight (Single)",
  "Вес (средний)": "Weight (Medium)",
  "Вес (большой)": "Weight (Large)",
  "Изображение (ссылка)": "Image (URL)",
  "Нужен гарнир": "Needs Garnish",
  "Калории": "Calories",
  "Белки": "Protein",
  "Жиры": "Fats",
  "Углеводы": "Carbs",
  "Текущая неделя": "Current Week",
  "Следующая неделя": "Next Week",
  
  // Extras
  "Цена": "Price",
  "Вес": "Weight",
  
  // Delivery_Zones
  "Город": "City",
  "Район": "District",
  "Стоимость доставки": "Delivery Fee",
  "Минимальная сумма заказа": "Min Order Amount",
  "Доступно": "Available",
  "Доступные интервалы": "Available Intervals",
  
  // Users
  "Телефон": "Phone",
  "Хеш пароля": "Password Hash",
  "Имя": "Name",
  "Дополнительный телефон": "Additional Phone",
  "Улица": "Street",
  "Дом": "Building",
  "Подъезд": "Building Section",
  "Квартира": "Apartment",
  "Вход": "Entrance",
  "Этаж": "Floor",
  "Домофон": "Intercom",
  "Район": "District",
  "Комментарий к доставке": "Delivery Comment",
  "Баллы лояльности": "Loyalty Points",
  "Всего потрачено": "Total Spent",
  "Создано": "Created At",
  "Обновлено": "Updated At",
  
  // Orders
  "Номер заказа": "Order Number",
  "Дата начала": "Start Date",
  "Время доставки": "Delivery Time",
  "Статус оплаты": "Payment Status",
  "Способ оплаты": "Payment Method",
  "Оплачено": "Paid",
  "Оплачено в": "Paid At",
  "ID платежа": "Payment ID",
  "Статус заказа": "Order Status",
  "Промокод": "Promo Code",
  "Скидка по промокоду": "Promo Discount",
  "Использовано баллов": "Loyalty Points Used",
  "Заработано баллов": "Loyalty Points Earned",
  "Промежуточная сумма": "Subtotal",
  "Итого": "Total",
  "Телефон гостя": "Guest Phone",
  "Адрес гостя": "Guest Address",
  
  // Order_Persons
  "ID заказа": "Order ID",
  "Имя персоны": "Person Name",
  "Тип питания": "Meal Type",
  "Комментарий": "Comment",
  
  // Order_Meals
  "ID персоны заказа": "Order Person ID",
  "ID блюда": "Meal ID",
  "Название блюда": "Meal Name",
  "Размер порции": "Portion Size",
  "Количество": "Quantity",
  "Цена за единицу": "Unit Price",
  "Итого": "Total",
  
  // Order_Extras
  "ID дополнения": "Extra ID",
  "Название дополнения": "Extra Name",
  
  // Promo_Codes
  "Код": "Code",
  "Тип скидки": "Discount Type",
  "Значение скидки": "Discount Value",
  "Максимальная скидка": "Max Discount",
  "Действителен с": "Valid From",
  "Действителен до": "Valid Until",
  "Лимит использований": "Usage Limit",
  "Использовано раз": "Times Used",
  "Активен": "Active",
  
  // Reviews
  "ID пользователя": "User ID",
  "Оценка": "Rating",
  "Текст отзыва": "Review Text",
}

async function updateTableTitle(
  baseUrl: string,
  token: string,
  tableId: string,
  newTitle: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateUrl = `${baseUrl}/api/v2/meta/tables/${tableId}`
    const response = await fetch(updateUrl, {
      method: "PATCH",
      headers: {
        "xc-token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newTitle,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: `Failed to update table title: ${response.status} - ${errorText}`,
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

async function updateColumnTitle(
  baseUrl: string,
  token: string,
  baseId: string,
  tableId: string,
  columnId: string,
  newTitle: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Пробуем оба варианта API endpoint
    let updateUrl = `${baseUrl}/api/v2/meta/bases/${baseId}/tables/${tableId}/columns/${columnId}`
    let response = await fetch(updateUrl, {
      method: "PATCH",
      headers: {
        "xc-token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newTitle,
      }),
    })

    if (!response.ok) {
      // Пробуем альтернативный endpoint
      updateUrl = `${baseUrl}/api/v2/meta/tables/${tableId}/columns/${columnId}`
      response = await fetch(updateUrl, {
        method: "PATCH",
        headers: {
          "xc-token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTitle,
        }),
      })
    }

    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: `Failed to update column title: ${response.status} - ${errorText}`,
      }
    }

    return { success: true }
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

  try {
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

    console.log(`📋 Найдено таблиц: ${tables.length}`)

    // Обновляем каждую таблицу
    for (const table of tables) {
      const tableId = table.id
      const tableTitle = table.title
      const tableName = table.table_name

      console.log(`\n🔄 Обработка таблицы: ${tableTitle} (${tableName})`)

      // Таблицы уже имеют английские названия, пропускаем обновление title таблиц
      // Но обновим колонки

      // Получаем колонки таблицы
      const columnsUrl = `${baseUrl}/api/v2/meta/bases/${NOCODB_BASE_ID}/tables/${tableId}/columns`
      const columnsResponse = await fetch(columnsUrl, {
        headers: {
          "xc-token": NOCODB_TOKEN,
          "Content-Type": "application/json",
        },
      })

      if (!columnsResponse.ok) {
        results[tableTitle] = {
          success: false,
          error: `Failed to fetch columns: ${columnsResponse.status}`,
        }
        continue
      }

      const columnsData = await columnsResponse.json()
      const columns = columnsData?.list || []

      const columnUpdates: Record<string, any> = {}

      // Обновляем заголовки колонок
      for (const column of columns) {
        const columnTitle = column.title
        const columnId = column.id
        const columnName = column.column_name

        // Пропускаем системные колонки
        if (columnName === "Id" || columnName === "id") {
          continue
        }

        // Если заголовок на русском, обновляем на английский
        if (columnTitleMap[columnTitle]) {
          const newTitle = columnTitleMap[columnTitle]
          console.log(`  📝 Обновление колонки "${columnTitle}" → "${newTitle}"`)

          const updateResult = await updateColumnTitle(baseUrl, NOCODB_TOKEN, NOCODB_BASE_ID, tableId, columnId, newTitle)
          columnUpdates[columnName] = {
            old: columnTitle,
            new: newTitle,
            success: updateResult.success,
            error: updateResult.error,
          }
        }
      }

      results[tableTitle] = {
        success: true,
        tableId,
        tableName,
        columnsUpdated: Object.keys(columnUpdates).length,
        columnUpdates,
      }
    }

    const totalUpdated = Object.values(results).reduce(
      (sum, r: any) => sum + (r.columnsUpdated || 0),
      0,
    )

    return NextResponse.json({
      success: true,
      message: `Обновлено заголовков колонок: ${totalUpdated}`,
      tablesProcessed: tables.length,
      results,
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

