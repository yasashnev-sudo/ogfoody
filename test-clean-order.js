// Тест с чистым пользователем для проверки начисления баллов
const testCleanOrder = async () => {
  console.log("🧪 ========================================")
  console.log("🧪 ТЕСТ С ЧИСТЫМ ПОЛЬЗОВАТЕЛЕМ")
  console.log("🧪 ========================================\n")

  let userId = null

  try {
    // Создаем нового пользователя
    console.log("📝 Создание нового пользователя...")
    const testPhone = `+7${Math.floor(Math.random() * 9000000000 + 1000000000)}`
    
    const createUserResponse = await fetch("http://localhost:3000/api/db/test-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        phone: testPhone,
        testType: "create"
      }),
    })

    if (createUserResponse.ok) {
      const result = await createUserResponse.json()
      const testResult = result.tests?.find(t => t.name === "Создание пользователя")
      if (testResult && testResult.success) {
        userId = testResult.userId
        console.log(`✅ Пользователь создан: ID=${userId}, Баллы=${testResult.loyalty_points}, Потрачено=${testResult.total_spent} руб.\n`)
      } else {
        console.error("❌ Не удалось создать пользователя")
        return
      }
    } else {
      console.error("❌ Ошибка при создании пользователя")
      return
    }

    // Создаем заказ
    console.log("📦 Создание заказа на 1000 руб...")
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
      total: 1000,
      subtotal: 1000,
      loyaltyPointsUsed: 0,
      loyaltyPointsEarned: 0
    }

    const orderResponse = await fetch("http://localhost:3000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: testOrder, userId: userId }),
    })

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json()
      console.error("❌ Ошибка при создании заказа:", errorData)
      return
    }

    const orderResult = await orderResponse.json()
    console.log(`✅ Заказ создан: ID=${orderResult.orderId}, Баллы в ответе=${orderResult.loyaltyPointsEarned}\n`)

    // Ждем обработки
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Проверяем пользователя
    console.log("🔍 Проверка пользователя после создания заказа...")
    const listUsersResponse = await fetch("http://localhost:3000/api/db/list-users")
    if (listUsersResponse.ok) {
      const usersData = await listUsersResponse.json()
      const user = usersData.users?.find(u => u.Id === userId)
      if (user) {
        console.log(`✅ Финальное состояние:`)
        console.log(`   - Баллы: ${user.loyalty_points || 0}`)
        console.log(`   - Потрачено: ${user.total_spent || 0} руб.`)
        
        const expectedPoints = 30 // 3% от 1000
        if (user.loyalty_points >= expectedPoints) {
          console.log(`   ✅ Баллы начислены правильно! (${user.loyalty_points} >= ${expectedPoints})`)
        } else {
          console.log(`   ❌ Баллы НЕ начислены! (${user.loyalty_points} < ${expectedPoints})`)
        }
        
        if (user.total_spent >= 1000) {
          console.log(`   ✅ Total spent обновлен правильно! (${user.total_spent} >= 1000)`)
        } else {
          console.log(`   ❌ Total spent НЕ обновлен! (${user.total_spent} < 1000)`)
        }
      }
    }

    console.log("\n💡 Проверьте логи сервера для детальной информации")

  } catch (error) {
    console.error("❌ Критическая ошибка:", error)
  }
}

testCleanOrder()





