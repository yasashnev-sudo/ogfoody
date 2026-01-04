module.exports = [
"[project]/lib/request-logger.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Простой логгер запросов в память
__turbopack_context__.s([
    "clearLogs",
    ()=>clearLogs,
    "getRecentLogs",
    ()=>getRecentLogs,
    "logRequest",
    ()=>logRequest,
    "logResponse",
    ()=>logResponse
]);
const logs = [];
const MAX_LOGS = 50;
function logRequest(method, path, data) {
    logs.push({
        timestamp: new Date().toISOString(),
        method,
        path,
        data
    });
    // Ограничиваем размер лога
    if (logs.length > MAX_LOGS) {
        logs.shift();
    }
}
function logResponse(method, path, status, error) {
    const lastLog = logs[logs.length - 1];
    if (lastLog && lastLog.method === method && lastLog.path === path) {
        lastLog.status = status;
        if (error) {
            lastLog.error = error;
        }
    }
}
function getRecentLogs(limit = 20) {
    return logs.slice(-limit).reverse();
}
function clearLogs() {
    logs.length = 0;
}
}),
];

//# sourceMappingURL=lib_request-logger_ts_e1f3ae83._.js.map