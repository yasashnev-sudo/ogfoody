// Автоматический тест системы лояльности

const API_URL = "http://localhost:3001";
const TEST_USER_PHONE = "79999999999";

// Цвета для консоли
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, colors.green);
}

function error(message) {
  log(`❌ ${message}`, colors.red);
}

function info(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function section(message) {
  log(`\n${"=".repeat(60)}`, colors.cyan);
  log(message, colors.cyan);
  log("=".repeat(60), colors.cyan);
}

// Получить или создать тестового пользователя
async function getOrCreateTestUser() {
  try {
    // Пробуем получить существующего пользователя
    const response = await fetch(`${API_URL}/api/db/Users/records?where=(Phone,eq,${TEST_USER_PHONE})`);
    const data = await response.json();
    
    if (data.list && data.list.length > 0) {
      info(`Используем существующего пользователя ID: ${data.list[0].Id}`);
      return data.list[0];
    }

    // Создаём нового пользователя
    info("Создаём тестового пользователя...");
    const createResponse = await fetch(`${API_URL}/api/db/Users/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: TEST_USER_PHONE,
        name: "Test User Loyalty",
        loyalty_points: 100,
        total_spent: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    });

    const newUser = await createResponse.json();
    success(`Создан пользователь ID: ${newUser.Id}`);
    return newUser;
  } catch (err) {
    error(`Ошибка при создании пользователя: ${err.message}`);
    throw err;
  }
}

// Создать заказ
async function createOrder(userId, paymentMethod, total = 1000) {
  const orderData = {
    order: {
      userId,
      startDate: "2026-01-08",
      deliveryTime: "12:00-14:00",
      paymentMethod,
      paymentStatus: paymentMethod === "cash" ? "pending" : "paid",
      paid: paymentMethod !== "cash",
      persons: [{
        name: "Тест",
        day1: {
          lunch: {
            main: { id: 1, name: "Тестовое блюдо", price: total, portion: "single" }
          }
        }
      }],
      extras: [],
      total,
      subtotal: total,
    }
  };

  const response = await fetch(`${API_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });

  return await response.json();
}

// Обновить способ оплаты заказа
async function updateOrderPayment(orderId, paymentMethod) {
  const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      order: {
        paymentMethod,
        paid: true,
        paymentStatus: "paid",
      }
    }),
  });

  return await response.json();
}

// Удалить заказ
async function cancelOrder(orderId) {
  const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
    method: "DELETE",
  });

  return await response.json();
}

// Получить баллы пользователя
async function getUserPoints(userId) {
  const response = await fetch(`${API_URL}/api/db/Users/records?where=(Id,eq,${userId})`);
  const data = await response.json();
  return data.list[0].loyalty_points;
}

// Получить pending транзакции
async function getPendingTransactions(userId) {
  const response = await fetch(`${API_URL}/api/db/Loyalty_Points_Transactions/records?where=(User ID,eq,${userId})~and(Transaction Status,eq,pending)`);
  const data = await response.json();
  return data.list || [];
}

// Получить fraud alerts
async function getFraudAlerts(userId) {
  const response = await fetch(`${API_URL}/api/db/Fraud_Alerts/records?where=(User ID,eq,${userId})`);
  const data = await response.json();
  return data.list || [];
}

// Тест 1: Заказ за наличные
async function test1_CashOrder(user) {
  section("ТЕСТ 1: Заказ за наличные → pending баллы");
  
  const pointsBefore = await getUserPoints(user.Id);
  info(`Баллы до заказа: ${pointsBefore}`);

  const order = await createOrder(user.Id, "cash", 1000);
  
  if (!order.success) {
    error("Не удалось создать заказ");
    return false;
  }

  info(`Создан заказ #${order.orderNumber}`);
  
  // Проверяем сообщение
  if (order.loyaltyPointsMessage && order.loyaltyPointsMessage.includes("на следующий день после доставки")) {
    success(`Сообщение корректное: "${order.loyaltyPointsMessage}"`);
  } else {
    error(`Неправильное сообщение: "${order.loyaltyPointsMessage}"`);
    return false;
  }

  // Проверяем статус
  if (order.loyaltyPointsStatus === "pending") {
    success("Статус баллов: pending ✓");
  } else {
    error(`Статус баллов: ${order.loyaltyPointsStatus} (ожидалось pending)`);
    return false;
  }

  // Проверяем, что баллы НЕ начислены сразу
  const pointsAfter = await getUserPoints(user.Id);
  if (pointsAfter === pointsBefore) {
    success(`Баллы НЕ начислены сразу (осталось ${pointsAfter}) ✓`);
  } else {
    error(`Баллы начислены сразу! Было ${pointsBefore}, стало ${pointsAfter}`);
    return false;
  }

  // Проверяем pending транзакцию
  const pending = await getPendingTransactions(user.Id);
  if (pending.length > 0) {
    success(`Создана pending транзакция (${pending.length} шт.) ✓`);
  } else {
    error("Pending транзакция не создана!");
    return false;
  }

  success("ТЕСТ 1 ПРОЙДЕН!");
  return true;
}

// Тест 2: Заказ онлайн
async function test2_OnlineOrder(user) {
  section("ТЕСТ 2: Заказ с онлайн-оплатой → баллы сразу");
  
  const pointsBefore = await getUserPoints(user.Id);
  info(`Баллы до заказа: ${pointsBefore}`);

  const order = await createOrder(user.Id, "card", 2000);
  
  if (!order.success) {
    error("Не удалось создать заказ");
    return false;
  }

  info(`Создан заказ #${order.orderNumber}`);

  // Проверяем сообщение
  if (order.loyaltyPointsMessage && order.loyaltyPointsMessage.includes("Начислено")) {
    success(`Сообщение корректное: "${order.loyaltyPointsMessage}"`);
  } else {
    error(`Неправильное сообщение: "${order.loyaltyPointsMessage}"`);
    return false;
  }

  // Проверяем статус
  if (order.loyaltyPointsStatus === "earned") {
    success("Статус баллов: earned ✓");
  } else {
    error(`Статус баллов: ${order.loyaltyPointsStatus} (ожидалось earned)`);
    return false;
  }

  // Проверяем, что баллы начислены
  await new Promise(resolve => setTimeout(resolve, 1000)); // Небольшая задержка
  const pointsAfter = await getUserPoints(user.Id);
  const expectedPoints = pointsBefore + order.loyaltyPointsEarned;
  
  if (pointsAfter === expectedPoints) {
    success(`Баллы начислены сразу! Было ${pointsBefore}, стало ${pointsAfter} (+${order.loyaltyPointsEarned}) ✓`);
  } else {
    error(`Неправильное количество баллов! Ожидалось ${expectedPoints}, получено ${pointsAfter}`);
    return false;
  }

  success("ТЕСТ 2 ПРОЙДЕН!");
  return true;
}

// Тест 3: Оплата наличного заказа онлайн
async function test3_CashToOnline(user) {
  section("ТЕСТ 3: Заказ за наличные → оплата онлайн → баллы сразу");
  
  const pointsBefore = await getUserPoints(user.Id);
  info(`Баллы до заказа: ${pointsBefore}`);

  // Создаём заказ за наличные
  const order = await createOrder(user.Id, "cash", 1500);
  info(`Создан заказ за наличные #${order.orderNumber}`);

  // Проверяем pending транзакцию
  let pending = await getPendingTransactions(user.Id);
  const pendingBefore = pending.length;
  info(`Pending транзакций: ${pendingBefore}`);

  // Оплачиваем онлайн
  await new Promise(resolve => setTimeout(resolve, 500));
  const updated = await updateOrderPayment(order.orderId, "card");
  info("Заказ оплачен онлайн");

  // Проверяем, что pending транзакции обработаны
  await new Promise(resolve => setTimeout(resolve, 1000));
  pending = await getPendingTransactions(user.Id);
  const pendingAfter = pending.length;

  if (pendingAfter < pendingBefore) {
    success(`Pending транзакции обработаны (было ${pendingBefore}, осталось ${pendingAfter}) ✓`);
  } else {
    error(`Pending транзакции не обработаны (осталось ${pendingAfter})`);
    return false;
  }

  // Проверяем, что баллы начислены
  const pointsAfter = await getUserPoints(user.Id);
  if (pointsAfter > pointsBefore) {
    success(`Баллы начислены! Было ${pointsBefore}, стало ${pointsAfter} (+${pointsAfter - pointsBefore}) ✓`);
  } else {
    error(`Баллы не начислены! Было ${pointsBefore}, стало ${pointsAfter}`);
    return false;
  }

  success("ТЕСТ 3 ПРОЙДЕН!");
  return true;
}

// Тест 4: Обнаружение мошенничества
async function test4_FraudDetection(user) {
  section("ТЕСТ 4: Отмена 3 оплаченных заказов → Fraud Alert");
  
  const orderIds = [];

  // Создаём 3 оплаченных заказа
  info("Создаём 3 оплаченных заказа...");
  for (let i = 0; i < 3; i++) {
    const order = await createOrder(user.Id, "card", 500);
    orderIds.push(order.orderId);
    info(`Заказ ${i + 1}: #${order.orderNumber}`);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Отменяем все 3 заказа
  info("Отменяем все заказы...");
  for (let i = 0; i < orderIds.length; i++) {
    await cancelOrder(orderIds[i]);
    info(`Отменён заказ ${i + 1}`);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Проверяем fraud alerts
  await new Promise(resolve => setTimeout(resolve, 1000));
  const fraudAlerts = await getFraudAlerts(user.Id);

  if (fraudAlerts.length > 0) {
    success(`Fraud Alert создан! Найдено ${fraudAlerts.length} записей ✓`);
    info(`Статистика: ${fraudAlerts[0].cancelled_paid_orders_count} отменённых из ${fraudAlerts[0].paid_orders_count} оплаченных`);
    info(`Процент отмен: ${fraudAlerts[0].cancellation_rate.toFixed(1)}%`);
  } else {
    error("Fraud Alert не создан!");
    return false;
  }

  success("ТЕСТ 4 ПРОЙДЕН!");
  return true;
}

// Основная функция
async function runTests() {
  log("\n🚀 ЗАПУСК АВТОМАТИЧЕСКОГО ТЕСТИРОВАНИЯ СИСТЕМЫ ЛОЯЛЬНОСТИ\n", colors.cyan);

  try {
    // Подготовка
    section("ПОДГОТОВКА");
    const user = await getOrCreateTestUser();
    success(`Тестовый пользователь готов: ID ${user.Id}, баллы: ${user.loyalty_points}`);

    // Запуск тестов
    const results = {
      test1: await test1_CashOrder(user),
      test2: await test2_OnlineOrder(user),
      test3: await test3_CashToOnline(user),
      test4: await test4_FraudDetection(user),
    };

    // Итоги
    section("ИТОГИ ТЕСТИРОВАНИЯ");
    const passed = Object.values(results).filter(r => r).length;
    const total = Object.keys(results).length;

    log(`\nВсего тестов: ${total}`);
    log(`Пройдено: ${passed}`, passed === total ? colors.green : colors.yellow);
    log(`Провалено: ${total - passed}`, total - passed === 0 ? colors.green : colors.red);

    if (passed === total) {
      success("\n🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ! СИСТЕМА РАБОТАЕТ КОРРЕКТНО!");
    } else {
      error("\n⚠️  НЕКОТОРЫЕ ТЕСТЫ НЕ ПРОШЛИ. ПРОВЕРЬТЕ ЛОГИ ВЫШЕ.");
    }

    // Инфо о cron job
    section("ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ");
    info("Cron job для pending баллов:");
    info("  - Запускается: каждый час");
    info("  - Endpoint: /api/cron/process-pending-points");
    info("  - Обрабатывает заказы старше 1 дня");
    info("\nДля ручной проверки cron job откройте в браузере:");
    info("  http://localhost:3000/api/cron/process-pending-points");

  } catch (err) {
    error(`\n❌ КРИТИЧЕСКАЯ ОШИБКА: ${err.message}`);
    console.error(err);
    process.exit(1);
  }
}

// Запуск
runTests();

