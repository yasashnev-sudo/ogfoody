// Утилиты для работы с меню и определения недели

import type { NocoDBMeal, NocoDBExtra } from "./nocodb"
import type { Meal, ExtraItem, Garnish, PortionSize, Nutrition } from "./types"

// Преобразование NocoDB Meal в локальный тип
export function convertNocoDBMealToMeal(nocoMeal: NocoDBMeal): Meal {
  const nutrition: Nutrition | undefined = nocoMeal.calories
    ? {
        calories: nocoMeal.calories,
        protein: nocoMeal.protein || 0,
        fats: nocoMeal.fats || 0,
        carbs: nocoMeal.carbs || 0,
        weight: nocoMeal.weight_single,
      }
    : undefined

  return {
    id: nocoMeal.Id,
    name: nocoMeal.name,
    ingredients: nocoMeal.ingredients,
    prices: {
      single: nocoMeal.price_single,
      medium: nocoMeal.price_medium,
      large: nocoMeal.price_large,
    },
    weights: {
      single: nocoMeal.weight_single,
      medium: nocoMeal.weight_medium,
      large: nocoMeal.weight_large,
    },
    portion: "single" as PortionSize,
    needsGarnish: nocoMeal.needs_garnish,
    image: nocoMeal.image,
    available: nocoMeal.available,
    description: nocoMeal.description,
    nutrition,
    category: nocoMeal.category,
    weekType:
      nocoMeal.is_current_week && nocoMeal.is_next_week ? "both" : nocoMeal.is_current_week ? "current" : "next",
  }
}

// Преобразование NocoDB Extra в локальный тип
export function convertNocoDBExtraToExtraItem(nocoExtra: NocoDBExtra): ExtraItem {
  const nutrition: Nutrition | undefined = nocoExtra.calories
    ? {
        calories: nocoExtra.calories,
        protein: nocoExtra.protein || 0,
        fats: nocoExtra.fats || 0,
        carbs: nocoExtra.carbs || 0,
        weight: nocoExtra.weight,
      }
    : undefined

  return {
    id: nocoExtra.Id,
    name: nocoExtra.name,
    price: nocoExtra.price,
    image: nocoExtra.image,
    isCurrentWeek: nocoExtra.is_current_week === true || nocoExtra.is_current_week === "true" || nocoExtra.is_current_week === 1,
    isNextWeek: nocoExtra.is_next_week === true || nocoExtra.is_next_week === "true" || nocoExtra.is_next_week === 1,
    ingredients: nocoExtra.ingredients,
    description: nocoExtra.description,
    nutrition,
    category: nocoExtra.category,
  }
}

// Преобразование Meal в Garnish (для гарниров)
export function convertMealToGarnish(meal: Meal): Garnish {
  return {
    id: meal.id,
    name: meal.name,
    prices: meal.prices,
    weights: meal.weights,
    portion: meal.portion,
    ingredients: meal.ingredients,
    image: meal.image,
    description: meal.description,
    nutrition: meal.nutrition,
  }
}

// Категории блюд
export type MealCategory =
  | "breakfast"
  | "lunch_salad"
  | "lunch_soup"
  | "lunch_main"
  | "dinner_salad"
  | "dinner_soup"
  | "dinner_main"
  | "garnish"

// Группировка блюд по категориям
export function groupMealsByCategory(meals: Meal[]): Record<MealCategory, Meal[]> {
  const groups: Record<MealCategory, Meal[]> = {
    breakfast: [],
    lunch_salad: [],
    lunch_soup: [],
    lunch_main: [],
    dinner_salad: [],
    dinner_soup: [],
    dinner_main: [],
    garnish: [],
  }

  for (const meal of meals) {
    const category = meal.category as MealCategory
    if (category && groups[category]) {
      groups[category].push(meal)
    }
  }

  return groups
}

// Группировка дополнений по категориям
export function groupExtrasByCategory(extras: ExtraItem[]): Record<string, ExtraItem[]> {
  const groups: Record<string, ExtraItem[]> = {
    drink: [],
    sauce: [],
    dessert: [],
  }

  for (const extra of extras) {
    if (extra.category && groups[extra.category]) {
      groups[extra.category].push(extra)
    }
  }

  return groups
}

// Определение типа недели для даты
// Логика:
// - Current week: до понедельника следующей недели включительно (8 января)
// - Next week: со вторника следующей недели (9 января) до понедельника через неделю включительно (15 января)
export function getWeekTypeForDate(date: Date): "current" | "next" {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Найти понедельник текущей недели
  const currentMonday = new Date(today)
  const dayOfWeek = today.getDay()
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  currentMonday.setDate(today.getDate() + diff)

  // Найти понедельник следующей недели (последний день current week - включительно)
  const nextMonday = new Date(currentMonday)
  nextMonday.setDate(currentMonday.getDate() + 7)

  const targetDate = new Date(date)
  targetDate.setHours(0, 0, 0, 0)

  // Если дата до понедельника следующей недели включительно - current week
  // Если дата начиная со вторника следующей недели - next week
  if (targetDate <= nextMonday) {
    return "current"
  }

  return "next"
}

// Фильтрация блюд по типу недели
export function filterMealsByWeek(meals: Meal[], weekType: "current" | "next"): Meal[] {
  return meals.filter((meal) => {
    if (meal.weekType === "both") return true
    return meal.weekType === weekType
  })
}

// Получить доступные даты для заказа
// Правила:
// - Минимум: заказ на завтра (нельзя на сегодня)
// - Максимум: до понедельника через неделю включительно (15 января)
// - Выходные: суббота выходной (нельзя заказать на субботу)
// - Воскресенье: можно заказать
// - Current week: до понедельника следующей недели включительно (8 января)
// - Next week: со вторника следующей недели (9 января) до понедельника через неделю включительно (15 января)
export function getAvailableDatesForOrdering(): { date: Date; weekType: "current" | "next" }[] {
  const dates: { date: Date; weekType: "current" | "next" }[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Найти понедельник текущей недели
  const currentMonday = new Date(today)
  const dayOfWeek = today.getDay()
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  currentMonday.setDate(today.getDate() + diff)

  // Понедельник следующей недели (последний день current week - включительно)
  const nextMonday = new Date(currentMonday)
  nextMonday.setDate(currentMonday.getDate() + 7)

  // Вторник следующей недели (первый день next week)
  const nextTuesday = new Date(nextMonday)
  nextTuesday.setDate(nextMonday.getDate() + 1)

  // Понедельник через неделю (последний доступный день для заказа - 15 января)
  const mondayAfterNext = new Date(nextMonday)
  mondayAfterNext.setDate(nextMonday.getDate() + 7)

  // Начинаем с завтра (минимум)
  const current = new Date(today)
  current.setDate(current.getDate() + 1)

  // Добавляем даты до понедельника через неделю включительно
  while (current <= mondayAfterNext) {
    // Пропускаем субботы (день 6 - выходной)
    if (current.getDay() !== 6) {
      // Определяем тип недели: до понедельника следующей недели включительно - current, после - next
      const weekType = current <= nextMonday ? "current" : "next"
      dates.push({ date: new Date(current), weekType })
    }
    current.setDate(current.getDate() + 1)
  }

  return dates
}

// Проверка, можно ли заказать на дату
// Правила:
// - Минимум: заказ на завтра (нельзя на сегодня)
// - Максимум: до понедельника через неделю включительно (15 января)
// - Выходные: суббота выходной (нельзя заказать на субботу)
// - Воскресенье: можно заказать
export function canOrderForDate(date: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const targetDate = new Date(date)
  targetDate.setHours(0, 0, 0, 0)

  // Нельзя заказать на сегодня или прошлые даты (минимум - завтра)
  if (targetDate <= today) return false

  // Нельзя заказать на субботу (выходной)
  if (targetDate.getDay() === 6) return false

  // Найти понедельник текущей недели
  const currentMonday = new Date(today)
  const dayOfWeek = today.getDay()
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  currentMonday.setDate(today.getDate() + diff)

  // Понедельник следующей недели
  const nextMonday = new Date(currentMonday)
  nextMonday.setDate(currentMonday.getDate() + 7)

  // Понедельник через неделю (последний доступный день - 15 января)
  const mondayAfterNext = new Date(nextMonday)
  mondayAfterNext.setDate(nextMonday.getDate() + 7)

  // Можно заказать до понедельника через неделю включительно
  return targetDate <= mondayAfterNext
}
