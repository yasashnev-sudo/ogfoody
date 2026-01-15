import { NextRequest, NextResponse } from "next/server"
import { nocoFetch } from "@/lib/nocodb"

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
}

// GET /api/admin/notifications - получить все уведомления
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = searchParams.get("limit") || "100"

    let params: Record<string, string> = { limit }

    if (status) {
      params.where = `(Status,eq,${status})`
    }

    const response = await nocoFetch<any>("Push_Notifications", params)

    return NextResponse.json(
      { notifications: response.list || [] },
      { headers: noCacheHeaders }
    )
  } catch (error: any) {
    console.error("Ошибка загрузки уведомлений:", error)
    
    // Если таблица не существует, возвращаем пустой массив
    if (error.message?.includes("TABLE_NOT_FOUND") || error.message?.includes("not configured")) {
      return NextResponse.json(
        { notifications: [] },
        { headers: noCacheHeaders }
      )
    }

    return NextResponse.json(
      { error: "Failed to fetch notifications", details: error.message },
      { status: 500, headers: noCacheHeaders }
    )
  }
}

// POST /api/admin/notifications - создать новое уведомление
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, message, target_type, target_value, scheduled_at } = body

    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required" },
        { status: 400, headers: noCacheHeaders }
      )
    }

    const now = new Date().toISOString()
    const notificationData = {
      title,
      message,
      target_type: target_type || "all", // all, user_id, user_phone, segment
      target_value: target_value || null,
      status: scheduled_at && new Date(scheduled_at) > new Date() ? "scheduled" : "pending",
      scheduled_at: scheduled_at || now,
      sent_at: null,
      created_at: now,
    }

    const response = await nocoFetch<any>("Push_Notifications", {}, {
      method: "POST",
      body: JSON.stringify([notificationData]),
    })

    // Если уведомление не запланировано, отправляем сразу
    if (!scheduled_at || new Date(scheduled_at) <= new Date()) {
      // TODO: Интеграция с сервисом пуш-уведомлений (Firebase, OneSignal и т.д.)
      console.log("Отправка уведомления:", notificationData)
    }

    return NextResponse.json(
      { success: true, notification: response },
      { headers: noCacheHeaders }
    )
  } catch (error: any) {
    console.error("Ошибка создания уведомления:", error)
    return NextResponse.json(
      { error: "Failed to create notification", details: error.message },
      { status: 500, headers: noCacheHeaders }
    )
  }
}

// PATCH /api/admin/notifications/[id] - обновить уведомление
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400, headers: noCacheHeaders }
      )
    }

    const updateData = {
      Id: id,
      ...updates,
      updated_at: new Date().toISOString(),
    }

    const response = await nocoFetch<any>("Push_Notifications", {}, {
      method: "PATCH",
      body: JSON.stringify([updateData]),
    })

    return NextResponse.json(
      { success: true, notification: response },
      { headers: noCacheHeaders }
    )
  } catch (error: any) {
    console.error("Ошибка обновления уведомления:", error)
    return NextResponse.json(
      { error: "Failed to update notification", details: error.message },
      { status: 500, headers: noCacheHeaders }
    )
  }
}
