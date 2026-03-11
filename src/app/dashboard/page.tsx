import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { DashboardClient } from "./DashboardClient";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const [webApps, packages, mySubscriptions] = await Promise.all([
    prisma.webApp.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.package.findMany({
      include: { apps: { include: { webApp: true } } },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.subscription.findMany({
      where: { userId: (session.user as { id: string }).id, status: "active" },
      include: { webApp: true, package: { include: { apps: true } } },
    }),
  ]);

  const subscribedAppIds = new Set<string>();
  mySubscriptions.forEach((s) => {
    if (s.webAppId) subscribedAppIds.add(s.webAppId);
    if (s.package?.apps)
      s.package.apps.forEach((pa) => subscribedAppIds.add(pa.webAppId));
  });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold">
            엘루션
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-500">
              {session.user.email}
            </span>
            <DashboardClient />
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">내 구독</h1>

        {/* 패키지 */}
        {packages.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-3">패키지</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => {
                const hasPackage = mySubscriptions.some(
                  (s) => s.packageId === pkg.id
                );
                return (
                  <div
                    key={pkg.id}
                    className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 flex flex-col"
                  >
                    <h3 className="font-medium">{pkg.name}</h3>
                    {pkg.description && (
                      <p className="text-sm text-zinc-500 mt-1">
                        {pkg.description}
                      </p>
                    )}
                    <p className="text-xs text-zinc-400 mt-2">
                      포함: {pkg.apps.map((a) => a.webApp.name).join(", ")}
                    </p>
                    <div className="mt-auto pt-3">
                      {hasPackage ? (
                        <span className="text-sm text-green-600 dark:text-green-400">
                          구독 중
                        </span>
                      ) : (
                        <form action={`/api/checkout/package`} method="POST">
                          <input
                            type="hidden"
                            name="packageId"
                            value={pkg.id}
                          />
                          <button
                            type="submit"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            패키지 구독하기
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 개별 웹앱 */}
        <section>
          <h2 className="text-lg font-semibold mb-3">웹앱</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {webApps.map((app) => {
              const isSubscribed = subscribedAppIds.has(app.id);
              return (
                <div
                  key={app.id}
                  className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 flex flex-col"
                >
                  <h3 className="font-medium">{app.name}</h3>
                  {app.description && (
                    <p className="text-sm text-zinc-500 mt-1">
                      {app.description}
                    </p>
                  )}
                  <div className="mt-auto pt-3 flex items-center justify-between">
                    {isSubscribed ? (
                      <>
                        <span className="text-sm text-green-600 dark:text-green-400">
                          구독 중
                        </span>
                        <a
                          href={app.appUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          앱 열기 →
                        </a>
                      </>
                    ) : app.stripePriceId ? (
                      <form action={`/api/checkout/app`} method="POST">
                        <input type="hidden" name="webAppId" value={app.id} />
                        <button
                          type="submit"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          구독하기
                        </button>
                      </form>
                    ) : (
                      <span className="text-sm text-zinc-400">
                        결제 설정 필요
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {webApps.length === 0 && packages.length === 0 && (
          <p className="text-zinc-500">
            등록된 웹앱이 없습니다. 관리자가 앱과 패키지를 추가하면 여기에
            표시됩니다.
          </p>
        )}
      </main>
    </div>
  );
}
