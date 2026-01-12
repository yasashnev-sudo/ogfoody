import { test, expect } from '@playwright/test'

test.describe('Total Spent Accumulation Check', () => {
  test('should accumulate total_spent correctly', async ({ request }) => {
    // 1. Создаем тестового пользователя
    const randomPhone = `7${Math.floor(Math.random() * 9000000000 + 1000000000)}`
    
    console.log(`📱 Создаем пользователя с телефоном: ${randomPhone}`)
    
    const userResponse = await request.post('/api/db/test-user', {
      data: {
        phone: randomPhone,
        name: 'Test Total Spent User'
      }
    })
    
    expect(userResponse.ok()).toBeTruthy()
    const userData = await userResponse.json()
    
    console.log(`📦 Ответ от /api/db/test-user:`, userData)
    
    // API возвращает массив tests, второй элемент - создание пользователя
    const createUserTest = userData.tests?.find((t: any) => t.userId)
    const userId = createUserTest?.userId
    
    console.log(`✅ Пользователь создан: ID=${userId}`)
    expect(userId).toBeDefined()
    
    // 2. Создаем первый заказ на 1150 руб
    const order1 = {
      startDate: '2026-01-13',
      persons: [
        {
          id: '1',
          day1: {
            breakfast: { dish: { id: 1, name: 'Завтрак', price: 200, portion: '1' as const } },
            lunch: {
              salad: { id: 2, name: 'Салат', price: 150, portion: '1' as const },
              soup: { id: 3, name: 'Суп', price: 150, portion: '1' as const },
              main: { id: 4, name: 'Основное', price: 250, portion: '1' as const }
            },
            dinner: {
              salad: { id: 5, name: 'Салат', price: 150, portion: '1' as const },
              main: { id: 6, name: 'Основное', price: 250, portion: '1' as const }
            }
          },
          day2: null
        }
      ],
      extras: [],
      deliveryTime: '10:00-14:00',
      paymentMethod: 'sbp',
      paid: false,
      deliveryDistrict: 'Тестовый район',
      deliveryAddress: 'Тестовая улица, д. 1',
      subtotal: 1150,
      total: 1150
    }
    
    console.log(`📦 Создаем первый заказ на ${order1.total} руб`)
    
    const order1Response = await request.post('/api/orders', {
      data: { order: order1, userId }
    })
    
    if (!order1Response.ok()) {
      const errorText = await order1Response.text()
      console.log(`❌ Ошибка при создании заказа:`, errorText)
    }
    
    expect(order1Response.ok()).toBeTruthy()
    const order1Data = await order1Response.json()
    
    console.log(`✅ Первый заказ создан: ID=${order1Data.orderId}`)
    console.log(`💰 userProfile из ответа POST:`, order1Data.userProfile)
    
    // Проверяем, что userProfile есть в ответе
    expect(order1Data.userProfile).toBeDefined()
    // Первый заказ - total_spent должен быть равен сумме заказа
    expect(order1Data.userProfile.totalSpent).toBe(1150)
    
    // 3. Оплачиваем первый заказ
    console.log(`💳 Оплачиваем первый заказ`)
    
    const payment1Response = await request.patch(`/api/orders/${order1Data.orderId}`, {
      data: {
        paid: true,
        paymentMethod: 'sbp',
        paymentStatus: 'completed'
      }
    })
    
    expect(payment1Response.ok()).toBeTruthy()
    const payment1Data = await payment1Response.json()
    
    console.log(`✅ Первый заказ оплачен`)
    console.log(`💰 userProfile из ответа PATCH:`, payment1Data.userProfile)
    
    // Проверяем total_spent после первого заказа (должен остаться 1150)
    expect(payment1Data.userProfile).toBeDefined()
    expect(payment1Data.userProfile.totalSpent).toBe(1150)
    
    // 4. Создаем второй заказ на 2000 руб
    const order2 = {
      ...order1,
      startDate: '2026-01-14',
      subtotal: 2000,
      total: 2000,
      persons: [
        {
          id: '1',
          day1: {
            breakfast: { dish: { id: 1, name: 'Завтрак', price: 400, portion: '1' as const } },
            lunch: {
              salad: { id: 2, name: 'Салат', price: 300, portion: '1' as const },
              soup: { id: 3, name: 'Суп', price: 300, portion: '1' as const },
              main: { id: 4, name: 'Основное', price: 500, portion: '1' as const }
            },
            dinner: {
              salad: { id: 5, name: 'Салат', price: 250, portion: '1' as const },
              main: { id: 6, name: 'Основное', price: 250, portion: '1' as const }
            }
          },
          day2: null
        }
      ],
    }
    
    console.log(`📦 Создаем второй заказ на ${order2.total} руб`)
    
    const order2Response = await request.post('/api/orders', {
      data: { order: order2, userId }
    })
    
    expect(order2Response.ok()).toBeTruthy()
    const order2Data = await order2Response.json()
    
    console.log(`✅ Второй заказ создан: ID=${order2Data.orderId}`)
    console.log(`💰 userProfile из ответа POST:`, order2Data.userProfile)
    
    // total_spent должен быть 3150 (1150 + 2000), т.к. при paymentMethod=sbp баллы начисляются сразу
    expect(order2Data.userProfile.totalSpent).toBe(3150)
    
    // 5. Оплачиваем второй заказ
    console.log(`💳 Оплачиваем второй заказ`)
    
    const payment2Response = await request.patch(`/api/orders/${order2Data.orderId}`, {
      data: {
        paid: true,
        paymentMethod: 'sbp',
        paymentStatus: 'completed'
      }
    })
    
    expect(payment2Response.ok()).toBeTruthy()
    const payment2Data = await payment2Response.json()
    
    console.log(`✅ Второй заказ оплачен`)
    console.log(`💰 userProfile из ответа PATCH:`, payment2Data.userProfile)
    
    // total_spent должен остаться 3150 (не должен удваиваться при оплате)
    expect(payment2Data.userProfile).toBeDefined()
    expect(payment2Data.userProfile.totalSpent).toBe(3150)
    
    console.log(`✅ ТЕСТ ПРОЙДЕН: total_spent корректно накапливается!`)
  })
})

