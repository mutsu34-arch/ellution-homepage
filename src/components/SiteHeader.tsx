"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { isAdminEmail } from "@/lib/admin";

const NAV_LINKS = [
  { href: "/", label: "홈" },
  { href: "/blog", label: "칼럼" },
  { href: "/about", label: "회사소개" },
  { href: "/contact", label: "문의" },
];

const HIDDEN_PREFIXES = ["/dashboard", "/login", "/register", "/maintenance"];

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const { data: session } = useSession();
  const isAdmin = isAdminEmail(session?.user?.email);

  if (pathname === "/" || HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) {
    return null;
  }

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e40af] text-sm font-bold text-white">
            E
          </span>
          <span className="text-sm font-semibold tracking-tight text-zinc-900">엘루션</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-lg px-2.5 py-2 text-sm transition hover:bg-zinc-100 sm:px-3 ${
                  isActive ? "font-semibold text-[#1e40af]" : "text-zinc-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              href="/blog/manage"
              className="rounded-lg px-2.5 py-2 text-sm font-semibold text-[#1e40af] transition hover:bg-blue-50 sm:px-3"
            >
              칼럼 관리
            </Link>
          )}
          {session?.user ? (
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/blog" })}
              className="rounded-lg px-2.5 py-2 text-sm text-zinc-600 transition hover:bg-zinc-100 sm:px-3"
            >
              로그아웃
            </button>
          ) : (
            <Link
              href="/login"
              className="ml-1 rounded-lg bg-[#1e40af] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
