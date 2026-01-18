import { NextResponse } from 'next/server'
import { yookassaClient } from '@/lib/yookassa/client'
import { updateOrder, fetchOrderById } from '@/lib/nocodb'

// GET /api/payments/yookassa/status/[id] - проверка статуса платежа по payment_id
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paymentId } = await params

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      )
    }

    // Получаем статус платежа из ЮKassa
    const paymentResponse = await yookassaClient.payments.paymentsPaymentIdGet(paymentId)
    const payment = paymentResponse.data

    console.log('✅ YooKassa payment status:', {
      paymentId,
      status: payment.status,
      paid: payment.status === 'succeeded',
    })

    // Если платеж успешен, обновляем заказ
    if (payment.status === 'succeeded') {
      const orderId = payment.metadata?.orderId
      if (orderId) {
        const order = await fetchOrderById(Number(orderId))
        if (order && (!order.paid || order.payment_status !== 'paid')) {
          console.log(`🔄 Updating order ${orderId} status from payment check`)
          await updateOrder(Number(orderId), {
            paid: true,
            payment_status: 'paid',
            paid_at: payment.captured_at || new Date().toISOString(),
            payment_id: paymentId,
            payment_method: payment.payment_method?.type || 'online',
          })
        }
      }
    }

    return NextResponse.json({
      paymentId: payment.id,
      status: payment.status,
      paid: payment.status === 'succeeded',
      amount: payment.amount,
      metadata: payment.metadata,
    })
  } catch (error: any) {
    console.error('❌ YooKassa payment status check failed:', error)
    return NextResponse.json(
      {
        error: 'Payment status check failed',
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    )
  }
}
