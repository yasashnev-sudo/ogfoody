#!/usr/bin/env node

/**
 * Скрипт для добавления поля comment в таблицу Promo_Codes
 */

const https = require('https');
const http = require('http');
const url = require('url');

const NOCODB_URL = process.env.NOCODB_URL || 'https://noco.povarnakolesah.ru';
const NOCODB_TOKEN = process.env.NOCODB_TOKEN;
const PROMO_TABLE_ID = process.env.NOCODB_TABLE_PROMO_CODES || 'mbm55wmm3ok48n8';

if (!NOCODB_TOKEN) {
  console.error('❌ NOCODB_TOKEN не установлен');
  process.exit(1);
}

const urlObj = url.parse(NOCODB_URL);
const httpModule = urlObj.protocol === 'https:' ? https : http;

// Получаем информацию о таблице
async function getTableInfo() {
  return new Promise((resolve, reject) => {
    const requestUrl = url.parse(`${NOCODB_URL}/api/v2/meta/tables/${PROMO_TABLE_ID}`);
    const options = {
      hostname: requestUrl.hostname,
      port: requestUrl.port || (requestUrl.protocol === 'https:' ? 443 : 80),
      path: requestUrl.path,
      method: 'GET',
      headers: {
        'xc-token': NOCODB_TOKEN,
        'Content-Type': 'application/json',
      },
    };

    const req = httpModule.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Добавляем колонку
async function addColumn(columnData) {
  return new Promise((resolve, reject) => {
    const requestUrl = url.parse(`${NOCODB_URL}/api/v2/meta/tables/${PROMO_TABLE_ID}/columns`);
    const options = {
      hostname: requestUrl.hostname,
      port: requestUrl.port || (requestUrl.protocol === 'https:' ? 443 : 80),
      path: requestUrl.path,
      method: 'POST',
      headers: {
        'xc-token': NOCODB_TOKEN,
        'Content-Type': 'application/json',
      },
    };

    const req = httpModule.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`📤 Добавление колонки ${columnData.column_name}: HTTP ${res.statusCode}`);
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const result = JSON.parse(data);
            resolve(result);
          } catch (e) {
            resolve({ success: true });
          }
        } else if (res.statusCode === 400 && data.includes('already exists')) {
          console.log(`⚠️  Колонка ${columnData.column_name} уже существует`);
          resolve({ exists: true });
        } else {
          console.error(`❌ Ошибка: ${data.substring(0, 200)}`);
          reject(new Error(`HTTP ${res.statusCode}: ${data.substring(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(columnData));
    req.end();
  });
}

async function main() {
  console.log('🔧 Добавление поля comment в таблицу Promo_Codes...\n');

  try {
    // Проверяем существующие колонки
    const tableInfo = await getTableInfo();
    const existingColumns = tableInfo.columns || [];
    const columnNames = existingColumns.map((c) => 
      (c.column_name || '').toLowerCase()
    );

    console.log('📋 Существующие колонки:', columnNames.join(', '));
    console.log('');

    // Добавляем comment если нет
    if (!columnNames.includes('comment')) {
      console.log('➕ Добавление колонки comment...');
      await addColumn({
        column_name: 'comment',
        title: 'Comment',
        uidt: 'LongText',
        rqd: false,
      });
      console.log('✅ Колонка comment добавлена!');
    } else {
      console.log('✅ Колонка comment уже существует');
    }

    console.log('\n✅ Таблица Promo_Codes обновлена!');
    console.log('\n💡 Теперь можно добавлять комментарии к промокодам');

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    console.log('\n💡 Добавьте колонку вручную в NocoDB:');
    console.log('   - comment (LongText, необязательное)');
    process.exit(1);
  }
}

main();
