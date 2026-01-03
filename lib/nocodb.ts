// NocoDB API client - все запросы идут через внутренний API proxy
// Токен никогда не попадает в браузер

// Определяем базовый URL для API proxy
// На сервере используем абсолютный URL, на клиенте - относительный
const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "/api/db"
  }
  return null
}

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

// Проверяем конфигурацию динамически
function validateNocoDBConfig(): { isValid: boolean; error?: string } {
  const url = getNocoDBUrl()
  const token = getNocoDBToken()
  const mealsTable = process.env.NOCODB_TABLE_MEALS

  if (!url || !token) {
    return { isValid: false, error: "NOCODB_URL or NOCODB_TOKEN not set" }
  }
  if (!mealsTable) {
    return { isValid: false, error: "NOCODB_TABLE_MEALS not set" }
  }
  return { isValid: true }
}

export function isNocoDBConfigured(): boolean {
  return validateNocoDBConfig().isValid
}

// Типы для NocoDB ответов
interface NocoDBResponse<T> {
  list: T[]
  pageInfo?: {
    totalRows: number
    page: number
    pageSize: number
    isFirstPage: boolean
    isLastPage: boolean
  }
}

function buildNocoDBUrl(tableName: string, params: Record<string, string> = {}): string {
  const queryString = new URLSearchParams(params).toString()
  let baseUrl = getNocoDBUrl().replace(/\/$/, "")

  if (!baseUrl.endsWith("/api/v2")) {
    baseUrl = `${baseUrl}/api/v2`
  }

  const tableId = getTableId(tableName)

  if (!tableId) {
    throw new Error(`TABLE_NOT_CONFIGURED:${tableName}`)
  }

  return `${baseUrl}/tables/${tableId}/records${queryString ? `?${queryString}` : ""}`
}

// Серверный fetch напрямую к NocoDB (для ISR)
async function serverFetch<T>(tableName: string, params: Record<string, string> = {}): Promise<T> {
  const config = validateNocoDBConfig()
  if (!config.isValid) {
    throw new Error(`NocoDB is not configured: ${config.error}`)
  }

  const url = buildNocoDBUrl(tableName, params)
  const token = getNocoDBToken()

  const response = await fetch(url, {
    headers: {
      "xc-token": token,
      "Content-Type": "application/json",
    },
    next: { revalidate: 3600 },
  })

  const text = await response.text()

  if (!response.ok) {
    if (text.includes("TABLE_NOT_FOUND") || response.status === 404) {
      throw new Error(`TABLE_NOT_FOUND:${tableName}`)
    }
    throw new Error(`NocoDB API error: ${response.status} - ${text}`)
  }

  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`NocoDB returned invalid JSON: ${text.substring(0, 100)}...`)
  }
}

// Клиентский fetch через API proxy
async function clientFetch<T>(
  tableName: string,
  params: Record<string, string> = {},
  options: RequestInit = {},
): Promise<T> {
  const queryString = new URLSearchParams(params).toString()
  const url = `/api/db/${tableName}/records${queryString ? `?${queryString}` : ""}`

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  const text = await response.text()

  if (!response.ok) {
    if (text.includes("TABLE_NOT_FOUND") || response.status === 404) {
      throw new Error(`TABLE_NOT_FOUND:${tableName}`)
    }
    throw new Error(`API error: ${response.status} - ${text}`)
  }

  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`API returned invalid JSON: ${text.substring(0, 100)}...`)
  }
}

// Универсальный fetch
async function nocoFetch<T>(
  tableName: string,
  params: Record<string, string> = {},
  options: RequestInit = {},
): Promise<T> {
  const apiBaseUrl = getApiBaseUrl()

  if (apiBaseUrl === null) {
    return serverFetch<T>(tableName, params)
  } else {
    return clientFetch<T>(tableName, params, options)
  }
}

// === MEALS ===

export interface NocoDBMeal {
  Id: number
  name: string
  category: string
  ingredients: string
  description?: string
  price: number | string
  price_single?: number | string
  price_medium?: number | string
  price_large?: number | string
  weight?: number | string
  weight_single?: number | string
  weight_medium?: number | string
  weight_large?: number | string
  image?: string
  available?: boolean | string
  needs_garnish?: boolean | string
  calories?: number | string
  protein?: number | string
  fats?: number | string
  carbs?: number | string
  is_current_week?: boolean | string
  is_next_week?: boolean | string
}

export async function fetchMeals(weekFilter?: "current" | "next"): Promise<NocoDBMeal[]> {
  try {
    const params: Record<string, string> = {
      limit: "1000",
    }

    const response = await nocoFetch<NocoDBResponse<NocoDBMeal>>("Meals", params)
    console.log(
      `[v0] fetchMeals: got ${response.list?.length || 0} meals, first item:`,
      JSON.stringify(response.list?.[0] || {}).substring(0, 200),
    )
    return response.list || []
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("TABLE_NOT_FOUND")) {
      console.warn("Table Meals not found in NocoDB, returning empty array")
      return []
    }
    throw error
  }
}

// === EXTRAS ===

export interface NocoDBExtra {
  Id: number
  name: string
  category: string
  ingredients?: string
  description?: string
  price: number | string
  image?: string
  available?: boolean | string
  calories?: number | string
  protein?: number | string
  fats?: number | string
  carbs?: number | string
  weight?: number | string
}

export async function fetchExtras(): Promise<NocoDBExtra[]> {
  try {
    const response = await nocoFetch<NocoDBResponse<NocoDBExtra>>("Extras", {
      limit: "1000",
    })
    console.log(
      `[v0] fetchExtras: got ${response.list?.length || 0} extras, first item:`,
      JSON.stringify(response.list?.[0] || {}).substring(0, 200),
    )
    return response.list || []
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("TABLE_NOT_FOUND")) {
      console.warn("Table Extras not found in NocoDB, returning empty array")
      return []
    }
    throw error
  }
}

// === DELIVERY ZONES ===

export interface NocoDBDeliveryZone {
  Id: number
  city: string
  district?: string
  delivery_fee: number | string
  min_order_amount: number | string
  is_available?: boolean | string
  available_intervals?: string
}

export async function fetchDeliveryZones(): Promise<NocoDBDeliveryZone[]> {
  try {
    const response = await nocoFetch<NocoDBResponse<NocoDBDeliveryZone>>("Delivery_Zones", {
      // where: "(is_available,eq,true)",
    })
    console.log(`[v0] fetchDeliveryZones: got ${response.list?.length || 0} zones, first item:`, response.list?.[0])
    return response.list || []
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("TABLE_NOT_FOUND")) {
      console.warn("Table Delivery_Zones not found in NocoDB, returning empty array")
      return []
    }
    throw error
  }
}

// === USERS ===

export interface NocoDBUser {
  Id: number
  phone: string
  password_hash?: string
  name: string
  additional_phone?: string
  street?: string
  building?: string
  building_section?: string
  apartment?: string
  entrance?: string
  floor?: string
  intercom?: string
  district?: string
  delivery_comment?: string
  loyalty_points: number | string
  total_spent: number | string
  created_at: string
  updated_at: string
}

export async function fetchUserByPhone(phone: string): Promise<NocoDBUser | null> {
  const response = await nocoFetch<NocoDBResponse<NocoDBUser>>("Users", {
    where: `(phone,eq,${phone})`,
  })
  return response.list?.[0] || null
}

export async function fetchUserById(id: number): Promise<NocoDBUser | null> {
  const response = await nocoFetch<NocoDBResponse<NocoDBUser>>("Users", {
    where: `(Id,eq,${id})`,
  })
  return response.list?.[0] || null
}

export async function createUser(user: Omit<NocoDBUser, "Id" | "created_at" | "updated_at">): Promise<NocoDBUser> {
  return clientFetch<NocoDBUser>(
    "Users",
    {},
    {
      method: "POST",
      body: JSON.stringify(user),
    },
  )
}

export async function updateUser(id: number, data: Partial<NocoDBUser>): Promise<NocoDBUser> {
  return clientFetch<NocoDBUser>(
    `Users/${id}`,
    {},
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  )
}

// === ORDERS ===

export interface NocoDBOrder {
  Id: number
  user_id?: number
  order_number: string
  start_date: string
  delivery_time: string
  status: "pending" | "paid" | "delivered" | "cancelled"
  payment_method: "card" | "sbp" | "cash"
  paid?: boolean | string
  paid_at?: string
  delivered?: boolean | string
  cancelled?: boolean | string
  promo_code?: string
  promo_discount?: number | string
  loyalty_points_used: number | string
  loyalty_points_earned: number | string
  subtotal: number | string
  total: number | string
  guest_phone?: string
  guest_address?: string
  created_at: string
  updated_at: string
}

export async function fetchOrders(userId?: number): Promise<NocoDBOrder[]> {
  const params: Record<string, string> = {
    limit: "1000",
    sort: "-start_date",
  }

  if (userId) {
    params.where = `(user_id,eq,${userId})`
  }

  const response = await nocoFetch<NocoDBResponse<NocoDBOrder>>("Orders", params)
  return response.list || []
}

export async function fetchOrdersByUser(userId: number): Promise<NocoDBOrder[]> {
  return fetchOrders(userId)
}

export function generateOrderNumber(): string {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, "")
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ORD-${date}-${random}`
}

export async function fetchOrderById(id: number): Promise<NocoDBOrder | null> {
  const response = await nocoFetch<NocoDBResponse<NocoDBOrder>>("Orders", {
    where: `(Id,eq,${id})`,
  })
  return response.list?.[0] || null
}

export async function createOrder(order: Omit<NocoDBOrder, "Id" | "created_at" | "updated_at">): Promise<NocoDBOrder> {
  return clientFetch<NocoDBOrder>(
    "Orders",
    {},
    {
      method: "POST",
      body: JSON.stringify(order),
    },
  )
}

export async function updateOrder(id: number, data: Partial<NocoDBOrder>): Promise<NocoDBOrder> {
  return clientFetch<NocoDBOrder>(
    `Orders/${id}`,
    {},
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  )
}

// === ORDER PERSONS ===

export interface NocoDBOrderPerson {
  Id: number
  order_id: number
  person_number: number
}

export async function createOrderPerson(orderPerson: Omit<NocoDBOrderPerson, "Id">): Promise<NocoDBOrderPerson> {
  return clientFetch<NocoDBOrderPerson>(
    "Order_Persons",
    {},
    {
      method: "POST",
      body: JSON.stringify(orderPerson),
    },
  )
}

// === ORDER MEALS ===

export interface NocoDBOrderMeal {
  Id: number
  order_person_id: number
  day: "day1" | "day2"
  meal_time: "breakfast" | "lunch" | "dinner"
  meal_type: "dish" | "salad" | "soup" | "main"
  meal_id: number
  portion_size: "single" | "medium" | "large"
  price: number | string
  garnish_id?: number
  garnish_portion_size?: "single" | "medium" | "large"
  garnish_price?: number | string
}

export async function createOrderMeal(orderMeal: Omit<NocoDBOrderMeal, "Id">): Promise<NocoDBOrderMeal> {
  return clientFetch<NocoDBOrderMeal>(
    "Order_Meals",
    {},
    {
      method: "POST",
      body: JSON.stringify(orderMeal),
    },
  )
}

// === ORDER EXTRAS ===

export interface NocoDBOrderExtra {
  Id: number
  order_id: number
  extra_id: number
  quantity: number | string
  price: number | string
}

export async function createOrderExtra(orderExtra: Omit<NocoDBOrderExtra, "Id">): Promise<NocoDBOrderExtra> {
  return clientFetch<NocoDBOrderExtra>(
    "Order_Extras",
    {},
    {
      method: "POST",
      body: JSON.stringify(orderExtra),
    },
  )
}

// Функции для получения данных заказа
export async function fetchOrderPersons(orderId: number): Promise<NocoDBOrderPerson[]> {
  const response = await nocoFetch<NocoDBResponse<NocoDBOrderPerson>>("Order_Persons", {
    where: `(order_id,eq,${orderId})`,
  })
  return response.list || []
}

export async function fetchOrderMeals(orderPersonId: number): Promise<NocoDBOrderMeal[]> {
  const response = await nocoFetch<NocoDBResponse<NocoDBOrderMeal>>("Order_Meals", {
    where: `(order_person_id,eq,${orderPersonId})`,
  })
  return response.list || []
}

export async function fetchOrderExtras(orderId: number): Promise<NocoDBOrderExtra[]> {
  const response = await nocoFetch<NocoDBResponse<NocoDBOrderExtra>>("Order_Extras", {
    where: `(order_id,eq,${orderId})`,
  })
  return response.list || []
}

// Функции для удаления данных заказа
export async function deleteOrderPerson(id: number): Promise<void> {
  const apiBaseUrl = getApiBaseUrl()
  if (apiBaseUrl === null) {
    // На сервере используем прямой запрос к NocoDB
    const tableId = getTableId("Order_Persons")
    const nocodbUrl = getNocoDBUrl()
    const token = getNocoDBToken()
    const url = `${nocodbUrl}/api/v2/tables/${tableId}/records/${id}`
    
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "xc-token": token,
        "Content-Type": "application/json",
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to delete order person: ${response.status}`)
    }
  } else {
    // На клиенте используем API proxy
    const response = await fetch(`/api/db/Order_Persons/records/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to delete order person: ${response.status}`)
    }
  }
}

export async function deleteOrderMeal(id: number): Promise<void> {
  const apiBaseUrl = getApiBaseUrl()
  if (apiBaseUrl === null) {
    const tableId = getTableId("Order_Meals")
    const nocodbUrl = getNocoDBUrl()
    const token = getNocoDBToken()
    const url = `${nocodbUrl}/api/v2/tables/${tableId}/records/${id}`
    
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "xc-token": token,
        "Content-Type": "application/json",
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to delete order meal: ${response.status}`)
    }
  } else {
    const response = await fetch(`/api/db/Order_Meals/records/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to delete order meal: ${response.status}`)
    }
  }
}

export async function deleteOrderExtra(id: number): Promise<void> {
  const apiBaseUrl = getApiBaseUrl()
  if (apiBaseUrl === null) {
    const tableId = getTableId("Order_Extras")
    const nocodbUrl = getNocoDBUrl()
    const token = getNocoDBToken()
    const url = `${nocodbUrl}/api/v2/tables/${tableId}/records/${id}`
    
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "xc-token": token,
        "Content-Type": "application/json",
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to delete order extra: ${response.status}`)
    }
  } else {
    const response = await fetch(`/api/db/Order_Extras/records/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to delete order extra: ${response.status}`)
    }
  }
}

// === PROMO CODES ===

export interface NocoDBPromoCode {
  Id: number
  code: string
  discount_type: "percentage" | "fixed"
  discount_value: number | string
  min_order_amount?: number | string
  max_discount?: number | string
  valid_from?: string
  valid_until?: string
  usage_limit?: number | string
  times_used: number | string
  active?: boolean | string
}

export async function fetchPromoCode(code: string): Promise<NocoDBPromoCode | null> {
  const response = await nocoFetch<NocoDBResponse<NocoDBPromoCode>>("Promo_Codes", {
    where: `(code,eq,${code})~and(active,eq,true)`,
  })
  return response.list?.[0] || null
}

export async function incrementPromoCodeUsage(id: number): Promise<void> {
  await clientFetch(
    "Promo_Codes",
    {},
    {
      method: "PATCH",
      body: JSON.stringify({ Id: id, times_used: { increment: 1 } }),
    },
  )
}

// === REVIEWS ===

export interface NocoDBReview {
  Id: number
  order_id: number
  user_id: number
  rating: number | string
  text?: string
  created_at: string
  updated_at: string
}

export async function fetchReviewsForUser(userId: number): Promise<NocoDBReview[]> {
  const response = await nocoFetch<NocoDBResponse<NocoDBReview>>("Reviews", {
    where: `(user_id,eq,${userId})`,
  })
  return response.list || []
}

export async function createReview(
  review: Omit<NocoDBReview, "Id" | "created_at" | "updated_at">,
): Promise<NocoDBReview> {
  return clientFetch<NocoDBReview>(
    "Reviews",
    {},
    {
      method: "POST",
      body: JSON.stringify(review),
    },
  )
}
