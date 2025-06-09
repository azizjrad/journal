// Simple utility functions to replace the removed security module

/**
 * Get client IP from request
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

/**
 * Basic input validation
 */
export function validateInput(input: any, type: string = 'string'): boolean {
  if (input === null || input === undefined) {
    return false;
  }
  
  switch (type) {
    case 'string':
      return typeof input === 'string' && input.trim().length > 0;
    case 'number':
      return typeof input === 'number' && !isNaN(input);
    case 'email':
      return typeof input === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    default:
      return true;
  }
}

/**
 * Basic input sanitization
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove basic HTML tags
    .slice(0, 1000); // Limit length
}

/**
 * Add basic security headers
 */
export function addSecurityHeaders(response: Response): Response {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  return response;
}
