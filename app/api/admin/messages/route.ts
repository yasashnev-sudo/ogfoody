import { NextRequest, NextResponse } from "next/server"
import { nocoFetch } from "@/lib/nocodb"

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
}

// GET /api/admin/messages - получить все сообщения
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const limit = searchParams.get("limit") || "100"

    let params: Record<string, string> = { limit }

    if (userId) {
      params.where = `(User ID,eq,${userId})`
    }

    // Используем таблицу Messages (нужно будет создать в NocoDB)
    const response = await nocoFetch<any>("Messages", params)

    return NextResponse.json(
      { messages: response.list || [] },
      { headers: noCacheHeaders }
    )
  } catch (error: any) {
    console.error("Ошибка загрузки сообщений:", error)
    
    // Если таблица не существует, возвращаем пустой массив
    if (error.message?.includes("TABLE_NOT_FOUND") || error.message?.includes("not configured")) {
      return NextResponse.json(
        { messages: [] },
        { headers: noCacheHeaders }
      )
    }

    return NextResponse.json(
      { error: "Failed to fetch messages", details: error.message },
      { status: 500, headers: noCacheHeaders }
    )
  }
}

// POST /api/admin/messages - создать новое сообщение
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, message, is_admin, user_phone, user_name } = body

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400, headers: noCacheHeaders }
      )
    }

    const now = new Date().toISOString()
    const messageData = {
      user_id: user_id || null,
      user_phone: user_phone || null,
      user_name: user_name || null,
      message,
      is_admin: is_admin || false,
      is_read: false,
      created_at: now,
    }

    // Создаем сообщение через NocoDB
    const response = await nocoFetch<any>("Messages", {}, {
      method: "POST",
      body: JSON.stringify([messageData]),
    })

    return NextResponse.json(
      { success: true, message: response },
      { headers: noCacheHeaders }
    )
  } catch (error: any) {
    console.error("Ошибка создания сообщения:", error)
    return NextResponse.json(
      { error: "Failed to create message", details: error.message },
      { status: 500, headers: noCacheHeaders }
    )
  }
}

// PATCH /api/admin/messages/[id] - обновить сообщение (например, пометить как прочитанное)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400, headers: noCacheHeaders }
      )
    }

    const updateData = {
      Id: id,
      ...updates,
      updated_at: new Date().toISOString(),
    }

    const response = await nocoFetch<any>("Messages", {}, {
      method: "PATCH",
      body: JSON.stringify([updateData]),
    })

    return NextResponse.json(
      { success: true, message: response },
      { headers: noCacheHeaders }
    )
  } catch (error: any) {
    console.error("Ошибка обновления сообщения:", error)
    return NextResponse.json(
      { error: "Failed to update message", details: error.message },
      { status: 500, headers: noCacheHeaders }
    )
  }
}
