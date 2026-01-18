import { YookassaSdk } from '@yookassa/sdk'

// Определяем тестовый режим
const isTestMode = 
  process.env.YOOKASSA_TEST_MODE === 'true' || 
  process.env.YOOKASSA_SECRET_KEY?.startsWith('test_')

// Инициализация клиента ЮKassa
export const yookassaClient = new YookassaSdk({
  shopId: process.env.YOOKASSA_SHOP_ID!,
  secretKey: process.env.YOOKASSA_SECRET_KEY!,
})

// Проверка что ключи настроены
if (!process.env.YOOKASSA_SHOP_ID || !process.env.YOOKASSA_SECRET_KEY) {
  console.warn('⚠️ YooKassa keys not configured. Payments will not work.')
} else {
  if (isTestMode) {
    console.log('🧪 YooKassa: TEST MODE enabled')
    console.log('   Shop ID:', process.env.YOOKASSA_SHOP_ID)
    console.log('   Use test cards from: YOOKASSA_TEST_CARDS.md')
  } else {
    console.log('✅ YooKassa: PRODUCTION MODE')
    console.log('   Shop ID:', process.env.YOOKASSA_SHOP_ID)
  }
}

export { isTestMode }
