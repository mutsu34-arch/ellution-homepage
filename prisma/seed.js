const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const app1 = await prisma.webApp.upsert({
    where: { slug: "sample-app-a" },
    update: {},
    create: {
      slug: "sample-app-a",
      name: "샘플 앱 A",
      description: "예시 웹앱 A입니다.",
      appUrl: "https://sample-app-a.yourdomain.com",
      sortOrder: 0,
    },
  });
  const app2 = await prisma.webApp.upsert({
    where: { slug: "sample-app-b" },
    update: {},
    create: {
      slug: "sample-app-b",
      name: "샘플 앱 B",
      description: "예시 웹앱 B입니다.",
      appUrl: "https://sample-app-b.yourdomain.com",
      sortOrder: 1,
    },
  });

  const pkg = await prisma.package.upsert({
    where: { slug: "pro-bundle" },
    update: {},
    create: {
      slug: "pro-bundle",
      name: "프로 패키지",
      description: "샘플 앱 A + B를 함께 이용합니다.",
      sortOrder: 0,
    },
  });

  await prisma.packageApp.upsert({
    where: {
      packageId_webAppId: { packageId: pkg.id, webAppId: app1.id },
    },
    update: {},
    create: { packageId: pkg.id, webAppId: app1.id },
  });
  await prisma.packageApp.upsert({
    where: {
      packageId_webAppId: { packageId: pkg.id, webAppId: app2.id },
    },
    update: {},
    create: { packageId: pkg.id, webAppId: app2.id },
  });

  console.log("Seed 완료:", { app1, app2, pkg });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
