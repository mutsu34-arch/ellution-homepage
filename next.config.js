/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 하위 도메인에서 메인과 쿠키 공유하려면 상위 도메인 지정 (예: .yourdomain.com)
  // experimental: { basePath: undefined },
};

module.exports = nextConfig;
