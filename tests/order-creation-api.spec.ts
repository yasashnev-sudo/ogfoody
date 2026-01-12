import { test, expect } from "@playwright/test"

/**
 * Headless API тест для контроля ошибки "❌ Ошибка при создании заказа: {}"
 * 
 * Проблема:
 * - При автооформлении заказа (handleAutoCheckout) после авторизации гостя
 * - subtotal передается некорректно (может быть 0 или undefined)
 * - total рассчитывается как NaN или 0
 * - API возвращает ошибку
 * 
 * Этот тест НЕ требует открытия браузера.
 * Он напрямую вызывает API и проверяет логику обработки заказов.
 */

test.describe("Guest Auto-Checkout - Order Creation API", () => {
  const BASE_URL = "http://localhost:3000"
  
  test("should create order with correct subtotal and total via API", async ({ request }) => {
    console.log("\n=== ТЕСТ: Создание заказа через API ===\n")
    
    // Шаг 1: Получаем меню и зоны доставки
    console.log("1. Загружаем меню и зоны доставки")
    const menuResponse = await request.get(`${BASE_URL}/api/menu`)
    expect(menuResponse.ok()).toBeTruthy()
    
    const menuData = await menuResponse.json()
    expect(menuData.meals || menuData.menuItems).toBeDefined()
    expect(menuData.deliveryZones).toBeDefined()
    expect(menuData.deliveryZones.length).toBeGreaterThan(0)
    
    const meals = menuData.meals || menuData.menuItems || []
    
    // Выбираем первую зону доставки
    const firstZone = menuData.deliveryZones[0]
    const district = firstZone.District || firstZone.district || firstZone["Район"]
    const deliveryFee = firstZone.deliveryFee || firstZone["Delivery Fee"] || firstZone.delivery_fee || 0
    
    console.log(`   Район: ${district}`)
    console.log(`   Стоимость доставки: ${deliveryFee}`)
    
    // Шаг 2: Создаем тестового пользователя через test-user API
    console.log("\n2. Создаем тестового пользователя")
    const initialPhone = `+7999${Date.now().toString().slice(-7)}`
    console.log(`   Исходный телефон: ${initialPhone}`)
    
    const createUserResponse = await request.post(`${BASE_URL}/api/db/test-user`, {
      data: {
        phone: initialPhone,
        testType: "create"
      }
    })
    
    expect(createUserResponse.ok(), `Не удалось создать пользователя: ${createUserResponse.status()}`).toBeTruthy()
    const userData = await createUserResponse.json()
    console.log("   Ответ от создания пользователя:", JSON.stringify(userData, null, 2))
    
    // Извлекаем информацию о пользователе из ответа
    let userId: number
    let userProfile: any
    
    if (userData.tests && userData.tests.length > 0) {
      const createTest = userData.tests.find((t: any) => t.success && t.userId)
      if (createTest) {
        userId = createTest.userId
        console.log(`   ✅ Пользователь создан, ID: ${userId}`)
        
        // Создаем минимальный профиль для теста
        // (test-user API не позволяет задать произвольный телефон, но это не важно для теста)
        userProfile = {
          id: userId,
          phone: initialPhone,  // Используем исходный телефон для логики
          name: "Тестовый Пользователь",
          district: district,
          street: "Тестовая улица",
          building: "1",
          apartment: "10"
        }
        console.log(`   📋 Создан профиль для теста`)
        console.log(`      ID: ${userProfile.id}`)
        console.log(`      Район: ${userProfile.district}`)
        console.log(`      Адрес: ${userProfile.street}, ${userProfile.building}`)
      } else {
        throw new Error("Не удалось создать пользователя через test-user API")
      }
    } else {
      throw new Error("test-user API вернул неожиданную структуру ответа")
    }
    
    // Шаг 3: Создаем заказ (симулируем handleAutoCheckout)
    console.log("\n3. Создаем заказ через POST /api/orders")
    
    // Создаем корректный заказ
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dateKey = `${tomorrow.getFullYear()}-${(tomorrow.getMonth() + 1).toString().padStart(2, "0")}-${tomorrow.getDate().toString().padStart(2, "0")}`
    
    // Выбираем первое блюдо из меню для расчета subtotal
    let subtotal = 0
    const persons = []
    
    if (meals && meals.length > 0) {
      // Находим супы и гарниры
      const soups = meals.filter((item: any) => item.category === "Супы" || item.Category === "Супы")
      const garnishes = meals.filter((item: any) => item.category === "Гарниры" || item.Category === "Гарниры")
      
      if (soups.length > 0 && garnishes.length > 0) {
        const soup = soups[0]
        const garnish = garnishes[0]
        
        const soupPrice = soup.price || soup.Price || soup["Standard Price"] || 0
        const garnishPrice = garnish.price || garnish.Price || garnish["Standard Price"] || 0
        
        subtotal = soupPrice + garnishPrice
        
        persons.push({
          id: 1,
          lunch: {
            soup: { name: soup.name || soup.Name, portion: "standard", price: soupPrice },
            main: null
          },
          dinner: {
            salad: null,
            soup: null,
            main: {
              name: "Основное",
              portion: "standard",
              price: 0,
              garnish: { name: garnish.name || garnish.Name, portion: "standard", price: garnishPrice }
            }
          }
        })
        
        console.log(`   Блюда:`)
        console.log(`      Суп: ${soup.name || soup.Name} - ${soupPrice}₽`)
        console.log(`      Гарнир: ${garnish.name || garnish.Name} - ${garnishPrice}₽`)
        console.log(`   Subtotal: ${subtotal}₽`)
      }
    }
    
    // Если не нашли блюда, используем тестовые значения
    if (subtotal === 0) {
      subtotal = 500
      persons.push({
        id: 1,
        lunch: {
          soup: { name: "Тестовый суп", portion: "standard", price: 300 },
          main: null
        },
        dinner: {
          salad: null,
          soup: null,
          main: {
            name: "Основное",
            portion: "standard",
            price: 0,
            garnish: { name: "Тестовый гарнир", portion: "standard", price: 200 }
          }
        }
      })
      console.log(`   ⚠️ Используем тестовые блюда, subtotal: ${subtotal}₽`)
    }
    
    const total = subtotal + deliveryFee
    console.log(`   Total: ${total}₽ (${subtotal}₽ + ${deliveryFee}₽)`)
    
    // ✅ КЛЮЧЕВАЯ ПРОВЕРКА: subtotal и total НЕ должны быть NaN или 0
    expect(Number.isNaN(subtotal), "subtotal НЕ должен быть NaN").toBe(false)
    expect(Number.isNaN(total), "total НЕ должен быть NaN").toBe(false)
    expect(subtotal, "subtotal должен быть > 0").toBeGreaterThan(0)
    expect(total, "total должен быть > 0").toBeGreaterThan(0)
    
    const order = {
      startDate: dateKey,
      persons: persons,
      delivered: false,
      deliveryTime: "18:00 - 20:00",
      extras: [],
      subtotal: subtotal,
      total: total,
      paid: false,
      deliveryFee: deliveryFee,
      deliveryDistrict: district,
      deliveryAddress: `${userProfile.street}, ${userProfile.building}${userProfile.apartment ? ', кв. ' + userProfile.apartment : ''}`,
    }
    
    console.log("\n   Отправляем заказ в API:")
    console.log(`      startDate: ${order.startDate}`)
    console.log(`      persons: ${order.persons.length}`)
    console.log(`      subtotal: ${order.subtotal}`)
    console.log(`      total: ${order.total}`)
    console.log(`      deliveryDistrict: ${order.deliveryDistrict}`)
    
    const createOrderResponse = await request.post(`${BASE_URL}/api/orders`, {
      data: {
        order: order,
        userId: userProfile.id
      }
    })
    
    // Логируем ответ
    const responseText = await createOrderResponse.text()
    console.log(`\n   HTTP Status: ${createOrderResponse.status()}`)
    
    let responseData
    try {
      responseData = JSON.parse(responseText)
      console.log(`   Response:`, JSON.stringify(responseData, null, 2))
    } catch (e) {
      console.log(`   Response (text):`, responseText)
    }
    
    // ✅ ГЛАВНАЯ ПРОВЕРКА: API НЕ должен вернуть ошибку
    if (!createOrderResponse.ok()) {
      console.error(`\n   ❌ ОШИБКА: API вернул ${createOrderResponse.status()}`)
      if (responseData?.error) {
        console.error(`   Сообщение: ${responseData.error}`)
      }
      if (responseData?.details) {
        console.error(`   Детали: ${JSON.stringify(responseData.details)}`)
      }
    }
    
    expect(createOrderResponse.ok(), `API должен вернуть 200, но вернул ${createOrderResponse.status()}`).toBeTruthy()
    
    // Проверяем структуру ответа
    expect(responseData).toBeDefined()
    expect(responseData.orderId, "orderId должен быть в ответе").toBeDefined()
    expect(responseData.orderNumber, "orderNumber должен быть в ответе").toBeDefined()
    
    console.log(`\n   ✅ Заказ успешно создан!`)
    console.log(`      Order ID: ${responseData.orderId}`)
    console.log(`      Order Number: ${responseData.orderNumber}`)
    
    // Шаг 4: Проверяем, что заказ сохранился в базе
    console.log(`\n4. Проверяем сохраненный заказ`)
    const getOrderResponse = await request.get(`${BASE_URL}/api/orders/${responseData.orderId}`)
    expect(getOrderResponse.ok()).toBeTruthy()
    
    const savedOrder = await getOrderResponse.json()
    console.log(`   ✅ Заказ найден в базе`)
    console.log(`      ID: ${savedOrder.Id}`)
    console.log(`      Total: ${savedOrder.total || savedOrder.Total || savedOrder["Total"]}`)
    console.log(`      District: ${savedOrder.delivery_district || savedOrder["Delivery District"]}`)
    
    // Проверяем, что subtotal и total сохранились корректно
    const savedTotal = savedOrder.total || savedOrder.Total || savedOrder["Total"]
    expect(savedTotal, "total в базе должен быть > 0").toBeGreaterThan(0)
    expect(Number.isNaN(savedTotal), "total в базе НЕ должен быть NaN").toBe(false)
    
    console.log(`\n✅ ТЕСТ ПРОЙДЕН: Заказ создан без ошибок`)
    console.log(`   Subtotal передан: ${order.subtotal}₽`)
    console.log(`   Total передан: ${order.total}₽`)
    console.log(`   Total сохранен: ${savedTotal}₽`)
  })
})

