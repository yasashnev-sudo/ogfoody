// Простой endpoint для проверки переменных окружения
import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: {
      NOCODB_URL: process.env.NOCODB_URL || "не установлен",
      NOCODB_TOKEN: process.env.NOCODB_TOKEN ? "установлен (скрыт)" : "не установлен",
      NOCODB_TABLE_USERS: process.env.NOCODB_TABLE_USERS || "не установлен",
      NOCODB_TABLE_LOYALTY_POINTS_TRANSACTIONS: process.env.NOCODB_TABLE_LOYALTY_POINTS_TRANSACTIONS || "не установлен",
      allEnvKeys: Object.keys(process.env).filter(k => k.startsWith('NOCODB')),
    },
  })
}




