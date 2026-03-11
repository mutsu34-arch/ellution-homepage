import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold">
            엘루션
          </Link>
          <nav className="flex gap-4">
            <Link
              href="/login"
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              로그인
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              회원가입
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4">
          웹앱 구독 포털
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-center max-w-xl mb-10">
          개별 웹앱 또는 패키지로 구독하고, 하위 도메인에서 바로 이용하세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link
            href="/study"
            className="px-8 py-4 rounded-xl bg-blue-600 text-white text-lg font-semibold hover:bg-blue-700 transition-colors text-center shadow-lg hover:shadow-xl"
          >
            엘루션 스터디
          </Link>
          <Link
            href="/soft"
            className="px-8 py-4 rounded-xl bg-emerald-600 text-white text-lg font-semibold hover:bg-emerald-700 transition-colors text-center shadow-lg hover:shadow-xl"
          >
            엘루션 소프트
          </Link>
        </div>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-6 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            로그인
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-lg bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 hover:opacity-90"
          >
            대시보드
          </Link>
        </div>
      </main>
    </div>
  );
}
