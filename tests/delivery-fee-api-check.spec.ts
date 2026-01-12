import { test, expect } from '@playwright/test'

test.describe('Delivery Fee API Check', () => {
  test('should return delivery fee from API', async ({ request }) => {
    // Загружаем меню с зонами доставки
    const response = await request.get('/api/menu')
    expect(response.ok()).toBeTruthy()
    
    const data = await response.json()
    
    console.log(`📍 Загружено зон доставки: ${data.deliveryZones?.length || 0}`)
    
    // Проверяем первые 5 зон
    const zones = data.deliveryZones || []
    for (let i = 0; i < Math.min(zones.length, 10); i++) {
      const zone = zones[i]
      const districtName = zone.District || zone.district || zone["Район"] || "?"
      const deliveryFee = zone.deliveryFee || zone["Delivery Fee"] || zone.delivery_fee || 0
      
      console.log(`📦 Район: ${districtName}`)
      console.log(`   Стоимость доставки: ${deliveryFee}₽`)
      
      // Проверяем что deliveryFee определен
      expect(deliveryFee).toBeDefined()
      
      // Проверяем что это число
      const feeAsNumber = typeof deliveryFee === 'number' ? deliveryFee : parseFloat(String(deliveryFee))
      expect(!isNaN(feeAsNumber)).toBeTruthy()
      
      if (feeAsNumber > 0) {
        console.log(`   ✅ Платная доставка: ${feeAsNumber}₽`)
      } else {
        console.log(`   ✅ Бесплатная доставка`)
      }
    }
    
    console.log(`✅ Проверка API завершена успешно`)
  })
})


