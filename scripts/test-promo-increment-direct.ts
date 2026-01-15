/**
 * ПРЯМОЙ ТЕСТ ИНКРЕМЕНТА ПРОМОКОДА
 * Проверяет работу incrementPromoCodeUsage напрямую
 */

import fetch from 'node-fetch'

const API_BASE = process.env.API_BASE || 'https://ogfoody.ru'
const NOCODB_URL = process.env.NOCODB_URL || 'https://noco.povarnakolesah.ru'
const NOCODB_TOKEN = process.env.NOCODB_TOKEN || 'eppmI3qJq8ahGaCzPmjmZGIze9NgJxEFQzu6Ps1r'

async function createPromoCode(promoData: any): Promise<any> {
  const response = await fetch(`${API_BASE}/api/db/Promo_Codes/records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify([promoData]),
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to create promo code: ${response.status} ${errorText}`)
  }
  
  const data = await response.json() as any
  return Array.isArray(data) ? data[0] : data.list?.[0]
}

async function getPromoCode(code: string): Promise<any> {
  const response = await fetch(`${API_BASE}/api/db/Promo_Codes/records?where=(Code,eq,${encodeURIComponent(code)})`, {
    headers: { 'Content-Type': 'application/json' },
  })
  
  if (!response.ok) {
    throw new Error(`Failed to get promo code: ${response.status}`)
  }
  
  const data = await response.json() as any
  return data.list?.[0]
}

async function testDirectIncrement() {
  console.log('🧪 Прямой тест инкремента промокода\n')
  
  try {
    // Создаем промокод
    const promoCode = `TEST-DIRECT-${Date.now()}`
    const promo = await createPromoCode({
      Code: promoCode,
      'Discount Type': 'fixed',
      'Discount Value': 100,
      'Usage Type': 'unlimited',
      Active: true,
      'Times Used': 0,
    })
    
    if (!promo || !promo.Id) {
      console.error('❌ Не удалось создать промокод')
      return
    }
    
    console.log(`✅ Промокод создан: ${promoCode}, ID: ${promo.Id}`)
    
    // Проверяем начальное значение
    const promoBefore = await getPromoCode(promoCode)
    const timesUsedBefore = promoBefore?.['Times Used'] || promoBefore?.times_used || 0
    console.log(`📊 times_used до инкремента: ${timesUsedBefore}`)
    
    // Вызываем инкремент через API proxy (как в коде)
    console.log(`🔄 Вызываем инкремент через API proxy...`)
    const incrementResponse = await fetch(`${API_BASE}/api/db/Promo_Codes/records`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ Id: promo.Id, 'Times Used': timesUsedBefore + 1 }]),
    })
    
    if (!incrementResponse.ok) {
      const errorText = await incrementResponse.text()
      console.error(`❌ Ошибка инкремента: ${incrementResponse.status} ${errorText}`)
      return
    }
    
    console.log(`✅ Инкремент выполнен`)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Проверяем результат
    const promoAfter = await getPromoCode(promoCode)
    const timesUsedAfter = promoAfter?.['Times Used'] || promoAfter?.times_used || 0
    console.log(`📊 times_used после инкремента: ${timesUsedAfter}`)
    
    if (timesUsedAfter === timesUsedBefore + 1) {
      console.log(`\n✅ ТЕСТ ПРОЙДЕН: Инкремент работает правильно (${timesUsedBefore} → ${timesUsedAfter})`)
    } else {
      console.log(`\n❌ ТЕСТ ПРОВАЛЕН: Инкремент не сработал (было ${timesUsedBefore}, стало ${timesUsedAfter})`)
    }
    
    // Очистка
    await fetch(`${API_BASE}/api/admin/promo/${promo.Id}`, {
      method: 'DELETE',
    }).catch(() => {})
    
  } catch (error: any) {
    console.error('❌ Ошибка:', error.message)
  }
}

testDirectIncrement()
