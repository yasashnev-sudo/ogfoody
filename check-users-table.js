// Скрипт для проверки структуры таблицы Users
const checkUsersTable = async () => {
  console.log("🔍 Проверка структуры таблицы Users...\n")

  try {
    // Получаем список пользователей
    const response = await fetch("http://localhost:3000/api/db/list-users")
    if (response.ok) {
      const data = await response.json()
      console.log("✅ Получен ответ от API")
      console.log(`📊 Найдено пользователей: ${data.users?.length || 0}\n`)
      
      if (data.users && data.users.length > 0) {
        const firstUser = data.users[0]
        console.log("📋 Структура первого пользователя:")
        console.log("Ключи:", Object.keys(firstUser))
        console.log("\nЗначения:")
        Object.keys(firstUser).forEach(key => {
          console.log(`  ${key}: ${firstUser[key]} (тип: ${typeof firstUser[key]})`)
        })
        
        console.log("\n🔍 Проверка наличия поля ID:")
        console.log(`  - 'Id' in user: ${'Id' in firstUser}`)
        console.log(`  - 'id' in user: ${'id' in firstUser}`)
        console.log(`  - '_id' in user: ${'_id' in firstUser}`)
        console.log(`  - firstUser.Id: ${firstUser.Id}`)
        console.log(`  - firstUser.id: ${firstUser.id}`)
        console.log(`  - firstUser._id: ${firstUser._id}`)
        
        // Проверяем, есть ли поле с ID в любом виде
        const idField = firstUser.Id || firstUser.id || firstUser._id || firstUser["Id"] || firstUser["id"]
        if (idField) {
          console.log(`\n✅ Поле ID найдено: ${idField} (тип: ${typeof idField})`)
          console.log(`   Используем это значение для тестирования`)
          
          // Пытаемся получить пользователя по ID
          console.log(`\n🔍 Тест получения пользователя по ID=${idField}...`)
          const testResponse = await fetch(`http://localhost:3000/api/db/test-user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              userId: idField,
              testType: "fetch"
            }),
          })
          
          if (testResponse.ok) {
            const testResult = await testResponse.json()
            console.log("✅ Тест выполнен:", testResult)
          } else {
            const error = await testResponse.json()
            console.error("❌ Ошибка при тесте:", error)
          }
        } else {
          console.log("\n❌ Поле ID НЕ найдено в ответе!")
          console.log("   Это может быть причиной проблемы с начислением баллов")
        }
      } else {
        console.log("⚠️ Пользователи не найдены в базе данных")
      }
    } else {
      const error = await response.json()
      console.error("❌ Ошибка при получении пользователей:", error)
    }
  } catch (error) {
    console.error("❌ Критическая ошибка:", error)
  }
}

checkUsersTable()





