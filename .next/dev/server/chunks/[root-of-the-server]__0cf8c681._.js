module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/nocodb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createOrder",
    ()=>createOrder,
    "createOrderExtra",
    ()=>createOrderExtra,
    "createOrderMeal",
    ()=>createOrderMeal,
    "createOrderPerson",
    ()=>createOrderPerson,
    "createReview",
    ()=>createReview,
    "createUser",
    ()=>createUser,
    "deleteOrderExtra",
    ()=>deleteOrderExtra,
    "deleteOrderMeal",
    ()=>deleteOrderMeal,
    "deleteOrderPerson",
    ()=>deleteOrderPerson,
    "fetchDeliveryZones",
    ()=>fetchDeliveryZones,
    "fetchExtras",
    ()=>fetchExtras,
    "fetchMeals",
    ()=>fetchMeals,
    "fetchOrderById",
    ()=>fetchOrderById,
    "fetchOrderExtras",
    ()=>fetchOrderExtras,
    "fetchOrderMeals",
    ()=>fetchOrderMeals,
    "fetchOrderPersons",
    ()=>fetchOrderPersons,
    "fetchOrders",
    ()=>fetchOrders,
    "fetchOrdersByUser",
    ()=>fetchOrdersByUser,
    "fetchPromoCode",
    ()=>fetchPromoCode,
    "fetchReviewsForUser",
    ()=>fetchReviewsForUser,
    "fetchUserById",
    ()=>fetchUserById,
    "fetchUserByPhone",
    ()=>fetchUserByPhone,
    "generateOrderNumber",
    ()=>generateOrderNumber,
    "incrementPromoCodeUsage",
    ()=>incrementPromoCodeUsage,
    "isNocoDBConfigured",
    ()=>isNocoDBConfigured,
    "updateOrder",
    ()=>updateOrder,
    "updateUser",
    ()=>updateUser
]);
// NocoDB API client - все запросы идут через внутренний API proxy
// Токен никогда не попадает в браузер
// Определяем базовый URL для API proxy
// На сервере используем абсолютный URL, на клиенте - относительный
const getApiBaseUrl = ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return null;
};
function getNocoDBUrl() {
    return process.env.NOCODB_URL || "";
}
function getNocoDBToken() {
    return process.env.NOCODB_TOKEN || "";
}
function getTableId(tableName) {
    const tableIds = {
        Meals: process.env.NOCODB_TABLE_MEALS,
        Extras: process.env.NOCODB_TABLE_EXTRAS,
        Delivery_Zones: process.env.NOCODB_TABLE_DELIVERY_ZONES,
        Users: process.env.NOCODB_TABLE_USERS,
        Orders: process.env.NOCODB_TABLE_ORDERS,
        Order_Persons: process.env.NOCODB_TABLE_ORDER_PERSONS,
        Order_Meals: process.env.NOCODB_TABLE_ORDER_MEALS,
        Order_Extras: process.env.NOCODB_TABLE_ORDER_EXTRAS,
        Promo_Codes: process.env.NOCODB_TABLE_PROMO_CODES,
        Reviews: process.env.NOCODB_TABLE_REVIEWS
    };
    return tableIds[tableName] || "";
}
// Проверяем конфигурацию динамически
function validateNocoDBConfig() {
    const url = getNocoDBUrl();
    const token = getNocoDBToken();
    const mealsTable = process.env.NOCODB_TABLE_MEALS;
    if (!url || !token) {
        return {
            isValid: false,
            error: "NOCODB_URL or NOCODB_TOKEN not set"
        };
    }
    if (!mealsTable) {
        return {
            isValid: false,
            error: "NOCODB_TABLE_MEALS not set"
        };
    }
    return {
        isValid: true
    };
}
function isNocoDBConfigured() {
    return validateNocoDBConfig().isValid;
}
function buildNocoDBUrl(tableName, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    let baseUrl = getNocoDBUrl().replace(/\/$/, "");
    if (!baseUrl.endsWith("/api/v2")) {
        baseUrl = `${baseUrl}/api/v2`;
    }
    const tableId = getTableId(tableName);
    if (!tableId) {
        throw new Error(`TABLE_NOT_CONFIGURED:${tableName}`);
    }
    return `${baseUrl}/tables/${tableId}/records${queryString ? `?${queryString}` : ""}`;
}
// Серверный fetch напрямую к NocoDB (для ISR)
async function serverFetch(tableName, params = {}) {
    const config = validateNocoDBConfig();
    if (!config.isValid) {
        throw new Error(`NocoDB is not configured: ${config.error}`);
    }
    const url = buildNocoDBUrl(tableName, params);
    const token = getNocoDBToken();
    const response = await fetch(url, {
        headers: {
            "xc-token": token,
            "Content-Type": "application/json"
        },
        next: {
            revalidate: 3600
        }
    });
    const text = await response.text();
    if (!response.ok) {
        if (text.includes("TABLE_NOT_FOUND") || response.status === 404) {
            throw new Error(`TABLE_NOT_FOUND:${tableName}`);
        }
        throw new Error(`NocoDB API error: ${response.status} - ${text}`);
    }
    try {
        return JSON.parse(text);
    } catch  {
        throw new Error(`NocoDB returned invalid JSON: ${text.substring(0, 100)}...`);
    }
}
// Клиентский fetch через API proxy
async function clientFetch(tableName, params = {}, options = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = `/api/db/${tableName}/records${queryString ? `?${queryString}` : ""}`;
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    });
    const text = await response.text();
    if (!response.ok) {
        if (text.includes("TABLE_NOT_FOUND") || response.status === 404) {
            throw new Error(`TABLE_NOT_FOUND:${tableName}`);
        }
        throw new Error(`API error: ${response.status} - ${text}`);
    }
    try {
        return JSON.parse(text);
    } catch  {
        throw new Error(`API returned invalid JSON: ${text.substring(0, 100)}...`);
    }
}
// Универсальный fetch
async function nocoFetch(tableName, params = {}, options = {}) {
    const apiBaseUrl = getApiBaseUrl();
    if (apiBaseUrl === null) {
        return serverFetch(tableName, params);
    } else {
        return clientFetch(tableName, params, options);
    }
}
async function fetchMeals(weekFilter) {
    try {
        const params = {
            limit: "1000"
        };
        const response = await nocoFetch("Meals", params);
        console.log(`[v0] fetchMeals: got ${response.list?.length || 0} meals, first item:`, JSON.stringify(response.list?.[0] || {}).substring(0, 200));
        return response.list || [];
    } catch (error) {
        if (error instanceof Error && error.message.startsWith("TABLE_NOT_FOUND")) {
            console.warn("Table Meals not found in NocoDB, returning empty array");
            return [];
        }
        throw error;
    }
}
async function fetchExtras() {
    try {
        const response = await nocoFetch("Extras", {
            limit: "1000"
        });
        console.log(`[v0] fetchExtras: got ${response.list?.length || 0} extras, first item:`, JSON.stringify(response.list?.[0] || {}).substring(0, 200));
        return response.list || [];
    } catch (error) {
        if (error instanceof Error && error.message.startsWith("TABLE_NOT_FOUND")) {
            console.warn("Table Extras not found in NocoDB, returning empty array");
            return [];
        }
        throw error;
    }
}
async function fetchDeliveryZones() {
    try {
        const response = await nocoFetch("Delivery_Zones", {
        });
        console.log(`[v0] fetchDeliveryZones: got ${response.list?.length || 0} zones, first item:`, response.list?.[0]);
        return response.list || [];
    } catch (error) {
        if (error instanceof Error && error.message.startsWith("TABLE_NOT_FOUND")) {
            console.warn("Table Delivery_Zones not found in NocoDB, returning empty array");
            return [];
        }
        throw error;
    }
}
async function fetchUserByPhone(phone) {
    const response = await nocoFetch("Users", {
        where: `(phone,eq,${phone})`
    });
    return response.list?.[0] || null;
}
async function fetchUserById(id) {
    const response = await nocoFetch("Users", {
        where: `(Id,eq,${id})`
    });
    return response.list?.[0] || null;
}
async function createUser(user) {
    return clientFetch("Users", {}, {
        method: "POST",
        body: JSON.stringify(user)
    });
}
async function updateUser(id, data) {
    return clientFetch(`Users/${id}`, {}, {
        method: "PATCH",
        body: JSON.stringify(data)
    });
}
async function fetchOrders(userId) {
    const params = {
        limit: "1000",
        sort: "-start_date"
    };
    if (userId) {
        params.where = `(user_id,eq,${userId})`;
    }
    const response = await nocoFetch("Orders", params);
    return response.list || [];
}
async function fetchOrdersByUser(userId) {
    return fetchOrders(userId);
}
function generateOrderNumber() {
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${date}-${random}`;
}
async function fetchOrderById(id) {
    const response = await nocoFetch("Orders", {
        where: `(Id,eq,${id})`
    });
    return response.list?.[0] || null;
}
async function createOrder(order) {
    return clientFetch("Orders", {}, {
        method: "POST",
        body: JSON.stringify(order)
    });
}
async function updateOrder(id, data) {
    return clientFetch(`Orders/${id}`, {}, {
        method: "PATCH",
        body: JSON.stringify(data)
    });
}
async function createOrderPerson(orderPerson) {
    return clientFetch("Order_Persons", {}, {
        method: "POST",
        body: JSON.stringify(orderPerson)
    });
}
async function createOrderMeal(orderMeal) {
    return clientFetch("Order_Meals", {}, {
        method: "POST",
        body: JSON.stringify(orderMeal)
    });
}
async function createOrderExtra(orderExtra) {
    return clientFetch("Order_Extras", {}, {
        method: "POST",
        body: JSON.stringify(orderExtra)
    });
}
async function fetchOrderPersons(orderId) {
    const response = await nocoFetch("Order_Persons", {
        where: `(order_id,eq,${orderId})`
    });
    return response.list || [];
}
async function fetchOrderMeals(orderPersonId) {
    const response = await nocoFetch("Order_Meals", {
        where: `(order_person_id,eq,${orderPersonId})`
    });
    return response.list || [];
}
async function fetchOrderExtras(orderId) {
    const response = await nocoFetch("Order_Extras", {
        where: `(order_id,eq,${orderId})`
    });
    return response.list || [];
}
async function deleteOrderPerson(id) {
    const apiBaseUrl = getApiBaseUrl();
    if (apiBaseUrl === null) {
        // На сервере используем прямой запрос к NocoDB
        const tableId = getTableId("Order_Persons");
        const nocodbUrl = getNocoDBUrl();
        const token = getNocoDBToken();
        const url = `${nocodbUrl}/api/v2/tables/${tableId}/records/${id}`;
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "xc-token": token,
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to delete order person: ${response.status}`);
        }
    } else {
        // На клиенте используем API proxy
        const response = await fetch(`/api/db/Order_Persons/records/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to delete order person: ${response.status}`);
        }
    }
}
async function deleteOrderMeal(id) {
    const apiBaseUrl = getApiBaseUrl();
    if (apiBaseUrl === null) {
        const tableId = getTableId("Order_Meals");
        const nocodbUrl = getNocoDBUrl();
        const token = getNocoDBToken();
        const url = `${nocodbUrl}/api/v2/tables/${tableId}/records/${id}`;
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "xc-token": token,
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to delete order meal: ${response.status}`);
        }
    } else {
        const response = await fetch(`/api/db/Order_Meals/records/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to delete order meal: ${response.status}`);
        }
    }
}
async function deleteOrderExtra(id) {
    const apiBaseUrl = getApiBaseUrl();
    if (apiBaseUrl === null) {
        const tableId = getTableId("Order_Extras");
        const nocodbUrl = getNocoDBUrl();
        const token = getNocoDBToken();
        const url = `${nocodbUrl}/api/v2/tables/${tableId}/records/${id}`;
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "xc-token": token,
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to delete order extra: ${response.status}`);
        }
    } else {
        const response = await fetch(`/api/db/Order_Extras/records/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to delete order extra: ${response.status}`);
        }
    }
}
async function fetchPromoCode(code) {
    const response = await nocoFetch("Promo_Codes", {
        where: `(code,eq,${code})~and(active,eq,true)`
    });
    return response.list?.[0] || null;
}
async function incrementPromoCodeUsage(id) {
    await clientFetch("Promo_Codes", {}, {
        method: "PATCH",
        body: JSON.stringify({
            Id: id,
            times_used: {
                increment: 1
            }
        })
    });
}
async function fetchReviewsForUser(userId) {
    const response = await nocoFetch("Reviews", {
        where: `(user_id,eq,${userId})`
    });
    return response.list || [];
}
async function createReview(review) {
    return clientFetch("Reviews", {}, {
        method: "POST",
        body: JSON.stringify(review)
    });
}
}),
"[project]/lib/meals-data.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/app/api/menu/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "revalidate",
    ()=>revalidate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/nocodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$meals$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/meals-data.ts [app-route] (ecmascript)");
;
;
;
const revalidate = 3600;
function parsePrice(value) {
    if (value === undefined || value === null) return 0;
    if (value === "#N/A" || value === "") return 0;
    if (typeof value === "number") return Math.round(value);
    // Replace comma with dot and parse, then round to integer
    const parsed = Number.parseFloat(String(value).replace(",", "."));
    return isNaN(parsed) ? 0 : Math.round(parsed);
}
function parseBoolean(value) {
    if (value === undefined || value === null) return false;
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value === 1;
    const str = String(value).toUpperCase();
    return str === "TRUE" || str === "1" || str === "YES";
}
function parseNumber(value) {
    if (value === undefined || value === null) return 0;
    if (value === "#N/A" || value === "") return 0;
    if (typeof value === "number") return Math.round(value * 10) / 10;
    const parsed = Number.parseFloat(String(value).replace(",", "."));
    return isNaN(parsed) ? 0 : Math.round(parsed * 10) / 10;
}
function parseIntervals(value) {
    if (!value) return [];
    return value.split(",").map((s)=>s.trim()).filter(Boolean);
}
async function GET(request) {
    const { searchParams } = new URL(request.url);
    const weekType = searchParams.get("week");
    console.log(`[v0] /api/menu GET request, weekType: ${weekType}`);
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isNocoDBConfigured"])()) {
        console.log("[v0] NocoDB not configured");
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            meals: {
                breakfast: [],
                lunch_salad: [],
                lunch_soup: [],
                lunch_main: [],
                dinner_salad: [],
                dinner_soup: [],
                dinner_main: [],
                garnish: []
            },
            extras: {
                drink: [],
                sauce: [],
                dessert: [],
                snack: []
            },
            deliveryZones: [],
            deliveryTimes: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$meals$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DELIVERY_TIMES"],
            source: "empty",
            reason: "NocoDB not configured"
        });
    }
    try {
        const [nocoMeals, nocoExtras, nocoZones] = await Promise.all([
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchMeals"])(weekType || undefined),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchExtras"])(),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchDeliveryZones"])()
        ]);
        console.log(`[v0] Got data: meals=${nocoMeals.length}, extras=${nocoExtras.length}, zones=${nocoZones.length}`);
        const groupedMeals = {
            breakfast: [],
            lunch_salad: [],
            lunch_soup: [],
            lunch_main: [],
            dinner_salad: [],
            dinner_soup: [],
            dinner_main: [],
            garnish: []
        };
        let skippedNotAvailable = 0;
        let skippedWrongWeek = 0;
        for (const m of nocoMeals){
            const isCurrentWeek = parseBoolean(m.is_current_week);
            const isNextWeek = parseBoolean(m.is_next_week);
            const isAvailable = parseBoolean(m.available);
            if (!isAvailable) {
                skippedNotAvailable++;
                continue;
            }
            // Фильтрация по неделе:
            // - Для "current": блюдо должно быть доступно в текущей неделе (isCurrentWeek = true)
            //   или в обеих неделях (isCurrentWeek = true && isNextWeek = true)
            // - Для "next": блюдо должно быть доступно в следующей неделе (isNextWeek = true)
            //   или в обеих неделях (isCurrentWeek = true && isNextWeek = true)
            if (weekType === "current" && !isCurrentWeek) {
                skippedWrongWeek++;
                continue;
            }
            if (weekType === "next" && !isNextWeek) {
                skippedWrongWeek++;
                continue;
            }
            const category = String(m.category || "").toLowerCase();
            // ... existing code for parsing prices ...
            const priceSingle = parsePrice(m.price_single) || parsePrice(m.price);
            const priceMedium = parsePrice(m.price_medium);
            const priceLarge = parsePrice(m.price_large);
            const weightSingle = parsePrice(m.weight_single) || parsePrice(m.weight);
            const weightMedium = parsePrice(m.weight_medium);
            const weightLarge = parsePrice(m.weight_large);
            const meal = {
                id: m.Id || m.id,
                name: m.name || "",
                ingredients: m.ingredients || "",
                description: m.description || "",
                prices: {
                    single: priceSingle,
                    medium: priceMedium,
                    large: priceLarge
                },
                weights: {
                    single: weightSingle,
                    medium: weightMedium,
                    large: weightLarge
                },
                portion: "single",
                needsGarnish: parseBoolean(m.needs_garnish),
                image: m.image || "",
                available: true,
                nutrition: {
                    calories: parseNumber(m.calories),
                    protein: parseNumber(m.protein),
                    fats: parseNumber(m.fats),
                    carbs: parseNumber(m.carbs),
                    weight: weightSingle
                },
                category: category,
                weekType: isCurrentWeek && isNextWeek ? "both" : isCurrentWeek ? "current" : "next"
            };
            if (category === "breakfast") {
                groupedMeals.breakfast.push(meal);
            } else if (category === "garnish") {
                groupedMeals.garnish.push(meal);
            } else if (category === "soup" || category === "salad" || category === "main") {
                const lunchCategory = `lunch_${category}`;
                const dinnerCategory = `dinner_${category}`;
                if (groupedMeals[lunchCategory]) {
                    groupedMeals[lunchCategory].push({
                        ...meal,
                        category: lunchCategory
                    });
                }
                if (groupedMeals[dinnerCategory]) {
                    groupedMeals[dinnerCategory].push({
                        ...meal,
                        id: `${meal.id}_dinner`,
                        category: dinnerCategory
                    });
                }
            }
        }
        console.log(`[v0] Meals filter: skipped ${skippedNotAvailable} not available, ${skippedWrongWeek} wrong week`);
        console.log(`[v0] Grouped meals:`, Object.entries(groupedMeals).map(([k, v])=>`${k}:${v.length}`).join(", "));
        // ... existing code for extras ...
        const groupedExtras = {
            drink: [],
            sauce: [],
            dessert: [],
            snack: []
        };
        for (const e of nocoExtras){
            const isAvailable = parseBoolean(e.available);
            if (!isAvailable) continue;
            const category = String(e.category || "").toLowerCase();
            const extra = {
                id: e.Id || e.id,
                name: e.name || "",
                price: parsePrice(e.price),
                image: e.image || "",
                available: true,
                ingredients: e.ingredients || "",
                description: e.description || "",
                nutrition: {
                    calories: parseNumber(e.calories),
                    protein: parseNumber(e.protein),
                    fats: parseNumber(e.fats),
                    carbs: parseNumber(e.carbs),
                    weight: parsePrice(e.weight)
                },
                category: category
            };
            if (groupedExtras[category]) {
                groupedExtras[category].push(extra);
            }
        }
        console.log(`[v0] Grouped extras:`, Object.entries(groupedExtras).map(([k, v])=>`${k}:${v.length}`).join(", "));
        // ... existing code for deliveryZones ...
        const deliveryZones = nocoZones.filter((zone)=>parseBoolean(zone.is_available)).map((zone)=>({
                id: zone.Id || zone.id,
                city: zone.city || "",
                district: zone.district || "",
                deliveryFee: parsePrice(zone.delivery_fee),
                minOrderAmount: parsePrice(zone.min_order_amount),
                isAvailable: true,
                availableIntervals: parseIntervals(zone.available_intervals)
            }));
        // Извлекаем все уникальные временные интервалы из зон доставки
        const allIntervals = new Set();
        deliveryZones.forEach((zone)=>{
            zone.availableIntervals.forEach((interval)=>{
                if (interval) {
                    allIntervals.add(interval.trim());
                }
            });
        });
        // Сортируем интервалы и используем их, если есть, иначе fallback
        const deliveryTimes = allIntervals.size > 0 ? Array.from(allIntervals).sort() : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$meals$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DELIVERY_TIMES"];
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            meals: groupedMeals,
            extras: groupedExtras,
            deliveryZones,
            deliveryTimes,
            source: "nocodb",
            counts: {
                meals: nocoMeals.length,
                filteredMeals: Object.values(groupedMeals).flat().length,
                extras: nocoExtras.length,
                deliveryZones: deliveryZones.length
            }
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("[v0] Failed to fetch from NocoDB:", errorMessage);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            meals: {
                breakfast: [],
                lunch_salad: [],
                lunch_soup: [],
                lunch_main: [],
                dinner_salad: [],
                dinner_soup: [],
                dinner_main: [],
                garnish: []
            },
            extras: {
                drink: [],
                sauce: [],
                dessert: [],
                snack: []
            },
            deliveryZones: [],
            deliveryTimes: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$meals$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DELIVERY_TIMES"],
            source: "error",
            reason: errorMessage
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0cf8c681._.js.map