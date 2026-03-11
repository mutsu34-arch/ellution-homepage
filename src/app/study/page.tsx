import Link from "next/link";

const STUDY_ITEMS = [
  { name: "행정법큐", slug: "admin-law", color: "bg-blue-600 hover:bg-blue-700" },
  { name: "민법큐", slug: "civil-law", color: "bg-emerald-600 hover:bg-emerald-700" },
  { name: "형법큐", slug: "criminal-law", color: "bg-violet-600 hover:bg-violet-700" },
  { name: "한국사큐", slug: "korean-history", color: "bg-amber-600 hover:bg-amber-700" },
  { name: "한자큐", slug: "hanja", color: "bg-rose-600 hover:bg-rose-700" },
] as const;

export default function StudyPage() {
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
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">엘루션 스터디</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-10">
          과목을 선택하세요.
        </p>
        <ul className="grid gap-4 sm:grid-cols-2">
          {STUDY_ITEMS.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/study/${item.slug}`}
                className={`block px-6 py-5 rounded-xl text-white text-lg font-semibold text-center shadow-md hover:shadow-lg transition-all ${item.color}`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <Link
            href="/"
            className="text-zinc-600 dark:text-zinc-400 hover:underline"
          >
            ← 홈으로
          </Link>
        </div>
      </main>
    </div>
  );
}
