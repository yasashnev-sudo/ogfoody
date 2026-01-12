const NOCODB_URL = 'https://noco.povarnakolesah.ru';
const NOCODB_TOKEN = 'eppmI3qJq8ahGaCzPmjmZGIze9NgJxEFQzu6Ps1r';
const USERS_TABLE_ID = 'mg9dm2m41bjv8ar';
const ORDERS_TABLE_ID = 'm96i4ai2yelbboh';
const TRANSACTIONS_TABLE_ID = 'mn244txmccpwmhx';

async function getUser(userId) {
  const url = `${NOCODB_URL}/api/v2/tables/${USERS_TABLE_ID}/records?where=(User ID,eq,${userId})`;
  const response = await fetch(url, { headers: { 'xc-token': NOCODB_TOKEN } });
  const data = await response.json();
  return data.list.find(u => u['User ID'] === userId);
}

async function getOrders(userId) {
  const url = `${NOCODB_URL}/api/v2/tables/${ORDERS_TABLE_ID}/records?where=(User ID,eq,${userId})&limit=1000`;
  const response = await fetch(url, { headers: { 'xc-token': NOCODB_TOKEN } });
  const data = await response.json();
  return data.list.filter(o => o['User ID'] === userId);
}

async function getTransactions(userId) {
  const url = `${NOCODB_URL}/api/v2/tables/${TRANSACTIONS_TABLE_ID}/records?where=(User ID,eq,${userId})&limit=1000`;
  const response = await fetch(url, { headers: { 'xc-token': NOCODB_TOKEN } });
  const data = await response.json();
  return data.list.filter(t => t['User ID'] === userId);
}

async function testFullCycle() {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 ПОЛНАЯ ПРОВЕРКА СИСТЕМЫ ЛОЯЛЬНОСТИ');
  console.log('='.repeat(80) + '\n');
  
  const userId = 5;
  
  // 1. Текущее состояние пользователя
  const user = await getUser(userId);
  console.log('👤 Текущее состояние пользователя:', {
    'User ID': user['User ID'],
    'Loyalty Points': user['Loyalty Points'],
    'Total Spent': user['Total Spent'],
  });
  
  // 2. Все заказы
  const orders = await getOrders(userId);
  const activeOrders = orders.filter(o => o['Order Status'] !== 'cancelled');
  const cancelledOrders = orders.filter(o => o['Order Status'] === 'cancelled');
  
  console.log('\n📦 Заказы:', {
    'Всего': orders.length,
    'Активные': activeOrders.length,
    'Отмененные': cancelledOrders.length,
  });
  
  // 3. Все транзакции
  const transactions = await getTransactions(userId);
  const completedTransactions = transactions.filter(t => t['Transaction Status'] === 'completed');
  
  let earnedTotal = 0;
  let usedTotal = 0;
  let refundedTotal = 0;
  let cancelledTotal = 0;
  
  completedTransactions.forEach(t => {
    const type = t['Transaction Type'];
    const amount = t['Points'] || 0;
    
    if (type === 'earned') earnedTotal += amount;
    if (type === 'used') usedTotal += Math.abs(amount);
    if (type === 'refunded') refundedTotal += amount;
    if (type === 'cancelled') cancelledTotal += Math.abs(amount);
  });
  
  const calculatedBalance = earnedTotal - usedTotal + refundedTotal - cancelledTotal;
  
  console.log('\n💰 Транзакции (completed):', {
    'Всего': transactions.length,
    'Completed': completedTransactions.length,
    'Earned': earnedTotal,
    'Used': usedTotal,
    'Refunded': refundedTotal,
    'Cancelled': cancelledTotal,
    'Расчетный баланс': calculatedBalance,
  });
  
  // 4. Пересчет total_spent
  const activeCardOrders = orders.filter(o => 
    o['Order Status'] !== 'cancelled' && o['Payment Method'] === 'card'
  );
  
  let totalSpent = 0;
  activeCardOrders.forEach(o => {
    const total = parseFloat(o['Total'] || 0);
    const pointsUsed = parseFloat(o['Loyalty Points Used'] || 0);
    totalSpent += (total - pointsUsed);
  });
  
  console.log('\n💳 Расчет total_spent:', {
    'Активные заказы (card)': activeCardOrders.length,
    'Расчетный total_spent': totalSpent,
  });
  
  // 5. Проверка соответствия
  console.log('\n⚖️  ИТОГОВАЯ ПРОВЕРКА:');
  
  const balanceMatch = user['Loyalty Points'] === calculatedBalance;
  const totalSpentMatch = user['Total Spent'] === totalSpent;
  
  console.log({
    'Баланс баллов': {
      'В БД': user['Loyalty Points'],
      'По транзакциям': calculatedBalance,
      'Совпадает': balanceMatch ? '✅' : '❌',
    },
    'Total Spent': {
      'В БД': user['Total Spent'],
      'По заказам': totalSpent,
      'Совпадает': totalSpentMatch ? '✅' : '❌',
    },
  });
  
  if (balanceMatch && totalSpentMatch) {
    console.log('\n✅ ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ! Система работает корректно.\n');
  } else {
    console.log('\n❌ ОБНАРУЖЕНЫ РАСХОЖДЕНИЯ! Требуется исправление.\n');
  }
  
  console.log('='.repeat(80) + '\n');
}

testFullCycle().catch(console.error);




