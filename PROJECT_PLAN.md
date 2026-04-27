# Xapika Engineering Homepage — Project Plan (Archived)

> **Status: ✅ Completed 2026-04-28** — this document is the *original kickoff plan*
> (Phase 1 research → Phase 4 decisions). Live operational documentation has moved
> to **[README.md](./README.md)** and **[OPERATIONS.md](./OPERATIONS.md)**, and the
> chronological build history is in **[CHANGELOG.md](./CHANGELOG.md)**.
>
> This file is preserved for historical context — the design decisions, reference
> research, and direction rationale recorded here informed the v1.0 build.

## Context
Xapika Engineering(하리카엔지니어링)의 B2B 코퍼레이트 홈페이지를 신규 구축한다.
"Stadler Rail과 나란히 놓아도 꿀리지 않는" 디자인 품질이 최우선 목표.
Next.js 16 App Router + TypeScript + Tailwind CSS 4 + GSAP + Framer Motion 기술 스택.

---

## Phase 1: 디자인 리서치 결과 요약 ✅ 완료

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
- **추천: B+A 하이브리드** — 다크↔화이트 교차 리듬 ✅ **채택**

---

## Phase 2: 추천 디자인 방향 ✅ 구현 완료

### B안 기반 + A안 절제 하이브리드

**페이지 리듬 구조 (Home, 실제 구현):**
```
[DARK]  Hero — 시네마틱 현장 사진, 대형 타이포        ✅
[WHITE] Key Numbers — 정제된 카운터, 여백              ✅
[WHITE] Solutions — 카드 그리드, 헤어라인              ✅
[WHITE] Portfolios Preview — 에디토리얼 케이스 카드    ✅
[DARK]  Trusted By — 60s 무한 마퀴                     ✅
[WHITE] Global Presence — 인터랙티브 지도              ✅
[DARK]  Mid CTA — "Ready to build the future of rail?" ✅
```

### 디자인 시스템 ✅ 확정

**컬러:**
- Primary: `#f6a317` (주황, 5% 이하) — 로고 확정값으로 교체 완료
- Ink: `#0B1F3A` (네이비)
- Ink-muted: `#475569`
- Background: `#F7F8FA`

**타이포:**
- EN: Inter + Space Grotesk (Display) / KO: Pretendard
- H1 56-72px / H2 40px / H3 24px / Body 16px

**모션:**
- ease-out `cubic-bezier(0.16, 1, 0.3, 1)`, 200/320/480ms
- `prefers-reduced-motion` 전역 가드

**시그니처 디테일 (구현 완료):**
1. ✅ Hero Ken Burns + GSAP 인트로
2. ✅ Key Numbers 속도계 틱 + count-up
3. ✅ Trusted By 60s 무한 마퀴
4. ✅ Global Presence hub-spoke 라이브 펄스
5. ✅ Contact thank-you track-line 애니메이션
6. ✅ Portfolios Ukraine EMU 스크롤 스냅 갤러리

---

## Phase 3: 개발 실행 계획 ✅ 완료

실제 진행은 W1~W6.5 일정으로 완료됨. 자세한 변경 이력은 [CHANGELOG.md](./CHANGELOG.md) 참조.

| 주차 | 단계 | 상태 |
|---|---|---|
| W1 | Bootstrap + Design System + Hero | ✅ |
| W2 | Home Sections 1-6 + Mobile polish | ✅ |
| W3 | About | ✅ |
| W3-4 | Solutions (index + 5 detail) | ✅ |
| W4 | Portfolios (index + 3 case studies) | ✅ |
| W5 | Locations + Contact + 사이트 일관성 | ✅ |
| W5 | SEO (sitemap / JSON-LD / OG / 404 / favicon) | ✅ |
| W6 | Korean copy + design QA per PRD §9.6 | ✅ |
| W6 | Lighthouse perf + WCAG 2.1 AA | ✅ |
| W6.5 | 운영 문서 + 최종 빌드 검증 | ✅ |

---

## Phase 4: 확정된 결정사항 (참고용)

1. ✅ **디자인 방향**: B+A 하이브리드 확정 (다크↔화이트 교차 리듬)
2. ✅ **애니메이션**: GSAP + Framer Motion 병용 확정
3. ✅ **Hero 미디어**: 사진 크로스페이드 (Ken Burns 효과, 5장)
4. ✅ **스토리 톤**: 절제된 데이터 중심 ("철도는 멈출 수 없었다" — 숫자가 말하게)
5. ✅ **주황색**: `#f6a317` (로고 확정값)

---

## 핵심 파일 경로 (참고)

- PRD: `/Users/unvisr/Downloads/xapika-dev/PRD_Xapika_Homepage.md`
- 로고 원본: `/Users/unvisr/Downloads/xapika-dev/Harika Engineering/Harika Logo(s)/`
- 본 저장소: `/Users/unvisr/Downloads/xapika-dev/xapika-web/`

---

## 알려진 한계 (PRD §16 외부 의존)

v1.0 출시 시점 기준 미수급 / 미확정 항목은 [README.md → Known Limitations](./README.md#known-limitations)
표를 참조하세요. 운영 인계 후 점진적으로 채워질 항목입니다.
