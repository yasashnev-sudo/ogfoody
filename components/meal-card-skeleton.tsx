"use client"

/**
 * Skeleton компонент для карточек блюд
 * Используется при загрузке меню в OrderModal и MealSelector
 */
export function MealCardSkeleton() {
  return (
    <div className="relative bg-white rounded-xl border-2 border-black shadow-brutal overflow-hidden animate-pulse h-full">
      {/* Image skeleton */}
      <div className="relative aspect-square w-full bg-black/5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
      </div>

      {/* Content skeleton */}
      <div className="p-1.5 sm:p-4 space-y-2">
        {/* Title skeleton */}
        <div className="h-4 bg-black/10 rounded w-3/4" />
        
        {/* Price skeleton */}
        <div className="h-3 bg-black/10 rounded w-1/2" />
        
        {/* Button skeleton */}
        <div className="h-8 bg-black/5 rounded-lg border-2 border-black/10" />
      </div>
    </div>
  )
}

/**
 * Skeleton для FreshCard (горизонтальный скролл на главной)
 */
export function FreshCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border-2 border-black shadow-brutal flex-shrink-0 w-[280px] sm:w-[320px] overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="relative aspect-[4/3] w-full bg-black/5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
      </div>
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title skeleton - 2 lines */}
        <div className="space-y-2">
          <div className="h-4 bg-black/10 rounded w-full" />
          <div className="h-4 bg-black/10 rounded w-3/4" />
        </div>
        
        {/* Price skeleton */}
        <div className="h-6 bg-black/10 rounded w-1/3" />
      </div>
    </div>
  )
}

/**
 * Skeleton для секции с несколькими карточками
 */
interface MealGridSkeletonProps {
  count?: number
  className?: string
}

export function MealGridSkeleton({ count = 6, className }: MealGridSkeletonProps) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <MealCardSkeleton key={i} />
      ))}
    </div>
  )
}


