// Простой endpoint для проверки, что сервер работает и логи пишутся

import { NextResponse } from "next/server"

export async function GET() {
  console.log("🔍 CHECK-LOGS: Endpoint вызван в", new Date().toISOString())
  
  return NextResponse.json({
    success: true,
    message: "Сервер работает, логи пишутся",
    timestamp: new Date().toISOString(),
    instruction: "Проверьте терминал, где запущен 'npm run dev' - там должны быть логи с эмодзи 📥, 📦, ✅ и т.д.",
  })
}






