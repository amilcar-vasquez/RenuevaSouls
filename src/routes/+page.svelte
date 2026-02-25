<script lang="ts">
  import { enhance } from '$app/forms';
  import { submissionSchema } from '$lib/validation';

  let { form } = $props();

  let submitting = $state(false);
  let clientErrors = $state<Record<string, string>>({});

  function fieldValue(field: string) {
    if (field === 'wants_contact') {
      return form?.values?.wants_contact ?? true;
    }

    return form?.values?.[field] ?? '';
  }

  function resolveError(field: string) {
    return clientErrors[field] ?? form?.errors?.[field] ?? '';
  }

  function handleSubmit({ formData, cancel }: { formData: FormData; cancel: () => void }) {
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

    return async ({ update }: { update: (opts?: { reset?: boolean }) => Promise<void> }) => {
      submitting = false;
      await update();
    };
  }
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
    <h1>Renueva 2026</h1>
    <p class="subtitle">Please share your information so we can support you.</p>

    <form method="POST" use:enhance={handleSubmit}>
      <label for="full_name">Full Name *</label>
      <input id="full_name" name="full_name" type="text" required value={String(fieldValue('full_name'))} />
      {#if resolveError('full_name')}
        <p class="error">{resolveError('full_name')}</p>
      {/if}

      <label for="address">Address *</label>
      <input id="address" name="address" type="text" required value={String(fieldValue('address'))} />
      {#if resolveError('address')}
        <p class="error">{resolveError('address')}</p>
      {/if}

      <label for="phone">Phone Number</label>
      <input id="phone" name="phone" type="tel" value={String(fieldValue('phone'))} />
      {#if resolveError('phone')}
        <p class="error">{resolveError('phone')}</p>
      {/if}

      <label for="comments">Comments / Prayer Request</label>
      <textarea id="comments" name="comments" rows="4">{String(fieldValue('comments'))}</textarea>
      {#if resolveError('comments')}
        <p class="error">{resolveError('comments')}</p>
      {/if}

      <label class="checkbox" for="wants_contact">
        <input
          id="wants_contact"
          name="wants_contact"
          type="checkbox"
          checked={Boolean(fieldValue('wants_contact'))}
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
    background: #141218;
    color: #E6E1E5;
    font-family: Inter, Roboto, 'Segoe UI', Arial, sans-serif;
    color-scheme: dark;
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
    background: #211F26;
    border-radius: 16px;
    padding: 1.25rem;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  }

  h1 {
    margin: 0;
    font-size: 1.6rem;
    color: #FFB74D;
  }

  .subtitle {
    margin: 0.4rem 0 1.2rem;
    color: #CAC4D0;
  }

  form {
    display: grid;
    gap: 0.7rem;
  }

  label {
    font-weight: 600;
    margin-top: 0.3rem;
    color: #E6E1E5;
  }

  input,
  textarea {
    border: 1px solid #49454F;
    border-radius: 12px;
    padding: 0.75rem 0.85rem;
    font: inherit;
    background: #2B2930;
    color: #E6E1E5;
  }

  input:focus,
  textarea:focus {
    outline: 2px solid #FFB74D;
    outline-offset: 1px;
    border-color: #FFB74D;
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
    accent-color: #FFB74D;
  }

  button {
    margin-top: 0.4rem;
    border: none;
    border-radius: 12px;
    padding: 0.85rem 1rem;
    font: inherit;
    font-weight: 600;
    background: #FFB74D;
    color: #4A2800;
    cursor: pointer;
  }

  button:hover {
    background: #FFA726;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .error {
    margin: 0;
    color: #F2B8B5;
    font-size: 0.9rem;
  }

</style>
