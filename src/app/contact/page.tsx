import type { Metadata } from "next";
import Link from "next/link";

import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "문의하기 | 엘루션",
  description:
    "엘루션 콘텐츠 제휴, 광고, 법률·교육 칼럼 관련 문의 안내입니다. 이메일과 운영 주체 정보를 확인하세요.",
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
};

const inquiryTypes = [
  {
    title: "콘텐츠 이용 문의",
    desc: "칼럼 열람, 사이트 이용 방법 관련 문의를 받습니다.",
  },
  {
    title: "콘텐츠·광고 제휴",
    desc: "법률·교육 칼럼 제휴, 광고 게재, 콘텐츠 협업 제안을 환영합니다.",
  },
  {
    title: "법률 상담 안내",
    desc: "본 사이트는 교육용 콘텐츠를 제공하며, 개별 사건 상담·자문 기능은 제공하지 않습니다. 구체적인 상담은 변호사 등 법률 전문가를 통해 진행하시기 바랍니다.",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <Link href="/" className="text-sm font-medium text-[#1e40af] hover:underline">
            ← 홈으로
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-zinc-900 sm:text-4xl">문의하기</h1>
          <p className="mt-3 text-lg text-zinc-600">
            콘텐츠 제휴, 광고 및 칼럼 관련 문의를 받습니다. 아래 안내를 확인해 주세요.
          </p>
        </header>

        <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-7 sm:p-9">
          <h2 className="mb-4 text-xl font-bold text-zinc-900">문의 유형</h2>
          <div className="space-y-3">
            {inquiryTypes.map((item) => (
              <div key={item.title} className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
                <p className="text-base font-semibold text-zinc-900">{item.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-7 sm:p-9">
          <h2 className="mb-4 text-xl font-bold text-zinc-900">연락처</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <a
              href="mailto:ellutionsoft@gmail.com"
              className="block rounded-xl border border-zinc-200 bg-zinc-50 p-5 transition hover:border-zinc-300 hover:bg-zinc-100"
            >
              <p className="mb-1 text-sm text-zinc-500">이메일</p>
              <p className="text-lg font-semibold text-zinc-900">ellutionsoft@gmail.com</p>
            </a>
            <a
              href="tel:+82-70-7954-2912"
              className="block rounded-xl border border-zinc-200 bg-zinc-50 p-5 transition hover:border-zinc-300 hover:bg-zinc-100"
            >
              <p className="mb-1 text-sm text-zinc-500">전화</p>
              <p className="text-lg font-semibold text-zinc-900">070-7954-2912</p>
            </a>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-zinc-500">
            이메일 문의는 영업일 기준 순차적으로 답변드립니다. 문의 유형과 내용을 함께 적어주시면 더 빠른 안내가
            가능합니다.
          </p>
          <div className="mt-5">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-[#1e40af] hover:text-[#1e40af]"
            >
              전문가 칼럼 보기
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-7 sm:p-9">
          <h2 className="mb-4 text-xl font-bold text-zinc-900">운영 주체 정보</h2>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-[140px_1fr]">
            <dt className="font-medium text-zinc-500">상호</dt>
            <dd className="text-zinc-800">엘루션</dd>
            <dt className="font-medium text-zinc-500">대표자</dt>
            <dd className="text-zinc-800">정대영</dd>
            <dt className="font-medium text-zinc-500">사업자등록번호</dt>
            <dd className="text-zinc-800">588-07-03369</dd>
            <dt className="font-medium text-zinc-500">통신판매업신고</dt>
            <dd className="text-zinc-800">제2026-서울서초-1742호</dd>
            <dt className="font-medium text-zinc-500">주소</dt>
            <dd className="text-zinc-800">
              서울특별시 서초구 서초중앙로 49, 6층 609호(서초동, 동양라디안루키)
            </dd>
          </dl>
        </section>
      </div>
    </main>
  );
}
