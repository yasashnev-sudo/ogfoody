import { NextResponse } from "next/server"
import {
  updateOrder,
  fetchOrderPersons,
  fetchOrderMeals,
  fetchOrderExtras,
  deleteOrderPerson,
  deleteOrderMeal,
  deleteOrderExtra,
  createOrderPerson,
  createOrderMeal,
  createOrderExtra,
  fetchOrderById,
  generateOrderNumber,
  calculateEarnedPoints,
  calculateDeliveryFee,
  awardLoyaltyPoints,
  refundLoyaltyPoints,
  fetchUserById,
  getUserCancellationStats,
  createFraudAlert,
  processPendingTransactionsForOrder,
  fetchPendingTransactionsByOrder,
  updateLoyaltyTransaction,
} from "@/lib/nocodb"
import type { Order, Meal, PortionSize } from "@/lib/types"

// PATCH /api/orders/[id] - обновление заказа
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    console.log(`[PATCH /api/orders/${id}] Request received`)
    const { order } = body as { order?: Order }
    
    let pendingPointsEarned = 0 // Храним начисленные баллы для возврата в API response

    // Если передан полный объект заказа, обновляем все данные
    if (order) {
      console.log(`[PATCH /api/orders/${id}] Updating order with data:`, {
        hasPersons: !!order.persons,
        personsCount: order.persons?.length || 0,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        paid: order.paid,
      })
      
      // Получаем текущий заказ для сохранения order_number
      // ✅ ИСПРАВЛЕНО: Всегда загружаем свежие данные без кэша
      const currentOrder = await fetchOrderById(Number(id), true)
      
      if (!currentOrder) {
        console.error(`[PATCH /api/orders/${id}] Order not found`)
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
      }

      // Проверяем, можно ли редактировать заказ
      // Разрешаем обновление только статуса оплаты для заблокированных заказов
      const isPaymentOnlyUpdate = !order.persons && !order.extras && (
        order.paid !== undefined || 
        order.paidAt !== undefined || 
        order.paymentStatus !== undefined || 
        order.paymentMethod !== undefined
      )
      
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const orderDate = currentOrder.start_date 
        ? new Date(currentOrder.start_date)
        : null
      if (orderDate) {
        orderDate.setHours(0, 0, 0, 0)
      }
      
      const isPaid = currentOrder.paid === true || currentOrder.payment_status === "paid"
      const isPastDate = orderDate && orderDate < today
      const isToday = orderDate && orderDate.getTime() === today.getTime()
      
      // Блокируем изменение содержимого (блюд, персон) для заблокированных заказов
      // Но разрешаем обновление только статуса оплаты
      if (!isPaymentOnlyUpdate && (isPaid || isPastDate || isToday)) {
        const reason = isPaid 
          ? "Заказ оплачен" 
          : isToday 
          ? "Доставка сегодня" 
          : "Прошедшая дата"
        console.error(`[PATCH /api/orders/${id}] Order is locked: ${reason}`)
        return NextResponse.json({ 
          error: "Order cannot be edited",
          reason,
          details: isPaid 
            ? "Редактирование оплаченного заказа недоступно"
            : isToday
            ? "Редактирование заказа в день доставки недоступно"
            : "Редактирование заказа на прошедшую дату недоступно"
        }, { status: 403 })
      }
      
      // Проверяем изменения статуса оплаты и заказа для обработки баллов
      const wasPaid = currentOrder.paid === true || currentOrder.payment_status === "paid"
      const willBePaid = order.paid === true || order.paymentStatus === "paid"
      const wasCancelled = currentOrder.order_status === "cancelled"
      const willBeCancelled = order.orderStatus === "cancelled"
      
      // Обработка баллов при отмене заказа
      // УНИФИЦИРОВАННАЯ ЛОГИКА: одинаково для PATCH и DELETE
      if (!wasCancelled && willBeCancelled && currentOrder.user_id) {
        try {
          const pointsEarned = typeof currentOrder.loyalty_points_earned === 'number' 
            ? currentOrder.loyalty_points_earned 
            : parseInt(String(currentOrder.loyalty_points_earned)) || 0
          const pointsUsed = typeof currentOrder.loyalty_points_used === 'number'
            ? currentOrder.loyalty_points_used
            : parseInt(String(currentOrder.loyalty_points_used)) || 0
          const orderTotal = typeof currentOrder.total === 'number'
            ? currentOrder.total
            : parseFloat(String(currentOrder.total)) || 0
          const wasPaid = currentOrder.paid === true || currentOrder.payment_status === "paid"

          if (wasPaid) {
            // Оплаченный заказ - возвращаем баллы (отменяем начисление)
            if (pointsEarned > 0 || pointsUsed > 0) {
              await refundLoyaltyPoints(
                currentOrder.user_id,
                pointsEarned,
                pointsUsed,
                orderTotal,
                Number(id)
              )
              console.log(`✅ Оплаченный заказ ${id} отменен: возвращено ${pointsUsed} использованных баллов, списано ${pointsEarned} начисленных`)
            }
            
            // Проверка на мошенничество
            try {
              const stats = await getUserCancellationStats(currentOrder.user_id)
              console.log(`📊 Статистика отмен для пользователя ${currentOrder.user_id}:`, stats)
              
              if (stats.cancelledPaidOrders >= 3) {
                console.warn(`🚨 Обнаружено подозрительное поведение: пользователь ${currentOrder.user_id} отменил ${stats.cancelledPaidOrders} оплаченных заказов`)
                await createFraudAlert(currentOrder.user_id, stats)
                console.log(`✅ Fraud alert создан для пользователя ${currentOrder.user_id}`)
              }
            } catch (error) {
              console.error(`❌ Ошибка при проверке на мошенничество:`, error)
            }
          } else {
            // Неоплаченный заказ - отменяем pending транзакции
            const pendingTransactions = await fetchPendingTransactionsByOrder(Number(id))
            console.log(`🔍 Неоплаченный заказ ${id}. Найдено pending транзакций: ${pendingTransactions.length}`)
            
            if (pendingTransactions.length > 0) {
              const now = new Date().toISOString()
              for (const transaction of pendingTransactions) {
                await updateLoyaltyTransaction(transaction.Id, {
                  transaction_status: 'cancelled',
                  processed_at: now,
                })
              }
              console.log(`✅ Отменены ${pendingTransactions.length} pending транзакций для заказа ${id}`)
            } else {
              console.log(`ℹ️ Нет pending транзакций для неоплаченного заказа ${id}`)
            }
          }
        } catch (error) {
          console.error(`❌ Ошибка при обработке баллов при отмене заказа:`, error)
          // Не прерываем процесс обновления заказа
        }
      }

      // Обновляем основные поля заказа (сохраняем order_number если он был)
      const now = new Date().toISOString()
      let loyaltyPointsEarned = order.loyaltyPointsEarned !== undefined 
        ? order.loyaltyPointsEarned 
        : (typeof currentOrder.loyalty_points_earned === 'number' 
            ? currentOrder.loyalty_points_earned 
            : parseInt(String(currentOrder.loyalty_points_earned)) || 0)

      // ✅ ИСПРАВЛЕНО: СНАЧАЛА проверяем смену способа оплаты с наличных на онлайн
      // Это нужно делать ДО начисления новых баллов, чтобы избежать дубликатов
      const oldPaymentMethod = currentOrder.payment_method || (currentOrder as any)["Payment Method"]
      const isPaymentMethodChangedFromCash = oldPaymentMethod === 'cash' && 
        order?.paymentMethod && 
        (order.paymentMethod === 'card' || order.paymentMethod === 'sbp')
      
      // ✅ ИСПРАВЛЕНО 2026-01-11: Списание баллов при использовании в заказе
      // Это нужно делать НЕЗАВИСИМО от способа оплаты и статуса paid
      if (currentOrder.user_id && order.loyaltyPointsUsed && order.loyaltyPointsUsed > 0) {
        try {
          // Проверяем, не были ли баллы уже списаны
          const existingPointsUsed = typeof currentOrder.loyalty_points_used === 'number' 
            ? currentOrder.loyalty_points_used 
            : parseInt(String(currentOrder.loyalty_points_used)) || 0
          
          // Списываем только если это новое использование баллов (не было раньше)
          if (existingPointsUsed === 0 && order.loyaltyPointsUsed > 0) {
            console.log(`\n🔍 ========== СПИСАНИЕ БАЛЛОВ (PATCH) ==========`)
            console.log(`💳 Списываем ${order.loyaltyPointsUsed} баллов для заказа ${id}`)
            
            const now = new Date().toISOString()
            const { createLoyaltyPointsTransaction, updateUser, fetchUserById } = await import("@/lib/nocodb")
            
            // ✅ ЗАЩИТА: Проверяем достаточно ли баллов у пользователя
            const user = await fetchUserById(currentOrder.user_id, true)
            if (!user) {
              console.error(`❌ Пользователь ${currentOrder.user_id} не найден`)
              throw new Error(`User ${currentOrder.user_id} not found`)
            }
            
            const currentBalance = typeof user.loyalty_points === 'number' 
              ? user.loyalty_points 
              : parseFloat(String(user.loyalty_points)) || 0
            
            console.log(`🔍 Проверка баланса перед списанием:`, {
              userId: currentOrder.user_id,
              currentBalance,
              requestedToUse: order.loyaltyPointsUsed,
              sufficient: currentBalance >= order.loyaltyPointsUsed
            })
            
            if (currentBalance < order.loyaltyPointsUsed) {
              console.warn(`⚠️ ЗАЩИТА: Недостаточно баллов для списания!`, {
                available: currentBalance,
                requested: order.loyaltyPointsUsed,
                deficit: order.loyaltyPointsUsed - currentBalance
              })
              console.log(`ℹ️ Пропускаем списание - возможно баллы уже были списаны ранее`)
              console.log(`🔍 ========== КОНЕЦ СПИСАНИЯ БАЛЛОВ (пропущено) ==========\n`)
              // Не выбрасываем ошибку - просто пропускаем операцию
              // Это может быть повторный запрос или race condition
            } else {
              // Баллов достаточно - списываем
              
              // Создаем транзакцию на списание
              await createLoyaltyPointsTransaction({
              user_id: currentOrder.user_id,
              order_id: Number(id),
              transaction_type: "used",
              transaction_status: "completed",
              points: -order.loyaltyPointsUsed,
              description: `Использовано ${order.loyaltyPointsUsed} баллов для оплаты заказа`,
              created_at: now,
              updated_at: now,
              processed_at: now,
            })
            console.log(`✅ Транзакция "used" создана: -${order.loyaltyPointsUsed} баллов`)
            
            // Списываем баллы у пользователя
            const newBalance = currentBalance - order.loyaltyPointsUsed
            
            await updateUser(currentOrder.user_id, {
              loyalty_points: newBalance,
              updated_at: now,
            })
            
            console.log(`✅ Баллы списаны с пользователя ${currentOrder.user_id}:`, {
              oldBalance: currentBalance,
              used: order.loyaltyPointsUsed,
              newBalance,
            })
            
            console.log(`🔍 ========== КОНЕЦ СПИСАНИЯ БАЛЛОВ ==========\n`)
            }
          } else {
            console.log(`ℹ️ Баллы уже были списаны ранее (${existingPointsUsed}) или не изменились`)
          }
        } catch (error) {
          console.error(`❌ Ошибка при списании баллов:`, error)
          // Не прерываем процесс обновления заказа
        }
      }
      
      // Начисление баллов при оплате заказа
      if (!wasPaid && willBePaid && currentOrder.user_id) {
        console.log(`\n🔍 ========== НАЧАЛО ОТЛАДКИ НАЧИСЛЕНИЯ БАЛЛОВ (PATCH full order) ==========`)
        console.log(`🔍 [PATCH ${id}] 1️⃣ Входящий payload:`, {
          'order.loyaltyPointsUsed': order.loyaltyPointsUsed,
          'order.loyaltyPointsEarned': order.loyaltyPointsEarned,
          'order.paymentMethod': order.paymentMethod,
          'order.paid': order.paid,
          'order.paymentStatus': order.paymentStatus,
          'order.subtotal': order.subtotal,
          'order.total': order.total,
          userId: currentOrder.user_id,
        })
        
        console.log(`🔍 [PATCH ${id}] Текущее состояние заказа:`, {
          'currentOrder.total': currentOrder.total,
          'currentOrder.subtotal': currentOrder.subtotal,
          'currentOrder.delivery_fee': currentOrder.delivery_fee,
          'currentOrder.loyalty_points_earned': currentOrder.loyalty_points_earned,
          'currentOrder.loyalty_points_used': currentOrder.loyalty_points_used,
        })
        
        try {
          // ✅ ЗАЩИТА: Проверяем, не были ли баллы уже начислены
          const existingPointsEarned = typeof currentOrder.loyalty_points_earned === 'number' 
            ? currentOrder.loyalty_points_earned 
            : parseInt(String(currentOrder.loyalty_points_earned)) || 0
          
          console.log(`🔍 [PATCH ${id}] 2️⃣ Проверка существующих начисленных баллов:`, {
            existingPointsEarned,
            hasExistingPoints: existingPointsEarned > 0,
          })
          
          if (existingPointsEarned > 0) {
            console.warn(`⚠️ ЗАЩИТА ОТ ДВОЙНОГО НАЧИСЛЕНИЯ: Баллы уже начислены для заказа ${id}: ${existingPointsEarned}. Пропускаем начисление.`)
            loyaltyPointsEarned = existingPointsEarned
          } else if (isPaymentMethodChangedFromCash) {
            // ✅ ИСПРАВЛЕНО: Если заказ был за наличные и меняется на карту/СБП,
            // обрабатываем pending транзакции ниже, а если их нет - начислим баллы как при обычной оплате
            console.log(`🔍 [PATCH ${id}] 3️⃣ Смена способа оплаты с наличных:`, {
              oldPaymentMethod,
              newPaymentMethod: order.paymentMethod,
            })
            console.log(`💳 Заказ ${id}: способ оплаты изменен с наличных на ${order.paymentMethod}. Pending транзакции будут обработаны ниже.`)
            // ✅ ИСПРАВЛЕНО: Не устанавливаем loyaltyPointsEarned = 0, чтобы можно было начислить баллы ниже, если pending транзакций не было
            loyaltyPointsEarned = undefined // Пока не знаем, будут ли pending транзакции
          } else {
            console.log(`🔍 [PATCH ${id}] 4️⃣ Загрузка пользователя для расчета баллов`)
            const user = await fetchUserById(currentOrder.user_id)
            if (user) {
              console.log(`🔍 [PATCH ${id}] Пользователь найден:`, {
                userId: user.Id,
                loyaltyPoints: user.loyalty_points,
                totalSpent: user.total_spent,
              })
              
              const orderTotal = order.total || (typeof currentOrder.total === 'number' 
                ? currentOrder.total 
                : parseFloat(String(currentOrder.total)) || 0)
              const pointsUsed = order.loyaltyPointsUsed !== undefined 
                ? order.loyaltyPointsUsed 
                : (typeof currentOrder.loyalty_points_used === 'number'
                    ? currentOrder.loyalty_points_used
                    : parseInt(String(currentOrder.loyalty_points_used)) || 0)
              const currentTotalSpent = typeof user.total_spent === 'number' 
                ? user.total_spent 
                : parseFloat(String(user.total_spent)) || 0

              console.log(`🔍 [PATCH ${id}] 5️⃣ Подготовка данных для расчета:`, {
                orderTotal,
                pointsUsed,
                currentTotalSpent,
                loyaltyLevel: currentTotalSpent >= 50000 ? "gold" : currentTotalSpent >= 20000 ? "silver" : "bronze",
              })

              // Рассчитываем начисляемые баллы
              console.log(`🔍 [PATCH ${id}] 6️⃣ Вызов calculateEarnedPoints с параметрами:`, {
                orderTotal,
                pointsUsed,
                currentTotalSpent,
              })
              loyaltyPointsEarned = calculateEarnedPoints(orderTotal, pointsUsed, currentTotalSpent)
              
              console.log(`🔍 [PATCH ${id}] 7️⃣ Результат calculateEarnedPoints:`, {
                loyaltyPointsEarned,
              })
              
              // Начисляем баллы пользователю
              // ✅ ИСПРАВЛЕНО: передаем pointsUsed = 0, так как баллы уже списаны при создании/редактировании заказа
              console.log(`🔍 [PATCH ${id}] 8️⃣ Вызов awardLoyaltyPoints с параметрами:`, {
                userId: currentOrder.user_id,
                orderTotal,
                pointsUsed: 0, // баллы уже списаны, не списываем повторно
                loyaltyPointsEarned,
                orderId: id,
              })
              await awardLoyaltyPoints(currentOrder.user_id, orderTotal, 0, loyaltyPointsEarned, Number(id))
              
              console.log(`🔍 [PATCH ${id}] 9️⃣ Результат awardLoyaltyPoints: успешно`)
              console.log(`✅ Начислено ${loyaltyPointsEarned} баллов пользователю ${currentOrder.user_id} при оплате заказа ${id}`)
              
              // ✅ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Обновляем заказ с правильным значением loyalty_points_earned
              await updateOrder(Number(id), {
                loyalty_points_earned: loyaltyPointsEarned,
              })
              console.log(`✅ [PATCH full] Обновлен заказ ${id} с loyalty_points_earned: ${loyaltyPointsEarned}`)
            }
          }
          console.log(`🔍 ========== КОНЕЦ ОТЛАДКИ НАЧИСЛЕНИЯ БАЛЛОВ (PATCH full order) ==========\n`)
          
          // ✅ ИСПРАВЛЕНО 2026-01-15: Инкремент счетчика промокода при оплате заказа (full order)
          if (!wasPaid && willBePaid && currentOrder.promo_code) {
            try {
              const { fetchPromoCode, incrementPromoCodeUsage } = await import("@/lib/nocodb")
              const promo = await fetchPromoCode(currentOrder.promo_code)
              if (promo) {
                await incrementPromoCodeUsage(promo.Id)
                console.log(`✅ Счетчик промокода "${currentOrder.promo_code}" инкрементирован при оплате заказа (full order)`)
              }
            } catch (error) {
              console.error(`❌ Ошибка при инкременте промокода:`, error)
            }
          }
        } catch (error) {
          console.error(`❌ Ошибка при начислении баллов при оплате:`, error)
          // Не прерываем процесс обновления заказа
        }
      }

      // Получаем order_number из разных возможных источников
      const existingOrderNumber = (currentOrder as any)?.order_number ?? (currentOrder as any)?.["Order Number"]
      const finalOrderNumber = existingOrderNumber ?? order.orderNumber ?? generateOrderNumber()
      
      // Используем значения из currentOrder для полей, которые не переданы в order
      const existingStartDate = currentOrder.start_date || (currentOrder as any)["Start Date"]
      const existingDeliveryTime = currentOrder.delivery_time || (currentOrder as any)["Delivery Time"]
      const existingSubtotal = currentOrder.subtotal || (currentOrder as any)["Subtotal"] || 0
      const existingTotal = currentOrder.total || (currentOrder as any)["Total"] || 0
      
      const updatedOrder = await updateOrder(Number(id), {
        order_number: finalOrderNumber,
        start_date: order.startDate 
          ? (typeof order.startDate === "string" ? order.startDate : order.startDate.toISOString().split("T")[0])
          : existingStartDate,
        delivery_time: order.deliveryTime || existingDeliveryTime,
        
        // Новые статусы оплаты
        payment_status: order.paymentStatus || (order.paid ? "paid" : "pending"),
        payment_method: order.paymentMethod || "cash",
        paid: order.paid !== undefined ? order.paid : currentOrder.paid,
        paid_at: order.paidAt || (order.paid ? now : currentOrder.paid_at),
        payment_id: order.paymentId || undefined,
        
        // Новый статус заказа
        order_status: order.orderStatus || currentOrder.order_status || "pending",
        
        // УДАЛЕНО: delivered, cancelled, status - статусы доставки убраны
        
        promo_code: order.promoCode !== undefined ? order.promoCode : currentOrder.promo_code,
        promo_discount: order.promoDiscount !== undefined ? order.promoDiscount : currentOrder.promo_discount,
        loyalty_points_used: order.loyaltyPointsUsed !== undefined 
          ? order.loyaltyPointsUsed 
          : (typeof currentOrder.loyalty_points_used === 'number'
              ? currentOrder.loyalty_points_used
              : parseInt(String(currentOrder.loyalty_points_used)) || 0),
        loyalty_points_earned: loyaltyPointsEarned !== undefined ? loyaltyPointsEarned : (typeof currentOrder.loyalty_points_earned === 'number' ? currentOrder.loyalty_points_earned : parseInt(String(currentOrder.loyalty_points_earned)) || 0),
        subtotal: (order.subtotal !== undefined && order.subtotal !== null) ? order.subtotal : existingSubtotal,
        total: (order.total !== undefined && order.total !== null) ? order.total : existingTotal,
        guest_phone: order.guestPhone !== undefined ? order.guestPhone : currentOrder.guest_phone,
        guest_address: order.guestAddress !== undefined ? order.guestAddress : currentOrder.guest_address,
        updated_at: now,
      })

      // ✅ Обрабатываем pending транзакции, если способ оплаты изменился с наличных на онлайн
      if (isPaymentMethodChangedFromCash) {
        console.log(`💳 Заказ ${id} оплачен онлайн (было: ${oldPaymentMethod}, стало: ${order.paymentMethod}), обрабатываем pending баллы`)
        
        try {
          // Обрабатываем pending транзакции для этого заказа
          pendingPointsEarned = await processPendingTransactionsForOrder(Number(id), currentOrder.user_id)
          
          if (pendingPointsEarned > 0) {
            console.log(`✅ Pending транзакции обработаны, начислено ${pendingPointsEarned} баллов`)
            loyaltyPointsEarned = pendingPointsEarned // Используем баллы из pending транзакции
          } else {
            console.log(`ℹ️ Pending транзакции обработаны, баллов не было`)
            // ✅ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Если pending транзакций не было, но заказ оплачен онлайн,
            // нужно начислить баллы как при обычной оплате онлайн
            console.log(`💡 Pending транзакций не было, но заказ оплачен онлайн - начисляем баллы как при обычной оплате`)
            console.log(`🔍 [PATCH full ${id}] Проверка условий для начисления баллов:`, {
              'order.paid': order.paid,
              'order.paymentMethod': order.paymentMethod,
              'condition': order.paid && (order.paymentMethod === 'card' || order.paymentMethod === 'sbp'),
            })
            if (order.paid && (order.paymentMethod === 'card' || order.paymentMethod === 'sbp')) {
              try {
                const user = await fetchUserById(currentOrder.user_id, true)
                if (user) {
                  const orderTotal = order.total || (typeof currentOrder.total === 'number' 
                    ? currentOrder.total 
                    : parseFloat(String(currentOrder.total)) || 0)
                  // ✅ ИСПРАВЛЕНО: Учитываем промокод при расчете orderTotal
                  const promoDiscount = order.promoDiscount || 0
                  let orderTotalForPoints = orderTotal
                  if (promoDiscount > 0 && orderTotal > 0) {
                    const subtotal = order.subtotal || (typeof currentOrder.subtotal === 'number' ? currentOrder.subtotal : parseFloat(String(currentOrder.subtotal)) || 0)
                    const deliveryFee = order.deliveryFee || (typeof currentOrder.delivery_fee === 'number' ? currentOrder.delivery_fee : parseFloat(String(currentOrder.delivery_fee)) || 0)
                    const expectedTotal = subtotal + deliveryFee - promoDiscount
                    if (Math.abs(orderTotal - expectedTotal) > 0.01) {
                      console.log(`⚠️ [PATCH full] orderTotal не учитывает промокод, пересчитываем для начисления баллов: ${orderTotal} → ${expectedTotal}`)
                      orderTotalForPoints = expectedTotal
                    }
                  }
                  const pointsUsed = order.loyaltyPointsUsed || 0
                  const currentTotalSpent = typeof user.total_spent === 'number' ? user.total_spent : parseFloat(String(user.total_spent)) || 0
                  const calculatedPoints = calculateEarnedPoints(orderTotalForPoints, pointsUsed, currentTotalSpent)
                  console.log(`💰 [PATCH full] Рассчитано ${calculatedPoints} баллов для заказа ${id} (orderTotal: ${orderTotalForPoints}, promoDiscount: ${promoDiscount})`)
                  
                  // ✅ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Начисляем баллы пользователю
                  if (calculatedPoints > 0) {
                    console.log(`🔍 [PATCH full] Вызов awardLoyaltyPoints с параметрами:`, {
                      userId: currentOrder.user_id,
                      orderTotal: orderTotalForPoints,
                      pointsUsed: 0,
                      loyaltyPointsEarned: calculatedPoints,
                      orderId: id,
                    })
                    await awardLoyaltyPoints(currentOrder.user_id, orderTotalForPoints, 0, calculatedPoints, Number(id))
                    console.log(`✅ [PATCH full] Начислено ${calculatedPoints} баллов пользователю ${currentOrder.user_id} при оплате заказа ${id}`)
                    loyaltyPointsEarned = calculatedPoints
                    
                    // ✅ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Обновляем заказ с правильным значением loyalty_points_earned
                    await updateOrder(Number(id), {
                      loyalty_points_earned: calculatedPoints,
                    })
                    console.log(`✅ [PATCH full] Обновлен заказ ${id} с loyalty_points_earned: ${calculatedPoints}`)
                  }
                }
              } catch (error) {
                console.error(`❌ Ошибка при расчете и начислении баллов для заказа ${id}:`, error)
              }
            }
          }
        } catch (error) {
          console.error(`❌ Ошибка при обработке pending транзакций для заказа ${id}:`, error)
          // Не прерываем процесс обновления заказа
        }
      }

      // Если обновляется только статус оплаты, пропускаем обновление содержимого
      if (!isPaymentOnlyUpdate) {
        // Получаем существующие персоны, блюда и дополнения
        const existingPersons = await fetchOrderPersons(Number(id))
        const existingExtras = await fetchOrderExtras(Number(id))

        // Удаляем старые блюда для каждой персоны
        for (const person of existingPersons) {
          try {
            const meals = await fetchOrderMeals(person.Id)
            for (const meal of meals) {
              try {
                await deleteOrderMeal(meal.Id)
              } catch (error) {
                console.warn(`⚠️ Не удалось удалить meal ${meal.Id}:`, error)
                // Продолжаем, не прерываем процесс
              }
            }
            await deleteOrderPerson(person.Id)
          } catch (error) {
            console.error(`❌ Ошибка при удалении person ${person.Id}:`, error)
            // Продолжаем с другими персонами
          }
        }

        // Удаляем старые дополнения
        for (const extra of existingExtras) {
          try {
            await deleteOrderExtra(extra.Id)
          } catch (error) {
            console.warn(`⚠️ Не удалось удалить extra ${extra.Id}:`, error)
            // Продолжаем, не прерываем процесс
          }
        }

        // Создаем новые персоны и блюда
        if (order.persons && order.persons.length > 0) {
          for (const person of order.persons) {
            const nocoOrderPerson = await createOrderPerson({
              order_id: Number(id),
              person_number: person.id,
            })

            // Сохранение блюд для каждого дня
            for (const day of ["day1", "day2"] as const) {
              const dayMeals = person[day]
              if (!dayMeals) continue

              // Завтрак
              if (dayMeals.breakfast?.dish) {
                await saveMeal(nocoOrderPerson.Id, day, "breakfast", "dish", dayMeals.breakfast.dish)
              }

              // Обед
              if (dayMeals.lunch) {
                if (dayMeals.lunch.salad) {
                  await saveMeal(nocoOrderPerson.Id, day, "lunch", "salad", dayMeals.lunch.salad)
                }
                if (dayMeals.lunch.soup) {
                  await saveMeal(nocoOrderPerson.Id, day, "lunch", "soup", dayMeals.lunch.soup)
                }
                if (dayMeals.lunch.main) {
                  await saveMeal(nocoOrderPerson.Id, day, "lunch", "main", dayMeals.lunch.main)
                }
              }

              // Ужин
              if (dayMeals.dinner) {
                if (dayMeals.dinner.salad) {
                  await saveMeal(nocoOrderPerson.Id, day, "dinner", "salad", dayMeals.dinner.salad)
                }
                if (dayMeals.dinner.soup) {
                  await saveMeal(nocoOrderPerson.Id, day, "dinner", "soup", dayMeals.dinner.soup)
                }
                if (dayMeals.dinner.main) {
                  await saveMeal(nocoOrderPerson.Id, day, "dinner", "main", dayMeals.dinner.main)
                }
              }
            }
          }
        }

        // Создаем новые дополнения
        if (order.extras && order.extras.length > 0) {
          for (const extra of order.extras) {
            // ✅ ИСПРАВЛЕНИЕ: Проверяем наличие extra.id перед созданием
            if (!extra.id) {
              console.error(`  ❌ Extra без ID при обновлении заказа:`, JSON.stringify(extra, null, 2))
              console.warn(`  ⚠️ Пропускаем дополнение без ID, продолжаем...`)
              continue
            }
            
            await createOrderExtra({
              order_id: Number(id),
              extra_id: extra.id,
              quantity: extra.quantity,
              price: extra.price,
            })
          }
        }
      }

      // Возвращаем обновленный заказ с order_number
      // ✅ ИСПРАВЛЕНО 2026-01-11: Объединяем данные из updatedOrder с тем, что мы точно записали
      // ✅ ИСПРАВЛЕНО 2026-01-11: Нормализуем формат start_date для календаря
      const normalizeStartDate = (date: any): string => {
        if (!date) return ""
        if (typeof date === "string") {
          // Если это ISO timestamp, извлекаем только дату
          if (date.includes("T")) {
            return date.split("T")[0]
          }
          // Если это уже формат YYYY-MM-DD, возвращаем как есть
          return date
        }
        // Если это Date объект
        if (date instanceof Date) {
          return date.toISOString().split("T")[0]
        }
        return String(date)
      }
      
      const mergedOrder = {
        ...updatedOrder,
        // Перезаписываем поля, которые могли быть закэшированы
        loyalty_points_used: order.loyaltyPointsUsed !== undefined 
          ? order.loyaltyPointsUsed 
          : updatedOrder.loyalty_points_used,
        loyalty_points_earned: loyaltyPointsEarned !== undefined
          ? loyaltyPointsEarned
          : updatedOrder.loyalty_points_earned,
        // ✅ Нормализуем start_date к формату YYYY-MM-DD
        start_date: normalizeStartDate(updatedOrder.start_date || (updatedOrder as any)["Start Date"]),
      }
      
      // ✅ ИСПРАВЛЕНО: Возвращаем обновленный профиль пользователя и loyaltyPointsEarned
      let updatedUserProfile = undefined
      if (currentOrder.user_id) {
        try {
          const updatedUser = await fetchUserById(currentOrder.user_id, true) // noCache для свежих данных
          if (updatedUser) {
            updatedUserProfile = {
              id: updatedUser.Id,
              phone: updatedUser.phone,
              name: updatedUser.name,
              loyaltyPoints: updatedUser.loyalty_points,
              totalSpent: updatedUser.total_spent,
            }
            console.log(`✅ [PATCH full] Обновленный профиль после начисления баллов:`, updatedUserProfile)
          }
        } catch (error) {
          console.error(`❌ Ошибка загрузки обновленного профиля:`, error)
        }
      }
      
      // Получаем количество начисленных баллов для ответа
      const pointsEarned = loyaltyPointsEarned !== undefined 
        ? loyaltyPointsEarned 
        : typeof mergedOrder.loyalty_points_earned === 'number' 
        ? mergedOrder.loyalty_points_earned 
        : parseInt(String(mergedOrder.loyalty_points_earned)) || 0
      
      return NextResponse.json({ 
        success: true, 
        order: mergedOrder,
        orderNumber: (mergedOrder as any)?.order_number ?? (mergedOrder as any)?.["Order Number"],
        loyaltyPointsEarned: pointsEarned > 0 ? pointsEarned : undefined,
        userProfile: updatedUserProfile
      })
    } else {
      // Если передан только частичный объект (без order), обновляем только основные поля
      // Это обычно используется для обновления только статуса оплаты
      // Преобразуем camelCase в snake_case для NocoDB
      const updateData: any = {}
      // ✅ ИСПРАВЛЕНО: Обрабатываем как body.paid, так и body.order.paid
      if (body.order) {
        if (body.order.paid !== undefined) updateData.paid = body.order.paid
        if (body.order.paidAt !== undefined) updateData.paid_at = body.order.paidAt
        if (body.order.paymentMethod !== undefined) updateData.payment_method = body.order.paymentMethod
        if (body.order.paymentStatus !== undefined) updateData.payment_status = body.order.paymentStatus
        if (body.order.promoCode !== undefined) updateData.promo_code = body.order.promoCode
        if (body.order.promoDiscount !== undefined) updateData.promo_discount = body.order.promoDiscount
        if (body.order.loyaltyPointsUsed !== undefined) updateData.loyalty_points_used = body.order.loyaltyPointsUsed
      }
      if (body.paid !== undefined) updateData.paid = body.paid
      if (body.paid_at !== undefined) updateData.paid_at = body.paid_at
      if (body.paidAt !== undefined) updateData.paid_at = body.paidAt
      if (body.payment_method !== undefined) updateData.payment_method = body.payment_method
      if (body.paymentMethod !== undefined) updateData.payment_method = body.paymentMethod
      if (body.payment_status !== undefined) updateData.payment_status = body.payment_status
      if (body.paymentStatus !== undefined) updateData.payment_status = body.paymentStatus
      if (body.updated_at !== undefined) updateData.updated_at = body.updated_at
      if (body.updatedAt !== undefined) updateData.updated_at = body.updatedAt
      
      // Добавляем начисленные pending баллы
      if (pendingPointsEarned > 0) {
        updateData.loyalty_points_earned = pendingPointsEarned
      }
      
      // Для частичных обновлений разрешаем обновление статуса оплаты даже для заблокированных заказов
      // Проверяем, что это обновление только оплаты (нет persons/extras)
      const isPaymentOnlyUpdate = !body.persons && !body.extras && (
        body.paid !== undefined || 
        body.paidAt !== undefined || 
        body.paid_at !== undefined ||
        body.paymentStatus !== undefined || 
        body.payment_status !== undefined ||
        body.paymentMethod !== undefined ||
        body.payment_method !== undefined
      )
      
      console.log(`[PATCH /api/orders/${id}] Partial update - isPaymentOnlyUpdate: ${isPaymentOnlyUpdate}`, {
        hasPersons: !!body.persons,
        hasExtras: !!body.extras,
        hasPaid: body.paid !== undefined,
        hasPaidAt: body.paidAt !== undefined || body.paid_at !== undefined,
        hasPaymentStatus: body.paymentStatus !== undefined || body.payment_status !== undefined,
        hasPaymentMethod: body.paymentMethod !== undefined || body.payment_method !== undefined,
      })
      
      // Если это не обновление только оплаты, проверяем блокировку
      if (!isPaymentOnlyUpdate) {
        // ✅ ИСПРАВЛЕНО: Всегда загружаем свежие данные без кэша
        const currentOrder = await fetchOrderById(Number(id), true)
        if (currentOrder) {
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          
          const orderDate = currentOrder.start_date 
            ? new Date(currentOrder.start_date)
            : null
          if (orderDate) {
            orderDate.setHours(0, 0, 0, 0)
          }
          
          const isPaid = currentOrder.paid === true || currentOrder.payment_status === "paid"
          const isPastDate = orderDate && orderDate < today
          const isToday = orderDate && orderDate.getTime() === today.getTime()
          
          if (isPaid || isPastDate || isToday) {
            const reason = isPaid 
              ? "Заказ оплачен" 
              : isToday 
              ? "Доставка сегодня" 
              : "Прошедшая дата"
            console.error(`[PATCH /api/orders/${id}] Order is locked: ${reason}`)
            return NextResponse.json({ 
              error: "Order cannot be edited",
              reason,
              details: isPaid 
                ? "Редактирование оплаченного заказа недоступно"
                : isToday
                ? "Редактирование заказа в день доставки недоступно"
                : "Редактирование заказа на прошедшую дату недоступно"
            }, { status: 403 })
          }
        }
      } else {
        console.log(`[PATCH /api/orders/${id}] Payment-only update - skipping lock check`)
      }
      
      // Получаем текущий заказ для обработки баллов
      // ✅ ИСПРАВЛЕНО: Всегда загружаем свежие данные без кэша
      const currentOrder = await fetchOrderById(Number(id), true)
      if (!currentOrder) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
      }

      // Проверяем изменения статуса оплаты для обработки баллов
      // ✅ ИСПРАВЛЕНО: Проверяем также body.order для случая, когда передается объект order
      const wasPaid = currentOrder.paid === true || currentOrder.payment_status === "paid"
      const willBePaid = updateData.paid === true || updateData.payment_status === "paid" || 
                        (body.order && (body.order.paid === true || body.order.paymentStatus === "paid"))
      
      console.log(`[PATCH /api/orders/${id}] 🔍 Проверка оплаты:`, {
        wasPaid,
        willBePaid,
        'updateData.paid': updateData.paid,
        'updateData.payment_status': updateData.payment_status,
        'body.order?.paid': body.order?.paid,
        'body.order?.paymentStatus': body.order?.paymentStatus,
        'currentOrder.paid': currentOrder.paid,
        'currentOrder.payment_status': currentOrder.payment_status,
      })
      const willBeCancelled = body.orderStatus === "cancelled" || body.order_status === "cancelled"
      const wasCancelled = currentOrder.order_status === "cancelled"

      // ✅ ИСПРАВЛЕНО 2026-01-11: Списание баллов при использовании (для partial update)
      // Это нужно делать НЕЗАВИСИМО от способа оплаты и статуса paid
      if (currentOrder.user_id && body.loyaltyPointsUsed && body.loyaltyPointsUsed > 0) {
        try {
          // Проверяем, не были ли баллы уже списаны
          const existingPointsUsed = typeof currentOrder.loyalty_points_used === 'number' 
            ? currentOrder.loyalty_points_used 
            : parseInt(String(currentOrder.loyalty_points_used)) || 0
          
          // Списываем только если это новое использование баллов (не было раньше)
          if (existingPointsUsed === 0 && body.loyaltyPointsUsed > 0) {
            console.log(`\n🔍 ========== СПИСАНИЕ БАЛЛОВ (PATCH partial) ==========`)
            console.log(`💳 Списываем ${body.loyaltyPointsUsed} баллов для заказа ${id}`)
            
            const now = new Date().toISOString()
            const { createLoyaltyPointsTransaction, updateUser, fetchUserById } = await import("@/lib/nocodb")
            
            // ✅ ЗАЩИТА: Проверяем достаточно ли баллов у пользователя
            const user = await fetchUserById(currentOrder.user_id, true)
            if (!user) {
              console.error(`❌ Пользователь ${currentOrder.user_id} не найден`)
              throw new Error(`User ${currentOrder.user_id} not found`)
            }
            
            const currentBalance = typeof user.loyalty_points === 'number' 
              ? user.loyalty_points 
              : parseFloat(String(user.loyalty_points)) || 0
            
            console.log(`🔍 Проверка баланса перед списанием:`, {
              userId: currentOrder.user_id,
              currentBalance,
              requestedToUse: body.loyaltyPointsUsed,
              sufficient: currentBalance >= body.loyaltyPointsUsed
            })
            
            if (currentBalance < body.loyaltyPointsUsed) {
              console.warn(`⚠️ ЗАЩИТА: Недостаточно баллов для списания!`, {
                available: currentBalance,
                requested: body.loyaltyPointsUsed,
                deficit: body.loyaltyPointsUsed - currentBalance
              })
              console.log(`ℹ️ Пропускаем списание - возможно баллы уже были списаны ранее`)
              console.log(`🔍 ========== КОНЕЦ СПИСАНИЯ БАЛЛОВ (пропущено) ==========\n`)
              // Не выбрасываем ошибку - просто пропускаем операцию
              // Это может быть повторный запрос или race condition
            } else {
              // Баллов достаточно - списываем
              
              // Создаем транзакцию на списание
              await createLoyaltyPointsTransaction({
                user_id: currentOrder.user_id,
                order_id: Number(id),
                transaction_type: "used",
                transaction_status: "completed",
                points: -body.loyaltyPointsUsed,
                description: `Использовано ${body.loyaltyPointsUsed} баллов для оплаты заказа`,
                created_at: now,
                updated_at: now,
                processed_at: now,
              })
              console.log(`✅ Транзакция "used" создана: -${body.loyaltyPointsUsed} баллов`)
              
              // Списываем баллы у пользователя
              const newBalance = currentBalance - body.loyaltyPointsUsed
              
              await updateUser(currentOrder.user_id, {
                loyalty_points: newBalance,
                updated_at: now,
              })
              
              console.log(`✅ Баллы списаны с пользователя ${currentOrder.user_id}:`, {
                oldBalance: currentBalance,
                used: body.loyaltyPointsUsed,
                newBalance,
              })
            }
            
            // Обновляем loyalty_points_used в updateData
            updateData.loyalty_points_used = body.loyaltyPointsUsed
            
            console.log(`🔍 ========== КОНЕЦ СПИСАНИЯ БАЛЛОВ ==========\n`)
          } else {
            console.log(`ℹ️ Баллы уже были списаны ранее (${existingPointsUsed}) или не изменились`)
          }
        } catch (error) {
          console.error(`❌ Ошибка при списании баллов (partial):`, error)
          // Не прерываем процесс обновления заказа
        }
      }

      // Обработка списания баллов при отмене заказа
      if (!wasCancelled && willBeCancelled && currentOrder.user_id) {
        try {
          const pointsEarned = typeof currentOrder.loyalty_points_earned === 'number' 
            ? currentOrder.loyalty_points_earned 
            : parseInt(String(currentOrder.loyalty_points_earned)) || 0
          const pointsUsed = typeof currentOrder.loyalty_points_used === 'number'
            ? currentOrder.loyalty_points_used
            : parseInt(String(currentOrder.loyalty_points_used)) || 0
          const orderTotal = typeof currentOrder.total === 'number'
            ? currentOrder.total
            : parseFloat(String(currentOrder.total)) || 0

          const wasPaid = currentOrder.paid === true || currentOrder.payment_status === "paid"
          
          // Списываем баллы только если заказ не был оплачен
          if (!wasPaid && (pointsEarned > 0 || pointsUsed > 0)) {
            await refundLoyaltyPoints(
              currentOrder.user_id,
              pointsEarned,
              pointsUsed,
              orderTotal,
              Number(id)
            )
            console.log(`✅ Списано ${pointsEarned} баллов и возвращено ${pointsUsed} использованных баллов при отмене неоплаченного заказа ${id}`)
          } else if (wasPaid) {
            console.log(`ℹ️ Заказ ${id} был оплачен, баллы не списываются при отмене`)
          }
        } catch (error) {
          console.error(`❌ Ошибка при списании баллов при отмене заказа:`, error)
        }
      }

      // Проверяем изменение способа оплаты с наличных на онлайн (для partial update)
      const oldPaymentMethodPartial = currentOrder.payment_method || (currentOrder as any)["Payment Method"]
      const newPaymentMethod = updateData.payment_method || (body.order && body.order.paymentMethod)
      const isPaymentMethodChangedFromCash = oldPaymentMethodPartial === 'cash' && 
          (newPaymentMethod === 'card' || newPaymentMethod === 'sbp')
      
      console.log(`🔍 [PATCH partial ${id}] Проверка смены способа оплаты:`, {
        oldPaymentMethodPartial,
        newPaymentMethod,
        'updateData.payment_method': updateData.payment_method,
        'body.order?.paymentMethod': body.order?.paymentMethod,
        isPaymentMethodChangedFromCash,
      })
      
      if (isPaymentMethodChangedFromCash) {
        console.log(`💳 Partial update: Заказ ${id} оплачен онлайн (было: ${oldPaymentMethodPartial}, стало: ${newPaymentMethod}), обрабатываем pending баллы`)
        
        try {
          // Обрабатываем pending транзакции для этого заказа
          const earnedPoints = await processPendingTransactionsForOrder(Number(id), currentOrder.user_id)
          
          if (earnedPoints > 0) {
            pendingPointsEarned = earnedPoints
            updateData.loyalty_points_earned = earnedPoints
            console.log(`✅ Pending транзакции обработаны, начислено ${earnedPoints} баллов`)
          } else {
            console.log(`ℹ️ Pending транзакции не найдены или уже обработаны`)
            // ✅ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Если pending транзакций не было, но заказ оплачен онлайн,
            // нужно начислить баллы как при обычной оплате онлайн
            // Это происходит, когда заказ создан с cash, но сразу оплачен картой
            console.log(`💡 Pending транзакций не было, но заказ оплачен онлайн - начисляем баллы как при обычной оплате`)
            
            // ✅ ИСПРАВЛЕНО: Начисляем баллы прямо здесь, если заказ оплачен онлайн
            const isPaidOnline = updateData.paid === true || updateData.payment_status === "paid" || 
                                (body.order && (body.order.paid === true || body.order.paymentStatus === "paid"))
            const isOnlinePayment = newPaymentMethod === 'card' || newPaymentMethod === 'sbp'
            
            if (isPaidOnline && isOnlinePayment) {
              try {
                const user = await fetchUserById(currentOrder.user_id, true)
                if (user) {
                  const orderTotal = typeof currentOrder.total === 'number' 
                    ? currentOrder.total 
                    : typeof (currentOrder as any).Total === 'number'
                    ? (currentOrder as any).Total
                    : parseFloat(String(currentOrder.total || (currentOrder as any).Total || 0)) || 0
                  
                  // ✅ ИСПРАВЛЕНО: Учитываем промокод при расчете orderTotal
                  const promoDiscount = typeof currentOrder.promo_discount === 'number'
                    ? currentOrder.promo_discount
                    : typeof (currentOrder as any)['Promo Discount'] === 'number'
                    ? (currentOrder as any)['Promo Discount']
                    : parseFloat(String(currentOrder.promo_discount || (currentOrder as any)['Promo Discount'] || 0)) || 0
                  
                  let orderTotalForPoints = orderTotal
                  if (promoDiscount > 0 && orderTotal > 0) {
                    const subtotal = typeof currentOrder.subtotal === 'number'
                      ? currentOrder.subtotal
                      : typeof (currentOrder as any).Subtotal === 'number'
                      ? (currentOrder as any).Subtotal
                      : parseFloat(String(currentOrder.subtotal || (currentOrder as any).Subtotal || 0)) || 0
                    
                    const deliveryFee = typeof currentOrder.delivery_fee === 'number'
                      ? currentOrder.delivery_fee
                      : typeof (currentOrder as any)['Delivery Fee'] === 'number'
                      ? (currentOrder as any)['Delivery Fee']
                      : parseFloat(String(currentOrder.delivery_fee || (currentOrder as any)['Delivery Fee'] || 0)) || 0
                    
                    const expectedTotal = subtotal + deliveryFee - promoDiscount
                    if (Math.abs(orderTotal - expectedTotal) > 0.01) {
                      console.log(`⚠️ [PATCH partial] orderTotal не учитывает промокод, пересчитываем для начисления баллов: ${orderTotal} → ${expectedTotal}`)
                      orderTotalForPoints = expectedTotal
                    }
                  }
                  
                  const pointsUsed = typeof currentOrder.loyalty_points_used === 'number'
                    ? currentOrder.loyalty_points_used
                    : parseInt(String(currentOrder.loyalty_points_used)) || 0
                  const currentTotalSpent = typeof user.total_spent === 'number' ? user.total_spent : parseFloat(String(user.total_spent)) || 0
                  const calculatedPoints = calculateEarnedPoints(orderTotalForPoints, pointsUsed, currentTotalSpent)
                  console.log(`💰 [PATCH partial] Рассчитано ${calculatedPoints} баллов для заказа ${id} (orderTotal: ${orderTotalForPoints}, promoDiscount: ${promoDiscount})`)
                  
                  // ✅ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Начисляем баллы пользователю
                  if (calculatedPoints > 0) {
                    console.log(`🔍 [PATCH partial] Вызов awardLoyaltyPoints с параметрами:`, {
                      userId: currentOrder.user_id,
                      orderTotal: orderTotalForPoints,
                      pointsUsed: 0,
                      loyaltyPointsEarned: calculatedPoints,
                      orderId: id,
                    })
                    await awardLoyaltyPoints(currentOrder.user_id, orderTotalForPoints, 0, calculatedPoints, Number(id))
                    console.log(`✅ [PATCH partial] Начислено ${calculatedPoints} баллов пользователю ${currentOrder.user_id} при оплате заказа ${id}`)
                    pendingPointsEarned = calculatedPoints
                    updateData.loyalty_points_earned = calculatedPoints
                  }
                }
              } catch (error) {
                console.error(`❌ Ошибка при расчете и начислении баллов для заказа ${id}:`, error)
              }
            }
          }
        } catch (error) {
          console.error(`❌ Ошибка при обработке pending транзакций для заказа ${id}:`, error)
        }
      }
      
      // Начисление баллов при оплате заказа
      // ✅ ИСПРАВЛЕНО: Начисляем баллы если:
      // 1. Заказ переходит из неоплаченного в оплаченный (!wasPaid && willBePaid)
      // 2. И это НЕ случай с pending транзакциями (они уже обработаны выше, pendingPointsEarned > 0)
      // 3. ИЛИ это смена способа оплаты с cash на card/sbp, но pending транзакций не было
      
      // ✅ ЗАЩИТА: Проверяем, не были ли баллы уже начислены при создании
      const existingPointsEarnedPartial = typeof currentOrder.loyalty_points_earned === 'number' 
        ? currentOrder.loyalty_points_earned 
        : parseInt(String(currentOrder.loyalty_points_earned)) || 0
      
      // ✅ ИСПРАВЛЕНО: Проверяем также, оплачен ли заказ онлайн, но баллы не начислены
      const isPaidOnline = willBePaid && (updateData.payment_method === 'card' || updateData.payment_method === 'sbp' || 
                                          (body.order && (body.order.paymentMethod === 'card' || body.order.paymentMethod === 'sbp')) ||
                                          currentOrder.payment_method === 'card' || currentOrder.payment_method === 'sbp' ||
                                          (currentOrder as any)['Payment Method'] === 'card' || (currentOrder as any)['Payment Method'] === 'sbp')
      
      console.log(`\n🔍 ========== НАЧАЛО ПРОВЕРКИ НАЧИСЛЕНИЯ БАЛЛОВ (PATCH partial ${id}) ==========`)
      console.log(`🔍 Проверка начисления баллов при оплате ${id}:`, {
        wasPaid,
        willBePaid,
        isPaidOnline,
        'currentOrder.user_id': currentOrder.user_id,
        'currentOrder.loyalty_points_earned': existingPointsEarnedPartial,
        pendingPointsEarned,
        'currentOrder.total': currentOrder.total || (currentOrder as any).Total,
        'currentOrder.subtotal': currentOrder.subtotal || (currentOrder as any).Subtotal,
        'currentOrder.promo_discount': currentOrder.promo_discount || (currentOrder as any)['Promo Discount'],
        'currentOrder.payment_method': currentOrder.payment_method || (currentOrder as any)['Payment Method'],
        condition: (!wasPaid && willBePaid) || (isPaymentMethodChangedFromCash && willBePaid && pendingPointsEarned === 0) || (willBePaid && existingPointsEarnedPartial === 0 && pendingPointsEarned === 0 && isPaidOnline),
        '!wasPaid': !wasPaid,
        'willBePaid': willBePaid,
        'hasUserId': !!currentOrder.user_id,
        'pendingPointsEarned === 0': pendingPointsEarned === 0,
        'existingPointsEarnedPartial === 0': existingPointsEarnedPartial === 0,
      })
      
      if (existingPointsEarnedPartial > 0) {
        console.warn(`⚠️ ЗАЩИТА ОТ ДВОЙНОГО НАЧИСЛЕНИЯ (partial update): Баллы уже начислены для заказа ${id}: ${existingPointsEarnedPartial}. Пропускаем начисление.`)
        // Сохраняем существующее значение в updateData
        updateData.loyalty_points_earned = existingPointsEarnedPartial
      } else if (currentOrder.user_id && ((!wasPaid && willBePaid && pendingPointsEarned === 0 && existingPointsEarnedPartial === 0) || 
                 (isPaymentMethodChangedFromCash && willBePaid && pendingPointsEarned === 0) || 
                 (willBePaid && existingPointsEarnedPartial === 0 && pendingPointsEarned === 0 && isPaidOnline))) {
        // ✅ ИСПРАВЛЕНО: Начисляем баллы если:
        // 1. Заказ переходит из неоплаченного в оплаченный (!wasPaid && willBePaid)
        // 2. ИЛИ это смена способа оплаты с cash на card/sbp, заказ оплачен, но pending транзакций не было
        // 3. ИЛИ заказ оплачен онлайн, но баллы еще не начислены (для случая, когда заказ уже был оплачен ранее)
        if (!currentOrder.user_id) {
          console.log(`ℹ️ PATCH ${id}: Пропускаем начисление баллов - нет user_id`)
        } else if (existingPointsEarnedPartial > 0) {
          console.log(`ℹ️ PATCH ${id}: Пропускаем начисление баллов - баллы уже начислены: ${existingPointsEarnedPartial}`)
        } else if (pendingPointsEarned > 0) {
          console.log(`ℹ️ PATCH ${id}: Пропускаем начисление баллов - уже обработаны pending транзакции: ${pendingPointsEarned}`)
        } else {
          console.log(`\n🔍 ========== НАЧАЛО ОТЛАДКИ НАЧИСЛЕНИЯ БАЛЛОВ (PATCH partial) ==========`)
        console.log(`🔍 [PATCH partial ${id}] 1️⃣ Входящий payload (updateData):`, {
          paid: updateData.paid,
          payment_status: updateData.payment_status,
          payment_method: updateData.payment_method,
        })
        
        console.log(`🔍 [PATCH partial ${id}] Текущее состояние заказа:`, {
          'currentOrder.total': currentOrder.total,
          'currentOrder.subtotal': currentOrder.subtotal,
          'currentOrder.delivery_fee': currentOrder.delivery_fee,
          'currentOrder.loyalty_points_earned': currentOrder.loyalty_points_earned,
          'currentOrder.loyalty_points_used': currentOrder.loyalty_points_used,
        })
        
        try {
          // ✅ ИСПРАВЛЕНО: Всегда загружаем свежие данные без кэша
          const user = await fetchUserById(currentOrder.user_id, true)
          if (user) {
            console.log(`🔍 [PATCH partial ${id}] 2️⃣ Пользователь найден:`, {
              userId: user.Id,
              loyaltyPoints: user.loyalty_points,
              totalSpent: user.total_spent,
            })
            
            // ✅ УЛУЧШЕНО: Получаем сумму заказа из разных возможных полей
            let orderTotal = typeof currentOrder.total === 'number' 
              ? currentOrder.total 
              : typeof (currentOrder as any).Total === 'number'
              ? (currentOrder as any).Total
              : parseFloat(String(currentOrder.total || (currentOrder as any).Total || 0)) || 0
            
            // Если total = 0, пытаемся взять из subtotal + delivery_fee
            if (orderTotal === 0) {
              const subtotal = typeof currentOrder.subtotal === 'number'
                ? currentOrder.subtotal
                : typeof (currentOrder as any).Subtotal === 'number'
                ? (currentOrder as any).Subtotal
                : parseFloat(String(currentOrder.subtotal || (currentOrder as any).Subtotal || 0)) || 0
              
              const deliveryFee = typeof currentOrder.delivery_fee === 'number'
                ? currentOrder.delivery_fee
                : typeof (currentOrder as any)['Delivery Fee'] === 'number'
                ? (currentOrder as any)['Delivery Fee']
                : parseFloat(String(currentOrder.delivery_fee || (currentOrder as any)['Delivery Fee'] || 0)) || 0
              
              if (subtotal > 0) {
                const promoDiscount = typeof currentOrder.promo_discount === 'number'
                  ? currentOrder.promo_discount
                  : parseFloat(String(currentOrder.promo_discount || 0)) || 0
                
                orderTotal = subtotal + deliveryFee - promoDiscount
                console.log(`ℹ️ Total был 0, пересчитан из subtotal + delivery_fee: ${subtotal} + ${deliveryFee} - ${promoDiscount} = ${orderTotal}`)
              }
            }
            
            // ✅ ИСПРАВЛЕНО: Проверяем, что orderTotal учитывает промокод
            // Если total уже установлен, но не учитывает промокод, пересчитываем
            if (orderTotal > 0) {
              const promoDiscount = typeof currentOrder.promo_discount === 'number'
                ? currentOrder.promo_discount
                : typeof (currentOrder as any)['Promo Discount'] === 'number'
                ? (currentOrder as any)['Promo Discount']
                : parseFloat(String(currentOrder.promo_discount || (currentOrder as any)['Promo Discount'] || 0)) || 0
              
              // Если промокод есть, но total не учитывает его, пересчитываем
              if (promoDiscount > 0) {
                const subtotal = typeof currentOrder.subtotal === 'number'
                  ? currentOrder.subtotal
                  : typeof (currentOrder as any).Subtotal === 'number'
                  ? (currentOrder as any).Subtotal
                  : parseFloat(String(currentOrder.subtotal || (currentOrder as any).Subtotal || 0)) || 0
                
                const deliveryFee = typeof currentOrder.delivery_fee === 'number'
                  ? currentOrder.delivery_fee
                  : typeof (currentOrder as any)['Delivery Fee'] === 'number'
                  ? (currentOrder as any)['Delivery Fee']
                  : parseFloat(String(currentOrder.delivery_fee || (currentOrder as any)['Delivery Fee'] || 0)) || 0
                
                const expectedTotal = subtotal + deliveryFee - promoDiscount
                // Если текущий total не совпадает с ожидаемым (с учетом промокода), используем ожидаемый
                if (Math.abs(orderTotal - expectedTotal) > 0.01) {
                  console.log(`⚠️ orderTotal не учитывает промокод, пересчитываем: ${orderTotal} → ${expectedTotal}`)
                  orderTotal = expectedTotal
                }
              }
            }
            
            console.log(`🔍 [PATCH partial ${id}] 3️⃣ Расчет orderTotal:`, {
              'currentOrder.total': currentOrder.total,
              'currentOrder.Total': (currentOrder as any).Total,
              'currentOrder.subtotal': currentOrder.subtotal,
              'currentOrder.delivery_fee': currentOrder.delivery_fee,
              'currentOrder.promo_discount': currentOrder.promo_discount || (currentOrder as any)['Promo Discount'],
              'calculated orderTotal': orderTotal,
            })
            
            const pointsUsed = typeof currentOrder.loyalty_points_used === 'number'
              ? currentOrder.loyalty_points_used
              : parseInt(String(currentOrder.loyalty_points_used)) || 0
            const currentTotalSpent = typeof user.total_spent === 'number' 
              ? user.total_spent 
              : parseFloat(String(user.total_spent)) || 0

            console.log(`🔍 [PATCH partial ${id}] 4️⃣ Подготовка данных для расчета:`, {
              orderTotal,
              pointsUsed,
              currentTotalSpent,
              loyaltyLevel: currentTotalSpent >= 50000 ? "gold" : currentTotalSpent >= 20000 ? "silver" : "bronze",
            })

            // ✅ ПРОВЕРКА: Если orderTotal все еще 0, не начисляем баллы
            if (orderTotal <= 0) {
              console.warn(`⚠️ PATCH ${id}: Невозможно начислить баллы - orderTotal = ${orderTotal}. Проверьте данные заказа в БД!`)
            } else {
              // Рассчитываем начисляемые баллы
              console.log(`🔍 [PATCH partial ${id}] 5️⃣ Вызов calculateEarnedPoints с параметрами:`, {
                orderTotal,
                pointsUsed,
                currentTotalSpent,
              })
              const loyaltyPointsEarned = calculateEarnedPoints(orderTotal, pointsUsed, currentTotalSpent)
              
              console.log(`🔍 [PATCH partial ${id}] 6️⃣ Результат calculateEarnedPoints:`, {
                loyaltyPointsEarned,
              })
              
              console.log(`💰 Рассчитано ${loyaltyPointsEarned} баллов для заказа ${id} (orderTotal: ${orderTotal}, pointsUsed: ${pointsUsed})`)
              
              if (loyaltyPointsEarned > 0) {
                // Начисляем баллы пользователю
                // ✅ ИСПРАВЛЕНО 2026-01-11: При partial update (только изменение статуса оплаты)
                // баллы уже были списаны ранее, поэтому передаем pointsUsed=0
                // чтобы не списывать их повторно в awardLoyaltyPoints
                console.log(`🔍 [PATCH partial ${id}] 7️⃣ Вызов awardLoyaltyPoints с параметрами:`, {
                  userId: currentOrder.user_id,
                  orderTotal,
                  pointsUsed: 0, // ✅ 0 вместо pointsUsed, т.к. уже списаны
                  loyaltyPointsEarned,
                  orderId: id,
                  note: 'pointsUsed=0 потому что баллы уже были списаны при создании/обновлении заказа'
                })
                await awardLoyaltyPoints(currentOrder.user_id, orderTotal, 0, loyaltyPointsEarned, Number(id))
                
                console.log(`🔍 [PATCH partial ${id}] 8️⃣ Результат awardLoyaltyPoints: успешно`)
                
                // Обновляем заказ с рассчитанными баллами
                console.log(`🔍 [PATCH partial ${id}] 9️⃣ Обновление заказа в БД:`, {
                  orderId: id,
                  loyalty_points_earned: loyaltyPointsEarned,
                })
                // ✅ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Обновляем loyalty_points_earned в updateData ПЕРЕД вызовом updateOrder
                updateData.loyalty_points_earned = loyaltyPointsEarned
                
                console.log(`✅ Начислено ${loyaltyPointsEarned} баллов пользователю ${currentOrder.user_id} при оплате заказа ${id}`)
              } else {
                console.log(`ℹ️ PATCH ${id}: Баллы не начислены - рассчитано 0 баллов`)
              }
            }
          } else {
            console.warn(`⚠️ PATCH ${id}: Пользователь не найден для начисления баллов (user_id: ${currentOrder.user_id})`)
          }
        } catch (error) {
          console.error(`❌ Ошибка при начислении баллов при оплате:`, error)
          // ✅ ИСПРАВЛЕНО: Не прерываем процесс обновления заказа из-за ошибки начисления баллов
          // Но логируем ошибку для отладки
        }
        console.log(`🔍 ========== КОНЕЦ ОТЛАДКИ НАЧИСЛЕНИЯ БАЛЛОВ (PATCH partial) ==========\n`)
        
        // ✅ ИСПРАВЛЕНО 2026-01-15: Инкремент счетчика промокода при оплате заказа (partial)
        if (!wasPaid && willBePaid && currentOrder.promo_code) {
          try {
            const { fetchPromoCode, incrementPromoCodeUsage } = await import("@/lib/nocodb")
            const promo = await fetchPromoCode(currentOrder.promo_code)
            if (promo) {
              await incrementPromoCodeUsage(promo.Id)
              console.log(`✅ Счетчик промокода "${currentOrder.promo_code}" инкрементирован при оплате заказа (partial)`)
            }
          } catch (error) {
            console.error(`❌ Ошибка при инкременте промокода:`, error)
          }
        }
        }
      } else {
        // ✅ ДОБАВЛЕНО: Логируем, почему баллы не начисляются
        console.log(`ℹ️ PATCH ${id}: Баллы не начисляются, причина:`, {
          wasPaid,
          willBePaid,
          hasUserId: !!currentOrder.user_id,
          pendingPointsEarned,
          existingPointsEarnedPartial,
          reason: !wasPaid && willBePaid && currentOrder.user_id && pendingPointsEarned === 0 && existingPointsEarnedPartial === 0
            ? 'Условие выполнено, но не вошли в блок'
            : !wasPaid && willBePaid
            ? 'Условие оплаты выполнено'
            : !currentOrder.user_id
            ? 'Нет user_id'
            : pendingPointsEarned > 0
            ? `Есть pending транзакции: ${pendingPointsEarned}`
            : existingPointsEarnedPartial > 0
            ? `Баллы уже начислены: ${existingPointsEarnedPartial}`
            : 'Неизвестная причина'
        })
      }

      // Добавляем order_status в updateData, если он указан
      if (body.orderStatus !== undefined) updateData.order_status = body.orderStatus
      if (body.order_status !== undefined) updateData.order_status = body.order_status
      
      console.log(`[PATCH /api/orders/${id}] Updating with data:`, updateData)
      console.log(`[PATCH /api/orders/${id}] 🔍 Детали updateData:`, {
        paid: updateData.paid,
        payment_status: updateData.payment_status,
        payment_method: updateData.payment_method,
        promo_code: updateData.promo_code,
        promo_discount: updateData.promo_discount,
        loyalty_points_earned: updateData.loyalty_points_earned,
        hasUpdateData: Object.keys(updateData).length > 0,
        updateDataKeys: Object.keys(updateData),
      })
      
      // ✅ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Проверяем, что updateData не пустой
      if (Object.keys(updateData).length === 0) {
        console.warn(`⚠️ [PATCH /api/orders/${id}] updateData пустой! Проверяем body:`, {
          hasBodyOrder: !!body.order,
          bodyOrderKeys: body.order ? Object.keys(body.order) : [],
          bodyKeys: Object.keys(body),
        })
      }
      
      // ✅ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Проверяем, что updateData не пустой перед обновлением
      if (Object.keys(updateData).length === 0) {
        console.error(`❌ [PATCH /api/orders/${id}] updateData пустой! Нечего обновлять.`)
        return NextResponse.json({ 
          error: "No data to update",
          details: "updateData is empty"
        }, { status: 400 })
      }
      
      try {
        await updateOrder(Number(id), updateData)
        console.log(`[PATCH /api/orders/${id}] ✅ Successfully updated, fetching full order...`)
        
        // ✅ ИСПРАВЛЕНО 2026-01-11: Получаем полный объект заказа из БД после обновления
        const fullOrder = await fetchOrderById(Number(id), true) // noCache для свежих данных
        if (!fullOrder) {
          throw new Error("Order not found after update")
        }
        
        // ✅ ИСПРАВЛЕНО 2026-01-11: Если в fetchOrderById нет обновленных данных (кэш),
        // берем их из updateData напрямую
        // ✅ ИСПРАВЛЕНО 2026-01-11: Нормализуем формат start_date для календаря
        const normalizeStartDate = (date: any): string => {
          if (!date) return ""
          if (typeof date === "string") {
            // Если это ISO timestamp, извлекаем только дату
            if (date.includes("T")) {
              return date.split("T")[0]
            }
            // Если это уже формат YYYY-MM-DD, возвращаем как есть
            return date
          }
          // Если это Date объект
          if (date instanceof Date) {
            return date.toISOString().split("T")[0]
          }
          return String(date)
        }
        
        const mergedOrder = {
          ...fullOrder,
          // ✅ ИСПРАВЛЕНО: Перезаписываем ВСЕ поля из updateData, чтобы ответ API отражал актуальное состояние
          ...(updateData.paid !== undefined && { paid: updateData.paid }),
          ...(updateData.paid_at !== undefined && { paid_at: updateData.paid_at }),
          ...(updateData.payment_status !== undefined && { payment_status: updateData.payment_status }),
          ...(updateData.payment_method !== undefined && { payment_method: updateData.payment_method }),
          ...(updateData.promo_code !== undefined && { promo_code: updateData.promo_code }),
          ...(updateData.promo_discount !== undefined && { promo_discount: updateData.promo_discount }),
          ...(updateData.loyalty_points_used !== undefined && { 
            loyalty_points_used: updateData.loyalty_points_used 
          }),
          ...(updateData.loyalty_points_earned !== undefined && { 
            loyalty_points_earned: updateData.loyalty_points_earned 
          }),
          // ✅ Нормализуем start_date к формату YYYY-MM-DD
          start_date: normalizeStartDate(fullOrder.start_date || (fullOrder as any)["Start Date"]),
        }
        
        console.log(`[PATCH /api/orders/${id}] 📦 Полный заказ (merged):`, {
          Id: mergedOrder.Id,
          total: mergedOrder.total,
          loyalty_points_earned: mergedOrder.loyalty_points_earned,
          loyalty_points_used: mergedOrder.loyalty_points_used,
          paid: mergedOrder.paid,
        })
        
        // Получаем количество начисленных баллов для ответа
        // Приоритет: pendingPointsEarned (если были обработаны pending) или loyalty_points_earned из заказа
        const pointsEarned = pendingPointsEarned > 0 
          ? pendingPointsEarned 
          : typeof mergedOrder.loyalty_points_earned === 'number' 
          ? mergedOrder.loyalty_points_earned 
          : parseInt(String(mergedOrder.loyalty_points_earned)) || 0
        
        console.log(`[PATCH /api/orders/${id}] 📤 Возвращаем ответ:`, {
          success: true,
          pendingPointsEarned,
          'mergedOrder.loyalty_points_earned': mergedOrder.loyalty_points_earned,
          'mergedOrder.loyalty_points_used': mergedOrder.loyalty_points_used,
          'mergedOrder.total': mergedOrder.total,
          pointsEarned,
          loyaltyPointsEarnedInResponse: pointsEarned > 0 ? pointsEarned : undefined
        })
        
        // ✅ ИСПРАВЛЕНО 2026-01-11: Возвращаем обновленный профиль пользователя
        let updatedUserProfile = undefined
        if (currentOrder.user_id) {
          try {
            const updatedUser = await fetchUserById(currentOrder.user_id, true) // noCache для свежих данных
            if (updatedUser) {
              updatedUserProfile = {
                id: updatedUser.Id,
                phone: updatedUser.phone,
                name: updatedUser.name,
                loyaltyPoints: updatedUser.loyalty_points,
                totalSpent: updatedUser.total_spent,
              }
              console.log(`✅ Обновленный профиль после PATCH:`, updatedUserProfile)
            }
          } catch (error) {
            console.error(`❌ Ошибка загрузки обновленного профиля:`, error)
          }
        }
        
        return NextResponse.json({ 
          success: true, 
          order: mergedOrder,
          orderNumber: (mergedOrder as any)?.order_number ?? (mergedOrder as any)?.["Order Number"],
          loyaltyPointsEarned: pointsEarned > 0 ? pointsEarned : undefined,
          userProfile: updatedUserProfile
        })
      } catch (error) {
        console.error(`[PATCH /api/orders/${id}] ❌ Update failed:`, error)
        throw error
      }
    }
  } catch (error) {
    console.error("❌ Failed to update order:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error("Error details:", { errorMessage, errorStack })
    return NextResponse.json({ 
      error: "Failed to update order",
      details: errorMessage,
      stack: process.env.NODE_ENV === "development" ? errorStack : undefined
    }, { status: 500 })
  }
}

async function saveMeal(
  orderPersonId: number,
  day: "day1" | "day2",
  mealTime: "breakfast" | "lunch" | "dinner",
  mealType: "dish" | "salad" | "soup" | "main",
  meal: Meal,
) {
  const price = getMealPriceForPortion(meal)
  const garnishPrice = meal.garnish ? getMealPriceForPortion(meal.garnish) : undefined

  // ✅ ИСПРАВЛЕНО: Извлекаем числовую часть из meal.id, если это строка
  const cleanMealId = typeof meal.id === 'string' 
    ? parseInt((meal.id as any).split('_')[0]) 
    : meal.id
  
  const cleanGarnishId = meal.garnish?.id 
    ? (typeof meal.garnish.id === 'string' 
        ? parseInt((meal.garnish.id as any).split('_')[0]) 
        : meal.garnish.id)
    : undefined

  await createOrderMeal({
    order_person_id: orderPersonId,
    day,
    meal_time: mealTime,
    meal_type: mealType,
    meal_id: cleanMealId,
    portion_size: meal.portion || "single",
    price: Math.round(price), // ✅ Округляем цену до целого числа
    garnish_id: cleanGarnishId,
    garnish_portion_size: meal.garnish?.portion,
    garnish_price: garnishPrice ? Math.round(garnishPrice) : undefined, // ✅ Округляем цену гарнира
  })
}

function getMealPriceForPortion(meal: {
  prices?: { single: number; medium?: number; large?: number }
  price?: number
  portion?: PortionSize
}): number {
  // Если есть объект prices, используем его
  if (meal.prices) {
    const portion = meal.portion || "single"
    if (portion === "medium" && meal.prices.medium) return meal.prices.medium
    if (portion === "large" && meal.prices.large) return meal.prices.large
    return meal.prices.single
  }
  // Иначе используем price (старый формат)
  return meal.price || 0
}

// DELETE /api/orders/[id] - отмена заказа
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Получаем текущий заказ для обработки баллов (БЕЗ кэша для свежих данных)
    const currentOrder = await fetchOrderById(Number(id), true)
    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    console.log(`🗑️ DELETE /api/orders/${id} - удаление заказа`, {
      order_status: currentOrder.order_status,
      user_id: currentOrder.user_id,
      loyalty_points_earned: currentOrder.loyalty_points_earned,
      "Loyalty Points Earned": (currentOrder as any)["Loyalty Points Earned"],
      loyalty_points_used: currentOrder.loyalty_points_used,
      "Loyalty Points Used": (currentOrder as any)["Loyalty Points Used"],
      paid: currentOrder.paid,
      payment_method: currentOrder.payment_method,
      allKeys: Object.keys(currentOrder).filter(k => k.toLowerCase().includes('loyalty') || k.toLowerCase().includes('points')),
    })

    // ✅ ДОБАВЛЕНО 2026-01-13: Проверка на дату доставки - нельзя отменить заказ на сегодня
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let orderDate: Date
    if (currentOrder.start_date) {
      orderDate = new Date(currentOrder.start_date)
    } else if ((currentOrder as any).delivery_date) {
      orderDate = new Date((currentOrder as any).delivery_date)
    } else {
      console.error(`⚠️ Заказ ${id} не имеет start_date или delivery_date`)
      return NextResponse.json({ 
        error: "Cannot determine order delivery date" 
      }, { status: 400 })
    }
    orderDate.setHours(0, 0, 0, 0)
    
    // Запрещаем отмену заказа на сегодняшний день или прошедшие даты
    if (orderDate.getTime() <= today.getTime()) {
      console.log(`❌ Попытка отменить заказ ${id} на дату ${orderDate.toISOString().split('T')[0]} (сегодня или прошлое)`)
      return NextResponse.json({ 
        error: "Cannot cancel order for today or past dates. Only future orders can be cancelled." 
      }, { status: 403 })
    }

    // Проверяем, не был ли заказ уже отменен
    const wasCancelled = currentOrder.order_status === "cancelled"

    // Обработка списания баллов при отмене заказа
    if (!wasCancelled && currentOrder.user_id) {
      try {
        const wasPaid = currentOrder.paid === true || currentOrder.payment_status === "paid"
        const paymentMethod = currentOrder.payment_method || (currentOrder as any)["Payment Method"]
        
        const pointsEarned = typeof currentOrder.loyalty_points_earned === 'number' 
          ? currentOrder.loyalty_points_earned 
          : parseInt(String(currentOrder.loyalty_points_earned)) || 0
        const pointsUsed = typeof currentOrder.loyalty_points_used === 'number'
          ? currentOrder.loyalty_points_used
          : parseInt(String(currentOrder.loyalty_points_used)) || 0
        const orderTotal = typeof currentOrder.total === 'number'
          ? currentOrder.total
          : parseFloat(String(currentOrder.total)) || 0
        
        // Если заказ был ОПЛАЧЕН - баллы уже начислены, возвращаем их
        if (wasPaid && (pointsEarned > 0 || pointsUsed > 0)) {
          // ✅ ИСПРАВЛЕНО: Получаем ВСЕ completed транзакции для этого заказа
          // Вместо использования pointsEarned из заказа, подсчитываем реальную сумму из транзакций
          try {
            const allTransactions = await fetchPendingTransactionsByOrder(Number(id))
            
            let actualPointsEarned = 0
            let actualPointsUsed = 0
            
            for (const trans of allTransactions) {
              const transPoints = typeof trans.points === 'number' ? trans.points : parseInt(String(trans.points)) || 0
              if (trans.transaction_type === 'earned' && trans.transaction_status === 'completed') {
                actualPointsEarned += transPoints
              } else if (trans.transaction_type === 'used' && trans.transaction_status === 'completed') {
                actualPointsUsed += Math.abs(transPoints) // used баллы отрицательные
              }
            }
            
            // Используем фактические значения из транзакций или fallback на поля заказа
            const finalPointsEarned = actualPointsEarned > 0 ? actualPointsEarned : pointsEarned
            const finalPointsUsed = actualPointsUsed > 0 ? actualPointsUsed : pointsUsed
            
            console.log(`💰 Заказ ${id} был ОПЛАЧЕН - возвращаем баллы`, {
              pointsEarnedFromOrder: pointsEarned,
              pointsUsedFromOrder: pointsUsed,
              actualPointsEarnedFromTransactions: actualPointsEarned,
              actualPointsUsedFromTransactions: actualPointsUsed,
              finalPointsEarned,
              finalPointsUsed,
              orderTotal,
              userId: currentOrder.user_id,
            })
            
            await refundLoyaltyPoints(
              currentOrder.user_id,
              finalPointsEarned,
              finalPointsUsed,
              orderTotal,
              Number(id)
            )
            console.log(`✅ Возвращено ${finalPointsEarned} начисленных и ${finalPointsUsed} использованных баллов`)
          } catch (error) {
            console.error(`❌ Ошибка при получении транзакций для возврата баллов:`, error)
            // Fallback на значения из заказа
            await refundLoyaltyPoints(
              currentOrder.user_id,
              pointsEarned,
              pointsUsed,
              orderTotal,
              Number(id)
            )
            console.log(`✅ Возвращено ${pointsEarned} начисленных и ${pointsUsed} использованных баллов (fallback)`)
          }
        } else if (!wasPaid) {
          // Заказ НЕ был оплачен - проверяем pending транзакции
          const pendingTransactions = await fetchPendingTransactionsByOrder(Number(id))
          console.log(`🔍 Заказ НЕ был оплачен. Найдено pending транзакций: ${pendingTransactions.length}`)
          
          if (pendingTransactions.length > 0) {
            // Отменяем pending транзакции
            console.log(`⏳ Отменяем ${pendingTransactions.length} pending транзакций`)
            
            const now = new Date().toISOString()
            for (const transaction of pendingTransactions) {
              await updateLoyaltyTransaction(transaction.Id, {
                transaction_status: 'cancelled',
                processed_at: now,
              })
            }
            
            console.log(`✅ Отменены pending транзакции для заказа ${id}`)
          } else {
            console.log(`ℹ️ Нет pending транзакций для неоплаченного заказа ${id}`)
          }
        }
        
        // Проверяем на мошенничество, если заказ был оплачен
        if (wasPaid) {
          console.log(`⚠️ Заказ ${id} был оплачен и отменен - проверяем на мошенничество`)
          
          try {
            const stats = await getUserCancellationStats(currentOrder.user_id)
            
            console.log(`📊 Статистика отмен для пользователя ${currentOrder.user_id}:`, stats)
            
            // Если отменено 3 или более оплаченных заказов, создаем fraud alert
            if (stats.cancelledPaidOrders >= 3) {
              console.warn(`🚨 Обнаружено подозрительное поведение: пользователь ${currentOrder.user_id} отменил ${stats.cancelledPaidOrders} оплаченных заказов`)
              
              await createFraudAlert(currentOrder.user_id, stats)
              
              console.log(`✅ Fraud alert создан для пользователя ${currentOrder.user_id}`)
            }
          } catch (error) {
            console.error(`❌ Ошибка при проверке на мошенничество:`, error)
            // Не прерываем процесс отмены заказа
          }
        }
      } catch (error) {
        console.error(`❌ Ошибка при списании баллов при отмене заказа:`, error)
        // Не прерываем процесс отмены заказа
      }
    }

    // Помечаем заказ как отмененный вместо удаления
    const updatedOrder = await updateOrder(Number(id), {
      order_status: "cancelled",
    })

    // Получаем обновленный баланс пользователя после всех операций (БЕЗ кэша!)
    let updatedUserBalance: number = 0
    if (currentOrder.user_id) {
      try {
        const updatedUser = await fetchUserById(currentOrder.user_id, true)
        if (updatedUser) {
          updatedUserBalance = typeof updatedUser.loyalty_points === 'number'
            ? updatedUser.loyalty_points
            : parseInt(String(updatedUser.loyalty_points)) || 0
          console.log(`💰 Обновленный баланс пользователя ${currentOrder.user_id}: ${updatedUserBalance} баллов`)
        }
      } catch (error) {
        console.error(`❌ Ошибка получения обновленного баланса:`, error)
      }
    }

    return NextResponse.json({ 
      success: true, 
      order: updatedOrder,
      updatedLoyaltyPoints: updatedUserBalance,
    })
  } catch (error) {
    console.error("Failed to cancel order:", error)
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 })
  }
}
