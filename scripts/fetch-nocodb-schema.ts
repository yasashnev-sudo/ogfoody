#!/usr/bin/env tsx
/**
 * Скрипт для получения структуры всех таблиц из NocoDB
 * и сравнения с тем, что используется в коде
 */

import * as fs from 'fs';
import * as path from 'path';

const NOCODB_URL = process.env.NOCODB_URL || 'http://172.20.0.2:8080';
const NOCODB_TOKEN = process.env.NOCODB_TOKEN || '';
const NOCODB_BASE_ID = process.env.NOCODB_BASE_ID || 'p9id5v4q0ukk9iz';

interface TableInfo {
  id: string;
  title: string;
  table_name: string;
  columns?: ColumnInfo[];
}

interface ColumnInfo {
  id: string;
  column_name: string;
  title: string;
  uidt: string; // тип данных
  dt?: string;
  pk?: boolean;
  rqd?: boolean;
}

async function fetchTableColumns(tableId: string): Promise<ColumnInfo[]> {
  let baseUrl = NOCODB_URL.replace(/\/$/, "");
  if (!baseUrl.endsWith("/api/v2")) {
    baseUrl = `${baseUrl}/api/v2`;
  }

  // Пробуем несколько вариантов endpoint
  const endpoints = [
    `${baseUrl}/meta/bases/${NOCODB_BASE_ID}/tables/${tableId}/columns`,
    `${baseUrl}/meta/tables/${tableId}/columns`,
  ];

  for (const url of endpoints) {
    try {
      const response = await fetch(url, {
        headers: {
          'xc-token': NOCODB_TOKEN,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data?.list || data || [];
      }
    } catch (error) {
      console.warn(`Failed to fetch from ${url}:`, error);
    }
  }

  // Fallback: получаем из примера записи
  try {
    const recordsUrl = `${baseUrl}/tables/${tableId}/records?limit=1`;
    const recordsResponse = await fetch(recordsUrl, {
      headers: {
        'xc-token': NOCODB_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    if (recordsResponse.ok) {
      const recordsData = await recordsResponse.json();
      const sampleRecord = recordsData?.list?.[0] || recordsData?.[0];
      if (sampleRecord) {
        return Object.keys(sampleRecord).map((key) => ({
          id: key,
          column_name: key,
          title: key,
          uidt: typeof sampleRecord[key] === 'number' 
            ? (Number.isInteger(sampleRecord[key]) ? 'Number' : 'Decimal')
            : typeof sampleRecord[key] === 'boolean' 
            ? 'Checkbox'
            : 'SingleLineText',
          pk: key.toLowerCase() === 'id',
          rqd: false,
        }));
      }
    }
  } catch (error) {
    console.warn(`Failed to fetch sample record:`, error);
  }

  return [];
}

async function fetchAllTables(): Promise<TableInfo[]> {
  let baseUrl = NOCODB_URL.replace(/\/$/, "");
  if (!baseUrl.endsWith("/api/v2")) {
    baseUrl = `${baseUrl}/api/v2`;
  }

  const tablesUrl = `${baseUrl}/meta/bases/${NOCODB_BASE_ID}/tables`;
  const response = await fetch(tablesUrl, {
    headers: {
      'xc-token': NOCODB_TOKEN,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tables: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data?.list || [];
}

async function main() {
  console.log('📥 Получение структуры всех таблиц из NocoDB...\n');

  const tables = await fetchAllTables();
  console.log(`✅ Найдено таблиц: ${tables.length}\n`);

  const tableIds: Record<string, string> = {
    Meals: 'm6h073y33i44nwx',
    Extras: 'm43rjzbwcon7a9p',
    Delivery_Zones: 'mozhmlebwluzna4',
    Users: 'mg9dm2m41bjv8ar',
    Orders: 'm96i4ai2yelbboh',
    Order_Persons: 'm6jccosyrdiz2bm',
    Order_Meals: 'mvwp0iaqj2tne15',
    Order_Extras: 'mm5yxpaojbtjs4v',
    Promo_Codes: 'mbm55wmm3ok48n8',
    Reviews: 'mrfo7gyp91oq77b',
    Loyalty_Points_Transactions: 'mn244txmccpwmhx',
    Fraud_Alerts: 'mr9txejs65nk1yi',
  };

  const results: Record<string, { tableId: string; columns: ColumnInfo[] }> = {};

  for (const [tableName, tableId] of Object.entries(tableIds)) {
    console.log(`📋 Получение структуры таблицы: ${tableName} (${tableId})...`);
    const columns = await fetchTableColumns(tableId);
    results[tableName] = { tableId, columns };
    console.log(`   ✅ Получено колонок: ${columns.length}`);
  }

  // Сохраняем результаты
  const outputPath = path.join(process.cwd(), 'nocodb-schema.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n✅ Структура сохранена в: ${outputPath}`);

  // Выводим структуру для Loyalty_Points_Transactions
  console.log('\n📊 Структура таблицы Loyalty_Points_Transactions:');
  const loyaltyColumns = results['Loyalty_Points_Transactions']?.columns || [];
  loyaltyColumns.forEach((col) => {
    console.log(`   - ${col.title || col.column_name} (${col.uidt})`);
  });
}

main().catch(console.error);
