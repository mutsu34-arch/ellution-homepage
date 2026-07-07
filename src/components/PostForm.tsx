"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export type PostFormDraft = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  body: string;
};

type PostFormProps = {
  mode: "create" | "edit";
  initial: PostFormDraft;
};

export function PostForm({ mode, initial }: PostFormProps) {
  const router = useRouter();
  const [slug, setSlug] = useState(initial.slug);
  const [title, setTitle] = useState(initial.title);
  const [date, setDate] = useState(initial.date);
  const [excerpt, setExcerpt] = useState(initial.excerpt);
  const [tags, setTags] = useState(initial.tags.join(", "));
  const [body, setBody] = useState(initial.body);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          slug: slug.trim(),
          title: title.trim(),
          date: date.trim(),
          excerpt: excerpt.trim(),
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          body,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "저장에 실패했습니다.");
        setSaving(false);
        return;
      }
      router.push(`/blog/${slug.trim()}`);
      router.refresh();
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-[#1e40af] focus:outline-none focus:ring-1 focus:ring-[#1e40af]";

  return (
    <form onSubmit={onSave} className="space-y-5">
      {mode === "create" && (
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">URL 식별자 (slug)</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            placeholder="예: estoppel-doctrine-administrative-act-21"
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            title="영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다."
            className={inputClass}
          />
          <p className="mt-1 text-xs text-zinc-500">
            글 주소: /blog/{slug || "slug"} — 한 번 공개한 뒤에는 바꾸지 않는 것이 좋습니다.
          </p>
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">제목</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClass} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">공개일 (YYYY-MM-DD)</label>
          <input value={date} onChange={(e) => setDate(e.target.value)} required className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">태그 (쉼표로 구분)</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">요약</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">본문 (일반 글)</label>
        <p className="mb-2 text-xs leading-relaxed text-zinc-500">
          줄 맨 앞에 <code className="rounded bg-zinc-100 px-1">## </code>를 쓰면 소제목,{" "}
          <code className="rounded bg-zinc-100 px-1">### </code>는 작은 소제목,{" "}
          <code className="rounded bg-zinc-100 px-1">- </code>는 목록이 됩니다. 표는 아래처럼{" "}
          <code className="rounded bg-zinc-100 px-1">|</code>로 구분해 작성하세요.
        </p>
        <pre className="mb-2 overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs leading-relaxed text-zinc-600">
{`| 구분 | 직권취소 | 철회 |
|------|----------|------|
| 효과 | 소급 소멸 | 장래 소멸 |
| 권자 | 행정청 | 행정청 |`}
        </pre>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={22}
          required
          className={`${inputClass} font-mono leading-7`}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#1e40af] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1e3a8a] disabled:opacity-50"
        >
          {saving ? "저장 중..." : mode === "create" ? "글 등록하기" : "저장하기"}
        </button>
        <Link
          href={mode === "create" ? "/blog/manage" : `/blog/${initial.slug}`}
          className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          취소
        </Link>
      </div>
    </form>
  );
}
