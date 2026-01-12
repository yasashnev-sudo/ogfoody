"use client"

import { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, Loader2, Search } from "lucide-react"
import type { NocoDBDeliveryZone } from "@/lib/nocodb"

interface DistrictSelectionModalProps {
  open: boolean
  onDistrictSelected: (district: string) => void
  userName?: string
  isGuest?: boolean
  onLoginClick?: () => void
  onCancel?: () => void // ✅ ДОБАВЛЕНО: возможность отменить выбор
}

export function DistrictSelectionModal({ open, onDistrictSelected, userName, isGuest = false, onLoginClick, onCancel }: DistrictSelectionModalProps) {
  const [districts, setDistricts] = useState<NocoDBDeliveryZone[]>([])
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(true)

  useEffect(() => {
    if (open) {
      loadDistricts()
    }
  }, [open])

  const loadDistricts = async () => {
    try {
      setIsLoadingDistricts(true)
      const response = await fetch("/api/menu")
      const data = await response.json()
      
      console.log("📍 Загружены районы:", data.deliveryZones?.length, "шт.")
      
      if (data.deliveryZones && Array.isArray(data.deliveryZones)) {
        // Сортируем районы по алфавиту
        const sortedDistricts = data.deliveryZones.sort((a: NocoDBDeliveryZone, b: NocoDBDeliveryZone) => {
          const nameA = (a.District || a.district || "").toLowerCase()
          const nameB = (b.District || b.district || "").toLowerCase()
          return nameA.localeCompare(nameB, 'ru')
        })
        setDistricts(sortedDistricts)
      }
    } catch (error) {
      console.error("Ошибка загрузки районов:", error)
    } finally {
      setIsLoadingDistricts(false)
    }
  }

  const filteredDistricts = useMemo(() => {
    if (!searchQuery.trim()) return districts
    
    const query = searchQuery.toLowerCase().trim()
    return districts.filter((zone) => {
      const districtName = (zone.District || zone.district || "").toLowerCase()
      return districtName.includes(query)
    })
  }, [districts, searchQuery])

  const handleSubmit = async () => {
    if (!selectedDistrict) return

    setLoading(true)
    try {
      // Вызываем callback с выбранным районом
      await onDistrictSelected(selectedDistrict)
    } catch (error) {
      console.error("Ошибка при сохранении района:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-[500px]" 
        onPointerDownOutside={(e) => e.preventDefault()} 
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={!isGuest} // ✅ НОВОЕ: Скрываем крестик для гостей
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="h-6 w-6 text-green-600" />
            Укажите район доставки
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            {userName ? (
              <span className="block mb-2">Приятно познакомиться, {userName}! 👋</span>
            ) : isGuest ? (
              <span className="block mb-2">Добро пожаловать! 👋</span>
            ) : null}
            <span className="block font-medium text-foreground">Мы работаем в Санкт-Петербурге</span>
            <span className="block mt-1">Выберите ваш район, чтобы мы могли рассчитать стоимость доставки</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {isLoadingDistricts ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Загружаем районы...</span>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <label className="text-sm font-medium">Выберите ваш район</label>
                
                {/* Поиск */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Найти район..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-11"
                  />
                </div>

                {/* Список районов */}
                <ScrollArea className="h-[300px] w-full rounded-md border">
                  <div className="p-2 space-y-1">
                    {filteredDistricts.length > 0 ? (
                      filteredDistricts.map((zone, index) => {
                        const districtName = zone.District || zone.district || ""
                        // ✅ ИСПРАВЛЕНО: Читаем deliveryFee из всех возможных вариантов (включая camelCase из API)
                        const deliveryFee = (zone as any).deliveryFee || zone["Delivery Fee"] || zone.delivery_fee || 0
                        const isSelected = selectedDistrict === districtName
                        
                        return (
                          <button
                            key={zone.Id || `district-${index}`}
                            onClick={() => setSelectedDistrict(districtName)}
                            className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-accent hover:text-accent-foreground"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{districtName}</span>
                              <span className={`text-sm ${isSelected ? "opacity-90" : "text-muted-foreground"}`}>
                                {Number(deliveryFee) > 0 ? `${deliveryFee}₽` : "Бесплатно"}
                              </span>
                            </div>
                          </button>
                        )
                      })
                    ) : (
                      <div className="py-8 text-center text-muted-foreground">
                        <p>Район не найден</p>
                        <p className="text-sm mt-1">Попробуйте изменить поисковый запрос</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <p className="text-xs text-muted-foreground">
                  💡 Доставка бесплатная при заказе от 2300₽
                </p>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!selectedDistrict || loading}
                className="w-full h-12 text-base font-medium"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Сохраняем...
                  </>
                ) : (
                  <>
                    <MapPin className="mr-2 h-5 w-5" />
                    Продолжить
                  </>
                )}
              </Button>

              {/* ✅ НОВОЕ: Кнопка отмены оформления (облагороженная) */}
              {onCancel && (
                <div className="mt-4 pt-4 border-t">
                  <button
                    onClick={onCancel}
                    className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Отменить оформление заказа
                  </button>
                </div>
              )}

              {/* Кнопка для авторизации существующих пользователей */}
              {onLoginClick && (
                <button
                  onClick={onLoginClick}
                  className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Уже есть аккаунт? <span className="underline font-medium">Войти</span>
                </button>
              )}
            </>
          )}
        </div>

        <div className="text-xs text-muted-foreground text-center border-t pt-4">
          Вы сможете изменить район позже в настройках профиля
        </div>
      </DialogContent>
    </Dialog>
  )
}

