#!/usr/bin/env node

/**
 * Скрипт для обновления таблицы Promo_Codes - добавление полей для скидки в рублях
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

const NOCODB_URL = process.env.NOCODB_URL || 'https://noco.povarnakolesah.ru';
const NOCODB_TOKEN = process.env.NOCODB_TOKEN;
const BASE_ID = 'p9id5v4q0ukk9iz';
const PROMO_TABLE_ID = process.env.NOCODB_TABLE_PROMO_CODES || 'mbm55wmm3ok48n8';

if (!NOCODB_TOKEN) {
  console.error('❌ NOCODB_TOKEN не установлен');
  process.exit(1);
}

const urlObj = new URL(NOCODB_URL);
const httpModule = urlObj.protocol === 'https:' ? https : http;

// Получаем информацию о таблице
async function getTableInfo() {
  return new Promise((resolve, reject) => {
    const url = new URL(`${NOCODB_URL}/api/v2/meta/tables/${PROMO_TABLE_ID}`);
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
    const url = new URL(`${NOCODB_URL}/api/v2/meta/tables/${PROMO_TABLE_ID}/columns`);
    const options = {
      method: 'POST',
      headers: {
        'xc-token': NOCODB_TOKEN,
        'Content-Type': 'application/json',
      },
    };

    const req = httpModule.request(url, options, (res) => {
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
  console.log('🔧 Обновление таблицы Promo_Codes...\n');

  try {
    // Проверяем существующие колонки
    const tableInfo = await getTableInfo();
    const existingColumns = tableInfo.columns || [];
    const columnNames = existingColumns.map((c) => 
      (c.column_name || '').toLowerCase()
    );

    console.log('📋 Существующие колонки:', columnNames.join(', '));
    console.log('');

    // Добавляем discount_type если нет
    if (!columnNames.includes('discount_type')) {
      console.log('➕ Добавление колонки discount_type...');
      await addColumn({
        column_name: 'discount_type',
        title: 'Discount Type',
        uidt: 'SingleLineText',
        rqd: false,
        cdf: "'percent'",
      });
    } else {
      console.log('✅ Колонка discount_type уже существует');
    }

    // Добавляем discount_rubles если нет
    if (!columnNames.includes('discount_rubles')) {
      console.log('➕ Добавление колонки discount_rubles...');
      await addColumn({
        column_name: 'discount_rubles',
        title: 'Discount Rubles',
        uidt: 'Decimal',
        rqd: false,
        cdf: '0',
      });
    } else {
      console.log('✅ Колонка discount_rubles уже существует');
    }

    console.log('\n✅ Таблица Promo_Codes обновлена!');
    console.log('\n💡 Теперь можно создавать промокоды со скидкой в процентах или рублях');

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    console.log('\n💡 Добавьте колонки вручную в NocoDB:');
    console.log('   - discount_type (Text, по умолчанию: "percent")');
    console.log('   - discount_rubles (Decimal, по умолчанию: 0)');
    process.exit(1);
  }
}

main();
