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
// Серверная функция для создания/обновления записей напрямую к NocoDB
async function serverCreateRecord(tableName, data, method = "POST", recordId) {
    const config = validateNocoDBConfig();
    if (!config.isValid) {
        throw new Error(`NocoDB is not configured: ${config.error}`);
    }
    let baseUrl = getNocoDBUrl().replace(/\/$/, "");
    if (!baseUrl.endsWith("/api/v2")) {
        baseUrl = `${baseUrl}/api/v2`;
    }
    const tableId = getTableId(tableName);
    if (!tableId) {
        throw new Error(`TABLE_NOT_CONFIGURED:${tableName}`);
    }
    const url = method === "PATCH" && recordId ? `${baseUrl}/tables/${tableId}/records/${recordId}` : `${baseUrl}/tables/${tableId}/records`;
    const token = getNocoDBToken();
    const response = await fetch(url, {
        method,
        headers: {
            "xc-token": token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    const text = await response.text();
    if (!response.ok) {
        if (text.includes("TABLE_NOT_FOUND") || response.status === 404) {
            throw new Error(`TABLE_NOT_FOUND:${tableName}`);
        }
        throw new Error(`NocoDB API error: ${response.status} - ${text}`);
    }
    try {
        const result = JSON.parse(text);
        // NocoDB может вернуть запись в разных форматах
        if (Array.isArray(result)) {
            return result[0];
        }
        if (result && typeof result === 'object' && 'Id' in result) {
            return result;
        }
        if (result && typeof result === 'object' && 'record' in result) {
            return result.record;
        }
        return result;
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
    const apiBaseUrl = getApiBaseUrl();
    if (apiBaseUrl === null) {
        return serverCreateRecord("Users", user, "POST");
    } else {
        const response = await clientFetch("Users", {}, {
            method: "POST",
            body: JSON.stringify(user)
        });
        if (Array.isArray(response)) {
            return response[0];
        }
        if (response && typeof response === 'object' && 'Id' in response) {
            return response;
        }
        if (response && typeof response === 'object' && 'record' in response) {
            return response.record;
        }
        return response;
    }
}
async function updateUser(id, data) {
    const apiBaseUrl = getApiBaseUrl();
    if (apiBaseUrl === null) {
        return serverCreateRecord("Users", data, "PATCH", id);
    } else {
        const response = await clientFetch(`Users/${id}`, {}, {
            method: "PATCH",
            body: JSON.stringify(data)
        });
        if (Array.isArray(response)) {
            return response[0];
        }
        if (response && typeof response === 'object' && 'Id' in response) {
            return response;
        }
        if (response && typeof response === 'object' && 'record' in response) {
            return response.record;
        }
        return response;
    }
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
    // На сервере используем прямой запрос к NocoDB, на клиенте - через proxy
    const apiBaseUrl = getApiBaseUrl();
    if (apiBaseUrl === null) {
        // Серверная среда - прямой запрос к NocoDB
        return serverCreateRecord("Orders", order, "POST");
    } else {
        // Клиентская среда - через API proxy
        const response = await clientFetch("Orders", {}, {
            method: "POST",
            body: JSON.stringify(order)
        });
        if (Array.isArray(response)) {
            return response[0];
        }
        if (response && typeof response === 'object' && 'Id' in response) {
            return response;
        }
        if (response && typeof response === 'object' && 'record' in response) {
            return response.record;
        }
        return response;
    }
}
async function updateOrder(id, data) {
    const apiBaseUrl = getApiBaseUrl();
    if (apiBaseUrl === null) {
        // Серверная среда - прямой запрос к NocoDB
        return serverCreateRecord("Orders", data, "PATCH", id);
    } else {
        // Клиентская среда - через API proxy
        const response = await clientFetch(`Orders/${id}`, {}, {
            method: "PATCH",
            body: JSON.stringify(data)
        });
        if (Array.isArray(response)) {
            return response[0];
        }
        if (response && typeof response === 'object' && 'Id' in response) {
            return response;
        }
        if (response && typeof response === 'object' && 'record' in response) {
            return response.record;
        }
        return response;
    }
}
async function createOrderPerson(orderPerson) {
    const apiBaseUrl = getApiBaseUrl();
    if (apiBaseUrl === null) {
        return serverCreateRecord("Order_Persons", orderPerson, "POST");
    } else {
        const response = await clientFetch("Order_Persons", {}, {
            method: "POST",
            body: JSON.stringify(orderPerson)
        });
        if (Array.isArray(response)) {
            return response[0];
        }
        if (response && typeof response === 'object' && 'Id' in response) {
            return response;
        }
        if (response && typeof response === 'object' && 'record' in response) {
            return response.record;
        }
        return response;
    }
}
async function createOrderMeal(orderMeal) {
    const apiBaseUrl = getApiBaseUrl();
    if (apiBaseUrl === null) {
        return serverCreateRecord("Order_Meals", orderMeal, "POST");
    } else {
        const response = await clientFetch("Order_Meals", {}, {
            method: "POST",
            body: JSON.stringify(orderMeal)
        });
        if (Array.isArray(response)) {
            return response[0];
        }
        if (response && typeof response === 'object' && 'Id' in response) {
            return response;
        }
        if (response && typeof response === 'object' && 'record' in response) {
            return response.record;
        }
        return response;
    }
}
async function createOrderExtra(orderExtra) {
    const apiBaseUrl = getApiBaseUrl();
    if (apiBaseUrl === null) {
        return serverCreateRecord("Order_Extras", orderExtra, "POST");
    } else {
        const response = await clientFetch("Order_Extras", {}, {
            method: "POST",
            body: JSON.stringify(orderExtra)
        });
        if (Array.isArray(response)) {
            return response[0];
        }
        if (response && typeof response === 'object' && 'Id' in response) {
            return response;
        }
        if (response && typeof response === 'object' && 'record' in response) {
            return response.record;
        }
        return response;
    }
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
    const apiBaseUrl = getApiBaseUrl();
    if (apiBaseUrl === null) {
        return serverCreateRecord("Reviews", review, "POST");
    } else {
        const response = await clientFetch("Reviews", {}, {
            method: "POST",
            body: JSON.stringify(review)
        });
        if (Array.isArray(response)) {
            return response[0];
        }
        if (response && typeof response === 'object' && 'Id' in response) {
            return response;
        }
        if (response && typeof response === 'object' && 'record' in response) {
            return response.record;
        }
        return response;
    }
}
}),
"[project]/app/api/diagnose/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
// Диагностический endpoint для проверки конфигурации NocoDB
// Помогает выявить проблемы с переменными окружения и доступностью NocoDB
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/nocodb.ts [app-route] (ecmascript)");
;
;
async function GET() {
    const startTime = Date.now();
    const result = {
        timestamp: new Date().toISOString(),
        environment: {
            nodeEnv: ("TURBOPACK compile-time value", "development") || "unknown",
            vercelEnv: process.env.VERCEL_ENV
        },
        variables: {
            NOCODB_URL: {
                set: false
            },
            NOCODB_TOKEN: {
                set: false
            },
            tables: {}
        },
        connectivity: {
            nocoDBReachable: false
        },
        tables: {},
        summary: {
            configured: false,
            issues: [],
            recommendations: []
        }
    };
    // Проверка переменных окружения
    const nocodbUrl = process.env.NOCODB_URL;
    const nocodbToken = process.env.NOCODB_TOKEN;
    result.variables.NOCODB_URL = {
        set: !!nocodbUrl,
        value: nocodbUrl,
        masked: nocodbUrl ? `${nocodbUrl.substring(0, 30)}...` : undefined
    };
    result.variables.NOCODB_TOKEN = {
        set: !!nocodbToken,
        value: nocodbToken,
        masked: nocodbToken ? `${nocodbToken.substring(0, 10)}...${nocodbToken.slice(-4)}` : undefined
    };
    // Проверка окружения Vercel
    const vercelEnv = process.env.VERCEL_ENV;
    if (vercelEnv === "production" && (!nocodbUrl || !nocodbToken)) {
        result.summary.issues.push("⚠️ ВАЖНО: Переменные окружения не установлены для Production окружения!");
        result.summary.recommendations.push("В Vercel Dashboard → Settings → Environment Variables → для каждой переменной выберите 'Production' в разделе Environments");
    }
    // Проверка ID таблиц
    const tableNames = [
        "Meals",
        "Extras",
        "Delivery_Zones",
        "Users",
        "Orders",
        "Order_Persons",
        "Order_Meals",
        "Order_Extras",
        "Promo_Codes",
        "Reviews"
    ];
    for (const tableName of tableNames){
        const envVarName = `NOCODB_TABLE_${tableName.toUpperCase()}`;
        const tableId = process.env[envVarName];
        result.variables.tables[tableName] = {
            set: !!tableId,
            value: tableId
        };
    }
    // Проверка базовой конфигурации
    if (!nocodbUrl) {
        result.summary.issues.push("NOCODB_URL не установлен");
        const envHint = vercelEnv === "production" ? "⚠️ Убедитесь, что переменная установлена для Production окружения (не только Preview)!" : "";
        result.summary.recommendations.push(`Добавьте переменную окружения NOCODB_URL в Vercel Dashboard → Settings → Environment Variables. ${envHint}`);
    }
    if (!nocodbToken) {
        result.summary.issues.push("NOCODB_TOKEN не установлен");
        const envHint = vercelEnv === "production" ? "⚠️ Убедитесь, что переменная установлена для Production окружения (не только Preview)!" : "";
        result.summary.recommendations.push(`Добавьте переменную окружения NOCODB_TOKEN в Vercel Dashboard → Settings → Environment Variables. ${envHint}`);
    }
    // Проверка отсутствующих ID таблиц
    const missingTables = tableNames.filter((name)=>!result.variables.tables[name].set);
    if (missingTables.length > 0) {
        result.summary.issues.push(`Отсутствуют ID таблиц: ${missingTables.join(", ")}`);
        result.summary.recommendations.push(`Добавьте переменные окружения для таблиц: ${missingTables.map((name)=>`NOCODB_TABLE_${name.toUpperCase()}`).join(", ")}`);
    }
    // Если базовая конфигурация не настроена, возвращаем результат без проверки подключения
    if (!nocodbUrl || !nocodbToken) {
        result.summary.configured = false;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(result, {
            status: 503
        });
    }
    // Проверка доступности NocoDB
    try {
        const testUrl = nocodbUrl.replace(/\/$/, "");
        const apiUrl = testUrl.endsWith("/api/v2") ? testUrl : `${testUrl}/api/v2`;
        const healthUrl = `${apiUrl}/health` // Попробуем health endpoint, если есть
        ;
        const connectStartTime = Date.now();
        let testResponse = null;
        // Пробуем несколько вариантов проверки доступности
        try {
            testResponse = await fetch(`${apiUrl}/tables`, {
                method: "GET",
                headers: {
                    "xc-token": nocodbToken,
                    "Content-Type": "application/json"
                },
                signal: AbortSignal.timeout(5000)
            });
        } catch (fetchError) {
            // Если /tables не работает, пробуем просто базовый URL
            try {
                testResponse = await fetch(testUrl, {
                    method: "GET",
                    signal: AbortSignal.timeout(5000)
                });
            } catch  {
            // Игнорируем ошибку
            }
        }
        const connectEndTime = Date.now();
        result.connectivity.responseTime = connectEndTime - connectStartTime;
        if (testResponse && testResponse.ok) {
            result.connectivity.nocoDBReachable = true;
        } else {
            result.connectivity.nocoDBReachable = false;
            const status = testResponse?.status || "unknown";
            const statusText = testResponse?.statusText || "connection failed";
            result.connectivity.error = `HTTP ${status}: ${statusText}`;
            result.summary.issues.push(`NocoDB недоступен: ${result.connectivity.error}`);
            result.summary.recommendations.push("Проверьте, что NocoDB доступен из интернета и не блокирует запросы с серверов Vercel");
        }
    } catch (error) {
        result.connectivity.nocoDBReachable = false;
        const errorMessage = error instanceof Error ? error.message : String(error);
        result.connectivity.error = errorMessage;
        if (errorMessage.includes("timeout") || errorMessage.includes("TIMEOUT")) {
            result.summary.issues.push("Таймаут при подключении к NocoDB");
            result.summary.recommendations.push("Проверьте доступность NocoDB и настройки firewall");
        } else if (errorMessage.includes("ENOTFOUND") || errorMessage.includes("DNS")) {
            result.summary.issues.push("Не удалось разрешить DNS для NocoDB URL");
            result.summary.recommendations.push("Проверьте правильность NOCODB_URL");
        } else {
            result.summary.issues.push(`Ошибка подключения к NocoDB: ${errorMessage}`);
            result.summary.recommendations.push("Проверьте настройки NocoDB и доступность сервера");
        }
    }
    // Проверка доступности таблиц (только если NocoDB доступен)
    if (result.connectivity.nocoDBReachable && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isNocoDBConfigured"])()) {
        // Проверяем таблицу Meals
        try {
            const mealsStartTime = Date.now();
            const meals = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchMeals"])();
            const mealsEndTime = Date.now();
            result.tables.Meals = {
                accessible: true,
                recordCount: meals.length
            };
            if (mealsEndTime - mealsStartTime > 3000) {
                result.summary.issues.push("Таблица Meals загружается медленно (>3 сек)");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            result.tables.Meals = {
                accessible: false,
                error: errorMessage
            };
            result.summary.issues.push(`Таблица Meals недоступна: ${errorMessage}`);
            if (errorMessage.includes("TABLE_NOT_FOUND")) {
                result.summary.recommendations.push("Проверьте правильность NOCODB_TABLE_MEALS");
            }
        }
        // Проверяем таблицу Extras
        try {
            const extras = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchExtras"])();
            result.tables.Extras = {
                accessible: true,
                recordCount: extras.length
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            result.tables.Extras = {
                accessible: false,
                error: errorMessage
            };
            result.summary.issues.push(`Таблица Extras недоступна: ${errorMessage}`);
        }
        // Проверяем таблицу Delivery_Zones
        try {
            const zones = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchDeliveryZones"])();
            result.tables.Delivery_Zones = {
                accessible: true,
                recordCount: zones.length
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            result.tables.Delivery_Zones = {
                accessible: false,
                error: errorMessage
            };
            result.summary.issues.push(`Таблица Delivery_Zones недоступна: ${errorMessage}`);
        }
    }
    // Формируем итоговую оценку
    const hasAllVariables = nocodbUrl && nocodbToken && missingTables.length === 0;
    const canConnect = result.connectivity.nocoDBReachable;
    const canAccessTables = Object.values(result.tables).every((t)=>t.accessible !== false);
    result.summary.configured = hasAllVariables && canConnect && canAccessTables;
    if (result.summary.configured) {
        result.summary.recommendations.push("✅ Конфигурация выглядит правильно! Если товары все еще не загружаются, проверьте логи Vercel.");
    } else {
        result.summary.recommendations.push("После исправления проблем пересоберите проект в Vercel (Redeploy)");
    }
    const totalTime = Date.now() - startTime;
    const statusCode = result.summary.configured ? 200 : 503;
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        ...result,
        diagnostics: {
            totalTime: `${totalTime}ms`,
            version: "1.0.0"
        }
    }, {
        status: statusCode
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__20a11efa._.js.map