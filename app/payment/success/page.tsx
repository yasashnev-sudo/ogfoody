'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PaymentSuccessPage() {
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
          } else {
            // Проверяем еще раз через 2 секунды (на случай если webhook еще не пришел)
            setTimeout(() => {
              if (data.order?.paid || data.order?.paymentStatus === 'paid') {
                setStatus('success')
              } else {
                setStatus('loading') // Продолжаем ждать
              }
            }, 2000)
          }
        } else {
          setStatus('error')
        }
      } catch (error) {
        console.error('Error checking order status:', error)
        setStatus('error')
      }
    }

    checkOrderStatus()
    
    // Проверяем статус каждые 2 секунды (максимум 10 секунд)
    const interval = setInterval(() => {
      checkOrderStatus()
    }, 2000)

    const timeout = setTimeout(() => {
      clearInterval(interval)
      if (status === 'loading') {
        setStatus('error')
      }
    }, 10000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [orderId, status])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
          <h1 className="text-2xl font-bold">Проверяем оплату...</h1>
          <p className="text-muted-foreground">Пожалуйста, подождите</p>
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
          <h1 className="text-2xl font-bold">Ошибка проверки оплаты</h1>
          <p className="text-muted-foreground">
            Не удалось проверить статус оплаты. Если оплата прошла успешно, заказ будет обработан автоматически.
          </p>
          <Button onClick={() => router.push('/')} className="mt-4">
            Вернуться на главную
          </Button>
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

        {order?.loyalty_points_earned && order.loyalty_points_earned > 0 && (
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">Начислено баллов</p>
            <p className="text-2xl font-bold text-primary">
              +{order.loyalty_points_earned}
            </p>
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
            onClick={() => router.push(`/?orderId=${orderId}`)} 
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
