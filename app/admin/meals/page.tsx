"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Utensils, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface Meal {
  Id: number
  "Name"?: string
  name?: string
  "Category"?: string
  category?: string
  "Price Single"?: number
  price_single?: number
  "Image"?: string
  image?: string
  "Is Current Week"?: boolean
  is_current_week?: boolean
  "Is Next Week"?: boolean
  is_next_week?: boolean
}

export default function AdminMealsPage() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  useEffect(() => {
    loadMeals()
  }, [])

  useEffect(() => {
    filterMeals()
  }, [meals, search, categoryFilter])

  const loadMeals = async () => {
    try {
      const response = await fetch("/api/db/Meals/records?limit=1000")
      const data = await response.json()
      setMeals(data.list || [])
    } catch (error) {
      console.error("Ошибка загрузки блюд:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterMeals = () => {
    let filtered = meals

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (meal) =>
          (meal["Name"] || meal.name || "").toLowerCase().includes(searchLower)
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (meal) =>
          (meal["Category"] || meal.category || "") === categoryFilter
      )
    }

    setFilteredMeals(filtered)
  }

  const categories = [
    "all",
    "breakfast",
    "lunch_soup",
    "lunch_main",
    "lunch_salad",
    "dinner_soup",
    "dinner_main",
    "dinner_salad",
    "garnish",
  ]

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      all: "Все категории",
      breakfast: "Завтрак",
      lunch_soup: "Обед - Суп",
      lunch_main: "Обед - Основное",
      lunch_salad: "Обед - Салат",
      dinner_soup: "Ужин - Суп",
      dinner_main: "Ужин - Основное",
      dinner_salad: "Ужин - Салат",
      garnish: "Гарнир",
    }
    return labels[category] || category
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#9D00FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black font-bold">Загрузка блюд...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-black mb-2">Управление блюдами</h1>
          <p className="text-black/70">Просмотр и редактирование блюд</p>
        </div>
        <Button className="bg-[#9D00FF] text-white border-2 border-black shadow-brutal brutal-hover">
          Добавить блюдо
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
              placeholder="Поиск по названию..."
              className="pl-10 border-2 border-black rounded-lg shadow-brutal"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  "px-4 py-2 rounded-lg border-2 font-bold text-sm whitespace-nowrap transition-all",
                  categoryFilter === cat
                    ? "bg-[#9D00FF] text-white border-black shadow-brutal"
                    : "bg-white text-black border-black shadow-brutal hover:bg-[#FFEA00] brutal-hover"
                )}
              >
                {getCategoryLabel(cat)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Список блюд */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredMeals.length === 0 ? (
          <Card className="col-span-full bg-white border-2 border-black rounded-xl shadow-brutal p-12 text-center">
            <Utensils className="w-16 h-16 text-black/30 mx-auto mb-4" />
            <p className="text-black/70 font-medium">Блюда не найдены</p>
          </Card>
        ) : (
          filteredMeals.map((meal) => {
            const name = meal["Name"] || meal.name || "Без названия"
            const category = meal["Category"] || meal.category || ""
            const price = meal["Price Single"] || meal.price_single || 0
            const image = meal["Image"] || meal.image || ""
            const isCurrentWeek = meal["Is Current Week"] || meal.is_current_week || false
            const isNextWeek = meal["Is Next Week"] || meal.is_next_week || false

            return (
              <Card
                key={meal.Id}
                className="bg-white border-2 border-black rounded-xl shadow-brutal overflow-hidden"
              >
                {image && (
                  <div className="relative w-full h-48 bg-gray-100">
                    <Image
                      src={image}
                      alt={name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-black text-black flex-1">{name}</h3>
                    <div className="flex gap-1">
                      {isCurrentWeek && (
                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded border border-black">
                          Текущая
                        </span>
                      )}
                      {isNextWeek && (
                        <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded border border-black">
                          Следующая
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-black/70 mb-2">{getCategoryLabel(category)}</p>
                  <p className="text-xl font-black text-[#9D00FF] mb-4">{price}₽</p>
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
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
