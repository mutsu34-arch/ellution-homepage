# 엘루션 도메인 배포 (가비아 ellution.co.kr)

도메인: **http://www.ellution.co.kr/** (가비아에서 구매)

## 1. 메인 사이트(홈페이지) 연결

배포 서비스(Vercel, 가비아 호스팅, AWS 등)를 쓰는 경우:

| 배포처   | 가비아 DNS 설정 |
|----------|------------------|
| **Vercel** | 호스트: `www` → CNAME → `cname.vercel-dns.com` (Vercel에서 안내하는 값 사용) |
| **Vercel** | 루트 도메인 `ellution.co.kr`도 쓰려면: A 레코드 또는 Vercel에서 제공하는 A 레코드 값 사용 |
| **가비아 호스팅** | 가비아에서 “도메인 연결” 시 안내하는 대로 A/CNAME 입력 |

- 메인 사이트가 뜨는 주소를 **NEXTAUTH_URL**에 넣습니다.  
  예: `NEXTAUTH_URL=https://www.ellution.co.kr`

## 2. 스터디 웹앱(행정법큐 등) 주소

- **옵션 A — 그대로 외부 URL**  
  지금처럼 Vercel 퀴즈 앱 주소를 쓰면:  
  `.env`에  
  `NEXT_PUBLIC_STUDY_ADMIN_LAW_URL=https://quiz-seven-black.vercel.app/`  
  (이미 설정되어 있으면 변경 불필요)

- **옵션 B — 하위 도메인으로 전환**  
  나중에 행정법큐를 `https://행정법큐.ellution.co.kr` 형태로 쓰려면:
  1. 가비아 DNS에서 **서브도메인** 추가 (예: `admin-law` 또는 `행정법큐`)
  2. 그 서브도메인을 퀴즈 앱이 배포된 주소(Vercel 등)로 **CNAME** 연결
  3. `.env`에  
     `NEXT_PUBLIC_STUDY_ADMIN_LAW_URL=https://admin-law.ellution.co.kr`  
     처럼 하위 도메인 주소로 변경

## 3. 체크리스트

- [ ] 가비아 DNS에서 `www` (또는 루트)가 배포 서버 IP/호스트로 연결됨
- [ ] 배포 후 `.env`에 `NEXTAUTH_URL=https://www.ellution.co.kr` 설정
- [ ] 스터디 앱 URL은 현재 Vercel 주소 유지 또는 하위 도메인으로 변경

문제 생기면 가비아 쪽 **DNS 전파**가 24~48시간 걸릴 수 있으니, 그 후에도 확인해 보시면 됩니다.
