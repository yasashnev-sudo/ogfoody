import { Skeleton } from "@/components/ui/skeleton"

/**
 * ✅ SAFE DATA LOADING: Skeleton компоненты для индикации загрузки данных
 * Используются для предотвращения race condition и улучшения UX
 */

// Skeleton для баллов лояльности в шапке
export function LoyaltyPointsSkeleton() {
  return (
    <div className="flex items-center gap-2 text-black bg-muted rounded-xl px-3 py-2 w-full border-2 border-black">
      <Skeleton className="w-4 h-4 rounded-full" />
      <Skeleton className="h-4 w-24 flex-1" />
      <Skeleton className="h-5 w-20 rounded-lg" />
    </div>
  )
}

// Skeleton для профиля пользователя в шапке
export function UserProfileHeaderSkeleton() {
  return (
    <div className="flex items-center gap-2 text-black bg-muted rounded-xl px-3 py-2 w-full border-2 border-black">
      <Skeleton className="w-4 h-4 rounded-full" />
      <Skeleton className="h-4 w-32 flex-1" />
      <Skeleton className="h-5 w-20 rounded-lg" />
    </div>
  )
}

// Skeleton для карточки заказа в истории
export function OrderCardSkeleton() {
  return (
    <div className="border-2 border-black rounded-xl p-4 bg-white">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48 mb-1" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <div className="space-y-2 mb-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-black/10">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  )
}

// Skeleton для списка заказов (3-4 карточки)
export function OrderHistorySkeleton() {
  return (
    <div className="space-y-4">
      <OrderCardSkeleton />
      <OrderCardSkeleton />
      <OrderCardSkeleton />
    </div>
  )
}

// Skeleton для данных профиля в ProfileModal
export function ProfileDataSkeleton() {
  return (
    <div className="space-y-4">
      <div>
        <Skeleton className="h-4 w-16 mb-2" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
      <div>
        <Skeleton className="h-4 w-16 mb-2" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
      <div>
        <Skeleton className="h-4 w-16 mb-2" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  )
}

// Skeleton для небольшого инлайн-лоадера баллов
export function InlinePointsSkeleton() {
  return (
    <Skeleton className="h-5 w-20 rounded-lg inline-block" />
  )
}

// Skeleton для загрузки меню в OrderModal
export function OrderMenuSkeleton() {
  return (
    <div className="space-y-6 p-4">
      {/* Заголовок */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      
      {/* Блоки меню */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-2 border-black rounded-xl p-4 bg-white space-y-3">
            <Skeleton className="h-6 w-32" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Футер с кнопкой */}
      <div className="space-y-3">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  )
}

