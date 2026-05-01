import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 | 엘루션",
  description: "엘루션 서비스 이용약관 안내",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] px-4 py-16">
      <article className="max-w-4xl mx-auto rounded-2xl border border-zinc-200 bg-white p-7 sm:p-10 space-y-6">
        <h1 className="text-3xl font-bold text-zinc-900">이용약관</h1>
        <p className="text-zinc-600">시행일: 2026년 5월 1일</p>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-zinc-900">제1조 (목적)</h2>
          <p className="text-zinc-700 leading-relaxed">
            본 약관은 엘루션이 제공하는 법률·부동산 정보 콘텐츠 및 교육 서비스의 이용조건, 권리, 의무 및 책임사항을
            규정함을 목적으로 합니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-zinc-900">제2조 (서비스의 성격)</h2>
          <p className="text-zinc-700 leading-relaxed">
            회사가 제공하는 콘텐츠는 일반 정보 제공 및 학습 지원을 위한 것으로, 특정 사안에 대한 법률 자문 또는
            공인중개사의 개별 중개행위를 대체하지 않습니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-zinc-900">제3조 (회원가입 및 계정 관리)</h2>
          <p className="text-zinc-700 leading-relaxed">
            이용자는 정확한 정보를 제공하여 회원가입을 해야 하며, 계정 정보에 대한 관리 책임은 이용자에게 있습니다.
            부정사용이 의심될 경우 즉시 회사에 통지해야 합니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-zinc-900">제4조 (콘텐츠 권리 및 이용 제한)</h2>
          <p className="text-zinc-700 leading-relaxed">
            서비스 내 모든 콘텐츠의 저작권 및 지식재산권은 회사 또는 정당한 권리자에게 귀속됩니다. 이용자는 회사의
            사전 동의 없이 복제, 배포, 2차적 저작물 작성 등 상업적 이용을 할 수 없습니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-zinc-900">제5조 (유료 서비스)</h2>
          <p className="text-zinc-700 leading-relaxed">
            유료 서비스의 이용요금, 결제, 환불 기준은 관련 법령 및 별도 안내 정책에 따릅니다. 정기결제 상품은 해지
            신청 시점부터 다음 결제주기부터 적용됩니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-zinc-900">제6조 (면책)</h2>
          <p className="text-zinc-700 leading-relaxed">
            회사는 천재지변, 통신 장애, 제3자의 불법행위 등 불가항력 사유로 인한 서비스 중단에 대해 책임을 지지
            않습니다. 또한 이용자가 콘텐츠를 활용하여 내린 의사결정의 결과에 대해 회사는 법령이 허용하는 범위 내에서
            책임을 제한할 수 있습니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-zinc-900">제7조 (분쟁 해결)</h2>
          <p className="text-zinc-700 leading-relaxed">
            본 약관은 대한민국 법령에 따르며, 회사와 이용자 간 발생한 분쟁은 관련 법령에 따른 관할법원을 제1심
            전속관할로 합니다.
          </p>
        </section>
      </article>
    </main>
  );
}
