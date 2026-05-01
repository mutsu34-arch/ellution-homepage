import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { blogPosts, getPostBySlug } from "@/lib/blog";

type BlogDetailPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "글을 찾을 수 없습니다 | 엘루션",
      description: "요청하신 칼럼을 찾을 수 없습니다.",
    };
  }

  return {
    title: `${post.title} | 엘루션 칼럼`,
    description: post.excerpt,
    alternates: {
      canonical: `https://ellution.co.kr/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | 엘루션 칼럼`,
      description: post.excerpt,
      url: `https://ellution.co.kr/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      siteName: "엘루션",
      locale: "ko_KR",
    },
  };
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

type ContentBlock = {
  type: "h2" | "h3" | "p";
  text: string;
  id?: string;
};

function buildContentBlocks(lines: string[]): ContentBlock[] {
  let headingCount = 0;

  return lines.map((line) => {
    if (line.startsWith("### ")) {
      headingCount += 1;
      return {
        type: "h3",
        text: line.replace("### ", "").trim(),
        id: `section-${headingCount}`,
      };
    }

    if (line.startsWith("## ")) {
      headingCount += 1;
      return {
        type: "h2",
        text: line.replace("## ", "").trim(),
        id: `section-${headingCount}`,
      };
    }

    return {
      type: "p",
      text: line,
    };
  });
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const contentBlocks = buildContentBlocks(post.content);
  const tableOfContents = contentBlocks.filter((block) => block.type === "h2" || block.type === "h3");
  const blogPostingStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "ko-KR",
    author: {
      "@type": "Organization",
      name: "엘루션",
    },
    publisher: {
      "@type": "Organization",
      name: "엘루션",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://ellution.co.kr/blog/${post.slug}`,
    },
    keywords: post.tags?.join(", "),
  };

  return (
    <main className="min-h-screen bg-[#F9FAFB] px-4 py-16">
      <Script
        id={`blog-posting-schema-${post.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingStructuredData),
        }}
      />
      <article className="max-w-3xl mx-auto rounded-2xl border border-zinc-200 bg-white p-7 sm:p-10">
        <p className="text-sm text-zinc-500 mb-3">{new Date(post.date).toLocaleDateString("ko-KR")}</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-5 leading-tight">{post.title}</h1>
        <p className="text-zinc-700 leading-relaxed mb-8">{post.excerpt}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-7">
            {post.tags.map((tag) => (
              <span
                key={`${post.slug}-${tag}`}
                className="inline-flex rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {tableOfContents.length > 0 && (
          <section className="mb-8 rounded-xl border border-zinc-200 bg-zinc-50 p-5">
            <h2 className="text-base font-semibold text-zinc-900 mb-3">목차</h2>
            <ul className="space-y-2">
              {tableOfContents.map((item) => (
                <li key={item.id} className={item.type === "h3" ? "ml-4" : ""}>
                  <a href={`#${item.id}`} className="text-sm text-[#1e40af] hover:underline">
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="text-zinc-800 leading-8">
          {contentBlocks.map((block) => {
            if (block.type === "h2") {
              return (
                <h2 key={block.id} id={block.id} className="text-xl font-bold text-zinc-900 mt-8 mb-3 scroll-mt-24">
                  {block.text}
                </h2>
              );
            }

            if (block.type === "h3") {
              return (
                <h3 key={block.id} id={block.id} className="text-lg font-semibold text-zinc-900 mt-6 mb-2 scroll-mt-24">
                  {block.text}
                </h3>
              );
            }

            return (
              <p key={`${post.slug}-${block.text}`} className="mb-5">
                {block.text}
              </p>
            );
          })}
        </div>

        <div className="mt-10">
          <Link href="/blog" className="text-[#1e40af] font-semibold hover:underline">
            전체 글 보기
          </Link>
        </div>
      </article>
    </main>
  );
}
