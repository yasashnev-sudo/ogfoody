// Тестовый скрипт для проверки начисления баллов с созданием пользователя
const testOrderWithUser = async () => {
  console.log("🧪 Тестирование создания заказа с пользователем...\n")

  // Шаг 1: Создаем тестового пользователя
  console.log("📝 Шаг 1: Создание тестового пользователя...")
  const testPhone = `+7${Math.floor(Math.random() * 9000000000 + 1000000000)}`
  const testUser = {
    phone: testPhone,
    name: "Тестовый Пользователь",
    street: "Тестовая улица",
    building: "1",
    apartment: "1",
    loyalty_points: 0,
    total_spent: 0,
  }

  let userId = null
  try {
    const createUserResponse = await fetch("http://localhost:3000/api/db/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    })

    if (createUserResponse.ok) {
      const createdUser = await createUserResponse.json()
      userId = createdUser.Id || createdUser.id
      console.log(`✅ Пользователь создан с ID: ${userId}`)
      console.log(`   Телефон: ${testPhone}\n`)
    } else {
      const errorData = await createUserResponse.json()
      console.error("❌ Ошибка при создании пользователя:", errorData)
      
      // Пытаемся найти существующего пользователя
      console.log("🔍 Пытаемся найти существующего пользователя...")
      const findUserResponse = await fetch(`http://localhost:3000/api/db/users?phone=${encodeURIComponent(testPhone)}`)
      if (findUserResponse.ok) {
        const users = await findUserResponse.json()
        if (users && users.length > 0) {
          userId = users[0].Id || users[0].id
          console.log(`✅ Найден существующий пользователь с ID: ${userId}\n`)
        }
      }
    }
  } catch (error) {
    console.error("❌ Ошибка при работе с пользователем:", error)
    return
  }

  if (!userId) {
    console.error("❌ Не удалось получить userId. Прерываем тест.")
    return
  }

  // Шаг 2: Создаем тестовый заказ
  console.log("📦 Шаг 2: Создание тестового заказа...")
  const testOrder = {
    startDate: new Date().toISOString().split('T')[0],
    persons: [
      {
        day1: {
          breakfast: {
            dish: {
              id: 1,
              name: "Тестовое блюдо",
              price: 1000,
              portion: 1
            }
          },
          lunch: null,
          dinner: null
        },
        day2: {
          breakfast: null,
          lunch: null,
          dinner: null
        }
      }
    ],
    deliveryTime: "18:00-19:00",
    extras: [],
    paid: false,
    paymentMethod: "cash",
    paymentStatus: "pending",
    total: 1000, // Явно указываем сумму заказа
    subtotal: 1000,
    loyaltyPointsUsed: 0,
    loyaltyPointsEarned: 0
  }

  console.log("📦 Данные заказа:", JSON.stringify(testOrder, null, 2))
  console.log(`👤 User ID: ${userId}\n`)

  try {
    const response = await fetch("http://localhost:3000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: testOrder, userId: userId }),
    })

    console.log("📥 Статус ответа:", response.status, response.statusText)

    if (!response.ok) {
      const errorData = await response.json()
      console.error("❌ Ошибка:", errorData)
      return
    }

    const result = await response.json()
    console.log("\n✅ Результат создания заказа:")
    console.log(JSON.stringify(result, null, 2))
    
    console.log("\n💰 Начисленные баллы:", result.loyaltyPointsEarned)
    
    if (result.loyaltyPointsEarned > 0) {
      console.log("✅ Баллы успешно начислены!")
      
      // Шаг 3: Проверяем пользователя после начисления баллов
      console.log("\n🔍 Шаг 3: Проверка пользователя после начисления баллов...")
      try {
        const userResponse = await fetch(`http://localhost:3000/api/db/users/${userId}`)
        if (userResponse.ok) {
          const user = await userResponse.json()
          console.log(`✅ Текущие данные пользователя:`)
          console.log(`   - Баллы: ${user.loyalty_points || 0}`)
          console.log(`   - Потрачено: ${user.total_spent || 0} руб.`)
        }
      } catch (error) {
        console.error("❌ Ошибка при проверке пользователя:", error)
      }
    } else {
      console.log("⚠️ Баллы не начислены. Проверьте логи сервера.")
    }
  } catch (error) {
    console.error("❌ Ошибка при выполнении запроса:", error)
  }
}

// Запускаем тест
testOrderWithUser()





