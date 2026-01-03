import { NextResponse } from "next/server"
import { fetchMeals, fetchExtras, fetchDeliveryZones, isNocoDBConfigured } from "@/lib/nocodb"
import { DELIVERY_TIMES } from "@/lib/meals-data"

export const revalidate = 3600

function parsePrice(value: string | number | undefined | null): number {
  if (value === undefined || value === null) return 0
  if (value === "#N/A" || value === "") return 0
  if (typeof value === "number") return Math.round(value)
  // Replace comma with dot and parse, then round to integer
  const parsed = Number.parseFloat(String(value).replace(",", "."))
  return isNaN(parsed) ? 0 : Math.round(parsed)
}

function parseBoolean(value: string | boolean | number | undefined | null): boolean {
  if (value === undefined || value === null) return false
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1
  const str = String(value).toUpperCase()
  return str === "TRUE" || str === "1" || str === "YES"
}

function parseNumber(value: string | number | undefined | null): number {
  if (value === undefined || value === null) return 0
  if (value === "#N/A" || value === "") return 0
  if (typeof value === "number") return Math.round(value * 10) / 10
  const parsed = Number.parseFloat(String(value).replace(",", "."))
  return isNaN(parsed) ? 0 : Math.round(parsed * 10) / 10
}

function parseIntervals(value: string | undefined | null): string[] {
  if (!value) return []
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

export async function GET(request: Request) {
  const startTime = Date.now()
  
  // Debug: Check if environment variables are being read
  const nocodbUrl = process.env.NOCODB_URL
  const nocodbToken = process.env.NOCODB_TOKEN
  const mealsTableId = process.env.NOCODB_TABLE_MEALS
  const extrasTableId = process.env.NOCODB_TABLE_EXTRAS
  const zonesTableId = process.env.NOCODB_TABLE_DELIVERY_ZONES

  console.log(`[MENU API] Request started`)
  console.log(`[MENU API] Environment check:`)
  console.log(`  - NOCODB_URL: ${nocodbUrl ? `${nocodbUrl.substring(0, 30)}...` : "❌ NOT SET"}`)
  console.log(`  - NOCODB_TOKEN: ${nocodbToken ? `${nocodbToken.substring(0, 10)}...` : "❌ NOT SET"}`)
  console.log(`  - NOCODB_TABLE_MEALS: ${mealsTableId ? `${mealsTableId.substring(0, 10)}...` : "❌ NOT SET"}`)
  console.log(`  - NOCODB_TABLE_EXTRAS: ${extrasTableId ? `${extrasTableId.substring(0, 10)}...` : "❌ NOT SET"}`)
  console.log(`  - NOCODB_TABLE_DELIVERY_ZONES: ${zonesTableId ? `${zonesTableId.substring(0, 10)}...` : "❌ NOT SET"}`)

  const { searchParams } = new URL(request.url)
  const weekType = searchParams.get("week") as "current" | "next" | null

  console.log(`[MENU API] Request params: weekType=${weekType || "all"}`)

  // Детальная проверка конфигурации
  if (!isNocoDBConfigured()) {
    const missingVars: string[] = []
    if (!nocodbUrl) missingVars.push("NOCODB_URL")
    if (!nocodbToken) missingVars.push("NOCODB_TOKEN")
    if (!mealsTableId) missingVars.push("NOCODB_TABLE_MEALS")
    
    const errorMessage = `NocoDB not configured. Missing variables: ${missingVars.join(", ")}`
    console.error(`[MENU API] ❌ ${errorMessage}`)
    console.error(`[MENU API] 💡 Hint: Add missing environment variables in Vercel Dashboard → Settings → Environment Variables`)
    
    return NextResponse.json({
      meals: {
        breakfast: [],
        lunch_salad: [],
        lunch_soup: [],
        lunch_main: [],
        dinner_salad: [],
        dinner_soup: [],
        dinner_main: [],
        garnish: [],
      },
      extras: { drink: [], sauce: [], dessert: [], snack: [] },
      deliveryZones: [],
      deliveryTimes: DELIVERY_TIMES,
      source: "empty",
      reason: errorMessage,
      error: {
        type: "configuration",
        missingVariables: missingVars,
        hint: "Add missing environment variables in Vercel Dashboard → Settings → Environment Variables and redeploy",
      },
    }, { status: 503 })
  }

  try {
    console.log(`[MENU API] Fetching data from NocoDB...`)
    const fetchStartTime = Date.now()
    
    const [nocoMeals, nocoExtras, nocoZones] = await Promise.all([
      fetchMeals(weekType || undefined).catch((err) => {
        console.error(`[MENU API] ❌ Failed to fetch Meals:`, err)
        throw new Error(`Failed to fetch Meals: ${err instanceof Error ? err.message : String(err)}`)
      }),
      fetchExtras().catch((err) => {
        console.error(`[MENU API] ❌ Failed to fetch Extras:`, err)
        throw new Error(`Failed to fetch Extras: ${err instanceof Error ? err.message : String(err)}`)
      }),
      fetchDeliveryZones().catch((err) => {
        console.error(`[MENU API] ❌ Failed to fetch Delivery Zones:`, err)
        throw new Error(`Failed to fetch Delivery Zones: ${err instanceof Error ? err.message : String(err)}`)
      }),
    ])

    const fetchEndTime = Date.now()
    console.log(`[MENU API] ✅ Data fetched successfully in ${fetchEndTime - fetchStartTime}ms`)
    console.log(`[MENU API] Data counts: meals=${nocoMeals.length}, extras=${nocoExtras.length}, zones=${nocoZones.length}`)

    const groupedMeals: Record<string, any[]> = {
      breakfast: [],
      lunch_salad: [],
      lunch_soup: [],
      lunch_main: [],
      dinner_salad: [],
      dinner_soup: [],
      dinner_main: [],
      garnish: [],
    }

    let skippedNotAvailable = 0
    let skippedWrongWeek = 0

    for (const m of nocoMeals) {
      const isCurrentWeek = parseBoolean(m.is_current_week)
      const isNextWeek = parseBoolean(m.is_next_week)
      const isAvailable = parseBoolean(m.available)

      if (!isAvailable) {
        skippedNotAvailable++
        continue
      }

      // Фильтрация по неделе:
      // - Для "current": блюдо должно быть доступно в текущей неделе (isCurrentWeek = true)
      //   или в обеих неделях (isCurrentWeek = true && isNextWeek = true)
      // - Для "next": блюдо должно быть доступно в следующей неделе (isNextWeek = true)
      //   или в обеих неделях (isCurrentWeek = true && isNextWeek = true)
      if (weekType === "current" && !isCurrentWeek) {
        skippedWrongWeek++
        continue
      }
      if (weekType === "next" && !isNextWeek) {
        skippedWrongWeek++
        continue
      }

      const category = String(m.category || "").toLowerCase()

      // ... existing code for parsing prices ...
      const priceSingle = parsePrice(m.price_single) || parsePrice(m.price)
      const priceMedium = parsePrice(m.price_medium)
      const priceLarge = parsePrice(m.price_large)

      const weightSingle = parsePrice(m.weight_single) || parsePrice(m.weight)
      const weightMedium = parsePrice(m.weight_medium)
      const weightLarge = parsePrice(m.weight_large)

      const meal = {
        id: m.Id || m.id,
        name: m.name || "",
        ingredients: m.ingredients || "",
        description: m.description || "",
        prices: {
          single: priceSingle,
          medium: priceMedium,
          large: priceLarge,
        },
        weights: {
          single: weightSingle,
          medium: weightMedium,
          large: weightLarge,
        },
        portion: "single" as const,
        needsGarnish: parseBoolean(m.needs_garnish),
        image: m.image || "",
        available: true,
        nutrition: {
          calories: parseNumber(m.calories),
          protein: parseNumber(m.protein),
          fats: parseNumber(m.fats),
          carbs: parseNumber(m.carbs),
          weight: weightSingle,
        },
        category: category,
        weekType: isCurrentWeek && isNextWeek ? "both" : isCurrentWeek ? "current" : "next",
      }

      if (category === "breakfast") {
        groupedMeals.breakfast.push(meal)
      } else if (category === "garnish") {
        groupedMeals.garnish.push(meal)
      } else if (category === "soup" || category === "salad" || category === "main") {
        const lunchCategory = `lunch_${category}`
        const dinnerCategory = `dinner_${category}`

        if (groupedMeals[lunchCategory]) {
          groupedMeals[lunchCategory].push({ ...meal, category: lunchCategory })
        }
        if (groupedMeals[dinnerCategory]) {
          groupedMeals[dinnerCategory].push({ ...meal, id: `${meal.id}_dinner`, category: dinnerCategory })
        }
      }
    }

    console.log(`[MENU API] Meals filtering: skipped ${skippedNotAvailable} not available, ${skippedWrongWeek} wrong week`)
    console.log(
      `[MENU API] Grouped meals:`,
      Object.entries(groupedMeals)
        .map(([k, v]) => `${k}:${v.length}`)
        .join(", "),
    )

    // ... existing code for extras ...
    const groupedExtras: Record<string, any[]> = {
      drink: [],
      sauce: [],
      dessert: [],
      snack: [],
    }

    for (const e of nocoExtras) {
      const isAvailable = parseBoolean(e.available)
      if (!isAvailable) continue

      const category = String(e.category || "").toLowerCase()

      const extra = {
        id: e.Id || e.id,
        name: e.name || "",
        price: parsePrice(e.price),
        image: e.image || "",
        available: true,
        ingredients: e.ingredients || "",
        description: e.description || "",
        nutrition: {
          calories: parseNumber(e.calories),
          protein: parseNumber(e.protein),
          fats: parseNumber(e.fats),
          carbs: parseNumber(e.carbs),
          weight: parsePrice(e.weight),
        },
        category: category,
      }

      if (groupedExtras[category]) {
        groupedExtras[category].push(extra)
      }
    }

    console.log(
      `[MENU API] Grouped extras:`,
      Object.entries(groupedExtras)
        .map(([k, v]) => `${k}:${v.length}`)
        .join(", "),
    )

    // ... existing code for deliveryZones ...
    const deliveryZones = nocoZones
      .filter((zone) => parseBoolean(zone.is_available))
      .map((zone) => ({
        id: zone.Id || zone.id,
        city: zone.city || "",
        district: zone.district || "",
        deliveryFee: parsePrice(zone.delivery_fee),
        minOrderAmount: parsePrice(zone.min_order_amount),
        isAvailable: true,
        availableIntervals: parseIntervals(zone.available_intervals),
      }))

    // Извлекаем все уникальные временные интервалы из зон доставки
    const allIntervals = new Set<string>()
    deliveryZones.forEach((zone) => {
      zone.availableIntervals.forEach((interval) => {
        if (interval) {
          allIntervals.add(interval.trim())
        }
      })
    })
    
    // Сортируем интервалы и используем их, если есть, иначе fallback
    const deliveryTimes = allIntervals.size > 0 
      ? Array.from(allIntervals).sort() 
      : DELIVERY_TIMES

    const totalTime = Date.now() - startTime
    console.log(`[MENU API] ✅ Request completed successfully in ${totalTime}ms`)

    return NextResponse.json({
      meals: groupedMeals,
      extras: groupedExtras,
      deliveryZones,
      deliveryTimes,
      source: "nocodb",
      counts: {
        meals: nocoMeals.length,
        filteredMeals: Object.values(groupedMeals).flat().length,
        extras: nocoExtras.length,
        deliveryZones: deliveryZones.length,
      },
      _meta: {
        processingTime: `${totalTime}ms`,
        weekType: weekType || "all",
      },
    })
  } catch (error) {
    const totalTime = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const errorStack = error instanceof Error ? error.stack : undefined
    
    // Детальное логирование ошибки
    console.error(`[MENU API] ❌ Error after ${totalTime}ms:`)
    console.error(`  Message: ${errorMessage}`)
    if (errorStack) {
      console.error(`  Stack: ${errorStack}`)
    }
    
    // Определяем тип ошибки для более понятного сообщения
    let errorType = "unknown"
    let userFriendlyMessage = errorMessage
    let recommendations: string[] = []

    if (errorMessage.includes("TABLE_NOT_FOUND")) {
      errorType = "table_not_found"
      const tableMatch = errorMessage.match(/TABLE_NOT_FOUND:(\w+)/)
      const tableName = tableMatch ? tableMatch[1] : "unknown"
      userFriendlyMessage = `Таблица ${tableName} не найдена в NocoDB`
      recommendations.push(`Проверьте правильность NOCODB_TABLE_${tableName.toUpperCase()}`)
      recommendations.push("Убедитесь, что таблица существует в NocoDB")
    } else if (errorMessage.includes("NocoDB is not configured")) {
      errorType = "configuration"
      userFriendlyMessage = "NocoDB не настроен"
      recommendations.push("Проверьте переменные окружения NOCODB_URL и NOCODB_TOKEN")
      recommendations.push("Добавьте переменные в Vercel Dashboard → Settings → Environment Variables")
    } else if (errorMessage.includes("timeout") || errorMessage.includes("TIMEOUT")) {
      errorType = "timeout"
      userFriendlyMessage = "Таймаут при подключении к NocoDB"
      recommendations.push("Проверьте доступность NocoDB сервера")
      recommendations.push("Проверьте настройки firewall и IP whitelist в NocoDB")
    } else if (errorMessage.includes("ENOTFOUND") || errorMessage.includes("DNS")) {
      errorType = "network"
      userFriendlyMessage = "Не удалось подключиться к NocoDB"
      recommendations.push("Проверьте правильность NOCODB_URL")
      recommendations.push("Убедитесь, что NocoDB доступен из интернета")
    } else if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
      errorType = "authentication"
      userFriendlyMessage = "Ошибка аутентификации в NocoDB"
      recommendations.push("Проверьте правильность NOCODB_TOKEN")
      recommendations.push("Убедитесь, что токен не истек и имеет необходимые права")
    } else if (errorMessage.includes("403") || errorMessage.includes("Forbidden")) {
      errorType = "authorization"
      userFriendlyMessage = "Доступ запрещен к NocoDB"
      recommendations.push("Проверьте права доступа токена")
      recommendations.push("Убедитесь, что токен имеет доступ к необходимым таблицам")
    } else if (errorMessage.includes("Failed to fetch")) {
      errorType = "network"
      userFriendlyMessage = "Не удалось получить данные из NocoDB"
      recommendations.push("Проверьте доступность NocoDB сервера")
      recommendations.push("Проверьте логи Vercel для деталей")
    }

    console.error(`[MENU API] Error type: ${errorType}`)
    if (recommendations.length > 0) {
      console.error(`[MENU API] Recommendations:`)
      recommendations.forEach((rec, i) => console.error(`  ${i + 1}. ${rec}`))
    }

    return NextResponse.json({
      meals: {
        breakfast: [],
        lunch_salad: [],
        lunch_soup: [],
        lunch_main: [],
        dinner_salad: [],
        dinner_soup: [],
        dinner_main: [],
        garnish: [],
      },
      extras: { drink: [], sauce: [], dessert: [], snack: [] },
      deliveryZones: [],
      deliveryTimes: DELIVERY_TIMES,
      source: "error",
      reason: userFriendlyMessage,
      error: {
        type: errorType,
        message: errorMessage,
        recommendations,
        hint: "Используйте /api/diagnose для детальной диагностики",
      },
      _meta: {
        processingTime: `${totalTime}ms`,
        timestamp: new Date().toISOString(),
      },
    }, { status: 503 })
  }
}
