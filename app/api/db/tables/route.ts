// API route для получения списка таблиц из NocoDB
// Поможет найти правильные Table ID

export async function GET() {
  const NOCODB_URL = process.env.NOCODB_URL
  const NOCODB_TOKEN = process.env.NOCODB_TOKEN
  const NOCODB_BASE_ID = process.env.NOCODB_PROJECT_ID || process.env.NOCODB_BASE_ID

  const currentTableIds = {
    NOCODB_TABLE_MEALS: process.env.NOCODB_TABLE_MEALS || "не задан",
    NOCODB_TABLE_EXTRAS: process.env.NOCODB_TABLE_EXTRAS || "не задан",
    NOCODB_TABLE_DELIVERY_ZONES: process.env.NOCODB_TABLE_DELIVERY_ZONES || "не задан",
    NOCODB_TABLE_USERS: process.env.NOCODB_TABLE_USERS || "не задан",
    NOCODB_TABLE_ORDERS: process.env.NOCODB_TABLE_ORDERS || "не задан",
    NOCODB_TABLE_ORDER_PERSONS: process.env.NOCODB_TABLE_ORDER_PERSONS || "не задан",
    NOCODB_TABLE_ORDER_MEALS: process.env.NOCODB_TABLE_ORDER_MEALS || "не задан",
    NOCODB_TABLE_ORDER_EXTRAS: process.env.NOCODB_TABLE_ORDER_EXTRAS || "не задан",
    NOCODB_TABLE_PROMO_CODES: process.env.NOCODB_TABLE_PROMO_CODES || "не задан",
    NOCODB_TABLE_REVIEWS: process.env.NOCODB_TABLE_REVIEWS || "не задан",
  }

  if (!NOCODB_URL || !NOCODB_TOKEN) {
    return Response.json(
      {
        error: "NocoDB not configured",
        configured: {
          NOCODB_URL: !!NOCODB_URL,
          NOCODB_TOKEN: !!NOCODB_TOKEN,
          NOCODB_BASE_ID: NOCODB_BASE_ID || "не задан",
        },
        currentTableIds,
        hint: "Добавьте NOCODB_URL и NOCODB_TOKEN в переменные окружения (раздел Vars слева)",
      },
      { status: 500 },
    )
  }

  try {
    const baseUrl = NOCODB_URL.replace(/\/api\/v2\/?$/, "")

    // Если есть BASE_ID, получим таблицы для этой базы
    if (!NOCODB_BASE_ID) {
      return Response.json({
        error: "NOCODB_BASE_ID не задан",
        configured: {
          NOCODB_URL: NOCODB_URL,
          NOCODB_TOKEN: "***" + NOCODB_TOKEN.slice(-4),
          NOCODB_BASE_ID: "не задан",
        },
        currentTableIds,
        hint: "Добавьте NOCODB_PROJECT_ID или NOCODB_BASE_ID в переменные окружения. Вы указали: p9id5v4q0ukk9iz",
      })
    }

    // Получаем таблицы для базы
    const tablesUrl = `${baseUrl}/api/v2/meta/bases/${NOCODB_BASE_ID}/tables`

    const tablesResponse = await fetch(tablesUrl, {
      headers: {
        "xc-token": NOCODB_TOKEN,
        "Content-Type": "application/json",
      },
    })

    if (!tablesResponse.ok) {
      const errorText = await tablesResponse.text()
      return Response.json({
        error: "Could not fetch tables",
        status: tablesResponse.status,
        message: errorText,
        baseId: NOCODB_BASE_ID,
        tablesUrl,
        currentTableIds,
      })
    }

    const tablesData = await tablesResponse.json()

    // Форматируем для удобства
    const tables =
      tablesData?.list?.map((t: { id: string; title: string; table_name: string }) => ({
        id: t.id,
        title: t.title,
        table_name: t.table_name,
        envVarName: `NOCODB_TABLE_${t.title.toUpperCase().replace(/\s+/g, "_")}`,
      })) || []

    return Response.json({
      success: true,
      baseId: NOCODB_BASE_ID,
      tables,
      currentTableIds,
      instructions: `
Добавьте следующие переменные в раздел Vars:
${tables.map((t: { envVarName: string; id: string; title: string }) => `${t.envVarName}=${t.id}  # для таблицы "${t.title}"`).join("\n")}
      `.trim(),
    })
  } catch (error) {
    console.error("[v0] Error fetching tables:", error)
    return Response.json(
      {
        error: "Failed to fetch tables",
        message: error instanceof Error ? error.message : "Unknown error",
        currentTableIds,
      },
      { status: 500 },
    )
  }
}
