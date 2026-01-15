import { NextRequest, NextResponse } from "next/server"

// API для создания таблиц Messages и Push_Notifications в NocoDB
// Вызывается один раз для настройки админ-панели

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
}

export async function POST(request: NextRequest) {
  try {
    // Проверяем пароль администратора
    const body = await request.json()
    const { password } = body

    const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123"
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: noCacheHeaders }
      )
    }

    // Инструкции по созданию таблиц в NocoDB
    // Таблицы нужно создать вручную в NocoDB, так как API создания таблиц требует специальных прав
    
    const instructions = {
      Messages: {
        tableName: "Messages",
        columns: [
          { name: "User ID", type: "Link to Users", required: false },
          { name: "User Phone", type: "Text", required: false },
          { name: "User Name", type: "Text", required: false },
          { name: "Message", type: "Long Text", required: true },
          { name: "Is Admin", type: "Checkbox", required: true, default: false },
          { name: "Is Read", type: "Checkbox", required: true, default: false },
          { name: "Created At", type: "DateTime", required: true },
        ],
        instructions: "Создайте таблицу Messages в NocoDB с указанными колонками"
      },
      Push_Notifications: {
        tableName: "Push_Notifications",
        columns: [
          { name: "Title", type: "Text", required: true },
          { name: "Message", type: "Long Text", required: true },
          { name: "Target Type", type: "Single Select", required: true, options: ["all", "user_id", "user_phone"] },
          { name: "Target Value", type: "Text", required: false },
          { name: "Status", type: "Single Select", required: true, options: ["pending", "sent", "scheduled", "failed"] },
          { name: "Scheduled At", type: "DateTime", required: false },
          { name: "Sent At", type: "DateTime", required: false },
          { name: "Created At", type: "DateTime", required: true },
        ],
        instructions: "Создайте таблицу Push_Notifications в NocoDB с указанными колонками"
      }
    }

    return NextResponse.json(
      { 
        success: true,
        message: "Инструкции по созданию таблиц",
        instructions,
        nextSteps: [
          "1. Откройте https://noco.povarnakolesah.ru",
          "2. Войдите в базу данных FooD",
          "3. Создайте таблицы Messages и Push_Notifications с указанными колонками",
          "4. Скопируйте Table ID из URL каждой таблицы",
          "5. Добавьте в .env.production:",
          "   NOCODB_TABLE_MESSAGES=md_xxxxx",
          "   NOCODB_TABLE_PUSH_NOTIFICATIONS=md_xxxxx",
          "6. Перезапустите приложение: pm2 restart ogfoody"
        ]
      },
      { headers: noCacheHeaders }
    )
  } catch (error: any) {
    console.error("Ошибка получения инструкций:", error)
    return NextResponse.json(
      { error: "Failed to get instructions", details: error.message },
      { status: 500, headers: noCacheHeaders }
    )
  }
}
