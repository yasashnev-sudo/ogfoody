// Диагностический endpoint для проверки начисления баллов
// GET /api/debug/loyalty-points?userId=123&orderTotal=1000&pointsUsed=0

import { NextResponse } from "next/server"
import { 
  fetchUserById, 
  calculateEarnedPoints, 
  awardLoyaltyPoints,
  createLoyaltyPointsTransaction,
  fetchLoyaltyPointsTransactions 
} from "@/lib/nocodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userIdParam = searchParams.get("userId")
    const orderTotalParam = searchParams.get("orderTotal")
    const pointsUsedParam = searchParams.get("pointsUsed")
    const testAward = searchParams.get("testAward") === "true"
    const checkTransactions = searchParams.get("checkTransactions") === "true"

    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      environment: {
        NOCODB_URL: process.env.NOCODB_URL ? "✅ Установлен" : "❌ Не установлен",
        NOCODB_TOKEN: process.env.NOCODB_TOKEN ? "✅ Установлен" : "❌ Не установлен",
        NOCODB_TABLE_LOYALTY_POINTS_TRANSACTIONS: process.env.NOCODB_TABLE_LOYALTY_POINTS_TRANSACTIONS || "❌ Не установлен",
        NOCODB_TABLE_USERS: process.env.NOCODB_TABLE_USERS || "❌ Не установлен",
      },
    }

    // Проверка конфигурации таблиц
    if (!userIdParam) {
      return NextResponse.json({
        ...diagnostics,
        error: "Укажите userId в параметрах запроса: ?userId=123",
        usage: {
          checkUser: "/api/debug/loyalty-points?userId=123",
          calculatePoints: "/api/debug/loyalty-points?userId=123&orderTotal=1000&pointsUsed=0",
          testAward: "/api/debug/loyalty-points?userId=123&orderTotal=1000&pointsUsed=0&testAward=true",
          checkTransactions: "/api/debug/loyalty-points?userId=123&checkTransactions=true",
        },
      })
    }

    const userId = parseInt(userIdParam)
    if (isNaN(userId)) {
      return NextResponse.json({
        ...diagnostics,
        error: "userId должен быть числом",
      }, { status: 400 })
    }

    // Получаем пользователя
    try {
      const user = await fetchUserById(userId)
      if (!user) {
        return NextResponse.json({
          ...diagnostics,
          error: `Пользователь с ID ${userId} не найден`,
        }, { status: 404 })
      }

      diagnostics.user = {
        id: user.Id,
        name: user.name,
        phone: user.phone,
        loyalty_points: user.loyalty_points,
        total_spent: user.total_spent,
        loyalty_points_type: typeof user.loyalty_points,
        total_spent_type: typeof user.total_spent,
      }

      // Проверяем транзакции, если запрошено
      if (checkTransactions) {
        try {
          const transactions = await fetchLoyaltyPointsTransactions(userId)
          diagnostics.transactions = {
            count: transactions.length,
            list: transactions.slice(0, 10), // Последние 10
            all: transactions,
          }
        } catch (error) {
          diagnostics.transactions = {
            error: error instanceof Error ? error.message : String(error),
          }
        }
      }

      // Рассчитываем баллы, если указаны параметры
      if (orderTotalParam) {
        const orderTotal = parseFloat(orderTotalParam)
        const pointsUsed = pointsUsedParam ? parseInt(pointsUsedParam) : 0
        const currentTotalSpent = typeof user.total_spent === 'number' 
          ? user.total_spent 
          : parseFloat(String(user.total_spent)) || 0

        if (isNaN(orderTotal)) {
          return NextResponse.json({
            ...diagnostics,
            error: "orderTotal должен быть числом",
          }, { status: 400 })
        }

        const calculatedPoints = calculateEarnedPoints(orderTotal, pointsUsed, currentTotalSpent)

        diagnostics.calculation = {
          orderTotal,
          pointsUsed,
          currentTotalSpent,
          calculatedPoints,
          cashbackPercent: currentTotalSpent >= 50000 ? 7 : currentTotalSpent >= 20000 ? 5 : 3,
          amountForPoints: Math.max(0, orderTotal - pointsUsed),
          formula: `floor((${orderTotal} - ${pointsUsed}) * ${currentTotalSpent >= 50000 ? 7 : currentTotalSpent >= 20000 ? 5 : 3} / 100)`,
        }

        // Тестируем начисление, если запрошено
        if (testAward) {
          try {
            // Создаем тестовую транзакцию
            const testTransaction = await createLoyaltyPointsTransaction({
              user_id: userId,
              order_id: undefined,
              transaction_type: "earned",
              points: calculatedPoints,
              description: `[ТЕСТ] Начислено ${calculatedPoints} баллов за тестовый заказ на сумму ${orderTotal} руб.`,
            })

            diagnostics.testAward = {
              success: true,
              transaction: testTransaction,
              message: "Транзакция успешно создана",
            }

            // Обновляем баланс пользователя
            const currentLoyaltyPoints = typeof user.loyalty_points === 'number' 
              ? user.loyalty_points 
              : parseInt(String(user.loyalty_points)) || 0
            const newLoyaltyPoints = currentLoyaltyPoints + calculatedPoints

            // НЕ обновляем пользователя в тестовом режиме, только показываем что было бы
            diagnostics.testAward.wouldUpdateUser = {
              currentLoyaltyPoints,
              calculatedPoints,
              newLoyaltyPoints,
              note: "Пользователь НЕ обновлен (тестовый режим)",
            }
          } catch (error) {
            diagnostics.testAward = {
              success: false,
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined,
            }
          }
        }
      }

      return NextResponse.json(diagnostics)
    } catch (error) {
      return NextResponse.json({
        ...diagnostics,
        error: "Ошибка при получении пользователя",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({
      error: "Внутренняя ошибка",
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 })
  }
}






