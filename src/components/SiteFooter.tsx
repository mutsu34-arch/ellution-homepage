"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const HIDDEN_PREFIXES = ["/login", "/register", "/maintenance", "/dashboard"];

export function SiteFooter() {
  const pathname = usePathname() ?? "/";
  const isHome = pathname === "/";

  if (HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  return (
    <footer className="border-t border-zinc-200 bg-white/90">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {isHome && (
          <>
            <div className="mb-6 flex flex-col gap-4 rounded-xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <p className="text-sm leading-relaxed text-rose-800 sm:text-base">
                본 서비스는 교육용 플랫폼으로, 개별 사건의 권리·의무 판단, 승소 가능성 예측 등 법률 상담 및 자문
                기능을 제공하지 않습니다. 구체적인 상담은 변호사 등 법률 전문가를 통해 진행하시기 바랍니다.
              </p>
              <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
                <Link
                  href="https://www.lawfirm.ellution.co.kr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-800 active:scale-[0.99]"
                >
                  법률사무소 엘루션 바로가기
                  <span aria-hidden="true">→</span>
                </Link>
                <Link
                  href="https://law.ellution.co.kr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1 text-xs font-medium text-rose-700/80 underline-offset-2 transition hover:text-rose-800 hover:underline"
                >
                  변호사 법률 칼럼 보기
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <div className="mb-8">
              <Link
                href="https://adminlawq.ellution.co.kr/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1e3a8a]"
              >
                행정법Q 바로가기
              </Link>
            </div>
          </>
        )}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-sm leading-relaxed text-zinc-600">
            <p className="font-semibold text-zinc-800">엘루션</p>
            <p className="mt-1">대표자: 정대영</p>
            <p>사업자등록번호: 588-07-03369</p>
            <p>통신판매업신고: 제2026-서울서초-1742호</p>
            <p>주소: 서울특별시 서초구 서초중앙로 49, 6층 609호(서초동, 동양라디안루키)</p>
            <p>전화: 070-7954-2912</p>
            <p>이메일: ellutionsoft@gmail.com</p>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm text-zinc-600" aria-label="법적 고지 및 안내">
            <Link href="/about" className="hover:text-zinc-900">
              회사소개
            </Link>
            <Link href="/privacy" className="hover:text-zinc-900">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="hover:text-zinc-900">
              이용약관
            </Link>
            <Link href="/contact" className="hover:text-zinc-900">
              문의하기
            </Link>
          </nav>
        </div>
        <p className="mt-6 text-sm text-zinc-500">Copyright © 2026 Elution. All rights reserved.</p>
      </div>
    </footer>
  );
}
