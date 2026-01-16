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
    const pointsUsed = balanceAfterEarn - balanceAfterUse
    
    console.log(`   Баланс после использования: ${balanceAfterUse}`)
    console.log(`   Использовано баллов: ${pointsUsed}`)
    
    // Очистка
    await deleteOrder(order1Id, userId)
    await deleteOrder(order2Id, userId)
    
    if (pointsUsed === pointsToUse) {
      return { name: testName, status: 'PASS', message: `Баллы использованы правильно: ${pointsUsed}` }
    } else {
      return { name: testName, status: 'FAIL', message: `Баллы использованы неправильно: использовано ${pointsUsed}, ожидалось ${pointsToUse}` }
    }
  } catch (error: any) {
    return { name: testName, status: 'FAIL', message: `Ошибка: ${error.message}` }
  }
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
