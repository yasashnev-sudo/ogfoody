# Исправление двойного выбора способа оплаты и времени доставки по району

**Дата:** 2026-01-11  
**Статус:** ✅ Завершено

## Проблемы

### 1. Двойной выбор способа оплаты
**Проблема:** Для авторизованного пользователя без данных система дважды просила выбрать способ оплаты:
- Первый раз в модальном окне заказа (OrderModal)
- Второй раз после заполнения профиля (в PaymentModal)

### 2. Время доставки не зависит от района
**Проблема:** Время доставки загружалось из общего API (`useMenu(weekType)`) и не учитывало выбранный район. Должно было загружаться из `Delivery Zones` по выбранному району.

## Решение

### 1. Удаление выбора способа оплаты из OrderModal

**Изменения в `components/order-modal.tsx`:**

1. **Удален UI блок выбора способа оплаты** (строки 1540-1676):
   - Кнопки "Банковская карта", "СБП", "Наличными курьеру"
   - Теперь в OrderModal только:
     - Скидки и промокоды
     - Баллы лояльности
     - Итоговая сумма

2. **Удалено состояние `paymentMethod`:**
   ```typescript
   // УДАЛЕНО:
   const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
   
   // УДАЛЕНО:
   useEffect(() => {
     if (existingOrder?.paymentMethod && existingOrder.paymentMethod !== paymentMethod) {
       setPaymentMethod(existingOrder.paymentMethod)
     }
   }, [existingOrder?.paymentMethod])
   ```

3. **Упрощена функция `handlePayAndOrder`:**
   - **Удалена логика оплаты** (симуляция платежа)
   - **Удалена установка `paid: true`** для не-наличных
   - Теперь заказ **всегда** создается как `paid: false, paymentStatus: "pending"`
   - Оплата происходит **только** в `PaymentModal`

   ```typescript
   // ДО:
   if (paymentMethod !== "cash") {
     await new Promise((resolve) => setTimeout(resolve, 2000))
   }
   const isPaid = paymentMethod !== "cash" ? true : (existingOrder?.paid ?? false)
   const order: Order = {
     paid: isPaid,
     paidAt: isPaid ? new Date().toISOString() : existingOrder?.paidAt,
     paymentStatus: isPaid ? "paid" : "pending",
     paymentMethod,
   }

   // ПОСЛЕ:
   const order: Order = {
     paid: existingOrder?.paid ?? false,
     paidAt: existingOrder?.paidAt,
     paymentStatus: existingOrder?.paymentStatus ?? "pending",
     paymentMethod: existingOrder?.paymentMethod,
   }
   ```

4. **Упрощена логика кнопки "Заказать":**
   ```typescript
   // ДО: Сложная логика с isPaymentAction, isSaveAction, isNewOrder
   // ПОСЛЕ:
   const buttonText = isExistingOrder ? "СОХРАНИТЬ" : `Заказать · ${finalTotal} ₽`
   ```

5. **Обновлен текст для неавторизованных:**
   ```typescript
   // ДО: "Войдите в профиль, чтобы применить скидки и выбрать способ оплаты"
   // ПОСЛЕ: "Войдите в профиль, чтобы применить скидки"
   ```

### 2. Время доставки теперь зависит от района

**Изменения в `components/order-modal.tsx`:**

1. **Удалено получение времени доставки из `useMenu`:**
   ```typescript
   // ДО:
   const { meals: menuData, extras: availableExtras, deliveryTimes: rawDeliveryTimes, isLoading: isMenuLoading } = useMenu(weekType)
   const deliveryTimes = Array.isArray(rawDeliveryTimes) ? rawDeliveryTimes : []

   // ПОСЛЕ:
   const { meals: menuData, extras: availableExtras, isLoading: isMenuLoading } = useMenu(weekType)
   const [deliveryTimes, setDeliveryTimes] = useState<string[]>([])
   const [isLoadingDeliveryTimes, setIsLoadingDeliveryTimes] = useState(false)
   ```

2. **Добавлен `useEffect` для загрузки интервалов по району:**
   ```typescript
   useEffect(() => {
     const loadDeliveryTimesByDistrict = async () => {
       const district = userProfile?.district || localStorage.getItem("guest_district")
       
       if (!district) {
         console.log("⏰ Район не выбран, интервалы доставки не загружаются")
         setDeliveryTimes([])
         return
       }
       
       try {
         setIsLoadingDeliveryTimes(true)
         const response = await fetch("/api/menu")
         const data = await response.json()
         
         if (data.deliveryZones && Array.isArray(data.deliveryZones)) {
           const zone = data.deliveryZones.find((z: any) => {
             const zoneName = (z.District || z.district || z["Район"] || "").trim().toLowerCase()
             return zoneName === district.toLowerCase()
           })
           
           if (zone) {
             const intervals = zone["Available Intervals"] || zone.available_intervals || zone.availableIntervals || zone["Доступные интервалы"] || []
             
             // Парсинг интервалов (массив, JSON-строка или CSV)
             let parsedIntervals: string[] = []
             if (Array.isArray(intervals)) {
               parsedIntervals = intervals
             } else if (typeof intervals === 'string') {
               try {
                 const parsed = JSON.parse(intervals)
                 parsedIntervals = Array.isArray(parsed) ? parsed : []
               } catch {
                 parsedIntervals = intervals.split(',').map(s => s.trim()).filter(Boolean)
               }
             }
             
             setDeliveryTimes(parsedIntervals)
             
             // Устанавливаем первый интервал, если время не выбрано
             if (!existingOrder?.deliveryTime && parsedIntervals.length > 0 && !deliveryTime) {
               setDeliveryTime(parsedIntervals[0])
             }
           }
         }
       } catch (error) {
         console.error("❌ Ошибка загрузки интервалов доставки:", error)
         setDeliveryTimes([])
       } finally {
         setIsLoadingDeliveryTimes(false)
       }
     }
     
     loadDeliveryTimesByDistrict()
   }, [userProfile?.district, existingOrder?.deliveryTime, deliveryTime])
   ```

## Новый flow оформления заказа

### Для авторизованного пользователя без данных:

1. **OrderModal**: Выбор блюд, время доставки (по району), скидки
2. Нажатие "Заказать" → Проверка профиля
3. **ProfileModal**: Заполнение обязательных полей (имя, район, улица, дом)
4. После сохранения профиля → Автосохранение заказа
5. **PaymentModal**: Выбор способа оплаты (ОДИН РАЗ)
   - Банковская карта
   - СБП
   - Наличными курьеру
6. Оплата (если карта/СБП) или подтверждение (если наличные)

### Для гостя (неавторизованный):

1. **DistrictSelectionModal**: Выбор района
2. **OrderModal**: Выбор блюд, время доставки (по району), скидки
3. Нажатие "Заказать" → **AuthModal**: Ввод телефона
4. **ProfileModal**: Заполнение обязательных полей
5. **PaymentModal**: Выбор способа оплаты
6. Оплата

### Для авторизованного с полным профилем:

1. **OrderModal**: Выбор блюд, время доставки (по району), скидки
2. Нажатие "Заказать" → Автосохранение заказа
3. **PaymentModal**: Выбор способа оплаты
4. Оплата

## Преимущества

1. ✅ **Нет дублирования** способа оплаты
2. ✅ **Время доставки зависит от района** (как и должно быть)
3. ✅ **Логичный flow:** Район → Заказ → Профиль → Оплата
4. ✅ **Единственное место выбора оплаты:** PaymentModal
5. ✅ **Упрощенный OrderModal:** Фокус на выборе блюд

## Тестирование

Необходимо протестировать все сценарии:

- [ ] Гость без данных
- [ ] Авторизованный без профиля
- [ ] Авторизованный с полным профилем
- [ ] Редактирование существующего заказа
- [ ] Проверка, что время доставки зависит от района

## Технические детали

### Компоненты, затронутые изменениями:
- `components/order-modal.tsx`

### Изменения в API:
- Нет изменений в API

### Изменения в типах:
- Нет изменений в типах

## Важно

⚠️ **OrderModal больше НЕ управляет способом оплаты.** Это ответственность `PaymentModal`.

⚠️ **Время доставки загружается из `Delivery Zones` по району**, а не из общего меню.


