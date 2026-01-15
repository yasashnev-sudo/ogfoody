import { NextResponse } from 'next/server'

/**
 * Создает NextResponse с заголовками, запрещающими кеширование
 * Используется для всех API роутов, которые работают с БД
 */
export function noCacheResponse(data: any, status: number = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  })
}
