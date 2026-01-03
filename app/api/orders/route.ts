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
  try {
    const body = await request.json()
    const { order, userId } = body as { order: Order; userId?: number }

    // Генерация номера заказа
    const orderNumber = generateOrderNumber()

    // Создание заказа в NocoDB
    const nocoOrder = await createOrder({
      user_id: userId,
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
    })

    // Создание персон и блюд
    for (const person of order.persons) {
      const nocoOrderPerson = await createOrderPerson({
        order_id: nocoOrder.Id,
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

    // Сохранение дополнений
    if (order.extras && order.extras.length > 0) {
      for (const extra of order.extras) {
        await createOrderExtra({
          order_id: nocoOrder.Id,
          extra_id: extra.id,
          quantity: extra.quantity,
          price: extra.price,
        })
      }
    }

    return NextResponse.json({
      success: true,
      orderId: nocoOrder.Id,
      orderNumber: nocoOrder.order_number,
    })
  } catch (error) {
    console.error("Failed to create order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
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

  await createOrderMeal({
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
  })
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
