#!/usr/bin/env node

/**
 * Тестовый скрипт для проверки Debug Report API
 * 
 * Запуск: node test-debug-report.js
 */

const testDebugReportAPI = async () => {
  console.log('🧪 Testing Debug Report API...\n')

  // Подготовка тестовых данных
  const testData = {
    logs: [
      '[2026-01-11T15:00:00.000Z] [LOG] Test log entry 1',
      '[2026-01-11T15:00:01.000Z] [ERROR] Test error entry',
      '[2026-01-11T15:00:02.000Z] [WARN] Test warning entry',
      '[2026-01-11T15:00:03.000Z] [INFO] Test info entry',
    ],
    screenshot: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', // 1x1 red pixel
    meta: {
      userId: 'test-user-123',
      userEmail: 'test@example.com',
      url: 'http://localhost:3000/test',
      userAgent: 'Node.js Test Script',
      timestamp: new Date().toISOString(),
      errorMessage: 'Test error from script',
      errorData: {
        testField: 'test value',
        nestedObject: {
          key: 'value'
        }
      }
    }
  }

  try {
    console.log('📤 Sending POST request to /api/debug/report...')
    
    const response = await fetch('http://localhost:3000/api/debug/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    })

    console.log(`📊 Response status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Request failed:', errorText)
      process.exit(1)
    }

    const result = await response.json()
    
    console.log('\n✅ Success! Response:')
    console.log(JSON.stringify(result, null, 2))
    
    if (result.files) {
      console.log('\n📁 Created files:')
      console.log(`  - Logs: debug_reports/${result.files.logs}`)
      if (result.files.screenshot) {
        console.log(`  - Screenshot: debug_reports/${result.files.screenshot}`)
      }
    }
    
    console.log('\n🎉 Test completed successfully!')
    console.log('\n💡 Check the debug_reports/ folder to see the generated files.')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error('\n⚠️  Make sure:')
    console.error('   1. The development server is running (npm run dev)')
    console.error('   2. The server is accessible at http://localhost:3000')
    process.exit(1)
  }
}

// Запуск теста
testDebugReportAPI()


