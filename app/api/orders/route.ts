import { NextResponse } from "next/server"
import {
  fetchOrdersByUser,
  createOrder,
  createOrderPerson,
  createOrderMeal,
  createOrderExtra,
  generateOrderNumber,
} from "@/lib/nocodb"
import type { Order, Meal, PortionSize } from "@/lib/types"

// GET /api/orders?userId=123
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 })
  }

  try {
    const orders = await fetchOrdersByUser(Number(userId))
    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Failed to fetch orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
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
    })

    // Генерация номера заказа
    const orderNumber = generateOrderNumber()
    console.log("Generated order number:", orderNumber)

    // Создание заказа в NocoDB
    // Если userId передан, но пользователя нет в базе, создаем заказ без user_id
    const orderData = {
      user_id: userId || null, // Разрешаем null для user_id
      order_number: orderNumber,
      start_date: typeof order.startDate === "string" ? order.startDate : order.startDate.toISOString().split("T")[0],
      delivery_time: order.deliveryTime,
      status: order.paid ? "paid" : "pending",
      payment_method: order.paymentMethod || "cash",
      paid: order.paid,
      paid_at: order.paidAt,
      delivered: order.delivered,
      cancelled: order.cancelled || false,
      promo_code: order.promoCode,
      promo_discount: order.promoDiscount,
      loyalty_points_used: order.loyaltyPointsUsed || 0,
      loyalty_points_earned: order.loyaltyPointsEarned || 0,
      subtotal: order.subtotal || 0,
      total: order.total || 0,
    }
    console.log("Creating order with data:", orderData)
    
    let nocoOrder
    try {
      nocoOrder = await createOrder(orderData)
      console.log("✅ Created NocoDB order - full response:", JSON.stringify(nocoOrder, null, 2))
    } catch (error) {
      console.error("❌ Failed to create order in NocoDB:", error)
      throw error
    }
    
    // createOrder теперь автоматически получает полный объект с order_number
    // Используем номер из ответа NocoDB, если есть, иначе используем сгенерированный
    let finalOrderNumber = nocoOrder?.order_number || orderNumber
    
    if (!nocoOrder?.order_number) {
      console.warn(`⚠️ Order number missing in response, using generated: ${orderNumber}`)
      console.log("Order response keys:", nocoOrder ? Object.keys(nocoOrder) : [])
      console.log("Full order response:", JSON.stringify(nocoOrder, null, 2))
    } else {
      console.log(`✅ Order created successfully with order_number: ${nocoOrder.order_number}`)
    }

    // Создание персон и блюд
    if (!order.persons || order.persons.length === 0) {
      console.warn("⚠️ Заказ создан, но нет персон для сохранения")
    } else {
      console.log(`📝 Creating ${order.persons.length} persons for order ${nocoOrder.Id}`)
    }
    
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
            await saveMeal(nocoOrderPerson.Id, day, "breakfast", "dish", dayMeals.breakfast.dish)
          } catch (error) {
            console.error(`  ❌ Failed to save breakfast meal:`, error)
            // Продолжаем, не прерываем весь процесс
          }
        }

        // Обед
        if (dayMeals.lunch) {
          if (dayMeals.lunch.salad) {
            try {
              await saveMeal(nocoOrderPerson.Id, day, "lunch", "salad", dayMeals.lunch.salad)
            } catch (error) {
              console.error(`  ❌ Failed to save lunch salad:`, error)
            }
          }
          if (dayMeals.lunch.soup) {
            try {
              await saveMeal(nocoOrderPerson.Id, day, "lunch", "soup", dayMeals.lunch.soup)
            } catch (error) {
              console.error(`  ❌ Failed to save lunch soup:`, error)
            }
          }
          if (dayMeals.lunch.main) {
            try {
              await saveMeal(nocoOrderPerson.Id, day, "lunch", "main", dayMeals.lunch.main)
            } catch (error) {
              console.error(`  ❌ Failed to save lunch main:`, error)
            }
          }
        }

        // Ужин
        if (dayMeals.dinner) {
          if (dayMeals.dinner.salad) {
            try {
              await saveMeal(nocoOrderPerson.Id, day, "dinner", "salad", dayMeals.dinner.salad)
            } catch (error) {
              console.error(`  ❌ Failed to save dinner salad:`, error)
            }
          }
          if (dayMeals.dinner.soup) {
            try {
              await saveMeal(nocoOrderPerson.Id, day, "dinner", "soup", dayMeals.dinner.soup)
            } catch (error) {
              console.error(`  ❌ Failed to save dinner soup:`, error)
            }
          }
          if (dayMeals.dinner.main) {
            try {
              await saveMeal(nocoOrderPerson.Id, day, "dinner", "main", dayMeals.dinner.main)
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
        console.log(`  Creating extra ${extra.id} (qty: ${extra.quantity}, price: ${extra.price})`)
        try {
          const result = await createOrderExtra({
            order_id: nocoOrder.Id,
            extra_id: extra.id,
            quantity: extra.quantity,
            price: extra.price,
          })
          console.log(`  ✅ Created OrderExtra:`, JSON.stringify(result, null, 2))
        } catch (error) {
          console.error(`  ❌ Failed to create OrderExtra:`, error)
          // Продолжаем, не прерываем весь процесс
          console.warn(`  ⚠️ Пропускаем дополнение ${extra.id} из-за ошибки, продолжаем...`)
        }
      }
    }

    // Убеждаемся, что номер заказа есть в ответе - это критично!
    // Используем сгенерированный номер, если finalOrderNumber пустой
    const orderNumberToReturn = finalOrderNumber || orderNumber
    
    if (!finalOrderNumber) {
      console.error("❌ CRITICAL ERROR: No order number available! Using generated:", orderNumber)
    }
    
    const responseData = {
      success: true,
      orderId: nocoOrder.Id,
      orderNumber: orderNumberToReturn, // Гарантируем наличие номера заказа
    }
    
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
) {
  const price = getMealPriceForPortion(meal)
  const mealData = {
    order_person_id: orderPersonId,
    day,
    meal_time: mealTime,
    meal_type: mealType,
    meal_id: meal.id,
    portion_size: meal.portion || "single",
    price,
    garnish_id: meal.garnish?.id,
    garnish_portion_size: meal.garnish?.portion,
    garnish_price: meal.garnish ? getMealPriceForPortion(meal.garnish) : undefined,
  }
  
  console.log(`  🍽️  Creating OrderMeal:`, JSON.stringify(mealData, null, 2))
  
  try {
    const result = await createOrderMeal(mealData)
    console.log(`  ✅ Created OrderMeal:`, JSON.stringify(result, null, 2))
  } catch (error) {
    console.error(`  ❌ Failed to create OrderMeal:`, error)
    throw error
  }
}

function getMealPriceForPortion(meal: {
  prices: { single: number; medium?: number; large?: number }
  portion?: PortionSize
}): number {
  const portion = meal.portion || "single"
  if (portion === "medium" && meal.prices.medium) return meal.prices.medium
  if (portion === "large" && meal.prices.large) return meal.prices.large
  return meal.prices.single
}
