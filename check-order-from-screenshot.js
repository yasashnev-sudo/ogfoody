/**
 * Проверка заказа со скриншота: ORD-20260109-1K9HE7
 */

const NOCODB_URL = process.env.NOCODB_URL
const NOCODB_TOKEN = process.env.NOCODB_TOKEN
const NOCODB_TABLE_ORDERS = process.env.NOCODB_TABLE_ORDERS

async function checkOrder() {
  console.log("\n🔍 ПРОВЕРКА ЗАКАЗА СО СКРИНШОТА: ORD-20260109-1K9HE7\n")
  console.log("=" .repeat(70))
  
  try {
    // Ищем заказ по номеру
    const url = `${NOCODB_URL}/api/v2/tables/${NOCODB_TABLE_ORDERS}/records?where=(Order Number,eq,ORD-20260109-1K9HE7)`
    
    const response = await fetch(url, {
      headers: {
        "xc-token": NOCODB_TOKEN,
      },
    })
    
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`)
    }
    
    const data = await response.json()
    const orders = data.list || []
    
    if (orders.length === 0) {
      console.log("❌ Заказ ORD-20260109-1K9HE7 не найден в базе")
      return
    }
    
    const order = orders[0]
    
    console.log("✅ Заказ найден в NocoDB!\n")
    console.log("📋 RAW данные из NocoDB:")
    console.log("-".repeat(70))
    console.log(JSON.stringify(order, null, 2))
    console.log("-".repeat(70))
    
    console.log("\n💰 ФИНАНСЫ:")
    console.log(`Subtotal: ${order.Subtotal || 'НЕ УСТАНОВЛЕНО'}`)
    console.log(`Delivery Fee: ${order["Delivery Fee"] !== undefined && order["Delivery Fee"] !== null ? order["Delivery Fee"] : 'НЕ УСТАНОВЛЕНО'}`)
    console.log(`Total: ${order.Total || 'НЕ УСТАНОВЛЕНО'}`)
    
    console.log("\n🚚 ДОСТАВКА:")
    console.log(`Delivery District: ${order["Delivery District"] || 'НЕ УСТАНОВЛЕНО'}`)
    console.log(`Delivery Address: ${order["Delivery Address"] || 'НЕ УСТАНОВЛЕНО'}`)
    
    console.log("\n" + "=".repeat(70))
    console.log("🔍 ПРОВЕРКА ЧЕРЕЗ API ПРИЛОЖЕНИЯ:")
    console.log("=" .repeat(70))
    
    // Получаем через API приложения
    const userId = order["User ID"]
    const appApiResponse = await fetch(`http://localhost:3000/api/orders?userId=${userId}`)
    
    if (appApiResponse.ok) {
      const appData = await appApiResponse.json()
      const appOrder = appData.orders.find(o => o.orderNumber === "ORD-20260109-1K9HE7")
      
      if (appOrder) {
        console.log("\n✅ Заказ найден через API приложения:\n")
        console.log(JSON.stringify(appOrder, null, 2))
        
        console.log("\n" + "=".repeat(70))
        console.log("🎯 АНАЛИЗ:")
        console.log("=" .repeat(70))
        
        if (appOrder.deliveryFee !== undefined && appOrder.deliveryFee !== null) {
          console.log(`\n✅ deliveryFee присутствует: ${appOrder.deliveryFee}`)
          
          if (appOrder.deliveryFee > 0) {
            console.log(`\n📱 ДОЛЖНА быть строка: "🚚 Доставка: +${appOrder.deliveryFee}₽"`)
            console.log(`\n❌ Если её НЕТ, значит проблема в условии отображения UI!`)
          } else {
            console.log(`\n✅ deliveryFee = 0 (бесплатная доставка)`)
            console.log(`   Строка доставки не показывается - это правильно`)
          }
        } else {
          console.log(`\n❌ deliveryFee ОТСУТСТВУЕТ в ответе API!`)
          console.log(`   Это означает, что проблема в маппинге полей в lib/nocodb.ts`)
        }
      }
    }
    
    console.log("\n" + "=".repeat(70) + "\n")
    
  } catch (error) {
    console.error("\n❌ Ошибка:", error.message)
    console.error(error)
  }
}

checkOrder()



