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
  const { searchParams } = new URL(request.url)
  const weekType = searchParams.get("week") as "current" | "next" | null

  console.log(`[v0] /api/menu GET request, weekType: ${weekType}`)

  if (!isNocoDBConfigured()) {
    console.log("[v0] NocoDB not configured")
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
      reason: "NocoDB not configured",
    })
  }

  try {
    const [nocoMeals, nocoExtras, nocoZones] = await Promise.all([
      fetchMeals(weekType || undefined),
      fetchExtras(),
      fetchDeliveryZones(),
    ])

    console.log(`[v0] Got data: meals=${nocoMeals.length}, extras=${nocoExtras.length}, zones=${nocoZones.length}`)

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

    console.log(`[v0] Meals filter: skipped ${skippedNotAvailable} not available, ${skippedWrongWeek} wrong week`)
    console.log(
      `[v0] Grouped meals:`,
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
      `[v0] Grouped extras:`,
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
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[v0] Failed to fetch from NocoDB:", errorMessage)

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
      reason: errorMessage,
    })
  }
}
