/**
 * Скрипт для заполнения БД тестовыми данными
 * Создает:
 * - Тестового пользователя
 * - Тестовый заказ с баллами
 * - Транзакции баллов
 */

import { 
  createUser, 
  createOrder, 
  createOrderPerson, 
  createOrderMeal,
  createLoyaltyPointsTransaction,
  fetchUserByPhone,
  generateOrderNumber,
} from '../lib/nocodb';

async function seedTestData() {
  console.log('🌱 Начинаем заполнение тестовыми данными...\n');

  try {
    // 1. Создаем тестового пользователя
    console.log('👤 Создание тестового пользователя...');
    
    const testPhone = '79999999999';
    
    // Проверяем, существует ли уже
    let user;
    try {
      user = await fetchUserByPhone(testPhone);
      console.log('✅ Пользователь уже существует:', user.Id);
    } catch {
      // Создаем нового
      const now = new Date().toISOString();
      user = await createUser({
        phone: testPhone,
        name: 'Тестовый Пользователь',
        district: 'Центральный район',
        city: 'Санкт-Петербург',
        street: 'Невский проспект',
        building: '1',
        apartment: '100',
        loyalty_points: 0,
        total_spent: 0,
        created_at: now,
        updated_at: now,
      });
      console.log('✅ Пользователь создан:', user.Id);
    }

    // 2. Создаем тестовый заказ
    console.log('\n📦 Создание тестового заказа...');
    
    const orderNumber = generateOrderNumber();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    const now = new Date().toISOString();
    
    const order = await createOrder({
      user_id: user.Id,
      order_number: orderNumber,
      start_date: tomorrowStr,
      delivery_time: '12:00-14:00',
      payment_status: 'paid',
      payment_method: 'card',
      paid: true,
      paid_at: now,
      order_status: 'pending',
      loyalty_points_used: 0,
      loyalty_points_earned: 100,
      subtotal: 2000,
      total: 2200,
      delivery_fee: 200,
      delivery_district: 'Центральный район',
      delivery_address: 'Невский проспект, д. 1, кв. 100',
      created_at: now,
      updated_at: now,
    });
    
    console.log('✅ Заказ создан:', order.Id, 'Номер:', orderNumber);

    // 3. Создаем персону в заказе
    console.log('\n👥 Создание персоны...');
    
    const person = await createOrderPerson({
      order_id: order.Id,
      name: 'Тест',
      created_at: now,
      updated_at: now,
    });
    
    console.log('✅ Персона создана:', person.Id);

    // 4. Создаем meal (если есть блюда в БД)
    console.log('\n🍽️ Создание блюда в заказе...');
    
    try {
      const meal = await createOrderMeal({
        order_person_id: person.Id,
        day: 'day1',
        meal_time: 'lunch',
        meal_type: 'main',
        meal_id: 1, // ID первого блюда
        portion_size: 'single',
        price: 500,
      });
      console.log('✅ Блюдо добавлено:', meal.Id);
    } catch (error) {
      console.warn('⚠️ Не удалось добавить блюдо (возможно, нет meals в БД)');
    }

    // 5. Создаем транзакцию начисления баллов
    console.log('\n💰 Создание транзакции баллов...');
    
    const transaction = await createLoyaltyPointsTransaction({
      user_id: user.Id,
      order_id: order.Id,
      transaction_type: 'earned',
      transaction_status: 'completed',
      points: 100,
      description: `Начислено за заказ ${orderNumber}`,
      created_at: now,
      updated_at: now,
      processed_at: now,
    });
    
    console.log('✅ Транзакция создана:', transaction.Id);

    console.log('\n✅ ВСЕ ТЕСТОВЫЕ ДАННЫЕ СОЗДАНЫ!\n');
    console.log('📋 Итого:');
    console.log(`   - Пользователь ID: ${user.Id}, телефон: ${testPhone}`);
    console.log(`   - Заказ ID: ${order.Id}, номер: ${orderNumber}`);
    console.log(`   - Персона ID: ${person.Id}`);
    console.log(`   - Транзакция ID: ${transaction.Id}, баллы: +100`);
    console.log('\n🧪 Теперь можно запустить тесты: npx playwright test tests/architecture_audit.spec.ts\n');

  } catch (error) {
    console.error('❌ Ошибка при создании тестовых данных:', error);
    process.exit(1);
  }
}

// Запуск скрипта
seedTestData();




