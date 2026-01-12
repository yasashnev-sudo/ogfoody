// Полный тест цикла заказа с бонусами
const testFullOrderCycle = async () => {
  console.log("🧪 ========================================")
  console.log("🧪 ПОЛНЫЙ ТЕСТ ЦИКЛА ЗАКАЗА С БОНУСАМИ")
  console.log("🧪 ========================================\n")

  let userId = null
  let orderId = null

  try {
    // Шаг 1: Получаем список пользователей и используем первого или создаем нового
    console.log("📝 ШАГ 1: Поиск существующего пользователя...")
    
    try {
      // Пытаемся получить список пользователей
      const listUsersResponse = await fetch("http://localhost:3000/api/db/list-users")
      if (listUsersResponse.ok) {
        const usersData = await listUsersResponse.json()
        if (usersData.users && usersData.users.length > 0) {
          // Используем первого пользователя
          const firstUser = usersData.users[0]
          userId = firstUser.Id
          console.log(`✅ Используем существующего пользователя:`)
          console.log(`   - ID: ${userId}`)
          console.log(`   - Телефон: ${firstUser.phone}`)
          console.log(`   - Имя: ${firstUser.name}`)
          console.log(`   - Баллы: ${firstUser.loyalty_points || 0}`)
          console.log(`   - Потрачено: ${firstUser.total_spent || 0} руб.\n`)
        } else {
          console.log("⚠️ Пользователи не найдены. Создаем нового...")
          // Создаем через test-user endpoint
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
              console.log(`✅ Пользователь создан с ID: ${userId}`)
              console.log(`   Телефон: ${testPhone}\n`)
            } else {
              console.error("❌ Не удалось создать пользователя. Используйте существующего пользователя.")
              return
            }
          } else {
            console.error("❌ Не удалось создать пользователя. Используйте существующего пользователя.")
            return
          }
        }
      } else {
        console.error("❌ Не удалось получить список пользователей")
        return
      }
    } catch (error) {
      console.error("❌ Ошибка при работе с пользователем:", error)
      return
    }

    if (!userId) {
      console.error("❌ Не удалось получить userId. Прерываем тест.")
      return
    }

    // Шаг 2: Проверяем начальное состояние пользователя
    console.log("🔍 ШАГ 2: Проверка начального состояния пользователя...")
    let initialPoints = 0
    let initialSpent = 0
    try {
      const listUsersResponse = await fetch("http://localhost:3000/api/db/list-users")
      if (listUsersResponse.ok) {
        const usersData = await listUsersResponse.json()
        const user = usersData.users?.find(u => u.Id === userId)
        if (user) {
          initialPoints = user.loyalty_points || 0
          initialSpent = user.total_spent || 0
          console.log(`✅ Начальное состояние:`)
          console.log(`   - Баллы: ${initialPoints}`)
          console.log(`   - Потрачено: ${initialSpent} руб.\n`)
        }
      }
    } catch (error) {
      console.error("❌ Ошибка при проверке пользователя:", error)
    }

    // Шаг 3: Создаем тестовый заказ
    console.log("📦 ШАГ 3: Создание тестового заказа...")
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

    console.log("📦 Данные заказа:")
    console.log(`   - Сумма: ${testOrder.total} руб.`)
    console.log(`   - User ID: ${userId}`)
    console.log(`   - Оплачен: ${testOrder.paid}\n`)

    const orderResponse = await fetch("http://localhost:3000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: testOrder, userId: userId }),
    })

    console.log("📥 Статус ответа:", orderResponse.status, orderResponse.statusText)

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json()
      console.error("❌ Ошибка при создании заказа:", JSON.stringify(errorData, null, 2))
      return
    }

    const orderResult = await orderResponse.json()
    orderId = orderResult.orderId
    console.log("\n✅ Заказ создан:")
    console.log(`   - Order ID: ${orderId}`)
    console.log(`   - Order Number: ${orderResult.orderNumber}`)
    console.log(`   - Начисленные баллы: ${orderResult.loyaltyPointsEarned || 0}\n`)

    // Шаг 4: Проверяем пользователя после создания заказа
    console.log("🔍 ШАГ 4: Проверка пользователя после создания заказа...")
    await new Promise(resolve => setTimeout(resolve, 2000)) // Даем время на обработку
    
    try {
      const listUsersResponse = await fetch("http://localhost:3000/api/db/list-users")
      if (listUsersResponse.ok) {
        const usersData = await listUsersResponse.json()
        const user = usersData.users?.find(u => u.Id === userId)
        if (user) {
          const newPoints = user.loyalty_points || 0
          const newSpent = user.total_spent || 0
          console.log(`✅ Состояние пользователя после создания заказа:`)
          console.log(`   - Баллы: ${newPoints} (было: ${initialPoints}, изменение: ${newPoints - initialPoints})`)
          console.log(`   - Потрачено: ${newSpent} руб. (было: ${initialSpent}, изменение: ${newSpent - initialSpent})`)
          
          const expectedPoints = Math.floor(1000 * 0.03) // 3% кэшбэк для бронзового уровня
          const pointsAdded = newPoints - initialPoints
          
          if (pointsAdded >= expectedPoints) {
            console.log(`   ✅ Баллы начислены правильно! (добавлено ${pointsAdded}, ожидалось ${expectedPoints})`)
          } else if (pointsAdded > 0) {
            console.log(`   ⚠️ Баллы начислены частично! (добавлено ${pointsAdded}, ожидалось ${expectedPoints})`)
            console.log(`   ⚠️ Разница: ${expectedPoints - pointsAdded} баллов`)
          } else {
            console.log(`   ❌ Баллы НЕ начислены! (ожидалось ${expectedPoints})`)
            console.log(`   ❌ Проверьте логи сервера для выяснения причины`)
          }
          console.log()
        } else {
          console.log("   ⚠️ Пользователь не найден после создания заказа!")
          console.log()
        }
      }
    } catch (error) {
      console.error("❌ Ошибка при проверке пользователя:", error)
    }

    // Шаг 5: Проверяем транзакции в базе данных
    console.log("🔍 ШАГ 5: Проверка транзакций в базе данных...")
    try {
      // Пытаемся получить транзакции через API (если есть такой endpoint)
      const transactionsResponse = await fetch(`http://localhost:3000/api/db/loyalty-transactions?userId=${userId}`)
      if (transactionsResponse.ok) {
        const transactions = await transactionsResponse.json()
        console.log(`✅ Найдено транзакций: ${transactions.length || 0}`)
        if (transactions.length > 0) {
          transactions.forEach((t, i) => {
            console.log(`   Транзакция ${i + 1}:`)
            console.log(`     - Тип: ${t.transaction_type}`)
            console.log(`     - Баллы: ${t.points}`)
            console.log(`     - Описание: ${t.description}`)
            console.log(`     - Order ID: ${t.order_id || 'N/A'}`)
          })
        } else {
          console.log("   ⚠️ Транзакции не найдены!")
        }
        console.log()
      } else {
        console.log("   ℹ️ Endpoint для транзакций не доступен (это нормально)")
        console.log()
      }
    } catch (error) {
      console.log("   ℹ️ Endpoint для транзакций не доступен (это нормально)")
      console.log()
    }

    // Шаг 6: Проверяем заказ в базе данных
    console.log("🔍 ШАГ 6: Проверка заказа в базе данных...")
    try {
      const orderCheckResponse = await fetch(`http://localhost:3000/api/orders?userId=${userId}`)
      if (orderCheckResponse.ok) {
        const ordersData = await orderCheckResponse.json()
        const createdOrder = ordersData.orders?.find((o) => o.Id === orderId)
        if (createdOrder) {
          console.log(`✅ Заказ найден в базе:`)
          console.log(`   - Order ID: ${createdOrder.Id}`)
          console.log(`   - Order Number: ${createdOrder.order_number}`)
          console.log(`   - Total: ${createdOrder.total} руб.`)
          console.log(`   - Loyalty Points Earned: ${createdOrder.loyalty_points_earned || 0}`)
          console.log(`   - Loyalty Points Used: ${createdOrder.loyalty_points_used || 0}`)
          console.log(`   - User ID: ${createdOrder.user_id}`)
          
          if (createdOrder.loyalty_points_earned > 0) {
            console.log(`   ✅ Баллы записаны в заказ!`)
          } else {
            console.log(`   ⚠️ Баллы не записаны в заказ!`)
          }
          console.log()
        } else {
          console.log("   ⚠️ Заказ не найден в базе данных!")
          console.log()
        }
      }
    } catch (error) {
      console.error("❌ Ошибка при проверке заказа:", error)
    }

    // Итоговый отчет
    console.log("📊 ========================================")
    console.log("📊 ИТОГОВЫЙ ОТЧЕТ")
    console.log("📊 ========================================")
    console.log(`✅ Пользователь создан: ${userId ? 'Да' : 'Нет'}`)
    console.log(`✅ Заказ создан: ${orderId ? 'Да' : 'Нет'}`)
    console.log(`✅ Баллы начислены: ${orderResult.loyaltyPointsEarned > 0 ? 'Да' : 'Нет'} (${orderResult.loyaltyPointsEarned || 0})`)
    console.log("\n💡 Проверьте логи сервера для детальной информации о начислении баллов.")
    console.log("💡 Ожидаемое количество баллов: 30 (3% от 1000 руб. для бронзового уровня)\n")

  } catch (error) {
    console.error("❌ Критическая ошибка:", error)
    console.error("Stack:", error.stack)
  }
}

// Запускаем тест
testFullOrderCycle()

