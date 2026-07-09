import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '10 s'),
  analytics: true,
  prefix: 'nexova:ratelimit',
});

export function getClientIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    '127.0.0.1'
  );
}

export async function rateLimitResponse(req: Request): Promise<Response | null> {
  const ip = getClientIp(req);
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return new Response(
      JSON.stringify({ error: 'Zbyt wiele żądań. Spróbuj ponownie za chwilę.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': new Date(reset).toISOString(),
        },
      }
    );
  }
  return null;
}
