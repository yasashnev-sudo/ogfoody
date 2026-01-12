// API route для проксирования изображений с кешированием
// Позволяет кешировать изображения с сервера, но обновлять их при необходимости

import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } },
) {
  const imageUrl = decodeURIComponent(params.path.join("/"))

  // Проверяем, что это валидный URL
  if (!imageUrl || (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://"))) {
    return new NextResponse("Invalid image URL", { status: 400 })
  }

  try {
    // Получаем изображение с сервера
    const imageResponse = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ImageProxy/1.0)",
      },
      // Используем кеш браузера, но проверяем обновления
      next: {
        revalidate: 3600, // Кешируем на 1 час
      },
    })

    if (!imageResponse.ok) {
      return new NextResponse("Failed to fetch image", { status: imageResponse.status })
    }

    const imageBuffer = await imageResponse.arrayBuffer()
    const contentType = imageResponse.headers.get("content-type") || "image/jpeg"

    // Возвращаем изображение с правильными заголовками кеширования
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        // Кешируем на клиенте на 1 час, но разрешаем проверку обновлений
        "Cache-Control": "public, max-age=3600, must-revalidate, stale-while-revalidate=86400",
        // ETag для проверки изменений
        "ETag": imageResponse.headers.get("etag") || `"${Date.now()}"`,
        // Last-Modified для проверки изменений
        "Last-Modified": imageResponse.headers.get("last-modified") || new Date().toUTCString(),
      },
    })
  } catch (error) {
    console.error("Error fetching image:", error)
    return new NextResponse("Error fetching image", { status: 500 })
  }
}





