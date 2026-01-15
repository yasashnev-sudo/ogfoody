"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gift, Plus, Edit, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface PromoCode {
  Id: number
  "Code"?: string
  code?: string
  "Discount Percent"?: number
  discount_percent?: number
  "Valid From"?: string
  valid_from?: string
  "Valid Until"?: string
  valid_until?: string
  "Is Active"?: boolean
  is_active?: boolean
}

export default function AdminPromoPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    code: "",
    discount_percent: 0,
    valid_from: "",
    valid_until: "",
    is_active: true,
  })

  useEffect(() => {
    loadPromoCodes()
  }, [])

  const loadPromoCodes = async () => {
    try {
      const response = await fetch("/api/db/Promo_Codes/records?limit=1000")
      const data = await response.json()
      setPromoCodes(data.list || [])
    } catch (error) {
      console.error("Ошибка загрузки промокодов:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/db/Promo_Codes/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([formData]),
      })

      if (response.ok) {
        setFormData({
          code: "",
          discount_percent: 0,
          valid_from: "",
          valid_until: "",
          is_active: true,
        })
        setShowForm(false)
        loadPromoCodes()
      }
    } catch (error) {
      console.error("Ошибка создания промокода:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#9D00FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black font-bold">Загрузка промокодов...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-black mb-2">Промокоды</h1>
          <p className="text-black/70">Управление промокодами и скидками</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#9D00FF] text-white border-2 border-black shadow-brutal brutal-hover"
        >
          <Plus className="w-4 h-4 mr-2" />
          Создать промокод
        </Button>
      </div>

      {/* Форма создания */}
      {showForm && (
        <Card className="bg-white border-2 border-black rounded-xl shadow-brutal p-6">
          <h2 className="text-xl font-black text-black mb-4">Новый промокод</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-black font-bold">
                  Код промокода
                </Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="border-2 border-black rounded-lg shadow-brutal"
                  placeholder="PROMO2024"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount_percent" className="text-black font-bold">
                  Скидка (%)
                </Label>
                <Input
                  id="discount_percent"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.discount_percent}
                  onChange={(e) => setFormData({ ...formData, discount_percent: parseInt(e.target.value) || 0 })}
                  className="border-2 border-black rounded-lg shadow-brutal"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valid_from" className="text-black font-bold">
                  Действует с
                </Label>
                <Input
                  id="valid_from"
                  type="date"
                  value={formData.valid_from}
                  onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                  className="border-2 border-black rounded-lg shadow-brutal"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valid_until" className="text-black font-bold">
                  Действует до
                </Label>
                <Input
                  id="valid_until"
                  type="date"
                  value={formData.valid_until}
                  onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                  className="border-2 border-black rounded-lg shadow-brutal"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                className="bg-[#9D00FF] text-white border-2 border-black shadow-brutal brutal-hover"
              >
                Создать
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="border-2 border-black shadow-brutal brutal-hover"
              >
                Отмена
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Список промокодов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promoCodes.length === 0 ? (
          <Card className="col-span-full bg-white border-2 border-black rounded-xl shadow-brutal p-12 text-center">
            <Gift className="w-16 h-16 text-black/30 mx-auto mb-4" />
            <p className="text-black/70 font-medium">Промокоды не найдены</p>
          </Card>
        ) : (
          promoCodes.map((promo) => {
            const code = promo["Code"] || promo.code || ""
            const discount = promo["Discount Percent"] || promo.discount_percent || 0
            const validFrom = promo["Valid From"] || promo.valid_from || ""
            const validUntil = promo["Valid Until"] || promo.valid_until || ""
            const isActive = promo["Is Active"] || promo.is_active || false

            const isValid = () => {
              if (!isActive) return false
              const now = new Date()
              if (validFrom && new Date(validFrom) > now) return false
              if (validUntil && new Date(validUntil) < now) return false
              return true
            }

            return (
              <Card
                key={promo.Id}
                className={cn(
                  "bg-white border-2 rounded-xl shadow-brutal p-6",
                  isValid() ? "border-green-500" : "border-black opacity-75"
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-[#9D00FF] border-2 border-black rounded-lg flex items-center justify-center shadow-brutal">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold border-2 border-black",
                      isValid()
                        ? "bg-green-500 text-white"
                        : "bg-gray-500 text-white"
                    )}
                  >
                    {isValid() ? "Активен" : "Неактивен"}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-black mb-2">{code}</h3>
                <p className="text-3xl font-black text-[#9D00FF] mb-4">-{discount}%</p>

                <div className="space-y-1 text-sm text-black/70 mb-4">
                  {validFrom && (
                    <p>
                      <span className="font-bold">С:</span>{" "}
                      {new Date(validFrom).toLocaleDateString("ru-RU")}
                    </p>
                  )}
                  {validUntil && (
                    <p>
                      <span className="font-bold">До:</span>{" "}
                      {new Date(validUntil).toLocaleDateString("ru-RU")}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-2 border-black shadow-brutal brutal-hover"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Редактировать
                  </Button>
                  <Button
                    variant="outline"
                    className="border-2 border-red-500 text-red-500 shadow-brutal hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
