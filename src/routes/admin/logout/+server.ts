import { redirect, type RequestHandler } from '@sveltejs/kit';
import { clearAdminSession } from '$lib/server/auth';

export const POST: RequestHandler = async ({ cookies }) => {
  clearAdminSession(cookies);
  throw redirect(303, '/admin/login');
};
