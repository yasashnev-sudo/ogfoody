/**
 * Создание простого тестового заказа
 */

async function createOrder() {
  const order = {
    startDate: "2026-01-16",
    deliveryTime: "17:30-22:00",
    paymentMethod: "cash",
    paid: false,
    persons: [
      {
        id: "p1",
        day1: {
          breakfast: { dish: null },
          lunch: { 
            salad: null, 
            soup: { 
              id: 1219, 
              name: "Крем-суп из цветной капусты", 
              price: 250,
              prices: { single: 250 },
              portion: "single",
              category: "soup"
            }, 
            main: {
              id: 1308,
              name: "Куриная грудка на гриле",
              price: 467,
              prices: { single: 467 },
              portion: "single",
              category: "main"
            }
          },
          dinner: {
            salad: null,
            soup: null,
            main: {
              id: 1456,
              name: "Рыба запеченная",
              price: 350,
              prices: { single: 350 },
              portion: "single",
              category: "main"
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
  
  console.log("\n🧪 Создание тестового заказа...")
  console.log(`   Сумма: 250 + 467 + 350 = 1067₽`)
  console.log(`   Ожидаемая доставка: 250₽`)
  console.log(`   Итого: 1317₽\n`)
  
  const response = await fetch("http://localhost:3000/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order, userId: 5 }),
  })
  
  console.log(`Ответ: ${response.status}`)
  
  if (response.ok) {
    const result = await response.json()
    console.log(`\n✅ Заказ создан: ${result.orderNumber}`)
    console.log(`   Delivery Fee: ${result.order?.deliveryFee}₽`)
    console.log(`   Delivery District: ${result.order?.deliveryDistrict}`)
    console.log(`   Total: ${result.order?.total}₽`)
    
    console.log(`\n📋 ПРОВЕРЬТЕ ЛОГИ В /tmp/next-dev.log`)
    console.log(`   Ищите строки с [DELIVERY DEBUG]`)
  } else {
    const error = await response.text()
    console.log(`\n❌ Ошибка:\n${error}`)
  }
}

createOrder()



