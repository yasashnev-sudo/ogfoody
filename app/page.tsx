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
import { Button } from "@/components/ui/button"
import { CalendarIcon, History, LogOut, User, Zap, LogIn } from "lucide-react"
import { isMealAvailable, isExtraAvailable } from "@/lib/meals-data"
import type { Order, Person, DayMeals, Extra, UserProfile, Review } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { getAvailableDatesForOrdering, canOrderForDate } from "@/lib/menu-utils"
import { getDay, addDays } from "date-fns"

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
    const threeMonthsAgo = new Date(today)
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

    return parsed
      .map((o: any) => ({
        ...o,
        startDate: toDate(o.startDate),
        paid: o.paid ?? false,
      }))
      .filter((o: Order) => {
        const orderDate = toDate(o.startDate)
        return orderDate >= threeMonthsAgo
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [view, setView] = useState<"calendar" | "history">("calendar")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [showProfile, setShowProfile] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [paymentOrder, setPaymentOrder] = useState<{ order: Order; total: number } | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [pendingCheckout, setPendingCheckout] = useState<{ order: Order; total: number } | null>(null)
  const [selectedDish, setSelectedDish] = useState<{
    dish: { name: string; image: string; price: number; description?: string }
    availableDate: Date
  } | null>(null)
  const { toast } = useToast()
  
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

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (user) {
      setIsAuthenticated(true)
      setCurrentUser(user)
      const savedOrders = localStorage.getItem(`orders_${user}`)
      if (savedOrders) {
        setOrders(deserializeOrders(savedOrders))
      }
      const savedProfile = localStorage.getItem(`profile_${user}`)
      if (savedProfile) {
        const profile = JSON.parse(savedProfile)
        setUserProfile(profile)
        
        // Синхронизируем заказы из базы данных для получения номеров заказов
        if (profile.id) {
          fetch(`/api/orders?userId=${profile.id}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.orders && Array.isArray(data.orders)) {
                // Обновляем заказы с номерами из базы данных
                setOrders((prevOrders) => {
                  const updatedOrders = prevOrders.map((localOrder) => {
                    // Ищем соответствующий заказ в базе по id или дате
                    const dbOrder = data.orders.find(
                      (db: any) =>
                        (localOrder.id && db.Id === localOrder.id) ||
                        (db.start_date === formatDateKey(toDate(localOrder.startDate)))
                    )
                    
                    if (dbOrder && dbOrder.order_number && !localOrder.orderNumber) {
                      // Обновляем номер заказа из базы данных
                      return {
                        ...localOrder,
                        id: dbOrder.Id,
                        orderNumber: dbOrder.order_number,
                      }
                    }
                    return localOrder
                  })
                  
                  // Сохраняем обновленные заказы в localStorage
                  localStorage.setItem(`orders_${user}`, serializeOrders(updatedOrders))
                  return updatedOrders
                })
              }
            })
            .catch((error) => {
              console.error("Failed to sync orders from database:", error)
            })
        }
      }
      const savedReviews = localStorage.getItem(`reviews_${user}`)
      if (savedReviews) {
        setReviews(JSON.parse(savedReviews))
      }
    } else {
      const guestOrders = localStorage.getItem("guest_orders")
      if (guestOrders) {
        setOrders(deserializeOrders(guestOrders))
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
    const user = localStorage.getItem("currentUser")
    const orderTimestamp = getDateTimestamp(order.startDate)
    const existingOrder = orders.find((o) => getDateTimestamp(o.startDate) === orderTimestamp)
    
    console.log("🔵 handleSaveOrder вызван:", {
      isAuthenticated,
      hasUserProfile: !!userProfile,
      userId: userProfile?.id,
      hasExistingOrder: !!existingOrder?.id,
    })
    
    // Если заказ существует и имеет id, и пользователь авторизован, обновляем через API
    if (existingOrder?.id && isAuthenticated && userProfile?.id) {
      try {
        // Вычисляем итоговую сумму заказа
        const total = calculateOrderTotal(order)
        const updatedOrder: Order = {
          ...order,
          id: existingOrder.id,
          orderNumber: existingOrder.orderNumber,
          subtotal: total,
          total: total,
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
        
        // Обновляем заказ в состоянии с данными из API
        setOrders((prev) => {
          const filtered = prev.filter((o) => getDateTimestamp(o.startDate) !== orderTimestamp)
          const newOrders = [
            ...filtered,
            {
              ...updatedOrder,
              orderNumber: result.orderNumber || existingOrder.orderNumber || updatedOrder.orderNumber, // Сохраняем номер заказа из ответа API
              startDate: toDate(updatedOrder.startDate),
              paid: updatedOrder.paid ?? false,
            },
          ]
          if (user) {
            localStorage.setItem(`orders_${user}`, serializeOrders(newOrders))
          }
          return newOrders
        })
        
        toast({
          title: "Заказ обновлен",
          description: "Изменения успешно сохранены",
          duration: 3000,
        })
      } catch (error) {
        console.error("Failed to update order:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось обновить заказ. Попробуйте еще раз.",
          variant: "destructive",
          duration: 5000,
        })
        return
      }
    } else if (isAuthenticated && userProfile?.id) {
      // Создаем новый заказ через API
      console.log("✅ Условие для создания заказа выполнено:", {
        isAuthenticated,
        hasUserProfile: !!userProfile,
        userId: userProfile?.id,
        sendingToServer: true,
      })
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
          
          if (user) {
            const serialized = serializeOrders(newOrders)
            localStorage.setItem(`orders_${user}`, serialized)
            
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
              localStorage.setItem(`orders_${user}`, serializeOrders(fixedOrders))
              // Обновляем состояние
              setTimeout(() => {
                setOrders(fixedOrders)
              }, 100)
            }
          }
          
          // Финальная проверка - убеждаемся, что номер заказа есть
          const finalCheck = newOrders.find(o => o.id === savedOrder.id)
          if (finalCheck && !finalCheck.orderNumber && result.orderNumber) {
            console.warn("⚠️ Fixing missing order number in state...")
            finalCheck.orderNumber = result.orderNumber
            if (user) {
              localStorage.setItem(`orders_${user}`, serializeOrders(newOrders.map(o => 
                o.id === finalCheck.id ? finalCheck : o
              )))
            }
          }
          
          return newOrders
        })
        
        toast({
          title: "Заказ создан",
          description: result.orderNumber 
            ? `Заказ № ${result.orderNumber} успешно оформлен` 
            : "Заказ успешно оформлен",
          duration: 5000,
        })
      } catch (error) {
        console.error("❌ Ошибка при создании заказа:", error)
        toast({
          title: "Ошибка",
          description: error instanceof Error ? error.message : "Не удалось создать заказ. Попробуйте еще раз.",
          variant: "destructive",
          duration: 5000,
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
        if (user) {
          localStorage.setItem(`orders_${user}`, serializeOrders(newOrders))
        } else {
          localStorage.setItem("guest_orders", serializeOrders(newOrders))
        }
        return newOrders
      })
      
      toast({
        title: "Заказ сохранен локально",
        description: !isAuthenticated 
          ? "Войдите в систему, чтобы сохранить заказ на сервере" 
          : "Ошибка при создании заказа. Проверьте данные профиля.",
        variant: !isAuthenticated ? "default" : "destructive",
        duration: 5000,
      })
    }
    
    setSelectedDate(null)
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
      
      toast({
        title: "Заказ сохранен",
        description: "Заказ сохранен локально. Войдите в систему, чтобы сохранить его на сервере.",
        duration: 3000,
      })
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
        const total = calculateOrderTotal(order)
        const updatedOrder: Order = {
          ...order,
          id: existingOrder.id,
          orderNumber: existingOrder.orderNumber,
          subtotal: total,
          total: total,
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
          if (user) {
            localStorage.setItem(`orders_${user}`, serializeOrders(newOrders))
          }
          return newOrders
        })
        
        toast({
          title: "Заказ обновлен",
          description: "Изменения успешно сохранены",
          duration: 3000,
        })
      } catch (error) {
        console.error("Failed to update order:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось обновить заказ. Попробуйте еще раз.",
          variant: "destructive",
          duration: 5000,
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

  const handleCancelOrder = (startDate: Date) => {
    const orderTimestamp = getDateTimestamp(startDate)
    const orderToCancel = orders.find((o) => getDateTimestamp(o.startDate) === orderTimestamp)
    const wasPaid = orderToCancel?.paid && orderToCancel?.paymentMethod !== "cash"

    setOrders((prev) => {
      const filtered = prev.filter((o) => getDateTimestamp(o.startDate) !== orderTimestamp)
      const user = localStorage.getItem("currentUser")
      if (user) {
        localStorage.setItem(`orders_${user}`, serializeOrders(filtered))
      } else {
        localStorage.setItem("guest_orders", serializeOrders(filtered))
      }
      return filtered
    })
    setSelectedDate(null)

    if (wasPaid) {
      showWarning(
        "Заказ отменен",
        "Деньги вернутся на карту в течение 3 рабочих дней.",
        "info"
      )
    } else {
      showWarning(
        "Заказ отменен",
        "Заказ был успешно удален.",
        "info"
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

      if (user) {
        localStorage.setItem(`orders_${user}`, serializeOrders(newOrders))
      }
      return newOrders
    })
  }

  const handleRepeatOrder = (order: Order, targetDate: Date) => {
    const filteredOrder = filterAvailableItems(order)
    const newOrder: Order = {
      ...filteredOrder,
      startDate: targetDate,
      delivered: false,
      paid: false,
    }
    handleSaveOrder(newOrder)
  }

  const handlePayOrder = (order: Order, total: number) => {
    if (!isAuthenticated) {
      setPendingCheckout({ order, total })
      setShowAuthModal(true)
      return
    }
    // Для заказов с наличными открываем модальное окно заказа для смены способа оплаты
    if (order.paymentMethod === "cash" && !order.paid) {
      const orderDate = toDate(order.startDate)
      setSelectedDate(orderDate)
      return
    }
    // Для других заказов открываем модальное окно оплаты
    setPaymentOrder({ order, total })
  }

  const handleMarkCashOrderAsPaid = async (order: Order) => {
    if (!order.id || !isAuthenticated || !userProfile?.id) {
      toast({
        title: "Ошибка",
        description: "Не удалось отметить заказ как оплаченный",
        variant: "destructive",
        duration: 5000,
      })
      return
    }

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

      // Обновляем заказ в состоянии
      const user = localStorage.getItem("currentUser")
      const orderTimestamp = getDateTimestamp(order.startDate)
      
      setOrders((prev) => {
        const newOrders = prev.map((o) => {
          if (getDateTimestamp(o.startDate) === orderTimestamp) {
            return { ...o, paid: true, paidAt: new Date().toISOString() }
          }
          return o
        })
        if (user) {
          localStorage.setItem(`orders_${user}`, serializeOrders(newOrders))
        }
        return newOrders
      })

      toast({
        title: "Заказ оплачен",
        description: "Заказ успешно отмечен как оплаченный",
        duration: 3000,
      })
    } catch (error) {
      console.error("Failed to mark order as paid:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось отметить заказ как оплаченный. Попробуйте еще раз.",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  const handlePaymentComplete = (order: Order, pointsUsed: number) => {
    const user = localStorage.getItem("currentUser")
    const orderTimestamp = getDateTimestamp(order.startDate)
    const total = calculateOrderTotal(order)

    setOrders((prev) => {
      const newOrders = prev.map((o) => {
        if (getDateTimestamp(o.startDate) === orderTimestamp) {
          return { ...o, paid: true, paidAt: new Date().toISOString() }
        }
        return o
      })
      if (user) {
        localStorage.setItem(`orders_${user}`, serializeOrders(newOrders))
      }
      return newOrders
    })

    if (userProfile) {
      const loyaltyLevel =
        userProfile.totalSpent >= 50000 ? "gold" : userProfile.totalSpent >= 20000 ? "silver" : "bronze"
      const cashbackPercent = loyaltyLevel === "gold" ? 7 : loyaltyLevel === "silver" ? 5 : 3
      const earnedPoints = Math.floor((total - pointsUsed) * (cashbackPercent / 100))

      const updatedProfile: UserProfile = {
        ...userProfile,
        loyaltyPoints: userProfile.loyaltyPoints - pointsUsed + earnedPoints,
        totalSpent: userProfile.totalSpent + total - pointsUsed,
      }
      setUserProfile(updatedProfile)
      localStorage.setItem(`profile_${user}`, JSON.stringify(updatedProfile))
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
    localStorage.setItem(`orders_${phone}`, serializeOrders(userOrders))

    if (mergedCount > 0 || conflictCount > 0) {
      let description = ""
      if (mergedCount > 0 && conflictCount === 0) {
        description = `${mergedCount} ${mergedCount === 1 ? "заказ добавлен" : "заказа добавлено"} в ваш аккаунт`
      } else if (conflictCount > 0) {
        description = `Некоторые даты уже заняты оплаченными заказами. Добавлено: ${mergedCount}`
      }

      toast({
        title: "Добро пожаловать!",
        description,
        duration: 5000,
      })
    } else {
      toast({
        title: "Добро пожаловать!",
        description: "Вы успешно вошли в аккаунт",
        duration: 3000,
      })
    }

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
    
    // Создаем или обновляем пользователя в NocoDB
    console.log("🔄 Синхронизация пользователя с базой данных...", { phone, hasProfile: !!profile })
    try {
      const { fetchUserByPhone, createUser, updateUser } = await import("@/lib/nocodb")
      console.log("📡 Ищем пользователя в базе по телефону:", phone)
      const dbUser = await fetchUserByPhone(phone)
      
      if (dbUser) {
        console.log("✅ Пользователь найден в базе:", dbUser.Id)
        // Пользователь существует, обновляем профиль из базы
        profile.id = dbUser.Id
        profile.name = dbUser.name || profile.name
        profile.street = dbUser.street || profile.street
        profile.building = dbUser.building || profile.building
        profile.loyaltyPoints = typeof dbUser.loyalty_points === 'number' ? dbUser.loyalty_points : parseInt(String(dbUser.loyalty_points)) || 0
        profile.totalSpent = typeof dbUser.total_spent === 'number' ? dbUser.total_spent : parseFloat(String(dbUser.total_spent)) || 0
        console.log("✅ Профиль обновлен из базы, userProfile.id:", profile.id)
      } else {
        console.log("⚠️ Пользователя нет в базе, создаем нового...")
        // Пользователя нет в базе, создаем
        const newDbUser = await createUser({
          phone,
          name: profile.name || "",
          loyalty_points: profile.loyaltyPoints || 0,
          total_spent: profile.totalSpent || 0,
        })
        profile.id = newDbUser.Id
        console.log("✅ Пользователь создан в базе данных:", newDbUser.Id, "userProfile.id установлен:", profile.id)
      }
      
      // Сохраняем обновленный профиль в localStorage
      localStorage.setItem(`profile_${phone}`, JSON.stringify(profile))
      console.log("💾 Профиль сохранен в localStorage с id:", profile.id)
    } catch (error) {
      console.error("❌ Ошибка при синхронизации пользователя с базой:", error)
      console.error("Stack:", error instanceof Error ? error.stack : "No stack")
      // Продолжаем работу даже если не удалось синхронизировать с базой
    }
    
    console.log("👤 Устанавливаем userProfile:", { id: profile.id, phone: profile.phone, hasId: !!profile.id })
    setUserProfile(profile)

    setShowAuthModal(false)
    if (pendingCheckout) {
      setPaymentOrder(pendingCheckout)
      setPendingCheckout(null)
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

  const handleProfileSave = (profile: UserProfile) => {
    setUserProfile(profile)
  }

  const existingOrder = selectedDate
    ? orders.find((o) => {
        const orderStartDate = new Date(o.startDate)
        orderStartDate.setHours(0, 0, 0, 0)

        const checkDate = new Date(selectedDate)
        checkDate.setHours(0, 0, 0, 0)

        return orderStartDate.getTime() === checkDate.getTime()
      })
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
      <div className="bg-white px-4 pt-12 pb-6 border-b-2 border-black safe-area-top">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full border-2 border-black overflow-hidden flex items-center justify-center shrink-0">
              <Image 
                src="/OGFooDY логотип.png" 
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
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-black hover:bg-muted border-0">
                <LogOut className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="text-black hover:bg-muted border-0"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Войти
              </Button>
            )}
          </div>
        </div>
        {isAuthenticated ? (
          <button
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-2 text-black bg-muted rounded-xl px-3 py-2 w-full hover:bg-muted/80 transition-colors border-2 border-black"
          >
            <User className="w-4 h-4" />
            <span className="text-sm font-bold flex-1 text-left">{userProfile?.name || currentUser}</span>
            {userProfile && userProfile.loyaltyPoints > 0 && (
              <span className="text-xs bg-[#9D00FF] text-white px-2 py-0.5 rounded-lg font-black border-2 border-black">{userProfile.loyaltyPoints} баллов</span>
            )}
          </button>
        ) : (
          <div className="flex items-center gap-2 text-black bg-muted rounded-xl px-3 py-2 w-full border-2 border-black">
            <User className="w-4 h-4" />
            <span className="text-sm font-bold">Гость</span>
            <span className="text-xs text-black/70 ml-auto font-medium">Войдите для оформления заказа</span>
          </div>
        )}
      </div>

      <div className="px-4 py-4 -mt-4 bg-background rounded-t-3xl border-t-2 border-black relative z-10">
        <p className="text-muted-foreground text-sm mb-4">
          {view === "calendar" ? "Выберите дату для заказа" : "История ваших заказов"}
        </p>

        <div className="mb-4 flex gap-2">
          <Button
            variant={view === "calendar" ? "default" : "outline"}
            onClick={() => setView("calendar")}
            className="flex-1"
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Календарь
          </Button>
          <Button
            variant={view === "history" ? "default" : "outline"}
            onClick={() => setView("history")}
            className="flex-1"
            disabled={!isAuthenticated}
          >
            <History className="w-4 h-4 mr-2" />
            История
          </Button>
        </div>

        {view === "calendar" ? (
          <>
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
            <div id="calendar-section" className="mb-8">
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
        )}
      </div>

      <OrderModal
        date={selectedDate || new Date()}
        existingOrder={existingOrder}
        onClose={() => {
          setSelectedDate(null)
        }}
        onSave={handleSaveOrder}
        onCancel={handleCancelOrder}
        allOrders={orders}
        open={!!selectedDate}
        onPaymentSuccess={(order) => {
          if (userProfile) {
            const newPoints = Math.floor(calculateOrderTotalForHistory(order) * 0.05)
            const updatedProfile = {
              ...userProfile,
              loyaltyPoints: userProfile.loyaltyPoints + newPoints,
            }
            setUserProfile(updatedProfile)
            localStorage.setItem("user_profile", JSON.stringify(updatedProfile))
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
        onRequestAuth={() => {
          setPendingCheckout(true)
          setShowAuthModal(true)
        }}
        userAddress={userProfile?.address}
        userCity={userProfile?.city}
      />

      <AuthModal
        open={showAuthModal}
        onClose={() => {
          setShowAuthModal(false)
          setPendingCheckout(null)
        }}
        onLogin={handleLogin}
        redirectAfterLogin={pendingCheckout ? "checkout" : null}
      />

      {showProfile && currentUser && (
        <ProfileModal phone={currentUser} onClose={() => setShowProfile(false)} onSave={handleProfileSave} />
      )}

      {paymentOrder && (
        <PaymentModal
          order={paymentOrder.order}
          total={paymentOrder.total}
          userProfile={userProfile}
          onClose={() => setPaymentOrder(null)}
          onPaymentComplete={handlePaymentComplete}
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
    </div>
  )
}
