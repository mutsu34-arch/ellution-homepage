import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "문의하기 | 엘루션",
  description: "엘루션 서비스 문의 안내",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] px-4 py-16">
      <section className="max-w-3xl mx-auto rounded-2xl border border-zinc-200 bg-white p-7 sm:p-10">
        <h1 className="text-3xl font-bold text-zinc-900 mb-4">문의하기</h1>
        <p className="text-zinc-700 leading-relaxed mb-6">
          서비스, 콘텐츠 제휴, 법률·부동산 칼럼 관련 문의는 아래 이메일로 연락해 주세요.
        </p>
        <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-5">
          <p className="text-sm text-zinc-500 mb-1">이메일</p>
          <p className="text-lg font-semibold text-zinc-900">ellutionsoft@gmail.com</p>
        </div>
      </section>
    </main>
  );
}
