<script lang="ts">
  let { data } = $props();
</script>

<svelte:head>
  <title>Admin Dashboard | Renueva</title>
</svelte:head>

<main class="page">
  <section class="card">
    <header class="topbar">
      <div>
        <h1>Submissions</h1>
        <p>Signed in as {data.adminUser}</p>
      </div>
      <form method="POST" action="/admin/logout">
        <button type="submit" class="ghost">Logout</button>
      </form>
    </header>

    <div class="actions">
      <nav class="filters">
        <a class:active={data.filter === 'all'} href="/admin">All submissions</a>
        <a class:active={data.filter === 'contact'} href="/admin?filter=contact">Only wants contact</a>
      </nav>

      <a class="export" href={`/admin/export.csv?filter=${data.filter}`}>Export CSV</a>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Wants Contact</th>
            <th>Comments</th>
            <th>Date Submitted</th>
          </tr>
        </thead>
        <tbody>
          {#if data.submissions.length === 0}
            <tr>
              <td colspan="6" class="empty">No submissions found.</td>
            </tr>
          {:else}
            {#each data.submissions as row}
              <tr>
                <td>{row.full_name}</td>
                <td>{row.address}</td>
                <td>{row.phone ?? '-'}</td>
                <td>{row.wants_contact ? 'Yes' : 'No'}</td>
                <td>{row.comments ?? '-'}</td>
                <td>{new Date(row.created_at).toLocaleString()}</td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
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
    padding: 1rem;
  }

  .card {
    max-width: 1200px;
    margin: 0 auto;
    background: #fff;
    border-radius: 16px;
    padding: 1rem;
    box-shadow: 0 4px 14px rgba(18, 43, 79, 0.08);
  }

  .topbar {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  h1 {
    margin: 0;
    color: #3557d6;
  }

  p {
    margin: 0.25rem 0 0;
    color: #666;
  }

  .actions {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  .filters {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  a,
  button {
    border: 1px solid #3557d6;
    border-radius: 12px;
    padding: 0.5rem 0.8rem;
    text-decoration: none;
    color: #3557d6;
    background: transparent;
    font: inherit;
    cursor: pointer;
  }

  .active,
  .export {
    background: #3557d6;
    color: #fff;
  }

  .ghost {
    border-color: #999;
    color: #555;
  }

  .table-wrap {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 860px;
  }

  th,
  td {
    text-align: left;
    border-bottom: 1px solid #e9ebf2;
    padding: 0.7rem;
    vertical-align: top;
    font-size: 0.95rem;
  }

  th {
    color: #444;
    font-weight: 600;
    background: #fbfcff;
  }

  .empty {
    text-align: center;
    color: #777;
    padding: 1.2rem;
  }
</style>
