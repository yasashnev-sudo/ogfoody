"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, User, Phone, Star, Ban } from "lucide-react"

interface User {
  Id: number
  "Phone"?: string
  phone?: string
  "Name"?: string
  name?: string
  "Loyalty Points"?: number
  loyalty_points?: number
  "Total Spent"?: number
  total_spent?: number
  "Is Banned"?: boolean
  is_banned?: boolean
  "Registration Date"?: string
  registration_date?: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, search])

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/db/Users/records?limit=1000")
      const data = await response.json()
      setUsers(data.list || [])
    } catch (error) {
      console.error("Ошибка загрузки пользователей:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (user) =>
          (user["Phone"] || user.phone || "").toLowerCase().includes(searchLower) ||
          (user["Name"] || user.name || "").toLowerCase().includes(searchLower)
      )
    }

    setFilteredUsers(filtered)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#9D00FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black font-bold">Загрузка пользователей...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-black mb-2">Управление пользователями</h1>
        <p className="text-black/70">Просмотр и управление пользователями системы</p>
      </div>

      {/* Поиск */}
      <Card className="bg-white border-2 border-black rounded-xl shadow-brutal p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black/50" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по телефону или имени..."
            className="pl-10 border-2 border-black rounded-lg shadow-brutal"
          />
        </div>
      </Card>

      {/* Список пользователей */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.length === 0 ? (
          <Card className="col-span-full bg-white border-2 border-black rounded-xl shadow-brutal p-12 text-center">
            <User className="w-16 h-16 text-black/30 mx-auto mb-4" />
            <p className="text-black/70 font-medium">Пользователи не найдены</p>
          </Card>
        ) : (
          filteredUsers.map((user) => {
            const phone = user["Phone"] || user.phone || "Не указан"
            const name = user["Name"] || user.name || "Не указано"
            const points = user["Loyalty Points"] || user.loyalty_points || 0
            const spent = user["Total Spent"] || user.total_spent || 0
            const isBanned = user["Is Banned"] || user.is_banned || false
            const regDate = user["Registration Date"] || user.registration_date || ""

            return (
              <Card
                key={user.Id}
                className={cn(
                  "bg-white border-2 rounded-xl shadow-brutal p-6",
                  isBanned ? "border-red-500 opacity-75" : "border-black"
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-[#9D00FF] border-2 border-black rounded-lg flex items-center justify-center shadow-brutal">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  {isBanned && (
                    <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full border-2 border-black">
                      Забанен
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-black text-black mb-1">{name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-black/70">
                    <Phone className="w-4 h-4" />
                    <span className="font-medium">{phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-black/70">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">{points} баллов</span>
                  </div>
                  <div className="text-black/70">
                    <span className="font-medium">Потрачено: {spent}₽</span>
                  </div>
                  {regDate && (
                    <div className="text-xs text-black/50">
                      Регистрация: {new Date(regDate).toLocaleDateString("ru-RU")}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-2 border-black shadow-brutal brutal-hover"
                  >
                    Подробнее
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
