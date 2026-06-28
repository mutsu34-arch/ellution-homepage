import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { saveOverride } from "@/lib/posts-store";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  slug: z.string().min(1).max(200),
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

  try {
    await saveOverride(parsed.data);
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

  // 변경된 글을 즉시 반영
  revalidatePath(`/blog/${parsed.data.slug}`);
  revalidatePath("/blog");
  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
