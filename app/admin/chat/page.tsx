"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, User, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  Id: number
  user_id?: number
  user_phone?: string
  user_name?: string
  message: string
  is_admin: boolean
  is_read: boolean
  created_at: string
}

export default function AdminChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [users, setUsers] = useState<{ phone: string; name: string; unread: number }[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadMessages()
    // Обновляем сообщения каждые 5 секунд
    const interval = setInterval(loadMessages, 5000)
    return () => clearInterval(interval)
  }, [selectedUser])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    try {
      const params = selectedUser ? `?userId=${selectedUser}` : ""
      const response = await fetch(`/api/admin/messages${params}`)
      const data = await response.json()

      if (data.messages) {
        setMessages(data.messages)
        
        // Группируем по пользователям
        const userMap = new Map<string, { name: string; unread: number }>()
        
        data.messages.forEach((msg: Message) => {
          const phone = msg.user_phone || "unknown"
          const name = msg.user_name || msg.user_phone || "Неизвестный"
          
          if (!userMap.has(phone)) {
            userMap.set(phone, { name, unread: 0 })
          }
          
          if (!msg.is_admin && !msg.is_read) {
            const user = userMap.get(phone)!
            user.unread++
            userMap.set(phone, user)
          }
        })

        setUsers(Array.from(userMap.entries()).map(([phone, data]) => ({
          phone,
          name: data.name,
          unread: data.unread,
        })))
      }
    } catch (error) {
      console.error("Ошибка загрузки сообщений:", error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const messageData = {
      user_id: selectedUser ? parseInt(selectedUser) : null,
      user_phone: selectedUser || null,
      message: newMessage,
      is_admin: true,
    }

    try {
      const response = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      })

      if (response.ok) {
        setNewMessage("")
        loadMessages()
      }
    } catch (error) {
      console.error("Ошибка отправки сообщения:", error)
    }
  }

  const markAsRead = async (messageId: number) => {
    try {
      await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: messageId, is_read: true }),
      })
      loadMessages()
    } catch (error) {
      console.error("Ошибка пометки сообщения:", error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const filteredMessages = selectedUser
    ? messages.filter((m) => m.user_phone === selectedUser || m.user_id?.toString() === selectedUser)
    : messages

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#9D00FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black font-bold">Загрузка чата...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-black mb-2">Чат с клиентами</h1>
        <p className="text-black/70">Общение с пользователями системы</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Список пользователей */}
        <Card className="bg-white border-2 border-black rounded-xl shadow-brutal p-4 overflow-y-auto">
          <h2 className="font-black text-lg text-black mb-4">Пользователи</h2>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedUser(null)}
              className={cn(
                "w-full text-left p-3 rounded-lg border-2 transition-all font-medium text-sm",
                !selectedUser
                  ? "bg-[#9D00FF] text-white border-black shadow-brutal"
                  : "bg-white text-black border-black shadow-brutal hover:bg-[#FFEA00] brutal-hover"
              )}
            >
              Все сообщения
            </button>
            {users.map((user) => (
              <button
                key={user.phone}
                onClick={() => {
                  setSelectedUser(user.phone)
                  // Помечаем сообщения как прочитанные при выборе пользователя
                  filteredMessages
                    .filter((m) => !m.is_admin && !m.is_read && (m.user_phone === user.phone || m.user_id?.toString() === user.phone))
                    .forEach((m) => markAsRead(m.Id))
                }}
                className={cn(
                  "w-full text-left p-3 rounded-lg border-2 transition-all font-medium text-sm relative",
                  selectedUser === user.phone
                    ? "bg-[#9D00FF] text-white border-black shadow-brutal"
                    : "bg-white text-black border-black shadow-brutal hover:bg-[#FFEA00] brutal-hover"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="font-bold">{user.name}</span>
                  </div>
                  {user.unread > 0 && (
                    <span className="bg-red-500 text-white text-xs font-black px-2 py-1 rounded-full border-2 border-black">
                      {user.unread}
                    </span>
                  )}
                </div>
                <p className="text-xs mt-1 opacity-70">{user.phone}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Чат */}
        <div className="lg:col-span-3 flex flex-col">
          <Card className="flex-1 flex flex-col bg-white border-2 border-black rounded-xl shadow-brutal p-4">
            {/* Заголовок чата */}
            <div className="border-b-2 border-black pb-3 mb-4">
              <h2 className="font-black text-lg text-black">
                {selectedUser
                  ? users.find((u) => u.phone === selectedUser)?.name || "Чат"
                  : "Все сообщения"}
              </h2>
            </div>

            {/* Сообщения */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-black/30 mx-auto mb-4" />
                  <p className="text-black/70 font-medium">Нет сообщений</p>
                </div>
              ) : (
                filteredMessages.map((msg) => (
                  <div
                    key={msg.Id}
                    className={cn(
                      "flex",
                      msg.is_admin ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg px-4 py-2 border-2 border-black shadow-brutal",
                        msg.is_admin
                          ? "bg-[#9D00FF] text-white"
                          : "bg-white text-black"
                      )}
                    >
                      {!msg.is_admin && (
                        <p className="text-xs font-bold mb-1 opacity-80">
                          {msg.user_name || msg.user_phone || "Клиент"}
                        </p>
                      )}
                      <p className="text-sm font-medium">{msg.message}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(msg.created_at).toLocaleString("ru-RU")}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Поле ввода */}
            <div className="flex gap-2 border-t-2 border-black pt-4">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Введите сообщение..."
                className="flex-1 border-2 border-black rounded-lg shadow-brutal"
              />
              <Button
                onClick={sendMessage}
                className="bg-[#9D00FF] text-white border-2 border-black shadow-brutal brutal-hover"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
