import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

/**
 * GET /api/payments/yookassa/webhook/check
 * Проверка конфигурации webhook и последних запросов
 */
export async function GET() {
  try {
    const isTestMode = process.env.YOOKASSA_TEST_MODE === 'true' || 
                       process.env.YOOKASSA_SECRET_KEY?.startsWith('test_')
    
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://ogfoody.ru'}/api/payments/yookassa/webhook`
    
    return NextResponse.json({
      status: 'ok',
      webhook: {
        url: webhookUrl,
        testUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ogfoody.ru'}/api/payments/yookassa/webhook/test`,
        isConfigured: 'Check in YooKassa dashboard',
      },
      configuration: {
        shopId: process.env.YOOKASSA_SHOP_ID ? `${process.env.YOOKASSA_SHOP_ID.substring(0, 4)}...` : 'not set',
        testMode: isTestMode,
        secretKeyPrefix: process.env.YOOKASSA_SECRET_KEY?.substring(0, 10) || 'not set',
      },
      instructions: {
        step1: 'Go to https://yookassa.ru/my',
        step2: `Select test shop (ID: ${process.env.YOOKASSA_SHOP_ID || 'N/A'})`,
        step3: 'Go to Integration → HTTP Notifications',
        step4: `Set URL: ${webhookUrl}`,
        step5: 'Subscribe to: payment.succeeded, payment.canceled',
        step6: 'Save and test',
      },
      howToCheck: {
        method1: 'Check logs: ssh to server and run: pm2 logs ogfoody --lines 100 | grep webhook',
        method2: 'Make a test payment and check order status',
        method3: 'Check this endpoint after webhook should arrive',
      },
      troubleshooting: {
        ifNoWebhook: [
          'Verify URL is set in YooKassa dashboard',
          'Check that URL uses HTTPS',
          'Check server logs for incoming requests',
          'Verify IP whitelist (in test mode, IP check is relaxed)',
        ],
        testEndpoint: `${webhookUrl}/test`,
      },
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
    }, { status: 500 })
  }
}
