import { NextResponse } from 'next/server'
import { yookassaClient } from '@/lib/yookassa/client'
import { updateOrder } from '@/lib/nocodb'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { orderId, amount, description, returnUrl } = body

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: 'orderId and amount are required' },
        { status: 400 }
      )
    }

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
          type: 'redirect',
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

    console.log('✅ YooKassa payment created:', {
      paymentId: payment.id,
      orderId,
      amount,
      confirmationUrl: payment.confirmation?.confirmation_url,
    })

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
      confirmationUrl: payment.confirmation?.confirmation_url,
      status: payment.status,
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
