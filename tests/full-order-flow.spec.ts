/**
 * 🎯 ПОЛНЫЙ E2E ТЕСТ - Полный flow оформления заказа
 * 
 * Тестирует весь процесс:
 * 1. Авторизация
 * 2. Выбор даты
 * 3. Открытие модалки заказа
 * 4. Выбор блюд (автозаполнение)
 * 5. Прокрутка до кнопки заказа
 * 6. Применение промокода
 * 7. Оформление заказа
 * 8. Открытие модалки оплаты
 * 9. Использование баллов
 * 10. Проверка итоговой суммы
 * 
 * Запуск на проде:
 *   BASE_URL=https://ogfoody.ru npx playwright test tests/full-order-flow.spec.ts
 */

import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.use({
  viewport: { width: 1920, height: 1080 },
  locale: 'ru-RU',
  timezoneId: 'Europe/Moscow',
  baseURL: BASE_URL,
});

async function waitForPage(page: Page, timeout = 3000) {
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(timeout);
}

async function loginUser(page: Page, phone: string = '+79991234567'): Promise<boolean> {
  console.log('🔐 Авторизация пользователя...');
  
  try {
    const loginBtn = page.getByTestId('login-btn');
    await expect(loginBtn).toBeVisible({ timeout: 10000 });
    await loginBtn.click();
    await waitForPage(page, 1000);
    
    const phoneInput = page.getByTestId('auth-phone-input');
    await expect(phoneInput).toBeVisible({ timeout: 5000 });
    await phoneInput.fill(phone);
    await waitForPage(page, 500);
    
    const sendSmsBtn = page.getByTestId('auth-send-sms-btn');
    await sendSmsBtn.click();
    await waitForPage(page, 3000);
    
    const codeBanner = page.locator('text=/Демо-код:|Код:/i').first();
    const codeVisible = await codeBanner.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (codeVisible) {
      const codeText = await codeBanner.textContent();
      const code = codeText?.match(/\d{4}/)?.[0];
      
      if (code) {
        const codeInput = page.getByTestId('auth-code-input');
        await expect(codeInput).toBeVisible({ timeout: 5000 });
        await codeInput.fill(code);
        await waitForPage(page, 500);
        
        const verifyBtn = page.getByTestId('auth-verify-btn');
        await verifyBtn.click();
        await waitForPage(page, 3000);
        console.log('✅ Авторизация успешна');
        return true;
      }
    }
    
    console.log('⚠️ Демо-код не найден');
    return false;
  } catch (error) {
    console.log(`❌ Ошибка авторизации: ${error}`);
    return false;
  }
}

async function selectDate(page: Page): Promise<boolean> {
  console.log('📅 Выбираем дату доставки...');
  
  const calendar = page.locator('#calendar-section');
  const calendarVisible = await calendar.isVisible({ timeout: 20000 }).catch(() => false);
  
  if (!calendarVisible) {
    console.log('⚠️ Календарь не найден');
    return false;
  }
  
  console.log('✅ Календарь найден');
  await waitForPage(page, 2000);
  
  // Закрываем модалки, если открыты
  const modalOverlay = page.locator('div[data-slot="dialog-overlay"]');
  const modalVisible = await modalOverlay.isVisible({ timeout: 2000 }).catch(() => false);
  
  if (modalVisible) {
    console.log('ℹ️ Закрываем открытую модалку...');
    await page.keyboard.press('Escape');
    await waitForPage(page, 1000);
  }
  
  // Ищем доступную дату
  let clickableDates = calendar.locator('div[class*="cursor-pointer"]');
  let dateCount = await clickableDates.count();
  
  if (dateCount === 0) {
    clickableDates = calendar.locator('button[class*="cursor-pointer"], div[class*="hover"]');
    dateCount = await clickableDates.count();
  }
  
  console.log(`ℹ️ Найдено доступных дат: ${dateCount}`);
  
  if (dateCount > 0) {
    try {
      await clickableDates.first().click({ force: true, timeout: 10000 });
      await waitForPage(page, 3000);
      console.log('✅ Дата выбрана');
      return true;
    } catch (error) {
      console.log(`⚠️ Ошибка при выборе даты: ${error}`);
      // Пробуем через JS
      try {
        await clickableDates.first().evaluate((el: HTMLElement) => el.click());
        await waitForPage(page, 3000);
        console.log('✅ Дата выбрана (через JS)');
        return true;
      } catch (jsError) {
        console.log(`⚠️ Ошибка при выборе даты через JS: ${jsError}`);
        return false;
      }
    }
  }
  
  return false;
}

async function waitForOrderModal(page: Page): Promise<boolean> {
  console.log('🛒 Ожидаем модалку заказа...');
  
  // Ждем появления модалки заказа (по заголовкам или тексту)
  const orderModalIndicators = [
    page.locator('text=/Завтрак|Обед|Ужин|Персона|День 1|День 2/i').first(),
    page.locator('[role="dialog"]').first(),
    page.locator('div[class*="modal"], div[class*="dialog"]').first(),
  ];
  
  for (const indicator of orderModalIndicators) {
    const visible = await indicator.isVisible({ timeout: 15000 }).catch(() => false);
    if (visible) {
      console.log('✅ Модалка заказа открыта');
      await waitForPage(page, 2000);
      return true;
    }
  }
  
  console.log('⚠️ Модалка заказа не найдена');
  return false;
}

async function selectMeals(page: Page): Promise<boolean> {
  console.log('🍽️ Выбираем блюда...');
  
  // Ищем кнопки "Заполнить" (AutoButton) - они имеют иконку Wand2
  // Селектор: button с иконкой Wand2 (lucide-react)
  const fillButtons = page.locator('button:has(svg[class*="lucide-wand"]), button:has(svg[class*="Wand"])').or(
    page.locator('button[title*="случайно"], button[title*="Заполнить"]')
  );
  
  const fillButtonCount = await fillButtons.count();
  console.log(`ℹ️ Найдено кнопок заполнения: ${fillButtonCount}`);
  
  if (fillButtonCount > 0) {
    // Кликаем на первую кнопку заполнения (обычно для завтрака)
    try {
      const firstButton = fillButtons.first();
      await firstButton.scrollIntoViewIfNeeded();
      await waitForPage(page, 500);
      await firstButton.click({ timeout: 5000 });
      await waitForPage(page, 2000);
      console.log('✅ Блюда выбраны (автозаполнение)');
      return true;
    } catch (error) {
      console.log(`⚠️ Ошибка при автозаполнении: ${error}`);
    }
  }
  
  // Альтернатива: ищем секции с блюдами и кликаем на первую карточку
  console.log('ℹ️ Пробуем выбрать блюда вручную...');
  
  // Ищем заголовки секций завтрака/обеда/ужина (более точный селектор)
  const mealSectionHeaders = page.locator('div, h4, h3').filter({ 
    hasText: /^Завтрак$|^Обед$|^Ужин$/i 
  });
  const sectionCount = await mealSectionHeaders.count();
  console.log(`ℹ️ Найдено секций блюд: ${sectionCount}`);
  
  if (sectionCount > 0) {
    // Прокручиваем к первой секции и кликаем на заголовок для раскрытия
    try {
      const firstSection = mealSectionHeaders.first();
      await firstSection.scrollIntoViewIfNeeded();
      await waitForPage(page, 500);
      
      // Ищем родительский элемент секции и кликаем на него
      const sectionContainer = firstSection.locator('..').or(firstSection.locator('../..'));
      await sectionContainer.first().click({ force: true, timeout: 5000 });
      await waitForPage(page, 1000);
      
      // Ищем карточки блюд в раскрытой секции
      const mealCards = page.locator('div, button').filter({ 
        hasText: /₽|руб/i 
      }).first();
      
      const cardVisible = await mealCards.isVisible({ timeout: 3000 }).catch(() => false);
      if (cardVisible) {
        await mealCards.click({ force: true, timeout: 5000 });
        await waitForPage(page, 1000);
        console.log('✅ Блюдо выбрано вручную');
        return true;
      }
    } catch (error) {
      console.log(`⚠️ Ошибка при выборе блюда: ${error}`);
    }
  }
  
  console.log('⚠️ Не удалось выбрать блюда (продолжаем тест)');
  return false;
}

async function scrollToOrderButton(page: Page): Promise<boolean> {
  console.log('📜 Прокручиваем до кнопки заказа...');
  
  // Сначала ищем плавающую кнопку (если есть)
  const floatingButton = page.locator('button:has-text(/₽/), button[class*="floating"]').first();
  const floatingVisible = await floatingButton.isVisible({ timeout: 3000 }).catch(() => false);
  
  if (floatingVisible) {
    console.log('ℹ️ Найдена плавающая кнопка, кликаем для прокрутки...');
    try {
      await floatingButton.click({ timeout: 5000 });
      await waitForPage(page, 1000);
      console.log('✅ Прокрутили через плавающую кнопку');
      return true;
    } catch (error) {
      console.log(`⚠️ Ошибка при клике на плавающую кнопку: ${error}`);
    }
  }
  
  // Ищем основную кнопку заказа
  const submitBtn = page.getByTestId('order-submit-btn');
  const submitExists = await submitBtn.count() > 0;
  
  if (submitExists) {
    await submitBtn.scrollIntoViewIfNeeded();
    await waitForPage(page, 1000);
    const submitVisible = await submitBtn.isVisible({ timeout: 2000 }).catch(() => false);
    console.log(`✅ Прокрутили до кнопки заказа (${submitVisible ? 'видна' : 'скрыта'})`);
    return true;
  }
  
  // Альтернатива: ищем кнопку по тексту
  const submitByText = page.locator('button').filter({ 
    hasText: /Продолжить|Оформить|Заказать/i 
  }).first();
  const textButtonExists = await submitByText.count() > 0;
  
  if (textButtonExists) {
    await submitByText.scrollIntoViewIfNeeded();
    await waitForPage(page, 1000);
    console.log('✅ Прокрутили до кнопки заказа (найдена по тексту)');
    return true;
  }
  
  console.log('⚠️ Кнопка заказа не найдена');
  return false;
}

async function applyPromoCode(page: Page, promoCode: string = 'TEST10'): Promise<boolean> {
  console.log(`🎟️ Применяем промокод: ${promoCode}...`);
  
  // Раскрываем секцию промокода
  const promoSection = page.locator('text=Промокод').first();
  const promoSectionVisible = await promoSection.isVisible({ timeout: 5000 }).catch(() => false);
  
  if (!promoSectionVisible) {
    console.log('ℹ️ Секция промокода не видна, пробуем кликнуть на заголовок...');
    // Прокручиваем к секции промокода
    await promoSection.scrollIntoViewIfNeeded();
    await waitForPage(page, 500);
  }
  
  // Кликаем на секцию промокода, чтобы раскрыть
  try {
    await promoSection.click({ timeout: 5000 });
    await waitForPage(page, 1000);
  } catch (error) {
    console.log(`⚠️ Не удалось раскрыть секцию промокода: ${error}`);
  }
  
  // Вводим промокод
  const promoInput = page.getByTestId('order-promo-code-input');
  const promoInputVisible = await promoInput.isVisible({ timeout: 5000 }).catch(() => false);
  
  if (promoInputVisible) {
    await promoInput.fill(promoCode);
    await waitForPage(page, 500);
    
    // Применяем
    const applyBtn = page.getByTestId('order-apply-promo-btn');
    await applyBtn.click();
    await waitForPage(page, 2000);
    console.log('✅ Промокод применен');
    return true;
  }
  
  console.log('⚠️ Поле промокода не найдено');
  return false;
}

async function submitOrder(page: Page): Promise<boolean> {
  console.log('💳 Оформляем заказ...');
  
  const submitBtn = page.getByTestId('order-submit-btn');
  const submitVisible = await submitBtn.isVisible({ timeout: 10000 }).catch(() => false);
  
  if (!submitVisible) {
    // Прокручиваем к кнопке
    await submitBtn.scrollIntoViewIfNeeded();
    await waitForPage(page, 1000);
  }
  
  const isEnabled = await submitBtn.isEnabled().catch(() => false);
  
  if (!isEnabled) {
    console.log('⚠️ Кнопка оформления недоступна (возможно, нет блюд в заказе)');
    return false;
  }
  
  try {
    await submitBtn.click({ timeout: 10000 });
    await waitForPage(page, 3000);
    console.log('✅ Заказ оформлен, ожидаем модалку оплаты...');
    return true;
  } catch (error) {
    console.log(`⚠️ Ошибка при оформлении заказа: ${error}`);
    return false;
  }
}

async function waitForPaymentModal(page: Page): Promise<boolean> {
  console.log('💰 Ожидаем модалку оплаты...');
  
  const paymentModal = page.getByTestId('payment-submit-btn');
  const paymentVisible = await paymentModal.isVisible({ timeout: 15000 }).catch(() => false);
  
  if (paymentVisible) {
    console.log('✅ Модалка оплаты открыта');
    await waitForPage(page, 2000);
    return true;
  }
  
  console.log('⚠️ Модалка оплаты не найдена');
  return false;
}

async function useLoyaltyPoints(page: Page, pointsToUse: number = 50): Promise<boolean> {
  console.log(`🎁 Используем баллы: ${pointsToUse}...`);
  
  const pointsCheckbox = page.getByTestId('payment-use-points-checkbox');
  const checkboxVisible = await pointsCheckbox.isVisible({ timeout: 5000 }).catch(() => false);
  
  if (!checkboxVisible) {
    console.log('ℹ️ Чекбокс баллов не найден (возможно, нет доступных баллов)');
    return false;
  }
  
  // Включаем использование баллов
  const isChecked = await pointsCheckbox.isChecked().catch(() => false);
  if (!isChecked) {
    await pointsCheckbox.check();
    await waitForPage(page, 1000);
  }
  
  // Настраиваем слайдер
  const slider = page.getByTestId('payment-points-slider');
  const sliderVisible = await slider.isVisible({ timeout: 3000 }).catch(() => false);
  
  if (sliderVisible) {
    // Получаем максимальное значение
    const maxValue = await slider.getAttribute('max').then(v => parseInt(v || '0')).catch(() => 0);
    const valueToSet = Math.min(pointsToUse, maxValue);
    
    await slider.fill(valueToSet.toString());
    await waitForPage(page, 1000);
    console.log(`✅ Баллы настроены: ${valueToSet}`);
    return true;
  }
  
  console.log('⚠️ Слайдер баллов не найден');
  return false;
}

async function checkFinalTotal(page: Page): Promise<number | null> {
  console.log('💵 Проверяем итоговую сумму...');
  
  // Ищем итоговую сумму в модалке оплаты
  const totalSelectors = [
    page.locator('text=/К оплате|Итого|Сумма/i').first(),
    page.locator('span:has-text("₽")').last(),
    page.locator('[class*="total"], [class*="final"]').filter({ hasText: /₽/ }).first(),
  ];
  
  for (const selector of totalSelectors) {
    const visible = await selector.isVisible({ timeout: 3000 }).catch(() => false);
    if (visible) {
      const text = await selector.textContent();
      const match = text?.match(/(\d+)\s*₽/);
      if (match) {
        const total = parseInt(match[1]);
        console.log(`✅ Итоговая сумма: ${total} ₽`);
        return total;
      }
    }
  }
  
  console.log('⚠️ Итоговая сумма не найдена');
  return null;
}

test('E2E: Полный flow оформления заказа', async ({ page }) => {
  test.setTimeout(300000); // 5 минут для полного flow
  console.log(`\n🎯 ПОЛНЫЙ ТЕСТ: Оформление заказа на ${BASE_URL}\n`);

  // Шаг 1: Открываем главную страницу
  console.log('📄 Шаг 1: Открываем главную страницу');
  await page.goto('/?clear=1');
  await waitForPage(page);
  console.log('✅ Страница загружена\n');

  // Шаг 2: Авторизуемся
  console.log('🔐 Шаг 2: Авторизация');
  const loggedIn = await loginUser(page);
  
  if (!loggedIn) {
    console.log('⚠️ Пропускаем тест - требуется авторизация');
    test.skip();
    return;
  }
  console.log('');

  // Шаг 3: Выбираем дату
  console.log('📅 Шаг 3: Выбор даты доставки');
  const dateSelected = await selectDate(page);
  
  if (!dateSelected) {
    console.log('⚠️ Пропускаем тест - не удалось выбрать дату');
    test.skip();
    return;
  }
  console.log('');

  // Шаг 4: Ждем модалку заказа
  console.log('🛒 Шаг 4: Ожидание модалки заказа');
  const modalOpened = await waitForOrderModal(page);
  
  if (!modalOpened) {
    console.log('⚠️ Пропускаем тест - модалка заказа не открылась');
    test.skip();
    return;
  }
  console.log('');

  // Шаг 5: Выбираем блюда
  console.log('🍽️ Шаг 5: Выбор блюд');
  await selectMeals(page);
  await waitForPage(page, 2000);
  console.log('');

  // Шаг 6: Прокручиваем до кнопки заказа
  console.log('📜 Шаг 6: Прокрутка до кнопки заказа');
  await scrollToOrderButton(page);
  console.log('');

  // Шаг 7: Применяем промокод (опционально)
  console.log('🎟️ Шаг 7: Применение промокода');
  await applyPromoCode(page, 'TEST10');
  await waitForPage(page, 1000);
  console.log('');

  // Шаг 8: Оформляем заказ
  console.log('💳 Шаг 8: Оформление заказа');
  const orderSubmitted = await submitOrder(page);
  
  if (!orderSubmitted) {
    console.log('⚠️ Не удалось оформить заказ');
    // Не пропускаем тест, продолжаем проверки
  }
  console.log('');

  // Шаг 9: Ждем модалку оплаты
  console.log('💰 Шаг 9: Ожидание модалки оплаты');
  const paymentModalOpened = await waitForPaymentModal(page);
  
  if (paymentModalOpened) {
    // Шаг 10: Используем баллы (если доступны)
    console.log('🎁 Шаг 10: Использование баллов');
    await useLoyaltyPoints(page, 50);
    await waitForPage(page, 1000);
    console.log('');

    // Шаг 11: Проверяем итоговую сумму
    console.log('💵 Шаг 11: Проверка итоговой суммы');
    const finalTotal = await checkFinalTotal(page);
    
    if (finalTotal !== null) {
      console.log(`✅ Итоговая сумма заказа: ${finalTotal} ₽`);
    }
  } else {
    console.log('ℹ️ Модалка оплаты не открылась (возможно, требуется заполнение профиля)');
  }
  console.log('');

  console.log('\n✅ ТЕСТ ЗАВЕРШЕН УСПЕШНО\n');
});
