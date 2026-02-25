<script lang="ts">
  let { form } = $props();
  const errors = $derived((form?.errors ?? {}) as Record<string, string>);
</script>

<svelte:head>
  <title>Admin Login | Renueva</title>
</svelte:head>

<main class="page">
  <section class="card">
    <h1>Admin Login</h1>

    {#if errors.auth}
      <p class="error">{errors.auth}</p>
    {/if}

    <form method="POST">
      <label for="username">Username</label>
      <input
        id="username"
        name="username"
        type="text"
        required
        value={form?.values?.username ?? ''}
      />
      {#if errors.username}
        <p class="error">{errors.username}</p>
      {/if}

      <label for="password">Password</label>
      <input id="password" name="password" type="password" required />
      {#if errors.password}
        <p class="error">{errors.password}</p>
      {/if}

      <button type="submit">Sign in</button>
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
    max-width: 420px;
    background: #211F26;
    border-radius: 16px;
    padding: 1.25rem;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  }

  h1 {
    margin: 0 0 1rem;
    color: #FFB74D;
  }

  form {
    display: grid;
    gap: 0.65rem;
  }

  label {
    font-weight: 600;
    margin-top: 0.2rem;
    color: #E6E1E5;
  }

  input {
    border: 1px solid #49454F;
    border-radius: 12px;
    padding: 0.75rem 0.85rem;
    font: inherit;
    background: #2B2930;
    color: #E6E1E5;
  }

  input:focus {
    outline: 2px solid #FFB74D;
    outline-offset: 1px;
    border-color: #FFB74D;
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

  .error {
    margin: 0;
    color: #F2B8B5;
    font-size: 0.9rem;
  }
</style>
