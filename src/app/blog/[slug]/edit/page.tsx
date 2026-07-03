import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { getEditableDraft } from "@/lib/posts-store";
import { EditPostForm } from "@/components/EditPostForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "글 편집 | 엘루션",
  robots: { index: false, follow: false },
};

type EditPageProps = {
  params: { slug: string };
};

export default async function EditPostPage({ params }: EditPageProps) {
  const session = await getServerSession(authOptions);

  if (!isAdminEmail(session?.user?.email)) {
    redirect(`/login?callbackUrl=/blog/${params.slug}/edit`);
  }

  const draft = await getEditableDraft(params.slug);
  if (!draft) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900">글 편집</h1>
          <Link href="/blog/manage" className="text-sm font-medium text-[#1e40af] hover:underline">
            ← 칼럼 관리
          </Link>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
          <EditPostForm initial={draft} />
        </div>
      </div>
    </main>
  );
}
