import type { PageServerLoad } from './$types';
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
    SELECT id, full_name, address, phone, comments, wants_contact, created_at
    FROM submissions
  `;

  if (filter === 'contact') {
    query += ' WHERE wants_contact = 1';
  }

  query += ' ORDER BY datetime(created_at) DESC, id DESC';

  const submissions = db.prepare(query).all() as Array<
    Pick<SubmissionRow, 'id' | 'full_name' | 'address' | 'phone' | 'comments' | 'wants_contact' | 'created_at'>
  >;

  return {
    submissions,
    filter,
    adminUser: locals.adminUser
  };
};
