# 엘루션 포털 — 웹앱 구독 홈페이지

로그인, 하위 도메인 웹앱 연결, **개별 앱 구독** 및 **패키지 구독** 결제가 가능한 메인 포털입니다.

## 기능 요약

- **로그인/회원가입**: 이메일 + 비밀번호 (NextAuth)
- **대시보드**: 구독 중인 앱·패키지 확인, 미구독 앱/패키지 구독하기
- **하위 도메인**: 각 웹앱을 `앱슬러그.yourdomain.com` 형태로 연결 (DNS + 리버스 프록시 설정 필요)
- **결제**: Stripe 구독 — 개별 앱 가격, 패키지 가격 각각 설정 가능
- **접근 API**: 하위 도메인 웹앱에서 `GET /api/access?appSlug=xxx`로 구독 여부 확인

## 로컬 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수

프로젝트 루트에 `.env` 파일 생성:

```env
# 필수 (개발)
NEXTAUTH_SECRET=아무랜덤문자열32자이상
NEXTAUTH_URL=http://localhost:3000

# DB — 개발 시 prisma/schema.prisma에서 sqlite 사용 중이면 생략 가능
# PostgreSQL 사용 시:
# DATABASE_URL="postgresql://user:pass@localhost:5432/elusion"

# Stripe (결제 사용 시)
STRIPE_SECRET_KEY=sk_test_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx
```

### 3. DB 생성 및 시드

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 4. 개발 서버

```bash
npm run dev
```

브라우저에서 http://localhost:3000 → 회원가입 → 로그인 → 대시보드에서 샘플 앱/패키지 확인.

---

## Stripe 연동 (개별 앱 / 패키지 구독)

1. [Stripe 대시보드](https://dashboard.stripe.com)에서:
   - **Products**에서 각 웹앱용 상품 생성 → 월/년 구독 가격(Price) 생성 → Price ID 복사 (예: `price_xxxx`)
   - 패키지용 상품 1개 생성 → 패키지용 가격 생성 → Price ID 복사

2. DB에 Price ID 반영:
   - **개별 앱**: `WebApp.stripePriceId`에 해당 앱의 Price ID 저장
   - **패키지**: `Package.stripePriceId`에 패키지 Price ID 저장  
   (현재는 Prisma Studio `npm run db:studio`에서 수동 수정하거나, 관리자 API/UI를 추가해 설정)

3. Webhook:
   - Stripe 대시보드 → Developers → Webhooks → 엔드포인트 추가
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - 이벤트: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - 서명 시크릿을 `.env`의 `STRIPE_WEBHOOK_SECRET`에 설정

---

## 하위 도메인 웹앱에서 구독 확인

각 웹앱(별도 서버)에서:

1. 사용자가 메인 포털과 같은 도메인으로 로그인되어 있어야 함 (쿠키 공유: `NEXTAUTH_URL`에 상위 도메인 사용, 쿠키 도메인 설정).
2. 포털 API 호출:
   - `GET https://yourdomain.com/api/access?appSlug=sample-app-a`  
     또는 `GET https://yourdomain.com/api/access?webAppId=앱ID`
   - 로그인된 세션으로 요청 시:
     - `200 { "allowed": true }` → 구독 중, 앱 접근 허용
     - `401` → 비로그인
     - `403` → 구독 없음
     - `404` → 앱 없음

---

## 배포 시

- **DB**: `prisma/schema.prisma`에서 `provider = "postgresql"`, `url = env("DATABASE_URL")`로 변경 후 `prisma migrate deploy` 실행.
- **Nginx 등**: `*.yourdomain.com`을 각 웹앱 서버로 프록시하고, 메인 도메인만 Next.js(이 포털)로 연결. 자세한 구성은 `ARCHITECTURE.md` 참고.

---

## 프로젝트 구조

- `src/app` — 페이지 및 API 라우트
- `src/lib` — auth, db, stripe, subdomain 유틸
- `prisma/schema.prisma` — User, WebApp, Package, Subscription 등
- `ARCHITECTURE.md` — 아키텍처 및 하위 도메인·결제 설계
