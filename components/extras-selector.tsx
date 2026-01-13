"use client"

import { useState } from "react"
import { Plus, Minus, Wine, Droplets, Cake, Cookie, ZoomIn } from "lucide-react"
import type { Extra, ExtraItem } from "@/lib/types"
import { ImageModal } from "@/components/image-modal"

interface ExtrasSelectorProps {
  extras: Extra[]
  availableExtras?: Record<string, ExtraItem[]>
  onUpdate?: (extras: Extra[]) => void
  disabled?: boolean
}

const categoryConfig: Record<string, { label: string; icon: typeof Wine }> = {
  drink: { label: "Напитки", icon: Wine },
  sauce: { label: "Соусы", icon: Droplets },
  dessert: { label: "Десерты", icon: Cake },
  snack: { label: "Закуски", icon: Cookie },
}

export function ExtrasSelector({ extras, availableExtras, onUpdate, disabled }: ExtrasSelectorProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [imageModal, setImageModal] = useState<{
    image: string
    name: string
    price: number
    ingredients?: string
    description?: string
    nutrition?: { calories: number; protein: number; fats: number; carbs: number; weight?: number }
  } | null>(null)

  const getExtraQuantity = (name: string) => {
    return extras.find((e) => e.name === name)?.quantity || 0
  }

  const updateExtra = (item: ExtraItem, delta: number) => {
    if (disabled || !onUpdate) return
    const existing = extras.find((e) => e.name === item.name)
    const currentQty = existing?.quantity || 0
    const newQty = Math.max(0, currentQty + delta)

    if (newQty === 0) {
      onUpdate(extras.filter((e) => e.name !== item.name))
    } else if (existing) {
      onUpdate(extras.map((e) => (e.name === item.name ? { ...e, quantity: newQty } : e)))
    } else {
      // ✅ ИСПРАВЛЕНИЕ: Добавляем id при создании нового extra
      onUpdate([...extras, { id: item.id, name: item.name, price: item.price, quantity: newQty, image: item.image }])
    }
  }

  const getCategoryItems = (category: string): ExtraItem[] => {
    return availableExtras?.[category] || []
  }

  const getCategoryTotal = (category: string) => {
    return getCategoryItems(category).reduce((sum, item) => {
      const qty = getExtraQuantity(item.name)
      return sum + item.price * qty
    }, 0)
  }

  const getCategoryCount = (category: string) => {
    return getCategoryItems(category).reduce((sum, item) => sum + getExtraQuantity(item.name), 0)
  }

  const categories = Object.keys(availableExtras || {}).filter(
    (cat) => categoryConfig[cat] && getCategoryItems(cat).length > 0,
  )

  if (disabled) {
    const selectedExtras = extras.filter((e) => e.quantity > 0)
    if (selectedExtras.length === 0) {
      return (
        <div>
        <h3 className="font-black text-sm text-black mb-2">Дополнения к заказу</h3>
        <p className="text-xs text-black/70">Нет дополнений</p>
        </div>
      )
    }

    return (
      <div>
        <h3 className="font-black text-sm text-black mb-2">Дополнения к заказу</h3>
        <div className="space-y-2">
          {selectedExtras.map((extra) => {
            const fullExtraData = Object.values(availableExtras || {})
              .flat()
              .find((e) => e.name === extra.name)

            return (
              <div key={extra.name} className="flex items-center gap-3 p-2 rounded-lg bg-white border-2 border-black shadow-brutal">
                {extra.image && (
                  <div
                    className="relative w-10 h-10 rounded-lg overflow-hidden bg-white border-2 border-black flex-shrink-0 cursor-pointer group shadow-brutal"
                    onClick={() =>
                      setImageModal({
                        image: extra.image || "",
                        name: extra.name,
                        price: extra.price,
                        ingredients: fullExtraData?.ingredients,
                        description: fullExtraData?.description,
                        nutrition: fullExtraData?.nutrition,
                      })
                    }
                  >
                    <img
                      src={extra.image || "/placeholder.svg"}
                      alt={extra.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ZoomIn className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm truncate text-black">{extra.name}</p>
                </div>
                <div className="text-sm text-black/70 font-medium">x{extra.quantity}</div>
                <div className="text-sm font-black text-[#9D00FF]">{extra.price * extra.quantity} ₽</div>
              </div>
            )
          })}
        </div>

        {imageModal && (
          <ImageModal
            image={imageModal.image}
            name={imageModal.name}
            ingredients={imageModal.ingredients}
            description={imageModal.description}
            nutrition={imageModal.nutrition}
            onClose={() => setImageModal(null)}
          />
        )}
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="space-y-3">
        <h3 className="font-black text-sm text-black mb-2">Дополнения к заказу</h3>
        <p className="text-sm text-black/70">Загрузка дополнений...</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="font-black text-sm text-black mb-2">Дополнения к заказу</h3>

      {categories.map((category) => {
        const config = categoryConfig[category]
        if (!config) return null

        const Icon = config.icon
        const count = getCategoryCount(category)
        const total = getCategoryTotal(category)
        const isExpanded = expandedCategory === category
        const items = getCategoryItems(category)

        return (
          <div key={category} className="border-2 border-black rounded-lg overflow-hidden bg-white shadow-brutal">
            <button
              onClick={() => setExpandedCategory(isExpanded ? null : category)}
              className="w-full flex items-center justify-between p-3 bg-white hover:bg-[#FFEA00] transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-brutal">
                  <Icon className="w-4 h-4 text-[#9D00FF] stroke-[2.5px]" />
                </div>
                <span className="font-black text-sm text-black">{config.label}</span>
                {count > 0 && (
                  <span className="bg-[#9D00FF] text-white text-xs px-2 py-0.5 rounded-lg border-2 border-black font-black shadow-brutal">{count}</span>
                )}
              </div>
              {total > 0 && <span className="text-sm font-black text-[#9D00FF]">{total} ₽</span>}
            </button>

            {isExpanded && (
              <div className="p-3 space-y-2 bg-white border-t-2 border-black">
                {items.map((item) => {
                  const qty = getExtraQuantity(item.name)
                  return (
                    <div key={item.name} className="flex items-center gap-3 p-2 rounded-lg bg-white border-2 border-black shadow-brutal">
                      <div
                        className="relative w-12 h-12 rounded-lg overflow-hidden bg-white border-2 border-black flex-shrink-0 cursor-pointer group shadow-brutal"
                        onClick={() =>
                          setImageModal({
                            image: item.image || "",
                            name: item.name,
                            price: item.price,
                            ingredients: item.ingredients,
                            description: item.description,
                            nutrition: item.nutrition,
                          })
                        }
                      >
                        <img
                          src={item.image || "/placeholder.svg?height=48&width=48&query=" + item.name}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ZoomIn className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-black text-sm truncate text-black">{item.name}</p>
                        <p className="text-xs text-black/70 font-medium">{item.price} ₽</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {qty > 0 ? (
                          <>
                            <button
                              onClick={() => updateExtra(item, -1)}
                              className="w-7 h-7 rounded-lg bg-white border-2 border-black flex items-center justify-center hover:bg-[#FFEA00] transition-colors shadow-brutal"
                            >
                              <Minus className="w-3.5 h-3.5 text-black stroke-[2.5px]" />
                            </button>
                            <span className="w-6 text-center font-black text-sm text-black">{qty}</span>
                            <button
                              onClick={() => updateExtra(item, 1)}
                              className="w-7 h-7 rounded-lg bg-[#9D00FF] text-white border-2 border-black flex items-center justify-center hover:bg-[#B033FF] transition-colors shadow-brutal"
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[2.5px]" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => updateExtra(item, 1)}
                            className="px-3 py-1.5 rounded-lg bg-[#9D00FF] text-white text-xs font-black hover:bg-[#B033FF] transition-colors border-2 border-black shadow-brutal"
                          >
                            Добавить
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      {imageModal && (
        <ImageModal
          image={imageModal.image}
          name={imageModal.name}
          ingredients={imageModal.ingredients}
          description={imageModal.description}
          nutrition={imageModal.nutrition}
          onClose={() => setImageModal(null)}
          onAdd={() => {
            const item = Object.values(availableExtras || {})
              .flat()
              .find((e) => e.name === imageModal.name)
            if (item) {
              updateExtra(item, 1)
            }
            setImageModal(null)
          }}
        />
      )}
    </div>
  )
}
