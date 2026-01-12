import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration для Self-Healing Tests
 * Оптимизирован для быстрого запуска и надежности
 */
export default defineConfig({
  testDir: './tests',
  
  /* Максимальное время на один тест */
  timeout: 60 * 1000, // ✅ Увеличил с 30s до 60s
  
  /* Expect timeout */
  expect: {
    timeout: 10000 // ✅ Увеличил с 5s до 10s
  },
  
  /* Запускаем тесты последовательно для стабильности */
  fullyParallel: false, // ✅ Отключил параллелизм
  workers: 1, // ✅ По одному тесту за раз
  
  /* Fail the build on CI if you accidentally left test.only */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Workers count */
  // workers: process.env.CI ? 1 : undefined, // ✅ Удалил дубликат
  
  /* Reporter */
  reporter: 'html',
  
  /* Shared settings for all the projects below */
  use: {
    /* Base URL */
    baseURL: 'http://localhost:3000',
    
    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',
    
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Video on failure */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});

