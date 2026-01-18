'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle2, Loader2, Coins } from 'lucide-react'
import { Button } from '@/components/ui/button'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    if (!orderId) {
      setStatus('error')
      return
    }

    let checkCount = 0
    const maxChecks = 15 // Проверяем до 30 секунд (15 раз по 2 секунды)

    // Проверяем статус заказа
    const checkOrderStatus = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`)
        if (response.ok) {
          const data = await response.json()
          setOrder(data.order)
          
          // Если заказ оплачен - успех
          if (data.order?.paid || data.order?.paymentStatus === 'paid') {
            setStatus('success')
            return true // Успешно проверено
          }
          
          // Если есть payment_id, проверяем статус напрямую через ЮKassa
          const paymentId = data.order?.paymentId || data.order?.payment_id
          if (paymentId && checkCount >= 3) {
            // После 3 проверок (6 секунд) проверяем статус через ЮKassa
            try {
              const paymentStatusResponse = await fetch(`/api/payments/yookassa/status/${paymentId}`)
              if (paymentStatusResponse.ok) {
                const paymentData = await paymentStatusResponse.json()
                if (paymentData.paid || paymentData.status === 'succeeded') {
                  // Обновляем заказ и показываем успех
                  setStatus('success')
                  // Перезагружаем данные заказа
                  const orderResponse = await fetch(`/api/orders/${orderId}`)
                  if (orderResponse.ok) {
                    const orderData = await orderResponse.json()
                    setOrder(orderData.order)
                  }
                  return true
                }
              }
            } catch (paymentError) {
              console.error('Error checking payment status:', paymentError)
              // Продолжаем обычную проверку
            }
          }
          
          checkCount++
          
          // Если прошло много проверок, но статус не изменился - показываем предупреждение
          if (checkCount >= maxChecks) {
            // Проверяем, есть ли payment_id - значит платеж создан
            if (data.order?.paymentId || data.order?.payment_id) {
              // Платеж создан, но webhook еще не пришел - показываем успех с предупреждением
              setStatus('success')
              return true
            } else {
              setStatus('error')
              return false
            }
          }
          
          return false // Продолжаем проверку
        } else {
          checkCount++
          if (checkCount >= maxChecks) {
            setStatus('error')
            return false
          }
          return false
        }
      } catch (error) {
        console.error('Error checking order status:', error)
        checkCount++
        if (checkCount >= maxChecks) {
          setStatus('error')
          return false
        }
        return false
      }
    }

    // Первая проверка сразу
    checkOrderStatus()
    
    // Проверяем статус каждые 2 секунды
    const interval = setInterval(async () => {
      const success = await checkOrderStatus()
      if (success) {
        clearInterval(interval)
      }
    }, 2000)

    // Таймаут через 30 секунд
    const timeout = setTimeout(() => {
      clearInterval(interval)
      if (status === 'loading') {
        // Если есть payment_id, считаем что платеж создан и показываем успех
        if (order?.paymentId || order?.payment_id) {
          setStatus('success')
        } else {
          setStatus('error')
        }
      }
    }, 30000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [orderId])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md px-4">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
          <h1 className="text-2xl font-bold">Проверяем оплату...</h1>
          <p className="text-muted-foreground">
            Ожидаем подтверждение от платежной системы. Это может занять несколько секунд.
          </p>
          <div className="mt-4">
            <Button 
              onClick={() => router.push('/')} 
              variant="outline"
            >
              Вернуться на главную
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold">Проверка оплаты</h1>
          <p className="text-muted-foreground">
            Не удалось автоматически проверить статус оплаты. Если оплата прошла успешно, заказ будет обработан автоматически в течение нескольких минут.
          </p>
          <div className="space-y-2 mt-4">
            <Button 
              onClick={async () => {
                if (orderId) {
                  setStatus('loading')
                  const response = await fetch(`/api/orders/${orderId}`)
                  if (response.ok) {
                    const data = await response.json()
                    if (data.order?.paid || data.order?.paymentStatus === 'paid') {
                      setStatus('success')
                      setOrder(data.order)
                    } else {
                      setStatus('error')
                    }
                  }
                }
              }} 
              className="w-full"
            >
              Проверить еще раз
            </Button>
            <Button 
              onClick={() => router.push('/')} 
              variant="outline"
              className="w-full"
            >
              Вернуться на главную
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Оплата успешна!</h1>
          <p className="text-muted-foreground">
            Ваш заказ #{orderId} успешно оплачен
          </p>
        </div>

        {/* ✅ ИСПРАВЛЕНО: Показываем и списанные, и начисленные баллы */}
        {((order?.loyalty_points_used && order.loyalty_points_used > 0) || 
          (order?.loyalty_points_earned && order.loyalty_points_earned > 0)) && (
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-3">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coins className="w-5 h-5 text-primary" />
              <p className="text-sm font-medium text-muted-foreground">Баллы лояльности</p>
            </div>
            
            {/* Списанные баллы */}
            {order?.loyalty_points_used && order.loyalty_points_used > 0 && (
              <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-3">
                <div className="text-center">
                  <p className="text-xs text-red-700 dark:text-red-300 mb-1 font-semibold">Списано</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    -{order.loyalty_points_used}
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">баллов</p>
                </div>
              </div>
            )}
            
            {/* Начисленные баллы */}
        {order?.loyalty_points_earned && order.loyalty_points_earned > 0 && (
              <div className="bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-3">
                <div className="text-center">
                  <p className="text-xs text-green-700 dark:text-green-300 mb-1 font-semibold">Начислено</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              +{order.loyalty_points_earned}
            </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">баллов</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="space-y-2 pt-4">
          <Button 
            onClick={() => router.push('/')} 
            className="w-full"
            size="lg"
          >
            Вернуться на главную
          </Button>
          <Button 
            onClick={async () => {
              // ✅ ИСПРАВЛЕНО: Загружаем заказ и открываем его на главной странице
              try {
                const response = await fetch(`/api/orders/${orderId}`)
                if (response.ok) {
                  const data = await response.json()
                  const order = data.order
                  if (order?.startDate) {
                    // Редиректим на главную с параметрами для открытия заказа
                    const orderDate = new Date(order.startDate)
                    const dateStr = orderDate.toISOString().split('T')[0]
                    router.push(`/?orderId=${orderId}&date=${dateStr}`)
                  } else {
                    // Если нет даты, просто редиректим на главную
                    router.push(`/?orderId=${orderId}`)
                  }
                } else {
                  // Если заказ не найден, просто редиректим на главную
                  router.push('/')
                }
              } catch (error) {
                console.error('Error loading order:', error)
                router.push('/')
              }
            }}
            variant="outline"
            className="w-full"
          >
            Посмотреть заказ
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
          <h1 className="text-2xl font-bold">Загрузка...</h1>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
