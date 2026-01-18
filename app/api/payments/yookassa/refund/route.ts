import { NextResponse } from 'next/server'
import { yookassaClient, isTestMode } from '@/lib/yookassa/client'
import { updateOrder, fetchOrderById } from '@/lib/nocodb'

/**
 * POST /api/payments/yookassa/refund
 * Создание возврата средств через YooKassa API
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { orderId, paymentId, amount, reason } = body

    if (!orderId || !paymentId) {
      return NextResponse.json(
        { error: 'orderId and paymentId are required' },
        { status: 400 }
      )
    }

    // Получаем заказ для проверки
    const order = await fetchOrderById(Number(orderId))
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Проверяем статус платежа в YooKassa
    let payment
    try {
      const paymentResponse = await yookassaClient.payments.paymentsPaymentIdGet(paymentId)
      payment = paymentResponse.data
    } catch (error: any) {
      console.error('❌ Failed to fetch payment status:', error)
      return NextResponse.json(
        { 
          error: 'Failed to fetch payment status',
          details: error.message || 'Unknown error'
        },
        { status: 500 }
      )
    }

    console.log('🔍 Payment status check:', {
      paymentId,
      status: payment.status,
      orderId,
    })

    // Если платеж в статусе waiting_for_capture - отменяем его
    if (payment.status === 'waiting_for_capture') {
      try {
        const cancelResponse = await yookassaClient.payments.paymentsPaymentIdCancel(paymentId)
        const cancelledPayment = cancelResponse.data

        console.log('✅ Payment cancelled (was waiting_for_capture):', {
          paymentId,
          status: cancelledPayment.status,
        })

        // Обновляем статус заказа
        await updateOrder(Number(orderId), {
          payment_status: 'canceled',
        })

        return NextResponse.json({
          success: true,
          action: 'cancelled',
          paymentId: cancelledPayment.id,
          status: cancelledPayment.status,
          message: 'Payment was cancelled (not captured yet)',
        })
      } catch (error: any) {
        console.error('❌ Failed to cancel payment:', error)
        return NextResponse.json(
          { 
            error: 'Failed to cancel payment',
            details: error.message || 'Unknown error'
          },
          { status: 500 }
        )
      }
    }

    // Если платеж не в статусе succeeded - возврат невозможен
    if (payment.status !== 'succeeded') {
      return NextResponse.json(
        { 
          error: `Cannot refund payment with status: ${payment.status}. Only 'succeeded' payments can be refunded.`,
          paymentStatus: payment.status
        },
        { status: 400 }
      )
    }

    // Определяем сумму возврата
    const refundAmount = amount || order.total
    const orderTotal = typeof order.total === 'number' 
      ? order.total 
      : parseFloat(String(order.total)) || 0

    // Проверяем, что сумма возврата не превышает сумму платежа
    const paymentAmount = parseFloat(payment.amount.value)
    if (refundAmount > paymentAmount) {
      return NextResponse.json(
        { 
          error: `Refund amount (${refundAmount}) exceeds payment amount (${paymentAmount})`,
          paymentAmount,
          refundAmount
        },
        { status: 400 }
      )
    }

    // Создаем возврат через YooKassa API
    const idempotenceKey = `refund_order_${orderId}_${Date.now()}`
    
    try {
      // Используем метод refunds из SDK
      const refundResponse = await yookassaClient.refunds.refundsPost(
        idempotenceKey,
        {
          payment_id: paymentId,
          amount: {
            value: refundAmount.toFixed(2),
            currency: 'RUB',
          },
          description: reason || `Возврат средств по заказу #${orderId}`,
        }
      )

      const refund = refundResponse.data

      console.log('✅ YooKassa refund created:', {
        refundId: refund.id,
        paymentId,
        orderId,
        amount: refundAmount,
        status: refund.status,
        testMode: isTestMode,
      })

      if (isTestMode) {
        console.log('🧪 TEST MODE: Refund created with test credentials')
      }

      // Обновляем статус заказа
      await updateOrder(Number(orderId), {
        payment_status: refund.status === 'succeeded' ? 'refunded' : 'refund_pending',
        // Сохраняем refund_id для отслеживания
        // Примечание: если в схеме БД нет поля refund_id, можно добавить в metadata или комментарии
      })

      return NextResponse.json({
        success: true,
        refundId: refund.id,
        paymentId,
        orderId,
        amount: refundAmount,
        status: refund.status,
        message: refund.status === 'succeeded' 
          ? 'Refund completed successfully' 
          : 'Refund is being processed',
      })
    } catch (error: any) {
      console.error('❌ YooKassa refund creation failed:', error)
      
      // Обрабатываем специфичные ошибки YooKassa
      let errorMessage = 'Refund creation failed'
      let errorDetails = error.message || 'Unknown error'

      if (error.response?.data) {
        errorDetails = JSON.stringify(error.response.data)
        if (error.response.data.description) {
          errorMessage = error.response.data.description
        }
      }

      return NextResponse.json(
        { 
          error: errorMessage,
          details: errorDetails
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('❌ Refund endpoint error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}
