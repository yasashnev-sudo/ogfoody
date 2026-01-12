(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/order-modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OrderModal",
    ()=>OrderModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minus.js [app-client] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/tag.js [app-client] (ecmascript) <export default as Tag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/truck.js [app-client] (ecmascript) <export default as Truck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sunrise$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sunrise$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sunrise.js [app-client] (ecmascript) <export default as Sunrise>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wand$2d$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wand2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wand-sparkles.js [app-client] (ecmascript) <export default as Wand2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$receipt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Receipt$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/receipt.js [app-client] (ecmascript) <export default as Receipt>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$coins$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Coins$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/coins.js [app-client] (ecmascript) <export default as Coins>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$meal$2d$selector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/meal-selector.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$extras$2d$selector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/extras-selector.tsx [app-client] (ecmascript)");
// Added new hooks and utils
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$menu$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-menu.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$menu$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/menu-utils.ts [app-client] (ecmascript)");
// Added getMealPrice helper
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-toast.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$warning$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/warning-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert-dialog.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
const formatDateKey = (date)=>{
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};
const formatDisplayDate = (date)=>{
    const months = [
        "янв",
        "фев",
        "мар",
        "апр",
        "мая",
        "июн",
        "июл",
        "авг",
        "сен",
        "окт",
        "ноя",
        "дек"
    ];
    return `${date.getDate()} ${months[date.getMonth()]}` // Using toLocaleDateString for consistency
    ;
};
const formatFullDate = (date)=>{
    const days = [
        "воскресенье",
        "понедельник",
        "вторник",
        "среда",
        "четверг",
        "пятница",
        "суббота"
    ];
    const months = [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря"
    ];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}` // Using toLocaleDateString for consistency
    ;
};
const getDateObject = (date)=>{
    if (date instanceof Date) return date;
    if (typeof date === "string" && date.includes("-")) {
        const [year, month, day] = date.split("-").map(Number);
        return new Date(year, month - 1, day);
    }
    return new Date(date);
};
const createEmptyDayMeals = ()=>({
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
    });
const ensureFullMealStructure = (meal)=>{
    if (!meal) return {
        salad: null,
        soup: null,
        main: null
    };
    return {
        salad: meal.salad ?? null,
        soup: meal.soup ?? null,
        main: meal.main ?? null
    };
};
const ensureBreakfastStructure = (breakfast)=>{
    if (!breakfast) return {
        dish: null
    };
    return {
        dish: breakfast.dish ?? null
    };
};
const ensureDayMealsStructure = (day)=>{
    if (!day) return createEmptyDayMeals();
    return {
        breakfast: ensureBreakfastStructure(day.breakfast),
        lunch: ensureFullMealStructure(day.lunch),
        dinner: ensureFullMealStructure(day.dinner)
    };
};
function OrderModal({ date, existingOrder, onClose, onSave, onCancel, allOrders, onPaymentSuccess, userLoyaltyPoints = 0, isAuthenticated = false, onRequestAuth, onRequestPayment, userAddress, userCity, open, isDataLoading = false, userProfile }) {
    _s();
    // ✅ ДОБАВЛЕНО 2026-01-11: Логирование props для отладки
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OrderModal.useEffect": ()=>{
            if (open) {
                console.log('🪟 OrderModal открыт:', {
                    date: date.toISOString().split('T')[0],
                    existingOrderId: existingOrder?.id,
                    existingOrderDate: existingOrder?.startDate
                });
            }
        }
    }["OrderModal.useEffect"], [
        open,
        date,
        existingOrder
    ]);
    const cityLower = (userCity || "").toLowerCase();
    const isInDeliveryZone = cityLower.includes("санкт-петербург") || cityLower.includes("спб") || !userCity;
    const weekType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$menu$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWeekTypeForDate"])(date);
    const { meals: menuData, extras: availableExtras, deliveryTimes: rawDeliveryTimes } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$menu$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMenu"])(weekType);
    // Убеждаемся, что deliveryTimes всегда массив
    const deliveryTimes = Array.isArray(rawDeliveryTimes) ? rawDeliveryTimes : [];
    const getInitialPersons = ()=>{
        return existingOrder?.persons?.map((p)=>({
                id: p.id,
                day1: ensureDayMealsStructure(p.day1),
                day2: ensureDayMealsStructure(p.day2)
            })) || [
            {
                id: 1,
                day1: createEmptyDayMeals(),
                day2: createEmptyDayMeals()
            }
        ];
    };
    const [persons, setPersons] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(getInitialPersons());
    const [deliveryTime, setDeliveryTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(existingOrder?.deliveryTime || "");
    const [extras, setExtras] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(existingOrder?.extras || []);
    const [confirmFillPersonId, setConfirmFillPersonId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Обновляем deliveryTime когда deliveryTimes загрузится или изменится
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OrderModal.useEffect": ()=>{
            if (!existingOrder?.deliveryTime && deliveryTimes.length > 0 && !deliveryTime) {
                setDeliveryTime(deliveryTimes[0]);
            }
        }
    }["OrderModal.useEffect"], [
        deliveryTimes.length,
        deliveryTimes.join(","),
        existingOrder?.deliveryTime,
        deliveryTime
    ]);
    const [isProcessingPayment, setIsProcessingPayment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [promoCode, setPromoCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [appliedPromo, setAppliedPromo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showCancelConfirm, setShowCancelConfirm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [fillTimestamp, setFillTimestamp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [activeSectionId, setActiveSectionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showFloatingButton, setShowFloatingButton] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Warning dialog state
    const [warningDialog, setWarningDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        open: false,
        title: "",
        description: "",
        variant: "error"
    });
    const scrollContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const footerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const showWarning = (title, description, variant = "error")=>{
        setWarningDialog({
            open: true,
            title,
            description,
            variant
        });
    };
    // Функция для показа предупреждения при попытке выбрать блюдо в заблокированном заказе
    const showBlockedWarning = ()=>{
        if (isPaid) {
            showWarning("Заказ оплачен", "Редактирование оплаченного заказа недоступно. Вы можете просматривать блюда, но не можете их изменять.", "info");
        } else if (isToday) {
            showWarning("Доставка сегодня", "Редактирование заказа в день доставки недоступно. Вы можете просматривать блюда, но не можете их изменять.", "warning");
        } else if (isPastDate) {
            showWarning("Прошедшая дата", "Редактирование заказа на прошедшую дату недоступно. Вы можете просматривать блюда, но не можете их изменять.", "warning");
        }
    };
    const closeWarning = ()=>{
        setWarningDialog((prev)=>({
                ...prev,
                open: false
            }));
    };
    const selectedDate = date // Use the date prop directly for formatting
    ;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OrderModal.useEffect": ()=>{
            if (open) {
                // Reset to initial values when modal opens with new date/order
                const newPersons = existingOrder?.persons?.map({
                    "OrderModal.useEffect": (p)=>({
                            id: p.id,
                            day1: ensureDayMealsStructure(p.day1),
                            day2: ensureDayMealsStructure(p.day2)
                        })
                }["OrderModal.useEffect"]) || [
                    {
                        id: 1,
                        day1: createEmptyDayMeals(),
                        day2: createEmptyDayMeals()
                    }
                ];
                setPersons(newPersons);
                setDeliveryTime(existingOrder?.deliveryTime || deliveryTimes[0] || "");
                setExtras(existingOrder?.extras || []);
                setPromoCode("");
                setAppliedPromo(null);
                setConfirmFillPersonId(null);
                setShowCancelConfirm(false);
                setIsProcessingPayment(false);
                // Initial active section: null to avoid auto-scroll on open
                setActiveSectionId(null);
                setShowFloatingButton(false);
            }
        }
    }["OrderModal.useEffect"], [
        open,
        date.getTime(),
        existingOrder?.id,
        deliveryTimes.length,
        deliveryTimes.join(",")
    ]);
    const dateKey = formatDateKey(date);
    const hasAnyMeal = persons.some((person)=>{
        return [
            "day1",
            "day2"
        ].some((day)=>{
            const d = person[day];
            if (!d) return false;
            const breakfast = ensureBreakfastStructure(d.breakfast);
            const lunch = ensureFullMealStructure(d.lunch);
            const dinner = ensureFullMealStructure(d.dinner);
            return breakfast.dish || lunch.salad || lunch.soup || lunch.main || dinner.salad || dinner.soup || dinner.main;
        });
    });
    const hasContent = hasAnyMeal || extras.length > 0;
    // Track scroll to hide/show floating button
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OrderModal.useEffect": ()=>{
            const container = scrollContainerRef.current;
            if (!container || !open) return;
            const handleScroll = {
                "OrderModal.useEffect.handleScroll": ()=>{
                    if (!hasContent) {
                        setShowFloatingButton(false);
                        return;
                    }
                    const footer = footerRef.current;
                    if (footer) {
                        const footerRect = footer.getBoundingClientRect();
                        const containerRect = container.getBoundingClientRect();
                        // Hide if footer is visible in the viewport of the container
                        const isFooterVisible = footerRect.top < containerRect.bottom - 20;
                        setShowFloatingButton(!isFooterVisible);
                    } else {
                        setShowFloatingButton(true);
                    }
                }
            }["OrderModal.useEffect.handleScroll"];
            container.addEventListener("scroll", handleScroll);
            // Initial check
            setTimeout(handleScroll, 100);
            return ({
                "OrderModal.useEffect": ()=>container.removeEventListener("scroll", handleScroll)
            })["OrderModal.useEffect"];
        }
    }["OrderModal.useEffect"], [
        open,
        hasContent,
        persons,
        extras
    ]);
    const calculateTotal = ()=>{
        let total = 0;
        persons.forEach((person)=>{
            ;
            [
                "day1",
                "day2"
            ].forEach((day)=>{
                const d = person[day];
                if (!d) return;
                const breakfast = ensureBreakfastStructure(d.breakfast);
                const lunch = ensureFullMealStructure(d.lunch);
                const dinner = ensureFullMealStructure(d.dinner);
                if (breakfast.dish) {
                    total += (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMealPrice"])(breakfast.dish, breakfast.dish.portion);
                }
                if (lunch.salad) total += (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMealPrice"])(lunch.salad, lunch.salad.portion);
                if (lunch.soup) total += (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMealPrice"])(lunch.soup, lunch.soup.portion);
                if (lunch.main) {
                    total += (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMealPrice"])(lunch.main, lunch.main.portion);
                    if (lunch.main.garnish) total += (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMealPrice"])(lunch.main.garnish, lunch.main.garnish.portion);
                }
                if (dinner.salad) total += (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMealPrice"])(dinner.salad, dinner.salad.portion);
                if (dinner.soup) total += (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMealPrice"])(dinner.soup, dinner.soup.portion);
                if (dinner.main) {
                    total += (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMealPrice"])(dinner.main, dinner.main.portion);
                    if (dinner.main.garnish) total += (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMealPrice"])(dinner.main.garnish, dinner.main.garnish.portion);
                }
            });
        });
        extras.forEach((extra)=>{
            total += extra.price * extra.quantity;
        });
        return total;
    };
    const totalBeforeDiscount = calculateTotal();
    const maxPointsDiscount = Math.min(userLoyaltyPoints, Math.floor(totalBeforeDiscount * 0.5));
    const pointsDiscount = 0 // ✅ Баллы теперь только в PaymentModal
    ;
    const finalTotal = Math.max(0, totalBeforeDiscount - pointsDiscount - (appliedPromo?.discount || 0));
    const handlePayAndOrder = async ()=>{
        if (!hasContent) {
            return;
        }
        // Проверяем, можно ли редактировать заказ
        if (!canEdit && existingOrder) {
            showBlockedWarning();
            return;
        }
        if (!isAuthenticated) {
            if (onRequestAuth) {
                // ✅ ИСПРАВЛЕНО 2026-01-11: НЕ используем existingOrder для нового заказа!
                // existingOrder может быть "старым" из-за асинхронного обновления props
                const order = {
                    startDate: formatDateKey(date),
                    persons,
                    delivered: false,
                    deliveryTime,
                    extras,
                    subtotal: totalBeforeDiscount,
                    total: finalTotal,
                    paid: false,
                    cancelled: false
                };
                console.log('🔍 [OrderModal] Вызываем onRequestAuth с order:', {
                    subtotal: order.subtotal,
                    total: order.total,
                    personsCount: order.persons?.length,
                    // ✅ ДОБАВЛЕНО 2026-01-11: Детальная информация о persons
                    persons: order.persons?.map((p)=>({
                            id: p.id,
                            hasDay1: !!p.day1,
                            hasDay2: !!p.day2,
                            day1Meals: p.day1 ? {
                                hasBreakfast: !!p.day1.breakfast?.dish,
                                hasLunch: !!(p.day1.lunch?.salad || p.day1.lunch?.soup || p.day1.lunch?.main),
                                hasDinner: !!(p.day1.dinner?.salad || p.day1.dinner?.soup || p.day1.dinner?.main)
                            } : null,
                            day2Meals: p.day2 ? {
                                hasBreakfast: !!p.day2.breakfast?.dish,
                                hasLunch: !!(p.day2.lunch?.salad || p.day2.lunch?.soup || p.day2.lunch?.main),
                                hasDinner: !!(p.day2.dinner?.salad || p.day2.dinner?.soup || p.day2.dinner?.main)
                            } : null
                        }))
                });
                onRequestAuth(order, finalTotal);
            }
            return;
        }
        if (!isInDeliveryZone) {
            toast({
                title: "Доставка недоступна",
                description: "К сожалению, мы пока не доставляем в ваш район. Доступна доставка только по Санкт-Петербургу.",
                variant: "destructive"
            });
            return;
        }
        // ✅ Для нового заказа → вызываем onRequestAuth или onRequestPayment
        if (!existingOrder) {
            const order = {
                startDate: formatDateKey(date),
                persons,
                delivered: false,
                deliveryTime,
                extras,
                subtotal: totalBeforeDiscount,
                total: finalTotal,
                paid: false,
                cancelled: false
            };
            // onRequestAuth внутри app/page.tsx сам разберется:
            // - проверит профиль
            // - откроет ProfileModal если нужно
            // - или откроет PaymentModal если профиль полный
            if (onRequestAuth) {
                onRequestAuth(order, finalTotal);
            } else if (onRequestPayment) {
                // Если onRequestAuth нет, пытаемся вызвать onRequestPayment
                onRequestPayment(order, finalTotal);
            }
            return;
        }
        // ✅ Для существующего заказа - сохраняем изменения
        setIsProcessingPayment(true);
        const order = {
            ...existingOrder?.id ? {
                id: existingOrder.id
            } : {},
            ...existingOrder?.orderNumber ? {
                orderNumber: existingOrder.orderNumber
            } : {},
            startDate: formatDateKey(date),
            persons,
            delivered: existingOrder?.delivered ?? false,
            deliveryTime,
            extras,
            subtotal: totalBeforeDiscount,
            total: finalTotal,
            paid: existingOrder?.paid ?? false,
            cancelled: existingOrder?.cancelled ?? false,
            promoCode: appliedPromo?.code,
            promoDiscount: appliedPromo?.discount,
            loyaltyPointsUsed: pointsDiscount > 0 ? pointsDiscount : undefined
        };
        onSave(order);
        if (onPaymentSuccess) {
            onPaymentSuccess(order);
        }
        setIsProcessingPayment(false);
    };
    const addPerson = ()=>{
        const newId = persons.length + 1;
        const newPerson = {
            id: newId,
            day1: createEmptyDayMeals(),
            day2: createEmptyDayMeals()
        };
        setPersons([
            ...persons,
            newPerson
        ]);
        // Auto-scroll to the new person's first meal
        setActiveSectionId(`section-breakfast-${newId}-1-daily-day1-breakfast`);
    };
    const removePerson = (personId)=>{
        if (persons.length > 1) {
            setPersons(persons.filter((p)=>p.id !== personId));
        }
    };
    const updateBreakfast = (personId, day, breakfast)=>{
        setPersons(persons.map((p)=>p.id === personId ? {
                ...p,
                [day]: {
                    ...p[day],
                    breakfast
                }
            } : p));
    };
    const updateLunch = (personId, day, lunch)=>{
        setPersons(persons.map((p)=>p.id === personId ? {
                ...p,
                [day]: {
                    ...p[day],
                    lunch
                }
            } : p));
    };
    const updateDinner = (personId, day, dinner)=>{
        setPersons(persons.map((p)=>p.id === personId ? {
                ...p,
                [day]: {
                    ...p[day],
                    dinner
                }
            } : p));
    };
    const handleCancelClick = ()=>{
        setShowCancelConfirm(true);
    };
    const handleConfirmCancel = ()=>{
        if (existingOrder && onCancel) {
            onCancel(existingOrder);
            setShowCancelConfirm(false);
            onClose();
        // Warning dialog will be shown by handleCancelOrder in parent component
        }
    };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const orderStartDate = existingOrder ? getDateObject(existingOrder.startDate) : null;
    if (orderStartDate) {
        orderStartDate.setHours(0, 0, 0, 0);
    }
    // Можно отменить заказ, если:
    // 1. Заказ существует
    // 2. Дата доставки >= сегодня (включая сегодня)
    const canCancel = !!(existingOrder && orderStartDate && orderStartDate.getTime() >= today.getTime());
    // Режим только просмотра для прошедших дат и дня доставки
    const selectedDateNormalized = new Date(date);
    selectedDateNormalized.setHours(0, 0, 0, 0);
    // Для существующих заказов проверяем дату начала заказа (startDate)
    // Для новых заказов проверяем выбранную дату (date)
    const orderDate = existingOrder?.startDate ? getDateObject(existingOrder.startDate) : selectedDateNormalized;
    orderDate.setHours(0, 0, 0, 0);
    // Блокируем редактирование для заказов на прошедшие даты и на сегодняшний день
    const isPastDate = orderDate < today;
    const isToday = orderDate.getTime() === today.getTime();
    const isViewOnly = isPastDate || isToday;
    // Блокируем редактирование для ВСЕХ оплаченных заказов, независимо от способа оплаты
    const isPaid = existingOrder?.paid === true || existingOrder?.paymentStatus === "paid";
    const isPaidWithCard = isPaid && existingOrder?.paymentMethod !== "cash";
    const canEdit = !isViewOnly && !isPaid;
    const isExistingOrder = !!existingOrder;
    const fillRandomMeals = (personId)=>{
        const getRandom = (arr)=>{
            // Блюда уже отфильтрованы по неделе в API, просто берем случайное
            return arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null;
        };
        const createMeal = (d)=>{
            if (!d) return null;
            // Гарниры уже отфильтрованы по неделе в API
            const garnishes = menuData.garnish || [];
            const selectedGarnish = garnishes.length > 0 ? garnishes[Math.floor(Math.random() * garnishes.length)] : null;
            const garnish = d.needsGarnish && selectedGarnish ? {
                id: selectedGarnish.id,
                name: selectedGarnish.name,
                prices: selectedGarnish.prices,
                weights: selectedGarnish.weights,
                portion: "single",
                image: selectedGarnish.image,
                ingredients: selectedGarnish.ingredients
            } : null;
            return {
                ...d,
                portion: "single",
                garnish
            };
        };
        setPersons((prevPersons)=>{
            return prevPersons.map((p)=>{
                if (p.id !== personId) return p;
                const newDay1Meals = {
                    breakfast: {
                        dish: createMeal(getRandom(menuData.breakfast || []))
                    },
                    lunch: {
                        salad: null,
                        soup: createMeal(getRandom(menuData.lunch_soup || [])),
                        main: createMeal(getRandom(menuData.lunch_main || []))
                    },
                    dinner: {
                        salad: null,
                        soup: null,
                        main: createMeal(getRandom(menuData.dinner_main || []))
                    }
                };
                const newDay2Meals = {
                    breakfast: {
                        dish: createMeal(getRandom(menuData.breakfast || []))
                    },
                    lunch: {
                        salad: null,
                        soup: createMeal(getRandom(menuData.lunch_soup || [])),
                        main: createMeal(getRandom(menuData.lunch_main || []))
                    },
                    dinner: {
                        salad: null,
                        soup: null,
                        main: createMeal(getRandom(menuData.dinner_main || []))
                    }
                };
                return {
                    ...p,
                    day1: newDay1Meals,
                    day2: newDay2Meals
                };
            });
        });
        setFillTimestamp(Date.now());
    };
    const personHasMeals = (personId)=>{
        const person = persons.find((p)=>p.id === personId);
        if (!person) return false;
        return [
            "day1",
            "day2"
        ].some((day)=>{
            const d = person[day];
            if (!d) return false;
            const breakfast = ensureBreakfastStructure(d.breakfast);
            const lunch = ensureFullMealStructure(d.lunch);
            const dinner = ensureFullMealStructure(d.dinner);
            return breakfast.dish || lunch.salad || lunch.soup || lunch.main || dinner.salad || dinner.soup || dinner.main;
        });
    };
    const handleFillClick = (personId)=>{
        // console.log("[v0] handleFillClick called", { personId, hasMeals: personHasMeals(personId) })
        if (personHasMeals(personId)) {
            setConfirmFillPersonId(personId);
        } else {
            fillRandomMeals(personId);
        }
    };
    const confirmFill = ()=>{
        // console.log("[v0] confirmFill called", { confirmFillPersonId })
        if (confirmFillPersonId !== null) {
            const idToFill = confirmFillPersonId;
            // console.log("[v0] About to fill random meals for person", idToFill)
            setConfirmFillPersonId(null);
            fillRandomMeals(idToFill);
        // console.log("[v0] fillRandomMeals called")
        }
    };
    const handleApplyPromo = ()=>{
        if (!promoCode.trim()) {
            showWarning("Введите промокод", "Пожалуйста, введите промокод для применения скидки.", "error");
            return;
        }
        const code = promoCode.toUpperCase();
        let discount = 0;
        if (code === "WELCOME10") {
            discount = 0.1;
        } else if (code === "SALE20") {
            discount = 0.2;
        } else if (code === "FREE100") {
            discount = 100;
        }
        if (discount > 0) {
            const calculatedDiscount = typeof discount === "number" && discount < 1 ? Math.floor(totalBeforeDiscount * discount) : discount;
            setAppliedPromo({
                code: promoCode,
                discount: calculatedDiscount
            });
            // Removed promoError state
            showWarning("Промокод применен!", discount < 1 ? `Скидка ${discount * 100}% (${calculatedDiscount} ₽) применена к вашему заказу.` : `Скидка ${calculatedDiscount} ₽ применена к вашему заказу.`, "info");
        } else {
            setAppliedPromo(null);
            // Removed promoError state
            showWarning("Неверный промокод", "К сожалению, этот промокод не найден или истек.", "error");
        }
    };
    // --- Next Step Logic ---
    const getNextSectionInfo = ()=>{
        // Logic to find next missing step, starting from activeSectionId (if any) or from beginning
        // Build sequence dynamically checking needsGarnish
        const sequence = [];
        persons.forEach((p)=>{
            const days = [
                1,
                2
            ];
            days.forEach((day)=>{
                const d = day === 1 ? p.day1 : p.day2;
                if (!d) return;
                const instance = `day${day}`;
                const prefix = `section`;
                // Helper to add
                const add = (type, name, instanceSuffix, check)=>{
                    sequence.push({
                        id: `section-${type}-${p.id}-${day}-daily-${instanceSuffix}`,
                        name: name,
                        isComplete: check
                    });
                };
                // Breakfast
                add('breakfast', 'Завтрак', `${instance}-breakfast`, ()=>!!d.breakfast?.dish);
                // Lunch
                add('salad', 'Обед: Салат', `${instance}-lunch`, ()=>!!d.lunch?.salad);
                add('soup', 'Обед: Суп', `${instance}-lunch`, ()=>!!d.lunch?.soup);
                add('main', 'Обед: Горячее', `${instance}-lunch`, ()=>!!d.lunch?.main);
                if (d.lunch?.main?.needsGarnish) {
                    add('garnish', 'Обед: Гарнир', `${instance}-lunch`, ()=>!!d.lunch?.main?.garnish);
                }
                // Dinner
                add('salad', 'Ужин: Салат', `${instance}-dinner`, ()=>!!d.dinner?.salad);
                add('soup', 'Ужин: Суп', `${instance}-dinner`, ()=>!!d.dinner?.soup);
                add('main', 'Ужин: Горячее', `${instance}-dinner`, ()=>!!d.dinner?.main);
                if (d.dinner?.main?.needsGarnish) {
                    add('garnish', 'Ужин: Гарнир', `${instance}-dinner`, ()=>!!d.dinner?.main?.garnish);
                }
            });
        });
        if (activeSectionId) {
            // If section is open, Next is simply the next in sequence
            const currentIndex = sequence.findIndex((s)=>s.id === activeSectionId);
            if (currentIndex >= 0 && currentIndex < sequence.length - 1) {
                return sequence[currentIndex + 1];
            }
        } else {
            // If nothing open (auto-collapsed), find first incomplete
            const firstIncomplete = sequence.find((s)=>!s.isComplete());
            if (firstIncomplete) return firstIncomplete;
        }
        return null;
    };
    const nextStep = getNextSectionInfo();
    const scrollToCheckout = ()=>{
        const footer = footerRef.current;
        if (footer) {
            footer.scrollIntoView({
                behavior: "smooth",
                block: "end"
            });
        }
    };
    const handleMealSelected = ()=>{
    // Called when a meal is selected in MealSelector
    // We want to auto-advance to next section
    // If we are currently in activeSectionId, we find next and open it.
    // If activeSectionId is already null (race condition?), we use getNextSectionInfo fallback logic.
    // We need to re-calculate sequence because "needsGarnish" might have changed just now!
    // Fortunately getNextSectionInfo recalculates it.
    // Wait for state update? 
    // setPersons triggers re-render. onMealSelected is called after setPersons dispatch.
    // But state might not be updated in this closure yet?
    // Actually, onUpdate in MealSelector updates parent state.
    // Then MealSelector calls onMealSelected.
    // Since setState is async, 'persons' here might be old.
    // This is a problem for "needsGarnish" check if it depends on new Main.
    // However, if we just selected Main, 'persons' is old.
    // If we blindly go to next in sequence based on old data, we might miss Garnish or skip it.
    // Solution: Delay the advance slightly to allow state update?
    // Or rely on the fact that if we select Main, we usually stay on Main if needsGarnish (handled in MealSelector).
    // If !needsGarnish, we call onMealSelected.
    // So we assume we can proceed to Next.
    // The Next logic should work.
    // Just set timeout to let state settle?
    // No auto-advance to keep the scroll position stable
    // User can manually scroll or click next
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                open: open,
                onOpenChange: (isOpen)=>!isOpen && onClose(),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                    onOpenAutoFocus: (e)=>e.preventDefault(),
                    onCloseAutoFocus: (e)=>e.preventDefault(),
                    className: "max-w-2xl max-h-[95vh] overflow-hidden flex flex-col p-0 border-0 shadow-2xl",
                    id: "order-modal-content",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative flex flex-col flex-1 overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                                className: "p-4 pb-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 flex-wrap",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                                    className: "text-2xl font-bold",
                                                    children: [
                                                        "Заказ на ",
                                                        date.toLocaleDateString("ru-RU", {
                                                            day: "numeric",
                                                            month: "short"
                                                        })
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/order-modal.tsx",
                                                    lineNumber: 859,
                                                    columnNumber: 19
                                                }, this),
                                                existingOrder && !canEdit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground flex items-center gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                            className: "w-3 h-3"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/order-modal.tsx",
                                                            lineNumber: 864,
                                                            columnNumber: 23
                                                        }, this),
                                                        isToday ? "сегодня доставка" : isPastDate ? "просмотр" : "недоступно"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/order-modal.tsx",
                                                    lineNumber: 863,
                                                    columnNumber: 21
                                                }, this),
                                                existingOrder && isPaid && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600 flex items-center gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                            className: "w-3 h-3"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/order-modal.tsx",
                                                            lineNumber: 870,
                                                            columnNumber: 23
                                                        }, this),
                                                        "оплачен"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/order-modal.tsx",
                                                    lineNumber: 869,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/order-modal.tsx",
                                            lineNumber: 858,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                            className: "text-sm text-muted-foreground",
                                            children: "Набор на 2 дня"
                                        }, void 0, false, {
                                            fileName: "[project]/components/order-modal.tsx",
                                            lineNumber: 875,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/order-modal.tsx",
                                    lineNumber: 857,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/order-modal.tsx",
                                lineNumber: 856,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: scrollContainerRef,
                                className: "flex-1 overflow-y-auto",
                                style: {
                                    scrollBehavior: 'auto'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-1.5 py-1.5 sm:p-4 pb-20",
                                    children: [
                                        !isInDeliveryZone && userCity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                        className: "w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/order-modal.tsx",
                                                        lineNumber: 888,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-medium text-red-700 dark:text-red-400",
                                                                children: "Доставка недоступна"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/order-modal.tsx",
                                                                lineNumber: 890,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-red-600 dark:text-red-400/80",
                                                                children: "К сожалению, мы доставляем только по Санкт-Петербургу. Измените адрес в профиле."
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/order-modal.tsx",
                                                                lineNumber: 891,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/order-modal.tsx",
                                                        lineNumber: 889,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/order-modal.tsx",
                                                lineNumber: 887,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/order-modal.tsx",
                                            lineNumber: 886,
                                            columnNumber: 19
                                        }, this),
                                        isPaid && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-green-700 dark:text-green-400 font-medium flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/order-modal.tsx",
                                                            lineNumber: 902,
                                                            columnNumber: 23
                                                        }, this),
                                                        "Заказ оплачен"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/order-modal.tsx",
                                                    lineNumber: 901,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-green-600 dark:text-green-400/80 mt-1",
                                                    children: "Редактирование оплаченного заказа недоступно"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/order-modal.tsx",
                                                    lineNumber: 905,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/order-modal.tsx",
                                            lineNumber: 900,
                                            columnNumber: 19
                                        }, this),
                                        !isPaid && isToday && existingOrder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-orange-700 dark:text-orange-400 font-medium flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/order-modal.tsx",
                                                            lineNumber: 914,
                                                            columnNumber: 23
                                                        }, this),
                                                        "Доставка сегодня"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/order-modal.tsx",
                                                    lineNumber: 913,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-orange-600 dark:text-orange-400/80 mt-1",
                                                    children: "Редактирование заказа в день доставки недоступно"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/order-modal.tsx",
                                                    lineNumber: 917,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/order-modal.tsx",
                                            lineNumber: 912,
                                            columnNumber: 19
                                        }, this),
                                        !isPaid && isPastDate && existingOrder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-4 p-3 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-700 dark:text-gray-400 font-medium flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/order-modal.tsx",
                                                            lineNumber: 926,
                                                            columnNumber: 23
                                                        }, this),
                                                        "Прошедшая дата"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/order-modal.tsx",
                                                    lineNumber: 925,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-600 dark:text-gray-400/80 mt-1",
                                                    children: "Редактирование заказа на прошедшую дату недоступно"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/order-modal.tsx",
                                                    lineNumber: 929,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/order-modal.tsx",
                                            lineNumber: 924,
                                            columnNumber: 19
                                        }, this),
                                        existingOrder && (existingOrder.paid || existingOrder.total !== undefined) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-lg shadow-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "font-bold text-purple-900 dark:text-purple-300 mb-3 flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$receipt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Receipt$3e$__["Receipt"], {
                                                            className: "w-5 h-5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/order-modal.tsx",
                                                            lineNumber: 939,
                                                            columnNumber: 23
                                                        }, this),
                                                        "Информация о заказе"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/order-modal.tsx",
                                                    lineNumber: 938,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2 text-sm",
                                                    children: [
                                                        existingOrder.subtotal !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-purple-700 dark:text-purple-400",
                                                                    children: "Сумма заказа:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/order-modal.tsx",
                                                                    lineNumber: 945,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-bold text-purple-900 dark:text-purple-300",
                                                                    children: [
                                                                        existingOrder.subtotal.toLocaleString(),
                                                                        " ₽"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/order-modal.tsx",
                                                                    lineNumber: 946,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/order-modal.tsx",
                                                            lineNumber: 944,
                                                            columnNumber: 25
                                                        }, this),
                                                        existingOrder.deliveryFee !== undefined && existingOrder.deliveryFee !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-orange-700 dark:text-orange-400 flex items-center gap-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__["Truck"], {
                                                                            className: "w-4 h-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/order-modal.tsx",
                                                                            lineNumber: 955,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        "Доставка:"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/order-modal.tsx",
                                                                    lineNumber: 954,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-bold text-orange-700 dark:text-orange-400",
                                                                    children: existingOrder.deliveryFee > 0 ? `+${existingOrder.deliveryFee.toLocaleString()} ₽` : 'Бесплатно'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/order-modal.tsx",
                                                                    lineNumber: 958,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/order-modal.tsx",
                                                            lineNumber: 953,
                                                            columnNumber: 25
                                                        }, this),
                                                        existingOrder.loyaltyPointsUsed !== undefined && existingOrder.loyaltyPointsUsed > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-purple-700 dark:text-purple-400",
                                                                    children: "Списано баллов:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/order-modal.tsx",
                                                                    lineNumber: 966,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-bold text-purple-700 dark:text-purple-400",
                                                                    children: [
                                                                        "-",
                                                                        existingOrder.loyaltyPointsUsed,
                                                                        " ₽"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/order-modal.tsx",
                                                                    lineNumber: 967,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/order-modal.tsx",
                                                            lineNumber: 965,
                                                            columnNumber: 25
                                                        }, this),
                                                        existingOrder.total !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between pt-2 border-t border-purple-200 dark:border-purple-800",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-bold text-purple-900 dark:text-purple-300",
                                                                    children: "ИТОГО:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/order-modal.tsx",
                                                                    lineNumber: 975,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-black text-xl text-purple-900 dark:text-purple-300",
                                                                    children: [
                                                                        existingOrder.total.toLocaleString(),
                                                                        " ₽"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/order-modal.tsx",
                                                                    lineNumber: 976,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/order-modal.tsx",
                                                            lineNumber: 974,
                                                            columnNumber: 25
                                                        }, this),
                                                        existingOrder.loyaltyPointsEarned !== undefined && existingOrder.loyaltyPointsEarned > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between pt-2 bg-purple-100 dark:bg-purple-900/30 -mx-4 -mb-4 px-4 py-2 rounded-b-lg mt-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-purple-700 dark:text-purple-400 flex items-center gap-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$coins$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Coins$3e$__["Coins"], {
                                                                            className: "w-4 h-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/order-modal.tsx",
                                                                            lineNumber: 985,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        "Начислено баллов:"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/order-modal.tsx",
                                                                    lineNumber: 984,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-black text-purple-900 dark:text-purple-300",
                                                                    children: [
                                                                        "+",
                                                                        existingOrder.loyaltyPointsEarned
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/order-modal.tsx",
                                                                    lineNumber: 988,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/order-modal.tsx",
                                                            lineNumber: 983,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/order-modal.tsx",
                                                    lineNumber: 942,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/order-modal.tsx",
                                            lineNumber: 937,
                                            columnNumber: 19
                                        }, this),
                                        persons.map((person, index)=>{
                                            const personLabel = persons.length > 1 ? ` • Персона ${index + 1}` : "";
                                            const day1Prefix = `День 1${personLabel}`;
                                            const day2Prefix = `День 2${personLabel}`;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-6 pb-6 border-b border-border last:border-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between mb-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                                                        className: "w-5 h-5 text-primary"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/order-modal.tsx",
                                                                        lineNumber: 1006,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                        className: "font-semibold",
                                                                        children: [
                                                                            "Персона ",
                                                                            index + 1
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/order-modal.tsx",
                                                                        lineNumber: 1007,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/order-modal.tsx",
                                                                lineNumber: 1005,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-1",
                                                                children: [
                                                                    canEdit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                        variant: "outline",
                                                                        size: "sm",
                                                                        onClick: ()=>handleFillClick(person.id),
                                                                        className: "h-8 text-xs bg-transparent",
                                                                        title: "Выбрать автоматически",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wand$2d$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wand2$3e$__["Wand2"], {
                                                                                className: "w-3 h-3 mr-2"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/order-modal.tsx",
                                                                                lineNumber: 1018,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            "Выбрать автоматически"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/order-modal.tsx",
                                                                        lineNumber: 1011,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    canEdit && persons.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                        variant: "ghost",
                                                                        size: "icon",
                                                                        onClick: ()=>removePerson(person.id),
                                                                        className: "h-8 w-8",
                                                                        title: "Удалить персону",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                                                                            className: "w-4 h-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/order-modal.tsx",
                                                                            lineNumber: 1030,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/order-modal.tsx",
                                                                        lineNumber: 1023,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/order-modal.tsx",
                                                                lineNumber: 1009,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/order-modal.tsx",
                                                        lineNumber: 1004,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mb-8",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "text-lg font-bold mb-4 flex items-center gap-2 text-foreground/90",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold",
                                                                        children: "1"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/order-modal.tsx",
                                                                        lineNumber: 1039,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    "День 1"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/order-modal.tsx",
                                                                lineNumber: 1038,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-6 pl-0 md:pl-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-2 mb-3 text-primary font-medium text-sm uppercase tracking-wide",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sunrise$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sunrise$3e$__["Sunrise"], {
                                                                                        className: "w-4 h-4"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/order-modal.tsx",
                                                                                        lineNumber: 1047,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    " Завтрак"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/order-modal.tsx",
                                                                                lineNumber: 1046,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$meal$2d$selector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MealSelector"], {
                                                                                headerPrefix: day1Prefix,
                                                                                disabled: !canEdit,
                                                                                onBlockedAction: showBlockedWarning,
                                                                                personNumber: index + 1,
                                                                                dayNumber: 1,
                                                                                mealsData: {
                                                                                    breakfast: menuData.breakfast
                                                                                },
                                                                                selectedMeals: {
                                                                                    breakfast: person.day1?.breakfast?.dish
                                                                                },
                                                                                onUpdate: (selection)=>updateBreakfast(person.id, "day1", {
                                                                                        dish: selection.breakfast || null
                                                                                    }),
                                                                                activeSectionId: activeSectionId,
                                                                                onSectionChange: setActiveSectionId,
                                                                                instanceId: "day1-breakfast",
                                                                                onMealSelected: handleMealSelected
                                                                            }, `day1-breakfast-${person.id}-${fillTimestamp}`, false, {
                                                                                fileName: "[project]/components/order-modal.tsx",
                                                                                lineNumber: 1049,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/order-modal.tsx",
                                                                        lineNumber: 1045,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-2 mb-3 text-primary font-medium text-sm uppercase tracking-wide",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                                                                                        className: "w-4 h-4"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/order-modal.tsx",
                                                                                        lineNumber: 1070,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    " Обед"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/order-modal.tsx",
                                                                                lineNumber: 1069,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$meal$2d$selector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MealSelector"], {
                                                                                personNumber: index + 1,
                                                                                disabled: !canEdit,
                                                                                onBlockedAction: showBlockedWarning,
                                                                                dayNumber: 1,
                                                                                mealsData: {
                                                                                    salad: menuData.lunch_salad,
                                                                                    soup: menuData.lunch_soup,
                                                                                    main: menuData.lunch_main,
                                                                                    garnish: menuData.garnish
                                                                                },
                                                                                selectedMeals: {
                                                                                    salad: person.day1?.lunch?.salad,
                                                                                    soup: person.day1?.lunch?.soup,
                                                                                    main: person.day1?.lunch?.main
                                                                                },
                                                                                onUpdate: (selection)=>updateLunch(person.id, "day1", {
                                                                                        salad: selection.salad || null,
                                                                                        soup: selection.soup || null,
                                                                                        main: selection.main || null
                                                                                    }),
                                                                                headerPrefix: `${day1Prefix} • Обед`,
                                                                                activeSectionId: activeSectionId,
                                                                                onSectionChange: setActiveSectionId,
                                                                                instanceId: "day1-lunch",
                                                                                onMealSelected: handleMealSelected
                                                                            }, `day1-lunch-${person.id}-${fillTimestamp}`, false, {
                                                                                fileName: "[project]/components/order-modal.tsx",
                                                                                lineNumber: 1072,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/order-modal.tsx",
                                                                        lineNumber: 1068,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-2 mb-3 text-primary font-medium text-sm uppercase tracking-wide",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                                                                                        className: "w-4 h-4"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/order-modal.tsx",
                                                                                        lineNumber: 1106,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    " Ужин"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/order-modal.tsx",
                                                                                lineNumber: 1105,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$meal$2d$selector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MealSelector"], {
                                                                                personNumber: index + 1,
                                                                                disabled: !canEdit,
                                                                                onBlockedAction: showBlockedWarning,
                                                                                dayNumber: 1,
                                                                                mealsData: {
                                                                                    salad: menuData.dinner_salad,
                                                                                    soup: menuData.dinner_soup,
                                                                                    main: menuData.dinner_main,
                                                                                    garnish: menuData.garnish
                                                                                },
                                                                                selectedMeals: {
                                                                                    salad: person.day1?.dinner?.salad,
                                                                                    soup: person.day1?.dinner?.soup,
                                                                                    main: person.day1?.dinner?.main
                                                                                },
                                                                                onUpdate: (selection)=>updateDinner(person.id, "day1", {
                                                                                        salad: selection.salad || null,
                                                                                        soup: selection.soup || null,
                                                                                        main: selection.main || null
                                                                                    }),
                                                                                headerPrefix: `${day1Prefix} • Ужин`,
                                                                                activeSectionId: activeSectionId,
                                                                                onSectionChange: setActiveSectionId,
                                                                                instanceId: "day1-dinner",
                                                                                onMealSelected: handleMealSelected
                                                                            }, `day1-dinner-${person.id}-${fillTimestamp}`, false, {
                                                                                fileName: "[project]/components/order-modal.tsx",
                                                                                lineNumber: 1108,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/order-modal.tsx",
                                                                        lineNumber: 1104,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/order-modal.tsx",
                                                                lineNumber: 1044,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/order-modal.tsx",
                                                        lineNumber: 1037,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "text-lg font-bold mb-4 flex items-center gap-2 text-foreground/90 mt-8 pt-8 border-t border-border/50",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold",
                                                                        children: "2"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/order-modal.tsx",
                                                                        lineNumber: 1145,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    "День 2"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/order-modal.tsx",
                                                                lineNumber: 1144,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-6 pl-0 md:pl-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-2 mb-3 text-primary font-medium text-sm uppercase tracking-wide",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sunrise$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sunrise$3e$__["Sunrise"], {
                                                                                        className: "w-4 h-4"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/order-modal.tsx",
                                                                                        lineNumber: 1153,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    " Завтрак"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/order-modal.tsx",
                                                                                lineNumber: 1152,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$meal$2d$selector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MealSelector"], {
                                                                                headerPrefix: day2Prefix,
                                                                                disabled: !canEdit,
                                                                                onBlockedAction: showBlockedWarning,
                                                                                personNumber: index + 1,
                                                                                dayNumber: 2,
                                                                                mealsData: {
                                                                                    breakfast: menuData.breakfast
                                                                                },
                                                                                selectedMeals: {
                                                                                    breakfast: person.day2?.breakfast?.dish
                                                                                },
                                                                                onUpdate: (selection)=>updateBreakfast(person.id, "day2", {
                                                                                        dish: selection.breakfast || null
                                                                                    }),
                                                                                activeSectionId: activeSectionId,
                                                                                onSectionChange: setActiveSectionId,
                                                                                instanceId: "day2-breakfast",
                                                                                onMealSelected: handleMealSelected
                                                                            }, `day2-breakfast-${person.id}-${fillTimestamp}`, false, {
                                                                                fileName: "[project]/components/order-modal.tsx",
                                                                                lineNumber: 1155,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/order-modal.tsx",
                                                                        lineNumber: 1151,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-2 mb-3 text-primary font-medium text-sm uppercase tracking-wide",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                                                                                        className: "w-4 h-4"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/order-modal.tsx",
                                                                                        lineNumber: 1176,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    " Обед"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/order-modal.tsx",
                                                                                lineNumber: 1175,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$meal$2d$selector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MealSelector"], {
                                                                                personNumber: index + 1,
                                                                                disabled: !canEdit,
                                                                                onBlockedAction: showBlockedWarning,
                                                                                dayNumber: 2,
                                                                                mealsData: {
                                                                                    salad: menuData.lunch_salad,
                                                                                    soup: menuData.lunch_soup,
                                                                                    main: menuData.lunch_main,
                                                                                    garnish: menuData.garnish
                                                                                },
                                                                                selectedMeals: {
                                                                                    salad: person.day2?.lunch?.salad,
                                                                                    soup: person.day2?.lunch?.soup,
                                                                                    main: person.day2?.lunch?.main
                                                                                },
                                                                                onUpdate: (selection)=>updateLunch(person.id, "day2", {
                                                                                        salad: selection.salad || null,
                                                                                        soup: selection.soup || null,
                                                                                        main: selection.main || null
                                                                                    }),
                                                                                headerPrefix: `${day2Prefix} • Обед`,
                                                                                activeSectionId: activeSectionId,
                                                                                onSectionChange: setActiveSectionId,
                                                                                instanceId: "day2-lunch",
                                                                                onMealSelected: handleMealSelected
                                                                            }, `day2-lunch-${person.id}-${fillTimestamp}`, false, {
                                                                                fileName: "[project]/components/order-modal.tsx",
                                                                                lineNumber: 1178,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/order-modal.tsx",
                                                                        lineNumber: 1174,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-2 mb-3 text-primary font-medium text-sm uppercase tracking-wide",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                                                                                        className: "w-4 h-4"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/order-modal.tsx",
                                                                                        lineNumber: 1212,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    " Ужин"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/order-modal.tsx",
                                                                                lineNumber: 1211,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$meal$2d$selector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MealSelector"], {
                                                                                personNumber: index + 1,
                                                                                disabled: !canEdit,
                                                                                onBlockedAction: showBlockedWarning,
                                                                                dayNumber: 2,
                                                                                mealsData: {
                                                                                    salad: menuData.dinner_salad,
                                                                                    soup: menuData.dinner_soup,
                                                                                    main: menuData.dinner_main,
                                                                                    garnish: menuData.garnish
                                                                                },
                                                                                selectedMeals: {
                                                                                    salad: person.day2?.dinner?.salad,
                                                                                    soup: person.day2?.dinner?.soup,
                                                                                    main: person.day2?.dinner?.main
                                                                                },
                                                                                onUpdate: (selection)=>updateDinner(person.id, "day2", {
                                                                                        salad: selection.salad || null,
                                                                                        soup: selection.soup || null,
                                                                                        main: selection.main || null
                                                                                    }),
                                                                                headerPrefix: `${day2Prefix} • Ужин`,
                                                                                activeSectionId: activeSectionId,
                                                                                onSectionChange: setActiveSectionId,
                                                                                instanceId: "day2-dinner",
                                                                                onMealSelected: handleMealSelected
                                                                            }, `day2-dinner-${person.id}-${fillTimestamp}`, false, {
                                                                                fileName: "[project]/components/order-modal.tsx",
                                                                                lineNumber: 1214,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/order-modal.tsx",
                                                                        lineNumber: 1210,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/order-modal.tsx",
                                                                lineNumber: 1150,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/order-modal.tsx",
                                                        lineNumber: 1143,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, person.id, true, {
                                                fileName: "[project]/components/order-modal.tsx",
                                                lineNumber: 1003,
                                                columnNumber: 19
                                            }, this);
                                        }),
                                        canEdit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "outline",
                                            onClick: addPerson,
                                            className: "w-full mb-6 bg-transparent",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                    className: "w-4 h-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/order-modal.tsx",
                                                    lineNumber: 1253,
                                                    columnNumber: 21
                                                }, this),
                                                "Добавить персону"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/order-modal.tsx",
                                            lineNumber: 1252,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$extras$2d$selector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ExtrasSelector"], {
                                            extras: extras,
                                            availableExtras: availableExtras,
                                            onUpdate: setExtras,
                                            disabled: !canEdit
                                        }, void 0, false, {
                                            fileName: "[project]/components/order-modal.tsx",
                                            lineNumber: 1258,
                                            columnNumber: 17
                                        }, this),
                                        isAuthenticated && deliveryTimes.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-6 mb-6 p-4 bg-white rounded-lg border-2 border-black shadow-brutal",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 mb-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-8 h-8 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-brutal",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                                className: "w-5 h-5 text-[#9D00FF] stroke-[2.5px]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/order-modal.tsx",
                                                                lineNumber: 1270,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/order-modal.tsx",
                                                            lineNumber: 1269,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "font-black text-black",
                                                            children: "Время доставки"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/order-modal.tsx",
                                                            lineNumber: 1272,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/order-modal.tsx",
                                                    lineNumber: 1268,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2",
                                                    children: deliveryTimes.map((time)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>canEdit && setDeliveryTime(time),
                                                            disabled: !canEdit,
                                                            className: `py-2 px-1 rounded-lg text-[13px] font-black transition-all whitespace-nowrap border-2 border-black shadow-brutal ${deliveryTime === time ? "bg-[#9D00FF] text-white" : "bg-white text-black hover:bg-[#FFEA00]"} ${!canEdit ? "cursor-not-allowed opacity-50" : ""}`,
                                                            children: time
                                                        }, time, false, {
                                                            fileName: "[project]/components/order-modal.tsx",
                                                            lineNumber: 1276,
                                                            columnNumber: 25
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/order-modal.tsx",
                                                    lineNumber: 1274,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/order-modal.tsx",
                                            lineNumber: 1267,
                                            columnNumber: 19
                                        }, this),
                                        canEdit && hasContent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-6 border-t border-border pt-6",
                                            children: [
                                                isAuthenticated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between py-3 px-4 bg-white border-2 border-black rounded-lg cursor-pointer hover:bg-[#FFEA00] transition-colors shadow-brutal mb-2",
                                                            onClick: ()=>setActiveSectionId(activeSectionId === "promo" ? null : "promo"),
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "w-8 h-8 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-brutal",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"], {
                                                                                className: "w-4 h-4 text-[#9D00FF] stroke-[2.5px]"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/order-modal.tsx",
                                                                                lineNumber: 1305,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/order-modal.tsx",
                                                                            lineNumber: 1304,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "font-black text-black",
                                                                                    children: "Промокод"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/order-modal.tsx",
                                                                                    lineNumber: 1308,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                appliedPromo ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-sm text-[#9D00FF] font-medium",
                                                                                    children: [
                                                                                        "Скидка ",
                                                                                        appliedPromo.discount,
                                                                                        " ₽ применена"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/order-modal.tsx",
                                                                                    lineNumber: 1310,
                                                                                    columnNumber: 33
                                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-sm text-black/70 font-medium",
                                                                                    children: "Введите промокод"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/order-modal.tsx",
                                                                                    lineNumber: 1312,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/order-modal.tsx",
                                                                            lineNumber: 1307,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/order-modal.tsx",
                                                                    lineNumber: 1303,
                                                                    columnNumber: 27
                                                                }, this),
                                                                activeSectionId === "promo" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                    className: "w-5 h-5 text-black stroke-[2.5px]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/order-modal.tsx",
                                                                    lineNumber: 1317,
                                                                    columnNumber: 29
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                                    className: "w-5 h-5 text-black stroke-[2.5px]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/order-modal.tsx",
                                                                    lineNumber: 1319,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/order-modal.tsx",
                                                            lineNumber: 1299,
                                                            columnNumber: 25
                                                        }, this),
                                                        activeSectionId === "promo" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "py-3 px-4 bg-white border-2 border-black rounded-lg shadow-brutal mb-2 animate-in slide-in-from-top-2 fade-in duration-200",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "text",
                                                                            value: promoCode,
                                                                            onChange: (e)=>setPromoCode(e.target.value.toUpperCase()),
                                                                            placeholder: "Введите промокод",
                                                                            className: "flex-1 px-3 py-2 border-2 border-black rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black font-medium"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/order-modal.tsx",
                                                                            lineNumber: 1326,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                            onClick: handleApplyPromo,
                                                                            size: "sm",
                                                                            className: "bg-[#9D00FF] text-white border-2 border-black hover:bg-[#B033FF] shadow-brutal font-black",
                                                                            children: "Применить"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/order-modal.tsx",
                                                                            lineNumber: 1333,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/order-modal.tsx",
                                                                    lineNumber: 1325,
                                                                    columnNumber: 29
                                                                }, this),
                                                                appliedPromo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mt-2 text-xs",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>setAppliedPromo(null),
                                                                        className: "text-[#9D00FF] hover:underline font-medium",
                                                                        children: "Удалить промокод"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/order-modal.tsx",
                                                                        lineNumber: 1343,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/order-modal.tsx",
                                                                    lineNumber: 1342,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/order-modal.tsx",
                                                            lineNumber: 1324,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-primary/5 rounded-xl p-4 border border-primary/10 mb-6",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-center text-muted-foreground",
                                                        children: "Войдите в профиль, чтобы применить скидки и выбрать способ оплаты"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/order-modal.tsx",
                                                        lineNumber: 1357,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/order-modal.tsx",
                                                    lineNumber: 1356,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    ref: footerRef,
                                                    className: "pt-2 pb-12",
                                                    children: [
                                                        !isAuthenticated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                            onClick: ()=>{
                                                                // ✅ ИСПРАВЛЕНО 2026-01-11: Передаем order и total в onRequestAuth
                                                                const order = {
                                                                    startDate: formatDateKey(date),
                                                                    persons,
                                                                    delivered: false,
                                                                    deliveryTime,
                                                                    extras,
                                                                    subtotal: totalBeforeDiscount,
                                                                    total: finalTotal,
                                                                    paid: false,
                                                                    cancelled: false
                                                                };
                                                                onRequestAuth?.(order, finalTotal);
                                                            },
                                                            disabled: !hasContent,
                                                            className: "w-full h-16 text-lg bg-[#ff4d6d] hover:bg-[#e8445f] rounded-2xl flex items-center justify-center shadow-lg shadow-[#ff4d6d]/20 active:scale-[0.98] transition-transform relative overflow-hidden group",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-bold text-white flex items-center gap-2",
                                                                children: [
                                                                    "Заказать · ",
                                                                    finalTotal,
                                                                    " ₽"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/order-modal.tsx",
                                                                lineNumber: 1385,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/order-modal.tsx",
                                                            lineNumber: 1366,
                                                            columnNumber: 25
                                                        }, this) : !isInDeliveryZone && userCity ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                            disabled: true,
                                                            className: "w-full h-16 text-base rounded-2xl",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                                    className: "w-4 h-4 mr-2"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/order-modal.tsx",
                                                                    lineNumber: 1391,
                                                                    columnNumber: 27
                                                                }, this),
                                                                "Доставка недоступна"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/order-modal.tsx",
                                                            lineNumber: 1390,
                                                            columnNumber: 25
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                !isExistingOrder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                    onClick: handlePayAndOrder,
                                                                    disabled: !hasContent || isProcessingPayment,
                                                                    className: "w-full h-16 text-lg bg-[#ff4d6d] hover:bg-[#e8445f] rounded-2xl shadow-lg shadow-[#ff4d6d]/20 active:scale-[0.98] transition-transform",
                                                                    children: isProcessingPayment ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                                className: "w-5 h-5 animate-spin"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/order-modal.tsx",
                                                                                lineNumber: 1405,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "font-bold text-white",
                                                                                children: "Оформляем..."
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/order-modal.tsx",
                                                                                lineNumber: 1406,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/order-modal.tsx",
                                                                        lineNumber: 1404,
                                                                        columnNumber: 33
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-bold text-white",
                                                                        children: [
                                                                            "Продолжить · ",
                                                                            finalTotal,
                                                                            " ₽"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/order-modal.tsx",
                                                                        lineNumber: 1409,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/order-modal.tsx",
                                                                    lineNumber: 1398,
                                                                    columnNumber: 29
                                                                }, this),
                                                                isExistingOrder && !isPaid && existingOrder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                    onClick: ()=>onRequestPayment?.(existingOrder, finalTotal),
                                                                    disabled: isProcessingPayment || isDataLoading,
                                                                    className: "w-full h-16 text-lg bg-[#FFEA00] hover:bg-[#FFF033] border-2 border-black rounded-2xl shadow-brutal active:scale-[0.98] transition-transform",
                                                                    children: isDataLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                                className: "w-5 h-5 animate-spin"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/order-modal.tsx",
                                                                                lineNumber: 1425,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "font-black text-black",
                                                                                children: "Загрузка данных..."
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/order-modal.tsx",
                                                                                lineNumber: 1426,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/order-modal.tsx",
                                                                        lineNumber: 1424,
                                                                        columnNumber: 33
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-black text-black",
                                                                        children: [
                                                                            "Оплатить заказ · ",
                                                                            finalTotal,
                                                                            " ₽"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/order-modal.tsx",
                                                                        lineNumber: 1429,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/order-modal.tsx",
                                                                    lineNumber: 1418,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true),
                                                        canCancel && existingOrder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                            variant: "outline",
                                                            size: "sm",
                                                            onClick: handleCancelClick,
                                                            className: "w-full mt-4 bg-transparent text-destructive hover:text-destructive hover:bg-destructive/10",
                                                            children: "Отменить заказ"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/order-modal.tsx",
                                                            lineNumber: 1437,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/order-modal.tsx",
                                                    lineNumber: 1364,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/order-modal.tsx",
                                            lineNumber: 1295,
                                            columnNumber: 19
                                        }, this),
                                        !canEdit && canCancel && existingOrder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-6 border-t border-border pt-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "outline",
                                                size: "sm",
                                                onClick: handleCancelClick,
                                                className: "w-full bg-transparent text-destructive hover:text-destructive hover:bg-destructive/10",
                                                children: "Отменить заказ"
                                            }, void 0, false, {
                                                fileName: "[project]/components/order-modal.tsx",
                                                lineNumber: 1453,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/order-modal.tsx",
                                            lineNumber: 1452,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/order-modal.tsx",
                                    lineNumber: 884,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/order-modal.tsx",
                                lineNumber: 879,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                children: showFloatingButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        opacity: 0,
                                        scale: 0.8,
                                        x: 20
                                    },
                                    animate: {
                                        opacity: 1,
                                        scale: 1,
                                        x: 0
                                    },
                                    exit: {
                                        opacity: 0,
                                        scale: 0.8,
                                        x: 20
                                    },
                                    className: "absolute bottom-8 right-8 z-[100] pointer-events-auto",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            scrollToCheckout();
                                        },
                                        className: "h-14 pl-6 pr-2 rounded-xl shadow-brutal bg-[#FFEA00] hover:bg-[#FFF033] text-black border-2 border-black flex items-center gap-4 group transition-all duration-200 brutal-hover font-bold",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xl font-black tracking-tight",
                                                children: [
                                                    finalTotal,
                                                    " ₽"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/order-modal.tsx",
                                                lineNumber: 1482,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-10 h-10 rounded-lg bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-colors border border-black/20",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                    className: "w-6 h-6 stroke-[3px] text-black"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/order-modal.tsx",
                                                    lineNumber: 1484,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/order-modal.tsx",
                                                lineNumber: 1483,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/order-modal.tsx",
                                        lineNumber: 1475,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/order-modal.tsx",
                                    lineNumber: 1469,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/order-modal.tsx",
                                lineNumber: 1467,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/order-modal.tsx",
                        lineNumber: 855,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/order-modal.tsx",
                    lineNumber: 849,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/order-modal.tsx",
                lineNumber: 848,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialog"], {
                open: confirmFillPersonId !== null,
                onOpenChange: (open)=>!open && setConfirmFillPersonId(null),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
                    className: "max-w-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                                    children: "Заполнить заново?"
                                }, void 0, false, {
                                    fileName: "[project]/components/order-modal.tsx",
                                    lineNumber: 1497,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
                                    children: "У этого человека уже выбраны блюда. Вы уверены, что хотите заполнит меню случайными блюдами? Текущий выбор будет заменен."
                                }, void 0, false, {
                                    fileName: "[project]/components/order-modal.tsx",
                                    lineNumber: 1498,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/order-modal.tsx",
                            lineNumber: 1496,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogFooter"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                                    children: "Отмена"
                                }, void 0, false, {
                                    fileName: "[project]/components/order-modal.tsx",
                                    lineNumber: 1504,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                                    onClick: confirmFill,
                                    children: "Да, заполнить"
                                }, void 0, false, {
                                    fileName: "[project]/components/order-modal.tsx",
                                    lineNumber: 1505,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/order-modal.tsx",
                            lineNumber: 1503,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/order-modal.tsx",
                    lineNumber: 1495,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/order-modal.tsx",
                lineNumber: 1494,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialog"], {
                open: showCancelConfirm,
                onOpenChange: setShowCancelConfirm,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
                    className: "max-w-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                                    children: "Отменить заказ?"
                                }, void 0, false, {
                                    fileName: "[project]/components/order-modal.tsx",
                                    lineNumber: 1513,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
                                    children: isPaid ? isPaidWithCard ? "Вы уверены, что хотите отменить заказ? Деньги вернутся на карту в течение 3 рабочих дней." : "Вы уверены, что хотите отменить оплаченный заказ?" : "Вы уверены, что хотите отменить заказ?"
                                }, void 0, false, {
                                    fileName: "[project]/components/order-modal.tsx",
                                    lineNumber: 1514,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/order-modal.tsx",
                            lineNumber: 1512,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogFooter"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                                    children: "Нет, оставить"
                                }, void 0, false, {
                                    fileName: "[project]/components/order-modal.tsx",
                                    lineNumber: 1523,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                                    onClick: handleConfirmCancel,
                                    className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                                    children: "Да, отменить"
                                }, void 0, false, {
                                    fileName: "[project]/components/order-modal.tsx",
                                    lineNumber: 1524,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/order-modal.tsx",
                            lineNumber: 1522,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/order-modal.tsx",
                    lineNumber: 1511,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/order-modal.tsx",
                lineNumber: 1510,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$warning$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WarningDialog"], {
                open: warningDialog.open,
                onClose: closeWarning,
                title: warningDialog.title,
                description: warningDialog.description,
                variant: warningDialog.variant
            }, void 0, false, {
                fileName: "[project]/components/order-modal.tsx",
                lineNumber: 1534,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(OrderModal, "6Kifh3B2puUu1mAl+lrGyBs4T/Q=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$menu$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMenu"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = OrderModal;
var _c;
__turbopack_context__.k.register(_c, "OrderModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_order-modal_tsx_e2561599._.js.map