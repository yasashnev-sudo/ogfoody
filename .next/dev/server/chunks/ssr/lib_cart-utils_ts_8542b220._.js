module.exports = [
"[project]/lib/cart-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Cart Utilities
 * Вспомогательные функции для работы с корзиной и проверки актуальности товаров
 */ __turbopack_context__.s([
    "hasOrderContent",
    ()=>hasOrderContent,
    "validateOrderItems",
    ()=>validateOrderItems
]);
function validateOrderItems(order, currentMenu, currentExtras) {
    const unavailableItems = [];
    /**
   * Поиск блюда в текущем меню по ID или имени
   * ВАЖНО: Используем ТЕКУЩУЮ цену из меню, а не историческую
   */ const findMealInMenu = (mealToFind, categories)=>{
        if (!mealToFind) return null;
        // Ищем по всем указанным категориям
        for (const category of categories){
            const menuCategory = currentMenu[category] || [];
            // Сначала пытаемся найти по ID (самый надежный способ)
            let found = menuCategory.find((m)=>m.id === mealToFind.id);
            // Если не нашли по ID, ищем по имени (фолбэк)
            if (!found) {
                found = menuCategory.find((m)=>m.name === mealToFind.name);
            }
            if (found) {
                // ✅ КРИТИЧНО: Возвращаем блюдо с ТЕКУЩЕЙ ценой из меню
                // Но сохраняем выбранную пользователем порцию
                return {
                    ...found,
                    portion: mealToFind.portion,
                    garnish: mealToFind.garnish
                };
            }
        }
        // Блюдо не найдено в меню - добавляем в список недоступных
        unavailableItems.push(mealToFind.name);
        return null;
    };
    /**
   * Валидация BreakfastSelection
   */ const validateBreakfast = (breakfast)=>{
        if (!breakfast || !breakfast.dish) {
            return {
                dish: null
            };
        }
        const validatedDish = findMealInMenu(breakfast.dish, [
            'breakfast'
        ]);
        return {
            dish: validatedDish
        };
    };
    /**
   * Валидация FullMealSelection (lunch/dinner)
   */ const validateFullMeal = (meal, mealType)=>{
        if (!meal) {
            return {
                salad: null,
                soup: null,
                main: null
            };
        }
        const validatedSalad = meal.salad ? findMealInMenu(meal.salad, [
            `${mealType}_salad`
        ]) : null;
        const validatedSoup = meal.soup ? findMealInMenu(meal.soup, [
            `${mealType}_soup`
        ]) : null;
        const validatedMain = meal.main ? findMealInMenu(meal.main, [
            `${mealType}_main`
        ]) : null;
        // Валидация гарнира для main, если он есть
        if (validatedMain?.garnish) {
            const garnishInMenu = findMealInMenu(validatedMain.garnish, [
                'garnish'
            ]);
            if (validatedMain) {
                validatedMain.garnish = garnishInMenu;
            }
        }
        return {
            salad: validatedSalad,
            soup: validatedSoup,
            main: validatedMain
        };
    };
    /**
   * Валидация DayMeals (day1/day2)
   */ const validateDayMeals = (dayMeals)=>{
        return {
            breakfast: validateBreakfast(dayMeals.breakfast),
            lunch: validateFullMeal(dayMeals.lunch, 'lunch'),
            dinner: validateFullMeal(dayMeals.dinner, 'dinner')
        };
    };
    /**
   * Валидация всех персон в заказе
   */ const validatedPersons = order.persons.map((person)=>({
            ...person,
            day1: validateDayMeals(person.day1),
            day2: validateDayMeals(person.day2)
        }));
    /**
   * Валидация дополнений (extras)
   * ВАЖНО: Используем ТЕКУЩУЮ цену из extras
   */ const validatedExtras = (order.extras || []).map((extra)=>{
        // Ищем extra во всех категориях
        const allExtras = Object.values(currentExtras).flat();
        // Сначала по ID, потом по имени
        let found = allExtras.find((e)=>e.id === extra.id);
        if (!found) {
            found = allExtras.find((e)=>e.name === extra.name);
        }
        if (found) {
            // ✅ КРИТИЧНО: Возвращаем extra с ТЕКУЩЕЙ ценой
            return {
                ...found,
                quantity: extra.quantity
            };
        }
        // Extra не найден - добавляем в список недоступных
        unavailableItems.push(extra.name);
        return null;
    }).filter((extra)=>extra !== null);
    // Собираем валидированный заказ
    const validatedOrder = {
        ...order,
        persons: validatedPersons,
        extras: validatedExtras,
        // Важно: не копируем цены из старого заказа!
        // Они будут пересчитаны в OrderModal с актуальными ценами
        total: undefined,
        subtotal: undefined,
        deliveryFee: undefined
    };
    return {
        validatedOrder,
        unavailableItems,
        hasUnavailableItems: unavailableItems.length > 0
    };
}
function hasOrderContent(order) {
    // Проверяем persons
    const hasPersons = order.persons.some((person)=>{
        const day1HasContent = person.day1.breakfast?.dish || person.day1.lunch?.salad || person.day1.lunch?.soup || person.day1.lunch?.main || person.day1.dinner?.salad || person.day1.dinner?.soup || person.day1.dinner?.main;
        const day2HasContent = person.day2.breakfast?.dish || person.day2.lunch?.salad || person.day2.lunch?.soup || person.day2.lunch?.main || person.day2.dinner?.salad || person.day2.dinner?.soup || person.day2.dinner?.main;
        return day1HasContent || day2HasContent;
    });
    // Проверяем extras
    const hasExtras = (order.extras || []).length > 0;
    return hasPersons || hasExtras;
}
}),
];

//# sourceMappingURL=lib_cart-utils_ts_8542b220._.js.map