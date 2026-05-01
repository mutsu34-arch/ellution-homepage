import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://ellution.co.kr"),
  title: "엘루션(Ellution) | 법률·교육·IT 솔루션",
  description:
    "변호사가 직접 만드는 행정법 학습 앱 행정법Q 및 법률/부동산 전문 칼럼을 제공하는 엘루션 공식 사이트입니다.",
  openGraph: {
    title: "엘루션(Ellution) | 법률·교육·IT 솔루션",
    description:
      "변호사가 직접 만드는 행정법 학습 앱 행정법Q 및 법률/부동산 전문 칼럼",
    url: "https://ellution.co.kr",
    siteName: "엘루션",
    locale: "ko_KR",
    type: "website",
  },
  alternates: {
    canonical: "https://ellution.co.kr",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adsenseClientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT;
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        name: "엘루션",
        url: "https://ellution.co.kr",
        email: "ellutionsoft@gmail.com",
        areaServed: "KR",
        serviceType: "법률·부동산·교육 전문 콘텐츠 및 IT 서비스",
      },
      {
        "@type": "EducationalOrganization",
        name: "엘루션",
        url: "https://ellution.co.kr",
        sameAs: ["https://adminlawq.ellution.co.kr"],
        description: "변호사가 설계한 행정법 학습 플랫폼과 전문 칼럼을 제공합니다.",
      },
    ],
  };

  return (
    <html lang="ko">
      <body className="min-h-screen antialiased">
        <Script
          src="https://cdn.tailwindcss.com"
          strategy="beforeInteractive"
        />
        <Script
          id="ellution-organization-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
        {adsenseClientId && (
          <Script
            id="google-adsense-script"
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
          />
        )}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
