/**
 * Прямая проверка функции fetchUserById
 */

// Импортируем напрямую из lib/nocodb.ts (как ES модуль)
import { fetchUserById } from './lib/nocodb.ts'

console.log("\n🧪 ТЕСТ: Прямая проверка fetchUserById\n")
console.log("=" .repeat(70))

try {
  console.log("\n1️⃣ Вызов fetchUserById(5, true)...")
  
  const user = await fetchUserById(5, true)
  
  if (!user) {
    console.log("\n❌ Пользователь не найден!")
  } else {
    console.log("\n✅ Пользователь получен!")
    
    console.log("\n2️⃣ ВСЕ ПОЛЯ ПОЛЬЗОВАТЕЛЯ:")
    console.log("-".repeat(70))
    console.log(JSON.stringify(user, null, 2))
    
    console.log("\n3️⃣ АДРЕСНЫЕ ПОЛЯ:")
    console.log("-".repeat(70))
    console.log(`District:  ${user.District || 'ОТСУТСТВУЕТ'}`)
    console.log(`district:  ${user.district || 'ОТСУТСТВУЕТ'}`)
    console.log(`Street:    ${user.Street || 'ОТСУТСТВУЕТ'}`)
    console.log(`street:    ${user.street || 'ОТСУТСТВУЕТ'}`)
    console.log(`Building:  ${user.Building || 'ОТСУТСТВУЕТ'}`)
    console.log(`building:  ${user.building || 'ОТСУТСТВУЕТ'}`)
    console.log(`Apartment: ${user.Apartment || 'ОТСУТСТВУЕТ'}`)
    console.log(`apartment: ${user.apartment || 'ОТСУТСТВУЕТ'}`)
    
    console.log("\n" + "=".repeat(70))
    console.log("🎯 РЕЗУЛЬТАТ:")
    console.log("=" .repeat(70))
    
    const districtValue = user.District || user.district
    if (districtValue) {
      console.log(`\n✅ Район найден: "${districtValue}"`)
      console.log("\nЭто значит fetchUserById работает правильно!")
      console.log("Проблема должна быть в другом месте.")
    } else {
      console.log(`\n❌ Район НЕ НАЙДЕН!`)
      console.log("\nПроблема в функции fetchUserById:")
      console.log("Она не возвращает поле District из БД.")
    }
  }
  
  console.log("\n" + "=".repeat(70) + "\n")
  
} catch (error) {
  console.error("\n❌ Ошибка:", error.message)
  console.error(error)
}



