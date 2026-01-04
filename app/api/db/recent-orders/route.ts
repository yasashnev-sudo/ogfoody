// API route для проверки последних заказов в базе

import { NextResponse } from "next/server"
import { fetchOrders } from "@/lib/nocodb"

export async function GET() {
  try {
    // Получаем последние 10 заказов
    const orders = await fetchOrders()
    const recentOrders = orders.slice(0, 10).map((order) => ({
      id: order.Id,
      order_number: order.order_number,
      start_date: order.start_date,
      status: order.status,
      total: order.total,
      user_id: order.user_id,
      created_at: order.created_at,
    }))

    return NextResponse.json({
      success: true,
      total: orders.length,
      recent: recentOrders,
      message: `Найдено ${orders.length} заказов в базе`,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

