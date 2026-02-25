import { redirect, type Handle } from '@sveltejs/kit';
import { getAdminFromCookies } from '$lib/server/auth';
import { getClientIp, isSubmissionRateLimited } from '$lib/server/rateLimit';

export const handle: Handle = async ({ event, resolve }) => {
  const pathname = event.url.pathname;
  const method = event.request.method;

  if (pathname === '/' && method === 'POST') {
    const ipAddress = getClientIp(event.request.headers);

    if (isSubmissionRateLimited(ipAddress)) {
      return new Response('Too many submissions from this IP. Please try again in a few minutes.', {
        status: 429,
        headers: { 'content-type': 'text/plain' }
      });
    }
  }

  event.locals.adminUser = getAdminFromCookies(event.cookies) ?? undefined;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !event.locals.adminUser) {
    throw redirect(303, '/admin/login');
  }

  if (pathname === '/admin/login' && method === 'GET' && event.locals.adminUser) {
    throw redirect(303, '/admin');
  }

  return resolve(event);
};
