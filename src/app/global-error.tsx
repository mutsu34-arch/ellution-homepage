"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body style={{ fontFamily: "sans-serif", padding: "2rem", background: "#F9FAFB" }}>
        <h1 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>오류가 발생했습니다</h1>
        <pre style={{ fontSize: "0.875rem", color: "#52525b", marginBottom: "1rem", overflow: "auto" }}>
          {error.message}
        </pre>
        <button
          onClick={reset}
          style={{ padding: "0.5rem 1rem", background: "#1e40af", color: "white", border: "none", borderRadius: "0.5rem" }}
        >
          다시 시도
        </button>
      </body>
    </html>
  );
}
