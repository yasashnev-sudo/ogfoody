/**
 * Проверка IP-адреса для webhook уведомлений от ЮKassa
 * Список разрешенных IP-адресов согласно документации ЮKassa
 */

const ALLOWED_IP_RANGES = [
  // IPv4 ranges
  { start: '185.71.76.0', end: '185.71.76.31' }, // 185.71.76.0/27
  { start: '185.71.77.0', end: '185.71.77.31' }, // 185.71.77.0/27
  { start: '77.75.153.0', end: '77.75.153.127' }, // 77.75.153.0/25
  { start: '77.75.156.11', end: '77.75.156.11' }, // Single IP
  { start: '77.75.156.35', end: '77.75.156.35' }, // Single IP
  { start: '77.75.154.128', end: '77.75.154.255' }, // 77.75.154.128/25
]

/**
 * Преобразует IP-адрес в число для сравнения
 */
function ipToNumber(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0
}

/**
 * Проверяет, находится ли IP-адрес в разрешенном диапазоне
 */
function isIpInRange(ip: string, range: { start: string; end: string }): boolean {
  const ipNum = ipToNumber(ip)
  const startNum = ipToNumber(range.start)
  const endNum = ipToNumber(range.end)
  return ipNum >= startNum && ipNum <= endNum
}

/**
 * Проверяет, является ли IP-адрес разрешенным для webhook от ЮKassa
 * @param ip IP-адрес для проверки
 * @returns true, если IP разрешен, false в противном случае
 */
export function isValidYookassaIp(ip: string | null | undefined): boolean {
  if (!ip) {
    return false
  }

  // В режиме разработки разрешаем localhost
  if (process.env.NODE_ENV === 'development' && (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('::ffff:127.0.0.1'))) {
    console.log('⚠️ Development mode: allowing localhost IP')
    return true
  }

  // Проверяем IPv4 адреса
  for (const range of ALLOWED_IP_RANGES) {
    if (isIpInRange(ip, range)) {
      return true
    }
  }

  // Проверяем IPv6 (2a02:5180::/32)
  if (ip.startsWith('2a02:5180:')) {
    return true
  }

  return false
}

/**
 * Извлекает IP-адрес из заголовков запроса
 */
export function getClientIp(request: Request): string | null {
  // Проверяем различные заголовки, которые могут содержать реальный IP
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    // x-forwarded-for может содержать несколько IP через запятую
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }

  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  if (cfConnectingIp) {
    return cfConnectingIp.trim()
  }

  return null
}
