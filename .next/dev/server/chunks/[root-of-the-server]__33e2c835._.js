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
"[project]/app/api/db/export-data/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
// API route для выгрузки всех данных из таблиц NocoDB
// Помогает проверить, что реально сохранено в базе
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
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
async function GET() {
    const NOCODB_URL = process.env.NOCODB_URL;
    const NOCODB_TOKEN = process.env.NOCODB_TOKEN;
    if (!NOCODB_URL || !NOCODB_TOKEN) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "NocoDB not configured",
            message: "NOCODB_URL и NOCODB_TOKEN должны быть установлены"
        }, {
            status: 500
        });
    }
    const baseUrl = NOCODB_URL.replace(/\/api\/v2\/?$/, "");
    const apiUrl = baseUrl.endsWith("/api/v2") ? baseUrl : `${baseUrl}/api/v2`;
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
    const results = {};
    for (const tableName of tableNames){
        const tableId = getTableId(tableName);
        if (!tableId) {
            results[tableName] = {
                status: "not_configured",
                error: `NOCODB_TABLE_${tableName.toUpperCase()} не установлен`,
                count: 0,
                data: []
            };
            continue;
        }
        try {
            const recordsUrl = `${apiUrl}/tables/${tableId}/records?limit=1000`;
            const response = await fetch(recordsUrl, {
                headers: {
                    "xc-token": NOCODB_TOKEN,
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                const errorText = await response.text();
                results[tableName] = {
                    status: "error",
                    error: `HTTP ${response.status}: ${errorText}`,
                    count: 0,
                    data: []
                };
                continue;
            }
            const data = await response.json();
            const records = data?.list || [];
            results[tableName] = {
                status: "ok",
                tableId,
                count: records.length,
                data: records,
                sample: records.length > 0 ? records[0] : null
            };
        } catch (error) {
            results[tableName] = {
                status: "error",
                error: error instanceof Error ? error.message : String(error),
                count: 0,
                data: []
            };
        }
    }
    // Подсчитываем общую статистику
    const stats = {
        totalTables: tableNames.length,
        configuredTables: Object.values(results).filter((r)=>r.status !== "not_configured").length,
        accessibleTables: Object.values(results).filter((r)=>r.status === "ok").length,
        totalRecords: Object.values(results).reduce((sum, r)=>sum + (r.count || 0), 0),
        tablesWithData: Object.values(results).filter((r)=>r.status === "ok" && r.count > 0).length
    };
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: true,
        timestamp: new Date().toISOString(),
        stats,
        tables: results,
        summary: {
            message: `Найдено ${stats.totalRecords} записей в ${stats.tablesWithData} таблицах`,
            emptyTables: tableNames.filter((name)=>results[name]?.status === "ok" && results[name]?.count === 0),
            tablesWithData: tableNames.filter((name)=>results[name]?.status === "ok" && results[name]?.count > 0)
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__33e2c835._.js.map