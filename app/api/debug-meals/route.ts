// Debug endpoint для проверки обработки блюд
import { NextResponse } from "next/server"
import { fetchMeals } from "@/lib/nocodb"

function parseBoolean(value: string | boolean | number | undefined | null): boolean {
  if (value === undefined || value === null) return false
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1
  const str = String(value).toUpperCase()
  return str === "TRUE" || str === "1" || str === "YES"
}

export async function GET() {
  try {
    const nocoMeals = await fetchMeals()
    
    const debugInfo = {
      totalMeals: nocoMeals.length,
      sampleMeals: nocoMeals.slice(0, 5).map((m: any) => {
        const currentWeekRaw = m["Current Week"] ?? m.is_current_week
        const nextWeekRaw = m["Next Week"] ?? m.is_next_week
        const category = String((m["Category"] ?? m.category) || "").toLowerCase()
        
        return {
          name: m["Name"] ?? m.name,
          category,
          currentWeekRaw: currentWeekRaw,
          currentWeekType: typeof currentWeekRaw,
          currentWeekParsed: parseBoolean(currentWeekRaw),
          nextWeekRaw: nextWeekRaw,
          nextWeekType: typeof nextWeekRaw,
          nextWeekParsed: parseBoolean(nextWeekRaw),
          allKeys: Object.keys(m).filter(k => k.includes("Week") || k.includes("week") || k === "Category" || k === "category"),
        }
      }),
      stats: {
        withCurrentWeekTrue: nocoMeals.filter((m: any) => parseBoolean(m["Current Week"] ?? m.is_current_week)).length,
        withNextWeekTrue: nocoMeals.filter((m: any) => parseBoolean(m["Next Week"] ?? m.is_next_week)).length,
        withBothTrue: nocoMeals.filter((m: any) => 
          parseBoolean(m["Current Week"] ?? m.is_current_week) && 
          parseBoolean(m["Next Week"] ?? m.is_next_week)
        ).length,
        categories: nocoMeals.reduce((acc: Record<string, number>, m: any) => {
          const cat = String((m["Category"] ?? m.category) || "").toLowerCase()
          acc[cat] = (acc[cat] || 0) + 1
          return acc
        }, {}),
      },
    }
    
    return NextResponse.json(debugInfo)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

