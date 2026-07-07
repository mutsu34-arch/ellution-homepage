import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { getPostBySlug } from "@/lib/blog";
import { isSlugTaken, saveOverride } from "@/lib/posts-store";

export const dynamic = "force-dynamic";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const bodySchema = z.object({
  mode: z.enum(["create", "edit"]).default("edit"),
  slug: z.string().min(1).max(200).regex(slugPattern, "slug는 영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다."),
  title: z.string().min(1).max(300),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD 형식이어야 합니다."),
  excerpt: z.string().max(1000),
  tags: z.array(z.string()).max(20),
  body: z.string().max(100000),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "입력값을 확인해 주세요.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { mode, slug, ...rest } = parsed.data;

  if (mode === "create") {
    if (await isSlugTaken(slug)) {
      return NextResponse.json(
        { error: "이미 사용 중인 slug입니다. 다른 식별자를 입력해 주세요." },
        { status: 409 },
      );
    }
  } else if (!getPostBySlug(slug) && !(await isSlugTaken(slug))) {
    return NextResponse.json({ error: "존재하지 않는 글입니다." }, { status: 404 });
  }

  try {
    await saveOverride({ slug, ...rest });
  } catch (e) {
    if (e instanceof Error && e.message === "FIREBASE_NOT_CONFIGURED") {
      return NextResponse.json(
        {
          error:
            "저장소(Firestore)가 설정되지 않았습니다. 서버 환경변수(FIREBASE_*)를 먼저 설정해 주세요.",
        },
        { status: 503 },
      );
    }
    console.error("[api/admin/posts] save error:", e);
    return NextResponse.json({ error: "저장 중 오류가 발생했습니다." }, { status: 500 });
  }

  revalidatePath(`/blog/${slug}`);
  revalidatePath("/blog");
  revalidatePath("/blog/manage");
  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
