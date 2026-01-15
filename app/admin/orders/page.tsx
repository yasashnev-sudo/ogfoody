"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Package, Edit, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { OrderDetailModal } from "@/components/admin/OrderDetailModal"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Order {
  Id: number
  "Order Number"?: string
  order_number?: string
  "User ID"?: number
  user_id?: number
  "Start Date"?: string
  start_date?: string
  "Order Status"?: string
  order_status?: string
  "Payment Status"?: string
  payment_status?: string
  "Total"?: number
  total?: number
  "Delivery Address"?: string
  delivery_address?: string
  "Created At"?: string
  created_at?: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<string>("")

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, search, statusFilter])

  const loadOrders = async () => {
    try {
      const response = await fetch("/api/db/Orders/records?limit=1000&sort=-Created At")
      const data = await response.json()
      setOrders(data.list || [])
    } catch (error) {
      console.error("Ошибка загрузки заказов:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          (order["Order Number"] || order.order_number || "").toLowerCase().includes(searchLower) ||
          (order["Delivery Address"] || order.delivery_address || "").toLowerCase().includes(searchLower)
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (order) =>
          (order["Order Status"] || order.order_status || "") === statusFilter
      )
    }

    setFilteredOrders(filtered)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500",
      confirmed: "bg-blue-500",
      preparing: "bg-purple-500",
      ready: "bg-green-500",
      cancelled: "bg-red-500",
    }
    return colors[status] || "bg-gray-500"
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "В обработке",
      confirmed: "Подтвержден",
      preparing: "Готовится",
      ready: "Готов",
      cancelled: "Отменен",
    }
    return labels[status] || status
  }

  const getPaymentStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Не оплачен",
      paid: "Оплачен",
      refunded: "Возврат",
      failed: "Ошибка",
    }
    return labels[status] || status
  }

  const handleEditStatus = (order: Order) => {
    setEditingOrder(order)
    setNewStatus(order["Order Status"] || order.order_status || "pending")
    setIsEditModalOpen(true)
  }

  const handleSaveStatus = async () => {
    if (!editingOrder) return

    try {
      const response = await fetch("/api/db/Orders/records", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([{ Id: editingOrder.Id, order_status: newStatus }]),
      })

      if (response.ok) {
        setIsEditModalOpen(false)
        setEditingOrder(null)
        loadOrders()
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        alert(`Ошибка сохранения: ${errorData.error || response.statusText}`)
      }
    } catch (error) {
      console.error("Ошибка сохранения статуса:", error)
      alert("Произошла ошибка при сохранении статуса")
    }
  }

  const handleDeleteOrder = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить этот заказ? Это действие нельзя отменить.")) {
      return
    }

    try {
      const response = await fetch(`/api/db/Orders/records/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        loadOrders()
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        alert(`Ошибка удаления: ${errorData.error || response.statusText}`)
      }
    } catch (error) {
      console.error("Ошибка удаления заказа:", error)
      alert("Произошла ошибка при удалении заказа")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#9D00FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black font-bold">Загрузка заказов...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-black mb-2">Управление заказами</h1>
        <p className="text-black/70">Просмотр и управление всеми заказами</p>
      </div>

      {/* Фильтры */}
      <Card className="bg-white border-2 border-black rounded-xl shadow-brutal p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black/50" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по номеру заказа или адресу..."
              className="pl-10 border-2 border-black rounded-lg shadow-brutal"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="border-2 border-black rounded-lg shadow-brutal">
              <SelectValue placeholder="Статус заказа" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="pending">В обработке</SelectItem>
              <SelectItem value="confirmed">Подтвержден</SelectItem>
              <SelectItem value="preparing">Готовится</SelectItem>
              <SelectItem value="ready">Готов</SelectItem>
              <SelectItem value="cancelled">Отменен</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Список заказов */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card className="bg-white border-2 border-black rounded-xl shadow-brutal p-12 text-center">
            <Package className="w-16 h-16 text-black/30 mx-auto mb-4" />
            <p className="text-black/70 font-medium">Заказы не найдены</p>
          </Card>
        ) : (
          filteredOrders.map((order) => {
            const orderNumber = order["Order Number"] || order.order_number || `#${order.Id}`
            const status = order["Order Status"] || order.order_status || "pending"
            const paymentStatus = order["Payment Status"] || order.payment_status || "pending"
            const total = order["Total"] || order.total || 0
            const address = order["Delivery Address"] || order.delivery_address || "Не указан"
            const date = order["Start Date"] || order.start_date || order["Created At"] || order.created_at || ""

            return (
              <Card
                key={order.Id}
                className="bg-white border-2 border-black rounded-xl shadow-brutal p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Package className="w-5 h-5 text-[#9D00FF]" />
                      <h3 className="text-lg font-black text-black">{orderNumber}</h3>
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold border-2 border-black text-white",
                          getStatusColor(status)
                        )}
                      >
                        {getStatusLabel(status)}
                      </span>
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold border-2 border-black",
                          paymentStatus === "paid"
                            ? "bg-green-500 text-white"
                            : "bg-yellow-500 text-black"
                        )}
                      >
                        {getPaymentStatusLabel(paymentStatus)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-black/70 mb-1">Сумма</p>
                        <p className="font-black text-black text-lg">{total}₽</p>
                      </div>
                      <div>
                        <p className="text-black/70 mb-1">Адрес доставки</p>
                        <p className="font-medium text-black">{address}</p>
                      </div>
                      <div>
                        <p className="text-black/70 mb-1">Дата</p>
                        <p className="font-medium text-black">
                          {date ? new Date(date).toLocaleDateString("ru-RU") : "Не указана"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setSelectedOrder(order)
                        setIsModalOpen(true)
                      }}
                      variant="outline"
                      className="border-2 border-black shadow-brutal brutal-hover"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Подробнее
                    </Button>
                    <Button
                      onClick={() => handleEditStatus(order)}
                      variant="outline"
                      className="border-2 border-[#9D00FF] text-[#9D00FF] shadow-brutal brutal-hover"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Статус
                    </Button>
                    <Button
                      onClick={() => handleDeleteOrder(order.Id)}
                      variant="outline"
                      className="border-2 border-red-500 text-red-500 shadow-brutal hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>

      <OrderDetailModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedOrder(null)
        }}
        order={selectedOrder}
      />

      {/* Модальное окно редактирования статуса */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-white border-2 border-black rounded-xl shadow-brutal">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-black">
              Изменить статус заказа
            </DialogTitle>
            <DialogDescription className="text-black/70">
              Заказ {editingOrder ? (editingOrder["Order Number"] || editingOrder.order_number || `#${editingOrder.Id}`) : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-black font-bold">
                Новый статус
              </Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="border-2 border-black rounded-lg shadow-brutal">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">В обработке</SelectItem>
                  <SelectItem value="confirmed">Подтвержден</SelectItem>
                  <SelectItem value="preparing">Готовится</SelectItem>
                  <SelectItem value="ready">Готов</SelectItem>
                  <SelectItem value="cancelled">Отменен</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSaveStatus}
                className="bg-[#9D00FF] text-white border-2 border-black shadow-brutal brutal-hover"
              >
                Сохранить
              </Button>
              <Button
                onClick={() => {
                  setIsEditModalOpen(false)
                  setEditingOrder(null)
                }}
                variant="outline"
                className="border-2 border-black shadow-brutal brutal-hover"
              >
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
