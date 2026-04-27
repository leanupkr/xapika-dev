# 운영 가이드 (Operations Guide)

이 문서는 **하리카엔지니어링 / Xapika Engineering 운영자**를 위한 일상 작업 매뉴얼입니다.
기술 배경이 없어도 5분 안에 작은 수정을 PR까지 올릴 수 있도록 구성했습니다.

코드 구조나 기술 스택 자체에 대한 설명은 [README.md](./README.md)를 참고하세요.

---

## 목차

1. [본문 텍스트 한 줄 바꾸기](#1-본문-텍스트-한-줄-바꾸기)
2. [사진 교체](#2-사진-교체)
3. [Contact 폼 이메일 수신자 변경](#3-contact-폼-이메일-수신자-변경)
4. [오피스 주소 추가 / 변경](#4-오피스-주소-추가--변경)
5. [파트너 로고 추가 / 교체](#5-파트너-로고-추가--교체)
6. [환경변수 변경](#6-환경변수-변경)
7. [로컬에서 미리보기](#7-로컬에서-미리보기)
8. [트러블슈팅](#8-트러블슈팅)

---

## 1. 본문 텍스트 한 줄 바꾸기

모든 사이트 카피는 **두 개의 JSON 파일**에 들어 있습니다.

| 파일 | 언어 |
|---|---|
| `src/messages/en.json` | 영어 |
| `src/messages/ko.json` | 한국어 |

### 절차

1. 둘 중 하나의 파일을 텍스트 에디터로 엽니다.
2. 바꿀 문구를 검색합니다 (예: "Building the future of rail").
3. 따옴표 안의 값을 새 문구로 수정합니다. **키는 절대 바꾸지 마세요.**
4. **반드시 반대편 언어 파일도 같이 수정**합니다 (한국어만 바꾸면 영어 페이지에는 옛날 문구가 그대로 나갑니다).
5. 저장 → Git 커밋 → PR.

### 자주 바꾸는 키

| 무엇을 | 어디서 (`messages/en.json` 기준) |
|---|---|
| 홈 Hero 헤드라인 | `home.hero.headline` |
| 홈 Hero 서브 카피 | `home.hero.subhead` |
| Key Numbers 5개 통계 | `home.keyNumbers.items[].label` 와 `value` |
| Solutions 5개 카드 텍스트 | `solutions.cards[]` |
| 푸터 슬로건 | `footer.tagline` |
| 회사 소개 미션 | `about.mission.body` |

### 주의

- JSON 문법 오류가 나면 빌드가 실패합니다. 따옴표 짝, 콤마 누락 주의.
- 줄바꿈은 `\n`으로 입력합니다.
- HTML 태그는 사용하지 않습니다 (텍스트만).

---

## 2. 사진 교체

### Hero 사진 (홈 첫 화면)

1. 새 사진을 준비합니다.
   - **권장 사이즈:** 가로 2560px × 세로 1440px (16:9 비율)
   - **포맷:** WebP 또는 JPEG, 500 KB 이하
   - **내용:** 철도 차량 / 정비 현장 / 디테일 샷
2. 파일명을 `hero-XX-wide.jpg` (또는 `-work.jpg`, `-detail.jpg`) 형태로 지어 `public/hero/` 폴더에 저장합니다.
3. 만약 새 파일명을 추가했다면 `src/components/sections/Hero.tsx`에서 사진 목록도 업데이트합니다 (개발자 작업).

기존 5장 (`hero-01-wide.jpg` ~ `hero-05-detail.jpg`)을 **같은 파일명으로 덮어쓰기**만 하면 코드 수정 없이 즉시 반영됩니다.

### 일반 페이지 이미지

`public/` 폴더 아래 적절한 하위 폴더에 두고, 페이지 컴포넌트에서 경로를 참조합니다. 새 이미지는 항상 `next/image` 컴포넌트로 사용해야 자동 최적화됩니다 (개발자에게 요청).

---

## 3. Contact 폼 이메일 수신자 변경

문의 폼이 도착할 이메일 주소를 바꾸려면:

### Vercel 대시보드에서 (운영자 권장)

1. [vercel.com](https://vercel.com)에 로그인 → 본 프로젝트 진입
2. **Settings → Environment Variables**
3. `CONTACT_TO_EMAIL` 항목의 값을 새 이메일로 수정
4. (선택) `CONTACT_CC_EMAIL`에 참조 수신자 추가
5. **Deployments → 최신 빌드 → ⋯ → Redeploy** 실행
6. 약 1-2분 후 변경 반영

### 코드 변경 없이 즉시 적용됩니다.

### 만약 이메일이 도착하지 않으면

- Resend 대시보드 ([resend.com](https://resend.com)) 로그인 → **Logs**에서 발송 기록 확인
- 도메인 인증(SPF / DKIM)이 만료되지 않았는지 확인
- `CONTACT_FROM_EMAIL`이 인증된 도메인(`xapika.pl`)을 쓰고 있는지 확인

---

## 4. 오피스 주소 추가 / 변경

오피스 정보는 `src/messages/en.json`과 `ko.json`의 **`locations.offices`** 배열에 있습니다.

### 기존 오피스 정보 수정

해당 오피스 블록에서 `address`, `phone`, `email` 등의 값을 직접 수정하면 됩니다. **양쪽 언어 파일 모두** 수정.

### 새 오피스 추가

1. `locations.offices` 배열 마지막에 같은 구조로 한 항목 추가
2. 영어 파일에 새 항목, 한국어 파일에도 동일한 키로 새 항목
3. 만약 지도에 핀을 표시하고 싶다면 `src/components/sections/LocationsWorldMap.tsx`의 좌표 배열에도 위경도를 추가 (개발자 작업)

---

## 5. 파트너 로고 추가 / 교체

`public/partners/` 폴더에 SVG 또는 투명 PNG 파일을 추가합니다.

- **권장:** SVG (해상도 무관, 가벼움)
- **PNG일 경우:** 배경 투명, 가로 480px 이상
- **파일명:** 회사명 영어 소문자 (예: `siemens-mobility.svg`)

추가한 파일을 사이트에서 노출하려면 `src/components/sections/TrustedBy.tsx`의 로고 목록에 새 항목을 추가해야 합니다 (개발자 작업).

기존 로고를 **같은 파일명으로 덮어쓰기**하면 코드 변경 없이 교체됩니다.

---

## 6. 환경변수 변경

[README.md → Environment Variables](./README.md#environment-variables) 표를 참조하세요.

| 어디서 변경하나 | 어떻게 |
|---|---|
| 로컬 개발 | `.env.local` 파일 직접 수정 → `pnpm dev` 재시작 |
| Vercel Production / Preview | Vercel 대시보드 → Settings → Environment Variables → 값 수정 → Redeploy |

**중요:** `.env.local` 파일은 **절대 Git에 커밋하지 마세요** (이미 `.gitignore`에 등록됨).

---

## 7. 로컬에서 미리보기

코드를 직접 수정하기 전에 로컬에서 사이트를 띄워 확인할 수 있습니다.

```bash
# 1회 설치 (처음만)
pnpm install

# 환경변수 파일 만들기 (처음만)
cp .env.local.example .env.local
# 텍스트 에디터로 열어 RESEND_API_KEY 등 입력 (없어도 사이트는 열림)

# 개발 서버 시작
pnpm dev
```

브라우저에서 `http://localhost:3000` 접속 → 자동으로 `/en`으로 이동합니다.

`src/messages/en.json` 또는 `ko.json`을 수정하면 **저장 즉시** 화면이 새로고침됩니다.

종료: 터미널에서 `Ctrl + C`.

---

## 8. 트러블슈팅

### Q. Contact 폼을 제출했는데 이메일이 안 와요

1. Vercel **Settings → Environment Variables**에서 `RESEND_API_KEY` 가 비어있지 않은지 확인
2. Resend 대시보드 **Logs** 탭에서 해당 시각에 발송 기록이 있는지 확인
   - 기록이 있고 "Delivered"라면 → 받은편지함 / 스팸함 확인
   - 기록이 있고 "Bounced"라면 → 도메인 인증 (SPF / DKIM) 만료 확인
   - 기록이 없다면 → API 키가 잘못됐거나, 폼 자체가 서버에 도달 못 한 상태
3. 그래도 해결 안 되면 개발자에게 Vercel **Logs → Functions** 로그 확인 요청

### Q. 빌드가 실패해요 (Vercel에 빨간 X)

- 가장 흔한 원인은 **JSON 파일 문법 오류**입니다 (콤마 누락, 따옴표 짝 안 맞음).
- Vercel **Deployments → 실패한 빌드 → View Logs** 에서 에러 메시지 확인
- `messages/en.json` 또는 `ko.json`을 직접 수정한 직후라면, 그 파일을 [jsonlint.com](https://jsonlint.com)에 붙여넣어 검증

### Q. 사이트에 401 / 403 / 500 에러가 떠요

- **401 / 403**: Vercel 프로젝트에 비밀번호가 걸려 있을 수 있음 → Vercel Settings → Deployment Protection 확인
- **500**: 서버 측 에러 → Vercel **Logs → Functions** 에서 스택 추적 확인 → 개발자 호출

### Q. 한국어 / 영어 텍스트가 한쪽만 안 바뀌어요

JSON 파일 두 개를 따로 관리하기 때문입니다. **항상 `en.json`과 `ko.json`을 동시에** 수정하세요.

### Q. 모바일에서 메뉴가 안 열려요

브라우저 캐시 문제인 경우가 많습니다. 시크릿 모드에서 확인해보세요. 그래도 재현되면 개발자에게 신고.

### Q. 새 페이지를 추가하고 싶어요

코드 작업이 필요합니다 (`src/app/[locale]/`에 새 폴더 + page.tsx 작성, 사이트맵 등록, 메뉴 추가). 개발자에게 의뢰하세요.

---

## 도움말 / 연락처

- **개발 관련:** GitHub Issues 등록 또는 개발자에게 직접 연락
- **콘텐츠 관련:** 본 문서로 해결되지 않는 경우 개발자에게 문의
- **인프라 / 도메인:** Vercel 계정 관리자에게 문의

추가 기술 문서는 [README.md](./README.md), 변경 이력은 [CHANGELOG.md](./CHANGELOG.md)를 참고하세요.
