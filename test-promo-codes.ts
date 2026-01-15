/**
 * Тест промокодов: проверка сохранения и отображения
 * 
 * Этот скрипт:
 * 1. Создает тестовый промокод
 * 2. Создает тестовый заказ с промокодом
 * 3. Проверяет, что промокод правильно сохранился в базе
 * 4. Проверяет, что промокод правильно маппится при загрузке
 * 5. Проверяет статистику промокодов
 */

import { config } from 'dotenv'
import path from 'path'

// Загружаем переменные окружения
config({ path: path.join(process.cwd(), '.env.local') })
config({ path: path.join(process.cwd(), '.env.production') })

const NOCODB_URL = process.env.NOCODB_URL || 'http://localhost:8080'
const NOCODB_TOKEN = process.env.NOCODB_TOKEN || ''
const NOCODB_TABLE_ORDERS = process.env.NOCODB_TABLE_ORDERS || ''
const NOCODB_TABLE_PROMO_CODES = process.env.NOCODB_TABLE_PROMO_CODES || ''

console.log('🔍 Проверка переменных окружения:')
console.log(`  NOCODB_URL: ${NOCODB_URL ? '✅' : '❌'}`)
console.log(`  NOCODB_TOKEN: ${NOCODB_TOKEN ? '✅ (' + NOCODB_TOKEN.substring(0, 10) + '...)' : '❌'}`)
console.log(`  NOCODB_TABLE_ORDERS: ${NOCODB_TABLE_ORDERS ? '✅' : '❌'}`)
console.log(`  NOCODB_TABLE_PROMO_CODES: ${NOCODB_TABLE_PROMO_CODES ? '✅' : '❌'}`)

if (!NOCODB_URL || !NOCODB_TOKEN || !NOCODB_TABLE_ORDERS || !NOCODB_TABLE_PROMO_CODES) {
  console.error('\n❌ Ошибка: Не все переменные окружения установлены')
  console.error('Требуются: NOCODB_URL, NOCODB_TOKEN, NOCODB_TABLE_ORDERS, NOCODB_TABLE_PROMO_CODES')
  console.error('\n💡 Подсказка: Проверьте файлы .env.local или .env.production')
  process.exit(1)
}

interface TestResult {
  step: string
  success: boolean
  message: string
  data?: any
}

const results: TestResult[] = []

function logResult(step: string, success: boolean, message: string, data?: any) {
  results.push({ step, success, message, data })
  const icon = success ? '✅' : '❌'
  console.log(`${icon} ${step}: ${message}`)
  if (data) {
    console.log('   Данные:', JSON.stringify(data, null, 2))
  }
}

async function nocoFetch(tableId: string, options: RequestInit = {}) {
  let baseUrl = NOCODB_URL.replace(/\/$/, "")
  if (!baseUrl.endsWith("/api/v2")) {
    baseUrl = `${baseUrl}/api/v2`
  }
  
  const url = `${baseUrl}/tables/${tableId}/records`
  const response = await fetch(url, {
    ...options,
    headers: {
      'xc-token': NOCODB_TOKEN,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HTTP ${response.status}: ${errorText}`)
  }
  
  return response.json()
}

async function nocoFetchRecord(tableId: string, recordId: number, options: RequestInit = {}) {
  let baseUrl = NOCODB_URL.replace(/\/$/, "")
  if (!baseUrl.endsWith("/api/v2")) {
    baseUrl = `${baseUrl}/api/v2`
  }
  
  const url = `${baseUrl}/tables/${tableId}/records/${recordId}`
  const response = await fetch(url, {
    ...options,
    headers: {
      'xc-token': NOCODB_TOKEN,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HTTP ${response.status}: ${errorText}`)
  }
  
  return response.json()
}

async function testPromoCodeCreation(): Promise<string | null> {
  console.log('\n📝 Шаг 1: Создание тестового промокода...')
  
  try {
    const testCode = `TEST-${Date.now()}`
    const promoData = {
      Code: testCode,
      'Discount Type': 'percentage',
      'Discount Value': 10,
      'Min Order Amount': 1000,
      'Max Discount': 500,
      'Valid From': new Date().toISOString().split('T')[0],
      'Valid Until': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      'Usage Limit': 100,
      'Times Used': 0,
      Active: true,
    }
    
    const result = await nocoFetch(NOCODB_TABLE_PROMO_CODES, {
      method: 'POST',
      body: JSON.stringify([promoData]),
    })
    
    if (result && result.length > 0) {
      const createdPromo = result[0]
      logResult('Создание промокода', true, `Промокод ${testCode} создан`, { id: createdPromo.Id, code: testCode })
      return testCode
    } else {
      logResult('Создание промокода', false, 'Промокод не был создан', result)
      return null
    }
  } catch (error: any) {
    logResult('Создание промокода', false, `Ошибка: ${error.message}`, error)
    return null
  }
}

async function testOrderCreationWithPromo(promoCode: string, userId: number = 122): Promise<number | null> {
  console.log('\n📦 Шаг 2: Создание тестового заказа с промокодом...')
  
  try {
    // Создаем тестовый заказ
    const orderData = {
      'User ID': userId,
      'Order Number': `TEST-${Date.now()}`,
      'Start Date': new Date().toISOString().split('T')[0],
      'Delivery Time': '17:30-22:00',
      'Payment Status': 'pending',
      'Payment Method': 'cash',
      Paid: false,
      'Order Status': 'pending',
      'Promo Code': promoCode,
      'Promo Discount': 100, // Тестовая скидка 100₽
      'Loyalty Points Used': 0,
      'Loyalty Points Earned': 0,
      Subtotal: 2000,
      Total: 1900, // 2000 - 100 (скидка)
      'Delivery Fee': 0,
      'Delivery District': 'Тестовый район',
      'Delivery Address': 'Тестовый адрес',
    }
    
    const result = await nocoFetch(NOCODB_TABLE_ORDERS, {
      method: 'POST',
      body: JSON.stringify([orderData]),
    })
    
    if (result && result.length > 0) {
      const createdOrder = result[0]
      logResult('Создание заказа с промокодом', true, `Заказ создан`, {
        id: createdOrder.Id,
        orderNumber: orderData['Order Number'],
        promoCode: createdOrder['Promo Code'],
        promoDiscount: createdOrder['Promo Discount'],
      })
      return createdOrder.Id
    } else {
      logResult('Создание заказа с промокодом', false, 'Заказ не был создан', result)
      return null
    }
  } catch (error: any) {
    logResult('Создание заказа с промокодом', false, `Ошибка: ${error.message}`, error)
    return null
  }
}

async function testOrderLoading(orderId: number): Promise<boolean> {
  console.log('\n🔍 Шаг 3: Проверка загрузки заказа и маппинга промокода...')
  
  try {
    const result = await nocoFetchRecord(NOCODB_TABLE_ORDERS, orderId)
    
    // Проверяем, что промокод правильно загрузился
    const promoCode = result['Promo Code'] || result.promo_code
    const promoDiscount = result['Promo Discount'] || result.promo_discount
    
    if (promoCode && promoDiscount) {
      // Имитируем маппинг как в lib/nocodb.ts
      const mappedPromoCode = result.promo_code || result['Promo Code']
      const mappedPromoDiscount = (() => {
        const discount = result.promo_discount || result['Promo Discount']
        if (discount === undefined || discount === null) return 0
        return typeof discount === 'number' ? discount : (Number(discount) || 0)
      })()
      
      if (mappedPromoCode === promoCode && mappedPromoDiscount > 0) {
        logResult('Загрузка и маппинг заказа', true, 'Промокод правильно загружен и замаплен', {
          original: { promoCode, promoDiscount },
          mapped: { promoCode: mappedPromoCode, promoDiscount: mappedPromoDiscount },
        })
        return true
      } else {
        logResult('Загрузка и маппинг заказа', false, 'Промокод не правильно замаплен', {
          original: { promoCode, promoDiscount },
          mapped: { promoCode: mappedPromoCode, promoDiscount: mappedPromoDiscount },
        })
        return false
      }
    } else {
      logResult('Загрузка и маппинг заказа', false, 'Промокод не найден в загруженном заказе', result)
      return false
    }
  } catch (error: any) {
    logResult('Загрузка и маппинг заказа', false, `Ошибка: ${error.message}`, error)
    return false
  }
}

async function testStatistics(): Promise<boolean> {
  console.log('\n📊 Шаг 4: Проверка статистики промокодов...')
  
  try {
    // Загружаем все заказы
    const ordersResult = await nocoFetch(`${NOCODB_TABLE_ORDERS}/records?limit=1000`)
    const orders = ordersResult.list || []
    
    // Подсчитываем статистику как в app/admin/stats/page.tsx
    let totalDiscountGiven = 0
    let ordersWithPromo = 0
    const promoUsageMap = new Map<string, number>()
    
    orders.forEach((o: any) => {
      const promoCode = o['Promo Code'] || o.promo_code
      const promoDiscount = parseFloat(o['Promo Discount'] || o.promo_discount || 0)
      
      if (promoCode && promoDiscount > 0) {
        ordersWithPromo++
        totalDiscountGiven += promoDiscount
        promoUsageMap.set(promoCode, (promoUsageMap.get(promoCode) || 0) + 1)
      }
    })
    
    logResult('Статистика промокодов', true, 'Статистика подсчитана', {
      totalDiscountGiven: Math.round(totalDiscountGiven),
      ordersWithPromo,
      uniquePromoCodes: promoUsageMap.size,
      mostUsedPromo: promoUsageMap.size > 0
        ? Array.from(promoUsageMap.entries())
            .sort((a, b) => b[1] - a[1])[0]
        : null,
    })
    
    return true
  } catch (error: any) {
    logResult('Статистика промокодов', false, `Ошибка: ${error.message}`, error)
    return false
  }
}

async function testOrderUpdate(orderId: number, newPromoCode: string): Promise<boolean> {
  console.log('\n🔄 Шаг 5: Проверка обновления заказа с промокодом...')
  
  try {
    // Обновляем заказ с новым промокодом
    const updateData = {
      Id: orderId,
      'Promo Code': newPromoCode,
      'Promo Discount': 200, // Новая скидка 200₽
      Total: 1800, // 2000 - 200
    }
    
    const result = await nocoFetch(NOCODB_TABLE_ORDERS, {
      method: 'PATCH',
      body: JSON.stringify([updateData]),
    })
    
    if (result && result.length > 0) {
      const updatedOrder = result[0]
      if (updatedOrder['Promo Code'] === newPromoCode && updatedOrder['Promo Discount'] === 200) {
        logResult('Обновление заказа с промокодом', true, 'Заказ обновлен', {
          promoCode: updatedOrder['Promo Code'],
          promoDiscount: updatedOrder['Promo Discount'],
          total: updatedOrder.Total,
        })
        return true
      } else {
        logResult('Обновление заказа с промокодом', false, 'Промокод не обновился правильно', updatedOrder)
        return false
      }
    } else {
      logResult('Обновление заказа с промокодом', false, 'Заказ не был обновлен', result)
      return false
    }
  } catch (error: any) {
    logResult('Обновление заказа с промокодом', false, `Ошибка: ${error.message}`, error)
    return false
  }
}

async function cleanup(testPromoCode: string, orderId: number | null) {
  console.log('\n🧹 Очистка тестовых данных...')
  
  try {
    // Удаляем тестовый промокод
    if (testPromoCode) {
      const promos = await nocoFetch(NOCODB_TABLE_PROMO_CODES, {
        method: 'GET',
      })
      const promo = promos.list?.find((p: any) => p.Code === testPromoCode || p.code === testPromoCode)
      if (promo) {
        const promoId = promo.Id || promo.id
        await nocoFetchRecord(NOCODB_TABLE_PROMO_CODES, promoId, {
          method: 'DELETE',
        })
        console.log(`✅ Тестовый промокод ${testPromoCode} удален`)
      }
    }
    
    // Удаляем тестовый заказ
    if (orderId) {
      await nocoFetchRecord(NOCODB_TABLE_ORDERS, orderId, {
        method: 'DELETE',
      })
      console.log(`✅ Тестовый заказ ${orderId} удален`)
    }
  } catch (error: any) {
    console.log(`⚠️ Ошибка при очистке: ${error.message}`)
  }
}

async function runTests() {
  console.log('🚀 Запуск тестов промокодов...\n')
  console.log(`📡 Подключение к NocoDB: ${NOCODB_URL}`)
  console.log(`📋 Таблица заказов: ${NOCODB_TABLE_ORDERS}`)
  console.log(`🎟️ Таблица промокодов: ${NOCODB_TABLE_PROMO_CODES}\n`)
  
  let testPromoCode: string | null = null
  let orderId: number | null = null
  
  try {
    // Шаг 1: Создание промокода
    testPromoCode = await testPromoCodeCreation()
    if (!testPromoCode) {
      console.log('\n❌ Тест провален: не удалось создать промокод')
      return
    }
    
    // Шаг 2: Создание заказа с промокодом
    orderId = await testOrderCreationWithPromo(testPromoCode)
    if (!orderId) {
      console.log('\n❌ Тест провален: не удалось создать заказ')
      await cleanup(testPromoCode, null)
      return
    }
    
    // Шаг 3: Проверка загрузки и маппинга
    const loadSuccess = await testOrderLoading(orderId)
    if (!loadSuccess) {
      console.log('\n⚠️ Предупреждение: проблемы с загрузкой/маппингом промокода')
    }
    
    // Шаг 4: Проверка статистики
    await testStatistics()
    
    // Шаг 5: Проверка обновления
    const updateSuccess = await testOrderUpdate(orderId, testPromoCode)
    if (!updateSuccess) {
      console.log('\n⚠️ Предупреждение: проблемы с обновлением промокода')
    }
    
    // Итоги
    console.log('\n' + '='.repeat(60))
    console.log('📊 ИТОГИ ТЕСТИРОВАНИЯ')
    console.log('='.repeat(60))
    
    const successCount = results.filter(r => r.success).length
    const totalCount = results.length
    
    results.forEach((result, index) => {
      const icon = result.success ? '✅' : '❌'
      console.log(`${index + 1}. ${icon} ${result.step}: ${result.message}`)
    })
    
    console.log('\n' + '='.repeat(60))
    console.log(`✅ Успешно: ${successCount}/${totalCount}`)
    console.log(`❌ Провалено: ${totalCount - successCount}/${totalCount}`)
    console.log('='.repeat(60))
    
    if (successCount === totalCount) {
      console.log('\n🎉 Все тесты пройдены успешно!')
    } else {
      console.log('\n⚠️ Некоторые тесты провалены. Проверьте результаты выше.')
    }
    
  } catch (error: any) {
    console.error('\n❌ Критическая ошибка:', error)
  } finally {
    // Очистка
    await cleanup(testPromoCode, orderId)
  }
}

// Запускаем тесты
runTests().catch(console.error)
