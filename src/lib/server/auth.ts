import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import type { Cookies } from '@sveltejs/kit';

const SESSION_COOKIE = 'renueva_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error('SESSION_SECRET is not set. Add it to your .env file.');
  }

  return secret;
}

function base64UrlEncode(input: string) {
  return Buffer.from(input, 'utf8').toString('base64url');
}

function base64UrlDecode(input: string) {
  return Buffer.from(input, 'base64url').toString('utf8');
}

function sign(data: string) {
  return createHmac('sha256', getSessionSecret()).update(data).digest('base64url');
}

type SessionPayload = {
  username: string;
  exp: number;
  nonce: string;
};

function createSessionToken(username: string) {
  const payload: SessionPayload = {
    username,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    nonce: randomBytes(12).toString('hex')
  };

  const encoded = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(encoded);

  return `${encoded}.${signature}`;
}

function parseSessionToken(token: string): SessionPayload | null {
  const [encoded, providedSignature] = token.split('.');

  if (!encoded || !providedSignature) {
    return null;
  }

  const expectedSignature = sign(encoded);
  const a = Buffer.from(providedSignature);
  const b = Buffer.from(expectedSignature);

  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return null;
  }

  try {
    const parsed = JSON.parse(base64UrlDecode(encoded)) as SessionPayload;

    if (!parsed.username || !parsed.exp || parsed.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function setAdminSession(cookies: Cookies, username: string) {
  const token = createSessionToken(username);

  cookies.set(SESSION_COOKIE, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_TTL_SECONDS
  });
}

export function clearAdminSession(cookies: Cookies) {
  cookies.delete(SESSION_COOKIE, { path: '/' });
}

export function getAdminFromCookies(cookies: Cookies) {
  const token = cookies.get(SESSION_COOKIE);
  if (!token) return null;

  const payload = parseSessionToken(token);
  return payload?.username ?? null;
}
