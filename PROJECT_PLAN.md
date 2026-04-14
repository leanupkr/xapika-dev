# Xapika Engineering 홈페이지 — 킥오프 계획

## Context
Xapika Engineering(하리카엔지니어링)의 B2B 코퍼레이트 홈페이지를 신규 구축한다.
"Stadler Rail과 나란히 놓아도 꿀리지 않는" 디자인 품질이 최우선 목표.
Next.js 15 App Router + TypeScript + Tailwind CSS + GSAP + Framer Motion 기술 스택.

---

## Phase 1: 디자인 리서치 결과 요약 (완료)

### 레퍼런스 10개 사이트 분석 (Agent A)
- Stadler, Alstom, Siemens Mobility, Hitachi Rail, Wabtec, Knorr-Bremse, MLT Aikins 등 7개 직접 분석
- B2B 철도 공통 패턴 5개: 풀너비 Hero, Key Numbers 신뢰, 글로벌 맵, 카드 그리드, 네이비+화이트+단색 악센트
- Xapika 차별화 3개: 전장 타임라인, 230대 시각화, 국가별 담당자 Contact

### 애니메이션 기술 리서치 (Agent B)
- GSAP 2025년 완전 무료화 (Webflow 후원), 상업 프로젝트 라이선스 문제 없음
- `@gsap/react`의 `useGSAP()` 훅이 Next.js App Router 표준 패턴
- GSAP(스크롤/타임라인) + Framer Motion(UI 상태/레이아웃) 역할 분담 명확
- 번들 ~50-60KB gzip, 모바일 60fps 달성 가능

### 디자인 방향 비평 (Agent C)
- A안(미니멀): 신뢰감 높지만 차별화·기억 각인 부족
- B안(다크 시네마틱): 차별화·기억 최강이지만 접근성·유지보수 리스크
- C안(에디토리얼): 독보적이지만 B2B 신뢰 부조화, 구현 최고난이도
- **추천: B+A 하이브리드** — 다크↔화이트 교차 리듬

---

## Phase 2: 추천 디자인 방향

### B안 기반 + A안 절제 하이브리드

**페이지 리듬 구조:**
```
[DARK]  Hero — 시네마틱 현장 사진, 대형 타이포
[WHITE] Key Numbers — 정제된 카운터, 여백
[WHITE] Solutions — 카드 그리드, 헤어라인
[DARK]  Story/Timeline — 전쟁 중 무중단 데이터 시각화
[WHITE] Global Presence — 인터랙티브 지도
[WHITE] Partners — 로고 그리드
[DARK]  Footer CTA — "Ready to build the future of rail?"
```

### 디자인 시스템 초안

**컬러:**
- Primary: `#F57C00` (주황, 5% 이하)
- Ink: `#0B1F3A` (네이비)
- Accent: `#C8102E` (전쟁 강조, 극소)
- Surface: `#FFFFFF` / Background: `#F7F8FA`

**타이포:**
- EN: Inter (Display for Hero) + KO: Pretendard
- H1 56-72px / H2 40px / H3 24px / Body 16px

**모션:**
- GSAP: Hero SplitText, 스크롤 인디케이터, Key Numbers, 타임라인
- Framer Motion: hover, 메뉴, 페이지 전환, 레이아웃
- ease-out `cubic-bezier(0.16, 1, 0.3, 1)`, 200-480ms

**시그니처 디테일 6개:**
1. 레일 모티프 스크롤 인디케이터 (GSAP, 중)
2. Key Numbers 속도계 틱 (GSAP, 하)
3. "Since War" 타이핑 라인 (GSAP SplitText, 하)
4. Locations 호버 선로 연결 (Framer Motion, 중)
5. Contact "on track" 애니메이션 (Framer+GSAP, 중상)
6. 페이지 전환 주황 라인 스윕 (GSAP, 중)

---

## Phase 3: 개발 실행 계획

### 사전 준비
- [ ] 프로젝트 부트스트랩 (PRD §17.3)
- [ ] 디자인 토큰 `tokens.css` + tailwind.config.ts 매핑
- [ ] GSAP + `@gsap/react` + ScrollTrigger + SplitText 설치 및 초기화
- [ ] 디렉토리 구조 (PRD §17.4)
- [ ] i18n 미들웨어 (next-intl)

### 개발 순서 (PRD §17.6 기반)
1. **Day 1**: 부트스트랩 + 디자인 토큰 + Header/Footer + i18n + `/design-system` 페이지
   - 완료 후 PROJECT_PLAN.md 커밋
   - **게이트**: Playwright 스크린샷 3종 → 사용자 OK 후 Day 2 진행
2. **Day 2**: Home Hero + Key Numbers (디자인 컨펌 게이트)
   - **사전 작업**: Stadler/Alstom/Hitachi Rail Hero를 WebFetch로 스크린샷 수집
   - 3개 레퍼런스 비교 레이아웃 작성
   - Xapika Hero 시안 2~3개 버전 제작 → Playwright 스크린샷
   - 레퍼런스와 나란히 놓고 비교 → 사용자에게 방향 선택 요청
3. **Day 3-4**: Home 나머지 (Solutions 카드, Partners, Global Presence)
4. **Day 5**: About (타임라인 하이라이트)
5. **Day 6-7**: Portfolios (Ukraine 스크롤 스냅)
6. **Day 8**: Solutions 5p + Locations (지도)
7. **Day 9**: Contact 폼 + Resend + Thank You
8. **Day 10**: SEO, sitemap, OG, favicon, 404/500

### 섹션별 워크플로우
매 섹션 완료 시:
1. Playwright 스크린샷 3종 (데스크톱/태블릿/모바일)
2. 자가 비평 (§9.6 QA 체크리스트)
3. 사용자 컨펌 후 다음 섹션

---

## Phase 4: 확정된 결정사항

1. **디자인 방향**: B+A 하이브리드 확정 (다크↔화이트 교차 리듬)
2. **애니메이션**: GSAP + Framer Motion 병용 확정
3. **Hero 미디어**: 사진 크로스페이드 (HRCS2 사진 3장, Ken Burns 효과)
4. **스토리 톤**: 절제된 데이터 중심 ("철도는 멈출 수 없었다" — 숫자가 말하게)
5. **주황색 HEX**: 임시값 `#F57C00` — 로고 파일 확보 후 교체

## 첫 실행 단계 (Day 1)

프로젝트 부트스트랩 + 디자인 시스템 구축:

### 1. 프로젝트 생성 (PRD §17.3)
```bash
npx create-next-app@latest xapika-web \
  --typescript --tailwind --app --src-dir --import-alias "@/*" --no-eslint
```

### 2. 의존성 설치
```bash
# 핵심
pnpm add next-intl framer-motion react-hook-form zod \
  @hookform/resolvers resend lucide-react clsx tailwind-merge \
  class-variance-authority

# GSAP (무료)
pnpm add gsap @gsap/react

# 지도
pnpm add react-simple-maps d3-geo topojson-client

# Radix UI
pnpm add @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-slot

# 분석
pnpm add @vercel/analytics @vercel/speed-insights @sentry/nextjs

# 개발 도구
pnpm add -D prettier prettier-plugin-tailwindcss eslint eslint-config-next \
  @types/node @types/react husky lint-staged

# MDX
pnpm add @next/mdx @mdx-js/loader @mdx-js/react gray-matter

# shadcn/ui
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button input textarea select card badge sheet
```

### 3. 디자인 토큰 (`src/styles/tokens.css`)
PRD §17.5 기반 CSS 변수 + tailwind.config.ts 매핑

### 4. GSAP 초기화 (`src/lib/gsap.ts`)
- `gsap.registerPlugin(ScrollTrigger, SplitText)`
- `gsap.matchMedia()` prefers-reduced-motion 전역 설정
- 모든 컴포넌트가 이 파일에서 import

### 5. 디렉토리 구조 (PRD §17.4)
```
src/
├── app/[locale]/...        # i18n 라우팅
├── components/
│   ├── ui/                 # 커스텀 shadcn 컴포넌트
│   ├── sections/           # Hero, KeyNumbers, Solutions...
│   ├── layout/             # Header, Footer, LanguageToggle
│   └── motion/             # ScrollSnap, CountUp, SplitReveal
├── lib/
│   ├── cn.ts               # clsx + tailwind-merge
│   ├── gsap.ts             # GSAP 중앙 초기화
│   ├── resend.ts           # 이메일
│   └── seo.ts              # 메타 유틸
├── content/                # MDX 콘텐츠
├── messages/               # en.json, ko.json
├── styles/tokens.css       # CSS 변수
└── i18n/                   # config + middleware
```

### 6. Header/Footer + i18n 미들웨어
### 7. `/design-system` 스타일가이드 페이지 (CLAUDE_CODE_PROMPTS.md 프롬프트 2 참조)

## 핵심 파일 경로
- PRD: `/Users/unvisr/Downloads/xapika-dev/PRD_Xapika_Homepage.md`
- 프롬프트 가이드: `/Users/unvisr/Downloads/xapika-dev/CLAUDE_CODE_PROMPTS.md`
- 이미지 자산: 프로젝트 내 `content/assets/` 또는 하리카 제공 DropMeFiles 폴더

---

## 검증 방법
- `pnpm dev`로 로컬 확인
- Playwright로 데스크톱(1440px)/태블릿(768px)/모바일(360px) 스크린샷
- Lighthouse Performance 90+ / Accessibility 95+ 체크
- Chrome DevTools Performance로 모바일 60fps 확인
- `prefers-reduced-motion` 에뮬레이션으로 접근성 검증
