#!/usr/bin/env node

/**
 * Скрипт для создания таблиц Messages и Push_Notifications в NocoDB
 * Запускается на сервере после деплоя
 * 
 * Использование:
 * node scripts/setup-admin-tables.js
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

const NOCODB_URL = process.env.NOCODB_URL || 'https://noco.povarnakolesah.ru';
const NOCODB_TOKEN = process.env.NOCODB_TOKEN;

// Определяем какой модуль использовать
const urlObj = new URL(NOCODB_URL);
const httpModule = urlObj.protocol === 'https:' ? https : http;

if (!NOCODB_TOKEN) {
  console.error('❌ NOCODB_TOKEN не установлен в переменных окружения');
  process.exit(1);
}

// Получаем базовый ID из URL
async function getBaseId() {
  return new Promise((resolve, reject) => {
    const url = new URL(`${NOCODB_URL}/api/v2/meta/bases`);
    const options = {
      method: 'GET',
      headers: {
        'xc-token': NOCODB_TOKEN,
        'Content-Type': 'application/json',
      },
    };

    const req = httpModule.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const bases = JSON.parse(data);
          // Ищем базу "FooD"
          const foodBase = bases.list?.find(b => b.title === 'FooD' || b.title === 'Food');
          if (foodBase) {
            resolve(foodBase.id);
          } else {
            console.log('📋 Доступные базы:', bases.list?.map(b => b.title));
            reject(new Error('База FooD не найдена'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Создаем таблицу
async function createTable(baseId, tableName, columns) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${NOCODB_URL}/api/v2/meta/bases/${baseId}/tables`);
    const options = {
      method: 'POST',
      headers: {
        'xc-token': NOCODB_TOKEN,
        'Content-Type': 'application/json',
      },
    };

    const tableData = {
      table_name: tableName,
      title: tableName,
      columns: columns,
    };

    const req = httpModule.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`📤 [${tableName}] HTTP ${res.statusCode}, ответ:`, data.substring(0, 300));
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const result = JSON.parse(data);
            console.log(`✅ [${tableName}] Создана, ID: ${result.id || result.Id || 'N/A'}, table_name: ${result.table_name || result.tableName || 'N/A'}`);
            resolve(result);
          } else if (res.statusCode === 400) {
            // Если таблица уже существует, это нормально
            if (data.includes('already exists') || data.includes('duplicate') || data.includes('unique constraint')) {
              console.log(`⚠️  [${tableName}] Уже существует`);
              resolve({ exists: true });
            } else {
              console.error(`❌ [${tableName}] Ошибка 400:`, data);
              reject(new Error(`Ошибка создания таблицы (400): ${data.substring(0, 200)}`));
            }
          } else {
            console.error(`❌ [${tableName}] Неожиданный статус ${res.statusCode}:`, data.substring(0, 200));
            reject(new Error(`HTTP ${res.statusCode}: ${data.substring(0, 200)}`));
          }
        } catch (e) {
          console.error(`❌ [${tableName}] Ошибка парсинга:`, e.message, 'Данные:', data.substring(0, 200));
          reject(new Error(`Ошибка парсинга: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(tableData));
    req.end();
  });
}

// Определения колонок для Messages (упрощенный формат)
const messagesColumns = [
  {
    column_name: 'user_id',
    title: 'User ID',
    uidt: 'Number',
    dt: 'bigint',
    rqd: false,
  },
  {
    column_name: 'user_phone',
    title: 'User Phone',
    uidt: 'SingleLineText',
    rqd: false,
  },
  {
    column_name: 'user_name',
    title: 'User Name',
    uidt: 'SingleLineText',
    rqd: false,
  },
  {
    column_name: 'message',
    title: 'Message',
    uidt: 'LongText',
    rqd: true,
  },
  {
    column_name: 'is_admin',
    title: 'Is Admin',
    uidt: 'Checkbox',
    rqd: false,
    cdf: 'false',
  },
  {
    column_name: 'is_read',
    title: 'Is Read',
    uidt: 'Checkbox',
    rqd: false,
    cdf: 'false',
  },
  {
    column_name: 'created_at',
    title: 'Created At',
    uidt: 'DateTime',
    rqd: false,
  },
];

// Определения колонок для Push_Notifications (упрощенный формат)
const notificationsColumns = [
  {
    column_name: 'title',
    title: 'Title',
    uidt: 'SingleLineText',
    rqd: true,
  },
  {
    column_name: 'message',
    title: 'Message',
    uidt: 'LongText',
    rqd: true,
  },
  {
    column_name: 'target_type',
    title: 'Target Type',
    uidt: 'SingleLineText',
    rqd: false,
    cdf: "'all'",
  },
  {
    column_name: 'target_value',
    title: 'Target Value',
    uidt: 'SingleLineText',
    rqd: false,
  },
  {
    column_name: 'status',
    title: 'Status',
    uidt: 'SingleLineText',
    rqd: false,
    cdf: "'pending'",
  },
  {
    column_name: 'scheduled_at',
    title: 'Scheduled At',
    uidt: 'DateTime',
    rqd: false,
  },
  {
    column_name: 'sent_at',
    title: 'Sent At',
    uidt: 'DateTime',
    rqd: false,
  },
  {
    column_name: 'created_at',
    title: 'Created At',
    uidt: 'DateTime',
    rqd: false,
  },
];

async function main() {
  console.log('🚀 Настройка таблиц для админ-панели...\n');

  try {
    // Получаем ID базы данных
    console.log('📋 Поиск базы данных FooD...');
    const baseId = await getBaseId();
    console.log(`✅ База данных найдена: ${baseId}\n`);

    // Создаем таблицу Messages
    console.log('📨 Создание таблицы Messages...');
    try {
      const messagesResult = await createTable(baseId, 'Messages', messagesColumns);
      if (messagesResult.exists) {
        console.log('✅ Таблица Messages уже существует\n');
      } else {
        console.log('✅ Таблица Messages создана, ожидание синхронизации...\n');
        // Даем время на синхронизацию в базе
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error('❌ Ошибка создания таблицы Messages:', error.message);
      console.log('💡 Создайте таблицу вручную в NocoDB\n');
    }

    // Создаем таблицу Push_Notifications
    console.log('🔔 Создание таблицы Push_Notifications...');
    try {
      const notificationsResult = await createTable(baseId, 'Push_Notifications', notificationsColumns);
      if (notificationsResult.exists) {
        console.log('✅ Таблица Push_Notifications уже существует\n');
      } else {
        console.log('✅ Таблица Push_Notifications создана, ожидание синхронизации...\n');
        // Даем время на синхронизацию в базе
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error('❌ Ошибка создания таблицы Push_Notifications:', error.message);
      console.log('💡 Создайте таблицу вручную в NocoDB\n');
    }

    console.log('📝 Следующие шаги:');
    console.log('1. Откройте NocoDB: https://noco.povarnakolesah.ru');
    console.log('2. Найдите созданные таблицы Messages и Push_Notifications');
    console.log('3. Скопируйте Table ID из URL каждой таблицы (например: md_xxxxx)');
    console.log('4. Добавьте в .env.production:');
    console.log('   NOCODB_TABLE_MESSAGES=md_xxxxx');
    console.log('   NOCODB_TABLE_PUSH_NOTIFICATIONS=md_xxxxx');
    console.log('5. Перезапустите приложение: pm2 restart ogfoody');

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    console.log('\n💡 Создайте таблицы вручную в NocoDB согласно инструкциям в ADMIN_PANEL_SETUP.md');
    process.exit(1);
  }
}

main();
