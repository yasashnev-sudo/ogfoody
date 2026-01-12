# Проверка localStorage для отладки

Откройте консоль браузера (F12 → Console) и выполните следующие команды:

```javascript
// 1. Проверьте текущего пользователя
console.log("Current user:", localStorage.getItem("currentUser"))

// 2. Получите ключ заказов
const user = localStorage.getItem("currentUser")
const ordersKey = `orders_${user}`
console.log("Orders key:", ordersKey)

// 3. Проверьте заказы в localStorage
const ordersRaw = localStorage.getItem(ordersKey)
console.log("Raw orders:", ordersRaw)

// 4. Распарсите заказы
const orders = JSON.parse(ordersRaw)
console.log("Parsed orders:", orders)

// 5. Проверьте статусы заказов
orders.forEach((order, i) => {
  console.log(`Order ${i + 1}:`, {
    id: order.id,
    orderNumber: order.orderNumber,
    startDate: order.startDate,
    orderStatus: order.orderStatus,
    paid: order.paid
  })
})

// 6. Проверьте, есть ли отмененные заказы
const cancelledOrders = orders.filter(o => o.orderStatus === 'cancelled')
console.log("Cancelled orders count:", cancelledOrders.length)
console.log("Cancelled orders:", cancelledOrders)
```

## Если нашли отмененные заказы в localStorage

Значит, проблема в том, что localStorage не обновляется после отмены. Очистите его:

```javascript
const user = localStorage.getItem("currentUser")
localStorage.removeItem(`orders_${user}`)
// Затем обновите страницу (F5)
```

## Альтернатива - полная очистка

Если ничего не помогает:

```javascript
localStorage.clear()
// Затем обновите страницу (F5) и войдите заново
```



