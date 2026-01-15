"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Package, Calendar, MapPin, DollarSign, CreditCard, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface OrderDetailModalProps {
  open: boolean
  onClose: () => void
  order: {
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
    "Payment Method"?: string
    payment_method?: string
    "Total"?: number
    total?: number
    "Subtotal"?: number
    subtotal?: number
    "Delivery Fee"?: number
    delivery_fee?: number
    "Delivery Address"?: string
    delivery_address?: string
    "Delivery Time"?: string
    delivery_time?: string
    "Created At"?: string
    created_at?: string
  } | null
}

export function OrderDetailModal({ open, onClose, order }: OrderDetailModalProps) {
  if (!order) return null

  const orderNumber = order["Order Number"] || order.order_number || `#${order.Id}`
  const status = order["Order Status"] || order.order_status || "pending"
  const paymentStatus = order["Payment Status"] || order.payment_status || "pending"
  const paymentMethod = order["Payment Method"] || order.payment_method || "cash"
  const total = order["Total"] || order.total || 0
  const subtotal = order["Subtotal"] || order.subtotal || total
  const deliveryFee = order["Delivery Fee"] || order.delivery_fee || 0
  const address = order["Delivery Address"] || order.delivery_address || "Не указан"
  const deliveryTime = order["Delivery Time"] || order.delivery_time || "Не указано"
  const date = order["Start Date"] || order.start_date || order["Created At"] || order.created_at || ""

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

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      cash: "Наличные",
      card: "Карта",
      sbp: "СБП",
      online: "Онлайн",
    }
    return labels[method] || method
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white border-2 border-black rounded-xl shadow-brutal max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-black flex items-center gap-3">
            <Package className="w-6 h-6 text-[#9D00FF]" />
            Заказ {orderNumber}
          </DialogTitle>
          <DialogDescription className="text-black/70">
            Детальная информация о заказе
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Статусы */}
          <div className="flex flex-wrap gap-2">
            <span
              className={cn(
                "px-4 py-2 rounded-full text-sm font-bold border-2 border-black text-white",
                getStatusColor(status)
              )}
            >
              {getStatusLabel(status)}
            </span>
            <span
              className={cn(
                "px-4 py-2 rounded-full text-sm font-bold border-2 border-black",
                paymentStatus === "paid"
                  ? "bg-green-500 text-white"
                  : "bg-yellow-500 text-black"
              )}
            >
              {getPaymentStatusLabel(paymentStatus)}
            </span>
          </div>

          {/* Информация о заказе */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gray-50 border-2 border-black rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-[#9D00FF]" />
                <div>
                  <p className="text-xs text-black/70">Дата заказа</p>
                  <p className="font-bold text-black">
                    {date ? new Date(date).toLocaleDateString("ru-RU") : "Не указана"}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-50 border-2 border-black rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-[#9D00FF]" />
                <div>
                  <p className="text-xs text-black/70">Время доставки</p>
                  <p className="font-bold text-black">{deliveryTime}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-50 border-2 border-black rounded-lg p-4 md:col-span-2">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#9D00FF] mt-1" />
                <div>
                  <p className="text-xs text-black/70 mb-1">Адрес доставки</p>
                  <p className="font-bold text-black">{address}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-50 border-2 border-black rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="w-5 h-5 text-[#9D00FF]" />
                <div>
                  <p className="text-xs text-black/70">Способ оплаты</p>
                  <p className="font-bold text-black">{getPaymentMethodLabel(paymentMethod)}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Стоимость */}
          <Card className="bg-[#FFEA00] border-2 border-black rounded-xl shadow-brutal p-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-black/70 font-medium">Сумма заказа:</span>
                <span className="font-black text-black text-lg">{subtotal}₽</span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-black/70 font-medium">Доставка:</span>
                  <span className="font-black text-black">{deliveryFee}₽</span>
                </div>
              )}
              <div className="border-t-2 border-black pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-black text-black text-xl">Итого:</span>
                  <span className="font-black text-black text-2xl">{total}₽</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
