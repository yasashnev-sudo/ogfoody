"use client"

import { useMemo } from "react"
import Image from "next/image"
import { useMenu } from "@/hooks/use-menu"
import { getMealPrice } from "@/lib/types"
import type { Meal } from "@/lib/types"

interface FreshCardProps {
  name: string
  image: string
  price: number
  description?: string
  onClick: () => void
}

function FreshCard({ name, image, price, onClick }: FreshCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border-2 border-black shadow-brutal flex-shrink-0 w-[280px] sm:w-[320px] overflow-hidden relative cursor-pointer hover:shadow-[3px_3px_0px_0px_#000000] transition-shadow"
    >
      {/* NEW Tag */}
      <div className="absolute top-3 right-3 bg-[#FFEA00] text-black text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-lg font-black border-2 border-black shadow-brutal z-10">
        NEW
      </div>
      
      {/* Image */}
      <div className="relative aspect-[4/3] w-full bg-muted border-b-2 border-black">
        <Image
          src={image || "/placeholder.jpg"}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-black text-base sm:text-lg text-black mb-2 line-clamp-2">
          {name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-lg sm:text-xl font-black text-[#9D00FF]">{price} ₽</span>
        </div>
      </div>
    </div>
  )
}

interface FreshSectionProps {
  onDishClick: (dish: { name: string; image: string; price: number; description?: string }) => void
}

// Helper function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function FreshSection({ onDishClick }: FreshSectionProps) {
  const { meals, isLoading } = useMenu()

  // Get random meals from different categories
  const freshItems = useMemo(() => {
    if (isLoading) return []

    // Collect all available meals from different categories
    const allMeals: Meal[] = []
    
    // Add meals from various categories
    const categories = [
      meals.lunch_salad,
      meals.lunch_main,
      meals.dinner_salad,
      meals.dinner_main,
      meals.breakfast,
    ]

    categories.forEach((categoryMeals) => {
      if (categoryMeals && categoryMeals.length > 0) {
        // Filter only meals with images (availability is determined by weekType)
        const availableMeals = categoryMeals.filter(
          (meal) => meal.image
        )
        allMeals.push(...availableMeals)
      }
    })

    // Shuffle and take first 3
    const shuffled = shuffleArray(allMeals)
    const selected = shuffled.slice(0, 3)

    // Convert to dish format
    return selected.map((meal) => ({
      name: meal.name,
      image: meal.image || "/placeholder.jpg",
      price: getMealPrice(meal, meal.portion),
      description: meal.description || meal.ingredients,
    }))
  }, [meals, isLoading])

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black uppercase tracking-tight">
          СВЕЖАК
        </h2>
        <div className="flex gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border-2 border-black shadow-brutal flex-shrink-0 w-[280px] sm:w-[320px] h-[400px] animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (freshItems.length === 0) {
    return null
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Section Title */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black uppercase tracking-tight">
        СВЕЖАК
      </h2>

      {/* Horizontal Scroll Row */}
      <div className="overflow-x-auto -mx-4 px-4 pb-2">
        <div className="flex gap-4 sm:gap-6">
          {freshItems.map((item, index) => (
            <FreshCard
              key={`${item.name}-${index}`}
              name={item.name}
              image={item.image}
              price={item.price}
              description={item.description}
              onClick={() => onDishClick(item)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

