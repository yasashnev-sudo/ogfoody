/**
 * ИНТЕГРАЦИОННЫЙ ТЕСТ
 * Физически создает и удаляет заказы через API и NocoDB
 */

import fetch from 'node-fetch'

const API_BASE = 'http://localhost:3000'
const TEST_USER_ID = 5

describe('Orders Integration Tests (REAL API)', () => {
  let createdOrderIds: number[] = []

  // Очистка после тестов
  afterAll(async () => {
    console.log('🧹 Очистка созданных заказов...')
    for (const orderId of createdOrderIds) {
      try {
        await fetch(`${API_BASE}/api/orders/${orderId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: TEST_USER_ID }),
        })
      } catch (e) {
        // ignore
      }
    }
  })

  test('Должен создать заказ через API', async () => {
    const orderData = {
      userId: TEST_USER_ID,
      startDate: '2026-01-15T00:00:00.000Z',
      deliveryTime: '18:00-21:00',
      paymentMethod: 'cash',
      persons: [
        {
          name: 'Тестовый персона',
          day1: {
            breakfast: { dish: { id: 1492, name: 'Каша', price: 150, portion: 1 } },
            lunch: {
              salad: { id: 1249, name: 'Салат', price: 100, portion: 1 },
              soup: { id: 1371, name: 'Суп', price: 120, portion: 1 },
              main: { id: 1356, name: 'Основное', price: 200, portion: 1 },
            },
            dinner: {
              salad: { id: 1443, name: 'Салат вечер', price: 100, portion: 1 },
              soup: { id: 1232, name: 'Суп вечер', price: 120, portion: 1 },
              main: { id: 1371, name: 'Основное вечер', price: 200, portion: 1 },
            },
          },
          day2: {
            breakfast: { dish: { id: 1302, name: 'Каша 2', price: 150, portion: 1 } },
            lunch: {
              salad: { id: 1442, name: 'Салат 2', price: 100, portion: 1 },
              soup: { id: 1269, name: 'Суп 2', price: 120, portion: 1 },
              main: { id: 1618, name: 'Основное 2', price: 200, portion: 1 },
            },
            dinner: {
              salad: { id: 1298, name: 'Салат вечер 2', price: 100, portion: 1 },
              soup: { id: 1454, name: 'Суп вечер 2', price: 120, portion: 1 },
              main: { id: 1269, name: 'Основное вечер 2', price: 200, portion: 1 },
            },
          },
        },
      ],
      extras: [],
      total: 1760,
      subtotal: 1760,
      loyaltyPointsUsed: 0,
    }

    console.log('📤 Создаю заказ через POST /api/orders...')

    const response = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: orderData, userId: TEST_USER_ID }),
    })

    expect(response.ok).toBe(true)
    const result = await response.json()

    console.log('✅ Заказ создан:', {
      id: result.order?.id,
      orderNumber: result.order?.orderNumber,
      total: result.order?.total,
    })

    expect(result.order).toBeDefined()
    expect(result.order.id).toBeDefined()
    expect(typeof result.order.id).toBe('number')

    createdOrderIds.push(result.order.id)
  }, 30000)

  test('Должен получить созданный заказ через GET', async () => {
    console.log('📥 Получаю заказы через GET /api/orders...')

    const response = await fetch(`${API_BASE}/api/orders?userId=${TEST_USER_ID}`)
    expect(response.ok).toBe(true)

    const data = await response.json()
    console.log('✅ Получено заказов:', data.orders?.length || 0)

    expect(data.orders).toBeDefined()
    expect(Array.isArray(data.orders)).toBe(true)
    expect(data.orders.length).toBeGreaterThan(0)

    const lastOrder = data.orders[data.orders.length - 1]
    console.log('   Последний заказ:', {
      id: lastOrder.id,
      orderNumber: lastOrder.orderNumber,
      startDate: lastOrder.startDate,
    })

    expect(lastOrder.id).toBeDefined()
    expect(typeof lastOrder.id).toBe('number')
  }, 30000)

  test('Должен удалить заказ через DELETE', async () => {
    // Сначала создаем заказ который будем удалять
    const orderData = {
      userId: TEST_USER_ID,
      startDate: '2026-01-16T00:00:00.000Z',
      deliveryTime: '18:00-21:00',
      paymentMethod: 'cash',
      persons: [
        {
          name: 'Заказ для удаления',
          day1: {
            breakfast: { dish: { id: 1492, name: 'Каша', price: 150, portion: 1 } },
            lunch: {
              salad: { id: 1249, name: 'Салат', price: 100, portion: 1 },
            },
            dinner: {},
          },
          day2: {
            breakfast: {},
            lunch: {},
            dinner: {},
          },
        },
      ],
      extras: [],
      total: 250,
      subtotal: 250,
      loyaltyPointsUsed: 0,
    }

    console.log('📤 Создаю заказ для удаления...')
    const createResponse = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: orderData, userId: TEST_USER_ID }),
    })

    expect(createResponse.ok).toBe(true)
    const createResult = await createResponse.json()
    const orderId = createResult.order.id

    console.log('✅ Заказ создан, ID:', orderId)
    expect(orderId).toBeDefined()
    expect(typeof orderId).toBe('number')

    // Проверяем что заказ существует
    const getBeforeResponse = await fetch(`${API_BASE}/api/orders?userId=${TEST_USER_ID}`)
    const beforeData = await getBeforeResponse.json()
    const ordersBefore = beforeData.orders.length

    console.log('📊 Заказов ДО удаления:', ordersBefore)

    // Удаляем заказ
    console.log(`🗑️  Удаляю заказ ID=${orderId} через DELETE /api/orders/${orderId}...`)

    const deleteResponse = await fetch(`${API_BASE}/api/orders/${orderId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: TEST_USER_ID }),
    })

    console.log('📥 Ответ DELETE:', deleteResponse.status, deleteResponse.statusText)

    expect(deleteResponse.ok).toBe(true)
    const deleteResult = await deleteResponse.json()

    console.log('✅ Результат удаления:', deleteResult)

    // Проверяем что заказ удален
    const getAfterResponse = await fetch(`${API_BASE}/api/orders?userId=${TEST_USER_ID}`)
    const afterData = await getAfterResponse.json()
    const ordersAfter = afterData.orders.length

    console.log('📊 Заказов ПОСЛЕ удаления:', ordersAfter)
    console.log('   Разница:', ordersBefore - ordersAfter)

    // Проверяем что заказ действительно удален
    expect(ordersAfter).toBe(ordersBefore - 1)

    const deletedOrder = afterData.orders.find((o: any) => o.id === orderId)
    expect(deletedOrder).toBeUndefined()

    console.log('✅ Заказ успешно удален из БД')
  }, 30000)

  test('Должен создать 3 заказа и удалить средний', async () => {
    const baseDate = new Date('2026-01-20T00:00:00.000Z')
    const createdIds: number[] = []

    // Создаем 3 заказа
    for (let i = 0; i < 3; i++) {
      const date = new Date(baseDate)
      date.setDate(date.getDate() + i)

      const orderData = {
        userId: TEST_USER_ID,
        startDate: date.toISOString(),
        deliveryTime: '18:00-21:00',
        paymentMethod: 'cash',
        persons: [
          {
            name: `Заказ ${i + 1}`,
            day1: {
              breakfast: { dish: { id: 1492, name: 'Каша', price: 150, portion: 1 } },
              lunch: {},
              dinner: {},
            },
            day2: { breakfast: {}, lunch: {}, dinner: {} },
          },
        ],
        extras: [],
        total: 150,
        subtotal: 150,
        loyaltyPointsUsed: 0,
      }

      const response = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: orderData, userId: TEST_USER_ID }),
      })

      const result = await response.json()
      createdIds.push(result.order.id)
      createdOrderIds.push(result.order.id)

      console.log(`✅ Создан заказ ${i + 1}, ID=${result.order.id}`)
    }

    expect(createdIds.length).toBe(3)
    console.log('📊 Созданы 3 заказа:', createdIds)

    // Удаляем СРЕДНИЙ заказ (индекс 1)
    const middleOrderId = createdIds[1]
    console.log(`🗑️  Удаляю СРЕДНИЙ заказ ID=${middleOrderId}...`)

    const deleteResponse = await fetch(`${API_BASE}/api/orders/${middleOrderId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: TEST_USER_ID }),
    })

    expect(deleteResponse.ok).toBe(true)
    console.log('✅ Средний заказ удален')

    // Проверяем что остались только 1-й и 3-й заказы
    const getResponse = await fetch(`${API_BASE}/api/orders?userId=${TEST_USER_ID}`)
    const data = await getResponse.json()

    const remainingIds = data.orders.map((o: any) => o.id)
    console.log('📊 Оставшиеся ID:', remainingIds)

    expect(remainingIds).toContain(createdIds[0]) // 1-й заказ остался
    expect(remainingIds).not.toContain(createdIds[1]) // 2-й заказ удален
    expect(remainingIds).toContain(createdIds[2]) // 3-й заказ остался

    console.log('✅ Проверка пройдена: удален только средний заказ')
  }, 60000)
})

