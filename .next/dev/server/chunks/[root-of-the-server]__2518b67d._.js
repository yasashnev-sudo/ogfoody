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
"[project]/app/api/db/setup-tables/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
// API route для автоматического создания таблиц в NocoDB
// Создает все необходимые таблицы с правильной структурой
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
const tableDefinitions = {
    Meals: [
        {
            column_name: "Id",
            title: "Id",
            uidt: "ID",
            pk: true,
            ai: true
        },
        {
            column_name: "name",
            title: "Название",
            uidt: "SingleLineText",
            rqd: true
        },
        {
            column_name: "category",
            title: "Категория",
            uidt: "SingleLineText",
            rqd: true
        },
        {
            column_name: "ingredients",
            title: "Ингредиенты",
            uidt: "LongText",
            rqd: true
        },
        {
            column_name: "description",
            title: "Описание",
            uidt: "LongText",
            rqd: false
        },
        {
            column_name: "price_single",
            title: "Цена (стандарт)",
            uidt: "Decimal",
            rqd: false
        },
        {
            column_name: "price_medium",
            title: "Цена (средний)",
            uidt: "Decimal",
            rqd: false
        },
        {
            column_name: "price_large",
            title: "Цена (большой)",
            uidt: "Decimal",
            rqd: false
        },
        {
            column_name: "weight_single",
            title: "Вес (стандарт)",
            uidt: "Number",
            rqd: false
        },
        {
            column_name: "weight_medium",
            title: "Вес (средний)",
            uidt: "Number",
            rqd: false
        },
        {
            column_name: "weight_large",
            title: "Вес (большой)",
            uidt: "Number",
            rqd: false
        },
        {
            column_name: "image",
            title: "Изображение",
            uidt: "Attachment",
            rqd: false
        },
        {
            column_name: "available",
            title: "Доступно",
            uidt: "Checkbox",
            rqd: false,
            cdf: "true"
        },
        {
            column_name: "needs_garnish",
            title: "Нужен гарнир",
            uidt: "Checkbox",
            rqd: false,
            cdf: "false"
        },
        {
            column_name: "calories",
            title: "Калории",
            uidt: "Number",
            rqd: false
        },
        {
            column_name: "protein",
            title: "Белки",
            uidt: "Decimal",
            rqd: false
        },
        {
            column_name: "fats",
            title: "Жиры",
            uidt: "Decimal",
            rqd: false
        },
        {
            column_name: "carbs",
            title: "Углеводы",
            uidt: "Decimal",
            rqd: false
        },
        {
            column_name: "is_current_week",
            title: "Текущая неделя",
            uidt: "Checkbox",
            rqd: false
        },
        {
            column_name: "is_next_week",
            title: "Следующая неделя",
            uidt: "Checkbox",
            rqd: false
        }
    ],
    Extras: [
        {
            column_name: "Id",
            title: "Id",
            uidt: "ID",
            pk: true,
            ai: true
        },
        {
            column_name: "name",
            title: "Название",
            uidt: "SingleLineText",
            rqd: true
        },
        {
            column_name: "category",
            title: "Категория",
            uidt: "SingleLineText",
            rqd: true
        },
        {
            column_name: "ingredients",
            title: "Ингредиенты",
            uidt: "LongText",
            rqd: false
        },
        {
            column_name: "description",
            title: "Описание",
            uidt: "LongText",
            rqd: false
        },
        {
            column_name: "price",
            title: "Цена",
            uidt: "Decimal",
            rqd: true
        },
        {
            column_name: "image",
            title: "Изображение",
            uidt: "Attachment",
            rqd: false
        },
        {
            column_name: "available",
            title: "Доступно",
            uidt: "Checkbox",
            rqd: false,
            cdf: "true"
        },
        {
            column_name: "calories",
            title: "Калории",
            uidt: "Number",
            rqd: false
        },
        {
            column_name: "protein",
            title: "Белки",
            uidt: "Decimal",
            rqd: false
        },
        {
            column_name: "fats",
            title: "Жиры",
            uidt: "Decimal",
            rqd: false
        },
        {
            column_name: "carbs",
            title: "Углеводы",
            uidt: "Decimal",
            rqd: false
        },
        {
            column_name: "weight",
            title: "Вес",
            uidt: "Number",
            rqd: false
        }
    ],
    Delivery_Zones: [
        {
            column_name: "Id",
            title: "Id",
            uidt: "ID",
            pk: true,
            ai: true
        },
        {
            column_name: "city",
            title: "Город",
            uidt: "SingleLineText",
            rqd: true
        },
        {
            column_name: "district",
            title: "Район",
            uidt: "SingleLineText",
            rqd: false
        },
        {
            column_name: "delivery_fee",
            title: "Стоимость доставки",
            uidt: "Decimal",
            rqd: true
        },
        {
            column_name: "min_order_amount",
            title: "Минимальная сумма заказа",
            uidt: "Decimal",
            rqd: true
        },
        {
            column_name: "is_available",
            title: "Доступно",
            uidt: "Checkbox",
            rqd: false,
            cdf: "true"
        },
        {
            column_name: "available_intervals",
            title: "Доступные интервалы",
            uidt: "JSON",
            rqd: false
        }
    ],
    Users: [
        {
            column_name: "Id",
            title: "Id",
            uidt: "ID",
            pk: true,
            ai: true
        },
        {
            column_name: "phone",
            title: "Телефон",
            uidt: "PhoneNumber",
            rqd: true,
            un: true
        },
        {
            column_name: "password_hash",
            title: "Хеш пароля",
            uidt: "SingleLineText",
            rqd: false
        },
        {
            column_name: "name",
            title: "Имя",
            uidt: "SingleLineText",
            rqd: true
        },
        {
            column_name: "additional_phone",
            title: "Дополнительный телефон",
            uidt: "PhoneNumber",
            rqd: false
        },
        {
            column_name: "street",
            title: "Улица",
            uidt: "SingleLineText",
            rqd: false
        },
        {
            column_name: "building",
            title: "Дом",
            uidt: "SingleLineText",
            rqd: false
        },
        {
            column_name: "building_section",
            title: "Корпус/Секция",
            uidt: "SingleLineText",
            rqd: false
        },
        {
            column_name: "apartment",
            title: "Квартира",
            uidt: "SingleLineText",
            rqd: false
        },
        {
            column_name: "entrance",
            title: "Подъезд",
            uidt: "SingleLineText",
            rqd: false
        },
        {
            column_name: "floor",
            title: "Этаж",
            uidt: "SingleLineText",
            rqd: false
        },
        {
            column_name: "intercom",
            title: "Домофон",
            uidt: "SingleLineText",
            rqd: false
        },
        {
            column_name: "district",
            title: "Район",
            uidt: "SingleLineText",
            rqd: false
        },
        {
            column_name: "delivery_comment",
            title: "Комментарий к доставке",
            uidt: "LongText",
            rqd: false
        },
        {
            column_name: "loyalty_points",
            title: "Баллы лояльности",
            uidt: "Number",
            rqd: true,
            cdf: "0"
        },
        {
            column_name: "total_spent",
            title: "Всего потрачено",
            uidt: "Decimal",
            rqd: true,
            cdf: "0"
        }
    ],
    Orders: [
        {
            column_name: "Id",
            title: "Id",
            uidt: "ID",
            pk: true,
            ai: true
        },
        {
            column_name: "user_id",
            title: "ID пользователя",
            uidt: "Number",
            rqd: false
        },
        {
            column_name: "order_number",
            title: "Номер заказа",
            uidt: "SingleLineText",
            rqd: true,
            un: true
        },
        {
            column_name: "start_date",
            title: "Дата начала",
            uidt: "Date",
            rqd: true
        },
        {
            column_name: "delivery_time",
            title: "Время доставки",
            uidt: "SingleLineText",
            rqd: true
        },
        {
            column_name: "status",
            title: "Статус",
            uidt: "SingleLineText",
            rqd: true,
            cdf: "pending"
        },
        {
            column_name: "payment_method",
            title: "Способ оплаты",
            uidt: "SingleLineText",
            rqd: true,
            cdf: "cash"
        },
        {
            column_name: "paid",
            title: "Оплачено",
            uidt: "Checkbox",
            rqd: false,
            cdf: "false"
        },
        {
            column_name: "paid_at",
            title: "Дата оплаты",
            uidt: "DateTime",
            rqd: false
        },
        {
            column_name: "delivered",
            title: "Доставлено",
            uidt: "Checkbox",
            rqd: false,
            cdf: "false"
        },
        {
            column_name: "cancelled",
            title: "Отменено",
            uidt: "Checkbox",
            rqd: false,
            cdf: "false"
        },
        {
            column_name: "promo_code",
            title: "Промокод",
            uidt: "SingleLineText",
            rqd: false
        },
        {
            column_name: "promo_discount",
            title: "Скидка по промокоду",
            uidt: "Decimal",
            rqd: false
        },
        {
            column_name: "loyalty_points_used",
            title: "Использовано баллов",
            uidt: "Number",
            rqd: true,
            cdf: "0"
        },
        {
            column_name: "loyalty_points_earned",
            title: "Заработано баллов",
            uidt: "Number",
            rqd: true,
            cdf: "0"
        },
        {
            column_name: "subtotal",
            title: "Подытог",
            uidt: "Decimal",
            rqd: true,
            cdf: "0"
        },
        {
            column_name: "total",
            title: "Итого",
            uidt: "Decimal",
            rqd: true,
            cdf: "0"
        },
        {
            column_name: "guest_phone",
            title: "Телефон гостя",
            uidt: "PhoneNumber",
            rqd: false
        },
        {
            column_name: "guest_address",
            title: "Адрес гостя",
            uidt: "LongText",
            rqd: false
        }
    ],
    Order_Persons: [
        {
            column_name: "Id",
            title: "Id",
            uidt: "ID",
            pk: true,
            ai: true
        },
        {
            column_name: "order_id",
            title: "ID заказа",
            uidt: "Number",
            rqd: true
        },
        {
            column_name: "person_number",
            title: "Номер персоны",
            uidt: "Number",
            rqd: true
        }
    ],
    Order_Meals: [
        {
            column_name: "Id",
            title: "Id",
            uidt: "ID",
            pk: true,
            ai: true
        },
        {
            column_name: "order_person_id",
            title: "ID персоны заказа",
            uidt: "Number",
            rqd: true
        },
        {
            column_name: "day",
            title: "День",
            uidt: "SingleLineText",
            rqd: true
        },
        {
            column_name: "meal_time",
            title: "Время приема пищи",
            uidt: "SingleLineText",
            rqd: true
        },
        {
            column_name: "meal_type",
            title: "Тип блюда",
            uidt: "SingleLineText",
            rqd: true
        },
        {
            column_name: "meal_id",
            title: "ID блюда",
            uidt: "Number",
            rqd: true
        },
        {
            column_name: "portion_size",
            title: "Размер порции",
            uidt: "SingleLineText",
            rqd: true
        },
        {
            column_name: "price",
            title: "Цена",
            uidt: "Decimal",
            rqd: true
        },
        {
            column_name: "garnish_id",
            title: "ID гарнира",
            uidt: "Number",
            rqd: false
        },
        {
            column_name: "garnish_portion_size",
            title: "Размер порции гарнира",
            uidt: "SingleLineText",
            rqd: false
        },
        {
            column_name: "garnish_price",
            title: "Цена гарнира",
            uidt: "Decimal",
            rqd: false
        }
    ],
    Order_Extras: [
        {
            column_name: "Id",
            title: "Id",
            uidt: "ID",
            pk: true,
            ai: true
        },
        {
            column_name: "order_id",
            title: "ID заказа",
            uidt: "Number",
            rqd: true
        },
        {
            column_name: "extra_id",
            title: "ID дополнения",
            uidt: "Number",
            rqd: true
        },
        {
            column_name: "quantity",
            title: "Количество",
            uidt: "Number",
            rqd: true,
            cdf: "1"
        },
        {
            column_name: "price",
            title: "Цена",
            uidt: "Decimal",
            rqd: true
        }
    ],
    Promo_Codes: [
        {
            column_name: "Id",
            title: "Id",
            uidt: "ID",
            pk: true,
            ai: true
        },
        {
            column_name: "code",
            title: "Код",
            uidt: "SingleLineText",
            rqd: true,
            un: true
        },
        {
            column_name: "discount_type",
            title: "Тип скидки",
            uidt: "SingleLineText",
            rqd: true
        },
        {
            column_name: "discount_value",
            title: "Значение скидки",
            uidt: "Decimal",
            rqd: true
        },
        {
            column_name: "min_order_amount",
            title: "Минимальная сумма заказа",
            uidt: "Decimal",
            rqd: false
        },
        {
            column_name: "max_discount",
            title: "Максимальная скидка",
            uidt: "Decimal",
            rqd: false
        },
        {
            column_name: "valid_from",
            title: "Действителен с",
            uidt: "Date",
            rqd: false
        },
        {
            column_name: "valid_until",
            title: "Действителен до",
            uidt: "Date",
            rqd: false
        },
        {
            column_name: "usage_limit",
            title: "Лимит использований",
            uidt: "Number",
            rqd: false
        },
        {
            column_name: "times_used",
            title: "Использовано раз",
            uidt: "Number",
            rqd: true,
            cdf: "0"
        },
        {
            column_name: "active",
            title: "Активен",
            uidt: "Checkbox",
            rqd: false,
            cdf: "true"
        }
    ],
    Reviews: [
        {
            column_name: "Id",
            title: "Id",
            uidt: "ID",
            pk: true,
            ai: true
        },
        {
            column_name: "order_id",
            title: "ID заказа",
            uidt: "Number",
            rqd: true
        },
        {
            column_name: "user_id",
            title: "ID пользователя",
            uidt: "Number",
            rqd: true
        },
        {
            column_name: "rating",
            title: "Оценка",
            uidt: "Number",
            rqd: true
        },
        {
            column_name: "text",
            title: "Текст отзыва",
            uidt: "LongText",
            rqd: false
        }
    ]
};
async function createTable(baseUrl, token, baseId, tableName, columns) {
    try {
        // Сначала проверяем, существует ли таблица
        const tablesUrl = `${baseUrl}/api/v2/meta/bases/${baseId}/tables`;
        const tablesResponse = await fetch(tablesUrl, {
            headers: {
                "xc-token": token,
                "Content-Type": "application/json"
            }
        });
        if (tablesResponse.ok) {
            const tablesData = await tablesResponse.json();
            const existingTable = tablesData?.list?.find((t)=>t.title === tableName || t.table_name === tableName.toLowerCase().replace(/_/g, ""));
            if (existingTable) {
                return {
                    success: true,
                    tableId: existingTable.id
                };
            }
        }
        // Создаем таблицу
        const createTableUrl = `${baseUrl}/api/v2/meta/bases/${baseId}/tables`;
        const createResponse = await fetch(createTableUrl, {
            method: "POST",
            headers: {
                "xc-token": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                table_name: tableName.toLowerCase().replace(/_/g, ""),
                title: tableName,
                columns: columns.map((col)=>({
                        column_name: col.column_name,
                        title: col.title,
                        uidt: col.uidt,
                        dt: col.dt,
                        rqd: col.rqd || false,
                        pk: col.pk || false,
                        ai: col.ai || false,
                        cdf: col.cdf,
                        un: col.un || false,
                        dtx: col.dtx,
                        ct: col.ct,
                        meta: col.meta || {}
                    }))
            })
        });
        if (!createResponse.ok) {
            const errorText = await createResponse.text();
            return {
                success: false,
                error: `Failed to create table: ${createResponse.status} - ${errorText}`
            };
        }
        const tableData = await createResponse.json();
        return {
            success: true,
            tableId: tableData.id
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
        };
    }
}
async function POST() {
    const NOCODB_URL = process.env.NOCODB_URL;
    const NOCODB_TOKEN = process.env.NOCODB_TOKEN;
    const NOCODB_BASE_ID = process.env.NOCODB_PROJECT_ID || process.env.NOCODB_BASE_ID;
    if (!NOCODB_URL || !NOCODB_TOKEN) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "NocoDB not configured",
            message: "NOCODB_URL и NOCODB_TOKEN должны быть установлены"
        }, {
            status: 500
        });
    }
    if (!NOCODB_BASE_ID) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "NOCODB_BASE_ID not configured",
            message: "NOCODB_PROJECT_ID или NOCODB_BASE_ID должны быть установлены"
        }, {
            status: 500
        });
    }
    const baseUrl = NOCODB_URL.replace(/\/api\/v2\/?$/, "");
    const results = {};
    const createdTableIds = {};
    // Создаем каждую таблицу
    for (const [tableName, columns] of Object.entries(tableDefinitions)){
        const result = await createTable(baseUrl, NOCODB_TOKEN, NOCODB_BASE_ID, tableName, columns);
        results[tableName] = result;
        if (result.success && result.tableId) {
            createdTableIds[tableName] = result.tableId;
        }
    }
    // Формируем переменные окружения для обновления
    const envVars = Object.entries(createdTableIds).map(([name, id])=>`NOCODB_TABLE_${name.toUpperCase()}=${id}`).join("\n");
    const summary = {
        total: Object.keys(tableDefinitions).length,
        created: Object.values(results).filter((r)=>r.success).length,
        errors: Object.values(results).filter((r)=>!r.success).length,
        existing: Object.values(results).filter((r)=>r.success && !r.tableId).length
    };
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: summary.errors === 0,
        summary,
        results,
        createdTableIds,
        envVars,
        instructions: `
Обновите переменные окружения следующими значениями:

${envVars}

Или скопируйте и вставьте в ваш .env файл или настройки Vercel.
    `.trim()
    });
}
async function GET() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        message: "Используйте POST запрос для создания таблиц",
        tables: Object.keys(tableDefinitions),
        endpoint: "POST /api/db/setup-tables"
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2518b67d._.js.map