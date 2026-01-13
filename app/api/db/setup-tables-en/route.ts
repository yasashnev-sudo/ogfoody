// API route для обновления заголовков колонок на английские в существующих таблицах
// Использует английские заголовки из setup-tables

import { NextResponse } from "next/server"

// Маппинг русских заголовков на английские (из setup-tables)
const englishTitles: Record<string, Record<string, string>> = {
  Meals: {
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
  },
  Extras: {
    "Название": "Name",
    "Категория": "Category",
    "Ингредиенты": "Ingredients",
    "Описание": "Description",
    "Цена": "Price",
    "Изображение (ссылка)": "Image (URL)",
    "Калории": "Calories",
    "Белки": "Protein",
    "Жиры": "Fats",
    "Углеводы": "Carbs",
    "Вес": "Weight",
    "Текущая неделя": "Current Week",
    "Следующая неделя": "Next Week",
  },
  Delivery_Zones: {
    "Город": "City",
    "Район": "District",
    "Стоимость доставки": "Delivery Fee",
    "Минимальная сумма заказа": "Min Order Amount",
    "Доступно": "Available",
    "Доступные интервалы": "Available Intervals",
  },
  Users: {
    "Телефон": "Phone",
    "Хеш пароля": "Password Hash",
    "Имя": "Name",
    "Дополнительный телефон": "Additional Phone",
    "Улица": "Street",
    "Дом": "Building",
    "Корпус/Секция": "Building Section",
    "Квартира": "Apartment",
    "Подъезд": "Entrance",
    "Этаж": "Floor",
    "Домофон": "Intercom",
    "Район": "District",
    "Комментарий к доставке": "Delivery Comment",
    "Баллы лояльности": "Loyalty Points",
    "Всего потрачено": "Total Spent",
    "Дата регистрации": "Created At",
    "Дата обновления": "Updated At",
  },
  Orders: {
    "ID пользователя": "User ID",
    "Номер заказа": "Order Number",
    "Дата начала": "Start Date",
    "Время доставки": "Delivery Time",
    "Статус оплаты": "Payment Status",
    "Способ оплаты": "Payment Method",
    "Оплачено": "Paid",
    "Дата и время оплаты": "Paid At",
    "ID платежа (для онлайн оплат)": "Payment ID",
    "Статус заказа": "Order Status",
    "Промокод": "Promo Code",
    "Скидка по промокоду": "Promo Discount",
    "Использовано баллов": "Loyalty Points Used",
    "Заработано баллов": "Loyalty Points Earned",
    "Подытог": "Subtotal",
    "Итого": "Total",
    "Телефон гостя": "Guest Phone",
    "Адрес гостя": "Guest Address",
    "Дата и время создания заказа": "Created At",
    "Дата и время обновления": "Updated At",
  },
  Order_Persons: {
    "ID заказа": "Order ID",
    "Номер персоны": "Person Number",
  },
  Order_Meals: {
    "ID персоны заказа": "Order Person ID",
    "День": "Day",
    "Время приема пищи": "Meal Time",
    "Тип блюда": "Meal Type",
    "ID блюда": "Meal ID",
    "Размер порции": "Portion Size",
    "Цена": "Price",
    "ID гарнира": "Garnish ID",
    "Размер порции гарнира": "Garnish Portion Size",
    "Цена гарнира": "Garnish Price",
  },
  Order_Extras: {
    "ID заказа": "Order ID",
    "ID дополнения": "Extra ID",
    "Количество": "Quantity",
    "Цена": "Price",
  },
  Promo_Codes: {
    "Код": "Code",
    "Тип скидки": "Discount Type",
    "Значение скидки": "Discount Value",
    "Минимальная сумма заказа": "Min Order Amount",
    "Максимальная скидка": "Max Discount",
    "Действителен с": "Valid From",
    "Действителен до": "Valid Until",
    "Лимит использований": "Usage Limit",
    "Использовано раз": "Times Used",
    "Активен": "Active",
  },
  Reviews: {
    "ID заказа": "Order ID",
    "ID пользователя": "User ID",
    "Оценка": "Rating",
    "Текст отзыва": "Review Text",
  },
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

  // Маппинг названий таблиц на их ID из переменных окружения
  const tableIdMap: Record<string, string> = {
    Meals: process.env.NOCODB_TABLE_MEALS || "",
    Extras: process.env.NOCODB_TABLE_EXTRAS || "",
    Delivery_Zones: process.env.NOCODB_TABLE_DELIVERY_ZONES || "",
    Users: process.env.NOCODB_TABLE_USERS || "",
    Orders: process.env.NOCODB_TABLE_ORDERS || "",
    Order_Persons: process.env.NOCODB_TABLE_ORDER_PERSONS || "",
    Order_Meals: process.env.NOCODB_TABLE_ORDER_MEALS || "",
    Order_Extras: process.env.NOCODB_TABLE_ORDER_EXTRAS || "",
    Promo_Codes: process.env.NOCODB_TABLE_PROMO_CODES || "",
    Reviews: process.env.NOCODB_TABLE_REVIEWS || "",
  }

  try {
    // Обновляем каждую таблицу
    for (const [tableName, tableId] of Object.entries(tableIdMap)) {
      if (!tableId) {
        results[tableName] = {
          success: false,
          error: `Table ID not configured for ${tableName}`,
        }
        continue
      }

      const titleMap = englishTitles[tableName]
      if (!titleMap) {
        results[tableName] = {
          success: false,
          error: `No title map for ${tableName}`,
        }
        continue
      }

      console.log(`\n🔄 Обработка таблицы: ${tableName} (${tableId})`)

      // Получаем колонки таблицы
      const columnsUrl = `${baseUrl}/api/v2/meta/bases/${NOCODB_BASE_ID}/tables/${tableId}/columns`
      const columnsResponse = await fetch(columnsUrl, {
        headers: {
          "xc-token": NOCODB_TOKEN,
          "Content-Type": "application/json",
        },
      })

      if (!columnsResponse.ok) {
        results[tableName] = {
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
        if (titleMap[columnTitle]) {
          const newTitle = titleMap[columnTitle]
          console.log(`  📝 Обновление колонки "${columnTitle}" → "${newTitle}"`)

          const updateResult = await updateColumnTitle(
            baseUrl,
            NOCODB_TOKEN,
            NOCODB_BASE_ID,
            tableId,
            columnId,
            newTitle,
          )
          columnUpdates[columnName] = {
            old: columnTitle,
            new: newTitle,
            success: updateResult.success,
            error: updateResult.error,
          }
        }
      }

      results[tableName] = {
        success: true,
        tableId,
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
      tablesProcessed: Object.keys(tableIdMap).length,
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






