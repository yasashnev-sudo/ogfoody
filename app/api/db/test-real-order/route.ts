// Тестовый endpoint для создания реального заказа с полной структурой

import { NextResponse } from "next/server"
import { createOrder, createOrderPerson, createOrderMeal, generateOrderNumber } from "@/lib/nocodb"

export async function POST() {
  try {
    // Создаем тестовый заказ с полной структурой
    const testOrder = {
      user_id: null,
      order_number: generateOrderNumber(),
      start_date: new Date().toISOString().split("T")[0],
      delivery_time: "14:00",
      status: "pending",
      payment_method: "cash",
      paid: false,
      delivered: false,
      cancelled: false,
      loyalty_points_used: 0,
      loyalty_points_earned: 0,
      subtotal: 2500,
      total: 2500,
    }

    console.log("🧪 Создание тестового заказа с полной структурой...")

    // 1. Создаем заказ
    const order = await createOrder(testOrder)
    console.log("✅ Заказ создан:", order.Id, order.order_number)

    // 2. Создаем персону
    const person = await createOrderPerson({
      order_id: order.Id,
      person_number: 1,
    })
    console.log("✅ Персона создана:", person.Id)

    // 3. Создаем блюдо
    const meal = await createOrderMeal({
      order_person_id: person.Id,
      day: "day1",
      meal_time: "lunch",
      meal_type: "main",
      meal_id: 1, // Предполагаем, что есть блюдо с ID 1
      portion_size: "single",
      price: 500,
    })
    console.log("✅ Блюдо создано:", meal.Id)

    return NextResponse.json({
      success: true,
      order: {
        id: order.Id,
        order_number: order.order_number,
      },
      person: {
        id: person.Id,
      },
      meal: {
        id: meal.Id,
      },
      message: "Проверьте таблицы Orders, Order_Persons, Order_Meals в NocoDB",
    })
  } catch (error) {
    console.error("❌ Ошибка при создании заказа:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}






