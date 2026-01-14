#!/usr/bin/env node

/**
 * Скрипт для генерации всех размеров фавиконов и иконок из логотипа
 * 
 * Использование:
 * 1. Установите sharp: npm install --save-dev sharp
 * 2. Запустите: node scripts/generate-favicons.js
 * 
 * Скрипт создаст все необходимые размеры иконок в папке public/
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const LOGO_PATH = path.join(__dirname, '../public/logo-small.png');
const OUTPUT_DIR = path.join(__dirname, '../public');

// Размеры иконок для генерации
const ICON_SIZES = {
  'favicon-16x16.png': 16,
  'favicon-32x32.png': 32,
  'favicon-96x96.png': 96,
  'apple-touch-icon.png': 180,
  'android-chrome-192x192.png': 192,
  'android-chrome-512x512.png': 512,
};

// Проверяем наличие исходного логотипа
if (!fs.existsSync(LOGO_PATH)) {
  console.error('❌ Ошибка: файл logo-small.png не найден в папке public/');
  console.error('   Убедитесь, что файл существует: ' + LOGO_PATH);
  process.exit(1);
}

console.log('🚀 Начинаю генерацию иконок из логотипа...\n');

// Генерируем все размеры
async function generateIcons() {
  try {
    for (const [filename, size] of Object.entries(ICON_SIZES)) {
      const outputPath = path.join(OUTPUT_DIR, filename);
      
      await sharp(LOGO_PATH)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 234, b: 0, alpha: 1 } // #FFEA00
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Создан: ${filename} (${size}x${size})`);
    }

    // Создаем favicon.ico (16x16 и 32x32 в одном файле)
    console.log('\n📦 Создаю favicon.ico...');
    const favicon16 = await sharp(LOGO_PATH)
      .resize(16, 16, {
        fit: 'contain',
        background: { r: 255, g: 234, b: 0, alpha: 1 }
      })
      .png()
      .toBuffer();
    
    const favicon32 = await sharp(LOGO_PATH)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 234, b: 0, alpha: 1 }
      })
      .png()
      .toBuffer();

    // Для простоты создаем favicon.ico как PNG 32x32
    // (настоящий .ico требует специальной библиотеки)
    await sharp(favicon32)
      .png()
      .toFile(path.join(OUTPUT_DIR, 'favicon.ico'));
    
    console.log('✅ Создан: favicon.ico');

    // Создаем SVG иконку для Safari pinned tab
    console.log('\n🎨 Создаю safari-pinned-tab.svg...');
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <image href="/logo-small.png" width="16" height="16" preserveAspectRatio="xMidYMid meet"/>
</svg>`;
    
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'safari-pinned-tab.svg'),
      svgContent
    );
    console.log('✅ Создан: safari-pinned-tab.svg');

    console.log('\n✨ Все иконки успешно созданы!');
    console.log('\n📝 Следующие шаги:');
    console.log('   1. Проверьте созданные файлы в папке public/');
    console.log('   2. При необходимости создайте og-image.png (1200x630) для Open Graph');
    console.log('   3. Перезапустите приложение для применения изменений');
    
  } catch (error) {
    console.error('❌ Ошибка при генерации иконок:', error.message);
    process.exit(1);
  }
}

generateIcons();
