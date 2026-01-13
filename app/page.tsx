"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Calendar } from "@/components/calendar"
import { OrderModal } from "@/components/order-modal"
import { OrderHistory } from "@/components/order-history"
import { AuthModal } from "@/components/auth-modal"
import { AppMenu } from "@/components/app-menu"
import { ProfileModal } from "@/components/profile-modal"
import { PaymentModal } from "@/components/payment-modal"
import { ReviewModal } from "@/components/review-modal"
import { WarningDialog } from "@/components/warning-dialog"
import { Preloader } from "@/components/preloader"
import { DailyStatus } from "@/components/daily-status"
import { FreshSection } from "@/components/fresh-section"
import { DishSmartModal } from "@/components/dish-smart-modal"
import { OrderLoadingDialog } from "@/components/order-loading-dialog"
import { PaymentLoading } from "@/components/payment-loading"
import { CashPaymentAnimation } from "@/components/cash-payment-animation"
import { SuccessOrderDialog } from "@/components/success-order-dialog"
import { CancelOrderLoading } from "@/components/cancel-order-loading"
import { DistrictSelectionModal } from "@/components/district-selection-modal"
import { InfoBanner } from "@/components/info-banner"
import { Button } from "@/components/ui/button"
import { CalendarIcon, History, LogOut, User, Zap, LogIn } from "lucide-react"
import { isMealAvailable, isExtraAvailable } from "@/lib/meals-data"
import type { Order, Person, DayMeals, Extra, UserProfile, Review } from "@/lib/types"
import { getAvailableDatesForOrdering, canOrderForDate, getWeekTypeForDate } from "@/lib/menu-utils"
import { getDay, addDays } from "date-fns"
import { UserProfileHeaderSkeleton, OrderHistorySkeleton } from "@/components/loading-skeletons"
import { DebugProvider } from "@/components/debug/DebugContext"
import { DebugFloatingButton } from "@/components/debug/DebugFloatingButton"
import { useDebug } from "@/components/debug/DebugContext"
import { ErrorBoundary } from "@/components/debug/ErrorBoundary"
import { checkLoyaltyPointsAwarded, checkOrderTotal, checkOrderData, checkProfileUpdate, checkAuthState } from "@/lib/debug-auto-checks"

const formatDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
}

const parseDateKey = (dateKey: string): Date => {
  const [year, month, day] = dateKey.split("-").map(Number)
  return new Date(year, month - 1, day)
}

const toDate = (value: Date | string): Date => {
  if (value instanceof Date) return value
  if (typeof value === "string") {
    if (value.includes("T")) return new Date(value)
    if (value.includes("-")) return parseDateKey(value)
  }
  return new Date(value)
}

const getDateTimestamp = (value: Date | string): number => {
  return toDate(value).getTime()
}

const serializeOrders = (orders: Order[]): string => {
  return JSON.stringify(
    orders.map((o) => ({
      ...o,
      startDate: formatDateKey(toDate(o.startDate)),
    })),
  )
}

const deserializeOrders = (json: string): Order[] => {
  try {
    const parsed = JSON.parse(json)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // ✅ Для гостей: храним заказы за последние 30 дней (более разумный срок)
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    return parsed
      .map((o: any) => ({
        ...o,
        startDate: toDate(o.startDate),
        paid: o.paid ?? false,
      }))
      .filter((o: Order) => {
        const orderDate = toDate(o.startDate)
        // Оставляем только заказы за последние 30 дней или будущие
        return orderDate >= thirtyDaysAgo
      })
  } catch {
    return []
  }
}

// Используем функцию из menu-utils.ts для получения доступных дат
const getAvailableDates = (): Date[] => {
  return getAvailableDatesForOrdering().map((item) => item.date)
}

const filterAvailableItems = (order: Order): Order => {
  const filteredPersons: Person[] = order.persons.map((person) => {
    const filterDayMeals = (meals: DayMeals): DayMeals => {
      return {
        breakfast: {
          dish: meals.breakfast?.dish && isMealAvailable(meals.breakfast.dish.name) ? meals.breakfast.dish : null,
        },
        lunch: {
          salad: meals.lunch?.salad && isMealAvailable(meals.lunch.salad.name) ? meals.lunch.salad : null,
          soup: meals.lunch?.soup && isMealAvailable(meals.lunch.soup.name) ? meals.lunch.soup : null,
          main: meals.lunch?.main && isMealAvailable(meals.lunch.main.name) ? meals.lunch.main : null,
        },
        dinner: {
          salad: meals.dinner?.salad && isMealAvailable(meals.dinner.salad.name) ? meals.dinner.salad : null,
          soup: meals.dinner?.soup && isMealAvailable(meals.dinner.soup.name) ? meals.dinner.soup : null,
          main: meals.dinner?.main && isMealAvailable(meals.dinner.main.name) ? meals.dinner.main : null,
        },
      }
    }

    return {
      ...person,
      day1: filterDayMeals(person.day1),
      day2: filterDayMeals(person.day2),
    }
  })

  const filteredExtras: Extra[] = (order.extras || []).filter((extra) => isExtraAvailable(extra.name))

  return {
    ...order,
    persons: filteredPersons,
    extras: filteredExtras,
  }
}

const calculateOrderTotal = (order: Order): number => {
  let total = 0
  order.persons.forEach((person) => {
    ;["day1", "day2"].forEach((day) => {
      const dayMeals = person[day as "day1" | "day2"]

      if (dayMeals.breakfast?.dish) {
        const dish = dayMeals.breakfast.dish
        total += dish.price * (dish.portion || 1)
        if (dish.garnish) {
          total += dish.garnish.price * (dish.garnish.portion || 1)
        }
      }

      if (dayMeals.lunch) {
        if (dayMeals.lunch.salad) {
          total += dayMeals.lunch.salad.price * (dayMeals.lunch.salad.portion || 1)
        }
        if (dayMeals.lunch.soup) {
          total += dayMeals.lunch.soup.price * (dayMeals.lunch.soup.portion || 1)
        }
        if (dayMeals.lunch.main) {
          const main = dayMeals.lunch.main
          total += main.price * (main.portion || 1)
          if (main.garnish) {
            total += main.garnish.price * (main.garnish.portion || 1)
          }
        }
      }

      if (dayMeals.dinner) {
        if (dayMeals.dinner.salad) {
          total += dayMeals.dinner.salad.price * (dayMeals.dinner.salad.portion || 1)
        }
        if (dayMeals.dinner.soup) {
          total += dayMeals.dinner.soup.price * (dayMeals.dinner.soup.portion || 1)
        }
        if (dayMeals.dinner.main) {
          const main = dayMeals.dinner.main
          total += main.price * (main.portion || 1)
          if (main.garnish) {
            total += main.garnish.price * (main.garnish.portion || 1)
          }
        }
      }
    })
  })
  order.extras?.forEach((extra) => {
    total += extra.price * extra.quantity
  })
  return total
}

const calculateOrderTotalForHistory = (order: Order): number => {
  let total = 0
  order.persons.forEach((person) => {
    ;["day1", "day2"].forEach((day) => {
      const dayMeals = person[day as "day1" | "day2"]

      if (dayMeals.breakfast?.dish) {
        const dish = dayMeals.breakfast.dish
        total += dish.price * (dish.portion || 1)
        if (dish.garnish) {
          total += dish.garnish.price * (dish.garnish.portion || 1)
        }
      }

      if (dayMeals.lunch) {
        if (dayMeals.lunch.salad) {
          total += dayMeals.lunch.salad.price * (dayMeals.lunch.salad.portion || 1)
        }
        if (dayMeals.lunch.soup) {
          total += dayMeals.lunch.soup.price * (dayMeals.lunch.soup.portion || 1)
        }
        if (dayMeals.lunch.main) {
          const main = dayMeals.lunch.main
          total += main.price * (main.portion || 1)
          if (main.garnish) {
            total += main.garnish.price * (main.garnish.portion || 1)
          }
        }
      }

      if (dayMeals.dinner) {
        if (dayMeals.dinner.salad) {
          total += dayMeals.dinner.salad.price * (dayMeals.dinner.salad.portion || 1)
        }
        if (dayMeals.dinner.soup) {
          total += dayMeals.dinner.soup.price * (dayMeals.dinner.soup.portion || 1)
        }
        if (dayMeals.dinner.main) {
          const main = dayMeals.dinner.main
          total += main.price * (main.portion || 1)
          if (main.garnish) {
            total += main.garnish.price * (main.garnish.portion || 1)
          }
        }
      }
    })
  })
  order.extras?.forEach((extra) => {
    total += extra.price * extra.quantity
  })
  return total
}

export default function Home() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  
  return (
    <DebugProvider userId={userProfile?.id?.toString()} userEmail={userProfile?.email}>
      <ErrorBoundary>
        <HomeWithDebug 
          userProfile={userProfile}
          setUserProfile={setUserProfile}
        />
      </ErrorBoundary>
    </DebugProvider>
  )
}

interface HomeWithDebugProps {
  userProfile: UserProfile | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

function HomeWithDebug({ userProfile: initialUserProfile, setUserProfile: setParentUserProfile }: HomeWithDebugProps) {
  const debug = useDebug() // ✅ Теперь можем использовать!
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [draftOrder, setDraftOrder] = useState<Order | null>(null) // ✅ Черновик для повторения заказа
  const [view, setView] = useState<"calendar" | "history">("calendar")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [showProfile, setShowProfile] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(initialUserProfile)
  
  // Синхронизируем userProfile с родительским компонентом
  useEffect(() => {
    setParentUserProfile(userProfile)
  }, [userProfile, setParentUserProfile])
  
  useEffect(() => {
    setUserProfile(initialUserProfile)
  }, [initialUserProfile])
  
  // ✅ НЕ ИНИЦИАЛИЗИРУЕМ Debug здесь - будем получать из Provider
  // const debug = useDebug() - нельзя использовать выше DebugProvider!
  const [paymentOrder, setPaymentOrder] = useState<{ order: Order; total: number; isNewOrder?: boolean } | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showDistrictModal, setShowDistrictModal] = useState(false)
  const [pendingCheckout, setPendingCheckout] = useState<{ order: Order; total: number } | null>(null)
  const [shouldAutoCheckout, setShouldAutoCheckout] = useState(false)
  const [selectedDish, setSelectedDish] = useState<{
    dish: { name: string; image: string; price: number; description?: string }
    availableDate: Date
  } | null>(null)
  
  // ✅ SAFE DATA LOADING: Loading states для защиты от race condition
  const [isUserLoading, setIsUserLoading] = useState(false)
  const [isOrdersLoading, setIsOrdersLoading] = useState(false)
  const [isPointsLoading, setIsPointsLoading] = useState(false)
  
  // Animation states
  const [showOrderLoading, setShowOrderLoading] = useState(false)
  const [showPaymentLoading, setShowPaymentLoading] = useState(false)
  const [showCashPaymentAnimation, setShowCashPaymentAnimation] = useState(false)
  const [showCancelLoading, setShowCancelLoading] = useState(false)
  const [successDialog, setSuccessDialog] = useState<{
    open: boolean
    loyaltyPointsEarned?: number
    loyaltyPointsUsed?: number
    loyaltyPointsStatus?: "pending" | "earned"
    loyaltyPointsMessage?: string
  }>({
    open: false,
    loyaltyPointsEarned: 0,
    loyaltyPointsUsed: 0,
    loyaltyPointsStatus: undefined,
    loyaltyPointsMessage: undefined,
  })
  
  // Warning dialog state
  const [warningDialog, setWarningDialog] = useState<{
    open: boolean
    title: string
    description: string
    variant?: "warning" | "error" | "info"
    onConfirm?: () => void
  }>({
    open: false,
    title: "",
    description: "",
    variant: "warning",
  })
  
  const showWarning = (title: string, description: string, variant: "warning" | "error" | "info" = "warning", onConfirm?: () => void) => {
    setWarningDialog({
      open: true,
      title,
      description,
      variant,
      onConfirm,
    })
  }
  
  const closeWarning = () => {
    setWarningDialog((prev) => {
      if (prev.onConfirm) {
        prev.onConfirm()
      }
      return { ...prev, open: false }
    })
  }

  // ✅ ДОБАВЛЕНО 10.01.2026: Диалог подтверждения отмены заказа при закрытии PaymentModal
  const [cancelPaymentDialog, setCancelPaymentDialog] = useState<{
    open: boolean
    orderId: number | null
  }>({
    open: false,
    orderId: null,
  })

  // ✅ Состояния для новой логики оформления заказа
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)
  const [showInfoBanner, setShowInfoBanner] = useState(true)

  // ✅ ИЗМЕНЕНО 10.01.2026: Убираем автоматическое открытие модалки района для гостей
  // Теперь гости выбирают район в процессе оформления заказа
  // Оставляем только проверку для загрузки сохраненного района из localStorage
  useEffect(() => {
    const isAuth = localStorage.getItem("currentUser")
    const guestDistrict = localStorage.getItem("guest_district")
    
    if (!isAuth && guestDistrict) {
      console.log("📍 Загружен сохранённый район гостя:", guestDistrict)
      setSelectedDistrict(guestDistrict)
    }
  }, [])

  // Проверка заполненности профиля после авторизации
  useEffect(() => {
    console.log("🔍 [useEffect] Проверка профиля сработала:", {
      isAuthenticated,
      hasUserProfile: !!userProfile,
      shouldAutoCheckout,
      hasPendingCheckout: !!pendingCheckout,
      userName: userProfile?.name,
      userStreet: userProfile?.street,
      userBuilding: userProfile?.building,
      userDistrict: userProfile?.district,
    })
    
    console.log("🔍 [useEffect] ДЕТАЛЬНЫЕ ЗНАЧЕНИЯ:", {
      "isAuthenticated (ожидается true)": isAuthenticated,
      "userProfile (ожидается объект)": userProfile,
      "shouldAutoCheckout (ожидается true)": shouldAutoCheckout,
      "pendingCheckout (ожидается объект)": pendingCheckout,
    })
    
    if (!isAuthenticated) {
      console.log("❌ isAuthenticated = false")
    }
    if (!userProfile) {
      console.log("❌ userProfile = null")
    }
    if (!shouldAutoCheckout) {
      console.log("❌ shouldAutoCheckout = false ← ПРОБЛЕМА ЗДЕСЬ!")
    }
    if (!pendingCheckout) {
      console.log("❌ pendingCheckout = null")
    }
    
    if (isAuthenticated && userProfile && shouldAutoCheckout && pendingCheckout) {
      console.log("✅ ВСЕ УСЛОВИЯ ВЫПОЛНЕНЫ! Проверяем профиль...")
      console.log("🔍 Проверяем заполненность профиля после авторизации:", {
        name: userProfile.name,
        street: userProfile.street,
        building: userProfile.building,
        district: userProfile.district,
      })
      
      const isProfileComplete = userProfile.name && userProfile.street && userProfile.building
      
      if (!isProfileComplete) {
        console.log("⚠️ Профиль не заполнен, открываем ProfileModal")
        setShowProfile(true)
      } else {
        console.log("✅ Профиль заполнен, запускаем автооформление")
        handleAutoCheckout()
      }
    } else {
      console.log("⚠️ [useEffect] Условия не выполнены, ProfileModal не открывается")
    }
  }, [isAuthenticated, userProfile, shouldAutoCheckout, pendingCheckout])

  useEffect(() => {
    // ✅ НОВОЕ: Проверяем URL параметр для очистки localStorage
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('clear') === '1') {
      console.log('🧹 Очистка localStorage по URL параметру...')
      localStorage.clear()
      // Убираем параметр из URL и перезагружаем
      window.history.replaceState({}, '', window.location.pathname)
      window.location.reload()
      return
    }
    
    const user = localStorage.getItem("currentUser")
    console.log('🚀 useEffect mount: currentUser =', user)
    
    if (user) {
      setIsAuthenticated(true)
      setCurrentUser(user)
      
      // 🔒 SAFE DATA LOADING: Включаем все лоадеры для авторизованных пользователей
      setIsUserLoading(true)
      setIsOrdersLoading(true)
      setIsPointsLoading(true)
      
      // ✅ КРИТИЧНО: Очищаем ВСЕ кэшированные данные для авторизованного пользователя
      // Правило: "Единственный источник правды - NocoDB"
      const oldOrdersKey = `orders_${user}`
      const oldProfileKey = `profile_${user}`
      
      console.log('🧹 Очистка кэшированных данных для авторизованного пользователя')
      localStorage.removeItem(oldOrdersKey) // Удаляем старые заказы
      // Не удаляем профиль полностью, но будем игнорировать баллы из него
      
      const savedProfile = localStorage.getItem(oldProfileKey)
      let tempProfile = null
      
      if (savedProfile) {
        tempProfile = JSON.parse(savedProfile)
        // ⚠️ Временно устанавливаем профиль БЕЗ баллов (они загрузятся из API)
        setUserProfile({ ...tempProfile, loyaltyPoints: 0, totalSpent: 0 })
        console.log('⏳ Профиль загружен локально (без баллов), ожидаем API...')
      }
      
      // 📡 ГЛАВНАЯ ЗАГРУЗКА: Только API, никакого localStorage!
      if (tempProfile?.id) {
        console.log('📡 Загрузка ВСЕХ данных из API для userId:', tempProfile.id)
        
        fetch(`/api/orders?userId=${tempProfile.id}`)
          .then(res => {
            console.log('📥 Ответ API:', res.status)
            if (!res.ok) throw new Error(`API error: ${res.status}`)
            return res.json()
          })
          .then(data => {
            console.log('📦 Данные из API получены:', {
              заказов: data.orders?.length || 0,
              баллы: data.userProfile?.loyaltyPoints,
              потрачено: data.userProfile?.totalSpent
            })
            
            // ✅ Обновляем профиль с актуальными данными из БД
            if (data.userProfile) {
              const updatedProfile = {
                ...tempProfile,
                loyaltyPoints: data.userProfile.loyaltyPoints ?? 0,
                totalSpent: data.userProfile.totalSpent ?? 0,
              }
              setUserProfile(updatedProfile)
              localStorage.setItem(oldProfileKey, JSON.stringify(updatedProfile))
              console.log('✅ Профиль синхронизирован с БД:', {
                id: updatedProfile.id,
                name: updatedProfile.name,
                loyaltyPoints: updatedProfile.loyaltyPoints,
                totalSpent: updatedProfile.totalSpent,
                district: updatedProfile.district,
              })
            }
            
            // ✅ Загружаем заказы из API
            if (data.orders && Array.isArray(data.orders)) {
              const mappedOrders: Order[] = data.orders
                .filter((db: any) => {
                  const status = db.orderStatus || db.order_status || db["Order Status"]
                  return status !== 'cancelled'
                })
                .map((db: any) => ({
                  id: db.id ?? db.Id,
                  orderNumber: db.orderNumber ?? db.order_number ?? db["Order Number"],
                  startDate: toDate(db.startDate ?? db.start_date ?? db["Start Date"]),
                  deliveryTime: db.deliveryTime ?? db.delivery_time ?? db["Delivery Time"] ?? "",
                  paymentMethod: db.paymentMethod ?? db.payment_method ?? db["Payment Method"] ?? "cash",
                  paid: db.paid ?? db.Paid ?? false,
                  paidAt: db.paidAt ?? db.paid_at ?? db["Paid At"],
                  paymentStatus: db.paymentStatus ?? db.payment_status ?? db["Payment Status"] ?? "pending",
                  orderStatus: db.orderStatus ?? db.order_status ?? db["Order Status"] ?? "pending",
                  total: db.total ?? db.Total ?? 0,
                  subtotal: db.subtotal ?? db.Subtotal ?? 0,
                  deliveryFee: db.deliveryFee ?? db.delivery_fee ?? db["Delivery Fee"] ?? 0,
                  deliveryDistrict: db.deliveryDistrict ?? db.delivery_district ?? db["Delivery District"],
                  deliveryAddress: db.deliveryAddress ?? db.delivery_address ?? db["Delivery Address"],
                  loyaltyPointsUsed: db.loyaltyPointsUsed ?? db.loyalty_points_used ?? db["Loyalty Points Used"] ?? 0,
                  loyaltyPointsEarned: db.loyaltyPointsEarned ?? db.loyalty_points_earned ?? db["Loyalty Points Earned"] ?? 0,
                  persons: db.persons ?? [],
                  extras: db.extras ?? [],
                }))
              
              console.log('✅ Заказы установлены в state:', mappedOrders.length)
              setOrders(mappedOrders)
            }
          })
          .catch(error => {
            console.error('❌ Ошибка загрузки данных из API:', error)
            // В случае ошибки показываем предупреждение
            setUserProfile(tempProfile) // Возвращаем базовый профиль
          })
          .finally(() => {
            // ✅ Снимаем все лоадеры после завершения
            setIsUserLoading(false)
            setIsOrdersLoading(false)
            setIsPointsLoading(false)
            console.log('✅ Загрузка данных завершена')
          })
      } else {
        // Если нет профиля с id, снимаем лоадеры
        setIsUserLoading(false)
        setIsOrdersLoading(false)
        setIsPointsLoading(false)
      }
      
      const savedReviews = localStorage.getItem(`reviews_${user}`)
      if (savedReviews) {
        setReviews(JSON.parse(savedReviews))
      }
    } else {
      // ✅ Для гостей: загружаем заказы из localStorage и очищаем фантомные/старые
      const guestOrders = localStorage.getItem("guest_orders")
      if (guestOrders) {
        const deserializedOrders = deserializeOrders(guestOrders)
        
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const threeDaysAgo = new Date(today)
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
        
        // ✅ КРИТИЧНО: Удаляем:
        // 1. Заказы с ID (уже в базе, больше не "гостевые")
        // 2. Заказы старше 3 дней в прошлом (устаревшие)
        const actualGuestOrders = deserializedOrders.filter(order => {
          // Если есть ID - это не гостевой заказ, удаляем
          if (order.id) return false
          
          // Если дата доставки старше 3 дней - удаляем
          const orderDate = new Date(order.startDate)
          orderDate.setHours(0, 0, 0, 0)
          if (orderDate < threeDaysAgo) return false
          
          return true
        })
        
        setOrders(actualGuestOrders)
        
        // Обновляем localStorage, удаляя старые и фантомные заказы
        if (actualGuestOrders.length !== deserializedOrders.length || actualGuestOrders.length > 0) {
          const updatedCache = serializeOrders(actualGuestOrders)
          localStorage.setItem("guest_orders", updatedCache)
          const removed = deserializedOrders.length - actualGuestOrders.length
          if (removed > 0) {
            console.log(`🧹 Удалено фантомных/старых заказов: ${removed}`)
          }
          console.log(`✅ Осталось гостевых заказов: ${actualGuestOrders.length}`)
        }
        
        // Если все заказы были удалены, очищаем localStorage
        if (actualGuestOrders.length === 0) {
          localStorage.removeItem("guest_orders")
          console.log('🧹 Очищен localStorage от гостевых заказов')
        }
      }
    }
  }, [])

  // Helper: Check if there's a delivery (order start date) on this date
  const hasDeliveryForDate = (date: Date) => {
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    
    return orders.some(order => {
      const deliveryDate = new Date(order.startDate)
      deliveryDate.setHours(0, 0, 0, 0)
      return checkDate.getTime() === deliveryDate.getTime()
    })
  }

  // Helper: Check if there's food (eating days: day1 and day2 after delivery)
  const hasFoodForDate = (date: Date) => {
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    
    return orders.some(order => {
      const deliveryDate = new Date(order.startDate)
      deliveryDate.setHours(0, 0, 0, 0)
      
      const day1 = new Date(deliveryDate)
      day1.setDate(day1.getDate() + 1)
      
      const day2 = new Date(deliveryDate)
      day2.setDate(day2.getDate() + 2)
      
      return checkDate.getTime() === day1.getTime() || checkDate.getTime() === day2.getTime()
    })
  }

  // Helper: Check if this date is the last day of food (day2) for any order
  const isLastDayOfAnyOrder = (date: Date) => {
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    
    return orders.some(order => {
      const deliveryDate = new Date(order.startDate)
      deliveryDate.setHours(0, 0, 0, 0)
      
      // day2 is the last eating day for this order
      const day2 = new Date(deliveryDate)
      day2.setDate(day2.getDate() + 2)
      day2.setHours(0, 0, 0, 0)
      
      return checkDate.getTime() === day2.getTime()
    })
  }

  // Helper: Check if there's food on the next day (chain continues without gap)
  // Plus button should show if there's NO food on next day (gap exists)
  const hasNextOrder = (date: Date) => {
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    
    // PRIORITY 1: Check if there's delivery on this day (new order continues chain)
    if (hasDeliveryForDate(date)) {
      return true
    }
    
    // PRIORITY 2: Check if there's FOOD on the next day (no gap - chain continues)
    // If there's food on next day, the chain continues. If no food, there's a gap and plus should show
    const nextDay = new Date(checkDate)
    nextDay.setDate(nextDay.getDate() + 1)
    nextDay.setHours(0, 0, 0, 0)
    
    return hasFoodForDate(nextDay)
  }

  // Helper: Check if yellow plus button should be shown (last day of any order with food, no delivery, no next order)
  const shouldShowYellowPlus = (date: Date) => {
    const hasFood = hasFoodForDate(date)
    const isLastDayOfOrder = isLastDayOfAnyOrder(date)
    const hasDelivery = hasDeliveryForDate(date)
    const hasNextOrderForLastDay = hasNextOrder(date)
    
    return hasFood && isLastDayOfOrder && !hasDelivery && !hasNextOrderForLastDay
  }

  const handleDateClick = (date: Date) => {
    const isSaturday = getDay(date) === 6
    
    // Проверяем, есть ли заказ на эту дату
    const order = orders.find((order) => {
      const orderDate = new Date(order.startDate)
      return (
        orderDate.getDate() === date.getDate() &&
        orderDate.getMonth() === date.getMonth() &&
        orderDate.getFullYear() === date.getFullYear()
      )
    })
    
    // Обработка субботы
    if (isSaturday) {
      const hasYellowPlus = shouldShowYellowPlus(date)
      
      if (hasYellowPlus) {
        // Суббота + есть желтый плюс → показать предупреждение и переключить на воскресенье
        const sunday = addDays(date, 1)
        showWarning(
          "Доставка в воскресенье",
          "Доставка ближайшая возможна только в воскресенье, потому что кухня отдыхает по субботам. Заказ будет оформлен на воскресенье.",
          "warning",
          () => {
            setSelectedDate(sunday)
          }
        )
        return
      } else {
        // Суббота + нет желтого плюса → показать ошибку про кухню
        showWarning(
          "Кухня отдыхает",
          "На субботу заказ невозможен, потому что кухня отдыхает. Выберите другую дату.",
          "error"
        )
        return
      }
    }
    
    // Проверяем, есть ли еда на эту дату (от предыдущего заказа)
    const hasFood = hasFoodForDate(date)
    
    // Если есть еда от предыдущего заказа, но нет заказа на эту дату
    // И дата недоступна для заказа (прошла или вне диапазона) - показать сообщение
    if (hasFood && !order && !canOrderForDate(date)) {
      showWarning(
        "Меню еще не обновлено",
        "На эту дату есть еда от предыдущего заказа, но пока нельзя оформить новый заказ. Пожалуйста, дождитесь обновления меню.",
        "info"
      )
      return
    }
    
    // Открываем модальное окно если:
    // 1. Есть существующий заказ на эту дату (можно просмотреть/изменить)
    // 2. Можно заказать на эту дату (даже если есть еда от предыдущего заказа - можно перезаказать)
    if (order || canOrderForDate(date)) {
      setSelectedDate(date)
    } else {
      showWarning(
        "Дата недоступна",
        "На эту дату нельзя оформить заказ. Выберите другую дату.",
        "error"
      )
    }
  }

  const handleCloseModal = () => {
    setSelectedDate(null)
  }

  const handleSaveOrder = async (order: Order) => {
    // ✅ НОВОЕ: Закрываем OrderModal сразу при нажатии "Заказать"
    // Это улучшает UX - пользователь видит, что действие выполнено
    setSelectedDate(null)
    
    const user = localStorage.getItem("currentUser")
    const orderTimestamp = getDateTimestamp(order.startDate)
    
    // ✅ ИСПРАВЛЕНО 2026-01-13: Если это черновик (повторение), добавляем в orders
    const isDraft = draftOrder && getDateTimestamp(draftOrder.startDate) === orderTimestamp
    if (isDraft) {
      console.log("📝 [Save Draft] Сохраняем черновик заказа в orders")
      setOrders(prevOrders => {
        // Проверяем, нет ли уже заказа на эту дату
        const existingIndex = prevOrders.findIndex(o => getDateTimestamp(o.startDate) === orderTimestamp)
        if (existingIndex !== -1) {
          // Заменяем существующий
          const updated = [...prevOrders]
          updated[existingIndex] = order
          return updated
        }
        // Добавляем новый
        return [...prevOrders, order]
      })
      setDraftOrder(null) // Очищаем черновик
    }
    
    const existingOrder = orders.find((o) => getDateTimestamp(o.startDate) === orderTimestamp)
    
    console.log("🔵 handleSaveOrder вызван:", {
      isAuthenticated,
      hasUserProfile: !!userProfile,
      userId: userProfile?.id,
      hasExistingOrder: !!existingOrder?.id,
      isDraft,
    })
    
    // Если заказ существует и имеет id, и пользователь авторизован, обновляем через API
    if (existingOrder?.id && isAuthenticated && userProfile?.id) {
      try {
        // ✅ ИСПРАВЛЕНО: Для существующего заказа НЕ пересчитываем total на клиенте!
        // Используем существующие значения из базы данных, т.к. цены хранятся только в Order_Meals
        const updatedOrder: Order = {
          ...order,
          id: existingOrder.id,
          orderNumber: existingOrder.orderNumber,
          subtotal: existingOrder.subtotal,
          total: existingOrder.total,
        }
        
        const response = await fetch(`/api/orders/${existingOrder.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: updatedOrder }),
        })
        
        if (!response.ok) {
          throw new Error("Failed to update order")
        }
        
        const result = await response.json()
        console.log('📦 [handleSaveOrder] API вернул result:', result)
        console.log('📦 [handleSaveOrder] result.order:', result.order)
        console.log('📦 [handleSaveOrder] result.loyaltyPointsEarned:', result.loyaltyPointsEarned)
        
        // ✅ ИСПРАВЛЕНО: Обновляем заказ данными из API
        if (result.order) {
          const updatedOrderFromAPI = result.order
          console.log('📦 [handleSaveOrder] updatedOrderFromAPI fields:', {
            Id: updatedOrderFromAPI.Id,
            id: updatedOrderFromAPI.id,
            total: updatedOrderFromAPI.total,
            Total: updatedOrderFromAPI.Total,
            loyalty_points_earned: updatedOrderFromAPI.loyalty_points_earned,
            'Loyalty Points Earned': updatedOrderFromAPI["Loyalty Points Earned"],
          })
          
          setOrders((prev) => {
            const filtered = prev.filter((o) => getDateTimestamp(o.startDate) !== orderTimestamp)
            const newOrders = [
              ...filtered,
              {
                ...updatedOrder,
                id: updatedOrderFromAPI.Id || updatedOrderFromAPI.id || existingOrder.id,
                orderNumber: updatedOrderFromAPI.order_number || result.orderNumber || existingOrder.orderNumber,
                startDate: toDate(updatedOrder.startDate),
                paid: updatedOrderFromAPI.paid ?? updatedOrder.paid ?? false,
                paidAt: updatedOrderFromAPI.paid_at || updatedOrderFromAPI["Paid At"] || updatedOrder.paidAt,
                paymentStatus: updatedOrderFromAPI.payment_status || updatedOrder.paymentStatus,
                total: updatedOrderFromAPI.total || updatedOrderFromAPI.Total || updatedOrder.total,
                subtotal: updatedOrderFromAPI.subtotal || updatedOrderFromAPI.Subtotal || updatedOrder.subtotal,
                loyaltyPointsEarned: updatedOrderFromAPI.loyalty_points_earned || 
                                     updatedOrderFromAPI["Loyalty Points Earned"] || 
                                     result.loyaltyPointsEarned || 0,
                loyaltyPointsUsed: updatedOrderFromAPI.loyalty_points_used || 
                                   updatedOrderFromAPI["Loyalty Points Used"] || 
                                   updatedOrder.loyaltyPointsUsed || 0,
              },
            ]
            // ✅ ИСПРАВЛЕНО: НЕ сохраняем заказы в localStorage для авторизованных
            // Авторизованные пользователи всегда загружают заказы из API
            // if (user) {
            //   localStorage.setItem(`orders_${user}`, serializeOrders(newOrders))
            // }
            
            // Логируем обновленный заказ для проверки
            const finalOrder = newOrders.find(o => o.id === existingOrder.id)
            console.log('✅ [handleSaveOrder] Заказ обновлен в состоянии:', {
              id: finalOrder?.id,
              total: finalOrder?.total,
              loyaltyPointsEarned: finalOrder?.loyaltyPointsEarned,
              paid: finalOrder?.paid,
            })
            
            return newOrders
          })
        } else {
          // Fallback: если API не вернул order, используем старую логику
          setOrders((prev) => {
            const filtered = prev.filter((o) => getDateTimestamp(o.startDate) !== orderTimestamp)
            const newOrders = [
              ...filtered,
              {
                ...updatedOrder,
                orderNumber: result.orderNumber || existingOrder.orderNumber || updatedOrder.orderNumber,
                startDate: toDate(updatedOrder.startDate),
                paid: updatedOrder.paid ?? false,
              },
            ]
            // ✅ ИСПРАВЛЕНО: НЕ сохраняем заказы в localStorage для авторизованных
            // if (user) {
            //   localStorage.setItem(`orders_${user}`, serializeOrders(newOrders))
            // }
            return newOrders
          })
        }
        
        // ✅ НОВОЕ: Обновляем профиль пользователя из API
        if (result.loyaltyPointsEarned && result.loyaltyPointsEarned > 0 && userProfile) {
          try {
            console.log('💰 Обновляю баллы после обновления заказа...')
            const profileResponse = await fetch(`/api/orders?userId=${userProfile.id}`)
            const profileData = await profileResponse.json()
            
            if (profileData.userProfile) {
              console.log('💰 Обновлены баллы из API:', {
                старые: userProfile.loyaltyPoints,
                новые: profileData.userProfile.loyaltyPoints
              })
              
              const updatedProfile = {
                ...userProfile,
                loyaltyPoints: profileData.userProfile.loyaltyPoints,
                totalSpent: profileData.userProfile.totalSpent,
              }
              setUserProfile(updatedProfile)
              
              if (user) {
                localStorage.setItem(`profile_${user}`, JSON.stringify(updatedProfile))
              }
            }
          } catch (error) {
            console.error('❌ Ошибка обновления профиля:', error)
          }
        }
        
        // ✅ ИСПРАВЛЕНО 10.01.2026: Убрали toast "Заказ обновлен" (избыточное уведомление)
      } catch (error) {
        console.error("Failed to update order:", error)
        // ✅ ИСПРАВЛЕНО 10.01.2026: Заменили toast на WarningDialog
        setWarningDialog({
          open: true,
          title: "Ошибка обновления",
          description: "Не удалось обновить заказ. Попробуйте еще раз.",
          variant: "error",
        })
        return
      }
    } else if (isAuthenticated && userProfile?.id) {
      // ✅ ИСПРАВЛЕНО 2026-01-13: Проверяем, нет ли уже заказа на эту дату
      // ✅ ИСПРАВЛЕНО 2026-01-13: Учитываем только активные заказы (с id, не отмененные)
      const orderDate = typeof order.startDate === 'string' 
        ? order.startDate 
        : order.startDate.toISOString().split('T')[0]
      
      // ✅ ИСПРАВЛЕНО 2026-01-13: Детальное логирование для отладки
      console.log(`🔍 [handleSaveOrder] Проверка заказов на дату ${orderDate}`)
      console.log(`🔍 [handleSaveOrder] Всего заказов в локальном стейте: ${orders.length}`)
      
      const existingOrderOnDate = orders.find((o) => {
        if (!o.id) return false // Черновики не учитываем
        // ✅ ИСПРАВЛЕНО 2026-01-13: Проверяем orderStatus вместо cancelled
        const orderStatus = o.orderStatus || 'pending'
        if (orderStatus === 'cancelled') return false // Отмененные заказы не учитываем
        const oDate = typeof o.startDate === 'string' 
          ? o.startDate 
          : o.startDate.toISOString().split('T')[0]
        
        // ✅ ИСПРАВЛЕНО 2026-01-13: Логируем каждый заказ для отладки
        if (oDate === orderDate) {
          console.log(`🔍 [handleSaveOrder] Найден заказ на дату ${orderDate}:`, {
            orderId: o.id,
            orderNumber: o.orderNumber,
            orderStatus,
            paid: o.paid,
            startDate: oDate,
          })
        }
        
        return oDate === orderDate
      })
      
      if (existingOrderOnDate) {
        const orderStatus = existingOrderOnDate.orderStatus || 'pending'
        console.warn(`⚠️ [handleSaveOrder] На дату ${orderDate} уже есть активный заказ:`, {
          orderId: existingOrderOnDate.id,
          orderNumber: existingOrderOnDate.orderNumber,
          orderStatus,
          paid: existingOrderOnDate.paid,
        })
        setWarningDialog({
          open: true,
          title: "Заказ уже существует",
          description: `На эту дату (${typeof order.startDate === 'string' ? new Date(order.startDate).toLocaleDateString('ru-RU') : order.startDate.toLocaleDateString('ru-RU')}) у вас уже есть активный заказ. Отмените существующий заказ или выберите другую дату.`,
          variant: "warning",
        })
        setShowOrderLoading(false)
        return
      }
      
      console.log(`✅ [handleSaveOrder] На дату ${orderDate} нет активного заказа, можно создавать`)
      
      // Создаем новый заказ через API
      console.log("✅ Условие для создания заказа выполнено:", {
        isAuthenticated,
        hasUserProfile: !!userProfile,
        userId: userProfile?.id,
        sendingToServer: true,
      })
      
      // Показываем анимацию создания заказа
      setShowOrderLoading(true)
      
      try {
        const total = calculateOrderTotal(order)
        const newOrder: Order = {
          ...order,
          subtotal: total,
          total: total,
        }
        
        console.log("📤 Отправка заказа на сервер:", {
          personsCount: newOrder.persons?.length,
          extrasCount: newOrder.extras?.length,
          userId: userProfile.id,
        })
        
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: newOrder, userId: userProfile.id }),
        })
        
        console.log("📥 Ответ сервера:", response.status, response.statusText)
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
          console.error("❌ Ошибка при создании заказа:", errorData)
          
          // ✅ ИСПРАВЛЕНО 2026-01-13: Показываем понятное сообщение, если заказ уже существует
          if (errorData.error === "Order already exists for this date" || errorData.details) {
            setWarningDialog({
              open: true,
              title: "Заказ уже существует",
              description: errorData.details || `На эту дату уже есть заказ. Отмените существующий заказ или выберите другую дату.`,
              variant: "warning",
            })
            setShowOrderLoading(false)
            return
          }
          
          throw new Error(errorData.error || "Failed to create order")
        }
        
        const result = await response.json()
        console.log("✅ Результат создания заказа:", result)
        
        // Проверяем, что номер заказа получен
        console.log("Order creation result:", result)
        if (!result.orderNumber) {
          console.warn("⚠️ Order number not received from API:", result)
          // Пытаемся получить номер заказа из базы данных
          if (result.orderId) {
            try {
              const fetchResponse = await fetch(`/api/orders?userId=${userProfile.id}`)
              const fetchData = await fetchResponse.json()
              const dbOrder = fetchData.orders?.find((o: any) => o.Id === result.orderId)
              if (dbOrder?.order_number) {
                result.orderNumber = dbOrder.order_number
                console.log("✅ Retrieved order number from DB:", result.orderNumber)
              }
            } catch (error) {
              console.error("Failed to fetch order number:", error)
            }
          }
        }
        
        // Обязательно проверяем наличие номера заказа
        if (!result.orderNumber) {
          console.error("❌ CRITICAL: Order number is missing from API response!", result)
          // Генерируем номер заказа на клиенте как fallback
          const fallbackOrderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
          result.orderNumber = fallbackOrderNumber
          console.warn("⚠️ Using fallback order number:", fallbackOrderNumber)
        }
        
        // Обновляем заказ в состоянии с id из API
        const savedOrder: Order = {
          ...newOrder,
          id: result.orderId,
          orderNumber: result.orderNumber, // Гарантируем, что номер заказа есть
          startDate: toDate(newOrder.startDate),
          paid: newOrder.paid ?? false,
          // ✅ НОВОЕ: Копируем важные поля из API ответа
          total: result.order?.total || newOrder.total,
          subtotal: result.order?.subtotal || newOrder.subtotal,
          deliveryFee: result.order?.deliveryFee ?? newOrder.deliveryFee ?? 0, // ✅ ДОБАВЛЕНО
          loyaltyPointsEarned: result.loyaltyPointsEarned || 0,
          loyaltyPointsUsed: newOrder.loyaltyPointsUsed || 0,
        }
        
        console.log("💾 Saving order to state:", { 
          id: savedOrder.id, 
          orderNumber: savedOrder.orderNumber, 
          startDate: savedOrder.startDate,
          hasOrderNumber: !!savedOrder.orderNumber,
          orderNumberType: typeof savedOrder.orderNumber
        })
        
        if (!savedOrder.orderNumber) {
          console.error("❌ FATAL: Order number is still missing after all checks!", savedOrder)
        }
        
        setOrders((prev) => {
          const filtered = prev.filter((o) => getDateTimestamp(o.startDate) !== orderTimestamp)
          const newOrders = [...filtered, savedOrder]
          
          // Дополнительная проверка перед сохранением
          const orderToSave = newOrders.find(o => o.id === savedOrder.id)
          if (orderToSave && !orderToSave.orderNumber) {
            console.error("❌ Order number lost during state update!", orderToSave)
            orderToSave.orderNumber = result.orderNumber
          }
          
          // ✅ ИСПРАВЛЕНО: Сохраняем в localStorage ТОЛЬКО для гостей
          if (!user) {
            const serialized = serializeOrders(newOrders)
            localStorage.setItem("guest_orders", serialized)
            
            // Проверяем после сериализации
            const deserialized = deserializeOrders(serialized)
            const checkOrder = deserialized.find(o => o.id === savedOrder.id)
            console.log("✅ Saved to localStorage, orders count:", newOrders.length)
            console.log("🔍 Verification - saved order after serialize/deserialize:", { 
              id: checkOrder?.id, 
              orderNumber: checkOrder?.orderNumber,
              hasOrderNumber: !!checkOrder?.orderNumber,
              allFields: Object.keys(checkOrder || {})
            })
            
            if (checkOrder && !checkOrder.orderNumber) {
              console.error("❌ Order number lost during serialization!", checkOrder)
              // Принудительно восстанавливаем номер заказа
              checkOrder.orderNumber = result.orderNumber
              // Обновляем localStorage с исправленным заказом
              const fixedOrders = newOrders.map(o => 
                o.id === checkOrder.id ? { ...o, orderNumber: result.orderNumber } : o
              )
              localStorage.setItem("guest_orders", serializeOrders(fixedOrders))
              // Обновляем состояние
              setTimeout(() => {
                setOrders(fixedOrders)
              }, 100)
            }
          } else {
            // Для авторизованных пользователей просто логируем
            console.log("✅ Saved to localStorage, orders count:", newOrders.length)
            console.log("🔍 Verification - saved order after serialize/deserialize:", { 
              id: savedOrder.id, 
              orderNumber: savedOrder.orderNumber,
              hasOrderNumber: !!savedOrder.orderNumber,
            })
          }
          
          // Финальная проверка - убеждаемся, что номер заказа есть
          const finalCheck = newOrders.find(o => o.id === savedOrder.id)
          if (finalCheck && !finalCheck.orderNumber && result.orderNumber) {
            console.warn("⚠️ Fixing missing order number in state...")
            finalCheck.orderNumber = result.orderNumber
            // ✅ ИСПРАВЛЕНО: НЕ сохраняем в localStorage для авторизованных
            // if (user) {
            //   localStorage.setItem(`orders_${user}`, serializeOrders(newOrders.map(o => 
            //     o.id === finalCheck.id ? finalCheck : o
            //   )))
            // }
          }
          
          return newOrders
        })
        
        // ✅ ИСПРАВЛЕНО 2026-01-11: Используем userProfile из ответа POST вместо дополнительного запроса
        // Это быстрее и не создает race conditions
        if (userProfile?.id && result.userProfile) {
          const newLoyaltyPoints = typeof result.userProfile.loyaltyPoints === 'number' 
            ? result.userProfile.loyaltyPoints 
            : parseInt(String(result.userProfile.loyaltyPoints)) || 0
          
          const newTotalSpent = typeof result.userProfile.totalSpent === 'number'
            ? result.userProfile.totalSpent
            : parseFloat(String(result.userProfile.totalSpent)) || 0
          
          console.log('💰 Обновлены данные из ответа POST:', {
            старые_баллы: userProfile.loyaltyPoints,
            новые_баллы: newLoyaltyPoints,
            старый_totalSpent: userProfile.totalSpent,
            новый_totalSpent: newTotalSpent,
          })
          
          const updatedProfile = {
            ...userProfile,
            loyaltyPoints: newLoyaltyPoints,
            totalSpent: newTotalSpent,
          }
          console.log('💾 Вызываем setUserProfile с обновленными данными:', {
            loyaltyPoints: updatedProfile.loyaltyPoints,
            totalSpent: updatedProfile.totalSpent,
          })
          setUserProfile(updatedProfile)
          
          if (user) {
            localStorage.setItem(`profile_${user}`, JSON.stringify(updatedProfile))
            console.log('💾 Профиль сохранен в localStorage')
          }
        }
        
        // ✅ ИСПРАВЛЕНО 2026-01-11: Открываем PaymentModal после создания заказа
        setShowOrderLoading(false)
        
        console.log("🎯 Открываем PaymentModal для нового заказа: orderId =", savedOrder.id, "total =", savedOrder.total)
        setPaymentOrder({ 
          order: savedOrder, 
          total: savedOrder.total 
        })
      } catch (error) {
        console.error("❌ Ошибка при создании заказа:", error)
        setShowOrderLoading(false) // Скрываем loading при ошибке
        // ✅ ИСПРАВЛЕНО 10.01.2026: Заменили toast на WarningDialog
        setWarningDialog({
          open: true,
          title: "Ошибка создания заказа",
          description: error instanceof Error ? error.message : "Не удалось создать заказ. Попробуйте еще раз.",
          variant: "error",
        })
      }
    } else {
      // Пользователь не авторизован или нет userProfile.id
      const reason = !isAuthenticated 
        ? "Пользователь не авторизован" 
        : !userProfile 
          ? "userProfile отсутствует"
          : !userProfile.id 
            ? "userProfile.id отсутствует" 
            : "Неизвестная причина"
      
      console.warn("⚠️ Заказ не создается через API, причина:", {
        isAuthenticated,
        hasUserProfile: !!userProfile,
        userId: userProfile?.id,
        reason,
        userProfileKeys: userProfile ? Object.keys(userProfile) : [],
      })
      
      // Сохраняем только в localStorage (для гостей или если нет userId)
      setOrders((prev) => {
        const filtered = prev.filter((o) => getDateTimestamp(o.startDate) !== orderTimestamp)
        const newOrders = [...filtered, { ...order, startDate: toDate(order.startDate), paid: order.paid ?? false }]
        // ✅ ИСПРАВЛЕНО: Сохраняем в localStorage ТОЛЬКО для гостей
        if (!user) {
          localStorage.setItem("guest_orders", serializeOrders(newOrders))
        }
        // Авторизованные пользователи работают только с API
        return newOrders
      })
      
      // ✅ ИСПРАВЛЕНО 10.01.2026: Убрали toast "Заказ сохранен локально" (избыточное)
    }
    
    // ✅ УДАЛЕНО: setSelectedDate(null) - теперь выполняется в начале функции
  }
  
  // Удаляем дублирующий код - больше не нужен
  /*
  const handleSaveOrderOld = async (order: Order) => {
    const user = localStorage.getItem("currentUser")
    const orderTimestamp = getDateTimestamp(order.startDate)
    const existingOrder = orders.find((o) => getDateTimestamp(o.startDate) === orderTimestamp)
    
    if (existingOrder?.id && isAuthenticated && userProfile?.id) {
      // ... existing code ...
    } else if (isAuthenticated && userProfile?.id) {
      // ... existing code ...
    } else {
      // Сохраняем локально для неавторизованных пользователей
      const updatedOrders = [...orders]
      const index = updatedOrders.findIndex((o) => getDateTimestamp(o.startDate) === orderTimestamp)
      
      if (index >= 0) {
        updatedOrders[index] = { ...order, startDate: toDate(order.startDate) }
      } else {
        updatedOrders.push({ ...order, startDate: toDate(order.startDate) })
      }
      
      setOrders(updatedOrders)
      
      const guestOrders = localStorage.getItem("guest_orders")
      if (guestOrders) {
        const parsed = deserializeOrders(guestOrders)
        const filtered = parsed.filter((o) => getDateTimestamp(o.startDate) !== orderTimestamp)
        localStorage.setItem("guest_orders", serializeOrders([...filtered, { ...order, startDate: toDate(order.startDate) }]))
      } else {
        localStorage.setItem("guest_orders", serializeOrders([{ ...order, startDate: toDate(order.startDate) }]))
      }
      
      // ✅ ИСПРАВЛЕНО 10.01.2026: Убрали toast "Заказ сохранен" (избыточное)
    }
  }
  
  // Временная заглушка - удалить после проверки
  const handleSaveOrderBackup = async (order: Order) => {
    console.log("🔵 handleSaveOrder вызван:", {
      isAuthenticated,
      hasUserProfile: !!userProfile,
      userId: userProfile?.id,
    })
    
    const user = localStorage.getItem("currentUser")
    const orderTimestamp = getDateTimestamp(order.startDate)
    const existingOrder = orders.find((o) => getDateTimestamp(o.startDate) === orderTimestamp)
    
    if (existingOrder?.id && isAuthenticated && userProfile?.id) {
      try {
        // ✅ ИСПРАВЛЕНО: Для существующего заказа НЕ пересчитываем total на клиенте!
        // Используем существующие значения из базы данных, т.к. цены хранятся только в Order_Meals
        const updatedOrder: Order = {
          ...order,
          id: existingOrder.id,
          orderNumber: existingOrder.orderNumber,
          subtotal: existingOrder.subtotal,
          total: existingOrder.total,
        }
        
        const response = await fetch(`/api/orders/${existingOrder.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: updatedOrder }),
        })
        
        if (!response.ok) {
          throw new Error("Failed to update order")
        }
        
        const result = await response.json()
        
        setOrders((prev) => {
          const filtered = prev.filter((o) => getDateTimestamp(o.startDate) !== orderTimestamp)
          const newOrders = [
            ...filtered,
            {
              ...updatedOrder,
              orderNumber: result.orderNumber || existingOrder.orderNumber || updatedOrder.orderNumber,
              startDate: toDate(updatedOrder.startDate),
              paid: updatedOrder.paid ?? false,
            },
          ]
          // ✅ ИСПРАВЛЕНО: НЕ сохраняем в localStorage для авторизованных
          // if (user) {
          //   localStorage.setItem(`orders_${user}`, serializeOrders(newOrders))
          // }
          return newOrders
        })
        
        // ✅ ИСПРАВЛЕНО 10.01.2026: Убрали toast "Заказ обновлен" (избыточное)
      } catch (error) {
        console.error("Failed to update order:", error)
        // ✅ ИСПРАВЛЕНО 10.01.2026: Заменили toast на WarningDialog
        setWarningDialog({
          open: true,
          title: "Ошибка обновления",
          description: "Не удалось обновить заказ. Попробуйте еще раз.",
          variant: "error",
        })
        return
      }
    } else if (isAuthenticated && userProfile?.id) {
      try {
        const total = calculateOrderTotal(order)
        const newOrder: Order = {
          ...order,
          subtotal: total,
          total: total,
        }
        
        console.log("📤 Отправка заказа на сервер:", {
          personsCount: newOrder.persons?.length,
          extrasCount: newOrder.extras?.length,
          userId: userProfile.id,
        })
        
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: newOrder, userId: userProfile.id }),
        })
        
        console.log("📥 Ответ сервера:", response.status, response.statusText)
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
          console.error("❌ Ошибка при создании заказа:", errorData)
          throw new Error(errorData.error || "Failed to create order")
        }
        
        const result = await response.json()
        console.log("✅ Результат создания заказа:", result)
        
        // Проверяем, что номер заказа получен
        console.log("Order creation result:", result)
        if (!result.orderNumber) {
          console.warn("⚠️ Order number not received from API:", result)
          // Пытаемся получить номер заказа из базы данных
          if (result.orderId) {
            try {
              const fetchResponse = await fetch(`/api/orders?userId=${userProfile.id}`)
              const fetchData = await fetchResponse.json()
              const dbOrder = fetchData.orders?.find((o: any) => o.Id === result.orderId)
              if (dbOrder?.order_number) {
                result.orderNumber = dbOrder.order_number
                console.log("✅ Retrieved order number from DB:", result.orderNumber)
              }
            } catch (error) {
              console.error("Failed to fetch order number:", error)
            }
          }
        }
        
        // Обязательно проверяем наличие номера заказа
        if (!result.orderNumber) {
          console.error("❌ CRITICAL: Order number is missing from API response!", result)
          // Генерируем номер заказа на клиенте как fallback
          const fallbackOrderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
          result.orderNumber = fallbackOrderNumber
          console.warn("⚠️ Using fallback order number:", fallbackOrderNumber)
        }
        
        // Обновляем заказ в состоянии с id из API
        const savedOrder: Order = {
          ...newOrder,
          id: result.orderId,
          orderNumber: result.orderNumber, // Гарантируем, что номер заказа есть
          startDate: toDate(newOrder.startDate),
          paid: newOrder.paid ?? false,
        }
        
  */

  const handleCancelOrder = async (order: Order) => {
    console.log('🗑️ handleCancelOrder вызван для заказа:', order)
    
    if (!order) {
      console.error('❌ Попытка удалить пустой заказ!')
      showWarning("Ошибка", "Не удалось удалить заказ: заказ не найден", "error")
      return
    }

    // ✅ ИСПРАВЛЕНО 2026-01-11: Если заказ БЕЗ ID - это новый несохраненный заказ
    // Просто удаляем его из локального state
    if (!order.id) {
      console.log('🗑️ Удаление несохраненного заказа из локального state')
      const orderTimestamp = getDateTimestamp(order.startDate)
      setOrders((prev) => {
        const filtered = prev.filter((o) => getDateTimestamp(o.startDate) !== orderTimestamp)
        console.log(`✅ Удалено из локального state: было ${prev.length}, стало ${filtered.length}`)
        return filtered
      })
      setSelectedDate(null)
      showWarning("Заказ отменен", "Несохраненный заказ успешно удален", "success")
      return
    }

    const wasPaid = order.paid && order.paymentMethod !== "cash"

    // Показываем анимацию отмены заказа
    setShowCancelLoading(true)

    // 1. ОПТИМИСТИЧНОЕ обновление UI (сразу удаляем из списка)
    console.log('⚡ Оптимистично удаляю заказ ID=' + order.id + ' из UI...')
    const previousOrders = [...orders]
    setOrders((prev) => {
      const filtered = prev.filter((o) => o.id !== order.id)
      console.log(`✅ Оптимистично удалено: было ${prev.length}, стало ${filtered.length}`)
      return filtered
    })
    setSelectedDate(null)

    // 2. Вызов API для удаления в БД
    try {
      console.log(`📡 Отправляю DELETE /api/orders/${order.id}`)
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'DELETE',
      })
      
      console.log(`📥 Ответ DELETE API: ${res.status}`)
      
      if (!res.ok) {
        throw new Error(`Ошибка API: ${res.status}`)
      }

      const result = await res.json()

      // ✅ НОВОЕ: Обновляем баллы напрямую из ответа API
      if (result.updatedLoyaltyPoints !== undefined && userProfile && isAuthenticated) {
        console.log('💰 Обновлены баллы после отмены заказа:', {
          старые: userProfile.loyaltyPoints,
          новые: result.updatedLoyaltyPoints
        })
        const updatedProfile = {
          ...userProfile,
          loyaltyPoints: result.updatedLoyaltyPoints,
        }
        setUserProfile(updatedProfile)
        if (currentUser) {
          localStorage.setItem(`profile_${currentUser}`, JSON.stringify(updatedProfile))
        }
      }

      // 3. Для авторизованных пользователей - перезагрузить из БД
      if (isAuthenticated && userProfile?.id) {
        console.log('🔄 Перезагружаю заказы из БД для синхронизации...')
        const ordersRes = await fetch(`/api/orders?userId=${userProfile.id}`)
        if (ordersRes.ok) {
          const data = await ordersRes.json()
          console.log(`📦 Получено ${data.orders?.length || 0} заказов из БД после удаления`)
          
          if (data.orders && Array.isArray(data.orders)) {
            const dbOrders: Order[] = data.orders
              .filter((db: any) => {
                const status = db.orderStatus || db.order_status || db["Order Status"]
                return status !== 'cancelled'
              })
              .map((db: any) => ({
                id: db.id ?? db.Id,
                orderNumber: db.orderNumber ?? db.order_number ?? db["Order Number"],
                startDate: toDate(db.startDate ?? db.start_date ?? db["Start Date"]),
                deliveryTime: db.deliveryTime ?? db.delivery_time ?? db["Delivery Time"] ?? "",
                paymentMethod: db.paymentMethod ?? db.payment_method ?? db["Payment Method"] ?? "cash",
                paid: db.paid ?? db.Paid ?? false,
                paidAt: db.paidAt ?? db.paid_at ?? db["Paid At"],
                paymentStatus: db.paymentStatus ?? db.payment_status ?? db["Payment Status"] ?? "pending",
                orderStatus: db.orderStatus ?? db.order_status ?? db["Order Status"] ?? "pending",
                total: db.total ?? db.Total ?? 0,
                subtotal: db.subtotal ?? db.Subtotal ?? 0,
                loyaltyPointsUsed: db.loyaltyPointsUsed ?? db.loyalty_points_used ?? db["Loyalty Points Used"] ?? 0,
                loyaltyPointsEarned: db.loyaltyPointsEarned ?? db.loyalty_points_earned ?? db["Loyalty Points Earned"] ?? 0,
                persons: db.persons ?? [],
                extras: db.extras ?? [],
              }))
            
            console.log(`✅ Установлено ${dbOrders.length} заказов из БД`)
            setOrders(dbOrders)
          }
        }
        
        // ❌ УДАЛЕНО: дополнительный запрос профиля (баллы уже обновлены выше)
        // const profileRes = await fetch(`/api/users/${userProfile.id}`)
        // if (profileRes.ok) {
        //   const profileData = await profileRes.json()
        //   setUserProfile(profileData)
        //   localStorage.setItem(`profile_${currentUser}`, JSON.stringify(profileData))
        // }
      } else {
        // Для гостей - сохраняем в localStorage
        const user = localStorage.getItem("currentUser")
        if (!user) {
          setOrders((prev) => {
            localStorage.setItem("guest_orders", serializeOrders(prev))
            return prev
          })
        }
      }

      // Имитируем минимальную задержку для плавной анимации
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Скрываем анимацию - заказ уже удален из UI
      setShowCancelLoading(false)
      
      // Опционально: показываем тихое уведомление только для оплаченных заказов
      if (wasPaid) {
        showWarning(
          "Заказ отменен",
          "Деньги вернутся на карту в течение 3 рабочих дней.",
          "info"
        )
      }
    } catch (error) {
      console.error('❌ Ошибка при удалении заказа:', error)
      setShowCancelLoading(false) // Скрываем loading при ошибке
      // Откатываем оптимистичное обновление
      console.log('⏪ Откатываю оптимистичное удаление...')
      setOrders(previousOrders)
      showWarning(
        "Ошибка",
        "Не удалось удалить заказ. Попробуйте позже.",
        "error"
      )
    }
  }

  const handleMoveOrder = (fromDate: Date, toDateValue: Date) => {
    const user = localStorage.getItem("currentUser")
    const fromTimestamp = getDateTimestamp(fromDate)
    const toTimestamp = getDateTimestamp(toDateValue)

    setOrders((prev) => {
      const existingOrderOnTarget = prev.find((o) => getDateTimestamp(o.startDate) === toTimestamp)
      if (existingOrderOnTarget) {
        alert("На эту дату уже есть заказ. Сначала отмените его.")
        return prev
      }

      const newOrders = prev.map((o) => {
        if (getDateTimestamp(o.startDate) === fromTimestamp) {
          return { ...o, startDate: toDateValue }
        }
        return o
      })

      // ✅ ИСПРАВЛЕНО: НЕ сохраняем в localStorage для авторизованных
      // if (user) {
      //   localStorage.setItem(`orders_${user}`, serializeOrders(newOrders))
      // }
      return newOrders
    })
  }

  /**
   * Функция "Повторить заказ" - создает новый заказ на основе исторического
   * 
   * АЛГОРИТМ:
   * 1. Загружает актуальное меню из API
   * 2. Проверяет каждый товар из старого заказа
   * 3. Использует ТЕКУЩИЕ цены из меню (не исторические!)
   * 4. Пропускает товары, которых больше нет в меню
   * 5. Показывает Toast если были недоступные товары
   * 6. Автоматически открывает OrderModal с заказом
   */
  const handleRepeatOrder = async (order: Order, targetDate: Date) => {
    try {
      // ✅ ИСПРАВЛЕНО 2026-01-13: Проверяем, нет ли уже заказа на эту дату
      const targetDateKey = targetDate.toISOString().split('T')[0]
      const existingOrderOnDate = orders.find((o) => {
        if (!o.id) return false // Черновики не учитываем
        const oDate = typeof o.startDate === 'string' 
          ? o.startDate 
          : o.startDate.toISOString().split('T')[0]
        return oDate === targetDateKey
      })
      
      if (existingOrderOnDate) {
        console.warn(`⚠️ [Repeat Order] На дату ${targetDateKey} уже есть заказ (ID: ${existingOrderOnDate.id})`)
        setWarningDialog({
          open: true,
          title: "Заказ уже существует",
          description: `На эту дату (${targetDate.toLocaleDateString('ru-RU')}) у вас уже есть заказ. Отмените существующий заказ или выберите другую дату.`,
          variant: "warning",
        })
        return
      }
      
      // ✅ Получаем неделю для целевой даты
      const weekType = getWeekTypeForDate(targetDate)
      
      console.log('🔄 [Repeat Order] Начало повтора заказа:', {
        orderId: order.id,
        orderNumber: order.orderNumber,
        targetDate: targetDate.toISOString(),
        weekType,
      })

      // ✅ Загружаем актуальное меню из API
      const response = await fetch(`/api/menu?week=${weekType}`)
      if (!response.ok) {
        throw new Error('Не удалось загрузить меню')
      }

      const menuData = await response.json()
      console.log('📋 [Repeat Order] Меню загружено:', {
        hasBreakfast: menuData.meals?.breakfast?.length > 0,
        hasLunchSalad: menuData.meals?.lunch_salad?.length > 0,
        hasExtras: menuData.extras ? Object.keys(menuData.extras).length : 0,
      })

      // ✅ Валидируем товары заказа по актуальному меню
      const { validateOrderItems } = await import('@/lib/cart-utils')
      const { validatedOrder, unavailableItems, hasUnavailableItems } = validateOrderItems(
        order,
        menuData.meals || {},
        menuData.extras || {}
      )

      console.log('✅ [Repeat Order] Валидация завершена:', {
        unavailableCount: unavailableItems.length,
        unavailableItems,
      })

      // ⚠️ Если были недоступные товары - показываем предупреждение
      if (hasUnavailableItems) {
        showWarning(
          'Некоторые товары недоступны',
          `Следующие позиции больше не в меню и будут пропущены: ${unavailableItems.join(', ')}`,
          'warning'
        )
      }

      // ✅ Создаем новый заказ с актуальными товарами и ценами
      const newOrder: Order = {
        ...validatedOrder,
        // Важно: очищаем поля старого заказа
        id: undefined,
        orderNumber: undefined,
        startDate: targetDate,
        delivered: false,
        paid: false,
        paidAt: undefined,
        paymentMethod: undefined,
        orderStatus: 'pending',
        // Цены будут пересчитаны автоматически в OrderModal
        total: undefined,
        subtotal: undefined,
        deliveryFee: undefined,
        loyaltyPointsEarned: 0,
        loyaltyPointsUsed: 0,
      }

      // ✅ ИСПРАВЛЕНО 2026-01-13: НЕ добавляем заказ в state сразу
      // Заказ будет добавлен только после нажатия "Сохранить" в OrderModal через handleSaveOrder
      console.log('📝 [Repeat Order] Черновик заказа создан (не сохранен в state)')
      console.log('🎯 [Repeat Order] Открываем OrderModal для даты:', targetDate.toISOString())
      
      // Сохраняем черновик во временный state
      setDraftOrder(newOrder)
      
      // Открываем модалку - теперь она получит черновик через useMemo ниже
      setSelectedDate(targetDate)

    } catch (error) {
      console.error('❌ [Repeat Order] Ошибка при повторе заказа:', error)
      showWarning(
        'Ошибка',
        'Не удалось повторить заказ. Попробуйте позже.',
        'error'
      )
    }
  }

  const handlePayOrder = (order: Order, total: number) => {
    if (!isAuthenticated) {
      setPendingCheckout({ order, total })
      setShowAuthModal(true)
      return
    }
    // ✅ ИСПРАВЛЕНО 2026-01-13: Всегда открываем PaymentModal для выбора способа оплаты
    // Ранее для заказов с наличными открывался OrderModal, что было неправильно
    setPaymentOrder({ order, total })
  }

  const handleMarkCashOrderAsPaid = async (order: Order) => {
    if (!order.id || !isAuthenticated || !userProfile?.id) {
      // ✅ ИСПРАВЛЕНО 10.01.2026: Заменили toast на WarningDialog
      setWarningDialog({
        open: true,
        title: "Ошибка",
        description: "Не удалось отметить заказ как оплаченный",
        variant: "error",
      })
      return
    }

    // Показываем анимацию оплаты
    setShowPaymentLoading(true)

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paid: true,
          paid_at: new Date().toISOString(),
          status: "paid",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to mark order as paid")
      }

      // ✅ НОВОЕ: Получаем данные из ответа
      const data = await response.json()
      console.log('💰 Ответ от API после оплаты:', data)

      // ✅ НОВОЕ: Используем обновленный заказ из API
      if (data.order) {
        const updatedOrderFromAPI = data.order
        const orderTimestamp = getDateTimestamp(order.startDate)
        
        setOrders((prev) => {
          return prev.map((o) => {
            if (getDateTimestamp(o.startDate) === orderTimestamp) {
              // Используем ВСЕ поля из API ответа
              return {
                ...o,
                id: updatedOrderFromAPI.Id || updatedOrderFromAPI.id,
                paid: true,
                paidAt: updatedOrderFromAPI.paid_at || updatedOrderFromAPI["Paid At"],
                paymentStatus: updatedOrderFromAPI.payment_status || "paid",
                total: updatedOrderFromAPI.total || updatedOrderFromAPI.Total || 0,
                subtotal: updatedOrderFromAPI.subtotal || updatedOrderFromAPI.Subtotal || 0,
                loyaltyPointsEarned: updatedOrderFromAPI.loyalty_points_earned || 
                                     updatedOrderFromAPI["Loyalty Points Earned"] || 
                                     data.loyaltyPointsEarned || 0,
                loyaltyPointsUsed: updatedOrderFromAPI.loyalty_points_used || 
                                   updatedOrderFromAPI["Loyalty Points Used"] || 0,
              }
            }
            return o
          })
        })
        
        console.log('✅ Заказ обновлен в состоянии с данными из API')
      }

      // ✅ НОВОЕ: Обновляем баллы пользователя, если начислены
      if (data.loyaltyPointsEarned && data.loyaltyPointsEarned > 0 && userProfile) {
        // Перезагружаем профиль из API для точных данных
        try {
          console.log('💰 Перезагружаю баллы пользователя из API...')
          const profileResponse = await fetch(`/api/orders?userId=${userProfile.id}`)
          const profileData = await profileResponse.json()
          
          if (profileData.userProfile) {
            console.log('💰 Обновлены баллы из API:', {
              старые: userProfile.loyaltyPoints,
              новые: profileData.userProfile.loyaltyPoints
            })
            
            const updatedProfile = {
              ...userProfile,
              loyaltyPoints: profileData.userProfile.loyaltyPoints,
              totalSpent: profileData.userProfile.totalSpent,
            }
            setUserProfile(updatedProfile)
            
            const user = localStorage.getItem("currentUser")
            if (user) {
              localStorage.setItem(`profile_${user}`, JSON.stringify(updatedProfile))
            }
          }
        } catch (error) {
          console.error('❌ Ошибка обновления профиля:', error)
        }
      }

      // Имитируем задержку оплаты для реалистичности
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Скрываем loading и показываем success
      setShowPaymentLoading(false)
      setSuccessDialog({
        open: true,
        loyaltyPointsEarned: data.loyaltyPointsEarned || 0,
        loyaltyPointsStatus: "earned",
      })
    } catch (error) {
      console.error("Failed to mark order as paid:", error)
      setShowPaymentLoading(false) // Скрываем loading при ошибке
      // ✅ ИСПРАВЛЕНО 10.01.2026: Заменили toast на WarningDialog
      setWarningDialog({
        open: true,
        title: "Ошибка оплаты",
        description: "Не удалось отметить заказ как оплаченный. Попробуйте еще раз.",
        variant: "error",
      })
    }
  }

  // ✅ ДОБАВЛЕНО 10.01.2026: Обработка закрытия PaymentModal
  const handlePaymentModalClose = () => {
    // ✅ ИСПРАВЛЕНО 2026-01-11: Удаляем заказ ТОЛЬКО если это новый заказ из автооформления
    if (paymentOrder?.order?.id && paymentOrder.isNewOrder) {
      // Для новых заказов - показываем диалог подтверждения с удалением
      console.log("⚠️ Закрытие PaymentModal для НОВОГО заказа - показываем диалог удаления")
      setCancelPaymentDialog({
        open: true,
        orderId: paymentOrder.order.id,
      })
    } else {
      // Для существующих заказов или без ID - просто закрываем
      console.log("✅ Закрытие PaymentModal для СУЩЕСТВУЮЩЕГО заказа - просто закрываем")
      setPaymentOrder(null)
    }
  }

  // ✅ ДОБАВЛЕНО 10.01.2026: Подтверждение отмены заказа
  const handleConfirmCancelPayment = async () => {
    if (cancelPaymentDialog.orderId) {
      console.log("🗑️ Отменяем заказ при закрытии PaymentModal:", cancelPaymentDialog.orderId)
      
      // Удаляем заказ из БД
      try {
        const response = await fetch(`/api/orders/${cancelPaymentDialog.orderId}`, {
          method: "DELETE",
        })
        
        if (response.ok) {
          // Удаляем заказ из локального состояния
          setOrders((prev) => prev.filter((o) => o.id !== cancelPaymentDialog.orderId))
          console.log("✅ Заказ успешно удален")
        }
      } catch (error) {
        console.error("❌ Ошибка при удалении заказа:", error)
      }
    }
    
    // Закрываем оба диалога
    setCancelPaymentDialog({ open: false, orderId: null })
    setPaymentOrder(null)
  }

  // ✅ ДОБАВЛЕНО 10.01.2026: Отмена отмены заказа (продолжить оформление)
  const handleCancelPaymentDialogClose = async () => {
    // Если закрываем диалог отмены - подтверждаем удаление
    if (cancelPaymentDialog.orderId) {
      await handleConfirmCancelPayment()
    } else {
      setCancelPaymentDialog({ open: false, orderId: null })
    }
  }

  const handlePaymentComplete = async (order: Order, pointsUsed: number, paymentMethod: "card" | "sbp" | "cash") => {
    const user = localStorage.getItem("currentUser")
    const orderTimestamp = getDateTimestamp(order.startDate)

    if (!order.id || !userProfile?.id) {
      console.error('❌ Нет ID заказа или пользователя для оплаты')
      return
    }

    console.log(`💳 Обработка оплаты: метод=${paymentMethod}, баллы=${pointsUsed}`)

    // ✅ ИСПРАВЛЕНО 10.01.2026: Показываем правильную анимацию в зависимости от метода оплаты
    // Для card/sbp - анимация "Идет оплата..." с иконкой карты
    // Для cash - анимация "Подтверждаем заказ..." с иконкой монет
    if (paymentMethod === 'card' || paymentMethod === 'sbp') {
      setShowPaymentLoading(true)
    } else if (paymentMethod === 'cash') {
      setShowCashPaymentAnimation(true)
    }

    // ✅ ИСПРАВЛЕНО 10.01.2026: Для наличных НЕ ставим paid=true!
    // Оплата наличными подтверждается при получении заказа
    const isPaid = paymentMethod === 'card' || paymentMethod === 'sbp'
    const paymentStatus = isPaid ? 'paid' : 'pending'

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paid: isPaid,
          paid_at: isPaid ? new Date().toISOString() : undefined,
          status: paymentStatus,
          payment_method: paymentMethod,
          loyaltyPointsUsed: pointsUsed, // ✅ ИСПРАВЛЕНО: Передаем использованные баллы из PaymentModal
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to mark order as paid")
      }

      const data = await response.json()
      console.log('💰 Ответ от API после оплаты:', data)

      // ✅ Обновляем заказ в состоянии данными из API
      if (data.order) {
        const updatedOrderFromAPI = data.order
        
        setOrders((prev) => {
          return prev.map((o) => {
            if (getDateTimestamp(o.startDate) === orderTimestamp) {
              return {
                ...o,
                id: updatedOrderFromAPI.Id || updatedOrderFromAPI.id,
                paid: isPaid, // ✅ ИСПРАВЛЕНО: используем isPaid (только для card/sbp)
                paidAt: updatedOrderFromAPI.paid_at || updatedOrderFromAPI["Paid At"],
                paymentStatus: updatedOrderFromAPI.payment_status || paymentStatus,
                total: updatedOrderFromAPI.total || updatedOrderFromAPI.Total || 0,
                subtotal: updatedOrderFromAPI.subtotal || updatedOrderFromAPI.Subtotal || 0,
                loyaltyPointsEarned: updatedOrderFromAPI.loyalty_points_earned || 
                                     updatedOrderFromAPI["Loyalty Points Earned"] || 
                                     data.loyaltyPointsEarned || 0,
                loyaltyPointsUsed: updatedOrderFromAPI.loyalty_points_used || 
                                   updatedOrderFromAPI["Loyalty Points Used"] || 0,
              }
            }
            return o
          })
        })
      }

      // ✅ ИСПРАВЛЕНО: Обновляем профиль пользователя из API ВСЕГДА после оплаты
      // Не зависим от loyaltyPointsEarned - баланс может измениться из-за транзакций
      // ✅ НОВОЕ: Сначала пробуем использовать userProfile из ответа PATCH
      console.log('🔍 [handlePayOrder] Ответ от PATCH API:', {
        hasUserProfile: !!data.userProfile,
        userProfile: data.userProfile,
        fullData: data
      })
      
      // ✅ ИСПРАВЛЕНО 2026-01-11: Сохраняем старые баллы ДО обновления для расчета разницы
      const oldLoyaltyPoints = userProfile.loyaltyPoints || 0
      
      if (data.userProfile) {
        console.log('💰 Обновлены данные из ответа PATCH:', {
          старые_баллы: userProfile.loyaltyPoints,
          новые_баллы: data.userProfile.loyaltyPoints,
          старый_totalSpent: userProfile.totalSpent,
          новый_totalSpent: data.userProfile.totalSpent,
        })
        
        const updatedProfile = {
          ...userProfile,
          loyaltyPoints: data.userProfile.loyaltyPoints,
          totalSpent: data.userProfile.totalSpent,
        }
        setUserProfile(updatedProfile)
        
        if (user) {
          localStorage.setItem(`profile_${user}`, JSON.stringify(updatedProfile))
        }
      } else {
        // Fallback: если userProfile не пришел в ответе, делаем отдельный запрос
        try {
          const profileResponse = await fetch(`/api/orders?userId=${userProfile.id}`)
          const profileData = await profileResponse.json()
          
          if (profileData.userProfile) {
            console.log('💰 Обновлены баллы из API после оплаты (fallback):', {
              старые: userProfile.loyaltyPoints,
              новые: profileData.userProfile.loyaltyPoints,
              loyaltyPointsEarnedFromResponse: data.loyaltyPointsEarned
            })
            
            const updatedProfile = {
              ...userProfile,
              loyaltyPoints: profileData.userProfile.loyaltyPoints,
              totalSpent: profileData.userProfile.totalSpent,
            }
            setUserProfile(updatedProfile)
            
            if (user) {
              localStorage.setItem(`profile_${user}`, JSON.stringify(updatedProfile))
            }
          }
        } catch (error) {
          console.error('❌ Ошибка обновления профиля:', error)
        }
      }

      // Имитируем задержку оплаты
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // ✅ ИСПРАВЛЕНО 2026-01-11: Рассчитываем фактическую разницу баллов
      // Получаем актуальные баллы из обновленного профиля
      const newLoyaltyPoints = data.userProfile?.loyaltyPoints || userProfile.loyaltyPoints || 0
      const pointsDifference = newLoyaltyPoints - oldLoyaltyPoints
      
      // ✅ ИСПРАВЛЕНО 2026-01-13: Учитываем использованные баллы при расчете фактически начисленных
      // pointsDifference = начислено - использовано
      // actualPointsAwarded = pointsDifference + pointsUsed = начислено
      const actualPointsAwarded = pointsDifference > 0 
        ? pointsDifference + pointsUsed  // Учитываем использованные баллы
        : (data.loyaltyPointsEarned || 0)
      
      console.log('🎁 Расчет начисленных баллов:', {
        oldLoyaltyPoints,
        newLoyaltyPoints,
        pointsDifference,
        pointsUsed,
        actualPointsAwarded,
        'data.loyaltyPointsEarned': data.loyaltyPointsEarned,
        'расчет': `pointsDifference (${pointsDifference}) + pointsUsed (${pointsUsed}) = ${actualPointsAwarded}`
      })
      
      // 🔥 АВТОПРОВЕРКА: Проверяем корректность начисления баллов
      // ✅ ИСПРАВЛЕНО 2026-01-13: Используем loyaltyPointsEarned из ответа API
      // Баллы рассчитываются на бэкенде с учетом правильного процента и полной суммы заказа
      const expectedPoints = data.loyaltyPointsEarned || 0
      await checkLoyaltyPointsAwarded(debug, {
        paymentMethod,
        orderTotal: order.total || 0,
        expectedPoints,
        actualPointsAwarded,
        oldPoints: oldLoyaltyPoints,
        newPoints: newLoyaltyPoints,
        userId: userProfile.id,
        orderId: order.id || 'unknown',
      })
      
      // Скрываем loading (любой) и показываем success
      setShowPaymentLoading(false)
      setShowCashPaymentAnimation(false)
      setSuccessDialog({
        open: true,
        loyaltyPointsEarned: pointsDifference > 0 ? pointsDifference : (data.loyaltyPointsEarned || 0),
        // ✅ ИСПРАВЛЕНО 2026-01-13: Передаем undefined вместо 0, чтобы не показывать блок со списанными баллами
        loyaltyPointsUsed: pointsUsed > 0 ? pointsUsed : undefined,
        // ✅ ИСПРАВЛЕНО 10.01.2026: Для наличных баллы pending, для карты - earned
        loyaltyPointsStatus: paymentMethod === 'cash' ? 'pending' : 'earned',
      })
    } catch (error) {
      console.error("❌ Ошибка при оплате заказа:", error)
      // Скрываем обе анимации при ошибке
      setShowPaymentLoading(false)
      setShowCashPaymentAnimation(false)
      
      // ✅ ИСПРАВЛЕНО 10.01.2026: Используем WarningDialog вместо toast
      setWarningDialog({
        open: true,
        title: "Ошибка оплаты",
        description: "Не удалось оплатить заказ. Попробуйте еще раз.",
        variant: "error",
      })
    }

    setPaymentOrder(null)
  }

  const handleReviewSubmit = (orderId: string, rating: number, text: string) => {
    const user = localStorage.getItem("currentUser")
    const newReview: Review = {
      orderId,
      rating,
      text,
      createdAt: new Date().toISOString(),
    }
    setReviews((prev) => {
      const newReviews = [...prev, newReview]
      if (user) {
        localStorage.setItem(`reviews_${user}`, JSON.stringify(newReviews))
      }
      return newReviews
    })
  }

  const handleLogin = async (phone: string) => {
    // 🔒 SAFE DATA LOADING: Очищаем все кэшированные данные для этого пользователя
    // Правило: "Единственный источник правды - NocoDB"
    console.log('🧹 Очистка кэшированных данных при входе для:', phone)
    const oldOrdersKey = `orders_${phone}`
    const oldProfileKey = `profile_${phone}`
    
    // Удаляем старые заказы (они будут загружены из API)
    localStorage.removeItem(oldOrdersKey)
    console.log('✅ Очищены кэшированные заказы')
    
    // Включаем лоадеры для свежих данных
    setIsUserLoading(true)
    setIsOrdersLoading(true)
    setIsPointsLoading(true)
    
    setIsAuthenticated(true)
    setCurrentUser(phone)
    localStorage.setItem("currentUser", phone)

    const guestOrdersStr = localStorage.getItem("guest_orders")
    const savedOrders = localStorage.getItem(`orders_${phone}`)

    let userOrders: Order[] = []
    if (savedOrders) {
      userOrders = deserializeOrders(savedOrders)
    }

    let mergedCount = 0
    let conflictCount = 0

    if (guestOrdersStr) {
      const guestOrdersList = deserializeOrders(guestOrdersStr)

      guestOrdersList.forEach((guestOrder) => {
        const guestTimestamp = getDateTimestamp(guestOrder.startDate)
        const existingOrder = userOrders.find((o) => getDateTimestamp(o.startDate) === guestTimestamp)

        if (existingOrder) {
          conflictCount++
          if (!existingOrder.paid) {
            const index = userOrders.findIndex((o) => getDateTimestamp(o.startDate) === guestTimestamp)
            userOrders[index] = guestOrder
            mergedCount++
          }
        } else {
          userOrders.push(guestOrder)
          mergedCount++
        }
      })

      localStorage.removeItem("guest_orders")
    }

    setOrders(userOrders)
    // ✅ ИСПРАВЛЕНО: НЕ сохраняем в localStorage для авторизованных
    // Заказы будут загружены из API при следующей загрузке страницы
    // localStorage.setItem(`orders_${phone}`, serializeOrders(userOrders))

    // ✅ ИСПРАВЛЕНО 10.01.2026: Убрали toast "Добро пожаловать" (избыточное)
    // Пользователь и так видит свой профиль и может начать работу

    const savedReviews = localStorage.getItem(`reviews_${phone}`)
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews))
    }
    const savedProfile = localStorage.getItem(`profile_${phone}`)
    let profile: UserProfile
    
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile)
        if (parsed.address && !parsed.street) {
          parsed.street = parsed.address
          delete parsed.address
        }
        profile = parsed
      } catch {
        profile = {
          phone,
          name: "",
          street: "",
          building: "",
          loyaltyPoints: 0,
          totalSpent: 0,
        }
        localStorage.setItem(`profile_${phone}`, JSON.stringify(profile))
      }
    } else {
      profile = {
        phone,
        name: "",
        street: "",
        building: "",
        loyaltyPoints: 0,
        totalSpent: 0,
      }
      localStorage.setItem(`profile_${phone}`, JSON.stringify(profile))
    }
    
    // Проверяем, есть ли гостевой район, и переносим его в профиль
    const guestDistrict = localStorage.getItem("guest_district")
    if (guestDistrict && !profile.district) {
      console.log("🔄 Переносим гостевой район в профиль:", guestDistrict)
      profile.district = guestDistrict
      // Удаляем гостевой район после переноса
      localStorage.removeItem("guest_district")
      localStorage.removeItem("district_modal_seen")
    }

    // Создаем или обновляем пользователя в NocoDB
    console.log("🔄 Синхронизация пользователя с базой данных...", { phone, hasProfile: !!profile, district: profile.district })
    let dbUser = null
    try {
      const { fetchUserByPhone, createUser, updateUser } = await import("@/lib/nocodb")
      console.log("📡 Ищем пользователя в базе по телефону:", phone)
      dbUser = await fetchUserByPhone(phone)
      
      if (dbUser) {
        console.log("✅ Пользователь найден в базе:", dbUser.Id)
        // Пользователь существует, обновляем профиль из базы
        profile.id = dbUser.Id
        profile.name = dbUser.name || profile.name
        profile.street = dbUser.street || profile.street
        profile.building = dbUser.building || profile.building
        // Если есть район в профиле (из гостя), используем его, иначе из базы
        profile.district = profile.district || dbUser.district || dbUser.District
        profile.loyaltyPoints = typeof dbUser.loyalty_points === 'number' ? dbUser.loyalty_points : parseInt(String(dbUser.loyalty_points)) || 0
        profile.totalSpent = typeof dbUser.total_spent === 'number' ? dbUser.total_spent : parseFloat(String(dbUser.total_spent)) || 0
        console.log("✅ Профиль обновлен из базы, userProfile.id:", profile.id, "district:", profile.district)
        
        // Если у нас есть район из гостя, обновляем его в базе
        if (guestDistrict && profile.district === guestDistrict) {
          console.log("💾 Сохраняем гостевой район в базу данных")
          await updateUser(profile.id, {
            district: profile.district,
            District: profile.district,
          })
        }
      } else {
        console.log("⚠️ Пользователя нет в базе, создаем нового...")
        // Пользователя нет в базе, создаем
        const newDbUser = await createUser({
          phone,
          name: profile.name || "",
          district: profile.district,
          loyalty_points: profile.loyaltyPoints || 0,
          total_spent: profile.totalSpent || 0,
        })
        profile.id = newDbUser.Id
        dbUser = newDbUser
        console.log("✅ Пользователь создан в базе данных:", newDbUser.Id, "userProfile.id установлен:", profile.id, "с районом:", profile.district)
        
        // ВАЖНО: Устанавливаем User ID равным Id
        console.log("📝 Устанавливаем User ID =", newDbUser.Id)
        await updateUser(newDbUser.Id, {
          user_id: newDbUser.Id,
        })
      }
      
      // Сохраняем обновленный профиль в localStorage
      localStorage.setItem(`profile_${phone}`, JSON.stringify(profile))
      console.log("💾 Профиль сохранен в localStorage с id:", profile.id)
    } catch (error) {
      console.error("❌ Ошибка при синхронизации пользователя с базой:", error)
      console.error("Stack:", error instanceof Error ? error.stack : "No stack")
      // Продолжаем работу даже если не удалось синхронизировать с базой
    }
    
    console.log("👤 Устанавливаем userProfile: ID =", profile.id, "тип =", typeof profile.id)
    console.log("👤 userProfile =", JSON.stringify(profile, null, 2))
    setUserProfile(profile)

    // 🔒 SAFE DATA LOADING: Загружаем свежие данные из API
    if (profile.id) {
      console.log('📡 Загрузка данных из API после входа для userId:', profile.id)
      try {
        const response = await fetch(`/api/orders?userId=${profile.id}`)
        const data = await response.json()
        
        console.log('📦 Данные из API получены:', {
          заказов: data.orders?.length || 0,
          баллы: data.userProfile?.loyaltyPoints
        })
        
        // Обновляем профиль с актуальными баллами
        if (data.userProfile) {
          const updatedProfile = {
            ...profile,
            loyaltyPoints: data.userProfile.loyaltyPoints ?? 0,
            totalSpent: data.userProfile.totalSpent ?? 0,
          }
          setUserProfile(updatedProfile)
          localStorage.setItem(`profile_${phone}`, JSON.stringify(updatedProfile))
          console.log('✅ Профиль синхронизирован с БД после входа:', {
            id: updatedProfile.id,
            name: updatedProfile.name,
            loyaltyPoints: updatedProfile.loyaltyPoints,
            totalSpent: updatedProfile.totalSpent,
            district: updatedProfile.district,
          })
        }
        
        // Загружаем заказы из API
        if (data.orders && Array.isArray(data.orders)) {
          const mappedOrders: Order[] = data.orders
            .filter((db: any) => {
              const status = db.orderStatus || db.order_status || db["Order Status"]
              return status !== 'cancelled'
            })
            .map((db: any) => ({
              id: db.id ?? db.Id,
              orderNumber: db.orderNumber ?? db.order_number ?? db["Order Number"],
              startDate: toDate(db.startDate ?? db.start_date ?? db["Start Date"]),
              deliveryTime: db.deliveryTime ?? db.delivery_time ?? db["Delivery Time"] ?? "",
              paymentMethod: db.paymentMethod ?? db.payment_method ?? db["Payment Method"] ?? "cash",
              paid: db.paid ?? db.Paid ?? false,
              paidAt: db.paidAt ?? db.paid_at ?? db["Paid At"],
              paymentStatus: db.paymentStatus ?? db.payment_status ?? db["Payment Status"] ?? "pending",
              orderStatus: db.orderStatus ?? db.order_status ?? db["Order Status"] ?? "pending",
              total: db.total ?? db.Total ?? 0,
              subtotal: db.subtotal ?? db.Subtotal ?? 0,
              deliveryFee: db.deliveryFee ?? db.delivery_fee ?? db["Delivery Fee"] ?? 0,
              deliveryDistrict: db.deliveryDistrict ?? db.delivery_district ?? db["Delivery District"],
              deliveryAddress: db.deliveryAddress ?? db.delivery_address ?? db["Delivery Address"],
              loyaltyPointsUsed: db.loyaltyPointsUsed ?? db.loyalty_points_used ?? db["Loyalty Points Used"] ?? 0,
              loyaltyPointsEarned: db.loyaltyPointsEarned ?? db.loyalty_points_earned ?? db["Loyalty Points Earned"] ?? 0,
              persons: db.persons ?? [],
              extras: db.extras ?? [],
            }))
          
          setOrders(mappedOrders)
          console.log('✅ Заказы загружены из API после входа:', mappedOrders.length)
        }
      } catch (error) {
        console.error('❌ Ошибка загрузки данных из API:', error)
      } finally {
        // Отключаем лоадеры после загрузки
        setIsUserLoading(false)
        setIsOrdersLoading(false)
        setIsPointsLoading(false)
        console.log('✅ Загрузка данных завершена после входа')
      }
    } else {
      // Если нет id, просто отключаем лоадеры
      setIsUserLoading(false)
      setIsOrdersLoading(false)
      setIsPointsLoading(false)
    }

    setShowAuthModal(false)
    
    // ✅ ИСПРАВЛЕНО 2026-01-11: Если есть pendingCheckout, устанавливаем shouldAutoCheckout
    if (pendingCheckout) {
      console.log("✅ Есть pendingCheckout после авторизации → устанавливаем shouldAutoCheckout = true")
      setShouldAutoCheckout(true)
    }
    
    // Проверяем, есть ли у пользователя район доставки
    // Если пользователь из базы и у него есть район - используем его
    // Если нет - показываем модалку выбора района
    const userDistrict = profile.district
    
    // ✅ ИСПРАВЛЕНО: Не показываем модалку района если:
    // 1. Идет процесс оформления заказа (pendingCheckout)
    // 2. И район уже выбран (selectedDistrict)
    if (!userDistrict) {
      // Проверяем, не выбран ли район в процессе оформления
      if (pendingCheckout && selectedDistrict) {
        console.log("✅ Район уже выбран в процессе оформления:", selectedDistrict)
        // Не показываем модалку, useEffect запустит автооформление
      } else {
        console.log("⚠️ У пользователя нет района доставки, показываем модалку выбора района")
        setShowDistrictModal(true)
      }
    } else {
      console.log("✅ У пользователя уже есть район:", userDistrict)
      // Проверка профиля и автооформление теперь в useEffect
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    setOrders([])
    setUserProfile(null)
    setReviews([])
    localStorage.removeItem("currentUser")
    setView("calendar")
    const guestOrders = localStorage.getItem("guest_orders")
    if (guestOrders) {
      setOrders(deserializeOrders(guestOrders))
    }
  }

  const handleAutoCheckout = async () => {
    if (!pendingCheckout || !userProfile) {
      console.log("❌ Нет данных для автооформления")
      return
    }

    // ✅ ДОБАВЛЕНО 11.01.2026: Проверяем, есть ли уже заказ на эту дату
    // ✅ ИСПРАВЛЕНО 2026-01-13: Учитываем только активные заказы (с id, не отмененные)
    const orderDate = pendingCheckout.order.startDate
    const orderDateStr = typeof orderDate === 'string' ? orderDate : orderDate.toISOString().split('T')[0]
    
    // ✅ ИСПРАВЛЕНО 2026-01-13: Детальное логирование для отладки
    console.log(`🔍 [handleAutoCheckout] Проверка заказов на дату ${orderDateStr}`)
    console.log(`🔍 [handleAutoCheckout] Всего заказов в локальном стейте: ${orders.length}`)
    
    const existingOrderOnDate = orders.find((o) => {
      if (!o.id) return false // Черновики не учитываем
      // ✅ ИСПРАВЛЕНО 2026-01-13: Проверяем orderStatus вместо cancelled
      const orderStatus = o.orderStatus || 'pending'
      if (orderStatus === 'cancelled') return false // Отмененные заказы не учитываем
      const oDate = typeof o.startDate === 'string' ? o.startDate : o.startDate.toISOString().split('T')[0]
      
      // ✅ ИСПРАВЛЕНО 2026-01-13: Логируем каждый заказ для отладки
      if (oDate === orderDateStr) {
        console.log(`🔍 [handleAutoCheckout] Найден заказ на дату ${orderDateStr}:`, {
          orderId: o.id,
          orderNumber: o.orderNumber,
          orderStatus,
          paid: o.paid,
          startDate: oDate,
        })
      }
      
      return oDate === orderDateStr
    })

    if (existingOrderOnDate) {
      const orderStatus = existingOrderOnDate.orderStatus || 'pending'
      console.warn(`⚠️ [handleAutoCheckout] На дату ${orderDateStr} уже есть активный заказ:`, {
        orderId: existingOrderOnDate.id,
        orderNumber: existingOrderOnDate.orderNumber,
        orderStatus,
        paid: existingOrderOnDate.paid,
      })
      setWarningDialog({
        open: true,
        title: "Заказ уже существует",
        description: `На эту дату (${typeof orderDate === 'string' ? new Date(orderDate).toLocaleDateString('ru-RU') : orderDate.toLocaleDateString('ru-RU')}) у вас уже есть активный заказ. Отмените существующий заказ или выберите другую дату.`,
        variant: "warning",
      })
      // Очищаем pendingCheckout и shouldAutoCheckout
      setPendingCheckout(null)
      setShouldAutoCheckout(false)
      return
    }
    
    console.log(`✅ [handleAutoCheckout] На дату ${orderDateStr} нет активного заказа, можно создавать`)

    // ✅ ДОБАВЛЕНО 10.01.2026: Показываем анимацию во время автооформления
    setShowOrderLoading(true)

    try {
      console.log("🚀 Автооформление заказа после авторизации")
      
      // ✅ DEBUG RECORDER: Логируем начало автооформления
      debug.log("🚀 START handleAutoCheckout", {
        userId: userProfile?.id,
        userEmail: userProfile?.email,
        hasPendingCheckout: !!pendingCheckout,
        pendingCheckoutData: {
          orderPersonsCount: pendingCheckout?.order?.persons?.length || 0,
          orderSubtotal: pendingCheckout?.order?.subtotal,
          orderTotal: pendingCheckout?.order?.total,
          pendingTotal: pendingCheckout?.total
        }
      })
      
      // ✅ ДОБАВЛЕНО 2026-01-11: КРИТИЧЕСКОЕ ЛОГИРОВАНИЕ pendingCheckout
      console.log("📦 [handleAutoCheckout] pendingCheckout:", {
        hasPendingCheckout: !!pendingCheckout,
        orderPersonsCount: pendingCheckout?.order?.persons?.length || 0,
        orderPersons: pendingCheckout?.order?.persons?.map(p => ({
          id: p.id,
          hasDay1: !!p.day1,
          hasDay2: !!p.day2,
        })),
        orderSubtotal: pendingCheckout?.order?.subtotal,
        orderTotal: pendingCheckout?.order?.total,
        pendingTotal: pendingCheckout?.total
      })
      
      // Получаем район для расчета доставки
      const district = userProfile.district
      
      if (!district) {
        console.error("❌ Район не указан")
        // ✅ DEBUG RECORDER: Захватываем ошибку отсутствия района
        await debug.captureError({
          errorMessage: "Район не указан при автооформлении",
          data: { userId: userProfile?.id, userEmail: userProfile?.email }
        })
        // ✅ ДОБАВЛЕНО 10.01.2026: Скрываем анимацию при ошибке
        setShowOrderLoading(false)
        // ✅ ИСПРАВЛЕНО 10.01.2026: Заменили toast на WarningDialog
        setWarningDialog({
          open: true,
          title: "Ошибка",
          description: "Район доставки не указан. Укажите район в профиле.",
          variant: "error",
        })
        return
      }
      
      // Загружаем зоны доставки для расчета стоимости
      const { fetchDeliveryZones, calculateDeliveryFee } = await import("@/lib/nocodb")
      const zones = await fetchDeliveryZones()
      
      // Рассчитываем стоимость доставки
      const deliveryFee = await calculateDeliveryFee(district, pendingCheckout.order.subtotal || pendingCheckout.total, zones)
      
      console.log(`💰 Стоимость доставки: ${deliveryFee}₽ для района "${district}"`)
      debug.log(`💰 Delivery fee calculated: ${deliveryFee}₽`, { district, subtotal: pendingCheckout.order.subtotal || pendingCheckout.total })
      
      // 🔥 АВТОПРОВЕРКА: Проверяем корректность расчёта суммы
      const subtotal = pendingCheckout.order.subtotal || pendingCheckout.total
      const totalWithDelivery = subtotal + deliveryFee
      await checkOrderTotal(debug, {
        subtotal,
        deliveryFee,
        total: totalWithDelivery,
        userId: userProfile.id,
      })
      
      // ВАЖНО: Заказ уже был создан в OrderModal, ищем его в списке orders
      // Берем последний заказ пользователя (который только что был создан)
      const lastOrder = orders.length > 0 ? orders[orders.length - 1] : null
      
      console.log("🔍 Последний заказ: id =", lastOrder?.id, "paid =", lastOrder?.paid, "тип =", typeof lastOrder?.id, "ordersLength =", orders.length)
      
      // ✅ ИСПРАВЛЕНО 2026-01-12: Если последний заказ оплачен ИЛИ для другой даты, создаем НОВЫЙ заказ
      const shouldCreateNewOrder = !lastOrder || lastOrder.paid || lastOrder.startDate !== pendingCheckout.order.startDate
      
      // Обновляем заказ с данными доставки и адреса
      const updatedOrder: Order = {
        ...(shouldCreateNewOrder ? pendingCheckout.order : lastOrder),
        deliveryFee,
        deliveryDistrict: district,
        deliveryAddress: `${userProfile.street}, ${userProfile.building}${userProfile.apartment ? ', кв. ' + userProfile.apartment : ''}`,
        subtotal: pendingCheckout.order.subtotal || pendingCheckout.total,
        total: (pendingCheckout.order.subtotal || pendingCheckout.total) + deliveryFee,
      }
      
      // ✅ ИСПРАВЛЕНО: Удаляем paymentMethod и ID при создании нового заказа
      // Способ оплаты должен устанавливаться только при реальной оплате в PaymentModal
      if (shouldCreateNewOrder) {
        delete updatedOrder.id
        delete updatedOrder.paymentMethod
        delete updatedOrder.paid
        delete updatedOrder.paidAt
        console.log("🔧 Создаем НОВЫЙ заказ (предыдущий оплачен или не существует)")
      }
      
      console.log("📦 Обновленный заказ: id =", updatedOrder.id, "тип =", typeof updatedOrder.id, "total =", updatedOrder.total)
      
      // ✅ ДОБАВЛЕНО 2026-01-11: Проверка persons перед отправкой в API
      console.log("👥 Проверка persons:", {
        personsCount: updatedOrder.persons?.length || 0,
        personsEmpty: !updatedOrder.persons || updatedOrder.persons.length === 0,
        personsData: updatedOrder.persons?.map(p => ({
          id: p.id,
          hasDay1: !!p.day1,
          hasDay2: !!p.day2,
          day1Meals: p.day1 ? {
            hasBreakfast: !!p.day1.breakfast?.dish,
            hasLunch: !!(p.day1.lunch?.salad || p.day1.lunch?.soup || p.day1.lunch?.main),
            hasDinner: !!(p.day1.dinner?.salad || p.day1.dinner?.soup || p.day1.dinner?.main),
          } : null
        }))
      })
      
      // 🔥 АВТОПРОВЕРКА: Проверяем корректность данных заказа перед отправкой
      await checkOrderData(debug, {
        order: updatedOrder,
        userId: userProfile.id,
      })
      
      if (!updatedOrder.persons || updatedOrder.persons.length === 0) {
        console.error("❌ КРИТИЧЕСКАЯ ОШИБКА: persons пуст при автооформлении!")
        // ✅ DEBUG RECORDER: Захватываем критическую ошибку с пустым persons
        await debug.captureError({
          errorMessage: "CRITICAL: persons пуст при автооформлении",
          data: {
            updatedOrder,
            pendingCheckout,
            lastOrder,
            shouldCreateNewOrder
          }
        })
        setShowOrderLoading(false)
        setWarningDialog({
          open: true,
          title: "Ошибка создания заказа",
          description: "Не удалось создать заказ: отсутствуют данные о блюдах. Пожалуйста, попробуйте снова.",
          variant: "error",
        })
        setPendingCheckout(null)
        setShouldAutoCheckout(false)
        return
      }
      
      // ВАЖНО: Если у заказа НЕТ ID - это значит он был создан для неавторизованного пользователя
      // Теперь пользователь авторизован, нужно СОЗДАТЬ заказ в БД!
      if (!updatedOrder.id) {
        console.log("🆕 Заказ без ID - создаем его в API для авторизованного пользователя")
        
        // ✅ DEBUG RECORDER: Логируем payload перед отправкой
        const createOrderPayload = { order: updatedOrder, userId: userProfile.id }
        debug.log("📤 POST /api/orders PAYLOAD:", createOrderPayload)
        
        try {
          const response = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(createOrderPayload),
          })
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
            console.error("❌ Ошибка при создании заказа:", errorData)
            
            // ✅ ИСПРАВЛЕНО 2026-01-13: Показываем понятное сообщение, если заказ уже существует
            if (errorData.error === "Order already exists for this date" || errorData.error === "Duplicate order date" || errorData.details) {
              const orderDate = typeof updatedOrder.startDate === 'string' 
                ? updatedOrder.startDate 
                : updatedOrder.startDate.toISOString().split('T')[0]
              
              // ✅ ИСПРАВЛЕНО 2026-01-13: Формируем детальное сообщение с номером заказа
              let description = errorData.details || `На эту дату (${typeof updatedOrder.startDate === 'string' ? new Date(updatedOrder.startDate).toLocaleDateString('ru-RU') : updatedOrder.startDate.toLocaleDateString('ru-RU')}) у вас уже есть заказ.`
              
              if (errorData.existingOrderNumber) {
                description += ` Номер заказа: ${errorData.existingOrderNumber}.`
              }
              
              description += " Отмените существующий заказ или выберите другую дату."
              
              setShowOrderLoading(false)
              setWarningDialog({
                open: true,
                title: "Заказ уже существует",
                description,
                variant: "warning",
              })
              
              // ✅ ИСПРАВЛЕНО 2026-01-13: Если есть existingOrderId, загружаем заказы чтобы показать существующий
              if (errorData.existingOrderId) {
                console.log(`🔄 Загружаем заказы для отображения существующего заказа #${errorData.existingOrderId}`)
                // Загружаем заказы пользователя, чтобы существующий заказ отобразился в календаре
                try {
                  const ordersResponse = await fetch(`/api/orders?userId=${userProfile.id}`)
                  if (ordersResponse.ok) {
                    const ordersData = await ordersResponse.json()
                    if (ordersData.orders) {
                      setOrders(ordersData.orders)
                      console.log(`✅ Заказы загружены, найден заказ #${errorData.existingOrderId}`)
                    }
                  }
                } catch (error) {
                  console.error("❌ Ошибка при загрузке заказов:", error)
                }
              }
              
              // Очищаем pending checkout
              setPendingCheckout(null)
              setShouldAutoCheckout(false)
              return
            }
            
            // ✅ DEBUG RECORDER: Захватываем ошибку API
            await debug.captureError({
              errorMessage: `API Error: POST /api/orders (${response.status})`,
              data: {
                status: response.status,
                errorData,
                payload: createOrderPayload
              }
            })
            
            // ✅ ИСПРАВЛЕНО 2026-01-13: Сохраняем errorData в error для доступа в catch
            const errorWithData = new Error(errorData.error || "Failed to create order")
            ;(errorWithData as any).data = errorData
            throw errorWithData
          }
          
          const result = await response.json()
          console.log("✅ Результат создания заказа в API:", result)
          debug.log("✅ Order created successfully", { orderId: result.orderId, orderNumber: result.orderNumber })
          
          // Обновляем заказ с ID из API
          updatedOrder.id = result.orderId
          updatedOrder.orderNumber = result.orderNumber || `ORD-${Date.now()}`
          
          console.log("✅ Заказ создан в БД с ID:", updatedOrder.id)
          
          // ✅ ДОБАВЛЯЕМ заказ в локальный стейт, чтобы он сразу отобразился в календаре
          setOrders(prev => [...prev, updatedOrder])
          console.log("📅 Заказ добавлен в календарь")
        } catch (error: any) {
          console.error("❌ Не удалось создать заказ в БД:", error)
          
          // ✅ ИСПРАВЛЕНО 2026-01-13: Проверяем, не является ли это ошибкой дубликата
          if (error.message && (error.message.includes("Order already exists") || error.message.includes("Duplicate order date"))) {
            const orderDate = typeof updatedOrder.startDate === 'string' 
              ? updatedOrder.startDate 
              : updatedOrder.startDate.toISOString().split('T')[0]
            
            // ✅ ИСПРАВЛЕНО 2026-01-13: Пытаемся извлечь информацию о существующем заказе из error
            let description = `На эту дату (${typeof updatedOrder.startDate === 'string' ? new Date(updatedOrder.startDate).toLocaleDateString('ru-RU') : updatedOrder.startDate.toLocaleDateString('ru-RU')}) у вас уже есть заказ.`
            
            // Пытаемся найти информацию о заказе в error.data или error
            const errorData = (error as any).data || (error as any)
            if (errorData?.existingOrderNumber) {
              description += ` Номер заказа: ${errorData.existingOrderNumber}.`
            }
            
            description += " Отмените существующий заказ или выберите другую дату."
            
            setShowOrderLoading(false)
            setWarningDialog({
              open: true,
              title: "Заказ уже существует",
              description,
              variant: "warning",
            })
            
            // ✅ ИСПРАВЛЕНО 2026-01-13: Загружаем заказы для отображения существующего
            if (errorData?.existingOrderId) {
              console.log(`🔄 Загружаем заказы для отображения существующего заказа #${errorData.existingOrderId}`)
              try {
                const ordersResponse = await fetch(`/api/orders?userId=${userProfile.id}`)
                if (ordersResponse.ok) {
                  const ordersData = await ordersResponse.json()
                  if (ordersData.orders) {
                    setOrders(ordersData.orders)
                    console.log(`✅ Заказы загружены, найден заказ #${errorData.existingOrderId}`)
                  }
                }
              } catch (fetchError) {
                console.error("❌ Ошибка при загрузке заказов:", fetchError)
              }
            }
            
            // Очищаем pending checkout
            setPendingCheckout(null)
            setShouldAutoCheckout(false)
            return
          }
          
          // ✅ DEBUG RECORDER: Захватываем общую ошибку создания заказа
          await debug.captureError({
            errorMessage: `Failed to create order: ${error.message}`,
            data: {
              error: error.toString(),
              payload: createOrderPayload,
              stack: error.stack
            }
          })
          
          // ✅ ДОБАВЛЕНО 10.01.2026: Скрываем анимацию при ошибке создания заказа
          setShowOrderLoading(false)
          throw error
        }
      } else {
        console.log("🔄 Заказ с ID - обновляем его в БД")
        await handleSaveOrder(updatedOrder)
      }
      
      console.log("🎯 Открываем PaymentModal: orderId =", updatedOrder.id, "userId =", userProfile.id)
      debug.log("🎯 Opening PaymentModal", { orderId: updatedOrder.id, total: (pendingCheckout.order.subtotal || pendingCheckout.total) + deliveryFee })
      
      // ✅ ДОБАВЛЕНО 10.01.2026: Скрываем анимацию загрузки перед открытием PaymentModal
      setShowOrderLoading(false)
      
      // Показываем модалку оплаты с обновленной суммой
      setPaymentOrder({ 
        order: updatedOrder, 
        total: (pendingCheckout.order.subtotal || pendingCheckout.total) + deliveryFee,
        isNewOrder: true // ✅ Помечаем как новый заказ для удаления при отмене
      })
      
      // Очищаем pending checkout
      setPendingCheckout(null)
      setShouldAutoCheckout(false)
      
      // ✅ ИСПРАВЛЕНО 10.01.2026: Убрали toast "Заказ оформлен" (избыточное)
      // Пользователь сразу видит PaymentModal
      
    } catch (error: any) {
      console.error("❌ Ошибка при автооформлении заказа:", error)
      
      // ✅ ИСПРАВЛЕНО 2026-01-13: Проверяем, не является ли это ошибкой дубликата
      if (error.message && (error.message.includes("Order already exists") || error.message.includes("Duplicate order date"))) {
        const orderDate = pendingCheckout?.order?.startDate
          ? (typeof pendingCheckout.order.startDate === 'string' 
              ? pendingCheckout.order.startDate 
              : pendingCheckout.order.startDate.toISOString().split('T')[0])
          : 'неизвестная дата'
        
        // ✅ ИСПРАВЛЕНО 2026-01-13: Пытаемся извлечь информацию о существующем заказе из error
        let description = `На эту дату (${orderDate !== 'неизвестная дата' ? new Date(orderDate).toLocaleDateString('ru-RU') : orderDate}) у вас уже есть заказ.`
        
        const errorData = (error as any).data || (error as any)
        if (errorData?.existingOrderNumber) {
          description += ` Номер заказа: ${errorData.existingOrderNumber}.`
        }
        
        description += " Отмените существующий заказ или выберите другую дату."
        
        setShowOrderLoading(false)
        setWarningDialog({
          open: true,
          title: "Заказ уже существует",
          description,
          variant: "warning",
        })
        
        // ✅ ИСПРАВЛЕНО 2026-01-13: Загружаем заказы для отображения существующего
        if (errorData?.existingOrderId && userProfile?.id) {
          console.log(`🔄 Загружаем заказы для отображения существующего заказа #${errorData.existingOrderId}`)
          try {
            const ordersResponse = await fetch(`/api/orders?userId=${userProfile.id}`)
            if (ordersResponse.ok) {
              const ordersData = await ordersResponse.json()
              if (ordersData.orders) {
                setOrders(ordersData.orders)
                console.log(`✅ Заказы загружены, найден заказ #${errorData.existingOrderId}`)
              }
            }
          } catch (fetchError) {
            console.error("❌ Ошибка при загрузке заказов:", fetchError)
          }
        }
        
        // Очищаем pending checkout
        setPendingCheckout(null)
        setShouldAutoCheckout(false)
        return
      }
      
      // ✅ DEBUG RECORDER: Захватываем любую необработанную ошибку
      await debug.captureError({
        errorMessage: `Unhandled error in handleAutoCheckout: ${error.message || error}`,
        data: {
          error: error.toString(),
          stack: error.stack,
          pendingCheckout,
          userProfile: { id: userProfile?.id, email: userProfile?.email, district: userProfile?.district }
        }
      })
      
      // ✅ ДОБАВЛЕНО 10.01.2026: Скрываем анимацию при ошибке
      setShowOrderLoading(false)
      // ✅ ИСПРАВЛЕНО 10.01.2026: Заменили toast на WarningDialog
      setWarningDialog({
        open: true,
        title: "Ошибка оформления",
        description: "Не удалось оформить заказ. Попробуйте еще раз.",
        variant: "error",
      })
    }
  }

  const handleProfileSave = async (profile: UserProfile) => {
    console.log("💾 handleProfileSave: ID =", profile.id, "тип =", typeof profile.id)
    console.log("💾 handleProfileSave: profile =", JSON.stringify(profile, null, 2))
    setUserProfile(profile)
    
    // Сохраняем профиль в localStorage
    if (currentUser) {
      localStorage.setItem(`profile_${currentUser}`, JSON.stringify(profile))
    }
    
    // Обновляем профиль в базе данных
    if (profile.id && typeof profile.id === 'number' && profile.id > 0) {
      try {
        const { updateUser } = await import("@/lib/nocodb")
        await updateUser(profile.id, {
          name: profile.name,
          street: profile.street,
          building: profile.building,
          buildingSection: profile.buildingSection,
          apartment: profile.apartment,
          entrance: profile.entrance,
          floor: profile.floor,
          intercom: profile.intercom,
          district: profile.district,
          deliveryComment: profile.deliveryComment,
          additionalPhone: profile.additionalPhone,
        })
        console.log("✅ Профиль обновлен в базе данных для пользователя ID:", profile.id)
      } catch (error) {
        console.error("❌ Ошибка при обновлении профиля в БД:", error)
        // Не блокируем процесс, продолжаем работу
      }
    } else {
      console.log("⚠️ У профиля нет валидного ID, пропускаем обновление в БД")
    }
    
    // Закрываем модалку профиля
    // useEffect сам запустит handleAutoCheckout после обновления профиля
    if (shouldAutoCheckout && pendingCheckout) {
      console.log("✅ Профиль заполнен, закрываем модалку. useEffect запустит автооформление")
      setShowProfile(false)
    } else {
      // Обычный режим - закрываем сразу
      setShowProfile(false)
    }
  }

  const handleDistrictSelected = async (district: string) => {
    try {
      console.log("💾 Сохраняем выбранный район:", district)
      setSelectedDistrict(district) // Сохраняем в локальном состоянии
      
      // ✅ НОВОЕ: Если есть pendingCheckout, это процесс оформления
      // Сохраняем район и возвращаемся в OrderModal для выбора времени и оплаты
      if (pendingCheckout) {
        console.log("✅ Район выбран в процессе оформления, возвращаемся в OrderModal")
        
        // Обновляем заказ с районом
        const updatedOrder: Order = {
          ...pendingCheckout.order,
          deliveryDistrict: district,
        }
        
        setPendingCheckout({
          order: updatedOrder,
          total: pendingCheckout.total,
        })
        
        // Если авторизован - сохраняем район в профиль
        if (currentUser && userProfile) {
          const updatedProfile = {
            ...userProfile,
            district: district,
          }
          
          // Обновляем в базе данных
          if (userProfile.id && typeof userProfile.id === 'number' && userProfile.id > 0) {
            try {
              const { updateUser } = await import("@/lib/nocodb")
              await updateUser(userProfile.id, {
                district: district,
                District: district,
              })
              console.log("✅ Район сохранен в БД для пользователя ID:", userProfile.id)
            } catch (error) {
              console.error("❌ Ошибка при обновлении района в БД:", error)
            }
          }
          
          localStorage.setItem(`profile_${currentUser}`, JSON.stringify(updatedProfile))
          setUserProfile(updatedProfile)
          console.log("✅ Район сохранен в профиле:", district)
        } else {
          // Для гостей сохраняем в localStorage
          localStorage.setItem("guest_district", district)
          console.log("✅ Район сохранен для гостя:", district)
        }
        
        setShowDistrictModal(false)
        
        // ✅ ИСПРАВЛЕНО 2026-01-13: Для гостя устанавливаем shouldAutoCheckout и открываем AuthModal
        if (!currentUser) {
          console.log("👤 Гость выбрал район → устанавливаем shouldAutoCheckout и открываем AuthModal")
          setShouldAutoCheckout(true) // ✅ КРИТИЧНО: Без этого ProfileModal не откроется!
          setShowAuthModal(true)
        } else {
          // Для авторизованного - открываем обратно OrderModal
          console.log("✅ Авторизованный пользователь выбрал район → возвращаемся в OrderModal")
          setSelectedDate(toDate(pendingCheckout.order.startDate))
        }
        return
      }
      
      // Если пользователь авторизован - тихо обновляем профиль (обычный режим, не checkout)
      if (currentUser && userProfile) {
        // ✅ ТИХОЕ обновление профиля (без уведомлений)
        const updatedProfile = {
          ...userProfile,
          district: district,
        }

        // Обновляем в базе данных
        if (userProfile.id && typeof userProfile.id === 'number' && userProfile.id > 0) {
          try {
            const { updateUser } = await import("@/lib/nocodb")
            await updateUser(userProfile.id, {
              district: district,
              District: district,
            })
            console.log("✅ Район тихо обновлен в БД для пользователя ID:", userProfile.id)
          } catch (error) {
            console.error("❌ Ошибка при обновлении района в БД:", error)
          }
        }

        localStorage.setItem(`profile_${currentUser}`, JSON.stringify(updatedProfile))
        setUserProfile(updatedProfile)
        console.log("✅ Район тихо сохранен в профиле:", district)
      } else {
        // Пользователь НЕ авторизован - сохраняем как гостевой район
        localStorage.setItem("guest_district", district)
        localStorage.setItem("district_modal_seen", "true")
        console.log("✅ Район сохранен для гостя:", district)
      }

      setShowDistrictModal(false)
    } catch (error) {
      console.error("❌ Ошибка при сохранении района:", error)
      setWarningDialog({
        open: true,
        title: "Ошибка сохранения",
        description: "Не удалось сохранить район. Попробуйте еще раз.",
        variant: "error",
      })
    }
  }

  // ✅ ИСПРАВЛЕНО 2026-01-13: Приоритет черновику над существующим заказом
  const existingOrder = selectedDate
    ? (draftOrder && getDateTimestamp(draftOrder.startDate) === getDateTimestamp(selectedDate)
        ? draftOrder // Черновик имеет приоритет
        : orders.find((o) => {
            const orderStartDate = new Date(o.startDate)
            orderStartDate.setHours(0, 0, 0, 0)

            const checkDate = new Date(selectedDate)
            checkDate.setHours(0, 0, 0, 0)

            return orderStartDate.getTime() === checkDate.getTime()
          }))
    : undefined

  const availableDates = getAvailableDates()

  // Handler for dish click from FreshSection
  const handleDishClick = (dish: { name: string; image: string; price: number; description?: string }) => {
    // Get available dates and pick a random one (or first available)
    const dates = getAvailableDatesForOrdering()
    if (dates.length > 0) {
      // Pick a random date from available dates
      const randomIndex = Math.floor(Math.random() * dates.length)
      const selectedDate = dates[randomIndex].date
      setSelectedDish({ dish, availableDate: selectedDate })
    } else {
      showWarning(
        "Нет доступных дат",
        "К сожалению, сейчас нет доступных дат для заказа. Попробуйте позже.",
        "info"
      )
    }
  }

  // Handler for "Go to Order" button in DishSmartModal
  const handleGoToOrder = (date: Date) => {
    // Scroll to calendar section
    const calendarElement = document.getElementById("calendar-section")
    if (calendarElement) {
      calendarElement.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    
    // Set selected date and open order modal
    setTimeout(() => {
      setSelectedDate(date)
    }, 300) // Small delay for smooth scroll
  }

  // Handler for "Open Existing Order" button
  const handleOpenExistingOrder = (date: Date) => {
    setSelectedDate(date)
  }

  return (
    <div className="min-h-screen bg-background">
      <Preloader />
      <div className="bg-white px-4 pt-12 pb-6 border-b border-gray-200 safe-area-top">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-md">
              <Image 
                src="/logo-small.png" 
                alt="OGFooDY Logo" 
                width={56} 
                height={56} 
                className="rounded-full object-cover"
                priority
              />
            </div>
            <div>
              <h1 className="text-2xl font-black text-black tracking-tight">OGFooDY</h1>
              <p className="text-black/80 text-xs font-bold">домашняя еда на каждый день</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <AppMenu userPhone={currentUser || ""} />
            {isAuthenticated ? (
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-black hover:bg-muted border-0" data-testid="logout-btn">
                <LogOut className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="text-black hover:bg-muted border-0"
                data-testid="login-btn"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Войти
              </Button>
            )}
          </div>
        </div>
        {isAuthenticated ? (
          isUserLoading || isPointsLoading ? (
            // ✅ SAFE DATA LOADING: Skeleton пока грузятся данные
            <UserProfileHeaderSkeleton />
          ) : (
            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-2 text-black bg-muted rounded-xl px-3 py-2 w-full hover:bg-muted/80 transition-colors shadow-sm"
            >
              <User className="w-4 h-4" />
              <span className="text-sm font-bold flex-1 text-left">{userProfile?.name || currentUser}</span>
              {userProfile && (
                <span className="text-xs bg-[#9D00FF] text-white px-2 py-0.5 rounded-lg font-black">{userProfile.loyaltyPoints || 0} баллов</span>
              )}
            </button>
          )
        ) : (
          <div className="flex items-center gap-2 text-black bg-muted rounded-xl px-3 py-2 w-full shadow-sm">
            <User className="w-4 h-4" />
            <span className="text-sm font-bold">Гость</span>
            <span className="text-xs text-black/70 ml-auto font-medium">Войдите для оформления заказа</span>
          </div>
        )}
      </div>

      <div className="px-4 py-4 -mt-4 bg-background rounded-t-3xl relative z-10">
        <p className="text-muted-foreground text-sm mb-4">
          {view === "calendar" ? "Выберите дату для заказа" : "История ваших заказов"}
        </p>

        <div className="mb-4 flex gap-2">
          <Button
            variant={view === "calendar" ? "default" : "outline"}
            onClick={() => setView("calendar")}
            className="flex-1"
            data-testid="view-calendar-btn"
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Календарь
          </Button>
          <Button
            variant={view === "history" ? "default" : "outline"}
            onClick={() => setView("history")}
            className="flex-1"
            disabled={!isAuthenticated}
            data-testid="view-history-btn"
          >
            <History className="w-4 h-4 mr-2" />
            История
          </Button>
        </div>

        {view === "calendar" ? (
          <>
            {/* ✅ ДОБАВЛЕНО 10.01.2026: Информационный баннер */}
            {showInfoBanner && (
              <InfoBanner
                isAuthenticated={isAuthenticated}
                onAuthClick={() => setShowAuthModal(true)}
                onClose={() => setShowInfoBanner(false)}
              />
            )}

            {/* Daily Status Widget */}
            <div className="mb-6">
              <DailyStatus
                orders={orders}
                onOrderClick={() => {
                  // Find the next available date for ordering
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  const nextAvailable = availableDates.find((date) => {
                    const checkDate = new Date(date)
                    checkDate.setHours(0, 0, 0, 0)
                    return checkDate.getTime() >= today.getTime()
                  })
                  if (nextAvailable) {
                    handleDateClick(nextAvailable)
                  } else {
                    showWarning(
                      "Нет доступных дат",
                      "К сожалению, сейчас нет доступных дат для заказа. Попробуйте позже.",
                      "info"
                    )
                  }
                }}
                onFoodCardClick={() => {
                  // Open today's menu/order modal
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  
                  // Check if there's an order for today (delivery day)
                  const todayOrder = orders.find((order) => {
                    const orderDate = new Date(order.startDate)
                    orderDate.setHours(0, 0, 0, 0)
                    return orderDate.getTime() === today.getTime()
                  })
                  
                  // If there's an order for today, open it directly
                  if (todayOrder) {
                    setSelectedDate(today)
                  } else {
                    // If there's food today but no order, we still want to show the modal
                    // Find the order that provides food for today
                    const foodOrder = orders.find((order) => {
                      const deliveryDate = new Date(order.startDate)
                      deliveryDate.setHours(0, 0, 0, 0)
                      
                      const day1 = new Date(deliveryDate)
                      day1.setDate(day1.getDate() + 1)
                      
                      const day2 = new Date(deliveryDate)
                      day2.setDate(day2.getDate() + 2)
                      
                      return today.getTime() === day1.getTime() || today.getTime() === day2.getTime()
                    })
                    
                    // Open today's date - the modal should handle showing the food
                    setSelectedDate(today)
                  }
                }}
              />
            </div>

            {/* Calendar */}
            <div id="calendar-section" className="mb-8 relative">
              {/* 🎯 UX УЛУЧШЕНИЕ: Анимированный указатель для гостей */}
              {!isAuthenticated && !selectedDate && (
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                  <div className="bg-[#FFEA00] border-2 border-black px-4 py-2 rounded-lg shadow-brutal animate-bounce">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      <span className="font-black text-sm whitespace-nowrap">Выберите дату здесь ↓</span>
                    </div>
                  </div>
                </div>
              )}
              
              <Calendar
                orders={orders}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                onDateClick={handleDateClick}
                onMoveOrder={handleMoveOrder}
              />
            </div>

            {/* СВЕЖАК Section */}
            <FreshSection onDishClick={handleDishClick} />
          </>
        ) : (
          // ✅ SAFE DATA LOADING: Показываем skeleton пока грузятся заказы
          isOrdersLoading ? (
            <OrderHistorySkeleton />
          ) : (
            <OrderHistory
              orders={orders}
              onCancelOrder={handleCancelOrder}
              onRepeatOrder={handleRepeatOrder}
              onPayOrder={handlePayOrder}
              onReviewOrder={(order) => setReviewOrder(order)}
              availableDates={availableDates}
              userProfile={userProfile}
              reviews={reviews}
            />
          )
        )}
      </div>

      <OrderModal
        key={`order-${selectedDate?.getTime()}-${existingOrder?.id}-${existingOrder?.paid}-${existingOrder?.total}-${existingOrder?.loyaltyPointsEarned}`}
        date={selectedDate || new Date()}
        existingOrder={existingOrder}
        onClose={() => {
          setSelectedDate(null)
          setDraftOrder(null) // ✅ Очищаем черновик при закрытии
        }}
        onSave={handleSaveOrder}
        onCancel={handleCancelOrder}
        allOrders={orders}
        open={!!selectedDate}
        isDataLoading={isUserLoading || isOrdersLoading || isPointsLoading}
        onPaymentSuccess={async (order) => {
          // ❌ УДАЛЕНО: клиентский расчет баллов
          // ✅ НОВОЕ: Обновляем данные из API
          if (userProfile?.id) {
            try {
              console.log('💰 Обновляю данные после успешной оплаты...')
              const response = await fetch(`/api/orders?userId=${userProfile.id}`)
              const data = await response.json()
              
              if (data.userProfile) {
                const newLoyaltyPoints = typeof data.userProfile.loyaltyPoints === 'number' 
                  ? data.userProfile.loyaltyPoints 
                  : parseInt(String(data.userProfile.loyaltyPoints)) || 0
                
                console.log('💰 Обновлены баллы из API:', {
                  старые: userProfile.loyaltyPoints,
                  новые: newLoyaltyPoints,
                  тип: typeof newLoyaltyPoints
                })
                
                const updatedProfile = {
                  ...userProfile,
                  loyaltyPoints: newLoyaltyPoints,
                  totalSpent: data.userProfile.totalSpent,
                }
                console.log('💾 Вызываем setUserProfile с новыми баллами:', updatedProfile.loyaltyPoints)
                setUserProfile(updatedProfile)
                console.log('✅ setUserProfile вызван успешно')
                const user = localStorage.getItem("currentUser")
                if (user) {
                  localStorage.setItem(`profile_${user}`, JSON.stringify(updatedProfile))
                  console.log('💾 Профиль сохранен в localStorage')
                }
              }
              
              // Обновляем список заказов
              if (data.orders) {
                const mappedOrders: Order[] = data.orders
                  .filter((db: any) => {
                    const status = db.orderStatus || db.order_status || db["Order Status"]
                    return status !== 'cancelled'
                  })
                  .map((db: any) => ({
                    id: db.id ?? db.Id,
                    orderNumber: db.orderNumber ?? db.order_number ?? db["Order Number"],
                    startDate: toDate(db.startDate ?? db.start_date ?? db["Start Date"]),
                    deliveryTime: db.deliveryTime ?? db.delivery_time ?? db["Delivery Time"] ?? "",
                    paymentMethod: db.paymentMethod ?? db.payment_method ?? db["Payment Method"] ?? "cash",
                    paid: db.paid ?? db.Paid ?? false,
                    paidAt: db.paidAt ?? db.paid_at ?? db["Paid At"],
                    paymentStatus: db.paymentStatus ?? db.payment_status ?? db["Payment Status"] ?? "pending",
                    orderStatus: db.orderStatus ?? db.order_status ?? db["Order Status"] ?? "pending",
                    total: db.total ?? db.Total ?? 0,
                    subtotal: db.subtotal ?? db.Subtotal ?? 0,
                    loyaltyPointsUsed: db.loyaltyPointsUsed ?? db.loyalty_points_used ?? db["Loyalty Points Used"] ?? 0,
                    loyaltyPointsEarned: db.loyaltyPointsEarned ?? db.loyalty_points_earned ?? db["Loyalty Points Earned"] ?? 0,
                    persons: db.persons ?? [],
                    extras: db.extras ?? [],
                  }))
                setOrders(mappedOrders)
                console.log('✅ Заказы обновлены из API')
              }
            } catch (error) {
              console.error('❌ Ошибка обновления данных после оплаты:', error)
            }
          }
          
          const deliveryDate = new Date(order.startDate).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })
          const description = order.paymentMethod === "cash"
            ? `Доставка ${deliveryDate} в ${order.deliveryTime}. Оплата наличными курьеру.`
            : `Оплата прошла успешно. Доставка ${deliveryDate} в ${order.deliveryTime}.`
          
          showWarning(
            "Заказ оформлен",
            description,
            "info"
          )
        }}
        userLoyaltyPoints={userProfile?.loyaltyPoints || 0}
        isAuthenticated={isAuthenticated}
        onRequestAuth={(order, total) => {
          const hasDistrict = userProfile?.district || localStorage.getItem("guest_district")
          
          console.log("🔐 Запрос оформления заказа:", { 
            isAuthenticated, 
            hasDistrict: !!hasDistrict,
            userDistrict: userProfile?.district,
            guestDistrict: localStorage.getItem("guest_district")
          })
          
          // ✅ ДОБАВЛЕНО 2026-01-11: КРИТИЧЕСКОЕ ЛОГИРОВАНИЕ
          console.log("🔍 [onRequestAuth] Получен order:", {
            hasOrder: !!order,
            orderType: typeof order,
            personsCount: order?.persons?.length || 0,
            persons: order?.persons?.map(p => ({
              id: p.id,
              hasDay1: !!p.day1,
              hasDay2: !!p.day2,
            })) || [],
            subtotal: order?.subtotal,
            total: order?.total,
            receivedTotal: total
          })
          
          if (!order) {
            console.error("❌ [onRequestAuth] order is undefined!")
            return
          }
          
          setPendingCheckout({ order, total })
          console.log("💾 [onRequestAuth] Сохранен pendingCheckout с persons:", order.persons?.length || 0)
          setSelectedDate(null) // Закрываем OrderModal
          
          // ✅ ИСПРАВЛЕНО 2026-01-11: Для гостей ВСЕГДА показываем выбор района
          // (даже если район сохранен - пусть подтвердят)
          // Для авторизованных - только если района нет
          if (!isAuthenticated) {
            console.log("👤 Гость → открываем выбор района")
            setSelectedDistrict(hasDistrict || "")
            setShowDistrictModal(true)
          } else if (!hasDistrict) {
            // Авторизован, но района нет
            console.log("⚠️ Авторизован, но район не выбран → открываем DistrictSelectionModal")
            setShowDistrictModal(true)
          } else {
            // Авторизован И район есть → проверяем профиль
            console.log("✅ Авторизован И район есть - проверяем профиль")
            setSelectedDistrict(hasDistrict)
            
            const isProfileComplete = 
              userProfile.district && 
              userProfile.name && 
              userProfile.street && 
              userProfile.building
            
            if (!isProfileComplete) {
              console.log("⚠️ Профиль неполный, открываем ProfileModal")
              setShouldAutoCheckout(true)
              setShowProfile(true)
            } else {
              console.log("✅ Профиль полный, запускаем автооформление")
              // Устанавливаем флаг для запуска автооформления
              setShouldAutoCheckout(true)
            }
          }
        }}
        onRequestPayment={(order, total) => {
          // ✅ НОВОЕ 2026-01-11: Открываем PaymentModal для оплаты существующего заказа
          console.log("💳 Запрос оплаты заказа:", order.id, "total:", total)
          setSelectedDate(null) // ✅ Закрываем OrderModal
          setPaymentOrder({ order, total })
        }}
        userAddress={userProfile?.street}
        userCity="Санкт-Петербург"
        userProfile={userProfile}
      />

      <AuthModal
        open={showAuthModal}
        onClose={() => {
          setShowAuthModal(false)
          // НЕ сбрасываем pendingCheckout здесь - он нужен для автооформления!
        }}
        onLogin={handleLogin}
        redirectAfterLogin={pendingCheckout ? "checkout" : null}
      />

      {showProfile && currentUser && (
        <ProfileModal 
          phone={currentUser} 
          onClose={() => setShowProfile(false)} 
          onSave={handleProfileSave} 
          userProfile={userProfile}
          isCheckoutFlow={shouldAutoCheckout}
        />
      )}

      {paymentOrder && (
        <PaymentModal
          order={paymentOrder.order}
          total={paymentOrder.total}
          userProfile={userProfile}
          onClose={handlePaymentModalClose}
          onPaymentComplete={handlePaymentComplete}
          allowCash={paymentOrder.isNewOrder === true} // ✅ ИСПРАВЛЕНО: только для новых заказов (не существующих)
        />
      )}

      {reviewOrder && (
        <ReviewModal order={reviewOrder} onClose={() => setReviewOrder(null)} onSubmit={handleReviewSubmit} />
      )}

      <WarningDialog
        open={warningDialog.open}
        onClose={closeWarning}
        title={warningDialog.title}
        description={warningDialog.description}
        variant={warningDialog.variant}
      />

      {/* ✅ ДОБАВЛЕНО 10.01.2026: Диалог подтверждения отмены заказа */}
      <WarningDialog
        open={cancelPaymentDialog.open}
        onClose={handleCancelPaymentDialogClose}
        title="Прекратить оформление заказа?"
        description="Заказ будет удален без возможности восстановления. Вы уверены?"
        variant="warning"
      />

      {/* Dish Smart Modal */}
      {selectedDish && (
        <DishSmartModal
          open={!!selectedDish}
          onClose={() => setSelectedDish(null)}
          dish={selectedDish.dish}
          availableDate={selectedDish.availableDate}
          orders={orders}
          onGoToOrder={handleGoToOrder}
          onOpenExistingOrder={handleOpenExistingOrder}
        />
      )}

      {/* Animation Components */}
      <OrderLoadingDialog open={showOrderLoading} />
      <PaymentLoading open={showPaymentLoading} />
      <CashPaymentAnimation open={showCashPaymentAnimation} />
      <CancelOrderLoading open={showCancelLoading} />
      <SuccessOrderDialog
        open={successDialog.open}
        onClose={() => setSuccessDialog({ open: false })}
        loyaltyPointsEarned={successDialog.loyaltyPointsEarned}
        loyaltyPointsUsed={successDialog.loyaltyPointsUsed}
        loyaltyPointsStatus={successDialog.loyaltyPointsStatus}
        loyaltyPointsMessage={successDialog.loyaltyPointsMessage}
      />

      {/* District Selection Modal */}
      <DistrictSelectionModal
        open={showDistrictModal}
        onDistrictSelected={handleDistrictSelected}
        userName={userProfile?.name}
        isGuest={!isAuthenticated}
        onLoginClick={() => {
          console.log("🔐 Пользователь кликнул 'Войти' в модалке выбора района")
          setShowDistrictModal(false)
          setShowAuthModal(true)
        }}
        onCancel={() => {
          console.log("❌ Пользователь отменил оформление заказа")
          setShowDistrictModal(false)
          setPendingCheckout(null)
          setShouldAutoCheckout(false)
        }}
      />

      {/* Debug Floating Button */}
      <DebugFloatingButton />
    </div>
  )
}
