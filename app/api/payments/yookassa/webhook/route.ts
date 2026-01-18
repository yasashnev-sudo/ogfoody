import { NextResponse } from 'next/server'
import { yookassaClient } from '@/lib/yookassa/client'
import { updateOrder, fetchOrderById } from '@/lib/nocodb'
import { awardLoyaltyPoints, fetchUserById } from '@/lib/nocodb'

export async function POST(request: Request) {
  try {
    const event = await request.json()
    console.log('📥 YooKassa webhook received:', {
      type: event.type,
      paymentId: event.object?.id,
    })

    const { type, object } = event

    if (!object?.id) {
      console.error('❌ Invalid webhook: missing payment id')
      return NextResponse.json({ error: 'Invalid webhook' }, { status: 400 })
    }

    const orderId = object.metadata?.orderId
    if (!orderId) {
      console.error('❌ Webhook missing orderId in metadata')
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })
    }

    // Получаем заказ из БД
    const order = await fetchOrderById(Number(orderId))
    if (!order) {
      console.error(`❌ Order ${orderId} not found`)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (type === 'payment.succeeded') {
      console.log(`✅ Payment succeeded for order ${orderId}`)

      // Обновляем статус заказа
      await updateOrder(Number(orderId), {
        paid: true,
        payment_status: 'paid',
        paid_at: new Date().toISOString(),
        payment_id: object.id,
        payment_method: object.payment_method?.type || 'online',
      })

      // Начисляем баллы лояльности (если еще не начислены)
      const userId = order.user_id || (order as any)['User ID']
      if (userId) {
        try {
          const user = await fetchUserById(Number(userId))
          if (user) {
            const orderTotal = typeof order.total === 'number' 
              ? order.total 
              : parseFloat(String(order.total)) || 0

            const loyaltyPointsUsed = typeof order.loyalty_points_used === 'number'
              ? order.loyalty_points_used
              : parseFloat(String(order.loyalty_points_used)) || 0

            // Начисляем баллы только если заказ оплачен онлайн и баллы еще не начислены
            const pointsEarned = typeof order.loyalty_points_earned === 'number'
              ? order.loyalty_points_earned
              : parseFloat(String(order.loyalty_points_earned)) || 0

            if (pointsEarned === 0 && orderTotal > 0) {
              console.log(`💎 Awarding loyalty points for order ${orderId}`)
              await awardLoyaltyPoints(
                Number(userId),
                orderTotal,
                loyaltyPointsUsed,
                0, // actualPointsEarned будет рассчитан внутри
                Number(orderId)
              )
            }
          }
        } catch (error) {
          console.error('❌ Failed to award loyalty points:', error)
          // Не прерываем процесс, заказ уже обновлен
        }
      }

      return NextResponse.json({ received: true, status: 'processed' })
    }

    if (type === 'payment.canceled') {
      console.log(`❌ Payment canceled for order ${orderId}`)

      await updateOrder(Number(orderId), {
        payment_status: 'canceled',
        payment_id: object.id,
      })

      return NextResponse.json({ received: true, status: 'canceled' })
    }

    if (type === 'payment.waiting_for_capture') {
      console.log(`⏳ Payment waiting for capture for order ${orderId}`)
      // Можно обновить статус на "ожидает подтверждения"
      return NextResponse.json({ received: true, status: 'waiting' })
    }

    // Другие типы событий просто подтверждаем
    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('❌ Webhook processing failed:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error.message },
      { status: 500 }
    )
  }
}
