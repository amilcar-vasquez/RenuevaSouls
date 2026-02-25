import { redirect, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';

function escapeCsv(value: string | number | null | undefined) {
  if (value === null || value === undefined) return '';
  const text = String(value);
  if (text.includes('"') || text.includes(',') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export const GET: RequestHandler = async ({ url, locals }) => {
  if (!locals.adminUser) {
    throw redirect(303, '/admin/login');
  }

  const filterParam = url.searchParams.get('filter');
  const filter = filterParam === 'contact' ? 'contact' : 'all';

  let query = `
    SELECT full_name, address, phone, wants_contact, comments, created_at
    FROM submissions
  `;

  if (filter === 'contact') {
    query += ' WHERE wants_contact = 1';
  }

  query += ' ORDER BY datetime(created_at) DESC, id DESC';

  const rows = db.prepare(query).all() as Array<{
    full_name: string;
    address: string;
    phone: string | null;
    wants_contact: number;
    comments: string | null;
    created_at: string;
  }>;

  const header = ['Name', 'Address', 'Phone', 'Wants Contact', 'Comments', 'Date Submitted'];
  const lines = [header.join(',')];

  for (const row of rows) {
    lines.push(
      [
        escapeCsv(row.full_name),
        escapeCsv(row.address),
        escapeCsv(row.phone),
        escapeCsv(row.wants_contact ? 'Yes' : 'No'),
        escapeCsv(row.comments),
        escapeCsv(row.created_at)
      ].join(',')
    );
  }

  return new Response(lines.join('\n'), {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="renueva-submissions-${filter}.csv"`
    }
  });
};
