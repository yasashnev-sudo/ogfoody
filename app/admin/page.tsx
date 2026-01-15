"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { ShoppingCart, Users, Utensils, TrendingUp, MessageSquare, Bell } from "lucide-react"

interface DashboardStats {
  totalOrders: number
  totalUsers: number
  totalMeals: number
  todayOrders: number
  unreadMessages: number
  pendingNotifications: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalUsers: 0,
    totalMeals: 0,
    todayOrders: 0,
    unreadMessages: 0,
    pendingNotifications: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Загружаем статистику
        const [ordersRes, usersRes, mealsRes] = await Promise.all([
          fetch("/api/db/Orders/records?limit=1000"),
          fetch("/api/db/Users/records?limit=1000"),
          fetch("/api/db/Meals/records?limit=1000"),
        ])

        const orders = await ordersRes.json()
        const users = await usersRes.json()
        const meals = await mealsRes.json()

        const today = new Date().toISOString().split("T")[0]
        const todayOrdersCount = orders.list?.filter((o: any) => {
          const orderDate = o["Start Date"] || o.start_date
          return orderDate?.startsWith(today)
        }).length || 0

        setStats({
          totalOrders: orders.list?.length || 0,
          totalUsers: users.list?.length || 0,
          totalMeals: meals.list?.length || 0,
          todayOrders: todayOrdersCount,
          unreadMessages: 0, // TODO: реализовать подсчет непрочитанных сообщений
          pendingNotifications: 0, // TODO: реализовать подсчет уведомлений
        })
      } catch (error) {
        console.error("Ошибка загрузки статистики:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Всего заказов",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "bg-[#9D00FF]",
    },
    {
      title: "Пользователи",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-[#FFEA00]",
    },
    {
      title: "Блюда",
      value: stats.totalMeals,
      icon: Utensils,
      color: "bg-green-500",
    },
    {
      title: "Заказы сегодня",
      value: stats.todayOrders,
      icon: TrendingUp,
      color: "bg-blue-500",
    },
    {
      title: "Непрочитанные сообщения",
      value: stats.unreadMessages,
      icon: MessageSquare,
      color: "bg-orange-500",
    },
    {
      title: "Уведомления в очереди",
      value: stats.pendingNotifications,
      icon: Bell,
      color: "bg-red-500",
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#9D00FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black font-bold">Загрузка статистики...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-black mb-2">Дашборд</h1>
        <p className="text-black/70">Общая статистика системы</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={index}
              className="bg-white border-2 border-black rounded-xl shadow-brutal p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-black/70 font-medium mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-black text-black">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 ${stat.color} border-2 border-black rounded-lg flex items-center justify-center shadow-brutal`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Быстрые действия */}
      <Card className="bg-white border-2 border-black rounded-xl shadow-brutal p-6">
        <h2 className="text-xl font-black text-black mb-4">Быстрые действия</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/orders"
            className="p-4 bg-[#FFEA00] border-2 border-black rounded-lg shadow-brutal hover:bg-[#FFEA00]/80 transition-colors font-bold text-black"
          >
            Просмотр заказов
          </a>
          <a
            href="/admin/chat"
            className="p-4 bg-[#9D00FF] border-2 border-black rounded-lg shadow-brutal hover:bg-[#9D00FF]/80 transition-colors font-bold text-white"
          >
            Чат с клиентами
          </a>
          <a
            href="/admin/notifications"
            className="p-4 bg-green-500 border-2 border-black rounded-lg shadow-brutal hover:bg-green-500/80 transition-colors font-bold text-white"
          >
            Отправить уведомление
          </a>
        </div>
      </Card>
    </div>
  )
}
