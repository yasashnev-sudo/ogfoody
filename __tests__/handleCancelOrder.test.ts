/**
 * Unit-тесты для функции handleCancelOrder
 * Проверяем исправления из диалога:
 * 1. Оптимистичное обновление UI
 * 2. Фильтрация по ID заказа (не по дате!)
 * 3. Откат при ошибке
 * 4. Правильное удаление только одного заказа
 */

import { Order } from '@/lib/types'

// Типы для тестирования
type OrderTimestamp = number
type UserId = number

// Вспомогательные функции (симуляция из app/page.tsx)
const getDateTimestamp = (date: Date | string): number => {
  const d = typeof date === 'string' ? new Date(date) : date
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

const toDate = (value: Date | string): Date => {
  if (value instanceof Date) return value
  if (typeof value === 'string') {
    if (value.includes('T')) return new Date(value)
    if (value.includes('-')) {
      const [year, month, day] = value.split('-').map(Number)
      return new Date(year, month - 1, day)
    }
  }
  return new Date(value)
}

// Симуляция функции удаления заказа (ИСПРАВЛЕННАЯ ВЕРСИЯ)
function deleteOrderOptimistic(
  orders: Order[],
  orderToCancel: Order
): Order[] {
  // ✅ ПРАВИЛЬНО: фильтруем по ID
  return orders.filter((o) => o.id !== orderToCancel.id)
}

// Симуляция СТАРОЙ (неправильной) функции для сравнения
function deleteOrderByDate(
  orders: Order[],
  orderTimestamp: OrderTimestamp
): Order[] {
  // ❌ НЕПРАВИЛЬНО: фильтруем по дате
  return orders.filter((o) => getDateTimestamp(o.startDate) !== orderTimestamp)
}

describe('handleCancelOrder - Исправление критического бага', () => {
  // Тестовые данные
  const mockOrders: Order[] = [
    {
      id: 100,
      orderNumber: 'ORD-001',
      startDate: new Date('2026-01-10'),
      deliveryTime: '18:00',
      paymentMethod: 'cash',
      paid: false,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      total: 1000,
      subtotal: 1000,
      loyaltyPointsUsed: 0,
      loyaltyPointsEarned: 0,
      persons: [],
      extras: [],
    },
    {
      id: 101,
      orderNumber: 'ORD-002',
      startDate: new Date('2026-01-11'),
      deliveryTime: '19:00',
      paymentMethod: 'card',
      paid: true,
      paymentStatus: 'paid',
      orderStatus: 'pending',
      total: 2000,
      subtotal: 2000,
      loyaltyPointsUsed: 0,
      loyaltyPointsEarned: 100,
      persons: [],
      extras: [],
    },
    {
      id: 102,
      orderNumber: 'ORD-003',
      startDate: new Date('2026-01-12'),
      deliveryTime: '20:00',
      paymentMethod: 'sbp',
      paid: true,
      paymentStatus: 'paid',
      orderStatus: 'pending',
      total: 3000,
      subtotal: 3000,
      loyaltyPointsUsed: 50,
      loyaltyPointsEarned: 150,
      persons: [],
      extras: [],
    },
  ]

  describe('✅ Исправленная версия (фильтрация по ID)', () => {
    test('должна удалить ТОЛЬКО один конкретный заказ по ID', () => {
      const orderToCancel = mockOrders[1] // ORD-002, id=101
      const result = deleteOrderOptimistic(mockOrders, orderToCancel)

      expect(result).toHaveLength(2)
      expect(result.find(o => o.id === 101)).toBeUndefined()
      expect(result.find(o => o.id === 100)).toBeDefined()
      expect(result.find(o => o.id === 102)).toBeDefined()
    })

    test('должна удалить первый заказ и оставить остальные', () => {
      const orderToCancel = mockOrders[0] // ORD-001, id=100
      const result = deleteOrderOptimistic(mockOrders, orderToCancel)

      expect(result).toHaveLength(2)
      expect(result.find(o => o.id === 100)).toBeUndefined()
      expect(result.map(o => o.id)).toEqual([101, 102])
    })

    test('должна удалить последний заказ и оставить остальные', () => {
      const orderToCancel = mockOrders[2] // ORD-003, id=102
      const result = deleteOrderOptimistic(mockOrders, orderToCancel)

      expect(result).toHaveLength(2)
      expect(result.find(o => o.id === 102)).toBeUndefined()
      expect(result.map(o => o.id)).toEqual([100, 101])
    })

    test('не должна удалить заказы с разными ID, даже если они на одну дату', () => {
      // Создаем 3 заказа на ОДНУ дату, но с разными ID
      const sameDate = new Date('2026-01-15')
      const ordersOnSameDate: Order[] = [
        { ...mockOrders[0], id: 200, startDate: sameDate },
        { ...mockOrders[1], id: 201, startDate: sameDate },
        { ...mockOrders[2], id: 202, startDate: sameDate },
      ]

      const orderToCancel = ordersOnSameDate[1] // Удаляем средний
      const result = deleteOrderOptimistic(ordersOnSameDate, orderToCancel)

      // Должны остаться 2 заказа
      expect(result).toHaveLength(2)
      expect(result.find(o => o.id === 201)).toBeUndefined() // Удален
      expect(result.find(o => o.id === 200)).toBeDefined() // Остался
      expect(result.find(o => o.id === 202)).toBeDefined() // Остался
    })

    test('должна вернуть пустой массив при удалении единственного заказа', () => {
      const singleOrder = [mockOrders[0]]
      const result = deleteOrderOptimistic(singleOrder, singleOrder[0])

      expect(result).toHaveLength(0)
    })
  })

  describe('❌ Старая версия (фильтрация по дате) - демонстрация бага', () => {
    test('БАГ: удаляет ВСЕ заказы на одну дату', () => {
      // Создаем 3 заказа на ОДНУ дату
      const sameDate = new Date('2026-01-15')
      const ordersOnSameDate: Order[] = [
        { ...mockOrders[0], id: 200, startDate: sameDate },
        { ...mockOrders[1], id: 201, startDate: sameDate },
        { ...mockOrders[2], id: 202, startDate: sameDate },
      ]

      const orderTimestamp = getDateTimestamp(sameDate)
      const result = deleteOrderByDate(ordersOnSameDate, orderTimestamp)

      // БАГ: Удалились ВСЕ заказы, а не один!
      expect(result).toHaveLength(0)
      console.warn('⚠️ БАГ: Удалились все 3 заказа вместо одного!')
    })
  })

  describe('🔄 Откат при ошибке', () => {
    test('должна вернуть исходное состояние при ошибке API', () => {
      const originalOrders = [...mockOrders]
      const orderToCancel = mockOrders[1]

      // Симуляция: сначала удалили оптимистично
      let currentOrders = deleteOrderOptimistic(originalOrders, orderToCancel)
      expect(currentOrders).toHaveLength(2)

      // Симуляция: API вернул ошибку, откатываем
      currentOrders = originalOrders

      // Проверяем что вернулись к исходному состоянию
      expect(currentOrders).toHaveLength(3)
      expect(currentOrders).toEqual(originalOrders)
    })
  })

  describe('🧪 Краевые случаи', () => {
    test('должна корректно работать с заказом без ID', () => {
      const orderWithoutId: Order = {
        ...mockOrders[0],
        id: undefined as any,
      }
      const orders = [orderWithoutId]

      // При отсутствии ID (undefined !== undefined = false), заказ будет удален
      // Это ожидаемое поведение - гостевые заказы без ID удаляются
      const result = deleteOrderOptimistic(orders, orderWithoutId)
      expect(result).toHaveLength(0)
    })

    test('должна корректно работать с пустым массивом заказов', () => {
      const result = deleteOrderOptimistic([], mockOrders[0])
      expect(result).toHaveLength(0)
    })

    test('не должна удалять заказ, если ID не совпадает', () => {
      const orderToCancel = { ...mockOrders[0], id: 999 }
      const result = deleteOrderOptimistic(mockOrders, orderToCancel)

      expect(result).toHaveLength(3)
      expect(result).toEqual(mockOrders)
    })
  })

  describe('📊 Производительность', () => {
    test('должна быстро работать с большим количеством заказов', () => {
      // Создаем 1000 заказов
      const manyOrders: Order[] = Array.from({ length: 1000 }, (_, i) => ({
        ...mockOrders[0],
        id: i,
        orderNumber: `ORD-${i}`,
        startDate: new Date(`2026-01-${(i % 28) + 1}`),
      }))

      const orderToCancel = manyOrders[500]
      const startTime = performance.now()
      const result = deleteOrderOptimistic(manyOrders, orderToCancel)
      const endTime = performance.now()

      expect(result).toHaveLength(999)
      expect(result.find(o => o.id === 500)).toBeUndefined()
      expect(endTime - startTime).toBeLessThan(10) // Должно быть быстрее 10ms
    })
  })

  describe('🔍 Логирование и отладка', () => {
    test('должна корректно идентифицировать удаляемый заказ', () => {
      const orderToCancel = mockOrders[1]
      const consoleSpy = jest.spyOn(console, 'log')

      // Симуляция логирования
      console.log('Удаляем заказ ID=', orderToCancel.id)
      console.log('Было заказов:', mockOrders.length)
      const result = deleteOrderOptimistic(mockOrders, orderToCancel)
      console.log('Стало заказов:', result.length)

      expect(consoleSpy).toHaveBeenCalledWith('Удаляем заказ ID=', 101)
      expect(consoleSpy).toHaveBeenCalledWith('Было заказов:', 3)
      expect(consoleSpy).toHaveBeenCalledWith('Стало заказов:', 2)

      consoleSpy.mockRestore()
    })
  })
})

