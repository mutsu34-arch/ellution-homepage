# Vercel 배포 방법 (엘루션 홈페이지)

빌드는 로컬에서 이미 성공한 상태입니다. 아래 중 한 가지 방법으로 배포하면 됩니다.

---

## 방법 1: Vercel 웹에서 GitHub 연동 (권장)

1. **GitHub에 코드 올리기**
   - GitHub에서 새 저장소 생성 (예: `elusion-portal`)
   - 로컬에서:
     ```bash
     cd "c:\Users\mutsu\Desktop\엘루션\홈페이지"
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/본인아이디/elusion-portal.git
     git push -u origin main
     ```

2. **Vercel 배포**
   - [vercel.com](https://vercel.com) 접속 → 로그인 (GitHub 계정으로 가입 가능)
   - **Add New** → **Project**
   - **Import Git Repository**에서 방금 올린 저장소 선택
   - **Root Directory**는 그대로 두고 **Deploy** 클릭

3. **환경 변수 설정** (배포 후)
   - Vercel 프로젝트 → **Settings** → **Environment Variables**
   - 아래 변수 추가 (값은 비공개로 채우세요):
     | 이름 | 값 | 비고 |
     |------|-----|------|
     | `NEXTAUTH_SECRET` | 32자 이상 랜덤 문자열 | 필수 |
     | `NEXTAUTH_URL` | `https://프로젝트이름.vercel.app` (또는 나중에 www.ellution.co.kr) | 배포 후 나온 주소 |
     | `NEXT_PUBLIC_STUDY_ADMIN_LAW_URL` | `https://quiz-seven-black.vercel.app/` | 행정법큐 주소 |
   - **Save** 후 상단 **Deployments** → 맨 위 배포 옆 **⋯** → **Redeploy** (환경 변수 반영)

4. **도메인 연결 (ellution.co.kr)**
   - Vercel 프로젝트 → **Settings** → **Domains**
   - `www.ellution.co.kr` 추가
   - 가비아 DNS에서 `www` → CNAME → `cname.vercel-dns.com` (Vercel이 안내하는 값 사용)

---

## 방법 2: Vercel CLI로 배포 (다시 시도)

CLI 연결 오류가 있었다면, 아래 후 다시 시도해 보세요.

```bash
cd "c:\Users\mutsu\Desktop\엘루션\홈페이지"
# 전역 Vercel 연결 초기화 (선택)
# npx vercel logout
# npx vercel login
npx vercel
```

- 로그인 후 **Set up and deploy?** → Y  
- **Which scope?** → 본인 계정  
- **Link to existing project?** → N (새 프로젝트)  
- **Project name** → 엔터 또는 원하는 이름  
- **Directory** → `./`  
- 배포가 끝나면 나온 URL(예: https://elusion-portal-xxx.vercel.app)로 접속해 보세요.

---

## 배포 후 수정 반영

- **GitHub 연동한 경우**: 로컬에서 수정 후 `git add` → `git commit` → `git push` 하면 Vercel이 자동으로 다시 배포합니다.
- **CLI만 쓴 경우**: 수정 후 같은 폴더에서 다시 `npx vercel --prod` 실행하면 프로덕션에 반영됩니다.

---

## 참고: 로그인/대시보드용 DB (선택)

지금 프로젝트는 **SQLite**를 쓰도록 되어 있어서, Vercel 서버리스 환경에서는 **로그인·회원가입·대시보드**가 동작하지 않을 수 있습니다.  
그 기능까지 쓰려면:

1. **Vercel Postgres** 또는 **Neon**(neon.tech) 등에서 PostgreSQL 생성
2. **DATABASE_URL**을 Vercel 환경 변수에 추가
3. `prisma/schema.prisma`에서 `provider`를 `postgresql`, `url`을 `env("DATABASE_URL")`로 바꾼 뒤  
   `npx prisma migrate deploy` (또는 `prisma db push`)로 테이블 생성

DB 설정을 하지 않아도 **메인, 엘루션 스터디, 행정법큐** 페이지는 배포된 URL에서 그대로 이용할 수 있습니다.
