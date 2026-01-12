/**
 * Исправление старого заказа 369 - обновим поля доставки
 */

async function fixOrder() {
  console.log("\n🔧 Исправление заказа 369...\n")
  
  // Обновляем заказ через API
  const response = await fetch("http://localhost:3000/api/orders/369", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      order: {
        delivery_fee: 250,
        delivery_district: "Центральный район",
        delivery_address: "Невский проспект, д. 1, кв. 10"
      }
    })
  })
  
  console.log(`Ответ: ${response.status}`)
  
  if (response.ok) {
    const result = await response.json()
    console.log(`\n✅ Заказ обновлен!`)
    console.log(JSON.stringify(result, null, 2))
    
    // Проверяем что сохранилось
    console.log(`\n🔍 Проверка через GET...`)
    const checkResponse = await fetch("http://localhost:3000/api/orders?userId=5")
    const checkData = await checkResponse.json()
    const order = checkData.orders.find(o => o.id === 369)
    
    if (order) {
      console.log(`\n📦 Заказ 369:`)
      console.log(`   Delivery Fee: ${order.deliveryFee}₽`)
      console.log(`   Delivery District: ${order.deliveryDistrict}`)
      console.log(`   Delivery Address: ${order.deliveryAddress}`)
      
      if (order.deliveryFee === 250 && order.deliveryDistrict === "Центральный район") {
        console.log(`\n✅ ВСЁ РАБОТАЕТ! Данные сохранились!`)
      } else {
        console.log(`\n❌ Данные не сохранились`)
      }
    }
  } else {
    const error = await response.text()
    console.log(`\n❌ Ошибка:\n${error}`)
  }
}

fixOrder()



