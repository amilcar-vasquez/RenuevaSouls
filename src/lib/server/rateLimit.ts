const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

type Entry = { timestamps: number[] };
const submissionStore = new Map<string, Entry>();

export function isSubmissionRateLimited(ipAddress: string, now = Date.now()) {
  const key = ipAddress || 'unknown';
  const windowStart = now - WINDOW_MS;
  const existing = submissionStore.get(key) ?? { timestamps: [] };
  const recent = existing.timestamps.filter((timestamp) => timestamp >= windowStart);

  if (recent.length >= MAX_REQUESTS) {
    submissionStore.set(key, { timestamps: recent });
    return true;
  }

  recent.push(now);
  submissionStore.set(key, { timestamps: recent });
  return false;
}

export function getClientIp(headers: Headers) {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  return headers.get('x-real-ip') ?? 'unknown';
}
