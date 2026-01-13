import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const dynamic = 'force-dynamic';

interface DebugReport {
  logs: string[];
  screenshot?: string; // base64
  meta?: {
    userId?: string;
    userEmail?: string;
    url?: string;
    userAgent?: string;
    timestamp?: string;
    errorMessage?: string;
    userComment?: string;
    [key: string]: any;
  };
}

interface ReportIndex {
  reports: Array<{
    id: string;
    userId: string;
    userEmail: string;
    errorMessage: string;
    timestamp: string;
    url: string;
    userAgent: string;
    hasComment: boolean;
    files: {
      log: string;
      screenshot: string | null;
    };
  }>;
}

// 🔔 Функция для отправки уведомления в Telegram
async function sendTelegramNotification(report: any) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.log('[DEBUG] Telegram not configured, skipping notification');
    return;
  }

  const message = `
🐞 <b>Новый Debug Report</b>

❌ Ошибка: ${report.errorMessage}
👤 Пользователь: ${report.userEmail || report.userId}
📱 URL: ${report.url}
🕐 Время: ${new Date(report.timestamp).toLocaleString('ru-RU')}

${report.hasComment ? `💬 Комментарий: ${report.userComment}` : ''}

📂 Лог файл: ${report.files.log}
${report.files.screenshot ? `📸 Скриншот: ${report.files.screenshot}` : ''}
  `.trim();

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      console.error('[DEBUG] Telegram notification failed:', await response.text());
    } else {
      console.log('[DEBUG] Telegram notification sent successfully');
    }
  } catch (error: any) {
    console.error('[DEBUG] Failed to send Telegram notification:', error.message);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: DebugReport = await request.json();
    const { logs, screenshot, meta } = body;

    // Создаем папку для отчетов, если её нет
    const debugDir = join(process.cwd(), 'debug_reports');
    if (!existsSync(debugDir)) {
      await mkdir(debugDir, { recursive: true });
    }

    // Генерируем имя файла с timestamp и userId
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const userId = meta?.userId || 'guest';
    const baseFileName = `${timestamp}_user-${userId}`;

    // Сохраняем логи в текстовый файл
    const logsFileName = `${baseFileName}_logs.txt`;
    const logsFilePath = join(debugDir, logsFileName);
    
    const logsContent = [
      '='.repeat(80),
      'DEBUG REPORT',
      '='.repeat(80),
      `Timestamp: ${meta?.timestamp || new Date().toISOString()}`,
      `User ID: ${userId}`,
      `User Email: ${meta?.userEmail || 'N/A'}`,
      `URL: ${meta?.url || 'N/A'}`,
      `User Agent: ${meta?.userAgent || 'N/A'}`,
      meta?.errorMessage ? `Error Message: ${meta.errorMessage}` : '',
      meta?.userComment ? `\n📝 USER COMMENT:\n${meta.userComment}` : '', // ✅ Комментарий пользователя
      '',
      'Additional Metadata:',
      JSON.stringify(meta, null, 2),
      '',
      '='.repeat(80),
      'LOGS',
      '='.repeat(80),
      '',
      ...logs,
      '',
      '='.repeat(80),
      'END OF REPORT',
      '='.repeat(80),
    ].filter(Boolean).join('\n');

    await writeFile(logsFilePath, logsContent, 'utf-8');

    // Сохраняем скриншот, если он есть
    let screenshotFileName = '';
    if (screenshot) {
      screenshotFileName = `${baseFileName}_screenshot.png`;
      const screenshotFilePath = join(debugDir, screenshotFileName);
      
      // Убираем префикс data:image/png;base64, если он есть
      const base64Data = screenshot.replace(/^data:image\/png;base64,/, '');
      await writeFile(screenshotFilePath, base64Data, 'base64');
    }

    console.log(`[DEBUG REPORT] Saved report: ${logsFileName}${screenshot ? ` and ${screenshotFileName}` : ''}`);

    // 🔥 НОВОЕ: Обновляем индексный файл для AI
    const indexPath = join(debugDir, 'index.json');
    let index: ReportIndex = { reports: [] };
    
    try {
      if (existsSync(indexPath)) {
        const indexContent = await readFile(indexPath, 'utf-8');
        index = JSON.parse(indexContent);
      }
    } catch (error) {
      console.warn('[DEBUG] Failed to read index.json, creating new one');
    }

    // Добавляем новый отчет в начало списка
    const newReport = {
      id: timestamp,
      userId: userId,
      userEmail: meta?.userEmail || 'N/A',
      errorMessage: meta?.errorMessage || 'Unknown error',
      timestamp: meta?.timestamp || new Date().toISOString(),
      url: meta?.url || 'N/A',
      userAgent: meta?.userAgent || 'N/A',
      hasComment: !!meta?.userComment,
      userComment: meta?.userComment || null,
      files: {
        log: logsFileName,
        screenshot: screenshotFileName || null,
      },
    };

    index.reports.unshift(newReport); // Новые сверху

    // Оставляем только последние 100 отчетов
    index.reports = index.reports.slice(0, 100);

    // Сохраняем индекс
    await writeFile(indexPath, JSON.stringify(index, null, 2), 'utf-8');
    console.log('[DEBUG] Updated index.json');

    // 🔔 НОВОЕ: Отправляем Telegram уведомление
    await sendTelegramNotification(newReport);

    return NextResponse.json({
      success: true,
      files: {
        logs: logsFileName,
        screenshot: screenshotFileName || null,
      },
      reportId: timestamp,
      message: 'Debug report saved successfully',
    });
  } catch (error: any) {
    console.error('[DEBUG REPORT ERROR]', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to save debug report',
      },
      { status: 500 }
    );
  }
}

