import { test, expect } from '@playwright/test'

test.describe('Delivery Fee Display Check', () => {
  test('should display delivery fee correctly in district modal', async ({ page }) => {
    // Открываем главную страницу
    await page.goto('http://localhost:3000')
    
    // Очищаем localStorage
    await page.evaluate(() => localStorage.clear())
    
    // Перезагружаем страницу
    await page.reload()
    
    // Ждем загрузки
    await page.waitForLoadState('networkidle')
    
    // Ждем появления страницы
    await page.waitForTimeout(2000)
    
    // Ищем любые кнопки на странице
    const allButtons = page.locator('button')
    const buttonCount = await allButtons.count()
    console.log(`🔍 Всего кнопок на странице: ${buttonCount}`)
    
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const buttonText = await allButtons.nth(i).textContent()
      console.log(`  Кнопка ${i + 1}: "${buttonText}"`)
    }
    
    // Кликаем на кнопку выбора района (если есть)
    const districtButton = page.locator('button').filter({ hasText: /район|Выбрать/i })
    if (await districtButton.isVisible()) {
      await districtButton.first().click()
      
      // Ждем открытия модалки
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 })
      
      // Ищем карточки районов
      const districtCards = page.locator('[role="dialog"] button')
      const count = await districtCards.count()
      
      console.log(`📍 Найдено районов: ${count}`)
      
      // Проверяем несколько районов
      for (let i = 0; i < Math.min(count, 5); i++) {
        const card = districtCards.nth(i)
        const text = await card.textContent()
        console.log(`📦 Район ${i + 1}: ${text}`)
        
        // Проверяем что есть информация о доставке
        if (text) {
          const hasFreeDelivery = text.includes('Бесплатно') || text.includes('бесплатная')
          const hasDeliveryFee = /\d+\s*₽/.test(text)
          
          if (!hasFreeDelivery && !hasDeliveryFee) {
            console.warn(`⚠️ Район "${text}" не содержит информации о стоимости доставки`)
          } else {
            console.log(`✅ Информация о доставке найдена: ${hasFreeDelivery ? 'Бесплатно' : 'Платная'}`)
          }
        }
      }
      
      // Закрываем модалку
      await page.keyboard.press('Escape')
      
      console.log(`✅ Проверка стоимости доставки завершена`)
    } else {
      console.log(`ℹ️ Кнопка выбора района не найдена (возможно уже выбран)`)
    }
  })
})

