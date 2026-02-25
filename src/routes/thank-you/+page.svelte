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
    max-width: 520px;
    background: #fff;
    border-radius: 16px;
    padding: 2rem 1.5rem;
    box-shadow: 0 4px 14px rgba(18, 43, 79, 0.08);
    text-align: center;
  }

  .check {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #e6f4ea;
    color: #1e6c2d;
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  h1 {
    margin: 0 0 0.5rem;
    font-size: 1.8rem;
    color: #3557d6;
  }

  .message {
    color: #555;
    margin: 0 0 1.5rem;
    line-height: 1.6;
  }

  blockquote {
    margin: 0 0 1.5rem;
    padding: 1rem 1.25rem;
    background: #f4f6ff;
    border-left: 4px solid #3557d6;
    border-radius: 0 12px 12px 0;
    text-align: left;
  }

  blockquote p {
    margin: 0 0 0.4rem;
    color: #333;
    font-style: italic;
    line-height: 1.65;
  }

  cite {
    font-size: 0.88rem;
    color: #3557d6;
    font-style: normal;
    font-weight: 600;
  }

  .back {
    display: inline-block;
    border: 1px solid #3557d6;
    border-radius: 12px;
    padding: 0.6rem 1.2rem;
    text-decoration: none;
    color: #3557d6;
    font-weight: 600;
  }
</style>
