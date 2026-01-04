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
"[project]/app/api/db/[...path]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
// Универсальный API Proxy для NocoDB
// Все запросы к NocoDB идут через этот route - токен никогда не попадает в браузер
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
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
// Белый список разрешенных таблиц для безопасности
const ALLOWED_TABLES = [
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
function isAllowedPath(path) {
    const tableName = path.split("/")[0];
    return ALLOWED_TABLES.includes(tableName);
}
function buildTargetUrl(baseUrl, path) {
    let cleanBaseUrl = baseUrl.replace(/\/$/, "");
    if (!cleanBaseUrl.endsWith("/api/v2")) {
        cleanBaseUrl = `${cleanBaseUrl}/api/v2`;
    }
    const parts = path.split("/");
    const tableName = parts[0];
    const tableId = getTableId(tableName);
    if (!tableId) {
        throw new Error(`Table ID not configured for "${tableName}". Set NOCODB_TABLE_${tableName.toUpperCase()} in environment variables.`);
    }
    // Если путь содержит "records", оставляем его, иначе добавляем
    if (parts.length === 1 || !parts[1]?.startsWith("records")) {
        parts[0] = tableId;
        const newPath = parts.join("/");
        return `${cleanBaseUrl}/tables/${newPath}`;
    } else {
        // Если уже есть "records" в пути, заменяем только имя таблицы
        parts[0] = tableId;
        const newPath = parts.join("/");
        return `${cleanBaseUrl}/tables/${newPath}`;
    }
}
async function proxyToNocoDB(request, path, method) {
    const nocodbUrl = getNocoDBUrl();
    const nocodbToken = getNocoDBToken();
    if (!nocodbUrl || !nocodbToken) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "NocoDB not configured",
            details: {
                urlSet: !!nocodbUrl,
                tokenSet: !!nocodbToken
            }
        }, {
            status: 503
        });
    }
    if (!isAllowedPath(path)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Access denied to this resource"
        }, {
            status: 403
        });
    }
    const tableName = path.split("/")[0];
    const tableId = getTableId(tableName);
    if (!tableId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Table not configured",
            details: `Set NOCODB_TABLE_${tableName.toUpperCase()} environment variable with the Table ID from NocoDB`,
            tableName,
            hint: "Go to NocoDB, open the table, and copy the ID from the URL (e.g., md_xxxxx)"
        }, {
            status: 503
        });
    }
    let targetUrl;
    try {
        targetUrl = buildTargetUrl(nocodbUrl, path);
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to build URL",
            details: String(error)
        }, {
            status: 503
        });
    }
    const searchParams = request.nextUrl.searchParams.toString();
    const fullUrl = searchParams ? `${targetUrl}?${searchParams}` : targetUrl;
    try {
        const headers = {
            "xc-token": nocodbToken,
            "Content-Type": "application/json"
        };
        const fetchOptions = {
            method,
            headers
        };
        if ([
            "POST",
            "PUT",
            "PATCH"
        ].includes(method)) {
            const body = await request.text();
            if (body) {
                fetchOptions.body = body;
            }
        }
        const response = await fetch(fullUrl, fetchOptions);
        const responseText = await response.text();
        let data;
        try {
            data = JSON.parse(responseText);
        } catch  {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](responseText, {
                status: response.status,
                headers: {
                    "Content-Type": "text/plain"
                }
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data, {
            status: response.status
        });
    } catch (error) {
        console.error("NocoDB proxy error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to proxy request to NocoDB",
            details: String(error)
        }, {
            status: 500
        });
    }
}
async function GET(request, { params }) {
    const { path } = await params;
    const pathString = path.join("/");
    return proxyToNocoDB(request, pathString, "GET");
}
async function POST(request, { params }) {
    const { path } = await params;
    const pathString = path.join("/");
    return proxyToNocoDB(request, pathString, "POST");
}
async function PUT(request, { params }) {
    const { path } = await params;
    const pathString = path.join("/");
    return proxyToNocoDB(request, pathString, "PUT");
}
async function PATCH(request, { params }) {
    const { path } = await params;
    const pathString = path.join("/");
    return proxyToNocoDB(request, pathString, "PATCH");
}
async function DELETE(request, { params }) {
    const { path } = await params;
    const pathString = path.join("/");
    return proxyToNocoDB(request, pathString, "DELETE");
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__838846ee._.js.map