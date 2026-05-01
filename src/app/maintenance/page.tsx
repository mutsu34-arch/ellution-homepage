import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "서비스 점검 중 | 엘루션",
  description: "현재 엘루션 사이트는 점검 중입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MaintenancePage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-20">
      <section className="mx-auto max-w-2xl rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm sm:p-10">
        <p className="mb-3 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          Maintenance Mode
        </p>
        <h1 className="text-3xl font-bold text-zinc-900 mb-4">현재 사이트 점검 중입니다</h1>
        <p className="text-zinc-700 leading-relaxed">
          더 안정적인 서비스 제공을 위해 시스템 점검을 진행하고 있습니다.
          <br />
          점검이 완료되는 대로 정상 서비스로 복구하겠습니다.
        </p>
        <p className="mt-6 text-sm text-zinc-500">문의: ellutionsoft@gmail.com</p>
      </section>
    </main>
  );
}
