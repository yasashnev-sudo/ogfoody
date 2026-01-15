"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Gift, Plus, Edit, Trash2, Checkbox } from "lucide-react"
import { cn } from "@/lib/utils"
import { Checkbox as UICheckbox } from "@/components/ui/checkbox"

interface PromoCode {
  Id: number
  "Code"?: string
  code?: string
  "Discount Type"?: string
  discount_type?: string
  "Discount Value"?: number
  discount_value?: number
  "Usage Type"?: string
  usage_type?: string
  "Valid From"?: string
  valid_from?: string
  "Valid Until"?: string
  valid_until?: string
  "Active"?: boolean
  active?: boolean
}

export default function AdminPromoPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage" as "percentage" | "fixed",
    discount_value: 0,
    usage_type: "unlimited" as "unlimited" | "once_per_user" | "once_total",
    valid_from: "",
    valid_until: "",
    active: true,
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
      // Формируем данные для отправки
      const promoData: any = {
        code: formData.code,
        discount_type: formData.discount_type,
        discount_value: formData.discount_value,
        usage_type: formData.usage_type,
        active: formData.active,
        valid_from: formData.valid_from || null,
        valid_until: formData.valid_until || null,
      }

      let response
      if (editingId) {
        // Редактирование
        response = await fetch(`/api/db/Promo_Codes/records/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(promoData),
        })
      } else {
        // Создание
        response = await fetch("/api/db/Promo_Codes/records", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([promoData]),
        })
      }

      if (response.ok) {
        setFormData({
          code: "",
          discount_type: "percentage",
          discount_value: 0,
          usage_type: "unlimited",
          valid_from: "",
          valid_until: "",
          active: true,
        })
        setShowForm(false)
        setEditingId(null)
        loadPromoCodes()
      }
    } catch (error) {
      console.error("Ошибка сохранения промокода:", error)
    }
  }

  const handleEdit = (promo: PromoCode) => {
    setEditingId(promo.Id)
    setFormData({
      code: promo["Code"] || promo.code || "",
      discount_type: (promo["Discount Type"] || promo.discount_type || "percentage") as "percentage" | "fixed",
      discount_value: promo["Discount Value"] || promo.discount_value || 0,
      usage_type: (promo["Usage Type"] || promo.usage_type || "unlimited") as "unlimited" | "once_per_user" | "once_total",
      valid_from: promo["Valid From"] || promo.valid_from || "",
      valid_until: promo["Valid Until"] || promo.valid_until || "",
      active: promo["Active"] || promo.active || false,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить этот промокод?")) {
      return
    }

    try {
      const response = await fetch(`/api/db/Promo_Codes/records/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        loadPromoCodes()
      }
    } catch (error) {
      console.error("Ошибка удаления промокода:", error)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      code: "",
      discount_type: "percentage",
      discount_value: 0,
      usage_type: "unlimited",
      valid_from: "",
      valid_until: "",
      active: true,
    })
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

      {/* Форма создания/редактирования */}
      {showForm && (
        <Card className="bg-white border-2 border-black rounded-xl shadow-brutal p-6">
          <h2 className="text-xl font-black text-black mb-4">
            {editingId ? "Редактировать промокод" : "Новый промокод"}
          </h2>
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
                <Label htmlFor="discount_type" className="text-black font-bold">
                  Тип скидки
                </Label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(value: "percentage" | "fixed") => 
                    setFormData({ ...formData, discount_type: value, discount_value: 0 })
                  }
                >
                  <SelectTrigger className="border-2 border-black rounded-lg shadow-brutal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Процент (%)</SelectItem>
                    <SelectItem value="fixed">Рубли (₽)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label 
                  htmlFor="discount_value" 
                  className="text-black font-bold"
                >
                  {formData.discount_type === "percentage" ? "Скидка (%)" : "Скидка (₽)"}
                </Label>
                <Input
                  id="discount_value"
                  type="text"
                  inputMode="decimal"
                  value={formData.discount_value || ""}
                  onChange={(e) => {
                    const input = e.target.value.replace(/[^0-9.,]/g, "").replace(",", ".")
                    const value = input === "" ? 0 : parseFloat(input) || 0
                    setFormData({ ...formData, discount_value: value })
                  }}
                  className="border-2 border-black rounded-lg shadow-brutal"
                  placeholder={formData.discount_type === "percentage" ? "10" : "1000"}
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
            <div className="space-y-2">
              <Label className="text-black font-bold">Тип использования</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <UICheckbox
                    id="usage_unlimited"
                    checked={formData.usage_type === "unlimited"}
                    onCheckedChange={() => setFormData({ ...formData, usage_type: "unlimited" })}
                    className="border-2 border-black"
                  />
                  <Label htmlFor="usage_unlimited" className="text-black font-medium cursor-pointer">
                    Действует постоянно (без ограничений)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <UICheckbox
                    id="usage_once_per_user"
                    checked={formData.usage_type === "once_per_user"}
                    onCheckedChange={() => setFormData({ ...formData, usage_type: "once_per_user" })}
                    className="border-2 border-black"
                  />
                  <Label htmlFor="usage_once_per_user" className="text-black font-medium cursor-pointer">
                    Один раз на пользователя
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <UICheckbox
                    id="usage_once_total"
                    checked={formData.usage_type === "once_total"}
                    onCheckedChange={() => setFormData({ ...formData, usage_type: "once_total" })}
                    className="border-2 border-black"
                  />
                  <Label htmlFor="usage_once_total" className="text-black font-medium cursor-pointer">
                    Всего один раз (для всех)
                  </Label>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                className="bg-[#9D00FF] text-white border-2 border-black shadow-brutal brutal-hover"
              >
                {editingId ? "Сохранить" : "Создать"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
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
            const discountType = promo["Discount Type"] || promo.discount_type || "percentage"
            const discountValue = promo["Discount Value"] || promo.discount_value || 0
            const usageType = promo["Usage Type"] || promo.usage_type || "unlimited"
            const validFrom = promo["Valid From"] || promo.valid_from || ""
            const validUntil = promo["Valid Until"] || promo.valid_until || ""
            const isActive = promo["Active"] || promo.active || false

            const getUsageTypeLabel = (type: string) => {
              switch (type) {
                case "unlimited":
                  return "Постоянно"
                case "once_per_user":
                  return "1 раз/пользователь"
                case "once_total":
                  return "Всего 1 раз"
                default:
                  return type
              }
            }

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
                <p className="text-3xl font-black text-[#9D00FF] mb-4">
                  -{discountValue}{discountType === "fixed" ? "₽" : "%"}
                </p>

                <div className="space-y-1 text-sm text-black/70 mb-4">
                  <p>
                    <span className="font-bold">Использование:</span> {getUsageTypeLabel(usageType)}
                  </p>
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
                    onClick={() => handleEdit(promo)}
                    variant="outline"
                    className="flex-1 border-2 border-black shadow-brutal brutal-hover"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Редактировать
                  </Button>
                  <Button
                    onClick={() => handleDelete(promo.Id)}
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
