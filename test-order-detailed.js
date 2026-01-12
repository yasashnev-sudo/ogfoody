// Детальный тест заказа с проверкой всех аспектов
const testOrderDetailed = async () => {
  console.log("🧪 ========================================")
  console.log("🧪 ДЕТАЛЬНЫЙ ТЕСТ ЗАКАЗА С БОНУСАМИ")
  console.log("🧪 ========================================\n")

  let userId = null

  try {
    // Получаем существующего пользователя
    console.log("📝 ШАГ 1: Получение пользователя...")
    const listUsersResponse = await fetch("http://localhost:3000/api/db/list-users")
    if (listUsersResponse.ok) {
      const usersData = await listUsersResponse.json()
      if (usersData.users && usersData.users.length > 0) {
        const firstUser = usersData.users[0]
        userId = firstUser.Id
        console.log(`✅ Пользователь: ID=${userId}, Баллы=${firstUser.loyalty_points || 0}, Потрачено=${firstUser.total_spent || 0} руб.\n`)
      } else {
        console.error("❌ Пользователи не найдены")
        return
      }
    } else {
      console.error("❌ Не удалось получить список пользователей")
      return
    }

    // Создаем заказ с разными вариантами
    const testCases = [
      { name: "Заказ на 500 руб.", total: 500, expectedPoints: 15 },
      { name: "Заказ на 1000 руб.", total: 1000, expectedPoints: 30 },
      { name: "Заказ на 2000 руб.", total: 2000, expectedPoints: 60 },
    ]

    for (const testCase of testCases) {
      console.log(`\n📦 ТЕСТ: ${testCase.name}`)
      console.log("=".repeat(50))
      
      const testOrder = {
        startDate: new Date().toISOString().split('T')[0],
        persons: [
          {
            day1: {
              breakfast: {
                dish: {
                  id: 1,
                  name: "Тестовое блюдо",
                  price: testCase.total,
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
        total: testCase.total,
        subtotal: testCase.total,
        loyaltyPointsUsed: 0,
        loyaltyPointsEarned: 0
      }

      // Получаем начальное состояние
      const beforeResponse = await fetch("http://localhost:3000/api/db/list-users")
      const beforeData = await beforeResponse.json()
      const beforeUser = beforeData.users?.find(u => u.Id === userId)
      const beforePoints = beforeUser?.loyalty_points || 0

      console.log(`📤 Создание заказа на ${testCase.total} руб.`)
      console.log(`   Начальные баллы: ${beforePoints}`)

      const orderResponse = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: testOrder, userId: userId }),
      })

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json()
        console.error(`❌ Ошибка: ${JSON.stringify(errorData)}`)
        continue
      }

      const orderResult = await orderResponse.json()
      console.log(`✅ Заказ создан: ID=${orderResult.orderId}, Баллы в ответе=${orderResult.loyaltyPointsEarned || 0}`)

      // Ждем обработки
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Проверяем конечное состояние
      const afterResponse = await fetch("http://localhost:3000/api/db/list-users")
      const afterData = await afterResponse.json()
      const afterUser = afterData.users?.find(u => u.Id === userId)
      const afterPoints = afterUser?.loyalty_points || 0
      const pointsAdded = afterPoints - beforePoints

      console.log(`📊 Результат:`)
      console.log(`   Конечные баллы: ${afterPoints}`)
      console.log(`   Добавлено баллов: ${pointsAdded}`)
      console.log(`   Ожидалось: ${testCase.expectedPoints}`)

      if (pointsAdded === testCase.expectedPoints) {
        console.log(`   ✅ УСПЕХ! Баллы начислены правильно`)
      } else if (pointsAdded > 0) {
        console.log(`   ⚠️ ЧАСТИЧНЫЙ УСПЕХ! Начислено ${pointsAdded}, ожидалось ${testCase.expectedPoints}`)
      } else {
        console.log(`   ❌ ОШИБКА! Баллы не начислены`)
      }
    }

    console.log("\n📊 ========================================")
    console.log("📊 ИТОГОВЫЙ ОТЧЕТ")
    console.log("📊 ========================================")
    console.log("💡 Проверьте логи сервера для детальной информации")
    console.log("💡 Обратите внимание на:")
    console.log("   - Логи '🔍 Проверка начисления баллов'")
    console.log("   - Логи '📊 Данные для расчета баллов'")
    console.log("   - Логи '💰 Рассчитано баллов'")
    console.log("   - Логи '💾 Создание транзакции'")
    console.log("   - Логи '✅ Начислено X баллов'")
    console.log("\n")

  } catch (error) {
    console.error("❌ Критическая ошибка:", error)
    console.error("Stack:", error.stack)
  }
}

testOrderDetailed()





