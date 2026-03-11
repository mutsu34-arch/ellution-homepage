import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { createPackageCheckoutSession } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }
  const form = await request.formData();
  const packageId = form.get("packageId") as string | null;
  if (!packageId) {
    return NextResponse.json(
      { error: "packageId가 필요합니다." },
      { status: 400 }
    );
  }

  const pkg = await prisma.package.findUnique({
    where: { id: packageId },
  });
  if (!pkg?.stripePriceId) {
    return NextResponse.json(
      { error: "이 패키지는 아직 결제 설정이 되지 않았습니다." },
      { status: 400 }
    );
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? request.headers.get("origin") ?? "http://localhost:3000";
  const url = await createPackageCheckoutSession({
    priceId: pkg.stripePriceId,
    userId: (session.user as { id: string }).id,
    userEmail: session.user.email,
    packageId: pkg.id,
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
