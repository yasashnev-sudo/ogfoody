"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Gift, Plus, Edit, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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
  const [filteredPromoCodes, setFilteredPromoCodes] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
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

  useEffect(() => {
    filterPromoCodes()
  }, [promoCodes, search, statusFilter])

  const loadPromoCodes = async () => {
    try {
      const response = await fetch("/api/db/Promo_Codes/records?limit=1000&sort=-Id")
      const data = await response.json()
      setPromoCodes(data.list || [])
    } catch (error) {
      console.error("Ошибка загрузки промокодов:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterPromoCodes = () => {
    let filtered = promoCodes

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (promo) =>
          (promo["Code"] || promo.code || "").toLowerCase().includes(searchLower)
      )
    }

    if (statusFilter !== "all") {
      if (statusFilter === "active") {
        filtered = filtered.filter(
          (promo) => {
            const isActive = promo["Active"] || promo.active || false
            if (!isActive) return false
            const validFrom = promo["Valid From"] || promo.valid_from || ""
            const validUntil = promo["Valid Until"] || promo.valid_until || ""
            const now = new Date()
            if (validFrom && new Date(validFrom) > now) return false
            if (validUntil && new Date(validUntil) < now) return false
            return true
          }
        )
      } else if (statusFilter === "inactive") {
        filtered = filtered.filter(
          (promo) => {
            const isActive = promo["Active"] || promo.active || false
            if (!isActive) return true
            const validFrom = promo["Valid From"] || promo.valid_from || ""
            const validUntil = promo["Valid Until"] || promo.valid_until || ""
            const now = new Date()
            if (validFrom && new Date(validFrom) > now) return true
            if (validUntil && new Date(validUntil) < now) return true
            return false
          }
        )
      } else if (statusFilter === "deactivated") {
        filtered = filtered.filter(
          (promo) => !(promo["Active"] || promo.active || false)
        )
      }
    }

    setFilteredPromoCodes(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
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
        response = await fetch("/api/db/Promo_Codes/records", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([{ Id: editingId, ...promoData }]),
        })
      } else {
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
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        alert(`Ошибка сохранения: ${errorData.error || response.statusText}`)
      }
    } catch (error) {
      console.error("Ошибка сохранения промокода:", error)
      alert("Произошла ошибка при сохранении промокода")
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
    if (!confirm("Вы уверены, что хотите деактивировать этот промокод?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/promo/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        loadPromoCodes()
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        alert(`Ошибка деактивации: ${errorData.error || response.statusText}`)
      }
    } catch (error) {
      console.error("Ошибка деактивации промокода:", error)
      alert("Произошла ошибка при деактивации промокода")
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

  const getStatusLabel = (promo: PromoCode) => {
    const isActive = promo["Active"] || promo.active || false
    if (!isActive) return "Деактивирован"
    
    const validFrom = promo["Valid From"] || promo.valid_from || ""
    const validUntil = promo["Valid Until"] || promo.valid_until || ""
    const now = new Date()
    
    if (validFrom && new Date(validFrom) > now) return "Не начался"
    if (validUntil && new Date(validUntil) < now) return "Истек"
    return "Активен"
  }

  const getStatusColor = (promo: PromoCode) => {
    const status = getStatusLabel(promo)
    if (status === "Активен") return "bg-green-500"
    if (status === "Деактивирован") return "bg-red-500"
    return "bg-gray-500"
  }

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
          <h1 className="text-3xl font-black text-black mb-2">Управление промокодами</h1>
          <p className="text-black/70">Просмотр и управление промокодами и скидками</p>
        </div>
        <Button
          onClick={() => {
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
            setShowForm(true)
          }}
          className="bg-[#9D00FF] text-white border-2 border-black shadow-brutal brutal-hover"
        >
          <Plus className="w-4 h-4 mr-2" />
          Создать промокод
        </Button>
      </div>

      {/* Фильтры */}
      <Card className="bg-white border-2 border-black rounded-xl shadow-brutal p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black/50" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по коду промокода..."
              className="pl-10 border-2 border-black rounded-lg shadow-brutal"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="border-2 border-black rounded-lg shadow-brutal">
              <SelectValue placeholder="Статус промокода" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="active">Активен</SelectItem>
              <SelectItem value="inactive">Неактивен (истек/не начался)</SelectItem>
              <SelectItem value="deactivated">Деактивирован</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Список промокодов */}
      <div className="space-y-4">
        {filteredPromoCodes.length === 0 ? (
          <Card className="bg-white border-2 border-black rounded-xl shadow-brutal p-12 text-center">
            <Gift className="w-16 h-16 text-black/30 mx-auto mb-4" />
            <p className="text-black/70 font-medium">Промокоды не найдены</p>
          </Card>
        ) : (
          filteredPromoCodes.map((promo) => {
            const code = promo["Code"] || promo.code || ""
            const discountType = promo["Discount Type"] || promo.discount_type || "percentage"
            const discountValue = promo["Discount Value"] || promo.discount_value || 0
            const usageType = promo["Usage Type"] || promo.usage_type || "unlimited"
            const validFrom = promo["Valid From"] || promo.valid_from || ""
            const validUntil = promo["Valid Until"] || promo.valid_until || ""
            const status = getStatusLabel(promo)

            return (
              <Card
                key={promo.Id}
                className="bg-white border-2 border-black rounded-xl shadow-brutal p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Gift className="w-5 h-5 text-[#9D00FF]" />
                      <h3 className="text-lg font-black text-black">{code}</h3>
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold border-2 border-black text-white",
                          getStatusColor(promo)
                        )}
                      >
                        {status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-black/70 mb-1">Скидка</p>
                        <p className="font-black text-black text-lg">
                          -{discountValue}{discountType === "fixed" ? "₽" : "%"}
                        </p>
                      </div>
                      <div>
                        <p className="text-black/70 mb-1">Использование</p>
                        <p className="font-medium text-black">{getUsageTypeLabel(usageType)}</p>
                      </div>
                      <div>
                        <p className="text-black/70 mb-1">Период действия</p>
                        <p className="font-medium text-black">
                          {validFrom && validUntil
                            ? `${new Date(validFrom).toLocaleDateString("ru-RU")} - ${new Date(validUntil).toLocaleDateString("ru-RU")}`
                            : validFrom
                            ? `С ${new Date(validFrom).toLocaleDateString("ru-RU")}`
                            : validUntil
                            ? `До ${new Date(validUntil).toLocaleDateString("ru-RU")}`
                            : "Без ограничений"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(promo)}
                      variant="outline"
                      className="border-2 border-[#9D00FF] text-[#9D00FF] shadow-brutal brutal-hover"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Редактировать
                    </Button>
                    {(promo["Active"] || promo.active) && (
                      <Button
                        onClick={() => handleDelete(promo.Id)}
                        variant="outline"
                        className="border-2 border-red-500 text-red-500 shadow-brutal hover:bg-red-50"
                      >
                        Деактивировать
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>

      {/* Модальное окно создания/редактирования */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-white border-2 border-black rounded-xl shadow-brutal max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-black">
              {editingId ? "Редактировать промокод" : "Новый промокод"}
            </DialogTitle>
            <DialogDescription className="text-black/70">
              {editingId ? "Измените параметры промокода" : "Создайте новый промокод для скидок"}
            </DialogDescription>
          </DialogHeader>

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
              <Select
                value={formData.usage_type}
                onValueChange={(value: "unlimited" | "once_per_user" | "once_total") =>
                  setFormData({ ...formData, usage_type: value })
                }
              >
                <SelectTrigger className="border-2 border-black rounded-lg shadow-brutal">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unlimited">Действует постоянно (без ограничений)</SelectItem>
                  <SelectItem value="once_per_user">Один раз на пользователя</SelectItem>
                  <SelectItem value="once_total">Всего один раз (для всех)</SelectItem>
                </SelectContent>
              </Select>
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
        </DialogContent>
      </Dialog>
    </div>
  )
}
