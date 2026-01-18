import { YookassaSdk } from '@yookassa/sdk'

// Инициализация клиента ЮKassa
export const yookassaClient = new YookassaSdk({
  shopId: process.env.YOOKASSA_SHOP_ID!,
  secretKey: process.env.YOOKASSA_SECRET_KEY!,
})

// Проверка что ключи настроены
if (!process.env.YOOKASSA_SHOP_ID || !process.env.YOOKASSA_SECRET_KEY) {
  console.warn('⚠️ YooKassa keys not configured. Payments will not work.')
}
