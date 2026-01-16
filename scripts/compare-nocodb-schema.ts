#!/usr/bin/env tsx
/**
 * Скрипт для сравнения структуры таблиц NocoDB с тем, что используется в коде
 */

import * as fs from 'fs';
import * as path from 'path';

// Получаем структуру через API
async function getTableStructure() {
  try {
    const response = await fetch('https://ogfoody.ru/api/db/get-fields');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching table structure:', error);
    return null;
  }
}

// Анализируем использование полей в коде
function analyzeCodeUsage() {
  const codePath = path.join(process.cwd(), 'lib/nocodb.ts');
  const code = fs.readFileSync(codePath, 'utf-8');
  
  const usage: Record<string, string[]> = {
    'Loyalty_Points_Transactions': [],
  };

  // Ищем использование полей для Loyalty_Points_Transactions
  const patterns = [
    /"User ID"|user_id/g,
    /"Order ID"|order_id/g,
    /"Transaction Type"|transaction_type/g,
    /"Transaction Status"|transaction_status/g,
    /"Points"|points/g,
    /"Description"|description/g,
    /"Created At"|created_at/g,
    /"Updated At"|updated_at/g,
    /"Processed At"|processed_at/g,
  ];

  patterns.forEach(pattern => {
    const matches = code.match(pattern);
    if (matches) {
      usage['Loyalty_Points_Transactions'].push(...matches);
    }
  });

  return usage;
}

async function main() {
  console.log('📊 Сравнение структуры таблиц NocoDB с кодом...\n');

  const structure = await getTableStructure();
  if (!structure || !structure.tables) {
    console.error('❌ Не удалось получить структуру таблиц');
    return;
  }

  const codeUsage = analyzeCodeUsage();

  // Фокусируемся на Loyalty_Points_Transactions
  const loyaltyTable = structure.tables['Loyalty_Points_Transactions'];
  if (loyaltyTable && loyaltyTable.fields) {
    console.log('📋 Поля в таблице Loyalty_Points_Transactions (из NocoDB):');
    loyaltyTable.fields.forEach((field: string) => {
      console.log(`   - ${field}`);
    });
    console.log();
  }

  console.log('💻 Поля, используемые в коде:');
  const uniqueFields = [...new Set(codeUsage['Loyalty_Points_Transactions'])];
  uniqueFields.forEach(field => {
    console.log(`   - ${field}`);
  });

  // Сохраняем результаты
  const output = {
    timestamp: new Date().toISOString(),
    structure,
    codeUsage,
  };

  const outputPath = path.join(process.cwd(), 'nocodb-schema-comparison.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\n✅ Результаты сохранены в: ${outputPath}`);
}

main().catch(console.error);
