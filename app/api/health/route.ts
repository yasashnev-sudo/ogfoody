import { NextResponse } from 'next/server'

// Health check endpoint для мониторинга
export async function GET() {
  try {
    // Проверяем основные переменные окружения
    const isConfigured = !!(
      process.env.NOCODB_URL &&
      process.env.NOCODB_TOKEN &&
      process.env.NOCODB_TABLE_MEALS
    )

    // Проверяем доступность NocoDB (быстрая проверка без реального запроса)
    const nocodbUrl = process.env.NOCODB_URL

    return NextResponse.json(
      {
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        configured: isConfigured,
        nocodb: {
          url: nocodbUrl,
          configured: !!nocodbUrl,
        },
        uptime: process.uptime(),
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
