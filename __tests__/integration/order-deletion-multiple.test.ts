/**
 * Интеграционный тест для проверки удаления заказов
 * Проверяет что удаление одного заказа не удаляет другие заказы
 */

import fetch from 'node-fetch'
import * as fs from 'fs'
import * as path from 'path'

// Загружаем переменные окружения из .env.local
const envPath = path.join(__dirname, '../../.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim().replace(/^["']|["']$/g, '')
      process.env[key] = value
    }
  })
}

const API_BASE = 'http://localhost:3000'
const TEST_USER_ID = 5
const NOCODB_URL = process.env.NOCODB_URL || ''
const NOCODB_TOKEN = process.env.NOCODB_TOKEN || ''

// Функция очистки всех заказов пользователя
async function cleanupUserOrders(userId: number): Promise<void> {
  const ordersResponse = await fetch(
    `${NOCODB_URL}/api/v2/tables/m96i4ai2yelbboh/records?where=(User ID,eq,${userId})&limit=1000`,
    {
      headers: {
        'xc-token': NOCODB_TOKEN,
      },
    }
  )
  const ordersData = await ordersResponse.json() as any
  const orders = ordersData.list || []
  
  console.log(`🗑️  Очистка: удаление ${orders.length} заказов пользователя ${userId}`)
  for (const order of orders) {
    await fetch(`${NOCODB_URL}/api/v2/tables/m96i4ai2yelbboh/records/${order.Id}`, {
      method: 'DELETE',
      headers: {
        'xc-token': NOCODB_TOKEN,
      },
    })
  }
}

describe('Order Deletion - Multiple Orders Test', () => {
  let createdOrderIds: number[] = []

  beforeAll(async () => {
    console.log('🧹 Очистка заказов перед тестом...')
    await cleanupUserOrders(TEST_USER_ID)
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }, 60000)

  afterAll(async () => {
    console.log('🧹 Финальная очистка заказов...')
    await cleanupUserOrders(TEST_USER_ID)
  }, 60000)

  test('Удаление одного заказа НЕ должно удалять другие заказы', async () => {
    // 1. Создаем 3 заказа на разные даты
    console.log('\n📝 Шаг 1: Создаем 3 заказа...')
    
    const order1Response = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order: {
          startDate: '2026-02-10T00:00:00.000Z',
          deliveryTime: '18:00-21:00',
          paymentMethod: 'card',
          paid: true,
          persons: [{
            id: 1,
            day1: {
              breakfast: { dish: { id: 1492, name: 'Каша', price: 500, portion: 1 } },
              lunch: {},
              dinner: {}
            },
            day2: { breakfast: {}, lunch: {}, dinner: {} }
          }],
          extras: [],
          total: 500,
          subtotal: 500,
          loyaltyPointsUsed: 0
        },
        userId: TEST_USER_ID
      })
    })
    const order1Data = await order1Response.json()
    const order1Id = order1Data.order.id
    createdOrderIds.push(order1Id)
    console.log(`   ✅ Заказ 1 создан: ID=${order1Id}`)

    await new Promise((resolve) => setTimeout(resolve, 500))

    const order2Response = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order: {
          startDate: '2026-02-11T00:00:00.000Z',
          deliveryTime: '18:00-21:00',
          paymentMethod: 'card',
          paid: true,
          persons: [{
            id: 1,
            day1: {
              breakfast: { dish: { id: 1492, name: 'Каша', price: 600, portion: 1 } },
              lunch: {},
              dinner: {}
            },
            day2: { breakfast: {}, lunch: {}, dinner: {} }
          }],
          extras: [],
          total: 600,
          subtotal: 600,
          loyaltyPointsUsed: 0
        },
        userId: TEST_USER_ID
      })
    })
    const order2Data = await order2Response.json()
    const order2Id = order2Data.order.id
    createdOrderIds.push(order2Id)
    console.log(`   ✅ Заказ 2 создан: ID=${order2Id}`)

    await new Promise((resolve) => setTimeout(resolve, 500))

    const order3Response = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order: {
          startDate: '2026-02-12T00:00:00.000Z',
          deliveryTime: '18:00-21:00',
          paymentMethod: 'card',
          paid: true,
          persons: [{
            id: 1,
            day1: {
              breakfast: { dish: { id: 1492, name: 'Каша', price: 700, portion: 1 } },
              lunch: {},
              dinner: {}
            },
            day2: { breakfast: {}, lunch: {}, dinner: {} }
          }],
          extras: [],
          total: 700,
          subtotal: 700,
          loyaltyPointsUsed: 0
        },
        userId: TEST_USER_ID
      })
    })
    const order3Data = await order3Response.json()
    const order3Id = order3Data.order.id
    createdOrderIds.push(order3Id)
    console.log(`   ✅ Заказ 3 создан: ID=${order3Id}`)

    // Проверяем что все ID уникальные
    expect(order1Id).not.toBe(order2Id)
    expect(order2Id).not.toBe(order3Id)
    expect(order1Id).not.toBe(order3Id)
    console.log(`   ✅ Все ID уникальные: ${order1Id}, ${order2Id}, ${order3Id}`)

    // 2. Проверяем что все 3 заказа есть в системе
    console.log('\n📊 Шаг 2: Проверяем что все заказы видны через API...')
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    const beforeDeleteResponse = await fetch(`${API_BASE}/api/orders?userId=${TEST_USER_ID}`)
    const beforeDeleteData = await beforeDeleteResponse.json()
    const ordersBefore = beforeDeleteData.orders || []
    
    console.log(`   Заказов ДО удаления: ${ordersBefore.length}`)
    ordersBefore.forEach((o: any) => {
      console.log(`      - ID=${o.id}, Status=${o.orderStatus}, Date=${o.startDate}`)
    })
    
    expect(ordersBefore.length).toBeGreaterThanOrEqual(3)
    
    // Проверяем что все наши заказы присутствуют
    const foundOrder1 = ordersBefore.find((o: any) => o.id === order1Id)
    const foundOrder2 = ordersBefore.find((o: any) => o.id === order2Id)
    const foundOrder3 = ordersBefore.find((o: any) => o.id === order3Id)
    
    expect(foundOrder1).toBeDefined()
    expect(foundOrder2).toBeDefined()
    expect(foundOrder3).toBeDefined()
    console.log(`   ✅ Все 3 заказа найдены в API`)

    // 3. Удаляем ТОЛЬКО средний заказ (order2)
    console.log(`\n🗑️  Шаг 3: Удаляем ТОЛЬКО заказ 2 (ID=${order2Id})...`)
    
    const deleteResponse = await fetch(`${API_BASE}/api/orders/${order2Id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: TEST_USER_ID })
    })
    
    expect(deleteResponse.ok).toBe(true)
    console.log(`   ✅ DELETE запрос успешен`)

    // 4. Ждем и проверяем результат
    console.log('\n⏱️  Шаг 4: Ждем 2 секунды для синхронизации...')
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const afterDeleteResponse = await fetch(`${API_BASE}/api/orders?userId=${TEST_USER_ID}`)
    const afterDeleteData = await afterDeleteResponse.json()
    const ordersAfter = afterDeleteData.orders || []
    
    console.log(`   Заказов ПОСЛЕ удаления: ${ordersAfter.length}`)
    ordersAfter.forEach((o: any) => {
      console.log(`      - ID=${o.id}, Status=${o.orderStatus}, Date=${o.startDate}`)
    })

    // 5. Проверяем что остались только 2 заказа (order1 и order3)
    const foundOrder1After = ordersAfter.find((o: any) => o.id === order1Id)
    const foundOrder2After = ordersAfter.find((o: any) => o.id === order2Id)
    const foundOrder3After = ordersAfter.find((o: any) => o.id === order3Id)

    console.log('\n🔍 Шаг 5: Проверяем результат...')
    console.log(`   Заказ 1 (ID=${order1Id}): ${foundOrder1After ? '✅ НАЙДЕН' : '❌ НЕ НАЙДЕН'}`)
    console.log(`   Заказ 2 (ID=${order2Id}): ${foundOrder2After ? '❌ НАЙДЕН (должен быть удален!)' : '✅ НЕ НАЙДЕН'}`)
    console.log(`   Заказ 3 (ID=${order3Id}): ${foundOrder3After ? '✅ НАЙДЕН' : '❌ НЕ НАЙДЕН'}`)

    // ОСНОВНЫЕ ПРОВЕРКИ
    expect(foundOrder1After).toBeDefined() // Заказ 1 должен остаться
    expect(foundOrder2After).toBeUndefined() // Заказ 2 должен быть удален
    expect(foundOrder3After).toBeDefined() // Заказ 3 должен остаться

    console.log('\n✅ ТЕСТ ПРОЙДЕН: Удален только один заказ!')
  }, 120000)

  test('Проверка что все заказы имеют уникальные корректные ID', async () => {
    console.log('\n📝 Создаем 2 заказа для проверки ID...')
    
    // Создаем 2 заказа
    const responses = await Promise.all([
      fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: {
            startDate: '2026-02-15T00:00:00.000Z',
            deliveryTime: '18:00-21:00',
            paymentMethod: 'cash',
            paid: false,
            persons: [{ id: 1, day1: { breakfast: { dish: { id: 1492, name: 'Каша', price: 300, portion: 1 } }, lunch: {}, dinner: {} }, day2: { breakfast: {}, lunch: {}, dinner: {} } }],
            extras: [],
            total: 300,
            subtotal: 300,
            loyaltyPointsUsed: 0
          },
          userId: TEST_USER_ID
        })
      }),
      fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: {
            startDate: '2026-02-16T00:00:00.000Z',
            deliveryTime: '18:00-21:00',
            paymentMethod: 'cash',
            paid: false,
            persons: [{ id: 1, day1: { breakfast: { dish: { id: 1492, name: 'Каша', price: 400, portion: 1 } }, lunch: {}, dinner: {} }, day2: { breakfast: {}, lunch: {}, dinner: {} } }],
            extras: [],
            total: 400,
            subtotal: 400,
            loyaltyPointsUsed: 0
          },
          userId: TEST_USER_ID
        })
      })
    ])

    const [data1, data2] = await Promise.all(responses.map(r => r.json()))
    createdOrderIds.push(data1.order.id, data2.order.id)

    // Получаем заказы через API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const response = await fetch(`${API_BASE}/api/orders?userId=${TEST_USER_ID}`)
    const data = await response.json()
    const orders = data.orders || []

    console.log('\n🔍 Проверка ID заказов:')
    
    // Проверяем что все заказы имеют ID
    orders.forEach((order: any, index: number) => {
      console.log(`   Заказ ${index + 1}: id=${order.id}, type=${typeof order.id}`)
      expect(order.id).toBeDefined()
      expect(typeof order.id).toBe('number')
      expect(order.id).toBeGreaterThan(0)
    })

    // Проверяем что все ID уникальные
    const ids = orders.map((o: any) => o.id)
    const uniqueIds = new Set(ids)
    console.log(`   Всего ID: ${ids.length}, уникальных: ${uniqueIds.size}`)
    expect(uniqueIds.size).toBe(ids.length)

    console.log('✅ Все ID корректные и уникальные')
  }, 60000)
})

