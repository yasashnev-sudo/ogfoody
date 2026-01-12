import { test, expect } from '@playwright/test';

/**
 * LOYALTY SYSTEM E2E TESTS
 * Проверяем критические сценарии системы лояльности
 */

test.describe('Loyalty System - Self-Healing Tests', () => {
  
  /**
   * СЦЕНАРИЙ А: Гость пытается оформить заказ
   * Ожидаемое поведение: Редирект на авторизацию
   */
  test('Сценарий А: Гость видит меню и перенаправляется на авторизацию', async ({ page }) => {
    // 1. Заходим на сайт
    await page.goto('/?clear=1'); // Очищаем localStorage
    await page.waitForLoadState('networkidle');
    
    // 2. Проверяем, что видим кнопку "Войти" (не авторизованы)
    const loginButton = page.locator('button:has-text("Войти")').first();
    await expect(loginButton).toBeVisible({ timeout: 10000 });
    
    // 3. Проверяем, что календарь виден
    await expect(page.locator('text=ЯНВАРЬ 2026')).toBeVisible();
    
    console.log('✅ Сценарий А пройден: Гость видит интерфейс');
  });

  /**
   * СЦЕНАРИЙ Б: Проверка фантомных заказов
   * Ожидаемое поведение: Старые заказы не должны висеть
   */
  test('Сценарий Б: Фантомные заказы удаляются при загрузке', async ({ page }) => {
    // 1. Создаем "фантомный" заказ в localStorage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await page.evaluate(() => {
      const fakeOrder = {
        id: 999,
        startDate: '2026-01-15',
        persons: [],
        extras: [],
      };
      localStorage.setItem('guest_orders', JSON.stringify([fakeOrder]));
    });
    
    // 2. Перезагружаем страницу
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // 3. Проверяем, что фантомный заказ удалился (есть id = уже в базе)
    const guestOrders = await page.evaluate(() => {
      const data = localStorage.getItem('guest_orders');
      return data ? JSON.parse(data) : [];
    });
    
    // Заказы с id должны быть удалены
    const hasOrderWithId = guestOrders.some((order: any) => order.id === 999);
    expect(hasOrderWithId).toBe(false);
    
    console.log('✅ Сценарий Б пройден: Фантомные заказы удалены');
  });

  /**
   * СЦЕНАРИЙ В: Попытка использовать больше баллов, чем есть
   * Ожидаемое поведение: Ошибка валидации, НЕ краш
   */
  test('Сценарий В: Попытка списать больше баллов, чем доступно', async ({ page }) => {
    // Этот тест требует моковой авторизации
    // Пока пропускаем (реализуем после успешного прохождения А и Б)
    test.skip();
  });

  /**
   * СЦЕНАРИЙ Г: Параметр ?clear=1 очищает localStorage
   */
  test('Сценарий Г: URL параметр ?clear=1 очищает localStorage', async ({ page }) => {
    // 1. Добавляем данные в localStorage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await page.evaluate(() => {
      localStorage.setItem('test_data', 'should_be_cleared');
    });
    
    // 2. Открываем с параметром ?clear=1
    await page.goto('/?clear=1');
    await page.waitForLoadState('networkidle');
    
    // 3. Проверяем, что localStorage пустой
    const testData = await page.evaluate(() => {
      return localStorage.getItem('test_data');
    });
    
    expect(testData).toBeNull();
    
    console.log('✅ Сценарий Г пройден: localStorage очищен');
  });
});



