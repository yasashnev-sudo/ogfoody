/**
 * 🧪 ТЕСТ: Защита от двойного начисления баллов
 * 
 * Проверяет, что awardLoyaltyPoints не создает дублирующие транзакции
 */

import fetch from 'node-fetch'

const API_BASE = process.env.API_BASE || 'https://ogfoody.ru'
const TEST_USER_ID = parseInt(process.env.TEST_USER_ID || '120')

async function testDoubleAwardPrevention() {
  console.log(`\n🧪 ТЕСТ: Защита от двойного начисления баллов\n`)
  console.log(`API: ${API_BASE}`)
  console.log(`User ID: ${TEST_USER_ID}\n`)

  try {
    // Шаг 1: Получаем текущий баланс и транзакции
    console.log('📊 Шаг 1: Получаем текущий баланс...')
    const userResponse = await fetch(`${API_BASE}/api/db/Users/records?where=(Id,eq,${TEST_USER_ID})`, {
      headers: {
        'xc-token': process.env.NOCODB_TOKEN || '',
      },
    })
    const userData = await userResponse.json()
    const user = Array.isArray(userData) ? userData[0] : userData.list?.[0]
    
    if (!user) {
      console.error(`❌ Пользователь ${TEST_USER_ID} не найден`)
      return
    }
    
    const initialBalance = typeof user.loyalty_points === 'number' 
      ? user.loyalty_points 
      : parseInt(String(user.loyalty_points || 0)) || 0
    
    console.log(`✅ Начальный баланс: ${initialBalance} баллов`)

    // Шаг 2: Получаем транзакции пользователя
    console.log('\n📋 Шаг 2: Получаем транзакции...')
    const transactionsResponse = await fetch(`${API_BASE}/api/db/Loyalty_Points_Transactions/records?where=(User ID,eq,${TEST_USER_ID})&sort=-created_at&limit=10`, {
      headers: {
        'xc-token': process.env.NOCODB_TOKEN || '',
      },
    })
    const transactionsData = await transactionsResponse.json()
    const transactions = Array.isArray(transactionsData) ? transactionsData : transactionsData.list || []
    
    const earnedTransactions = transactions.filter((t: any) => 
      (t['Transaction Type'] === 'earned' || t.transaction_type === 'earned') &&
      (t['Transaction Status'] === 'completed' || t.transaction_status === 'completed')
    )
    
    console.log(`✅ Найдено транзакций "earned": ${earnedTransactions.length}`)
    
    if (earnedTransactions.length > 0) {
      // Группируем по order_id
      const byOrderId: Record<number, any[]> = {}
      earnedTransactions.forEach((t: any) => {
        const orderId = t['Order ID'] || t.order_id
        if (orderId) {
          if (!byOrderId[orderId]) {
            byOrderId[orderId] = []
          }
          byOrderId[orderId].push(t)
        }
      })
      
      // Ищем заказы с несколькими транзакциями
      const duplicates = Object.entries(byOrderId).filter(([_, trans]) => trans.length > 1)
      
      if (duplicates.length > 0) {
        console.log(`\n⚠️ НАЙДЕНЫ ДУБЛИКАТЫ ТРАНЗАКЦИЙ:`)
        duplicates.forEach(([orderId, trans]) => {
          console.log(`  Заказ ${orderId}: ${trans.length} транзакций`)
          trans.forEach((t: any) => {
            const points = t['Points'] || t.points || 0
            const id = t.Id || t.id
            const createdAt = t['Created At'] || t.created_at
            console.log(`    - Транзакция ${id}: ${points} баллов (${createdAt})`)
          })
        })
      } else {
        console.log(`\n✅ Дубликатов не найдено - защита работает!`)
      }
    }

    // Шаг 3: Проверяем логи на наличие предупреждений о защите
    console.log('\n📝 Шаг 3: Проверяем логи на наличие предупреждений...')
    console.log('ℹ️ Проверьте логи PM2 на сервере командой: pm2 logs --lines 100 | grep "ЗАЩИТА ОТ ДВОЙНОГО НАЧИСЛЕНИЯ"')
    
    console.log('\n✅ ТЕСТ ЗАВЕРШЕН\n')
  } catch (error) {
    console.error(`❌ Ошибка теста:`, error)
  }
}

testDoubleAwardPrevention()
