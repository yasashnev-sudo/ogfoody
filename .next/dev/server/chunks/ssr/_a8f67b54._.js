module.exports = [
"[project]/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}),
"[project]/lib/menu-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Утилиты для работы с меню и определения недели
__turbopack_context__.s([
    "canOrderForDate",
    ()=>canOrderForDate,
    "convertMealToGarnish",
    ()=>convertMealToGarnish,
    "convertNocoDBExtraToExtraItem",
    ()=>convertNocoDBExtraToExtraItem,
    "convertNocoDBMealToMeal",
    ()=>convertNocoDBMealToMeal,
    "filterMealsByWeek",
    ()=>filterMealsByWeek,
    "getAvailableDatesForOrdering",
    ()=>getAvailableDatesForOrdering,
    "getWeekTypeForDate",
    ()=>getWeekTypeForDate,
    "groupExtrasByCategory",
    ()=>groupExtrasByCategory,
    "groupMealsByCategory",
    ()=>groupMealsByCategory
]);
function convertNocoDBMealToMeal(nocoMeal) {
    const nutrition = nocoMeal.calories ? {
        calories: nocoMeal.calories,
        protein: nocoMeal.protein || 0,
        fats: nocoMeal.fats || 0,
        carbs: nocoMeal.carbs || 0,
        weight: nocoMeal.weight_single
    } : undefined;
    return {
        id: nocoMeal.Id,
        name: nocoMeal.name,
        ingredients: nocoMeal.ingredients,
        prices: {
            single: nocoMeal.price_single,
            medium: nocoMeal.price_medium,
            large: nocoMeal.price_large
        },
        weights: {
            single: nocoMeal.weight_single,
            medium: nocoMeal.weight_medium,
            large: nocoMeal.weight_large
        },
        portion: "single",
        needsGarnish: nocoMeal.needs_garnish,
        image: nocoMeal.image,
        available: nocoMeal.available,
        description: nocoMeal.description,
        nutrition,
        category: nocoMeal.category,
        weekType: nocoMeal.is_current_week && nocoMeal.is_next_week ? "both" : nocoMeal.is_current_week ? "current" : "next"
    };
}
function convertNocoDBExtraToExtraItem(nocoExtra) {
    const nutrition = nocoExtra.calories ? {
        calories: nocoExtra.calories,
        protein: nocoExtra.protein || 0,
        fats: nocoExtra.fats || 0,
        carbs: nocoExtra.carbs || 0,
        weight: nocoExtra.weight
    } : undefined;
    return {
        id: nocoExtra.Id,
        name: nocoExtra.name,
        price: nocoExtra.price,
        image: nocoExtra.image,
        isCurrentWeek: nocoExtra.is_current_week === true || nocoExtra.is_current_week === "true" || nocoExtra.is_current_week === 1,
        isNextWeek: nocoExtra.is_next_week === true || nocoExtra.is_next_week === "true" || nocoExtra.is_next_week === 1,
        ingredients: nocoExtra.ingredients,
        description: nocoExtra.description,
        nutrition,
        category: nocoExtra.category
    };
}
function convertMealToGarnish(meal) {
    return {
        id: meal.id,
        name: meal.name,
        prices: meal.prices,
        weights: meal.weights,
        portion: meal.portion,
        ingredients: meal.ingredients,
        image: meal.image,
        description: meal.description,
        nutrition: meal.nutrition
    };
}
function groupMealsByCategory(meals) {
    const groups = {
        breakfast: [],
        lunch_salad: [],
        lunch_soup: [],
        lunch_main: [],
        dinner_salad: [],
        dinner_soup: [],
        dinner_main: [],
        garnish: []
    };
    for (const meal of meals){
        const category = meal.category;
        if (category && groups[category]) {
            groups[category].push(meal);
        }
    }
    return groups;
}
function groupExtrasByCategory(extras) {
    const groups = {
        drink: [],
        sauce: [],
        dessert: []
    };
    for (const extra of extras){
        if (extra.category && groups[extra.category]) {
            groups[extra.category].push(extra);
        }
    }
    return groups;
}
function getWeekTypeForDate(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Найти понедельник текущей недели
    const currentMonday = new Date(today);
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    currentMonday.setDate(today.getDate() + diff);
    // Найти понедельник следующей недели (последний день current week - включительно)
    const nextMonday = new Date(currentMonday);
    nextMonday.setDate(currentMonday.getDate() + 7);
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    // Если дата до понедельника следующей недели включительно - current week
    // Если дата начиная со вторника следующей недели - next week
    if (targetDate <= nextMonday) {
        return "current";
    }
    return "next";
}
function filterMealsByWeek(meals, weekType) {
    return meals.filter((meal)=>{
        if (meal.weekType === "both") return true;
        return meal.weekType === weekType;
    });
}
function getAvailableDatesForOrdering() {
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Найти понедельник текущей недели
    const currentMonday = new Date(today);
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    currentMonday.setDate(today.getDate() + diff);
    // Понедельник следующей недели (последний день current week - включительно)
    const nextMonday = new Date(currentMonday);
    nextMonday.setDate(currentMonday.getDate() + 7);
    // Вторник следующей недели (первый день next week)
    const nextTuesday = new Date(nextMonday);
    nextTuesday.setDate(nextMonday.getDate() + 1);
    // Понедельник через неделю (последний доступный день для заказа - 15 января)
    const mondayAfterNext = new Date(nextMonday);
    mondayAfterNext.setDate(nextMonday.getDate() + 7);
    // Начинаем с завтра (минимум)
    const current = new Date(today);
    current.setDate(current.getDate() + 1);
    // Добавляем даты до понедельника через неделю включительно
    while(current <= mondayAfterNext){
        // Пропускаем субботы (день 6 - выходной)
        if (current.getDay() !== 6) {
            // Определяем тип недели: до понедельника следующей недели включительно - current, после - next
            const weekType = current <= nextMonday ? "current" : "next";
            dates.push({
                date: new Date(current),
                weekType
            });
        }
        current.setDate(current.getDate() + 1);
    }
    return dates;
}
function canOrderForDate(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    // Нельзя заказать на сегодня или прошлые даты (минимум - завтра)
    if (targetDate <= today) return false;
    // Нельзя заказать на субботу (выходной)
    if (targetDate.getDay() === 6) return false;
    // Найти понедельник текущей недели
    const currentMonday = new Date(today);
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    currentMonday.setDate(today.getDate() + diff);
    // Понедельник следующей недели
    const nextMonday = new Date(currentMonday);
    nextMonday.setDate(currentMonday.getDate() + 7);
    // Понедельник через неделю (последний доступный день - 15 января)
    const mondayAfterNext = new Date(nextMonday);
    mondayAfterNext.setDate(nextMonday.getDate() + 7);
    // Можно заказать до понедельника через неделю включительно
    return targetDate <= mondayAfterNext;
}
}),
"[project]/lib/types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createEmptyDay",
    ()=>createEmptyDay,
    "getMealPrice",
    ()=>getMealPrice,
    "getMealWeight",
    ()=>getMealWeight,
    "getPortionLabel",
    ()=>getPortionLabel
]);
const createEmptyDay = ()=>({
        breakfast: {
            dish: null
        },
        lunch: {
            salad: null,
            soup: null,
            main: null
        },
        dinner: {
            salad: null,
            soup: null,
            main: null
        }
    });
function getMealPrice(meal, portion) {
    if (!meal || !meal.prices) return 0;
    if (portion === "medium" && meal.prices.medium) {
        return meal.prices.medium;
    }
    if (portion === "large" && meal.prices.large) {
        return meal.prices.large;
    }
    return meal.prices.single || 0;
}
function getMealWeight(meal, portion) {
    if (!meal || !meal.weights) return 0;
    if (portion === "medium" && meal.weights.medium) {
        return meal.weights.medium;
    }
    if (portion === "large" && meal.weights.large) {
        return meal.weights.large;
    }
    return meal.weights.single || 0;
}
function getPortionLabel(portion) {
    switch(portion){
        case "single":
            return "Стандарт";
        case "medium":
            return "Средний";
        case "large":
            return "Большой";
        default:
            return "Стандарт";
    }
}
}),
"[project]/lib/meals-data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Статические данные меню (используются как fallback если NocoDB недоступен)
// В продакшене данные загружаются из NocoDB
__turbopack_context__.s([
    "DELIVERY_TIMES",
    ()=>DELIVERY_TIMES,
    "EXTRAS",
    ()=>EXTRAS,
    "MEALS",
    ()=>MEALS,
    "getExtraById",
    ()=>getExtraById,
    "getGarnishes",
    ()=>getGarnishes,
    "getMealById",
    ()=>getMealById,
    "getMealsForWeek",
    ()=>getMealsForWeek,
    "isExtraAvailable",
    ()=>isExtraAvailable,
    "isMealAvailable",
    ()=>isMealAvailable
]);
const MEALS = {
    breakfast: [
        {
            id: 1,
            name: "Омлет с овощами",
            ingredients: "Яйца, помидоры, шпинат, сыр фета",
            description: "Воздушный омлет с сочными томатами, свежим шпинатом и нежным сыром фета",
            prices: {
                single: 280,
                medium: 350,
                large: 420
            },
            weights: {
                single: 250,
                medium: 350,
                large: 450
            },
            portion: "single",
            needsGarnish: false,
            image: "/omelet-with-vegetables-tomatoes-spinach-feta-chees.jpg",
            available: true,
            nutrition: {
                calories: 245,
                protein: 18,
                fats: 16,
                carbs: 8,
                weight: 250
            },
            category: "breakfast",
            weekType: "both"
        },
        {
            id: 2,
            name: "Овсяная каша",
            ingredients: "Овсянка, банан, ягоды, мед, орехи",
            description: "Полезная овсянка с натуральным медом, свежими ягодами и хрустящими орехами",
            prices: {
                single: 250,
                medium: 320,
                large: 390
            },
            weights: {
                single: 300,
                medium: 400,
                large: 500
            },
            portion: "single",
            needsGarnish: false,
            image: "/oatmeal-with-banana-berries-honey-nuts.jpg",
            available: true,
            nutrition: {
                calories: 320,
                protein: 12,
                fats: 8,
                carbs: 52,
                weight: 300
            },
            category: "breakfast",
            weekType: "both"
        },
        {
            id: 3,
            name: "Сырники",
            ingredients: "Творог, мука, яйца, сметана, ягодный соус",
            description: "Классические сырники из домашнего творога со сметаной и ягодным соусом",
            prices: {
                single: 320,
                medium: 400,
                large: 480
            },
            weights: {
                single: 280,
                medium: 380,
                large: 480
            },
            portion: "single",
            needsGarnish: false,
            image: "/russian-syrniki-pancakes-with-sour-cream-berry-sau.jpg",
            available: true,
            nutrition: {
                calories: 380,
                protein: 16,
                fats: 14,
                carbs: 46,
                weight: 280
            },
            category: "breakfast",
            weekType: "current"
        },
        {
            id: 4,
            name: "Панкейки",
            ingredients: "Мука, молоко, яйца, кленовый сироп",
            description: "Пышные американские панкейки с натуральным кленовым сиропом",
            prices: {
                single: 290,
                medium: 360,
                large: 430
            },
            weights: {
                single: 250,
                medium: 350,
                large: 450
            },
            portion: "single",
            needsGarnish: false,
            image: "/pancakes-maple-syrup.png",
            available: true,
            nutrition: {
                calories: 340,
                protein: 10,
                fats: 8,
                carbs: 58,
                weight: 250
            },
            category: "breakfast",
            weekType: "next"
        }
    ],
    lunch_salad: [
        {
            id: 10,
            name: "Салат Греческий",
            ingredients: "Огурцы, помидоры, перец, маслины, фета, оливковое масло",
            description: "Свежий средиземноморский салат с сыром фета и оливковым маслом",
            prices: {
                single: 340,
                medium: 420,
                large: 500
            },
            weights: {
                single: 220,
                medium: 320,
                large: 420
            },
            portion: "single",
            needsGarnish: false,
            image: "/greek-salad.jpg",
            available: true,
            nutrition: {
                calories: 280,
                protein: 8,
                fats: 22,
                carbs: 12,
                weight: 220
            },
            category: "lunch_salad",
            weekType: "both"
        },
        {
            id: 11,
            name: "Салат с тунцом",
            ingredients: "Тунец, яйцо, фасоль, помидоры, салат, оливки",
            description: "Сытный салат Нисуаз с консервированным тунцом и фасолью",
            prices: {
                single: 420,
                medium: 520,
                large: 620
            },
            weights: {
                single: 280,
                medium: 380,
                large: 480
            },
            portion: "single",
            needsGarnish: false,
            image: "/tuna-salad-nicoise.jpg",
            available: true,
            nutrition: {
                calories: 320,
                protein: 26,
                fats: 18,
                carbs: 14,
                weight: 280
            },
            category: "lunch_salad",
            weekType: "current"
        },
        {
            id: 12,
            name: "Салат Цезарь",
            ingredients: "Курица, салат ромэн, пармезан, гренки, соус",
            description: "Классический Цезарь с нежной курицей и хрустящими гренками",
            prices: {
                single: 380,
                medium: 470,
                large: 560
            },
            weights: {
                single: 260,
                medium: 360,
                large: 460
            },
            portion: "single",
            needsGarnish: false,
            image: "/caesar-salad-with-chicken-parmesan-croutons.jpg",
            available: true,
            nutrition: {
                calories: 350,
                protein: 28,
                fats: 20,
                carbs: 16,
                weight: 260
            },
            category: "lunch_salad",
            weekType: "next"
        }
    ],
    lunch_soup: [
        {
            id: 20,
            name: "Борщ",
            ingredients: "Свекла, капуста, говядина, картофель, сметана",
            description: "Традиционный украинский борщ на говяжьем бульоне со сметаной",
            prices: {
                single: 320,
                medium: 400,
                large: 480
            },
            weights: {
                single: 350,
                medium: 450,
                large: 550
            },
            portion: "single",
            needsGarnish: false,
            image: "/borscht-soup-with-sour-cream.jpg",
            available: true,
            nutrition: {
                calories: 240,
                protein: 14,
                fats: 10,
                carbs: 24,
                weight: 350
            },
            category: "lunch_soup",
            weekType: "both"
        },
        {
            id: 21,
            name: "Куриный суп",
            ingredients: "Курица, лапша, морковь, лук, зелень",
            description: "Домашний куриный суп с лапшой и свежей зеленью",
            prices: {
                single: 280,
                medium: 350,
                large: 420
            },
            weights: {
                single: 350,
                medium: 450,
                large: 550
            },
            portion: "single",
            needsGarnish: false,
            image: "/chicken-noodle-soup.jpg",
            available: true,
            nutrition: {
                calories: 180,
                protein: 16,
                fats: 6,
                carbs: 18,
                weight: 350
            },
            category: "lunch_soup",
            weekType: "current"
        },
        {
            id: 22,
            name: "Крем-суп из тыквы",
            ingredients: "Тыква, сливки, имбирь, семечки",
            description: "Нежный крем-суп из печеной тыквы с имбирем и тыквенными семечками",
            prices: {
                single: 300,
                medium: 380,
                large: 460
            },
            weights: {
                single: 300,
                medium: 400,
                large: 500
            },
            portion: "single",
            needsGarnish: false,
            image: "/pumpkin-cream-soup.jpg",
            available: true,
            nutrition: {
                calories: 220,
                protein: 6,
                fats: 14,
                carbs: 20,
                weight: 300
            },
            category: "lunch_soup",
            weekType: "next"
        }
    ],
    lunch_main: [
        {
            id: 30,
            name: "Куриная грудка",
            ingredients: "Филе курицы, специи, оливковое масло",
            description: "Сочная куриная грудка на гриле с ароматными травами",
            prices: {
                single: 380,
                medium: 470,
                large: 560
            },
            weights: {
                single: 180,
                medium: 260,
                large: 340
            },
            portion: "single",
            needsGarnish: true,
            image: "/grilled-chicken-breast-with-herbs.jpg",
            available: true,
            nutrition: {
                calories: 210,
                protein: 38,
                fats: 6,
                carbs: 2,
                weight: 180
            },
            category: "lunch_main",
            weekType: "both"
        },
        {
            id: 31,
            name: "Лосось на гриле",
            ingredients: "Стейк лосося, лимон, укроп",
            description: "Стейк норвежского лосося на гриле с лимоном и укропом",
            prices: {
                single: 580,
                medium: 720,
                large: 860
            },
            weights: {
                single: 200,
                medium: 280,
                large: 360
            },
            portion: "single",
            needsGarnish: true,
            image: "/grilled-salmon-steak-with-lemon-dill.jpg",
            available: true,
            nutrition: {
                calories: 320,
                protein: 34,
                fats: 20,
                carbs: 0,
                weight: 200
            },
            category: "lunch_main",
            weekType: "current"
        },
        {
            id: 32,
            name: "Паста Карбонара",
            ingredients: "Спагетти, бекон, сливки, пармезан, яйцо",
            description: "Классическая итальянская паста с беконом и сливочным соусом",
            prices: {
                single: 420,
                medium: 520,
                large: 620
            },
            weights: {
                single: 320,
                medium: 420,
                large: 520
            },
            portion: "single",
            needsGarnish: false,
            image: "/pasta-carbonara-with-bacon-parmesan.jpg",
            available: true,
            nutrition: {
                calories: 520,
                protein: 22,
                fats: 26,
                carbs: 48,
                weight: 320
            },
            category: "lunch_main",
            weekType: "next"
        }
    ],
    dinner_salad: [
        {
            id: 40,
            name: "Салат Оливье",
            ingredients: "Картофель, морковь, горошек, яйца, колбаса, майонез",
            description: "Классический русский салат с домашним майонезом",
            prices: {
                single: 280,
                medium: 360,
                large: 440
            },
            weights: {
                single: 250,
                medium: 350,
                large: 450
            },
            portion: "single",
            needsGarnish: false,
            image: "/olivier-salad-russian.jpg",
            available: true,
            nutrition: {
                calories: 340,
                protein: 12,
                fats: 22,
                carbs: 24,
                weight: 250
            },
            category: "dinner_salad",
            weekType: "both"
        },
        {
            id: 41,
            name: "Салат Витаминный",
            ingredients: "Капуста, морковь, болгарский перец, яблоко, лимонный сок",
            description: "Легкий витаминный салат из свежих овощей с яблоком",
            prices: {
                single: 220,
                medium: 280,
                large: 340
            },
            weights: {
                single: 200,
                medium: 300,
                large: 400
            },
            portion: "single",
            needsGarnish: false,
            image: "/vitamin-salad-cabbage.jpg",
            available: true,
            nutrition: {
                calories: 120,
                protein: 3,
                fats: 2,
                carbs: 22,
                weight: 200
            },
            category: "dinner_salad",
            weekType: "current"
        },
        {
            id: 42,
            name: "Салат с авокадо",
            ingredients: "Авокадо, руккола, черри, кедровые орехи, пармезан",
            description: "Изысканный салат с авокадо, рукколой и кедровыми орешками",
            prices: {
                single: 390,
                medium: 480,
                large: 570
            },
            weights: {
                single: 200,
                medium: 300,
                large: 400
            },
            portion: "single",
            needsGarnish: false,
            image: "/avocado-salad-arugula.jpg",
            available: true,
            nutrition: {
                calories: 320,
                protein: 8,
                fats: 28,
                carbs: 12,
                weight: 200
            },
            category: "dinner_salad",
            weekType: "next"
        }
    ],
    dinner_soup: [
        {
            id: 50,
            name: "Окрошка",
            ingredients: "Квас, огурцы, редис, яйца, колбаса, зелень, сметана",
            description: "Освежающий холодный суп на квасе с овощами",
            prices: {
                single: 290,
                medium: 370,
                large: 450
            },
            weights: {
                single: 350,
                medium: 450,
                large: 550
            },
            portion: "single",
            needsGarnish: false,
            image: "/okroshka-cold-soup.jpg",
            available: true,
            nutrition: {
                calories: 180,
                protein: 10,
                fats: 8,
                carbs: 18,
                weight: 350
            },
            category: "dinner_soup",
            weekType: "both"
        },
        {
            id: 51,
            name: "Грибной крем-суп",
            ingredients: "Шампиньоны, сливки, лук, чеснок, зелень",
            description: "Ароматный крем-суп из шампиньонов со сливками",
            prices: {
                single: 310,
                medium: 390,
                large: 470
            },
            weights: {
                single: 300,
                medium: 400,
                large: 500
            },
            portion: "single",
            needsGarnish: false,
            image: "/mushroom-cream-soup.jpg",
            available: true,
            nutrition: {
                calories: 200,
                protein: 6,
                fats: 16,
                carbs: 10,
                weight: 300
            },
            category: "dinner_soup",
            weekType: "current"
        },
        {
            id: 52,
            name: "Уха",
            ingredients: "Рыба, картофель, морковь, лук, зелень",
            description: "Наваристая уха из свежей рыбы с овощами",
            prices: {
                single: 350,
                medium: 440,
                large: 530
            },
            weights: {
                single: 350,
                medium: 450,
                large: 550
            },
            portion: "single",
            needsGarnish: false,
            image: "/fish-soup-ukha.jpg",
            available: true,
            nutrition: {
                calories: 160,
                protein: 18,
                fats: 4,
                carbs: 14,
                weight: 350
            },
            category: "dinner_soup",
            weekType: "next"
        }
    ],
    dinner_main: [
        {
            id: 60,
            name: "Стейк из индейки",
            ingredients: "Филе индейки, травы, чеснок",
            description: "Сочный стейк из индейки с ароматными травами",
            prices: {
                single: 420,
                medium: 520,
                large: 620
            },
            weights: {
                single: 180,
                medium: 260,
                large: 340
            },
            portion: "single",
            needsGarnish: true,
            image: "/turkey-steak-with-herbs-garlic.jpg",
            available: true,
            nutrition: {
                calories: 190,
                protein: 36,
                fats: 4,
                carbs: 2,
                weight: 180
            },
            category: "dinner_main",
            weekType: "both"
        },
        {
            id: 61,
            name: "Треска запеченная",
            ingredients: "Филе трески, овощи, лимон",
            description: "Запеченное филе трески с овощами и лимоном",
            prices: {
                single: 480,
                medium: 600,
                large: 720
            },
            weights: {
                single: 220,
                medium: 300,
                large: 380
            },
            portion: "single",
            needsGarnish: true,
            image: "/baked-cod-fish-with-vegetables-lemon.jpg",
            available: true,
            nutrition: {
                calories: 180,
                protein: 32,
                fats: 4,
                carbs: 6,
                weight: 220
            },
            category: "dinner_main",
            weekType: "current"
        },
        {
            id: 62,
            name: "Котлеты домашние",
            ingredients: "Говядина, свинина, лук, яйцо, специи",
            description: "Сочные домашние котлеты из мясного фарша",
            prices: {
                single: 360,
                medium: 450,
                large: 540
            },
            weights: {
                single: 200,
                medium: 280,
                large: 360
            },
            portion: "single",
            needsGarnish: true,
            image: "/homemade-cutlets.jpg",
            available: true,
            nutrition: {
                calories: 320,
                protein: 28,
                fats: 22,
                carbs: 4,
                weight: 200
            },
            category: "dinner_main",
            weekType: "next"
        }
    ],
    garnish: [
        {
            id: 70,
            name: "Гречка",
            ingredients: "Гречневая крупа, соль",
            description: "Рассыпчатая гречневая каша",
            prices: {
                single: 80,
                medium: 110,
                large: 140
            },
            weights: {
                single: 150,
                medium: 220,
                large: 290
            },
            portion: "single",
            needsGarnish: false,
            image: "/buckwheat-garnish.jpg",
            available: true,
            nutrition: {
                calories: 110,
                protein: 4,
                fats: 1,
                carbs: 22,
                weight: 150
            },
            category: "garnish",
            weekType: "both"
        },
        {
            id: 71,
            name: "Рис",
            ingredients: "Белый рис басмати, соль",
            description: "Ароматный рис басмати",
            prices: {
                single: 70,
                medium: 100,
                large: 130
            },
            weights: {
                single: 150,
                medium: 220,
                large: 290
            },
            portion: "single",
            needsGarnish: false,
            image: "/white-rice-garnish.jpg",
            available: true,
            nutrition: {
                calories: 130,
                protein: 3,
                fats: 0,
                carbs: 28,
                weight: 150
            },
            category: "garnish",
            weekType: "both"
        },
        {
            id: 72,
            name: "Овощи на пару",
            ingredients: "Брокколи, морковь, цветная капуста",
            description: "Овощной микс на пару",
            prices: {
                single: 100,
                medium: 140,
                large: 180
            },
            weights: {
                single: 150,
                medium: 220,
                large: 290
            },
            portion: "single",
            needsGarnish: false,
            image: "/steamed-vegetables-garnish.jpg",
            available: true,
            nutrition: {
                calories: 60,
                protein: 3,
                fats: 0,
                carbs: 12,
                weight: 150
            },
            category: "garnish",
            weekType: "both"
        },
        {
            id: 73,
            name: "Картофельное пюре",
            ingredients: "Картофель, молоко, сливочное масло, соль",
            description: "Нежное картофельное пюре",
            prices: {
                single: 90,
                medium: 130,
                large: 170
            },
            weights: {
                single: 150,
                medium: 220,
                large: 290
            },
            portion: "single",
            needsGarnish: false,
            image: "/mashed-potatoes-garnish.jpg",
            available: true,
            nutrition: {
                calories: 140,
                protein: 3,
                fats: 4,
                carbs: 24,
                weight: 150
            },
            category: "garnish",
            weekType: "both"
        },
        {
            id: 74,
            name: "Киноа",
            ingredients: "Белая киноа, соль, специи",
            description: "Полезная киноа со специями",
            prices: {
                single: 110,
                medium: 150,
                large: 190
            },
            weights: {
                single: 150,
                medium: 220,
                large: 290
            },
            portion: "single",
            needsGarnish: false,
            image: "/quinoa-garnish.jpg",
            available: true,
            nutrition: {
                calories: 120,
                protein: 5,
                fats: 2,
                carbs: 21,
                weight: 150
            },
            category: "garnish",
            weekType: "both"
        }
    ]
};
const EXTRAS = {
    drink: [
        {
            id: 100,
            name: "Морс клюквенный",
            price: 120,
            image: "/cranberry-mors-drink.jpg",
            available: true,
            ingredients: "Клюква, вода, сахар",
            description: "Освежающий морс из свежей клюквы",
            nutrition: {
                calories: 80,
                protein: 0,
                fats: 0,
                carbs: 20,
                weight: 250
            },
            category: "drink"
        },
        {
            id: 101,
            name: "Компот из сухофруктов",
            price: 100,
            image: "/dried-fruit-compote.jpg",
            available: true,
            ingredients: "Курага, чернослив, изюм, вода, сахар",
            description: "Традиционный компот из сухофруктов",
            nutrition: {
                calories: 90,
                protein: 1,
                fats: 0,
                carbs: 22,
                weight: 250
            },
            category: "drink"
        },
        {
            id: 102,
            name: "Лимонад домашний",
            price: 150,
            image: "/homemade-lemonade.jpg",
            available: true,
            ingredients: "Лимон, вода, сахар, мята",
            description: "Домашний лимонад с мятой",
            nutrition: {
                calories: 70,
                protein: 0,
                fats: 0,
                carbs: 18,
                weight: 250
            },
            category: "drink"
        },
        {
            id: 103,
            name: "Смузи ягодный",
            price: 180,
            image: "/berry-smoothie.jpg",
            available: true,
            ingredients: "Клубника, черника, банан, йогурт",
            description: "Густой ягодный смузи с йогуртом",
            nutrition: {
                calories: 140,
                protein: 4,
                fats: 2,
                carbs: 28,
                weight: 250
            },
            category: "drink"
        }
    ],
    sauce: [
        {
            id: 110,
            name: "Соус сырный",
            price: 60,
            image: "/cheese-sauce.jpg",
            available: true,
            ingredients: "Сыр, сливки, чеснок, специи",
            description: "Нежный сливочно-сырный соус",
            nutrition: {
                calories: 180,
                protein: 6,
                fats: 16,
                carbs: 4,
                weight: 50
            },
            category: "sauce"
        },
        {
            id: 111,
            name: "Соус томатный",
            price: 50,
            image: "/tomato-sauce.jpg",
            available: true,
            ingredients: "Томаты, лук, чеснок, базилик",
            description: "Классический томатный соус",
            nutrition: {
                calories: 60,
                protein: 2,
                fats: 2,
                carbs: 10,
                weight: 50
            },
            category: "sauce"
        },
        {
            id: 112,
            name: "Соус чесночный",
            price: 55,
            image: "/garlic-sauce.jpg",
            available: true,
            ingredients: "Чеснок, майонез, укроп",
            description: "Пикантный чесночный соус",
            nutrition: {
                calories: 220,
                protein: 1,
                fats: 24,
                carbs: 2,
                weight: 50
            },
            category: "sauce"
        },
        {
            id: 113,
            name: "Песто",
            price: 80,
            image: "/pesto-sauce.jpg",
            available: true,
            ingredients: "Базилик, кедровые орехи, пармезан, масло",
            description: "Итальянский соус песто",
            nutrition: {
                calories: 240,
                protein: 4,
                fats: 24,
                carbs: 4,
                weight: 50
            },
            category: "sauce"
        }
    ],
    dessert: [
        {
            id: 120,
            name: "Тирамису",
            price: 280,
            image: "/tiramisu-dessert.jpg",
            available: true,
            ingredients: "Маскарпоне, савоярди, кофе, какао",
            description: "Классический итальянский десерт",
            nutrition: {
                calories: 320,
                protein: 6,
                fats: 18,
                carbs: 34,
                weight: 120
            },
            category: "dessert"
        },
        {
            id: 121,
            name: "Чизкейк",
            price: 260,
            image: "/cheesecake-dessert.jpg",
            available: true,
            ingredients: "Сливочный сыр, печенье, сахар, сливки",
            description: "Нежный чизкейк Нью-Йорк",
            nutrition: {
                calories: 380,
                protein: 8,
                fats: 24,
                carbs: 32,
                weight: 130
            },
            category: "dessert"
        },
        {
            id: 122,
            name: "Панна котта",
            price: 220,
            image: "/panna-cotta-dessert.jpg",
            available: true,
            ingredients: "Сливки, сахар, ваниль, желатин, ягоды",
            description: "Итальянский десерт с ягодами",
            nutrition: {
                calories: 280,
                protein: 4,
                fats: 18,
                carbs: 26,
                weight: 110
            },
            category: "dessert"
        },
        {
            id: 123,
            name: "Брауни",
            price: 180,
            image: "/brownie-dessert.jpg",
            available: true,
            ingredients: "Шоколад, масло, яйца, мука, орехи",
            description: "Шоколадный брауни с орехами",
            nutrition: {
                calories: 340,
                protein: 6,
                fats: 20,
                carbs: 36,
                weight: 100
            },
            category: "dessert"
        }
    ]
};
const DELIVERY_TIMES = [
    "18:00 - 19:00",
    "19:00 - 20:00",
    "20:00 - 21:00",
    "21:00 - 22:00"
];
function getMealsForWeek(weekType) {
    const filtered = {};
    for (const [category, meals] of Object.entries(MEALS)){
        filtered[category] = meals.filter((meal)=>meal.weekType === "both" || meal.weekType === weekType);
    }
    return filtered;
}
function isMealAvailable(mealName, weekType) {
    const allMeals = Object.values(MEALS).flat();
    const meal = allMeals.find((m)=>m.name === mealName);
    if (!meal) return false;
    // Доступность определяется только через weekType
    if (weekType) {
        return meal.weekType === "both" || meal.weekType === weekType;
    }
    // Если weekType не указан, блюдо доступно если есть weekType
    return !!meal.weekType;
}
function isExtraAvailable(extraName, weekType) {
    const allExtras = Object.values(EXTRAS).flat();
    const extra = allExtras.find((e)=>e.name === extraName);
    if (!extra) return false;
    // Для статических данных (fallback) считаем доступными, если есть
    // В реальности доступность определяется через isCurrentWeek/isNextWeek из NocoDB
    // Но для статических данных просто проверяем наличие
    return true;
}
function getGarnishes() {
    return MEALS.garnish || [];
}
function getMealById(id) {
    return Object.values(MEALS).flat().find((m)=>m.id === id);
}
function getExtraById(id) {
    return Object.values(EXTRAS).flat().find((e)=>e.id === id);
}
}),
"[project]/hooks/use-menu.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useFullMenu",
    ()=>useFullMenu,
    "useMenu",
    ()=>useMenu,
    "useWeeklyMenu",
    ()=>useWeeklyMenu
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/swr/dist/index/index.mjs [app-ssr] (ecmascript) <locals>");
"use client";
;
const fetcher = async (url)=>{
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch menu");
    return res.json();
};
function useMenu(weekType) {
    const url = weekType ? `/api/menu?week=${weekType}` : "/api/menu";
    const { data, error, isLoading, mutate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])(url, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        dedupingInterval: 60000
    });
    // Пустые объекты если данные еще не загружены
    const emptyMeals = {
        breakfast: [],
        lunch_salad: [],
        lunch_soup: [],
        lunch_main: [],
        dinner_salad: [],
        dinner_soup: [],
        dinner_main: [],
        garnish: []
    };
    const emptyExtras = {
        drink: [],
        sauce: [],
        dessert: [],
        snack: []
    };
    return {
        meals: data?.meals || emptyMeals,
        extras: data?.extras || emptyExtras,
        deliveryZones: data?.deliveryZones || [],
        deliveryTimes: data?.deliveryTimes || [],
        isLoading,
        isError: error,
        source: data?.source || "loading",
        refresh: mutate
    };
}
function useWeeklyMenu(weekType) {
    return useMenu(weekType);
}
function useFullMenu() {
    return useMenu();
}
}),
"[project]/hooks/use-toast.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "reducer",
    ()=>reducer,
    "toast",
    ()=>toast,
    "useToast",
    ()=>useToast
]);
// Inspired by react-hot-toast library
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;
const actionTypes = {
    ADD_TOAST: 'ADD_TOAST',
    UPDATE_TOAST: 'UPDATE_TOAST',
    DISMISS_TOAST: 'DISMISS_TOAST',
    REMOVE_TOAST: 'REMOVE_TOAST'
};
let count = 0;
function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}
const toastTimeouts = new Map();
const addToRemoveQueue = (toastId)=>{
    if (toastTimeouts.has(toastId)) {
        return;
    }
    const timeout = setTimeout(()=>{
        toastTimeouts.delete(toastId);
        dispatch({
            type: 'REMOVE_TOAST',
            toastId: toastId
        });
    }, TOAST_REMOVE_DELAY);
    toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action)=>{
    switch(action.type){
        case 'ADD_TOAST':
            return {
                ...state,
                toasts: [
                    action.toast,
                    ...state.toasts
                ].slice(0, TOAST_LIMIT)
            };
        case 'UPDATE_TOAST':
            return {
                ...state,
                toasts: state.toasts.map((t)=>t.id === action.toast.id ? {
                        ...t,
                        ...action.toast
                    } : t)
            };
        case 'DISMISS_TOAST':
            {
                const { toastId } = action;
                // ! Side effects ! - This could be extracted into a dismissToast() action,
                // but I'll keep it here for simplicity
                if (toastId) {
                    addToRemoveQueue(toastId);
                } else {
                    state.toasts.forEach((toast)=>{
                        addToRemoveQueue(toast.id);
                    });
                }
                return {
                    ...state,
                    toasts: state.toasts.map((t)=>t.id === toastId || toastId === undefined ? {
                            ...t,
                            open: false
                        } : t)
                };
            }
        case 'REMOVE_TOAST':
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: []
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t)=>t.id !== action.toastId)
            };
    }
};
const listeners = [];
let memoryState = {
    toasts: []
};
function dispatch(action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener)=>{
        listener(memoryState);
    });
}
function toast({ ...props }) {
    const id = genId();
    const update = (props)=>dispatch({
            type: 'UPDATE_TOAST',
            toast: {
                ...props,
                id
            }
        });
    const dismiss = ()=>dispatch({
            type: 'DISMISS_TOAST',
            toastId: id
        });
    dispatch({
        type: 'ADD_TOAST',
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open)=>{
                if (!open) dismiss();
            }
        }
    });
    return {
        id: id,
        dismiss,
        update
    };
}
function useToast() {
    const [state, setState] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](memoryState);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        listeners.push(setState);
        return ()=>{
            const index = listeners.indexOf(setState);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, [
        state
    ]);
    return {
        ...state,
        toast,
        dismiss: (toastId)=>dispatch({
                type: 'DISMISS_TOAST',
                toastId
            })
    };
}
;
}),
"[project]/hooks/useDebugRecorder.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDebugRecorder",
    ()=>useDebugRecorder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html2canvas$2f$dist$2f$html2canvas$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/html2canvas/dist/html2canvas.esm.js [app-ssr] (ecmascript)");
'use client';
;
;
function useDebugRecorder(userId, userEmail) {
    const logsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const maxLogs = 100; // Храним последние 100 логов
    const [isCapturing, setIsCapturing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Добавляем лог в массив
    const addLog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((level, message, data)=>{
        const logEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            data
        };
        logsRef.current.push(logEntry);
        // Ограничиваем размер массива
        if (logsRef.current.length > maxLogs) {
            logsRef.current = logsRef.current.slice(-maxLogs);
        }
        // ✅ ИСПРАВЛЕНО: Выводим в оригинальную консоль ТОЛЬКО если это НЕ внутренний лог Debug системы
        const originalConsole = window.__originalConsole || console;
        const isDebugInternalLog = message.includes('[DEBUG]') || message.includes('Capturing screenshot') || message.includes('Screenshot captured') || message.includes('Sending debug report');
        if (!isDebugInternalLog) {
            if (data !== undefined) {
                originalConsole[level](`[DEBUG] ${message}`, data);
            } else {
                originalConsole[level](`[DEBUG] ${message}`);
            }
        }
    }, []);
    // Перехватываем консоль при монтировании
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Сохраняем оригинальные методы консоли
        if (!window.__originalConsole) {
            window.__originalConsole = {
                log: console.log,
                error: console.error,
                warn: console.warn,
                info: console.info
            };
        }
        const originalConsole = window.__originalConsole;
        // Перехватываем методы
        console.log = (...args)=>{
            addLog('log', args.map((arg)=>typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' '));
            originalConsole.log(...args);
        };
        console.error = (...args)=>{
            addLog('error', args.map((arg)=>typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' '));
            originalConsole.error(...args);
        };
        console.warn = (...args)=>{
            addLog('warn', args.map((arg)=>typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' '));
            originalConsole.warn(...args);
        };
        console.info = (...args)=>{
            addLog('info', args.map((arg)=>typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' '));
            originalConsole.info(...args);
        };
        // Восстанавливаем при размонтировании
        return ()=>{
            if (originalConsole) {
                console.log = originalConsole.log;
                console.error = originalConsole.error;
                console.warn = originalConsole.warn;
                console.info = originalConsole.info;
            }
        };
    }, [
        addLog
    ]);
    // Функция для создания скриншота
    const captureScreenshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            const canvas = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html2canvas$2f$dist$2f$html2canvas$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(document.body, {
                allowTaint: true,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                // ✅ Игнорируем ошибки с современными CSS функциями
                ignoreElements: (element)=>{
                    // Пропускаем элементы, которые могут вызывать проблемы
                    return false;
                },
                onclone: (clonedDoc)=>{
                    // Убираем проблемные стили из клона
                    const allElements = clonedDoc.querySelectorAll('*');
                    allElements.forEach((el)=>{
                        const style = el.style;
                        if (style) {
                            // Заменяем lab() на fallback цвет
                            if (style.backgroundColor && style.backgroundColor.includes('lab(')) {
                                style.backgroundColor = '#ffffff';
                            }
                            if (style.color && style.color.includes('lab(')) {
                                style.color = '#000000';
                            }
                        }
                    });
                }
            });
            return canvas.toDataURL('image/png');
        } catch (error) {
            // ✅ Более информативная ошибка, но не критичная
            const originalConsole = window.__originalConsole || console;
            originalConsole.warn('[DEBUG] Screenshot failed (not critical, logs will still be saved):', error.message || error);
            return null;
        }
    }, []);
    // Основная функция для захвата ошибки и отправки отчета
    const captureError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (options = {})=>{
        if (isCapturing) {
            console.warn('[DEBUG] Already capturing error, skipping...');
            return;
        }
        setIsCapturing(true);
        try {
            const { errorMessage = 'Unknown error', data, includeScreenshot = true, userComment } = options;
            // Логируем ошибку (но не как ERROR, чтобы не пугать Next.js)
            addLog('warn', `🐞 Capturing error report: ${errorMessage}`, data);
            // Создаем скриншот
            let screenshot = null;
            if (includeScreenshot) {
                addLog('info', 'Capturing screenshot...');
                screenshot = await captureScreenshot();
                if (screenshot) {
                    addLog('info', 'Screenshot captured successfully');
                } else {
                    addLog('warn', 'Screenshot capture failed, but continuing with logs only');
                }
            }
            // Получаем последние 20 логов
            const recentLogs = logsRef.current.slice(-20).map((log)=>`[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}${log.data ? `\nData: ${JSON.stringify(log.data, null, 2)}` : ''}`);
            // Формируем метаданные
            const meta = {
                userId: userId || 'guest',
                userEmail: userEmail || 'N/A',
                url: window.location.href,
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString(),
                errorMessage,
                errorData: data,
                userComment: userComment || null
            };
            // Отправляем отчет на сервер
            addLog('info', 'Sending debug report to server...');
            const response = await fetch('/api/debug/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    logs: recentLogs,
                    screenshot,
                    meta
                })
            });
            const result = await response.json();
            if (result.success) {
                addLog('info', `✅ Debug report saved: ${result.files.logs}`);
                console.log('[DEBUG] Report saved successfully:', result.files);
            } else {
                addLog('error', `❌ Failed to save debug report: ${result.error}`);
            }
            return result;
        } catch (error) {
            addLog('error', `Failed to capture error: ${error.message}`);
            console.error('[DEBUG] Capture error failed:', error);
        } finally{
            setIsCapturing(false);
        }
    }, [
        isCapturing,
        addLog,
        captureScreenshot,
        userId,
        userEmail
    ]);
    // Ручная отправка отчета
    const sendManualReport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (userComment)=>{
        return captureError({
            errorMessage: 'Manual report submission',
            includeScreenshot: true,
            userComment
        });
    }, [
        captureError
    ]);
    // Получить текущие логи
    const getLogs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        return [
            ...logsRef.current
        ];
    }, []);
    // Очистить логи
    const clearLogs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        logsRef.current = [];
        addLog('info', 'Logs cleared');
    }, [
        addLog
    ]);
    // Методы для логирования (альтернатива перехвату консоли)
    const log = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((message, data)=>{
        addLog('log', message, data);
    }, [
        addLog
    ]);
    const error = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((message, data)=>{
        addLog('error', message, data);
    }, [
        addLog
    ]);
    const warn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((message, data)=>{
        addLog('warn', message, data);
    }, [
        addLog
    ]);
    const info = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((message, data)=>{
        addLog('info', message, data);
    }, [
        addLog
    ]);
    return {
        // Основные методы
        captureError,
        sendManualReport,
        captureScreenshot,
        // Управление логами
        getLogs,
        clearLogs,
        // Методы логирования
        log,
        error,
        warn,
        info,
        // Состояние
        isCapturing
    };
}
}),
];

//# sourceMappingURL=_a8f67b54._.js.map