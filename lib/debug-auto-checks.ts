/**
 * 🔥 Автоматические проверки для Debug системы
 * Эти функции автоматически отслеживают критические ситуации в бизнес-логике
 */

type DebugRecorder = {
  captureError: (options: {
    errorMessage: string;
    data?: any;
    includeScreenshot?: boolean;
  }) => Promise<any>;
  log: (message: string, data?: any) => void;
};

/**
 * 🎁 Проверка начисления баллов лояльности
 */
export async function checkLoyaltyPointsAwarded(
  debug: DebugRecorder,
  params: {
    paymentMethod: 'card' | 'sbp' | 'cash';
    orderTotal: number;
    expectedPoints: number;
    actualPointsAwarded: number;
    oldPoints: number;
    newPoints: number;
    userId: number | string;
    orderId: number | string;
  }
) {
  const { paymentMethod, orderTotal, expectedPoints, actualPointsAwarded, oldPoints, newPoints, userId, orderId } = params;

  // Проверка 1: Баллы вообще не начислились (когда должны были)
  if (paymentMethod !== 'cash' && expectedPoints > 0 && actualPointsAwarded === 0) {
    await debug.captureError({
      errorMessage: '⚠️ Баллы лояльности не начислились',
      data: {
        issue: 'loyalty_points_not_awarded',
        paymentMethod,
        orderTotal,
        expectedPoints,
        actualPointsAwarded,
        oldPoints,
        newPoints,
        userId,
        orderId,
      },
    });
  }

  // Проверка 2: Начислено неверное количество баллов
  if (actualPointsAwarded > 0 && actualPointsAwarded !== expectedPoints) {
    await debug.captureError({
      errorMessage: '⚠️ Начислено неверное количество баллов',
      data: {
        issue: 'loyalty_points_mismatch',
        expected: expectedPoints,
        actual: actualPointsAwarded,
        difference: expectedPoints - actualPointsAwarded,
        orderTotal,
        userId,
        orderId,
      },
    });
  }

  // Проверка 3: Баллы начислились при оплате наличными (не должны)
  if (paymentMethod === 'cash' && actualPointsAwarded > 0 && newPoints > oldPoints) {
    await debug.captureError({
      errorMessage: '⚠️ Баллы начислились при оплате наличными',
      data: {
        issue: 'loyalty_points_awarded_for_cash',
        paymentMethod: 'cash',
        pointsAwarded: actualPointsAwarded,
        oldPoints,
        newPoints,
        userId,
        orderId,
      },
    });
  }

  debug.log('✅ Loyalty points check completed', { expectedPoints, actualPointsAwarded, passed: true });
}

/**
 * 💰 Проверка корректности расчёта суммы заказа
 */
export async function checkOrderTotal(
  debug: DebugRecorder,
  params: {
    subtotal: number;
    deliveryFee: number;
    total: number;
    pointsUsed?: number;
    orderId?: number | string;
    userId?: number | string;
  }
) {
  const { subtotal, deliveryFee, total, pointsUsed = 0, orderId, userId } = params;

  // Проверка 1: Total < 0 (быть не может!)
  if (total < 0) {
    await debug.captureError({
      errorMessage: '🚨 Отрицательная сумма заказа!',
      data: {
        issue: 'negative_total',
        subtotal,
        deliveryFee,
        total,
        pointsUsed,
        orderId,
        userId,
      },
    });
  }

  // Проверка 2: Total === 0 (странно, возможно ошибка)
  if (total === 0) {
    await debug.captureError({
      errorMessage: '⚠️ Сумма заказа = 0',
      data: {
        issue: 'zero_total',
        subtotal,
        deliveryFee,
        pointsUsed,
        orderId,
        userId,
      },
    });
  }

  // Проверка 3: Total !== subtotal + deliveryFee - pointsUsed
  const expectedTotal = subtotal + deliveryFee - pointsUsed;
  if (Math.abs(total - expectedTotal) > 0.01) { // Допускаем погрешность округления
    await debug.captureError({
      errorMessage: '⚠️ Некорректный расчёт суммы заказа',
      data: {
        issue: 'total_calculation_mismatch',
        subtotal,
        deliveryFee,
        pointsUsed,
        expectedTotal,
        actualTotal: total,
        difference: total - expectedTotal,
        orderId,
        userId,
      },
    });
  }

  // Проверка 4: NaN в расчётах
  if (isNaN(total) || isNaN(subtotal) || isNaN(deliveryFee)) {
    await debug.captureError({
      errorMessage: '🚨 NaN в расчёте суммы заказа!',
      data: {
        issue: 'nan_in_calculations',
        subtotal,
        deliveryFee,
        total,
        pointsUsed,
        orderId,
        userId,
      },
    });
  }

  debug.log('✅ Order total check completed', { total, expectedTotal, passed: true });
}

/**
 * 📦 Проверка корректности данных заказа перед отправкой
 */
export async function checkOrderData(
  debug: DebugRecorder,
  params: {
    order: any;
    userId: number | string;
  }
) {
  const { order, userId } = params;

  // Проверка 1: persons пуст (критическая ошибка!)
  if (!order.persons || order.persons.length === 0) {
    await debug.captureError({
      errorMessage: '🚨 КРИТИЧЕСКАЯ ОШИБКА: persons пуст при создании заказа!',
      data: {
        issue: 'empty_persons_array',
        orderId: order.id,
        orderData: order,
        userId,
      },
    });
  }

  // Проверка 2: Нет дат в заказе
  if (!order.startDate) {
    await debug.captureError({
      errorMessage: '⚠️ Отсутствует дата начала заказа',
      data: {
        issue: 'missing_start_date',
        orderId: order.id,
        userId,
      },
    });
  }

  // Проверка 3: У persons нет блюд (day1, day2 пусты)
  const emptyPersons = order.persons?.filter((p: any) => !p.day1 && !p.day2);
  if (emptyPersons && emptyPersons.length > 0) {
    await debug.captureError({
      errorMessage: '⚠️ В заказе есть персоны без блюд',
      data: {
        issue: 'persons_without_meals',
        emptyPersonsCount: emptyPersons.length,
        totalPersons: order.persons?.length || 0,
        orderId: order.id,
        userId,
      },
    });
  }

  debug.log('✅ Order data check completed', { orderId: order.id, personsCount: order.persons?.length || 0 });
}

/**
 * 🔄 Проверка корректности обновления профиля после оплаты
 */
export async function checkProfileUpdate(
  debug: DebugRecorder,
  params: {
    oldProfile: any;
    newProfile: any;
    expectedPointsChange?: number;
    expectedSpentChange?: number;
  }
) {
  const { oldProfile, newProfile, expectedPointsChange, expectedSpentChange } = params;

  // Проверка 1: totalSpent уменьшился (быть не может!)
  if (newProfile.totalSpent < oldProfile.totalSpent) {
    await debug.captureError({
      errorMessage: '🚨 totalSpent уменьшился после оплаты!',
      data: {
        issue: 'total_spent_decreased',
        oldValue: oldProfile.totalSpent,
        newValue: newProfile.totalSpent,
        difference: newProfile.totalSpent - oldProfile.totalSpent,
        userId: newProfile.id,
      },
    });
  }

  // Проверка 2: totalSpent не изменился (странно)
  if (expectedSpentChange && expectedSpentChange > 0) {
    const actualChange = newProfile.totalSpent - oldProfile.totalSpent;
    if (actualChange === 0) {
      await debug.captureError({
        errorMessage: '⚠️ totalSpent не обновился после оплаты',
        data: {
          issue: 'total_spent_not_updated',
          expected: expectedSpentChange,
          actual: actualChange,
          userId: newProfile.id,
        },
      });
    }
  }

  // Проверка 3: loyaltyPoints стали отрицательными
  if (newProfile.loyaltyPoints < 0) {
    await debug.captureError({
      errorMessage: '🚨 Отрицательные баллы лояльности!',
      data: {
        issue: 'negative_loyalty_points',
        oldPoints: oldProfile.loyaltyPoints,
        newPoints: newProfile.loyaltyPoints,
        userId: newProfile.id,
      },
    });
  }

  debug.log('✅ Profile update check completed', { 
    userId: newProfile.id, 
    pointsChange: newProfile.loyaltyPoints - oldProfile.loyaltyPoints,
    spentChange: newProfile.totalSpent - oldProfile.totalSpent,
  });
}

/**
 * 🔐 Проверка корректности авторизации и профиля
 */
export async function checkAuthState(
  debug: DebugRecorder,
  params: {
    isAuthenticated: boolean;
    userProfile: any;
    requiredFields?: string[];
  }
) {
  const { isAuthenticated, userProfile, requiredFields = ['id', 'phone', 'district'] } = params;

  // Проверка 1: Авторизован, но нет профиля
  if (isAuthenticated && !userProfile) {
    await debug.captureError({
      errorMessage: '⚠️ Авторизован, но профиль не загружен',
      data: {
        issue: 'authenticated_but_no_profile',
        isAuthenticated,
      },
    });
  }

  // Проверка 2: Обязательные поля не заполнены
  if (userProfile) {
    const missingFields = requiredFields.filter(field => !userProfile[field]);
    if (missingFields.length > 0) {
      await debug.captureError({
        errorMessage: '⚠️ Не заполнены обязательные поля профиля',
        data: {
          issue: 'missing_required_fields',
          missingFields,
          userId: userProfile.id,
          userEmail: userProfile.email,
        },
      });
    }
  }

  debug.log('✅ Auth state check completed', { isAuthenticated, hasProfile: !!userProfile });
}

