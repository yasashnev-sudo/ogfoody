// API endpoint для получения логов запросов

import { NextResponse } from "next/server"
import { getRecentLogs } from "@/lib/request-logger"

export async function GET() {
  try {
    const logs = getRecentLogs(30)
    
    return NextResponse.json({
      success: true,
      logs,
      count: logs.length,
      message: "Последние запросы к API",
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







