"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FoodCardProps {
  id: number
  name: string
  description: string
  price: number
  calories: number
  image: string
}

export function FoodCard({ name, description, price, calories, image }: FoodCardProps) {
  const [quantity, setQuantity] = useState(0)

  const handleAdd = () => setQuantity((prev) => prev + 1)
  const handleRemove = () => setQuantity((prev) => Math.max(0, prev - 1))

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-brutal brutal-hover border-2 border-black h-full flex flex-col">
      <div className="relative aspect-[4/3] w-full bg-muted border-b-2 border-black">
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
        <div className="absolute top-2 right-2 bg-black text-white text-[10px] px-2 py-1 rounded-lg font-bold border border-white">
           {calories} ккал
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base leading-tight mb-1.5 truncate pr-2 text-black" title={name}>{name}</h3>
          <p className="text-xs text-foreground/70 leading-snug line-clamp-2 font-medium" title={description}>{description}</p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-lg font-black text-[#9D00FF]">{price} ₽</span>

          {quantity === 0 ? (
            <Button
              onClick={handleAdd}
              size="sm"
              variant="default"
              className="h-8 px-3 text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Добавить
            </Button>
          ) : (
            <div className="flex items-center gap-2 bg-white border-2 border-black rounded-xl p-1 shadow-brutal">
              <button
                onClick={handleRemove}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border-2 border-black text-black hover:bg-muted transition-colors font-bold"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center text-sm font-black text-black">{quantity}</span>
              <button
                onClick={handleAdd}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border-2 border-black text-black hover:bg-[#FFEA00] transition-colors font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
