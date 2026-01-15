"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Send, Clock, CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Notification {
  Id: number
  title: string
  message: string
  target_type: string
  target_value?: string
  status: "pending" | "sent" | "scheduled" | "failed"
  scheduled_at?: string
  sent_at?: string
  created_at: string
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    target_type: "all",
    target_value: "",
    scheduled_at: "",
  })

  useEffect(() => {
    loadNotifications()
    // Обновляем каждые 10 секунд
    const interval = setInterval(loadNotifications, 10000)
    return () => clearInterval(interval)
  }, [])

  const loadNotifications = async () => {
    try {
      const response = await fetch("/api/admin/notifications")
      const data = await response.json()
      setNotifications(data.notifications || [])
    } catch (error) {
      console.error("Ошибка загрузки уведомлений:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({
          title: "",
          message: "",
          target_type: "all",
          target_value: "",
          scheduled_at: "",
        })
        setShowForm(false)
        loadNotifications()
      }
    } catch (error) {
      console.error("Ошибка создания уведомления:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "scheduled":
        return <Clock className="w-5 h-5 text-blue-500" />
      case "failed":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      sent: "Отправлено",
      pending: "В очереди",
      scheduled: "Запланировано",
      failed: "Ошибка",
    }
    return labels[status] || status
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#9D00FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black font-bold">Загрузка уведомлений...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-black mb-2">Пуш-уведомления</h1>
          <p className="text-black/70">Управление уведомлениями для пользователей</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#9D00FF] text-white border-2 border-black shadow-brutal brutal-hover"
        >
          <Bell className="w-4 h-4 mr-2" />
          Создать уведомление
        </Button>
      </div>

      {/* Форма создания */}
      {showForm && (
        <Card className="bg-white border-2 border-black rounded-xl shadow-brutal p-6">
          <h2 className="text-xl font-black text-black mb-4">Новое уведомление</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-black font-bold">
                  Заголовок
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="border-2 border-black rounded-lg shadow-brutal"
                  placeholder="Заголовок уведомления"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_type" className="text-black font-bold">
                  Получатели
                </Label>
                <Select
                  value={formData.target_type}
                  onValueChange={(value) => setFormData({ ...formData, target_type: value })}
                >
                  <SelectTrigger className="border-2 border-black rounded-lg shadow-brutal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все пользователи</SelectItem>
                    <SelectItem value="user_phone">По телефону</SelectItem>
                    <SelectItem value="user_id">По ID пользователя</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(formData.target_type === "user_phone" || formData.target_type === "user_id") && (
              <div className="space-y-2">
                <Label htmlFor="target_value" className="text-black font-bold">
                  {formData.target_type === "user_phone" ? "Телефон" : "ID пользователя"}
                </Label>
                <Input
                  id="target_value"
                  value={formData.target_value}
                  onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
                  className="border-2 border-black rounded-lg shadow-brutal"
                  placeholder={formData.target_type === "user_phone" ? "+7 (999) 123-45-67" : "123"}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="message" className="text-black font-bold">
                Сообщение
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="border-2 border-black rounded-lg shadow-brutal min-h-[100px]"
                placeholder="Текст уведомления"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled_at" className="text-black font-bold">
                Запланировать на (необязательно)
              </Label>
              <Input
                id="scheduled_at"
                type="datetime-local"
                value={formData.scheduled_at}
                onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                className="border-2 border-black rounded-lg shadow-brutal"
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                className="bg-[#9D00FF] text-white border-2 border-black shadow-brutal brutal-hover"
              >
                <Send className="w-4 h-4 mr-2" />
                Отправить
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="border-2 border-black shadow-brutal brutal-hover"
              >
                Отмена
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Список уведомлений */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card className="bg-white border-2 border-black rounded-xl shadow-brutal p-12 text-center">
            <Bell className="w-16 h-16 text-black/30 mx-auto mb-4" />
            <p className="text-black/70 font-medium">Нет уведомлений</p>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.Id}
              className="bg-white border-2 border-black rounded-xl shadow-brutal p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(notification.status)}
                    <h3 className="text-lg font-black text-black">{notification.title}</h3>
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold border-2 border-black",
                        notification.status === "sent"
                          ? "bg-green-500 text-white"
                          : notification.status === "pending"
                          ? "bg-yellow-500 text-black"
                          : notification.status === "scheduled"
                          ? "bg-blue-500 text-white"
                          : "bg-red-500 text-white"
                      )}
                    >
                      {getStatusLabel(notification.status)}
                    </span>
                  </div>
                  <p className="text-black/70 mb-2">{notification.message}</p>
                  <div className="flex items-center gap-4 text-xs text-black/50">
                    <span>
                      Получатели:{" "}
                      {notification.target_type === "all"
                        ? "Все"
                        : `${notification.target_type}: ${notification.target_value}`}
                    </span>
                    {notification.scheduled_at && (
                      <span>
                        Запланировано:{" "}
                        {new Date(notification.scheduled_at).toLocaleString("ru-RU")}
                      </span>
                    )}
                    {notification.sent_at && (
                      <span>
                        Отправлено: {new Date(notification.sent_at).toLocaleString("ru-RU")}
                      </span>
                    )}
                    <span>
                      Создано: {new Date(notification.created_at).toLocaleString("ru-RU")}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
