"use client"

import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  MessageSquare, 
  Bell,
  Gift,
  BarChart3
} from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Заказы", icon: ShoppingCart },
  { href: "/admin/users", label: "Пользователи", icon: Users },
  { href: "/admin/chat", label: "Чат с клиентами", icon: MessageSquare },
  { href: "/admin/notifications", label: "Пуш-уведомления", icon: Bell },
  { href: "/admin/promo", label: "Промокоды", icon: Gift },
  { href: "/admin/stats", label: "Статистика", icon: BarChart3 },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r-2 border-black shadow-brutal overflow-y-auto z-40">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href))
          
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all font-bold text-sm",
                isActive
                  ? "bg-[#9D00FF] text-white border-black shadow-brutal"
                  : "bg-white text-black border-black shadow-brutal hover:bg-[#FFEA00] brutal-hover"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
