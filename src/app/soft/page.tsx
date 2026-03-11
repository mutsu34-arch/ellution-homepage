import Link from "next/link";

export default function SoftPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold">
            엘루션
          </Link>
          <nav className="flex gap-4">
            <Link href="/" className="text-zinc-600 dark:text-zinc-400 hover:underline">
              홈
            </Link>
            <Link href="/login" className="text-zinc-600 dark:text-zinc-400 hover:underline">
              로그인
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <h1 className="text-3xl font-bold mb-4">엘루션 소프트</h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-center max-w-md mb-8">
          엘루션 소프트 서비스 페이지입니다. 원하시는 내용으로 수정하거나, 다른 주소로 연결하세요.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
        >
          홈으로
        </Link>
      </main>
    </div>
  );
}
