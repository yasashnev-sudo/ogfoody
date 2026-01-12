#!/usr/bin/env node

/**
 * Тестовый скрипт для проверки флоу начисления баллов лояльности
 * 
 * Сценарий:
 * 1. Получить существующего пользователя
 * 2. Создать заказ БЕЗ paymentMethod
 * 3. Оплатить заказ онлайн (PATCH с paymentMethod: "card")
 * 4. Проверить, что баллы начислились
 */

const BASE_URL = 'http://localhost:3000'

// Цветные логи для консоли
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
}

function log(emoji, color, message, data = null) {
  console.log(`${color}${emoji} ${message}${colors.reset}`)
  if (data) {
    console.log(JSON.stringify(data, null, 2))
  }
}

function logSection(title) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`${colors.bright}${colors.cyan}${title}${colors.reset}`)
  console.log(`${'='.repeat(60)}\n`)
}

function logSuccess(message, data = null) {
  log('✅', colors.green, message, data)
}

function logError(message, data = null) {
  log('❌', colors.red, message, data)
}

function logInfo(message, data = null) {
  log('ℹ️ ', colors.blue, message, data)
}

function logWarning(message, data = null) {
  log('⚠️ ', colors.yellow, message, data)
}

function logDebug(message, data = null) {
  log('🔍', colors.magenta, message, data)
}

async function makeRequest(method, url, body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  logDebug(`${method} ${url}`)
  if (body) {
    logDebug('Request body:', body)
  }

  const response = await fetch(url, options)
  const data = await response.json()

  if (!response.ok) {
    logError(`HTTP ${response.status}`, data)
    throw new Error(`HTTP ${response.status}: ${JSON.stringify(data)}`)
  }

  return data
}

async function getOrCreateUser() {
  logSection('ШАГ 1: Получение пользователя')

  try {
    // Пытаемся получить список пользователей через db endpoint
    const usersData = await makeRequest('GET', `${BASE_URL}/api/db/list-users`)
    
    if (usersData.users && usersData.users.length > 0) {
      // Берем первого пользователя с номером телефона
      const user = usersData.users.find(u => u.phone)
      
      if (user) {
        // Получаем район из _raw если есть
        const district = user._raw?.District || user._raw?.district || user.District || user.district || 'Неизвестно'
        
        logSuccess('Найден существующий пользователь:', {
          id: user.Id,
          phone: user.phone,
          name: user.name,
          district: district,
          loyaltyPoints: user.loyalty_points || 0,
          totalSpent: user.total_spent || 0,
        })
        
        // Добавляем район в объект пользователя для дальнейшего использования
        user.District = district
        
        return user
      }
    }

    // Если пользователей нет, выводим предупреждение
    logWarning('Нет пользователей в базе данных')
    logWarning('Создайте пользователя через UI')
    throw new Error('No users found in database. Please create a user first.')
  } catch (error) {
    logError('Ошибка при получении пользователя:', error.message)
    throw error
  }
}

function createOrderPayload(userId) {
  // Получаем дату завтра и послезавтра для заказа
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const startDate = tomorrow.toISOString().split('T')[0]

  return {
    userId: userId,
    order: {
      startDate: startDate,
      deliveryTime: '12:00-15:00',
      subtotal: 1000,
      total: 1000,
      // ⚠️ ВАЖНО: НЕ передаем paymentMethod - имитируем создание заказа до оплаты
      paid: false,
      paymentStatus: 'pending',
      loyaltyPointsUsed: 0,
      loyaltyPointsEarned: 0,
      persons: [
        {
          id: 1,
          day1: {
            breakfast: {
              dish: {
                id: 1,
                name: 'Тестовое блюдо на завтрак',
                portion: 'single',
                price: 250,
                prices: { single: 250, medium: 300, large: 350 }
              }
            },
            lunch: {
              salad: {
                id: 2,
                name: 'Тестовый салат',
                portion: 'single',
                price: 150,
                prices: { single: 150, medium: 200, large: 250 }
              },
              main: {
                id: 3,
                name: 'Тестовое основное блюдо',
                portion: 'single',
                price: 300,
                prices: { single: 300, medium: 400, large: 500 }
              }
            },
            dinner: {
              main: {
                id: 4,
                name: 'Тестовый ужин',
                portion: 'single',
                price: 300,
                prices: { single: 300, medium: 400, large: 500 }
              }
            }
          }
        }
      ],
      extras: []
    }
  }
}

async function createOrder(userId) {
  logSection('ШАГ 2: Создание заказа БЕЗ способа оплаты')

  try {
    const payload = createOrderPayload(userId)
    
    logInfo('Создаем заказ на сумму 1000₽ БЕЗ paymentMethod')
    logDebug('Payload:', {
      userId: payload.userId,
      startDate: payload.order.startDate,
      deliveryTime: payload.order.deliveryTime,
      subtotal: payload.order.subtotal,
      total: payload.order.total,
      paymentMethod: payload.order.paymentMethod || 'НЕ УКАЗАН',
      paid: payload.order.paid,
      personsCount: payload.order.persons.length,
    })

    const response = await makeRequest('POST', `${BASE_URL}/api/orders`, payload)

    logSuccess('Заказ создан!', {
      orderId: response.orderId,
      orderNumber: response.orderNumber,
      total: response.order?.total,
      subtotal: response.order?.subtotal,
      deliveryFee: response.order?.deliveryFee,
      loyaltyPointsEarned: response.loyaltyPointsEarned,
      loyaltyPointsStatus: response.loyaltyPointsStatus,
    })

    // Проверка: баллы НЕ должны быть начислены
    if (response.loyaltyPointsEarned === 0 || !response.loyaltyPointsEarned) {
      logSuccess('✓ Баллы НЕ начислены (как ожидалось, т.к. нет способа оплаты)')
    } else {
      logWarning(`⚠ Баллы начислены: ${response.loyaltyPointsEarned} (неожиданно!)`)
    }

    return response
  } catch (error) {
    logError('Ошибка при создании заказа:', error.message)
    throw error
  }
}

async function payOrder(orderId, userId) {
  logSection('ШАГ 3: Оплата заказа онлайн (card)')

  try {
    const now = new Date().toISOString()
    
    const payload = {
      paymentMethod: 'card',
      paid: true,
      paymentStatus: 'paid',
      paidAt: now,
    }

    logInfo(`Оплачиваем заказ ${orderId} картой`)
    logDebug('Payload:', payload)

    const response = await makeRequest('PATCH', `${BASE_URL}/api/orders/${orderId}`, payload)

    logSuccess('Заказ оплачен!', {
      orderId: response.order?.Id,
      orderNumber: response.orderNumber,
      paid: response.order?.paid,
      paymentMethod: response.order?.payment_method,
      loyaltyPointsEarned: response.loyaltyPointsEarned,
      userProfile: response.userProfile,
    })

    // Проверка: баллы ДОЛЖНЫ быть начислены
    if (response.loyaltyPointsEarned > 0) {
      logSuccess(`✓ Баллы начислены: ${response.loyaltyPointsEarned}`)
    } else {
      logWarning('⚠ Баллы НЕ начислены (проблема!)')
    }

    // Проверка: userProfile должен содержать обновленные баллы
    if (response.userProfile) {
      logSuccess('✓ Получен обновленный профиль пользователя:', {
        loyaltyPoints: response.userProfile.loyaltyPoints,
        totalSpent: response.userProfile.totalSpent,
      })
    } else {
      logWarning('⚠ userProfile не вернулся в ответе')
    }

    return response
  } catch (error) {
    logError('Ошибка при оплате заказа:', error.message)
    throw error
  }
}

async function checkUserBalance(userId) {
  logSection('ШАГ 4: Проверка баланса пользователя')

  try {
    // Используем эндпоинт для получения баланса
    const response = await makeRequest('GET', `${BASE_URL}/api/users/${userId}/balance`)
    
    logSuccess('Текущий баланс пользователя:', {
      id: userId,
      loyaltyPoints: response.balance,
      totalSpent: response.totalSpent,
    })

    return {
      Id: userId,
      loyalty_points: response.balance,
      total_spent: response.totalSpent,
    }
  } catch (error) {
    logError('Ошибка при проверке баланса:', error.message)
    throw error
  }
}

async function main() {
  console.log(`${colors.bright}${colors.cyan}`)
  console.log('╔═══════════════════════════════════════════════════════════╗')
  console.log('║     ТЕСТ ФЛОУ НАЧИСЛЕНИЯ БАЛЛОВ ЛОЯЛЬНОСТИ               ║')
  console.log('╚═══════════════════════════════════════════════════════════╝')
  console.log(colors.reset)

  try {
    // Шаг 1: Получить пользователя
    const user = await getOrCreateUser()
    const initialBalance = user.loyalty_points || 0
    const initialTotalSpent = user.total_spent || 0

    logInfo(`Начальный баланс: ${initialBalance} баллов`)
    logInfo(`Общая сумма покупок: ${initialTotalSpent}₽`)

    // Шаг 2: Создать заказ БЕЗ способа оплаты
    const createResponse = await createOrder(user.Id)
    const orderId = createResponse.orderId

    // Небольшая пауза для обработки на сервере
    await new Promise(resolve => setTimeout(resolve, 500))

    // Шаг 3: Оплатить заказ
    const payResponse = await payOrder(orderId, user.Id)

    // Небольшая пауза для обработки на сервере
    await new Promise(resolve => setTimeout(resolve, 500))

    // Шаг 4: Проверить баланс
    const updatedUser = await checkUserBalance(user.Id)
    const finalBalance = updatedUser.loyalty_points || 0
    const finalTotalSpent = updatedUser.total_spent || 0

    // Финальный отчет
    logSection('ИТОГОВЫЙ ОТЧЕТ')

    const balanceDiff = finalBalance - initialBalance
    const spentDiff = finalTotalSpent - initialTotalSpent

    console.log(`${colors.bright}Баланс баллов:${colors.reset}`)
    console.log(`  Было:    ${initialBalance}`)
    console.log(`  Стало:   ${finalBalance}`)
    console.log(`  ${balanceDiff > 0 ? colors.green : colors.red}Изменение: ${balanceDiff > 0 ? '+' : ''}${balanceDiff}${colors.reset}\n`)

    console.log(`${colors.bright}Общая сумма покупок:${colors.reset}`)
    console.log(`  Было:    ${initialTotalSpent}₽`)
    console.log(`  Стало:   ${finalTotalSpent}₽`)
    console.log(`  ${spentDiff > 0 ? colors.green : colors.red}Изменение: ${spentDiff > 0 ? '+' : ''}${spentDiff}₽${colors.reset}\n`)

    // Проверка результата
    if (balanceDiff > 0) {
      logSuccess(`ТЕСТ ПРОЙДЕН! Баллы успешно начислены (+${balanceDiff})`)
    } else {
      logError(`ТЕСТ ПРОВАЛЕН! Баллы не начислены (изменение: ${balanceDiff})`)
      logWarning('Проверьте логи сервера с эмодзи 🔍 для отладки')
    }

    // Информация о заказе
    console.log(`\n${colors.bright}Информация о созданном заказе:${colors.reset}`)
    console.log(`  ID заказа:     ${orderId}`)
    console.log(`  Номер заказа:  ${createResponse.orderNumber}`)
    console.log(`  Сумма:         ${createResponse.order?.total}₽`)
    console.log(`  Начислено:     ${payResponse.loyaltyPointsEarned || 0} баллов`)

  } catch (error) {
    logError('КРИТИЧЕСКАЯ ОШИБКА:', error.message)
    if (error.stack) {
      console.log(`${colors.red}${error.stack}${colors.reset}`)
    }
    process.exit(1)
  }

  console.log(`\n${colors.green}${'='.repeat(60)}${colors.reset}`)
  console.log(`${colors.green}Тест завершен${colors.reset}`)
  console.log(`${colors.green}${'='.repeat(60)}${colors.reset}\n`)
}

// Запуск
main().catch(error => {
  console.error(`${colors.red}Unhandled error:${colors.reset}`, error)
  process.exit(1)
})

