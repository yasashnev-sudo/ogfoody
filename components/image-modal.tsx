"use client"

import { X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Nutrition } from "@/lib/types"

interface ImageModalProps {
  image?: string
  imageUrl?: string
  name?: string
  title?: string
  description?: string
  ingredients?: string
  nutrition?: Nutrition
  isOpen?: boolean
  onClose: () => void
  onAdd?: () => void
}

export function ImageModal({
  image,
  imageUrl,
  name,
  title,
  description,
  ingredients,
  nutrition,
  onClose,
  onAdd,
}: ImageModalProps) {
  const displayImage = imageUrl || image
  const displayTitle = title || name

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-xl max-w-2xl w-full overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img
            src={displayImage || "/placeholder.svg"}
            alt={displayTitle || ""}
            className="w-full h-auto max-h-[50vh] object-contain"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-4 space-y-3">
          <h3 className="text-xl font-bold">{displayTitle}</h3>

          {description && (
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-sm text-foreground leading-relaxed">{description}</p>
            </div>
          )}

          {ingredients && (
            <div>
              <h4 className="text-sm font-semibold mb-1.5">Состав:</h4>
              <p className="text-sm text-muted-foreground">{ingredients}</p>
            </div>
          )}

          {nutrition && (
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
              <h4 className="text-sm font-semibold mb-3 text-foreground">Пищевая ценность на порцию:</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Калорийность</span>
                  <span className="text-base font-bold text-foreground">{nutrition.calories} ккал</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Белки</span>
                  <span className="text-base font-bold text-foreground">{nutrition.protein} г</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Жиры</span>
                  <span className="text-base font-bold text-foreground">{nutrition.fats} г</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Углеводы</span>
                  <span className="text-base font-bold text-foreground">{nutrition.carbs} г</span>
                </div>
                {nutrition.weight && (
                  <div className="flex flex-col gap-1 col-span-2">
                    <span className="text-xs text-muted-foreground">Вес порции</span>
                    <span className="text-base font-bold text-foreground">{nutrition.weight} г</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {onAdd && (
            <Button onClick={onAdd} className="w-full" size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Добавить
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
