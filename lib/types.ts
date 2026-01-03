export type PortionSize = "single" | "medium" | "large"

export interface Nutrition {
  calories: number
  protein: number
  fats: number
  carbs: number
  weight?: number
}

export interface Garnish {
  id: number
  name: string
  prices: {
    single: number
    medium?: number
    large?: number
  }
  weights: {
    single: number
    medium?: number
    large?: number
  }
  portion: PortionSize
  ingredients?: string
  image?: string
  description?: string
  nutrition?: Nutrition
}

export interface Meal {
  id: number
  name: string
  ingredients: string
  prices: {
    single: number
    medium?: number
    large?: number
  }
  weights: {
    single: number
    medium?: number
    large?: number
  }
  portion: PortionSize
  needsGarnish?: boolean
  garnish?: Garnish | null
  image?: string
  available?: boolean
  description?: string
  nutrition?: Nutrition
  category?: string
  weekType?: "current" | "next" | "both"
}

export interface MenuItem {
  id: number
  name: string
  ingredients: string
  prices: {
    single: number
    medium?: number
    large?: number
  }
  weights: {
    single: number
    medium?: number
    large?: number
  }
  needsGarnish?: boolean
  image?: string
  available?: boolean
  category?: string
  description?: string
  nutrition?: Nutrition
  weekType?: "current" | "next" | "both"
}

export interface BreakfastSelection {
  dish: Meal | null
}

export interface FullMealSelection {
  salad: Meal | null
  soup: Meal | null
  main: Meal | null
}

export interface DayMeals {
  breakfast: BreakfastSelection
  lunch: FullMealSelection
  dinner: FullMealSelection
}

export interface Extra {
  id: number
  name: string
  price: number
  quantity: number
  image?: string
  available?: boolean
  ingredients?: string
  description?: string
  nutrition?: Nutrition
  category?: string
}

export interface ExtraItem {
  id: number
  name: string
  price: number
  image?: string
  available?: boolean
  ingredients?: string
  description?: string
  nutrition?: Nutrition
  category?: string
}

export interface Person {
  id: number
  day1: DayMeals
  day2: DayMeals
}

export const createEmptyDay = (): DayMeals => ({
  breakfast: { dish: null },
  lunch: { salad: null, soup: null, main: null },
  dinner: { salad: null, soup: null, main: null },
})

export interface Order {
  id?: number
  orderNumber?: string
  startDate: string | Date
  persons: Person[]
  delivered: boolean
  deliveryTime: string
  extras?: Extra[]
  paid: boolean
  paidAt?: string
  cancelled?: boolean
  paymentMethod?: "card" | "sbp" | "cash"
  promoCode?: string
  promoDiscount?: number
  loyaltyPointsUsed?: number
  loyaltyPointsEarned?: number
  subtotal?: number
  total?: number
  weekType?: "current" | "next"
}

export interface UserProfile {
  id?: number
  phone: string
  additionalPhone?: string
  name: string
  street: string
  building: string
  buildingSection?: string
  apartment?: string
  entrance?: string
  floor?: string
  intercom?: string
  district?: string
  deliveryComment?: string
  loyaltyPoints: number
  totalSpent: number
}

export interface Review {
  id?: number
  orderId: string | number
  rating: number
  text: string
  createdAt: string
}

export interface DeliveryZone {
  id: number
  city: string
  district?: string
  deliveryFee: number
  minOrderAmount: number
  isAvailable: boolean
  availableIntervals: string[]
}

// Хелпер для расчета цены порции
export function getMealPrice(meal: Meal | Garnish, portion: PortionSize): number {
  if (!meal || !meal.prices) return 0
  if (portion === "medium" && meal.prices.medium) {
    return meal.prices.medium
  }
  if (portion === "large" && meal.prices.large) {
    return meal.prices.large
  }
  return meal.prices.single || 0
}

// Хелпер для расчета веса порции
export function getMealWeight(meal: Meal | Garnish, portion: PortionSize): number {
  if (!meal || !meal.weights) return 0
  if (portion === "medium" && meal.weights.medium) {
    return meal.weights.medium
  }
  if (portion === "large" && meal.weights.large) {
    return meal.weights.large
  }
  return meal.weights.single || 0
}

// Хелпер для получения названия размера порции
export function getPortionLabel(portion: PortionSize): string {
  switch (portion) {
    case "single":
      return "Стандарт"
    case "medium":
      return "Средний"
    case "large":
      return "Большой"
    default:
      return "Стандарт"
  }
}
