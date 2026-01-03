"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Minus,
  Users,
  Clock,
  Eye,
  Shuffle,
  CreditCard,
  Smartphone,
  Loader2,
  CheckCircle2,
  Banknote,
  ChevronRight,
  ChevronDown,
  Tag,
  MapPin,
  Phone,
  Truck,
  ChefHat,
  Bell,
  Sunrise,
  Sun,
  Moon,
  Wand2,
  ArrowDown,
  ArrowRight
} from "lucide-react"
import { MealSelector } from "@/components/meal-selector"
import { ExtrasSelector } from "@/components/extras-selector"
// Added new hooks and utils
import { useMenu } from "@/hooks/use-menu"
import { getWeekTypeForDate } from "@/lib/menu-utils"
import type {
  Order,
  Person,
  DayMeals,
  Extra,
  BreakfastSelection,
  FullMealSelection,
  Meal,
  PortionSize,
  Garnish,
} from "@/lib/types"
// Added getMealPrice helper
import { getMealPrice } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { WarningDialog } from "@/components/warning-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { format, addDays } from "date-fns"
import { ru } from "date-fns/locale"

type PaymentMethod = "card" | "sbp" | "cash"

interface OrderModalProps {
  date: Date
  existingOrder?: Order
  onClose: () => void
  onSave: (order: Order) => void
  onCancel?: (startDate: Date) => void
  allOrders: Order[]
  onPaymentSuccess?: (order: Order) => void
  userLoyaltyPoints?: number
  isAuthenticated?: boolean
  onRequestAuth?: () => void
  userAddress?: string
  userCity?: string
  open: boolean // Added prop for Dialog
}

const formatDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
}

const formatDisplayDate = (date: Date): string => {
  const months = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
  return `${date.getDate()} ${months[date.getMonth()]}` // Using toLocaleDateString for consistency
}

const formatFullDate = (date: Date): string => {
  const days = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"]
  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ]
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}` // Using toLocaleDateString for consistency
}

const getDateObject = (date: string | Date): Date => {
  if (date instanceof Date) return date
  if (typeof date === "string" && date.includes("-")) {
    const [year, month, day] = date.split("-").map(Number)
    return new Date(year, month - 1, day)
  }
  return new Date(date)
}

const createEmptyDayMeals = (): DayMeals => ({
  breakfast: { dish: null },
  lunch: { salad: null, soup: null, main: null },
  dinner: { salad: null, soup: null, main: null },
})

const ensureFullMealStructure = (meal: FullMealSelection | null | undefined): FullMealSelection => {
  if (!meal) return { salad: null, soup: null, main: null }
  return {
    salad: meal.salad ?? null,
    soup: meal.soup ?? null,
    main: meal.main ?? null,
  }
}

const ensureBreakfastStructure = (breakfast: BreakfastSelection | null | undefined): BreakfastSelection => {
  if (!breakfast) return { dish: null }
  return { dish: breakfast.dish ?? null }
}

const ensureDayMealsStructure = (day: DayMeals | null | undefined): DayMeals => {
  if (!day) return createEmptyDayMeals()
  return {
    breakfast: ensureBreakfastStructure(day.breakfast),
    lunch: ensureFullMealStructure(day.lunch),
    dinner: ensureFullMealStructure(day.dinner),
  }
}

export function OrderModal({
  date,
  existingOrder,
  onClose,
  onSave,
  onCancel,
  allOrders,
  onPaymentSuccess,
  userLoyaltyPoints = 0,
  isAuthenticated = false,
  onRequestAuth,
  userAddress,
  userCity,
  open, // Added prop for Dialog
}: OrderModalProps) {
  const cityLower = (userCity || "").toLowerCase()
  const isInDeliveryZone = cityLower.includes("санкт-петербург") || cityLower.includes("спб") || !userCity

  const weekType = getWeekTypeForDate(date)
  const { meals: menuData, extras: availableExtras, deliveryTimes: rawDeliveryTimes } = useMenu(weekType)
  // Убеждаемся, что deliveryTimes всегда массив
  const deliveryTimes = Array.isArray(rawDeliveryTimes) ? rawDeliveryTimes : []

  const getInitialPersons = (): Person[] => {
    return (
      existingOrder?.persons?.map((p) => ({
        id: p.id,
        day1: ensureDayMealsStructure(p.day1),
        day2: ensureDayMealsStructure(p.day2),
      })) || [{ id: 1, day1: createEmptyDayMeals(), day2: createEmptyDayMeals() }]
    )
  }

  const [persons, setPersons] = useState<Person[]>(getInitialPersons())
  const [deliveryTime, setDeliveryTime] = useState(existingOrder?.deliveryTime || "")
  const [extras, setExtras] = useState<Extra[]>(existingOrder?.extras || [])
  const [confirmFillPersonId, setConfirmFillPersonId] = useState<number | null>(null)

  // Обновляем deliveryTime когда deliveryTimes загрузится или изменится
  useEffect(() => {
    if (!existingOrder?.deliveryTime && deliveryTimes.length > 0 && !deliveryTime) {
      setDeliveryTime(deliveryTimes[0])
    }
  }, [deliveryTimes.length, deliveryTimes.join(","), existingOrder?.deliveryTime, deliveryTime])

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null)
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false)
  const [loyaltyPointsToUse, setLoyaltyPointsToUse] = useState(0)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [fillTimestamp, setFillTimestamp] = useState(0)
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const [showFloatingButton, setShowFloatingButton] = useState(false)
  
  // Warning dialog state
  const [warningDialog, setWarningDialog] = useState<{
    open: boolean
    title: string
    description: string
    variant?: "warning" | "error" | "info"
  }>({
    open: false,
    title: "",
    description: "",
    variant: "error",
  })

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  const { toast } = useToast()
  
  const showWarning = (title: string, description: string, variant: "warning" | "error" | "info" = "error") => {
    setWarningDialog({
      open: true,
      title,
      description,
      variant,
    })
  }
  
  const closeWarning = () => {
    setWarningDialog((prev) => ({ ...prev, open: false }))
  }

  const selectedDate = date // Use the date prop directly for formatting

  useEffect(() => {
    if (open) {
      // Reset to initial values when modal opens with new date/order
      const newPersons = existingOrder?.persons?.map((p) => ({
        id: p.id,
        day1: ensureDayMealsStructure(p.day1),
        day2: ensureDayMealsStructure(p.day2),
      })) || [{ id: 1, day1: createEmptyDayMeals(), day2: createEmptyDayMeals() }]

      setPersons(newPersons)
      setDeliveryTime(existingOrder?.deliveryTime || deliveryTimes[0] || "")
      setExtras(existingOrder?.extras || [])
      // Если это существующий заказ с наличными и не оплачен, предустанавливаем карту для оплаты
      // Иначе используем текущий способ оплаты заказа или карту по умолчанию
      if (existingOrder?.paymentMethod === "cash" && !existingOrder?.paid) {
        setPaymentMethod("card")
      } else {
        setPaymentMethod(existingOrder?.paymentMethod || "card")
      }
      setPromoCode("")
      setAppliedPromo(null)
      setUseLoyaltyPoints(false)
      setLoyaltyPointsToUse(0)
      setConfirmFillPersonId(null)
      setShowCancelConfirm(false)
      setIsProcessingPayment(false)
      
      // Initial active section: null to avoid auto-scroll on open
      setActiveSectionId(null)
      setShowFloatingButton(false)
    }
  }, [open, date.getTime(), existingOrder?.id, deliveryTimes.length, deliveryTimes.join(",")])

  const dateKey = formatDateKey(date)

  const hasAnyMeal = persons.some((person) => {
    return ["day1", "day2"].some((day) => {
      const d = person[day as "day1" | "day2"]
      if (!d) return false
      const breakfast = ensureBreakfastStructure(d.breakfast)
      const lunch = ensureFullMealStructure(d.lunch)
      const dinner = ensureFullMealStructure(d.dinner)
      return breakfast.dish || lunch.salad || lunch.soup || lunch.main || dinner.salad || dinner.soup || dinner.main
    })
  })

  const hasContent = hasAnyMeal || extras.length > 0

  // Track scroll to hide/show floating button
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || !open) return

    const handleScroll = () => {
      if (!hasContent) {
        setShowFloatingButton(false)
        return
      }

      const footer = footerRef.current
      if (footer) {
        const footerRect = footer.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        
        // Hide if footer is visible in the viewport of the container
        const isFooterVisible = footerRect.top < containerRect.bottom - 20
        setShowFloatingButton(!isFooterVisible)
      } else {
        setShowFloatingButton(true)
      }
    }

    container.addEventListener("scroll", handleScroll)
    // Initial check
    setTimeout(handleScroll, 100)
    
    return () => container.removeEventListener("scroll", handleScroll)
  }, [open, hasContent, persons, extras])


  const calculateTotal = () => {
    let total = 0
    persons.forEach((person) => {
      ;["day1", "day2"].forEach((day) => {
        const d = person[day as "day1" | "day2"]
        if (!d) return

        const breakfast = ensureBreakfastStructure(d.breakfast)
        const lunch = ensureFullMealStructure(d.lunch)
        const dinner = ensureFullMealStructure(d.dinner)

        if (breakfast.dish) {
          total += getMealPrice(breakfast.dish, breakfast.dish.portion)
        }
        if (lunch.salad) total += getMealPrice(lunch.salad, lunch.salad.portion)
        if (lunch.soup) total += getMealPrice(lunch.soup, lunch.soup.portion)
        if (lunch.main) {
          total += getMealPrice(lunch.main, lunch.main.portion)
          if (lunch.main.garnish) total += getMealPrice(lunch.main.garnish, lunch.main.garnish.portion)
        }
        if (dinner.salad) total += getMealPrice(dinner.salad, dinner.salad.portion)
        if (dinner.soup) total += getMealPrice(dinner.soup, dinner.soup.portion)
        if (dinner.main) {
          total += getMealPrice(dinner.main, dinner.main.portion)
          if (dinner.main.garnish) total += getMealPrice(dinner.main.garnish, dinner.main.garnish.portion)
        }
      })
    })
    extras.forEach((extra) => {
      total += extra.price * extra.quantity
    })
    return total
  }

  const totalBeforeDiscount = calculateTotal()
  const maxPointsDiscount = Math.min(userLoyaltyPoints, Math.floor(totalBeforeDiscount * 0.5))
  const pointsDiscount = useLoyaltyPoints ? Math.min(loyaltyPointsToUse, maxPointsDiscount) : 0
  const finalTotal = Math.max(0, totalBeforeDiscount - pointsDiscount - (appliedPromo?.discount || 0))

  const applyAllPoints = () => {
    setLoyaltyPointsToUse(maxPointsDiscount)
    setUseLoyaltyPoints(true)
  }

  const handlePayAndOrder = async () => {
    if (!hasContent) {
      return
    }

    if (!isAuthenticated) {
      if (onRequestAuth) {
        onRequestAuth()
      }
      return
    }

    if (!isInDeliveryZone) {
      toast({
        title: "Доставка недоступна",
        description: "К сожалению, мы пока не доставляем в ваш район. Доступна доставка только по Санкт-Петербургу.",
        variant: "destructive",
      })
      return
    }

    setIsProcessingPayment(true)

    if (paymentMethod !== "cash") {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))
    } else {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    const order: Order = {
      ...(existingOrder?.id ? { id: existingOrder.id } : {}),
      ...(existingOrder?.orderNumber ? { orderNumber: existingOrder.orderNumber } : {}),
      startDate: dateKey,
      persons,
      delivered: existingOrder?.delivered ?? false,
      deliveryTime,
      extras,
      paid: paymentMethod !== "cash" ? true : (existingOrder?.paid ?? false),
      paidAt: paymentMethod !== "cash" ? new Date().toISOString() : existingOrder?.paidAt,
      cancelled: existingOrder?.cancelled ?? false,
      paymentMethod,
      promoCode: appliedPromo?.code,
      promoDiscount: appliedPromo?.discount,
      loyaltyPointsUsed: pointsDiscount > 0 ? pointsDiscount : undefined,
    }

    onSave(order)

    if (onPaymentSuccess) {
      onPaymentSuccess(order)
    }

    setIsProcessingPayment(false)
  }

  const addPerson = () => {
    const newId = persons.length + 1
    const newPerson: Person = {
      id: newId,
      day1: createEmptyDayMeals(),
      day2: createEmptyDayMeals(),
    }
    setPersons([...persons, newPerson])
    // Auto-scroll to the new person's first meal
    setActiveSectionId(`section-breakfast-${newId}-1-daily-day1-breakfast`)
  }

  const removePerson = (personId: number) => {
    if (persons.length > 1) {
      setPersons(persons.filter((p) => p.id !== personId))
    }
  }

  const updateBreakfast = (personId: number, day: "day1" | "day2", breakfast: BreakfastSelection) => {
    setPersons(persons.map((p) => (p.id === personId ? { ...p, [day]: { ...p[day], breakfast } } : p)))
  }

  const updateLunch = (personId: number, day: "day1" | "day2", lunch: FullMealSelection) => {
    setPersons(persons.map((p) => (p.id === personId ? { ...p, [day]: { ...p[day], lunch } } : p)))
  }

  const updateDinner = (personId: number, day: "day1" | "day2", dinner: FullMealSelection) => {
    setPersons(persons.map((p) => (p.id === personId ? { ...p, [day]: { ...p[day], dinner } } : p)))
  }

  const handleCancelClick = () => {
    setShowCancelConfirm(true)
  }

  const handleConfirmCancel = () => {
    if (existingOrder && onCancel) {
      const orderDate = getDateObject(existingOrder.startDate)

      onCancel(orderDate)
      setShowCancelConfirm(false)
      onClose()
      // Warning dialog will be shown by handleCancelOrder in parent component
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const orderStartDate = existingOrder ? getDateObject(existingOrder.startDate) : null
  if (orderStartDate) {
    orderStartDate.setHours(0, 0, 0, 0)
  }

  // Можно отменить заказ, если:
  // 1. Заказ существует
  // 2. Заказ еще не доставлен
  // 3. Дата доставки >= сегодня (включая сегодня)
  const canCancel = !!(
    existingOrder &&
    !existingOrder.delivered &&
    orderStartDate &&
    orderStartDate.getTime() >= today.getTime()
  )

  // Режим только просмотра для прошедших дат
  const selectedDateNormalized = new Date(date)
  selectedDateNormalized.setHours(0, 0, 0, 0)
  const isViewOnly = selectedDateNormalized < today

  const isPaidWithCard = existingOrder?.paid && existingOrder?.paymentMethod !== "cash"
  const canEdit = !isViewOnly && !isPaidWithCard
  const isExistingOrder = !!existingOrder
  const originalPaymentMethod = existingOrder?.paymentMethod || "card"

  const fillRandomMeals = (personId: number) => {
    const getRandom = <T,>(arr: T[]): T | null => {
      const available = (arr as any[]).filter((x) => x.available !== false)
      return available.length > 0 ? available[Math.floor(Math.random() * available.length)] : null
    }

    const createMeal = (d: Meal | null): Meal | null => {
      if (!d) return null
      const garnishes = menuData.garnish?.filter((g) => g.available !== false) || []
      const selectedGarnish = garnishes.length > 0 ? garnishes[Math.floor(Math.random() * garnishes.length)] : null

      const garnish: Garnish | null =
        d.needsGarnish && selectedGarnish
          ? {
              id: selectedGarnish.id,
              name: selectedGarnish.name,
              prices: selectedGarnish.prices,
              weights: selectedGarnish.weights,
              portion: "single" as PortionSize,
              image: selectedGarnish.image,
              ingredients: selectedGarnish.ingredients,
            }
          : null

      return {
        ...d,
        portion: "single" as PortionSize,
        garnish,
      }
    }

    setPersons((prevPersons) => {
      return prevPersons.map((p) => {
        if (p.id !== personId) return p

        const newDay1Meals: DayMeals = {
          breakfast: { dish: createMeal(getRandom(menuData.breakfast || [])) },
          lunch: {
            salad: null,
            soup: createMeal(getRandom(menuData.lunch_soup || [])),
            main: createMeal(getRandom(menuData.lunch_main || [])),
          },
          dinner: {
            salad: null,
            soup: null,
            main: createMeal(getRandom(menuData.dinner_main || [])),
          },
        }

        const newDay2Meals: DayMeals = {
          breakfast: { dish: createMeal(getRandom(menuData.breakfast || [])) },
          lunch: {
            salad: null,
            soup: createMeal(getRandom(menuData.lunch_soup || [])),
            main: createMeal(getRandom(menuData.lunch_main || [])),
          },
          dinner: {
            salad: null,
            soup: null,
            main: createMeal(getRandom(menuData.dinner_main || [])),
          },
        }

        return {
          ...p,
          day1: newDay1Meals,
          day2: newDay2Meals,
        }
      })
    })
    
    setFillTimestamp(Date.now())
  }

  const personHasMeals = (personId: number): boolean => {
    const person = persons.find((p) => p.id === personId)
    if (!person) return false

    return ["day1", "day2"].some((day) => {
      const d = person[day as "day1" | "day2"]
      if (!d) return false
      const breakfast = ensureBreakfastStructure(d.breakfast)
      const lunch = ensureFullMealStructure(d.lunch)
      const dinner = ensureFullMealStructure(d.dinner)
      return breakfast.dish || lunch.salad || lunch.soup || lunch.main || dinner.salad || dinner.soup || dinner.main
    })
  }

  const handleFillClick = (personId: number) => {
    // console.log("[v0] handleFillClick called", { personId, hasMeals: personHasMeals(personId) })
    if (personHasMeals(personId)) {
      setConfirmFillPersonId(personId)
    } else {
      fillRandomMeals(personId)
    }
  }

  const confirmFill = () => {
    // console.log("[v0] confirmFill called", { confirmFillPersonId })
    if (confirmFillPersonId !== null) {
      const idToFill = confirmFillPersonId
      // console.log("[v0] About to fill random meals for person", idToFill)
      setConfirmFillPersonId(null)
      fillRandomMeals(idToFill)
      // console.log("[v0] fillRandomMeals called")
    }
  }

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      showWarning(
        "Введите промокод",
        "Пожалуйста, введите промокод для применения скидки.",
        "error"
      )
      return
    }

    const code = promoCode.toUpperCase()
    let discount = 0

    if (code === "WELCOME10") {
      discount = 0.1
    } else if (code === "SALE20") {
      discount = 0.2
    } else if (code === "FREE100") {
      discount = 100
    }

    if (discount > 0) {
      const calculatedDiscount =
        typeof discount === "number" && discount < 1 ? Math.floor(totalBeforeDiscount * discount) : discount

      setAppliedPromo({ code: promoCode, discount: calculatedDiscount })
      // Removed promoError state

      showWarning(
        "Промокод применен!",
        discount < 1
          ? `Скидка ${discount * 100}% (${calculatedDiscount} ₽) применена к вашему заказу.`
          : `Скидка ${calculatedDiscount} ₽ применена к вашему заказу.`,
        "info"
      )
    } else {
      setAppliedPromo(null)
      // Removed promoError state
      showWarning(
        "Неверный промокод",
        "К сожалению, этот промокод не найден или истек.",
        "error"
      )
    }
  }

  // --- Next Step Logic ---
  const getNextSectionInfo = (): { id: string, name: string } | null => {
    // Logic to find next missing step, starting from activeSectionId (if any) or from beginning
    
    // Build sequence dynamically checking needsGarnish
    const sequence: { id: string, name: string, isComplete: () => boolean }[] = []
    
    persons.forEach(p => {
        const days = [1, 2]
        days.forEach(day => {
            const d = day === 1 ? p.day1 : p.day2
            if (!d) return

            const instance = `day${day}`
            const prefix = `section`
            
            // Helper to add
            const add = (type: string, name: string, instanceSuffix: string, check: () => boolean) => {
                sequence.push({
                    id: `section-${type}-${p.id}-${day}-daily-${instanceSuffix}`,
                    name: name,
                    isComplete: check
                })
            }
            
            // Breakfast
            add('breakfast', 'Завтрак', `${instance}-breakfast`, () => !!d.breakfast?.dish)
            
            // Lunch
            add('salad', 'Обед: Салат', `${instance}-lunch`, () => !!d.lunch?.salad)
            add('soup', 'Обед: Суп', `${instance}-lunch`, () => !!d.lunch?.soup)
            add('main', 'Обед: Горячее', `${instance}-lunch`, () => !!d.lunch?.main)
            
            if (d.lunch?.main?.needsGarnish) {
               add('garnish', 'Обед: Гарнир', `${instance}-lunch`, () => !!d.lunch?.main?.garnish)
            }
            
            // Dinner
            add('salad', 'Ужин: Салат', `${instance}-dinner`, () => !!d.dinner?.salad)
            add('soup', 'Ужин: Суп', `${instance}-dinner`, () => !!d.dinner?.soup)
            add('main', 'Ужин: Горячее', `${instance}-dinner`, () => !!d.dinner?.main)
            
            if (d.dinner?.main?.needsGarnish) {
               add('garnish', 'Ужин: Гарнир', `${instance}-dinner`, () => !!d.dinner?.main?.garnish)
            }
        })
    })
    
    if (activeSectionId) {
        // If section is open, Next is simply the next in sequence
        const currentIndex = sequence.findIndex(s => s.id === activeSectionId)
        if (currentIndex >= 0 && currentIndex < sequence.length - 1) {
            return sequence[currentIndex + 1]
        }
    } else {
        // If nothing open (auto-collapsed), find first incomplete
        const firstIncomplete = sequence.find(s => !s.isComplete())
        if (firstIncomplete) return firstIncomplete
    }
    
    return null
  }

  const nextStep = getNextSectionInfo()

  const scrollToCheckout = () => {
    const footer = footerRef.current
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }

  const handleMealSelected = () => {
      // Called when a meal is selected in MealSelector
      // We want to auto-advance to next section
      // If we are currently in activeSectionId, we find next and open it.
      // If activeSectionId is already null (race condition?), we use getNextSectionInfo fallback logic.
      
      // We need to re-calculate sequence because "needsGarnish" might have changed just now!
      // Fortunately getNextSectionInfo recalculates it.
      
      // Wait for state update? 
      // setPersons triggers re-render. onMealSelected is called after setPersons dispatch.
      // But state might not be updated in this closure yet?
      // Actually, onUpdate in MealSelector updates parent state.
      // Then MealSelector calls onMealSelected.
      // Since setState is async, 'persons' here might be old.
      // This is a problem for "needsGarnish" check if it depends on new Main.
      
      // However, if we just selected Main, 'persons' is old.
      // If we blindly go to next in sequence based on old data, we might miss Garnish or skip it.
      
      // Solution: Delay the advance slightly to allow state update?
      // Or rely on the fact that if we select Main, we usually stay on Main if needsGarnish (handled in MealSelector).
      // If !needsGarnish, we call onMealSelected.
      // So we assume we can proceed to Next.
      // The Next logic should work.
      
      // Just set timeout to let state settle?
      // No auto-advance to keep the scroll position stable
      // User can manually scroll or click next
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent 
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="max-w-2xl max-h-[95vh] overflow-hidden flex flex-col p-0 border-0 shadow-2xl"
          id="order-modal-content"
        >
          <div className="relative flex flex-col flex-1 overflow-hidden">
            <DialogHeader className="p-4 pb-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <DialogTitle className="text-2xl font-bold">
                    Заказ на {date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
                  </DialogTitle>
                  {existingOrder && !canEdit && (
                    <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      просмотр
                    </div>
                  )}
                  {existingOrder && isPaidWithCard && (
                    <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      оплачен
                    </div>
                  )}
                </div>
                <DialogDescription className="text-sm text-muted-foreground">Набор на 2 дня</DialogDescription>
              </div>
            </DialogHeader>

            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto"
              style={{ scrollBehavior: 'auto' }}
            >
              <div className="p-4 pb-20">
                {!isInDeliveryZone && userCity && (
                  <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-700 dark:text-red-400">Доставка недоступна</p>
                        <p className="text-sm text-red-600 dark:text-red-400/80">
                          К сожалению, мы доставляем только по Санкт-Петербургу. Измените адрес в профиле.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {isPaidWithCard && (
                  <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-400 font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Заказ оплачен
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400/80 mt-1">
                      Редактирование оплаченного заказа недоступно
                    </p>
                  </div>
                )}

                {persons.map((person, index) => {
                  const personLabel = persons.length > 1 ? ` • Персона ${index + 1}` : ""
                  const day1Prefix = `День 1${personLabel}`
                  const day2Prefix = `День 2${personLabel}`

                  return (
                  <div key={person.id} className="mb-6 pb-6 border-b border-border last:border-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Персона {index + 1}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        {canEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFillClick(person.id)}
                            className="h-8 text-xs bg-transparent"
                            title="Выбрать автоматически"
                          >
                            <Wand2 className="w-3 h-3 mr-2" />
                            Выбрать автоматически
                          </Button>
                        )}
                        {canEdit && persons.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removePerson(person.id)}
                            className="h-8 w-8"
                            title="Удалить персону"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* День 1 */}
                    <div className="mb-8">
                      <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground/90">
                        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                          1
                        </span>
                        День 1
                      </h4>
                      <div className="space-y-6 pl-0 md:pl-4">
                        <div>
                          <div className="flex items-center gap-2 mb-3 text-primary font-medium text-sm uppercase tracking-wide">
                            <Sunrise className="w-4 h-4" /> Завтрак
                          </div>
                        <MealSelector
                          key={`day1-breakfast-${person.id}-${fillTimestamp}`}
                          headerPrefix={day1Prefix}
                          personNumber={index + 1}
                          dayNumber={1}
                            mealsData={{ breakfast: menuData.breakfast }}
                            selectedMeals={{ breakfast: person.day1?.breakfast?.dish }}
                            onUpdate={(selection) =>
                              updateBreakfast(person.id, "day1", { dish: selection.breakfast || null })
                            }
                            activeSectionId={activeSectionId}
                            onSectionChange={setActiveSectionId}
                            instanceId="day1-breakfast"
                            onMealSelected={handleMealSelected}
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-3 text-primary font-medium text-sm uppercase tracking-wide">
                            <Sun className="w-4 h-4" /> Обед
                          </div>
                          <MealSelector
                            key={`day1-lunch-${person.id}-${fillTimestamp}`}
                            personNumber={index + 1}
                            dayNumber={1}
                            mealsData={{
                              salad: menuData.lunch_salad,
                              soup: menuData.lunch_soup,
                              main: menuData.lunch_main,
                              garnish: menuData.garnish,
                            }}
                            selectedMeals={{
                              salad: person.day1?.lunch?.salad,
                              soup: person.day1?.lunch?.soup,
                              main: person.day1?.lunch?.main,
                            }}
                            onUpdate={(selection) =>
                              updateLunch(person.id, "day1", {
                                salad: selection.salad || null,
                                soup: selection.soup || null,
                                main: selection.main || null,
                              })
                            }
                            headerPrefix={`${day1Prefix} • Обед`}
                            activeSectionId={activeSectionId}
                            onSectionChange={setActiveSectionId}
                            instanceId="day1-lunch"
                            onMealSelected={handleMealSelected}
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-3 text-primary font-medium text-sm uppercase tracking-wide">
                            <Moon className="w-4 h-4" /> Ужин
                          </div>
                          <MealSelector
                            key={`day1-dinner-${person.id}-${fillTimestamp}`}
                            personNumber={index + 1}
                            dayNumber={1}
                            mealsData={{
                              salad: menuData.dinner_salad,
                              soup: menuData.dinner_soup,
                              main: menuData.dinner_main,
                              garnish: menuData.garnish,
                            }}
                            selectedMeals={{
                              salad: person.day1?.dinner?.salad,
                              soup: person.day1?.dinner?.soup,
                              main: person.day1?.dinner?.main,
                            }}
                            onUpdate={(selection) =>
                              updateDinner(person.id, "day1", {
                                salad: selection.salad || null,
                                soup: selection.soup || null,
                                main: selection.main || null,
                              })
                            }
                            headerPrefix={`${day1Prefix} • Ужин`}
                            activeSectionId={activeSectionId}
                            onSectionChange={setActiveSectionId}
                            instanceId="day1-dinner"
                            onMealSelected={handleMealSelected}
                          />
                        </div>
                      </div>
                    </div>

                    {/* День 2 */}
                    <div>
                      <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground/90 mt-8 pt-8 border-t border-border/50">
                        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                          2
                        </span>
                        День 2
                      </h4>
                      <div className="space-y-6 pl-0 md:pl-4">
                        <div>
                          <div className="flex items-center gap-2 mb-3 text-primary font-medium text-sm uppercase tracking-wide">
                            <Sunrise className="w-4 h-4" /> Завтрак
                          </div>
                        <MealSelector
                          key={`day2-breakfast-${person.id}-${fillTimestamp}`}
                          headerPrefix={day2Prefix}
                          personNumber={index + 1}
                          dayNumber={2}
                            mealsData={{ breakfast: menuData.breakfast }}
                            selectedMeals={{ breakfast: person.day2?.breakfast?.dish }}
                            onUpdate={(selection) =>
                              updateBreakfast(person.id, "day2", { dish: selection.breakfast || null })
                            }
                            activeSectionId={activeSectionId}
                            onSectionChange={setActiveSectionId}
                            instanceId="day2-breakfast"
                            onMealSelected={handleMealSelected}
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-3 text-primary font-medium text-sm uppercase tracking-wide">
                            <Sun className="w-4 h-4" /> Обед
                          </div>
                          <MealSelector
                            key={`day2-lunch-${person.id}-${fillTimestamp}`}
                            personNumber={index + 1}
                            dayNumber={2}
                            mealsData={{
                              salad: menuData.lunch_salad,
                              soup: menuData.lunch_soup,
                              main: menuData.lunch_main,
                              garnish: menuData.garnish,
                            }}
                            selectedMeals={{
                              salad: person.day2?.lunch?.salad,
                              soup: person.day2?.lunch?.soup,
                              main: person.day2?.lunch?.main,
                            }}
                            onUpdate={(selection) =>
                              updateLunch(person.id, "day2", {
                                salad: selection.salad || null,
                                soup: selection.soup || null,
                                main: selection.main || null,
                              })
                            }
                            headerPrefix={`${day2Prefix} • Обед`}
                            activeSectionId={activeSectionId}
                            onSectionChange={setActiveSectionId}
                            instanceId="day2-lunch"
                            onMealSelected={handleMealSelected}
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-3 text-primary font-medium text-sm uppercase tracking-wide">
                            <Moon className="w-4 h-4" /> Ужин
                          </div>
                          <MealSelector
                            key={`day2-dinner-${person.id}-${fillTimestamp}`}
                            personNumber={index + 1}
                            dayNumber={2}
                            mealsData={{
                              salad: menuData.dinner_salad,
                              soup: menuData.dinner_soup,
                              main: menuData.dinner_main,
                              garnish: menuData.garnish,
                            }}
                            selectedMeals={{
                              salad: person.day2?.dinner?.salad,
                              soup: person.day2?.dinner?.soup,
                              main: person.day2?.dinner?.main,
                            }}
                            onUpdate={(selection) =>
                              updateDinner(person.id, "day2", {
                                salad: selection.salad || null,
                                soup: selection.soup || null,
                                main: selection.main || null,
                              })
                            }
                            headerPrefix={`${day2Prefix} • Ужин`}
                            activeSectionId={activeSectionId}
                            onSectionChange={setActiveSectionId}
                            instanceId="day2-dinner"
                            onMealSelected={handleMealSelected}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  )
                })}

                {canEdit && (
                  <Button variant="outline" onClick={addPerson} className="w-full mb-6 bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить персону
                  </Button>
                )}

                <ExtrasSelector
                  extras={extras}
                  availableExtras={availableExtras}
                  onUpdate={setExtras}
                  disabled={!canEdit}
                />

                {/* Время доставки - только для авторизованных пользователей */}
                {isAuthenticated && deliveryTimes.length > 0 && (
                  <div className="mt-6 mb-6 p-4 bg-white rounded-lg border-2 border-black shadow-brutal">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-brutal">
                        <Clock className="w-5 h-5 text-[#9D00FF] stroke-[2.5px]" />
                      </div>
                      <h3 className="font-black text-black">Время доставки</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                      {deliveryTimes.map((time) => (
                        <button
                          key={time}
                          onClick={() => canEdit && setDeliveryTime(time)}
                          disabled={!canEdit}
                          className={`py-2 px-1 rounded-lg text-[13px] font-black transition-all whitespace-nowrap border-2 border-black shadow-brutal ${
                            deliveryTime === time
                              ? "bg-[#9D00FF] text-white"
                              : "bg-white text-black hover:bg-[#FFEA00]"
                          } ${!canEdit ? "cursor-not-allowed opacity-50" : ""}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Секция оформления - только если можно редактировать */}
                {canEdit && hasContent && (
                  <div className="mt-6 border-t border-border pt-6">
                    {isAuthenticated ? (
                      <>
                        {/* Промокод */}
                        <div
                          className="flex items-center justify-between py-3 px-4 bg-white border-2 border-black rounded-lg cursor-pointer hover:bg-[#FFEA00] transition-colors shadow-brutal mb-2"
                          onClick={() => setActiveSectionId(activeSectionId === "promo" ? null : "promo")}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-brutal">
                              <Tag className="w-4 h-4 text-[#9D00FF] stroke-[2.5px]" />
                            </div>
                            <div>
                              <p className="font-black text-black">Промокод</p>
                              {appliedPromo ? (
                                <p className="text-sm text-[#9D00FF] font-medium">Скидка {appliedPromo.discount} ₽ применена</p>
                              ) : (
                                <p className="text-sm text-black/70 font-medium">Введите промокод</p>
                              )}
                            </div>
                          </div>
                          {activeSectionId === "promo" ? (
                            <ChevronDown className="w-5 h-5 text-black stroke-[2.5px]" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-black stroke-[2.5px]" />
                          )}
                        </div>

                        {activeSectionId === "promo" && (
                          <div className="py-3 px-4 bg-white border-2 border-black rounded-lg shadow-brutal mb-2 animate-in slide-in-from-top-2 fade-in duration-200">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                placeholder="Введите промокод"
                                className="flex-1 px-3 py-2 border-2 border-black rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black font-medium"
                              />
                              <Button 
                                onClick={handleApplyPromo} 
                                size="sm"
                                className="bg-[#9D00FF] text-white border-2 border-black hover:bg-[#B033FF] shadow-brutal font-black"
                              >
                                Применить
                              </Button>
                            </div>
                            {appliedPromo && (
                              <div className="mt-2 text-xs">
                                <button 
                                  onClick={() => setAppliedPromo(null)} 
                                  className="text-[#9D00FF] hover:underline font-medium"
                                >
                                  Удалить промокод
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {userLoyaltyPoints > 0 && (
                          <div className="py-3 px-4 bg-white border-2 border-black rounded-lg shadow-brutal mb-2">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-brutal">
                                  <span className="text-[#9D00FF] text-xs font-black">₽</span>
                                </div>
                                <div>
                                  <p className="font-black text-black">Баллы лояльности</p>
                                  <p className="text-sm text-black/70 font-medium">
                                    Доступно {userLoyaltyPoints} баллов (макс. {maxPointsDiscount} ₽)
                                  </p>
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={useLoyaltyPoints}
                                  onChange={(e) => {
                                    setUseLoyaltyPoints(e.target.checked)
                                    if (!e.target.checked) {
                                      setLoyaltyPointsToUse(0)
                                    }
                                  }}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-white border-2 border-black rounded-full peer peer-checked:bg-[#9D00FF] transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-black after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full peer-checked:after:bg-white shadow-brutal"></div>
                              </label>
                            </div>

                            {useLoyaltyPoints && (
                              <div className="flex gap-2 mt-3">
                                <div className="flex-1 relative">
                                  <input
                                    type="number"
                                    value={loyaltyPointsToUse}
                                    onChange={(e) => {
                                      const value = Number.parseInt(e.target.value) || 0
                                      const clampedValue = Math.min(Math.max(0, value), maxPointsDiscount)
                                      setLoyaltyPointsToUse(clampedValue)
                                    }}
                                    placeholder="Сколько списать"
                                    min={0}
                                    max={maxPointsDiscount}
                                    className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black font-medium"
                                  />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-black/70 font-medium">
                                    ₽
                                  </span>
                                </div>
                                <Button
                                  onClick={applyAllPoints}
                                  size="sm"
                                  className="bg-white border-2 border-black hover:bg-[#FFEA00] whitespace-nowrap shadow-brutal font-black text-black"
                                >
                                  Списать все
                                </Button>
                              </div>
                            )}

                            {pointsDiscount > 0 && (
                              <p className="text-sm text-[#9D00FF] mt-2 font-medium">
                                Будет списано: {pointsDiscount} баллов (-{pointsDiscount} ₽)
                              </p>
                            )}
                          </div>
                        )}

                        {/* Способ оплаты */}
                        <div className="py-4">
                          <p className="font-black mb-3 text-black">Способ оплаты</p>
                          <div className="space-y-2">
                            <button
                              onClick={() => setPaymentMethod("card")}
                              className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 border-black transition-colors shadow-brutal ${
                                paymentMethod === "card" ? "bg-[#9D00FF] text-white" : "bg-white text-black hover:bg-[#FFEA00]"
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg border-2 border-black flex items-center justify-center shadow-brutal ${
                                paymentMethod === "card" ? "bg-white" : "bg-white"
                              }`}>
                                <CreditCard
                                  className={`w-4 h-4 ${paymentMethod === "card" ? "text-[#9D00FF]" : "text-black"} stroke-[2.5px]`}
                                />
                              </div>
                              <span className="flex-1 text-left font-black">Банковская карта</span>
                              <div className="flex items-center gap-2">
                                {isExistingOrder && originalPaymentMethod === "card" && (
                                  <span className="px-2 py-0.5 rounded-full text-xs font-black bg-black text-white border border-black">
                                    ТЕКУЩИЙ
                                  </span>
                                )}
                                {paymentMethod === "card" && (
                                  <div className="w-6 h-6 rounded-lg bg-white border-2 border-black flex items-center justify-center shadow-brutal">
                                    <CheckCircle2 className="w-4 h-4 text-[#9D00FF] stroke-[2.5px]" />
                                  </div>
                                )}
                              </div>
                            </button>

                            <button
                              onClick={() => setPaymentMethod("sbp")}
                              className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 border-black transition-colors shadow-brutal ${
                                paymentMethod === "sbp" ? "bg-[#9D00FF] text-white" : "bg-white text-black hover:bg-[#FFEA00]"
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg border-2 border-black flex items-center justify-center shadow-brutal ${
                                paymentMethod === "sbp" ? "bg-white" : "bg-white"
                              }`}>
                                <Smartphone
                                  className={`w-4 h-4 ${paymentMethod === "sbp" ? "text-[#9D00FF]" : "text-black"} stroke-[2.5px]`}
                                />
                              </div>
                              <span className="flex-1 text-left font-black">СБП (Быстрее)</span>
                              <div className="flex items-center gap-2">
                                {isExistingOrder && originalPaymentMethod === "sbp" && (
                                  <span className="px-2 py-0.5 rounded-full text-xs font-black bg-black text-white border border-black">
                                    ТЕКУЩИЙ
                                  </span>
                                )}
                                {paymentMethod === "sbp" && (
                                  <div className="w-6 h-6 rounded-lg bg-white border-2 border-black flex items-center justify-center shadow-brutal">
                                    <CheckCircle2 className="w-4 h-4 text-[#9D00FF] stroke-[2.5px]" />
                                  </div>
                                )}
                              </div>
                            </button>

                            <button
                              onClick={() => setPaymentMethod("cash")}
                              className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 border-black transition-colors shadow-brutal ${
                                paymentMethod === "cash" ? "bg-[#9D00FF] text-white" : "bg-white text-black hover:bg-[#FFEA00]"
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg border-2 border-black flex items-center justify-center shadow-brutal ${
                                paymentMethod === "cash" ? "bg-white" : "bg-white"
                              }`}>
                                <Banknote
                                  className={`w-4 h-4 ${paymentMethod === "cash" ? "text-[#9D00FF]" : "text-black"} stroke-[2.5px]`}
                                />
                              </div>
                              <span className="flex-1 text-left font-black">Наличными курьеру</span>
                              <div className="flex items-center gap-2">
                                {isExistingOrder && originalPaymentMethod === "cash" && (
                                  <span className="px-2 py-0.5 rounded-full text-xs font-black bg-black text-white border border-black">
                                    ТЕКУЩИЙ
                                  </span>
                                )}
                                {paymentMethod === "cash" && (
                                  <div className="w-6 h-6 rounded-lg bg-white border-2 border-black flex items-center justify-center shadow-brutal">
                                    <CheckCircle2 className="w-4 h-4 text-[#9D00FF] stroke-[2.5px]" />
                                  </div>
                                )}
                              </div>
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 mb-6">
                        <p className="text-sm text-center text-muted-foreground">
                          Войдите в профиль, чтобы применить скидки и выбрать способ оплаты
                        </p>
                      </div>
                    )}

                    {/* Финальная кнопка заказа */}
                    <div ref={footerRef} className="pt-2 pb-12">
                      {!isAuthenticated ? (
                        <Button
                          onClick={() => onRequestAuth?.()}
                          disabled={!hasContent}
                          className="w-full h-16 text-lg bg-[#ff4d6d] hover:bg-[#e8445f] rounded-2xl flex items-center justify-center shadow-lg shadow-[#ff4d6d]/20 active:scale-[0.98] transition-transform relative overflow-hidden group"
                        >
                          <span className="font-bold text-white flex items-center gap-2">
                            Заказать · {finalTotal} ₽
                          </span>
                        </Button>
                      ) : !isInDeliveryZone && userCity ? (
                        <Button disabled className="w-full h-16 text-base rounded-2xl">
                          <MapPin className="w-4 h-4 mr-2" />
                          Доставка недоступна
                        </Button>
                      ) : (
                        (() => {
                          // Определяем текст и стиль кнопки в зависимости от контекста
                          const isPaymentAction = isExistingOrder && (paymentMethod === "card" || paymentMethod === "sbp")
                          const isSaveAction = isExistingOrder && paymentMethod === "cash" && paymentMethod === originalPaymentMethod
                          const isNewOrder = !isExistingOrder
                          
                          let buttonText = "Заказать"
                          let buttonClass = "w-full h-16 text-lg bg-[#ff4d6d] hover:bg-[#e8445f] rounded-2xl shadow-lg shadow-[#ff4d6d]/20 active:scale-[0.98] transition-transform"
                          let textClass = "font-bold text-white"
                          
                          if (isPaymentAction) {
                            buttonText = `ОПЛАТИТЬ — ${finalTotal} ₽`
                            buttonClass = "w-full h-16 text-lg bg-[#FFEA00] hover:bg-[#FFF033] border-2 border-black rounded-2xl shadow-brutal active:scale-[0.98] transition-transform"
                            textClass = "font-black text-black"
                          } else if (isSaveAction) {
                            buttonText = "СОХРАНИТЬ"
                            buttonClass = "w-full h-16 text-lg bg-white hover:bg-gray-50 border-2 border-black rounded-2xl shadow-brutal active:scale-[0.98] transition-transform"
                            textClass = "font-black text-black"
                          } else if (isNewOrder) {
                            buttonText = `Заказать · ${finalTotal} ₽`
                            buttonClass = "w-full h-16 text-lg bg-[#ff4d6d] hover:bg-[#e8445f] rounded-2xl shadow-lg shadow-[#ff4d6d]/20 active:scale-[0.98] transition-transform"
                            textClass = "font-bold text-white"
                          }
                          
                          return (
                            <Button
                              onClick={handlePayAndOrder}
                              disabled={!hasContent || isProcessingPayment}
                              className={buttonClass}
                            >
                              {isProcessingPayment ? (
                                <div className="flex items-center gap-2">
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                  <span>Оформляем...</span>
                                </div>
                              ) : (
                                <span className={textClass}>
                                  {buttonText}
                                </span>
                              )}
                            </Button>
                          )
                        })()
                      )}

                      {canCancel && existingOrder && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelClick}
                          className="w-full mt-4 bg-transparent text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          Отменить заказ
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Кнопка отмены для оплаченных заказов - вне блока canEdit */}
                {!canEdit && canCancel && existingOrder && (
                  <div className="mt-6 border-t border-border pt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelClick}
                      className="w-full bg-transparent text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      Отменить заказ
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Плавающая кнопка (Стиль Самоката) */}
            <AnimatePresence>
              {showFloatingButton && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 20 }}
                  className="absolute bottom-8 right-8 z-[100] pointer-events-auto"
                >
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      scrollToCheckout()
                    }}
                    className="h-14 pl-6 pr-2 rounded-xl shadow-brutal bg-[#FFEA00] hover:bg-[#FFF033] text-black border-2 border-black flex items-center gap-4 group transition-all duration-200 brutal-hover font-bold"
                  >
                    <span className="text-xl font-black tracking-tight">{finalTotal} ₽</span>
                    <div className="w-10 h-10 rounded-lg bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-colors border border-black/20">
                      <CheckCircle2 className="w-6 h-6 stroke-[3px] text-black" />
                    </div>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmFillPersonId !== null} onOpenChange={(open) => !open && setConfirmFillPersonId(null)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Заполнить заново?</AlertDialogTitle>
            <AlertDialogDescription>
              У этого человека уже выбраны блюда. Вы уверены, что хотите заполнит меню случайными блюдами? Текущий
              выбор будет заменен.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmFill}>Да, заполнить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Отменить заказ?</AlertDialogTitle>
            <AlertDialogDescription>
              {isPaidWithCard
                ? "Вы уверены, что хотите отменить заказ? Деньги вернутся на карту в течение 3 рабочих дней."
                : "Вы уверены, что хотите отменить заказ?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Нет, оставить</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Да, отменить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <WarningDialog
        open={warningDialog.open}
        onClose={closeWarning}
        title={warningDialog.title}
        description={warningDialog.description}
        variant={warningDialog.variant}
      />
    </>
  )
}
