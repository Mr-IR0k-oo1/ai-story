import { env } from "./env";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(
  key: string,
  max: number = env.RATE_LIMIT_MAX,
  windowMs: number = env.RATE_LIMIT_WINDOW_MS
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1, resetAt: now + windowMs };
  }

  entry.count++;

  if (entry.count > max) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { allowed: true, remaining: max - entry.count, resetAt: entry.resetAt };
}

export function resetRateLimit(key: string): void {
  store.delete(key);
}

let cleanupStarted = false;

function startCleanup(): void {
  if (cleanupStarted) return;
  cleanupStarted = true;

  const interval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now > entry.resetAt) {
        store.delete(key);
      }
    }
  }, 300_000);

  if (typeof interval === "object" && "unref" in interval) {
    (interval as ReturnType<typeof setInterval>).unref?.();
  }
}

startCleanup();
