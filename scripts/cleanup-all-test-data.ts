/**
 * ПОЛНАЯ ОЧИСТКА ВСЕХ ТЕСТОВЫХ ДАННЫХ
 * 
 * Удаляет:
 * - Всех пользователей (кроме системных, если нужно)
 * - Все заказы
 * - Все транзакции лояльности
 * - Все промокоды (опционально)
 * 
 * ВНИМАНИЕ: Используйте ТОЛЬКО для разработки и тестирования!
 */

import fetch from 'node-fetch'

const NOCODB_URL = process.env.NOCODB_URL || 'https://noco.povarnakolesah.ru'
const NOCODB_TOKEN = process.env.NOCODB_TOKEN || 'eppmI3qJq8ahGaCzPmjmZGIze9NgJxEFQzu6Ps1r'
const API_BASE = process.env.API_BASE || (process.env.NODE_ENV === 'production' ? 'https://ogfoody.ru' : 'http://localhost:3000')

// Table IDs
const TABLE_USERS = 'mg9dm2m41bjv8ar'
const TABLE_ORDERS = 'm96i4ai2yelbboh'
const TABLE_TRANSACTIONS = 'mn244txmccpwmhx'
const TABLE_PROMO_CODES = 'm8k9x2m3n4p5q6r'

const baseUrl = NOCODB_URL.replace(/\/$/, "").replace(/\/api\/v2$/, "")

async function deleteAllRecords(tableId: string, tableName: string): Promise<number> {
  console.log(`\n🗑️ Очистка таблицы ${tableName}...`)
  
  // Получаем все записи
  const url = `${baseUrl}/api/v2/tables/${tableId}/records?limit=10000`
  const response = await fetch(url, {
    headers: {
      'xc-token': NOCODB_TOKEN,
      'Content-Type': 'application/json',
    },
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error(`❌ Ошибка получения записей из ${tableName}: ${response.status} ${errorText}`)
    return 0
  }
  
  const data = await response.json() as any
  const records = data.list || []
  const recordIds = records.map((r: any) => r.Id).filter((id: any) => id !== undefined)
  
  console.log(`   Найдено записей: ${recordIds.length}`)
  
  if (recordIds.length === 0) {
    console.log(`   ✅ Таблица ${tableName} уже пуста`)
    return 0
  }
  
  // Удаляем записи батчами по 100
  let deleted = 0
  for (let i = 0; i < recordIds.length; i += 100) {
    const batch = recordIds.slice(i, i + 100)
    
    const deleteUrl = `${baseUrl}/api/v2/tables/${tableId}/records`
    const deleteResponse = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'xc-token': NOCODB_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(batch),
    })
    
    if (deleteResponse.ok) {
      deleted += batch.length
      console.log(`   Удалено: ${deleted}/${recordIds.length}`)
    } else {
      const errorText = await deleteResponse.text()
      console.error(`   ❌ Ошибка удаления батча: ${deleteResponse.status} ${errorText}`)
    }
  }
  
  console.log(`   ✅ Удалено записей: ${deleted}`)
  return deleted
}

async function cleanupAllTestData() {
  console.log('🚀 НАЧАЛО ПОЛНОЙ ОЧИСТКИ ТЕСТОВЫХ ДАННЫХ\n')
  console.log('=' .repeat(60))
  console.log(`🌐 NocoDB: ${NOCODB_URL}`)
  console.log(`📊 Режим: ${process.env.NODE_ENV || 'development'}\n`)
  
  const results: any = {}
  
  try {
    // 1. Удаляем все транзакции лояльности
    results.transactions = await deleteAllRecords(TABLE_TRANSACTIONS, 'Loyalty_Points_Transactions')
    
    // 2. Удаляем все заказы
    results.orders = await deleteAllRecords(TABLE_ORDERS, 'Orders')
    
    // 3. Удаляем всех пользователей (опционально - можно оставить системных)
    const deleteUsers = process.argv.includes('--delete-users')
    if (deleteUsers) {
      results.users = await deleteAllRecords(TABLE_USERS, 'Users')
    } else {
      console.log(`\n⏭️ Пропущено удаление пользователей (используйте --delete-users для полной очистки)`)
    }
    
    // 4. Удаляем тестовые промокоды (опционально)
    const deletePromos = process.argv.includes('--delete-promos')
    if (deletePromos) {
      results.promos = await deleteAllRecords(TABLE_PROMO_CODES, 'Promo_Codes')
    } else {
      console.log(`\n⏭️ Пропущено удаление промокодов (используйте --delete-promos для полной очистки)`)
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('✅ ОЧИСТКА ЗАВЕРШЕНА\n')
    console.log('Результаты:', results)
    
  } catch (error: any) {
    console.error('\n❌ КРИТИЧЕСКАЯ ОШИБКА:', error)
    process.exit(1)
  }
}

// Запуск
cleanupAllTestData().catch(error => {
  console.error('❌ Критическая ошибка:', error)
  process.exit(1)
})
