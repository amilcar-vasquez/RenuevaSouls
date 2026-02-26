import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import type { SubmissionRow } from '$lib/server/db';

export const load: PageServerLoad = async ({ url, locals }) => {
  if (!locals.adminUser) {
    return {
      submissions: [],
      filter: 'all' as const,
      adminUser: null
    };
  }

  const filterParam = url.searchParams.get('filter');
  const filter = filterParam === 'contact' ? 'contact' : 'all';

  let query = `
    SELECT id, full_name, address, phone, comments, wants_contact, accepted_christ, created_at
    FROM submissions
  `;

  if (filter === 'contact') {
    query += ' WHERE wants_contact = 1';
  }

  query += ' ORDER BY datetime(created_at) DESC, id DESC';

  const submissions = db.prepare(query).all() as Array<
    Pick<SubmissionRow, 'id' | 'full_name' | 'address' | 'phone' | 'comments' | 'wants_contact' | 'accepted_christ' | 'created_at'>
  >;

  return {
    submissions,
    filter,
    adminUser: locals.adminUser
  };
};

export const actions: Actions = {
  delete: async ({ request, locals }) => {
    if (!locals.adminUser) {
      return fail(403, { error: 'Unauthorized' });
    }

    const data = await request.formData();
    const id = Number(data.get('id'));

    if (!id || isNaN(id)) {
      return fail(400, { error: 'Invalid id' });
    }

    db.prepare('DELETE FROM submissions WHERE id = ?').run(id);

    return { success: true };
  }
};
