import { NextResponse } from "next/server"

// API endpoint для очистки тестовых данных
// ВНИМАНИЕ: Используйте ТОЛЬКО для разработки!
export async function POST(request: Request) {
  try {
    const { tables, userId } = await request.json()
    
    const NOCODB_URL = process.env.NOCODB_URL
    const NOCODB_TOKEN = process.env.NOCODB_TOKEN
    const NOCODB_BASE_ID = process.env.NOCODB_BASE_ID
    
    if (!NOCODB_URL || !NOCODB_TOKEN || !NOCODB_BASE_ID) {
      return NextResponse.json({ error: "NocoDB credentials not configured" }, { status: 500 })
    }

    const results: any = {}

    // Очистка таблицы Orders
    if (tables.includes('orders')) {
      console.log(`🗑️ Очистка Orders для userId=${userId}...`)
      
      // Получаем все заказы пользователя
      const ordersUrl = `${NOCODB_URL}/api/v2/tables/${process.env.NOCODB_TABLE_ORDERS}/records?where=(User ID,eq,${userId})&limit=1000`
      const ordersResponse = await fetch(ordersUrl, {
        headers: {
          'xc-token': NOCODB_TOKEN,
        },
      })
      
      const ordersData = await ordersResponse.json()
      const orderIds = ordersData.list?.map((o: any) => o.Id) || []
      
      console.log(`📦 Найдено заказов: ${orderIds.length}`)
      
      // Удаляем каждый заказ
      for (const orderId of orderIds) {
        await fetch(`${NOCODB_URL}/api/v2/tables/${process.env.NOCODB_TABLE_ORDERS}/records`, {
          method: 'DELETE',
          headers: {
            'xc-token': NOCODB_TOKEN,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([orderId]),
        })
      }
      
      results.orders = { deleted: orderIds.length, ids: orderIds }
    }

    // Очистка таблицы Loyalty_Points_Transactions
    if (tables.includes('loyalty_transactions')) {
      console.log(`🗑️ Очистка Loyalty_Points_Transactions для userId=${userId}...`)
      
      const transactionsUrl = `${NOCODB_URL}/api/v2/tables/${process.env.NOCODB_TABLE_LOYALTY_POINTS_TRANSACTIONS}/records?where=(User ID,eq,${userId})&limit=10000`
      const transactionsResponse = await fetch(transactionsUrl, {
        headers: {
          'xc-token': NOCODB_TOKEN,
        },
      })
      
      const transactionsData = await transactionsResponse.json()
      const transactionIds = transactionsData.list?.map((t: any) => t.Id) || []
      
      console.log(`💰 Найдено транзакций: ${transactionIds.length}`)
      
      // Удаляем каждую транзакцию
      for (const transactionId of transactionIds) {
        await fetch(`${NOCODB_URL}/api/v2/tables/${process.env.NOCODB_TABLE_LOYALTY_POINTS_TRANSACTIONS}/records`, {
          method: 'DELETE',
          headers: {
            'xc-token': NOCODB_TOKEN,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([transactionId]),
        })
      }
      
      results.loyalty_transactions = { deleted: transactionIds.length, ids: transactionIds }
    }

    // Сброс баланса пользователя
    if (tables.includes('user_balance')) {
      console.log(`🗑️ Сброс баланса пользователя ${userId}...`)
      
      const updateUrl = `${NOCODB_URL}/api/v2/tables/${process.env.NOCODB_TABLE_USERS}/records`
      await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
          'xc-token': NOCODB_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{
          Id: userId,
          'Loyalty Points': 0,
        }]),
      })
      
      results.user_balance = { reset: true, userId }
    }

    console.log('✅ Очистка завершена:', results)

    return NextResponse.json({
      success: true,
      message: 'Test data cleaned successfully',
      results,
    })
  } catch (error) {
    console.error('❌ Ошибка очистки данных:', error)
    return NextResponse.json({
      error: 'Failed to clean test data',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}




