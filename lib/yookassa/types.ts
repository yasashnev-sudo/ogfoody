// Типы для интеграции с ЮKassa

export interface YooKassaPaymentRequest {
  orderId: number | string
  amount: number
  description?: string
  returnUrl?: string
  metadata?: Record<string, string>
}

export interface YooKassaPaymentResponse {
  id: string
  status: 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled'
  confirmation?: {
    type: string
    confirmation_url?: string
    confirmation_token?: string
  }
  amount: {
    value: string
    currency: string
  }
  metadata?: Record<string, string>
}

export interface YooKassaWebhookEvent {
  type: 'payment.succeeded' | 'payment.canceled' | 'payment.waiting_for_capture'
  event: string
  object: {
    id: string
    status: string
    amount: {
      value: string
      currency: string
    }
    metadata?: Record<string, string>
    payment_method?: {
      type: string
    }
  }
}
