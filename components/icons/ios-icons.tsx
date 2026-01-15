'use client'

import React from 'react'

interface IconProps {
  className?: string
  size?: number
}

/**
 * iOS Menu Icon (три точки горизонтально)
 * Максимально похожа на реальную иконку меню Safari в iOS 26
 */
export function IOSMenuIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Три точки горизонтально - точная копия iOS меню */}
      <circle cx="6" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="18" cy="12" r="1.5" fill="currentColor" />
    </svg>
  )
}

/**
 * iOS Share Icon (квадрат со стрелкой вверх)
 * Максимально похожа на реальную иконку "Поделиться" в iOS 26
 */
export function IOSShareIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Квадрат (основа) */}
      <rect x="4" y="6" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Стрелка вверх */}
      <path
        d="M10 4L10 14M10 4L6 8M10 4L14 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

/**
 * iOS Add to Home Screen Icon (квадрат с плюсом)
 * Максимально похожа на реальную иконку "Добавить на экран Домой" в iOS 26
 */
export function IOSAddToHomeIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Квадрат (основа) */}
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Плюс внутри */}
      <path
        d="M12 8V16M8 12H16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
