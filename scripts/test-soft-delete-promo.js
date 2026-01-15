#!/usr/bin/env node

/**
 * Тестирование "мягкого удаления" промокодов через PATCH (установка active=false)
 */

const https = require('https');
const http = require('http');
const url = require('url');

const NOCODB_URL = process.env.NOCODB_URL || 'https://noco.povarnakolesah.ru';
const NOCODB_TOKEN = process.env.NOCODB_TOKEN;
const PROMO_TABLE_ID = process.env.NOCODB_TABLE_PROMO_CODES;

if (!NOCODB_TOKEN || !PROMO_TABLE_ID) {
  console.error('❌ NOCODB_TOKEN или NOCODB_TABLE_PROMO_CODES не установлен');
  process.exit(1);
}

const urlObj = url.parse(NOCODB_URL);
const httpModule = urlObj.protocol === 'https:' ? https : http;

// Получаем список промокодов
async function getPromoCodes() {
  return new Promise((resolve, reject) => {
    const requestUrl = url.parse(`${NOCODB_URL}/api/v2/tables/${PROMO_TABLE_ID}/records?limit=10`);
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

// Тестируем PATCH для деактивации
async function testSoftDelete(promoId) {
  return new Promise((resolve) => {
    const requestUrl = url.parse(`${NOCODB_URL}/api/v2/tables/${PROMO_TABLE_ID}/records`);
    const options = {
      hostname: requestUrl.hostname,
      port: requestUrl.port || (requestUrl.protocol === 'https:' ? 443 : 80),
      path: requestUrl.path,
      method: 'PATCH',
      headers: {
        'xc-token': NOCODB_TOKEN,
        'Content-Type': 'application/json',
      },
    };

    const req = httpModule.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk.toString(); });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          statusText: res.statusMessage,
          body: data || '(пустой ответ)',
          method: 'PATCH /records с [{Id: id, active: false}]',
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        status: 0,
        error: error.message,
        method: 'PATCH /records с [{Id: id, active: false}]',
      });
    });

    // Отправляем массив объектов с Id и active=false
    req.write(JSON.stringify([{ Id: promoId, active: false }]));
    req.end();
  });
}

async function main() {
  console.log('🧪 Тестирование "мягкого удаления" промокодов (PATCH active=false)...\n');

  try {
    const promoCodes = await getPromoCodes();
    
    if (promoCodes.length === 0) {
      console.log('⚠️  Промокоды не найдены.');
      return;
    }

    console.log(`✅ Найдено промокодов: ${promoCodes.length}`);
    const testPromo = promoCodes.find(p => (p.Active !== false && p.active !== false)) || promoCodes[0];
    const testId = testPromo.Id;
    console.log(`📝 Тестируем деактивацию промокода ID: ${testId} (код: ${testPromo.Code || testPromo.code || 'N/A'})\n`);

    console.log('🔍 Тестирование: PATCH /records с [{Id: id, active: false}]');
    const result = await testSoftDelete(testId);
    console.log(`   Статус: ${result.status} ${result.statusText || ''}`);
    if (result.body && result.body !== '(пустой ответ)') {
      console.log(`   Ответ: ${result.body.substring(0, 500)}`);
    }
    if (result.error) console.log(`   Ошибка: ${result.error}`);
    console.log('');

    if (result.status === 200) {
      console.log('✅ Метод работает! Промокод деактивирован.');
      console.log('💡 Используйте этот метод для "удаления" промокодов.');
    } else {
      console.log('❌ Метод не работает. Попробуем другие варианты...');
    }

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

main();
