import { NextResponse } from 'next/server'

/**
 * GET /api/payments/yookassa/webhook/test
 * Тестовый endpoint для проверки доступности webhook URL
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Webhook endpoint is accessible',
    timestamp: new Date().toISOString(),
    url: '/api/payments/yookassa/webhook',
    instructions: {
      step1: 'Configure this URL in YooKassa dashboard',
      step2: 'URL should be: https://ogfoody.ru/api/payments/yookassa/webhook',
      step3: 'Subscribe to events: payment.succeeded, payment.canceled',
      step4: 'After payment, check logs: pm2 logs ogfoody | grep webhook',
    },
  })
}

/**
 * POST /api/payments/yookassa/webhook/test
 * Тестовый endpoint для симуляции webhook запроса
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    return NextResponse.json({
      status: 'test_webhook_received',
      message: 'This is a test webhook endpoint',
      receivedData: body,
      timestamp: new Date().toISOString(),
      note: 'Real webhook should go to /api/payments/yookassa/webhook',
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Invalid JSON in test webhook',
    }, { status: 400 })
  }
}
