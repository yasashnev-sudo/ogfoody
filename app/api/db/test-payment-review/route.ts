// Тестовый endpoint для проверки обновления статуса оплаты и создания отзыва

import { NextResponse } from "next/server"
import { 
  fetchOrderByNumber, 
  updateOrder, 
  createReview,
  fetchUserByPhone,
  fetchOrderById
} from "@/lib/nocodb"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { orderNumber, phone, testType, orderId } = body as { 
      orderNumber?: string
      phone?: string
      testType?: "payment" | "review" | "both"
      orderId?: number
    }

    const results: any = {
      success: true,
      tests: [],
    }

    // Тест 1: Обновление статуса оплаты
    if (!testType || testType === "payment" || testType === "both") {
      console.log("🧪 Тест 1: Обновление статуса оплаты заказа")
      
      let testOrder = null
      
      // Ищем заказ по номеру, если указан
      if (orderNumber) {
        console.log(`📋 Ищем заказ по номеру: ${orderNumber}`)
        testOrder = await fetchOrderByNumber(orderNumber)
        if (!testOrder) {
          results.tests.push({
            name: "Обновление статуса оплаты",
            success: false,
            error: `Заказ с номером ${orderNumber} не найден`,
          })
        } else {
          console.log(`✅ Заказ найден: ID=${testOrder.Id}, номер=${testOrder.order_number}`)
        }
      } else {
        // Ищем заказ по ID если передан в body
        if (body.orderId) {
          testOrder = await fetchOrderById(body.orderId)
          if (testOrder) {
            console.log(`✅ Заказ найден по ID: ID=${testOrder.Id}, номер=${testOrder.order_number}`)
          }
        }
        
        if (!testOrder) {
          results.tests.push({
            name: "Обновление статуса оплаты",
            success: false,
            error: "Не указан номер заказа или ID заказа для тестирования",
          })
        }
      }

      if (testOrder) {
        const now = new Date().toISOString()
        const beforeStatus = testOrder.payment_status
        const beforePaid = testOrder.paid

        console.log(`📝 Текущий статус: payment_status=${beforeStatus}, paid=${beforePaid}`)
        console.log(`🔄 Обновляем статус на: payment_status=paid, paid=true`)

        const updatedOrder = await updateOrder(testOrder.Id, {
          paid: true,
          paid_at: now,
          payment_method: "card",
          payment_status: "paid",
          updated_at: now,
        })

        console.log(`✅ Заказ обновлен: ID=${updatedOrder.Id}`)
        console.log(`📊 Новый статус: payment_status=${updatedOrder.payment_status}, paid=${updatedOrder.paid}`)

        results.tests.push({
          name: "Обновление статуса оплаты",
          success: true,
          orderId: testOrder.Id,
          orderNumber: testOrder.order_number,
          before: {
            payment_status: beforeStatus,
            paid: beforePaid,
          },
          after: {
            payment_status: updatedOrder.payment_status,
            paid: updatedOrder.paid,
            paid_at: updatedOrder.paid_at,
          },
        })
      }
    }

    // Тест 2: Создание отзыва
    if (!testType || testType === "review" || testType === "both") {
      console.log("🧪 Тест 2: Создание отзыва")
      
      let testOrder = null
      let testUser = null

      // Ищем заказ
      if (orderNumber) {
        testOrder = await fetchOrderByNumber(orderNumber)
      } else if (body.orderId) {
        testOrder = await fetchOrderById(body.orderId)
      }

      if (!testOrder) {
        results.tests.push({
          name: "Создание отзыва",
          success: false,
          error: "Не найден заказ для создания отзыва",
        })
      } else {
        console.log(`✅ Заказ для отзыва: ID=${testOrder.Id}, номер=${testOrder.order_number}`)
        console.log(`🔍 Все поля заказа:`, Object.keys(testOrder))
        console.log(`🔍 testOrder.user_id:`, testOrder.user_id)
        console.log(`🔍 testOrder['User ID']:`, (testOrder as any)["User ID"])

        // Ищем пользователя
        // user_id может быть в разных форматах (user_id или User ID)
        const userId = testOrder.user_id || (testOrder as any)["User ID"] || (testOrder as any)["user_id"]
        console.log(`🔍 User ID из заказа: ${userId}, тип: ${typeof userId}`)
        
        if (phone) {
          console.log(`📞 Ищем пользователя по телефону: ${phone}`)
          testUser = await fetchUserByPhone(phone)
        } else if (userId !== undefined && userId !== null) {
          // Если у заказа есть user_id, используем его
          const userIdNum = typeof userId === 'string' ? parseInt(userId) : Number(userId)
          console.log(`👤 Ищем пользователя по ID: ${userIdNum}`)
          const { fetchUserById } = await import("@/lib/nocodb")
          try {
            testUser = await fetchUserById(userIdNum)
            console.log(`✅ Пользователь найден:`, testUser ? `ID=${testUser.Id}, phone=${testUser.phone}` : "не найден")
          } catch (error) {
            console.error(`❌ Ошибка при поиске пользователя:`, error)
          }
        } else {
          console.log(`⚠️ User ID не найден в заказе. Поля заказа:`, Object.keys(testOrder))
        }

        // Если пользователь не найден, но есть userId из заказа, создаем отзыв напрямую
        if (!testUser && userId !== undefined && userId !== null && userId !== 0) {
          console.log(`⚠️ Пользователь не найден через fetchUserById, но есть userId=${userId}, создаем отзыв напрямую`)
          const userIdNum = typeof userId === 'string' ? parseInt(userId) : Number(userId)
          
          const testReview = {
            order_id: testOrder.Id,
            user_id: userIdNum,
            rating: 5,
            text: `Тестовый отзыв от ${new Date().toLocaleString("ru-RU")}`,
          }

          console.log(`📝 Создаем отзыв напрямую:`, testReview)

          try {
            const createdReview = await createReview(testReview)
            console.log(`✅ Отзыв создан: ID=${createdReview.Id}`)

            results.tests.push({
              name: "Создание отзыва",
              success: true,
              reviewId: createdReview.Id,
              orderId: testOrder.Id,
              orderNumber: testOrder.order_number,
              userId: userIdNum,
              review: {
                rating: createdReview.rating,
                text: createdReview.text,
                created_at: createdReview.created_at,
              },
              note: "Отзыв создан напрямую с user_id из заказа",
            })
          } catch (error) {
            console.error(`❌ Ошибка при создании отзыва:`, error)
            results.tests.push({
              name: "Создание отзыва",
              success: false,
              error: `Ошибка создания отзыва: ${error instanceof Error ? error.message : String(error)}`,
              orderId: testOrder.Id,
            })
          }
        } else if (!testUser) {
          results.tests.push({
            name: "Создание отзыва",
            success: false,
            error: "Не найден пользователь для создания отзыва",
            orderId: testOrder.Id,
            userId: userId,
          })
        } else {
          console.log(`✅ Пользователь для отзыва: ID=${testUser.Id}, phone=${testUser.phone}`)

          const testReview = {
            order_id: testOrder.Id,
            user_id: testUser.Id,
            rating: 5,
            text: `Тестовый отзыв от ${new Date().toLocaleString("ru-RU")}`,
          }

          console.log(`📝 Создаем отзыв:`, testReview)

          const createdReview = await createReview(testReview)

          console.log(`✅ Отзыв создан: ID=${createdReview.Id}`)

          results.tests.push({
            name: "Создание отзыва",
            success: true,
            reviewId: createdReview.Id,
            orderId: testOrder.Id,
            orderNumber: testOrder.order_number,
            userId: testUser.Id,
            review: {
              rating: createdReview.rating,
              text: createdReview.text,
              created_at: createdReview.created_at,
            },
          })
        }
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("❌ Ошибка при тестировании:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

