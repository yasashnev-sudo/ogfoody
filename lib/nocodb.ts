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
  // ✅ ИСПРАВЛЕНО: Используем fallback значения для таблиц, так как переменные не секретные
  // Это гарантирует, что код работает даже если переменные окружения не загружены
  const tableIds: Record<string, string | undefined> = {
    Meals: process.env.NOCODB_TABLE_MEALS || "m6h073y33i44nwx",
    Extras: process.env.NOCODB_TABLE_EXTRAS || "m43rjzbwcon7a9p",
    Delivery_Zones: process.env.NOCODB_TABLE_DELIVERY_ZONES || "mozhmlebwluzna4",
    Users: process.env.NOCODB_TABLE_USERS || "mg9dm2m41bjv8ar",
    Orders: process.env.NOCODB_TABLE_ORDERS || "m96i4ai2yelbboh",
    Order_Persons: process.env.NOCODB_TABLE_ORDER_PERSONS || "m6jccosyrdiz2bm",
    Order_Meals: process.env.NOCODB_TABLE_ORDER_MEALS || "mvwp0iaqj2tne15",
    Order_Extras: process.env.NOCODB_TABLE_ORDER_EXTRAS || "mm5yxpaojbtjs4v",
    Promo_Codes: process.env.NOCODB_TABLE_PROMO_CODES || "mbm55wmm3ok48n8",
    Reviews: process.env.NOCODB_TABLE_REVIEWS || "mrfo7gyp91oq77b",
    Loyalty_Points_Transactions: process.env.NOCODB_TABLE_LOYALTY_POINTS_TRANSACTIONS || "mn244txmccpwmhx",
    Fraud_Alerts: process.env.NOCODB_TABLE_FRAUD_ALERTS || "mr9txejs65nk1yi",
    Messages: process.env.NOCODB_TABLE_MESSAGES,
    Push_Notifications: process.env.NOCODB_TABLE_PUSH_NOTIFICATIONS,
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
    console.error(`❌ КРИТИЧЕСКАЯ ОШИБКА: Таблица ${tableName} не настроена!`)
    console.error(`❌ Переменная окружения для таблицы ${tableName} не установлена`)
    console.error(`❌ Проверьте переменные окружения на сервере`)
    throw new Error(`TABLE_NOT_CONFIGURED:${tableName} - переменная окружения не установлена`)
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

  console.log(`🌐 serverFetch: ${tableName}`, { url })

  const response = await fetch(url, {
    headers: {
      "xc-token": token,
      "Content-Type": "application/json",
    },
    // Кэшируем на 1 минуту для более частого обновления данных
    next: { revalidate: 60 },
  })

  const text = await response.text()

  if (!response.ok) {
    console.error(`❌ serverFetch error for ${tableName}:`, {
      status: response.status,
      url,
      response: text.substring(0, 500),
    })
    // ✅ ИСПРАВЛЕНО: FIELD_NOT_FOUND не означает, что таблица не найдена
    // Это означает, что поле в запросе неверное (например, created_at вместо Created At)
    if (text.includes("FIELD_NOT_FOUND")) {
      console.warn(`⚠️ Поле не найдено в запросе для ${tableName}, возможно неправильное имя поля в сортировке или фильтре`)
      // Не выбрасываем ошибку TABLE_NOT_FOUND, а возвращаем пустой результат
      return { list: [] } as T
    }
    if (text.includes("TABLE_NOT_FOUND") || (response.status === 404 && !text.includes("FIELD_NOT_FOUND"))) {
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

// Версия serverFetch без кэширования (для использования после обновлений)
async function serverFetchNoCache<T>(tableName: string, params: Record<string, string> = {}): Promise<T> {
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
    // Отключаем кэш для получения свежих данных
    cache: 'no-store',
  })

  const text = await response.text()

  if (!response.ok) {
    // ✅ ИСПРАВЛЕНО: FIELD_NOT_FOUND не означает, что таблица не найдена
    if (text.includes("FIELD_NOT_FOUND")) {
      console.warn(`⚠️ Поле не найдено в запросе для ${tableName}, возможно неправильное имя поля`)
      // Не выбрасываем ошибку TABLE_NOT_FOUND, а возвращаем пустой результат
      return { list: [] } as T
    }
    if (text.includes("TABLE_NOT_FOUND") || (response.status === 404 && !text.includes("FIELD_NOT_FOUND"))) {
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

// Серверная функция для создания/обновления записей напрямую к NocoDB
async function serverCreateRecord<T>(
  tableName: string,
  data: any,
  method: "POST" | "PATCH" = "POST",
  recordId?: number,
): Promise<T> {
  const config = validateNocoDBConfig()
  if (!config.isValid) {
    throw new Error(`NocoDB is not configured: ${config.error}`)
  }

  let baseUrl = getNocoDBUrl().replace(/\/$/, "")
  if (!baseUrl.endsWith("/api/v2")) {
    baseUrl = `${baseUrl}/api/v2`
  }

  const tableId = getTableId(tableName)
  if (!tableId) {
    throw new Error(`TABLE_NOT_CONFIGURED:${tableName}`)
  }

  // NocoDB API v2 для обновления использует bulk update через PATCH к /tables/{tableId}/records
  // с массивом записей, где каждая запись содержит Id и обновляемые поля
  let url: string
  let actualMethod = method
  let bodyData: any = data
  
  if (method === "PATCH" && recordId) {
    // Для обновления одной записи используем bulk update формат
    url = `${baseUrl}/tables/${tableId}/records`
    bodyData = [{ Id: recordId, ...data }]
  } else if (method === "PUT" && recordId) {
    // PUT также используем bulk update
    url = `${baseUrl}/tables/${tableId}/records`
    bodyData = [{ Id: recordId, ...data }]
    actualMethod = "PATCH" // NocoDB использует PATCH для bulk update
  } else {
    url = `${baseUrl}/tables/${tableId}/records`
  }

  const token = getNocoDBToken()

  const response = await fetch(url, {
    method: actualMethod,
    headers: {
      "xc-token": token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyData),
  })

  const text = await response.text()

  if (!response.ok) {
    console.error(`❌ NocoDB ${method} error for ${tableName}:`, {
      status: response.status,
      statusText: response.statusText,
      url,
      data,
      response: text.substring(0, 500),
    })
    // ✅ ИСПРАВЛЕНО: FIELD_NOT_FOUND не означает, что таблица не найдена
    // Это означает, что поле в запросе неверное (например, created_at вместо Created At)
    if (text.includes("FIELD_NOT_FOUND")) {
      console.warn(`⚠️ Поле не найдено в запросе для ${tableName}, возможно неправильное имя поля`)
      // Не выбрасываем ошибку TABLE_NOT_FOUND, а возвращаем пустой результат
      return { list: [] } as T
    }
    if (text.includes("TABLE_NOT_FOUND") || (response.status === 404 && !text.includes("FIELD_NOT_FOUND"))) {
      throw new Error(`TABLE_NOT_FOUND:${tableName}`)
    }
    throw new Error(`NocoDB API error: ${response.status} - ${text.substring(0, 200)}`)
  }

  try {
    const result = JSON.parse(text)
    // NocoDB может вернуть запись в разных форматах
    if (Array.isArray(result)) {
      // Для bulk update может вернуться только Id, тогда получаем полную запись
      if (result.length > 0 && Object.keys(result[0]).length === 1 && 'Id' in result[0] && recordId) {
        console.log(`⚠️ Bulk update returned only Id, fetching full record ${recordId}...`)
        // Небольшая задержка для гарантии сохранения
        await new Promise(resolve => setTimeout(resolve, 500))
        // Повторный запрос БЕЗ кэша
        const fetchedResponse: any = await serverFetchNoCache<any>(tableName, { where: `(Id,eq,${recordId})` })
        const fetchedList = fetchedResponse?.list || []
        if (fetchedList.length > 0) {
          console.log(`✅ Fetched full record after update:`, {
            Id: fetchedList[0].Id,
            loyalty_points_earned: fetchedList[0].loyalty_points_earned,
            'Loyalty Points Earned': fetchedList[0]['Loyalty Points Earned'],
          })
          return fetchedList[0] as T
        } else {
          console.warn(`⚠️ Failed to fetch full record ${recordId}, returning bulk update result`)
        }
      }
      return result[0] as T
    }
    if (result && typeof result === 'object' && 'Id' in result) {
      return result as T
    }
    if (result && typeof result === 'object' && 'record' in result) {
      return result.record as T
    }
    return result as T
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
export async function nocoFetch<T>(
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

// Версия nocoFetch без кэша (для использования после обновлений)
export async function nocoFetchNoCache<T>(
  tableName: string,
  params: Record<string, string> = {},
  options: RequestInit = {},
): Promise<T> {
  const apiBaseUrl = getApiBaseUrl()

  if (apiBaseUrl === null) {
    return serverFetchNoCache<T>(tableName, params)
  } else {
    return clientFetch<T>(tableName, params, { ...options, cache: 'no-store' })
  }
}

// === MEALS ===

export interface NocoDBMeal {
  Id: number
  // NocoDB API возвращает данные с ключами как title (с заглавными буквами и пробелами)
  // Поддерживаем оба варианта: column_name (snake_case) и title
  name?: string
  Name?: string
  category?: string
  Category?: string
  ingredients?: string
  Ingredients?: string
  description?: string
  Description?: string
  price?: number | string
  Price?: number | string
  price_single?: number | string
  "Price (Single)"?: number | string
  price_medium?: number | string
  "Price (Medium)"?: number | string
  price_large?: number | string
  "Price (Large)"?: number | string
  weight?: number | string
  Weight?: number | string
  weight_single?: number | string
  "Weight (Single)"?: number | string
  weight_medium?: number | string
  "Weight (Medium)"?: number | string
  weight_large?: number | string
  "Weight (Large)"?: number | string
  image?: string
  "Image (URL)"?: string
  needs_garnish?: boolean | string
  "Needs Garnish"?: boolean | string
  calories?: number | string
  Calories?: number | string
  protein?: number | string
  Protein?: number | string
  fats?: number | string
  Fats?: number | string
  carbs?: number | string
  Carbs?: number | string
  is_current_week?: boolean | string
  "Current Week"?: boolean | string
  is_next_week?: boolean | string
  "Next Week"?: boolean | string
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
  // NocoDB API возвращает данные с ключами как title (с заглавными буквами и пробелами)
  // Поддерживаем оба варианта: column_name (snake_case) и title
  name?: string
  Name?: string
  category?: string
  Category?: string
  ingredients?: string
  Ingredients?: string
  description?: string
  Description?: string
  price?: number | string
  Price?: number | string
  image?: string
  "Image (URL)"?: string
  is_current_week?: boolean | string
  "Current Week"?: boolean | string
  is_next_week?: boolean | string
  "Next Week"?: boolean | string
  calories?: number | string
  Calories?: number | string
  protein?: number | string
  Protein?: number | string
  fats?: number | string
  Fats?: number | string
  carbs?: number | string
  Carbs?: number | string
  weight?: number | string
  Weight?: number | string
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
  // NocoDB API возвращает данные с ключами как title (с заглавными буквами и пробелами)
  // Поддерживаем оба варианта: column_name (snake_case) и title
  // ✅ ДОБАВЛЕНО: API /api/menu возвращает в camelCase
  city?: string
  City?: string
  district?: string
  District?: string
  delivery_fee?: number | string
  "Delivery Fee"?: number | string
  deliveryFee?: number | string  // ✅ НОВОЕ: из /api/menu
  min_order_amount?: number | string
  "Min Order Amount"?: number | string
  is_available?: boolean | string
  Available?: boolean | string
  available_intervals?: string
  "Available Intervals"?: string | string[]
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
  // NocoDB API возвращает данные с ключами как title (с заглавными буквами и пробелами)
  // Поддерживаем оба варианта: column_name (snake_case) и title
  phone?: string
  Phone?: string
  password_hash?: string
  "Password Hash"?: string
  name?: string
  Name?: string
  additional_phone?: string
  "Additional Phone"?: string
  street?: string
  Street?: string
  building?: string
  Building?: string
  building_section?: string
  "Building Section"?: string
  apartment?: string
  Apartment?: string
  entrance?: string
  Entrance?: string
  floor?: string
  Floor?: string
  intercom?: string
  Intercom?: string
  district?: string
  District?: string
  delivery_comment?: string
  "Delivery Comment"?: string
  loyalty_points?: number | string
  "Loyalty Points"?: number | string
  total_spent?: number | string
  "Total Spent"?: number | string
  created_at?: string
  "Created At"?: string
  updated_at?: string
  "Updated At"?: string
  user_id?: number
  "User ID"?: number
}

export async function fetchUserByPhone(phone: string, noCache: boolean = true): Promise<NocoDBUser | null> {
  // NocoDB API v2 использует заголовки колонок (titles) в where-условиях, а не имена колонок
  // В таблице Users колонка phone имеет заголовок "Phone"
  // ✅ ИСПРАВЛЕНО: По умолчанию используем noCache=true, чтобы избежать возврата удаленных пользователей из кэша
  console.log(`🔍 fetchUserByPhone: поиск пользователя с телефоном=${phone} (noCache=${noCache})`)
  const fetchFn = noCache ? nocoFetchNoCache : nocoFetch
  const response = await fetchFn<NocoDBResponse<any>>("Users", {
    where: `(Phone,eq,${phone})`,
  })
  const rawUser = response.list?.[0]
  if (!rawUser) {
    console.warn(`⚠️ Пользователь с телефоном=${phone} не найден в базе данных`)
    return null
  }
  console.log(`✅ Пользователь найден по телефону:`, {
    rawKeys: Object.keys(rawUser),
    hasId: 'Id' in rawUser,
    hasid: 'id' in rawUser,
    hasUserId: 'User ID' in rawUser,
    Id: rawUser.Id,
    id: rawUser.id,
    userId: rawUser['User ID'] || rawUser.user_id,
    phone: rawUser.phone || rawUser["Phone"],
  })
  
  // Преобразуем данные из формата API (с заголовками колонок) в формат NocoDBUser
  // ВАЖНО: Обрабатываем Id явно, так как в NocoDB может быть Id, id, или другое название
  const internalId = rawUser.Id !== undefined 
    ? rawUser.Id 
    : (rawUser.id !== undefined ? rawUser.id : (rawUser["Id"] !== undefined ? rawUser["Id"] : undefined))
  
  if (internalId === undefined) {
    console.error("❌ Поле Id не найдено в ответе API для пользователя:", rawUser)
    console.error("Доступные поля:", Object.keys(rawUser))
  }
  
  // Обрабатываем User ID (может быть строкой или числом)
  const userIdValue = rawUser.user_id !== undefined 
    ? rawUser.user_id 
    : (rawUser["User ID"] !== undefined 
      ? (typeof rawUser["User ID"] === "string" ? parseInt(rawUser["User ID"]) || undefined : rawUser["User ID"])
      : undefined)
  
  // ВАЖНО: Используем User ID как основной идентификатор, fallback на internalId если User ID не установлен ИЛИ null
  // Проверяем что userIdValue не null и не undefined
  const finalUserId = (userIdValue !== undefined && userIdValue !== null) ? userIdValue : internalId
  
  console.log(`📝 Определены ID:`)
  console.log(`  internalId = ${internalId} (${typeof internalId})`)
  console.log(`  userIdValue = ${userIdValue} (${typeof userIdValue})`)
  console.log(`  finalUserId = ${finalUserId} (${typeof finalUserId})`)
  
  const userId = finalUserId !== undefined ? (typeof finalUserId === 'number' ? finalUserId : parseInt(String(finalUserId))) : 0
  
  console.log(`🔢 userId = ${userId} (${typeof userId}), isNaN = ${isNaN(userId)}`)
  
  // ✅ ВЫЧИСЛЯЕМ баланс из транзакций (единственный источник истины!)
  // ВАЖНО: Проверяем что userId валиден (не 0, не NaN)
  const calculatedBalance = (userId && !isNaN(userId)) ? await calculateUserBalance(userId) : 0
  
  console.log(`✅ fetchUserByPhone: баланс из транзакций = ${calculatedBalance} (userId=${userId}, isValid=${userId && !isNaN(userId)})`)
  
  return {
    ...rawUser,
    Id: userId,
    phone: rawUser.phone || rawUser["Phone"] || "",
    name: rawUser.name || rawUser["Name"] || "",
    password_hash: rawUser.password_hash || rawUser["Password Hash"] || undefined,
    additional_phone: rawUser.additional_phone || rawUser["Additional Phone"] || undefined,
    street: rawUser.street || rawUser["Street"] || undefined,
    building: rawUser.building || rawUser["Building"] || undefined,
    building_section: rawUser.building_section || rawUser["Building Section"] || undefined,
    apartment: rawUser.apartment || rawUser["Apartment"] || undefined,
    entrance: rawUser.entrance || rawUser["Entrance"] || undefined,
    floor: rawUser.floor || rawUser["Floor"] || undefined,
    intercom: rawUser.intercom || rawUser["Intercom"] || undefined,
    district: rawUser.district || rawUser["District"] || undefined,
    delivery_comment: rawUser.delivery_comment || rawUser["Delivery Comment"] || undefined,
    loyalty_points: calculatedBalance, // ✅ Используем вычисленный баланс!
    total_spent: (() => {
      const totalSpentRaw = rawUser.total_spent !== undefined ? rawUser.total_spent : rawUser["Total Spent"]
      if (totalSpentRaw === undefined || totalSpentRaw === null) return 0
      return typeof totalSpentRaw === 'number' ? totalSpentRaw : parseFloat(String(totalSpentRaw)) || 0
    })(),
    created_at: rawUser.created_at || rawUser["Created At"] || "",
    updated_at: rawUser.updated_at || rawUser["Updated At"] || "",
    user_id: userIdValue,
    "User ID": rawUser["User ID"] !== undefined ? rawUser["User ID"] : rawUser.user_id,
  } as NocoDBUser
}

/**
 * Вычисляет текущий баланс баллов пользователя на основе транзакций
 * Это единственный надежный источник правды - не использует поле Users.loyalty_points
 * @param userId ID пользователя
 * @param noCache Отключить кэш для получения свежих данных
 * @returns Текущий баланс баллов
 */
export async function calculateUserBalance(userId: number, noCache: boolean = false): Promise<number> {
  try {
    // Используем nocoFetch - работает и на клиенте (через API proxy) и на сервере
    const fetchFn = noCache ? nocoFetchNoCache : nocoFetch
    const response = await fetchFn<NocoDBResponse<any>>("Loyalty_Points_Transactions", {
      where: `(User ID,eq,${userId})`,
      limit: 10000,
    })
    
    const transactions = response.list || []
    
    // Фильтруем транзакции: учитываем только реально начисленные баллы
    // - undefined/null/"": учитываем (старые транзакции без статуса или NocoDB не заполнил)
    // - 'completed': учитываем (баллы начислены)
    // - 'pending': НЕ учитываем (баллы еще не начислены, ждут оплаты)
    // - 'cancelled': НЕ учитываем (баллы отменены - ВАЖНО: это статус транзакции, не тип!)
    const activeTransactions = transactions.filter((t: any) => {
      const status = t['Transaction Status'] || t.transaction_status
      // ИСПРАВЛЕНО: Если статус undefined, null, или пустая строка - считаем completed
      // Это обрабатывает случаи, когда NocoDB не заполнил поле или вернул null
      if (!status || status === undefined || status === null || status === '') return true
      // Учитываем только completed транзакции
      return status === 'completed'
    })
    
    
    // ✅ ДОБАВЛЕНО: Логирование для диагностики
    if (transactions.length > 0 && activeTransactions.length === 0) {
      console.log(`⚠️ calculateUserBalance(${userId}): Все транзакции отфильтрованы!`, {
        total: transactions.length,
        active: activeTransactions.length,
        sampleStatuses: transactions.slice(0, 5).map((t: any) => ({
          id: t.Id,
          status: t['Transaction Status'] || t.transaction_status,
          type: t['Transaction Type'] || t.transaction_type,
          points: t['Points'] || t.points,
        })),
      })
    }
    
    // Вычисляем баланс
    let balance = 0
    const parsedAmounts: any[] = []
    activeTransactions.forEach((t: any) => {
      const type = t['Transaction Type'] || t.transaction_type
      const amountRaw = t['Points'] || t.points || t['Points Amount'] || 0
      // ✅ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Правильно парсим amount как число
      const amount = typeof amountRaw === 'number' ? amountRaw : parseFloat(String(amountRaw)) || 0
      parsedAmounts.push({ id: t.Id, type, amountRaw, amount, amountRawType: typeof amountRaw })
      
      // Все типы транзакций используют значение Points напрямую
      // (Points уже содержит правильный знак: +141 для earned, -141 для cancelled)
      balance += amount
    })
    
    
    console.log(`💰 calculateUserBalance(${userId}): ${balance} баллов (из ${activeTransactions.length} активных транзакций, всего ${transactions.length})`)
    
    // ✅ ЗАЩИТА: Баланс не может быть отрицательным
    // Отрицательный баланс означает ошибку в логике транзакций
    const finalBalance = Math.max(0, balance)
    if (balance < 0) {
      console.warn(`⚠️ ВНИМАНИЕ: Рассчитанный баланс отрицательный (${balance}), возвращаем 0. Это указывает на ошибку в транзакциях!`)
    }
    return finalBalance
  } catch (error) {
    console.error(`❌ Ошибка вычисления баланса для userId=${userId}:`, error)
    // ✅ ИСПРАВЛЕНО: Если таблица не найдена, возвращаем 0 вместо ошибки
    if (error instanceof Error && (error.message.includes('TABLE_NOT_FOUND') || error.message.includes('TABLE_NOT_CONFIGURED'))) {
      console.warn(`⚠️ Таблица Loyalty_Points_Transactions не найдена или не настроена для пользователя ${userId}, возвращаем баланс 0`)
      console.warn(`⚠️ Проверьте переменную окружения NOCODB_TABLE_LOYALTY_POINTS_TRANSACTIONS`)
      return 0
    }
    // В случае другой ошибки возвращаем 0, чтобы не блокировать работу приложения
    return 0
  }
}

export async function fetchUserById(id: number, noCache: boolean = false): Promise<NocoDBUser | null> {
  console.log(`🔍 fetchUserById: поиск пользователя с Id=${id} (noCache=${noCache})`)
  const fetchFn = noCache ? nocoFetchNoCache : nocoFetch
  
  // ✅ ИСПРАВЛЕНО: Ищем по первичному ключу Id, а не по User ID
  const response = await fetchFn<NocoDBResponse<any>>("Users", {
    where: `(Id,eq,${id})`,
  })
  const rawUser = response.list?.[0]
  if (!rawUser) {
    console.warn(`⚠️ Пользователь с Id=${id} не найден в базе данных`)
    return null
  }
  console.log(`✅ Пользователь найден:`, {
    rawKeys: Object.keys(rawUser),
    hasId: 'Id' in rawUser,
    hasid: 'id' in rawUser,
    hasUserId: 'User ID' in rawUser,
    Id: rawUser.Id,
    id: rawUser.id,
    userId: rawUser['User ID'] || rawUser.user_id,
    phone: rawUser.phone || rawUser["Phone"],
    'Loyalty Points': rawUser['Loyalty Points'],
    loyalty_points: rawUser.loyalty_points,
    'Total Spent': rawUser['Total Spent'],
    total_spent: rawUser.total_spent,
  })
  
  // 🔍 ЛОГИРОВАНИЕ АДРЕСНЫХ ПОЛЕЙ
  console.log(`🔍 [fetchUserById] Address fields from rawUser:`, {
    'District': rawUser.District,
    'district': rawUser.district,
    'Street': rawUser.Street,
    'street': rawUser.street,
    'Building': rawUser.Building,
    'building': rawUser.building,
    'Apartment': rawUser.Apartment,
    'apartment': rawUser.apartment,
  })
  
  // Преобразуем данные из формата API (с заголовками колонок) в формат NocoDBUser
  // ВАЖНО: Обрабатываем Id явно, так как в NocoDB может быть Id, id, или другое название
  const userId = rawUser.Id !== undefined 
    ? rawUser.Id 
    : (rawUser.id !== undefined ? rawUser.id : (rawUser["Id"] !== undefined ? rawUser["Id"] : undefined))
  
  if (userId === undefined) {
    console.error("❌ Поле Id не найдено в ответе API для пользователя:", rawUser)
    console.error("Доступные поля:", Object.keys(rawUser))
  }
  
  // Обрабатываем User ID (может быть строкой или числом)
  const userIdValue = rawUser.user_id !== undefined 
    ? rawUser.user_id 
    : (rawUser["User ID"] !== undefined 
      ? (typeof rawUser["User ID"] === "string" ? parseInt(rawUser["User ID"]) || undefined : rawUser["User ID"])
      : undefined)
  
  const normalizedUser = {
    ...rawUser,
    Id: userId !== undefined ? (typeof userId === 'number' ? userId : parseInt(String(userId))) : 0,
    phone: rawUser.phone || rawUser["Phone"] || "",
    name: rawUser.name || rawUser["Name"] || "",
    password_hash: rawUser.password_hash || rawUser["Password Hash"] || undefined,
    additional_phone: rawUser.additional_phone || rawUser["Additional Phone"] || undefined,
    street: rawUser.street || rawUser["Street"] || undefined,
    building: rawUser.building || rawUser["Building"] || undefined,
    building_section: rawUser.building_section || rawUser["Building Section"] || undefined,
    apartment: rawUser.apartment || rawUser["Apartment"] || undefined,
    entrance: rawUser.entrance || rawUser["Entrance"] || undefined,
    floor: rawUser.floor || rawUser["Floor"] || undefined,
    intercom: rawUser.intercom || rawUser["Intercom"] || undefined,
    district: rawUser.district || rawUser["District"] || undefined,
    delivery_comment: rawUser.delivery_comment || rawUser["Delivery Comment"] || undefined,
    loyalty_points: 0, // Будет вычислено ниже из транзакций
    total_spent: (() => {
      const totalSpentRaw = rawUser.total_spent !== undefined ? rawUser.total_spent : rawUser["Total Spent"]
      if (totalSpentRaw === undefined || totalSpentRaw === null) return 0
      return typeof totalSpentRaw === 'number' ? totalSpentRaw : parseFloat(String(totalSpentRaw)) || 0
    })(),
    created_at: rawUser.created_at || rawUser["Created At"] || "",
    updated_at: rawUser.updated_at || rawUser["Updated At"] || "",
    user_id: userIdValue,
    "User ID": rawUser["User ID"] !== undefined ? rawUser["User ID"] : rawUser.user_id,
  } as NocoDBUser
  
  // ВАЖНО: Вычисляем баланс из транзакций (единственный надежный источник!)
  // Проверяем что userIdValue не null и не undefined, иначе используем userId
  const finalUserIdForBalance = (userIdValue !== undefined && userIdValue !== null) ? userIdValue : userId
  const calculatedBalance = (finalUserIdForBalance && !isNaN(finalUserIdForBalance)) 
    ? await calculateUserBalance(finalUserIdForBalance, noCache) 
    : 0
  normalizedUser.loyalty_points = calculatedBalance
  
  console.log(`✅ fetchUserById normalized result:`, {
    Id: normalizedUser.Id,
    loyalty_points: calculatedBalance,
    total_spent: normalizedUser.total_spent,
    balanceSource: 'calculated from transactions',
  })
  
  // 🔍 ЛОГИРОВАНИЕ НОРМАЛИЗОВАННЫХ АДРЕСНЫХ ПОЛЕЙ
  console.log(`🔍 [fetchUserById] Address fields in normalizedUser:`, {
    'District': normalizedUser.District,
    'district': normalizedUser.district,
    'Street': normalizedUser.Street,
    'street': normalizedUser.street,
    'Building': normalizedUser.Building,
    'building': normalizedUser.building,
    'Apartment': normalizedUser.Apartment,
    'apartment': normalizedUser.apartment,
  })

  return normalizedUser
}

export async function createUser(user: Omit<NocoDBUser, "Id"> & { created_at?: string; updated_at?: string }): Promise<NocoDBUser> {
  const apiBaseUrl = getApiBaseUrl()
  
  // Добавляем created_at и updated_at, если они не переданы
  const now = new Date().toISOString()
  
  // Маппинг полей: используем Title Case для NocoDB API
  const mappedUser: any = {}
  
  if (user.name !== undefined) mappedUser["Name"] = user.name
  if (user.phone !== undefined) mappedUser["Phone"] = user.phone
  if (user.additional_phone !== undefined) mappedUser["Additional Phone"] = user.additional_phone
  if (user.street !== undefined) mappedUser["Street"] = user.street
  if (user.building !== undefined) mappedUser["Building"] = user.building
  if (user.building_section !== undefined) mappedUser["Building Section"] = user.building_section
  if (user.apartment !== undefined) mappedUser["Apartment"] = user.apartment
  if (user.entrance !== undefined) mappedUser["Entrance"] = user.entrance
  if (user.floor !== undefined) mappedUser["Floor"] = user.floor
  if (user.intercom !== undefined) mappedUser["Intercom"] = user.intercom
  if (user.district !== undefined) mappedUser["District"] = user.district
  if (user.delivery_comment !== undefined) mappedUser["Delivery Comment"] = user.delivery_comment
  if (user.loyalty_points !== undefined) mappedUser["Loyalty Points"] = user.loyalty_points
  if (user.total_spent !== undefined) mappedUser["Total Spent"] = user.total_spent
  if (user.user_id !== undefined) mappedUser["User ID"] = user.user_id
  
  mappedUser["Created At"] = user.created_at || now
  mappedUser["Updated At"] = user.updated_at || now
  
  if (apiBaseUrl === null) {
    return serverCreateRecord<NocoDBUser>("Users", mappedUser, "POST")
  } else {
    const response = await clientFetch<any>(
      "Users",
      {},
      {
        method: "POST",
        body: JSON.stringify(mappedUser),
      },
    )
    
    if (Array.isArray(response)) {
      return response[0] as NocoDBUser
    }
    
    if (response && typeof response === 'object' && 'Id' in response) {
      return response as NocoDBUser
    }
    
    if (response && typeof response === 'object' && 'record' in response) {
      return response.record as NocoDBUser
    }
    
    return response as NocoDBUser
  }
}

export async function updateUser(id: number, data: Partial<NocoDBUser>): Promise<NocoDBUser> {
  const apiBaseUrl = getApiBaseUrl()
  
  // Маппинг полей: используем Title Case для NocoDB API
  const mappedData: any = {}
  
  if (data.name !== undefined) mappedData["Name"] = data.name
  if (data.phone !== undefined) mappedData["Phone"] = data.phone
  if (data.additional_phone !== undefined) mappedData["Additional Phone"] = data.additional_phone
  if (data.street !== undefined) mappedData["Street"] = data.street
  if (data.building !== undefined) mappedData["Building"] = data.building
  if (data.building_section !== undefined) mappedData["Building Section"] = data.building_section
  if (data.apartment !== undefined) mappedData["Apartment"] = data.apartment
  if (data.entrance !== undefined) mappedData["Entrance"] = data.entrance
  if (data.floor !== undefined) mappedData["Floor"] = data.floor
  if (data.intercom !== undefined) mappedData["Intercom"] = data.intercom
  if (data.district !== undefined) mappedData["District"] = data.district
  if (data.delivery_comment !== undefined) mappedData["Delivery Comment"] = data.delivery_comment
  // ВАЖНО: loyalty_points ОБНОВЛЯЕТСЯ через updateUser (вычисляется из транзакций, но синхронизируется!)
  if (data.loyalty_points !== undefined) {
    mappedData["Loyalty Points"] = data.loyalty_points
    console.log(`🔍 updateUser: loyalty_points=${data.loyalty_points} (тип: ${typeof data.loyalty_points}) → mappedData["Loyalty Points"]=${mappedData["Loyalty Points"]}`)
  }
  if (data.total_spent !== undefined) mappedData["Total Spent"] = data.total_spent
  if (data.updated_at !== undefined) mappedData["Updated At"] = data.updated_at
  if (data.user_id !== undefined) mappedData["User ID"] = data.user_id
  
  console.log(`📝 updateUser(${id}):`, {
    originalData: data,
    mappedData,
    hasTotalSpent: 'Total Spent' in mappedData,
    totalSpentValue: mappedData["Total Spent"],
  })
  
  if (apiBaseUrl === null) {
    const result = await serverCreateRecord<NocoDBUser>("Users", mappedData, "PATCH", id)
    
    // После bulk update возвращаются не все поля, поэтому мерджим с исходными данными
    const mergedResult = {
      ...result,
      // loyalty_points больше НЕ обновляется (всегда вычисляется из транзакций)
      total_spent: data.total_spent !== undefined ? data.total_spent : result.total_spent,
    } as NocoDBUser
    
    console.log(`✅ updateUser result merged with input:`, {
      Id: mergedResult.Id,
      total_spent: mergedResult.total_spent,
    })
    
    return mergedResult
  } else {
    // ВАЖНО: NocoDB v2 API для обновления использует bulk update формат
    // Нужно передавать МАССИВ записей с Id
    const response = await fetch(`/api/db/Users/records`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{
        Id: id,
        ...mappedData,
      }]),
    })
    
    if (!response.ok) {
      const text = await response.text()
      console.error(`❌ Failed to update user ${id}:`, response.status, text)
      // Не бросаем ошибку - продолжаем работу даже если обновление не удалось
      // Профиль уже сохранён в localStorage
      return {
        Id: id,
        ...data,
      } as NocoDBUser
    }
    
    const result = await response.json()
    
    if (Array.isArray(result)) {
      return result[0] as NocoDBUser
    }
    
    if (result && typeof result === 'object' && 'Id' in result) {
      return result as NocoDBUser
    }
    
    if (result && typeof result === 'object' && 'record' in result) {
      return result.record as NocoDBUser
    }
    
    return result as NocoDBUser
  }
}

// === LOYALTY POINTS FUNCTIONS ===

/**
 * Рассчитывает процент кэшбэка на основе общей суммы потраченных средств
 */
export function calculateCashbackPercent(totalSpent: number): number {
  if (totalSpent >= 50000) return 7 // Gold
  if (totalSpent >= 20000) return 5 // Silver
  return 3 // Bronze
}

/**
 * Рассчитывает количество баллов, которые будут начислены за заказ
 * 
 * ✅ ИСПРАВЛЕНО 2026-01-13: Баллы начисляются на ПОЛНУЮ сумму заказа (orderTotal),
 * а не на сумму минус использованные баллы. Это соответствует документации
 * DATA_ARCHITECTURE_RULES.md: "Баллы начисляются на ПОЛНУЮ сумму заказа"
 * 
 * @param orderTotal - Полная сумма заказа (subtotal + delivery_fee - promo_discount)
 * @param pointsUsed - Количество использованных баллов (не влияет на расчет начисления)
 * @param totalSpent - Общая сумма потраченных средств (для определения уровня лояльности)
 * @returns Количество начисляемых баллов
 */
export function calculateEarnedPoints(orderTotal: number, pointsUsed: number, totalSpent: number): number {
  if (orderTotal <= 0) {
    console.warn(`⚠️ calculateEarnedPoints: orderTotal <= 0 (${orderTotal}), возвращаем 0`)
    return 0
  }
  
  const cashbackPercent = calculateCashbackPercent(totalSpent)
  // ✅ ИСПРАВЛЕНО: Баллы начисляются на ПОЛНУЮ сумму заказа (orderTotal)
  // Использованные баллы (pointsUsed) не влияют на расчет начисления
  const earnedPoints = Math.floor(orderTotal * (cashbackPercent / 100))
  
  console.log(`🔢 calculateEarnedPoints:`, {
    orderTotal,
    pointsUsed,
    totalSpent,
    cashbackPercent,
    earnedPoints,
    calculation: `${orderTotal} * (${cashbackPercent} / 100) = ${earnedPoints}`,
    note: 'Баллы начисляются на полную сумму заказа (orderTotal)',
  })
  
  return earnedPoints
}

/**
 * Рассчитывает стоимость доставки на основе района и суммы заказа
 * @param district - Район доставки
 * @param orderSubtotal - Сумма заказа БЕЗ доставки
 * @param deliveryZones - Список зон доставки (опционально, если не передан - загружается)
 * @returns Стоимость доставки
 */
export async function calculateDeliveryFee(
  district: string | undefined,
  orderSubtotal: number,
  deliveryZones?: NocoDBDeliveryZone[]
): Promise<number> {
  // Если сумма заказа >= 2300₽, доставка бесплатная
  if (orderSubtotal >= 2300) {
    console.log(`✅ Доставка бесплатная: сумма заказа ${orderSubtotal}₽ >= 2300₽`)
    return 0
  }
  
  // Если район не указан, не можем рассчитать доставку
  if (!district) {
    console.warn(`⚠️ Район не указан, возвращаем 0`)
    return 0
  }
  
  // Загружаем зоны доставки, если не переданы
  if (!deliveryZones) {
    deliveryZones = await fetchDeliveryZones()
  }
  
  // Ищем зону для указанного района
  const zone = deliveryZones.find(z => {
    const zoneDistrict = z.District || z.district || ""
    return zoneDistrict.toLowerCase().trim() === district.toLowerCase().trim()
  })
  
  if (!zone) {
    console.warn(`⚠️ Зона доставки для района "${district}" не найдена`)
    return 0
  }
  
  // Получаем стоимость доставки из зоны
  const deliveryFee = typeof zone["Delivery Fee"] === 'number' 
    ? zone["Delivery Fee"]
    : typeof zone.delivery_fee === 'number'
    ? zone.delivery_fee
    : parseFloat(String(zone["Delivery Fee"] || zone.delivery_fee || 0))
  
  console.log(`💰 Стоимость доставки для района "${district}": ${deliveryFee}₽ (сумма заказа: ${orderSubtotal}₽)`)
  
  return deliveryFee
}

/**
 * Начисляет баллы пользователю за заказ
 * @param userId ID пользователя
 * @param orderTotal Общая сумма заказа
 * @param pointsUsed Количество использованных баллов в заказе
 * @param pointsEarned Количество начисляемых баллов (если не указано, рассчитывается автоматически)
 * @param orderId ID заказа (опционально, для связи транзакции с заказом)
 * @returns Обновленный пользователь
 */
export async function createPendingLoyaltyPoints(
  userId: number,
  orderTotal: number,
  pointsUsed: number = 0,
  pointsEarned?: number,
  orderId?: number
): Promise<void> {
  const user = await fetchUserById(userId)
  if (!user) {
    throw new Error(`User with ID ${userId} not found`)
  }

  const currentTotalSpent = typeof user.total_spent === 'number' ? user.total_spent : parseFloat(String(user.total_spent)) || 0
  const currentLoyaltyPoints = typeof user.loyalty_points === 'number' ? user.loyalty_points : parseInt(String(user.loyalty_points)) || 0

  // Рассчитываем баллы, если не указаны
  const earnedPoints = pointsEarned !== undefined 
    ? pointsEarned 
    : calculateEarnedPoints(orderTotal, pointsUsed, currentTotalSpent)

  const now = new Date().toISOString()
  
  // Если использовались баллы, создаем транзакцию на списание (completed)
  if (pointsUsed > 0) {
    try {
      await createLoyaltyPointsTransaction({
        user_id: userId,
        order_id: orderId,
        transaction_type: "used",
        transaction_status: "completed",
        points: -pointsUsed,
        description: `Использовано ${pointsUsed} баллов для оплаты заказа`,
        created_at: now,
        updated_at: now,
        processed_at: now,
      })
    } catch (error) {
      console.error("Failed to create loyalty points transaction for used points:", error)
    }
  }

  // Создаем pending транзакцию на начисление баллов
  if (earnedPoints > 0) {
    try {
      console.log(`⏳ Создание pending транзакции на начисление баллов:`, {
        user_id: userId,
        order_id: orderId,
        transaction_type: "earned",
        transaction_status: "pending",
        points: earnedPoints,
        description: `Ожидает начисления ${earnedPoints} баллов за заказ на сумму ${orderTotal} руб. (наличные)`,
      })
      
      await createLoyaltyPointsTransaction({
        user_id: userId,
        order_id: orderId,
        transaction_type: "earned",
        transaction_status: "pending",
        points: earnedPoints,
        description: `Ожидает начисления ${earnedPoints} баллов за заказ на сумму ${orderTotal} руб. (наличные)`,
        created_at: now,
        updated_at: now,
      })
      
      console.log(`✅ Pending транзакция создана успешно`)
    } catch (error) {
      console.error("❌ Ошибка при создании pending транзакции:", error)
    }
  }

  // ✅ ИСПРАВЛЕНО 2026-01-11: Обновляем totalSpent ВСЕГДА для наличных
  // Баллы не начисляем (pending), но totalSpent обновляем сразу
  const newTotalSpent = currentTotalSpent + orderTotal - pointsUsed
  
  if (pointsUsed > 0) {
    // Если использовались баллы - обновляем и баланс, и totalSpent
    const newLoyaltyPoints = currentLoyaltyPoints - pointsUsed

    console.log(`💳 Обновление баланса пользователя (списание баллов):`, {
      currentLoyaltyPoints,
      pointsUsed,
      newLoyaltyPoints,
      currentTotalSpent,
      orderTotal,
      newTotalSpent,
      calculation: `${currentTotalSpent} + ${orderTotal} - ${pointsUsed} = ${newTotalSpent}`
    })

    await updateUser(userId, {
      loyalty_points: newLoyaltyPoints,
      total_spent: newTotalSpent,
    })
  } else {
    // Если баллы не использовались - обновляем только totalSpent
    console.log(`💳 Обновление totalSpent (наличные без баллов):`, {
      currentTotalSpent,
      orderTotal,
      newTotalSpent,
      calculation: `${currentTotalSpent} + ${orderTotal} = ${newTotalSpent}`
    })

    await updateUser(userId, {
      total_spent: newTotalSpent,
    })
  }

  console.log(`⏳ Pending транзакция создана. Баллы будут начислены позже через cron job`)
}

export async function awardLoyaltyPoints(
  userId: number,
  orderTotal: number,
  pointsUsed: number = 0,
  pointsEarned?: number,
  orderId?: number,
  orderTotalForPoints?: number // ✅ НОВОЕ: Сумма БЕЗ промокода для описания транзакции (на которую начисляются баллы)
): Promise<NocoDBUser> {
  // ✅ ИСПРАВЛЕНО: Всегда загружаем свежие данные без кэша
  const user = await fetchUserById(userId, true)
  if (!user) {
    throw new Error(`User with ID ${userId} not found`)
  }

  const currentTotalSpent = typeof user.total_spent === 'number' ? user.total_spent : parseFloat(String(user.total_spent)) || 0

  // ✅ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Для расчета баллов используем orderTotalForPoints (БЕЗ промокода), если он передан
  // Согласно LOYALTY_POINTS_LOGIC.md: баллы начисляются на сумму БЕЗ промокода (subtotal + deliveryFee)
  // Если orderTotalForPoints не передан, используем orderTotal (для обратной совместимости)
  const amountForPointsCalculation = orderTotalForPoints !== undefined && orderTotalForPoints > 0
    ? orderTotalForPoints
    : orderTotal

  console.log(`🔍 [awardLoyaltyPoints] Параметры для расчета баллов:`, {
    orderTotalForPoints,
    orderTotal,
    amountForPointsCalculation,
    pointsUsed,
    currentTotalSpent,
    pointsEarned,
    willCalculate: pointsEarned === undefined,
  })

  // Рассчитываем баллы, если не указаны
  const earnedPoints = pointsEarned !== undefined 
    ? pointsEarned 
    : calculateEarnedPoints(amountForPointsCalculation, pointsUsed, currentTotalSpent)
  
  console.log(`🔢 [awardLoyaltyPoints] Расчет баллов:`, {
    orderTotal, // С промокодом (для total_spent)
    orderTotalForPoints, // БЕЗ промокода (для расчета баллов)
    amountForPointsCalculation, // Используется для расчета
    pointsUsed,
    currentTotalSpent,
    earnedPoints,
  })

  // Создаем транзакции для истории
  const now = new Date().toISOString()
  
  // Если использовались баллы, создаем транзакцию на списание
  if (pointsUsed > 0) {
    await createLoyaltyPointsTransaction({
      user_id: userId,
      order_id: orderId,
      transaction_type: "used",
      transaction_status: "completed",
      points: -pointsUsed,
      description: `Использовано ${pointsUsed} баллов для оплаты заказа`,
      created_at: now,
      updated_at: now,
      processed_at: now,
    })
    console.log(`✅ Транзакция "used" создана: -${pointsUsed} баллов`)
  }

  // ✅ ЗАЩИТА ОТ ДВОЙНОГО НАЧИСЛЕНИЯ: Проверяем, не начислены ли уже баллы для этого заказа
  if (earnedPoints > 0 && orderId) {
    const existingTransactions = await fetchLoyaltyPointsTransactions(userId)
    const existingEarnedTransaction = existingTransactions.find(
      (t: NocoDBLoyaltyPointsTransaction) => 
        (t.order_id === orderId || t['Order ID'] === orderId) &&
        (t.transaction_type === 'earned' || t['Transaction Type'] === 'earned') &&
        (t.transaction_status === 'completed' || t['Transaction Status'] === 'completed')
    )
    
    if (existingEarnedTransaction) {
      const existingPoints = typeof existingEarnedTransaction.points === 'number'
        ? existingEarnedTransaction.points
        : parseInt(String(existingEarnedTransaction.points || existingEarnedTransaction['Points'] || 0)) || 0
      
      // ✅ УЛУЧШЕНО: Проверяем, совпадает ли количество баллов
      // Если баллы совпадают - это дубликат, пропускаем
      // Если баллы не совпадают - возможно, нужно начислить недостающие (но это редко)
      const pointsMatch = Math.abs(existingPoints - earnedPoints) < 1 // Допускаем разницу в 1 балл из-за округления
      
      if (pointsMatch) {
        console.warn(`⚠️ ЗАЩИТА ОТ ДВОЙНОГО НАЧИСЛЕНИЯ: Баллы уже начислены для заказа ${orderId} (транзакция ${existingEarnedTransaction.Id}, ${existingPoints} баллов). Пропускаем создание новой транзакции.`)
        
        // ✅ ВАЖНО: Проверяем, не обновлялся ли уже total_spent для этого заказа
        // Если транзакция уже существует, значит total_spent уже был обновлен ранее
        // Не обновляем его повторно, чтобы избежать двойного учета суммы заказа
        console.log(`ℹ️ total_spent уже был обновлен при создании предыдущей транзакции, пропускаем обновление`)
        
        // Пересчитываем баланс и возвращаем пользователя без создания новой транзакции
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const recalculatedBalance = await calculateUserBalance(userId, true)
        await updateUser(userId, {
          loyalty_points: recalculatedBalance,
          updated_at: new Date().toISOString(),
        })
        const updatedUser = await fetchUserById(userId, true)
        if (!updatedUser) {
          throw new Error(`User with ID ${userId} not found after update`)
        }
        return updatedUser
      } else {
        // ✅ ВАЖНО: Если баллы не совпадают, это может быть ошибка
        // Логируем предупреждение, но все равно пропускаем создание новой транзакции
        // (чтобы не начислять дважды)
        console.warn(`⚠️ ВНИМАНИЕ: Найдена completed транзакция для заказа ${orderId}, но количество баллов не совпадает!`, {
          existingPoints,
          earnedPoints,
          difference: earnedPoints - existingPoints,
          existingTransactionId: existingEarnedTransaction.Id,
          note: 'Пропускаем создание новой транзакции, но это может быть ошибка в логике'
        })
        
        // Все равно пропускаем создание новой транзакции, чтобы не начислять дважды
        // Пересчитываем баланс и возвращаем пользователя
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const recalculatedBalance = await calculateUserBalance(userId, true)
        await updateUser(userId, {
          loyalty_points: recalculatedBalance,
          updated_at: new Date().toISOString(),
        })
        const updatedUser = await fetchUserById(userId, true)
        if (!updatedUser) {
          throw new Error(`User with ID ${userId} not found after update`)
        }
        return updatedUser
      }
    }
  }

  // Создаем транзакцию на начисление баллов
  let createdTransaction: NocoDBLoyaltyPointsTransaction | undefined = undefined
  if (earnedPoints > 0) {
    // ✅ ВОЗВРАЩЕНО: Всегда пытаемся создать транзакцию, ошибки обрабатываем в try-catch
    // Раньше это работало, даже если переменная окружения не была установлена
    try {
      // ✅ ИСПРАВЛЕНО: Используем orderTotalForPoints (сумма БЕЗ промокода) для описания, если передан
      // Это сумма, на которую реально начисляются баллы (Subtotal + Delivery Fee)
      const orderAmountForDescription = orderTotalForPoints !== undefined ? orderTotalForPoints : orderTotal
      createdTransaction = await createLoyaltyPointsTransaction({
        user_id: userId,
        order_id: orderId,
        transaction_type: "earned",
        transaction_status: "completed",
        points: earnedPoints,
        description: `Начислено ${earnedPoints} баллов за заказ на сумму ${orderAmountForDescription} руб.`,
        created_at: now,
        updated_at: now,
        processed_at: now,
      })
      console.log(`✅ Транзакция "earned" создана: +${earnedPoints} баллов`, {
        transactionId: createdTransaction?.Id,
        userId,
        orderId,
        points: earnedPoints,
        status: createdTransaction?.transaction_status || createdTransaction?.['Transaction Status'],
        fullTransaction: JSON.stringify(createdTransaction),
      })
    } catch (error) {
      console.error(`❌ Ошибка при создании транзакции:`, error)
      // ✅ ИСПРАВЛЕНО: Логируем детали ошибки для диагностики
      if (error instanceof Error && error.message.includes('TABLE_NOT_FOUND')) {
        console.error(`❌ КРИТИЧЕСКАЯ ОШИБКА: Таблица Loyalty_Points_Transactions не найдена!`)
        console.error(`❌ Проверьте переменную окружения NOCODB_TABLE_LOYALTY_POINTS_TRANSACTIONS на сервере`)
        console.error(`❌ Все переменные окружения NOCODB:`, Object.keys(process.env).filter(k => k.includes('NOCODB')).join(', '))
      }
      console.warn(`⚠️ Продолжаем обновление total_spent и баланса без транзакции`)
      // ✅ ИСПРАВЛЕНО: Продолжаем выполнение даже если транзакция не создана
    }
  } else {
  }

  // ✅ КРИТИЧНО: Обновляем total_spent на сумму заказа С учетом промокода (orderTotal)
  // total_spent - это фактически потраченная сумма, поэтому учитываем промокод
  // Но для начисления баллов используем полную сумму БЕЗ промокода (передается отдельно)
  const newTotalSpent = currentTotalSpent + orderTotal - pointsUsed

  console.log(`💳 Обновление total_spent:`, {
    currentTotalSpent,
    orderTotal,
    pointsUsed,
    newTotalSpent,
    calculation_totalSpent: `${currentTotalSpent} + ${orderTotal} - ${pointsUsed} = ${newTotalSpent}`,
    note: 'total_spent обновляется на сумму заказа С учетом промокода (фактически потраченная сумма)',
  })

  // ✅ КРИТИЧНО: Обновляем total_spent в БД
  await updateUser(userId, {
    total_spent: newTotalSpent,
    updated_at: now,
  })
  
  console.log(`✅ [awardLoyaltyPoints] total_spent обновлен в БД: ${newTotalSpent}`)

  // ✅ КРИТИЧНО: Увеличиваем задержку для того, чтобы транзакции были видны в БД
  // NocoDB может иметь задержку индексации, поэтому увеличиваем до 2 секунд
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // ✅ КРИТИЧНО: Пересчитываем баланс из транзакций (единственный источник правды)
  // ✅ ВОЗВРАЩЕНО: Всегда пытаемся пересчитать баланс, ошибки обрабатываем в try-catch
  let recalculatedBalance = 0
  try {
    recalculatedBalance = await calculateUserBalance(userId, true)
    console.log(`🔍 [awardLoyaltyPoints] recalculatedBalance ПЕРЕД console.log:`, {
      value: recalculatedBalance,
      type: typeof recalculatedBalance,
      isNaN: isNaN(recalculatedBalance),
      isNegative: recalculatedBalance < 0,
    })
    console.log(`💳 Пересчитанный баланс из транзакций: ${recalculatedBalance} баллов`)
  } catch (error) {
    console.error(`❌ Ошибка при пересчете баланса, используем earnedPoints:`, error)
    // ✅ ИСПРАВЛЕНО: Если пересчет баланса не удался, используем earnedPoints как приблизительное значение
    // Это лучше, чем возвращать 0, когда баллы уже начислены
    if (error instanceof Error && error.message.includes('TABLE_NOT_FOUND')) {
      console.error(`❌ КРИТИЧЕСКАЯ ОШИБКА: Таблица Loyalty_Points_Transactions не найдена!`)
      console.error(`❌ Проверьте переменную окружения NOCODB_TABLE_LOYALTY_POINTS_TRANSACTIONS на сервере`)
      console.error(`❌ Все переменные окружения NOCODB:`, Object.keys(process.env).filter(k => k.includes('NOCODB')).join(', '))
    }
    recalculatedBalance = earnedPoints
    console.warn(`⚠️ Используем earnedPoints (${earnedPoints}) как баланс из-за ошибки пересчета`)
  }
  
  // Обновляем баланс в БД на основе пересчитанного значения
  await updateUser(userId, {
    loyalty_points: recalculatedBalance,
    updated_at: now,
  })
  console.log(`✅ Баланс обновлен в БД: ${recalculatedBalance} баллов`)

  // Возвращаем пользователя с актуальным балансом
  const updatedUser = await fetchUserById(userId, true) // noCache для свежих данных
  if (!updatedUser) {
    throw new Error(`User with ID ${userId} not found after update`)
  }

  console.log(`✅ awardLoyaltyPoints завершено:`, {
    userId,
    earnedPoints,
    pointsUsed,
    actualBalance: updatedUser.loyalty_points,
    totalSpent: updatedUser.total_spent,
    expectedTotalSpent: newTotalSpent,
    totalSpentMatch: updatedUser.total_spent === newTotalSpent,
  })

  return updatedUser
}

/**
 * Списывает баллы пользователя при отмене заказа
 * @param userId ID пользователя
 * @param pointsEarned Количество начисленных баллов, которые нужно списать
 * @param pointsUsed Количество использованных баллов, которые нужно вернуть
 * @param orderTotal Сумма заказа для корректировки total_spent
 * @param orderId ID заказа (опционально, для связи транзакции с заказом)
 * @returns Обновленный пользователь
 */
export async function refundLoyaltyPoints(
  userId: number,
  pointsEarned: number,
  pointsUsed: number,
  orderTotal: number,
  orderId?: number
): Promise<NocoDBUser> {
  const user = await fetchUserById(userId)
  if (!user) {
    throw new Error(`User with ID ${userId} not found`)
  }

  // Создаем транзакции для истории
  const now = new Date().toISOString()

  // Если были использованы баллы, возвращаем их
  if (pointsUsed > 0) {
    console.log(`📝 Создаем транзакцию "refunded": points=+${pointsUsed}`)
    const refundedTransaction = await createLoyaltyPointsTransaction({
      user_id: userId,
      order_id: orderId,
      transaction_type: "refunded",
      transaction_status: "completed", // КРИТИЧНО: транзакция сразу completed
      points: pointsUsed, // ← ПОЛОЖИТЕЛЬНОЕ число (возврат баллов)
      description: `Возвращено ${pointsUsed} баллов при отмене заказа`,
      created_at: now,
      updated_at: now,
      processed_at: now,
    })
    console.log(`✅ Транзакция "refunded" создана:`, {
      Id: refundedTransaction.Id,
      points: refundedTransaction.points,
      type: refundedTransaction.transaction_type,
      status: refundedTransaction.transaction_status,
    })
  }

  // Списываем начисленные баллы
  if (pointsEarned > 0) {
    console.log(`📝 Создаем транзакцию "cancelled": points=-${pointsEarned}`)
    const cancelledTransaction = await createLoyaltyPointsTransaction({
      user_id: userId,
      order_id: orderId,
      transaction_type: "cancelled",
      transaction_status: "completed", // КРИТИЧНО: транзакция сразу completed
      points: -pointsEarned, // ← ОТРИЦАТЕЛЬНОЕ число (списание баллов)
      description: `Списано ${pointsEarned} баллов при отмене заказа`,
      created_at: now,
      updated_at: now,
      processed_at: now,
    })
    console.log(`✅ Транзакция "cancelled" создана:`, {
      Id: cancelledTransaction.Id,
      points: cancelledTransaction.points,
      type: cancelledTransaction.transaction_type,
      status: cancelledTransaction.transaction_status,
    })
  }

  // ✅ НЕ обновляем loyalty_points напрямую!
  // Баланс всегда вычисляется из транзакций через calculateUserBalance
  console.log(`💳 refundLoyaltyPoints - транзакции созданы:`, {
    userId,
    orderId,
    pointsUsed: pointsUsed > 0 ? `+${pointsUsed}` : 0,
    pointsEarned: pointsEarned > 0 ? `-${pointsEarned}` : 0,
    explanation: `Баланс будет пересчитан из транзакций автоматически при следующем fetchUserById`,
  })

  // ✅ ИСПРАВЛЕНО 2026-01-15: Откатываем total_spent при возврате баллов
  // ✅ КРИТИЧНО: Загружаем свежие данные пользователя для получения актуального total_spent
  const freshUser = await fetchUserById(userId, true)
  if (!freshUser) {
    throw new Error(`User with ID ${userId} not found`)
  }
  
  const currentTotalSpent = typeof freshUser.total_spent === 'number' 
    ? freshUser.total_spent 
    : parseFloat(String(freshUser.total_spent)) || 0

  // Формула отката: newTotalSpent = currentTotalSpent - orderTotal + pointsUsed
  // (откатываем сумму заказа, но возвращаем использованные баллы)
  // ✅ ЗАЩИТА: Не позволяем total_spent стать отрицательным
  const newTotalSpent = Math.max(0, currentTotalSpent - orderTotal + pointsUsed)

  console.log(`💳 refundLoyaltyPoints - откат total_spent:`, {
    currentTotalSpent,
    orderTotal,
    pointsUsed,
    newTotalSpent,
    calculation: `${currentTotalSpent} - ${orderTotal} + ${pointsUsed} = ${newTotalSpent}`,
  })

  // Обновляем total_spent в БД
  await updateUser(userId, {
    total_spent: newTotalSpent,
    updated_at: now,
  })

  console.log(`✅ total_spent откачен: ${currentTotalSpent} → ${newTotalSpent}`)

  // ✅ КРИТИЧНО: Пересчитываем баланс из транзакций и обновляем в БД
  const recalculatedBalance = await calculateUserBalance(userId, true)
  console.log(`🔍 [refundLoyaltyPoints] recalculatedBalance ПЕРЕД console.log:`, {
    value: recalculatedBalance,
    type: typeof recalculatedBalance,
    isNaN: isNaN(recalculatedBalance),
    isNegative: recalculatedBalance < 0,
  })
  console.log(`💳 Пересчитанный баланс из транзакций: ${recalculatedBalance} баллов`)
  
  // Обновляем баланс в БД на основе пересчитанного значения
  await updateUser(userId, {
    loyalty_points: recalculatedBalance,
    updated_at: now,
  })
  console.log(`✅ Баланс обновлен в БД: ${recalculatedBalance} баллов`)

  // Возвращаем пользователя с актуальным балансом (пересчитанным из транзакций)
  const updatedUser = await fetchUserById(userId, true) // noCache для свежих данных
  if (!updatedUser) {
    throw new Error(`User with ID ${userId} not found after refund`)
  }

  console.log(`✅ Актуальный баланс после возврата: ${updatedUser.loyalty_points} баллов (пересчитан из транзакций)`)

  return updatedUser
}

// === ORDERS ===

export interface NocoDBOrder {
  Id: number
  // NocoDB API возвращает данные с ключами как title (с заглавными буквами и пробелами)
  // Поддерживаем оба варианта: column_name (snake_case) и title
  user_id?: number
  "User ID"?: number
  order_number?: string
  "Order Number"?: string
  start_date?: string
  "Start Date"?: string
  delivery_time?: string
  "Delivery Time"?: string
  
  // Улучшенные статусы оплаты
  payment_status?: "pending" | "paid" | "refunded" | "failed"
  "Payment Status"?: "pending" | "paid" | "refunded" | "failed"
  payment_method?: "cash" | "card" | "sbp" | "online"
  "Payment Method"?: "cash" | "card" | "sbp" | "online"
  paid?: boolean | string
  Paid?: boolean | string
  paid_at?: string
  "Paid At"?: string
  payment_id?: string
  "Payment ID"?: string
  
  // Общий статус заказа (без статусов доставки)
  order_status?: "pending" | "confirmed" | "preparing" | "ready" | "cancelled"
  "Order Status"?: "pending" | "confirmed" | "preparing" | "ready" | "cancelled"
  
  // УДАЛЕНО: delivered, cancelled, status - статусы доставки убраны
  
  // 🆕 ДОСТАВКА
  delivery_fee?: number | string
  "Delivery Fee"?: number | string
  delivery_district?: string
  "Delivery District"?: string
  delivery_address?: string
  "Delivery Address"?: string
  
  promo_code?: string
  "Promo Code"?: string
  promo_discount?: number | string
  "Promo Discount"?: number | string
  loyalty_points_used?: number | string
  "Loyalty Points Used"?: number | string
  loyalty_points_earned?: number | string
  "Loyalty Points Earned"?: number | string
  subtotal?: number | string
  Subtotal?: number | string
  total?: number | string
  Total?: number | string
  guest_phone?: string
  "Guest Phone"?: string
  guest_address?: string
  "Guest Address"?: string
  created_at?: string
  "Created At"?: string
  updated_at?: string
  "Updated At"?: string
}

export async function fetchOrders(userId?: number): Promise<NocoDBOrder[]> {
  const params: Record<string, string> = {
    limit: "1000",
    // ✅ ИСПРАВЛЕНО: Убрана сортировка по "Start Date" - может вызывать FIELD_NOT_FOUND
    // Сортируем на клиенте по Id (более новые заказы имеют больший Id)
    // sort: "-Start Date", // Убрано для избежания ошибок FIELD_NOT_FOUND
  }

  if (userId) {
    // NocoDB API v2 использует заголовки колонок в where-условиях
    // В таблице Orders колонка user_id имеет заголовок "User ID"
    // ✅ ФИЛЬТРУЕМ отмененные заказы на уровне БД
    params.where = `(User ID,eq,${userId})~and(Order Status,neq,cancelled)`
  } else {
    // ✅ Если userId не указан, все равно фильтруем отмененные заказы
    params.where = `(Order Status,neq,cancelled)`
  }

  const response = await nocoFetch<NocoDBResponse<any>>("Orders", params)
  
  console.log(`📦 fetchOrders: получено ${response.list?.length || 0} заказов из БД (userId=${userId || 'all'})`)
  
  // Нормализуем каждый заказ (Title Case → snake_case)
  let normalizedOrders = (response.list || []).map(rawOrder => ({
    ...rawOrder,
    Id: rawOrder.Id || rawOrder.id || 0,
    user_id: rawOrder.user_id ?? rawOrder["User ID"],
    "User ID": rawOrder["User ID"] ?? rawOrder.user_id,
    order_number: rawOrder.order_number ?? rawOrder["Order Number"] ?? "",
    "Order Number": rawOrder["Order Number"] ?? rawOrder.order_number ?? "",
    start_date: rawOrder.start_date ?? rawOrder["Start Date"] ?? "",
    "Start Date": rawOrder["Start Date"] ?? rawOrder.start_date ?? "",
    delivery_time: rawOrder.delivery_time ?? rawOrder["Delivery Time"] ?? "",
    "Delivery Time": rawOrder["Delivery Time"] ?? rawOrder.delivery_time ?? "",
    payment_status: (rawOrder.payment_status ?? rawOrder["Payment Status"] ?? "pending") as "pending" | "paid" | "refunded" | "failed",
    "Payment Status": (rawOrder["Payment Status"] ?? rawOrder.payment_status ?? "pending") as "pending" | "paid" | "refunded" | "failed",
    payment_method: (rawOrder.payment_method ?? rawOrder["Payment Method"] ?? "cash") as "cash" | "card" | "sbp" | "online",
    "Payment Method": (rawOrder["Payment Method"] ?? rawOrder.payment_method ?? "cash") as "cash" | "card" | "sbp" | "online",
    // ✅ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Правильно нормализуем paid как boolean для всех форматов
    paid: (() => {
      const paidValue = rawOrder.paid !== undefined ? rawOrder.paid : rawOrder["Paid"]
      return paidValue === true || String(paidValue).toLowerCase() === 'true' || String(paidValue) === '1'
    })(),
    Paid: rawOrder["Paid"] !== undefined ? rawOrder["Paid"] : rawOrder.paid,
    paid_at: rawOrder.paid_at ?? rawOrder["Paid At"],
    "Paid At": rawOrder["Paid At"] ?? rawOrder.paid_at,
    payment_id: rawOrder.payment_id ?? rawOrder["Payment ID"],
    "Payment ID": rawOrder["Payment ID"] ?? rawOrder.payment_id,
    order_status: (rawOrder.order_status ?? rawOrder["Order Status"] ?? "pending") as "pending" | "confirmed" | "preparing" | "ready" | "cancelled",
    "Order Status": (rawOrder["Order Status"] ?? rawOrder.order_status ?? "pending") as "pending" | "confirmed" | "preparing" | "ready" | "cancelled",
    promo_code: rawOrder.promo_code ?? rawOrder["Promo Code"],
    "Promo Code": rawOrder["Promo Code"] ?? rawOrder.promo_code,
    promo_discount: rawOrder.promo_discount ?? rawOrder["Promo Discount"],
    "Promo Discount": rawOrder["Promo Discount"] ?? rawOrder.promo_discount,
    loyalty_points_used: rawOrder.loyalty_points_used ?? rawOrder["Loyalty Points Used"] ?? 0,
    "Loyalty Points Used": rawOrder["Loyalty Points Used"] ?? rawOrder.loyalty_points_used ?? 0,
    loyalty_points_earned: rawOrder.loyalty_points_earned ?? rawOrder["Loyalty Points Earned"] ?? 0,
    "Loyalty Points Earned": rawOrder["Loyalty Points Earned"] ?? rawOrder.loyalty_points_earned ?? 0,
    subtotal: rawOrder.subtotal ?? rawOrder.Subtotal ?? 0,
    Subtotal: rawOrder.Subtotal ?? rawOrder.subtotal ?? 0,
    total: rawOrder.total ?? rawOrder.Total ?? 0,
    Total: rawOrder.Total ?? rawOrder.total ?? 0,
    guest_phone: rawOrder.guest_phone ?? rawOrder["Guest Phone"],
    "Guest Phone": rawOrder["Guest Phone"] ?? rawOrder.guest_phone,
    guest_address: rawOrder.guest_address ?? rawOrder["Guest Address"],
    "Guest Address": rawOrder["Guest Address"] ?? rawOrder.guest_address,
    created_at: rawOrder.created_at ?? rawOrder["Created At"] ?? "",
    "Created At": rawOrder["Created At"] ?? rawOrder.created_at ?? "",
    updated_at: rawOrder.updated_at ?? rawOrder["Updated At"] ?? "",
    "Updated At": rawOrder["Updated At"] ?? rawOrder.updated_at ?? "",
  } as NocoDBOrder))
  
  return normalizedOrders
}

export async function fetchOrdersByUser(userId: number): Promise<NocoDBOrder[]> {
  return fetchOrders(userId)
}

/**
 * Загружает заказы пользователя с полными деталями (persons, meals, extras)
 * @param userId ID пользователя
 * @returns Массив заказов с деталями в формате Order[]
 */
export async function fetchOrdersWithDetails(userId: number, noCache: boolean = true): Promise<any[]> {
  // ✅ По умолчанию БЕЗ кэша для актуальных данных
  const params: Record<string, string> = {
    limit: "1000",
    // ✅ ИСПРАВЛЕНО: Убрана сортировка по "Start Date" - может вызывать FIELD_NOT_FOUND
    // Сортируем на клиенте по Id (более новые заказы имеют больший Id)
    // sort: "-Start Date", // Убрано для избежания ошибок FIELD_NOT_FOUND
  }
  params.where = `(User ID,eq,${userId})~and(Order Status,neq,cancelled)`
  
  const fetchFn = noCache ? nocoFetchNoCache : nocoFetch
  const response = await fetchFn<NocoDBResponse<any>>("Orders", params)
  let orders = response.list || []
  
  // ✅ Сортируем на клиенте по Id (более новые заказы имеют больший Id)
  orders.sort((a: any, b: any) => (b.Id || 0) - (a.Id || 0))
  
  console.log(`📦 Загрузка деталей для ${orders.length} заказов пользователя ${userId} (noCache=${noCache})...`)
  
  // Загружаем детали для каждого заказа параллельно
  const ordersWithDetails = await Promise.all(
    orders.map(async (order) => {
      try {
        // Загружаем persons и extras
        const [dbPersons, dbExtras] = await Promise.all([
          fetchOrderPersons(order.Id),
          fetchOrderExtras(order.Id),
        ])
        
        // Для каждого person загружаем meals и преобразуем в формат Person
        const persons = await Promise.all(
          dbPersons.map(async (dbPerson: any) => {
            const dbMeals = await fetchOrderMeals(dbPerson.Id || dbPerson.id)
            
            // Создаем пустую структуру day1 и day2
            const day1: any = {
              breakfast: { dish: null },
              lunch: { salad: null, soup: null, main: null },
              dinner: { salad: null, soup: null, main: null },
            }
            const day2: any = {
              breakfast: { dish: null },
              lunch: { salad: null, soup: null, main: null },
              dinner: { salad: null, soup: null, main: null },
            }
            
            // ✅ Используем СОХРАНЕННЫЕ данные из Order_Meals (не загружаем заново из Meals!)
            await Promise.all(
              dbMeals.map(async (dbMeal: any) => {
                const mealId = dbMeal.meal_id || dbMeal["Meal ID"]
                if (!mealId) return
                
                // Загружаем базовую информацию о блюде (название, категория)
                const meal = await fetchMealById(mealId)
                if (!meal) return
                
                const day = (dbMeal.day || dbMeal.Day) as "day1" | "day2"
                const mealTime = (dbMeal.meal_time || dbMeal["Meal Time"]) as "breakfast" | "lunch" | "dinner"
                const mealType = (dbMeal.meal_type || dbMeal["Meal Type"]) as "dish" | "salad" | "soup" | "main"
                const portionSize = (dbMeal.portion_size || dbMeal["Portion Size"] || "single") as "single" | "medium" | "large"
                
                // ✅ ИСПОЛЬЗУЕМ СОХРАНЕННУЮ ЦЕНУ из Order_Meals (уже округленную!)
                const savedPrice = dbMeal.price || dbMeal.Price || 0
                
                // ✅ ЗАМЕНЯЕМ цены в prices на округленные из Order_Meals!
                const roundedPrices = {
                  single: portionSize === 'single' ? savedPrice : (meal.prices?.single ? Math.round(meal.prices.single) : 0),
                  medium: portionSize === 'medium' ? savedPrice : (meal.prices?.medium ? Math.round(meal.prices.medium) : undefined),
                  large: portionSize === 'large' ? savedPrice : (meal.prices?.large ? Math.round(meal.prices.large) : undefined),
                }
                
                // ✅ Обрабатываем гарнир если есть
                let garnishObject = null
                const garnishId = dbMeal.garnish_id || dbMeal["Garnish ID"]
                if (garnishId) {
                  const garnish = await fetchMealById(garnishId)
                  if (garnish) {
                    const garnishPortion = (dbMeal.garnish_portion_size || dbMeal["Garnish Portion Size"] || "single") as "single" | "medium" | "large"
                    const savedGarnishPrice = dbMeal.garnish_price || dbMeal["Garnish Price"] || 0
                    
                    const roundedGarnishPrices = {
                      single: garnishPortion === 'single' ? savedGarnishPrice : (garnish.prices?.single ? Math.round(garnish.prices.single) : 0),
                      medium: garnishPortion === 'medium' ? savedGarnishPrice : (garnish.prices?.medium ? Math.round(garnish.prices.medium) : undefined),
                      large: garnishPortion === 'large' ? savedGarnishPrice : (garnish.prices?.large ? Math.round(garnish.prices.large) : undefined),
                    }
                    
                    garnishObject = {
                      id: garnish.Id,
                      name: garnish.name || garnish.Name || "",
                      price: savedGarnishPrice,
                      prices: roundedGarnishPrices,
                      weights: garnish.weights,
                      portion: garnishPortion,
                      category: garnish.category || garnish.Category || "",
                    }
                  }
                }
                
                // Формируем объект блюда
                const mealObject = {
                  id: meal.Id,
                  name: meal.name || meal.Name || "",
                  price: savedPrice, // ✅ Цена из Order_Meals (округленная при создании заказа)
                  prices: roundedPrices, // ✅ ВСЕ цены округлены!
                  weights: meal.weights, // ✅ Граммовки из Meals
                  portion: portionSize, // ✅ Строка: "single" | "medium" | "large"
                  category: meal.category || meal.Category || "",
                  garnish: garnishObject, // ✅ Гарнир с округленными ценами
                }
                
                // Размещаем блюдо в правильный слот
                const dayObj = day === "day1" ? day1 : day2
                if (mealTime === "breakfast" && mealType === "dish") {
                  dayObj.breakfast.dish = mealObject
                } else if (mealTime === "lunch") {
                  if (mealType === "salad") dayObj.lunch.salad = mealObject
                  else if (mealType === "soup") dayObj.lunch.soup = mealObject
                  else if (mealType === "main") dayObj.lunch.main = mealObject
                } else if (mealTime === "dinner") {
                  if (mealType === "salad") dayObj.dinner.salad = mealObject
                  else if (mealType === "soup") dayObj.dinner.soup = mealObject
                  else if (mealType === "main") dayObj.dinner.main = mealObject
                }
              })
            )
            
            return {
              id: dbPerson.Id || dbPerson.id,
              day1,
              day2,
            }
          })
        )
        
        // Преобразуем extras в формат Extra[]
        const extras = await Promise.all(
          dbExtras.map(async (dbExtra: any) => {
            const extraId = dbExtra.extra_id || dbExtra["Extra ID"]
            if (!extraId) return null
            
            // Загружаем базовую информацию (название) из таблицы Extras
            const extraResponse = await nocoFetch<NocoDBResponse<any>>("Extras", {
              where: `(Id,eq,${extraId})`,
            })
            const extraData = extraResponse.list?.[0]
            if (!extraData) return null
            
            // ✅ ИСПОЛЬЗУЕМ СОХРАНЕННУЮ ЦЕНУ из Order_Extras (уже округленную!)
            const savedPrice = dbExtra.price || dbExtra.Price || 0
            
            return {
              id: extraData.Id,
              name: extraData.name || extraData.Name || "",
              price: savedPrice, // ✅ Цена из Order_Extras (округленная при создании заказа)
              quantity: parseInt(String(dbExtra.quantity || dbExtra.Quantity || 1)),
            }
          })
        )
        
        // ✅ ИСПРАВЛЕНИЕ: Пересчитываем total из Order_Meals, если в БД он равен 0
        let calculatedTotal = order.total || order.Total || 0
        let calculatedSubtotal = order.subtotal || order.Subtotal || 0
        
        // Если total === 0 (баг от старой версии кода), пересчитываем из цен
        if (calculatedTotal === 0 && (persons.length > 0 || extras.filter((e: any) => e !== null).length > 0)) {
          console.log(`🔧 [fetchOrdersWithDetails] Заказ ${order.Id}: total=0, пересчитываем из цен...`)
          
          // Считаем стоимость всех блюд
          persons.forEach((person: any) => {
            ['day1', 'day2'].forEach((day) => {
              const dayMeals = person[day]
              // Завтрак
              if (dayMeals?.breakfast?.dish?.price) {
                calculatedTotal += dayMeals.breakfast.dish.price
                if (dayMeals.breakfast.dish.garnish?.price) {
                  calculatedTotal += dayMeals.breakfast.dish.garnish.price
                }
              }
              // Обед
              if (dayMeals?.lunch?.salad?.price) calculatedTotal += dayMeals.lunch.salad.price
              if (dayMeals?.lunch?.salad?.garnish?.price) calculatedTotal += dayMeals.lunch.salad.garnish.price
              if (dayMeals?.lunch?.soup?.price) calculatedTotal += dayMeals.lunch.soup.price
              if (dayMeals?.lunch?.soup?.garnish?.price) calculatedTotal += dayMeals.lunch.soup.garnish.price
              if (dayMeals?.lunch?.main?.price) calculatedTotal += dayMeals.lunch.main.price
              if (dayMeals?.lunch?.main?.garnish?.price) calculatedTotal += dayMeals.lunch.main.garnish.price
              // Ужин
              if (dayMeals?.dinner?.salad?.price) calculatedTotal += dayMeals.dinner.salad.price
              if (dayMeals?.dinner?.salad?.garnish?.price) calculatedTotal += dayMeals.dinner.salad.garnish.price
              if (dayMeals?.dinner?.soup?.price) calculatedTotal += dayMeals.dinner.soup.price
              if (dayMeals?.dinner?.soup?.garnish?.price) calculatedTotal += dayMeals.dinner.soup.garnish.price
              if (dayMeals?.dinner?.main?.price) calculatedTotal += dayMeals.dinner.main.price
              if (dayMeals?.dinner?.main?.garnish?.price) calculatedTotal += dayMeals.dinner.main.garnish.price
            })
          })
          
          // Считаем стоимость extras
          extras.filter((e: any) => e !== null).forEach((extra: any) => {
            calculatedTotal += (extra.price || 0) * (extra.quantity || 1)
          })
          
          calculatedSubtotal = calculatedTotal
          console.log(`✅ [fetchOrdersWithDetails] Заказ ${order.Id}: пересчитан total=${calculatedTotal}`)
        }
        
        // ✅ Маппим поля NocoDB в формат приложения
        return {
          id: order.Id,
          orderNumber: order.order_number || order["Order Number"],
          startDate: order.start_date || order["Start Date"],
          deliveryTime: order.delivery_time || order["Delivery Time"] || "",
          paymentMethod: order.payment_method || order["Payment Method"] || "cash",
          paid: order.paid ?? order.Paid ?? false,
          paidAt: order.paid_at || order["Paid At"],
          paymentStatus: order.payment_status || order["Payment Status"] || "pending",
          orderStatus: order.order_status || order["Order Status"] || "pending",
          total: calculatedTotal,
          subtotal: calculatedSubtotal,
          deliveryFee: order.delivery_fee || order["Delivery Fee"] || 0,
          deliveryDistrict: order.delivery_district || order["Delivery District"],
          deliveryAddress: order.delivery_address || order["Delivery Address"],
          promoCode: order.promo_code || order["Promo Code"],
          promoDiscount: (() => {
            const discount = order.promo_discount || order["Promo Discount"]
            if (discount === undefined || discount === null) return 0
            return typeof discount === 'number' ? discount : (Number(discount) || 0)
          })(),
          loyaltyPointsUsed: order.loyalty_points_used || order["Loyalty Points Used"] || 0,
          loyaltyPointsEarned: order.loyalty_points_earned || order["Loyalty Points Earned"] || 0,
          persons,
          extras: extras.filter((e: any) => e !== null),
        }
      } catch (error) {
        console.error(`❌ Ошибка загрузки деталей заказа ${order.Id}:`, error)
        return {
          id: order.Id,
          orderNumber: order.order_number || order["Order Number"],
          startDate: order.start_date || order["Start Date"],
          deliveryTime: order.delivery_time || order["Delivery Time"] || "",
          paymentMethod: order.payment_method || order["Payment Method"] || "cash",
          paid: order.paid ?? order.Paid ?? false,
          paidAt: order.paid_at || order["Paid At"],
          paymentStatus: order.payment_status || order["Payment Status"] || "pending",
          orderStatus: order.order_status || order["Order Status"] || "pending",
          total: order.total || order.Total || 0,
          subtotal: order.subtotal || order.Subtotal || 0,
          deliveryFee: order.delivery_fee || order["Delivery Fee"] || 0,
          deliveryDistrict: order.delivery_district || order["Delivery District"],
          deliveryAddress: order.delivery_address || order["Delivery Address"],
          promoCode: order.promo_code || order["Promo Code"],
          promoDiscount: (() => {
            const discount = order.promo_discount || order["Promo Discount"]
            if (discount === undefined || discount === null) return 0
            return typeof discount === 'number' ? discount : (Number(discount) || 0)
          })(),
          loyaltyPointsUsed: order.loyalty_points_used || order["Loyalty Points Used"] || 0,
          loyaltyPointsEarned: order.loyalty_points_earned || order["Loyalty Points Earned"] || 0,
          persons: [],
          extras: [],
        }
      }
    })
  )
  
  console.log(`✅ Загружены детали для ${ordersWithDetails.length} заказов`)
  return ordersWithDetails
}

export function generateOrderNumber(): string {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, "")
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ORD-${date}-${random}`
}

export async function fetchOrderById(id: number, noCache: boolean = false): Promise<NocoDBOrder | null> {
  const fetchFn = noCache ? nocoFetchNoCache : nocoFetch
  const response = await fetchFn<NocoDBResponse<any>>("Orders", {
    where: `(Id,eq,${id})`,
  })
  const rawOrder = response.list?.[0]
  if (!rawOrder) return null
  
  console.log(`🔍 fetchOrderById(${id}, noCache=${noCache}) raw data:`, {
    'Loyalty Points Earned': rawOrder["Loyalty Points Earned"],
    'loyalty_points_earned': rawOrder.loyalty_points_earned,
    'Total': rawOrder.Total,
    'total': rawOrder.total,
  })
  
  // Преобразуем данные из формата API (с заголовками колонок) в формат NocoDBOrder
  // Поддерживаем оба варианта: column_name (snake_case) и title (с заглавными буквами)
  return {
    ...rawOrder,
    Id: rawOrder.Id || rawOrder.id || 0,
    user_id: rawOrder.user_id ?? rawOrder["User ID"],
    "User ID": rawOrder["User ID"] ?? rawOrder.user_id,
    order_number: rawOrder.order_number ?? rawOrder["Order Number"] ?? "",
    "Order Number": rawOrder["Order Number"] ?? rawOrder.order_number ?? "",
    start_date: rawOrder.start_date ?? rawOrder["Start Date"] ?? "",
    "Start Date": rawOrder["Start Date"] ?? rawOrder.start_date ?? "",
    delivery_time: rawOrder.delivery_time ?? rawOrder["Delivery Time"] ?? "",
    "Delivery Time": rawOrder["Delivery Time"] ?? rawOrder.delivery_time ?? "",
    payment_status: (rawOrder.payment_status ?? rawOrder["Payment Status"] ?? "pending") as "pending" | "paid" | "refunded" | "failed",
    "Payment Status": (rawOrder["Payment Status"] ?? rawOrder.payment_status ?? "pending") as "pending" | "paid" | "refunded" | "failed",
    payment_method: (rawOrder.payment_method ?? rawOrder["Payment Method"] ?? "cash") as "cash" | "card" | "sbp" | "online",
    "Payment Method": (rawOrder["Payment Method"] ?? rawOrder.payment_method ?? "cash") as "cash" | "card" | "sbp" | "online",
    // ✅ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Правильно нормализуем paid как boolean для всех форматов
    paid: (() => {
      const paidValue = rawOrder.paid !== undefined ? rawOrder.paid : rawOrder["Paid"]
      return paidValue === true || String(paidValue).toLowerCase() === 'true' || String(paidValue) === '1'
    })(),
    Paid: rawOrder["Paid"] !== undefined ? rawOrder["Paid"] : rawOrder.paid,
    paid_at: rawOrder.paid_at ?? rawOrder["Paid At"],
    "Paid At": rawOrder["Paid At"] ?? rawOrder.paid_at,
    payment_id: rawOrder.payment_id ?? rawOrder["Payment ID"],
    "Payment ID": rawOrder["Payment ID"] ?? rawOrder.payment_id,
    order_status: (rawOrder.order_status ?? rawOrder["Order Status"] ?? "pending") as "pending" | "confirmed" | "preparing" | "ready" | "cancelled",
    "Order Status": (rawOrder["Order Status"] ?? rawOrder.order_status ?? "pending") as "pending" | "confirmed" | "preparing" | "ready" | "cancelled",
    promo_code: rawOrder.promo_code ?? rawOrder["Promo Code"],
    "Promo Code": rawOrder["Promo Code"] ?? rawOrder.promo_code,
    promo_discount: rawOrder.promo_discount ?? rawOrder["Promo Discount"],
    "Promo Discount": rawOrder["Promo Discount"] ?? rawOrder.promo_discount,
    loyalty_points_used: rawOrder.loyalty_points_used ?? rawOrder["Loyalty Points Used"] ?? 0,
    "Loyalty Points Used": rawOrder["Loyalty Points Used"] ?? rawOrder.loyalty_points_used ?? 0,
    loyalty_points_earned: rawOrder.loyalty_points_earned ?? rawOrder["Loyalty Points Earned"] ?? 0,
    "Loyalty Points Earned": rawOrder["Loyalty Points Earned"] ?? rawOrder.loyalty_points_earned ?? 0,
    subtotal: rawOrder.subtotal ?? rawOrder.Subtotal ?? 0,
    Subtotal: rawOrder.Subtotal ?? rawOrder.subtotal ?? 0,
    total: rawOrder.total ?? rawOrder.Total ?? 0,
    Total: rawOrder.Total ?? rawOrder.total ?? 0,
    delivery_fee: rawOrder.delivery_fee ?? rawOrder["Delivery Fee"] ?? 0,
    "Delivery Fee": rawOrder["Delivery Fee"] ?? rawOrder.delivery_fee ?? 0,
    delivery_district: rawOrder.delivery_district ?? rawOrder["Delivery District"],
    "Delivery District": rawOrder["Delivery District"] ?? rawOrder.delivery_district,
    delivery_address: rawOrder.delivery_address ?? rawOrder["Delivery Address"],
    "Delivery Address": rawOrder["Delivery Address"] ?? rawOrder.delivery_address,
    guest_phone: rawOrder.guest_phone ?? rawOrder["Guest Phone"],
    "Guest Phone": rawOrder["Guest Phone"] ?? rawOrder.guest_phone,
    guest_address: rawOrder.guest_address ?? rawOrder["Guest Address"],
    "Guest Address": rawOrder["Guest Address"] ?? rawOrder.guest_address,
    created_at: rawOrder.created_at ?? rawOrder["Created At"] ?? "",
    "Created At": rawOrder["Created At"] ?? rawOrder.created_at ?? "",
    updated_at: rawOrder.updated_at ?? rawOrder["Updated At"] ?? "",
    "Updated At": rawOrder["Updated At"] ?? rawOrder.updated_at ?? "",
  } as NocoDBOrder
}

export async function fetchOrderByNumber(orderNumber: string): Promise<NocoDBOrder | null> {
  // NocoDB API v2 использует заголовки колонок в where-условиях
  // В таблице Orders колонка order_number имеет заголовок "Order Number"
  const response = await nocoFetch<NocoDBResponse<any>>("Orders", {
    where: `(Order Number,eq,${orderNumber})`,
  })
  const rawOrder = response.list?.[0]
  if (!rawOrder) return null
  
  // Преобразуем данные из формата API (с заголовками колонок) в формат NocoDBOrder
  // Поддерживаем оба варианта: column_name (snake_case) и title (с заглавными буквами)
  return {
    ...rawOrder,
    Id: rawOrder.Id || rawOrder.id || 0,
    user_id: rawOrder.user_id ?? rawOrder["User ID"],
    "User ID": rawOrder["User ID"] ?? rawOrder.user_id,
    order_number: rawOrder.order_number ?? rawOrder["Order Number"] ?? "",
    "Order Number": rawOrder["Order Number"] ?? rawOrder.order_number ?? "",
    start_date: rawOrder.start_date ?? rawOrder["Start Date"] ?? "",
    "Start Date": rawOrder["Start Date"] ?? rawOrder.start_date ?? "",
    delivery_time: rawOrder.delivery_time ?? rawOrder["Delivery Time"] ?? "",
    "Delivery Time": rawOrder["Delivery Time"] ?? rawOrder.delivery_time ?? "",
    payment_status: (rawOrder.payment_status ?? rawOrder["Payment Status"] ?? "pending") as "pending" | "paid" | "refunded" | "failed",
    "Payment Status": (rawOrder["Payment Status"] ?? rawOrder.payment_status ?? "pending") as "pending" | "paid" | "refunded" | "failed",
    payment_method: (rawOrder.payment_method ?? rawOrder["Payment Method"] ?? "cash") as "cash" | "card" | "sbp" | "online",
    "Payment Method": (rawOrder["Payment Method"] ?? rawOrder.payment_method ?? "cash") as "cash" | "card" | "sbp" | "online",
    // ✅ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Правильно нормализуем paid как boolean для всех форматов
    paid: (() => {
      const paidValue = rawOrder.paid !== undefined ? rawOrder.paid : rawOrder["Paid"]
      return paidValue === true || String(paidValue).toLowerCase() === 'true' || String(paidValue) === '1'
    })(),
    Paid: rawOrder["Paid"] !== undefined ? rawOrder["Paid"] : rawOrder.paid,
    paid_at: rawOrder.paid_at ?? rawOrder["Paid At"],
    "Paid At": rawOrder["Paid At"] ?? rawOrder.paid_at,
    payment_id: rawOrder.payment_id ?? rawOrder["Payment ID"],
    "Payment ID": rawOrder["Payment ID"] ?? rawOrder.payment_id,
    order_status: (rawOrder.order_status ?? rawOrder["Order Status"] ?? "pending") as "pending" | "confirmed" | "preparing" | "ready" | "cancelled",
    "Order Status": (rawOrder["Order Status"] ?? rawOrder.order_status ?? "pending") as "pending" | "confirmed" | "preparing" | "ready" | "cancelled",
    promo_code: rawOrder.promo_code ?? rawOrder["Promo Code"],
    "Promo Code": rawOrder["Promo Code"] ?? rawOrder.promo_code,
    promo_discount: rawOrder.promo_discount ?? rawOrder["Promo Discount"],
    "Promo Discount": rawOrder["Promo Discount"] ?? rawOrder.promo_discount,
    loyalty_points_used: rawOrder.loyalty_points_used ?? rawOrder["Loyalty Points Used"] ?? 0,
    "Loyalty Points Used": rawOrder["Loyalty Points Used"] ?? rawOrder.loyalty_points_used ?? 0,
    loyalty_points_earned: rawOrder.loyalty_points_earned ?? rawOrder["Loyalty Points Earned"] ?? 0,
    "Loyalty Points Earned": rawOrder["Loyalty Points Earned"] ?? rawOrder.loyalty_points_earned ?? 0,
    subtotal: rawOrder.subtotal ?? rawOrder.Subtotal ?? 0,
    Subtotal: rawOrder.Subtotal ?? rawOrder.subtotal ?? 0,
    total: rawOrder.total ?? rawOrder.Total ?? 0,
    Total: rawOrder.Total ?? rawOrder.total ?? 0,
    guest_phone: rawOrder.guest_phone ?? rawOrder["Guest Phone"],
    "Guest Phone": rawOrder["Guest Phone"] ?? rawOrder.guest_phone,
    guest_address: rawOrder.guest_address ?? rawOrder["Guest Address"],
    "Guest Address": rawOrder["Guest Address"] ?? rawOrder.guest_address,
    created_at: rawOrder.created_at ?? rawOrder["Created At"] ?? "",
    "Created At": rawOrder["Created At"] ?? rawOrder.created_at ?? "",
    updated_at: rawOrder.updated_at ?? rawOrder["Updated At"] ?? "",
    "Updated At": rawOrder["Updated At"] ?? rawOrder.updated_at ?? "",
  } as NocoDBOrder
}

export async function createOrder(order: Omit<NocoDBOrder, "Id" | "created_at" | "updated_at">): Promise<NocoDBOrder> {
  // На сервере используем прямой запрос к NocoDB, на клиенте - через proxy
  const apiBaseUrl = getApiBaseUrl()
  
  console.log(`📝 createOrder - входные данные:`, {
    order,
    keys: Object.keys(order),
    user_id: order.user_id,
    'User ID': order["User ID"],
  })
  
  // Маппинг полей: используем Title Case для NocoDB API
  // Включаем только ненулевые значения
  const mappedOrder: any = {}
  
  const userId = order.user_id ?? order["User ID"]
  if (userId !== undefined && userId !== null) mappedOrder["User ID"] = userId
  
  const orderNumber = order.order_number ?? order["Order Number"]
  if (orderNumber !== undefined && orderNumber !== null) mappedOrder["Order Number"] = orderNumber
  
  const startDate = order.start_date ?? order["Start Date"]
  if (startDate !== undefined && startDate !== null) mappedOrder["Start Date"] = startDate
  
  const deliveryTime = order.delivery_time ?? order["Delivery Time"]
  if (deliveryTime !== undefined && deliveryTime !== null) mappedOrder["Delivery Time"] = deliveryTime
  
  const paymentStatus = order.payment_status ?? order["Payment Status"]
  if (paymentStatus !== undefined && paymentStatus !== null) mappedOrder["Payment Status"] = paymentStatus
  
  const paymentMethod = order.payment_method ?? order["Payment Method"]
  if (paymentMethod !== undefined && paymentMethod !== null) mappedOrder["Payment Method"] = paymentMethod
  
  // ✅ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Правильно сохраняем paid как boolean
  const paidValue = order.paid ?? order.Paid
  mappedOrder["Paid"] = paidValue === true || String(paidValue).toLowerCase() === 'true' || order.payment_status === 'paid' || String(order.payment_status).toLowerCase() === 'paid'
  
  const paidAt = order.paid_at ?? order["Paid At"]
  if (paidAt !== undefined && paidAt !== null) mappedOrder["Paid At"] = paidAt
  
  const paymentId = order.payment_id ?? order["Payment ID"]
  if (paymentId !== undefined && paymentId !== null) mappedOrder["Payment ID"] = paymentId
  
  mappedOrder["Order Status"] = order.order_status ?? order["Order Status"] ?? "pending"
  
  const promoCode = order.promo_code ?? order["Promo Code"]
  if (promoCode !== undefined && promoCode !== null) mappedOrder["Promo Code"] = promoCode
  
  const promoDiscount = order.promo_discount ?? order["Promo Discount"]
  if (promoDiscount !== undefined && promoDiscount !== null) mappedOrder["Promo Discount"] = promoDiscount
  
  mappedOrder["Loyalty Points Used"] = order.loyalty_points_used ?? order["Loyalty Points Used"] ?? 0
  mappedOrder["Loyalty Points Earned"] = order.loyalty_points_earned ?? order["Loyalty Points Earned"] ?? 0
  mappedOrder["Subtotal"] = order.subtotal ?? order.Subtotal ?? 0
  mappedOrder["Total"] = order.total ?? order.Total ?? 0
  
  const guestPhone = order.guest_phone ?? order["Guest Phone"]
  if (guestPhone !== undefined && guestPhone !== null) mappedOrder["Guest Phone"] = guestPhone
  
  const guestAddress = order.guest_address ?? order["Guest Address"]
  if (guestAddress !== undefined && guestAddress !== null) mappedOrder["Guest Address"] = guestAddress
  
  // Добавляем created_at и updated_at если они есть
  const createdAt = (order as any).created_at ?? (order as any)["Created At"]
  if (createdAt !== undefined && createdAt !== null) mappedOrder["Created At"] = createdAt
  
  const updatedAt = (order as any).updated_at ?? (order as any)["Updated At"]
  if (updatedAt !== undefined && updatedAt !== null) mappedOrder["Updated At"] = updatedAt
  
  console.log(`📝 createOrder - маппированные данные:`, {
    mappedOrder,
    keys: Object.keys(mappedOrder),
    hasUserId: 'User ID' in mappedOrder,
    hasOrderNumber: 'Order Number' in mappedOrder,
    hasStartDate: 'Start Date' in mappedOrder,
  })
  
  let createdOrder: NocoDBOrder
  
  if (apiBaseUrl === null) {
    // Серверная среда - прямой запрос к NocoDB
    createdOrder = await serverCreateRecord<NocoDBOrder>("Orders", mappedOrder, "POST")
  } else {
    // Клиентская среда - через API proxy
    const response = await clientFetch<any>(
      "Orders",
      {},
      {
        method: "POST",
        body: JSON.stringify(mappedOrder),
      },
    )
    
    if (Array.isArray(response)) {
      createdOrder = response[0] as NocoDBOrder
    } else if (response && typeof response === 'object' && 'Id' in response) {
      createdOrder = response as NocoDBOrder
    } else if (response && typeof response === 'object' && 'record' in response) {
      createdOrder = response.record as NocoDBOrder
    } else {
      createdOrder = response as NocoDBOrder
    }
  }
  
  // NocoDB часто возвращает только Id при создании, поэтому всегда получаем полный объект
  if (createdOrder?.Id) {
    // Проверяем, есть ли уже все нужные поля (поддерживаем оба варианта названий)
    const orderNumber = createdOrder.order_number ?? createdOrder["Order Number"]
    if (!orderNumber || Object.keys(createdOrder).length < 5) {
      console.log(`⚠️ Order created but incomplete response, fetching full order ${createdOrder.Id}...`)
      try {
        // Небольшая задержка, чтобы запись точно сохранилась
        await new Promise(resolve => setTimeout(resolve, 300))
        const fullOrder = await fetchOrderById(createdOrder.Id)
        const fullOrderNumber = fullOrder?.order_number ?? fullOrder?.["Order Number"]
        if (fullOrder && fullOrderNumber) {
          console.log(`✅ Fetched full order with order_number: ${fullOrderNumber}`)
          return fullOrder
        } else {
          console.warn(`⚠️ Fetched order also incomplete, but using it anyway`)
          if (fullOrder) return fullOrder
        }
      } catch (error) {
        console.warn(`⚠️ Failed to fetch full order:`, error)
        // Если не удалось получить, но есть сгенерированный номер, добавляем его
        if ('order_number' in order) {
          return { ...createdOrder, order_number: order.order_number } as NocoDBOrder
        }
      }
    } else {
      console.log(`✅ Order created with complete data, order_number: ${createdOrder.order_number}`)
    }
  }
  
  return createdOrder
}

export async function updateOrder(id: number, data: Partial<NocoDBOrder>): Promise<NocoDBOrder> {
  const apiBaseUrl = getApiBaseUrl()
  
  console.log(`📝 updateOrder(${id}):`, {
    data,
    hasLoyaltyPointsEarned: 'loyalty_points_earned' in data,
    loyaltyPointsEarnedValue: data.loyalty_points_earned,
  })
  
  // Маппинг полей: используем Title Case для NocoDB API
  const mappedData: any = {}
  if (data.user_id !== undefined || data["User ID"] !== undefined) {
    mappedData["User ID"] = data.user_id ?? data["User ID"]
  }
  if (data.order_number !== undefined || data["Order Number"] !== undefined) {
    mappedData["Order Number"] = data.order_number ?? data["Order Number"]
  }
  if (data.start_date !== undefined || data["Start Date"] !== undefined) {
    mappedData["Start Date"] = data.start_date ?? data["Start Date"]
  }
  if (data.delivery_time !== undefined || data["Delivery Time"] !== undefined) {
    mappedData["Delivery Time"] = data.delivery_time ?? data["Delivery Time"]
  }
  if (data.payment_status !== undefined || data["Payment Status"] !== undefined) {
    mappedData["Payment Status"] = data.payment_status ?? data["Payment Status"]
  }
  if (data.payment_method !== undefined || data["Payment Method"] !== undefined) {
    mappedData["Payment Method"] = data.payment_method ?? data["Payment Method"]
  }
  if (data.paid !== undefined || data.Paid !== undefined) {
    mappedData["Paid"] = data.paid ?? data.Paid
  }
  if (data.paid_at !== undefined || data["Paid At"] !== undefined) {
    mappedData["Paid At"] = data.paid_at ?? data["Paid At"]
  }
  if (data.payment_id !== undefined || data["Payment ID"] !== undefined) {
    mappedData["Payment ID"] = data.payment_id ?? data["Payment ID"]
  }
  if (data.order_status !== undefined || data["Order Status"] !== undefined) {
    mappedData["Order Status"] = data.order_status ?? data["Order Status"]
  }
  if (data.promo_code !== undefined || data["Promo Code"] !== undefined) {
    mappedData["Promo Code"] = data.promo_code ?? data["Promo Code"]
  }
  if (data.promo_discount !== undefined || data["Promo Discount"] !== undefined) {
    mappedData["Promo Discount"] = data.promo_discount ?? data["Promo Discount"]
  }
  if (data.loyalty_points_used !== undefined || data["Loyalty Points Used"] !== undefined) {
    mappedData["Loyalty Points Used"] = data.loyalty_points_used ?? data["Loyalty Points Used"]
  }
  if (data.loyalty_points_earned !== undefined || data["Loyalty Points Earned"] !== undefined) {
    mappedData["Loyalty Points Earned"] = data.loyalty_points_earned ?? data["Loyalty Points Earned"]
  }
  if (data.subtotal !== undefined || data.Subtotal !== undefined) {
    mappedData["Subtotal"] = data.subtotal ?? data.Subtotal
  }
  if (data.total !== undefined || data.Total !== undefined) {
    mappedData["Total"] = data.total ?? data.Total
  }
  // 🆕 ПОЛЯ ДОСТАВКИ
  if (data.delivery_fee !== undefined || data["Delivery Fee"] !== undefined) {
    mappedData["Delivery Fee"] = data.delivery_fee ?? data["Delivery Fee"]
  }
  if (data.delivery_district !== undefined || data["Delivery District"] !== undefined) {
    mappedData["Delivery District"] = data.delivery_district ?? data["Delivery District"]
  }
  if (data.delivery_address !== undefined || data["Delivery Address"] !== undefined) {
    mappedData["Delivery Address"] = data.delivery_address ?? data["Delivery Address"]
  }
  if (data.guest_phone !== undefined || data["Guest Phone"] !== undefined) {
    mappedData["Guest Phone"] = data.guest_phone ?? data["Guest Phone"]
  }
  if (data.guest_address !== undefined || data["Guest Address"] !== undefined) {
    mappedData["Guest Address"] = data.guest_address ?? data["Guest Address"]
  }
  if (data.updated_at !== undefined || data["Updated At"] !== undefined) {
    mappedData["Updated At"] = data.updated_at ?? data["Updated At"]
  }
  
  console.log(`📝 updateOrder(${id}) - маппированные данные:`, {
    mappedData,
    hasLoyaltyPointsEarned: 'Loyalty Points Earned' in mappedData,
    loyaltyPointsEarnedValue: mappedData["Loyalty Points Earned"],
  })
  
  if (apiBaseUrl === null) {
    // Серверная среда - прямой запрос к NocoDB
    const result = await serverCreateRecord<NocoDBOrder>("Orders", mappedData, "PATCH", id)
    console.log(`✅ updateOrder(${id}) result:`, {
      Id: result.Id,
      loyalty_points_earned: result.loyalty_points_earned,
      'Loyalty Points Earned': (result as any)['Loyalty Points Earned'],
    })
    return result
  } else {
    // Клиентская среда - через API proxy
    const response = await clientFetch<any>(
      `Orders/${id}`,
      {},
      {
        method: "PATCH",
        body: JSON.stringify(mappedData),
      },
    )
    
    if (Array.isArray(response)) {
      return response[0] as NocoDBOrder
    }
    
    if (response && typeof response === 'object' && 'Id' in response) {
      return response as NocoDBOrder
    }
    
    if (response && typeof response === 'object' && 'record' in response) {
      return response.record as NocoDBOrder
    }
    
    return response as NocoDBOrder
  }
}

// === ORDER PERSONS ===

export interface NocoDBOrderPerson {
  Id: number
  // NocoDB API возвращает данные с ключами как title (с заглавными буквами и пробелами)
  // Поддерживаем оба варианта: column_name (snake_case) и title
  order_id?: number
  "Order ID"?: number
  person_number?: number
  "Person Number"?: number
}

export async function createOrderPerson(orderPerson: Omit<NocoDBOrderPerson, "Id">): Promise<NocoDBOrderPerson> {
  const apiBaseUrl = getApiBaseUrl()
  
  if (apiBaseUrl === null) {
    return serverCreateRecord<NocoDBOrderPerson>("Order_Persons", orderPerson, "POST")
  } else {
    const response = await clientFetch<any>(
      "Order_Persons",
      {},
      {
        method: "POST",
        body: JSON.stringify(orderPerson),
      },
    )
    
    if (Array.isArray(response)) {
      return response[0] as NocoDBOrderPerson
    }
    
    if (response && typeof response === 'object' && 'Id' in response) {
      return response as NocoDBOrderPerson
    }
    
    if (response && typeof response === 'object' && 'record' in response) {
      return response.record as NocoDBOrderPerson
    }
    
    return response as NocoDBOrderPerson
  }
}

// === ORDER MEALS ===

export interface NocoDBOrderMeal {
  Id: number
  // NocoDB API возвращает данные с ключами как title (с заглавными буквами и пробелами)
  // Поддерживаем оба варианта: column_name (snake_case) и title
  order_person_id?: number
  "Order Person ID"?: number
  day?: "day1" | "day2"
  Day?: "day1" | "day2"
  meal_time?: "breakfast" | "lunch" | "dinner"
  "Meal Time"?: "breakfast" | "lunch" | "dinner"
  meal_type?: "dish" | "salad" | "soup" | "main"
  "Meal Type"?: "dish" | "salad" | "soup" | "main"
  meal_id?: number
  "Meal ID"?: number
  portion_size?: "single" | "medium" | "large"
  "Portion Size"?: "single" | "medium" | "large"
  price?: number | string
  Price?: number | string
  garnish_id?: number
  "Garnish ID"?: number
  garnish_portion_size?: "single" | "medium" | "large"
  "Garnish Portion Size"?: "single" | "medium" | "large"
  garnish_price?: number | string
  "Garnish Price"?: number | string
}

export async function createOrderMeal(orderMeal: Omit<NocoDBOrderMeal, "Id">): Promise<NocoDBOrderMeal> {
  const apiBaseUrl = getApiBaseUrl()
  
  if (apiBaseUrl === null) {
    return serverCreateRecord<NocoDBOrderMeal>("Order_Meals", orderMeal, "POST")
  } else {
    const response = await clientFetch<any>(
      "Order_Meals",
      {},
      {
        method: "POST",
        body: JSON.stringify(orderMeal),
      },
    )
    
    if (Array.isArray(response)) {
      return response[0] as NocoDBOrderMeal
    }
    
    if (response && typeof response === 'object' && 'Id' in response) {
      return response as NocoDBOrderMeal
    }
    
    if (response && typeof response === 'object' && 'record' in response) {
      return response.record as NocoDBOrderMeal
    }
    
    return response as NocoDBOrderMeal
  }
}

// === ORDER EXTRAS ===

export interface NocoDBOrderExtra {
  Id: number
  // NocoDB API возвращает данные с ключами как title (с заглавными буквами и пробелами)
  // Поддерживаем оба варианта: column_name (snake_case) и title
  order_id?: number
  "Order ID"?: number
  extra_id?: number
  "Extra ID"?: number
  quantity?: number | string
  Quantity?: number | string
  price?: number | string
  Price?: number | string
}

export async function createOrderExtra(orderExtra: Omit<NocoDBOrderExtra, "Id">): Promise<NocoDBOrderExtra> {
  const apiBaseUrl = getApiBaseUrl()
  
  if (apiBaseUrl === null) {
    return serverCreateRecord<NocoDBOrderExtra>("Order_Extras", orderExtra, "POST")
  } else {
    const response = await clientFetch<any>(
      "Order_Extras",
      {},
      {
        method: "POST",
        body: JSON.stringify(orderExtra),
      },
    )
    
    if (Array.isArray(response)) {
      return response[0] as NocoDBOrderExtra
    }
    
    if (response && typeof response === 'object' && 'Id' in response) {
      return response as NocoDBOrderExtra
    }
    
    if (response && typeof response === 'object' && 'record' in response) {
      return response.record as NocoDBOrderExtra
    }
    
    return response as NocoDBOrderExtra
  }
}

// Функции для получения данных заказа
export async function fetchOrderPersons(orderId: number): Promise<NocoDBOrderPerson[]> {
  // NocoDB API v2 использует заголовки колонок в where-условиях
  // В таблице Order_Persons колонка order_id имеет заголовок "Order ID"
  const response = await nocoFetch<NocoDBResponse<NocoDBOrderPerson>>("Order_Persons", {
    where: `(Order ID,eq,${orderId})`,
  })
  return response.list || []
}

export async function fetchOrderMeals(orderPersonId: number): Promise<NocoDBOrderMeal[]> {
  // NocoDB API v2 использует заголовки колонок в where-условиях
  // В таблице Order_Meals колонка order_person_id имеет заголовок "Order Person ID"
  const response = await nocoFetch<NocoDBResponse<NocoDBOrderMeal>>("Order_Meals", {
    where: `(Order Person ID,eq,${orderPersonId})`,
  })
  return response.list || []
}

export async function fetchOrderExtras(orderId: number): Promise<NocoDBOrderExtra[]> {
  // NocoDB API v2 использует заголовки колонок в where-условиях
  // В таблице Order_Extras колонка order_id имеет заголовок "Order ID"
  const response = await nocoFetch<NocoDBResponse<NocoDBOrderExtra>>("Order_Extras", {
    where: `(Order ID,eq,${orderId})`,
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
  // NocoDB API возвращает данные с ключами как title (с заглавными буквами и пробелами)
  // Поддерживаем оба варианта: column_name (snake_case) и title
  code?: string
  Code?: string
  discount_type?: "percentage" | "fixed"
  "Discount Type"?: "percentage" | "fixed"
  discount_value?: number | string
  "Discount Value"?: number | string
  min_order_amount?: number | string
  "Min Order Amount"?: number | string
  max_discount?: number | string
  "Max Discount"?: number | string
  valid_from?: string
  "Valid From"?: string
  valid_until?: string
  "Valid Until"?: string
  usage_limit?: number | string
  "Usage Limit"?: number | string
  times_used?: number | string
  "Times Used"?: number | string
  active?: boolean | string
  Active?: boolean | string
}

export async function fetchPromoCode(code: string): Promise<NocoDBPromoCode | null> {
  // NocoDB API v2 использует заголовки колонок в where-условиях
  // В таблице Promo_Codes колонки code и active имеют заголовки "Code" и "Active"
  // ✅ Используем nocoFetchNoCache чтобы всегда получать свежие данные (без кэша)
  // ✅ ИСПРАВЛЕНО: Ищем промокод без условия Active, так как промокод может быть неактивен, но нам нужно его найти для инкремента
  // Экранируем код для безопасности (убираем специальные символы)
  const escapedCode = String(code).replace(/[()~&|]/g, '')
  const whereClause = `(Code,eq,${escapedCode})`
  const response = await nocoFetchNoCache<NocoDBResponse<NocoDBPromoCode>>("Promo_Codes", {
    where: whereClause,
  })
  const promo = response.list?.[0] || null
  // Проверяем активность только если промокод найден
  if (promo && (promo.Active === false || promo.active === false)) {
    console.warn(`⚠️ Промокод ${code} найден, но неактивен`)
  }
  return promo
}

export async function incrementPromoCodeUsage(id: number): Promise<void> {
  // Получаем текущее значение times_used
  const promo = await fetchPromoCodeById(id)
  if (!promo) {
    throw new Error(`Promo code with ID ${id} not found`)
  }
  
  const currentTimesUsed = typeof promo.times_used === 'number' 
    ? promo.times_used 
    : typeof promo['Times Used'] === 'number'
    ? promo['Times Used']
    : parseInt(String(promo.times_used || promo['Times Used'] || 0))
  
  // Увеличиваем на 1
  const newTimesUsed = currentTimesUsed + 1
  
  // Обновляем через bulk update (массив)
  const updateBody = JSON.stringify([{ Id: id, "Times Used": newTimesUsed }])
  try {
    // На сервере используем serverCreateRecord, на клиенте - clientFetch
    const apiBaseUrl = getApiBaseUrl()
    if (apiBaseUrl === null) {
      // Серверная среда - прямой запрос к NocoDB
      await serverCreateRecord<NocoDBPromoCode>(
        "Promo_Codes",
        { "Times Used": newTimesUsed },
        "PATCH",
        id
      )
    } else {
      // Клиентская среда - через API proxy
      await clientFetch(
        "Promo_Codes",
        {},
        {
          method: "PATCH",
          body: updateBody,
        },
      )
    }
  } catch (error) {
    throw error
  }
}

async function fetchPromoCodeById(id: number): Promise<NocoDBPromoCode | null> {
  // Используем nocoFetchNoCache для получения свежих данных
  const whereClause = `(Id,eq,${id})`
  const response = await nocoFetchNoCache<NocoDBResponse<NocoDBPromoCode>>("Promo_Codes", {
    where: whereClause,
  })
  const promo = response.list?.[0] || null
  return promo
}

// === REVIEWS ===

export interface NocoDBReview {
  Id: number
  // NocoDB API возвращает данные с ключами как title (с заглавными буквами и пробелами)
  // Поддерживаем оба варианта: column_name (snake_case) и title
  order_id?: number
  "Order ID"?: number
  user_id?: number
  "User ID"?: number
  rating?: number | string
  Rating?: number | string
  text?: string
  "Review Text"?: string
  created_at?: string
  "Created At"?: string
  updated_at?: string
  "Updated At"?: string
}

export async function fetchReviewsForUser(userId: number): Promise<NocoDBReview[]> {
  // NocoDB API v2 использует заголовки колонок в where-условиях
  // В таблице Reviews колонка user_id имеет заголовок "User ID"
  const response = await nocoFetch<NocoDBResponse<NocoDBReview>>("Reviews", {
    where: `(User ID,eq,${userId})`,
  })
  return response.list || []
}

export async function createReview(
  review: Omit<NocoDBReview, "Id" | "created_at" | "updated_at"> & { created_at?: string; updated_at?: string },
): Promise<NocoDBReview> {
  const apiBaseUrl = getApiBaseUrl()
  
  // Добавляем created_at и updated_at, если они не переданы
  const now = new Date().toISOString()
  const reviewData = {
    ...review,
    created_at: review.created_at || now,
    updated_at: review.updated_at || now,
  }
  
  if (apiBaseUrl === null) {
    return serverCreateRecord<NocoDBReview>("Reviews", reviewData, "POST")
  } else {
    const response = await clientFetch<any>(
      "Reviews",
      {},
      {
        method: "POST",
        body: JSON.stringify(reviewData),
      },
    )
    
    if (Array.isArray(response)) {
      return response[0] as NocoDBReview
    }
    
    if (response && typeof response === 'object' && 'Id' in response) {
      return response as NocoDBReview
    }
    
    if (response && typeof response === 'object' && 'record' in response) {
      return response.record as NocoDBReview
    }
    
    return response as NocoDBReview
  }
}

// === LOYALTY POINTS TRANSACTIONS ===

export interface NocoDBLoyaltyPointsTransaction {
  Id: number
  user_id: number
  order_id?: number
  transaction_type: "earned" | "used" | "refunded" | "cancelled"
  transaction_status: "pending" | "completed" | "cancelled"
  points: number | string
  description?: string
  created_at: string
  updated_at: string
  processed_at?: string
}

export async function createLoyaltyPointsTransaction(
  transaction: Omit<NocoDBLoyaltyPointsTransaction, "Id" | "created_at" | "updated_at"> & { created_at?: string; updated_at?: string },
): Promise<NocoDBLoyaltyPointsTransaction> {
  const apiBaseUrl = getApiBaseUrl()
  
  // Добавляем created_at и updated_at, если они не переданы
  const now = new Date().toISOString()
  
  // Маппинг полей: snake_case -> Title Case для NocoDB
  const transactionData = {
    "User ID": transaction.user_id,
    "Order ID": transaction.order_id,
    "Transaction Type": transaction.transaction_type,
    "Transaction Status": transaction.transaction_status,
    "Points": transaction.points, // ВАЖНО: маппим points -> Points
    "Points Amount": transaction.points, // Добавляем дублирование для совместимости
    "Description": transaction.description,
    "Created At": transaction.created_at || now,
    "Updated At": transaction.updated_at || now,
    "Processed At": transaction.processed_at,
  }
  
  console.log(`📝 createLoyaltyPointsTransaction: отправка данных:`, {
    table: "Loyalty_Points_Transactions",
    data: transactionData,
    apiBaseUrl: apiBaseUrl || "server-side",
  })
  
  try {
    let result: NocoDBLoyaltyPointsTransaction
    
    if (apiBaseUrl === null) {
      console.log(`📤 Создание транзакции через serverCreateRecord`)
      result = await serverCreateRecord<NocoDBLoyaltyPointsTransaction>("Loyalty_Points_Transactions", transactionData, "POST")
    } else {
      console.log(`📤 Создание транзакции через clientFetch`)
      const response = await clientFetch<any>(
        "Loyalty_Points_Transactions",
        {},
        {
          method: "POST",
          body: JSON.stringify(transactionData),
        },
      )
      
      console.log(`📥 Ответ от clientFetch:`, response)
      
      if (Array.isArray(response)) {
        result = response[0] as NocoDBLoyaltyPointsTransaction
      } else if (response && typeof response === 'object' && 'Id' in response) {
        result = response as NocoDBLoyaltyPointsTransaction
      } else if (response && typeof response === 'object' && 'record' in response) {
        result = response.record as NocoDBLoyaltyPointsTransaction
      } else {
        result = response as NocoDBLoyaltyPointsTransaction
      }
    }
    
    console.log(`✅ Транзакция успешно создана:`, result)
    return result
  } catch (error) {
    console.error(`❌ Ошибка при создании транзакции:`, error)
    throw error
  }
}

export async function fetchLoyaltyPointsTransactions(userId: number): Promise<NocoDBLoyaltyPointsTransaction[]> {
  // NocoDB API v2 использует заголовки колонок в where-условиях
  // В таблице Loyalty_Points_Transactions колонка user_id имеет заголовок "User ID"
  // ✅ ИСПРАВЛЕНО: Убрана сортировка, так как она вызывает ошибку FIELD_NOT_FOUND
  // Сортировка не критична - можем отсортировать на клиенте если нужно
  const response = await nocoFetch<NocoDBResponse<NocoDBLoyaltyPointsTransaction>>("Loyalty_Points_Transactions", {
    where: `(User ID,eq,${userId})`,
    limit: "1000",
  })
  const transactions = response.list || []
  // ✅ Сортируем на клиенте по Id (более новые записи имеют больший Id)
  return transactions.sort((a: any, b: any) => (b.Id || 0) - (a.Id || 0))
}

export async function fetchPendingTransactionsByOrder(orderId: number): Promise<NocoDBLoyaltyPointsTransaction[]> {
  // Получаем pending транзакции для конкретного заказа
  // NocoDB требует Title имена в where-запросах
  const response = await nocoFetch<NocoDBResponse<any>>("Loyalty_Points_Transactions", {
    where: `(Order ID,eq,${orderId})~and(Transaction Status,eq,pending)`,
    limit: "1000",
  })
  
  // Нормализуем данные - NocoDB может возвращать title поля
  const transactions = (response.list || []).map((t: any) => ({
    Id: t.Id || t.id,
    user_id: t.user_id || t["User ID"] || t["user_id"],
    order_id: t.order_id || t["Order ID"] || t["order_id"],
    transaction_type: t.transaction_type || t["Transaction Type"] || t["transaction_type"],
    transaction_status: t.transaction_status || t["Transaction Status"] || t["transaction_status"],
    points: t.points || t["Points"] || t["points"] || 0,
    description: t.description || t["Description"] || t["description"],
    created_at: t.created_at || t["Created At"] || t["created_at"],
    updated_at: t.updated_at || t["Updated At"] || t["updated_at"],
    processed_at: t.processed_at || t["Processed At"] || t["processed_at"],
  }))
  
  console.log(`🔍 fetchPendingTransactionsByOrder(${orderId}): найдено ${transactions.length} транзакций`, 
    transactions.map(t => ({ Id: t.Id, points: t.points, type: t.transaction_type, status: t.transaction_status })))
  
  return transactions
}

/**
 * Получает ВСЕ транзакции для конкретного заказа (pending и completed)
 * Используется для возврата баллов при отмене оплаченных заказов
 */
export async function fetchAllTransactionsByOrder(orderId: number): Promise<NocoDBLoyaltyPointsTransaction[]> {
  // ✅ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Получаем ВСЕ транзакции для заказа (не только pending)
  // Это нужно для оплаченных заказов, где транзакции имеют статус 'completed'
  const response = await nocoFetch<NocoDBResponse<any>>("Loyalty_Points_Transactions", {
    where: `(Order ID,eq,${orderId})`,
    limit: "1000",
  })
  
  // Нормализуем данные - NocoDB может возвращать title поля
  const transactions = (response.list || []).map((t: any) => ({
    Id: t.Id || t.id,
    user_id: t.user_id || t["User ID"] || t["user_id"],
    order_id: t.order_id || t["Order ID"] || t["order_id"],
    transaction_type: t.transaction_type || t["Transaction Type"] || t["transaction_type"],
    transaction_status: t.transaction_status || t["Transaction Status"] || t["transaction_status"],
    points: t.points || t["Points"] || t["points"] || 0,
    description: t.description || t["Description"] || t["description"],
    created_at: t.created_at || t["Created At"] || t["created_at"],
    updated_at: t.updated_at || t["Updated At"] || t["updated_at"],
    processed_at: t.processed_at || t["Processed At"] || t["processed_at"],
  }))
  
  console.log(`🔍 fetchAllTransactionsByOrder(${orderId}): найдено ${transactions.length} транзакций`, 
    transactions.map(t => ({ Id: t.Id, points: t.points, type: t.transaction_type, status: t.transaction_status })))
  
  return transactions
}

export async function updateLoyaltyTransaction(
  transactionId: number,
  updates: Partial<NocoDBLoyaltyPointsTransaction>
): Promise<void> {
  const apiBaseUrl = getApiBaseUrl()
  
  // Маппинг полей: snake_case -> Title Case для NocoDB
  const updateData: any = {
    "Updated At": new Date().toISOString(),
  }
  
  if (updates.transaction_status !== undefined) {
    updateData["Transaction Status"] = updates.transaction_status
  }
  if (updates.processed_at !== undefined) {
    updateData["Processed At"] = updates.processed_at
  }
  if (updates.points !== undefined) {
    updateData["Points"] = updates.points
    updateData["Points Amount"] = updates.points
  }
  if (updates.description !== undefined) {
    updateData["Description"] = updates.description
  }
  
  console.log(`📝 Обновление транзакции ${transactionId}:`, updateData)
  
  if (apiBaseUrl === null) {
    await serverCreateRecord("Loyalty_Points_Transactions", updateData, "PATCH", transactionId)
  } else {
    await clientFetch(
      `Loyalty_Points_Transactions/${transactionId}`,
      {},
      {
        method: "PATCH",
        pathSuffix: `/${transactionId}`,
        body: JSON.stringify(updateData),
      }
    )
  }
  
  console.log(`✅ Транзакция ${transactionId} успешно обновлена`)
}

export async function processPendingTransactionsForOrder(
  orderId: number,
  userId: number | undefined
): Promise<number> {
  if (!userId) {
    console.warn(`⚠️ Не указан userId для обработки pending транзакций заказа ${orderId}`)
    return 0
  }
  
  console.log(`💳 Обработка pending транзакций для заказа ${orderId}, пользователь ${userId}`)
  
  // Получаем pending транзакции для этого заказа
  const pendingTransactions = await fetchPendingTransactionsByOrder(orderId)
  
  if (pendingTransactions.length === 0) {
    console.log(`ℹ️ Нет pending транзакций для заказа ${orderId}`)
    return 0
  }
  
  console.log(`📊 Найдено pending транзакций: ${pendingTransactions.length}`)
  
  // Получаем текущего пользователя
  const user = await fetchUserById(userId)
  if (!user) {
    console.error(`❌ Пользователь ${userId} не найден`)
    return 0
  }
  
  let totalPointsToAdd = 0
  const transactionsToUpdate: number[] = []
  
  // Обрабатываем каждую транзакцию
  for (const transaction of pendingTransactions) {
    console.log(`🔍 Проверка транзакции ${transaction.Id}:`, {
      type: transaction.transaction_type,
      points: transaction.points,
      status: transaction.transaction_status,
      description: transaction.description,
    })
    
    if (transaction.transaction_type === 'earned') {
      const points = typeof transaction.points === 'number' 
        ? transaction.points 
        : parseInt(String(transaction.points)) || 0
      
      if (points > 0) {
        totalPointsToAdd += points
        transactionsToUpdate.push(transaction.Id)
        console.log(`✅ Транзакция ${transaction.Id}: добавим ${points} баллов`)
      } else {
        console.warn(`⚠️ Транзакция ${transaction.Id}: points = ${points}, пропускаем`)
      }
    }
  }
  
  if (totalPointsToAdd > 0) {
    // Начисляем баллы пользователю
    const currentPoints = typeof user.loyalty_points === 'number' 
      ? user.loyalty_points 
      : parseInt(String(user.loyalty_points)) || 0
    
    const newPoints = currentPoints + totalPointsToAdd
    
    console.log(`💰 Начисление баллов:`, {
      currentPoints,
      toAdd: totalPointsToAdd,
      newPoints,
    })
    
    await updateUser(userId, {
      loyalty_points: newPoints,
    })
    
    // Обновляем статусы транзакций
    const now = new Date().toISOString()
    for (const transactionId of transactionsToUpdate) {
      await updateLoyaltyTransaction(transactionId, {
        transaction_status: 'completed',
        processed_at: now,
      })
    }
    
    console.log(`✅ Обработано ${transactionsToUpdate.length} транзакций, начислено ${totalPointsToAdd} баллов`)
  } else {
    console.log(`ℹ️ Нет баллов для начисления`)
  }
  
  return totalPointsToAdd
}

// === FRAUD ALERTS ===

export interface NocoDBFraudAlert {
  Id: number
  user_id: number
  alert_type: string
  paid_orders_count: number
  cancelled_paid_orders_count: number
  cancellation_rate: number
  last_incident_date: string
  status: "active" | "reviewed" | "resolved"
  admin_notes?: string
  created_at: string
  updated_at: string
}

export async function createFraudAlert(
  userId: number,
  stats: {
    totalPaidOrders: number
    cancelledPaidOrders: number
    cancellationRate: number
  }
): Promise<NocoDBFraudAlert> {
  const now = new Date().toISOString()
  const apiBaseUrl = getApiBaseUrl()
  
  const alertData = {
    user_id: userId,
    alert_type: "excessive_cancellations",
    paid_orders_count: stats.totalPaidOrders,
    cancelled_paid_orders_count: stats.cancelledPaidOrders,
    cancellation_rate: stats.cancellationRate,
    last_incident_date: now,
    status: "active" as const,
    created_at: now,
    updated_at: now,
  }
  
  console.log(`🚨 Создание fraud alert для пользователя ${userId}:`, alertData)
  
  if (apiBaseUrl === null) {
    return await serverCreateRecord<NocoDBFraudAlert>("Fraud_Alerts", alertData, "POST")
  } else {
    const response = await clientFetch<any>(
      "Fraud_Alerts",
      {},
      {
        method: "POST",
        body: JSON.stringify(alertData),
      },
    )
    
    if (Array.isArray(response)) {
      return response[0] as NocoDBFraudAlert
    } else if (response && typeof response === 'object' && 'Id' in response) {
      return response as NocoDBFraudAlert
    } else if (response && typeof response === 'object' && 'record' in response) {
      return response.record as NocoDBFraudAlert
    } else {
      return response as NocoDBFraudAlert
    }
  }
}

export async function getUserCancellationStats(userId: number): Promise<{
  totalPaidOrders: number
  cancelledPaidOrders: number
  cancellationRate: number
}> {
  // Получаем все оплаченные заказы пользователя
  const allOrders = await fetchOrdersByUser(userId)
  
  // Фильтруем только оплаченные заказы (paid=true или payment_status='paid')
  const paidOrders = allOrders.filter(order => {
    const isPaid = order.paid === true || order.payment_status === "paid"
    return isPaid
  })
  
  // Считаем отмененные оплаченные заказы
  const cancelledPaidOrders = paidOrders.filter(order => {
    return order.order_status === "cancelled"
  })
  
  const totalPaidOrders = paidOrders.length
  const cancelledPaidOrdersCount = cancelledPaidOrders.length
  const cancellationRate = totalPaidOrders > 0 ? (cancelledPaidOrdersCount / totalPaidOrders) * 100 : 0
  
  console.log(`📊 Статистика отмен для пользователя ${userId}:`, {
    totalPaidOrders,
    cancelledPaidOrders: cancelledPaidOrdersCount,
    cancellationRate: cancellationRate.toFixed(2) + '%',
  })
  
  return {
    totalPaidOrders,
    cancelledPaidOrders: cancelledPaidOrdersCount,
    cancellationRate,
  }
}

/**
 * Вычисляет цену блюда для указанного размера порции
 * @param meal Объект блюда с ценами
 * @param portionSize Размер порции
 * @returns Цена для указанного размера
 */
export function getMealPriceForPortion(meal: {
  prices?: { single: number; medium?: number; large?: number }
  portion?: "single" | "medium" | "large"
}, portionSize?: "single" | "medium" | "large"): number {
  if (!meal.prices) {
    console.warn(`⚠️ Meal prices missing, returning 0`)
    return 0
  }
  const portion = portionSize || meal.portion || "single"
  if (portion === "medium" && meal.prices.medium) return meal.prices.medium
  if (portion === "large" && meal.prices.large) return meal.prices.large
  return meal.prices.single
}

/**
 * Получает блюдо по ID из базы данных
 * @param mealId ID блюда
 * @returns Объект блюда или null если не найдено
 */
export async function fetchMealById(mealId: number): Promise<any | null> {
  try {
    const response = await serverFetch<NocoDBResponse<any>>("Meals", {
      where: `(Id,eq,${mealId})`,
    })
    
    if (response.list && response.list.length > 0) {
      const meal = response.list[0]
      
      // Нормализуем цены - NocoDB хранит как "Price (Single)", "Price (Medium)", "Price (Large)"
      const prices = {
        single: meal["Price (Single)"] || meal.prices?.single || 0,
        medium: meal["Price (Medium)"] || meal.prices?.medium || undefined,
        large: meal["Price (Large)"] || meal.prices?.large || undefined,
      }
      
      // Нормализуем граммовки - NocoDB хранит как "Weight (Single)", "Weight (Medium)", "Weight (Large)"
      const weights = {
        single: meal["Weight (Single)"] || meal.weights?.single || 0,
        medium: meal["Weight (Medium)"] || meal.weights?.medium || undefined,
        large: meal["Weight (Large)"] || meal.weights?.large || undefined,
      }
      
      return {
        ...meal,
        prices,
        weights,
      }
    }
    
    return null
  } catch (error) {
    console.error(`❌ Ошибка при получении блюда ${mealId} из БД:`, error)
    return null
  }
}
