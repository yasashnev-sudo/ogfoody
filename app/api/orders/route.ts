import { NextResponse } from "next/server"
import {
  fetchOrdersByUser,
  createOrder,
  updateOrder,
  fetchOrderById,
  createOrderPerson,
  createOrderMeal,
  createOrderExtra,
  generateOrderNumber,
  calculateEarnedPoints,
  calculateDeliveryFee,
  awardLoyaltyPoints,
  createPendingLoyaltyPoints,
  fetchUserById,
  calculateUserBalance, // ✅ ДОБАВЛЕНО
} from "@/lib/nocodb"
import type { Order, Meal, PortionSize } from "@/lib/types"

// Заголовки для предотвращения кеширования на клиенте
const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
}

// GET /api/orders?userId=123
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const orderNumber = searchParams.get("orderNumber")

  try {
    // Если указан номер заказа, ищем по номеру
    if (orderNumber) {
      const { fetchOrderByNumber } = await import("@/lib/nocodb")
      const order = await fetchOrderByNumber(orderNumber)
      if (order) {
        return NextResponse.json({ orders: [order] }, { headers: noCacheHeaders })
      } else {
        return NextResponse.json({ orders: [], message: `Order with number ${orderNumber} not found` }, { headers: noCacheHeaders })
      }
    }

    // Если указан userId, возвращаем заказы пользователя С ПОЛНЫМИ ДЕТАЛЯМИ
    if (userId) {
      // Проверяем, существует ли пользователь (БЕЗ кэша для актуального баланса!)
      const user = await fetchUserById(Number(userId), true)
      if (!user) {
        console.warn(`⚠️ GET /api/orders - пользователь с User ID=${userId} не найден, возвращаем пустой массив`)
        return NextResponse.json({ orders: [] }, { headers: noCacheHeaders })
      }
      
      // ✅ ВСЕГДА загружаем детали заказов (persons, meals, extras) из БД
      console.log(`📦 Загрузка заказов С ДЕТАЛЯМИ для userId=${userId}...`)
      const { fetchOrdersWithDetails } = await import("@/lib/nocodb")
      const orders = await fetchOrdersWithDetails(Number(userId))
      
      // Возвращаем заказы вместе с профилем пользователя (включая актуальный баланс)
      return NextResponse.json({ 
        orders,
        userProfile: {
          id: user.Id,
          phone: user.phone,
          name: user.name,
          loyaltyPoints: user.loyalty_points, // Уже вычислен из транзакций в fetchUserById
          totalSpent: user.total_spent,
        }
      }, { headers: noCacheHeaders })
    }

    // Если ничего не указано, возвращаем ошибку
    return NextResponse.json({ error: "userId or orderNumber is required" }, { status: 400, headers: noCacheHeaders })
  } catch (error) {
    console.error("Failed to fetch orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500, headers: noCacheHeaders })
  }
}

// POST /api/orders - создание нового заказа
export async function POST(request: Request) {
  const { logRequest, logResponse } = await import("@/lib/request-logger")
  
  console.log("📥 POST /api/orders - получен запрос на создание заказа")
  logRequest("POST", "/api/orders")
  
  try {
    const body = await request.json()
    console.log("📦 Тело запроса:", JSON.stringify(body, null, 2))
    logRequest("POST", "/api/orders", { hasOrder: !!body.order, userId: body.userId })
    const { order, userId } = body as { order: Order; userId?: number }
    
    if (!order) {
      console.error("❌ Заказ не передан в запросе")
      return NextResponse.json({ error: "Order is required" }, { status: 400 })
    }
    
    console.log("✅ Заказ получен:", {
      hasPersons: !!order.persons?.length,
      personsCount: order.persons?.length || 0,
      hasExtras: !!order.extras?.length,
      extrasCount: order.extras?.length || 0,
      startDate: order.startDate,
      deliveryTime: order.deliveryTime,
      userId,
      userIdType: typeof userId,
      hasUserId: !!userId,
      orderTotal: order.total,
      orderSubtotal: order.subtotal,
      paid: order.paid,
      paymentStatus: order.paymentStatus,
      loyaltyPointsUsed: order.loyaltyPointsUsed,
      loyaltyPointsUsedType: typeof order.loyaltyPointsUsed,
      promoCode: order.promoCode,
      promoDiscount: order.promoDiscount,
    })
    
    // ВАЖНО: Проверяем, что userId передан и является числом
    if (userId && (typeof userId !== 'number' || isNaN(userId))) {
      console.error(`❌ ОШИБКА: userId должен быть числом, получено: ${userId} (тип: ${typeof userId})`)
    }

    // ✅ ВАЛИДАЦИЯ: Проверяем баланс баллов перед созданием заказа
    if (userId && order.loyaltyPointsUsed && order.loyaltyPointsUsed > 0) {
      try {
        // ✅ КРИТИЧНО: Используем noCache=true для получения СВЕЖЕГО баланса
        // Это учитывает все транзакции в реальном времени
        const currentBalance = await calculateUserBalance(userId, true)
        
        if (order.loyaltyPointsUsed > currentBalance) {
          console.error(`❌ ВАЛИДАЦИЯ: Недостаточно баллов!`, {
            requested: order.loyaltyPointsUsed,
            available: currentBalance,
            userId
          })
          return NextResponse.json({ 
            error: "Insufficient loyalty points",
            details: `Вы пытаетесь использовать ${order.loyaltyPointsUsed} баллов, но у вас только ${currentBalance}`,
            requested: order.loyaltyPointsUsed,
            available: currentBalance
          }, { status: 400 })
        }
        
        console.log(`✅ ВАЛИДАЦИЯ: Баланс баллов достаточен`, {
          requested: order.loyaltyPointsUsed,
          available: currentBalance,
          remaining: currentBalance - order.loyaltyPointsUsed
        })
      } catch (error) {
        console.error(`❌ Ошибка при валидации баллов:`, error)
        // Не прерываем процесс создания заказа, но логируем ошибку
      }
    }

    // ✅ ИСПРАВЛЕНО 2026-01-13: Проверяем, нет ли уже заказа на эту дату для этого пользователя
    if (userId) {
      // ✅ ИСПРАВЛЕНО 2026-01-13: Нормализуем дату заказа (берем только дату без времени)
      const orderStartDate = typeof order.startDate === "string" 
        ? order.startDate.split('T')[0]  // Берем только дату из строки
        : order.startDate.toISOString().split("T")[0]
      
      console.log(`🔍 Проверка существующего заказа на дату ${orderStartDate} для пользователя ${userId}...`)
      
      try {
        const existingOrders = await fetchOrdersByUser(userId)
        
        // ✅ ИСПРАВЛЕНО 2026-01-13: Детальное логирование для отладки
        console.log(`🔍 [ВАЛИДАЦИЯ] Проверка заказов на дату ${orderStartDate} для пользователя ${userId}`)
        console.log(`🔍 [ВАЛИДАЦИЯ] Всего заказов пользователя: ${existingOrders.length}`)
        console.log(`🔍 [ВАЛИДАЦИЯ] Входящая дата заказа: ${typeof order.startDate === "string" ? order.startDate : order.startDate.toISOString()}`)
        
        const existingOrderOnDate = existingOrders.find((o) => {
          // ✅ ИСПРАВЛЕНО 2026-01-13: Нормализуем дату существующего заказа (берем только дату без времени)
          const oDateRaw = o.start_date || o["Start Date"] || ''
          const oDate = typeof oDateRaw === 'string' 
            ? oDateRaw.split('T')[0]  // Берем только дату из строки
            : new Date(oDateRaw).toISOString().split('T')[0]
          
          const orderStatus = o.order_status || o["Order Status"] || 'pending'
          const isCancelled = orderStatus === 'cancelled'
          
          // ✅ ИСПРАВЛЕНО 2026-01-13: Логируем каждый заказ для отладки (все заказы, не только совпадающие)
          console.log(`🔍 [ВАЛИДАЦИЯ] Заказ ${o.Id}: дата=${oDate}, статус=${orderStatus}, отменен=${isCancelled}, совпадает=${oDate === orderStartDate}`)
          
          // ✅ ИСПРАВЛЕНО 2026-01-13: Учитываем только неотмененные заказы
          return oDate === orderStartDate && !isCancelled
        })
        
        if (existingOrderOnDate) {
          const orderStatus = existingOrderOnDate.order_status || existingOrderOnDate["Order Status"] || 'pending'
          const orderNumber = existingOrderOnDate.order_number || existingOrderOnDate["Order Number"]
          
          console.warn(`⚠️ ВАЛИДАЦИЯ: На дату ${orderStartDate} уже есть активный заказ:`, {
            orderId: existingOrderOnDate.Id,
            orderNumber,
            orderStatus,
            paid: existingOrderOnDate.paid || existingOrderOnDate["Paid"],
          })
          
          return NextResponse.json({ 
            error: "Order already exists for this date",
            details: `На эту дату (${orderStartDate}) у вас уже есть активный заказ (${orderNumber}). Отмените существующий заказ или выберите другую дату.`,
            existingOrderId: existingOrderOnDate.Id,
            existingOrderNumber: orderNumber,
            date: orderStartDate
          }, { status: 400 })
        }
        
        console.log(`✅ Валидация: На дату ${orderStartDate} нет активного заказа, можно создавать`)
      } catch (error) {
        console.error(`❌ Ошибка при проверке существующего заказа:`, error)
        // Не прерываем процесс создания заказа, но логируем ошибку
      }
    }

    // Генерация номера заказа
    const orderNumber = generateOrderNumber()
    console.log("Generated order number:", orderNumber)

    // Создание заказа в NocoDB
    // Если userId передан, но пользователя нет в базе, создаем заказ без user_id
    const now = new Date().toISOString()
    const orderData = {
      user_id: userId ?? undefined, // Используем ?? вместо || чтобы 0 не превращался в undefined
      order_number: orderNumber,
      start_date: typeof order.startDate === "string" ? order.startDate : order.startDate.toISOString().split("T")[0],
      delivery_time: order.deliveryTime,
      
      // Новые статусы оплаты
      // Определяем статус оплаты: если явно указан paymentStatus, используем его, иначе на основе paid
      payment_status: order.paymentStatus || (order.paid === true || String(order.paid).toLowerCase() === 'true' ? "paid" : "pending"),
      payment_method: order.paymentMethod || "cash",
      paid: order.paid === true || String(order.paid).toLowerCase() === 'true' || order.paymentStatus === 'paid' || String(order.paymentStatus).toLowerCase() === 'paid',
      paid_at: order.paidAt || (order.paid ? now : undefined),
      payment_id: order.paymentId || undefined,
      
      // Новый статус заказа
      order_status: "pending" as const, // По умолчанию "в обработке"
      
      // УДАЛЕНО: delivered, cancelled, status - статусы доставки убраны
      
      promo_code: order.promoCode,
      promo_discount: order.promoDiscount,
      loyalty_points_used: order.loyaltyPointsUsed || 0,
      loyalty_points_earned: order.loyaltyPointsEarned || 0,
      subtotal: order.subtotal || 0,
      total: order.total || 0,
      guest_phone: order.guestPhone,
      guest_address: order.guestAddress,
      created_at: now,
      updated_at: now,
    }
    console.log("Creating order with data:", orderData)
    
    let nocoOrder
    try {
      nocoOrder = await createOrder(orderData)
      console.log("✅ Created NocoDB order - full response:", JSON.stringify(nocoOrder, null, 2))
      
      // ✅ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Перезагружаем заказ из БД, чтобы получить актуальные значения paid и payment_status
      if (nocoOrder?.Id) {
        const reloadedOrder = await fetchOrderById(nocoOrder.Id, true)
        if (reloadedOrder) {
          console.log("🔄 Перезагруженный заказ из БД:", JSON.stringify(reloadedOrder, null, 2))
          console.log("🔍 КРИТИЧНО: reloadedOrder.paid =", reloadedOrder.paid, "тип:", typeof reloadedOrder.paid)
          console.log("🔍 КРИТИЧНО: reloadedOrder.payment_status =", reloadedOrder.payment_status)
          nocoOrder = reloadedOrder
        }
      }
    } catch (error) {
      console.error("❌ Failed to create order in NocoDB:", error)
      throw error
    }
    
    // createOrder теперь автоматически получает полный объект с order_number
    // Используем номер из ответа NocoDB, если есть, иначе используем сгенерированный
    // Поддерживаем оба варианта названий колонок (snake_case и title)
    const orderNumberFromResponse = (nocoOrder as any)?.order_number ?? (nocoOrder as any)?.["Order Number"]
    let finalOrderNumber = orderNumberFromResponse || orderNumber
    
    if (!orderNumberFromResponse) {
      console.warn(`⚠️ Order number missing in response, using generated: ${orderNumber}`)
      console.log("Order response keys:", nocoOrder ? Object.keys(nocoOrder) : [])
      console.log("Full order response:", JSON.stringify(nocoOrder, null, 2))
    } else {
      console.log(`✅ Order created successfully with order_number: ${orderNumberFromResponse}`)
    }

    // Создание персон и блюд
    if (!order.persons || order.persons.length === 0) {
      // ✅ ДОБАВЛЕНО 2026-01-11: Улучшенная проверка наличия persons
      console.error("❌ КРИТИЧЕСКАЯ ОШИБКА: Заказ не содержит персон!")
      return NextResponse.json(
        {
          error: "Invalid order data",
          message: "Заказ не содержит данных о блюдах",
          details: "Пожалуйста, добавьте хотя бы одно блюдо в заказ"
        },
        { status: 400 }
      )
    } else {
      console.log(`📝 Creating ${order.persons.length} persons for order ${nocoOrder.Id}`)
    }
    
    // Подсчет общей стоимости заказа
    let calculatedTotal = 0
    
    console.log(`📊 Начинаем подсчет стоимости заказа, персон: ${order.persons?.length || 0}`)
    
    for (const person of order.persons || []) {
      console.log(`  Creating person ${person.id} for order ${nocoOrder.Id}`)
      let nocoOrderPerson
      try {
        nocoOrderPerson = await createOrderPerson({
          order_id: nocoOrder.Id,
          person_number: person.id,
        })
        console.log(`  ✅ Created OrderPerson:`, JSON.stringify(nocoOrderPerson, null, 2))
      } catch (error) {
        console.error(`  ❌ Failed to create OrderPerson:`, error)
        // Не прерываем процесс - заказ уже создан, продолжаем с другими персонами
        console.warn(`  ⚠️ Пропускаем персону ${person.id} из-за ошибки, продолжаем...`)
        continue
      }

      // Сохранение блюд для каждого дня
      for (const day of ["day1", "day2"] as const) {
        const dayMeals = person[day]
        if (!dayMeals) continue

        // Завтрак
        if (dayMeals.breakfast?.dish) {
          try {
            const mealCost = await saveMeal(nocoOrderPerson.Id, day, "breakfast", "dish", dayMeals.breakfast.dish)
            calculatedTotal += mealCost
          } catch (error) {
            console.error(`  ❌ Failed to save breakfast meal:`, error)
            // Продолжаем, не прерываем весь процесс
          }
        }

        // Обед
        if (dayMeals.lunch) {
          if (dayMeals.lunch.salad) {
            try {
              const mealCost = await saveMeal(nocoOrderPerson.Id, day, "lunch", "salad", dayMeals.lunch.salad)
              calculatedTotal += mealCost
            } catch (error) {
              console.error(`  ❌ Failed to save lunch salad:`, error)
            }
          }
          if (dayMeals.lunch.soup) {
            try {
              const mealCost = await saveMeal(nocoOrderPerson.Id, day, "lunch", "soup", dayMeals.lunch.soup)
              calculatedTotal += mealCost
            } catch (error) {
              console.error(`  ❌ Failed to save lunch soup:`, error)
            }
          }
          if (dayMeals.lunch.main) {
            try {
              const mealCost = await saveMeal(nocoOrderPerson.Id, day, "lunch", "main", dayMeals.lunch.main)
              calculatedTotal += mealCost
            } catch (error) {
              console.error(`  ❌ Failed to save lunch main:`, error)
            }
          }
        }

        // Ужин
        if (dayMeals.dinner) {
          if (dayMeals.dinner.salad) {
            try {
              const mealCost = await saveMeal(nocoOrderPerson.Id, day, "dinner", "salad", dayMeals.dinner.salad)
              calculatedTotal += mealCost
            } catch (error) {
              console.error(`  ❌ Failed to save dinner salad:`, error)
            }
          }
          if (dayMeals.dinner.soup) {
            try {
              const mealCost = await saveMeal(nocoOrderPerson.Id, day, "dinner", "soup", dayMeals.dinner.soup)
              calculatedTotal += mealCost
            } catch (error) {
              console.error(`  ❌ Failed to save dinner soup:`, error)
            }
          }
          if (dayMeals.dinner.main) {
            try {
              const mealCost = await saveMeal(nocoOrderPerson.Id, day, "dinner", "main", dayMeals.dinner.main)
              calculatedTotal += mealCost
            } catch (error) {
              console.error(`  ❌ Failed to save dinner main:`, error)
            }
          }
        }
      }
    }

    // Сохранение дополнений
    if (order.extras && order.extras.length > 0) {
      console.log(`📦 Creating ${order.extras.length} extras for order ${nocoOrder.Id}`)
      for (const extra of order.extras) {
        // ✅ ИСПРАВЛЕНИЕ: Проверяем наличие extra.id перед созданием
        if (!extra.id) {
          console.error(`  ❌ Extra без ID:`, JSON.stringify(extra, null, 2))
          console.warn(`  ⚠️ Пропускаем дополнение без ID, продолжаем...`)
          continue
        }
        
        console.log(`  Creating extra ${extra.id} (qty: ${extra.quantity}, price: ${extra.price})`)
        try {
          const result = await createOrderExtra({
            order_id: nocoOrder.Id,
            extra_id: extra.id,
            quantity: extra.quantity,
            price: extra.price,
          })
          console.log(`  ✅ Created OrderExtra:`, JSON.stringify(result, null, 2))
          calculatedTotal += (extra.quantity * extra.price)
        } catch (error) {
          console.error(`  ❌ Failed to create OrderExtra:`, error)
          // Продолжаем, не прерываем весь процесс
          console.warn(`  ⚠️ Пропускаем дополнение ${extra.id} из-за ошибки, продолжаем...`)
        }
      }
    }
    
    // Обновляем заказ с рассчитанной суммой
    console.log(`💰 Calculated order total: ${calculatedTotal}`)
    
    // 🔴 КРИТИЧЕСКАЯ ЗАЩИТА: Минимальная сумма заказа 1000₽
    const MIN_ORDER_AMOUNT = 1000
    if (calculatedTotal < MIN_ORDER_AMOUNT) {
      console.error(`❌ Попытка создать заказ на ${calculatedTotal}₽ (минимум: ${MIN_ORDER_AMOUNT}₽)`)
      return NextResponse.json(
        { 
          error: "Order amount too low",
          message: `Минимальная сумма заказа: ${MIN_ORDER_AMOUNT}₽`,
          details: `Ваша сумма: ${calculatedTotal}₽. Добавьте еще блюд на ${MIN_ORDER_AMOUNT - calculatedTotal}₽`,
          minimumAmount: MIN_ORDER_AMOUNT,
          currentAmount: calculatedTotal,
          shortfall: MIN_ORDER_AMOUNT - calculatedTotal
        },
        { status: 400 }
      )
    }
    
    // 🔴 КРИТИЧЕСКАЯ ЗАЩИТА: Начисление баллов только если total > 0
    if (calculatedTotal <= 0) {
      console.warn(`⚠️ Попытка создать заказ с нулевой/отрицательной суммой: ${calculatedTotal}₽`)
      return NextResponse.json(
        { 
          error: "Invalid order amount",
          message: "Сумма заказа должна быть больше 0₽",
          currentAmount: calculatedTotal
        },
        { status: 400 }
      )
    }
    
    // 🆕 РАСЧЕТ СТОИМОСТИ ДОСТАВКИ
    let deliveryFee = 0
    let deliveryDistrict = ""
    let deliveryAddress = ""
    
    if (userId) {
      const user = await fetchUserById(userId)
      if (user) {
        // 🔍 ПОДРОБНОЕ ЛОГИРОВАНИЕ ДЛЯ ОТЛАДКИ ДОСТАВКИ
        console.log(`🔍 [DELIVERY DEBUG] User object keys:`, Object.keys(user))
        console.log(`🔍 [DELIVERY DEBUG] District fields:`, {
          'District': user.District,
          'district': user.district,
          'Street': user.Street,
          'street': user.street,
          'Building': user.Building,
          'building': user.building,
          'Apartment': user.Apartment,
          'apartment': user.apartment,
        })
        
        deliveryDistrict = user.District || user.district || ""
        
        // Формируем полный адрес
        const street = user.Street || user.street || ""
        const building = user.Building || user.building || ""
        const apartment = user.Apartment || user.apartment || ""
        deliveryAddress = `${street}, д. ${building}${apartment ? ', кв. ' + apartment : ''}`
        
        console.log(`🔍 [DELIVERY DEBUG] Extracted values:`, {
          deliveryDistrict,
          street,
          building,
          apartment,
          deliveryAddress
        })
        
        // Рассчитываем стоимость доставки
        if (calculatedTotal < 2300) {
          deliveryFee = await calculateDeliveryFee(deliveryDistrict, calculatedTotal)
          console.log(`🚚 Доставка: ${deliveryFee}₽ (район: ${deliveryDistrict}, сумма: ${calculatedTotal}₽)`)
        } else {
          console.log(`✅ Бесплатная доставка: сумма заказа ${calculatedTotal}₽ >= 2300₽`)
        }
      } else {
        console.log(`❌ [DELIVERY DEBUG] User not found for userId=${userId}`)
      }
    } else {
      console.log(`❌ [DELIVERY DEBUG] No userId provided`)
    }
    
    // Итоговая сумма с доставкой
    // ✅ ИСПРАВЛЕНО: Учитываем промокод при расчете итоговой суммы
    const promoDiscount = order.promoDiscount || 0
    const finalTotal = calculatedTotal + deliveryFee - promoDiscount
    console.log(`💰 Итоговая сумма: ${calculatedTotal}₽ + ${deliveryFee}₽ (доставка) - ${promoDiscount}₽ (промокод) = ${finalTotal}₽`)
    
    if (finalTotal > 0) {
      try {
        await updateOrder(nocoOrder.Id, {
          subtotal: calculatedTotal,
          total: finalTotal,
          delivery_fee: deliveryFee,
          delivery_district: deliveryDistrict,
          delivery_address: deliveryAddress,
          promo_code: order.promoCode,
          promo_discount: promoDiscount,
        })
        console.log(`✅ Updated order ${nocoOrder.Id} with total: ${finalTotal}₽ (subtotal: ${calculatedTotal}₽, delivery: ${deliveryFee}₽)`)
        // Обновляем локальную копию заказа
        nocoOrder.total = finalTotal
        nocoOrder.subtotal = calculatedTotal
        nocoOrder.delivery_fee = deliveryFee
        nocoOrder.delivery_district = deliveryDistrict
        nocoOrder.delivery_address = deliveryAddress
      } catch (error) {
        console.error(`❌ Failed to update order total:`, error)
      }
    }

    // Начисление баллов лояльности при создании заказа
    // Баллы начисляются сразу при создании заказа (независимо от способа оплаты)
    // При отмене неоплаченного заказа баллы будут списаны
    let actualPointsEarned = order.loyaltyPointsEarned || 0
    
    console.log(`\n🔍 ========== НАЧАЛО ОТЛАДКИ НАЧИСЛЕНИЯ БАЛЛОВ (POST) ==========`)
    console.log(`🔍 [POST] 1️⃣ Входящий payload:`, {
      'order.loyaltyPointsUsed': order.loyaltyPointsUsed,
      'order.loyaltyPointsEarned': order.loyaltyPointsEarned,
      'order.paymentMethod': order.paymentMethod,
      'order.paid': order.paid,
      'order.paymentStatus': order.paymentStatus,
      'order.subtotal': order.subtotal,
      'order.total': order.total,
      userId,
    })
    
    // ✅ ИСПРАВЛЕНО: Используем finalTotal (с доставкой и промокодом) из обновленного заказа в БД
    // nocoOrder.total был обновлен в строках 509-515 после расчета finalTotal
    // finalTotal уже учитывает промокод: calculatedTotal + deliveryFee - promoDiscount
    const orderTotal = nocoOrder.total || finalTotal || calculatedTotal
    
    console.log(`🔍 [POST] 2️⃣ Рассчитанные суммы:`, {
      calculatedTotal: calculatedTotal,
      deliveryFee: deliveryFee,
      finalTotal: finalTotal,
      'nocoOrder.total': nocoOrder.total,
      orderTotal: orderTotal,
    })
    
    console.log(`🔍 [POST] 3️⃣ Способ оплаты:`, {
      paymentMethod: order.paymentMethod,
      hasPaymentMethod: !!order.paymentMethod,
    })
    
    console.log(`🔍 Проверка начисления баллов:`, {
      hasUserId: !!userId,
      userId: userId,
      calculatedTotal,
      deliveryFee,
      finalTotal,
      'nocoOrder.total': nocoOrder.total,
      orderTotal,
    })
    
    if (userId) {
      try {
        console.log(`🔍 Поиск пользователя с userId=${userId} для начисления баллов`)
        // ✅ ИСПРАВЛЕНО: Всегда загружаем свежие данные без кэша
        const user = await fetchUserById(userId, true)
        if (user) {
          console.log(`✅ Пользователь найден:`, {
            userId: user.Id,
            loyaltyPoints: user.loyalty_points,
            totalSpent: user.total_spent,
          })
          
          const pointsUsed = order.loyaltyPointsUsed || 0
          const currentTotalSpent = typeof user.total_spent === 'number' ? user.total_spent : parseFloat(String(user.total_spent)) || 0
          
          // ✅ Приводим orderTotal к числу для избежания ошибок типов
          // ✅ ИСПРАВЛЕНО: Учитываем промокод при расчете orderTotal для начисления баллов
          let orderTotalNum = typeof orderTotal === 'number' ? orderTotal : parseFloat(String(orderTotal)) || 0
          
          // ✅ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Если orderTotal не учитывает промокод, пересчитываем
          const promoDiscount = order.promoDiscount || 0
          if (promoDiscount > 0 && orderTotalNum > 0) {
            const subtotal = order.subtotal || calculatedTotal || 0
            const deliveryFee = nocoOrder.delivery_fee || (nocoOrder as any)['Delivery Fee'] || 0
            const expectedTotal = subtotal + deliveryFee - promoDiscount
            // Если текущий total не совпадает с ожидаемым (с учетом промокода), используем ожидаемый
            if (Math.abs(orderTotalNum - expectedTotal) > 0.01) {
              console.log(`⚠️ [POST] orderTotal не учитывает промокод, пересчитываем для начисления баллов: ${orderTotalNum} → ${expectedTotal}`)
              orderTotalNum = expectedTotal
            }
          }
          
          console.log(`📊 Данные для расчета баллов:`, {
            orderTotal: orderTotalNum,
            promoDiscount,
            pointsUsed,
            currentTotalSpent,
            loyaltyLevel: currentTotalSpent >= 50000 ? "gold" : currentTotalSpent >= 20000 ? "silver" : "bronze",
          })
          
          // ✅ СПИСАНИЕ БАЛЛОВ: Создаем транзакцию на списание СРАЗУ, если баллы использованы
          // Это должно происходить НЕЗАВИСИМО от того, будут ли начислены баллы
          if (pointsUsed > 0) {
            try {
              const now = new Date().toISOString()
              const { createLoyaltyPointsTransaction } = await import("@/lib/nocodb")
              
              await createLoyaltyPointsTransaction({
                user_id: userId,
                order_id: nocoOrder.Id,
                transaction_type: "used",
                transaction_status: "completed",
                points: -pointsUsed,
                description: `Использовано ${pointsUsed} баллов для оплаты заказа`,
                created_at: now,
                updated_at: now,
                processed_at: now,
              })
              
              console.log(`✅ СПИСАНИЕ: Создана транзакция на списание ${pointsUsed} баллов для заказа ${nocoOrder.Id}`)
            } catch (error) {
              console.error(`❌ Ошибка при создании транзакции на списание баллов:`, error)
              // Не прерываем процесс, но логируем ошибку
            }
          }
          
          // Проверяем, что сумма заказа больше 0
          if (orderTotalNum <= 0) {
            console.warn(`⚠️ Сумма заказа равна 0 или отрицательная: ${orderTotalNum}. Баллы не будут начислены.`)
            actualPointsEarned = 0
          } else {
            // Рассчитываем начисляемые баллы
            // ВАЖНО: Используем currentTotalSpent БЕЗ учета текущего заказа для правильного расчета уровня
            console.log(`🔍 [POST] 4️⃣ Вызов calculateEarnedPoints с параметрами:`, {
              orderTotalNum,
              pointsUsed,
              currentTotalSpent,
            })
            actualPointsEarned = calculateEarnedPoints(orderTotalNum, pointsUsed, currentTotalSpent)
            
            console.log(`🔍 [POST] 5️⃣ Результат calculateEarnedPoints:`, {
              actualPointsEarned,
            })
            
            console.log(`💰 Рассчитано баллов: ${actualPointsEarned}`)
            console.log(`🔍 [POST] КРИТИЧНО: actualPointsEarned = ${actualPointsEarned}, orderTotalNum = ${orderTotalNum}, currentTotalSpent = ${currentTotalSpent}`)
            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/2c31366c-6760-48ba-a8ce-4df6b54fcb0f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'orders/route.ts:659',message:'Points calculated',data:{actualPointsEarned,orderTotalNum,pointsUsed,currentTotalSpent},timestamp:Date.now(),sessionId:'debug-session',runId:'loyalty-points-debug',hypothesisId:'H3'})}).catch(()=>{});
            // #endregion
            
            // Проверяем, не были ли баллы уже начислены для этого заказа
            const existingPointsEarned = typeof nocoOrder.loyalty_points_earned === 'number' 
              ? nocoOrder.loyalty_points_earned 
              : parseInt(String(nocoOrder.loyalty_points_earned)) || 0
            
            if (existingPointsEarned > 0) {
              // #region agent log
              fetch('http://127.0.0.1:7243/ingest/2c31366c-6760-48ba-a8ce-4df6b54fcb0f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'orders/route.ts:666',message:'Points already earned',data:{existingPointsEarned,orderId:nocoOrder.Id},timestamp:Date.now(),sessionId:'debug-session',runId:'loyalty-points-debug',hypothesisId:'H3'})}).catch(()=>{});
              // #endregion
              console.warn(`⚠️ Баллы уже начислены для заказа ${nocoOrder.Id}: ${existingPointsEarned}. Пропускаем начисление.`)
              actualPointsEarned = existingPointsEarned
            } else if (actualPointsEarned > 0) {
              // ✅ ИСПРАВЛЕНО 2026-01-11: Начисляем баллы только если указан способ оплаты
              // Проверяем также значения из БД (nocoOrder), так как они могут отличаться от order
              const dbPaid = nocoOrder.paid === true || String(nocoOrder.paid).toLowerCase() === 'true'
              const dbPaymentStatus = nocoOrder.payment_status === 'paid' || String(nocoOrder.payment_status).toLowerCase() === 'paid'
              // #region agent log
              fetch('http://127.0.0.1:7243/ingest/2c31366c-6760-48ba-a8ce-4df6b54fcb0f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'orders/route.ts:669',message:'Checking loyalty points award conditions',data:{hasPaymentMethod:!!order.paymentMethod,paymentMethod:order.paymentMethod,paid:order.paid,paidType:typeof order.paid,paymentStatus:order.paymentStatus,paymentStatusType:typeof order.paymentStatus,dbPaid,dbPaymentStatus,nocoOrderPaid:nocoOrder.paid,nocoOrderPaymentStatus:nocoOrder.payment_status,actualPointsEarned},timestamp:Date.now(),sessionId:'debug-session',runId:'loyalty-points-debug',hypothesisId:'H1'})}).catch(()=>{});
              // #endregion
              console.log(`🔍 [POST] 6️⃣ Проверка условий начисления баллов:`, {
                hasPaymentMethod: !!order.paymentMethod,
                paymentMethod: order.paymentMethod,
                paid: order.paid,
                paidType: typeof order.paid,
                paidString: String(order.paid),
                paymentStatus: order.paymentStatus,
                paymentStatusType: typeof order.paymentStatus,
                paymentStatusString: String(order.paymentStatus),
                dbPaid,
                dbPaymentStatus,
                nocoOrderPaid: nocoOrder.paid,
                nocoOrderPaymentStatus: nocoOrder.payment_status,
                actualPointsEarned,
              })
              
              if (!order.paymentMethod) {
                // #region agent log
                fetch('http://127.0.0.1:7243/ingest/2c31366c-6760-48ba-a8ce-4df6b54fcb0f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'orders/route.ts:677',message:'Condition failed: no payment method',data:{paymentMethod:order.paymentMethod},timestamp:Date.now(),sessionId:'debug-session',runId:'loyalty-points-debug',hypothesisId:'H1'})}).catch(()=>{});
                // #endregion
                console.log(`🔍 [POST] ❌ Условие НЕ выполнено: Способ оплаты не указан - баллы будут начислены при оплате`)
                console.log(`ℹ️ Способ оплаты не указан - баллы будут начислены при оплате`)
                actualPointsEarned = 0 // Сбрасываем, чтобы не записать в БД
              } else if ((order.paymentMethod === 'card' || order.paymentMethod === 'sbp')) {
                // Проверяем условие оплаты более тщательно
                // Используем значения из БД (nocoOrder), так как они могут отличаться от order
                const isPaidBool = order.paid === true || String(order.paid).toLowerCase() === 'true' || dbPaid
                const isPaymentStatusPaid = order.paymentStatus === 'paid' || String(order.paymentStatus).toLowerCase() === 'paid' || dbPaymentStatus
                const isPaid = isPaidBool || isPaymentStatusPaid
                
                // #region agent log
                fetch('http://127.0.0.1:7243/ingest/2c31366c-6760-48ba-a8ce-4df6b54fcb0f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'orders/route.ts:690',message:'Checking payment condition for card/sbp',data:{paymentMethod:order.paymentMethod,paid:order.paid,paidType:typeof order.paid,isPaidBool,paymentStatus:order.paymentStatus,isPaymentStatusPaid,isPaid},timestamp:Date.now(),sessionId:'debug-session',runId:'loyalty-points-debug',hypothesisId:'H1'})}).catch(()=>{});
                // #endregion
                
                if (isPaid) {
                // ✅ ИСПРАВЛЕНО: Онлайн-оплата И заказ оплачен - начисляем сразу
                // #region agent log
                fetch('http://127.0.0.1:7243/ingest/2c31366c-6760-48ba-a8ce-4df6b54fcb0f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'orders/route.ts:682',message:'Condition met: calling awardLoyaltyPoints',data:{userId,orderTotalNum,actualPointsEarned,orderId:nocoOrder.Id,paymentMethod:order.paymentMethod,paid:order.paid,paymentStatus:order.paymentStatus},timestamp:Date.now(),sessionId:'debug-session',runId:'loyalty-points-debug',hypothesisId:'H2'})}).catch(()=>{});
                // #endregion
                console.log(`🔍 [POST] ✅ Условие выполнено: Онлайн-оплата (${order.paymentMethod}) И заказ оплачен (paid=${order.paid}, paymentStatus=${order.paymentStatus})`)
                console.log(`💳 Онлайн-оплата: начисление баллов сразу`)
                
                console.log(`🔍 [POST] 7️⃣ Вызов awardLoyaltyPoints с параметрами:`, {
                  userId,
                  orderTotalNum,
                  pointsUsed: 0,
                  actualPointsEarned,
                  orderId: nocoOrder.Id,
                })
                
                // ✅ ИСПРАВЛЕНО: НЕ передаем pointsUsed, так как списание уже произошло выше
                try {
                  // #region agent log
                  fetch('http://127.0.0.1:7243/ingest/2c31366c-6760-48ba-a8ce-4df6b54fcb0f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'orders/route.ts:695',message:'Before awardLoyaltyPoints call',data:{userId,orderTotalNum,actualPointsEarned,orderId:nocoOrder.Id},timestamp:Date.now(),sessionId:'debug-session',runId:'loyalty-points-debug',hypothesisId:'H2'})}).catch(()=>{});
                  // #endregion
                  await awardLoyaltyPoints(userId, orderTotalNum, 0, actualPointsEarned, nocoOrder.Id)
                  // #region agent log
                  fetch('http://127.0.0.1:7243/ingest/2c31366c-6760-48ba-a8ce-4df6b54fcb0f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'orders/route.ts:697',message:'After awardLoyaltyPoints call',data:{userId,orderTotalNum,actualPointsEarned,orderId:nocoOrder.Id},timestamp:Date.now(),sessionId:'debug-session',runId:'loyalty-points-debug',hypothesisId:'H2'})}).catch(()=>{});
                  // #endregion
                  console.log(`🔍 [POST] 8️⃣ Результат awardLoyaltyPoints: успешно`)
                  console.log(`✅ Начислено ${actualPointsEarned} баллов пользователю ${userId} за заказ ${nocoOrder.Id}`)
                  
                  // ✅ Проверяем обновленный профиль
                  const updatedUserAfterAward = await fetchUserById(userId, true)
                  // #region agent log
                  fetch('http://127.0.0.1:7243/ingest/2c31366c-6760-48ba-a8ce-4df6b54fcb0f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'orders/route.ts:702',message:'User profile after awardLoyaltyPoints',data:{userId:updatedUserAfterAward?.Id,loyaltyPoints:updatedUserAfterAward?.loyalty_points,totalSpent:updatedUserAfterAward?.total_spent},timestamp:Date.now(),sessionId:'debug-session',runId:'loyalty-points-debug',hypothesisId:'H4'})}).catch(()=>{});
                  // #endregion
                  console.log(`🔍 Проверка профиля после awardLoyaltyPoints:`, {
                    userId: updatedUserAfterAward?.Id,
                    loyaltyPoints: updatedUserAfterAward?.loyalty_points,
                    totalSpent: updatedUserAfterAward?.total_spent,
                  })
                } catch (error: any) {
                  // #region agent log
                  fetch('http://127.0.0.1:7243/ingest/2c31366c-6760-48ba-a8ce-4df6b54fcb0f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'orders/route.ts:710',message:'Error in awardLoyaltyPoints',data:{error:String(error),errorStack:error instanceof Error ? error.stack : undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'loyalty-points-debug',hypothesisId:'H2'})}).catch(()=>{});
                  // #endregion
                  console.error(`❌ Ошибка при начислении баллов:`, error)
                    throw error
                  }
                } else {
                  // #region agent log
                  fetch('http://127.0.0.1:7243/ingest/2c31366c-6760-48ba-a8ce-4df6b54fcb0f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'orders/route.ts:742',message:'Card/SBP but not paid - creating pending',data:{paymentMethod:order.paymentMethod,paid:order.paid,paidType:typeof order.paid,paymentStatus:order.paymentStatus,paymentStatusType:typeof order.paymentStatus,isPaidBool,isPaymentStatusPaid,isPaid},timestamp:Date.now(),sessionId:'debug-session',runId:'loyalty-points-debug',hypothesisId:'H1'})}).catch(()=>{});
                  // #endregion
                  console.log(`🔍 [POST] ⚠️ Онлайн-оплата, но заказ не оплачен - создаем pending транзакцию`)
                  console.log(`🔍 [POST] ДЕТАЛИ: paid=${order.paid} (${typeof order.paid}), paymentStatus=${order.paymentStatus} (${typeof order.paymentStatus}), isPaidBool=${isPaidBool}, isPaymentStatusPaid=${isPaymentStatusPaid}, isPaid=${isPaid}`)
                  await createPendingLoyaltyPoints(userId, orderTotalNum, 0, actualPointsEarned, nocoOrder.Id)
                }
              } else if (order.paymentMethod === 'cash' && !order.paid) {
                // ✅ ИСПРАВЛЕНО: Наличные И заказ НЕ оплачен - создаем pending транзакцию
                console.log(`🔍 [POST] ✅ Условие выполнено: Оплата наличными И заказ не оплачен`)
                console.log(`💵 Оплата наличными: создание pending транзакции`)
                
                console.log(`🔍 [POST] 7️⃣ Вызов createPendingLoyaltyPoints с параметрами:`, {
                  userId,
                  orderTotalNum,
                  pointsUsed: 0,
                  actualPointsEarned,
                  orderId: nocoOrder.Id,
                })
                
                // ✅ ИСПРАВЛЕНО: НЕ передаем pointsUsed, так как списание уже произошло выше
                await createPendingLoyaltyPoints(userId, orderTotalNum, 0, actualPointsEarned, nocoOrder.Id)
                
                console.log(`🔍 [POST] 8️⃣ Результат createPendingLoyaltyPoints: успешно`)
                console.log(`⏳ Pending: ${actualPointsEarned} баллов будут начислены на следующий день после доставки`)
              } else {
                // Неизвестный способ оплаты или условие не выполнено - для безопасности делаем pending
                // #region agent log
                fetch('http://127.0.0.1:7243/ingest/2c31366c-6760-48ba-a8ce-4df6b54fcb0f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'orders/route.ts:768',message:'Unknown payment method or condition not met',data:{paymentMethod:order.paymentMethod,paid:order.paid,paymentStatus:order.paymentStatus},timestamp:Date.now(),sessionId:'debug-session',runId:'loyalty-points-debug',hypothesisId:'H1'})}).catch(()=>{});
                // #endregion
                console.log(`🔍 [POST] ⚠️ Условие: Неизвестный способ оплаты (${order.paymentMethod})`)
                console.log(`❓ Неизвестный способ оплаты (${order.paymentMethod}): создание pending транзакции`)
                
                console.log(`🔍 [POST] 7️⃣ Вызов createPendingLoyaltyPoints с параметрами:`, {
                  userId,
                  orderTotalNum,
                  pointsUsed: 0,
                  actualPointsEarned,
                  orderId: nocoOrder.Id,
                })
                
                // ✅ ИСПРАВЛЕНО: НЕ передаем pointsUsed, так как списание уже произошло выше
                await createPendingLoyaltyPoints(userId, orderTotalNum, 0, actualPointsEarned, nocoOrder.Id)
                
                console.log(`🔍 [POST] 8️⃣ Результат createPendingLoyaltyPoints: успешно`)
                console.log(`⏳ Pending: ${actualPointsEarned} баллов будут начислены на следующий день после доставки`)
              }
            } else {
              // #region agent log
              fetch('http://127.0.0.1:7243/ingest/2c31366c-6760-48ba-a8ce-4df6b54fcb0f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'orders/route.ts:775',message:'No points earned: actualPointsEarned is 0 or negative',data:{actualPointsEarned,orderTotalNum,pointsUsed,currentTotalSpent},timestamp:Date.now(),sessionId:'debug-session',runId:'loyalty-points-debug',hypothesisId:'H3'})}).catch(()=>{});
              // #endregion
              console.log(`🔍 [POST] ❌ Баллы не начислены: actualPointsEarned = ${actualPointsEarned}`)
              console.log(`ℹ️ Баллы не начислены: actualPointsEarned = ${actualPointsEarned}, orderTotalNum = ${orderTotalNum}, pointsUsed = ${pointsUsed}, currentTotalSpent = ${currentTotalSpent}`)
            }
            
            // ✅ ИСПРАВЛЕНО 2026-01-11: Обновляем заказ ТОЛЬКО если баллы были начислены
            if (actualPointsEarned > 0) {
              console.log(`📝 Проверка обновления loyalty_points_earned:`, {
                actualPointsEarned,
                orderLoyaltyPointsEarned: order.loyaltyPointsEarned || 0,
                needsUpdate: actualPointsEarned !== (order.loyaltyPointsEarned || 0)
              })
              
              if (actualPointsEarned !== (order.loyaltyPointsEarned || 0)) {
                console.log(`🔍 [POST] 9️⃣ Обновление заказа в БД:`, {
                  orderId: nocoOrder.Id,
                  loyalty_points_earned: actualPointsEarned,
                })
                
                console.log(`📝 Обновляем заказ ${nocoOrder.Id} с loyalty_points_earned: ${actualPointsEarned}`)
                // Используем оба формата имен полей для совместимости
                await updateOrder(nocoOrder.Id, {
                  loyalty_points_earned: actualPointsEarned,
                  "Loyalty Points Earned": actualPointsEarned,
                } as any)
                console.log(`✅ Заказ ${nocoOrder.Id} обновлен с loyalty_points_earned: ${actualPointsEarned}`)
              }
            } else {
              console.log(`ℹ️ Баллы не начислены: рассчитано 0 баллов (сумма заказа: ${orderTotalNum}, использовано баллов: ${pointsUsed})`)
            }
          }
        } else {
          console.warn(`⚠️ Пользователь ${userId} не найден в базе данных`)
        }
      } catch (error) {
        console.error(`❌ Ошибка при начислении баллов:`, error)
        // Не прерываем процесс создания заказа из-за ошибки начисления баллов
      }
    } else {
      console.log(`🔍 [POST] ❌ userId отсутствует - баллы не будут начислены`)
      console.log(`ℹ️ Баллы не начислены: нет userId`)
    }
    
    console.log(`🔍 ========== КОНЕЦ ОТЛАДКИ НАЧИСЛЕНИЯ БАЛЛОВ (POST) ==========\n`)

    // ✅ ИСПРАВЛЕНО 2026-01-15: Инкремент счетчика использования промокода
    // Инкремент происходит только если заказ сразу оплачен (paid=true)
    // Если заказ не оплачен, инкремент произойдет при оплате в PATCH
    // Проверяем наличие Id в разных форматах (поддерживаем оба варианта)
    const nocoOrderId = nocoOrder?.Id ?? (nocoOrder as any)?.["Id"]
    const isPaid = order.paid === true || order.paid === "true" || String(order.paid).toLowerCase() === "true"
    const isPaymentStatusPaid = order.paymentStatus === 'paid' || String(order.paymentStatus).toLowerCase() === 'paid'
    const shouldIncrement = order.promoCode && nocoOrderId && (isPaid || isPaymentStatusPaid)
    
    console.log(`🔍 [POST] Проверка инкремента промокода:`, {
      hasPromoCode: !!order.promoCode,
      promoCode: order.promoCode,
      hasNocoOrder: !!nocoOrder,
      nocoOrderKeys: nocoOrder ? Object.keys(nocoOrder) : [],
      hasNocoOrderId: !!nocoOrderId,
      nocoOrderId: nocoOrderId,
      paid: order.paid,
      paidType: typeof order.paid,
      paidString: String(order.paid),
      isPaid,
      paymentStatus: order.paymentStatus,
      paymentStatusType: typeof order.paymentStatus,
      paymentStatusString: String(order.paymentStatus),
      isPaymentStatusPaid,
      condition1: isPaid,
      condition2: isPaymentStatusPaid,
      conditionOr: (isPaid || isPaymentStatusPaid),
      shouldIncrement,
    })
    if (shouldIncrement) {
      try {
        const { fetchPromoCode, incrementPromoCodeUsage } = await import("@/lib/nocodb")
        const promo = await fetchPromoCode(order.promoCode)
        if (promo) {
          await incrementPromoCodeUsage(promo.Id)
          console.log(`✅ Счетчик промокода "${order.promoCode}" инкрементирован при создании оплаченного заказа`)
        } else {
          console.warn(`⚠️ Промокод "${order.promoCode}" не найден при создании заказа`)
        }
      } catch (error) {
        console.error(`❌ Ошибка при инкременте промокода:`, error)
        // Не прерываем создание заказа
      }
    } else if (order.promoCode && nocoOrder?.Id) {
      console.log(`ℹ️ Промокод "${order.promoCode}" будет инкрементирован при оплате заказа`)
    }

    // Убеждаемся, что номер заказа есть в ответе - это критично!
    // Используем сгенерированный номер, если finalOrderNumber пустой
    const orderNumberToReturn = finalOrderNumber || orderNumber
    
    if (!finalOrderNumber) {
      console.error("❌ CRITICAL ERROR: No order number available! Using generated:", orderNumber)
    }
    
    // Финальная проверка перед отправкой
    if (!orderNumberToReturn) {
      console.error("❌ FATAL: Order number is missing in response!")
      throw new Error("Failed to generate order number")
    }
    
    // ✅ НОВОЕ 2026-01-11: Загружаем userProfile с totalSpent, если userId передан
    let userProfileData: any = undefined
    console.log(`🔍 [POST /api/orders] Проверка userId для userProfile:`, {
      userId,
      hasUserId: !!userId,
    })
    
    if (userId) {
      try {
        console.log(`🔍 [POST /api/orders] Загружаем пользователя ${userId} для userProfile`)
        const updatedUser = await fetchUserById(userId, true) // noCache для свежих данных
        console.log(`🔍 [POST /api/orders] Результат fetchUserById:`, {
          hasUser: !!updatedUser,
          userId: updatedUser?.Id,
          totalSpent: updatedUser?.total_spent,
        })
        
        if (updatedUser) {
          userProfileData = {
            id: updatedUser.Id,
            phone: updatedUser.phone,
            name: updatedUser.name,
            loyaltyPoints: updatedUser.loyalty_points,
            totalSpent: updatedUser.total_spent,
          }
          console.log('💰 Добавлен userProfile в ответ:', {
            loyaltyPoints: updatedUser.loyalty_points,
            totalSpent: updatedUser.total_spent,
          })
        } else {
          console.warn(`⚠️ fetchUserById вернул null/undefined для userId=${userId}`)
        }
      } catch (error) {
        console.error('⚠️ Не удалось загрузить обновленный профиль:', error)
        // Не прерываем выполнение, просто не добавляем userProfile
      }
    } else {
      console.log(`ℹ️ [POST /api/orders] userId не передан, userProfile не будет добавлен в ответ`)
    }
    
    const responseData = {
      success: true,
      orderId: nocoOrder.Id,
      orderNumber: orderNumberToReturn, // Гарантируем наличие номера заказа
      order: {
        id: nocoOrder.Id,
        orderNumber: orderNumberToReturn,
        startDate: order.startDate,
        deliveryTime: order.deliveryTime,
        paymentMethod: order.paymentMethod || "cash",
        paid: order.paid || false,
        paymentStatus: order.paymentStatus || "pending",
        orderStatus: "pending",
        total: finalTotal, // ✅ С доставкой
        subtotal: calculatedTotal, // ✅ Без доставки
        deliveryFee: deliveryFee, // 🆕
        deliveryDistrict: deliveryDistrict, // 🆕
        deliveryAddress: deliveryAddress, // 🆕
        loyaltyPointsUsed: order.loyaltyPointsUsed || 0,
        loyaltyPointsEarned: actualPointsEarned || 0,
        persons: order.persons || [],
        extras: order.extras || [],
      },
      loyaltyPointsEarned: actualPointsEarned || 0, // Количество начисленных баллов (всегда число, даже если 0)
      loyaltyPointsUsed: order.loyaltyPointsUsed || 0, // Количество использованных баллов
      loyaltyPointsStatus: order.paymentMethod === 'cash' ? 'pending' : 'earned',
      loyaltyPointsMessage: order.paymentMethod === 'cash' && actualPointsEarned > 0
        ? `При оплате наличными баллы (${actualPointsEarned}) будут начислены на следующий день после доставки`
        : actualPointsEarned > 0 
          ? `Начислено ${actualPointsEarned} баллов` 
          : undefined,
      orderTotal: calculatedTotal,
      loyaltyPointsDiagnostics: {
        userId: userId || null,
        pointsAwarded: actualPointsEarned,
        pointsAwardedReason: userId 
          ? (actualPointsEarned > 0 
            ? "Баллы успешно начислены" 
            : actualPointsEarned === 0 
              ? "Рассчитано 0 баллов (возможно, сумма заказа слишком мала или использованы все баллы)"
              : "Баллы не были рассчитаны")
          : "userId не передан",
        orderTotal: calculatedTotal,
        pointsUsed: order.loyaltyPointsUsed || 0,
        hasUser: !!userId,
      },
      userProfile: userProfileData, // ✅ Загружено выше
    }
    
    console.log(`📤 Отправка ответа с данными заказа:`, {
      orderId: responseData.orderId,
      orderNumber: responseData.orderNumber,
      loyaltyPointsEarned: responseData.loyaltyPointsEarned,
      actualPointsEarned,
      hasUserId: !!userId,
      orderTotal: calculatedTotal,
    })
    
    console.log("📦 Created order response:", { 
      id: nocoOrder.Id, 
      orderNumber: responseData.orderNumber,
      orderNumberLength: responseData.orderNumber?.length,
      orderNumberType: typeof responseData.orderNumber
    })
    
    // Финальная проверка перед отправкой
    if (!responseData.orderNumber) {
      console.error("❌ FATAL: Order number is still missing in response!")
      throw new Error("Failed to generate order number")
    }
    
    console.log("✅ Заказ успешно создан и сохранен в базу")
    logResponse("POST", "/api/orders", 200)
    return NextResponse.json(responseData)
  } catch (error) {
    console.error("❌ КРИТИЧЕСКАЯ ОШИБКА при создании заказа:", error)
    console.error("Stack trace:", error instanceof Error ? error.stack : "No stack")
    const errorMessage = error instanceof Error ? error.message : String(error)
    logResponse("POST", "/api/orders", 500, errorMessage)
    return NextResponse.json(
      { 
        error: "Failed to create order",
        message: error instanceof Error ? error.message : String(error),
        details: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.stack : undefined) : undefined,
      }, 
      { status: 500 }
    )
  }
}

async function saveMeal(
  orderPersonId: number,
  day: "day1" | "day2",
  mealTime: "breakfast" | "lunch" | "dinner",
  mealType: "dish" | "salad" | "soup" | "main",
  meal: Meal,
): Promise<number> {
  // Извлекаем числовую часть из meal_id (например, "1308_dinner" -> 1308)
  const mealIdStr = String(meal.id)
  const cleanMealId = mealIdStr.includes('_') 
    ? parseInt(mealIdStr.split('_')[0]) 
    : Number(meal.id)
  
  const cleanGarnishId = meal.garnish?.id 
    ? (() => {
        const garnishIdStr = String(meal.garnish.id)
        return garnishIdStr.includes('_') 
          ? parseInt(garnishIdStr.split('_')[0]) 
          : Number(meal.garnish.id)
      })()
    : undefined
  
  // Получаем цену: приоритет prices > price > БД
  const price = meal.prices 
    ? getMealPriceForPortion(meal)
    : (meal.price || await getMealPriceFromDB(cleanMealId, meal.portion || "single"))
  
  console.log(`  💰 Цена блюда ${meal.name} (ID=${meal.id}):`, {
    hasPrices: !!meal.prices,
    hasPrice: !!meal.price,
    priceValue: meal.price,
    pricesObject: meal.prices,
    calculatedPrice: price,
  })
  
  const garnishPrice = meal.garnish
    ? (meal.garnish.prices 
        ? getMealPriceForPortion(meal.garnish)
        : (meal.garnish.price || await getMealPriceFromDB(cleanGarnishId!, meal.garnish.portion || "single")))
    : undefined
  
  const mealData = {
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
  }
  
  console.log(`  🍽️  Creating OrderMeal:`, JSON.stringify(mealData, null, 2))
  
  try {
    const result = await createOrderMeal(mealData)
    console.log(`  ✅ Created OrderMeal:`, JSON.stringify(result, null, 2))
    
    // Возвращаем общую стоимость (блюдо + гарнир)
    return price + (garnishPrice || 0)
  } catch (error) {
    console.error(`  ❌ Failed to create OrderMeal:`, error)
    throw error
  }
}

async function getMealPriceFromDB(mealId: number, portion: PortionSize = 'single'): Promise<number> {
  try {
    const { fetchMealById } = await import("@/lib/nocodb")
    const mealFromDB = await fetchMealById(mealId)
    
    if (!mealFromDB) {
      console.warn(`⚠️ Meal ${mealId} not found in DB, using default price 0`)
      return 0
    }
    
    if (portion === "medium" && mealFromDB.prices?.medium) return mealFromDB.prices.medium
    if (portion === "large" && mealFromDB.prices?.large) return mealFromDB.prices.large
    return mealFromDB.prices?.single || 0
  } catch (error) {
    console.error(`❌ Error fetching meal ${mealId} from DB:`, error)
    return 0
  }
}

function getMealPriceForPortion(meal: {
  prices?: { single: number; medium?: number; large?: number }
  portion?: PortionSize
}): number {
  if (!meal.prices) {
    console.warn(`⚠️ Meal prices missing, returning 0`)
    return 0
  }
  const portion = meal.portion || "single"
  if (portion === "medium" && meal.prices.medium) return meal.prices.medium
  if (portion === "large" && meal.prices.large) return meal.prices.large
  return meal.prices.single
}
