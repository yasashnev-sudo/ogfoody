import { NextResponse } from 'next/server'
import { yookassaClient } from '@/lib/yookassa/client'
import { updateOrder, fetchOrderById } from '@/lib/nocodb'
import { awardLoyaltyPoints, fetchUserById, refundLoyaltyPoints } from '@/lib/nocodb'
import { isValidYookassaIp, getClientIp } from '@/lib/yookassa/ip-validator'

/**
 * GET /api/payments/yookassa/webhook
 * Диагностический endpoint для проверки конфигурации
 */
export async function GET() {
  const isTestMode = process.env.YOOKASSA_TEST_MODE === 'true' || 
                     process.env.YOOKASSA_SECRET_KEY?.startsWith('test_')
  
  return NextResponse.json({
    status: 'webhook_endpoint_active',
    message: 'This is the YooKassa webhook endpoint',
    configuration: {
      shopId: process.env.YOOKASSA_SHOP_ID || 'not configured',
      testMode: isTestMode,
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ogfoody.ru'}/api/payments/yookassa/webhook`,
    },
    instructions: {
      setup: 'Configure this URL in YooKassa dashboard: Integration → HTTP Notifications',
      events: ['payment.succeeded', 'payment.canceled', 'payment.waiting_for_capture'],
      test: 'Make a test payment to verify webhook is working',
    },
    checkLogs: 'Run: pm2 logs ogfoody --lines 100 | grep -i webhook',
  })
}

export async function POST(request: Request) {
  // ✅ КРИТИЧНО: ЮKassa требует HTTP 200 в ответе, даже при ошибках
  // Поэтому всегда возвращаем 200, но логируем ошибки

  try {
    // Логируем все заголовки для отладки
    const headers: Record<string, string> = {}
    request.headers.forEach((value, key) => {
      headers[key] = value
    })
    
    // Проверка IP-адреса для безопасности
    const clientIp = getClientIp(request)
    const isTestMode = process.env.YOOKASSA_TEST_MODE === 'true' || 
                       process.env.YOOKASSA_SECRET_KEY?.startsWith('test_')
    
    console.log('🔍 Webhook request details:', {
      clientIp,
      headers: {
        'x-forwarded-for': headers['x-forwarded-for'],
        'x-real-ip': headers['x-real-ip'],
        'cf-connecting-ip': headers['cf-connecting-ip'],
        'user-agent': headers['user-agent'],
      },
      isTestMode,
    })
    
    // В тестовом режиме проверка IP менее строгая (может быть прокси/CDN)
    if (!isTestMode && !isValidYookassaIp(clientIp)) {
      console.error('❌ Invalid IP address for webhook:', clientIp)
      console.error('   All headers:', headers)
      // Возвращаем 200, но не обрабатываем запрос
      return NextResponse.json({ received: false, error: 'Invalid IP' }, { status: 200 })
    } else if (isTestMode && !isValidYookassaIp(clientIp)) {
      // В тестовом режиме логируем, но не блокируем
      console.warn('⚠️ Test mode: IP validation failed, but allowing request:', clientIp)
      console.warn('   This is OK in test mode, but check webhook configuration in YooKassa dashboard')
    }

    const event = await request.json()
    
    // В ЮKassa тип события в поле 'event', а не 'type'
    // 'type' всегда 'notification'
    const eventType = event.event || event.type
    const { object } = event
    
    console.log('📥 YooKassa webhook received:', {
      type: event.type,
      event: event.event,
      eventType, // Вычисленный тип события
      paymentId: object?.id,
      ip: clientIp,
      hasObject: !!object,
      objectKeys: object ? Object.keys(object) : [],
      fullEvent: JSON.stringify(event).substring(0, 1000), // Первые 1000 символов для отладки
    })

    if (!object?.id) {
      console.error('❌ Invalid webhook: missing payment id')
      console.error('   Full event:', JSON.stringify(event))
      return NextResponse.json({ received: false, error: 'Invalid webhook' }, { status: 200 })
    }

    // Для refund.succeeded object содержит refund, а не payment
    // Нужно получить orderId из payment_id через metadata платежа
    let actualOrderId: string | null = null

    console.log('🔍 Processing webhook event:', {
      eventType,
      hasObject: !!object,
      objectId: object?.id,
      objectMetadata: object?.metadata,
    })

    if (eventType === 'refund.succeeded') {
      // Для возврата получаем orderId из payment_id
      if (object.payment_id) {
        try {
          const paymentResponse = await yookassaClient.payments.paymentsPaymentIdGet(object.payment_id)
          actualOrderId = paymentResponse.data.metadata?.orderId
        } catch (error) {
          console.error('❌ Failed to fetch payment for refund:', error)
        }
      }
    } else {
      // Для других событий orderId в metadata объекта
      actualOrderId = object.metadata?.orderId
    }

    if (!actualOrderId) {
      console.error('❌ Webhook missing orderId in metadata')
      console.error('   Event type:', eventType)
      console.error('   Object metadata:', object?.metadata)
      console.error('   Full object keys:', object ? Object.keys(object) : [])
      console.error('   Full event structure:', JSON.stringify(event).substring(0, 2000))
      return NextResponse.json({ received: false, error: 'Missing orderId' }, { status: 200 })
    }
    
    console.log('✅ Found orderId:', actualOrderId)

    // Получаем заказ из БД (БЕЗ кэша для свежих данных)
    const order = await fetchOrderById(Number(actualOrderId), true)
    if (!order) {
      console.error(`❌ Order ${actualOrderId} not found`)
      return NextResponse.json({ received: false, error: 'Order not found' }, { status: 200 })
    }
    
    console.log(`🔍 [Webhook] Заказ ${actualOrderId} из БД:`, {
      total: order.total || order.Total,
      subtotal: order.subtotal || order.Subtotal,
      deliveryFee: order.delivery_fee || order['Delivery Fee'],
      promoDiscount: order.promo_discount || order['Promo Discount'],
      loyaltyPointsEarned: order.loyalty_points_earned || order['Loyalty Points Earned'],
      paymentMethod: order.payment_method || order['Payment Method'],
      paid: order.paid || order.Paid,
    })

    if (eventType === 'payment.succeeded') {
      console.log(`✅ Payment succeeded for order ${actualOrderId}`)

      // Обновляем статус заказа
      await updateOrder(Number(actualOrderId), {
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
            // ✅ ИСПРАВЛЕНО: Получаем все необходимые данные из заказа
            const orderTotal = typeof order.total === 'number' 
              ? order.total 
              : parseFloat(String(order.total)) || 0

            const loyaltyPointsUsed = typeof order.loyalty_points_used === 'number'
              ? order.loyalty_points_used
              : parseFloat(String(order.loyalty_points_used)) || 0

            // ✅ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Для расчета баллов используем Subtotal + Delivery Fee БЕЗ промокода
            // Согласно LOYALTY_POINTS_LOGIC.md: баллы начисляются на сумму БЕЗ промокода
            // ✅ АДАПТАЦИЯ ПОД YOOKASSA: Используем ту же логику, что и в POST /api/orders
            let subtotal = typeof order.subtotal === 'number'
              ? order.subtotal
              : typeof (order as any).Subtotal === 'number'
              ? (order as any).Subtotal
              : parseFloat(String(order.subtotal || (order as any).Subtotal || 0)) || 0
            
            const deliveryFee = typeof order.delivery_fee === 'number'
              ? order.delivery_fee
              : typeof (order as any)['Delivery Fee'] === 'number'
              ? (order as any)['Delivery Fee']
              : parseFloat(String(order.delivery_fee || (order as any)['Delivery Fee'] || 0)) || 0
            
            // ✅ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Если subtotal = 0, но total > 0, используем total как fallback
            // Это может произойти, если subtotal не был сохранен при создании заказа
            // Это адаптация под YooKassa - раньше при создании заказа с card/sbp баллы начислялись сразу,
            // но теперь с YooKassa заказ создается без paymentMethod, и баллы начисляются через webhook
            if (subtotal === 0 && orderTotal > 0) {
              console.warn(`⚠️ [Webhook] subtotal = 0, но orderTotal = ${orderTotal}. Используем orderTotal как fallback для расчета баллов.`)
              subtotal = orderTotal
            }
            
            // ✅ Сумма БЕЗ промокода для расчета баллов (как в POST /api/orders)
            const orderTotalForPoints = subtotal + deliveryFee
            
            console.log(`🔍 [Webhook] Расчет orderTotalForPoints:`, {
              subtotal,
              deliveryFee,
              orderTotalForPoints,
              orderTotal,
              promoDiscount: order.promo_discount || order['Promo Discount'] || 0,
            })

            // Начисляем баллы только если заказ оплачен онлайн и баллы еще не начислены
            const pointsEarned = typeof order.loyalty_points_earned === 'number'
              ? order.loyalty_points_earned
              : parseFloat(String(order.loyalty_points_earned)) || 0

            console.log(`🔍 [Webhook] Данные для начисления баллов:`, {
              orderId: actualOrderId,
              orderTotal, // С промокодом (для total_spent)
              orderTotalForPoints, // БЕЗ промокода (для расчета баллов)
              subtotal,
              deliveryFee,
              loyaltyPointsUsed,
              pointsEarned,
              userId,
            })

            if (pointsEarned === 0 && orderTotalForPoints > 0) {
              console.log(`💎 Awarding loyalty points for order ${actualOrderId}`)
              // ✅ ИСПРАВЛЕНО: Передаем orderTotal (с промокодом) для total_spent
              // и orderTotalForPoints (БЕЗ промокода) для расчета баллов и описания транзакции
              await awardLoyaltyPoints(
                Number(userId),
                orderTotal, // С промокодом (для обновления total_spent)
                loyaltyPointsUsed,
                0, // actualPointsEarned будет рассчитан внутри на основе orderTotalForPoints
                Number(actualOrderId),
                orderTotalForPoints // БЕЗ промокода (для расчета баллов и описания транзакции)
              )
            } else if (pointsEarned > 0) {
              console.log(`ℹ️ Баллы уже начислены для заказа ${actualOrderId}: ${pointsEarned} баллов`)
            } else if (orderTotalForPoints <= 0) {
              console.warn(`⚠️ Нельзя начислить баллы: orderTotalForPoints = ${orderTotalForPoints} (subtotal=${subtotal}, deliveryFee=${deliveryFee})`)
            }
          }
        } catch (error) {
          console.error('❌ Failed to award loyalty points:', error)
          // Не прерываем процесс, заказ уже обновлен
        }
      }

      return NextResponse.json({ received: true, status: 'processed' })
    }

    if (eventType === 'payment.canceled') {
      console.log(`❌ Payment canceled for order ${actualOrderId}`)

      await updateOrder(Number(actualOrderId), {
        payment_status: 'canceled',
        payment_id: object.id,
      })

      return NextResponse.json({ received: true, status: 'canceled' })
    }

    if (eventType === 'payment.waiting_for_capture') {
      console.log(`⏳ Payment waiting for capture for order ${actualOrderId}`)
      // Можно обновить статус на "ожидает подтверждения"
      await updateOrder(Number(actualOrderId), {
        payment_status: 'waiting_for_capture',
        payment_id: object.id,
      })
      return NextResponse.json({ received: true, status: 'waiting' })
    }

    if (eventType === 'refund.succeeded') {
      console.log(`💰 Refund succeeded for order ${actualOrderId}`)

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

            const pointsEarned = typeof order.loyalty_points_earned === 'number'
              ? order.loyalty_points_earned
              : parseFloat(String(order.loyalty_points_earned)) || 0

            // Возвращаем баллы при возврате платежа
            if (pointsEarned > 0 || loyaltyPointsUsed > 0) {
              console.log(`💎 Refunding loyalty points for order ${actualOrderId}`)
              await refundLoyaltyPoints(
                Number(userId),
                pointsEarned,
                loyaltyPointsUsed,
                orderTotal,
                Number(actualOrderId)
              )
            }
          }
        } catch (error) {
          console.error('❌ Failed to refund loyalty points:', error)
        }
      }

      // Обновляем статус заказа
      await updateOrder(Number(actualOrderId), {
        payment_status: 'refunded',
        paid: false, // Возврат означает, что заказ больше не оплачен
      })

      return NextResponse.json({ received: true, status: 'refunded' })
    }

    // Другие типы событий просто подтверждаем
    console.log(`ℹ️ Unhandled webhook event type: ${eventType} (type: ${event.type})`)
    console.log('   Available event types in code: payment.succeeded, payment.canceled, payment.waiting_for_capture, refund.succeeded')
    console.log('   Full event structure:', JSON.stringify(event).substring(0, 2000))
    return NextResponse.json({ received: true, status: 'acknowledged' })
  } catch (error: any) {
    console.error('❌ Webhook processing failed:', error)
    // ✅ КРИТИЧНО: Всегда возвращаем 200, даже при ошибках
    // ЮKassa будет повторять отправку, если не получит 200
    return NextResponse.json(
      { received: false, error: 'Webhook processing failed', details: error.message },
      { status: 200 }
    )
  }
}
