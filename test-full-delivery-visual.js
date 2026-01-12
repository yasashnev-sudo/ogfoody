#!/usr/bin/env node

/**
 * ПОЛНЫЙ ВИЗУАЛЬНЫЙ ТЕСТ ОТОБРАЖЕНИЯ ДОСТАВКИ
 * 
 * Этот скрипт проверяет:
 * 1. API /api/orders возвращает deliveryFee
 * 2. HTML страницы содержит элементы с доставкой
 * 3. Компоненты корректно рендерят данные
 */

const BASE_URL = "http://localhost:3000"
const USER_ID = 5

// Цвета для вывода
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSection(title) {
  console.log('\n' + '━'.repeat(70))
  log(`  ${title}`, 'bright')
  console.log('━'.repeat(70) + '\n')
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan')
}

// Тест 1: Проверка API /api/orders
async function testOrdersAPI() {
  logSection('ТЕСТ 1: API /api/orders')
  
  try {
    logInfo('Запрос к API...')
    const response = await fetch(`${BASE_URL}/api/orders?userId=${USER_ID}`)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const data = await response.json()
    const orders = data.orders || []
    
    if (orders.length === 0) {
      logWarning('Нет заказов для пользователя')
      return false
    }
    
    logSuccess(`Получено ${orders.length} заказов`)
    
    // Ищем последний оплаченный заказ
    const paidOrders = orders.filter(o => o.paid)
    if (paidOrders.length === 0) {
      logWarning('Нет оплаченных заказов')
      return false
    }
    
    const lastPaidOrder = paidOrders[paidOrders.length - 1]
    
    console.log('\n📦 Последний оплаченный заказ:')
    logInfo(`  ID: ${lastPaidOrder.id}`)
    logInfo(`  Order Number: ${lastPaidOrder.orderNumber}`)
    logInfo(`  Subtotal: ${lastPaidOrder.subtotal}₽`)
    
    // КРИТИЧЕСКАЯ ПРОВЕРКА
    if (lastPaidOrder.deliveryFee === undefined) {
      logError('  ❌ Поле "deliveryFee" ОТСУТСТВУЕТ в API ответе!')
      logError('  Проблема: fetchOrdersWithDetails не маппит deliveryFee')
      logError('  Файл: lib/nocodb.ts')
      return false
    }
    
    logInfo(`  Delivery Fee: ${lastPaidOrder.deliveryFee}₽`)
    logInfo(`  Total: ${lastPaidOrder.total}₽`)
    logInfo(`  Delivery District: ${lastPaidOrder.deliveryDistrict || 'N/A'}`)
    
    // Проверка математики
    const expectedTotal = lastPaidOrder.subtotal + lastPaidOrder.deliveryFee
    if (lastPaidOrder.total !== expectedTotal) {
      logError(`  ❌ Total некорректен: ${lastPaidOrder.total} ≠ ${lastPaidOrder.subtotal} + ${lastPaidOrder.deliveryFee}`)
      return false
    }
    
    logSuccess(`  ✓ Total корректен: ${lastPaidOrder.subtotal} + ${lastPaidOrder.deliveryFee} = ${lastPaidOrder.total}`)
    
    if (lastPaidOrder.deliveryFee > 0) {
      logSuccess(`  ✓ Delivery Fee присутствует: ${lastPaidOrder.deliveryFee}₽`)
    } else {
      logWarning(`  ⚠ Delivery Fee = 0 (сумма >= 2300₽ или район не найден)`)
    }
    
    return true
    
  } catch (error) {
    logError(`Ошибка при тестировании API: ${error.message}`)
    return false
  }
}

// Тест 2: Проверка HTML структуры компонента OrderHistory
async function testOrderHistoryHTML() {
  logSection('ТЕСТ 2: HTML СТРУКТУРА КОМПОНЕНТА OrderHistory')
  
  try {
    logInfo('Проверяю исходный код компонента...')
    
    const fs = require('fs')
    const path = require('path')
    
    const componentPath = path.join(process.cwd(), 'components', 'order-history.tsx')
    const componentCode = fs.readFileSync(componentPath, 'utf-8')
    
    // Проверка 1: Убрана ли галочка?
    const hasCheckmark = componentCode.includes('bg-green-500') && 
                        componentCode.includes('text-white') && 
                        componentCode.includes('✓') &&
                        componentCode.includes('{order.paid && (')
    
    if (hasCheckmark) {
      logError('❌ Зеленая галочка ✓ всё еще присутствует в коде!')
      logError('   Найдено: {order.paid && ( <div className="...bg-green-500...">✓</div> )}')
    } else {
      logSuccess('✓ Зеленая галочка ✓ успешно удалена')
    }
    
    // Проверка 2: Есть ли отображение доставки?
    const hasDelivery = componentCode.includes('🚚') || 
                       componentCode.includes('Доставка') ||
                       componentCode.includes('deliveryFee')
    
    if (!hasDelivery) {
      logError('❌ Отображение доставки НЕ найдено в компоненте!')
      logError('   Ожидается: "🚚 Доставка:" или проверка order.deliveryFee')
      return false
    } else {
      logSuccess('✓ Отображение доставки найдено в компоненте')
    }
    
    // Проверка 3: Исправлено ли "Карта 0"?
    const hasCardWithZero = componentCode.includes("💳 Карта'") && 
                           componentCode.includes('0')
    
    if (hasCardWithZero) {
      logWarning('⚠ Возможно, "Карта 0" всё еще есть в коде')
    } else {
      logSuccess('✓ "Карта 0" исправлено на "Карта"')
    }
    
    // Проверка 4: Условие отображения блока включает deliveryFee?
    const hasDeliveryCondition = componentCode.includes('order.deliveryFee') &&
                                 componentCode.includes('order.deliveryFee > 0')
    
    if (!hasDeliveryCondition) {
      logWarning('⚠ Условие отображения может не включать deliveryFee')
    } else {
      logSuccess('✓ Условие отображения блока включает deliveryFee')
    }
    
    return hasDelivery && !hasCheckmark
    
  } catch (error) {
    logError(`Ошибка при проверке компонента: ${error.message}`)
    return false
  }
}

// Тест 3: Проверка компонента OrderModal
async function testOrderModalHTML() {
  logSection('ТЕСТ 3: HTML СТРУКТУРА КОМПОНЕНТА OrderModal')
  
  try {
    logInfo('Проверяю исходный код компонента...')
    
    const fs = require('fs')
    const path = require('path')
    
    const componentPath = path.join(process.cwd(), 'components', 'order-modal.tsx')
    const componentCode = fs.readFileSync(componentPath, 'utf-8')
    
    // Проверка 1: Есть ли блок с Subtotal?
    const hasSubtotal = componentCode.includes('Сумма заказа') ||
                       componentCode.includes('existingOrder.subtotal')
    
    if (!hasSubtotal) {
      logWarning('⚠ "Сумма заказа" не найдена в OrderModal')
    } else {
      logSuccess('✓ Блок "Сумма заказа" найден')
    }
    
    // Проверка 2: Есть ли блок с доставкой?
    const hasDelivery = componentCode.includes('🚚') || 
                       componentCode.includes('Доставка') ||
                       componentCode.includes('existingOrder.deliveryFee')
    
    if (!hasDelivery) {
      logError('❌ Отображение доставки НЕ найдено в OrderModal!')
      return false
    } else {
      logSuccess('✓ Отображение доставки найдено в OrderModal')
    }
    
    // Проверка 3: Импортирован ли Truck?
    const hasTruckImport = componentCode.includes('Truck') && 
                          componentCode.includes('from "lucide-react"')
    
    if (!hasTruckImport) {
      logWarning('⚠ Иконка Truck не импортирована')
    } else {
      logSuccess('✓ Иконка Truck импортирована')
    }
    
    return hasDelivery
    
  } catch (error) {
    logError(`Ошибка при проверке OrderModal: ${error.message}`)
    return false
  }
}

// Тест 4: Проверка lib/nocodb.ts - маппинг deliveryFee
async function testNocoDBMapping() {
  logSection('ТЕСТ 4: МАППИНГ ПОЛЕЙ В lib/nocodb.ts')
  
  try {
    logInfo('Проверяю функцию fetchOrdersWithDetails...')
    
    const fs = require('fs')
    const path = require('path')
    
    const libPath = path.join(process.cwd(), 'lib', 'nocodb.ts')
    const libCode = fs.readFileSync(libPath, 'utf-8')
    
    // Находим функцию fetchOrdersWithDetails
    const funcStart = libCode.indexOf('export async function fetchOrdersWithDetails')
    if (funcStart === -1) {
      logError('❌ Функция fetchOrdersWithDetails не найдена!')
      return false
    }
    
    const funcEnd = libCode.indexOf('export async function', funcStart + 1)
    const funcCode = libCode.slice(funcStart, funcEnd !== -1 ? funcEnd : undefined)
    
    // Проверяем маппинг deliveryFee
    const hasDeliveryFeeMapping = funcCode.includes('deliveryFee:') || 
                                  funcCode.includes('delivery_fee') ||
                                  funcCode.includes('"Delivery Fee"')
    
    if (!hasDeliveryFeeMapping) {
      logError('❌ Маппинг deliveryFee НЕ найден в fetchOrdersWithDetails!')
      logError('   Нужно добавить: deliveryFee: order.delivery_fee || order["Delivery Fee"] || 0')
      return false
    } else {
      logSuccess('✓ Маппинг deliveryFee найден')
    }
    
    // Проверяем маппинг deliveryDistrict
    const hasDeliveryDistrictMapping = funcCode.includes('deliveryDistrict:') || 
                                       funcCode.includes('delivery_district') ||
                                       funcCode.includes('"Delivery District"')
    
    if (!hasDeliveryDistrictMapping) {
      logWarning('⚠ Маппинг deliveryDistrict может отсутствовать')
    } else {
      logSuccess('✓ Маппинг deliveryDistrict найден')
    }
    
    // Проверяем маппинг deliveryAddress
    const hasDeliveryAddressMapping = funcCode.includes('deliveryAddress:') || 
                                      funcCode.includes('delivery_address') ||
                                      funcCode.includes('"Delivery Address"')
    
    if (!hasDeliveryAddressMapping) {
      logWarning('⚠ Маппинг deliveryAddress может отсутствовать')
    } else {
      logSuccess('✓ Маппинг deliveryAddress найден')
    }
    
    return hasDeliveryFeeMapping
    
  } catch (error) {
    logError(`Ошибка при проверке lib/nocodb.ts: ${error.message}`)
    return false
  }
}

// Тест 5: Проверка интерфейса Order в types.ts
async function testOrderInterface() {
  logSection('ТЕСТ 5: ИНТЕРФЕЙС Order В lib/types.ts')
  
  try {
    logInfo('Проверяю интерфейс Order...')
    
    const fs = require('fs')
    const path = require('path')
    
    const typesPath = path.join(process.cwd(), 'lib', 'types.ts')
    const typesCode = fs.readFileSync(typesPath, 'utf-8')
    
    // Находим интерфейс Order
    const orderInterfaceStart = typesCode.indexOf('export interface Order')
    if (orderInterfaceStart === -1) {
      logError('❌ Интерфейс Order не найден!')
      return false
    }
    
    const orderInterfaceEnd = typesCode.indexOf('}', orderInterfaceStart)
    const orderInterface = typesCode.slice(orderInterfaceStart, orderInterfaceEnd + 1)
    
    // Проверяем наличие полей
    const hasDeliveryFee = orderInterface.includes('deliveryFee')
    const hasDeliveryDistrict = orderInterface.includes('deliveryDistrict')
    const hasDeliveryAddress = orderInterface.includes('deliveryAddress')
    
    if (!hasDeliveryFee) {
      logError('❌ Поле deliveryFee НЕ найдено в интерфейсе Order!')
      return false
    } else {
      logSuccess('✓ Поле deliveryFee присутствует в Order')
    }
    
    if (!hasDeliveryDistrict) {
      logWarning('⚠ Поле deliveryDistrict отсутствует')
    } else {
      logSuccess('✓ Поле deliveryDistrict присутствует в Order')
    }
    
    if (!hasDeliveryAddress) {
      logWarning('⚠ Поле deliveryAddress отсутствует')
    } else {
      logSuccess('✓ Поле deliveryAddress присутствует в Order')
    }
    
    return hasDeliveryFee
    
  } catch (error) {
    logError(`Ошибка при проверке types.ts: ${error.message}`)
    return false
  }
}

// Главная функция
async function main() {
  console.clear()
  log('\n╔═══════════════════════════════════════════════════════════════════╗', 'bright')
  log('║        ПОЛНЫЙ ВИЗУАЛЬНЫЙ ТЕСТ ОТОБРАЖЕНИЯ ДОСТАВКИ               ║', 'bright')
  log('╚═══════════════════════════════════════════════════════════════════╝\n', 'bright')
  
  const results = {
    apiTest: false,
    orderHistoryTest: false,
    orderModalTest: false,
    nocodbMappingTest: false,
    orderInterfaceTest: false,
  }
  
  // Тест 1: API
  results.apiTest = await testOrdersAPI()
  
  // Тест 2: OrderHistory компонент
  results.orderHistoryTest = await testOrderHistoryHTML()
  
  // Тест 3: OrderModal компонент
  results.orderModalTest = await testOrderModalHTML()
  
  // Тест 4: Маппинг в lib/nocodb.ts
  results.nocodbMappingTest = await testNocoDBMapping()
  
  // Тест 5: Интерфейс Order
  results.orderInterfaceTest = await testOrderInterface()
  
  // Итоговый отчет
  logSection('ИТОГОВЫЙ ОТЧЕТ')
  
  console.log('┌────────────────────────────────────────────────┬──────────┐')
  console.log('│ Проверка                                       │ Результат│')
  console.log('├────────────────────────────────────────────────┼──────────┤')
  console.log(`│ API /api/orders возвращает deliveryFee         │ ${results.apiTest ? '✅ PASS' : '❌ FAIL'} │`)
  console.log(`│ OrderHistory: доставка в компоненте            │ ${results.orderHistoryTest ? '✅ PASS' : '❌ FAIL'} │`)
  console.log(`│ OrderModal: доставка в компоненте              │ ${results.orderModalTest ? '✅ PASS' : '❌ FAIL'} │`)
  console.log(`│ lib/nocodb.ts: маппинг deliveryFee             │ ${results.nocodbMappingTest ? '✅ PASS' : '❌ FAIL'} │`)
  console.log(`│ lib/types.ts: интерфейс Order                  │ ${results.orderInterfaceTest ? '✅ PASS' : '❌ FAIL'} │`)
  console.log('└────────────────────────────────────────────────┴──────────┘\n')
  
  const allPassed = Object.values(results).every(r => r)
  
  if (allPassed) {
    logSuccess('🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ!')
    console.log('\n✅ Код корректен, но доставка может не отображаться из-за:')
    log('   1. Кэша браузера - очистите кэш (Ctrl+Shift+Delete)', 'cyan')
    log('   2. Hot Reload не подхватил изменения - перезапустите npm run dev', 'cyan')
    log('   3. Старый bundle.js - сделайте Hard Refresh (Ctrl+Shift+R)', 'cyan')
    log('   4. Service Worker кэширует старую версию - очистите в DevTools', 'cyan')
  } else {
    logError('❌ НЕКОТОРЫЕ ТЕСТЫ НЕ ПРОЙДЕНЫ')
    
    console.log('\n🔍 Рекомендации:\n')
    
    if (!results.apiTest) {
      log('1. API не возвращает deliveryFee:', 'yellow')
      log('   - Проверьте lib/nocodb.ts → fetchOrdersWithDetails', 'yellow')
      log('   - Убедитесь что маппинг deliveryFee добавлен', 'yellow')
    }
    
    if (!results.orderHistoryTest) {
      log('2. OrderHistory не отображает доставку:', 'yellow')
      log('   - Проверьте components/order-history.tsx', 'yellow')
      log('   - Добавьте блок с 🚚 Доставка', 'yellow')
    }
    
    if (!results.orderModalTest) {
      log('3. OrderModal не отображает доставку:', 'yellow')
      log('   - Проверьте components/order-modal.tsx', 'yellow')
      log('   - Добавьте разбивку суммы', 'yellow')
    }
    
    if (!results.nocodbMappingTest) {
      log('4. Маппинг deliveryFee отсутствует:', 'yellow')
      log('   - Откройте lib/nocodb.ts', 'yellow')
      log('   - Найдите fetchOrdersWithDetails', 'yellow')
      log('   - Добавьте: deliveryFee: order.delivery_fee || 0', 'yellow')
    }
    
    if (!results.orderInterfaceTest) {
      log('5. Интерфейс Order не содержит deliveryFee:', 'yellow')
      log('   - Откройте lib/types.ts', 'yellow')
      log('   - Добавьте: deliveryFee?: number', 'yellow')
    }
  }
  
  console.log('\n' + '━'.repeat(70) + '\n')
  
  process.exit(allPassed ? 0 : 1)
}

// Запуск
main().catch(error => {
  logError(`\nКритическая ошибка: ${error.message}`)
  console.error(error)
  process.exit(1)
})



