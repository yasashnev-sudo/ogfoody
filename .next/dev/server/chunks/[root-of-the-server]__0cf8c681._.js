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
    "awardLoyaltyPoints",
    ()=>awardLoyaltyPoints,
    "calculateCashbackPercent",
    ()=>calculateCashbackPercent,
    "calculateDeliveryFee",
    ()=>calculateDeliveryFee,
    "calculateEarnedPoints",
    ()=>calculateEarnedPoints,
    "calculateUserBalance",
    ()=>calculateUserBalance,
    "createFraudAlert",
    ()=>createFraudAlert,
    "createLoyaltyPointsTransaction",
    ()=>createLoyaltyPointsTransaction,
    "createOrder",
    ()=>createOrder,
    "createOrderExtra",
    ()=>createOrderExtra,
    "createOrderMeal",
    ()=>createOrderMeal,
    "createOrderPerson",
    ()=>createOrderPerson,
    "createPendingLoyaltyPoints",
    ()=>createPendingLoyaltyPoints,
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
    "fetchLoyaltyPointsTransactions",
    ()=>fetchLoyaltyPointsTransactions,
    "fetchMealById",
    ()=>fetchMealById,
    "fetchMeals",
    ()=>fetchMeals,
    "fetchOrderById",
    ()=>fetchOrderById,
    "fetchOrderByNumber",
    ()=>fetchOrderByNumber,
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
    "fetchOrdersWithDetails",
    ()=>fetchOrdersWithDetails,
    "fetchPendingTransactionsByOrder",
    ()=>fetchPendingTransactionsByOrder,
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
    "getMealPriceForPortion",
    ()=>getMealPriceForPortion,
    "getUserCancellationStats",
    ()=>getUserCancellationStats,
    "incrementPromoCodeUsage",
    ()=>incrementPromoCodeUsage,
    "isNocoDBConfigured",
    ()=>isNocoDBConfigured,
    "nocoFetch",
    ()=>nocoFetch,
    "nocoFetchNoCache",
    ()=>nocoFetchNoCache,
    "processPendingTransactionsForOrder",
    ()=>processPendingTransactionsForOrder,
    "refundLoyaltyPoints",
    ()=>refundLoyaltyPoints,
    "updateLoyaltyTransaction",
    ()=>updateLoyaltyTransaction,
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
        Reviews: process.env.NOCODB_TABLE_REVIEWS,
        Loyalty_Points_Transactions: process.env.NOCODB_TABLE_LOYALTY_POINTS_TRANSACTIONS,
        Fraud_Alerts: process.env.NOCODB_TABLE_FRAUD_ALERTS || "mr9txejs65nk1yi"
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
    console.log(`🌐 serverFetch: ${tableName}`, {
        url
    });
    const response = await fetch(url, {
        headers: {
            "xc-token": token,
            "Content-Type": "application/json"
        },
        // Кэшируем на 1 минуту для более частого обновления данных
        next: {
            revalidate: 60
        }
    });
    const text = await response.text();
    if (!response.ok) {
        console.error(`❌ serverFetch error for ${tableName}:`, {
            status: response.status,
            url,
            response: text.substring(0, 500)
        });
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
// Версия serverFetch без кэширования (для использования после обновлений)
async function serverFetchNoCache(tableName, params = {}) {
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
        // Отключаем кэш для получения свежих данных
        cache: 'no-store'
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
    // NocoDB API v2 для обновления использует bulk update через PATCH к /tables/{tableId}/records
    // с массивом записей, где каждая запись содержит Id и обновляемые поля
    let url;
    let actualMethod = method;
    let bodyData = data;
    if (method === "PATCH" && recordId) {
        // Для обновления одной записи используем bulk update формат
        url = `${baseUrl}/tables/${tableId}/records`;
        bodyData = [
            {
                Id: recordId,
                ...data
            }
        ];
    } else if (method === "PUT" && recordId) {
        // PUT также используем bulk update
        url = `${baseUrl}/tables/${tableId}/records`;
        bodyData = [
            {
                Id: recordId,
                ...data
            }
        ];
        actualMethod = "PATCH"; // NocoDB использует PATCH для bulk update
    } else {
        url = `${baseUrl}/tables/${tableId}/records`;
    }
    const token = getNocoDBToken();
    const response = await fetch(url, {
        method: actualMethod,
        headers: {
            "xc-token": token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyData)
    });
    const text = await response.text();
    if (!response.ok) {
        console.error(`❌ NocoDB ${method} error for ${tableName}:`, {
            status: response.status,
            statusText: response.statusText,
            url,
            data,
            response: text.substring(0, 500)
        });
        if (text.includes("TABLE_NOT_FOUND") || response.status === 404) {
            throw new Error(`TABLE_NOT_FOUND:${tableName}`);
        }
        throw new Error(`NocoDB API error: ${response.status} - ${text.substring(0, 200)}`);
    }
    try {
        const result = JSON.parse(text);
        // NocoDB может вернуть запись в разных форматах
        if (Array.isArray(result)) {
            // Для bulk update может вернуться только Id, тогда получаем полную запись
            if (result.length > 0 && Object.keys(result[0]).length === 1 && 'Id' in result[0] && recordId) {
                console.log(`⚠️ Bulk update returned only Id, fetching full record ${recordId}...`);
                // Небольшая задержка для гарантии сохранения
                await new Promise((resolve)=>setTimeout(resolve, 500));
                // Повторный запрос БЕЗ кэша
                const fetchedResponse = await serverFetchNoCache(tableName, {
                    where: `(Id,eq,${recordId})`
                });
                const fetchedList = fetchedResponse?.list || [];
                if (fetchedList.length > 0) {
                    console.log(`✅ Fetched full record after update:`, {
                        Id: fetchedList[0].Id,
                        loyalty_points_earned: fetchedList[0].loyalty_points_earned,
                        'Loyalty Points Earned': fetchedList[0]['Loyalty Points Earned']
                    });
                    return fetchedList[0];
                } else {
                    console.warn(`⚠️ Failed to fetch full record ${recordId}, returning bulk update result`);
                }
            }
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
async function nocoFetch(tableName, params = {}, options = {}) {
    const apiBaseUrl = getApiBaseUrl();
    if (apiBaseUrl === null) {
        return serverFetch(tableName, params);
    } else {
        return clientFetch(tableName, params, options);
    }
}
async function nocoFetchNoCache(tableName, params = {}, options = {}) {
    const apiBaseUrl = getApiBaseUrl();
    if (apiBaseUrl === null) {
        return serverFetchNoCache(tableName, params);
    } else {
        return clientFetch(tableName, params, {
            ...options,
            cache: 'no-store'
        });
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
    // NocoDB API v2 использует заголовки колонок (titles) в where-условиях, а не имена колонок
    // В таблице Users колонка phone имеет заголовок "Phone"
    console.log(`🔍 fetchUserByPhone: поиск пользователя с телефоном=${phone}`);
    const response = await nocoFetch("Users", {
        where: `(Phone,eq,${phone})`
    });
    const rawUser = response.list?.[0];
    if (!rawUser) {
        console.warn(`⚠️ Пользователь с телефоном=${phone} не найден в базе данных`);
        return null;
    }
    console.log(`✅ Пользователь найден по телефону:`, {
        rawKeys: Object.keys(rawUser),
        hasId: 'Id' in rawUser,
        hasid: 'id' in rawUser,
        hasUserId: 'User ID' in rawUser,
        Id: rawUser.Id,
        id: rawUser.id,
        userId: rawUser['User ID'] || rawUser.user_id,
        phone: rawUser.phone || rawUser["Phone"]
    });
    // Преобразуем данные из формата API (с заголовками колонок) в формат NocoDBUser
    // ВАЖНО: Обрабатываем Id явно, так как в NocoDB может быть Id, id, или другое название
    const internalId = rawUser.Id !== undefined ? rawUser.Id : rawUser.id !== undefined ? rawUser.id : rawUser["Id"] !== undefined ? rawUser["Id"] : undefined;
    if (internalId === undefined) {
        console.error("❌ Поле Id не найдено в ответе API для пользователя:", rawUser);
        console.error("Доступные поля:", Object.keys(rawUser));
    }
    // Обрабатываем User ID (может быть строкой или числом)
    const userIdValue = rawUser.user_id !== undefined ? rawUser.user_id : rawUser["User ID"] !== undefined ? typeof rawUser["User ID"] === "string" ? parseInt(rawUser["User ID"]) || undefined : rawUser["User ID"] : undefined;
    // ВАЖНО: Используем User ID как основной идентификатор, fallback на internalId если User ID не установлен ИЛИ null
    // Проверяем что userIdValue не null и не undefined
    const finalUserId = userIdValue !== undefined && userIdValue !== null ? userIdValue : internalId;
    console.log(`📝 Определены ID:`);
    console.log(`  internalId = ${internalId} (${typeof internalId})`);
    console.log(`  userIdValue = ${userIdValue} (${typeof userIdValue})`);
    console.log(`  finalUserId = ${finalUserId} (${typeof finalUserId})`);
    const userId = finalUserId !== undefined ? typeof finalUserId === 'number' ? finalUserId : parseInt(String(finalUserId)) : 0;
    console.log(`🔢 userId = ${userId} (${typeof userId}), isNaN = ${isNaN(userId)}`);
    // ✅ ВЫЧИСЛЯЕМ баланс из транзакций (единственный источник истины!)
    // ВАЖНО: Проверяем что userId валиден (не 0, не NaN)
    const calculatedBalance = userId && !isNaN(userId) ? await calculateUserBalance(userId) : 0;
    console.log(`✅ fetchUserByPhone: баланс из транзакций = ${calculatedBalance} (userId=${userId}, isValid=${userId && !isNaN(userId)})`);
    return {
        ...rawUser,
        Id: userId,
        phone: rawUser.phone || rawUser["Phone"] || "",
        name: rawUser.name || rawUser["Name"] || "",
        password_hash: rawUser.password_hash || rawUser["Password Hash"] || undefined,
        additional_phone: rawUser.additional_phone || rawUser["Additional Phone"] || undefined,
        street: rawUser.street || rawUser["Street"] || undefined,
        building: rawUser.building || rawUser["Building"] || undefined,
        building_section: rawUser.building_section || rawUser["Building Section"] || undefined,
        apartment: rawUser.apartment || rawUser["Apartment"] || undefined,
        entrance: rawUser.entrance || rawUser["Entrance"] || undefined,
        floor: rawUser.floor || rawUser["Floor"] || undefined,
        intercom: rawUser.intercom || rawUser["Intercom"] || undefined,
        district: rawUser.district || rawUser["District"] || undefined,
        delivery_comment: rawUser.delivery_comment || rawUser["Delivery Comment"] || undefined,
        loyalty_points: calculatedBalance,
        total_spent: rawUser.total_spent !== undefined ? rawUser.total_spent : rawUser["Total Spent"] !== undefined ? rawUser["Total Spent"] : 0,
        created_at: rawUser.created_at || rawUser["Created At"] || "",
        updated_at: rawUser.updated_at || rawUser["Updated At"] || "",
        user_id: userIdValue,
        "User ID": rawUser["User ID"] !== undefined ? rawUser["User ID"] : rawUser.user_id
    };
}
async function calculateUserBalance(userId, noCache = false) {
    try {
        // Используем nocoFetch - работает и на клиенте (через API proxy) и на сервере
        const fetchFn = noCache ? nocoFetchNoCache : nocoFetch;
        const response = await fetchFn("Loyalty_Points_Transactions", {
            where: `(User ID,eq,${userId})`,
            limit: 10000
        });
        const transactions = response.list || [];
        // Фильтруем транзакции: учитываем только реально начисленные баллы
        // - undefined/null/"": учитываем (старые транзакции без статуса или NocoDB не заполнил)
        // - 'completed': учитываем (баллы начислены)
        // - 'pending': НЕ учитываем (баллы еще не начислены, ждут оплаты)
        // - 'cancelled': НЕ учитываем (баллы отменены - ВАЖНО: это статус транзакции, не тип!)
        const activeTransactions = transactions.filter((t)=>{
            const status = t['Transaction Status'] || t.transaction_status;
            // ИСПРАВЛЕНО: Если статус undefined, null, или пустая строка - считаем completed
            // Это обрабатывает случаи, когда NocoDB не заполнил поле или вернул null
            if (!status || status === undefined || status === null || status === '') return true;
            // Учитываем только completed транзакции
            return status === 'completed';
        });
        // Вычисляем баланс
        let balance = 0;
        activeTransactions.forEach((t)=>{
            const type = t['Transaction Type'] || t.transaction_type;
            const amount = t['Points'] || t.points || t['Points Amount'] || 0;
            // Все типы транзакций используют значение Points напрямую
            // (Points уже содержит правильный знак: +141 для earned, -141 для cancelled)
            balance += amount;
        });
        console.log(`💰 calculateUserBalance(${userId}): ${balance} баллов (из ${activeTransactions.length} активных транзакций, всего ${transactions.length})`);
        return Math.max(0, balance);
    } catch (error) {
        console.error(`❌ Ошибка вычисления баланса для userId=${userId}:`, error);
        return 0;
    }
}
async function fetchUserById(id, noCache = false) {
    console.log(`🔍 fetchUserById: поиск пользователя с Id=${id} (noCache=${noCache})`);
    const fetchFn = noCache ? nocoFetchNoCache : nocoFetch;
    // ✅ ИСПРАВЛЕНО: Ищем по первичному ключу Id, а не по User ID
    const response = await fetchFn("Users", {
        where: `(Id,eq,${id})`
    });
    const rawUser = response.list?.[0];
    if (!rawUser) {
        console.warn(`⚠️ Пользователь с Id=${id} не найден в базе данных`);
        return null;
    }
    console.log(`✅ Пользователь найден:`, {
        rawKeys: Object.keys(rawUser),
        hasId: 'Id' in rawUser,
        hasid: 'id' in rawUser,
        hasUserId: 'User ID' in rawUser,
        Id: rawUser.Id,
        id: rawUser.id,
        userId: rawUser['User ID'] || rawUser.user_id,
        phone: rawUser.phone || rawUser["Phone"],
        'Loyalty Points': rawUser['Loyalty Points'],
        loyalty_points: rawUser.loyalty_points,
        'Total Spent': rawUser['Total Spent'],
        total_spent: rawUser.total_spent
    });
    // 🔍 ЛОГИРОВАНИЕ АДРЕСНЫХ ПОЛЕЙ
    console.log(`🔍 [fetchUserById] Address fields from rawUser:`, {
        'District': rawUser.District,
        'district': rawUser.district,
        'Street': rawUser.Street,
        'street': rawUser.street,
        'Building': rawUser.Building,
        'building': rawUser.building,
        'Apartment': rawUser.Apartment,
        'apartment': rawUser.apartment
    });
    // Преобразуем данные из формата API (с заголовками колонок) в формат NocoDBUser
    // ВАЖНО: Обрабатываем Id явно, так как в NocoDB может быть Id, id, или другое название
    const userId = rawUser.Id !== undefined ? rawUser.Id : rawUser.id !== undefined ? rawUser.id : rawUser["Id"] !== undefined ? rawUser["Id"] : undefined;
    if (userId === undefined) {
        console.error("❌ Поле Id не найдено в ответе API для пользователя:", rawUser);
        console.error("Доступные поля:", Object.keys(rawUser));
    }
    // Обрабатываем User ID (может быть строкой или числом)
    const userIdValue = rawUser.user_id !== undefined ? rawUser.user_id : rawUser["User ID"] !== undefined ? typeof rawUser["User ID"] === "string" ? parseInt(rawUser["User ID"]) || undefined : rawUser["User ID"] : undefined;
    const normalizedUser = {
        ...rawUser,
        Id: userId !== undefined ? typeof userId === 'number' ? userId : parseInt(String(userId)) : 0,
        phone: rawUser.phone || rawUser["Phone"] || "",
        name: rawUser.name || rawUser["Name"] || "",
        password_hash: rawUser.password_hash || rawUser["Password Hash"] || undefined,
        additional_phone: rawUser.additional_phone || rawUser["Additional Phone"] || undefined,
        street: rawUser.street || rawUser["Street"] || undefined,
        building: rawUser.building || rawUser["Building"] || undefined,
        building_section: rawUser.building_section || rawUser["Building Section"] || undefined,
        apartment: rawUser.apartment || rawUser["Apartment"] || undefined,
        entrance: rawUser.entrance || rawUser["Entrance"] || undefined,
        floor: rawUser.floor || rawUser["Floor"] || undefined,
        intercom: rawUser.intercom || rawUser["Intercom"] || undefined,
        district: rawUser.district || rawUser["District"] || undefined,
        delivery_comment: rawUser.delivery_comment || rawUser["Delivery Comment"] || undefined,
        loyalty_points: 0,
        total_spent: rawUser.total_spent !== undefined ? rawUser.total_spent : rawUser["Total Spent"] !== undefined ? rawUser["Total Spent"] : 0,
        created_at: rawUser.created_at || rawUser["Created At"] || "",
        updated_at: rawUser.updated_at || rawUser["Updated At"] || "",
        user_id: userIdValue,
        "User ID": rawUser["User ID"] !== undefined ? rawUser["User ID"] : rawUser.user_id
    };
    // ВАЖНО: Вычисляем баланс из транзакций (единственный надежный источник!)
    // Проверяем что userIdValue не null и не undefined, иначе используем userId
    const finalUserIdForBalance = userIdValue !== undefined && userIdValue !== null ? userIdValue : userId;
    const calculatedBalance = finalUserIdForBalance && !isNaN(finalUserIdForBalance) ? await calculateUserBalance(finalUserIdForBalance, noCache) : 0;
    normalizedUser.loyalty_points = calculatedBalance;
    console.log(`✅ fetchUserById normalized result:`, {
        Id: normalizedUser.Id,
        loyalty_points: calculatedBalance,
        total_spent: normalizedUser.total_spent,
        balanceSource: 'calculated from transactions'
    });
    // 🔍 ЛОГИРОВАНИЕ НОРМАЛИЗОВАННЫХ АДРЕСНЫХ ПОЛЕЙ
    console.log(`🔍 [fetchUserById] Address fields in normalizedUser:`, {
        'District': normalizedUser.District,
        'district': normalizedUser.district,
        'Street': normalizedUser.Street,
        'street': normalizedUser.street,
        'Building': normalizedUser.Building,
        'building': normalizedUser.building,
        'Apartment': normalizedUser.Apartment,
        'apartment': normalizedUser.apartment
    });
    return normalizedUser;
}
async function createUser(user) {
    const apiBaseUrl = getApiBaseUrl();
    // Добавляем created_at и updated_at, если они не переданы
    const now = new Date().toISOString();
    // Маппинг полей: используем Title Case для NocoDB API
    const mappedUser = {};
    if (user.name !== undefined) mappedUser["Name"] = user.name;
    if (user.phone !== undefined) mappedUser["Phone"] = user.phone;
    if (user.additional_phone !== undefined) mappedUser["Additional Phone"] = user.additional_phone;
    if (user.street !== undefined) mappedUser["Street"] = user.street;
    if (user.building !== undefined) mappedUser["Building"] = user.building;
    if (user.building_section !== undefined) mappedUser["Building Section"] = user.building_section;
    if (user.apartment !== undefined) mappedUser["Apartment"] = user.apartment;
    if (user.entrance !== undefined) mappedUser["Entrance"] = user.entrance;
    if (user.floor !== undefined) mappedUser["Floor"] = user.floor;
    if (user.intercom !== undefined) mappedUser["Intercom"] = user.intercom;
    if (user.district !== undefined) mappedUser["District"] = user.district;
    if (user.delivery_comment !== undefined) mappedUser["Delivery Comment"] = user.delivery_comment;
    if (user.loyalty_points !== undefined) mappedUser["Loyalty Points"] = user.loyalty_points;
    if (user.total_spent !== undefined) mappedUser["Total Spent"] = user.total_spent;
    if (user.user_id !== undefined) mappedUser["User ID"] = user.user_id;
    mappedUser["Created At"] = user.created_at || now;
    mappedUser["Updated At"] = user.updated_at || now;
    if (apiBaseUrl === null) {
        return serverCreateRecord("Users", mappedUser, "POST");
    } else {
        const response = await clientFetch("Users", {}, {
            method: "POST",
            body: JSON.stringify(mappedUser)
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
    // Маппинг полей: используем Title Case для NocoDB API
    const mappedData = {};
    if (data.name !== undefined) mappedData["Name"] = data.name;
    if (data.phone !== undefined) mappedData["Phone"] = data.phone;
    if (data.additional_phone !== undefined) mappedData["Additional Phone"] = data.additional_phone;
    if (data.street !== undefined) mappedData["Street"] = data.street;
    if (data.building !== undefined) mappedData["Building"] = data.building;
    if (data.building_section !== undefined) mappedData["Building Section"] = data.building_section;
    if (data.apartment !== undefined) mappedData["Apartment"] = data.apartment;
    if (data.entrance !== undefined) mappedData["Entrance"] = data.entrance;
    if (data.floor !== undefined) mappedData["Floor"] = data.floor;
    if (data.intercom !== undefined) mappedData["Intercom"] = data.intercom;
    if (data.district !== undefined) mappedData["District"] = data.district;
    if (data.delivery_comment !== undefined) mappedData["Delivery Comment"] = data.delivery_comment;
    // ВАЖНО: loyalty_points ОБНОВЛЯЕТСЯ через updateUser (вычисляется из транзакций, но синхронизируется!)
    if (data.loyalty_points !== undefined) mappedData["Loyalty Points"] = data.loyalty_points;
    if (data.total_spent !== undefined) mappedData["Total Spent"] = data.total_spent;
    if (data.updated_at !== undefined) mappedData["Updated At"] = data.updated_at;
    if (data.user_id !== undefined) mappedData["User ID"] = data.user_id;
    console.log(`📝 updateUser(${id}):`, {
        originalData: data,
        mappedData,
        hasTotalSpent: 'Total Spent' in mappedData,
        totalSpentValue: mappedData["Total Spent"]
    });
    if (apiBaseUrl === null) {
        const result = await serverCreateRecord("Users", mappedData, "PATCH", id);
        // После bulk update возвращаются не все поля, поэтому мерджим с исходными данными
        const mergedResult = {
            ...result,
            // loyalty_points больше НЕ обновляется (всегда вычисляется из транзакций)
            total_spent: data.total_spent !== undefined ? data.total_spent : result.total_spent
        };
        console.log(`✅ updateUser result merged with input:`, {
            Id: mergedResult.Id,
            total_spent: mergedResult.total_spent
        });
        return mergedResult;
    } else {
        // ВАЖНО: NocoDB v2 API для обновления использует bulk update формат
        // Нужно передавать МАССИВ записей с Id
        const response = await fetch(`/api/db/Users/records`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify([
                {
                    Id: id,
                    ...mappedData
                }
            ])
        });
        if (!response.ok) {
            const text = await response.text();
            console.error(`❌ Failed to update user ${id}:`, response.status, text);
            // Не бросаем ошибку - продолжаем работу даже если обновление не удалось
            // Профиль уже сохранён в localStorage
            return {
                Id: id,
                ...data
            };
        }
        const result = await response.json();
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
    }
}
function calculateCashbackPercent(totalSpent) {
    if (totalSpent >= 50000) return 7 // Gold
    ;
    if (totalSpent >= 20000) return 5 // Silver
    ;
    return 3 // Bronze
    ;
}
function calculateEarnedPoints(orderTotal, pointsUsed, totalSpent) {
    if (orderTotal <= 0) {
        console.warn(`⚠️ calculateEarnedPoints: orderTotal <= 0 (${orderTotal}), возвращаем 0`);
        return 0;
    }
    const cashbackPercent = calculateCashbackPercent(totalSpent);
    // Баллы начисляются с суммы заказа минус использованные баллы
    const amountForPoints = Math.max(0, orderTotal - pointsUsed);
    const earnedPoints = Math.floor(amountForPoints * (cashbackPercent / 100));
    console.log(`🔢 calculateEarnedPoints:`, {
        orderTotal,
        pointsUsed,
        totalSpent,
        cashbackPercent,
        amountForPoints,
        earnedPoints
    });
    return earnedPoints;
}
async function calculateDeliveryFee(district, orderSubtotal, deliveryZones) {
    // Если сумма заказа >= 2300₽, доставка бесплатная
    if (orderSubtotal >= 2300) {
        console.log(`✅ Доставка бесплатная: сумма заказа ${orderSubtotal}₽ >= 2300₽`);
        return 0;
    }
    // Если район не указан, не можем рассчитать доставку
    if (!district) {
        console.warn(`⚠️ Район не указан, возвращаем 0`);
        return 0;
    }
    // Загружаем зоны доставки, если не переданы
    if (!deliveryZones) {
        deliveryZones = await fetchDeliveryZones();
    }
    // Ищем зону для указанного района
    const zone = deliveryZones.find((z)=>{
        const zoneDistrict = z.District || z.district || "";
        return zoneDistrict.toLowerCase().trim() === district.toLowerCase().trim();
    });
    if (!zone) {
        console.warn(`⚠️ Зона доставки для района "${district}" не найдена`);
        return 0;
    }
    // Получаем стоимость доставки из зоны
    const deliveryFee = typeof zone["Delivery Fee"] === 'number' ? zone["Delivery Fee"] : typeof zone.delivery_fee === 'number' ? zone.delivery_fee : parseFloat(String(zone["Delivery Fee"] || zone.delivery_fee || 0));
    console.log(`💰 Стоимость доставки для района "${district}": ${deliveryFee}₽ (сумма заказа: ${orderSubtotal}₽)`);
    return deliveryFee;
}
async function createPendingLoyaltyPoints(userId, orderTotal, pointsUsed = 0, pointsEarned, orderId) {
    const user = await fetchUserById(userId);
    if (!user) {
        throw new Error(`User with ID ${userId} not found`);
    }
    const currentTotalSpent = typeof user.total_spent === 'number' ? user.total_spent : parseFloat(String(user.total_spent)) || 0;
    const currentLoyaltyPoints = typeof user.loyalty_points === 'number' ? user.loyalty_points : parseInt(String(user.loyalty_points)) || 0;
    // Рассчитываем баллы, если не указаны
    const earnedPoints = pointsEarned !== undefined ? pointsEarned : calculateEarnedPoints(orderTotal, pointsUsed, currentTotalSpent);
    const now = new Date().toISOString();
    // Если использовались баллы, создаем транзакцию на списание (completed)
    if (pointsUsed > 0) {
        try {
            await createLoyaltyPointsTransaction({
                user_id: userId,
                order_id: orderId,
                transaction_type: "used",
                transaction_status: "completed",
                points: -pointsUsed,
                description: `Использовано ${pointsUsed} баллов для оплаты заказа`,
                created_at: now,
                updated_at: now,
                processed_at: now
            });
        } catch (error) {
            console.error("Failed to create loyalty points transaction for used points:", error);
        }
    }
    // Создаем pending транзакцию на начисление баллов
    if (earnedPoints > 0) {
        try {
            console.log(`⏳ Создание pending транзакции на начисление баллов:`, {
                user_id: userId,
                order_id: orderId,
                transaction_type: "earned",
                transaction_status: "pending",
                points: earnedPoints,
                description: `Ожидает начисления ${earnedPoints} баллов за заказ на сумму ${orderTotal} руб. (наличные)`
            });
            await createLoyaltyPointsTransaction({
                user_id: userId,
                order_id: orderId,
                transaction_type: "earned",
                transaction_status: "pending",
                points: earnedPoints,
                description: `Ожидает начисления ${earnedPoints} баллов за заказ на сумму ${orderTotal} руб. (наличные)`,
                created_at: now,
                updated_at: now
            });
            console.log(`✅ Pending транзакция создана успешно`);
        } catch (error) {
            console.error("❌ Ошибка при создании pending транзакции:", error);
        }
    }
    // ✅ ИСПРАВЛЕНО 2026-01-11: Обновляем totalSpent ВСЕГДА для наличных
    // Баллы не начисляем (pending), но totalSpent обновляем сразу
    const newTotalSpent = currentTotalSpent + orderTotal - pointsUsed;
    if (pointsUsed > 0) {
        // Если использовались баллы - обновляем и баланс, и totalSpent
        const newLoyaltyPoints = currentLoyaltyPoints - pointsUsed;
        console.log(`💳 Обновление баланса пользователя (списание баллов):`, {
            currentLoyaltyPoints,
            pointsUsed,
            newLoyaltyPoints,
            currentTotalSpent,
            orderTotal,
            newTotalSpent,
            calculation: `${currentTotalSpent} + ${orderTotal} - ${pointsUsed} = ${newTotalSpent}`
        });
        await updateUser(userId, {
            loyalty_points: newLoyaltyPoints,
            total_spent: newTotalSpent
        });
    } else {
        // Если баллы не использовались - обновляем только totalSpent
        console.log(`💳 Обновление totalSpent (наличные без баллов):`, {
            currentTotalSpent,
            orderTotal,
            newTotalSpent,
            calculation: `${currentTotalSpent} + ${orderTotal} = ${newTotalSpent}`
        });
        await updateUser(userId, {
            total_spent: newTotalSpent
        });
    }
    console.log(`⏳ Pending транзакция создана. Баллы будут начислены позже через cron job`);
}
async function awardLoyaltyPoints(userId, orderTotal, pointsUsed = 0, pointsEarned, orderId) {
    // ✅ ИСПРАВЛЕНО: Всегда загружаем свежие данные без кэша
    const user = await fetchUserById(userId, true);
    if (!user) {
        throw new Error(`User with ID ${userId} not found`);
    }
    const currentTotalSpent = typeof user.total_spent === 'number' ? user.total_spent : parseFloat(String(user.total_spent)) || 0;
    // Рассчитываем баллы, если не указаны
    const earnedPoints = pointsEarned !== undefined ? pointsEarned : calculateEarnedPoints(orderTotal, pointsUsed, currentTotalSpent);
    // Создаем транзакции для истории
    const now = new Date().toISOString();
    // Если использовались баллы, создаем транзакцию на списание
    if (pointsUsed > 0) {
        await createLoyaltyPointsTransaction({
            user_id: userId,
            order_id: orderId,
            transaction_type: "used",
            transaction_status: "completed",
            points: -pointsUsed,
            description: `Использовано ${pointsUsed} баллов для оплаты заказа`,
            created_at: now,
            updated_at: now,
            processed_at: now
        });
        console.log(`✅ Транзакция "used" создана: -${pointsUsed} баллов`);
    }
    // Создаем транзакцию на начисление баллов
    if (earnedPoints > 0) {
        await createLoyaltyPointsTransaction({
            user_id: userId,
            order_id: orderId,
            transaction_type: "earned",
            transaction_status: "completed",
            points: earnedPoints,
            description: `Начислено ${earnedPoints} баллов за заказ на сумму ${orderTotal} руб.`,
            created_at: now,
            updated_at: now,
            processed_at: now
        });
        console.log(`✅ Транзакция "earned" создана: +${earnedPoints} баллов`);
    }
    // Обновляем total_spent и loyalty_points
    const newTotalSpent = currentTotalSpent + orderTotal - pointsUsed;
    // Вычисляем новый баланс: текущий баланс + начислено - использовано
    const currentBalance = typeof user.loyalty_points === 'number' ? user.loyalty_points : parseFloat(String(user.loyalty_points)) || 0;
    const newBalance = currentBalance + earnedPoints - pointsUsed;
    console.log(`💳 Обновление баланса:`, {
        currentBalance,
        earnedPoints,
        pointsUsed,
        newBalance,
        calculation: `${currentBalance} + ${earnedPoints} - ${pointsUsed} = ${newBalance}`,
        currentTotalSpent,
        orderTotal,
        newTotalSpent,
        calculation_totalSpent: `${currentTotalSpent} + ${orderTotal} - ${pointsUsed} = ${newTotalSpent}`
    });
    // Обновляем и total_spent и loyalty_points!
    console.log(`📝 [awardLoyaltyPoints] Обновляем пользователя ${userId}:`, {
        total_spent: newTotalSpent,
        loyalty_points: newBalance
    });
    await updateUser(userId, {
        total_spent: newTotalSpent,
        loyalty_points: newBalance,
        updated_at: now
    });
    console.log(`✅ [awardLoyaltyPoints] Пользователь ${userId} обновлен в БД`);
    // Возвращаем пользователя с актуальным балансом
    const updatedUser = await fetchUserById(userId, true) // noCache для свежих данных
    ;
    if (!updatedUser) {
        throw new Error(`User with ID ${userId} not found after update`);
    }
    console.log(`✅ awardLoyaltyPoints завершено:`, {
        userId,
        earnedPoints,
        pointsUsed,
        actualBalance: updatedUser.loyalty_points,
        totalSpent: updatedUser.total_spent
    });
    return updatedUser;
}
async function refundLoyaltyPoints(userId, pointsEarned, pointsUsed, orderTotal, orderId) {
    const user = await fetchUserById(userId);
    if (!user) {
        throw new Error(`User with ID ${userId} not found`);
    }
    // Создаем транзакции для истории
    const now = new Date().toISOString();
    // Если были использованы баллы, возвращаем их
    if (pointsUsed > 0) {
        console.log(`📝 Создаем транзакцию "refunded": points=+${pointsUsed}`);
        const refundedTransaction = await createLoyaltyPointsTransaction({
            user_id: userId,
            order_id: orderId,
            transaction_type: "refunded",
            transaction_status: "completed",
            points: pointsUsed,
            description: `Возвращено ${pointsUsed} баллов при отмене заказа`,
            created_at: now,
            updated_at: now,
            processed_at: now
        });
        console.log(`✅ Транзакция "refunded" создана:`, {
            Id: refundedTransaction.Id,
            points: refundedTransaction.points,
            type: refundedTransaction.transaction_type,
            status: refundedTransaction.transaction_status
        });
    }
    // Списываем начисленные баллы
    if (pointsEarned > 0) {
        console.log(`📝 Создаем транзакцию "cancelled": points=-${pointsEarned}`);
        const cancelledTransaction = await createLoyaltyPointsTransaction({
            user_id: userId,
            order_id: orderId,
            transaction_type: "cancelled",
            transaction_status: "completed",
            points: -pointsEarned,
            description: `Списано ${pointsEarned} баллов при отмене заказа`,
            created_at: now,
            updated_at: now,
            processed_at: now
        });
        console.log(`✅ Транзакция "cancelled" создана:`, {
            Id: cancelledTransaction.Id,
            points: cancelledTransaction.points,
            type: cancelledTransaction.transaction_type,
            status: cancelledTransaction.transaction_status
        });
    }
    // ✅ НЕ обновляем loyalty_points напрямую!
    // Баланс всегда вычисляется из транзакций через calculateUserBalance
    console.log(`💳 refundLoyaltyPoints - транзакции созданы:`, {
        userId,
        orderId,
        pointsUsed: pointsUsed > 0 ? `+${pointsUsed}` : 0,
        pointsEarned: pointsEarned > 0 ? `-${pointsEarned}` : 0,
        explanation: `Баланс будет пересчитан из транзакций автоматически при следующем fetchUserById`
    });
    // Возвращаем пользователя с актуальным балансом (пересчитанным из транзакций)
    const updatedUser = await fetchUserById(userId, true) // noCache для свежих данных
    ;
    if (!updatedUser) {
        throw new Error(`User with ID ${userId} not found after refund`);
    }
    console.log(`✅ Актуальный баланс после возврата: ${updatedUser.loyalty_points} баллов (пересчитан из транзакций)`);
    return updatedUser;
}
async function fetchOrders(userId) {
    const params = {
        limit: "1000",
        sort: "-Start Date"
    };
    if (userId) {
        // NocoDB API v2 использует заголовки колонок в where-условиях
        // В таблице Orders колонка user_id имеет заголовок "User ID"
        // ✅ ФИЛЬТРУЕМ отмененные заказы на уровне БД
        params.where = `(User ID,eq,${userId})~and(Order Status,neq,cancelled)`;
    } else {
        // ✅ Если userId не указан, все равно фильтруем отмененные заказы
        params.where = `(Order Status,neq,cancelled)`;
    }
    const response = await nocoFetch("Orders", params);
    console.log(`📦 fetchOrders: получено ${response.list?.length || 0} заказов из БД (userId=${userId || 'all'})`);
    // Нормализуем каждый заказ (Title Case → snake_case)
    const normalizedOrders = (response.list || []).map((rawOrder)=>({
            ...rawOrder,
            Id: rawOrder.Id || rawOrder.id || 0,
            user_id: rawOrder.user_id ?? rawOrder["User ID"],
            "User ID": rawOrder["User ID"] ?? rawOrder.user_id,
            order_number: rawOrder.order_number ?? rawOrder["Order Number"] ?? "",
            "Order Number": rawOrder["Order Number"] ?? rawOrder.order_number ?? "",
            start_date: rawOrder.start_date ?? rawOrder["Start Date"] ?? "",
            "Start Date": rawOrder["Start Date"] ?? rawOrder.start_date ?? "",
            delivery_time: rawOrder.delivery_time ?? rawOrder["Delivery Time"] ?? "",
            "Delivery Time": rawOrder["Delivery Time"] ?? rawOrder.delivery_time ?? "",
            payment_status: rawOrder.payment_status ?? rawOrder["Payment Status"] ?? "pending",
            "Payment Status": rawOrder["Payment Status"] ?? rawOrder.payment_status ?? "pending",
            payment_method: rawOrder.payment_method ?? rawOrder["Payment Method"] ?? "cash",
            "Payment Method": rawOrder["Payment Method"] ?? rawOrder.payment_method ?? "cash",
            paid: rawOrder.paid !== undefined ? rawOrder.paid : rawOrder["Paid"] === true || rawOrder["Paid"] === "True",
            Paid: rawOrder["Paid"] !== undefined ? rawOrder["Paid"] : rawOrder.paid,
            paid_at: rawOrder.paid_at ?? rawOrder["Paid At"],
            "Paid At": rawOrder["Paid At"] ?? rawOrder.paid_at,
            payment_id: rawOrder.payment_id ?? rawOrder["Payment ID"],
            "Payment ID": rawOrder["Payment ID"] ?? rawOrder.payment_id,
            order_status: rawOrder.order_status ?? rawOrder["Order Status"] ?? "pending",
            "Order Status": rawOrder["Order Status"] ?? rawOrder.order_status ?? "pending",
            promo_code: rawOrder.promo_code ?? rawOrder["Promo Code"],
            "Promo Code": rawOrder["Promo Code"] ?? rawOrder.promo_code,
            promo_discount: rawOrder.promo_discount ?? rawOrder["Promo Discount"],
            "Promo Discount": rawOrder["Promo Discount"] ?? rawOrder.promo_discount,
            loyalty_points_used: rawOrder.loyalty_points_used ?? rawOrder["Loyalty Points Used"] ?? 0,
            "Loyalty Points Used": rawOrder["Loyalty Points Used"] ?? rawOrder.loyalty_points_used ?? 0,
            loyalty_points_earned: rawOrder.loyalty_points_earned ?? rawOrder["Loyalty Points Earned"] ?? 0,
            "Loyalty Points Earned": rawOrder["Loyalty Points Earned"] ?? rawOrder.loyalty_points_earned ?? 0,
            subtotal: rawOrder.subtotal ?? rawOrder.Subtotal ?? 0,
            Subtotal: rawOrder.Subtotal ?? rawOrder.subtotal ?? 0,
            total: rawOrder.total ?? rawOrder.Total ?? 0,
            Total: rawOrder.Total ?? rawOrder.total ?? 0,
            guest_phone: rawOrder.guest_phone ?? rawOrder["Guest Phone"],
            "Guest Phone": rawOrder["Guest Phone"] ?? rawOrder.guest_phone,
            guest_address: rawOrder.guest_address ?? rawOrder["Guest Address"],
            "Guest Address": rawOrder["Guest Address"] ?? rawOrder.guest_address,
            created_at: rawOrder.created_at ?? rawOrder["Created At"] ?? "",
            "Created At": rawOrder["Created At"] ?? rawOrder.created_at ?? "",
            updated_at: rawOrder.updated_at ?? rawOrder["Updated At"] ?? "",
            "Updated At": rawOrder["Updated At"] ?? rawOrder.updated_at ?? ""
        }));
    return normalizedOrders;
}
async function fetchOrdersByUser(userId) {
    return fetchOrders(userId);
}
async function fetchOrdersWithDetails(userId, noCache = true) {
    // ✅ По умолчанию БЕЗ кэша для актуальных данных
    const params = {
        limit: "1000",
        sort: "-Start Date"
    };
    params.where = `(User ID,eq,${userId})~and(Order Status,neq,cancelled)`;
    const fetchFn = noCache ? nocoFetchNoCache : nocoFetch;
    const response = await fetchFn("Orders", params);
    const orders = response.list || [];
    console.log(`📦 Загрузка деталей для ${orders.length} заказов пользователя ${userId} (noCache=${noCache})...`);
    // Загружаем детали для каждого заказа параллельно
    const ordersWithDetails = await Promise.all(orders.map(async (order)=>{
        try {
            // Загружаем persons и extras
            const [dbPersons, dbExtras] = await Promise.all([
                fetchOrderPersons(order.Id),
                fetchOrderExtras(order.Id)
            ]);
            // Для каждого person загружаем meals и преобразуем в формат Person
            const persons = await Promise.all(dbPersons.map(async (dbPerson)=>{
                const dbMeals = await fetchOrderMeals(dbPerson.Id || dbPerson.id);
                // Создаем пустую структуру day1 и day2
                const day1 = {
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
                };
                const day2 = {
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
                };
                // ✅ Используем СОХРАНЕННЫЕ данные из Order_Meals (не загружаем заново из Meals!)
                await Promise.all(dbMeals.map(async (dbMeal)=>{
                    const mealId = dbMeal.meal_id || dbMeal["Meal ID"];
                    if (!mealId) return;
                    // Загружаем базовую информацию о блюде (название, категория)
                    const meal = await fetchMealById(mealId);
                    if (!meal) return;
                    const day = dbMeal.day || dbMeal.Day;
                    const mealTime = dbMeal.meal_time || dbMeal["Meal Time"];
                    const mealType = dbMeal.meal_type || dbMeal["Meal Type"];
                    const portionSize = dbMeal.portion_size || dbMeal["Portion Size"] || "single";
                    // ✅ ИСПОЛЬЗУЕМ СОХРАНЕННУЮ ЦЕНУ из Order_Meals (уже округленную!)
                    const savedPrice = dbMeal.price || dbMeal.Price || 0;
                    // ✅ ЗАМЕНЯЕМ цены в prices на округленные из Order_Meals!
                    const roundedPrices = {
                        single: portionSize === 'single' ? savedPrice : meal.prices?.single ? Math.round(meal.prices.single) : 0,
                        medium: portionSize === 'medium' ? savedPrice : meal.prices?.medium ? Math.round(meal.prices.medium) : undefined,
                        large: portionSize === 'large' ? savedPrice : meal.prices?.large ? Math.round(meal.prices.large) : undefined
                    };
                    // ✅ Обрабатываем гарнир если есть
                    let garnishObject = null;
                    const garnishId = dbMeal.garnish_id || dbMeal["Garnish ID"];
                    if (garnishId) {
                        const garnish = await fetchMealById(garnishId);
                        if (garnish) {
                            const garnishPortion = dbMeal.garnish_portion_size || dbMeal["Garnish Portion Size"] || "single";
                            const savedGarnishPrice = dbMeal.garnish_price || dbMeal["Garnish Price"] || 0;
                            const roundedGarnishPrices = {
                                single: garnishPortion === 'single' ? savedGarnishPrice : garnish.prices?.single ? Math.round(garnish.prices.single) : 0,
                                medium: garnishPortion === 'medium' ? savedGarnishPrice : garnish.prices?.medium ? Math.round(garnish.prices.medium) : undefined,
                                large: garnishPortion === 'large' ? savedGarnishPrice : garnish.prices?.large ? Math.round(garnish.prices.large) : undefined
                            };
                            garnishObject = {
                                id: garnish.Id,
                                name: garnish.name || garnish.Name || "",
                                price: savedGarnishPrice,
                                prices: roundedGarnishPrices,
                                weights: garnish.weights,
                                portion: garnishPortion,
                                category: garnish.category || garnish.Category || ""
                            };
                        }
                    }
                    // Формируем объект блюда
                    const mealObject = {
                        id: meal.Id,
                        name: meal.name || meal.Name || "",
                        price: savedPrice,
                        prices: roundedPrices,
                        weights: meal.weights,
                        portion: portionSize,
                        category: meal.category || meal.Category || "",
                        garnish: garnishObject
                    };
                    // Размещаем блюдо в правильный слот
                    const dayObj = day === "day1" ? day1 : day2;
                    if (mealTime === "breakfast" && mealType === "dish") {
                        dayObj.breakfast.dish = mealObject;
                    } else if (mealTime === "lunch") {
                        if (mealType === "salad") dayObj.lunch.salad = mealObject;
                        else if (mealType === "soup") dayObj.lunch.soup = mealObject;
                        else if (mealType === "main") dayObj.lunch.main = mealObject;
                    } else if (mealTime === "dinner") {
                        if (mealType === "salad") dayObj.dinner.salad = mealObject;
                        else if (mealType === "soup") dayObj.dinner.soup = mealObject;
                        else if (mealType === "main") dayObj.dinner.main = mealObject;
                    }
                }));
                return {
                    id: dbPerson.Id || dbPerson.id,
                    day1,
                    day2
                };
            }));
            // Преобразуем extras в формат Extra[]
            const extras = await Promise.all(dbExtras.map(async (dbExtra)=>{
                const extraId = dbExtra.extra_id || dbExtra["Extra ID"];
                if (!extraId) return null;
                // Загружаем базовую информацию (название) из таблицы Extras
                const extraResponse = await nocoFetch("Extras", {
                    where: `(Id,eq,${extraId})`
                });
                const extraData = extraResponse.list?.[0];
                if (!extraData) return null;
                // ✅ ИСПОЛЬЗУЕМ СОХРАНЕННУЮ ЦЕНУ из Order_Extras (уже округленную!)
                const savedPrice = dbExtra.price || dbExtra.Price || 0;
                return {
                    id: extraData.Id,
                    name: extraData.name || extraData.Name || "",
                    price: savedPrice,
                    quantity: parseInt(String(dbExtra.quantity || dbExtra.Quantity || 1))
                };
            }));
            // ✅ ИСПРАВЛЕНИЕ: Пересчитываем total из Order_Meals, если в БД он равен 0
            let calculatedTotal = order.total || order.Total || 0;
            let calculatedSubtotal = order.subtotal || order.Subtotal || 0;
            // Если total === 0 (баг от старой версии кода), пересчитываем из цен
            if (calculatedTotal === 0 && (persons.length > 0 || extras.filter((e)=>e !== null).length > 0)) {
                console.log(`🔧 [fetchOrdersWithDetails] Заказ ${order.Id}: total=0, пересчитываем из цен...`);
                // Считаем стоимость всех блюд
                persons.forEach((person)=>{
                    [
                        'day1',
                        'day2'
                    ].forEach((day)=>{
                        const dayMeals = person[day];
                        // Завтрак
                        if (dayMeals?.breakfast?.dish?.price) {
                            calculatedTotal += dayMeals.breakfast.dish.price;
                            if (dayMeals.breakfast.dish.garnish?.price) {
                                calculatedTotal += dayMeals.breakfast.dish.garnish.price;
                            }
                        }
                        // Обед
                        if (dayMeals?.lunch?.salad?.price) calculatedTotal += dayMeals.lunch.salad.price;
                        if (dayMeals?.lunch?.salad?.garnish?.price) calculatedTotal += dayMeals.lunch.salad.garnish.price;
                        if (dayMeals?.lunch?.soup?.price) calculatedTotal += dayMeals.lunch.soup.price;
                        if (dayMeals?.lunch?.soup?.garnish?.price) calculatedTotal += dayMeals.lunch.soup.garnish.price;
                        if (dayMeals?.lunch?.main?.price) calculatedTotal += dayMeals.lunch.main.price;
                        if (dayMeals?.lunch?.main?.garnish?.price) calculatedTotal += dayMeals.lunch.main.garnish.price;
                        // Ужин
                        if (dayMeals?.dinner?.salad?.price) calculatedTotal += dayMeals.dinner.salad.price;
                        if (dayMeals?.dinner?.salad?.garnish?.price) calculatedTotal += dayMeals.dinner.salad.garnish.price;
                        if (dayMeals?.dinner?.soup?.price) calculatedTotal += dayMeals.dinner.soup.price;
                        if (dayMeals?.dinner?.soup?.garnish?.price) calculatedTotal += dayMeals.dinner.soup.garnish.price;
                        if (dayMeals?.dinner?.main?.price) calculatedTotal += dayMeals.dinner.main.price;
                        if (dayMeals?.dinner?.main?.garnish?.price) calculatedTotal += dayMeals.dinner.main.garnish.price;
                    });
                });
                // Считаем стоимость extras
                extras.filter((e)=>e !== null).forEach((extra)=>{
                    calculatedTotal += (extra.price || 0) * (extra.quantity || 1);
                });
                calculatedSubtotal = calculatedTotal;
                console.log(`✅ [fetchOrdersWithDetails] Заказ ${order.Id}: пересчитан total=${calculatedTotal}`);
            }
            // ✅ Маппим поля NocoDB в формат приложения
            return {
                id: order.Id,
                orderNumber: order.order_number || order["Order Number"],
                startDate: order.start_date || order["Start Date"],
                deliveryTime: order.delivery_time || order["Delivery Time"] || "",
                paymentMethod: order.payment_method || order["Payment Method"] || "cash",
                paid: order.paid ?? order.Paid ?? false,
                paidAt: order.paid_at || order["Paid At"],
                paymentStatus: order.payment_status || order["Payment Status"] || "pending",
                orderStatus: order.order_status || order["Order Status"] || "pending",
                total: calculatedTotal,
                subtotal: calculatedSubtotal,
                deliveryFee: order.delivery_fee || order["Delivery Fee"] || 0,
                deliveryDistrict: order.delivery_district || order["Delivery District"],
                deliveryAddress: order.delivery_address || order["Delivery Address"],
                loyaltyPointsUsed: order.loyalty_points_used || order["Loyalty Points Used"] || 0,
                loyaltyPointsEarned: order.loyalty_points_earned || order["Loyalty Points Earned"] || 0,
                persons,
                extras: extras.filter((e)=>e !== null)
            };
        } catch (error) {
            console.error(`❌ Ошибка загрузки деталей заказа ${order.Id}:`, error);
            return {
                id: order.Id,
                orderNumber: order.order_number || order["Order Number"],
                startDate: order.start_date || order["Start Date"],
                deliveryTime: order.delivery_time || order["Delivery Time"] || "",
                paymentMethod: order.payment_method || order["Payment Method"] || "cash",
                paid: order.paid ?? order.Paid ?? false,
                paidAt: order.paid_at || order["Paid At"],
                paymentStatus: order.payment_status || order["Payment Status"] || "pending",
                orderStatus: order.order_status || order["Order Status"] || "pending",
                total: order.total || order.Total || 0,
                subtotal: order.subtotal || order.Subtotal || 0,
                deliveryFee: order.delivery_fee || order["Delivery Fee"] || 0,
                deliveryDistrict: order.delivery_district || order["Delivery District"],
                deliveryAddress: order.delivery_address || order["Delivery Address"],
                loyaltyPointsUsed: order.loyalty_points_used || order["Loyalty Points Used"] || 0,
                loyaltyPointsEarned: order.loyalty_points_earned || order["Loyalty Points Earned"] || 0,
                persons: [],
                extras: []
            };
        }
    }));
    console.log(`✅ Загружены детали для ${ordersWithDetails.length} заказов`);
    return ordersWithDetails;
}
function generateOrderNumber() {
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${date}-${random}`;
}
async function fetchOrderById(id, noCache = false) {
    const fetchFn = noCache ? nocoFetchNoCache : nocoFetch;
    const response = await fetchFn("Orders", {
        where: `(Id,eq,${id})`
    });
    const rawOrder = response.list?.[0];
    if (!rawOrder) return null;
    console.log(`🔍 fetchOrderById(${id}, noCache=${noCache}) raw data:`, {
        'Loyalty Points Earned': rawOrder["Loyalty Points Earned"],
        'loyalty_points_earned': rawOrder.loyalty_points_earned,
        'Total': rawOrder.Total,
        'total': rawOrder.total
    });
    // Преобразуем данные из формата API (с заголовками колонок) в формат NocoDBOrder
    // Поддерживаем оба варианта: column_name (snake_case) и title (с заглавными буквами)
    return {
        ...rawOrder,
        Id: rawOrder.Id || rawOrder.id || 0,
        user_id: rawOrder.user_id ?? rawOrder["User ID"],
        "User ID": rawOrder["User ID"] ?? rawOrder.user_id,
        order_number: rawOrder.order_number ?? rawOrder["Order Number"] ?? "",
        "Order Number": rawOrder["Order Number"] ?? rawOrder.order_number ?? "",
        start_date: rawOrder.start_date ?? rawOrder["Start Date"] ?? "",
        "Start Date": rawOrder["Start Date"] ?? rawOrder.start_date ?? "",
        delivery_time: rawOrder.delivery_time ?? rawOrder["Delivery Time"] ?? "",
        "Delivery Time": rawOrder["Delivery Time"] ?? rawOrder.delivery_time ?? "",
        payment_status: rawOrder.payment_status ?? rawOrder["Payment Status"] ?? "pending",
        "Payment Status": rawOrder["Payment Status"] ?? rawOrder.payment_status ?? "pending",
        payment_method: rawOrder.payment_method ?? rawOrder["Payment Method"] ?? "cash",
        "Payment Method": rawOrder["Payment Method"] ?? rawOrder.payment_method ?? "cash",
        paid: rawOrder.paid !== undefined ? rawOrder.paid : rawOrder["Paid"] === true || rawOrder["Paid"] === "True",
        Paid: rawOrder["Paid"] !== undefined ? rawOrder["Paid"] : rawOrder.paid,
        paid_at: rawOrder.paid_at ?? rawOrder["Paid At"],
        "Paid At": rawOrder["Paid At"] ?? rawOrder.paid_at,
        payment_id: rawOrder.payment_id ?? rawOrder["Payment ID"],
        "Payment ID": rawOrder["Payment ID"] ?? rawOrder.payment_id,
        order_status: rawOrder.order_status ?? rawOrder["Order Status"] ?? "pending",
        "Order Status": rawOrder["Order Status"] ?? rawOrder.order_status ?? "pending",
        promo_code: rawOrder.promo_code ?? rawOrder["Promo Code"],
        "Promo Code": rawOrder["Promo Code"] ?? rawOrder.promo_code,
        promo_discount: rawOrder.promo_discount ?? rawOrder["Promo Discount"],
        "Promo Discount": rawOrder["Promo Discount"] ?? rawOrder.promo_discount,
        loyalty_points_used: rawOrder.loyalty_points_used ?? rawOrder["Loyalty Points Used"] ?? 0,
        "Loyalty Points Used": rawOrder["Loyalty Points Used"] ?? rawOrder.loyalty_points_used ?? 0,
        loyalty_points_earned: rawOrder.loyalty_points_earned ?? rawOrder["Loyalty Points Earned"] ?? 0,
        "Loyalty Points Earned": rawOrder["Loyalty Points Earned"] ?? rawOrder.loyalty_points_earned ?? 0,
        subtotal: rawOrder.subtotal ?? rawOrder.Subtotal ?? 0,
        Subtotal: rawOrder.Subtotal ?? rawOrder.subtotal ?? 0,
        total: rawOrder.total ?? rawOrder.Total ?? 0,
        Total: rawOrder.Total ?? rawOrder.total ?? 0,
        guest_phone: rawOrder.guest_phone ?? rawOrder["Guest Phone"],
        "Guest Phone": rawOrder["Guest Phone"] ?? rawOrder.guest_phone,
        guest_address: rawOrder.guest_address ?? rawOrder["Guest Address"],
        "Guest Address": rawOrder["Guest Address"] ?? rawOrder.guest_address,
        created_at: rawOrder.created_at ?? rawOrder["Created At"] ?? "",
        "Created At": rawOrder["Created At"] ?? rawOrder.created_at ?? "",
        updated_at: rawOrder.updated_at ?? rawOrder["Updated At"] ?? "",
        "Updated At": rawOrder["Updated At"] ?? rawOrder.updated_at ?? ""
    };
}
async function fetchOrderByNumber(orderNumber) {
    // NocoDB API v2 использует заголовки колонок в where-условиях
    // В таблице Orders колонка order_number имеет заголовок "Order Number"
    const response = await nocoFetch("Orders", {
        where: `(Order Number,eq,${orderNumber})`
    });
    const rawOrder = response.list?.[0];
    if (!rawOrder) return null;
    // Преобразуем данные из формата API (с заголовками колонок) в формат NocoDBOrder
    // Поддерживаем оба варианта: column_name (snake_case) и title (с заглавными буквами)
    return {
        ...rawOrder,
        Id: rawOrder.Id || rawOrder.id || 0,
        user_id: rawOrder.user_id ?? rawOrder["User ID"],
        "User ID": rawOrder["User ID"] ?? rawOrder.user_id,
        order_number: rawOrder.order_number ?? rawOrder["Order Number"] ?? "",
        "Order Number": rawOrder["Order Number"] ?? rawOrder.order_number ?? "",
        start_date: rawOrder.start_date ?? rawOrder["Start Date"] ?? "",
        "Start Date": rawOrder["Start Date"] ?? rawOrder.start_date ?? "",
        delivery_time: rawOrder.delivery_time ?? rawOrder["Delivery Time"] ?? "",
        "Delivery Time": rawOrder["Delivery Time"] ?? rawOrder.delivery_time ?? "",
        payment_status: rawOrder.payment_status ?? rawOrder["Payment Status"] ?? "pending",
        "Payment Status": rawOrder["Payment Status"] ?? rawOrder.payment_status ?? "pending",
        payment_method: rawOrder.payment_method ?? rawOrder["Payment Method"] ?? "cash",
        "Payment Method": rawOrder["Payment Method"] ?? rawOrder.payment_method ?? "cash",
        paid: rawOrder.paid !== undefined ? rawOrder.paid : rawOrder["Paid"] === true || rawOrder["Paid"] === "True",
        Paid: rawOrder["Paid"] !== undefined ? rawOrder["Paid"] : rawOrder.paid,
        paid_at: rawOrder.paid_at ?? rawOrder["Paid At"],
        "Paid At": rawOrder["Paid At"] ?? rawOrder.paid_at,
        payment_id: rawOrder.payment_id ?? rawOrder["Payment ID"],
        "Payment ID": rawOrder["Payment ID"] ?? rawOrder.payment_id,
        order_status: rawOrder.order_status ?? rawOrder["Order Status"] ?? "pending",
        "Order Status": rawOrder["Order Status"] ?? rawOrder.order_status ?? "pending",
        promo_code: rawOrder.promo_code ?? rawOrder["Promo Code"],
        "Promo Code": rawOrder["Promo Code"] ?? rawOrder.promo_code,
        promo_discount: rawOrder.promo_discount ?? rawOrder["Promo Discount"],
        "Promo Discount": rawOrder["Promo Discount"] ?? rawOrder.promo_discount,
        loyalty_points_used: rawOrder.loyalty_points_used ?? rawOrder["Loyalty Points Used"] ?? 0,
        "Loyalty Points Used": rawOrder["Loyalty Points Used"] ?? rawOrder.loyalty_points_used ?? 0,
        loyalty_points_earned: rawOrder.loyalty_points_earned ?? rawOrder["Loyalty Points Earned"] ?? 0,
        "Loyalty Points Earned": rawOrder["Loyalty Points Earned"] ?? rawOrder.loyalty_points_earned ?? 0,
        subtotal: rawOrder.subtotal ?? rawOrder.Subtotal ?? 0,
        Subtotal: rawOrder.Subtotal ?? rawOrder.subtotal ?? 0,
        total: rawOrder.total ?? rawOrder.Total ?? 0,
        Total: rawOrder.Total ?? rawOrder.total ?? 0,
        guest_phone: rawOrder.guest_phone ?? rawOrder["Guest Phone"],
        "Guest Phone": rawOrder["Guest Phone"] ?? rawOrder.guest_phone,
        guest_address: rawOrder.guest_address ?? rawOrder["Guest Address"],
        "Guest Address": rawOrder["Guest Address"] ?? rawOrder.guest_address,
        created_at: rawOrder.created_at ?? rawOrder["Created At"] ?? "",
        "Created At": rawOrder["Created At"] ?? rawOrder.created_at ?? "",
        updated_at: rawOrder.updated_at ?? rawOrder["Updated At"] ?? "",
        "Updated At": rawOrder["Updated At"] ?? rawOrder.updated_at ?? ""
    };
}
async function createOrder(order) {
    // На сервере используем прямой запрос к NocoDB, на клиенте - через proxy
    const apiBaseUrl = getApiBaseUrl();
    console.log(`📝 createOrder - входные данные:`, {
        order,
        keys: Object.keys(order),
        user_id: order.user_id,
        'User ID': order["User ID"]
    });
    // Маппинг полей: используем Title Case для NocoDB API
    // Включаем только ненулевые значения
    const mappedOrder = {};
    const userId = order.user_id ?? order["User ID"];
    if (userId !== undefined && userId !== null) mappedOrder["User ID"] = userId;
    const orderNumber = order.order_number ?? order["Order Number"];
    if (orderNumber !== undefined && orderNumber !== null) mappedOrder["Order Number"] = orderNumber;
    const startDate = order.start_date ?? order["Start Date"];
    if (startDate !== undefined && startDate !== null) mappedOrder["Start Date"] = startDate;
    const deliveryTime = order.delivery_time ?? order["Delivery Time"];
    if (deliveryTime !== undefined && deliveryTime !== null) mappedOrder["Delivery Time"] = deliveryTime;
    const paymentStatus = order.payment_status ?? order["Payment Status"];
    if (paymentStatus !== undefined && paymentStatus !== null) mappedOrder["Payment Status"] = paymentStatus;
    const paymentMethod = order.payment_method ?? order["Payment Method"];
    if (paymentMethod !== undefined && paymentMethod !== null) mappedOrder["Payment Method"] = paymentMethod;
    mappedOrder["Paid"] = order.paid ?? order.Paid ?? false;
    const paidAt = order.paid_at ?? order["Paid At"];
    if (paidAt !== undefined && paidAt !== null) mappedOrder["Paid At"] = paidAt;
    const paymentId = order.payment_id ?? order["Payment ID"];
    if (paymentId !== undefined && paymentId !== null) mappedOrder["Payment ID"] = paymentId;
    mappedOrder["Order Status"] = order.order_status ?? order["Order Status"] ?? "pending";
    const promoCode = order.promo_code ?? order["Promo Code"];
    if (promoCode !== undefined && promoCode !== null) mappedOrder["Promo Code"] = promoCode;
    const promoDiscount = order.promo_discount ?? order["Promo Discount"];
    if (promoDiscount !== undefined && promoDiscount !== null) mappedOrder["Promo Discount"] = promoDiscount;
    mappedOrder["Loyalty Points Used"] = order.loyalty_points_used ?? order["Loyalty Points Used"] ?? 0;
    mappedOrder["Loyalty Points Earned"] = order.loyalty_points_earned ?? order["Loyalty Points Earned"] ?? 0;
    mappedOrder["Subtotal"] = order.subtotal ?? order.Subtotal ?? 0;
    mappedOrder["Total"] = order.total ?? order.Total ?? 0;
    const guestPhone = order.guest_phone ?? order["Guest Phone"];
    if (guestPhone !== undefined && guestPhone !== null) mappedOrder["Guest Phone"] = guestPhone;
    const guestAddress = order.guest_address ?? order["Guest Address"];
    if (guestAddress !== undefined && guestAddress !== null) mappedOrder["Guest Address"] = guestAddress;
    // Добавляем created_at и updated_at если они есть
    const createdAt = order.created_at ?? order["Created At"];
    if (createdAt !== undefined && createdAt !== null) mappedOrder["Created At"] = createdAt;
    const updatedAt = order.updated_at ?? order["Updated At"];
    if (updatedAt !== undefined && updatedAt !== null) mappedOrder["Updated At"] = updatedAt;
    console.log(`📝 createOrder - маппированные данные:`, {
        mappedOrder,
        keys: Object.keys(mappedOrder),
        hasUserId: 'User ID' in mappedOrder,
        hasOrderNumber: 'Order Number' in mappedOrder,
        hasStartDate: 'Start Date' in mappedOrder
    });
    let createdOrder;
    if (apiBaseUrl === null) {
        // Серверная среда - прямой запрос к NocoDB
        createdOrder = await serverCreateRecord("Orders", mappedOrder, "POST");
    } else {
        // Клиентская среда - через API proxy
        const response = await clientFetch("Orders", {}, {
            method: "POST",
            body: JSON.stringify(mappedOrder)
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
        // Проверяем, есть ли уже все нужные поля (поддерживаем оба варианта названий)
        const orderNumber = createdOrder.order_number ?? createdOrder["Order Number"];
        if (!orderNumber || Object.keys(createdOrder).length < 5) {
            console.log(`⚠️ Order created but incomplete response, fetching full order ${createdOrder.Id}...`);
            try {
                // Небольшая задержка, чтобы запись точно сохранилась
                await new Promise((resolve)=>setTimeout(resolve, 300));
                const fullOrder = await fetchOrderById(createdOrder.Id);
                const fullOrderNumber = fullOrder?.order_number ?? fullOrder?.["Order Number"];
                if (fullOrder && fullOrderNumber) {
                    console.log(`✅ Fetched full order with order_number: ${fullOrderNumber}`);
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
    console.log(`📝 updateOrder(${id}):`, {
        data,
        hasLoyaltyPointsEarned: 'loyalty_points_earned' in data,
        loyaltyPointsEarnedValue: data.loyalty_points_earned
    });
    // Маппинг полей: используем Title Case для NocoDB API
    const mappedData = {};
    if (data.user_id !== undefined || data["User ID"] !== undefined) {
        mappedData["User ID"] = data.user_id ?? data["User ID"];
    }
    if (data.order_number !== undefined || data["Order Number"] !== undefined) {
        mappedData["Order Number"] = data.order_number ?? data["Order Number"];
    }
    if (data.start_date !== undefined || data["Start Date"] !== undefined) {
        mappedData["Start Date"] = data.start_date ?? data["Start Date"];
    }
    if (data.delivery_time !== undefined || data["Delivery Time"] !== undefined) {
        mappedData["Delivery Time"] = data.delivery_time ?? data["Delivery Time"];
    }
    if (data.payment_status !== undefined || data["Payment Status"] !== undefined) {
        mappedData["Payment Status"] = data.payment_status ?? data["Payment Status"];
    }
    if (data.payment_method !== undefined || data["Payment Method"] !== undefined) {
        mappedData["Payment Method"] = data.payment_method ?? data["Payment Method"];
    }
    if (data.paid !== undefined || data.Paid !== undefined) {
        mappedData["Paid"] = data.paid ?? data.Paid;
    }
    if (data.paid_at !== undefined || data["Paid At"] !== undefined) {
        mappedData["Paid At"] = data.paid_at ?? data["Paid At"];
    }
    if (data.payment_id !== undefined || data["Payment ID"] !== undefined) {
        mappedData["Payment ID"] = data.payment_id ?? data["Payment ID"];
    }
    if (data.order_status !== undefined || data["Order Status"] !== undefined) {
        mappedData["Order Status"] = data.order_status ?? data["Order Status"];
    }
    if (data.promo_code !== undefined || data["Promo Code"] !== undefined) {
        mappedData["Promo Code"] = data.promo_code ?? data["Promo Code"];
    }
    if (data.promo_discount !== undefined || data["Promo Discount"] !== undefined) {
        mappedData["Promo Discount"] = data.promo_discount ?? data["Promo Discount"];
    }
    if (data.loyalty_points_used !== undefined || data["Loyalty Points Used"] !== undefined) {
        mappedData["Loyalty Points Used"] = data.loyalty_points_used ?? data["Loyalty Points Used"];
    }
    if (data.loyalty_points_earned !== undefined || data["Loyalty Points Earned"] !== undefined) {
        mappedData["Loyalty Points Earned"] = data.loyalty_points_earned ?? data["Loyalty Points Earned"];
    }
    if (data.subtotal !== undefined || data.Subtotal !== undefined) {
        mappedData["Subtotal"] = data.subtotal ?? data.Subtotal;
    }
    if (data.total !== undefined || data.Total !== undefined) {
        mappedData["Total"] = data.total ?? data.Total;
    }
    // 🆕 ПОЛЯ ДОСТАВКИ
    if (data.delivery_fee !== undefined || data["Delivery Fee"] !== undefined) {
        mappedData["Delivery Fee"] = data.delivery_fee ?? data["Delivery Fee"];
    }
    if (data.delivery_district !== undefined || data["Delivery District"] !== undefined) {
        mappedData["Delivery District"] = data.delivery_district ?? data["Delivery District"];
    }
    if (data.delivery_address !== undefined || data["Delivery Address"] !== undefined) {
        mappedData["Delivery Address"] = data.delivery_address ?? data["Delivery Address"];
    }
    if (data.guest_phone !== undefined || data["Guest Phone"] !== undefined) {
        mappedData["Guest Phone"] = data.guest_phone ?? data["Guest Phone"];
    }
    if (data.guest_address !== undefined || data["Guest Address"] !== undefined) {
        mappedData["Guest Address"] = data.guest_address ?? data["Guest Address"];
    }
    if (data.updated_at !== undefined || data["Updated At"] !== undefined) {
        mappedData["Updated At"] = data.updated_at ?? data["Updated At"];
    }
    console.log(`📝 updateOrder(${id}) - маппированные данные:`, {
        mappedData,
        hasLoyaltyPointsEarned: 'Loyalty Points Earned' in mappedData,
        loyaltyPointsEarnedValue: mappedData["Loyalty Points Earned"]
    });
    if (apiBaseUrl === null) {
        // Серверная среда - прямой запрос к NocoDB
        const result = await serverCreateRecord("Orders", mappedData, "PATCH", id);
        console.log(`✅ updateOrder(${id}) result:`, {
            Id: result.Id,
            loyalty_points_earned: result.loyalty_points_earned,
            'Loyalty Points Earned': result['Loyalty Points Earned']
        });
        return result;
    } else {
        // Клиентская среда - через API proxy
        const response = await clientFetch(`Orders/${id}`, {}, {
            method: "PATCH",
            body: JSON.stringify(mappedData)
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
    // NocoDB API v2 использует заголовки колонок в where-условиях
    // В таблице Order_Persons колонка order_id имеет заголовок "Order ID"
    const response = await nocoFetch("Order_Persons", {
        where: `(Order ID,eq,${orderId})`
    });
    return response.list || [];
}
async function fetchOrderMeals(orderPersonId) {
    // NocoDB API v2 использует заголовки колонок в where-условиях
    // В таблице Order_Meals колонка order_person_id имеет заголовок "Order Person ID"
    const response = await nocoFetch("Order_Meals", {
        where: `(Order Person ID,eq,${orderPersonId})`
    });
    return response.list || [];
}
async function fetchOrderExtras(orderId) {
    // NocoDB API v2 использует заголовки колонок в where-условиях
    // В таблице Order_Extras колонка order_id имеет заголовок "Order ID"
    const response = await nocoFetch("Order_Extras", {
        where: `(Order ID,eq,${orderId})`
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
    // NocoDB API v2 использует заголовки колонок в where-условиях
    // В таблице Promo_Codes колонки code и active имеют заголовки "Code" и "Active"
    const response = await nocoFetch("Promo_Codes", {
        where: `(Code,eq,${code})~and(Active,eq,true)`
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
    // NocoDB API v2 использует заголовки колонок в where-условиях
    // В таблице Reviews колонка user_id имеет заголовок "User ID"
    const response = await nocoFetch("Reviews", {
        where: `(User ID,eq,${userId})`
    });
    return response.list || [];
}
async function createReview(review) {
    const apiBaseUrl = getApiBaseUrl();
    // Добавляем created_at и updated_at, если они не переданы
    const now = new Date().toISOString();
    const reviewData = {
        ...review,
        created_at: review.created_at || now,
        updated_at: review.updated_at || now
    };
    if (apiBaseUrl === null) {
        return serverCreateRecord("Reviews", reviewData, "POST");
    } else {
        const response = await clientFetch("Reviews", {}, {
            method: "POST",
            body: JSON.stringify(reviewData)
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
async function createLoyaltyPointsTransaction(transaction) {
    const apiBaseUrl = getApiBaseUrl();
    // Добавляем created_at и updated_at, если они не переданы
    const now = new Date().toISOString();
    // Маппинг полей: snake_case -> Title Case для NocoDB
    const transactionData = {
        "User ID": transaction.user_id,
        "Order ID": transaction.order_id,
        "Transaction Type": transaction.transaction_type,
        "Transaction Status": transaction.transaction_status,
        "Points": transaction.points,
        "Points Amount": transaction.points,
        "Description": transaction.description,
        "Created At": transaction.created_at || now,
        "Updated At": transaction.updated_at || now,
        "Processed At": transaction.processed_at
    };
    console.log(`📝 createLoyaltyPointsTransaction: отправка данных:`, {
        table: "Loyalty_Points_Transactions",
        data: transactionData,
        apiBaseUrl: apiBaseUrl || "server-side"
    });
    try {
        let result;
        if (apiBaseUrl === null) {
            console.log(`📤 Создание транзакции через serverCreateRecord`);
            result = await serverCreateRecord("Loyalty_Points_Transactions", transactionData, "POST");
        } else {
            console.log(`📤 Создание транзакции через clientFetch`);
            const response = await clientFetch("Loyalty_Points_Transactions", {}, {
                method: "POST",
                body: JSON.stringify(transactionData)
            });
            console.log(`📥 Ответ от clientFetch:`, response);
            if (Array.isArray(response)) {
                result = response[0];
            } else if (response && typeof response === 'object' && 'Id' in response) {
                result = response;
            } else if (response && typeof response === 'object' && 'record' in response) {
                result = response.record;
            } else {
                result = response;
            }
        }
        console.log(`✅ Транзакция успешно создана:`, result);
        return result;
    } catch (error) {
        console.error(`❌ Ошибка при создании транзакции:`, error);
        throw error;
    }
}
async function fetchLoyaltyPointsTransactions(userId) {
    // NocoDB API v2 использует заголовки колонок в where-условиях
    // В таблице Loyalty_Points_Transactions колонка user_id имеет заголовок "User ID"
    const response = await nocoFetch("Loyalty_Points_Transactions", {
        where: `(User ID,eq,${userId})`,
        sort: "-created_at",
        limit: "1000"
    });
    return response.list || [];
}
async function fetchPendingTransactionsByOrder(orderId) {
    // Получаем pending транзакции для конкретного заказа
    // NocoDB требует Title имена в where-запросах
    const response = await nocoFetch("Loyalty_Points_Transactions", {
        where: `(Order ID,eq,${orderId})~and(Transaction Status,eq,pending)`,
        limit: "1000"
    });
    // Нормализуем данные - NocoDB может возвращать title поля
    const transactions = (response.list || []).map((t)=>({
            Id: t.Id || t.id,
            user_id: t.user_id || t["User ID"] || t["user_id"],
            order_id: t.order_id || t["Order ID"] || t["order_id"],
            transaction_type: t.transaction_type || t["Transaction Type"] || t["transaction_type"],
            transaction_status: t.transaction_status || t["Transaction Status"] || t["transaction_status"],
            points: t.points || t["Points"] || t["points"] || 0,
            description: t.description || t["Description"] || t["description"],
            created_at: t.created_at || t["Created At"] || t["created_at"],
            updated_at: t.updated_at || t["Updated At"] || t["updated_at"],
            processed_at: t.processed_at || t["Processed At"] || t["processed_at"]
        }));
    console.log(`🔍 fetchPendingTransactionsByOrder(${orderId}): найдено ${transactions.length} транзакций`, transactions.map((t)=>({
            Id: t.Id,
            points: t.points,
            type: t.transaction_type,
            status: t.transaction_status
        })));
    return transactions;
}
async function updateLoyaltyTransaction(transactionId, updates) {
    const apiBaseUrl = getApiBaseUrl();
    // Маппинг полей: snake_case -> Title Case для NocoDB
    const updateData = {
        "Updated At": new Date().toISOString()
    };
    if (updates.transaction_status !== undefined) {
        updateData["Transaction Status"] = updates.transaction_status;
    }
    if (updates.processed_at !== undefined) {
        updateData["Processed At"] = updates.processed_at;
    }
    if (updates.points !== undefined) {
        updateData["Points"] = updates.points;
        updateData["Points Amount"] = updates.points;
    }
    if (updates.description !== undefined) {
        updateData["Description"] = updates.description;
    }
    console.log(`📝 Обновление транзакции ${transactionId}:`, updateData);
    if (apiBaseUrl === null) {
        await serverCreateRecord("Loyalty_Points_Transactions", updateData, "PATCH", transactionId);
    } else {
        await clientFetch(`Loyalty_Points_Transactions/${transactionId}`, {}, {
            method: "PATCH",
            pathSuffix: `/${transactionId}`,
            body: JSON.stringify(updateData)
        });
    }
    console.log(`✅ Транзакция ${transactionId} успешно обновлена`);
}
async function processPendingTransactionsForOrder(orderId, userId) {
    if (!userId) {
        console.warn(`⚠️ Не указан userId для обработки pending транзакций заказа ${orderId}`);
        return 0;
    }
    console.log(`💳 Обработка pending транзакций для заказа ${orderId}, пользователь ${userId}`);
    // Получаем pending транзакции для этого заказа
    const pendingTransactions = await fetchPendingTransactionsByOrder(orderId);
    if (pendingTransactions.length === 0) {
        console.log(`ℹ️ Нет pending транзакций для заказа ${orderId}`);
        return 0;
    }
    console.log(`📊 Найдено pending транзакций: ${pendingTransactions.length}`);
    // Получаем текущего пользователя
    const user = await fetchUserById(userId);
    if (!user) {
        console.error(`❌ Пользователь ${userId} не найден`);
        return 0;
    }
    let totalPointsToAdd = 0;
    const transactionsToUpdate = [];
    // Обрабатываем каждую транзакцию
    for (const transaction of pendingTransactions){
        console.log(`🔍 Проверка транзакции ${transaction.Id}:`, {
            type: transaction.transaction_type,
            points: transaction.points,
            status: transaction.transaction_status,
            description: transaction.description
        });
        if (transaction.transaction_type === 'earned') {
            const points = typeof transaction.points === 'number' ? transaction.points : parseInt(String(transaction.points)) || 0;
            if (points > 0) {
                totalPointsToAdd += points;
                transactionsToUpdate.push(transaction.Id);
                console.log(`✅ Транзакция ${transaction.Id}: добавим ${points} баллов`);
            } else {
                console.warn(`⚠️ Транзакция ${transaction.Id}: points = ${points}, пропускаем`);
            }
        }
    }
    if (totalPointsToAdd > 0) {
        // Начисляем баллы пользователю
        const currentPoints = typeof user.loyalty_points === 'number' ? user.loyalty_points : parseInt(String(user.loyalty_points)) || 0;
        const newPoints = currentPoints + totalPointsToAdd;
        console.log(`💰 Начисление баллов:`, {
            currentPoints,
            toAdd: totalPointsToAdd,
            newPoints
        });
        await updateUser(userId, {
            loyalty_points: newPoints
        });
        // Обновляем статусы транзакций
        const now = new Date().toISOString();
        for (const transactionId of transactionsToUpdate){
            await updateLoyaltyTransaction(transactionId, {
                transaction_status: 'completed',
                processed_at: now
            });
        }
        console.log(`✅ Обработано ${transactionsToUpdate.length} транзакций, начислено ${totalPointsToAdd} баллов`);
    } else {
        console.log(`ℹ️ Нет баллов для начисления`);
    }
    return totalPointsToAdd;
}
async function createFraudAlert(userId, stats) {
    const now = new Date().toISOString();
    const apiBaseUrl = getApiBaseUrl();
    const alertData = {
        user_id: userId,
        alert_type: "excessive_cancellations",
        paid_orders_count: stats.totalPaidOrders,
        cancelled_paid_orders_count: stats.cancelledPaidOrders,
        cancellation_rate: stats.cancellationRate,
        last_incident_date: now,
        status: "active",
        created_at: now,
        updated_at: now
    };
    console.log(`🚨 Создание fraud alert для пользователя ${userId}:`, alertData);
    if (apiBaseUrl === null) {
        return await serverCreateRecord("Fraud_Alerts", alertData, "POST");
    } else {
        const response = await clientFetch("Fraud_Alerts", {}, {
            method: "POST",
            body: JSON.stringify(alertData)
        });
        if (Array.isArray(response)) {
            return response[0];
        } else if (response && typeof response === 'object' && 'Id' in response) {
            return response;
        } else if (response && typeof response === 'object' && 'record' in response) {
            return response.record;
        } else {
            return response;
        }
    }
}
async function getUserCancellationStats(userId) {
    // Получаем все оплаченные заказы пользователя
    const allOrders = await fetchOrdersByUser(userId);
    // Фильтруем только оплаченные заказы (paid=true или payment_status='paid')
    const paidOrders = allOrders.filter((order)=>{
        const isPaid = order.paid === true || order.payment_status === "paid";
        return isPaid;
    });
    // Считаем отмененные оплаченные заказы
    const cancelledPaidOrders = paidOrders.filter((order)=>{
        return order.order_status === "cancelled";
    });
    const totalPaidOrders = paidOrders.length;
    const cancelledPaidOrdersCount = cancelledPaidOrders.length;
    const cancellationRate = totalPaidOrders > 0 ? cancelledPaidOrdersCount / totalPaidOrders * 100 : 0;
    console.log(`📊 Статистика отмен для пользователя ${userId}:`, {
        totalPaidOrders,
        cancelledPaidOrders: cancelledPaidOrdersCount,
        cancellationRate: cancellationRate.toFixed(2) + '%'
    });
    return {
        totalPaidOrders,
        cancelledPaidOrders: cancelledPaidOrdersCount,
        cancellationRate
    };
}
function getMealPriceForPortion(meal, portionSize) {
    if (!meal.prices) {
        console.warn(`⚠️ Meal prices missing, returning 0`);
        return 0;
    }
    const portion = portionSize || meal.portion || "single";
    if (portion === "medium" && meal.prices.medium) return meal.prices.medium;
    if (portion === "large" && meal.prices.large) return meal.prices.large;
    return meal.prices.single;
}
async function fetchMealById(mealId) {
    try {
        const response = await serverFetch("Meals", {
            where: `(Id,eq,${mealId})`
        });
        if (response.list && response.list.length > 0) {
            const meal = response.list[0];
            // Нормализуем цены - NocoDB хранит как "Price (Single)", "Price (Medium)", "Price (Large)"
            const prices = {
                single: meal["Price (Single)"] || meal.prices?.single || 0,
                medium: meal["Price (Medium)"] || meal.prices?.medium || undefined,
                large: meal["Price (Large)"] || meal.prices?.large || undefined
            };
            // Нормализуем граммовки - NocoDB хранит как "Weight (Single)", "Weight (Medium)", "Weight (Large)"
            const weights = {
                single: meal["Weight (Single)"] || meal.weights?.single || 0,
                medium: meal["Weight (Medium)"] || meal.weights?.medium || undefined,
                large: meal["Weight (Large)"] || meal.weights?.large || undefined
            };
            return {
                ...meal,
                prices,
                weights
            };
        }
        return null;
    } catch (error) {
        console.error(`❌ Ошибка при получении блюда ${mealId} из БД:`, error);
        return null;
    }
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
const revalidate = 60;
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
    // Если уже массив, возвращаем как есть
    if (Array.isArray(value)) {
        return value.map((s)=>String(s).trim()).filter(Boolean);
    }
    // Если строка, парсим
    if (typeof value === "string") {
        return value.split(",").map((s)=>s.trim()).filter(Boolean);
    }
    return [];
}
async function GET(request) {
    const startTime = Date.now();
    // Debug: Check if environment variables are being read
    const nocodbUrl = process.env.NOCODB_URL;
    const nocodbToken = process.env.NOCODB_TOKEN;
    const mealsTableId = process.env.NOCODB_TABLE_MEALS;
    const extrasTableId = process.env.NOCODB_TABLE_EXTRAS;
    const zonesTableId = process.env.NOCODB_TABLE_DELIVERY_ZONES;
    console.log(`[MENU API] Request started`);
    console.log(`[MENU API] Environment check:`);
    console.log(`  - NOCODB_URL: ${nocodbUrl ? `${nocodbUrl.substring(0, 30)}...` : "❌ NOT SET"}`);
    console.log(`  - NOCODB_TOKEN: ${nocodbToken ? `${nocodbToken.substring(0, 10)}...` : "❌ NOT SET"}`);
    console.log(`  - NOCODB_TABLE_MEALS: ${mealsTableId ? `${mealsTableId.substring(0, 10)}...` : "❌ NOT SET"}`);
    console.log(`  - NOCODB_TABLE_EXTRAS: ${extrasTableId ? `${extrasTableId.substring(0, 10)}...` : "❌ NOT SET"}`);
    console.log(`  - NOCODB_TABLE_DELIVERY_ZONES: ${zonesTableId ? `${zonesTableId.substring(0, 10)}...` : "❌ NOT SET"}`);
    const { searchParams } = new URL(request.url);
    const weekType = searchParams.get("week");
    console.log(`[MENU API] Request params: weekType=${weekType || "all"}`);
    // Детальная проверка конфигурации
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isNocoDBConfigured"])()) {
        const missingVars = [];
        if (!nocodbUrl) missingVars.push("NOCODB_URL");
        if (!nocodbToken) missingVars.push("NOCODB_TOKEN");
        if (!mealsTableId) missingVars.push("NOCODB_TABLE_MEALS");
        const errorMessage = `NocoDB not configured. Missing variables: ${missingVars.join(", ")}`;
        console.error(`[MENU API] ❌ ${errorMessage}`);
        console.error(`[MENU API] 💡 Hint: Add missing environment variables in Vercel Dashboard → Settings → Environment Variables`);
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
            reason: errorMessage,
            error: {
                type: "configuration",
                missingVariables: missingVars,
                hint: "Add missing environment variables in Vercel Dashboard → Settings → Environment Variables and redeploy"
            }
        }, {
            status: 503
        });
    }
    try {
        console.log(`[MENU API] Fetching data from NocoDB...`);
        const fetchStartTime = Date.now();
        const [nocoMeals, nocoExtras, nocoZones] = await Promise.all([
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchMeals"])(weekType || undefined).catch((err)=>{
                console.error(`[MENU API] ❌ Failed to fetch Meals:`, err);
                throw new Error(`Failed to fetch Meals: ${err instanceof Error ? err.message : String(err)}`);
            }),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchExtras"])().catch((err)=>{
                console.error(`[MENU API] ❌ Failed to fetch Extras:`, err);
                throw new Error(`Failed to fetch Extras: ${err instanceof Error ? err.message : String(err)}`);
            }),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchDeliveryZones"])().catch((err)=>{
                console.error(`[MENU API] ❌ Failed to fetch Delivery Zones:`, err);
                throw new Error(`Failed to fetch Delivery Zones: ${err instanceof Error ? err.message : String(err)}`);
            })
        ]);
        const fetchEndTime = Date.now();
        console.log(`[MENU API] ✅ Data fetched successfully in ${fetchEndTime - fetchStartTime}ms`);
        console.log(`[MENU API] Data counts: meals=${nocoMeals.length}, extras=${nocoExtras.length}, zones=${nocoZones.length}`);
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
        let skippedWrongWeek = 0;
        console.log(`[MENU API] Processing ${nocoMeals.length} meals, weekType=${weekType || "all"}`);
        let processedCount = 0;
        let trueFlagsCount = 0;
        for (const m of nocoMeals){
            try {
                processedCount++;
                if (processedCount === 1) {
                    console.log(`[MENU API] 🔵 Starting to process meals, first meal:`, {
                        name: m["Name"] ?? m.name,
                        category: m["Category"] ?? m.category,
                        currentWeek: m["Current Week"],
                        nextWeek: m["Next Week"]
                    });
                }
                // NocoDB возвращает данные с английскими заголовками колонок
                // Поддерживаем оба варианта: имена колонок и заголовки
                // ВАЖНО: Используем проверку на undefined, а не ??, так как false тоже валидное значение
                const currentWeekRaw = m["Current Week"] !== undefined ? m["Current Week"] : m.is_current_week !== undefined ? m.is_current_week : m.is_current_week;
                const nextWeekRaw = m["Next Week"] !== undefined ? m["Next Week"] : m.is_next_week !== undefined ? m.is_next_week : m.is_next_week;
                const isCurrentWeek = parseBoolean(currentWeekRaw);
                const isNextWeek = parseBoolean(nextWeekRaw);
                if (isCurrentWeek || isNextWeek) {
                    trueFlagsCount++;
                    // Логируем первые несколько блюд с True для отладки
                    if (trueFlagsCount <= 5) {
                        const mealName = m["Name"] ?? m.name;
                        console.log(`[MENU API] ✅ Meal "${mealName}": raw=(${JSON.stringify(currentWeekRaw)}, ${JSON.stringify(nextWeekRaw)}), parsed=(${isCurrentWeek}, ${isNextWeek})`);
                    }
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
                // Если оба флага false, блюдо недоступно (пропускаем)
                // Но только если weekType не указан (показываем все доступные)
                if (!weekType && !isCurrentWeek && !isNextWeek) {
                    skippedWrongWeek++;
                    continue;
                }
                // Поддерживаем английские заголовки колонок
                const category = String((m["Category"] ?? m.category) || "").toLowerCase();
                // Логируем первые несколько блюд
                if (processedCount <= 5) {
                    const mealName = m["Name"] ?? m.name;
                    console.log(`[MENU API] Processing meal "${mealName}": category="${category}", isCurrentWeek=${isCurrentWeek}, isNextWeek=${isNextWeek}`);
                }
                // ... existing code for parsing prices ...
                const priceSingle = parsePrice(m["Price (Single)"] ?? m.price_single) || parsePrice(m["Price"] ?? m.price);
                const priceMedium = parsePrice(m["Price (Medium)"] ?? m.price_medium);
                const priceLarge = parsePrice(m["Price (Large)"] ?? m.price_large);
                const weightSingle = parsePrice(m["Weight (Single)"] ?? m.weight_single) || parsePrice(m["Weight"] ?? m.weight);
                const weightMedium = parsePrice(m["Weight (Medium)"] ?? m.weight_medium);
                const weightLarge = parsePrice(m["Weight (Large)"] ?? m.weight_large);
                const meal = {
                    id: m.Id || m.id,
                    name: (m["Name"] ?? m.name) || "",
                    ingredients: (m["Ingredients"] ?? m.ingredients) || "",
                    description: (m["Description"] ?? m.description) || "",
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
                    needsGarnish: parseBoolean(m["Needs Garnish"] ?? m.needs_garnish),
                    image: (m["Image (URL)"] ?? m.image) || "",
                    nutrition: {
                        calories: parseNumber(m["Calories"] ?? m.calories),
                        protein: parseNumber(m["Protein"] ?? m.protein),
                        fats: parseNumber(m["Fats"] ?? m.fats),
                        carbs: parseNumber(m["Carbs"] ?? m.carbs),
                        weight: weightSingle
                    },
                    category: category,
                    weekType: isCurrentWeek && isNextWeek ? "both" : isCurrentWeek ? "current" : "next"
                };
                // Логируем первые несколько блюд после создания объекта
                if (processedCount <= 3) {
                    console.log(`[MENU API] Created meal object: "${meal.name}", category="${category}", will try to add to groups`);
                }
                // Логируем первые несколько блюд для отладки
                if (skippedWrongWeek < 5) {
                    console.log(`[MENU API] Meal "${meal.name}": category="${category}", isCurrentWeek=${isCurrentWeek}, isNextWeek=${isNextWeek}`);
                }
                if (category === "breakfast") {
                    groupedMeals.breakfast.push(meal);
                    if (skippedWrongWeek < 5) console.log(`[MENU API] ✅ Added to breakfast`);
                } else if (category === "garnish") {
                    groupedMeals.garnish.push(meal);
                    if (skippedWrongWeek < 5) console.log(`[MENU API] ✅ Added to garnish`);
                } else if (category === "soup" || category === "salad" || category === "main") {
                    const lunchCategory = `lunch_${category}`;
                    const dinnerCategory = `dinner_${category}`;
                    groupedMeals[lunchCategory].push({
                        ...meal,
                        category: lunchCategory
                    });
                    if (processedCount <= 5) console.log(`[MENU API] ✅ Added "${meal.name}" to ${lunchCategory} (now: ${groupedMeals[lunchCategory].length})`);
                    groupedMeals[dinnerCategory].push({
                        ...meal,
                        id: `${meal.id}_dinner`,
                        category: dinnerCategory
                    });
                    if (processedCount <= 5) console.log(`[MENU API] ✅ Added "${meal.name}" to ${dinnerCategory} (now: ${groupedMeals[dinnerCategory].length})`);
                } else {
                    if (processedCount <= 5) console.log(`[MENU API] ⚠️ Unknown category: "${category}" for meal "${meal.name}"`);
                }
            } catch (error) {
                console.error(`[MENU API] ❌ Error processing meal:`, error, m);
                skippedWrongWeek++;
            }
        }
        console.log(`[MENU API] Meals filtering: weekType=${weekType || "all"}, processed=${processedCount}, with true flags=${trueFlagsCount}, skipped ${skippedWrongWeek} meals (not available for selected week)`);
        console.log(`[MENU API] Grouped meals:`, Object.entries(groupedMeals).map(([k, v])=>`${k}:${v.length}`).join(", "));
        console.log(`[MENU API] Total meals in groups: ${Object.values(groupedMeals).flat().length}`);
        // ... existing code for extras ...
        const groupedExtras = {
            drink: [],
            sauce: [],
            dessert: [],
            snack: []
        };
        for (const e of nocoExtras){
            // NocoDB возвращает данные с английскими заголовками колонок
            const isCurrentWeek = parseBoolean(e["Current Week"] ?? e.is_current_week ?? e.is_current_week);
            const isNextWeek = parseBoolean(e["Next Week"] ?? e.is_next_week ?? e.is_next_week);
            // Фильтрация по неделе (аналогично meals):
            // - Если оба флага false - дополнение недоступно
            // - Для "current": должно быть доступно в текущей неделе или в обеих
            // - Для "next": должно быть доступно в следующей неделе или в обеих
            if (weekType === "current" && !isCurrentWeek) {
                continue;
            }
            if (weekType === "next" && !isNextWeek) {
                continue;
            }
            // Если оба флага false, дополнение недоступно (пропускаем)
            if (!isCurrentWeek && !isNextWeek) {
                continue;
            }
            const category = String((e["Category"] ?? e.category) || "").toLowerCase();
            const extra = {
                id: e.Id || e.id,
                name: (e["Name"] ?? e.name) || "",
                price: parsePrice(e["Price"] ?? e.price),
                image: (e["Image (URL)"] ?? e.image) || "",
                isCurrentWeek,
                isNextWeek,
                ingredients: (e["Ingredients"] ?? e.ingredients) || "",
                description: (e["Description"] ?? e.description) || "",
                nutrition: {
                    calories: parseNumber(e["Calories"] ?? e.calories),
                    protein: parseNumber(e["Protein"] ?? e.protein),
                    fats: parseNumber(e["Fats"] ?? e.fats),
                    carbs: parseNumber(e["Carbs"] ?? e.carbs),
                    weight: parsePrice(e["Weight"] ?? e.weight)
                },
                category: category
            };
            if (groupedExtras[category]) {
                groupedExtras[category].push(extra);
            }
        }
        console.log(`[MENU API] Grouped extras:`, Object.entries(groupedExtras).map(([k, v])=>`${k}:${v.length}`).join(", "));
        // ... existing code for deliveryZones ...
        const deliveryZones = nocoZones.filter((zone)=>{
            // NocoDB API возвращает данные с ключами как title (с заглавными буквами)
            // Пробуем оба варианта: column_name и title
            const isAvailable = zone.is_available ?? zone["Available"] ?? zone.Available;
            return parseBoolean(isAvailable);
        }).map((zone)=>({
                id: zone.Id || zone.id,
                // Пробуем оба варианта: column_name (snake_case) и title (с заглавными)
                city: zone.city || zone["City"] || zone.City || "",
                district: zone.district || zone["District"] || zone.District || "",
                deliveryFee: parsePrice(zone.delivery_fee ?? zone["Delivery Fee"] ?? zone["Delivery Fee"]),
                minOrderAmount: parsePrice(zone.min_order_amount ?? zone["Min Order Amount"] ?? zone["Min Order Amount"]),
                isAvailable: true,
                availableIntervals: parseIntervals(zone.available_intervals ?? zone["Available Intervals"] ?? zone["Available Intervals"])
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
        const totalTime = Date.now() - startTime;
        console.log(`[MENU API] ✅ Request completed successfully in ${totalTime}ms`);
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
            },
            _meta: {
                processingTime: `${totalTime}ms`,
                weekType: weekType || "all"
            }
        });
    } catch (error) {
        const totalTime = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        const errorStack = error instanceof Error ? error.stack : undefined;
        // Детальное логирование ошибки
        console.error(`[MENU API] ❌ Error after ${totalTime}ms:`);
        console.error(`  Message: ${errorMessage}`);
        if (errorStack) {
            console.error(`  Stack: ${errorStack}`);
        }
        // Определяем тип ошибки для более понятного сообщения
        let errorType = "unknown";
        let userFriendlyMessage = errorMessage;
        let recommendations = [];
        if (errorMessage.includes("TABLE_NOT_FOUND")) {
            errorType = "table_not_found";
            const tableMatch = errorMessage.match(/TABLE_NOT_FOUND:(\w+)/);
            const tableName = tableMatch ? tableMatch[1] : "unknown";
            userFriendlyMessage = `Таблица ${tableName} не найдена в NocoDB`;
            recommendations.push(`Проверьте правильность NOCODB_TABLE_${tableName.toUpperCase()}`);
            recommendations.push("Убедитесь, что таблица существует в NocoDB");
        } else if (errorMessage.includes("NocoDB is not configured")) {
            errorType = "configuration";
            userFriendlyMessage = "NocoDB не настроен";
            recommendations.push("Проверьте переменные окружения NOCODB_URL и NOCODB_TOKEN");
            recommendations.push("Добавьте переменные в Vercel Dashboard → Settings → Environment Variables");
        } else if (errorMessage.includes("timeout") || errorMessage.includes("TIMEOUT")) {
            errorType = "timeout";
            userFriendlyMessage = "Таймаут при подключении к NocoDB";
            recommendations.push("Проверьте доступность NocoDB сервера");
            recommendations.push("Проверьте настройки firewall и IP whitelist в NocoDB");
        } else if (errorMessage.includes("ENOTFOUND") || errorMessage.includes("DNS")) {
            errorType = "network";
            userFriendlyMessage = "Не удалось подключиться к NocoDB";
            recommendations.push("Проверьте правильность NOCODB_URL");
            recommendations.push("Убедитесь, что NocoDB доступен из интернета");
        } else if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
            errorType = "authentication";
            userFriendlyMessage = "Ошибка аутентификации в NocoDB";
            recommendations.push("Проверьте правильность NOCODB_TOKEN");
            recommendations.push("Убедитесь, что токен не истек и имеет необходимые права");
        } else if (errorMessage.includes("403") || errorMessage.includes("Forbidden")) {
            errorType = "authorization";
            userFriendlyMessage = "Доступ запрещен к NocoDB";
            recommendations.push("Проверьте права доступа токена");
            recommendations.push("Убедитесь, что токен имеет доступ к необходимым таблицам");
        } else if (errorMessage.includes("Failed to fetch")) {
            errorType = "network";
            userFriendlyMessage = "Не удалось получить данные из NocoDB";
            recommendations.push("Проверьте доступность NocoDB сервера");
            recommendations.push("Проверьте логи Vercel для деталей");
        }
        console.error(`[MENU API] Error type: ${errorType}`);
        if (recommendations.length > 0) {
            console.error(`[MENU API] Recommendations:`);
            recommendations.forEach((rec, i)=>console.error(`  ${i + 1}. ${rec}`));
        }
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
            reason: userFriendlyMessage,
            error: {
                type: errorType,
                message: errorMessage,
                recommendations,
                hint: "Используйте /api/diagnose для детальной диагностики"
            },
            _meta: {
                processingTime: `${totalTime}ms`,
                timestamp: new Date().toISOString()
            }
        }, {
            status: 503
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0cf8c681._.js.map