'use client'

import { useState, useEffect } from 'react'

export function usePWA() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Проверяем iOS
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent)
    setIsIOS(isIOSDevice)

    // Проверяем, запущено ли приложение в standalone режиме (уже установлено)
    // Важно: display-mode: standalone - самый надежный способ определить установленное приложение
    // navigator.standalone может быть true даже если приложение удалено, но ярлык остался
    const checkStandalone = () => {
      // Основная проверка: display-mode: standalone - приложение установлено и запущено
      const isStandaloneDisplay = window.matchMedia('(display-mode: standalone)').matches
      
      // Для iOS: navigator.standalone может быть true только когда открыто через ярлык
      // Но это не значит, что приложение установлено - ярлык может остаться после удаления
      // Поэтому используем только display-mode как основную проверку
      const isIOSStandalone = isIOSDevice && (window.navigator as any).standalone === true
      
      // Для Android: проверяем referrer
      const isAndroidStandalone = document.referrer.includes('android-app://')
      
      // Приложение считается установленным ТОЛЬКО если:
      // 1. display-mode: standalone (самый надежный способ) - приложение точно установлено и запущено
      // 2. ИЛИ (iOS через ярлык И display-mode не browser) - это значит открыто через установленное приложение
      // 3. ИЛИ Android через referrer
      const isStandaloneMode = isStandaloneDisplay || 
        (isIOSStandalone && !window.matchMedia('(display-mode: browser)').matches) ||
        isAndroidStandalone
      
      setIsStandalone(isStandaloneMode)
      setIsChecking(false)
      return isStandaloneMode
    }

    // Первая проверка
    checkStandalone()

    // Проверяем периодически (на случай если пользователь установил приложение)
    const interval = setInterval(checkStandalone, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return { isIOS, isStandalone, isChecking }
}
