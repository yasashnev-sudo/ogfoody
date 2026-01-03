"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Check, Flame, Dumbbell, Droplets, Wheat } from "lucide-react"
import type { Meal, PortionSize } from "@/lib/types"
import { getMealPrice, getMealWeight } from "@/lib/types"
import { cn } from "@/lib/utils"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface MealDetailModalProps {
  meal: Meal | null
  isOpen: boolean
  onClose: () => void
  onSelect: (meal: Meal, portion: PortionSize) => void
  selectedPortion?: PortionSize
}

// Расчет КБЖУ на порцию (пропорционально весу)
function calculateNutritionForPortion(meal: Meal, portion: PortionSize) {
  const baseWeight = meal.nutrition?.weight || meal.weights.single || 100
  const portionWeight = getMealWeight(meal, portion)
  const multiplier = portionWeight / baseWeight

  return {
    calories: Math.round((meal.nutrition?.calories || 0) * multiplier),
    protein: Math.round((meal.nutrition?.protein || 0) * multiplier * 10) / 10,
    fats: Math.round((meal.nutrition?.fats || 0) * multiplier * 10) / 10,
    carbs: Math.round((meal.nutrition?.carbs || 0) * multiplier * 10) / 10,
  }
}

// КБЖУ на 100г
function calculateNutritionPer100g(meal: Meal) {
  const baseWeight = meal.nutrition?.weight || meal.weights.single || 100
  const multiplier = 100 / baseWeight

  return {
    calories: Math.round((meal.nutrition?.calories || 0) * multiplier),
    protein: Math.round((meal.nutrition?.protein || 0) * multiplier * 10) / 10,
    fats: Math.round((meal.nutrition?.fats || 0) * multiplier * 10) / 10,
    carbs: Math.round((meal.nutrition?.carbs || 0) * multiplier * 10) / 10,
  }
}

export function MealDetailModal({ meal, isOpen, onClose, onSelect, selectedPortion = "single" }: MealDetailModalProps) {
  const [portion, setPortion] = useState<PortionSize>(selectedPortion)

  // Синхронизируем portion с selectedPortion при изменении пропа или открытии модального окна
  useEffect(() => {
    if (isOpen && meal) {
      setPortion(selectedPortion)
    }
  }, [isOpen, selectedPortion, meal?.id])

  if (!meal) return null

  const price = getMealPrice(meal, portion)
  const weight = getMealWeight(meal, portion)
  const nutritionPortion = calculateNutritionForPortion(meal, portion)
  const nutrition100g = calculateNutritionPer100g(meal)

  const portions: { value: PortionSize; label: string; available: boolean }[] = [
    { value: "single", label: "Стандартная", available: true },
    { value: "medium", label: "Двойная", available: !!meal.prices.medium && meal.prices.medium > 0 },
    { value: "large", label: "Тройная", available: !!meal.prices.large && meal.prices.large > 0 },
  ]
  const availablePortions = portions.filter((p) => p.available)

  const handleSelect = () => {
    onSelect({ ...meal, portion }, portion)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-0 rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col">
        <VisuallyHidden>
          <DialogTitle>{meal.name}</DialogTitle>
        </VisuallyHidden>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-white/80 hover:bg-white backdrop-blur-md rounded-full shadow-md text-foreground z-50 transition-all border border-border/20"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Изображение */}
          <div className="relative w-full aspect-square bg-muted">
            {meal.image ? (
              <Image src={meal.image || "/placeholder.svg"} alt={meal.name} fill className="object-cover" priority />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">Нет изображения</div>
            )}
            {meal.needsGarnish && (
              <div className="absolute bottom-6 left-6">
                <Badge className="bg-amber-500 text-white border-0 px-4 py-2 text-xs font-bold rounded-full shadow-xl">
                  + гарнир
                </Badge>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
          </div>

          <div className="p-6 pt-0 space-y-8 pb-32">
            {/* Название и вес */}
            <div className="relative -mt-4">
              <h2 className="text-2xl sm:text-3xl font-black leading-tight text-foreground tracking-tight">{meal.name}</h2>
              <div className="flex items-center gap-3 mt-3">
                 <div className="bg-[#9D00FF] text-white px-3 py-1 rounded-xl text-lg font-black border-2 border-black">
                    {price} ₽
                 </div>
                 <div className="text-muted-foreground font-bold bg-muted/50 px-3 py-1 rounded-full text-sm">
                    {weight} г
                 </div>
              </div>
            </div>

            {/* Состав */}
            {meal.ingredients && (
              <div className="space-y-3">
                <p className="text-xs font-black uppercase tracking-[0.1em] text-muted-foreground/60 px-1">Состав</p>
                <p className="text-sm text-foreground/90 leading-relaxed bg-muted/30 p-4 rounded-3xl border border-border/40">{meal.ingredients}</p>
              </div>
            )}

            {/* Описание */}
            {meal.description && (
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Описание</p>
                <p className="text-sm leading-relaxed text-foreground/80">{meal.description}</p>
              </div>
            )}

            {/* Выбор порции */}
            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-[0.1em] text-muted-foreground/60 px-1">Размер порции</p>
              {availablePortions.length > 1 ? (
                <div className="flex bg-muted/40 p-1.5 rounded-[2rem] border border-border/40">
                  {availablePortions.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPortion(p.value)}
                      className={cn(
                        "flex-1 flex flex-col items-center justify-center py-3 px-2 rounded-3xl transition-all",
                        portion === p.value 
                          ? "bg-white text-primary shadow-xl shadow-primary/5 font-black ring-1 ring-black/5" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span className="text-sm">{p.label}</span>
                      <span className="text-[10px] mt-1 opacity-70 font-bold uppercase tracking-wider">{getMealWeight(meal, p.value)} г</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-muted/30 p-5 rounded-3xl border border-border/40 flex items-center justify-between">
                   <span className="text-sm font-black text-foreground">Стандартная</span>
                   <div className="bg-white/60 px-3 py-1 rounded-full text-xs font-bold text-muted-foreground border border-border/20">
                      {getMealWeight(meal, "single")} г
                   </div>
                </div>
              )}
            </div>

            {/* КБЖУ */}
            <div className="space-y-4 pt-2">
               <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Пищевая ценность</p>
                  <p className="text-xs text-muted-foreground font-medium italic">на порцию</p>
               </div>
              
              <div className="grid grid-cols-4 gap-3">
                  <div className="bg-orange-50/50 rounded-2xl p-3 text-center border border-orange-100/50">
                    <div className="flex justify-center mb-1.5"><Flame className="h-4 w-4 text-orange-500" /></div>
                    <p className="text-base font-black text-orange-900 leading-none">{nutritionPortion.calories}</p>
                    <p className="text-[10px] text-orange-700/60 mt-1 font-bold">ккал</p>
                  </div>
                  <div className="bg-slate-50/50 rounded-2xl p-3 text-center border border-slate-100/50">
                    <div className="flex justify-center mb-1.5"><Dumbbell className="h-4 w-4 text-slate-500" /></div>
                    <p className="text-base font-black text-slate-900 leading-none">{nutritionPortion.protein}</p>
                    <p className="text-[10px] text-slate-700/60 mt-1 font-bold">белки</p>
                  </div>
                  <div className="bg-yellow-50/50 rounded-2xl p-3 text-center border border-yellow-100/50">
                    <div className="flex justify-center mb-1.5"><Droplets className="h-4 w-4 text-yellow-500" /></div>
                    <p className="text-base font-black text-yellow-900 leading-none">{nutritionPortion.fats}</p>
                    <p className="text-[10px] text-yellow-700/60 mt-1 font-bold">жиры</p>
                  </div>
                  <div className="bg-amber-50/50 rounded-2xl p-3 text-center border border-amber-100/50">
                    <div className="flex justify-center mb-1.5"><Wheat className="h-4 w-4 text-amber-600" /></div>
                    <p className="text-base font-black text-amber-900 leading-none">{nutritionPortion.carbs}</p>
                    <p className="text-[10px] text-amber-700/60 mt-1 font-bold">углеводы</p>
                  </div>
              </div>
              
              <div className="text-[11px] text-muted-foreground text-center font-medium bg-muted/20 py-2 rounded-lg">
                На 100г: {nutrition100g.calories} ккал / Б {nutrition100g.protein} / Ж {nutrition100g.fats} / У {nutrition100g.carbs}
              </div>
            </div>
          </div>
        </div>

        {/* Кнопка выбора - фиксированная снизу */}
        <div className="p-6 bg-gradient-to-t from-background via-background/95 to-transparent shrink-0 safe-area-bottom absolute bottom-0 left-0 right-0 z-50">
          <Button 
            onClick={handleSelect} 
            className="w-full h-16 text-lg font-black rounded-3xl shadow-2xl shadow-primary/40 transition-transform active:scale-95 bg-primary hover:bg-primary/90" 
            size="lg"
          >
            Выбрать за {price} ₽
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
