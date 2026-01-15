/**
 * Тест промокодов через API: проверка сохранения и отображения
 * 
 * Этот скрипт использует внутренний API приложения для тестирования:
 * 1. Создает тестовый промокод через API
 * 2. Создает тестовый заказ с промокодом через API
 * 3. Проверяет, что промокод правильно сохранился
 * 4. Проверяет, что промокод правильно маппится при загрузке
 * 5. Проверяет статистику промокодов
 */

import { config } from 'dotenv'
import path from 'path'

// Загружаем переменные окружения
config({ path: path.join(process.cwd(), '.env.local') })
config({ path: path.join(process.cwd(), '.env.production') })

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

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
  if (data && !success) {
    console.log('   Данные:', JSON.stringify(data, null, 2))
  }
}

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, {
    ...options,
    headers: {
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
  console.log('\n📝 Шаг 1: Создание тестового промокода через API...')
  
  try {
    const testCode = `TEST-${Date.now()}`
    const promoData = {
      code: testCode,
      discount_type: 'percentage',
      discount_value: 10,
      min_order_amount: 1000,
      max_discount: 500,
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      usage_limit: 100,
      times_used: 0,
      active: true,
    }
    
    const result = await apiFetch('/api/db/Promo_Codes/records', {
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
  console.log('\n📦 Шаг 2: Создание тестового заказа с промокодом через API...')
  
  try {
    // Создаем тестовый заказ через API /api/orders
    const orderData = {
      order: {
        startDate: new Date().toISOString().split('T')[0],
        deliveryTime: '17:30-22:00',
        paymentMethod: 'cash',
        paid: false,
        paymentStatus: 'pending',
        orderStatus: 'pending',
        promoCode: promoCode,
        promoDiscount: 100, // Тестовая скидка 100₽
        loyaltyPointsUsed: 0,
        loyaltyPointsEarned: 0,
        subtotal: 2000,
        total: 1900, // 2000 - 100 (скидка)
        deliveryFee: 0,
        deliveryDistrict: 'Тестовый район',
        deliveryAddress: 'Тестовый адрес',
        persons: [
          {
            id: 1,
            day1: {
              breakfast: {
                dish: {
                  id: 1455,
                  name: 'Тестовое блюдо',
                  price: 200,
                  portion: 'single',
                }
              }
            },
            day2: {
              breakfast: {
                dish: {
                  id: 1455,
                  name: 'Тестовое блюдо',
                  price: 200,
                  portion: 'single',
                }
              }
            }
          }
        ],
        extras: [],
      },
      userId: userId,
    }
    
    const result = await apiFetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
    
    if (result && result.order) {
      const createdOrder = result.order
      logResult('Создание заказа с промокодом', true, `Заказ создан`, {
        id: createdOrder.Id || createdOrder.id,
        orderNumber: createdOrder.order_number || createdOrder['Order Number'],
        promoCode: createdOrder.promo_code || createdOrder['Promo Code'],
        promoDiscount: createdOrder.promo_discount || createdOrder['Promo Discount'],
      })
      return createdOrder.Id || createdOrder.id
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
    const result = await apiFetch(`/api/db/Orders/records/${orderId}`)
    
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
      logResult('Загрузка и маппинг заказа', false, 'Промокод не найден в загруженном заказе', {
        hasPromoCode: !!promoCode,
        hasPromoDiscount: !!promoDiscount,
        allFields: Object.keys(result),
      })
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
    // Загружаем все заказы через API
    const ordersResult = await apiFetch('/api/db/Orders/records?limit=1000')
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
    // Обновляем заказ с новым промокодом через API
    const updateData = {
      order: {
        promoCode: newPromoCode,
        promoDiscount: 200, // Новая скидка 200₽
        total: 1800, // 2000 - 200
      },
    }
    
    const result = await apiFetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    })
    
    if (result && result.order) {
      const updatedOrder = result.order
      const updatedPromoCode = updatedOrder.promo_code || updatedOrder['Promo Code']
      const updatedPromoDiscount = updatedOrder.promo_discount || updatedOrder['Promo Discount']
      
      if (updatedPromoCode === newPromoCode && updatedPromoDiscount === 200) {
        logResult('Обновление заказа с промокодом', true, 'Заказ обновлен', {
          promoCode: updatedPromoCode,
          promoDiscount: updatedPromoDiscount,
          total: updatedOrder.total || updatedOrder.Total,
        })
        return true
      } else {
        logResult('Обновление заказа с промокодом', false, 'Промокод не обновился правильно', {
          expected: { promoCode: newPromoCode, promoDiscount: 200 },
          actual: { promoCode: updatedPromoCode, promoDiscount: updatedPromoDiscount },
        })
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
      const promos = await apiFetch('/api/db/Promo_Codes/records?limit=1000')
      const promo = promos.list?.find((p: any) => p.Code === testPromoCode || p.code === testPromoCode)
      if (promo) {
        const promoId = promo.Id || promo.id
        await apiFetch(`/api/db/Promo_Codes/records/${promoId}`, {
          method: 'DELETE',
        })
        console.log(`✅ Тестовый промокод ${testPromoCode} удален`)
      }
    }
    
    // Удаляем тестовый заказ
    if (orderId) {
      await apiFetch(`/api/db/Orders/records/${orderId}`, {
        method: 'DELETE',
      })
      console.log(`✅ Тестовый заказ ${orderId} удален`)
    }
  } catch (error: any) {
    console.log(`⚠️ Ошибка при очистке: ${error.message}`)
  }
}

async function runTests() {
  console.log('🚀 Запуск тестов промокодов через API...\n')
  console.log(`📡 API URL: ${API_BASE_URL}\n`)
  
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
