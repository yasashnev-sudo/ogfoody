"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoyaltyPointsDebugPage() {
  const [userId, setUserId] = useState("")
  const [orderTotal, setOrderTotal] = useState("")
  const [pointsUsed, setPointsUsed] = useState("0")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const checkUser = async () => {
    if (!userId) {
      setError("Введите userId")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`/api/debug/loyalty-points?userId=${userId}&checkTransactions=true`)
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || "Ошибка при проверке")
      } else {
        setResult(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка")
    } finally {
      setLoading(false)
    }
  }

  const calculatePoints = async () => {
    if (!userId || !orderTotal) {
      setError("Введите userId и сумму заказа")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(
        `/api/debug/loyalty-points?userId=${userId}&orderTotal=${orderTotal}&pointsUsed=${pointsUsed || 0}`
      )
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || "Ошибка при расчете")
      } else {
        setResult(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка")
    } finally {
      setLoading(false)
    }
  }

  const testAward = async () => {
    if (!userId || !orderTotal) {
      setError("Введите userId и сумму заказа")
      return
    }

    if (!confirm("Это создаст реальную транзакцию в базе данных. Продолжить?")) {
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(
        `/api/debug/loyalty-points?userId=${userId}&orderTotal=${orderTotal}&pointsUsed=${pointsUsed || 0}&testAward=true`
      )
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || "Ошибка при тестировании")
      } else {
        setResult(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Диагностика начисления баллов лояльности</CardTitle>
          <CardDescription>
            Инструменты для проверки и отладки системы начисления баллов
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">User ID</label>
              <Input
                type="number"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Введите ID пользователя"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Сумма заказа (руб.)</label>
              <Input
                type="number"
                value={orderTotal}
                onChange={(e) => setOrderTotal(e.target.value)}
                placeholder="Введите сумму заказа"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Использовано баллов</label>
              <Input
                type="number"
                value={pointsUsed}
                onChange={(e) => setPointsUsed(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button onClick={checkUser} disabled={loading || !userId}>
              Проверить пользователя
            </Button>
            <Button onClick={calculatePoints} disabled={loading || !userId || !orderTotal}>
              Рассчитать баллы
            </Button>
            <Button 
              onClick={testAward} 
              disabled={loading || !userId || !orderTotal}
              variant="outline"
            >
              Тест начисления (создаст транзакцию)
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 font-medium">Ошибка:</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h3 className="font-medium mb-2">Результат:</h3>
                <pre className="text-xs overflow-auto bg-white p-3 rounded border">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>

              {result.environment && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <h3 className="font-medium mb-2">Конфигурация:</h3>
                  <ul className="text-sm space-y-1">
                    {Object.entries(result.environment).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong> {String(value)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.user && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <h3 className="font-medium mb-2">Пользователь:</h3>
                  <ul className="text-sm space-y-1">
                    <li><strong>ID:</strong> {result.user.id}</li>
                    <li><strong>Имя:</strong> {result.user.name}</li>
                    <li><strong>Телефон:</strong> {result.user.phone}</li>
                    <li><strong>Баллы:</strong> {result.user.loyalty_points}</li>
                    <li><strong>Потрачено всего:</strong> {result.user.total_spent} руб.</li>
                  </ul>
                </div>
              )}

              {result.calculation && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-md">
                  <h3 className="font-medium mb-2">Расчет баллов:</h3>
                  <ul className="text-sm space-y-1">
                    <li><strong>Сумма заказа:</strong> {result.calculation.orderTotal} руб.</li>
                    <li><strong>Использовано баллов:</strong> {result.calculation.pointsUsed}</li>
                    <li><strong>Потрачено всего:</strong> {result.calculation.currentTotalSpent} руб.</li>
                    <li><strong>Процент кешбека:</strong> {result.calculation.cashbackPercent}%</li>
                    <li><strong>Сумма для расчета:</strong> {result.calculation.amountForPoints} руб.</li>
                    <li><strong>Рассчитано баллов:</strong> <strong className="text-lg">{result.calculation.calculatedPoints}</strong></li>
                    <li><strong>Формула:</strong> {result.calculation.formula}</li>
                  </ul>
                </div>
              )}

              {result.transactions && (
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-md">
                  <h3 className="font-medium mb-2">Транзакции:</h3>
                  <p className="text-sm mb-2">Всего транзакций: {result.transactions.count}</p>
                  {result.transactions.list && result.transactions.list.length > 0 && (
                    <div className="text-xs">
                      <p className="font-medium mb-1">Последние транзакции:</p>
                      <ul className="space-y-1">
                        {result.transactions.list.map((t: any, i: number) => (
                          <li key={i} className="bg-white p-2 rounded border">
                            {t.transaction_type}: {t.points} баллов - {t.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {loading && (
            <div className="text-center py-4">
              <p>Загрузка...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}





