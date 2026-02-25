<script lang="ts">
  import { enhance } from '$app/forms';
  import { submissionSchema } from '$lib/validation';

  let { form } = $props();

  let submitting = false;
  let clientErrors: Record<string, string> = {};

  const defaults = {
    full_name: form?.values?.full_name ?? '',
    address: form?.values?.address ?? '',
    phone: form?.values?.phone ?? '',
    comments: form?.values?.comments ?? '',
    wants_contact: form?.values?.wants_contact ?? true
  };

  const serverErrors: Record<string, string> = form?.errors ?? {};

  function resolveError(field: string) {
    return clientErrors[field] ?? serverErrors[field] ?? '';
  }

  const submitEnhance = enhance(({ formData, cancel }) => {
    const values = {
      full_name: String(formData.get('full_name') ?? ''),
      address: String(formData.get('address') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      comments: String(formData.get('comments') ?? ''),
      wants_contact: formData.get('wants_contact') === 'on'
    };

    const parsed = submissionSchema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      clientErrors = Object.fromEntries(
        Object.entries(fieldErrors)
          .filter(([, value]) => value && value.length > 0)
          .map(([key, value]) => [key, value?.[0] ?? 'Invalid value'])
      );
      cancel();
      return;
    }

    clientErrors = {};
    submitting = true;

    return async ({ update, result }) => {
      submitting = false;
      await update({ reset: result.type === 'success' });
    };
  });
</script>

<svelte:head>
  <title>Renueva | New Believer Form</title>
  <meta
    name="description"
    content="Renueva church event form for collecting follow-up information from new believers."
  />
</svelte:head>

<main class="page">
  <section class="card">
    <h1>Renueva</h1>
    <p class="subtitle">Please share your information so we can support you.</p>

    {#if form?.success}
      <p class="success">Thank you. We will contact you soon.</p>
    {/if}

    <form method="POST" use:submitEnhance>
      <label for="full_name">Full Name *</label>
      <input id="full_name" name="full_name" type="text" required value={defaults.full_name} />
      {#if resolveError('full_name')}
        <p class="error">{resolveError('full_name')}</p>
      {/if}

      <label for="address">Address *</label>
      <input id="address" name="address" type="text" required value={defaults.address} />
      {#if resolveError('address')}
        <p class="error">{resolveError('address')}</p>
      {/if}

      <label for="phone">Phone Number</label>
      <input id="phone" name="phone" type="tel" value={defaults.phone} />
      {#if resolveError('phone')}
        <p class="error">{resolveError('phone')}</p>
      {/if}

      <label for="comments">Comments / Prayer Request</label>
      <textarea id="comments" name="comments" rows="4">{defaults.comments}</textarea>
      {#if resolveError('comments')}
        <p class="error">{resolveError('comments')}</p>
      {/if}

      <label class="checkbox" for="wants_contact">
        <input
          id="wants_contact"
          name="wants_contact"
          type="checkbox"
          checked={Boolean(defaults.wants_contact)}
        />
        <span>Would you like someone to contact you?</span>
      </label>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  </section>
</main>

<style>
  :global(body) {
    margin: 0;
    background: #f7f8fb;
    color: #1f1f1f;
    font-family: Inter, Roboto, 'Segoe UI', Arial, sans-serif;
  }

  .page {
    min-height: 100dvh;
    display: grid;
    place-items: center;
    padding: 1rem;
  }

  .card {
    width: 100%;
    max-width: 560px;
    background: #fff;
    border-radius: 16px;
    padding: 1.25rem;
    box-shadow: 0 4px 14px rgba(18, 43, 79, 0.08);
  }

  h1 {
    margin: 0;
    font-size: 1.6rem;
    color: #3557d6;
  }

  .subtitle {
    margin: 0.4rem 0 1.2rem;
    color: #555;
  }

  form {
    display: grid;
    gap: 0.7rem;
  }

  label {
    font-weight: 600;
    margin-top: 0.3rem;
  }

  input,
  textarea {
    border: 1px solid #d1d5e0;
    border-radius: 12px;
    padding: 0.75rem 0.85rem;
    font: inherit;
    background: #fff;
  }

  input:focus,
  textarea:focus {
    outline: 2px solid #3557d6;
    outline-offset: 1px;
    border-color: #3557d6;
  }

  .checkbox {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-weight: 500;
    margin-top: 0.4rem;
  }

  .checkbox input {
    width: 18px;
    height: 18px;
    padding: 0;
  }

  button {
    margin-top: 0.4rem;
    border: none;
    border-radius: 12px;
    padding: 0.85rem 1rem;
    font: inherit;
    font-weight: 600;
    background: #3557d6;
    color: #fff;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .error {
    margin: 0;
    color: #b22020;
    font-size: 0.9rem;
  }

  .success {
    margin: 0 0 1rem;
    background: #edf7ef;
    color: #1e6c2d;
    border-radius: 12px;
    padding: 0.75rem;
    font-weight: 500;
  }
</style>
