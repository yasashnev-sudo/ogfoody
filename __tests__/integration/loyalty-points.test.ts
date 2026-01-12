/**
 * ИНТЕГРАЦИОННЫЙ ТЕСТ БАЛЛОВ ЛОЯЛЬНОСТИ
 * Проверяет начисление, использование и возврат баллов при создании и удалении заказов
 */

import fetch from 'node-fetch'

const API_BASE = 'http://localhost:3000'
const TEST_USER_ID = 5
const NOCODB_URL = process.env.NOCODB_URL || 'https://noco.povarnakolesah.ru'
const NOCODB_TOKEN = process.env.NOCODB_TOKEN || 'eppmI3qJq8ahGaCzPmjmZGIze9NgJxEFQzu6Ps1r'

// Вспомогательные функции для работы с NocoDB
async function getNocoDBUserBalance(userId: number): Promise<number> {
  const response = await fetch(
    `${NOCODB_URL}/api/v2/tables/mg9dm2m41bjv8ar/records?where=(Id,eq,${userId})`,
    {
      headers: {
        'xc-token': NOCODB_TOKEN,
        'Content-Type': 'application/json',
      },
    }
  )
  const data = await response.json() as any
  const user = data.list?.[0]
  return user?.['Loyalty Points'] || 0
}

async function getNocoDBTransactions(userId: number): Promise<any[]> {
  const response = await fetch(
    `${NOCODB_URL}/api/v2/tables/mn244txmccpwmhx/records?where=(User ID,eq,${userId})&limit=1000`,
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

async function resetUserLoyaltyPoints(userId: number): Promise<void> {
  // 1. Удаляем ВСЕ заказы пользователя
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
  
  console.log(`🗑️  Удаление ${orders.length} заказов пользователя ${userId}...`)
  for (const order of orders) {
    await fetch(`${NOCODB_URL}/api/v2/tables/m96i4ai2yelbboh/records/${order.Id}`, {
      method: 'DELETE',
      headers: {
        'xc-token': NOCODB_TOKEN,
      },
    })
  }

  // 2. Удаляем все транзакции
  const transactions = await getNocoDBTransactions(userId)
  console.log(`🗑️  Удаление ${transactions.length} транзакций...`)
  for (const transaction of transactions) {
    await fetch(`${NOCODB_URL}/api/v2/tables/mn244txmccpwmhx/records/${transaction.Id}`, {
      method: 'DELETE',
      headers: {
        'xc-token': NOCODB_TOKEN,
      },
    })
  }

  // 3. Сбрасываем баланс
  await fetch(`${NOCODB_URL}/api/v2/tables/mg9dm2m41bjv8ar/records`, {
    method: 'PATCH',
    headers: {
      'xc-token': NOCODB_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([{ Id: userId, 'Loyalty Points': 0, 'Total Spent': 0 }]),
  })
  
  console.log(`✅ Пользователь ${userId} очищен: 0 заказов, 0 транзакций, 0 баллов`)
}

describe('Loyalty Points Integration Tests', () => {
  let createdOrderIds: number[] = []

  beforeAll(async () => {
    console.log('🧹 Сброс баллов перед тестами...')
    await resetUserLoyaltyPoints(TEST_USER_ID)
    // Ждем чтобы кэш обновился (даже noCache может иметь задержку)
    await new Promise((resolve) => setTimeout(resolve, 5000))
  }, 60000)

  afterEach(async () => {
    // Очистка созданных заказов
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
    createdOrderIds = []
  }, 60000)

  afterAll(async () => {
    console.log('🧹 Финальная очистка баллов...')
    await resetUserLoyaltyPoints(TEST_USER_ID)
  }, 60000)

  test('Начальный баланс должен быть 0', async () => {
    const balance = await getNocoDBUserBalance(TEST_USER_ID)
    console.log('💰 Начальный баланс в NocoDB:', balance)
    expect(balance).toBe(0)

    const apiResponse = await fetch(`${API_BASE}/api/orders?userId=${TEST_USER_ID}`)
    const apiData = await apiResponse.json()
    console.log('💰 Начальный баланс через API:', apiData.userProfile?.loyaltyPoints)
    expect(apiData.userProfile?.loyaltyPoints).toBe(0)
  }, 30000)

  test('При создании ОПЛАЧЕННОГО заказа должны начислиться баллы', async () => {
    // Проверяем начальный баланс
    const initialBalance = await getNocoDBUserBalance(TEST_USER_ID)
    console.log('💰 Баланс ДО создания заказа:', initialBalance)

    // Создаем ОПЛАЧЕННЫЙ заказ на 1000₽
    const orderData = {
      userId: TEST_USER_ID,
      startDate: '2026-01-25T00:00:00.000Z',
      deliveryTime: '18:00-21:00',
      paymentMethod: 'card', // ОПЛАЧЕН картой
      paid: true, // ОПЛАЧЕН
      paymentStatus: 'paid',
      persons: [
        {
          id: 1,
          day1: {
            breakfast: { dish: { id: 1492, name: 'Каша', price: 500, portion: 1 } },
            lunch: {
              salad: { id: 1249, name: 'Салат', price: 250, portion: 1 },
              soup: { id: 1371, name: 'Суп', price: 250, portion: 1 },
            },
            dinner: {},
          },
          day2: { breakfast: {}, lunch: {}, dinner: {} },
        },
      ],
      extras: [],
      total: 1000,
      subtotal: 1000,
      loyaltyPointsUsed: 0,
    }

    console.log('📤 Создаю ОПЛАЧЕННЫЙ заказ на 1000₽...')

    const createResponse = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: orderData, userId: TEST_USER_ID }),
    })

    expect(createResponse.ok).toBe(true)
    const createResult = await createResponse.json()
    const orderId = createResult.order.id

    console.log('✅ Заказ создан, ID:', orderId)
    console.log('   Баллов начислено по API:', createResult.loyaltyPointsEarned)

    createdOrderIds.push(orderId)

    // ВАЖНО: Даем время на обработку транзакций
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Проверяем баланс в NocoDB
    const nocoBalance = await getNocoDBUserBalance(TEST_USER_ID)
    console.log('💰 Баланс в NocoDB после создания:', nocoBalance)

    // Проверяем баланс через API
    const apiResponse = await fetch(`${API_BASE}/api/orders?userId=${TEST_USER_ID}`)
    const apiData = await apiResponse.json()
    const apiBalance = apiData.userProfile?.loyaltyPoints
    console.log('💰 Баланс через API после создания:', apiBalance)

    // Проверяем транзакции в БД
    const transactions = await getNocoDBTransactions(TEST_USER_ID)
    console.log('📊 Транзакций в БД:', transactions.length)
    transactions.forEach((t) => {
      console.log(
        `   ID=${t.Id}, Type=${t['Transaction Type']}, Points=${t.Points}, Status=${t['Transaction Status']}`
      )
    })

    // Ожидаем что баллы начислены (10% от 1000 = 100 баллов)
    const expectedPoints = 100
    expect(nocoBalance).toBeGreaterThanOrEqual(expectedPoints)
    expect(apiBalance).toBeGreaterThanOrEqual(expectedPoints)
    expect(transactions.length).toBeGreaterThan(0)

    // Проверяем что есть транзакция с типом 'earned'
    const earnedTransaction = transactions.find((t) => t['Transaction Type'] === 'earned')
    expect(earnedTransaction).toBeDefined()
    expect(earnedTransaction?.Points).toBe(expectedPoints)
  }, 60000)

  test('При удалении ОПЛАЧЕННОГО заказа баллы должны вернуться', async () => {
    // 1. Создаем оплаченный заказ
    const orderData = {
      userId: TEST_USER_ID,
      startDate: '2026-01-26T00:00:00.000Z',
      deliveryTime: '18:00-21:00',
      paymentMethod: 'card',
      paid: true,
      paymentStatus: 'paid',
      persons: [
        {
          id: 1,
          day1: {
            breakfast: { dish: { id: 1492, name: 'Каша', price: 800, portion: 1 } },
            lunch: {
              salad: { id: 1249, name: 'Салат', price: 200, portion: 1 },
            },
            dinner: {},
          },
          day2: { breakfast: {}, lunch: {}, dinner: {} },
        },
      ],
      extras: [],
      total: 1000,
      subtotal: 1000,
      loyaltyPointsUsed: 0,
    }

    console.log('📤 Создаю заказ для проверки возврата баллов...')

    const createResponse = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: orderData, userId: TEST_USER_ID }),
    })

    const createResult = await createResponse.json()
    const orderId = createResult.order.id
    const earnedPoints = createResult.loyaltyPointsEarned

    console.log('✅ Заказ создан, ID:', orderId)
    console.log('   Начислено баллов:', earnedPoints)

    createdOrderIds.push(orderId)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Проверяем баланс ПОСЛЕ создания
    const balanceAfterCreate = await getNocoDBUserBalance(TEST_USER_ID)
    console.log('💰 Баланс ПОСЛЕ создания заказа:', balanceAfterCreate)

    expect(balanceAfterCreate).toBeGreaterThanOrEqual(earnedPoints)

    // 2. Удаляем заказ
    console.log(`🗑️  Удаляю заказ ID=${orderId}...`)

    const deleteResponse = await fetch(`${API_BASE}/api/orders/${orderId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: TEST_USER_ID }),
    })

    expect(deleteResponse.ok).toBe(true)
    const deleteResult = await deleteResponse.json()
    console.log('✅ Заказ удален')
    console.log('   Обновленный баланс из DELETE API:', deleteResult.updatedLoyaltyPoints)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 3. Проверяем баланс ПОСЛЕ удаления
    const balanceAfterDelete = await getNocoDBUserBalance(TEST_USER_ID)
    console.log('💰 Баланс ПОСЛЕ удаления заказа:', balanceAfterDelete)

    // Проверяем через API
    const apiResponse = await fetch(`${API_BASE}/api/orders?userId=${TEST_USER_ID}`)
    const apiData = await apiResponse.json()
    const apiBalanceAfterDelete = apiData.userProfile?.loyaltyPoints
    console.log('💰 Баланс через API после удаления:', apiBalanceAfterDelete)

    // Проверяем транзакции
    const transactionsAfterDelete = await getNocoDBTransactions(TEST_USER_ID)
    console.log('📊 Транзакций после удаления:', transactionsAfterDelete.length)
    transactionsAfterDelete.forEach((t) => {
      console.log(
        `   ID=${t.Id}, Type=${t['Transaction Type']}, Points=${t.Points}, Status=${t['Transaction Status']}, OrderID=${t['Order ID']}`
      )
    })

    // Ожидаем что баллы вернулись (должен быть 0 или меньше чем было после создания)
    expect(balanceAfterDelete).toBeLessThanOrEqual(balanceAfterCreate - earnedPoints)

    // Проверяем что есть транзакция отмены (cancelled) для возврата баллов
    const cancelTransaction = transactionsAfterDelete.find(
      (t) => t['Transaction Type'] === 'cancelled' && t['Order ID'] === orderId
    )
    console.log('🔍 Транзакция отмены:', cancelTransaction ? 'найдена ✅' : 'НЕ НАЙДЕНА ❌')

    if (!cancelTransaction) {
      console.error('❌ ПРОБЛЕМА: Транзакция отмены не создана!')
      console.log('Все транзакции:', JSON.stringify(transactionsAfterDelete, null, 2))
    }

    expect(cancelTransaction).toBeDefined()
    expect(cancelTransaction?.Points).toBe(-earnedPoints) // Проверяем что отменили правильное количество
  }, 60000)

  test('При создании НЕОПЛАЧЕННОГО заказа баллы НЕ должны начислиться сразу', async () => {
    const initialBalance = await getNocoDBUserBalance(TEST_USER_ID)
    console.log('💰 Баланс ДО создания неоплаченного заказа:', initialBalance)

    // Создаем НЕОПЛАЧЕННЫЙ заказ (наличные)
    const orderData = {
      userId: TEST_USER_ID,
      startDate: '2026-01-27T00:00:00.000Z',
      deliveryTime: '18:00-21:00',
      paymentMethod: 'cash', // НАЛИЧНЫЕ
      paid: false, // НЕ ОПЛАЧЕН
      paymentStatus: 'pending',
      persons: [
        {
          id: 1,
          day1: {
            breakfast: { dish: { id: 1492, name: 'Каша', price: 500, portion: 1 } },
            lunch: {},
            dinner: {},
          },
          day2: { breakfast: {}, lunch: {}, dinner: {} },
        },
      ],
      extras: [],
      total: 500,
      subtotal: 500,
      loyaltyPointsUsed: 0,
    }

    console.log('📤 Создаю НЕОПЛАЧЕННЫЙ заказ (наличные)...')

    const createResponse = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: orderData, userId: TEST_USER_ID }),
    })

    const createResult = await createResponse.json()
    const orderId = createResult.order.id

    console.log('✅ Заказ создан, ID:', orderId)
    console.log('   Статус баллов:', createResult.loyaltyPointsStatus)
    console.log('   Сообщение:', createResult.loyaltyPointsMessage)

    createdOrderIds.push(orderId)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Проверяем баланс - должен остаться прежним
    const balanceAfter = await getNocoDBUserBalance(TEST_USER_ID)
    console.log('💰 Баланс ПОСЛЕ создания неоплаченного заказа:', balanceAfter)

    expect(balanceAfter).toBe(initialBalance)

    // Проверяем что есть pending транзакция
    const transactions = await getNocoDBTransactions(TEST_USER_ID)
    const pendingTransaction = transactions.find(
      (t) => t['Order ID'] === orderId && t['Transaction Status'] === 'pending'
    )

    console.log('📊 Pending транзакция:', pendingTransaction ? 'найдена ✅' : 'не найдена')

    if (createResult.loyaltyPointsStatus === 'pending') {
      expect(pendingTransaction).toBeDefined()
    }
  }, 60000)

  test('Полный цикл: создание → начисление → использование → возврат', async () => {
    console.log('\n=== ТЕСТ ПОЛНОГО ЦИКЛА ===\n')

    // 1. Начальный баланс
    await resetUserLoyaltyPoints(TEST_USER_ID)
    let balance = await getNocoDBUserBalance(TEST_USER_ID)
    console.log('1️⃣ Начальный баланс:', balance)
    expect(balance).toBe(0)

    // 2. Создаем первый оплаченный заказ (начислим баллы)
    console.log('\n2️⃣ Создаю первый заказ на 2000₽...')
    const order1Response = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order: {
          userId: TEST_USER_ID,
          startDate: '2026-01-28T00:00:00.000Z',
          deliveryTime: '18:00-21:00',
          paymentMethod: 'card',
          paid: true,
          persons: [
            {
              id: 1,
              day1: {
                breakfast: { dish: { id: 1492, name: 'Каша', price: 2000, portion: 1 } },
                lunch: {},
                dinner: {},
              },
              day2: { breakfast: {}, lunch: {}, dinner: {} },
            },
          ],
          extras: [],
          total: 2000,
          subtotal: 2000,
          loyaltyPointsUsed: 0,
        },
        userId: TEST_USER_ID,
      }),
    })

    const order1 = await order1Response.json()
    createdOrderIds.push(order1.order.id)
    console.log('   Создан заказ ID:', order1.order.id)
    console.log('   Начислено баллов:', order1.loyaltyPointsEarned)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    balance = await getNocoDBUserBalance(TEST_USER_ID)
    console.log('   Баланс после 1-го заказа:', balance)
    expect(balance).toBeGreaterThanOrEqual(200) // 10% от 2000

    // 3. Создаем второй заказ с использованием баллов
    console.log('\n3️⃣ Создаю второй заказ на 1000₽, используя 100 баллов...')
    const order2Response = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order: {
          userId: TEST_USER_ID,
          startDate: '2026-01-29T00:00:00.000Z',
          deliveryTime: '18:00-21:00',
          paymentMethod: 'card',
          paid: true,
          persons: [
            {
              id: 1,
              day1: {
                breakfast: { dish: { id: 1492, name: 'Каша', price: 1000, portion: 1 } },
                lunch: {},
                dinner: {},
              },
              day2: { breakfast: {}, lunch: {}, dinner: {} },
            },
          ],
          extras: [],
          total: 900, // 1000 - 100 (использовали баллы)
          subtotal: 1000,
          loyaltyPointsUsed: 100,
        },
        userId: TEST_USER_ID,
      }),
    })

    const order2 = await order2Response.json()
    createdOrderIds.push(order2.order.id)
    console.log('   Создан заказ ID:', order2.order.id)
    console.log('   Использовано баллов:', order2.loyaltyPointsUsed)
    console.log('   Начислено баллов:', order2.loyaltyPointsEarned)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const balanceAfterOrder2 = await getNocoDBUserBalance(TEST_USER_ID)
    console.log('   Баланс после 2-го заказа:', balanceAfterOrder2)
    // Было ~200, использовали 100, начислили ~90 (10% от 900) = ~190
    expect(balanceAfterOrder2).toBeLessThan(balance) // Использовали баллы

    // 4. Удаляем второй заказ (возврат использованных баллов)
    console.log('\n4️⃣ Удаляю второй заказ (вернутся использованные баллы)...')
    await fetch(`${API_BASE}/api/orders/${order2.order.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: TEST_USER_ID }),
    })

    await new Promise((resolve) => setTimeout(resolve, 1000))

    balance = await getNocoDBUserBalance(TEST_USER_ID)
    console.log('   Баланс после удаления 2-го заказа:', balance)
    // Должны вернуться использованные баллы (100) и списаться начисленные (~90)
    expect(balance).toBeGreaterThan(balanceAfterOrder2)

    // 5. Проверяем финальные транзакции
    const finalTransactions = await getNocoDBTransactions(TEST_USER_ID)
    console.log('\n5️⃣ Финальные транзакции:', finalTransactions.length)
    finalTransactions.forEach((t) => {
      console.log(
        `   ${t['Transaction Type']}: ${t.Points} баллов, Status=${t['Transaction Status']}, Order=${t['Order ID']}`
      )
    })

    console.log('\n✅ Полный цикл завершен!')
  }, 120000)
})

