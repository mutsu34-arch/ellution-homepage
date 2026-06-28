import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "회사소개 | 엘루션",
  description:
    "엘루션은 변호사가 설계한 행정법 학습 서비스와 법률·교육 전문 칼럼을 제공하는 콘텐츠 플랫폼입니다. 운영 주체, 편집 기준, 제공 서비스를 안내합니다.",
  alternates: {
    canonical: "https://ellution.co.kr/about",
  },
};

const services = [
  {
    name: "행정법Q",
    desc: "OX 인출 훈련과 오답노트 자동화로 회독 효율을 높이는 행정법 학습 웹앱입니다.",
    href: "https://adminlawq.ellution.co.kr/",
  },
  {
    name: "학습 칼럼 블로그",
    desc: "공무원 수험생을 위한 행정법 핵심 요약·기출·공부법을 다루는 학습 콘텐츠 채널입니다.",
    href: "https://edu.ellution.co.kr/",
  },
  {
    name: "법률 칼럼 블로그",
    desc: "변호사가 검수한 법률 정보를 일반인도 이해하기 쉽게 정리한 법률 칼럼 채널입니다.",
    href: "https://law.ellution.co.kr/",
  },
  {
    name: "법률사무소 엘루션",
    desc: "구체적인 사건 상담이 필요한 분을 위한 법률사무소 공식 채널입니다.",
    href: "https://www.lawfirm.ellution.co.kr/",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <Link href="/" className="text-sm font-medium text-[#1e40af] hover:underline">
            ← 홈으로
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-zinc-900 sm:text-4xl">회사소개</h1>
          <p className="mt-3 text-lg text-zinc-600">
            엘루션은 변호사가 설계한 학습·법률 콘텐츠를 한곳에 모아 제공하는 플랫폼입니다.
          </p>
        </header>

        <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-7 sm:p-9">
          <h2 className="mb-3 text-xl font-bold text-zinc-900">엘루션을 소개합니다</h2>
          <p className="mb-4 leading-relaxed text-zinc-700">
            엘루션(Ellution)은 행정법을 비롯한 수험·법률 분야의 어려운 내용을 누구나 이해하기 쉽게 정리하는 것을
            목표로 합니다. 변호사가 직접 설계하고 검수한 학습 서비스와 칼럼을 통해, 수험생과 일반 독자가 신뢰할 수
            있는 정보를 빠르게 얻을 수 있도록 돕습니다.
          </p>
          <p className="leading-relaxed text-zinc-700">
            단순 암기가 아니라 판례의 논점 구조와 함정 포인트를 이해하도록 구성하며, 실제 시험과 실무에서 바로
            활용할 수 있는 형태로 콘텐츠를 제공합니다.
          </p>
        </section>

        <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-7 sm:p-9">
          <h2 className="mb-4 text-xl font-bold text-zinc-900">제공 서비스</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {services.map((service) => (
              <Link
                key={service.name}
                href={service.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-zinc-200 bg-zinc-50 p-5 transition hover:border-[#1e40af] hover:bg-blue-50/60"
              >
                <p className="flex items-center gap-1.5 text-base font-semibold text-zinc-900 group-hover:text-[#1e40af]">
                  {service.name}
                  <span aria-hidden="true">→</span>
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{service.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-7 sm:p-9">
          <h2 className="mb-3 text-xl font-bold text-zinc-900">콘텐츠 편집 기준</h2>
          <ul className="space-y-3 text-zinc-700">
            <li className="flex gap-2 leading-relaxed">
              <span className="mt-1 text-[#1e40af]">•</span>
              <span>모든 학습·법률 콘텐츠는 변호사의 검수를 거쳐 정확성을 확인합니다.</span>
            </li>
            <li className="flex gap-2 leading-relaxed">
              <span className="mt-1 text-[#1e40af]">•</span>
              <span>판례와 법령에 근거하여 작성하며, 출처와 쟁점을 명확히 정리합니다.</span>
            </li>
            <li className="flex gap-2 leading-relaxed">
              <span className="mt-1 text-[#1e40af]">•</span>
              <span>최신 시험·법령 변화를 반영해 주기적으로 콘텐츠를 점검합니다.</span>
            </li>
          </ul>
          <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4">
            <p className="text-sm leading-relaxed text-rose-800">
              본 서비스는 교육용 플랫폼으로, 개별 사건의 권리·의무 판단, 승소 가능성 예측 등 법률 상담 및 자문
              기능을 제공하지 않습니다. 구체적인 상담은 변호사 등 법률 전문가를 통해 진행하시기 바랍니다.
            </p>
          </div>
        </section>

        <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-7 sm:p-9">
          <h2 className="mb-4 text-xl font-bold text-zinc-900">운영 주체 정보</h2>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-[140px_1fr]">
            <dt className="font-medium text-zinc-500">상호</dt>
            <dd className="text-zinc-800">엘루션</dd>
            <dt className="font-medium text-zinc-500">사업자등록번호</dt>
            <dd className="text-zinc-800">588-07-03369</dd>
            <dt className="font-medium text-zinc-500">통신판매업신고</dt>
            <dd className="text-zinc-800">제2026-서울서초-1742호</dd>
            <dt className="font-medium text-zinc-500">주소</dt>
            <dd className="text-zinc-800">
              서울특별시 서초구 서초중앙로 49, 6층 609호(서초동, 동양라디안루키)
            </dd>
            <dt className="font-medium text-zinc-500">연락처</dt>
            <dd className="text-zinc-800">070-7954-2912</dd>
            <dt className="font-medium text-zinc-500">이메일</dt>
            <dd className="text-zinc-800">ellutionsoft@gmail.com</dd>
          </dl>
          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a8a]"
            >
              문의하기
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
