// Проверка конфигурации
import { NextResponse } from "next/server"

export async function GET() {
  const config = {
    hasNocoDBUrl: !!process.env.NOCODB_URL,
    hasNocoDBToken: !!process.env.NOCODB_TOKEN,
    hasBaseId: !!process.env.NOCODB_BASE_ID,
    tables: {
      Users: process.env.NOCODB_TABLE_USERS || "NOT_SET",
      Orders: process.env.NOCODB_TABLE_ORDERS || "NOT_SET",
      Loyalty_Points_Transactions: process.env.NOCODB_TABLE_LOYALTY_POINTS_TRANSACTIONS || "NOT_SET",
      Fraud_Alerts: process.env.NOCODB_TABLE_FRAUD_ALERTS || "NOT_SET",
    },
    allTablesConfigured: !!(
      process.env.NOCODB_TABLE_USERS &&
      process.env.NOCODB_TABLE_ORDERS &&
      process.env.NOCODB_TABLE_LOYALTY_POINTS_TRANSACTIONS &&
      process.env.NOCODB_TABLE_FRAUD_ALERTS
    ),
  }

  return NextResponse.json(config)
}




