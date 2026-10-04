"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("ADMIN GLOBAL ERROR:", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#111111", color: "#f8f3f1", fontFamily: "system-ui, sans-serif", textAlign: "center", padding: 24 }}>
        <main>
          <h1 style={{ fontWeight: 400, fontSize: 30 }}>Admin panel error</h1>
          <p style={{ color: "#cfc7bb" }}>Reload the page. Nothing has been changed.</p>
          <button type="button" onClick={reset} style={{ marginTop: 16, padding: "10px 24px", background: "#b79a6a", color: "#111111", border: 0, fontWeight: 700, cursor: "pointer" }}>
            Reload
          </button>
        </main>
      </body>
    </html>
  );
}
