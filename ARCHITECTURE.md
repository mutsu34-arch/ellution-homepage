# 엘루션 홈페이지 — 아키텍처 개요

## 목표
- **메인 포털**: 로그인, 대시보드, 구독 관리
- **하위 도메인**: 각 웹앱을 `앱이름.도메인.com` 형태로 연결
- **결제**: 개별 앱 구독 + 여러 앱을 묶은 패키지 구독

---

## 1. 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Next.js 14 (App Router) |
| 인증 | NextAuth.js (세션 + JWT 또는 DB 세션) |
| DB | PostgreSQL (또는 SQLite 개발용) — Prisma ORM |
| 결제 | Stripe (구독 + 결제 링크/체크아웃) |
| 배포 | Vercel(권장) 또는 VPS + Nginx(하위 도메인 프록시) |

---

## 2. 하위 도메인 연결 방식

### 2-1. 동작 방식
- **메인**: `yourdomain.com` → Next.js 메인 앱 (랜딩, 로그인, 대시보드)
- **웹앱 A**: `app-a.yourdomain.com` → 별도 배포된 웹앱 또는 같은 Next.js의 리버스 프록시
- **웹앱 B**: `app-b.yourdomain.com` → 동일

### 2-2. 구현 옵션

**옵션 A — 리버스 프록시 (권장)**  
- Nginx/Caddy가 `*.yourdomain.com`을 받아서:
  - `yourdomain.com` → Next.js 메인 (포트 3000)
  - `app-a.yourdomain.com` → 웹앱 A 서버 (포트 3001 등)
  - `app-b.yourdomain.com` → 웹앱 B 서버 (포트 3002 등)
- 각 웹앱은 **별도 프로젝트**로 두고, 메인 포털에서만 로그인/구독 정보를 관리.

**옵션 B — Next.js 단일 앱에서 호스트별 분기**  
- Next.js 미들웨어에서 `host`를 읽어 `app-a.yourdomain.com`이면 `/apps/app-a` 등으로 리다이렉트하거나, 같은 도메인 안에서 iframe/프록시로 외부 웹앱을 띄우는 방식.
- 실제 웹앱 코드가 다른 서버에 있으면 **프록시**만 Next.js에서 담당.

이 프로젝트에서는 **옵션 A**를 전제로, 메인 포털이 “어떤 앱이 있고, 어떤 URL(하위 도메인)로 연결되는지”를 DB에 저장하고, 결제/구독만 메인에서 처리하는 구조로 설계합니다.

---

## 3. 데이터 모델 (요약)

- **User**: 이메일, 비밀번호(해시), 이름 등
- **WebApp**: 앱 ID, 이름, 하위 도메인(예: `app-a`), Stripe 상품 ID(가격 ID), 정렬 순서
- **Package**: 패키지 이름, 포함 WebApp 목록, Stripe 상품/가격 ID(패키지용)
- **Subscription**: User ↔ WebApp 또는 User ↔ Package, 상태(active/canceled 등), Stripe Subscription ID
- **Session**: NextAuth 세션 저장 (선택)

---

## 4. 결제 시나리오

1. **개별 앱 구독**  
   - 사용자가 “앱 A 구독하기” 클릭 → Stripe Checkout(해당 앱의 가격 ID) → 결제 완료 후 Webhook에서 `Subscription` 생성(타입: per_app), 해당 앱 접근 허용.

2. **패키지 구독**  
   - “프로 패키지 (앱 A+B+C)” 선택 → Stripe Checkout(패키지 가격 ID) → Webhook에서 `Subscription` 생성(타입: package), 패키지에 포함된 모든 앱 접근 허용.

3. **접근 제어**  
   - 각 웹앱 서버(하위 도메인)는:
     - 쿠키/토큰으로 메인 도메인과 SSO하거나,
     - 메인 포털 API에 “이 사용자가 이 앱 구독 중인지” 조회해서 허용/거부.

---

## 5. 폴더 구조 (메인 포털)

```
홈페이지/
├── prisma/
│   └── schema.prisma      # User, WebApp, Package, Subscription
├── src/
│   ├── app/
│   │   ├── (auth)/        # 로그인, 회원가입
│   │   ├── (portal)/      # 대시보드, 구독 관리 (로그인 필요)
│   │   ├── api/            # API 라우트 (auth, stripe webhook, 앱 목록 등)
│   │   └── layout.tsx
│   ├── lib/
│   │   ├── auth.ts        # NextAuth 설정
│   │   ├── db.ts          # Prisma 클라이언트
│   │   ├── stripe.ts      # Stripe 클라이언트/헬퍼
│   │   └── subdomain.ts   # 하위 도메인 유틸
│   └── components/
├── middleware.ts          # 세션 체크, (선택) 하위 도메인 라우팅
├── next.config.js
└── package.json
```

---

## 6. 배포 시 체크리스트

- [ ] DNS: `*.yourdomain.com` → 배포 서버 IP (또는 Vercel이면 `*` CNAME)
- [ ] Nginx: `server_name *.yourdomain.com`으로 각 하위 도메인을 해당 앱 포트로 프록시
- [ ] Stripe: Webhook URL을 `https://yourdomain.com/api/webhooks/stripe`로 등록
- [ ] 환경 변수: `DATABASE_URL`, `NEXTAUTH_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXTAUTH_URL`

이 문서는 구현 시 참고용입니다. 세부 API 시그니처나 컴포넌트는 코드와 함께 확장됩니다.
