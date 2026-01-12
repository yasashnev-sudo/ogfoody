// Простой быстрый тест
const API_URL = "http://localhost:3001";

async function simpleTest() {
  console.log("🧪 Быстрая проверка системы лояльности\n");

  // Тест 1: Наличные
  console.log("1️⃣  Заказ за НАЛИЧНЫЕ:");
  try {
    const res1 = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order: {
          userId: 5,
          startDate: "2026-01-08",
          deliveryTime: "12:00-14:00",
          paymentMethod: "cash",
          persons: [{ name: "Тест", day1: { lunch: { main: { id: 1, name: "Тест", price: 1000, portion: "single" }}}}],
          extras: [],
          total: 1000,
          subtotal: 1000,
        }
      }),
    });
    const data1 = await res1.json();
    console.log(`   Заказ: #${data1.orderNumber}`);
    console.log(`   Статус: ${data1.loyaltyPointsStatus}`);
    console.log(`   Сообщение: ${data1.loyaltyPointsMessage}`);
    console.log(data1.loyaltyPointsStatus === "pending" ? "   ✅ ПРАВИЛЬНО\n" : "   ❌ ОШИБКА\n");
  } catch (e) {
    console.log(`   ❌ Ошибка: ${e.message}\n`);
  }

  // Тест 2: Онлайн
  console.log("2️⃣  Заказ ОНЛАЙН:");
  try {
    const res2 = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order: {
          userId: 5,
          startDate: "2026-01-08",
          deliveryTime: "12:00-14:00",
          paymentMethod: "card",
          paid: true,
          persons: [{ name: "Тест", day1: { lunch: { main: { id: 1, name: "Тест", price: 2000, portion: "single" }}}}],
          extras: [],
          total: 2000,
          subtotal: 2000,
        }
      }),
    });
    const data2 = await res2.json();
    console.log(`   Заказ: #${data2.orderNumber}`);
    console.log(`   Статус: ${data2.loyaltyPointsStatus}`);
    console.log(`   Сообщение: ${data2.loyaltyPointsMessage}`);
    console.log(data2.loyaltyPointsStatus === "earned" ? "   ✅ ПРАВИЛЬНО\n" : "   ❌ ОШИБКА\n");
  } catch (e) {
    console.log(`   ❌ Ошибка: ${e.message}\n`);
  }

  console.log("✅ Базовая проверка завершена!");
  console.log("\n📝 Дополнительные проверки:");
  console.log("   • Cron job: http://localhost:3000/api/cron/process-pending-points");
  console.log("   • Fraud_Alerts: http://localhost:3000/api/db/Fraud_Alerts/records");
  console.log("   • Pending транзакции: http://localhost:3000/api/db/Loyalty_Points_Transactions/records?where=(Transaction%20Status,eq,pending)");
}

simpleTest().catch(console.error);

