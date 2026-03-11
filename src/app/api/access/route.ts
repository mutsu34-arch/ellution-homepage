import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * 하위 도메인 웹앱에서 호출: 현재 사용자가 해당 앱(또는 앱이 포함된 패키지)을 구독 중인지 확인
 * GET /api/access?appSlug=app-a 또는 GET /api/access?webAppId=xxx
 */
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ allowed: false, reason: "not_logged_in" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const appSlug = searchParams.get("appSlug");
  const webAppId = searchParams.get("webAppId");

  let webApp: { id: string } | null = null;
  if (webAppId) {
    webApp = await prisma.webApp.findUnique({
      where: { id: webAppId },
      select: { id: true },
    });
  } else if (appSlug) {
    webApp = await prisma.webApp.findUnique({
      where: { slug: appSlug },
      select: { id: true },
    });
  }
  if (!webApp) {
    return NextResponse.json({ allowed: false, reason: "app_not_found" }, { status: 404 });
  }

  const userId = (session.user as { id: string }).id;
  // 개별 앱 구독
  const direct = await prisma.subscription.findFirst({
    where: {
      userId,
      webAppId: webApp.id,
      status: "active",
    },
  });
  if (direct) {
    return NextResponse.json({ allowed: true });
  }
  // 패키지 구독으로 이 앱 포함 여부
  const pkgSub = await prisma.subscription.findMany({
    where: { userId, status: "active", packageId: { not: null } },
    include: { package: { include: { apps: { where: { webAppId: webApp.id } } } } },
  });
  const viaPackage = pkgSub.some((s) => s.package?.apps?.length);
  if (viaPackage) {
    return NextResponse.json({ allowed: true });
  }
  return NextResponse.json({ allowed: false, reason: "not_subscribed" }, { status: 403 });
}
