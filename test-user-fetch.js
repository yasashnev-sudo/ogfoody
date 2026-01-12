/**
 * Тест получения данных пользователя
 */

async function testUserFetch() {
  console.log("\n🧪 ТЕСТ: Получение данных пользователя через API\n")
  console.log("=" .repeat(70))
  
  try {
    // Тестируем с userId = 5
    const userId = 5
    
    console.log(`\n1️⃣ Запрос данных пользователя ID=${userId}...`)
    const response = await fetch(`http://localhost:3000/api/orders?userId=${userId}`)
    
    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status}`)
    }
    
    const data = await response.json()
    
    console.log("\n✅ Ответ получен")
    console.log("\n2️⃣ UserProfile из ответа:")
    console.log("-".repeat(70))
    console.log(JSON.stringify(data.userProfile, null, 2))
    
    console.log("\n3️⃣ Проверка полей адреса:")
    console.log("-".repeat(70))
    
    const profile = data.userProfile
    const addressFields = [
      'District', 'district',
      'Street', 'street', 
      'Building', 'building',
      'Apartment', 'apartment'
    ]
    
    addressFields.forEach(field => {
      const value = profile?.[field]
      console.log(`${field.padEnd(15)} = ${value !== undefined ? value : '❌ ОТСУТСТВУЕТ'}`)
    })
    
    console.log("\n" + "=".repeat(70))
    console.log("🎯 АНАЛИЗ:")
    console.log("=" .repeat(70))
    
    const district = profile?.District || profile?.district
    const street = profile?.Street || profile?.street
    const building = profile?.Building || profile?.building
    const apartment = profile?.Apartment || profile?.apartment
    
    if (!district) {
      console.log("\n❌ ПРОБЛЕМА: Поле District/district НЕ ВОЗВРАЩАЕТСЯ через API!")
      console.log("\nВозможные причины:")
      console.log("1. Поле не включено в userProfile в API response")
      console.log("2. Поле называется по-другому")
      console.log("3. Функция fetchUserById не возвращает это поле")
      
      console.log("\nДоступные поля в userProfile:")
      Object.keys(profile || {}).forEach(key => {
        console.log(`   - ${key}: ${profile[key]}`)
      })
    } else {
      console.log(`\n✅ Район найден: "${district}"`)
      console.log(`   Улица: ${street || 'НЕТ'}`)
      console.log(`   Дом: ${building || 'НЕТ'}`)
      console.log(`   Квартира: ${apartment || 'НЕТ'}`)
      
      console.log("\n💡 Поля есть в API response!")
      console.log("   Теперь проверим, передаются ли они при создании заказа...")
    }
    
    console.log("\n" + "=".repeat(70))
    console.log("\n4️⃣ СЛЕДУЮЩИЙ ШАГ:")
    console.log("\nСоздайте НОВЫЙ тестовый заказ и проверьте логи сервера.")
    console.log("Ищите строку: '🚚 Доставка: ...'")
    console.log("\nЕсли увидите '⚠️ Район не указан' - значит проблема в том,")
    console.log("что при создании заказа fetchUserById не возвращает District.")
    console.log("\n" + "=".repeat(70) + "\n")
    
  } catch (error) {
    console.error("\n❌ Ошибка:", error.message)
    console.error(error)
  }
}

testUserFetch()



