import { NextResponse } from "next/server";
import { z } from "zod";
import { recordDuration, recordPageView } from "@/lib/analytics-store";

export const dynamic = "force-dynamic";

const idPattern = /^[a-zA-Z0-9_-]{8,64}$/;

const pageviewSchema = z.object({
  event: z.literal("pageview"),
  viewId: z.string().regex(idPattern),
  visitorId: z.string().regex(idPattern),
  path: z.string().min(1).max(500).regex(/^\//),
  title: z.string().max(500),
  articleSlug: z.string().max(200).optional(),
  referrer: z.string().max(2000).optional(),
});

const durationSchema = z.object({
  event: z.literal("duration"),
  viewId: z.string().regex(idPattern),
  visitorId: z.string().regex(idPattern),
  durationSec: z.number().min(0).max(7200),
});

const bodySchema = z.discriminatedUnion("event", [pageviewSchema, durationSchema]);

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "입력값을 확인해 주세요." }, { status: 400 });
  }

  try {
    if (parsed.data.event === "pageview") {
      await recordPageView(parsed.data);
    } else {
      await recordDuration(parsed.data);
    }
  } catch (e) {
    if (e instanceof Error && e.message === "FIREBASE_NOT_CONFIGURED") {
      return NextResponse.json({ ok: false, skipped: true });
    }
    console.error("[api/analytics/track] error:", e);
    return NextResponse.json({ error: "기록 중 오류가 발생했습니다." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
