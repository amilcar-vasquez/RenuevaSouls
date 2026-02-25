<svelte:head>
  <title>Thank You | Renueva</title>
</svelte:head>

<main class="page">
  <section class="card">
    <div class="check">✓</div>
    <h1>Thank You!</h1>
    <p class="message">Your information has been received. We will be in touch with you soon.</p>

    <blockquote>
      <p>
        "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is
        here!"
      </p>
      <cite>— 2 Corinthians 5:17 (NIV)</cite>
    </blockquote>

    <a href="/" class="back">← Go back</a>
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
    max-width: 520px;
    background: #211F26;
    border-radius: 16px;
    padding: 2rem 1.5rem;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
    text-align: center;
  }

  .check {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #3B2700;
    color: #FFB74D;
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  h1 {
    margin: 0 0 0.5rem;
    font-size: 1.8rem;
    color: #FFB74D;
  }

  .message {
    color: #CAC4D0;
    margin: 0 0 1.5rem;
    line-height: 1.6;
  }

  blockquote {
    margin: 0 0 1.5rem;
    padding: 1rem 1.25rem;
    background: #2B2930;
    border-left: 4px solid #FFB74D;
    border-radius: 0 12px 12px 0;
    text-align: left;
  }

  blockquote p {
    margin: 0 0 0.4rem;
    color: #E6E1E5;
    font-style: italic;
    line-height: 1.65;
  }

  cite {
    font-size: 0.88rem;
    color: #FFB74D;
    font-style: normal;
    font-weight: 600;
  }

  .back {
    display: inline-block;
    border: 1px solid #FFB74D;
    border-radius: 12px;
    padding: 0.6rem 1.2rem;
    text-decoration: none;
    color: #FFB74D;
    font-weight: 600;
  }
</style>
