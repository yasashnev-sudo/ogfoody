// Тестовый endpoint для проверки создания записи в NocoDB

import { NextResponse } from "next/server"
import { createOrder } from "@/lib/nocodb"

export async function POST() {
  try {
    const testOrder = {
      user_id: null,
      order_number: "TEST-" + Date.now(),
      start_date: new Date().toISOString().split("T")[0],
      delivery_time: "12:00",
      status: "pending",
      payment_method: "cash",
      paid: false,
      delivered: false,
      cancelled: false,
      loyalty_points_used: 0,
      loyalty_points_earned: 0,
      subtotal: 1000,
      total: 1000,
    }

    console.log("🧪 Тестовый заказ:", JSON.stringify(testOrder, null, 2))

    const result = await createOrder(testOrder)

    console.log("✅ Результат создания:", JSON.stringify(result, null, 2))

    return NextResponse.json({
      success: true,
      testOrder,
      result,
      message: "Проверьте таблицу Orders в NocoDB",
    })
  } catch (error) {
    console.error("❌ Ошибка:", error)
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






