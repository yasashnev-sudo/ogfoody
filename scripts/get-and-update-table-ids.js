#!/usr/bin/env node

/**
 * Скрипт для получения Table ID и обновления .env.production
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

const NOCODB_URL = process.env.NOCODB_URL || 'https://noco.povarnakolesah.ru';
const NOCODB_TOKEN = process.env.NOCODB_TOKEN;
const BASE_ID = 'p9id5v4q0ukk9iz'; // ID базы FooD

if (!NOCODB_TOKEN) {
  console.error('❌ NOCODB_TOKEN не установлен');
  process.exit(1);
}

const urlObj = new URL(NOCODB_URL);
const httpModule = urlObj.protocol === 'https:' ? https : http;

// Получаем список таблиц
function getTables() {
  return new Promise((resolve, reject) => {
    const url = new URL(`${NOCODB_URL}/api/v2/meta/bases/${BASE_ID}/tables`);
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
          const result = JSON.parse(data);
          resolve(result.list || []);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Обновляем .env.production
function updateEnvFile(messagesId, notificationsId) {
  const envPath = path.join(process.cwd(), '.env.production');
  
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf-8');
  }

  // Удаляем старые строки если есть
  envContent = envContent.replace(/^NOCODB_TABLE_MESSAGES=.*$/m, '');
  envContent = envContent.replace(/^NOCODB_TABLE_PUSH_NOTIFICATIONS=.*$/m, '');

  // Добавляем новые строки
  if (!envContent.endsWith('\n') && envContent.length > 0) {
    envContent += '\n';
  }
  envContent += `NOCODB_TABLE_MESSAGES=${messagesId}\n`;
  envContent += `NOCODB_TABLE_PUSH_NOTIFICATIONS=${notificationsId}\n`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.production обновлен');
}

async function main() {
  console.log('🔍 Поиск таблиц Messages и Push_Notifications...\n');

  try {
    const tables = await getTables();
    
    // Ищем таблицы по разным вариантам названий
    const messagesTable = tables.find(t => 
      t.table_name === 'Messages' || 
      t.title === 'Messages' ||
      t.table_name.toLowerCase().includes('message') ||
      t.title.toLowerCase().includes('message')
    );

    const notificationsTable = tables.find(t => 
      t.table_name === 'Push_Notifications' || 
      t.title === 'Push_Notifications' ||
      t.table_name.toLowerCase().includes('push') ||
      t.table_name.toLowerCase().includes('notification') ||
      t.title.toLowerCase().includes('push') ||
      t.title.toLowerCase().includes('notification')
    );

    if (!messagesTable) {
      console.error('❌ Таблица Messages не найдена');
      console.log('📋 Доступные таблицы:', tables.map(t => `${t.table_name} (${t.title}) - ${t.id}`).join('\n'));
      process.exit(1);
    }

    if (!notificationsTable) {
      console.error('❌ Таблица Push_Notifications не найдена');
      console.log('📋 Доступные таблицы:', tables.map(t => `${t.table_name} (${t.title}) - ${t.id}`).join('\n'));
      process.exit(1);
    }

    console.log('✅ Найденные таблицы:');
    console.log(`   Messages: ${messagesTable.id} (${messagesTable.table_name || messagesTable.title})`);
    console.log(`   Push_Notifications: ${notificationsTable.id} (${notificationsTable.table_name || notificationsTable.title})\n`);

    // Обновляем .env.production
    updateEnvFile(messagesTable.id, notificationsTable.id);

    console.log('\n📝 Добавлено в .env.production:');
    console.log(`   NOCODB_TABLE_MESSAGES=${messagesTable.id}`);
    console.log(`   NOCODB_TABLE_PUSH_NOTIFICATIONS=${notificationsTable.id}\n`);

    console.log('✅ Готово! Теперь перезапустите приложение: pm2 restart ogfoody');

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    process.exit(1);
  }
}

main();
