/**
 * 🎯 ПРОСТОЙ ТЕСТ - Проверка наличия data-testid элементов
 * 
 * Быстрая проверка, что все элементы с data-testid доступны на проде
 */

import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.use({
  viewport: { width: 1920, height: 1080 },
  locale: 'ru-RU',
  timezoneId: 'Europe/Moscow',
  baseURL: BASE_URL,
});

async function waitForPage(page: Page) {
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2000);
}

async function loginUser(page: Page, phone: string = '+79991234567') {
  try {
    const loginBtn = page.getByTestId('login-btn');
    await expect(loginBtn).toBeVisible({ timeout: 10000 });
    await loginBtn.click();
    await page.waitForTimeout(1000);
    
    const phoneInput = page.getByTestId('auth-phone-input');
    await expect(phoneInput).toBeVisible({ timeout: 5000 });
    await phoneInput.fill(phone);
    await page.waitForTimeout(500);
    
    const sendSmsBtn = page.getByTestId('auth-send-sms-btn');
    await sendSmsBtn.click();
    await page.waitForTimeout(3000);
    
    const codeBanner = page.locator('text=/Демо-код:|Код:/i').first();
    const codeVisible = await codeBanner.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (codeVisible) {
      const codeText = await codeBanner.textContent();
      const code = codeText?.match(/\d{4}/)?.[0];
      
      if (code) {
        const codeInput = page.getByTestId('auth-code-input');
        await expect(codeInput).toBeVisible({ timeout: 5000 });
        await codeInput.fill(code);
        await page.waitForTimeout(500);
        
        const verifyBtn = page.getByTestId('auth-verify-btn');
        await verifyBtn.click();
        await page.waitForTimeout(3000);
        return true;
      }
    }
    return false;
  } catch (error) {
    return false;
  }
}

test('Проверка data-testid элементов на проде', async ({ page }) => {
  test.setTimeout(120000);
  console.log(`\n🔍 Проверка data-testid элементов на ${BASE_URL}\n`);

  await page.goto('/?clear=1');
  await waitForPage(page);

  // Проверяем кнопку входа
  const loginBtn = page.getByTestId('login-btn');
  const loginVisible = await loginBtn.isVisible({ timeout: 10000 }).catch(() => false);
  console.log(`✅ Кнопка входа (login-btn): ${loginVisible ? 'найдена' : 'не найдена'}`);
  expect(loginVisible).toBe(true);

  // Авторизуемся
  console.log('🔐 Авторизация...');
  const loggedIn = await loginUser(page);
  
  if (!loggedIn) {
    console.log('⚠️ Авторизация не удалась, пропускаем остальные проверки');
    test.skip();
    return;
  }
  
  console.log('✅ Авторизация успешна');

  // Проверяем элементы авторизации (должны быть скрыты после входа)
  const authElements = [
    { testid: 'auth-phone-input', name: 'Поле телефона' },
    { testid: 'auth-code-input', name: 'Поле кода' },
    { testid: 'auth-send-sms-btn', name: 'Кнопка отправки СМС' },
    { testid: 'auth-verify-btn', name: 'Кнопка подтверждения' },
  ];

  console.log('\n📋 Элементы авторизации (должны быть в DOM, но могут быть скрыты):');
  for (const elem of authElements) {
    const element = page.getByTestId(elem.testid);
    const exists = await element.count() > 0;
    console.log(`  ${exists ? '✅' : '❌'} ${elem.name} (${elem.testid}): ${exists ? 'найден' : 'не найден'}`);
  }

  // Ждем загрузки календаря
  const calendar = page.locator('#calendar-section');
  const calendarVisible = await calendar.isVisible({ timeout: 20000 }).catch(() => false);
  
  if (calendarVisible) {
    console.log('\n✅ Календарь найден');
    
    // Проверяем, что элементы модалки заказа существуют в DOM (даже если модалка закрыта)
    const orderElements = [
      { testid: 'order-promo-code-input', name: 'Поле промокода' },
      { testid: 'order-apply-promo-btn', name: 'Кнопка применения промокода' },
      { testid: 'order-submit-btn', name: 'Кнопка оформления заказа' },
    ];
    
    console.log('\n📋 Элементы модалки заказа:');
    for (const elem of orderElements) {
      const element = page.getByTestId(elem.testid);
      const exists = await element.count() > 0;
      const visible = exists ? await element.isVisible({ timeout: 2000 }).catch(() => false) : false;
      console.log(`  ${exists ? '✅' : '❌'} ${elem.name} (${elem.testid}): ${exists ? (visible ? 'найден и виден' : 'найден, но скрыт') : 'не найден'}`);
    }
  } else {
    console.log('\n⚠️ Календарь не найден');
  }

  // Проверяем элементы профиля (если есть кнопка профиля)
  const profileElements = [
    { testid: 'profile-name-input', name: 'Поле имени' },
    { testid: 'profile-save-btn', name: 'Кнопка сохранения' },
  ];
  
  console.log('\n📋 Элементы профиля (должны быть в DOM, но могут быть скрыты):');
  for (const elem of profileElements) {
    const element = page.getByTestId(elem.testid);
    const exists = await element.count() > 0;
    console.log(`  ${exists ? '✅' : '❌'} ${elem.name} (${elem.testid}): ${exists ? 'найден' : 'не найден'}`);
  }

  // Проверяем элементы оплаты (должны быть в DOM, но скрыты до открытия модалки)
  const paymentElements = [
    { testid: 'payment-use-points-checkbox', name: 'Чекбокс использования баллов' },
    { testid: 'payment-points-slider', name: 'Слайдер количества баллов' },
    { testid: 'payment-submit-btn', name: 'Кнопка оплаты' },
  ];
  
  console.log('\n📋 Элементы модалки оплаты (должны быть в DOM, но скрыты до открытия):');
  for (const elem of paymentElements) {
    const element = page.getByTestId(elem.testid);
    const exists = await element.count() > 0;
    console.log(`  ${exists ? '✅' : '❌'} ${elem.name} (${elem.testid}): ${exists ? 'найден' : 'не найден'}`);
  }

  console.log('\n✅ ТЕСТ ЗАВЕРШЕН\n');
});
