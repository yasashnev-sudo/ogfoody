// Обработка pending транзакций баллов лояльности
// Запускается через systemd timer каждый день в 15:00
// Находит заказы за наличные с датой доставки = сегодня
// и начисляет баллы по pending транзакциям

import { NextResponse } from "next/server"
import { nocoFetch, updateUser, fetchUserById } from "@/lib/nocodb"
import type { 
  NocoDBResponse, 
  NocoDBOrder, 
  NocoDBLoyaltyPointsTransaction 
} from "@/lib/nocodb"

export async function GET(request: Request) {
  try {
    console.log(`🕐 Запуск обработки pending транзакций: process-pending-points`)
    
    // ✅ ИЗМЕНЕНО 2026-01-16: Обрабатываем заказы с датой доставки = сегодня
    // Баллы начисляются в день доставки в 15:00
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Устанавливаем время на 00:00:00 для правильного сравнения
    const todayStr = today.toISOString().split('T')[0] // YYYY-MM-DD
    
    console.log(`📅 Обрабатываем заказы с датой доставки: ${todayStr} (сегодня)`)
    
    // Ищем все pending транзакции
    const pendingTransactionsResponse = await nocoFetch<NocoDBResponse<NocoDBLoyaltyPointsTransaction>>(
      "Loyalty_Points_Transactions",
      {
        where: `(Transaction Status,eq,pending)~and(Transaction Type,eq,earned)`,
        limit: "1000",
      }
    )
    
    const pendingTransactions = pendingTransactionsResponse.list || []
    console.log(`📊 Найдено pending транзакций: ${pendingTransactions.length}`)
    
    if (pendingTransactions.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Нет pending транзакций для обработки",
        processed: 0,
      })
    }
    
    let processedCount = 0
    let errorCount = 0
    const errors: string[] = []
    
    // Обрабатываем каждую pending транзакцию
    for (const transaction of pendingTransactions) {
      try {
        // Получаем заказ, связанный с транзакцией
        const orderId = transaction.order_id
        if (!orderId) {
          console.warn(`⚠️ Транзакция ${transaction.Id} не привязана к заказу, пропускаем`)
          continue
        }
        
        // Получаем заказ
        const orderResponse = await nocoFetch<NocoDBResponse<NocoDBOrder>>(
          "Orders",
          {
            where: `(Id,eq,${orderId})`,
            limit: "1",
          }
        )
        
        const orders = orderResponse.list || []
        if (orders.length === 0) {
          console.warn(`⚠️ Заказ ${orderId} не найден для транзакции ${transaction.Id}`)
          continue
        }
        
        const order = orders[0]
        
        // Проверяем, что заказ не отменен
        if (order.order_status === "cancelled") {
          console.log(`❌ Заказ ${orderId} отменен, отменяем транзакцию ${transaction.Id}`)
          
          // Обновляем статус транзакции на cancelled
          await nocoFetch(
            "Loyalty_Points_Transactions",
            {},
            {
              method: "PATCH",
              pathSuffix: `/${transaction.Id}`,
              body: JSON.stringify({
                transaction_status: "cancelled",
                updated_at: new Date().toISOString(),
              }),
            }
          )
          
          processedCount++
          continue
        }
        
        // Получаем дату доставки заказа
        const startDate = order.start_date || (order as any)["Start Date"]
        if (!startDate) {
          console.warn(`⚠️ Заказ ${orderId} не имеет даты доставки, пропускаем`)
          continue
        }
        
        // ✅ ИСПРАВЛЕНО 2026-01-13: Правильное сравнение дат (только дата, без времени)
        // Нормализуем дату доставки: если строка - парсим, если Date - используем как есть
        const deliveryDateStr = typeof startDate === 'string' 
          ? startDate.split('T')[0]  // Берем только дату из строки "YYYY-MM-DD" или "YYYY-MM-DDTHH:mm:ss"
          : new Date(startDate).toISOString().split('T')[0]  // Конвертируем Date в строку YYYY-MM-DD
        
        // Сравниваем строки дат (YYYY-MM-DD) - обрабатываем только заказы с датой доставки = сегодня
        if (deliveryDateStr !== todayStr) {
          console.log(`⏳ Заказ ${orderId} не на сегодня (${deliveryDateStr} !== ${todayStr}), пропускаем`)
          continue
        }
        
        console.log(`✅ Заказ ${orderId} прошел проверку даты: ${deliveryDateStr} === ${todayStr} (сегодня)`)
        
        // Проверяем способ оплаты (должен быть наличные)
        const paymentMethod = order.payment_method || (order as any)["Payment Method"]
        if (paymentMethod !== "cash") {
          console.warn(`⚠️ Заказ ${orderId} оплачен не наличными (${paymentMethod}), отменяем транзакцию`)
          
          await nocoFetch(
            "Loyalty_Points_Transactions",
            {},
            {
              method: "PATCH",
              pathSuffix: `/${transaction.Id}`,
              body: JSON.stringify({
                transaction_status: "cancelled",
                updated_at: new Date().toISOString(),
              }),
            }
          )
          
          processedCount++
          continue
        }
        
        // Все проверки пройдены, начисляем баллы
        const userId = transaction.user_id
        const points = typeof transaction.points === 'number' 
          ? transaction.points 
          : parseInt(String(transaction.points)) || 0
        
        if (points <= 0) {
          console.warn(`⚠️ Транзакция ${transaction.Id} имеет неверное количество баллов: ${points}`)
          continue
        }
        
        // Получаем пользователя
        const user = await fetchUserById(userId)
        if (!user) {
          console.error(`❌ Пользователь ${userId} не найден для транзакции ${transaction.Id}`)
          errorCount++
          errors.push(`User ${userId} not found`)
          continue
        }
        
        // Начисляем баллы
        const currentLoyaltyPoints = typeof user.loyalty_points === 'number' 
          ? user.loyalty_points 
          : parseInt(String(user.loyalty_points)) || 0
        
        const newLoyaltyPoints = currentLoyaltyPoints + points
        
        console.log(`✅ Начисление баллов для транзакции ${transaction.Id}:`, {
          userId,
          orderId,
          currentLoyaltyPoints,
          points,
          newLoyaltyPoints,
        })
        
        // Обновляем баланс пользователя
        await updateUser(userId, {
          loyalty_points: newLoyaltyPoints,
        })
        
        // Обновляем статус транзакции
        const now = new Date().toISOString()
        await nocoFetch(
          "Loyalty_Points_Transactions",
          {},
          {
            method: "PATCH",
            pathSuffix: `/${transaction.Id}`,
            body: JSON.stringify({
              transaction_status: "completed",
              processed_at: now,
              updated_at: now,
            }),
          }
        )
        
        processedCount++
        console.log(`✅ Транзакция ${transaction.Id} успешно обработана`)
        
      } catch (error) {
        console.error(`❌ Ошибка при обработке транзакции ${transaction.Id}:`, error)
        errorCount++
        errors.push(`Transaction ${transaction.Id}: ${error}`)
      }
    }
    
    console.log(`✅ Cron job завершен:`, {
      total: pendingTransactions.length,
      processed: processedCount,
      errors: errorCount,
    })
    
    return NextResponse.json({
      success: true,
      message: `Обработано ${processedCount} из ${pendingTransactions.length} транзакций`,
      processed: processedCount,
      errors: errorCount > 0 ? errors : undefined,
    })
    
  } catch (error) {
    console.error("❌ Ошибка в cron job process-pending-points:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}





