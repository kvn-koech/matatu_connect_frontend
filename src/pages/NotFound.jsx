import React from "react";

function NotFound() {
  function goHome() {
    window.location.href = "/";
  }

  function goBack() {
    if (window.history.length > 1) window.history.back();
    else window.location.href = "/";
  }

  return (
    <main role="main">
      <header>
        <h1>404 Not Found</h1>
        <p>The page you are looking for does not exist, or the link is incorrect.</p>
      </header>

      <section aria-label="Actions">
        <button type="button" onClick={goHome}>
          Go to Home
        </button>
        <button type="button" onClick={goBack}>
          Go Back
        </button>
      </section>
    </main>
  );
}

export default NotFound
