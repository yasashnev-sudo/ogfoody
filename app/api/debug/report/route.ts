import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
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
    [key: string]: any;
  };
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

    return NextResponse.json({
      success: true,
      files: {
        logs: logsFileName,
        screenshot: screenshotFileName || null,
      },
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

