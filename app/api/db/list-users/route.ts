import { NextResponse } from "next/server"
import { fetchUserByPhone } from "@/lib/nocodb"

export async function GET(request: Request) {
  try {
    // Получаем всех пользователей через прямой запрос к NocoDB
    const nocodbUrl = process.env.NOCODB_URL
    const nocodbToken = process.env.NOCODB_TOKEN
    const tableId = process.env.NOCODB_TABLE_USERS

    if (!nocodbUrl || !nocodbToken || !tableId) {
      return NextResponse.json(
        { error: "NocoDB not configured" },
        { status: 500 }
      )
    }

    let baseUrl = nocodbUrl.replace(/\/$/, "")
    if (!baseUrl.endsWith("/api/v2")) {
      baseUrl = `${baseUrl}/api/v2`
    }

    const url = `${baseUrl}/tables/${tableId}/records`

    const response = await fetch(url, {
      headers: {
        "xc-token": nocodbToken,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const text = await response.text()
      return NextResponse.json(
        { error: `NocoDB API error: ${response.status}`, details: text },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Преобразуем данные из формата API в формат с snake_case
    const users = (data.list || []).map((rawUser: any) => ({
      Id: rawUser.Id,
      phone: rawUser.phone || rawUser["Phone"] || "",
      name: rawUser.name || rawUser["Name"] || "",
      loyalty_points: rawUser.loyalty_points !== undefined 
        ? rawUser.loyalty_points 
        : (rawUser["Loyalty Points"] !== undefined ? rawUser["Loyalty Points"] : 0),
      total_spent: rawUser.total_spent !== undefined 
        ? rawUser.total_spent 
        : (rawUser["Total Spent"] !== undefined ? rawUser["Total Spent"] : 0),
      created_at: rawUser.created_at || rawUser["Created At"] || "",
      updated_at: rawUser.updated_at || rawUser["Updated At"] || "",
      // Сохраняем также исходные данные для отладки
      _raw: rawUser,
    }))

    return NextResponse.json({
      count: users.length,
      users,
      rawData: data,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch users", 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    )
  }
}





