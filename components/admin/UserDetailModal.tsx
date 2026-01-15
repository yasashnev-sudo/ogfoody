"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { User, Phone, Star, DollarSign, Calendar, MapPin } from "lucide-react"

interface UserDetailModalProps {
  open: boolean
  onClose: () => void
  user: {
    Id: number
    "Phone"?: string
    phone?: string
    "Name"?: string
    name?: string
    "Loyalty Points"?: number
    loyalty_points?: number
    "Total Spent"?: number
    total_spent?: number
    "Is Banned"?: boolean
    is_banned?: boolean
    "Registration Date"?: string
    registration_date?: string
    "Street"?: string
    street?: string
    "Building"?: string
    building?: string
    "Apartment"?: string
    apartment?: string
    "District"?: string
    district?: string
  } | null
}

export function UserDetailModal({ open, onClose, user }: UserDetailModalProps) {
  if (!user) return null

  const phone = user["Phone"] || user.phone || "Не указан"
  const name = user["Name"] || user.name || "Не указано"
  const points = user["Loyalty Points"] || user.loyalty_points || 0
  const spent = user["Total Spent"] || user.total_spent || 0
  const isBanned = user["Is Banned"] || user.is_banned || false
  const regDate = user["Registration Date"] || user.registration_date || ""
  const street = user["Street"] || user.street || ""
  const building = user["Building"] || user.building || ""
  const apartment = user["Apartment"] || user.apartment || ""
  const district = user["District"] || user.district || ""

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white border-2 border-black rounded-xl shadow-brutal max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-black">Детали пользователя</DialogTitle>
          <DialogDescription className="text-black/70">
            Полная информация о пользователе системы
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="bg-white border-2 border-black rounded-xl shadow-brutal p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-[#9D00FF] border-2 border-black rounded-lg flex items-center justify-center shadow-brutal">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-black">{name}</h3>
                {isBanned && (
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full border-2 border-black mt-2 inline-block">
                    Забанен
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 border-2 border-black rounded-lg">
                <Phone className="w-5 h-5 text-[#9D00FF]" />
                <div>
                  <p className="text-xs text-black/70">Телефон</p>
                  <p className="font-bold text-black">{phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 border-2 border-black rounded-lg">
                <Star className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-xs text-black/70">Баллы лояльности</p>
                  <p className="font-bold text-black">{points} баллов</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 border-2 border-black rounded-lg">
                <DollarSign className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-xs text-black/70">Потрачено всего</p>
                  <p className="font-bold text-black">{spent}₽</p>
                </div>
              </div>

              {regDate && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 border-2 border-black rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-black/70">Регистрация</p>
                    <p className="font-bold text-black">
                      {new Date(regDate).toLocaleDateString("ru-RU")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {(street || building || district) && (
              <div className="mt-4 p-4 bg-gray-50 border-2 border-black rounded-lg">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#9D00FF] mt-1" />
                  <div>
                    <p className="text-xs text-black/70 mb-2">Адрес доставки</p>
                    <p className="font-medium text-black">
                      {district && `${district}, `}
                      {street && `${street}, `}
                      {building && `д. ${building}`}
                      {apartment && `, кв. ${apartment}`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
