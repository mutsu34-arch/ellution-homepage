"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { isAdminEmail } from "@/lib/admin";

/** 관리자 계정으로 로그인했을 때만 '글 편집' 버튼을 노출합니다. */
export function EditPostButton({ slug }: { slug: string }) {
  const { data: session } = useSession();
  if (!isAdminEmail(session?.user?.email)) return null;

  return (
    <Link
      href={`/blog/${slug}/edit`}
      className="inline-flex items-center gap-1.5 rounded-lg border border-[#1e40af] bg-blue-50 px-3 py-1.5 text-sm font-semibold text-[#1e40af] hover:bg-blue-100"
    >
      <span aria-hidden="true">✎</span> 글 편집
    </Link>
  );
}
