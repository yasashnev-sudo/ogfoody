import { NextResponse } from 'next/server'
import { yookassaClient, isTestMode } from '@/lib/yookassa/client'
import { updateOrder } from '@/lib/nocodb'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { orderId, amount, description, returnUrl, useWidget = true } = body

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: 'orderId and amount are required' },
        { status: 400 }
      )
    }

    // ✅ ИЗМЕНЕНО: Выбираем тип подтверждения в зависимости от useWidget
    // useWidget = false для ВК/ТГ (используем redirect/умный платеж)
    const confirmationType = useWidget ? 'embedded' : 'redirect'

    console.log('📦 Creating YooKassa payment:', {
      orderId,
      amount,
      confirmationType,
      useWidget,
      returnUrl: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://ogfoody.ru'}/payment/success?orderId=${orderId}`,
    })

    // Создаем платеж через ЮKassa
    const idempotenceKey = `order_${orderId}_${Date.now()}`
    const paymentResponse = await yookassaClient.payments.paymentsPost(
      idempotenceKey,
      {
        amount: {
          value: amount.toFixed(2),
          currency: 'RUB',
        },
        confirmation: {
          type: confirmationType,
          return_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://ogfoody.ru'}/payment/success?orderId=${orderId}`,
        },
        description: description || `Заказ #${orderId}`,
        metadata: {
          orderId: String(orderId),
        },
        capture: true, // Автоматическое подтверждение платежа
      }
    )
    
    // paymentsPost возвращает AxiosResponse, нужно извлечь data
    const payment = paymentResponse.data

    // ✅ ИСПРАВЛЕНО: Правильная обработка типов confirmation (embedded/external)
    const confirmationUrl = (payment.confirmation as any)?.confirmation_url
    const confirmationToken = (payment.confirmation as any)?.confirmation_token

    // ✅ УЛУЧШЕНО: Подробное логирование для отладки
    console.log('✅ YooKassa payment created:', {
      paymentId: payment.id,
      orderId,
      amount,
      confirmationType,
      confirmationUrl,
      confirmationToken,
      hasToken: !!confirmationToken,
      hasUrl: !!confirmationUrl,
      testMode: isTestMode,
      test: payment.test,
      metadata: payment.metadata,
      // ✅ ДОБАВЛЕНО: Полный объект confirmation для отладки
      confirmation: payment.confirmation,
    })

    // ✅ ДОБАВЛЕНО: Предупреждение если токен отсутствует при embedded
    if (confirmationType === 'embedded' && !confirmationToken) {
      console.warn('⚠️ WARNING: confirmation_token отсутствует для embedded платежа!', {
        paymentId: payment.id,
        confirmation: payment.confirmation,
        fullPayment: JSON.stringify(payment, null, 2),
      })
    }

    if (isTestMode) {
      console.log('🧪 TEST MODE: Payment created with test credentials')
      console.log('   Use test cards from: YOOKASSA_TEST_CARDS.md')
      console.log('   ⚠️ IMPORTANT: Configure webhook URL in YooKassa dashboard!')
      console.log('   Webhook URL: https://ogfoody.ru/api/payments/yookassa/webhook')
      console.log('   See: YOOKASSA_WEBHOOK_SETUP.md for instructions')
    }

    // Сохраняем payment_id в заказ
    if (orderId) {
      try {
        await updateOrder(Number(orderId), {
          payment_id: payment.id,
          payment_status: 'pending', // Будет обновлен через webhook
        })
      } catch (error) {
        console.error('❌ Failed to update order with payment_id:', error)
        // Не прерываем процесс, платеж уже создан
      }
    }

    return NextResponse.json({
      paymentId: payment.id,
      confirmationUrl, // Для redirect/умного платежа
      confirmationToken, // Для виджета
      status: payment.status,
      confirmationType, // ✅ НОВОЕ: Для отладки
    })
  } catch (error: any) {
    console.error('❌ YooKassa payment creation failed:', error)
    return NextResponse.json(
      { 
        error: 'Payment creation failed',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}
