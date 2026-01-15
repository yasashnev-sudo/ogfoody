"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminHeader } from "@/components/admin/AdminHeader"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Проверяем аутентификацию
    const checkAuth = () => {
      if (typeof window === "undefined") return

      const authenticated = sessionStorage.getItem("admin_authenticated")
      const loginTime = sessionStorage.getItem("admin_login_time")

      // Проверяем, что сессия не старше 8 часов
      if (authenticated === "true" && loginTime) {
        const timeDiff = Date.now() - parseInt(loginTime)
        const eightHours = 8 * 60 * 60 * 1000

        if (timeDiff < eightHours) {
          setIsAuthenticated(true)
        } else {
          // Сессия истекла
          sessionStorage.removeItem("admin_authenticated")
          sessionStorage.removeItem("admin_login_time")
          setIsAuthenticated(false)
        }
      } else {
        setIsAuthenticated(false)
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [pathname])

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [isAuthenticated, isLoading, pathname, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#9D00FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black font-bold">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  // На странице входа не показываем сайдбар
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex pt-16">
        <AdminSidebar />
        <main className="flex-1 p-6 ml-64">
          {children}
        </main>
      </div>
    </div>
  )
}
