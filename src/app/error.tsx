"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#F9FAFB]">
      <h1 className="text-xl font-bold text-zinc-900 mb-2">오류가 발생했습니다</h1>
      <p className="text-zinc-600 text-sm mb-4 max-w-md text-center font-mono">
        {error.message}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 rounded-lg bg-[#1e40af] text-white hover:bg-[#1e3a8a]"
      >
        다시 시도
      </button>
    </div>
  );
}
