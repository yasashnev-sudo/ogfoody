/**
 * Проверка структуры таблицы Orders и вывод инструкций по добавлению столбцов
 */

const NOCODB_URL = process.env.NOCODB_URL
const NOCODB_TOKEN = process.env.NOCODB_TOKEN
const NOCODB_TABLE_ORDERS = process.env.NOCODB_TABLE_ORDERS

console.log("\n🔍 Проверка переменных окружения:")
console.log(`NOCODB_URL: ${NOCODB_URL || 'НЕ УСТАНОВЛЕНО'}`)
console.log(`NOCODB_TOKEN: ${NOCODB_TOKEN ? '✅ Установлено (' + NOCODB_TOKEN.substring(0, 10) + '...)' : '❌ НЕ установлено'}`)
console.log(`NOCODB_TABLE_ORDERS: ${NOCODB_TABLE_ORDERS || 'НЕ УСТАНОВЛЕНО'}`)

if (!NOCODB_URL || !NOCODB_TOKEN || !NOCODB_TABLE_ORDERS) {
  console.error("\n❌ Не все необходимые переменные установлены в .env.local")
  process.exit(1)
}

async function checkOrdersStructure() {
  console.log("\n📊 ПРОВЕРКА СТРУКТУРЫ ТАБЛИЦЫ ORDERS\n")
  console.log("=" .repeat(70))
  
  try {
    // Получаем одну запись для анализа структуры
    console.log("\n1️⃣ Получение структуры таблицы Orders...")
    
    const url = `${NOCODB_URL}/api/v2/tables/${NOCODB_TABLE_ORDERS}/records?limit=5&sort=-Id`
    console.log(`   URL: ${url}`)
    
    const response = await fetch(url, {
      headers: {
        "xc-token": NOCODB_TOKEN,
      },
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Ошибка: ${response.status} - ${errorText}`)
    }
    
    const data = await response.json()
    const records = data.list || []
    
    console.log(`✅ Получено записей: ${records.length}`)
    
    if (records.length === 0) {
      console.log("⚠️  В таблице Orders пока нет записей")
      console.log("   Создайте тестовый заказ через UI для проверки структуры")
    } else {
      const sampleRecord = records[0]
      const allFields = Object.keys(sampleRecord)
      
      console.log(`\n✅ Всего полей в таблице: ${allFields.length}`)
      console.log("\nВсе поля:")
      allFields.forEach((field, index) => {
        const value = sampleRecord[field]
        const valueType = typeof value
        const valuePreview = value === null ? 'null' : 
                            valueType === 'object' ? JSON.stringify(value).substring(0, 50) :
                            String(value).substring(0, 50)
        console.log(`   ${(index + 1).toString().padStart(2, ' ')}. ${field.padEnd(30, ' ')} (${valueType}) = ${valuePreview}`)
      })
      
      // Проверяем наличие полей доставки
      console.log("\n" + "=".repeat(70))
      console.log("🚚 ПРОВЕРКА ПОЛЕЙ ДОСТАВКИ:")
      console.log("=" .repeat(70))
      
      const deliveryFields = [
        { snake: "delivery_fee", camel: "Delivery Fee", variants: ["delivery_fee", "Delivery Fee", "DeliveryFee"] },
        { snake: "delivery_district", camel: "Delivery District", variants: ["delivery_district", "Delivery District", "DeliveryDistrict"] },
        { snake: "delivery_address", camel: "Delivery Address", variants: ["delivery_address", "Delivery Address", "DeliveryAddress"] },
      ]
      
      let missingFields = []
      
      deliveryFields.forEach(field => {
        const found = field.variants.find(variant => allFields.includes(variant))
        if (found) {
          console.log(`✅ ${field.camel.padEnd(20, ' ')} → ${found}`)
        } else {
          console.log(`❌ ${field.camel.padEnd(20, ' ')} → НЕ НАЙДЕНО`)
          missingFields.push(field)
        }
      })
      
      if (missingFields.length > 0) {
        console.log("\n" + "=".repeat(70))
        console.log("⚠️  НЕОБХОДИМО ДОБАВИТЬ СТОЛБЦЫ:")
        console.log("=" .repeat(70))
        
        missingFields.forEach(field => {
          console.log(`\n❌ Отсутствует: ${field.camel} (${field.snake})`)
        })
        
        printInstructions(missingFields)
      } else {
        console.log("\n" + "=".repeat(70))
        console.log("✅ ВСЕ ПОЛЯ ДОСТАВКИ ПРИСУТСТВУЮТ!")
        console.log("=" .repeat(70))
        console.log("\nТеперь создайте новый заказ через UI и проверьте отображение доставки")
      }
    }
    
  } catch (error) {
    console.error("\n❌ Ошибка:", error.message)
    console.error(error)
  }
}

function printInstructions(missingFields) {
  console.log("\n" + "=".repeat(70))
  console.log("📋 ИНСТРУКЦИЯ ПО ДОБАВЛЕНИЮ СТОЛБЦОВ В NOCODB")
  console.log("=" .repeat(70))
  
  console.log("\n1️⃣ Откройте NocoDB в браузере:")
  console.log(`   ${NOCODB_URL.replace('/api/v2', '').replace('/api/v1', '')}`)
  
  console.log("\n2️⃣ Найдите таблицу 'Orders' и откройте её")
  
  console.log("\n3️⃣ Нажмите на '+' справа от последнего столбца (или на '...' → 'Add Column')")
  
  console.log("\n4️⃣ Добавьте следующие столбцы:\n")
  
  console.log("┌─────────────────────┬──────────────┬──────────────┬─────────────┐")
  console.log("│ Название столбца    │ Тип          │ По умолчанию │ Обязательное│")
  console.log("├─────────────────────┼──────────────┼──────────────┼─────────────┤")
  
  missingFields.forEach(field => {
    let type = "Text"
    let defaultVal = "-"
    
    if (field.snake === "delivery_fee") {
      type = "Number"
      defaultVal = "0"
    } else if (field.snake === "delivery_district") {
      type = "SingleLineText"
    } else if (field.snake === "delivery_address") {
      type = "LongText"
    }
    
    console.log(`│ ${field.camel.padEnd(19, ' ')} │ ${type.padEnd(12, ' ')} │ ${defaultVal.padEnd(12, ' ')} │ Нет         │`)
  })
  
  console.log("└─────────────────────┴──────────────┴──────────────┴─────────────┘")
  
  console.log("\n5️⃣ Детальные настройки для каждого столбца:\n")
  
  if (missingFields.some(f => f.snake === "delivery_fee")) {
    console.log("📊 Delivery Fee:")
    console.log("   • Column Title: Delivery Fee")
    console.log("   • Column Type: Number")
    console.log("   • Number Format: Integer")
    console.log("   • Default Value: 0")
    console.log("   • Required: No")
    console.log("   • Show Null: No")
    console.log("")
  }
  
  if (missingFields.some(f => f.snake === "delivery_district")) {
    console.log("📍 Delivery District:")
    console.log("   • Column Title: Delivery District")
    console.log("   • Column Type: SingleLineText")
    console.log("   • Max Length: 255")
    console.log("   • Required: No")
    console.log("")
  }
  
  if (missingFields.some(f => f.snake === "delivery_address")) {
    console.log("🏠 Delivery Address:")
    console.log("   • Column Title: Delivery Address")
    console.log("   • Column Type: LongText")
    console.log("   • Required: No")
    console.log("")
  }
  
  console.log("6️⃣ После добавления столбцов:")
  console.log("   • Обновите эту страницу браузера (F5)")
  console.log("   • Создайте новый тестовый заказ через UI приложения")
  console.log("   • Заказ должен иметь сумму от 1000₽ до 2299₽ (для платной доставки)")
  console.log("   • Проверьте, что в истории заказов отображается '🚚 Доставка: +XXX₽'")
  
  console.log("\n" + "=".repeat(70))
  console.log("💡 СОВЕТ:")
  console.log("=" .repeat(70))
  console.log("После добавления столбцов запустите скрипт снова для проверки:")
  console.log("   node check-orders-structure.js")
  console.log("=" .repeat(70) + "\n")
}

checkOrdersStructure()



