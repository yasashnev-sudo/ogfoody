module.exports = [
"[project]/lib/nocodb.ts [app-route] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.resolve().then(() => {
        return parentImport("[project]/lib/nocodb.ts [app-route] (ecmascript)");
    });
});
}),
"[project]/lib/request-logger.ts [app-route] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/lib_request-logger_ts_e1f3ae83._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/lib/request-logger.ts [app-route] (ecmascript)");
    });
});
}),
];