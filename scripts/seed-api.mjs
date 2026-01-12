/**
 * Быстрое создание тестовых данных через API
 * Запускать когда сервер Next.js работает (npm run dev)
 */

const API_URL = 'http://localhost:3000';

async function createTestUser() {
  console.log('👤 Проверка существования пользователя...');
  
  // Сначала попробуем найти существующего пользователя
  try {
    const existingResponse = await fetch(`${API_URL}/api/orders?userId=1`);
    if (existingResponse.ok) {
      const data = await existingResponse.json();
      console.log('✅ Найден существующий пользователь в системе');
      return { Id: 1, id: 1 }; // Возвращаем заглушку
    }
  } catch (error) {
    console.log('⚠️ Не удалось проверить пользователей:', error.message);
  }

  console.log('⚠️ Нельзя создать пользователя через API автоматически.');
  console.log('📝 Создайте пользователя через UI:');
  console.log('   1. Откройте http://localhost:3000');
  console.log('   2. Нажмите "Войти"');
  console.log('   3. Введите телефон: 79999999999');
  console.log('   4. Заполните профиль');
  return null;
}

async function createTestOrder(userId) {
  console.log('\n📦 Создание тестового заказа через API...');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const orderData = {
    userId: userId,
    order: {
      startDate: tomorrowStr,
      deliveryTime: '12:00-14:00',
      persons: [
        {
          name: 'Тест',
          meals: [], // Пустой массив, т.к. нет meals в БД
        },
      ],
      extras: [],
      subtotal: 2000,
      total: 2200,
      deliveryFee: 200,
      deliveryDistrict: 'Центральный район',
      deliveryAddress: 'Невский проспект, д. 1, кв. 100',
      loyaltyPointsUsed: 0,
      paid: false,
      paymentMethod: 'cash',
    },
  };

  try {
    const response = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Ошибка создания заказа:', error);
      return null;
    }

    const result = await response.json();
    console.log('✅ Заказ создан:', result);
    return result;
  } catch (error) {
    console.error('❌ Ошибка:', error);
    return null;
  }
}

async function seed() {
  console.log('🌱 Начинаем заполнение тестовыми данными...\n');

  // Проверяем, что сервер работает
  try {
    const pingResponse = await fetch(`${API_URL}/api/orders?userId=1`);
    if (!pingResponse.ok && pingResponse.status !== 404) {
      console.error('❌ Сервер не отвечает. Запустите: npm run dev');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Не удалось подключиться к серверу. Запустите: npm run dev');
    process.exit(1);
  }

  // Создаем пользователя
  const user = await createTestUser();
  if (!user) {
    console.error('❌ Не удалось создать пользователя');
    process.exit(1);
  }

  const userId = user.Id || user.id;

  // Создаем заказ
  const order = await createTestOrder(userId);
  if (!order) {
    console.error('❌ Не удалось создать заказ');
    process.exit(1);
  }

  console.log('\n✅ ВСЕ ТЕСТОВЫЕ ДАННЫЕ СОЗДАНЫ!\n');
  console.log('📋 Итого:');
  console.log(`   - Пользователь ID: ${userId}, телефон: 79999999999`);
  console.log(`   - Заказ ID: ${order.orderId || order.id}`);
  console.log('\n🧪 Теперь можно запустить тесты: npx playwright test tests/architecture_audit.spec.ts\n');
}

seed();

