"use client";

import { signOut } from "next-auth/react";

export function DashboardClient() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
    >
      로그아웃
    </button>
  );
}
