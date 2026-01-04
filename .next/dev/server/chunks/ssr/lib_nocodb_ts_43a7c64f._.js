module.exports = [
"[project]/lib/nocodb.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
    let createdOrder;
    if (apiBaseUrl === null) {
        // Серверная среда - прямой запрос к NocoDB
        createdOrder = await serverCreateRecord("Orders", order, "POST");
    } else {
        // Клиентская среда - через API proxy
        const response = await clientFetch("Orders", {}, {
            method: "POST",
            body: JSON.stringify(order)
        });
        if (Array.isArray(response)) {
            createdOrder = response[0];
        } else if (response && typeof response === 'object' && 'Id' in response) {
            createdOrder = response;
        } else if (response && typeof response === 'object' && 'record' in response) {
            createdOrder = response.record;
        } else {
            createdOrder = response;
        }
    }
    // NocoDB часто возвращает только Id при создании, поэтому всегда получаем полный объект
    if (createdOrder?.Id) {
        // Проверяем, есть ли уже все нужные поля
        if (!createdOrder.order_number || Object.keys(createdOrder).length < 5) {
            console.log(`⚠️ Order created but incomplete response, fetching full order ${createdOrder.Id}...`);
            try {
                // Небольшая задержка, чтобы запись точно сохранилась
                await new Promise((resolve)=>setTimeout(resolve, 300));
                const fullOrder = await fetchOrderById(createdOrder.Id);
                if (fullOrder && fullOrder.order_number) {
                    console.log(`✅ Fetched full order with order_number: ${fullOrder.order_number}`);
                    return fullOrder;
                } else {
                    console.warn(`⚠️ Fetched order also incomplete, but using it anyway`);
                    if (fullOrder) return fullOrder;
                }
            } catch (error) {
                console.warn(`⚠️ Failed to fetch full order:`, error);
                // Если не удалось получить, но есть сгенерированный номер, добавляем его
                if ('order_number' in order) {
                    return {
                        ...createdOrder,
                        order_number: order.order_number
                    };
                }
            }
        } else {
            console.log(`✅ Order created with complete data, order_number: ${createdOrder.order_number}`);
        }
    }
    return createdOrder;
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
];

//# sourceMappingURL=lib_nocodb_ts_43a7c64f._.js.map