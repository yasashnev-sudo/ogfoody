"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Eye, EyeOff } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Пароль хранится в переменной окружения или используем дефолтный
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Проверяем пароль
      if (password === ADMIN_PASSWORD) {
        // Сохраняем сессию
        sessionStorage.setItem("admin_authenticated", "true")
        sessionStorage.setItem("admin_login_time", Date.now().toString())
        
        // Перенаправляем в админ-панель
        router.push("/admin")
      } else {
        setError("Неверный пароль")
      }
    } catch (err) {
      setError("Ошибка входа. Попробуйте еще раз.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFEA00] via-white to-[#9D00FF] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border-2 border-black rounded-xl shadow-brutal p-8">
          {/* Логотип */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-[#9D00FF] border-2 border-black rounded-lg flex items-center justify-center shadow-brutal">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Заголовок */}
          <h1 className="text-2xl font-black text-black text-center mb-2">
            Панель администратора
          </h1>
          <p className="text-sm text-black/70 text-center mb-6">
            Введите пароль для входа
          </p>

          {/* Форма */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-black font-bold">
                Пароль
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 border-2 border-black rounded-lg shadow-brutal"
                  placeholder="Введите пароль"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-black transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-500 rounded-lg p-3">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#9D00FF] text-white border-2 border-black shadow-brutal brutal-hover"
              disabled={loading}
            >
              {loading ? "Вход..." : "Войти"}
            </Button>
          </form>

          {/* Подсказка для разработки */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-3 bg-yellow-50 border-2 border-yellow-500 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Dev mode:</strong> Пароль по умолчанию: admin123
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
