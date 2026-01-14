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

// Пробуем использовать оригинальный логотип, если есть, иначе logo-small.png
const ORIGINAL_LOGO = path.join(__dirname, '../public/OGFooDY логотип.png');
const SMALL_LOGO = path.join(__dirname, '../public/logo-small.png');
const LOGO_PATH = fs.existsSync(ORIGINAL_LOGO) ? ORIGINAL_LOGO : SMALL_LOGO;
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
  console.error('❌ Ошибка: логотип не найден в папке public/');
  console.error('   Искали: OGFooDY логотип.png или logo-small.png');
  console.error('   Убедитесь, что файл существует');
  process.exit(1);
}

console.log(`📸 Используется логотип: ${path.basename(LOGO_PATH)}`);

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

    // Создаем favicon.ico (используем PNG, браузеры его поддерживают)
    console.log('\n📦 Создаю favicon.ico...');
    const favicon32 = await sharp(LOGO_PATH)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 234, b: 0, alpha: 1 }
      })
      .png()
      .toBuffer();

    // Создаем favicon.ico в public/
    await sharp(favicon32)
      .png()
      .toFile(path.join(OUTPUT_DIR, 'favicon.ico'));
    
    // Создаем файлы для Next.js App Router в app/
    const appIconDir = path.join(__dirname, '../app');
    if (!fs.existsSync(appIconDir)) {
      fs.mkdirSync(appIconDir, { recursive: true });
    }
    
    // app/favicon.ico - классический фавикон
    await sharp(favicon32)
      .png()
      .toFile(path.join(appIconDir, 'favicon.ico'));
    
    // app/icon.png - современный фавикон (32x32)
    await sharp(favicon32)
      .png()
      .toFile(path.join(appIconDir, 'icon.png'));
    
    // app/apple-icon.png - для iOS (180x180)
    const appleIcon = await sharp(LOGO_PATH)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 255, g: 234, b: 0, alpha: 1 }
      })
      .png()
      .toBuffer();
    await sharp(appleIcon)
      .png()
      .toFile(path.join(appIconDir, 'apple-icon.png'));
    
    console.log('✅ Создан: favicon.ico, app/favicon.ico, app/icon.png, app/apple-icon.png');

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

    // Создаем Open Graph изображение для социальных сетей
    console.log('\n🖼️  Создаю og-image.png для Open Graph...');
    const ogImage = await sharp(LOGO_PATH)
      .resize(1200, 630, {
        fit: 'contain',
        background: { r: 255, g: 234, b: 0, alpha: 1 } // #FFEA00
      })
      .png()
      .toBuffer();
    
    // В public/ для обратной совместимости
    await sharp(ogImage)
      .png()
      .toFile(path.join(OUTPUT_DIR, 'og-image.png'));
    
    // В app/ для Next.js App Router (автоматически используется)
    await sharp(ogImage)
      .png()
      .toFile(path.join(appIconDir, 'opengraph-image.png'));
    
    console.log('✅ Создан: og-image.png (1200x630) в public/ и app/opengraph-image.png');

    console.log('\n✨ Все иконки успешно созданы!');
    console.log('\n📝 Следующие шаги:');
    console.log('   1. Проверьте созданные файлы в папке public/');
    console.log('   2. Перезапустите приложение для применения изменений');
    
  } catch (error) {
    console.error('❌ Ошибка при генерации иконок:', error.message);
    process.exit(1);
  }
}

generateIcons();
