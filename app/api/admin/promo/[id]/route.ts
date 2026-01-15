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
    const promoId = parseInt(id)

    if (isNaN(promoId)) {
      return NextResponse.json(
        { error: "Invalid promo code ID" },
        { status: 400, headers: noCacheHeaders }
      )
    }

    const NOCODB_URL = process.env.NOCODB_URL
    const NOCODB_TOKEN = process.env.NOCODB_TOKEN
    const NOCODB_TABLE_PROMO_CODES = process.env.NOCODB_TABLE_PROMO_CODES

    if (!NOCODB_URL || !NOCODB_TOKEN || !NOCODB_TABLE_PROMO_CODES) {
      return NextResponse.json(
        { error: "NocoDB not configured" },
        { status: 500, headers: noCacheHeaders }
      )
    }

    // Используем bulk delete с where параметром (правильный формат для NocoDB API v2)
    const url = `${NOCODB_URL}/api/v2/tables/${NOCODB_TABLE_PROMO_CODES}/records?where=(Id,eq,${promoId})`
    
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "xc-token": NOCODB_TOKEN,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      return NextResponse.json(
        { error: "Failed to delete promo code", details: errorText },
        { status: response.status, headers: noCacheHeaders }
      )
    }

    return NextResponse.json(
      { success: true, message: "Promo code deleted" },
      { headers: noCacheHeaders }
    )
  } catch (error: any) {
    console.error("Ошибка удаления промокода:", error)
    return NextResponse.json(
      { error: "Failed to delete promo code", details: error.message },
      { status: 500, headers: noCacheHeaders }
    )
  }
}
