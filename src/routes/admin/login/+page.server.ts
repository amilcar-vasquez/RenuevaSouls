import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import bcrypt from 'bcrypt';
import { db } from '$lib/server/db';
import { loginSchema } from '$lib/validation';
import { setAdminSession } from '$lib/server/auth';

function flattenErrors(fieldErrors: Record<string, string[] | undefined>) {
  return Object.fromEntries(
    Object.entries(fieldErrors)
      .filter(([, value]) => value && value.length > 0)
      .map(([key, value]) => [key, value?.[0] ?? 'Invalid value'])
  );
}

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.adminUser) {
    throw redirect(303, '/admin');
  }

  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();

    const values = {
      username: String(formData.get('username') ?? ''),
      password: String(formData.get('password') ?? '')
    };

    const parsed = loginSchema.safeParse(values);

    if (!parsed.success) {
      return fail(400, {
        errors: flattenErrors(parsed.error.flatten().fieldErrors),
        values: { username: values.username }
      });
    }

    const admin = db
      .prepare('SELECT username, password_hash FROM admins WHERE username = ? LIMIT 1')
      .get(parsed.data.username) as { username: string; password_hash: string } | undefined;

    if (!admin) {
      return fail(401, {
        errors: { auth: 'Invalid username or password' },
        values: { username: values.username }
      });
    }

    const passwordMatches = await bcrypt.compare(parsed.data.password, admin.password_hash);

    if (!passwordMatches) {
      return fail(401, {
        errors: { auth: 'Invalid username or password' },
        values: { username: values.username }
      });
    }

    setAdminSession(cookies, admin.username);
    throw redirect(303, '/admin');
  }
};
