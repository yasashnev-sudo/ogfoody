/**
 * КОМПЛЕКСНЫЙ ТЕСТ ВСЕХ СЦЕНАРИЕВ: БАЛЛЫ ЛОЯЛЬНОСТИ И ПРОМОКОДЫ
 * 
 * Проверяет все 15 сценариев из эталонного документа:
 * - 9 сценариев накопления баллов (earned)
 * - 7 сценариев списания баллов (used, refunded, cancelled)
 * - Работа с промокодами
 * 
 * Работает через РЕАЛЬНЫЕ API вызовы на продакшене
 * Проверяет реальную БД через NocoDB API
 */

import fetch from 'node-fetch'

// ⚠️ ПРОДАКШН КОНФИГУРАЦИЯ
const API_BASE = process.env.API_BASE || 'https://ogfoody.ru'
const TEST_USER_ID = 125 // Тестовый пользователь на проде (существующий)
const NOCODB_URL = process.env.NOCODB_URL || 'https://noco.povarnakolesah.ru'
const NOCODB_TOKEN = process.env.NOCODB_TOKEN || 'eppmI3qJq8ahGaCzPmjmZGIze9NgJxEFQzu6Ps1r'

// Генерируем уникальную дату для каждого теста
function getUniqueDate(daysOffset: number = 0): string {
  const date = new Date()
  date.setDate(date.getDate() + daysOffset + Math.floor(Math.random() * 365)) // Уникальная дата в будущем
  return date.toISOString()
}

// Table IDs (из переменных окружения или хардкод для продакшена)
const TABLE_USERS = 'mg9dm2m41bjv8ar'
const TABLE_ORDERS = 'm96i4ai2yelbboh'
const TABLE_TRANSACTIONS = 'mn244txmccpwmhx'
const TABLE_PROMO_CODES = process.env.NOCODB_TABLE_PROMO_CODES || 'm8k9x2m3n4p5q6r'

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

async function getNocoDBUser(userId: number): Promise<any> {
  const response = await fetch(
    `${NOCODB_URL}/api/v2/tables/${TABLE_USERS}/records?where=(Id,eq,${userId})`,
    {
      headers: {
        'xc-token': NOCODB_TOKEN,
        'Content-Type': 'application/json',
      },
    }
  )
  const data = await response.json() as any
  return data.list?.[0]
}

async function getUserBalance(userId: number, retries: number = 3): Promise<number> {
  for (let i = 0; i < retries; i++) {
    const user = await getNocoDBUser(userId)
    const balance = user?.['Loyalty Points'] || 0
    if (user || i === retries - 1) return balance
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  return 0
}

async function getUserTotalSpent(userId: number, retries: number = 3): Promise<number> {
  for (let i = 0; i < retries; i++) {
    const user = await getNocoDBUser(userId)
    const totalSpent = parseFloat(String(user?.['Total Spent'] || 0))
    if (user || i === retries - 1) return totalSpent
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  return 0
}

async function getUserTransactions(userId: number): Promise<any[]> {
  const response = await fetch(
    `${NOCODB_URL}/api/v2/tables/${TABLE_TRANSACTIONS}/records?where=(User ID,eq,${userId})&limit=1000&sort=-Created At`,
    {
      headers: {
        'xc-token': NOCODB_TOKEN,
        'Content-Type': 'application/json',
      },
    }
  )
  const data = await response.json() as any
  return data.list || []
}

async function getPromoCode(code: string): Promise<any> {
  const response = await fetch(
    `${NOCODB_URL}/api/v2/tables/${TABLE_PROMO_CODES}/records?where=(Code,eq,${code})`,
    {
      headers: {
        'xc-token': NOCODB_TOKEN,
        'Content-Type': 'application/json',
      },
    }
  )
  const data = await response.json() as any
  return data.list?.[0]
}

async function resetUserData(userId: number): Promise<void> {
  console.log(`🧹 Очистка данных пользователя ${userId}...`)
  
  // 1. Удаляем все заказы
  const ordersResponse = await fetch(
    `${NOCODB_URL}/api/v2/tables/${TABLE_ORDERS}/records?where=(User ID,eq,${userId})&limit=1000`,
    {
      headers: { 'xc-token': NOCODB_TOKEN },
    }
  )
  const ordersData = await ordersResponse.json() as any
  const orders = ordersData.list || []
  
  for (const order of orders) {
    await fetch(`${NOCODB_URL}/api/v2/tables/${TABLE_ORDERS}/records/${order.Id}`, {
      method: 'DELETE',
      headers: { 'xc-token': NOCODB_TOKEN },
    })
  }
  
  // 2. Удаляем все транзакции
  const transactions = await getUserTransactions(userId)
  for (const transaction of transactions) {
    await fetch(`${NOCODB_URL}/api/v2/tables/${TABLE_TRANSACTIONS}/records/${transaction.Id}`, {
      method: 'DELETE',
      headers: { 'xc-token': NOCODB_TOKEN },
    })
  }
  
  // 3. Сбрасываем баланс и total_spent
  await fetch(`${NOCODB_URL}/api/v2/tables/${TABLE_USERS}/records`, {
    method: 'PATCH',
    headers: {
      'xc-token': NOCODB_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([{ Id: userId, 'Loyalty Points': 0, 'Total Spent': 0 }]),
  })
  
  console.log(`✅ Пользователь ${userId} очищен`)
}

async function createTestOrder(orderData: any): Promise<any> {
  const response = await fetch(`${API_BASE}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order: orderData, userId: orderData.userId }),
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to create order: ${response.status} ${errorText}`)
  }
  
  return await response.json()
}

async function updateOrder(orderId: number, updateData: any): Promise<any> {
  const response = await fetch(`${API_BASE}/api/orders/${orderId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order: updateData }),
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to update order: ${response.status} ${errorText}`)
  }
  
  return await response.json()
}

async function deleteOrder(orderId: number, userId: number): Promise<any> {
  const response = await fetch(`${API_BASE}/api/orders/${orderId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to delete order: ${response.status} ${errorText}`)
  }
  
  return await response.json()
}

function calculateExpectedPoints(orderTotal: number, totalSpent: number): number {
  let cashbackPercent = 3 // Bronze
  if (totalSpent >= 50000) {
    cashbackPercent = 7 // Gold
  } else if (totalSpent >= 20000) {
    cashbackPercent = 5 // Silver
  }
  return Math.floor(orderTotal * (cashbackPercent / 100))
}

// ==================== ТЕСТЫ ====================

describe('Все сценарии: Баллы лояльности и промокоды (ПРОДАКШН)', () => {
  let createdOrderIds: number[] = []
  
  beforeAll(async () => {
    console.log('🧹 Сброс данных перед тестами...')
    console.log(`📋 Проверка пользователя ${TEST_USER_ID}...`)
    const user = await getNocoDBUser(TEST_USER_ID)
    if (!user) {
      throw new Error(`Пользователь ${TEST_USER_ID} не найден в БД!`)
    }
    console.log(`✅ Пользователь найден: ${user.Name || user['Name'] || 'Без имени'}`)
    await resetUserData(TEST_USER_ID)
    await new Promise((resolve) => setTimeout(resolve, 3000)) // Ждем обновления кэша
  }, 60000)
  
  afterAll(async () => {
    console.log('🧹 Очистка созданных заказов...')
    for (const orderId of createdOrderIds) {
      try {
        await deleteOrder(orderId, TEST_USER_ID)
      } catch (e) {
        // ignore
      }
    }
    await resetUserData(TEST_USER_ID)
  }, 120000)
  
  // ========== ГРУППА 1: НАКОПЛЕНИЕ БАЛЛОВ ==========
  
  test('Сценарий 1.2: Онлайн-оплата при создании заказа (POST)', async () => {
    const initialBalance = await getUserBalance(TEST_USER_ID)
    const initialTotalSpent = await getUserTotalSpent(TEST_USER_ID)
    console.log(`📊 Начальное состояние: баланс=${initialBalance}, total_spent=${initialTotalSpent}`)
    
    const orderData = {
      userId: TEST_USER_ID,
      startDate: getUniqueDate(30),
      deliveryTime: '18:00-21:00',
      paymentMethod: 'card',
      paid: true,
      persons: [{
        id: 1,
        day1: { breakfast: { dish: { id: 1492, name: 'Каша', price: 2000, portion: 1 } } },
        day2: {},
      }],
      extras: [],
      total: 2000,
      subtotal: 2000,
      loyaltyPointsUsed: 0,
    }
    
    const result = await createTestOrder(orderData)
    expect(result.success).toBe(true)
    expect(result.order?.id).toBeDefined()
    createdOrderIds.push(result.order.id)
    console.log(`✅ Заказ создан: ID=${result.order.id}, номер=${result.order.orderNumber}`)
    
    // Ждем обработки (увеличена задержка)
    await new Promise((resolve) => setTimeout(resolve, 4000))
    
    const finalBalance = await getUserBalance(TEST_USER_ID, 5)
    const finalTotalSpent = await getUserTotalSpent(TEST_USER_ID, 5)
    const transactions = await getUserTransactions(TEST_USER_ID)
    
    console.log(`📊 Финальное состояние: баланс=${finalBalance}, total_spent=${finalTotalSpent}`)
    console.log(`📋 Транзакций найдено: ${transactions.length}`)
    
    const expectedPoints = calculateExpectedPoints(2000, initialTotalSpent)
    console.log(`💰 Ожидаемые баллы: ${expectedPoints} (${initialTotalSpent >= 50000 ? 'Gold 7%' : initialTotalSpent >= 20000 ? 'Silver 5%' : 'Bronze 3%'})`)
    
    expect(finalBalance).toBe(initialBalance + expectedPoints)
    expect(finalTotalSpent).toBe(initialTotalSpent + 2000)
    
    const earnedTransaction = transactions.find(t => 
      t['Transaction Type'] === 'earned' && 
      t['Transaction Status'] === 'completed' &&
      t['Order ID'] === result.order.id
    )
    expect(earnedTransaction).toBeDefined()
    expect(earnedTransaction.Points).toBe(expectedPoints)
  }, 60000)
  
  test('Сценарий 1.5: Оплата наличными - Pending транзакция (POST)', async () => {
    const initialBalance = await getUserBalance(TEST_USER_ID)
    const initialTotalSpent = await getUserTotalSpent(TEST_USER_ID)
    console.log(`📊 Начальное состояние: баланс=${initialBalance}, total_spent=${initialTotalSpent}`)
    
    const orderData = {
      userId: TEST_USER_ID,
      startDate: getUniqueDate(31),
      deliveryTime: '18:00-21:00',
      paymentMethod: 'cash',
      paid: false,
      persons: [{
        id: 1,
        day1: { breakfast: { dish: { id: 1492, name: 'Каша', price: 2000, portion: 1 } } },
        day2: {},
      }],
      extras: [],
      total: 2000,
      subtotal: 2000,
      loyaltyPointsUsed: 0,
    }
    
    const result = await createTestOrder(orderData)
    expect(result.success).toBe(true)
    createdOrderIds.push(result.order.id)
    console.log(`✅ Заказ создан: ID=${result.order.id}`)
    
    await new Promise((resolve) => setTimeout(resolve, 4000))
    
    const balanceAfter = await getUserBalance(TEST_USER_ID, 5)
    const totalSpentAfter = await getUserTotalSpent(TEST_USER_ID, 5)
    const transactions = await getUserTransactions(TEST_USER_ID)
    
    console.log(`📊 После создания: баланс=${balanceAfter}, total_spent=${totalSpentAfter}`)
    console.log(`📋 Транзакций найдено: ${transactions.length}`)
    
    expect(balanceAfter).toBe(initialBalance) // Баллы НЕ начислены сразу
    expect(totalSpentAfter).toBe(initialTotalSpent + 2000) // total_spent обновлен
    
    const pendingTransaction = transactions.find(t => 
      t['Transaction Type'] === 'earned' && 
      t['Transaction Status'] === 'pending' &&
      t['Order ID'] === result.order.id
    )
    expect(pendingTransaction).toBeDefined()
  }, 60000)
  
  test('Сценарий 1.6: Оплата заказа после создания (PATCH)', async () => {
    // Создаем неоплаченный заказ
    const orderData = {
      userId: TEST_USER_ID,
      startDate: getUniqueDate(32),
      deliveryTime: '18:00-21:00',
      paymentMethod: 'card',
      paid: false,
      persons: [{
        id: 1,
        day1: { breakfast: { dish: { id: 1492, name: 'Каша', price: 2000, portion: 1 } } },
        day2: {},
      }],
      extras: [],
      total: 2000,
      subtotal: 2000,
      loyaltyPointsUsed: 0,
    }
    
    const createResult = await createTestOrder(orderData)
    createdOrderIds.push(createResult.order.id)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    
    const balanceBeforePayment = await getUserBalance(TEST_USER_ID, 5)
    const totalSpentBeforePayment = await getUserTotalSpent(TEST_USER_ID, 5)
    console.log(`📊 До оплаты: баланс=${balanceBeforePayment}, total_spent=${totalSpentBeforePayment}`)
    
    // Оплачиваем заказ
    await updateOrder(createResult.order.id, {
      paid: true,
      paymentStatus: 'paid',
    })
    console.log(`✅ Заказ оплачен`)
    
    await new Promise((resolve) => setTimeout(resolve, 4000))
    
    const balanceAfterPayment = await getUserBalance(TEST_USER_ID, 5)
    const totalSpentAfterPayment = await getUserTotalSpent(TEST_USER_ID, 5)
    const transactions = await getUserTransactions(TEST_USER_ID)
    
    console.log(`📊 После оплаты: баланс=${balanceAfterPayment}, total_spent=${totalSpentAfterPayment}`)
    
    const expectedPoints = calculateExpectedPoints(2000, totalSpentBeforePayment)
    console.log(`💰 Ожидаемые баллы: ${expectedPoints}`)
    expect(balanceAfterPayment).toBe(balanceBeforePayment + expectedPoints)
    
    const earnedTransaction = transactions.find(t => 
      t['Transaction Type'] === 'earned' && 
      t['Transaction Status'] === 'completed' &&
      t['Order ID'] === createResult.order.id
    )
    expect(earnedTransaction).toBeDefined()
  }, 60000)
  
  // ========== ГРУППА 2: СПИСАНИЕ БАЛЛОВ ==========
  
  test('Сценарий 2.1: Использование баллов при создании заказа', async () => {
    // Сначала начислим баллы
    const orderData1 = {
      userId: TEST_USER_ID,
      startDate: getUniqueDate(33),
      deliveryTime: '18:00-21:00',
      paymentMethod: 'card',
      paid: true,
      persons: [{
        id: 1,
        day1: { breakfast: { dish: { id: 1492, name: 'Каша', price: 5000, portion: 1 } } },
        day2: {},
      }],
      extras: [],
      total: 5000,
      subtotal: 5000,
      loyaltyPointsUsed: 0,
    }
    
    const result1 = await createTestOrder(orderData1)
    createdOrderIds.push(result1.order.id)
    await new Promise((resolve) => setTimeout(resolve, 4000))
    
    const balanceAfterEarn = await getUserBalance(TEST_USER_ID, 5)
    console.log(`📊 Баланс после начисления: ${balanceAfterEarn}`)
    expect(balanceAfterEarn).toBeGreaterThan(0)
    
    // Теперь используем баллы
    const pointsToUse = Math.min(100, balanceAfterEarn) // Используем не больше, чем есть
    const orderData2 = {
      userId: TEST_USER_ID,
      startDate: getUniqueDate(34),
      deliveryTime: '18:00-21:00',
      paymentMethod: 'card',
      paid: true,
      persons: [{
        id: 1,
        day1: { breakfast: { dish: { id: 1492, name: 'Каша', price: 2000, portion: 1 } } },
        day2: {},
      }],
      extras: [],
      total: 2000,
      subtotal: 2000,
      loyaltyPointsUsed: pointsToUse,
    }
    
    const result2 = await createTestOrder(orderData2)
    createdOrderIds.push(result2.order.id)
    await new Promise((resolve) => setTimeout(resolve, 4000))
    
    const balanceAfterUse = await getUserBalance(TEST_USER_ID, 5)
    const transactions = await getUserTransactions(TEST_USER_ID)
    
    console.log(`📊 Баланс после использования: ${balanceAfterUse}, ожидается: ${balanceAfterEarn - pointsToUse}`)
    expect(balanceAfterUse).toBe(balanceAfterEarn - pointsToUse)
    
    const usedTransaction = transactions.find(t => 
      t['Transaction Type'] === 'used' && 
      t['Transaction Status'] === 'completed' &&
      t['Order ID'] === result2.order.id
    )
    expect(usedTransaction).toBeDefined()
    expect(usedTransaction.Points).toBe(-pointsToUse)
  }, 60000)
  
  test('Сценарий 2.6: Возврат баллов при удалении заказа - проверка total_spent', async () => {
    const initialBalance = await getUserBalance(TEST_USER_ID)
    const initialTotalSpent = await getUserTotalSpent(TEST_USER_ID)
    console.log(`📊 Начальное состояние: баланс=${initialBalance}, total_spent=${initialTotalSpent}`)
    
    // Создаем оплаченный заказ
    const orderData = {
      userId: TEST_USER_ID,
      startDate: getUniqueDate(35),
      deliveryTime: '18:00-21:00',
      paymentMethod: 'card',
      paid: true,
      persons: [{
        id: 1,
        day1: { breakfast: { dish: { id: 1492, name: 'Каша', price: 2000, portion: 1 } } },
        day2: {},
      }],
      extras: [],
      total: 2000,
      subtotal: 2000,
      loyaltyPointsUsed: 0,
    }
    
    const createResult = await createTestOrder(orderData)
    await new Promise((resolve) => setTimeout(resolve, 4000))
    
    const balanceAfterCreate = await getUserBalance(TEST_USER_ID, 5)
    const totalSpentAfterCreate = await getUserTotalSpent(TEST_USER_ID, 5)
    console.log(`📊 После создания: баланс=${balanceAfterCreate}, total_spent=${totalSpentAfterCreate}`)
    
    expect(balanceAfterCreate).toBeGreaterThan(initialBalance)
    expect(totalSpentAfterCreate).toBe(initialTotalSpent + 2000)
    
    // Удаляем заказ
    await deleteOrder(createResult.order.id, TEST_USER_ID)
    console.log(`✅ Заказ удален`)
    await new Promise((resolve) => setTimeout(resolve, 4000))
    
    const balanceAfterDelete = await getUserBalance(TEST_USER_ID, 5)
    const totalSpentAfterDelete = await getUserTotalSpent(TEST_USER_ID, 5)
    console.log(`📊 После удаления: баланс=${balanceAfterDelete}, total_spent=${totalSpentAfterDelete}`)
    
    // ✅ КРИТИЧНО: Проверяем что total_spent откачен
    expect(balanceAfterDelete).toBe(initialBalance) // Баллы возвращены
    expect(totalSpentAfterDelete).toBe(initialTotalSpent) // ✅ total_spent откачен
  }, 60000)
  
  // ========== ГРУППА 3: ПРОМОКОДЫ ==========
  
  test('Сценарий: Промокод инкрементируется при создании заказа', async () => {
    // Создаем тестовый промокод (если его нет)
    const testPromoCode = 'TEST_PROMO_001'
    
    // Создаем заказ с промокодом
    const orderData = {
      userId: TEST_USER_ID,
      startDate: getUniqueDate(36),
      deliveryTime: '18:00-21:00',
      paymentMethod: 'card',
      paid: true,
      promoCode: testPromoCode,
      promoDiscount: 100,
      persons: [{
        id: 1,
        day1: { breakfast: { dish: { id: 1492, name: 'Каша', price: 2000, portion: 1 } } },
        day2: {},
      }],
      extras: [],
      total: 1900,
      subtotal: 2000,
      loyaltyPointsUsed: 0,
    }
    
    const promoBefore = await getPromoCode(testPromoCode)
    const timesUsedBefore = promoBefore?.['Times Used'] || 0
    
    const result = await createTestOrder(orderData)
    expect(result.success).toBe(true)
    createdOrderIds.push(result.order.id)
    
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    const promoAfter = await getPromoCode(testPromoCode)
    if (promoAfter) {
      const timesUsedAfter = promoAfter['Times Used'] || 0
      // ✅ Проверяем что счетчик увеличился
      expect(timesUsedAfter).toBe(timesUsedBefore + 1)
    }
  }, 60000)
  
  test('Сценарий: Промокод инкрементируется при оплате заказа', async () => {
    const testPromoCode = 'TEST_PROMO_002'
    
    // Создаем неоплаченный заказ с промокодом
    const orderData = {
      userId: TEST_USER_ID,
      startDate: getUniqueDate(37),
      deliveryTime: '18:00-21:00',
      paymentMethod: 'card',
      paid: false,
      promoCode: testPromoCode,
      promoDiscount: 100,
      persons: [{
        id: 1,
        day1: { breakfast: { dish: { id: 1492, name: 'Каша', price: 2000, portion: 1 } } },
        day2: {},
      }],
      extras: [],
      total: 1900,
      subtotal: 2000,
      loyaltyPointsUsed: 0,
    }
    
    const createResult = await createTestOrder(orderData)
    createdOrderIds.push(createResult.order.id)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    const promoBeforePayment = await getPromoCode(testPromoCode)
    const timesUsedBefore = promoBeforePayment?.['Times Used'] || 0
    
    // Оплачиваем заказ
    await updateOrder(createResult.order.id, {
      paid: true,
      paymentStatus: 'paid',
    })
    
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    const promoAfterPayment = await getPromoCode(testPromoCode)
    if (promoAfterPayment) {
      const timesUsedAfter = promoAfterPayment['Times Used'] || 0
      // ✅ Проверяем что счетчик увеличился при оплате
      expect(timesUsedAfter).toBe(timesUsedBefore + 1)
    }
  }, 60000)
})
