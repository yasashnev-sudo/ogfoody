// Универсальный API Proxy для NocoDB
// Все запросы к NocoDB идут через этот route - токен никогда не попадает в браузер

import { type NextRequest, NextResponse } from "next/server"

function getNocoDBUrl(): string {
  return process.env.NOCODB_URL || ""
}

function getNocoDBToken(): string {
  return process.env.NOCODB_TOKEN || ""
}

function getTableId(tableName: string): string {
  const tableIds: Record<string, string | undefined> = {
    Meals: process.env.NOCODB_TABLE_MEALS,
    Extras: process.env.NOCODB_TABLE_EXTRAS,
    Delivery_Zones: process.env.NOCODB_TABLE_DELIVERY_ZONES,
    Users: process.env.NOCODB_TABLE_USERS,
    Orders: process.env.NOCODB_TABLE_ORDERS,
    Order_Persons: process.env.NOCODB_TABLE_ORDER_PERSONS,
    Order_Meals: process.env.NOCODB_TABLE_ORDER_MEALS,
    Order_Extras: process.env.NOCODB_TABLE_ORDER_EXTRAS,
    Promo_Codes: process.env.NOCODB_TABLE_PROMO_CODES,
    Reviews: process.env.NOCODB_TABLE_REVIEWS,
  }

  return tableIds[tableName] || ""
}

// Белый список разрешенных таблиц для безопасности
const ALLOWED_TABLES = [
  "Meals",
  "Extras",
  "Delivery_Zones",
  "Users",
  "Orders",
  "Order_Persons",
  "Order_Meals",
  "Order_Extras",
  "Promo_Codes",
  "Reviews",
]

function isAllowedPath(path: string): boolean {
  const tableName = path.split("/")[0]
  return ALLOWED_TABLES.includes(tableName)
}

function buildTargetUrl(baseUrl: string, path: string): string {
  let cleanBaseUrl = baseUrl.replace(/\/$/, "")

  if (!cleanBaseUrl.endsWith("/api/v2")) {
    cleanBaseUrl = `${cleanBaseUrl}/api/v2`
  }

  const parts = path.split("/")
  const tableName = parts[0]
  const tableId = getTableId(tableName)

  if (!tableId) {
    throw new Error(
      `Table ID not configured for "${tableName}". Set NOCODB_TABLE_${tableName.toUpperCase()} in environment variables.`,
    )
  }

  // Если путь содержит "records", оставляем его, иначе добавляем
  if (parts.length === 1 || !parts[1]?.startsWith("records")) {
    parts[0] = tableId
    const newPath = parts.join("/")
    return `${cleanBaseUrl}/tables/${newPath}`
  } else {
    // Если уже есть "records" в пути, заменяем только имя таблицы
    parts[0] = tableId
    const newPath = parts.join("/")
    return `${cleanBaseUrl}/tables/${newPath}`
  }
}

async function proxyToNocoDB(request: NextRequest, path: string, method: string): Promise<NextResponse> {
  const nocodbUrl = getNocoDBUrl()
  const nocodbToken = getNocoDBToken()

  if (!nocodbUrl || !nocodbToken) {
    return NextResponse.json(
      { error: "NocoDB not configured", details: { urlSet: !!nocodbUrl, tokenSet: !!nocodbToken } },
      { status: 503 },
    )
  }

  if (!isAllowedPath(path)) {
    return NextResponse.json({ error: "Access denied to this resource" }, { status: 403 })
  }

  const tableName = path.split("/")[0]
  const tableId = getTableId(tableName)
  if (!tableId) {
    return NextResponse.json(
      {
        error: "Table not configured",
        details: `Set NOCODB_TABLE_${tableName.toUpperCase()} environment variable with the Table ID from NocoDB`,
        tableName,
        hint: "Go to NocoDB, open the table, and copy the ID from the URL (e.g., md_xxxxx)",
      },
      { status: 503 },
    )
  }

  let targetUrl: string
  try {
    targetUrl = buildTargetUrl(nocodbUrl, path)
  } catch (error) {
    return NextResponse.json({ error: "Failed to build URL", details: String(error) }, { status: 503 })
  }

  const searchParams = request.nextUrl.searchParams.toString()
  const fullUrl = searchParams ? `${targetUrl}?${searchParams}` : targetUrl

  try {
    const headers: HeadersInit = {
      "xc-token": nocodbToken,
      "Content-Type": "application/json",
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
    }

    if (["POST", "PUT", "PATCH"].includes(method)) {
      const body = await request.text()
      if (body) {
        fetchOptions.body = body
      }
    }

    const response = await fetch(fullUrl, fetchOptions)
    const responseText = await response.text()

    let data
    try {
      data = JSON.parse(responseText)
    } catch {
      return new NextResponse(responseText, {
        status: response.status,
        headers: { "Content-Type": "text/plain" },
      })
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("NocoDB proxy error:", error)
    return NextResponse.json({ error: "Failed to proxy request to NocoDB", details: String(error) }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const pathString = path.join("/")
  return proxyToNocoDB(request, pathString, "GET")
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const pathString = path.join("/")
  return proxyToNocoDB(request, pathString, "POST")
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const pathString = path.join("/")
  return proxyToNocoDB(request, pathString, "PUT")
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const pathString = path.join("/")
  return proxyToNocoDB(request, pathString, "PATCH")
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const pathString = path.join("/")
  return proxyToNocoDB(request, pathString, "DELETE")
}
