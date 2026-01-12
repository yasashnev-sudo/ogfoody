import { NextResponse } from "next/server"
import {
  fetchUserByPhone,
  fetchUserById,
  createUser,
  updateUser,
} from "@/lib/nocodb"

export async function POST(request: Request) {
  const body = await request.json()
  const { phone, testType, userId: bodyUserId } = body as {
    phone?: string
    testType?: "create" | "fetch" | "update" | "all"
    userId?: number
  }

  const results: { tests: any[] } = { tests: [] }

  // Test 1: Fetch User by Phone
  if (!testType || testType === "fetch" || testType === "all") {
    console.log("🧪 Тест 1: Получение пользователя по телефону")
    if (!phone) {
      results.tests.push({
        name: "Получение пользователя по телефону",
        success: false,
        error: "Не указан телефон для поиска",
      })
    } else {
      try {
        const user = await fetchUserByPhone(phone)
        if (!user) {
          results.tests.push({
            name: "Получение пользователя по телефону",
            success: false,
            error: "Пользователь не найден",
            phone,
          })
        } else {
          console.log(`✅ Пользователь найден: ID=${user.Id}, phone=${user.phone}, name=${user.name}`)
          console.log(`📊 Все поля пользователя:`, Object.keys(user))
          results.tests.push({
            name: "Получение пользователя по телефону",
            success: true,
            userId: user.Id,
            phone: user.phone,
            name: user.name,
            loyalty_points: user.loyalty_points,
            total_spent: user.total_spent,
            created_at: user.created_at,
            updated_at: user.updated_at,
            allFields: Object.keys(user),
          })
        }
      } catch (error) {
        console.error("❌ Ошибка при получении пользователя:", error)
        results.tests.push({
          name: "Получение пользователя по телефону",
          success: false,
          error: `Ошибка: ${error instanceof Error ? error.message : String(error)}`,
          phone,
        })
      }
    }
  }

  // Test 2: Fetch User by ID
  if ((!testType || testType === "fetch" || testType === "all") && bodyUserId) {
    console.log("🧪 Тест 2: Получение пользователя по ID")
    try {
      const user = await fetchUserById(bodyUserId)
      if (!user) {
        results.tests.push({
          name: "Получение пользователя по ID",
          success: false,
          error: "Пользователь не найден",
          userId: bodyUserId,
        })
      } else {
        console.log(`✅ Пользователь найден: ID=${user.Id}, phone=${user.phone}, name=${user.name}`)
        results.tests.push({
          name: "Получение пользователя по ID",
          success: true,
          userId: user.Id,
          phone: user.phone,
          name: user.name,
          loyalty_points: user.loyalty_points,
          total_spent: user.total_spent,
        })
      }
    } catch (error) {
      console.error("❌ Ошибка при получении пользователя по ID:", error)
      results.tests.push({
        name: "Получение пользователя по ID",
        success: false,
        error: `Ошибка: ${error instanceof Error ? error.message : String(error)}`,
        userId: bodyUserId,
      })
    }
  }

  // Test 3: Create User
  if (!testType || testType === "create" || testType === "all") {
    console.log("🧪 Тест 3: Создание пользователя")
    if (!phone) {
      results.tests.push({
        name: "Создание пользователя",
        success: false,
        error: "Не указан телефон для создания пользователя",
      })
    } else {
      // Проверяем, существует ли пользователь
      const existingUser = await fetchUserByPhone(phone)
      if (existingUser) {
        results.tests.push({
          name: "Создание пользователя",
          success: false,
          error: "Пользователь уже существует",
          userId: existingUser.Id,
          phone: existingUser.phone,
          note: "Используйте другой телефон для создания нового пользователя",
        })
      } else {
        try {
          const testPhone = `+7${Math.floor(Math.random() * 10000000000)}`
          const newUser = await createUser({
            phone: testPhone,
            name: `Тестовый пользователь ${Date.now()}`,
            loyalty_points: 0,
            total_spent: 0,
          })
          console.log("✅ Пользователь создан:", newUser)
          results.tests.push({
            name: "Создание пользователя",
            success: true,
            userId: newUser.Id,
            phone: newUser.phone,
            name: newUser.name,
            loyalty_points: newUser.loyalty_points,
            total_spent: newUser.total_spent,
            created_at: newUser.created_at,
            updated_at: newUser.updated_at,
            note: "Создан тестовый пользователь с случайным телефоном",
          })
        } catch (error) {
          console.error("❌ Ошибка при создании пользователя:", error)
          results.tests.push({
            name: "Создание пользователя",
            success: false,
            error: `Ошибка: ${error instanceof Error ? error.message : String(error)}`,
          })
        }
      }
    }
  }

  // Test 4: Update User
  if (!testType || testType === "update" || testType === "all") {
    console.log("🧪 Тест 4: Обновление пользователя")
    if (!phone && !bodyUserId) {
      results.tests.push({
        name: "Обновление пользователя",
        success: false,
        error: "Не указан телефон или ID для обновления пользователя",
      })
    } else {
      let testUser = null
      if (phone) {
        testUser = await fetchUserByPhone(phone)
      } else if (bodyUserId) {
        testUser = await fetchUserById(bodyUserId)
      }

      if (!testUser) {
        results.tests.push({
          name: "Обновление пользователя",
          success: false,
          error: "Пользователь не найден для обновления",
        })
      } else {
        const beforeLoyaltyPoints = testUser.loyalty_points
        const beforeTotalSpent = testUser.total_spent
        const now = new Date().toISOString()

        try {
          const updatedUser = await updateUser(testUser.Id, {
            loyalty_points: (typeof beforeLoyaltyPoints === 'number' ? beforeLoyaltyPoints : parseInt(String(beforeLoyaltyPoints)) || 0) + 10,
            total_spent: (typeof beforeTotalSpent === 'number' ? beforeTotalSpent : parseFloat(String(beforeTotalSpent)) || 0) + 100.5,
            updated_at: now,
          })

          console.log(`✅ Пользователь обновлен: ID=${updatedUser.Id}`)
          console.log(`📊 Новые значения: loyalty_points=${updatedUser.loyalty_points}, total_spent=${updatedUser.total_spent}`)

          results.tests.push({
            name: "Обновление пользователя",
            success: true,
            userId: updatedUser.Id,
            phone: updatedUser.phone,
            before: {
              loyalty_points: beforeLoyaltyPoints,
              total_spent: beforeTotalSpent,
            },
            after: {
              loyalty_points: updatedUser.loyalty_points,
              total_spent: updatedUser.total_spent,
              updated_at: updatedUser.updated_at,
            },
          })
        } catch (error) {
          console.error("❌ Ошибка при обновлении пользователя:", error)
          results.tests.push({
            name: "Обновление пользователя",
            success: false,
            error: `Ошибка: ${error instanceof Error ? error.message : String(error)}`,
            userId: testUser.Id,
          })
        }
      }
    }
  }

  return NextResponse.json(results)
}




