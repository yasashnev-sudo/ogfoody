/**
 * Проверка структуры пользователя для отладки полей района
 */

const NOCODB_URL = process.env.NOCODB_URL
const NOCODB_TOKEN = process.env.NOCODB_TOKEN
const NOCODB_TABLE_USERS = process.env.NOCODB_TABLE_USERS

async function checkUserStructure() {
  console.log("\n🔍 ПРОВЕРКА СТРУКТУРЫ ПОЛЬЗОВАТЕЛЯ\n")
  console.log("=" .repeat(70))
  
  try {
    // Получаем пользователя с телефоном 79219176619
    const url = `${NOCODB_URL}/api/v2/tables/${NOCODB_TABLE_USERS}/records?where=(phone,eq,79219176619)&limit=1`
    
    console.log(`📡 URL: ${url}`)
    
    const response = await fetch(url, {
      headers: {
        "xc-token": NOCODB_TOKEN,
      },
    })
    
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`)
    }
    
    const data = await response.json()
    const users = data.list || []
    
    if (users.length === 0) {
      console.log("❌ Пользователь не найден")
      return
    }
    
    const user = users[0]
    
    console.log("✅ Пользователь найден!\n")
    console.log("📋 ВСЕ ПОЛЯ ПОЛЬЗОВАТЕЛЯ:")
    console.log("=".repeat(70))
    console.log(JSON.stringify(user, null, 2))
    console.log("=".repeat(70))
    
    console.log("\n🏠 ПРОВЕРКА ПОЛЕЙ АДРЕСА:")
    console.log("-".repeat(70))
    
    const addressFields = [
      'District', 'district', 
      'Street', 'street',
      'Building', 'building', 
      'Apartment', 'apartment',
      'City', 'city',
      'Район', 'район',
      'Улица', 'улица',
      'Дом', 'дом',
      'Квартира', 'квартира'
    ]
    
    addressFields.forEach(field => {
      if (user[field] !== undefined) {
        console.log(`✅ ${field.padEnd(20, ' ')} = ${user[field]}`)
      }
    })
    
    console.log("\n" + "=".repeat(70))
    console.log("🔍 АНАЛИЗ:")
    console.log("=".repeat(70))
    
    // Проверяем какие поля используются в коде
    const districtValue = user.District || user.district || user.Район || user.район
    const streetValue = user.Street || user.street || user.Улица || user.улица
    const buildingValue = user.Building || user.building || user.Дом || user.дом
    const apartmentValue = user.Apartment || user.apartment || user.Квартира || user.квартира
    
    console.log(`\nРайон (District):     ${districtValue || '❌ НЕ НАЙДЕНО'}`)
    console.log(`Улица (Street):       ${streetValue || '❌ НЕ НАЙДЕНО'}`)
    console.log(`Дом (Building):       ${buildingValue || '❌ НЕ НАЙДЕНО'}`)
    console.log(`Квартира (Apartment): ${apartmentValue || '❌ НЕ НАЙДЕНО'}`)
    
    if (!districtValue) {
      console.log("\n❌ ПРОБЛЕМА: Поле District не найдено!")
      console.log("\nВозможные причины:")
      console.log("1. Поле называется по-другому в NocoDB")
      console.log("2. Поле пустое у пользователя")
      console.log("3. Поле есть, но код ищет неправильное название")
      console.log("\nДоступные поля пользователя:")
      Object.keys(user).forEach(key => {
        console.log(`   - ${key}`)
      })
    } else {
      console.log(`\n✅ Район найден: "${districtValue}"`)
      console.log("\nКод на backend должен правильно получать эти данные.")
      console.log("Проверьте логи сервера при создании заказа:")
      console.log(`   - Ищите строку: "🚚 Доставка: XXX₽ (район: ${districtValue}, ...)`)
    }
    
    console.log("\n" + "=".repeat(70) + "\n")
    
  } catch (error) {
    console.error("\n❌ Ошибка:", error.message)
    console.error(error)
  }
}

checkUserStructure()



