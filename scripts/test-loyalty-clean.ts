/**
 * ЧИСТЫЕ ТЕСТЫ СИСТЕМЫ ЛОЯЛЬНОСТИ
 * 
 * Создает пользователя через API с именем и адресом,
 * затем тестирует все сценарии начисления и использования баллов
 */

import fetch from 'node-fetch'

const API_BASE = process.env.API_BASE || (process.env.NODE_ENV === 'production' ? 'https://ogfoody.ru' : 'http://localhost:3000')
const NOCODB_URL = process.env.NOCODB_URL || 'https://noco.povarnakolesah.ru'
const NOCODB_TOKEN = process.env.NOCODB_TOKEN || 'eppmI3qJq8ahGaCzPmjmZGIze9NgJxEFQzu6Ps1r'

const TABLE_USERS = 'mg9dm2m41bjv8ar'
const TABLE_ORDERS = 'm96i4ai2yelbboh'
const TABLE_TRANSACTIONS = 'mn244txmccpwmhx'
const TABLE_PROMO_CODES = 'm8k9x2m3n4p5q6r'

const baseUrl = NOCODB_URL.replace(/\/$/, "").replace(/\/api\/v2$/, "")

interface TestResult {
  name: string
  status: 'PASS' | 'FAIL' | 'SKIP'
  message: string
  details?: any
}

const testResults: TestResult[] = []

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function getNocoDBUser(userId: number): Promise<any> {
  const url = `${baseUrl}/api/v2/tables/${TABLE_USERS}/records?where=(Id,eq,${userId})`
  const response = await fetch(url, {
    headers: {
      'xc-token': NOCODB_TOKEN,
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) throw new Error(`Failed to get user: ${response.status}`)
  const data = await response.json() as any
  return data.list?.[0]
}

async function getUserBalance(userId: number): Promise<number> {
  const user = await getNocoDBUser(userId)
  const balance = user?.['Loyalty Points'] || 0
  return typeof balance === 'number' ? balance : parseFloat(String(balance)) || 0
}

async function getUserTotalSpent(userId: number): Promise<number> {
  const user = await getNocoDBUser(userId)
  const totalSpent = user?.['Total Spent'] || 0
  return typeof totalSpent === 'number' ? totalSpent : parseFloat(String(totalSpent)) || 0
}

async function createUserViaAPI(userData: {
  phone: string
  name: string
  street: string
  building: string
  district?: string
}): Promise<number> {
  console.log(`   Создаем пользователя через API: ${userData.name} (${userData.phone})`)
  
  const now = new Date().toISOString()
  const userPayload = {
    phone: userData.phone,
    name: userData.name,
    street: userData.street,
    building: userData.building,
    district: userData.district || '',
    loyalty_points: 0,
    total_spent: 0,
    created_at: now,
    updated_at: now,
  }
  
  // Используем прокси API для создания пользователя
  const response = await fetch(`${API_BASE}/api/db/Users/records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify([userPayload]), // NocoDB API ожидает массив
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to create user: ${response.status} ${errorText}`)
  }
  
  const data = await response.json() as any
  // NocoDB API возвращает массив при POST
  const user = Array.isArray(data) ? data[0] : (data.list?.[0] || data)
  const userId = user?.Id || user?.id
  
  if (!userId) {
    throw new Error('User ID not returned from API')
  }
  
  console.log(`   ✅ Пользователь создан: ID=${userId}`)
  return userId
}

async function createOrder(orderData: any): Promise<any> {
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

async function deleteOrder(orderId: number, userId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/api/orders/${orderId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    console.warn(`⚠️ Не удалось удалить заказ ${orderId}: ${errorText}`)
  }
}

function getUniqueDate(daysOffset: number = 0): string {
  const date = new Date()
  date.setDate(date.getDate() + daysOffset)
  return date.toISOString().split('T')[0]
}

// ==================== ТЕСТЫ ====================

async function test1_BasicPointsAward(): Promise<TestResult> {
  const testName = 'Тест 1: Базовое начисление баллов'
  console.log(`\n🧪 ${testName}`)
  
  try {
    // Создаем пользователя
    const userId = await createUserViaAPI({
      phone: `+7999${Date.now() % 10000000}`,
      name: 'Тестовый Пользователь 1',
      street: 'Тестовая улица',
      building: '1',
      district: 'Центральный',
    })
    
    const initialBalance = await getUserBalance(userId)
    const initialTotalSpent = await getUserTotalSpent(userId)
    
    console.log(`   Начальный баланс: ${initialBalance}, total_spent: ${initialTotalSpent}`)
    
    // Создаем заказ на 2000₽ с оплатой картой
    const orderData = {
      userId,
      startDate: getUniqueDate(1),
      deliveryTime: '18:00-21:00',
      paymentMethod: 'card',
      paid: true,
      paymentStatus: 'paid',
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
    
    const result = await createOrder(orderData)
    const orderId = result.order?.id || result.order?.Id
    
    if (!orderId) {
      return { name: testName, status: 'FAIL', message: 'Заказ не создан' }
    }
    
    await sleep(5000) // Ждем обработки
    
    const finalBalance = await getUserBalance(userId)
    const finalTotalSpent = await getUserTotalSpent(userId)
    const actualPointsEarned = finalBalance - initialBalance
    
    // Ожидаем 3% от 2000 = 60 баллов (для нового пользователя)
    const expectedPoints = Math.floor(2000 * 0.03)
    
    console.log(`   Финальный баланс: ${finalBalance}, начислено: ${actualPointsEarned}`)
    console.log(`   Ожидалось: ${expectedPoints}`)
    
    // Очистка
    await deleteOrder(orderId, userId)
    
    if (actualPointsEarned === expectedPoints) {
      return { name: testName, status: 'PASS', message: `Баллы начислены правильно: ${actualPointsEarned}` }
    } else {
      return { name: testName, status: 'FAIL', message: `Баллы начислены неправильно: получено ${actualPointsEarned}, ожидалось ${expectedPoints}` }
    }
  } catch (error: any) {
    return { name: testName, status: 'FAIL', message: `Ошибка: ${error.message}` }
  }
}

async function test2_PointsWithPromoCode(): Promise<TestResult> {
  const testName = 'Тест 2: Начисление баллов с промокодом'
  console.log(`\n🧪 ${testName}`)
  
  try {
    // Создаем пользователя
    const userId = await createUserViaAPI({
      phone: `+7999${Date.now() % 10000000}`,
      name: 'Тестовый Пользователь 2',
      street: 'Тестовая улица',
      building: '2',
      district: 'Центральный',
    })
    
    const initialBalance = await getUserBalance(userId)
    const initialTotalSpent = await getUserTotalSpent(userId)
    
    // Создаем промокод
    const promoCode = `TEST-${Date.now()}`
    const promoResponse = await fetch(`${API_BASE}/api/db/Promo_Codes/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{
        Code: promoCode,
        'Discount Type': 'fixed',
        'Discount Value': 200,
        'Usage Type': 'unlimited',
        Active: true,
        'Times Used': 0,
      }]),
    })
    
    if (!promoResponse.ok) {
      return { name: testName, status: 'FAIL', message: 'Не удалось создать промокод' }
    }
    
    const promoData = await promoResponse.json() as any
    const promo = Array.isArray(promoData) ? promoData[0] : promoData.list?.[0]
    
    if (!promo || !promo.Id) {
      return { name: testName, status: 'FAIL', message: 'Промокод не создан' }
    }
    
    // Создаем заказ с промокодом
    const orderData = {
      userId,
      startDate: getUniqueDate(2),
      deliveryTime: '18:00-21:00',
      paymentMethod: 'card',
      paid: true,
      paymentStatus: 'paid',
      promoCode: promoCode,
      promoDiscount: 200,
      persons: [{
        id: 1,
        day1: { breakfast: { dish: { id: 1492, name: 'Каша', price: 2000, portion: 1 } } },
        day2: {},
      }],
      extras: [],
      total: 1800, // 2000 - 200 (промокод)
      subtotal: 2000,
      loyaltyPointsUsed: 0,
    }
    
    const result = await createOrder(orderData)
    const orderId = result.order?.id || result.order?.Id
    
    if (!orderId) {
      await fetch(`${API_BASE}/api/admin/promo/${promo.Id}`, { method: 'DELETE' }).catch(() => {})
      return { name: testName, status: 'FAIL', message: 'Заказ не создан' }
    }
    
    await sleep(5000)
    
    const finalBalance = await getUserBalance(userId)
    const actualPointsEarned = finalBalance - initialBalance
    
    // Баллы должны начисляться на orderTotal = 1800 (с учетом промокода)
    const expectedPoints = Math.floor(1800 * 0.03) // 54 балла
    
    console.log(`   Финальный баланс: ${finalBalance}, начислено: ${actualPointsEarned}`)
    console.log(`   Ожидалось: ${expectedPoints} (3% от 1800)`)
    
    // Очистка
    await deleteOrder(orderId, userId)
    await fetch(`${API_BASE}/api/admin/promo/${promo.Id}`, { method: 'DELETE' }).catch(() => {})
    
    if (actualPointsEarned === expectedPoints) {
      return { name: testName, status: 'PASS', message: `Баллы начислены правильно: ${actualPointsEarned}` }
    } else {
      return { name: testName, status: 'FAIL', message: `Баллы начислены неправильно: получено ${actualPointsEarned}, ожидалось ${expectedPoints}` }
    }
  } catch (error: any) {
    return { name: testName, status: 'FAIL', message: `Ошибка: ${error.message}` }
  }
}

async function test3_PointsUsage(): Promise<TestResult> {
  const testName = 'Тест 3: Использование баллов'
  console.log(`\n🧪 ${testName}`)
  
  try {
    // Создаем пользователя
    const userId = await createUserViaAPI({
      phone: `+7999${Date.now() % 10000000}`,
      name: 'Тестовый Пользователь 3',
      street: 'Тестовая улица',
      building: '3',
      district: 'Центральный',
    })
    
    // Сначала начисляем баллы (создаем заказ)
    const order1Data = {
      userId,
      startDate: getUniqueDate(3),
      deliveryTime: '18:00-21:00',
      paymentMethod: 'card',
      paid: true,
      paymentStatus: 'paid',
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
    
    const result1 = await createOrder(order1Data)
    const order1Id = result1.order?.id || result1.order?.Id
    await sleep(5000)
    
    const balanceAfterEarn = await getUserBalance(userId)
    console.log(`   Баланс после начисления: ${balanceAfterEarn}`)
    
    if (balanceAfterEarn < 50) {
      await deleteOrder(order1Id, userId)
      return { name: testName, status: 'FAIL', message: `Недостаточно баллов для теста: ${balanceAfterEarn}` }
    }
    
    // Теперь используем баллы
    const pointsToUse = 50
    const order2Data = {
      userId,
      startDate: getUniqueDate(4),
      deliveryTime: '18:00-21:00',
      paymentMethod: 'card',
      paid: true,
      paymentStatus: 'paid',
      persons: [{
        id: 1,
        day1: { breakfast: { dish: { id: 1492, name: 'Каша', price: 2000, portion: 1 } } },
        day2: {},
      }],
      extras: [],
      total: 2000 - pointsToUse,
      subtotal: 2000,
      loyaltyPointsUsed: pointsToUse,
    }
    
    const result2 = await createOrder(order2Data)
    const order2Id = result2.order?.id || result2.order?.Id
    await sleep(5000)
    
    const balanceAfterUse = await getUserBalance(userId)
    
    // При втором заказе начисляются новые баллы (3% от 2000 = 60)
    // И списываются использованные баллы (50)
    // Итого: 60 (первый заказ) + 60 (второй заказ) - 50 (использовано) = 70
    const expectedBalanceAfterUse = balanceAfterEarn + Math.floor(2000 * 0.03) - pointsToUse
    const actualPointsUsed = balanceAfterEarn - (balanceAfterUse - Math.floor(2000 * 0.03))
    
    console.log(`   Баланс после использования: ${balanceAfterUse}`)
    console.log(`   Ожидаемый баланс: ${expectedBalanceAfterUse} (${balanceAfterEarn} + 60 - ${pointsToUse})`)
    console.log(`   Фактически списано баллов: ${actualPointsUsed}`)
    
    // Очистка
    await deleteOrder(order1Id, userId)
    await deleteOrder(order2Id, userId)
    
    if (actualPointsUsed === pointsToUse && balanceAfterUse === expectedBalanceAfterUse) {
      return { name: testName, status: 'PASS', message: `Баллы использованы правильно: списано ${actualPointsUsed}, баланс ${balanceAfterUse}` }
    } else {
      return { name: testName, status: 'FAIL', message: `Баллы использованы неправильно: списано ${actualPointsUsed} (ожидалось ${pointsToUse}), баланс ${balanceAfterUse} (ожидался ${expectedBalanceAfterUse})` }
    }
  } catch (error: any) {
    return { name: testName, status: 'FAIL', message: `Ошибка: ${error.message}` }
  }
}

async function test4_CashPaymentPending(): Promise<TestResult> {
  const testName = 'Тест 4: Оплата наличными (pending транзакции)'
  console.log(`\n🧪 ${testName}`)
  
  try {
    const userId = await createUserViaAPI({
      phone: `+7999${Date.now() % 10000000}`,
      name: 'Тестовый Пользователь 4',
      street: 'Тестовая улица',
      building: '4',
      district: 'Центральный',
    })
    
    const initialBalance = await getUserBalance(userId)
    
    // Создаем заказ на наличные
    const orderData = {
      userId,
      startDate: getUniqueDate(5),
      deliveryTime: '18:00-21:00',
      paymentMethod: 'cash',
      paid: false,
      paymentStatus: 'pending',
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
    
    const result = await createOrder(orderData)
    const orderId = result.order?.id || result.order?.Id
    
    if (!orderId) {
      return { name: testName, status: 'FAIL', message: 'Заказ не создан' }
    }
    
    await sleep(3000)
    
    // Проверяем, что баланс не изменился (pending транзакция)
    const balanceAfterOrder = await getUserBalance(userId)
    
    // Проверяем наличие pending транзакции через API
    const transactionsUrl = `${baseUrl}/api/v2/tables/${TABLE_TRANSACTIONS}/records?where=(User ID,eq,${userId})~and(Transaction Status,eq,pending)~and(Transaction Type,eq,earned)&limit=10`
    const transactionsResponse = await fetch(transactionsUrl, {
      headers: {
        'xc-token': NOCODB_TOKEN,
        'Content-Type': 'application/json',
      },
    })
    
    const transactionsData = await transactionsResponse.json() as any
    const pendingTransactions = transactionsData.list || []
    const hasPendingTransaction = pendingTransactions.length > 0 && 
      pendingTransactions.some((t: any) => (t['Order ID'] || t.order_id) === orderId)
    
    // Очистка
    await deleteOrder(orderId, userId)
    
    if (balanceAfterOrder === initialBalance && hasPendingTransaction) {
      return { name: testName, status: 'PASS', message: `Pending транзакция создана, баланс не изменился: ${balanceAfterOrder}` }
    } else {
      return { name: testName, status: 'FAIL', message: `Баланс: ${balanceAfterOrder} (ожидался ${initialBalance}), pending транзакция: ${hasPendingTransaction}` }
    }
  } catch (error: any) {
    return { name: testName, status: 'FAIL', message: `Ошибка: ${error.message}` }
  }
}

async function test5_OrderCancellation(): Promise<TestResult> {
  const testName = 'Тест 5: Отмена заказа (возврат баллов)'
  console.log(`\n🧪 ${testName}`)
  
  try {
    const userId = await createUserViaAPI({
      phone: `+7999${Date.now() % 10000000}`,
      name: 'Тестовый Пользователь 5',
      street: 'Тестовая улица',
      building: '5',
      district: 'Центральный',
    })
    
    // Создаем оплаченный заказ (начисляются баллы)
    const orderData = {
      userId,
      startDate: getUniqueDate(6), // Будущая дата для возможности отмены
      deliveryTime: '18:00-21:00',
      paymentMethod: 'card',
      paid: true,
      paymentStatus: 'paid',
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
    
    const result = await createOrder(orderData)
    const orderId = result.order?.id || result.order?.Id
    
    if (!orderId) {
      return { name: testName, status: 'FAIL', message: 'Заказ не создан' }
    }
    
    await sleep(5000)
    
    const balanceAfterEarn = await getUserBalance(userId)
    const expectedEarned = Math.floor(2000 * 0.03) // 60 баллов
    
    console.log(`   Баланс после начисления: ${balanceAfterEarn} (ожидалось ${expectedEarned})`)
    
    if (balanceAfterEarn !== expectedEarned) {
      await deleteOrder(orderId, userId)
      return { name: testName, status: 'FAIL', message: `Баллы не начислены: ${balanceAfterEarn} вместо ${expectedEarned}` }
    }
    
    // Отменяем заказ
    const cancelResponse = await fetch(`${API_BASE}/api/orders/${orderId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    
    if (!cancelResponse.ok) {
      const errorText = await cancelResponse.text()
      return { name: testName, status: 'FAIL', message: `Не удалось отменить заказ: ${errorText}` }
    }
    
    await sleep(5000)
    
    const balanceAfterCancel = await getUserBalance(userId)
    const expectedAfterCancel = 0 // Баллы должны быть возвращены (списаны)
    
    console.log(`   Баланс после отмены: ${balanceAfterCancel} (ожидалось ${expectedAfterCancel})`)
    
    if (balanceAfterCancel === expectedAfterCancel) {
      return { name: testName, status: 'PASS', message: `Баллы возвращены при отмене: ${balanceAfterEarn} → ${balanceAfterCancel}` }
    } else {
      return { name: testName, status: 'FAIL', message: `Баланс после отмены: ${balanceAfterCancel} (ожидался ${expectedAfterCancel})` }
    }
  } catch (error: any) {
    return { name: testName, status: 'FAIL', message: `Ошибка: ${error.message}` }
  }
}

async function test6_SilverLevel(): Promise<TestResult> {
  const testName = 'Тест 6: Silver уровень (5% кэшбек)'
  console.log(`\n🧪 ${testName}`)
  
  try {
    const userId = await createUserViaAPI({
      phone: `+7999${Date.now() % 10000000}`,
      name: 'Тестовый Пользователь 6',
      street: 'Тестовая улица',
      building: '6',
      district: 'Центральный',
    })
    
    // Накапливаем total_spent до 20000 для Silver уровня
    // Создаем несколько заказов на сумму ~21000
    const ordersToCreate = 11 // 11 заказов по 2000 = 22000
    let totalSpent = 0
    
    for (let i = 0; i < ordersToCreate; i++) {
      const orderData = {
        userId,
        startDate: getUniqueDate(7 + i),
        deliveryTime: '18:00-21:00',
        paymentMethod: 'card',
        paid: true,
        paymentStatus: 'paid',
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
      
      const result = await createOrder(orderData)
      if (result.order?.id || result.order?.Id) {
        totalSpent += 2000
        await sleep(2000) // Небольшая задержка между заказами
      }
    }
    
    await sleep(5000)
    
    const currentTotalSpent = await getUserTotalSpent(userId)
    const balance = await getUserBalance(userId)
    
    console.log(`   total_spent: ${currentTotalSpent}, баланс: ${balance}`)
    
    // Создаем еще один заказ для проверки Silver уровня (5%)
    const testOrderData = {
      userId,
      startDate: getUniqueDate(20),
      deliveryTime: '18:00-21:00',
      paymentMethod: 'card',
      paid: true,
      paymentStatus: 'paid',
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
    
    const balanceBefore = await getUserBalance(userId)
    const result = await createOrder(testOrderData)
    const testOrderId = result.order?.id || result.order?.Id
    
    if (!testOrderId) {
      return { name: testName, status: 'FAIL', message: 'Тестовый заказ не создан' }
    }
    
    await sleep(5000)
    
    const balanceAfter = await getUserBalance(userId)
    const pointsEarned = balanceAfter - balanceBefore
    const expectedPoints = Math.floor(2000 * 0.05) // 100 баллов (5% от 2000)
    
    console.log(`   Начислено баллов: ${pointsEarned} (ожидалось ${expectedPoints} для Silver)`)
    
    // Очистка (удаляем все заказы)
    const userOrders = await getUserOrders(userId)
    for (const order of userOrders) {
      await deleteOrder(order.Id || order.id, userId).catch(() => {})
    }
    
    if (pointsEarned === expectedPoints && currentTotalSpent >= 20000) {
      return { name: testName, status: 'PASS', message: `Silver уровень работает: ${pointsEarned} баллов (5%)` }
    } else {
      return { name: testName, status: 'FAIL', message: `Начислено ${pointsEarned} вместо ${expectedPoints}, total_spent: ${currentTotalSpent}` }
    }
  } catch (error: any) {
    return { name: testName, status: 'FAIL', message: `Ошибка: ${error.message}` }
  }
}

async function test7_GoldLevel(): Promise<TestResult> {
  const testName = 'Тест 7: Gold уровень (7% кэшбек)'
  console.log(`\n🧪 ${testName}`)
  
  try {
    const userId = await createUserViaAPI({
      phone: `+7999${Date.now() % 10000000}`,
      name: 'Тестовый Пользователь 7',
      street: 'Тестовая улица',
      building: '7',
      district: 'Центральный',
    })
    
    // Накапливаем total_spent до 50000 для Gold уровня
    // Создаем заказы по 2000, нужно 25 заказов = 50000
    const ordersToCreate = 25
    
    for (let i = 0; i < ordersToCreate; i++) {
      const orderData = {
        userId,
        startDate: getUniqueDate(30 + i),
        deliveryTime: '18:00-21:00',
        paymentMethod: 'card',
        paid: true,
        paymentStatus: 'paid',
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
      
      const result = await createOrder(orderData)
      if (result.order?.id || result.order?.Id) {
        await sleep(1000) // Задержка между заказами
      }
    }
    
    await sleep(10000) // Ждем обработки всех заказов
    
    const currentTotalSpent = await getUserTotalSpent(userId)
    
    // Создаем тестовый заказ для проверки Gold уровня
    const testOrderData = {
      userId,
      startDate: getUniqueDate(60),
      deliveryTime: '18:00-21:00',
      paymentMethod: 'card',
      paid: true,
      paymentStatus: 'paid',
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
    
    const balanceBefore = await getUserBalance(userId)
    const result = await createOrder(testOrderData)
    const testOrderId = result.order?.id || result.order?.Id
    
    if (!testOrderId) {
      return { name: testName, status: 'FAIL', message: 'Тестовый заказ не создан' }
    }
    
    await sleep(5000)
    
    const balanceAfter = await getUserBalance(userId)
    const pointsEarned = balanceAfter - balanceBefore
    const expectedPoints = Math.floor(2000 * 0.07) // 140 баллов (7% от 2000)
    
    console.log(`   Начислено баллов: ${pointsEarned} (ожидалось ${expectedPoints} для Gold)`)
    console.log(`   total_spent: ${currentTotalSpent}`)
    
    // Очистка
    const userOrders = await getUserOrders(userId)
    for (const order of userOrders) {
      await deleteOrder(order.Id || order.id, userId).catch(() => {})
    }
    
    if (pointsEarned === expectedPoints && currentTotalSpent >= 50000) {
      return { name: testName, status: 'PASS', message: `Gold уровень работает: ${pointsEarned} баллов (7%)` }
    } else {
      return { name: testName, status: 'FAIL', message: `Начислено ${pointsEarned} вместо ${expectedPoints}, total_spent: ${currentTotalSpent}` }
    }
  } catch (error: any) {
    return { name: testName, status: 'FAIL', message: `Ошибка: ${error.message}` }
  }
}

async function test8_PromoAndPointsCombined(): Promise<TestResult> {
  const testName = 'Тест 8: Промокод + использование баллов одновременно'
  console.log(`\n🧪 ${testName}`)
  
  try {
    const userId = await createUserViaAPI({
      phone: `+7999${Date.now() % 10000000}`,
      name: 'Тестовый Пользователь 8',
      street: 'Тестовая улица',
      building: '8',
      district: 'Центральный',
    })
    
    // Сначала начисляем баллы
    const order1Data = {
      userId,
      startDate: getUniqueDate(100),
      deliveryTime: '18:00-21:00',
      paymentMethod: 'card',
      paid: true,
      paymentStatus: 'paid',
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
    
    const result1 = await createOrder(order1Data)
    const order1Id = result1.order?.id || result1.order?.Id
    await sleep(5000)
    
    const balanceAfterEarn = await getUserBalance(userId)
    const pointsToUse = 50
    
    if (balanceAfterEarn < pointsToUse) {
      await deleteOrder(order1Id, userId)
      return { name: testName, status: 'FAIL', message: `Недостаточно баллов: ${balanceAfterEarn}` }
    }
    
    // Создаем промокод
    const promoCode = `TEST-${Date.now()}`
    const promoResponse = await fetch(`${API_BASE}/api/db/Promo_Codes/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{
        Code: promoCode,
        'Discount Type': 'fixed',
        'Discount Value': 200,
        'Usage Type': 'unlimited',
        Active: true,
        'Times Used': 0,
      }]),
    })
    
    const promoData = await promoResponse.json() as any
    const promo = Array.isArray(promoData) ? promoData[0] : promoData.list?.[0]
    
    if (!promo || !promo.Id) {
      await deleteOrder(order1Id, userId)
      return { name: testName, status: 'FAIL', message: 'Промокод не создан' }
    }
    
    // Создаем заказ с промокодом И использованием баллов
    // subtotal: 2000, промокод: -200, баллы: -50, итого: 1750
    const order2Data = {
      userId,
      startDate: getUniqueDate(101),
      deliveryTime: '18:00-21:00',
      paymentMethod: 'card',
      paid: true,
      paymentStatus: 'paid',
      promoCode: promoCode,
      promoDiscount: 200,
      persons: [{
        id: 1,
        day1: { breakfast: { dish: { id: 1492, name: 'Каша', price: 2000, portion: 1 } } },
        day2: {},
      }],
      extras: [],
      total: 1750, // 2000 - 200 (промокод) - 50 (баллы)
      subtotal: 2000,
      loyaltyPointsUsed: pointsToUse,
    }
    
    const result2 = await createOrder(order2Data)
    const order2Id = result2.order?.id || result2.order?.Id
    
    if (!order2Id) {
      await deleteOrder(order1Id, userId)
      await fetch(`${API_BASE}/api/admin/promo/${promo.Id}`, { method: 'DELETE' }).catch(() => {})
      return { name: testName, status: 'FAIL', message: 'Заказ не создан' }
    }
    
    await sleep(5000)
    
    const balanceAfter = await getUserBalance(userId)
    // Баллы начисляются на orderTotal БЕЗ учета использованных баллов
    // orderTotal для начисления = subtotal + deliveryFee - promoDiscount = 2000 - 200 = 1800
    // Использованные баллы (50) НЕ влияют на расчет начисления
    const orderTotalForPoints = 2000 - 200 // 1800 (промокод учитывается, баллы - нет)
    const expectedBalance = balanceAfterEarn - pointsToUse + Math.floor(orderTotalForPoints * 0.03) // 60 - 50 + 54 = 64
    
    console.log(`   Баланс после комбинации: ${balanceAfter}`)
    console.log(`   Ожидаемый баланс: ${expectedBalance}`)
    console.log(`   Списано: ${pointsToUse}, начислено: ${Math.floor(1750 * 0.03)}`)
    
    // Очистка
    await deleteOrder(order1Id, userId)
    await deleteOrder(order2Id, userId)
    await fetch(`${API_BASE}/api/admin/promo/${promo.Id}`, { method: 'DELETE' }).catch(() => {})
    
    // Проверяем, что баллы списались и начислились
    if (Math.abs(balanceAfter - expectedBalance) <= 1) { // Допускаем погрешность в 1 балл
      return { name: testName, status: 'PASS', message: `Комбинация работает: баланс ${balanceAfter}` }
    } else {
      return { name: testName, status: 'FAIL', message: `Баланс ${balanceAfter} вместо ${expectedBalance}` }
    }
  } catch (error: any) {
    return { name: testName, status: 'FAIL', message: `Ошибка: ${error.message}` }
  }
}

async function test9_BalanceValidation(): Promise<TestResult> {
  const testName = 'Тест 9: Валидация баланса (недостаточно баллов)'
  console.log(`\n🧪 ${testName}`)
  
  try {
    const userId = await createUserViaAPI({
      phone: `+7999${Date.now() % 10000000}`,
      name: 'Тестовый Пользователь 9',
      street: 'Тестовая улица',
      building: '9',
      district: 'Центральный',
    })
    
    const balance = await getUserBalance(userId)
    const pointsToUse = balance + 100 // Пытаемся использовать больше, чем есть
    
    console.log(`   Текущий баланс: ${balance}, пытаемся использовать: ${pointsToUse}`)
    
    // Пытаемся создать заказ с недостаточным количеством баллов
    const orderData = {
      userId,
      startDate: getUniqueDate(200),
      deliveryTime: '18:00-21:00',
      paymentMethod: 'card',
      paid: true,
      paymentStatus: 'paid',
      persons: [{
        id: 1,
        day1: { breakfast: { dish: { id: 1492, name: 'Каша', price: 2000, portion: 1 } } },
        day2: {},
      }],
      extras: [],
      total: 2000 - pointsToUse,
      subtotal: 2000,
      loyaltyPointsUsed: pointsToUse,
    }
    
    const response = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: orderData, userId }),
    })
    
    const result = await response.json()
    
    if (!response.ok && result.error === 'Insufficient loyalty points') {
      return { name: testName, status: 'PASS', message: `Валидация работает: запрос отклонен с ошибкой "Insufficient loyalty points"` }
    } else {
      return { name: testName, status: 'FAIL', message: `Валидация не сработала: ${response.status}, ${JSON.stringify(result)}` }
    }
  } catch (error: any) {
    return { name: testName, status: 'FAIL', message: `Ошибка: ${error.message}` }
  }
}

async function test10_CronJobProcessing(): Promise<TestResult> {
  const testName = 'Тест 10: Cron job обработка pending транзакций'
  console.log(`\n🧪 ${testName}`)
  
  try {
    const userId = await createUserViaAPI({
      phone: `+7999${Date.now() % 10000000}`,
      name: 'Тестовый Пользователь 10',
      street: 'Тестовая улица',
      building: '10',
      district: 'Центральный',
    })
    
    const initialBalance = await getUserBalance(userId)
    
    // Создаем заказ на наличные с датой доставки вчера (cron обрабатывает заказы до вчера включительно)
    // Важно: cron проверяет deliveryDate <= yesterday, поэтому используем вчерашнюю дату
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    
    const orderData = {
      userId,
      startDate: yesterdayStr,
      deliveryTime: '18:00-21:00',
      paymentMethod: 'cash',
      paid: false,
      paymentStatus: 'pending',
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
    
    const result = await createOrder(orderData)
    const orderId = result.order?.id || result.order?.Id
    
    if (!orderId) {
      return { name: testName, status: 'FAIL', message: 'Заказ не создан' }
    }
    
    await sleep(3000)
    
    // Проверяем наличие pending транзакции
    const transactionsUrl = `${baseUrl}/api/v2/tables/${TABLE_TRANSACTIONS}/records?where=(User ID,eq,${userId})~and(Order ID,eq,${orderId})~and(Transaction Status,eq,pending)`
    const transactionsResponse = await fetch(transactionsUrl, {
      headers: {
        'xc-token': NOCODB_TOKEN,
        'Content-Type': 'application/json',
      },
    })
    
    const transactionsData = await transactionsResponse.json() as any
    const pendingTransactions = transactionsData.list || []
    
    if (pendingTransactions.length === 0) {
      // Пытаемся удалить заказ через API (может не получиться из-за даты)
      try {
        await deleteOrder(orderId, userId)
      } catch (e) {
        // Игнорируем ошибку удаления
      }
      return { name: testName, status: 'FAIL', message: 'Pending транзакция не создана' }
    }
    
    // Запускаем cron job вручную
    const cronResponse = await fetch(`${API_BASE}/api/cron/process-pending-points`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    
    if (!cronResponse.ok) {
      const errorText = await cronResponse.text()
      try {
        await deleteOrder(orderId, userId)
      } catch (e) {
        // Игнорируем ошибку удаления
      }
      return { name: testName, status: 'FAIL', message: `Cron job не выполнился: ${cronResponse.status} ${errorText}` }
    }
    
    const cronResult = await cronResponse.json()
    console.log(`   Cron job результат:`, cronResult)
    
    await sleep(5000)
    
    const balanceAfterCron = await getUserBalance(userId)
    const expectedBalance = initialBalance + Math.floor(2000 * 0.03) // 60 баллов
    
    // Очистка (пытаемся удалить, но может не получиться из-за даты)
    try {
      await deleteOrder(orderId, userId)
    } catch (e) {
      console.log(`   ⚠️ Не удалось удалить заказ ${orderId} (ожидаемо для старых заказов)`)
    }
    
    if (balanceAfterCron === expectedBalance) {
      return { name: testName, status: 'PASS', message: `Cron job обработал pending транзакцию: баланс ${balanceAfterCron}` }
    } else {
      return { name: testName, status: 'FAIL', message: `Баланс ${balanceAfterCron} вместо ${expectedBalance}. Cron обработал: ${JSON.stringify(cronResult)}` }
    }
  } catch (error: any) {
    return { name: testName, status: 'FAIL', message: `Ошибка: ${error.message}` }
  }
}

async function getUserOrders(userId: number): Promise<any[]> {
  const url = `${baseUrl}/api/v2/tables/${TABLE_ORDERS}/records?where=(User ID,eq,${userId})&limit=1000`
  const response = await fetch(url, {
    headers: {
      'xc-token': NOCODB_TOKEN,
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) throw new Error(`Failed to get orders: ${response.status}`)
  const data = await response.json() as any
  return data.list || []
}

// ==================== ГЛАВНАЯ ФУНКЦИЯ ====================

async function runAllTests() {
  console.log('🚀 ЗАПУСК ЧИСТЫХ ТЕСТОВ СИСТЕМЫ ЛОЯЛЬНОСТИ\n')
  console.log('=' .repeat(60))
  console.log(`🌐 API: ${API_BASE}`)
  console.log(`📊 Режим: ${process.env.NODE_ENV || 'development'}\n`)
  
  // Проверяем доступность API
  try {
    const healthCheck = await fetch(`${API_BASE}/api/health`, {
      signal: AbortSignal.timeout(5000),
    })
    if (!healthCheck.ok) {
      console.error(`❌ API недоступен: ${healthCheck.status}`)
      process.exit(1)
    }
  } catch (error) {
    console.error(`❌ API недоступен:`, error)
    process.exit(1)
  }
  
  // Запускаем тесты
  testResults.push(await test1_BasicPointsAward())
  testResults.push(await test2_PointsWithPromoCode())
  testResults.push(await test3_PointsUsage())
  testResults.push(await test4_CashPaymentPending())
  testResults.push(await test5_OrderCancellation())
  testResults.push(await test6_SilverLevel())
  testResults.push(await test7_GoldLevel())
  testResults.push(await test8_PromoAndPointsCombined())
  testResults.push(await test9_BalanceValidation())
  testResults.push(await test10_CronJobProcessing())
  
  // Выводим результаты
  console.log('\n' + '='.repeat(60))
  console.log('📊 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ\n')
  
  let passed = 0
  let failed = 0
  
  testResults.forEach((result, index) => {
    const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⏭️'
    console.log(`${icon} ${index + 1}. ${result.name}`)
    console.log(`   ${result.message}`)
    if (result.details) {
      console.log(`   Детали:`, result.details)
    }
    console.log()
    
    if (result.status === 'PASS') passed++
    if (result.status === 'FAIL') failed++
  })
  
  console.log('='.repeat(60))
  console.log(`\n📈 ИТОГО: ${passed} прошло, ${failed} провалено, ${testResults.length - passed - failed} пропущено\n`)
  
  if (failed === 0) {
    console.log('✅ ВСЕ ТЕСТЫ ПРОШЛИ УСПЕШНО!')
    process.exit(0)
  } else {
    console.log('❌ ЕСТЬ ПРОВАЛЕННЫЕ ТЕСТЫ')
    process.exit(1)
  }
}

// Запуск
runAllTests().catch(error => {
  console.error('❌ Критическая ошибка:', error)
  process.exit(1)
})
