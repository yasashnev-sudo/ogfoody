"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { BarChart3, TrendingUp, DollarSign, Users, ShoppingCart } from "lucide-react"

interface Stats {
  totalRevenue: number
  totalOrders: number
  totalUsers: number
  averageOrderValue: number
  ordersByStatus: Record<string, number>
  revenueByMonth: { month: string; revenue: number }[]
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    averageOrderValue: 0,
    ordersByStatus: {},
    revenueByMonth: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [ordersRes, usersRes] = await Promise.all([
        fetch("/api/db/Orders/records?limit=1000"),
        fetch("/api/db/Users/records?limit=1000"),
      ])

      const orders = await ordersRes.json()
      const users = await usersRes.json()

      const ordersList = orders.list || []
      const totalRevenue = ordersList.reduce(
        (sum: number, o: any) => sum + (o["Total"] || o.total || 0),
        0
      )
      const totalOrders = ordersList.length
      const totalUsers = users.list?.length || 0
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

      // Группировка по статусам
      const ordersByStatus: Record<string, number> = {}
      ordersList.forEach((o: any) => {
        const status = o["Order Status"] || o.order_status || "unknown"
        ordersByStatus[status] = (ordersByStatus[status] || 0) + 1
      })

      // Группировка по месяцам
      const revenueByMonth: { month: string; revenue: number }[] = []
      const monthMap = new Map<string, number>()
      
      ordersList.forEach((o: any) => {
        const date = o["Created At"] || o.created_at || o["Start Date"] || o.start_date
        if (date) {
          const month = new Date(date).toLocaleDateString("ru-RU", { month: "long", year: "numeric" })
          const revenue = o["Total"] || o.total || 0
          monthMap.set(month, (monthMap.get(month) || 0) + revenue)
        }
      })

      revenueByMonth.push(
        ...Array.from(monthMap.entries()).map(([month, revenue]) => ({ month, revenue }))
      )

      setStats({
        totalRevenue,
        totalOrders,
        totalUsers,
        averageOrderValue,
        ordersByStatus,
        revenueByMonth,
      })
    } catch (error) {
      console.error("Ошибка загрузки статистики:", error)
    } finally {
      setLoading(false)
    }
  }

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
        <h1 className="text-3xl font-black text-black mb-2">Статистика</h1>
        <p className="text-black/70">Аналитика и отчеты</p>
      </div>

      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-2 border-black rounded-xl shadow-brutal p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black/70 font-medium mb-1">Общая выручка</p>
              <p className="text-3xl font-black text-black">{Math.round(stats.totalRevenue)}₽</p>
            </div>
            <div className="w-12 h-12 bg-green-500 border-2 border-black rounded-lg flex items-center justify-center shadow-brutal">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-white border-2 border-black rounded-xl shadow-brutal p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black/70 font-medium mb-1">Всего заказов</p>
              <p className="text-3xl font-black text-black">{stats.totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-[#9D00FF] border-2 border-black rounded-lg flex items-center justify-center shadow-brutal">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-white border-2 border-black rounded-xl shadow-brutal p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black/70 font-medium mb-1">Пользователи</p>
              <p className="text-3xl font-black text-black">{stats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-[#FFEA00] border-2 border-black rounded-lg flex items-center justify-center shadow-brutal">
              <Users className="w-6 h-6 text-black" />
            </div>
          </div>
        </Card>

        <Card className="bg-white border-2 border-black rounded-xl shadow-brutal p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black/70 font-medium mb-1">Средний чек</p>
              <p className="text-3xl font-black text-black">{Math.round(stats.averageOrderValue)}₽</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 border-2 border-black rounded-lg flex items-center justify-center shadow-brutal">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Заказы по статусам */}
      <Card className="bg-white border-2 border-black rounded-xl shadow-brutal p-6">
        <h2 className="text-xl font-black text-black mb-4">Заказы по статусам</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(stats.ordersByStatus).map(([status, count]) => (
            <div key={status} className="text-center p-4 bg-gray-50 border-2 border-black rounded-lg">
              <p className="text-2xl font-black text-[#9D00FF]">{count}</p>
              <p className="text-sm text-black/70 font-medium mt-1">{status}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Выручка по месяцам */}
      {stats.revenueByMonth.length > 0 && (
        <Card className="bg-white border-2 border-black rounded-xl shadow-brutal p-6">
          <h2 className="text-xl font-black text-black mb-4">Выручка по месяцам</h2>
          <div className="space-y-2">
            {stats.revenueByMonth.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border-2 border-black rounded-lg">
                <span className="font-bold text-black">{item.month}</span>
                <span className="text-xl font-black text-[#9D00FF]">{Math.round(item.revenue)}₽</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
