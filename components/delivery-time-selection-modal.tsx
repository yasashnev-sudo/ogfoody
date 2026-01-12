"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Calendar, Loader2 } from "lucide-react"

interface DeliveryTimeSelectionModalProps {
  open: boolean
  district: string
  date: Date
  preselectedTime?: string
  onTimeSelected: (deliveryTime: string) => void
  onBack?: () => void
}

export function DeliveryTimeSelectionModal({ 
  open, 
  district, 
  date,
  preselectedTime,
  onTimeSelected,
  onBack 
}: DeliveryTimeSelectionModalProps) {
  const [availableIntervals, setAvailableIntervals] = useState<string[]>([])
  const [selectedTime, setSelectedTime] = useState<string>(preselectedTime || "")
  const [loading, setLoading] = useState(false)
  const [isLoadingIntervals, setIsLoadingIntervals] = useState(true)

  useEffect(() => {
    if (open && district) {
      loadDeliveryIntervals()
    }
  }, [open, district])

  const loadDeliveryIntervals = async () => {
    try {
      setIsLoadingIntervals(true)
      console.log("🔍 Загружаем интервалы для района:", district)
      const response = await fetch("/api/menu")
      const data = await response.json()
      
      console.log("📦 Данные от API:", {
        hasDeliveryZones: !!data.deliveryZones,
        zonesCount: data.deliveryZones?.length,
        firstZone: data.deliveryZones?.[0]
      })
      
      if (data.deliveryZones && Array.isArray(data.deliveryZones)) {
        // Находим зону доставки для выбранного района (поддерживаем разные варианты названий полей)
        let zone = data.deliveryZones.find((z: any) => {
          const zoneName = z.District || z.district || z["Район"] || ""
          const normalizedZoneName = zoneName.toLowerCase().trim()
          const normalizedDistrict = district.toLowerCase().trim()
          
          return normalizedZoneName === normalizedDistrict || zoneName === district
        })
        
        // Если не нашли точное совпадение, попробуем найти по частичному
        if (!zone) {
          console.log("⚠️ Точное совпадение не найдено, ищем по частичному...")
          zone = data.deliveryZones.find((z: any) => {
            const zoneName = (z.District || z.district || z["Район"] || "").toLowerCase().trim()
            const searchTerm = district.toLowerCase().trim()
            return zoneName.includes(searchTerm) || searchTerm.includes(zoneName)
          })
        }
        
        console.log("✅ Найденная зона:", zone)
        
        if (zone) {
          // Поддерживаем разные варианты названий полей для интервалов
          const intervals = zone["Available Intervals"] || zone.available_intervals || zone.availableIntervals || zone["Доступные интервалы"] || []
          console.log("⏰ Интервалы:", intervals, "Тип:", typeof intervals, "Array?", Array.isArray(intervals))
          
          // Проверяем, что intervals это массив строк
          let parsedIntervals: string[] = []
          if (Array.isArray(intervals)) {
            parsedIntervals = intervals
          } else if (typeof intervals === 'string') {
            // Если это строка, пробуем распарсить JSON
            try {
              const parsed = JSON.parse(intervals)
              parsedIntervals = Array.isArray(parsed) ? parsed : []
            } catch {
              // Если не JSON, разбиваем по запятой
              parsedIntervals = intervals.split(',').map(s => s.trim()).filter(Boolean)
            }
          }
          
          console.log("📋 Обработанные интервалы:", parsedIntervals)
          setAvailableIntervals(parsedIntervals)
          
          // Если есть предвыбранное время и оно доступно - устанавливаем
          if (preselectedTime && parsedIntervals.includes(preselectedTime)) {
            setSelectedTime(preselectedTime)
          }
        } else {
          console.warn(`⚠️ Район "${district}" не найден в зонах доставки`)
          console.log("Доступные районы:", data.deliveryZones?.map((z: any) => z.District || z.district || z["Район"]))
          setAvailableIntervals([])
        }
      }
    } catch (error) {
      console.error("Ошибка загрузки интервалов доставки:", error)
      setAvailableIntervals([])
    } finally {
      setIsLoadingIntervals(false)
    }
  }

  const handleSubmit = async () => {
    if (!selectedTime) return

    setLoading(true)
    try {
      await onTimeSelected(selectedTime)
    } catch (error) {
      console.error("Ошибка при сохранении времени доставки:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date): string => {
    const days = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"]
    const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]
    
    return `${date.getDate()} ${months[date.getMonth()]} (${days[date.getDay()]})`
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-[500px]" 
        onPointerDownOutside={(e) => e.preventDefault()} 
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            Выберите время доставки
          </DialogTitle>
          <div className="text-base pt-2 space-y-2 text-muted-foreground">
            <div className="flex items-center gap-2 text-foreground">
              <MapPin className="h-4 w-4 text-green-600" />
              <span className="font-medium">{district}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{formatDate(date)}</span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {isLoadingIntervals ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Загружаем интервалы...</span>
            </div>
          ) : availableIntervals.length > 0 ? (
            <>
              <div className="space-y-3">
                <label className="text-sm font-medium">Доступные интервалы</label>
                
                <div className="space-y-2">
                  {availableIntervals.map((interval, index) => {
                    const isSelected = selectedTime === interval
                    
                    return (
                      <button
                        key={`${interval}-${index}`}
                        onClick={() => setSelectedTime(interval)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all border-2 ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary shadow-md"
                            : "bg-background border-border hover:border-primary/50 hover:bg-accent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected 
                              ? "border-primary-foreground bg-primary-foreground" 
                              : "border-muted-foreground"
                          }`}>
                            {isSelected && (
                              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                            )}
                          </div>
                          <span className="font-medium text-base">{interval}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>

                <p className="text-xs text-muted-foreground">
                  ⏰ Доставка в выбранный интервал в указанную дату
                </p>
              </div>

              <div className="flex gap-3">
                {onBack && (
                  <Button
                    variant="outline"
                    onClick={onBack}
                    className="flex-1"
                  >
                    Назад
                  </Button>
                )}
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedTime || loading}
                  className="flex-1 h-12 text-base font-medium"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Сохраняем...
                    </>
                  ) : (
                    <>
                      <Clock className="mr-2 h-5 w-5" />
                      Продолжить
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground mb-4">
                К сожалению, нет доступных интервалов доставки для этого района
              </p>
              {onBack && (
                <Button onClick={onBack} variant="outline">
                  Выбрать другой район
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

