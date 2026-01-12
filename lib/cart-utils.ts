/**
 * Cart Utilities
 * Вспомогательные функции для работы с корзиной и проверки актуальности товаров
 */

import type { Order, Person, DayMeals, Meal, Extra, BreakfastSelection, FullMealSelection } from "./types"

/**
 * Структура результата валидации заказа
 */
export interface OrderValidationResult {
  /** Обновленный заказ с актуальными товарами */
  validatedOrder: Order
  /** Список недоступных товаров */
  unavailableItems: string[]
  /** Есть ли недоступные товары */
  hasUnavailableItems: boolean
}

/**
 * Интерфейс данных меню из API
 */
interface MenuData {
  breakfast: Meal[]
  lunch_salad: Meal[]
  lunch_soup: Meal[]
  lunch_main: Meal[]
  dinner_salad: Meal[]
  dinner_soup: Meal[]
  dinner_main: Meal[]
  garnish: Meal[]
}

/**
 * Проверяет актуальность товаров заказа по текущему меню из API
 * 
 * @param order - Заказ для проверки
 * @param currentMenu - Актуальное меню из API
 * @param currentExtras - Актуальные дополнения из API
 * @returns Результат валидации с обновленным заказом и списком недоступных товаров
 * 
 * @example
 * const { validatedOrder, unavailableItems, hasUnavailableItems } = validateOrderItems(
 *   historicalOrder,
 *   menuData,
 *   extrasData
 * )
 * 
 * if (hasUnavailableItems) {
 *   toast.warning(`Некоторые товары больше недоступны: ${unavailableItems.join(', ')}`)
 * }
 */
export function validateOrderItems(
  order: Order,
  currentMenu: Record<string, Meal[]>,
  currentExtras: Record<string, Extra[]>
): OrderValidationResult {
  const unavailableItems: string[] = []

  /**
   * Поиск блюда в текущем меню по ID или имени
   * ВАЖНО: Используем ТЕКУЩУЮ цену из меню, а не историческую
   */
  const findMealInMenu = (mealToFind: Meal | null, categories: string[]): Meal | null => {
    if (!mealToFind) return null

    // Ищем по всем указанным категориям
    for (const category of categories) {
      const menuCategory = currentMenu[category] || []
      
      // Сначала пытаемся найти по ID (самый надежный способ)
      let found = menuCategory.find(m => m.id === mealToFind.id)
      
      // Если не нашли по ID, ищем по имени (фолбэк)
      if (!found) {
        found = menuCategory.find(m => m.name === mealToFind.name)
      }

      if (found) {
        // ✅ КРИТИЧНО: Возвращаем блюдо с ТЕКУЩЕЙ ценой из меню
        // Но сохраняем выбранную пользователем порцию
        return {
          ...found,
          portion: mealToFind.portion, // Сохраняем выбранную порцию
          garnish: mealToFind.garnish, // Сохраняем выбранный гарнир (если был)
        }
      }
    }

    // Блюдо не найдено в меню - добавляем в список недоступных
    unavailableItems.push(mealToFind.name)
    return null
  }

  /**
   * Валидация BreakfastSelection
   */
  const validateBreakfast = (breakfast: BreakfastSelection | null | undefined): BreakfastSelection => {
    if (!breakfast || !breakfast.dish) {
      return { dish: null }
    }

    const validatedDish = findMealInMenu(breakfast.dish, ['breakfast'])
    return { dish: validatedDish }
  }

  /**
   * Валидация FullMealSelection (lunch/dinner)
   */
  const validateFullMeal = (
    meal: FullMealSelection | null | undefined,
    mealType: 'lunch' | 'dinner'
  ): FullMealSelection => {
    if (!meal) {
      return { salad: null, soup: null, main: null }
    }

    const validatedSalad = meal.salad 
      ? findMealInMenu(meal.salad, [`${mealType}_salad`])
      : null

    const validatedSoup = meal.soup
      ? findMealInMenu(meal.soup, [`${mealType}_soup`])
      : null

    const validatedMain = meal.main
      ? findMealInMenu(meal.main, [`${mealType}_main`])
      : null

    // Валидация гарнира для main, если он есть
    if (validatedMain?.garnish) {
      const garnishInMenu = findMealInMenu(validatedMain.garnish, ['garnish'])
      if (validatedMain) {
        validatedMain.garnish = garnishInMenu
      }
    }

    return {
      salad: validatedSalad,
      soup: validatedSoup,
      main: validatedMain,
    }
  }

  /**
   * Валидация DayMeals (day1/day2)
   */
  const validateDayMeals = (dayMeals: DayMeals): DayMeals => {
    return {
      breakfast: validateBreakfast(dayMeals.breakfast),
      lunch: validateFullMeal(dayMeals.lunch, 'lunch'),
      dinner: validateFullMeal(dayMeals.dinner, 'dinner'),
    }
  }

  /**
   * Валидация всех персон в заказе
   */
  const validatedPersons: Person[] = order.persons.map(person => ({
    ...person,
    day1: validateDayMeals(person.day1),
    day2: validateDayMeals(person.day2),
  }))

  /**
   * Валидация дополнений (extras)
   * ВАЖНО: Используем ТЕКУЩУЮ цену из extras
   */
  const validatedExtras: Extra[] = (order.extras || [])
    .map(extra => {
      // Ищем extra во всех категориях
      const allExtras = Object.values(currentExtras).flat()
      
      // Сначала по ID, потом по имени
      let found = allExtras.find(e => e.id === extra.id)
      if (!found) {
        found = allExtras.find(e => e.name === extra.name)
      }

      if (found) {
        // ✅ КРИТИЧНО: Возвращаем extra с ТЕКУЩЕЙ ценой
        return {
          ...found,
          quantity: extra.quantity, // Сохраняем количество
        }
      }

      // Extra не найден - добавляем в список недоступных
      unavailableItems.push(extra.name)
      return null
    })
    .filter((extra): extra is Extra => extra !== null)

  // Собираем валидированный заказ
  const validatedOrder: Order = {
    ...order,
    persons: validatedPersons,
    extras: validatedExtras,
    // Важно: не копируем цены из старого заказа!
    // Они будут пересчитаны в OrderModal с актуальными ценами
    total: undefined,
    subtotal: undefined,
    deliveryFee: undefined,
  }

  return {
    validatedOrder,
    unavailableItems,
    hasUnavailableItems: unavailableItems.length > 0,
  }
}

/**
 * Проверяет, есть ли в заказе хотя бы один товар
 */
export function hasOrderContent(order: Order): boolean {
  // Проверяем persons
  const hasPersons = order.persons.some(person => {
    const day1HasContent = 
      person.day1.breakfast?.dish ||
      person.day1.lunch?.salad ||
      person.day1.lunch?.soup ||
      person.day1.lunch?.main ||
      person.day1.dinner?.salad ||
      person.day1.dinner?.soup ||
      person.day1.dinner?.main

    const day2HasContent =
      person.day2.breakfast?.dish ||
      person.day2.lunch?.salad ||
      person.day2.lunch?.soup ||
      person.day2.lunch?.main ||
      person.day2.dinner?.salad ||
      person.day2.dinner?.soup ||
      person.day2.dinner?.main

    return day1HasContent || day2HasContent
  })

  // Проверяем extras
  const hasExtras = (order.extras || []).length > 0

  return hasPersons || hasExtras
}



