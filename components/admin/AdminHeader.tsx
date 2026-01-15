"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"

export function AdminHeader() {
  const router = useRouter()

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated")
    sessionStorage.removeItem("admin_login_time")
    router.push("/admin/login")
  }

  return (
    <header className="h-16 bg-white border-b-2 border-black shadow-brutal flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#9D00FF] border-2 border-black rounded-lg flex items-center justify-center shadow-brutal">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-black text-lg text-black">Админ-панель OGFooDY</h1>
          <p className="text-xs text-black/70">Управление системой</p>
        </div>
      </div>

      <Button
        onClick={handleLogout}
        variant="outline"
        className="border-2 border-black shadow-brutal brutal-hover"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Выйти
      </Button>
    </header>
  )
}
