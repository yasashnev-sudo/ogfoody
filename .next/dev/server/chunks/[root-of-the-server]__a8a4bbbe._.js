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
"[project]/app/api/orders/[id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "PATCH",
    ()=>PATCH
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/nocodb.ts [app-route] (ecmascript)");
;
;
async function PATCH(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        console.log(`[PATCH /api/orders/${id}] Request received`);
        const { order } = body;
        let pendingPointsEarned = 0 // Храним начисленные баллы для возврата в API response
        ;
        // Если передан полный объект заказа, обновляем все данные
        if (order) {
            console.log(`[PATCH /api/orders/${id}] Updating order with data:`, {
                hasPersons: !!order.persons,
                personsCount: order.persons?.length || 0,
                paymentMethod: order.paymentMethod,
                paymentStatus: order.paymentStatus,
                paid: order.paid
            });
            // Получаем текущий заказ для сохранения order_number
            // ✅ ИСПРАВЛЕНО: Всегда загружаем свежие данные без кэша
            const currentOrder = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchOrderById"])(Number(id), true);
            if (!currentOrder) {
                console.error(`[PATCH /api/orders/${id}] Order not found`);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Order not found"
                }, {
                    status: 404
                });
            }
            // Проверяем, можно ли редактировать заказ
            // Разрешаем обновление только статуса оплаты для заблокированных заказов
            const isPaymentOnlyUpdate = !order.persons && !order.extras && (order.paid !== undefined || order.paidAt !== undefined || order.paymentStatus !== undefined || order.paymentMethod !== undefined);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const orderDate = currentOrder.start_date ? new Date(currentOrder.start_date) : null;
            if (orderDate) {
                orderDate.setHours(0, 0, 0, 0);
            }
            const isPaid = currentOrder.paid === true || currentOrder.payment_status === "paid";
            const isPastDate = orderDate && orderDate < today;
            const isToday = orderDate && orderDate.getTime() === today.getTime();
            // Блокируем изменение содержимого (блюд, персон) для заблокированных заказов
            // Но разрешаем обновление только статуса оплаты
            if (!isPaymentOnlyUpdate && (isPaid || isPastDate || isToday)) {
                const reason = isPaid ? "Заказ оплачен" : isToday ? "Доставка сегодня" : "Прошедшая дата";
                console.error(`[PATCH /api/orders/${id}] Order is locked: ${reason}`);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Order cannot be edited",
                    reason,
                    details: isPaid ? "Редактирование оплаченного заказа недоступно" : isToday ? "Редактирование заказа в день доставки недоступно" : "Редактирование заказа на прошедшую дату недоступно"
                }, {
                    status: 403
                });
            }
            // Проверяем изменения статуса оплаты и заказа для обработки баллов
            const wasPaid = currentOrder.paid === true || currentOrder.payment_status === "paid";
            const willBePaid = order.paid === true || order.paymentStatus === "paid";
            const wasCancelled = currentOrder.order_status === "cancelled";
            const willBeCancelled = order.orderStatus === "cancelled";
            // Обработка баллов при отмене заказа
            // УНИФИЦИРОВАННАЯ ЛОГИКА: одинаково для PATCH и DELETE
            if (!wasCancelled && willBeCancelled && currentOrder.user_id) {
                try {
                    const pointsEarned = typeof currentOrder.loyalty_points_earned === 'number' ? currentOrder.loyalty_points_earned : parseInt(String(currentOrder.loyalty_points_earned)) || 0;
                    const pointsUsed = typeof currentOrder.loyalty_points_used === 'number' ? currentOrder.loyalty_points_used : parseInt(String(currentOrder.loyalty_points_used)) || 0;
                    const orderTotal = typeof currentOrder.total === 'number' ? currentOrder.total : parseFloat(String(currentOrder.total)) || 0;
                    const wasPaid = currentOrder.paid === true || currentOrder.payment_status === "paid";
                    if (wasPaid) {
                        // Оплаченный заказ - возвращаем баллы (отменяем начисление)
                        if (pointsEarned > 0 || pointsUsed > 0) {
                            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["refundLoyaltyPoints"])(currentOrder.user_id, pointsEarned, pointsUsed, orderTotal, Number(id));
                            console.log(`✅ Оплаченный заказ ${id} отменен: возвращено ${pointsUsed} использованных баллов, списано ${pointsEarned} начисленных`);
                        }
                        // Проверка на мошенничество
                        try {
                            const stats = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUserCancellationStats"])(currentOrder.user_id);
                            console.log(`📊 Статистика отмен для пользователя ${currentOrder.user_id}:`, stats);
                            if (stats.cancelledPaidOrders >= 3) {
                                console.warn(`🚨 Обнаружено подозрительное поведение: пользователь ${currentOrder.user_id} отменил ${stats.cancelledPaidOrders} оплаченных заказов`);
                                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createFraudAlert"])(currentOrder.user_id, stats);
                                console.log(`✅ Fraud alert создан для пользователя ${currentOrder.user_id}`);
                            }
                        } catch (error) {
                            console.error(`❌ Ошибка при проверке на мошенничество:`, error);
                        }
                    } else {
                        // Неоплаченный заказ - отменяем pending транзакции
                        const pendingTransactions = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchPendingTransactionsByOrder"])(Number(id));
                        console.log(`🔍 Неоплаченный заказ ${id}. Найдено pending транзакций: ${pendingTransactions.length}`);
                        if (pendingTransactions.length > 0) {
                            const now = new Date().toISOString();
                            for (const transaction of pendingTransactions){
                                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateLoyaltyTransaction"])(transaction.Id, {
                                    transaction_status: 'cancelled',
                                    processed_at: now
                                });
                            }
                            console.log(`✅ Отменены ${pendingTransactions.length} pending транзакций для заказа ${id}`);
                        } else {
                            console.log(`ℹ️ Нет pending транзакций для неоплаченного заказа ${id}`);
                        }
                    }
                } catch (error) {
                    console.error(`❌ Ошибка при обработке баллов при отмене заказа:`, error);
                // Не прерываем процесс обновления заказа
                }
            }
            // Обновляем основные поля заказа (сохраняем order_number если он был)
            const now = new Date().toISOString();
            let loyaltyPointsEarned = order.loyaltyPointsEarned !== undefined ? order.loyaltyPointsEarned : typeof currentOrder.loyalty_points_earned === 'number' ? currentOrder.loyalty_points_earned : parseInt(String(currentOrder.loyalty_points_earned)) || 0;
            // ✅ ИСПРАВЛЕНО: СНАЧАЛА проверяем смену способа оплаты с наличных на онлайн
            // Это нужно делать ДО начисления новых баллов, чтобы избежать дубликатов
            const oldPaymentMethod = currentOrder.payment_method || currentOrder["Payment Method"];
            const isPaymentMethodChangedFromCash = oldPaymentMethod === 'cash' && order?.paymentMethod && (order.paymentMethod === 'card' || order.paymentMethod === 'sbp');
            // ✅ ИСПРАВЛЕНО 2026-01-11: Списание баллов при использовании в заказе
            // Это нужно делать НЕЗАВИСИМО от способа оплаты и статуса paid
            if (currentOrder.user_id && order.loyaltyPointsUsed && order.loyaltyPointsUsed > 0) {
                try {
                    // Проверяем, не были ли баллы уже списаны
                    const existingPointsUsed = typeof currentOrder.loyalty_points_used === 'number' ? currentOrder.loyalty_points_used : parseInt(String(currentOrder.loyalty_points_used)) || 0;
                    // Списываем только если это новое использование баллов (не было раньше)
                    if (existingPointsUsed === 0 && order.loyaltyPointsUsed > 0) {
                        console.log(`\n🔍 ========== СПИСАНИЕ БАЛЛОВ (PATCH) ==========`);
                        console.log(`💳 Списываем ${order.loyaltyPointsUsed} баллов для заказа ${id}`);
                        const now = new Date().toISOString();
                        const { createLoyaltyPointsTransaction, updateUser, fetchUserById } = await __turbopack_context__.A("[project]/lib/nocodb.ts [app-route] (ecmascript, async loader)");
                        // ✅ ЗАЩИТА: Проверяем достаточно ли баллов у пользователя
                        const user = await fetchUserById(currentOrder.user_id, true);
                        if (!user) {
                            console.error(`❌ Пользователь ${currentOrder.user_id} не найден`);
                            throw new Error(`User ${currentOrder.user_id} not found`);
                        }
                        const currentBalance = typeof user.loyalty_points === 'number' ? user.loyalty_points : parseFloat(String(user.loyalty_points)) || 0;
                        console.log(`🔍 Проверка баланса перед списанием:`, {
                            userId: currentOrder.user_id,
                            currentBalance,
                            requestedToUse: order.loyaltyPointsUsed,
                            sufficient: currentBalance >= order.loyaltyPointsUsed
                        });
                        if (currentBalance < order.loyaltyPointsUsed) {
                            console.warn(`⚠️ ЗАЩИТА: Недостаточно баллов для списания!`, {
                                available: currentBalance,
                                requested: order.loyaltyPointsUsed,
                                deficit: order.loyaltyPointsUsed - currentBalance
                            });
                            console.log(`ℹ️ Пропускаем списание - возможно баллы уже были списаны ранее`);
                            console.log(`🔍 ========== КОНЕЦ СПИСАНИЯ БАЛЛОВ (пропущено) ==========\n`);
                        // Не выбрасываем ошибку - просто пропускаем операцию
                        // Это может быть повторный запрос или race condition
                        } else {
                            // Баллов достаточно - списываем
                            // Создаем транзакцию на списание
                            await createLoyaltyPointsTransaction({
                                user_id: currentOrder.user_id,
                                order_id: Number(id),
                                transaction_type: "used",
                                transaction_status: "completed",
                                points: -order.loyaltyPointsUsed,
                                description: `Использовано ${order.loyaltyPointsUsed} баллов для оплаты заказа`,
                                created_at: now,
                                updated_at: now,
                                processed_at: now
                            });
                            console.log(`✅ Транзакция "used" создана: -${order.loyaltyPointsUsed} баллов`);
                            // Списываем баллы у пользователя
                            const newBalance = currentBalance - order.loyaltyPointsUsed;
                            await updateUser(currentOrder.user_id, {
                                loyalty_points: newBalance,
                                updated_at: now
                            });
                            console.log(`✅ Баллы списаны с пользователя ${currentOrder.user_id}:`, {
                                oldBalance: currentBalance,
                                used: order.loyaltyPointsUsed,
                                newBalance
                            });
                            console.log(`🔍 ========== КОНЕЦ СПИСАНИЯ БАЛЛОВ ==========\n`);
                        }
                    } else {
                        console.log(`ℹ️ Баллы уже были списаны ранее (${existingPointsUsed}) или не изменились`);
                    }
                } catch (error) {
                    console.error(`❌ Ошибка при списании баллов:`, error);
                // Не прерываем процесс обновления заказа
                }
            }
            // Начисление баллов при оплате заказа
            if (!wasPaid && willBePaid && currentOrder.user_id) {
                console.log(`\n🔍 ========== НАЧАЛО ОТЛАДКИ НАЧИСЛЕНИЯ БАЛЛОВ (PATCH full order) ==========`);
                console.log(`🔍 [PATCH ${id}] 1️⃣ Входящий payload:`, {
                    'order.loyaltyPointsUsed': order.loyaltyPointsUsed,
                    'order.loyaltyPointsEarned': order.loyaltyPointsEarned,
                    'order.paymentMethod': order.paymentMethod,
                    'order.paid': order.paid,
                    'order.paymentStatus': order.paymentStatus,
                    'order.subtotal': order.subtotal,
                    'order.total': order.total,
                    userId: currentOrder.user_id
                });
                console.log(`🔍 [PATCH ${id}] Текущее состояние заказа:`, {
                    'currentOrder.total': currentOrder.total,
                    'currentOrder.subtotal': currentOrder.subtotal,
                    'currentOrder.delivery_fee': currentOrder.delivery_fee,
                    'currentOrder.loyalty_points_earned': currentOrder.loyalty_points_earned,
                    'currentOrder.loyalty_points_used': currentOrder.loyalty_points_used
                });
                try {
                    // ✅ ЗАЩИТА: Проверяем, не были ли баллы уже начислены
                    const existingPointsEarned = typeof currentOrder.loyalty_points_earned === 'number' ? currentOrder.loyalty_points_earned : parseInt(String(currentOrder.loyalty_points_earned)) || 0;
                    console.log(`🔍 [PATCH ${id}] 2️⃣ Проверка существующих начисленных баллов:`, {
                        existingPointsEarned,
                        hasExistingPoints: existingPointsEarned > 0
                    });
                    if (existingPointsEarned > 0) {
                        console.warn(`⚠️ ЗАЩИТА ОТ ДВОЙНОГО НАЧИСЛЕНИЯ: Баллы уже начислены для заказа ${id}: ${existingPointsEarned}. Пропускаем начисление.`);
                        loyaltyPointsEarned = existingPointsEarned;
                    } else if (isPaymentMethodChangedFromCash) {
                        // ✅ НОВАЯ ЗАЩИТА: Если заказ был за наличные и меняется на карту/СБП,
                        // НЕ начисляем новые баллы, а только обрабатываем pending транзакции ниже
                        console.log(`🔍 [PATCH ${id}] 3️⃣ Смена способа оплаты с наличных:`, {
                            oldPaymentMethod,
                            newPaymentMethod: order.paymentMethod
                        });
                        console.log(`💳 Заказ ${id}: способ оплаты изменен с наличных на ${order.paymentMethod}. Pending транзакции будут обработаны ниже, новые баллы НЕ начисляем.`);
                        loyaltyPointsEarned = 0;
                    } else {
                        console.log(`🔍 [PATCH ${id}] 4️⃣ Загрузка пользователя для расчета баллов`);
                        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchUserById"])(currentOrder.user_id);
                        if (user) {
                            console.log(`🔍 [PATCH ${id}] Пользователь найден:`, {
                                userId: user.Id,
                                loyaltyPoints: user.loyalty_points,
                                totalSpent: user.total_spent
                            });
                            const orderTotal = order.total || (typeof currentOrder.total === 'number' ? currentOrder.total : parseFloat(String(currentOrder.total)) || 0);
                            const pointsUsed = order.loyaltyPointsUsed !== undefined ? order.loyaltyPointsUsed : typeof currentOrder.loyalty_points_used === 'number' ? currentOrder.loyalty_points_used : parseInt(String(currentOrder.loyalty_points_used)) || 0;
                            const currentTotalSpent = typeof user.total_spent === 'number' ? user.total_spent : parseFloat(String(user.total_spent)) || 0;
                            console.log(`🔍 [PATCH ${id}] 5️⃣ Подготовка данных для расчета:`, {
                                orderTotal,
                                pointsUsed,
                                currentTotalSpent,
                                loyaltyLevel: currentTotalSpent >= 50000 ? "gold" : currentTotalSpent >= 20000 ? "silver" : "bronze"
                            });
                            // Рассчитываем начисляемые баллы
                            console.log(`🔍 [PATCH ${id}] 6️⃣ Вызов calculateEarnedPoints с параметрами:`, {
                                orderTotal,
                                pointsUsed,
                                currentTotalSpent
                            });
                            loyaltyPointsEarned = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calculateEarnedPoints"])(orderTotal, pointsUsed, currentTotalSpent);
                            console.log(`🔍 [PATCH ${id}] 7️⃣ Результат calculateEarnedPoints:`, {
                                loyaltyPointsEarned
                            });
                            // Начисляем баллы пользователю
                            console.log(`🔍 [PATCH ${id}] 8️⃣ Вызов awardLoyaltyPoints с параметрами:`, {
                                userId: currentOrder.user_id,
                                orderTotal,
                                pointsUsed,
                                loyaltyPointsEarned,
                                orderId: id
                            });
                            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["awardLoyaltyPoints"])(currentOrder.user_id, orderTotal, pointsUsed, loyaltyPointsEarned, Number(id));
                            console.log(`🔍 [PATCH ${id}] 9️⃣ Результат awardLoyaltyPoints: успешно`);
                            console.log(`✅ Начислено ${loyaltyPointsEarned} баллов пользователю ${currentOrder.user_id} при оплате заказа ${id}`);
                        }
                    }
                    console.log(`🔍 ========== КОНЕЦ ОТЛАДКИ НАЧИСЛЕНИЯ БАЛЛОВ (PATCH full order) ==========\n`);
                } catch (error) {
                    console.error(`❌ Ошибка при начислении баллов при оплате:`, error);
                // Не прерываем процесс обновления заказа
                }
            }
            // Получаем order_number из разных возможных источников
            const existingOrderNumber = currentOrder?.order_number ?? currentOrder?.["Order Number"];
            const finalOrderNumber = existingOrderNumber ?? order.orderNumber ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateOrderNumber"])();
            // Используем значения из currentOrder для полей, которые не переданы в order
            const existingStartDate = currentOrder.start_date || currentOrder["Start Date"];
            const existingDeliveryTime = currentOrder.delivery_time || currentOrder["Delivery Time"];
            const existingSubtotal = currentOrder.subtotal || currentOrder["Subtotal"] || 0;
            const existingTotal = currentOrder.total || currentOrder["Total"] || 0;
            const updatedOrder = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateOrder"])(Number(id), {
                order_number: finalOrderNumber,
                start_date: order.startDate ? typeof order.startDate === "string" ? order.startDate : order.startDate.toISOString().split("T")[0] : existingStartDate,
                delivery_time: order.deliveryTime || existingDeliveryTime,
                // Новые статусы оплаты
                payment_status: order.paymentStatus || (order.paid ? "paid" : "pending"),
                payment_method: order.paymentMethod || "cash",
                paid: order.paid !== undefined ? order.paid : currentOrder.paid,
                paid_at: order.paidAt || (order.paid ? now : currentOrder.paid_at),
                payment_id: order.paymentId || undefined,
                // Новый статус заказа
                order_status: order.orderStatus || currentOrder.order_status || "pending",
                // УДАЛЕНО: delivered, cancelled, status - статусы доставки убраны
                promo_code: order.promoCode !== undefined ? order.promoCode : currentOrder.promo_code,
                promo_discount: order.promoDiscount !== undefined ? order.promoDiscount : currentOrder.promo_discount,
                loyalty_points_used: order.loyaltyPointsUsed !== undefined ? order.loyaltyPointsUsed : typeof currentOrder.loyalty_points_used === 'number' ? currentOrder.loyalty_points_used : parseInt(String(currentOrder.loyalty_points_used)) || 0,
                loyalty_points_earned: loyaltyPointsEarned,
                subtotal: order.subtotal !== undefined && order.subtotal !== null ? order.subtotal : existingSubtotal,
                total: order.total !== undefined && order.total !== null ? order.total : existingTotal,
                guest_phone: order.guestPhone !== undefined ? order.guestPhone : currentOrder.guest_phone,
                guest_address: order.guestAddress !== undefined ? order.guestAddress : currentOrder.guest_address,
                updated_at: now
            });
            // ✅ Обрабатываем pending транзакции, если способ оплаты изменился с наличных на онлайн
            if (isPaymentMethodChangedFromCash) {
                console.log(`💳 Заказ ${id} оплачен онлайн (было: ${oldPaymentMethod}, стало: ${order.paymentMethod}), обрабатываем pending баллы`);
                try {
                    // Обрабатываем pending транзакции для этого заказа
                    pendingPointsEarned = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["processPendingTransactionsForOrder"])(Number(id), currentOrder.user_id);
                    if (pendingPointsEarned > 0) {
                        console.log(`✅ Pending транзакции обработаны, начислено ${pendingPointsEarned} баллов`);
                        loyaltyPointsEarned = pendingPointsEarned; // Используем баллы из pending транзакции
                    } else {
                        console.log(`✅ Pending транзакции обработаны, баллов не было`);
                    }
                } catch (error) {
                    console.error(`❌ Ошибка при обработке pending транзакций для заказа ${id}:`, error);
                // Не прерываем процесс обновления заказа
                }
            }
            // Если обновляется только статус оплаты, пропускаем обновление содержимого
            if (!isPaymentOnlyUpdate) {
                // Получаем существующие персоны, блюда и дополнения
                const existingPersons = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchOrderPersons"])(Number(id));
                const existingExtras = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchOrderExtras"])(Number(id));
                // Удаляем старые блюда для каждой персоны
                for (const person of existingPersons){
                    try {
                        const meals = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchOrderMeals"])(person.Id);
                        for (const meal of meals){
                            try {
                                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deleteOrderMeal"])(meal.Id);
                            } catch (error) {
                                console.warn(`⚠️ Не удалось удалить meal ${meal.Id}:`, error);
                            // Продолжаем, не прерываем процесс
                            }
                        }
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deleteOrderPerson"])(person.Id);
                    } catch (error) {
                        console.error(`❌ Ошибка при удалении person ${person.Id}:`, error);
                    // Продолжаем с другими персонами
                    }
                }
                // Удаляем старые дополнения
                for (const extra of existingExtras){
                    try {
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deleteOrderExtra"])(extra.Id);
                    } catch (error) {
                        console.warn(`⚠️ Не удалось удалить extra ${extra.Id}:`, error);
                    // Продолжаем, не прерываем процесс
                    }
                }
                // Создаем новые персоны и блюда
                if (order.persons && order.persons.length > 0) {
                    for (const person of order.persons){
                        const nocoOrderPerson = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createOrderPerson"])({
                            order_id: Number(id),
                            person_number: person.id
                        });
                        // Сохранение блюд для каждого дня
                        for (const day of [
                            "day1",
                            "day2"
                        ]){
                            const dayMeals = person[day];
                            if (!dayMeals) continue;
                            // Завтрак
                            if (dayMeals.breakfast?.dish) {
                                await saveMeal(nocoOrderPerson.Id, day, "breakfast", "dish", dayMeals.breakfast.dish);
                            }
                            // Обед
                            if (dayMeals.lunch) {
                                if (dayMeals.lunch.salad) {
                                    await saveMeal(nocoOrderPerson.Id, day, "lunch", "salad", dayMeals.lunch.salad);
                                }
                                if (dayMeals.lunch.soup) {
                                    await saveMeal(nocoOrderPerson.Id, day, "lunch", "soup", dayMeals.lunch.soup);
                                }
                                if (dayMeals.lunch.main) {
                                    await saveMeal(nocoOrderPerson.Id, day, "lunch", "main", dayMeals.lunch.main);
                                }
                            }
                            // Ужин
                            if (dayMeals.dinner) {
                                if (dayMeals.dinner.salad) {
                                    await saveMeal(nocoOrderPerson.Id, day, "dinner", "salad", dayMeals.dinner.salad);
                                }
                                if (dayMeals.dinner.soup) {
                                    await saveMeal(nocoOrderPerson.Id, day, "dinner", "soup", dayMeals.dinner.soup);
                                }
                                if (dayMeals.dinner.main) {
                                    await saveMeal(nocoOrderPerson.Id, day, "dinner", "main", dayMeals.dinner.main);
                                }
                            }
                        }
                    }
                }
                // Создаем новые дополнения
                if (order.extras && order.extras.length > 0) {
                    for (const extra of order.extras){
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createOrderExtra"])({
                            order_id: Number(id),
                            extra_id: extra.id,
                            quantity: extra.quantity,
                            price: extra.price
                        });
                    }
                }
            }
            // Возвращаем обновленный заказ с order_number
            // ✅ ИСПРАВЛЕНО 2026-01-11: Объединяем данные из updatedOrder с тем, что мы точно записали
            // ✅ ИСПРАВЛЕНО 2026-01-11: Нормализуем формат start_date для календаря
            const normalizeStartDate = (date)=>{
                if (!date) return "";
                if (typeof date === "string") {
                    // Если это ISO timestamp, извлекаем только дату
                    if (date.includes("T")) {
                        return date.split("T")[0];
                    }
                    // Если это уже формат YYYY-MM-DD, возвращаем как есть
                    return date;
                }
                // Если это Date объект
                if (date instanceof Date) {
                    return date.toISOString().split("T")[0];
                }
                return String(date);
            };
            const mergedOrder = {
                ...updatedOrder,
                // Перезаписываем поля, которые могли быть закэшированы
                loyalty_points_used: order.loyaltyPointsUsed !== undefined ? order.loyaltyPointsUsed : updatedOrder.loyalty_points_used,
                loyalty_points_earned: loyaltyPointsEarned !== undefined ? loyaltyPointsEarned : updatedOrder.loyalty_points_earned,
                // ✅ Нормализуем start_date к формату YYYY-MM-DD
                start_date: normalizeStartDate(updatedOrder.start_date || updatedOrder["Start Date"])
            };
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                order: mergedOrder,
                orderNumber: mergedOrder?.order_number ?? mergedOrder?.["Order Number"]
            });
        } else {
            // Если передан только частичный объект (без order), обновляем только основные поля
            // Это обычно используется для обновления только статуса оплаты
            // Преобразуем camelCase в snake_case для NocoDB
            const updateData = {};
            if (body.paid !== undefined) updateData.paid = body.paid;
            if (body.paid_at !== undefined) updateData.paid_at = body.paid_at;
            if (body.paidAt !== undefined) updateData.paid_at = body.paidAt;
            if (body.payment_method !== undefined) updateData.payment_method = body.payment_method;
            if (body.paymentMethod !== undefined) updateData.payment_method = body.paymentMethod;
            if (body.payment_status !== undefined) updateData.payment_status = body.payment_status;
            if (body.paymentStatus !== undefined) updateData.payment_status = body.paymentStatus;
            if (body.updated_at !== undefined) updateData.updated_at = body.updated_at;
            if (body.updatedAt !== undefined) updateData.updated_at = body.updatedAt;
            // Добавляем начисленные pending баллы
            if (pendingPointsEarned > 0) {
                updateData.loyalty_points_earned = pendingPointsEarned;
            }
            // Для частичных обновлений разрешаем обновление статуса оплаты даже для заблокированных заказов
            // Проверяем, что это обновление только оплаты (нет persons/extras)
            const isPaymentOnlyUpdate = !body.persons && !body.extras && (body.paid !== undefined || body.paidAt !== undefined || body.paid_at !== undefined || body.paymentStatus !== undefined || body.payment_status !== undefined || body.paymentMethod !== undefined || body.payment_method !== undefined);
            console.log(`[PATCH /api/orders/${id}] Partial update - isPaymentOnlyUpdate: ${isPaymentOnlyUpdate}`, {
                hasPersons: !!body.persons,
                hasExtras: !!body.extras,
                hasPaid: body.paid !== undefined,
                hasPaidAt: body.paidAt !== undefined || body.paid_at !== undefined,
                hasPaymentStatus: body.paymentStatus !== undefined || body.payment_status !== undefined,
                hasPaymentMethod: body.paymentMethod !== undefined || body.payment_method !== undefined
            });
            // Если это не обновление только оплаты, проверяем блокировку
            if (!isPaymentOnlyUpdate) {
                // ✅ ИСПРАВЛЕНО: Всегда загружаем свежие данные без кэша
                const currentOrder = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchOrderById"])(Number(id), true);
                if (currentOrder) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const orderDate = currentOrder.start_date ? new Date(currentOrder.start_date) : null;
                    if (orderDate) {
                        orderDate.setHours(0, 0, 0, 0);
                    }
                    const isPaid = currentOrder.paid === true || currentOrder.payment_status === "paid";
                    const isPastDate = orderDate && orderDate < today;
                    const isToday = orderDate && orderDate.getTime() === today.getTime();
                    if (isPaid || isPastDate || isToday) {
                        const reason = isPaid ? "Заказ оплачен" : isToday ? "Доставка сегодня" : "Прошедшая дата";
                        console.error(`[PATCH /api/orders/${id}] Order is locked: ${reason}`);
                        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                            error: "Order cannot be edited",
                            reason,
                            details: isPaid ? "Редактирование оплаченного заказа недоступно" : isToday ? "Редактирование заказа в день доставки недоступно" : "Редактирование заказа на прошедшую дату недоступно"
                        }, {
                            status: 403
                        });
                    }
                }
            } else {
                console.log(`[PATCH /api/orders/${id}] Payment-only update - skipping lock check`);
            }
            // Получаем текущий заказ для обработки баллов
            // ✅ ИСПРАВЛЕНО: Всегда загружаем свежие данные без кэша
            const currentOrder = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchOrderById"])(Number(id), true);
            if (!currentOrder) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Order not found"
                }, {
                    status: 404
                });
            }
            // Проверяем изменения статуса оплаты для обработки баллов
            const wasPaid = currentOrder.paid === true || currentOrder.payment_status === "paid";
            const willBePaid = updateData.paid === true || updateData.payment_status === "paid";
            const willBeCancelled = body.orderStatus === "cancelled" || body.order_status === "cancelled";
            const wasCancelled = currentOrder.order_status === "cancelled";
            // ✅ ИСПРАВЛЕНО 2026-01-11: Списание баллов при использовании (для partial update)
            // Это нужно делать НЕЗАВИСИМО от способа оплаты и статуса paid
            if (currentOrder.user_id && body.loyaltyPointsUsed && body.loyaltyPointsUsed > 0) {
                try {
                    // Проверяем, не были ли баллы уже списаны
                    const existingPointsUsed = typeof currentOrder.loyalty_points_used === 'number' ? currentOrder.loyalty_points_used : parseInt(String(currentOrder.loyalty_points_used)) || 0;
                    // Списываем только если это новое использование баллов (не было раньше)
                    if (existingPointsUsed === 0 && body.loyaltyPointsUsed > 0) {
                        console.log(`\n🔍 ========== СПИСАНИЕ БАЛЛОВ (PATCH partial) ==========`);
                        console.log(`💳 Списываем ${body.loyaltyPointsUsed} баллов для заказа ${id}`);
                        const now = new Date().toISOString();
                        const { createLoyaltyPointsTransaction, updateUser, fetchUserById } = await __turbopack_context__.A("[project]/lib/nocodb.ts [app-route] (ecmascript, async loader)");
                        // ✅ ЗАЩИТА: Проверяем достаточно ли баллов у пользователя
                        const user = await fetchUserById(currentOrder.user_id, true);
                        if (!user) {
                            console.error(`❌ Пользователь ${currentOrder.user_id} не найден`);
                            throw new Error(`User ${currentOrder.user_id} not found`);
                        }
                        const currentBalance = typeof user.loyalty_points === 'number' ? user.loyalty_points : parseFloat(String(user.loyalty_points)) || 0;
                        console.log(`🔍 Проверка баланса перед списанием:`, {
                            userId: currentOrder.user_id,
                            currentBalance,
                            requestedToUse: body.loyaltyPointsUsed,
                            sufficient: currentBalance >= body.loyaltyPointsUsed
                        });
                        if (currentBalance < body.loyaltyPointsUsed) {
                            console.warn(`⚠️ ЗАЩИТА: Недостаточно баллов для списания!`, {
                                available: currentBalance,
                                requested: body.loyaltyPointsUsed,
                                deficit: body.loyaltyPointsUsed - currentBalance
                            });
                            console.log(`ℹ️ Пропускаем списание - возможно баллы уже были списаны ранее`);
                            console.log(`🔍 ========== КОНЕЦ СПИСАНИЯ БАЛЛОВ (пропущено) ==========\n`);
                        // Не выбрасываем ошибку - просто пропускаем операцию
                        // Это может быть повторный запрос или race condition
                        } else {
                            // Баллов достаточно - списываем
                            // Создаем транзакцию на списание
                            await createLoyaltyPointsTransaction({
                                user_id: currentOrder.user_id,
                                order_id: Number(id),
                                transaction_type: "used",
                                transaction_status: "completed",
                                points: -body.loyaltyPointsUsed,
                                description: `Использовано ${body.loyaltyPointsUsed} баллов для оплаты заказа`,
                                created_at: now,
                                updated_at: now,
                                processed_at: now
                            });
                            console.log(`✅ Транзакция "used" создана: -${body.loyaltyPointsUsed} баллов`);
                            // Списываем баллы у пользователя
                            const newBalance = currentBalance - body.loyaltyPointsUsed;
                            await updateUser(currentOrder.user_id, {
                                loyalty_points: newBalance,
                                updated_at: now
                            });
                            console.log(`✅ Баллы списаны с пользователя ${currentOrder.user_id}:`, {
                                oldBalance: currentBalance,
                                used: body.loyaltyPointsUsed,
                                newBalance
                            });
                        }
                        // Обновляем loyalty_points_used в updateData
                        updateData.loyalty_points_used = body.loyaltyPointsUsed;
                        console.log(`🔍 ========== КОНЕЦ СПИСАНИЯ БАЛЛОВ ==========\n`);
                    } else {
                        console.log(`ℹ️ Баллы уже были списаны ранее (${existingPointsUsed}) или не изменились`);
                    }
                } catch (error) {
                    console.error(`❌ Ошибка при списании баллов (partial):`, error);
                // Не прерываем процесс обновления заказа
                }
            }
            // Обработка списания баллов при отмене заказа
            if (!wasCancelled && willBeCancelled && currentOrder.user_id) {
                try {
                    const pointsEarned = typeof currentOrder.loyalty_points_earned === 'number' ? currentOrder.loyalty_points_earned : parseInt(String(currentOrder.loyalty_points_earned)) || 0;
                    const pointsUsed = typeof currentOrder.loyalty_points_used === 'number' ? currentOrder.loyalty_points_used : parseInt(String(currentOrder.loyalty_points_used)) || 0;
                    const orderTotal = typeof currentOrder.total === 'number' ? currentOrder.total : parseFloat(String(currentOrder.total)) || 0;
                    const wasPaid = currentOrder.paid === true || currentOrder.payment_status === "paid";
                    // Списываем баллы только если заказ не был оплачен
                    if (!wasPaid && (pointsEarned > 0 || pointsUsed > 0)) {
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["refundLoyaltyPoints"])(currentOrder.user_id, pointsEarned, pointsUsed, orderTotal, Number(id));
                        console.log(`✅ Списано ${pointsEarned} баллов и возвращено ${pointsUsed} использованных баллов при отмене неоплаченного заказа ${id}`);
                    } else if (wasPaid) {
                        console.log(`ℹ️ Заказ ${id} был оплачен, баллы не списываются при отмене`);
                    }
                } catch (error) {
                    console.error(`❌ Ошибка при списании баллов при отмене заказа:`, error);
                }
            }
            // Проверяем изменение способа оплаты с наличных на онлайн (для partial update)
            const oldPaymentMethodPartial = currentOrder.payment_method || currentOrder["Payment Method"];
            const newPaymentMethod = updateData.payment_method;
            if (oldPaymentMethodPartial === 'cash' && (newPaymentMethod === 'card' || newPaymentMethod === 'sbp')) {
                console.log(`💳 Partial update: Заказ ${id} оплачен онлайн (было: ${oldPaymentMethodPartial}, стало: ${newPaymentMethod}), обрабатываем pending баллы`);
                try {
                    // Обрабатываем pending транзакции для этого заказа
                    const earnedPoints = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["processPendingTransactionsForOrder"])(Number(id), currentOrder.user_id);
                    if (earnedPoints > 0) {
                        pendingPointsEarned = earnedPoints;
                        updateData.loyalty_points_earned = earnedPoints;
                        console.log(`✅ Pending транзакции обработаны, начислено ${earnedPoints} баллов`);
                    } else {
                        console.log(`ℹ️ Pending транзакции не найдены или уже обработаны`);
                    }
                } catch (error) {
                    console.error(`❌ Ошибка при обработке pending транзакций для заказа ${id}:`, error);
                }
            }
            // Начисление баллов при оплате заказа (если это не наличные, ставшие онлайн)
            // Если заказ уже был оплачен при создании, баллы уже начислены
            // Начисляем только если заказ переходит из неоплаченного в оплаченный
            // И если это НЕ случай с pending транзакциями (они уже обработаны выше)
            // ✅ ЗАЩИТА: Проверяем, не были ли баллы уже начислены при создании
            const existingPointsEarnedPartial = typeof currentOrder.loyalty_points_earned === 'number' ? currentOrder.loyalty_points_earned : parseInt(String(currentOrder.loyalty_points_earned)) || 0;
            console.log(`🔍 Проверка начисления баллов при оплате ${id}:`, {
                wasPaid,
                willBePaid,
                'currentOrder.user_id': currentOrder.user_id,
                'currentOrder.loyalty_points_earned': existingPointsEarnedPartial,
                pendingPointsEarned,
                condition: !wasPaid && willBePaid && currentOrder.user_id && pendingPointsEarned === 0 && existingPointsEarnedPartial === 0
            });
            if (existingPointsEarnedPartial > 0) {
                console.warn(`⚠️ ЗАЩИТА ОТ ДВОЙНОГО НАЧИСЛЕНИЯ (partial update): Баллы уже начислены для заказа ${id}: ${existingPointsEarnedPartial}. Пропускаем начисление.`);
                // Сохраняем существующее значение в updateData
                updateData.loyalty_points_earned = existingPointsEarnedPartial;
            } else if (!wasPaid && willBePaid && currentOrder.user_id && pendingPointsEarned === 0) {
                console.log(`\n🔍 ========== НАЧАЛО ОТЛАДКИ НАЧИСЛЕНИЯ БАЛЛОВ (PATCH partial) ==========`);
                console.log(`🔍 [PATCH partial ${id}] 1️⃣ Входящий payload (updateData):`, {
                    paid: updateData.paid,
                    payment_status: updateData.payment_status,
                    payment_method: updateData.payment_method
                });
                console.log(`🔍 [PATCH partial ${id}] Текущее состояние заказа:`, {
                    'currentOrder.total': currentOrder.total,
                    'currentOrder.subtotal': currentOrder.subtotal,
                    'currentOrder.delivery_fee': currentOrder.delivery_fee,
                    'currentOrder.loyalty_points_earned': currentOrder.loyalty_points_earned,
                    'currentOrder.loyalty_points_used': currentOrder.loyalty_points_used
                });
                try {
                    // ✅ ИСПРАВЛЕНО: Всегда загружаем свежие данные без кэша
                    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchUserById"])(currentOrder.user_id, true);
                    if (user) {
                        console.log(`🔍 [PATCH partial ${id}] 2️⃣ Пользователь найден:`, {
                            userId: user.Id,
                            loyaltyPoints: user.loyalty_points,
                            totalSpent: user.total_spent
                        });
                        // ✅ УЛУЧШЕНО: Получаем сумму заказа из разных возможных полей
                        let orderTotal = typeof currentOrder.total === 'number' ? currentOrder.total : typeof currentOrder.Total === 'number' ? currentOrder.Total : parseFloat(String(currentOrder.total || currentOrder.Total || 0)) || 0;
                        // Если total = 0, пытаемся взять из subtotal + delivery_fee
                        if (orderTotal === 0) {
                            const subtotal = typeof currentOrder.subtotal === 'number' ? currentOrder.subtotal : typeof currentOrder.Subtotal === 'number' ? currentOrder.Subtotal : parseFloat(String(currentOrder.subtotal || currentOrder.Subtotal || 0)) || 0;
                            const deliveryFee = typeof currentOrder.delivery_fee === 'number' ? currentOrder.delivery_fee : typeof currentOrder['Delivery Fee'] === 'number' ? currentOrder['Delivery Fee'] : parseFloat(String(currentOrder.delivery_fee || currentOrder['Delivery Fee'] || 0)) || 0;
                            if (subtotal > 0) {
                                const promoDiscount = typeof currentOrder.promo_discount === 'number' ? currentOrder.promo_discount : parseFloat(String(currentOrder.promo_discount || 0)) || 0;
                                orderTotal = subtotal + deliveryFee - promoDiscount;
                                console.log(`ℹ️ Total был 0, пересчитан из subtotal + delivery_fee: ${subtotal} + ${deliveryFee} - ${promoDiscount} = ${orderTotal}`);
                            }
                        }
                        console.log(`🔍 [PATCH partial ${id}] 3️⃣ Расчет orderTotal:`, {
                            'currentOrder.total': currentOrder.total,
                            'currentOrder.Total': currentOrder.Total,
                            'currentOrder.subtotal': currentOrder.subtotal,
                            'currentOrder.delivery_fee': currentOrder.delivery_fee,
                            'calculated orderTotal': orderTotal
                        });
                        const pointsUsed = typeof currentOrder.loyalty_points_used === 'number' ? currentOrder.loyalty_points_used : parseInt(String(currentOrder.loyalty_points_used)) || 0;
                        const currentTotalSpent = typeof user.total_spent === 'number' ? user.total_spent : parseFloat(String(user.total_spent)) || 0;
                        console.log(`🔍 [PATCH partial ${id}] 4️⃣ Подготовка данных для расчета:`, {
                            orderTotal,
                            pointsUsed,
                            currentTotalSpent,
                            loyaltyLevel: currentTotalSpent >= 50000 ? "gold" : currentTotalSpent >= 20000 ? "silver" : "bronze"
                        });
                        // ✅ ПРОВЕРКА: Если orderTotal все еще 0, не начисляем баллы
                        if (orderTotal <= 0) {
                            console.warn(`⚠️ PATCH ${id}: Невозможно начислить баллы - orderTotal = ${orderTotal}. Проверьте данные заказа в БД!`);
                        } else {
                            // Рассчитываем начисляемые баллы
                            console.log(`🔍 [PATCH partial ${id}] 5️⃣ Вызов calculateEarnedPoints с параметрами:`, {
                                orderTotal,
                                pointsUsed,
                                currentTotalSpent
                            });
                            const loyaltyPointsEarned = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calculateEarnedPoints"])(orderTotal, pointsUsed, currentTotalSpent);
                            console.log(`🔍 [PATCH partial ${id}] 6️⃣ Результат calculateEarnedPoints:`, {
                                loyaltyPointsEarned
                            });
                            console.log(`💰 Рассчитано ${loyaltyPointsEarned} баллов для заказа ${id} (orderTotal: ${orderTotal}, pointsUsed: ${pointsUsed})`);
                            if (loyaltyPointsEarned > 0) {
                                // Начисляем баллы пользователю
                                // ✅ ИСПРАВЛЕНО 2026-01-11: При partial update (только изменение статуса оплаты)
                                // баллы уже были списаны ранее, поэтому передаем pointsUsed=0
                                // чтобы не списывать их повторно в awardLoyaltyPoints
                                console.log(`🔍 [PATCH partial ${id}] 7️⃣ Вызов awardLoyaltyPoints с параметрами:`, {
                                    userId: currentOrder.user_id,
                                    orderTotal,
                                    pointsUsed: 0,
                                    loyaltyPointsEarned,
                                    orderId: id,
                                    note: 'pointsUsed=0 потому что баллы уже были списаны при создании/обновлении заказа'
                                });
                                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["awardLoyaltyPoints"])(currentOrder.user_id, orderTotal, 0, loyaltyPointsEarned, Number(id));
                                console.log(`🔍 [PATCH partial ${id}] 8️⃣ Результат awardLoyaltyPoints: успешно`);
                                // Обновляем заказ с рассчитанными баллами
                                console.log(`🔍 [PATCH partial ${id}] 9️⃣ Обновление заказа в БД:`, {
                                    orderId: id,
                                    loyalty_points_earned: loyaltyPointsEarned
                                });
                                updateData.loyalty_points_earned = loyaltyPointsEarned;
                                console.log(`✅ Начислено ${loyaltyPointsEarned} баллов пользователю ${currentOrder.user_id} при оплате заказа ${id}`);
                            } else {
                                console.log(`ℹ️ PATCH ${id}: Баллы не начислены - рассчитано 0 баллов`);
                            }
                        }
                    }
                } catch (error) {
                    console.error(`❌ Ошибка при начислении баллов при оплате:`, error);
                }
                console.log(`🔍 ========== КОНЕЦ ОТЛАДКИ НАЧИСЛЕНИЯ БАЛЛОВ (PATCH partial) ==========\n`);
            }
            // Добавляем order_status в updateData, если он указан
            if (body.orderStatus !== undefined) updateData.order_status = body.orderStatus;
            if (body.order_status !== undefined) updateData.order_status = body.order_status;
            console.log(`[PATCH /api/orders/${id}] Updating with data:`, updateData);
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateOrder"])(Number(id), updateData);
                console.log(`[PATCH /api/orders/${id}] ✅ Successfully updated, fetching full order...`);
                // ✅ ИСПРАВЛЕНО 2026-01-11: Получаем полный объект заказа из БД после обновления
                const fullOrder = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchOrderById"])(Number(id), true) // noCache для свежих данных
                ;
                if (!fullOrder) {
                    throw new Error("Order not found after update");
                }
                // ✅ ИСПРАВЛЕНО 2026-01-11: Если в fetchOrderById нет обновленных данных (кэш),
                // берем их из updateData напрямую
                // ✅ ИСПРАВЛЕНО 2026-01-11: Нормализуем формат start_date для календаря
                const normalizeStartDate = (date)=>{
                    if (!date) return "";
                    if (typeof date === "string") {
                        // Если это ISO timestamp, извлекаем только дату
                        if (date.includes("T")) {
                            return date.split("T")[0];
                        }
                        // Если это уже формат YYYY-MM-DD, возвращаем как есть
                        return date;
                    }
                    // Если это Date объект
                    if (date instanceof Date) {
                        return date.toISOString().split("T")[0];
                    }
                    return String(date);
                };
                const mergedOrder = {
                    ...fullOrder,
                    // Перезаписываем только те поля, которые мы обновили
                    ...updateData.loyalty_points_used !== undefined && {
                        loyalty_points_used: updateData.loyalty_points_used
                    },
                    ...updateData.loyalty_points_earned !== undefined && {
                        loyalty_points_earned: updateData.loyalty_points_earned
                    },
                    // ✅ Нормализуем start_date к формату YYYY-MM-DD
                    start_date: normalizeStartDate(fullOrder.start_date || fullOrder["Start Date"])
                };
                console.log(`[PATCH /api/orders/${id}] 📦 Полный заказ (merged):`, {
                    Id: mergedOrder.Id,
                    total: mergedOrder.total,
                    loyalty_points_earned: mergedOrder.loyalty_points_earned,
                    loyalty_points_used: mergedOrder.loyalty_points_used,
                    paid: mergedOrder.paid
                });
                // Получаем количество начисленных баллов для ответа
                // Приоритет: pendingPointsEarned (если были обработаны pending) или loyalty_points_earned из заказа
                const pointsEarned = pendingPointsEarned > 0 ? pendingPointsEarned : typeof mergedOrder.loyalty_points_earned === 'number' ? mergedOrder.loyalty_points_earned : parseInt(String(mergedOrder.loyalty_points_earned)) || 0;
                console.log(`[PATCH /api/orders/${id}] 📤 Возвращаем ответ:`, {
                    success: true,
                    pendingPointsEarned,
                    'mergedOrder.loyalty_points_earned': mergedOrder.loyalty_points_earned,
                    'mergedOrder.loyalty_points_used': mergedOrder.loyalty_points_used,
                    'mergedOrder.total': mergedOrder.total,
                    pointsEarned,
                    loyaltyPointsEarnedInResponse: pointsEarned > 0 ? pointsEarned : undefined
                });
                // ✅ ИСПРАВЛЕНО 2026-01-11: Возвращаем обновленный профиль пользователя
                let updatedUserProfile = undefined;
                if (currentOrder.user_id) {
                    try {
                        const updatedUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchUserById"])(currentOrder.user_id, true) // noCache для свежих данных
                        ;
                        if (updatedUser) {
                            updatedUserProfile = {
                                id: updatedUser.Id,
                                phone: updatedUser.phone,
                                name: updatedUser.name,
                                loyaltyPoints: updatedUser.loyalty_points,
                                totalSpent: updatedUser.total_spent
                            };
                            console.log(`✅ Обновленный профиль после PATCH:`, updatedUserProfile);
                        }
                    } catch (error) {
                        console.error(`❌ Ошибка загрузки обновленного профиля:`, error);
                    }
                }
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: true,
                    order: mergedOrder,
                    orderNumber: mergedOrder?.order_number ?? mergedOrder?.["Order Number"],
                    loyaltyPointsEarned: pointsEarned > 0 ? pointsEarned : undefined,
                    userProfile: updatedUserProfile
                });
            } catch (error) {
                console.error(`[PATCH /api/orders/${id}] ❌ Update failed:`, error);
                throw error;
            }
        }
    } catch (error) {
        console.error("❌ Failed to update order:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        const errorStack = error instanceof Error ? error.stack : undefined;
        console.error("Error details:", {
            errorMessage,
            errorStack
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to update order",
            details: errorMessage,
            stack: ("TURBOPACK compile-time truthy", 1) ? errorStack : "TURBOPACK unreachable"
        }, {
            status: 500
        });
    }
}
async function saveMeal(orderPersonId, day, mealTime, mealType, meal) {
    const price = getMealPriceForPortion(meal);
    const garnishPrice = meal.garnish ? getMealPriceForPortion(meal.garnish) : undefined;
    // ✅ ИСПРАВЛЕНО: Извлекаем числовую часть из meal.id, если это строка
    const cleanMealId = typeof meal.id === 'string' ? parseInt(meal.id.split('_')[0]) : meal.id;
    const cleanGarnishId = meal.garnish?.id ? typeof meal.garnish.id === 'string' ? parseInt(meal.garnish.id.split('_')[0]) : meal.garnish.id : undefined;
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createOrderMeal"])({
        order_person_id: orderPersonId,
        day,
        meal_time: mealTime,
        meal_type: mealType,
        meal_id: cleanMealId,
        portion_size: meal.portion || "single",
        price: Math.round(price),
        garnish_id: cleanGarnishId,
        garnish_portion_size: meal.garnish?.portion,
        garnish_price: garnishPrice ? Math.round(garnishPrice) : undefined
    });
}
function getMealPriceForPortion(meal) {
    // Если есть объект prices, используем его
    if (meal.prices) {
        const portion = meal.portion || "single";
        if (portion === "medium" && meal.prices.medium) return meal.prices.medium;
        if (portion === "large" && meal.prices.large) return meal.prices.large;
        return meal.prices.single;
    }
    // Иначе используем price (старый формат)
    return meal.price || 0;
}
async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        // Получаем текущий заказ для обработки баллов (БЕЗ кэша для свежих данных)
        const currentOrder = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchOrderById"])(Number(id), true);
        if (!currentOrder) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Order not found"
            }, {
                status: 404
            });
        }
        console.log(`🗑️ DELETE /api/orders/${id} - удаление заказа`, {
            order_status: currentOrder.order_status,
            user_id: currentOrder.user_id,
            loyalty_points_earned: currentOrder.loyalty_points_earned,
            "Loyalty Points Earned": currentOrder["Loyalty Points Earned"],
            loyalty_points_used: currentOrder.loyalty_points_used,
            "Loyalty Points Used": currentOrder["Loyalty Points Used"],
            paid: currentOrder.paid,
            payment_method: currentOrder.payment_method,
            allKeys: Object.keys(currentOrder).filter((k)=>k.toLowerCase().includes('loyalty') || k.toLowerCase().includes('points'))
        });
        // Проверяем, не был ли заказ уже отменен
        const wasCancelled = currentOrder.order_status === "cancelled";
        // Обработка списания баллов при отмене заказа
        if (!wasCancelled && currentOrder.user_id) {
            try {
                const wasPaid = currentOrder.paid === true || currentOrder.payment_status === "paid";
                const paymentMethod = currentOrder.payment_method || currentOrder["Payment Method"];
                const pointsEarned = typeof currentOrder.loyalty_points_earned === 'number' ? currentOrder.loyalty_points_earned : parseInt(String(currentOrder.loyalty_points_earned)) || 0;
                const pointsUsed = typeof currentOrder.loyalty_points_used === 'number' ? currentOrder.loyalty_points_used : parseInt(String(currentOrder.loyalty_points_used)) || 0;
                const orderTotal = typeof currentOrder.total === 'number' ? currentOrder.total : parseFloat(String(currentOrder.total)) || 0;
                // Если заказ был ОПЛАЧЕН - баллы уже начислены, возвращаем их
                if (wasPaid && (pointsEarned > 0 || pointsUsed > 0)) {
                    // ✅ ИСПРАВЛЕНО: Получаем ВСЕ completed транзакции для этого заказа
                    // Вместо использования pointsEarned из заказа, подсчитываем реальную сумму из транзакций
                    try {
                        const allTransactions = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchPendingTransactionsByOrder"])(Number(id));
                        let actualPointsEarned = 0;
                        let actualPointsUsed = 0;
                        for (const trans of allTransactions){
                            const transPoints = typeof trans.points === 'number' ? trans.points : parseInt(String(trans.points)) || 0;
                            if (trans.transaction_type === 'earned' && trans.transaction_status === 'completed') {
                                actualPointsEarned += transPoints;
                            } else if (trans.transaction_type === 'used' && trans.transaction_status === 'completed') {
                                actualPointsUsed += Math.abs(transPoints); // used баллы отрицательные
                            }
                        }
                        // Используем фактические значения из транзакций или fallback на поля заказа
                        const finalPointsEarned = actualPointsEarned > 0 ? actualPointsEarned : pointsEarned;
                        const finalPointsUsed = actualPointsUsed > 0 ? actualPointsUsed : pointsUsed;
                        console.log(`💰 Заказ ${id} был ОПЛАЧЕН - возвращаем баллы`, {
                            pointsEarnedFromOrder: pointsEarned,
                            pointsUsedFromOrder: pointsUsed,
                            actualPointsEarnedFromTransactions: actualPointsEarned,
                            actualPointsUsedFromTransactions: actualPointsUsed,
                            finalPointsEarned,
                            finalPointsUsed,
                            orderTotal,
                            userId: currentOrder.user_id
                        });
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["refundLoyaltyPoints"])(currentOrder.user_id, finalPointsEarned, finalPointsUsed, orderTotal, Number(id));
                        console.log(`✅ Возвращено ${finalPointsEarned} начисленных и ${finalPointsUsed} использованных баллов`);
                    } catch (error) {
                        console.error(`❌ Ошибка при получении транзакций для возврата баллов:`, error);
                        // Fallback на значения из заказа
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["refundLoyaltyPoints"])(currentOrder.user_id, pointsEarned, pointsUsed, orderTotal, Number(id));
                        console.log(`✅ Возвращено ${pointsEarned} начисленных и ${pointsUsed} использованных баллов (fallback)`);
                    }
                } else if (!wasPaid) {
                    // Заказ НЕ был оплачен - проверяем pending транзакции
                    const pendingTransactions = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchPendingTransactionsByOrder"])(Number(id));
                    console.log(`🔍 Заказ НЕ был оплачен. Найдено pending транзакций: ${pendingTransactions.length}`);
                    if (pendingTransactions.length > 0) {
                        // Отменяем pending транзакции
                        console.log(`⏳ Отменяем ${pendingTransactions.length} pending транзакций`);
                        const now = new Date().toISOString();
                        for (const transaction of pendingTransactions){
                            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateLoyaltyTransaction"])(transaction.Id, {
                                transaction_status: 'cancelled',
                                processed_at: now
                            });
                        }
                        console.log(`✅ Отменены pending транзакции для заказа ${id}`);
                    } else {
                        console.log(`ℹ️ Нет pending транзакций для неоплаченного заказа ${id}`);
                    }
                }
                // Проверяем на мошенничество, если заказ был оплачен
                if (wasPaid) {
                    console.log(`⚠️ Заказ ${id} был оплачен и отменен - проверяем на мошенничество`);
                    try {
                        const stats = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUserCancellationStats"])(currentOrder.user_id);
                        console.log(`📊 Статистика отмен для пользователя ${currentOrder.user_id}:`, stats);
                        // Если отменено 3 или более оплаченных заказов, создаем fraud alert
                        if (stats.cancelledPaidOrders >= 3) {
                            console.warn(`🚨 Обнаружено подозрительное поведение: пользователь ${currentOrder.user_id} отменил ${stats.cancelledPaidOrders} оплаченных заказов`);
                            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createFraudAlert"])(currentOrder.user_id, stats);
                            console.log(`✅ Fraud alert создан для пользователя ${currentOrder.user_id}`);
                        }
                    } catch (error) {
                        console.error(`❌ Ошибка при проверке на мошенничество:`, error);
                    // Не прерываем процесс отмены заказа
                    }
                }
            } catch (error) {
                console.error(`❌ Ошибка при списании баллов при отмене заказа:`, error);
            // Не прерываем процесс отмены заказа
            }
        }
        // Помечаем заказ как отмененный вместо удаления
        const updatedOrder = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateOrder"])(Number(id), {
            order_status: "cancelled"
        });
        // Получаем обновленный баланс пользователя после всех операций (БЕЗ кэша!)
        let updatedUserBalance = 0;
        if (currentOrder.user_id) {
            try {
                const updatedUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$nocodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchUserById"])(currentOrder.user_id, true);
                if (updatedUser) {
                    updatedUserBalance = typeof updatedUser.loyalty_points === 'number' ? updatedUser.loyalty_points : parseInt(String(updatedUser.loyalty_points)) || 0;
                    console.log(`💰 Обновленный баланс пользователя ${currentOrder.user_id}: ${updatedUserBalance} баллов`);
                }
            } catch (error) {
                console.error(`❌ Ошибка получения обновленного баланса:`, error);
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            order: updatedOrder,
            updatedLoyaltyPoints: updatedUserBalance
        });
    } catch (error) {
        console.error("Failed to cancel order:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to cancel order"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a8a4bbbe._.js.map