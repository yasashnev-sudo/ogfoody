#!/usr/bin/env node

/**
 * Скрипт для тестирования удаления промокодов через NocoDB API
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

// Тестируем удаление методом 1: прямой DELETE с ID в пути
async function testDeleteMethod1(promoId) {
  return new Promise((resolve) => {
    const requestUrl = url.parse(`${NOCODB_URL}/api/v2/tables/${PROMO_TABLE_ID}/records/${promoId}`);
    const options = {
      hostname: requestUrl.hostname,
      port: requestUrl.port || (requestUrl.protocol === 'https:' ? 443 : 80),
      path: requestUrl.path,
      method: 'DELETE',
      headers: {
        'xc-token': NOCODB_TOKEN,
        'Content-Type': 'application/json',
      },
    };

    const req = httpModule.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          statusText: res.statusMessage,
          body: data,
          method: 'DELETE /records/{id}',
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        status: 0,
        error: error.message,
        method: 'DELETE /records/{id}',
      });
    });

    req.end();
  });
}

// Тестируем удаление методом 2: bulk delete с массивом ID в теле
async function testDeleteMethod2(promoId) {
  return new Promise((resolve) => {
    const requestUrl = url.parse(`${NOCODB_URL}/api/v2/tables/${PROMO_TABLE_ID}/records`);
    const options = {
      hostname: requestUrl.hostname,
      port: requestUrl.port || (requestUrl.protocol === 'https:' ? 443 : 80),
      path: requestUrl.path,
      method: 'DELETE',
      headers: {
        'xc-token': NOCODB_TOKEN,
        'Content-Type': 'application/json',
      },
    };

    const req = httpModule.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          statusText: res.statusMessage,
          body: data,
          method: 'DELETE /records с массивом ID [id]',
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        status: 0,
        error: error.message,
        method: 'DELETE /records с массивом ID [id]',
      });
    });

    // Отправляем массив ID в теле запроса
    req.write(JSON.stringify([promoId]));
    req.end();
  });
}

// Тестируем удаление методом 2b: bulk delete с массивом объектов {Id: id}
async function testDeleteMethod2b(promoId) {
  return new Promise((resolve) => {
    const requestUrl = url.parse(`${NOCODB_URL}/api/v2/tables/${PROMO_TABLE_ID}/records`);
    const options = {
      hostname: requestUrl.hostname,
      port: requestUrl.port || (requestUrl.protocol === 'https:' ? 443 : 80),
      path: requestUrl.path,
      method: 'DELETE',
      headers: {
        'xc-token': NOCODB_TOKEN,
        'Content-Type': 'application/json',
      },
    };

    const req = httpModule.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          statusText: res.statusMessage,
          body: data,
          method: 'DELETE /records с массивом объектов [{Id: id}]',
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        status: 0,
        error: error.message,
        method: 'DELETE /records с массивом объектов [{Id: id}]',
      });
    });

    // Отправляем массив объектов с Id
    req.write(JSON.stringify([{ Id: promoId }]));
    req.end();
  });
}

// Тестируем удаление методом 3: bulk delete с where и id в нижнем регистре
async function testDeleteMethod3(promoId) {
  return new Promise((resolve) => {
    const requestUrl = url.parse(`${NOCODB_URL}/api/v2/tables/${PROMO_TABLE_ID}/records?where=(id,eq,${promoId})`);
    const options = {
      hostname: requestUrl.hostname,
      port: requestUrl.port || (requestUrl.protocol === 'https:' ? 443 : 80),
      path: requestUrl.path,
      method: 'DELETE',
      headers: {
        'xc-token': NOCODB_TOKEN,
        'Content-Type': 'application/json',
      },
    };

    const req = httpModule.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          statusText: res.statusMessage,
          body: data,
          method: 'DELETE /records?where=(id,eq,{id})',
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        status: 0,
        error: error.message,
        method: 'DELETE /records?where=(id,eq,{id})',
      });
    });

    req.end();
  });
}

async function main() {
  console.log('🧪 Тестирование удаления промокодов через NocoDB API...\n');

  try {
    // Получаем список промокодов
    console.log('📋 Получение списка промокодов...');
    const promoCodes = await getPromoCodes();
    
    if (promoCodes.length === 0) {
      console.log('⚠️  Промокоды не найдены. Создайте промокод в NocoDB для тестирования.');
      return;
    }

    console.log(`✅ Найдено промокодов: ${promoCodes.length}`);
    const testPromo = promoCodes[0];
    const testId = testPromo.Id;
    console.log(`📝 Тестируем удаление промокода ID: ${testId} (код: ${testPromo.Code || testPromo.code || 'N/A'})\n`);

    // Тестируем все методы
    console.log('🔍 Тестирование метода 1: DELETE /records/{id}');
    const result1 = await testDeleteMethod1(testId);
    console.log(`   Статус: ${result1.status} ${result1.statusText || ''}`);
    if (result1.body) console.log(`   Ответ: ${result1.body.substring(0, 200)}`);
    if (result1.error) console.log(`   Ошибка: ${result1.error}`);
    console.log('');

    console.log('🔍 Тестирование метода 2: DELETE /records с массивом ID [id]');
    const result2 = await testDeleteMethod2(testId);
    console.log(`   Статус: ${result2.status} ${result2.statusText || ''}`);
    if (result2.body) console.log(`   Ответ: ${result2.body.substring(0, 200)}`);
    if (result2.error) console.log(`   Ошибка: ${result2.error}`);
    console.log('');

    console.log('🔍 Тестирование метода 2b: DELETE /records с массивом объектов [{Id: id}]');
    const result2b = await testDeleteMethod2b(testId);
    console.log(`   Статус: ${result2b.status} ${result2b.statusText || ''}`);
    if (result2b.body) console.log(`   Ответ: ${result2b.body.substring(0, 200)}`);
    if (result2b.error) console.log(`   Ошибка: ${result2b.error}`);
    console.log('');

    console.log('🔍 Тестирование метода 3: DELETE /records?where=(id,eq,{id})');
    const result3 = await testDeleteMethod3(testId);
    console.log(`   Статус: ${result3.status} ${result3.statusText || ''}`);
    if (result3.body) console.log(`   Ответ: ${result3.body.substring(0, 200)}`);
    if (result3.error) console.log(`   Ошибка: ${result3.error}`);
    console.log('');

    // Определяем рабочий метод
    const workingMethod = [result1, result2, result2b, result3].find(r => r.status === 200);
    
    // Если какой-то метод работает, проверяем что запись действительно удалена
    if (result2.status === 200 || result2b.status === 200) {
      console.log('🔄 Проверяем, что промокод действительно удален...');
      const promoCodesAfter = await getPromoCodes();
      const stillExists = promoCodesAfter.find(p => p.Id === testId);
      if (stillExists) {
        console.log('   ⚠️  Промокод все еще существует!');
      } else {
        console.log('   ✅ Промокод успешно удален!');
      }
      console.log('');
    }
    if (workingMethod) {
      console.log(`✅ Рабочий метод найден: ${workingMethod.method}`);
      console.log(`   Используйте этот формат для удаления!`);
    } else {
      console.log('❌ Ни один метод не вернул 200 OK');
      console.log('💡 Проверьте логи выше для деталей ошибок');
    }

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    console.error(error.stack);
  }
}

main();
