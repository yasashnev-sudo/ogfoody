import { test, expect } from "@playwright/test"

/**
 * Тест для контроля ошибки "❌ Ошибка при создании заказа: {}"
 * при автооформлении заказа гостем после авторизации и заполнения профиля.
 * 
 * Проблема:
 * - Гость создает заказ -> выбирает район -> авторизуется -> заполняет профиль
 * - При автоматическом оформлении заказа в handleAutoCheckout происходит ошибка
 * - subtotal и total передаются некорректно, что приводит к ошибке создания заказа
 * 
 * Цель теста:
 * - Проверить, что заказ успешно создается после авторизации гостя
 * - Убедиться, что subtotal и total корректно рассчитываются
 * - Отсутствие ошибки "❌ Ошибка при создании заказа"
 */

test.describe("Guest Auto-Checkout Flow - Error Control", () => {
  test("should successfully create order after guest auth + profile without errors", async ({ page }) => {
    // Массив для сбора всех ошибок консоли
    const consoleErrors: string[] = []
    const consoleWarnings: string[] = []
    
    // Слушаем все сообщения консоли
    page.on("console", (msg) => {
      const text = msg.text()
      const type = msg.type()
      
      if (type === "error") {
        consoleErrors.push(text)
        console.log(`[BROWSER ERROR] ${text}`)
      }
      if (type === "warning") {
        consoleWarnings.push(text)
      }
      
      // Логируем важные шаги для отладки
      if (text.includes("🔍 [OrderModal] Вызываем onRequestAuth с order:") ||
          text.includes("📦 Обновленный заказ:") ||
          text.includes("🆕 Заказ без ID") ||
          text.includes("✅ Результат создания заказа") ||
          text.includes("❌ Ошибка при создании заказа")) {
        console.log(`[BROWSER LOG] ${text}`)
      }
    })
    
    // Перехватываем API запросы
    const apiRequests: Array<{ url: string; body: any }> = []
    
    page.on("request", (request) => {
      if (request.url().includes("/api/orders") && request.method() === "POST") {
        try {
          const postData = request.postData()
          if (postData) {
            const body = JSON.parse(postData)
            apiRequests.push({ url: request.url(), body })
            console.log("[API REQUEST POST /api/orders]", JSON.stringify(body, null, 2))
          }
        } catch (e) {
          console.log("[API REQUEST] Failed to parse:", e)
        }
      }
    })
    
    page.on("response", async (response) => {
      if (response.url().includes("/api/orders") && response.request().method() === "POST") {
        try {
          const json = await response.json()
          console.log("[API RESPONSE POST /api/orders]", JSON.stringify(json, null, 2))
        } catch (e) {
          console.log("[API RESPONSE] Failed to parse:", e)
        }
      }
    })
    
    console.log("\n=== ШАГ 1: Открываем главную страницу ===")
    await page.goto("http://localhost:3000")
    await page.waitForLoadState("networkidle")
    
    // Очищаем localStorage для чистоты теста
    await page.evaluate(() => {
      localStorage.clear()
    })
    await page.reload()
    await page.waitForLoadState("networkidle")
    
    console.log("\n=== ШАГ 2: Находим доступную дату в календаре ===")
    
    // Ждем загрузки страницы и кнопки перехода к календарю
    await page.waitForTimeout(2000)
    
    // Нажимаем на желтую кнопку "Выберите дату здесь ↓" чтобы прокрутить к календарю
    const calendarScrollButton = page.locator("button:has-text('Выберите дату здесь')").or(
      page.locator("[data-testid='view-calendar-btn']")
    ).or(
      page.locator("button", { hasText: "Календарь" })
    ).first()
    
    if (await calendarScrollButton.isVisible().catch(() => false)) {
      console.log("Нажимаем кнопку прокрутки к календарю")
      await calendarScrollButton.click()
      await page.waitForTimeout(1000)
    }
    
    // Прокручиваем к секции календаря
    await page.evaluate(() => {
      const calendarSection = document.getElementById('calendar-section')
      if (calendarSection) {
        calendarSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
    await page.waitForTimeout(1000)
    
    // Теперь находим дату по тексту месяца (например, "ЯНВАРЬ 2026")
    await expect(page.locator("text=/ЯНВАРЬ|ФЕВРАЛЬ|МАРТ|АПРЕЛЬ|МАЙ|ИЮНЬ|ИЮЛЬ|АВГУСТ|СЕНТЯБРЬ|ОКТЯБРЬ|НОЯБРЬ|ДЕКАБРЬ/i").first()).toBeVisible({ timeout: 5000 })
    
    // Ищем ТОЛЬКО даты с классом "cursor-pointer" и БЕЗ "cursor-not-allowed" и "opacity-40"
    // Используем более точный селектор, основанный на структуре календаря
    const availableDate = page.locator('div[class*="cursor-pointer"]').filter({
      hasNot: page.locator('div[class*="cursor-not-allowed"]')
    }).filter({
      hasNot: page.locator('div[class*="opacity-40"]')
    }).filter({
      hasNot: page.locator('div[class*="opacity-30"]')  // Исключаем даты других месяцев
    }).filter({
      has: page.locator('span:visible') // Есть видимый текст с числом
    }).first()
    
    await expect(availableDate).toBeVisible({ timeout: 5000 })
    console.log("Кликаем по первой доступной дате в календаре")
    await availableDate.click()
    await page.waitForTimeout(2000) // Даем время модальному окну открыться
    
    // Если появилось предупреждение "Дата недоступна", закрываем его и ищем другую дату
    const warningDialog = page.locator("text=Дата недоступна").or(page.locator("text=На эту дату нельзя оформить заказ"))
    if (await warningDialog.isVisible().catch(() => false)) {
      console.log("Дата недоступна, закрываем предупреждение и ищем другую дату")
      const closeButton = page.locator("button:has-text('Понятно')").or(page.locator("button[aria-label='Close']")).first()
      await closeButton.click()
      await page.waitForTimeout(500)
      
      // Пробуем следующую дату
      const nextAvailableDate = page.locator('div[class*="cursor-pointer"]').filter({
        hasNot: page.locator('div[class*="cursor-not-allowed"]')
      }).filter({
        hasNot: page.locator('div[class*="opacity-40"]')
      }).nth(1) // Берем вторую дату
      
      if (await nextAvailableDate.isVisible().catch(() => false)) {
        console.log("Кликаем по второй доступной дате")
        await nextAvailableDate.click()
        await page.waitForTimeout(2000)
      }
    }
    
    console.log("\n=== ШАГ 3: Заполняем заказ (1 персона, суп + гарнир) ===")
    
    // Ждем открытия модального окна заказа
    await expect(page.locator("text=Заказ на")).toBeVisible({ timeout: 10000 })
    
    // Выбираем супы для обеда
    const lunchSoupSection = page.locator("[data-meal-type='lunch-soup']").first()
    await expect(lunchSoupSection).toBeVisible({ timeout: 5000 })
    await lunchSoupSection.click()
    await page.waitForTimeout(500)
    
    // Находим первый суп и выбираем его
    const firstSoupOption = page.locator("[data-meal-option]").first()
    await expect(firstSoupOption).toBeVisible({ timeout: 5000 })
    await firstSoupOption.click()
    await page.waitForTimeout(500)
    
    // Выбираем гарнир для обеда
    const lunchGarnishSection = page.locator("[data-meal-type='lunch-garnish']").first()
    await expect(lunchGarnishSection).toBeVisible({ timeout: 5000 })
    await lunchGarnishSection.click()
    await page.waitForTimeout(500)
    
    const firstGarnishOption = page.locator("[data-meal-option]").first()
    await expect(firstGarnishOption).toBeVisible({ timeout: 5000 })
    await firstGarnishOption.click()
    await page.waitForTimeout(500)
    
    console.log("\n=== ШАГ 4: Нажимаем 'Оформить заказ' (гость) ===")
    
    // Находим и нажимаем кнопку оформления заказа
    const checkoutButton = page.locator("button:has-text('Оформить заказ')").first()
    await expect(checkoutButton).toBeVisible({ timeout: 5000 })
    await checkoutButton.click()
    await page.waitForTimeout(1000)
    
    console.log("\n=== ШАГ 5: Выбираем район доставки ===")
    
    // Ждем открытия модального окна выбора района
    await expect(page.locator("text=Выберите район доставки")).toBeVisible({ timeout: 10000 })
    
    // Выбираем первый доступный район
    const firstDistrictButton = page.locator("[data-district]").first()
    await expect(firstDistrictButton).toBeVisible({ timeout: 5000 })
    
    const districtName = await firstDistrictButton.getAttribute("data-district")
    console.log(`Выбираем район: ${districtName}`)
    
    await firstDistrictButton.click()
    await page.waitForTimeout(1000)
    
    console.log("\n=== ШАГ 6: Авторизация (ввод телефона) ===")
    
    // Ждем открытия модального окна авторизации
    await expect(page.locator("text=Введите номер телефона")).toBeVisible({ timeout: 10000 })
    
    // Вводим тестовый номер телефона
    const testPhone = `+7999${Date.now().toString().slice(-7)}`
    console.log(`Используем тестовый номер: ${testPhone}`)
    
    const phoneInput = page.locator("input[type='tel']").first()
    await phoneInput.fill(testPhone)
    await page.waitForTimeout(500)
    
    // Нажимаем "Продолжить"
    const continueButton = page.locator("button:has-text('Продолжить')").first()
    await continueButton.click()
    await page.waitForTimeout(1000)
    
    // Вводим код подтверждения (если появляется)
    const codeInputVisible = await page.locator("input[placeholder*='код']").first().isVisible().catch(() => false)
    if (codeInputVisible) {
      console.log("Вводим код подтверждения: 1234")
      const codeInput = page.locator("input[placeholder*='код']").first()
      await codeInput.fill("1234")
      await page.waitForTimeout(500)
      
      const verifyButton = page.locator("button:has-text('Подтвердить')").first()
      await verifyButton.click()
      await page.waitForTimeout(1500)
    }
    
    console.log("\n=== ШАГ 7: Заполняем профиль ===")
    
    // Ждем открытия модального окна профиля
    await expect(page.locator("text=Заполните данные профиля")).toBeVisible({ timeout: 10000 })
    
    // Заполняем имя
    const nameInput = page.locator("input[placeholder*='Имя' i]").or(page.locator("input[id='name']")).first()
    await expect(nameInput).toBeVisible({ timeout: 5000 })
    await nameInput.fill("Тестовый Пользователь")
    
    // Выбираем район (если не выбран)
    const districtSelect = page.locator("select").or(page.locator("[role='combobox']")).first()
    if (await districtSelect.isVisible().catch(() => false)) {
      await districtSelect.selectOption({ index: 1 })
    }
    
    // Заполняем улицу
    const streetInput = page.locator("input[placeholder*='Улица' i]").or(page.locator("input[id='street']")).first()
    await streetInput.fill("Тестовая улица")
    
    // Заполняем дом
    const buildingInput = page.locator("input[placeholder*='Дом' i]").or(page.locator("input[id='building']")).first()
    await buildingInput.fill("1")
    
    await page.waitForTimeout(500)
    
    console.log("\n=== ШАГ 8: Сохраняем профиль и ждем автооформления ===")
    
    // Нажимаем "Сохранить"
    const saveProfileButton = page.locator("button:has-text('Сохранить')").first()
    await saveProfileButton.click()
    
    // Ждем завершения автооформления (до 10 секунд)
    await page.waitForTimeout(5000)
    
    console.log("\n=== ШАГ 9: Проверяем результаты ===")
    
    // 1. Проверяем отсутствие ошибки "❌ Ошибка при создании заказа"
    const createOrderError = consoleErrors.find(err => err.includes("❌ Ошибка при создании заказа"))
    if (createOrderError) {
      console.error("НАЙДЕНА ОШИБКА:", createOrderError)
    }
    expect(createOrderError, "Не должно быть ошибки создания заказа").toBeUndefined()
    
    // 2. Проверяем, что был отправлен POST запрос к /api/orders
    expect(apiRequests.length, "Должен быть хотя бы один POST запрос к /api/orders").toBeGreaterThan(0)
    
    // 3. Проверяем структуру отправленного заказа
    const lastRequest = apiRequests[apiRequests.length - 1]
    console.log("\n=== Проверка тела запроса ===")
    console.log("Order:", JSON.stringify(lastRequest.body.order, null, 2))
    
    expect(lastRequest.body.order, "order должен существовать").toBeDefined()
    expect(lastRequest.body.order.subtotal, "subtotal должен быть числом > 0").toBeGreaterThan(0)
    expect(lastRequest.body.order.total, "total должен быть числом > 0").toBeGreaterThan(0)
    expect(Number.isNaN(lastRequest.body.order.subtotal), "subtotal НЕ должен быть NaN").toBe(false)
    expect(Number.isNaN(lastRequest.body.order.total), "total НЕ должен быть NaN").toBe(false)
    expect(lastRequest.body.order.persons, "persons должен быть массивом").toBeInstanceOf(Array)
    expect(lastRequest.body.order.persons.length, "persons должен содержать хотя бы 1 персону").toBeGreaterThan(0)
    
    // 4. Проверяем отсутствие критических ошибок в консоли
    const criticalErrors = consoleErrors.filter(err => 
      err.includes("NaN") || 
      err.includes("undefined") ||
      err.includes("Failed to create order")
    )
    
    if (criticalErrors.length > 0) {
      console.error("КРИТИЧЕСКИЕ ОШИБКИ В КОНСОЛИ:")
      criticalErrors.forEach(err => console.error("  -", err))
    }
    expect(criticalErrors.length, "Не должно быть критических ошибок (NaN, undefined, Failed)").toBe(0)
    
    console.log("\n✅ ТЕСТ ПРОЙДЕН: Заказ успешно создан без ошибок")
    console.log(`   - subtotal: ${lastRequest.body.order.subtotal}`)
    console.log(`   - total: ${lastRequest.body.order.total}`)
    console.log(`   - persons: ${lastRequest.body.order.persons.length}`)
  })
})

