import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "전문가 칼럼 | 엘루션",
  description:
    "행정법 수험 전략, 법률/부동산 실무 인사이트를 담은 엘루션 전문가 칼럼 아카이브입니다.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <p className="text-sm font-semibold text-[#1e40af] mb-2">Latest Insights</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-4">전문가 칼럼</h1>
          <p className="text-zinc-600 max-w-3xl leading-relaxed">
            변호사 실무 관점의 법률·부동산 체크포인트와 수험생을 위한 행정법 학습 전략을 정기적으로 발행합니다.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-5">
          {blogPosts.map((post) => (
            <article key={post.slug} className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-7">
              <p className="text-sm text-zinc-500 mb-2">
                {new Date(post.date).toLocaleDateString("ko-KR")}
              </p>
              <h2 className="text-xl font-semibold text-zinc-900 mb-3">{post.title}</h2>
              <p className="text-zinc-700 leading-relaxed mb-5">{post.excerpt}</p>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {post.tags.slice(0, 4).map((tag) => (
                    <span
                      key={`${post.slug}-${tag}`}
                      className="inline-flex rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <Link href={`/blog/${post.slug}`} className="text-[#1e40af] font-semibold hover:underline">
                글 읽기
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
