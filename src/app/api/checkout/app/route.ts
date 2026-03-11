import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { createAppCheckoutSession } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }
  const form = await request.formData();
  const webAppId = form.get("webAppId") as string | null;
  if (!webAppId) {
    return NextResponse.json(
      { error: "webAppId가 필요합니다." },
      { status: 400 }
    );
  }

  const app = await prisma.webApp.findUnique({
    where: { id: webAppId },
  });
  if (!app?.stripePriceId) {
    return NextResponse.json(
      { error: "이 앱은 아직 결제 설정이 되지 않았습니다." },
      { status: 400 }
    );
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? request.headers.get("origin") ?? "http://localhost:3000";
  const url = await createAppCheckoutSession({
    priceId: app.stripePriceId,
    userId: (session.user as { id: string }).id,
    userEmail: session.user.email,
    webAppId: app.id,
    successUrl: `${baseUrl}/dashboard?success=1`,
    cancelUrl: `${baseUrl}/dashboard`,
  });

  if (!url) {
    return NextResponse.json(
      { error: "결제 세션을 만들 수 없습니다. Stripe 설정을 확인하세요." },
      { status: 500 }
    );
  }
  return NextResponse.redirect(url);
}
