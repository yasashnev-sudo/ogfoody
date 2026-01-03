"use client"

import useSWR from "swr"
import type { Meal, ExtraItem, DeliveryZone } from "@/lib/types"

interface MenuData {
  meals: Record<string, Meal[]>
  extras: Record<string, ExtraItem[]>
  deliveryZones: DeliveryZone[]
  deliveryTimes: string[]
  source: "nocodb" | "fallback"
}

const fetcher = async (url: string): Promise<MenuData> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch menu")
  return res.json()
}

export function useMenu(weekType?: "current" | "next") {
  const url = weekType ? `/api/menu?week=${weekType}` : "/api/menu"

  const { data, error, isLoading, mutate } = useSWR<MenuData>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000,
    // Убран fallbackData - не показываем заглушки
  })

  // Пустые объекты если данные еще не загружены
  const emptyMeals: Record<string, Meal[]> = {
    breakfast: [],
    lunch_salad: [],
    lunch_soup: [],
    lunch_main: [],
    dinner_salad: [],
    dinner_soup: [],
    dinner_main: [],
    garnish: [],
  }

  const emptyExtras: Record<string, ExtraItem[]> = {
    drink: [],
    sauce: [],
    dessert: [],
    snack: [],
  }

  return {
    meals: data?.meals || emptyMeals,
    extras: data?.extras || emptyExtras,
    deliveryZones: data?.deliveryZones || [],
    deliveryTimes: data?.deliveryTimes || [],
    isLoading,
    isError: error,
    source: data?.source || "loading",
    refresh: mutate,
  }
}

// Хук для получения меню конкретной недели
export function useWeeklyMenu(weekType: "current" | "next") {
  return useMenu(weekType)
}

// Хук для получения всего меню (обе недели)
export function useFullMenu() {
  return useMenu()
}
