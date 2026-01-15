import { NextRequest, NextResponse } from "next/server"

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const orderId = parseInt(id)

    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: "Invalid order ID" },
        { status: 400, headers: noCacheHeaders }
      )
    }

    const NOCODB_URL = process.env.NOCODB_URL
    const NOCODB_TOKEN = process.env.NOCODB_TOKEN
    const NOCODB_TABLE_ORDERS = process.env.NOCODB_TABLE_ORDERS

    if (!NOCODB_URL || !NOCODB_TOKEN || !NOCODB_TABLE_ORDERS) {
      return NextResponse.json(
        { error: "NocoDB not configured" },
        { status: 500, headers: noCacheHeaders }
      )
    }

    // Используем "мягкое удаление" через PATCH (установка order_status=cancelled)
    // В этой версии NocoDB DELETE не поддерживается, но можно отменить заказ
    const url = `${NOCODB_URL}/api/v2/tables/${NOCODB_TABLE_ORDERS}/records`
    
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "xc-token": NOCODB_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ Id: orderId, order_status: "cancelled" }]),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      return NextResponse.json(
        { error: "Failed to delete order", details: errorText },
        { status: response.status, headers: noCacheHeaders }
      )
    }

    return NextResponse.json(
      { success: true, message: "Order cancelled (soft delete)" },
      { headers: noCacheHeaders }
    )
  } catch (error: any) {
    console.error("Ошибка удаления заказа:", error)
    return NextResponse.json(
      { error: "Failed to delete order", details: error.message },
      { status: 500, headers: noCacheHeaders }
    )
  }
}
