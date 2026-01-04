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
} from "@/lib/nocodb"
import type { Order, Meal, PortionSize } from "@/lib/types"

// PATCH /api/orders/[id] - обновление заказа
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { order } = body as { order?: Order }

    // Если передан полный объект заказа, обновляем все данные
    if (order) {
      // Получаем текущий заказ для сохранения order_number
      const currentOrder = await fetchOrderById(Number(id))
      
      // Обновляем основные поля заказа (сохраняем order_number если он был)
      const updatedOrder = await updateOrder(Number(id), {
        order_number: currentOrder?.order_number || order.orderNumber || generateOrderNumber(),
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

      // Получаем существующие персоны, блюда и дополнения
      const existingPersons = await fetchOrderPersons(Number(id))
      const existingExtras = await fetchOrderExtras(Number(id))

      // Удаляем старые блюда для каждой персоны
      for (const person of existingPersons) {
        const meals = await fetchOrderMeals(person.Id)
        for (const meal of meals) {
          await deleteOrderMeal(meal.Id)
        }
        await deleteOrderPerson(person.Id)
      }

      // Удаляем старые дополнения
      for (const extra of existingExtras) {
        await deleteOrderExtra(extra.Id)
      }

      // Создаем новые персоны и блюда
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

      // Создаем новые дополнения
      if (order.extras && order.extras.length > 0) {
        for (const extra of order.extras) {
          await createOrderExtra({
            order_id: Number(id),
            extra_id: extra.id,
            quantity: extra.quantity,
            price: extra.price,
          })
        }
      }

      // Возвращаем обновленный заказ с order_number
      return NextResponse.json({ 
        success: true, 
        order: updatedOrder,
        orderNumber: updatedOrder.order_number 
      })
    } else {
      // Если передан только частичный объект, обновляем только основные поля
      const updatedOrder = await updateOrder(Number(id), body)
      return NextResponse.json({ 
        success: true, 
        order: updatedOrder,
        orderNumber: updatedOrder.order_number 
      })
    }
  } catch (error) {
    console.error("Failed to update order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
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

// DELETE /api/orders/[id] - отмена заказа
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Помечаем заказ как отмененный вместо удаления
    const updatedOrder = await updateOrder(Number(id), {
      cancelled: true,
      status: "cancelled",
    })

    return NextResponse.json({ success: true, order: updatedOrder })
  } catch (error) {
    console.error("Failed to cancel order:", error)
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 })
  }
}
