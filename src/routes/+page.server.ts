import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { submissionSchema } from '$lib/validation';
import { db } from '$lib/server/db';
import { getClientIp } from '$lib/server/rateLimit';

function flattenErrors(fieldErrors: Record<string, string[] | undefined>) {
  return Object.fromEntries(
    Object.entries(fieldErrors)
      .filter(([, value]) => value && value.length > 0)
      .map(([key, value]) => [key, value?.[0] ?? 'Invalid value'])
  );
}

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();

    const rawValues = {
      full_name: String(formData.get('full_name') ?? ''),
      address: String(formData.get('address') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      comments: String(formData.get('comments') ?? ''),
      wants_contact: formData.get('wants_contact') === 'on',
      accepted_christ: formData.get('accepted_christ') === 'on'
    };

    const parsed = submissionSchema.safeParse(rawValues);

    if (!parsed.success) {
      return fail(400, {
        errors: flattenErrors(parsed.error.flatten().fieldErrors),
        values: rawValues
      });
    }

    const ipAddress = getClientIp(request.headers);
    const userAgent = request.headers.get('user-agent') ?? null;

    db.prepare(
      `
      INSERT INTO submissions (
        full_name,
        address,
        phone,
        comments,
        wants_contact,
        accepted_christ,
        ip_address,
        user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `
    ).run(
      parsed.data.full_name,
      parsed.data.address,
      parsed.data.phone || null,
      parsed.data.comments || null,
      parsed.data.wants_contact ? 1 : 0,
      parsed.data.accepted_christ ? 1 : 0,
      ipAddress,
      userAgent
    );

    throw redirect(303, '/thank-you');
  }
};
