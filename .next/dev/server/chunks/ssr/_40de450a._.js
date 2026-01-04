module.exports = [
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
        available: nocoExtra.available,
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
    if (!meal || !meal.available) return false;
    if (weekType) {
        return meal.weekType === "both" || meal.weekType === weekType;
    }
    return true;
}
function isExtraAvailable(extraName) {
    const allExtras = Object.values(EXTRAS).flat();
    const extra = allExtras.find((e)=>e.name === extraName);
    return extra?.available ?? false;
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
"[project]/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$calendar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/calendar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$order$2d$modal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/order-modal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$order$2d$history$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/order-history.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$auth$2d$modal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/auth-modal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$app$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/app-menu.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$profile$2d$modal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/profile-modal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$payment$2d$modal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/payment-modal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$review$2d$modal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/review-modal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$warning$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/warning-dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$preloader$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/preloader.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$daily$2d$status$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/daily-status.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$fresh$2d$section$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/fresh-section.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dish$2d$smart$2d$modal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/dish-smart-modal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-ssr] (ecmascript) <export default as CalendarIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/history.js [app-ssr] (ecmascript) <export default as History>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-ssr] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$in$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogIn$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-in.js [app-ssr] (ecmascript) <export default as LogIn>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$meals$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/meals-data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-toast.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$menu$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/menu-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$getDay$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/getDay.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$addDays$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/addDays.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const formatDateKey = (date)=>{
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};
const parseDateKey = (dateKey)=>{
    const [year, month, day] = dateKey.split("-").map(Number);
    return new Date(year, month - 1, day);
};
const toDate = (value)=>{
    if (value instanceof Date) return value;
    if (typeof value === "string") {
        if (value.includes("T")) return new Date(value);
        if (value.includes("-")) return parseDateKey(value);
    }
    return new Date(value);
};
const getDateTimestamp = (value)=>{
    return toDate(value).getTime();
};
const serializeOrders = (orders)=>{
    return JSON.stringify(orders.map((o)=>({
            ...o,
            startDate: formatDateKey(toDate(o.startDate))
        })));
};
const deserializeOrders = (json)=>{
    try {
        const parsed = JSON.parse(json);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const threeMonthsAgo = new Date(today);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return parsed.map((o)=>({
                ...o,
                startDate: toDate(o.startDate),
                paid: o.paid ?? false
            })).filter((o)=>{
            const orderDate = toDate(o.startDate);
            return orderDate >= threeMonthsAgo;
        });
    } catch  {
        return [];
    }
};
// Используем функцию из menu-utils.ts для получения доступных дат
const getAvailableDates = ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$menu$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAvailableDatesForOrdering"])().map((item)=>item.date);
};
const filterAvailableItems = (order)=>{
    const filteredPersons = order.persons.map((person)=>{
        const filterDayMeals = (meals)=>{
            return {
                breakfast: {
                    dish: meals.breakfast?.dish && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$meals$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isMealAvailable"])(meals.breakfast.dish.name) ? meals.breakfast.dish : null
                },
                lunch: {
                    salad: meals.lunch?.salad && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$meals$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isMealAvailable"])(meals.lunch.salad.name) ? meals.lunch.salad : null,
                    soup: meals.lunch?.soup && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$meals$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isMealAvailable"])(meals.lunch.soup.name) ? meals.lunch.soup : null,
                    main: meals.lunch?.main && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$meals$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isMealAvailable"])(meals.lunch.main.name) ? meals.lunch.main : null
                },
                dinner: {
                    salad: meals.dinner?.salad && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$meals$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isMealAvailable"])(meals.dinner.salad.name) ? meals.dinner.salad : null,
                    soup: meals.dinner?.soup && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$meals$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isMealAvailable"])(meals.dinner.soup.name) ? meals.dinner.soup : null,
                    main: meals.dinner?.main && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$meals$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isMealAvailable"])(meals.dinner.main.name) ? meals.dinner.main : null
                }
            };
        };
        return {
            ...person,
            day1: filterDayMeals(person.day1),
            day2: filterDayMeals(person.day2)
        };
    });
    const filteredExtras = (order.extras || []).filter((extra)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$meals$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isExtraAvailable"])(extra.name));
    return {
        ...order,
        persons: filteredPersons,
        extras: filteredExtras
    };
};
const calculateOrderTotal = (order)=>{
    let total = 0;
    order.persons.forEach((person)=>{
        ;
        [
            "day1",
            "day2"
        ].forEach((day)=>{
            const dayMeals = person[day];
            if (dayMeals.breakfast?.dish) {
                const dish = dayMeals.breakfast.dish;
                total += dish.price * (dish.portion || 1);
                if (dish.garnish) {
                    total += dish.garnish.price * (dish.garnish.portion || 1);
                }
            }
            if (dayMeals.lunch) {
                if (dayMeals.lunch.salad) {
                    total += dayMeals.lunch.salad.price * (dayMeals.lunch.salad.portion || 1);
                }
                if (dayMeals.lunch.soup) {
                    total += dayMeals.lunch.soup.price * (dayMeals.lunch.soup.portion || 1);
                }
                if (dayMeals.lunch.main) {
                    const main = dayMeals.lunch.main;
                    total += main.price * (main.portion || 1);
                    if (main.garnish) {
                        total += main.garnish.price * (main.garnish.portion || 1);
                    }
                }
            }
            if (dayMeals.dinner) {
                if (dayMeals.dinner.salad) {
                    total += dayMeals.dinner.salad.price * (dayMeals.dinner.salad.portion || 1);
                }
                if (dayMeals.dinner.soup) {
                    total += dayMeals.dinner.soup.price * (dayMeals.dinner.soup.portion || 1);
                }
                if (dayMeals.dinner.main) {
                    const main = dayMeals.dinner.main;
                    total += main.price * (main.portion || 1);
                    if (main.garnish) {
                        total += main.garnish.price * (main.garnish.portion || 1);
                    }
                }
            }
        });
    });
    order.extras?.forEach((extra)=>{
        total += extra.price * extra.quantity;
    });
    return total;
};
const calculateOrderTotalForHistory = (order)=>{
    let total = 0;
    order.persons.forEach((person)=>{
        ;
        [
            "day1",
            "day2"
        ].forEach((day)=>{
            const dayMeals = person[day];
            if (dayMeals.breakfast?.dish) {
                const dish = dayMeals.breakfast.dish;
                total += dish.price * (dish.portion || 1);
                if (dish.garnish) {
                    total += dish.garnish.price * (dish.garnish.portion || 1);
                }
            }
            if (dayMeals.lunch) {
                if (dayMeals.lunch.salad) {
                    total += dayMeals.lunch.salad.price * (dayMeals.lunch.salad.portion || 1);
                }
                if (dayMeals.lunch.soup) {
                    total += dayMeals.lunch.soup.price * (dayMeals.lunch.soup.portion || 1);
                }
                if (dayMeals.lunch.main) {
                    const main = dayMeals.lunch.main;
                    total += main.price * (main.portion || 1);
                    if (main.garnish) {
                        total += main.garnish.price * (main.garnish.portion || 1);
                    }
                }
            }
            if (dayMeals.dinner) {
                if (dayMeals.dinner.salad) {
                    total += dayMeals.dinner.salad.price * (dayMeals.dinner.salad.portion || 1);
                }
                if (dayMeals.dinner.soup) {
                    total += dayMeals.dinner.soup.price * (dayMeals.dinner.soup.portion || 1);
                }
                if (dayMeals.dinner.main) {
                    const main = dayMeals.dinner.main;
                    total += main.price * (main.portion || 1);
                    if (main.garnish) {
                        total += main.garnish.price * (main.garnish.portion || 1);
                    }
                }
            }
        });
    });
    order.extras?.forEach((extra)=>{
        total += extra.price * extra.quantity;
    });
    return total;
};
function Home() {
    const [selectedDate, setSelectedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [orders, setOrders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [view, setView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("calendar");
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showProfile, setShowProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [userProfile, setUserProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [paymentOrder, setPaymentOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [reviews, setReviews] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [reviewOrder, setReviewOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showAuthModal, setShowAuthModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pendingCheckout, setPendingCheckout] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedDish, setSelectedDish] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    // Warning dialog state
    const [warningDialog, setWarningDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        open: false,
        title: "",
        description: "",
        variant: "warning"
    });
    const showWarning = (title, description, variant = "warning", onConfirm)=>{
        setWarningDialog({
            open: true,
            title,
            description,
            variant,
            onConfirm
        });
    };
    const closeWarning = ()=>{
        setWarningDialog((prev)=>{
            if (prev.onConfirm) {
                prev.onConfirm();
            }
            return {
                ...prev,
                open: false
            };
        });
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const user = localStorage.getItem("currentUser");
        if (user) {
            setIsAuthenticated(true);
            setCurrentUser(user);
            const savedOrders = localStorage.getItem(`orders_${user}`);
            if (savedOrders) {
                setOrders(deserializeOrders(savedOrders));
            }
            const savedProfile = localStorage.getItem(`profile_${user}`);
            if (savedProfile) {
                const profile = JSON.parse(savedProfile);
                setUserProfile(profile);
                // Синхронизируем заказы из базы данных для получения номеров заказов
                if (profile.id) {
                    fetch(`/api/orders?userId=${profile.id}`).then((res)=>res.json()).then((data)=>{
                        if (data.orders && Array.isArray(data.orders)) {
                            // Обновляем заказы с номерами из базы данных
                            setOrders((prevOrders)=>{
                                const updatedOrders = prevOrders.map((localOrder)=>{
                                    // Ищем соответствующий заказ в базе по id или дате
                                    const dbOrder = data.orders.find((db)=>localOrder.id && db.Id === localOrder.id || db.start_date === formatDateKey(toDate(localOrder.startDate)));
                                    if (dbOrder && dbOrder.order_number && !localOrder.orderNumber) {
                                        // Обновляем номер заказа из базы данных
                                        return {
                                            ...localOrder,
                                            id: dbOrder.Id,
                                            orderNumber: dbOrder.order_number
                                        };
                                    }
                                    return localOrder;
                                });
                                // Сохраняем обновленные заказы в localStorage
                                localStorage.setItem(`orders_${user}`, serializeOrders(updatedOrders));
                                return updatedOrders;
                            });
                        }
                    }).catch((error)=>{
                        console.error("Failed to sync orders from database:", error);
                    });
                }
            }
            const savedReviews = localStorage.getItem(`reviews_${user}`);
            if (savedReviews) {
                setReviews(JSON.parse(savedReviews));
            }
        } else {
            const guestOrders = localStorage.getItem("guest_orders");
            if (guestOrders) {
                setOrders(deserializeOrders(guestOrders));
            }
        }
    }, []);
    // Helper: Check if there's a delivery (order start date) on this date
    const hasDeliveryForDate = (date)=>{
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return orders.some((order)=>{
            const deliveryDate = new Date(order.startDate);
            deliveryDate.setHours(0, 0, 0, 0);
            return checkDate.getTime() === deliveryDate.getTime();
        });
    };
    // Helper: Check if there's food (eating days: day1 and day2 after delivery)
    const hasFoodForDate = (date)=>{
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return orders.some((order)=>{
            const deliveryDate = new Date(order.startDate);
            deliveryDate.setHours(0, 0, 0, 0);
            const day1 = new Date(deliveryDate);
            day1.setDate(day1.getDate() + 1);
            const day2 = new Date(deliveryDate);
            day2.setDate(day2.getDate() + 2);
            return checkDate.getTime() === day1.getTime() || checkDate.getTime() === day2.getTime();
        });
    };
    // Helper: Check if this date is the last day of food (day2) for any order
    const isLastDayOfAnyOrder = (date)=>{
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return orders.some((order)=>{
            const deliveryDate = new Date(order.startDate);
            deliveryDate.setHours(0, 0, 0, 0);
            // day2 is the last eating day for this order
            const day2 = new Date(deliveryDate);
            day2.setDate(day2.getDate() + 2);
            day2.setHours(0, 0, 0, 0);
            return checkDate.getTime() === day2.getTime();
        });
    };
    // Helper: Check if there's food on the next day (chain continues without gap)
    // Plus button should show if there's NO food on next day (gap exists)
    const hasNextOrder = (date)=>{
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        // PRIORITY 1: Check if there's delivery on this day (new order continues chain)
        if (hasDeliveryForDate(date)) {
            return true;
        }
        // PRIORITY 2: Check if there's FOOD on the next day (no gap - chain continues)
        // If there's food on next day, the chain continues. If no food, there's a gap and plus should show
        const nextDay = new Date(checkDate);
        nextDay.setDate(nextDay.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);
        return hasFoodForDate(nextDay);
    };
    // Helper: Check if yellow plus button should be shown (last day of any order with food, no delivery, no next order)
    const shouldShowYellowPlus = (date)=>{
        const hasFood = hasFoodForDate(date);
        const isLastDayOfOrder = isLastDayOfAnyOrder(date);
        const hasDelivery = hasDeliveryForDate(date);
        const hasNextOrderForLastDay = hasNextOrder(date);
        return hasFood && isLastDayOfOrder && !hasDelivery && !hasNextOrderForLastDay;
    };
    const handleDateClick = (date)=>{
        const isSaturday = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$getDay$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDay"])(date) === 6;
        // Проверяем, есть ли заказ на эту дату
        const order = orders.find((order)=>{
            const orderDate = new Date(order.startDate);
            return orderDate.getDate() === date.getDate() && orderDate.getMonth() === date.getMonth() && orderDate.getFullYear() === date.getFullYear();
        });
        // Обработка субботы
        if (isSaturday) {
            const hasYellowPlus = shouldShowYellowPlus(date);
            if (hasYellowPlus) {
                // Суббота + есть желтый плюс → показать предупреждение и переключить на воскресенье
                const sunday = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$addDays$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addDays"])(date, 1);
                showWarning("Доставка в воскресенье", "Доставка ближайшая возможна только в воскресенье, потому что кухня отдыхает по субботам. Заказ будет оформлен на воскресенье.", "warning", ()=>{
                    setSelectedDate(sunday);
                });
                return;
            } else {
                // Суббота + нет желтого плюса → показать ошибку про кухню
                showWarning("Кухня отдыхает", "На субботу заказ невозможен, потому что кухня отдыхает. Выберите другую дату.", "error");
                return;
            }
        }
        // Проверяем, есть ли еда на эту дату (от предыдущего заказа)
        const hasFood = hasFoodForDate(date);
        // Если есть еда от предыдущего заказа, но нет заказа на эту дату
        // И дата недоступна для заказа (прошла или вне диапазона) - показать сообщение
        if (hasFood && !order && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$menu$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canOrderForDate"])(date)) {
            showWarning("Меню еще не обновлено", "На эту дату есть еда от предыдущего заказа, но пока нельзя оформить новый заказ. Пожалуйста, дождитесь обновления меню.", "info");
            return;
        }
        // Открываем модальное окно если:
        // 1. Есть существующий заказ на эту дату (можно просмотреть/изменить)
        // 2. Можно заказать на эту дату (даже если есть еда от предыдущего заказа - можно перезаказать)
        if (order || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$menu$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canOrderForDate"])(date)) {
            setSelectedDate(date);
        } else {
            showWarning("Дата недоступна", "На эту дату нельзя оформить заказ. Выберите другую дату.", "error");
        }
    };
    const handleCloseModal = ()=>{
        setSelectedDate(null);
    };
    const handleSaveOrder = async (order)=>{
        const user = localStorage.getItem("currentUser");
        const orderTimestamp = getDateTimestamp(order.startDate);
        const existingOrder = orders.find((o)=>getDateTimestamp(o.startDate) === orderTimestamp);
        console.log("🔵 handleSaveOrder вызван:", {
            isAuthenticated,
            hasUserProfile: !!userProfile,
            userId: userProfile?.id,
            hasExistingOrder: !!existingOrder?.id
        });
        // Если заказ существует и имеет id, и пользователь авторизован, обновляем через API
        if (existingOrder?.id && isAuthenticated && userProfile?.id) {
            try {
                // Вычисляем итоговую сумму заказа
                const total = calculateOrderTotal(order);
                const updatedOrder = {
                    ...order,
                    id: existingOrder.id,
                    orderNumber: existingOrder.orderNumber,
                    subtotal: total,
                    total: total
                };
                const response = await fetch(`/api/orders/${existingOrder.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        order: updatedOrder
                    })
                });
                if (!response.ok) {
                    throw new Error("Failed to update order");
                }
                const result = await response.json();
                // Обновляем заказ в состоянии с данными из API
                setOrders((prev)=>{
                    const filtered = prev.filter((o)=>getDateTimestamp(o.startDate) !== orderTimestamp);
                    const newOrders = [
                        ...filtered,
                        {
                            ...updatedOrder,
                            orderNumber: result.orderNumber || existingOrder.orderNumber || updatedOrder.orderNumber,
                            startDate: toDate(updatedOrder.startDate),
                            paid: updatedOrder.paid ?? false
                        }
                    ];
                    if (user) {
                        localStorage.setItem(`orders_${user}`, serializeOrders(newOrders));
                    }
                    return newOrders;
                });
                toast({
                    title: "Заказ обновлен",
                    description: "Изменения успешно сохранены",
                    duration: 3000
                });
            } catch (error) {
                console.error("Failed to update order:", error);
                toast({
                    title: "Ошибка",
                    description: "Не удалось обновить заказ. Попробуйте еще раз.",
                    variant: "destructive",
                    duration: 5000
                });
                return;
            }
        } else if (isAuthenticated && userProfile?.id) {
            // Создаем новый заказ через API
            console.log("✅ Условие для создания заказа выполнено:", {
                isAuthenticated,
                hasUserProfile: !!userProfile,
                userId: userProfile?.id,
                sendingToServer: true
            });
            try {
                const total = calculateOrderTotal(order);
                const newOrder = {
                    ...order,
                    subtotal: total,
                    total: total
                };
                console.log("📤 Отправка заказа на сервер:", {
                    personsCount: newOrder.persons?.length,
                    extrasCount: newOrder.extras?.length,
                    userId: userProfile.id
                });
                const response = await fetch("/api/orders", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        order: newOrder,
                        userId: userProfile.id
                    })
                });
                console.log("📥 Ответ сервера:", response.status, response.statusText);
                if (!response.ok) {
                    const errorData = await response.json().catch(()=>({
                            error: "Unknown error"
                        }));
                    console.error("❌ Ошибка при создании заказа:", errorData);
                    throw new Error(errorData.error || "Failed to create order");
                }
                const result = await response.json();
                console.log("✅ Результат создания заказа:", result);
                // Проверяем, что номер заказа получен
                console.log("Order creation result:", result);
                if (!result.orderNumber) {
                    console.warn("⚠️ Order number not received from API:", result);
                    // Пытаемся получить номер заказа из базы данных
                    if (result.orderId) {
                        try {
                            const fetchResponse = await fetch(`/api/orders?userId=${userProfile.id}`);
                            const fetchData = await fetchResponse.json();
                            const dbOrder = fetchData.orders?.find((o)=>o.Id === result.orderId);
                            if (dbOrder?.order_number) {
                                result.orderNumber = dbOrder.order_number;
                                console.log("✅ Retrieved order number from DB:", result.orderNumber);
                            }
                        } catch (error) {
                            console.error("Failed to fetch order number:", error);
                        }
                    }
                }
                // Обязательно проверяем наличие номера заказа
                if (!result.orderNumber) {
                    console.error("❌ CRITICAL: Order number is missing from API response!", result);
                    // Генерируем номер заказа на клиенте как fallback
                    const fallbackOrderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
                    result.orderNumber = fallbackOrderNumber;
                    console.warn("⚠️ Using fallback order number:", fallbackOrderNumber);
                }
                // Обновляем заказ в состоянии с id из API
                const savedOrder = {
                    ...newOrder,
                    id: result.orderId,
                    orderNumber: result.orderNumber,
                    startDate: toDate(newOrder.startDate),
                    paid: newOrder.paid ?? false
                };
                console.log("💾 Saving order to state:", {
                    id: savedOrder.id,
                    orderNumber: savedOrder.orderNumber,
                    startDate: savedOrder.startDate,
                    hasOrderNumber: !!savedOrder.orderNumber,
                    orderNumberType: typeof savedOrder.orderNumber
                });
                if (!savedOrder.orderNumber) {
                    console.error("❌ FATAL: Order number is still missing after all checks!", savedOrder);
                }
                setOrders((prev)=>{
                    const filtered = prev.filter((o)=>getDateTimestamp(o.startDate) !== orderTimestamp);
                    const newOrders = [
                        ...filtered,
                        savedOrder
                    ];
                    // Дополнительная проверка перед сохранением
                    const orderToSave = newOrders.find((o)=>o.id === savedOrder.id);
                    if (orderToSave && !orderToSave.orderNumber) {
                        console.error("❌ Order number lost during state update!", orderToSave);
                        orderToSave.orderNumber = result.orderNumber;
                    }
                    if (user) {
                        const serialized = serializeOrders(newOrders);
                        localStorage.setItem(`orders_${user}`, serialized);
                        // Проверяем после сериализации
                        const deserialized = deserializeOrders(serialized);
                        const checkOrder = deserialized.find((o)=>o.id === savedOrder.id);
                        console.log("✅ Saved to localStorage, orders count:", newOrders.length);
                        console.log("🔍 Verification - saved order after serialize/deserialize:", {
                            id: checkOrder?.id,
                            orderNumber: checkOrder?.orderNumber,
                            hasOrderNumber: !!checkOrder?.orderNumber,
                            allFields: Object.keys(checkOrder || {})
                        });
                        if (checkOrder && !checkOrder.orderNumber) {
                            console.error("❌ Order number lost during serialization!", checkOrder);
                            // Принудительно восстанавливаем номер заказа
                            checkOrder.orderNumber = result.orderNumber;
                            // Обновляем localStorage с исправленным заказом
                            const fixedOrders = newOrders.map((o)=>o.id === checkOrder.id ? {
                                    ...o,
                                    orderNumber: result.orderNumber
                                } : o);
                            localStorage.setItem(`orders_${user}`, serializeOrders(fixedOrders));
                            // Обновляем состояние
                            setTimeout(()=>{
                                setOrders(fixedOrders);
                            }, 100);
                        }
                    }
                    // Финальная проверка - убеждаемся, что номер заказа есть
                    const finalCheck = newOrders.find((o)=>o.id === savedOrder.id);
                    if (finalCheck && !finalCheck.orderNumber && result.orderNumber) {
                        console.warn("⚠️ Fixing missing order number in state...");
                        finalCheck.orderNumber = result.orderNumber;
                        if (user) {
                            localStorage.setItem(`orders_${user}`, serializeOrders(newOrders.map((o)=>o.id === finalCheck.id ? finalCheck : o)));
                        }
                    }
                    return newOrders;
                });
                toast({
                    title: "Заказ создан",
                    description: result.orderNumber ? `Заказ № ${result.orderNumber} успешно оформлен` : "Заказ успешно оформлен",
                    duration: 5000
                });
            } catch (error) {
                console.error("❌ Ошибка при создании заказа:", error);
                toast({
                    title: "Ошибка",
                    description: error instanceof Error ? error.message : "Не удалось создать заказ. Попробуйте еще раз.",
                    variant: "destructive",
                    duration: 5000
                });
            }
        } else {
            // Пользователь не авторизован или нет userProfile.id
            const reason = !isAuthenticated ? "Пользователь не авторизован" : !userProfile ? "userProfile отсутствует" : !userProfile.id ? "userProfile.id отсутствует" : "Неизвестная причина";
            console.warn("⚠️ Заказ не создается через API, причина:", {
                isAuthenticated,
                hasUserProfile: !!userProfile,
                userId: userProfile?.id,
                reason,
                userProfileKeys: userProfile ? Object.keys(userProfile) : []
            });
            // Сохраняем только в localStorage (для гостей или если нет userId)
            setOrders((prev)=>{
                const filtered = prev.filter((o)=>getDateTimestamp(o.startDate) !== orderTimestamp);
                const newOrders = [
                    ...filtered,
                    {
                        ...order,
                        startDate: toDate(order.startDate),
                        paid: order.paid ?? false
                    }
                ];
                if (user) {
                    localStorage.setItem(`orders_${user}`, serializeOrders(newOrders));
                } else {
                    localStorage.setItem("guest_orders", serializeOrders(newOrders));
                }
                return newOrders;
            });
            toast({
                title: "Заказ сохранен локально",
                description: !isAuthenticated ? "Войдите в систему, чтобы сохранить заказ на сервере" : "Ошибка при создании заказа. Проверьте данные профиля.",
                variant: !isAuthenticated ? "default" : "destructive",
                duration: 5000
            });
        }
        setSelectedDate(null);
    };
    // Удаляем дублирующий код - больше не нужен
    /*
  const handleSaveOrderOld = async (order: Order) => {
    const user = localStorage.getItem("currentUser")
    const orderTimestamp = getDateTimestamp(order.startDate)
    const existingOrder = orders.find((o) => getDateTimestamp(o.startDate) === orderTimestamp)
    
    if (existingOrder?.id && isAuthenticated && userProfile?.id) {
      // ... existing code ...
    } else if (isAuthenticated && userProfile?.id) {
      // ... existing code ...
    } else {
      // Сохраняем локально для неавторизованных пользователей
      const updatedOrders = [...orders]
      const index = updatedOrders.findIndex((o) => getDateTimestamp(o.startDate) === orderTimestamp)
      
      if (index >= 0) {
        updatedOrders[index] = { ...order, startDate: toDate(order.startDate) }
      } else {
        updatedOrders.push({ ...order, startDate: toDate(order.startDate) })
      }
      
      setOrders(updatedOrders)
      
      const guestOrders = localStorage.getItem("guest_orders")
      if (guestOrders) {
        const parsed = deserializeOrders(guestOrders)
        const filtered = parsed.filter((o) => getDateTimestamp(o.startDate) !== orderTimestamp)
        localStorage.setItem("guest_orders", serializeOrders([...filtered, { ...order, startDate: toDate(order.startDate) }]))
      } else {
        localStorage.setItem("guest_orders", serializeOrders([{ ...order, startDate: toDate(order.startDate) }]))
      }
      
      toast({
        title: "Заказ сохранен",
        description: "Заказ сохранен локально. Войдите в систему, чтобы сохранить его на сервере.",
        duration: 3000,
      })
    }
  }
  
  // Временная заглушка - удалить после проверки
  const handleSaveOrderBackup = async (order: Order) => {
    console.log("🔵 handleSaveOrder вызван:", {
      isAuthenticated,
      hasUserProfile: !!userProfile,
      userId: userProfile?.id,
    })
    
    const user = localStorage.getItem("currentUser")
    const orderTimestamp = getDateTimestamp(order.startDate)
    const existingOrder = orders.find((o) => getDateTimestamp(o.startDate) === orderTimestamp)
    
    if (existingOrder?.id && isAuthenticated && userProfile?.id) {
      try {
        const total = calculateOrderTotal(order)
        const updatedOrder: Order = {
          ...order,
          id: existingOrder.id,
          orderNumber: existingOrder.orderNumber,
          subtotal: total,
          total: total,
        }
        
        const response = await fetch(`/api/orders/${existingOrder.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: updatedOrder }),
        })
        
        if (!response.ok) {
          throw new Error("Failed to update order")
        }
        
        const result = await response.json()
        
        setOrders((prev) => {
          const filtered = prev.filter((o) => getDateTimestamp(o.startDate) !== orderTimestamp)
          const newOrders = [
            ...filtered,
            {
              ...updatedOrder,
              orderNumber: result.orderNumber || existingOrder.orderNumber || updatedOrder.orderNumber,
              startDate: toDate(updatedOrder.startDate),
              paid: updatedOrder.paid ?? false,
            },
          ]
          if (user) {
            localStorage.setItem(`orders_${user}`, serializeOrders(newOrders))
          }
          return newOrders
        })
        
        toast({
          title: "Заказ обновлен",
          description: "Изменения успешно сохранены",
          duration: 3000,
        })
      } catch (error) {
        console.error("Failed to update order:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось обновить заказ. Попробуйте еще раз.",
          variant: "destructive",
          duration: 5000,
        })
        return
      }
    } else if (isAuthenticated && userProfile?.id) {
      try {
        const total = calculateOrderTotal(order)
        const newOrder: Order = {
          ...order,
          subtotal: total,
          total: total,
        }
        
        console.log("📤 Отправка заказа на сервер:", {
          personsCount: newOrder.persons?.length,
          extrasCount: newOrder.extras?.length,
          userId: userProfile.id,
        })
        
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: newOrder, userId: userProfile.id }),
        })
        
        console.log("📥 Ответ сервера:", response.status, response.statusText)
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
          console.error("❌ Ошибка при создании заказа:", errorData)
          throw new Error(errorData.error || "Failed to create order")
        }
        
        const result = await response.json()
        console.log("✅ Результат создания заказа:", result)
        
        // Проверяем, что номер заказа получен
        console.log("Order creation result:", result)
        if (!result.orderNumber) {
          console.warn("⚠️ Order number not received from API:", result)
          // Пытаемся получить номер заказа из базы данных
          if (result.orderId) {
            try {
              const fetchResponse = await fetch(`/api/orders?userId=${userProfile.id}`)
              const fetchData = await fetchResponse.json()
              const dbOrder = fetchData.orders?.find((o: any) => o.Id === result.orderId)
              if (dbOrder?.order_number) {
                result.orderNumber = dbOrder.order_number
                console.log("✅ Retrieved order number from DB:", result.orderNumber)
              }
            } catch (error) {
              console.error("Failed to fetch order number:", error)
            }
          }
        }
        
        // Обязательно проверяем наличие номера заказа
        if (!result.orderNumber) {
          console.error("❌ CRITICAL: Order number is missing from API response!", result)
          // Генерируем номер заказа на клиенте как fallback
          const fallbackOrderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
          result.orderNumber = fallbackOrderNumber
          console.warn("⚠️ Using fallback order number:", fallbackOrderNumber)
        }
        
        // Обновляем заказ в состоянии с id из API
        const savedOrder: Order = {
          ...newOrder,
          id: result.orderId,
          orderNumber: result.orderNumber, // Гарантируем, что номер заказа есть
          startDate: toDate(newOrder.startDate),
          paid: newOrder.paid ?? false,
        }
        
  */ const handleCancelOrder = (startDate)=>{
        const orderTimestamp = getDateTimestamp(startDate);
        const orderToCancel = orders.find((o)=>getDateTimestamp(o.startDate) === orderTimestamp);
        const wasPaid = orderToCancel?.paid && orderToCancel?.paymentMethod !== "cash";
        setOrders((prev)=>{
            const filtered = prev.filter((o)=>getDateTimestamp(o.startDate) !== orderTimestamp);
            const user = localStorage.getItem("currentUser");
            if (user) {
                localStorage.setItem(`orders_${user}`, serializeOrders(filtered));
            } else {
                localStorage.setItem("guest_orders", serializeOrders(filtered));
            }
            return filtered;
        });
        setSelectedDate(null);
        if (wasPaid) {
            showWarning("Заказ отменен", "Деньги вернутся на карту в течение 3 рабочих дней.", "info");
        } else {
            showWarning("Заказ отменен", "Заказ был успешно удален.", "info");
        }
    };
    const handleMoveOrder = (fromDate, toDateValue)=>{
        const user = localStorage.getItem("currentUser");
        const fromTimestamp = getDateTimestamp(fromDate);
        const toTimestamp = getDateTimestamp(toDateValue);
        setOrders((prev)=>{
            const existingOrderOnTarget = prev.find((o)=>getDateTimestamp(o.startDate) === toTimestamp);
            if (existingOrderOnTarget) {
                alert("На эту дату уже есть заказ. Сначала отмените его.");
                return prev;
            }
            const newOrders = prev.map((o)=>{
                if (getDateTimestamp(o.startDate) === fromTimestamp) {
                    return {
                        ...o,
                        startDate: toDateValue
                    };
                }
                return o;
            });
            if (user) {
                localStorage.setItem(`orders_${user}`, serializeOrders(newOrders));
            }
            return newOrders;
        });
    };
    const handleRepeatOrder = (order, targetDate)=>{
        const filteredOrder = filterAvailableItems(order);
        const newOrder = {
            ...filteredOrder,
            startDate: targetDate,
            delivered: false,
            paid: false
        };
        handleSaveOrder(newOrder);
    };
    const handlePayOrder = (order, total)=>{
        if (!isAuthenticated) {
            setPendingCheckout({
                order,
                total
            });
            setShowAuthModal(true);
            return;
        }
        // Для заказов с наличными открываем модальное окно заказа для смены способа оплаты
        if (order.paymentMethod === "cash" && !order.paid) {
            const orderDate = toDate(order.startDate);
            setSelectedDate(orderDate);
            return;
        }
        // Для других заказов открываем модальное окно оплаты
        setPaymentOrder({
            order,
            total
        });
    };
    const handleMarkCashOrderAsPaid = async (order)=>{
        if (!order.id || !isAuthenticated || !userProfile?.id) {
            toast({
                title: "Ошибка",
                description: "Не удалось отметить заказ как оплаченный",
                variant: "destructive",
                duration: 5000
            });
            return;
        }
        try {
            const response = await fetch(`/api/orders/${order.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    paid: true,
                    paid_at: new Date().toISOString(),
                    status: "paid"
                })
            });
            if (!response.ok) {
                throw new Error("Failed to mark order as paid");
            }
            // Обновляем заказ в состоянии
            const user = localStorage.getItem("currentUser");
            const orderTimestamp = getDateTimestamp(order.startDate);
            setOrders((prev)=>{
                const newOrders = prev.map((o)=>{
                    if (getDateTimestamp(o.startDate) === orderTimestamp) {
                        return {
                            ...o,
                            paid: true,
                            paidAt: new Date().toISOString()
                        };
                    }
                    return o;
                });
                if (user) {
                    localStorage.setItem(`orders_${user}`, serializeOrders(newOrders));
                }
                return newOrders;
            });
            toast({
                title: "Заказ оплачен",
                description: "Заказ успешно отмечен как оплаченный",
                duration: 3000
            });
        } catch (error) {
            console.error("Failed to mark order as paid:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось отметить заказ как оплаченный. Попробуйте еще раз.",
                variant: "destructive",
                duration: 5000
            });
        }
    };
    const handlePaymentComplete = (order, pointsUsed)=>{
        const user = localStorage.getItem("currentUser");
        const orderTimestamp = getDateTimestamp(order.startDate);
        const total = calculateOrderTotal(order);
        setOrders((prev)=>{
            const newOrders = prev.map((o)=>{
                if (getDateTimestamp(o.startDate) === orderTimestamp) {
                    return {
                        ...o,
                        paid: true,
                        paidAt: new Date().toISOString()
                    };
                }
                return o;
            });
            if (user) {
                localStorage.setItem(`orders_${user}`, serializeOrders(newOrders));
            }
            return newOrders;
        });
        if (userProfile) {
            const loyaltyLevel = userProfile.totalSpent >= 50000 ? "gold" : userProfile.totalSpent >= 20000 ? "silver" : "bronze";
            const cashbackPercent = loyaltyLevel === "gold" ? 7 : loyaltyLevel === "silver" ? 5 : 3;
            const earnedPoints = Math.floor((total - pointsUsed) * (cashbackPercent / 100));
            const updatedProfile = {
                ...userProfile,
                loyaltyPoints: userProfile.loyaltyPoints - pointsUsed + earnedPoints,
                totalSpent: userProfile.totalSpent + total - pointsUsed
            };
            setUserProfile(updatedProfile);
            localStorage.setItem(`profile_${user}`, JSON.stringify(updatedProfile));
        }
        setPaymentOrder(null);
    };
    const handleReviewSubmit = (orderId, rating, text)=>{
        const user = localStorage.getItem("currentUser");
        const newReview = {
            orderId,
            rating,
            text,
            createdAt: new Date().toISOString()
        };
        setReviews((prev)=>{
            const newReviews = [
                ...prev,
                newReview
            ];
            if (user) {
                localStorage.setItem(`reviews_${user}`, JSON.stringify(newReviews));
            }
            return newReviews;
        });
    };
    const handleLogin = async (phone)=>{
        setIsAuthenticated(true);
        setCurrentUser(phone);
        localStorage.setItem("currentUser", phone);
        const guestOrdersStr = localStorage.getItem("guest_orders");
        const savedOrders = localStorage.getItem(`orders_${phone}`);
        let userOrders = [];
        if (savedOrders) {
            userOrders = deserializeOrders(savedOrders);
        }
        let mergedCount = 0;
        let conflictCount = 0;
        if (guestOrdersStr) {
            const guestOrdersList = deserializeOrders(guestOrdersStr);
            guestOrdersList.forEach((guestOrder)=>{
                const guestTimestamp = getDateTimestamp(guestOrder.startDate);
                const existingOrder = userOrders.find((o)=>getDateTimestamp(o.startDate) === guestTimestamp);
                if (existingOrder) {
                    conflictCount++;
                    if (!existingOrder.paid) {
                        const index = userOrders.findIndex((o)=>getDateTimestamp(o.startDate) === guestTimestamp);
                        userOrders[index] = guestOrder;
                        mergedCount++;
                    }
                } else {
                    userOrders.push(guestOrder);
                    mergedCount++;
                }
            });
            localStorage.removeItem("guest_orders");
        }
        setOrders(userOrders);
        localStorage.setItem(`orders_${phone}`, serializeOrders(userOrders));
        if (mergedCount > 0 || conflictCount > 0) {
            let description = "";
            if (mergedCount > 0 && conflictCount === 0) {
                description = `${mergedCount} ${mergedCount === 1 ? "заказ добавлен" : "заказа добавлено"} в ваш аккаунт`;
            } else if (conflictCount > 0) {
                description = `Некоторые даты уже заняты оплаченными заказами. Добавлено: ${mergedCount}`;
            }
            toast({
                title: "Добро пожаловать!",
                description,
                duration: 5000
            });
        } else {
            toast({
                title: "Добро пожаловать!",
                description: "Вы успешно вошли в аккаунт",
                duration: 3000
            });
        }
        const savedReviews = localStorage.getItem(`reviews_${phone}`);
        if (savedReviews) {
            setReviews(JSON.parse(savedReviews));
        }
        const savedProfile = localStorage.getItem(`profile_${phone}`);
        let profile;
        if (savedProfile) {
            try {
                const parsed = JSON.parse(savedProfile);
                if (parsed.address && !parsed.street) {
                    parsed.street = parsed.address;
                    delete parsed.address;
                }
                profile = parsed;
            } catch  {
                profile = {
                    phone,
                    name: "",
                    street: "",
                    building: "",
                    loyaltyPoints: 0,
                    totalSpent: 0
                };
                localStorage.setItem(`profile_${phone}`, JSON.stringify(profile));
            }
        } else {
            profile = {
                phone,
                name: "",
                street: "",
                building: "",
                loyaltyPoints: 0,
                totalSpent: 0
            };
            localStorage.setItem(`profile_${phone}`, JSON.stringify(profile));
        }
        // Создаем или обновляем пользователя в NocoDB
        console.log("🔄 Синхронизация пользователя с базой данных...", {
            phone,
            hasProfile: !!profile
        });
        try {
            const { fetchUserByPhone, createUser, updateUser } = await __turbopack_context__.A("[project]/lib/nocodb.ts [app-ssr] (ecmascript, async loader)");
            console.log("📡 Ищем пользователя в базе по телефону:", phone);
            const dbUser = await fetchUserByPhone(phone);
            if (dbUser) {
                console.log("✅ Пользователь найден в базе:", dbUser.Id);
                // Пользователь существует, обновляем профиль из базы
                profile.id = dbUser.Id;
                profile.name = dbUser.name || profile.name;
                profile.street = dbUser.street || profile.street;
                profile.building = dbUser.building || profile.building;
                profile.loyaltyPoints = typeof dbUser.loyalty_points === 'number' ? dbUser.loyalty_points : parseInt(String(dbUser.loyalty_points)) || 0;
                profile.totalSpent = typeof dbUser.total_spent === 'number' ? dbUser.total_spent : parseFloat(String(dbUser.total_spent)) || 0;
                console.log("✅ Профиль обновлен из базы, userProfile.id:", profile.id);
            } else {
                console.log("⚠️ Пользователя нет в базе, создаем нового...");
                // Пользователя нет в базе, создаем
                const newDbUser = await createUser({
                    phone,
                    name: profile.name || "",
                    loyalty_points: profile.loyaltyPoints || 0,
                    total_spent: profile.totalSpent || 0
                });
                profile.id = newDbUser.Id;
                console.log("✅ Пользователь создан в базе данных:", newDbUser.Id, "userProfile.id установлен:", profile.id);
            }
            // Сохраняем обновленный профиль в localStorage
            localStorage.setItem(`profile_${phone}`, JSON.stringify(profile));
            console.log("💾 Профиль сохранен в localStorage с id:", profile.id);
        } catch (error) {
            console.error("❌ Ошибка при синхронизации пользователя с базой:", error);
            console.error("Stack:", error instanceof Error ? error.stack : "No stack");
        // Продолжаем работу даже если не удалось синхронизировать с базой
        }
        console.log("👤 Устанавливаем userProfile:", {
            id: profile.id,
            phone: profile.phone,
            hasId: !!profile.id
        });
        setUserProfile(profile);
        setShowAuthModal(false);
        if (pendingCheckout) {
            setPaymentOrder(pendingCheckout);
            setPendingCheckout(null);
        }
    };
    const handleLogout = ()=>{
        setIsAuthenticated(false);
        setCurrentUser(null);
        setOrders([]);
        setUserProfile(null);
        setReviews([]);
        localStorage.removeItem("currentUser");
        setView("calendar");
        const guestOrders = localStorage.getItem("guest_orders");
        if (guestOrders) {
            setOrders(deserializeOrders(guestOrders));
        }
    };
    const handleProfileSave = (profile)=>{
        setUserProfile(profile);
    };
    const existingOrder = selectedDate ? orders.find((o)=>{
        const orderStartDate = new Date(o.startDate);
        orderStartDate.setHours(0, 0, 0, 0);
        const checkDate = new Date(selectedDate);
        checkDate.setHours(0, 0, 0, 0);
        return orderStartDate.getTime() === checkDate.getTime();
    }) : undefined;
    const availableDates = getAvailableDates();
    // Handler for dish click from FreshSection
    const handleDishClick = (dish)=>{
        // Get available dates and pick a random one (or first available)
        const dates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$menu$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAvailableDatesForOrdering"])();
        if (dates.length > 0) {
            // Pick a random date from available dates
            const randomIndex = Math.floor(Math.random() * dates.length);
            const selectedDate = dates[randomIndex].date;
            setSelectedDish({
                dish,
                availableDate: selectedDate
            });
        } else {
            showWarning("Нет доступных дат", "К сожалению, сейчас нет доступных дат для заказа. Попробуйте позже.", "info");
        }
    };
    // Handler for "Go to Order" button in DishSmartModal
    const handleGoToOrder = (date)=>{
        // Scroll to calendar section
        const calendarElement = document.getElementById("calendar-section");
        if (calendarElement) {
            calendarElement.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
        // Set selected date and open order modal
        setTimeout(()=>{
            setSelectedDate(date);
        }, 300); // Small delay for smooth scroll
    };
    // Handler for "Open Existing Order" button
    const handleOpenExistingOrder = (date)=>{
        setSelectedDate(date);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-background",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$preloader$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Preloader"], {}, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 1367,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white px-4 pt-12 pb-6 border-b-2 border-black safe-area-top",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-14 w-14 rounded-full border-2 border-black overflow-hidden flex items-center justify-center shrink-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            src: "/OGFooDY логотип.png",
                                            alt: "OGFooDY Logo",
                                            width: 56,
                                            height: 56,
                                            className: "rounded-full object-cover",
                                            priority: true
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 1372,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 1371,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                className: "text-2xl font-black text-black tracking-tight",
                                                children: "OGFooDY"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 1382,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-black/80 text-xs font-bold",
                                                children: "домашняя еда на каждый день"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 1383,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 1381,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 1370,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$app$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppMenu"], {
                                        userPhone: currentUser || ""
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 1387,
                                        columnNumber: 13
                                    }, this),
                                    isAuthenticated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "icon",
                                        onClick: handleLogout,
                                        className: "text-black hover:bg-muted border-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                            className: "w-5 h-5"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 1390,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 1389,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "sm",
                                        onClick: ()=>setShowAuthModal(true),
                                        className: "text-black hover:bg-muted border-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$in$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogIn$3e$__["LogIn"], {
                                                className: "w-4 h-4 mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 1399,
                                                columnNumber: 17
                                            }, this),
                                            "Войти"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 1393,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 1386,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 1369,
                        columnNumber: 9
                    }, this),
                    isAuthenticated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setShowProfile(true),
                        className: "flex items-center gap-2 text-black bg-muted rounded-xl px-3 py-2 w-full hover:bg-muted/80 transition-colors border-2 border-black",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 1410,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-bold flex-1 text-left",
                                children: userProfile?.name || currentUser
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 1411,
                                columnNumber: 13
                            }, this),
                            userProfile && userProfile.loyaltyPoints > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs bg-[#9D00FF] text-white px-2 py-0.5 rounded-lg font-black border-2 border-black",
                                children: [
                                    userProfile.loyaltyPoints,
                                    " баллов"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 1413,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 1406,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 text-black bg-muted rounded-xl px-3 py-2 w-full border-2 border-black",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 1418,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-bold",
                                children: "Гость"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 1419,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-black/70 ml-auto font-medium",
                                children: "Войдите для оформления заказа"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 1420,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 1417,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 1368,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 py-4 -mt-4 bg-background rounded-t-3xl border-t-2 border-black relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground text-sm mb-4",
                        children: view === "calendar" ? "Выберите дату для заказа" : "История ваших заказов"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 1426,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                variant: view === "calendar" ? "default" : "outline",
                                onClick: ()=>setView("calendar"),
                                className: "flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarIcon$3e$__["CalendarIcon"], {
                                        className: "w-4 h-4 mr-2"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 1436,
                                        columnNumber: 13
                                    }, this),
                                    "Календарь"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 1431,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                variant: view === "history" ? "default" : "outline",
                                onClick: ()=>setView("history"),
                                className: "flex-1",
                                disabled: !isAuthenticated,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__["History"], {
                                        className: "w-4 h-4 mr-2"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 1445,
                                        columnNumber: 13
                                    }, this),
                                    "История"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 1439,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 1430,
                        columnNumber: 9
                    }, this),
                    view === "calendar" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$daily$2d$status$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DailyStatus"], {
                                    orders: orders,
                                    onOrderClick: ()=>{
                                        // Find the next available date for ordering
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        const nextAvailable = availableDates.find((date)=>{
                                            const checkDate = new Date(date);
                                            checkDate.setHours(0, 0, 0, 0);
                                            return checkDate.getTime() >= today.getTime();
                                        });
                                        if (nextAvailable) {
                                            handleDateClick(nextAvailable);
                                        } else {
                                            showWarning("Нет доступных дат", "К сожалению, сейчас нет доступных дат для заказа. Попробуйте позже.", "info");
                                        }
                                    },
                                    onFoodCardClick: ()=>{
                                        // Open today's menu/order modal
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        // Check if there's an order for today (delivery day)
                                        const todayOrder = orders.find((order)=>{
                                            const orderDate = new Date(order.startDate);
                                            orderDate.setHours(0, 0, 0, 0);
                                            return orderDate.getTime() === today.getTime();
                                        });
                                        // If there's an order for today, open it directly
                                        if (todayOrder) {
                                            setSelectedDate(today);
                                        } else {
                                            // If there's food today but no order, we still want to show the modal
                                            // Find the order that provides food for today
                                            const foodOrder = orders.find((order)=>{
                                                const deliveryDate = new Date(order.startDate);
                                                deliveryDate.setHours(0, 0, 0, 0);
                                                const day1 = new Date(deliveryDate);
                                                day1.setDate(day1.getDate() + 1);
                                                const day2 = new Date(deliveryDate);
                                                day2.setDate(day2.getDate() + 2);
                                                return today.getTime() === day1.getTime() || today.getTime() === day2.getTime();
                                            });
                                            // Open today's date - the modal should handle showing the food
                                            setSelectedDate(today);
                                        }
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 1454,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 1453,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                id: "calendar-section",
                                className: "mb-8",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$calendar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Calendar"], {
                                    orders: orders,
                                    selectedDate: selectedDate,
                                    onSelectDate: setSelectedDate,
                                    onDateClick: handleDateClick,
                                    onMoveOrder: handleMoveOrder
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 1515,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 1514,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$fresh$2d$section$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FreshSection"], {
                                onDishClick: handleDishClick
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 1525,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$order$2d$history$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OrderHistory"], {
                        orders: orders,
                        onCancelOrder: handleCancelOrder,
                        onRepeatOrder: handleRepeatOrder,
                        onPayOrder: handlePayOrder,
                        onReviewOrder: (order)=>setReviewOrder(order),
                        availableDates: availableDates,
                        userProfile: userProfile,
                        reviews: reviews
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 1528,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 1425,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$order$2d$modal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OrderModal"], {
                date: selectedDate || new Date(),
                existingOrder: existingOrder,
                onClose: ()=>{
                    setSelectedDate(null);
                },
                onSave: handleSaveOrder,
                onCancel: handleCancelOrder,
                allOrders: orders,
                open: !!selectedDate,
                onPaymentSuccess: (order)=>{
                    if (userProfile) {
                        const newPoints = Math.floor(calculateOrderTotalForHistory(order) * 0.05);
                        const updatedProfile = {
                            ...userProfile,
                            loyaltyPoints: userProfile.loyaltyPoints + newPoints
                        };
                        setUserProfile(updatedProfile);
                        localStorage.setItem("user_profile", JSON.stringify(updatedProfile));
                    }
                    const deliveryDate = new Date(order.startDate).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "short"
                    });
                    const description = order.paymentMethod === "cash" ? `Доставка ${deliveryDate} в ${order.deliveryTime}. Оплата наличными курьеру.` : `Оплата прошла успешно. Доставка ${deliveryDate} в ${order.deliveryTime}.`;
                    showWarning("Заказ оформлен", description, "info");
                },
                userLoyaltyPoints: userProfile?.loyaltyPoints || 0,
                isAuthenticated: isAuthenticated,
                onRequestAuth: ()=>{
                    setPendingCheckout(true);
                    setShowAuthModal(true);
                },
                userAddress: userProfile?.address,
                userCity: userProfile?.city
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 1541,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$auth$2d$modal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuthModal"], {
                open: showAuthModal,
                onClose: ()=>{
                    setShowAuthModal(false);
                    setPendingCheckout(null);
                },
                onLogin: handleLogin,
                redirectAfterLogin: pendingCheckout ? "checkout" : null
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 1582,
                columnNumber: 7
            }, this),
            showProfile && currentUser && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$profile$2d$modal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProfileModal"], {
                phone: currentUser,
                onClose: ()=>setShowProfile(false),
                onSave: handleProfileSave
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 1593,
                columnNumber: 9
            }, this),
            paymentOrder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$payment$2d$modal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PaymentModal"], {
                order: paymentOrder.order,
                total: paymentOrder.total,
                userProfile: userProfile,
                onClose: ()=>setPaymentOrder(null),
                onPaymentComplete: handlePaymentComplete
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 1597,
                columnNumber: 9
            }, this),
            reviewOrder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$review$2d$modal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReviewModal"], {
                order: reviewOrder,
                onClose: ()=>setReviewOrder(null),
                onSubmit: handleReviewSubmit
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 1607,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$warning$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WarningDialog"], {
                open: warningDialog.open,
                onClose: closeWarning,
                title: warningDialog.title,
                description: warningDialog.description,
                variant: warningDialog.variant
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 1610,
                columnNumber: 7
            }, this),
            selectedDish && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dish$2d$smart$2d$modal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DishSmartModal"], {
                open: !!selectedDish,
                onClose: ()=>setSelectedDish(null),
                dish: selectedDish.dish,
                availableDate: selectedDish.availableDate,
                orders: orders,
                onGoToOrder: handleGoToOrder,
                onOpenExistingOrder: handleOpenExistingOrder
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 1620,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 1366,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_40de450a._.js.map