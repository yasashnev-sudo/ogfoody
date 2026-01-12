import { NextResponse } from "next/server"
import { fetchMeals, fetchExtras, fetchDeliveryZones, isNocoDBConfigured } from "@/lib/nocodb"
import { DELIVERY_TIMES } from "@/lib/meals-data"

// Кэшируем на 1 минуту для более частого обновления данных
export const revalidate = 60

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

function parseIntervals(value: string | string[] | undefined | null): string[] {
  if (!value) return []
  // Если уже массив, возвращаем как есть
  if (Array.isArray(value)) {
    return value.map((s) => String(s).trim()).filter(Boolean)
  }
  // Если строка, парсим
  if (typeof value === "string") {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  }
  return []
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

    let skippedWrongWeek = 0

    console.log(`[MENU API] Processing ${nocoMeals.length} meals, weekType=${weekType || "all"}`)
    
    let processedCount = 0
    let trueFlagsCount = 0

    for (const m of nocoMeals) {
      try {
        processedCount++
        if (processedCount === 1) {
          console.log(`[MENU API] 🔵 Starting to process meals, first meal:`, {
            name: (m as any)["Name"] ?? m.name,
            category: (m as any)["Category"] ?? m.category,
            currentWeek: (m as any)["Current Week"],
            nextWeek: (m as any)["Next Week"],
          })
        }
      // NocoDB возвращает данные с английскими заголовками колонок
      // Поддерживаем оба варианта: имена колонок и заголовки
      // ВАЖНО: Используем проверку на undefined, а не ??, так как false тоже валидное значение
      const currentWeekRaw = (m as any)["Current Week"] !== undefined 
        ? (m as any)["Current Week"] 
        : ((m as any).is_current_week !== undefined ? (m as any).is_current_week : m.is_current_week)
      const nextWeekRaw = (m as any)["Next Week"] !== undefined 
        ? (m as any)["Next Week"] 
        : ((m as any).is_next_week !== undefined ? (m as any).is_next_week : m.is_next_week)
      
      const isCurrentWeek = parseBoolean(currentWeekRaw)
      const isNextWeek = parseBoolean(nextWeekRaw)
      
      if (isCurrentWeek || isNextWeek) {
        trueFlagsCount++
        // Логируем первые несколько блюд с True для отладки
        if (trueFlagsCount <= 5) {
          const mealName = (m as any)["Name"] ?? m.name
          console.log(`[MENU API] ✅ Meal "${mealName}": raw=(${JSON.stringify(currentWeekRaw)}, ${JSON.stringify(nextWeekRaw)}), parsed=(${isCurrentWeek}, ${isNextWeek})`)
        }
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
      
      // Если оба флага false, блюдо недоступно (пропускаем)
      // Но только если weekType не указан (показываем все доступные)
      if (!weekType && !isCurrentWeek && !isNextWeek) {
        skippedWrongWeek++
        continue
      }
      
      // Поддерживаем английские заголовки колонок
      const category = String(
        ((m as any)["Category"] ?? m.category) || ""
      ).toLowerCase()
      
      // Логируем первые несколько блюд
      if (processedCount <= 5) {
        const mealName = (m as any)["Name"] ?? m.name
        console.log(`[MENU API] Processing meal "${mealName}": category="${category}", isCurrentWeek=${isCurrentWeek}, isNextWeek=${isNextWeek}`)
      }

      // ... existing code for parsing prices ...
      const priceSingle = parsePrice(
        (m as any)["Price (Single)"] ?? m.price_single
      ) || parsePrice((m as any)["Price"] ?? m.price)
      const priceMedium = parsePrice(
        (m as any)["Price (Medium)"] ?? m.price_medium
      )
      const priceLarge = parsePrice(
        (m as any)["Price (Large)"] ?? m.price_large
      )

      const weightSingle = parsePrice(
        (m as any)["Weight (Single)"] ?? m.weight_single
      ) || parsePrice((m as any)["Weight"] ?? m.weight)
      const weightMedium = parsePrice(
        (m as any)["Weight (Medium)"] ?? m.weight_medium
      )
      const weightLarge = parsePrice(
        (m as any)["Weight (Large)"] ?? m.weight_large
      )

      const meal = {
        id: m.Id || m.id,
        name: ((m as any)["Name"] ?? m.name) || "",
        ingredients: ((m as any)["Ingredients"] ?? m.ingredients) || "",
        description: ((m as any)["Description"] ?? m.description) || "",
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
        needsGarnish: parseBoolean(
          (m as any)["Needs Garnish"] ?? m.needs_garnish
        ),
        image: ((m as any)["Image (URL)"] ?? m.image) || "",
        nutrition: {
          calories: parseNumber((m as any)["Calories"] ?? m.calories),
          protein: parseNumber((m as any)["Protein"] ?? m.protein),
          fats: parseNumber((m as any)["Fats"] ?? m.fats),
          carbs: parseNumber((m as any)["Carbs"] ?? m.carbs),
          weight: weightSingle,
        },
        category: category,
        weekType: isCurrentWeek && isNextWeek ? "both" : isCurrentWeek ? "current" : "next",
      }
      
      // Логируем первые несколько блюд после создания объекта
      if (processedCount <= 3) {
        console.log(`[MENU API] Created meal object: "${meal.name}", category="${category}", will try to add to groups`)
      }

      // Логируем первые несколько блюд для отладки
      if (skippedWrongWeek < 5) {
        console.log(`[MENU API] Meal "${meal.name}": category="${category}", isCurrentWeek=${isCurrentWeek}, isNextWeek=${isNextWeek}`)
      }

      if (category === "breakfast") {
        groupedMeals.breakfast.push(meal)
        if (skippedWrongWeek < 5) console.log(`[MENU API] ✅ Added to breakfast`)
      } else if (category === "garnish") {
        groupedMeals.garnish.push(meal)
        if (skippedWrongWeek < 5) console.log(`[MENU API] ✅ Added to garnish`)
      } else if (category === "soup" || category === "salad" || category === "main") {
        const lunchCategory = `lunch_${category}`
        const dinnerCategory = `dinner_${category}`

        groupedMeals[lunchCategory].push({ ...meal, category: lunchCategory })
        if (processedCount <= 5) console.log(`[MENU API] ✅ Added "${meal.name}" to ${lunchCategory} (now: ${groupedMeals[lunchCategory].length})`)
        
        groupedMeals[dinnerCategory].push({ ...meal, id: `${meal.id}_dinner`, category: dinnerCategory })
        if (processedCount <= 5) console.log(`[MENU API] ✅ Added "${meal.name}" to ${dinnerCategory} (now: ${groupedMeals[dinnerCategory].length})`)
      } else {
        if (processedCount <= 5) console.log(`[MENU API] ⚠️ Unknown category: "${category}" for meal "${meal.name}"`)
      }
      } catch (error) {
        console.error(`[MENU API] ❌ Error processing meal:`, error, m)
        skippedWrongWeek++
      }
    }

    console.log(`[MENU API] Meals filtering: weekType=${weekType || "all"}, processed=${processedCount}, with true flags=${trueFlagsCount}, skipped ${skippedWrongWeek} meals (not available for selected week)`)
    console.log(
      `[MENU API] Grouped meals:`,
      Object.entries(groupedMeals)
        .map(([k, v]) => `${k}:${v.length}`)
        .join(", "),
    )
    console.log(`[MENU API] Total meals in groups: ${Object.values(groupedMeals).flat().length}`)

    // ... existing code for extras ...
    const groupedExtras: Record<string, any[]> = {
      drink: [],
      sauce: [],
      dessert: [],
      snack: [],
    }

    for (const e of nocoExtras) {
      // NocoDB возвращает данные с английскими заголовками колонок
      const isCurrentWeek = parseBoolean(
        (e as any)["Current Week"] ?? (e as any).is_current_week ?? e.is_current_week
      )
      const isNextWeek = parseBoolean(
        (e as any)["Next Week"] ?? (e as any).is_next_week ?? e.is_next_week
      )

      // Фильтрация по неделе (аналогично meals):
      // - Если оба флага false - дополнение недоступно
      // - Для "current": должно быть доступно в текущей неделе или в обеих
      // - Для "next": должно быть доступно в следующей неделе или в обеих
      if (weekType === "current" && !isCurrentWeek) {
        continue
      }
      if (weekType === "next" && !isNextWeek) {
        continue
      }
      
      // Если оба флага false, дополнение недоступно (пропускаем)
      if (!isCurrentWeek && !isNextWeek) {
        continue
      }

      const category = String(
        ((e as any)["Category"] ?? e.category) || ""
      ).toLowerCase()

      const extra = {
        id: e.Id || e.id,
        name: ((e as any)["Name"] ?? e.name) || "",
        price: parsePrice((e as any)["Price"] ?? e.price),
        image: ((e as any)["Image (URL)"] ?? e.image) || "",
        isCurrentWeek,
        isNextWeek,
        ingredients: ((e as any)["Ingredients"] ?? e.ingredients) || "",
        description: ((e as any)["Description"] ?? e.description) || "",
        nutrition: {
          calories: parseNumber((e as any)["Calories"] ?? e.calories),
          protein: parseNumber((e as any)["Protein"] ?? e.protein),
          fats: parseNumber((e as any)["Fats"] ?? e.fats),
          carbs: parseNumber((e as any)["Carbs"] ?? e.carbs),
          weight: parsePrice((e as any)["Weight"] ?? e.weight),
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
      .filter((zone: any) => {
        // NocoDB API возвращает данные с ключами как title (с заглавными буквами)
        // Пробуем оба варианта: column_name и title
        const isAvailable = (zone as any).is_available ?? (zone as any)["Available"] ?? (zone as any).Available
        return parseBoolean(isAvailable)
      })
      .map((zone: any) => ({
        id: zone.Id || zone.id,
        // Пробуем оба варианта: column_name (snake_case) и title (с заглавными)
        city: zone.city || zone["City"] || zone.City || "",
        district: zone.district || zone["District"] || zone.District || "",
        deliveryFee: parsePrice(zone.delivery_fee ?? zone["Delivery Fee"] ?? zone["Delivery Fee"]),
        minOrderAmount: parsePrice(zone.min_order_amount ?? zone["Min Order Amount"] ?? zone["Min Order Amount"]),
        isAvailable: true,
        availableIntervals: parseIntervals(
          (zone as any).available_intervals ?? 
          (zone as any)["Available Intervals"] ?? 
          (zone as any)["Available Intervals"]
        ),
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
