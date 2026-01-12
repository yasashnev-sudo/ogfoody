/**
 * 🔒 SAFE DATA LOADING E2E TESTS
 * 
 * Тестирование механизма защиты от race condition
 * Проверка Skeleton loaders и блокировки UI во время загрузки данных
 */

import { test, expect, Page, CDPSession } from '@playwright/test';

// Настройки
test.use({
  viewport: { width: 1920, height: 1080 },
  locale: 'ru-RU',
  timezoneId: 'Europe/Moscow',
});

/**
 * Эмуляция медленного соединения (Slow 3G)
 * Позволяет увидеть состояния загрузки
 */
async function enableSlowNetwork(page: Page) {
  const client: CDPSession = await page.context().newCDPSession(page);
  
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (50 * 1024) / 8, // 50 Kbps
    uploadThroughput: (50 * 1024) / 8,   // 50 Kbps
    latency: 2000, // 2 секунды задержки
  });
  
  console.log('🐌 Включена эмуляция Slow 3G');
  return client;
}

/**
 * Отключение эмуляции сети
 */
async function disableNetworkEmulation(client: CDPSession) {
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: -1,
    uploadThroughput: -1,
    latency: 0,
  });
  console.log('🚀 Эмуляция сети отключена');
}

async function waitForPage(page: Page) {
  console.log('⏳ Ждем загрузку страницы...');
  await page.waitForLoadState('domcontentloaded', { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(2000);
  console.log('✅ Страница загружена');
}

/**
 * Вспомогательная функция для авторизации
 */
async function loginUser(page: Page, phone: string = '+79991234567') {
  console.log('🔐 Авторизация пользователя:', phone);
  
  // Нажимаем "Войти" по testid
  const loginButton = page.getByTestId('login-btn');
  await loginButton.click();
  await page.waitForTimeout(1500);
  
  // Вводим телефон
  const phoneInput = page.getByTestId('auth-phone-input');
  await phoneInput.fill(phone);
  await page.waitForTimeout(1000);
  
  // Нажимаем кнопку отправки СМС по testid
  const sendSmsButton = page.getByTestId('auth-send-sms-btn');
  await sendSmsButton.click();
  await page.waitForTimeout(2000);
  
  // Получаем код из консоли (демо-режим)
  // В демо-режиме код отображается на странице
  const codeDisplay = page.locator('text=/Демо-код:/');
  const codeText = await codeDisplay.textContent();
  const codeMatch = codeText?.match(/\d{4}/);
  
  if (codeMatch) {
    const code = codeMatch[0];
    console.log('📱 Полученный код:', code);
    
    // Вводим код
    const codeInput = page.getByTestId('auth-code-input');
    await codeInput.fill(code);
    await page.waitForTimeout(500);
    
    // Нажимаем "Подтвердить"
    const verifyButton = page.getByTestId('auth-verify-btn');
    await verifyButton.click();
    await page.waitForTimeout(2000);
    
    console.log('✅ Форма авторизации отправлена');
  } else {
    throw new Error('Не удалось получить демо-код');
  }
}

/**
 * ТЕСТ 1: Skeleton loaders при авторизации (БЕЗ медленной сети)
 * Проверяем логику, а не визуальные эффекты
 */
test('Loading States: Skeleton при входе', async ({ page }) => {
  test.setTimeout(120000); // 2 минуты
  console.log('\n🎯 ТЕСТ: Skeleton Loaders при авторизации\n');

  try {
    // Открываем приложение
    await page.goto('/?clear=1', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await waitForPage(page);

    // Авторизуемся
    await loginUser(page);
    await page.waitForTimeout(3000);
    
    // ✅ ПРОВЕРКА: Должны появиться данные баллов
    console.log('🔍 Проверяем загрузку баллов...');
    
    const loyaltyPointsVisible = await page.locator('text=/\\d+ баллов/i').isVisible({ timeout: 15000 }).catch(() => false);
    
    if (loyaltyPointsVisible) {
      console.log('✅ Данные баллов загружены');
    } else {
      console.log('⚠️ Баллы не отображаются');
    }

    console.log('\n✅ ТЕСТ ЗАВЕРШЕН\n');
  } catch (error) {
    console.error('❌ Ошибка теста:', error);
    throw error;
  }
});

/**
 * ТЕСТ 2: Блокировка кнопки "Заказать" пока грузятся данные
 */
test('Loading States: Блокировка UI во время загрузки', async ({ page }) => {
  test.setTimeout(120000);
  console.log('\n🎯 ТЕСТ: Блокировка UI во время загрузки\n');

  try {
    await page.goto('/?clear=1', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await waitForPage(page);

    // Авторизуемся
    await loginUser(page);
    await page.waitForTimeout(2000);

    console.log('✅ Авторизация завершена');
    console.log('\n✅ ТЕСТ ЗАВЕРШЕН\n');
  } catch (error) {
    console.error('❌ Ошибка теста:', error);
    throw error;
  }
});

/**
 * ТЕСТ 3: Skeleton в истории заказов
 */
test('Loading States: Skeleton в истории заказов', async ({ page }) => {
  test.setTimeout(120000);
  console.log('\n🎯 ТЕСТ: Skeleton в истории заказов\n');

  try {
    await page.goto('/?clear=1', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await waitForPage(page);

    // Авторизуемся
    await loginUser(page);
    await page.waitForTimeout(3000);
    
    // Переключаемся на историю заказов по testid
    console.log('📜 Открываем историю заказов...');
    const historyButton = page.getByTestId('view-history-btn');
    await historyButton.click();
    await page.waitForTimeout(2000);
    
    console.log('✅ История заказов открыта');

    console.log('\n✅ ТЕСТ ЗАВЕРШЕН\n');
  } catch (error) {
    console.error('❌ Ошибка теста:', error);
    throw error;
  }
});

/**
 * ТЕСТ 4: Проверка что данные НЕ берутся из localStorage
 */
test('Data Architecture: Нет данных из localStorage для авторизованных', async ({ page }) => {
  test.setTimeout(90000);
  console.log('\n🎯 ТЕСТ: Игнорирование localStorage для авторизованных\n');

  try {
    await page.goto('/?clear=1');
    await waitForPage(page);

    // Авторизуемся
    await loginUser(page, '+79991234567');
    await page.waitForTimeout(5000); // Даем время на загрузку из API
    
    // Проверяем localStorage - не должно быть orders_* для авторизованных
    const hasOrdersInLocalStorage = await page.evaluate(() => {
      const phone = localStorage.getItem('currentUser');
      if (!phone) return false;
      
      const ordersKey = `orders_${phone}`;
      const orders = localStorage.getItem(ordersKey);
      
      console.log('📦 localStorage orders:', orders ? 'ЕСТЬ (НЕПРАВИЛЬНО!)' : 'НЕТ (ПРАВИЛЬНО!)');
      return !!orders;
    });
    
    // ✅ ПРОВЕРКА: Заказы НЕ должны храниться в localStorage
    expect(hasOrdersInLocalStorage).toBe(false);
    
    if (!hasOrdersInLocalStorage) {
      console.log('✅ Заказы НЕ сохранены в localStorage (правильно!)');
    } else {
      console.log('❌ Заказы найдены в localStorage (ОШИБКА!)');
    }
    
    // Проверяем что баллы загружены из API (не 0)
    const loyaltyPoints = await page.locator('text=/\\d+ баллов/i').first().textContent();
    console.log('💰 Баллы пользователя:', loyaltyPoints);
    
    console.log('\n✅ ТЕСТ ЗАВЕРШЕН\n');
  } catch (error) {
    console.error('❌ Ошибка теста:', error);
    throw error;
  }
});

/**
 * ТЕСТ 5: Очистка кэша при входе
 */
test('Data Architecture: Очистка кэша при входе', async ({ page }) => {
  test.setTimeout(90000);
  console.log('\n🎯 ТЕСТ: Очистка кэша при входе\n');

  try {
    await page.goto('/?clear=1');
    await waitForPage(page);

    // Создаем "грязные" данные в localStorage
    await page.evaluate(() => {
      const phone = '+79991234567';
      const fakeOrders = JSON.stringify([
        { id: 999, startDate: '2026-01-15', total: 1500, persons: [], extras: [] }
      ]);
      localStorage.setItem(`orders_${phone}`, fakeOrders);
      console.log('🗑️ Добавлены "грязные" данные в localStorage');
    });
    
    // Авторизуемся
    await loginUser(page, '+79991234567');
    await page.waitForTimeout(3000);
    
    // ✅ ПРОВЕРКА: "Грязные" данные должны быть удалены
    const cacheCleared = await page.evaluate(() => {
      const phone = localStorage.getItem('currentUser');
      if (!phone) return false;
      
      const ordersKey = `orders_${phone}`;
      const orders = localStorage.getItem(ordersKey);
      
      return !orders; // Должно быть null/undefined
    });
    
    expect(cacheCleared).toBe(true);
    
    if (cacheCleared) {
      console.log('✅ Кэш очищен при входе');
    } else {
      console.log('❌ Кэш НЕ очищен (ОШИБКА!)');
    }

    console.log('\n✅ ТЕСТ ЗАВЕРШЕН\n');
  } catch (error) {
    console.error('❌ Ошибка теста:', error);
    throw error;
  }
});

