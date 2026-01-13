/**
 * Вспомогательный тест для создания тестовых данных
 * Запускается с UI для корректного создания пользователя и заказа
 */

import { test } from '@playwright/test';

test('Создание тестовых данных через UI', async ({ page }) => {
  console.log('🌱 Создание тестовых данных...\n');

  // Очистка
  await page.goto('/?clear=1');
  await page.waitForTimeout(3000);

  await page.goto('/');
  await page.waitForTimeout(3000);

  // Авторизация
  console.log('👤 Авторизация тестового пользователя...');
  await page.locator('button:has-text("Войти")').first().click();
  await page.waitForTimeout(1000);

  const phoneInput = page.locator('input[type="tel"]');
  await phoneInput.fill('79999999999');
  
  await page.locator('button:has-text("Получить код")').click();
  await page.waitForTimeout(2000);

  // Вводим код
  const codeInputs = page.locator('input[data-input-otp]');
  const count = await codeInputs.count();
  for (let i = 0; i < count; i++) {
    await codeInputs.nth(i).fill('1');
  }
  await page.waitForTimeout(3000);

  // Заполняем профиль
  const profileModal = page.locator('text=Заполните профиль');
  if (await profileModal.isVisible({ timeout: 3000 })) {
    console.log('📝 Заполнение профиля...');
    await page.locator('input[placeholder="Иван"]').fill('Тестовый');
    await page.locator('input[placeholder="Невский"]').fill('Тестовая');
    await page.locator('input[placeholder="1"]').fill('99');
    
    // Проверяем район
    const districtSelect = page.locator('select').first();
    if (await districtSelect.isVisible()) {
      await districtSelect.selectOption('Центральный район');
    }
    
    await page.locator('button:has-text("Сохранить")').click();
    await page.waitForTimeout(2000);
  }

  console.log('✅ Пользователь создан!\n');

  // Проверяем модалку выбора района
  const districtModal = page.locator('text=Выберите район доставки');
  if (await districtModal.isVisible({ timeout: 2000 })) {
    await page.locator('button:has-text("Центральный район")').first().click();
    await page.locator('button:has-text("Сохранить")').click();
    await page.waitForTimeout(500);
  }

  // Выбираем дату
  console.log('📅 Выбор даты...');
  const futureDate = page.locator('[role="gridcell"]:not([aria-disabled="true"])').first();
  await futureDate.click();
  await page.waitForTimeout(1500);

  // Создаем заказ
  console.log('📦 Создание заказа...');
  const orderButton = page.locator('button:has-text("Новый заказ")').or(page.locator('button:has-text("Заказать")')).first();
  await orderButton.click();
  await page.waitForTimeout(1500);

  const addPersonButton = page.locator('button:has-text("Добавить человека")');
  await addPersonButton.click();
  await page.waitForTimeout(1000);

  // Выбираем блюдо
  const selectButton = page.locator('button:has-text("Выбрать")').first();
  if (await selectButton.isVisible({ timeout: 2000 })) {
    await selectButton.click();
    await page.waitForTimeout(500);
  }

  // Сохраняем заказ
  const saveButton = page.locator('button:has-text("Заказать")');
  await saveButton.click();
  await page.waitForTimeout(3000);

  console.log('✅ Заказ создан!\n');

  // Проверяем что открылась PaymentModal
  const paymentModal = page.locator('text=Оплата заказа').or(page.locator('text=Выберите способ оплаты'));
  if (await paymentModal.isVisible({ timeout: 5000 })) {
    console.log('💳 PaymentModal открыта');
    
    // Выбираем оплату картой для мгновенного начисления баллов
    const cardRadio = page.locator('input[value="card"]');
    if (await cardRadio.isVisible({ timeout: 2000 })) {
      await cardRadio.click();
      await page.waitForTimeout(500);
    }

    // Оплачиваем
    const payButton = page.locator('button:has-text("Оплатить")');
    await payButton.click();
    await page.waitForTimeout(4000);

    console.log('✅ Заказ оплачен!\n');
  }

  console.log('🎉 ВСЕ ТЕСТОВЫЕ ДАННЫЕ СОЗДАНЫ!');
  console.log('📋 Пользователь: 79999999999');
  console.log('🧪 Теперь запустите: npx playwright test tests/architecture_audit.spec.ts\n');
});




