/**
 * Создание тестового заказа для проверки логов доставки
 */

async function createTestOrder() {
  console.log("\n🧪 СОЗДАНИЕ ТЕСТОВОГО ЗАКАЗА ДЛЯ ОТЛАДКИ ДОСТАВКИ\n")
  console.log("=" .repeat(70))
  
  try {
    // Тестовый заказ
    const testOrder = {
      startDate: "2026-01-15",
      deliveryTime: "17:30-22:00",
      paymentMethod: "cash",
      paid: false,
      paymentStatus: "pending",
      orderStatus: "pending",
      loyaltyPointsUsed: 0,
      persons: [
        {
          id: "test-person-1",
          day1: {
            breakfast: {
              dish: {
                id: 1308,
                name: "Шакшука",
                price: 328,
                prices: { single: 328 },
                portion: "single",
                category: "Завтрак"
              }
            },
            lunch: {
              salad: null,
              soup: {
                id: 1234,
                name: "Борщ",
                price: 250,
                prices: { single: 250 },
                portion: "single",
                category: "Суп"
              },
              main: null
            },
            dinner: {
              salad: null,
              soup: null,
              main: {
                id: 1456,
                name: "Курица с рисом",
                price: 467,
                prices: { single: 467 },
                portion: "single",
                category: "Горячее"
              }
            }
          },
          day2: {
            breakfast: { dish: null },
            lunch: { salad: null, soup: null, main: null },
            dinner: { salad: null, soup: null, main: null }
          }
        }
      ],
      extras: []
    }
    
    const userId = 5 // ID пользователя с заполненным адресом
    
    console.log("\n1️⃣ Отправка тестового заказа...")
    console.log(`   UserId: ${userId}`)
    console.log(`   Дата: ${testOrder.startDate}`)
    console.log(`   Блюд: Шакшука (328₽) + Борщ (250₽) + Курица (467₽) = 1045₽`)
    console.log(`   Ожидаемая доставка: 250₽`)
    console.log(`   Итого: 1295₽`)
    
    const response = await fetch("http://localhost:3000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: testOrder, userId: userId }),
    })
    
    console.log(`\n2️⃣ Ответ сервера: ${response.status} ${response.statusText}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`\n❌ Ошибка:\n${errorText}`)
      return
    }
    
    const result = await response.json()
    
    console.log("\n3️⃣ Результат создания заказа:")
    console.log("-".repeat(70))
    console.log(JSON.stringify(result, null, 2))
    
    console.log("\n" + "=".repeat(70))
    console.log("🔍 ПРОВЕРКА ДАННЫХ О ДОСТАВКЕ:")
    console.log("=" .repeat(70))
    
    if (result.order) {
      const order = result.order
      console.log(`\nНомер заказа: ${order.orderNumber}`)
      console.log(`Subtotal: ${order.subtotal}₽`)
      console.log(`Delivery Fee: ${order.deliveryFee !== undefined ? order.deliveryFee + '₽' : '❌ НЕ УСТАНОВЛЕНО'}`)
      console.log(`Delivery District: ${order.deliveryDistrict || '❌ НЕ УСТАНОВЛЕНО'}`)
      console.log(`Delivery Address: ${order.deliveryAddress || '❌ НЕ УСТАНОВЛЕНО'}`)
      console.log(`Total: ${order.total}₽`)
      
      if (order.deliveryFee !== undefined && order.deliveryFee > 0) {
        console.log(`\n✅ Доставка установлена: ${order.deliveryFee}₽`)
        console.log(`\n📋 ТЕПЕРЬ ПРОВЕРЬТЕ В NOCODB:`)
        console.log(`   1. Откройте таблицу Orders`)
        console.log(`   2. Найдите заказ ${order.orderNumber}`)
        console.log(`   3. Проверьте столбцы Delivery Fee, Delivery District, Delivery Address`)
      } else {
        console.log(`\n❌ Доставка НЕ установлена!`)
        console.log(`\n📋 ПРОВЕРЬТЕ ЛОГИ СЕРВЕРА В ТЕРМИНАЛЕ:`)
        console.log(`   Ищите строки с [DELIVERY DEBUG]`)
        console.log(`   Они покажут какие поля были получены от пользователя`)
      }
    }
    
    console.log("\n" + "=".repeat(70))
    console.log("\n💡 ВАЖНО: Проверьте логи в терминале где запущен npm run dev")
    console.log("   Там будут подробные логи с [DELIVERY DEBUG]\n")
    
  } catch (error) {
    console.error("\n❌ Ошибка:", error.message)
    console.error(error)
  }
}

createTestOrder()



