"use client"

import Image from "next/image"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Order } from "@/lib/types"

interface DishSmartModalProps {
  open: boolean
  onClose: () => void
  dish: {
    name: string
    image: string
    price: number
    description?: string
  }
  availableDate: Date
  orders: Order[]
  onGoToOrder: (date: Date) => void
  onOpenExistingOrder: (date: Date) => void
}

export function DishSmartModal({
  open,
  onClose,
  dish,
  availableDate,
  orders,
  onGoToOrder,
  onOpenExistingOrder,
}: DishSmartModalProps) {
  // Check if order already exists for this date
  const existingOrder = orders.find((order) => {
    const orderDate = new Date(order.startDate)
    orderDate.setHours(0, 0, 0, 0)
    const checkDate = new Date(availableDate)
    checkDate.setHours(0, 0, 0, 0)
    return orderDate.getTime() === checkDate.getTime()
  })

  // Format date as "JANUARY 14 (TUE)"
  const monthName = format(availableDate, "MMMM", { locale: ru }).toUpperCase()
  const dayNumber = format(availableDate, "d", { locale: ru })
  const dayOfWeek = format(availableDate, "EEE", { locale: ru }).toUpperCase()
  const availabilityText = `${monthName} ${dayNumber} (${dayOfWeek})`

  const handleAction = () => {
    if (existingOrder) {
      onOpenExistingOrder(availableDate)
    } else {
      onGoToOrder(availableDate)
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 gap-0 bg-white border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_#000000] overflow-hidden">
        {/* Image */}
        <div className="relative w-full h-64 bg-muted border-b-4 border-black">
          <Image
            src={dish.image || "/placeholder.jpg"}
            alt={dish.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <h2 className="text-2xl font-black text-black uppercase tracking-tight">
            {dish.name.toUpperCase()}
          </h2>

          {/* Description */}
          {dish.description && (
            <p className="text-sm text-gray-700 font-medium leading-relaxed">
              {dish.description}
            </p>
          )}

          {/* Availability Block */}
          <div className="bg-[#9D00FF] rounded-xl border-2 border-black shadow-brutal p-4">
            <p className="text-white font-black text-sm sm:text-base text-center">
              Доступно в наборе на <span className="uppercase">{availabilityText}</span>
            </p>
          </div>

          {/* Action Button */}
          {existingOrder ? (
            <div className="space-y-3">
              <div className="bg-yellow-50 border-2 border-black rounded-xl p-3">
                <p className="text-sm font-bold text-black text-center">
                  Заказ на эту дату уже сделан
                </p>
              </div>
              <Button
                onClick={handleAction}
                className="w-full bg-[#FFEA00] hover:bg-[#FFF033] text-black border-2 border-black shadow-brutal font-black text-sm sm:text-base py-3"
              >
                ОТКРЫТЬ ЗАКАЗ
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleAction}
              className="w-full bg-[#FFEA00] hover:bg-[#FFF033] text-black border-2 border-black shadow-brutal font-black text-sm sm:text-base py-3"
            >
              ПЕРЕЙТИ К ЗАКАЗУ ({monthName.slice(0, 3).toUpperCase()} {dayNumber})
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

