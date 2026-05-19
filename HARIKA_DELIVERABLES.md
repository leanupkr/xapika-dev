# 하리카 측 제공 필요 항목 (Client Deliverables Checklist)

이 문서는 **하리카엔지니어링(발주사)**이 LEANUP(수주사)에 전달해야 하는 미수급 콘텐츠·자산·결정사항을 한 곳에 정리한 체크리스트입니다.

각 항목은 (1) 어디에 노출되는지, (2) 현재 사이트에 어떤 임시값이 들어 있는지, (3) 어떤 형식으로 주시면 되는지, (4) 받은 후 어디서 교체되는지를 함께 적었습니다. **운영팀(하리카)이 i18n 메시지 파일을 직접 수정할 수도 있고, LEANUP에 자료만 전달해 주셔도 됩니다.**

> 우선순위: **P0** = 사이트 정식 런칭 전 반드시 필요 / **P1** = 런칭 직후 1~2주 안에 채워 넣을 수 있음 / **P2** = 있으면 좋음, 없으면 현재 임시값 유지

> **언어 정책 (2026-05-19 확정)**: 사이트는 **영어 단일 언어**로 운영됩니다. 모든 카피·문구는 **영문으로만** 주시면 됩니다. (한국어 페이지는 더 이상 운영하지 않습니다.)

> 출처 우선순위: 본 문서가 인용하는 일자·수치는 모두 **`260403 Harika Engineering 홈페이지 구성안.pdf`** (하리카 직접 제공, 2026-04-03) 기준입니다.

---

## 한눈에 보기

| 우선순위 | 항목 | 상태 |
|---|---|---|
| **P0** | CEO 인사말 본문 + 서명 + 초상 사진 | ❌ 미수급 |
| **P0** | 9개 오피스 주소·전화·이메일 (서울 제외) | ❌ 미수급 (서울만 계약서에서 확인) |
| **P0** | VISION IT 공식 웹사이트 URL 확정 (visionit.ai vs visionit.kr) | ⚠️ 불일치 — 현재 `visionit.kr` 사용 중 |
| **P0** | 우즈베키스탄 고속철 운영 개시 실제 일자 (2026.05 예정) | ⚠️ 계획값 노출 중 |
| **P1** | 조직도 (Organization Chart) 이미지 또는 데이터 | ❌ 미수급 |
| **P1** | 솔루션 5개 상세 페이지 카피 (구성안 §1.4 "내용 추후 협의 후 구성 예정") | ⚠️ 임시 카피 |
| **P1** | Partners 로고 — MSB Housing, Member of Cambridge University | ❌ 미수급 |
| **P1** | 우즈베키스탄 포트폴리오 사진·영상 (운영 개시 후) | ❌ 미수급 |
| **P1** | Privacy Policy / Terms of Use 정식 문구 | ⚠️ 임시 문구 |
| **P2** | 본사·기타 오피스 건물 사진 (또는 구글 지도 위치로 대체) | ⚠️ 현재 비전 — 구글 지도 위치 사용 중 |
| **P2** | 추가 Hero/포트폴리오 고해상도 사진·영상 | ✅ 기존 HRCS2 38장 + Warsaw Tram 21장 적용 중 |

---

## P0 — 사이트 정식 런칭 전 필수

### 1. CEO 인사말 + 서명 + 초상

**노출 위치**
- `/about/ceo` — 회사 소개 > CEO Message 페이지

**현재 임시값** (`en.json` 약 line 299~)
- 카피: `Awaiting CEO message — content arriving from Harika`
- 이름: `CEO Name · Founder & CEO` (임시 라벨)
- 초상: 텍스트 placeholder

**필요 형식**
- 본문: 영문 200~600 단어 (장문 단락 2~4개 권장)
- 서명: 영문 알파벳 표기 + 직책 (예: `John Doe / Founder & CEO`)
- 초상 사진: JPEG 또는 PNG, 정방형(1:1) 또는 인물 비율(4:5), 최소 800 × 800 px
- 비고: 신안산선 홈페이지의 '운영사업' / '철도부품 사업' 같은 표현은 피해 주세요 (구성안 §1.3 명시).

**받은 후 교체 위치**
- `src/messages/en.json` 의 `about.ceo.*` 키 (`placeholderName`, `awaitingNote` 두 키를 정식 본문으로 교체)
- `public/about/ceo-portrait.{jpg|png}` (신규 추가 — `public/about/` 폴더 신규 생성)

---

### 2. 9개 오피스 주소·전화·이메일

**노출 위치**
- `/locations` — Locations 페이지의 9개 오피스 카드 (지도 + 디렉토리)
- 푸터 — 모든 페이지 하단 (도시·국가만 노출, 주소는 미노출)

**현재 상태**
- 도시·국가·운영 시작 연월·좌표(지도 핀)는 모두 확정 (구성안 §1.3 연혁표 기준)
- 주소·전화·이메일은 모든 카드에서 `Address arriving` / `Email arriving` placeholder 노출 중

**서울만 확인됨 (출처: 2026.04.13 계약서 §갑 주소)**
> 서울특별시 강남구 압구정로 166, 리저스 압구정센터 601-23호

**필요 형식 — 9개 오피스 전체 (운영 시작 시기 순)**

| ID | 오피스 | 운영 시작 | 주소 | 전화 | 이메일 |
|---|---|---|---|---|---|
| `istanbul` | Istanbul (튀르키예) | 2016.10 | 필요 | 필요 | 필요 |
| `kyiv` | Kyiv (우크라이나) | 2018.11 | 필요 | 필요 | 필요 |
| `sao-paulo` | São Paulo (브라질) | 2019.06 | 필요 | 필요 | 필요 |
| `warsaw-office` | Warsaw Office (폴란드) | 2021.07 | 필요 | 필요 | 필요 |
| `warsaw-hq` | Warsaw HQ (폴란드 본사) | 2022.03 | 필요 | 필요 | `info@xapika.pl` 외 추가 있을 경우 |
| `virginia` | Virginia (미국) | 2023.06 | 필요 | 필요 | 필요 |
| `cairo` | Cairo (이집트) | 2023.10 | 필요 | 필요 | 필요 |
| `seoul` | Seoul (한국) | 2026.03 | **확인됨** ⬆ | 필요 | 필요 |
| `tashkent` | Tashkent (우즈베키스탄) | 2026.04 | 필요 | 필요 | 필요 |

- 구성안 §1.6 명시: "**주소, 건물 사진은 구글 지도 위치로 대체, 연락처 전달 예정**" → 주소만 받으면 구글 지도 핀 자동 연결됩니다.

**받은 후 교체 위치**
- `src/messages/en.json` 의 `locationsPage.offices[]` 배열 안 각 객체에 `address`, `phone`, `email` 필드 추가
- `contactPage.info.hqValue` 본사 주소 (현재 `"Warsaw, Poland · Address arriving"`)

---

### 3. VISION IT 공식 웹사이트 URL 확정

**노출 위치**
- `/solutions/digital-asset-management` — `Go to VISION IT` 외부 링크 버튼 (VisionItCallout + CTA 보조 버튼)

**불일치 내용**
- VISION IT 우크라이나어판 브로셔 표지: **`www.visionit.ai`**
- 현재 사이트 i18n 값: **`https://visionit.kr`** (line 713)

**필요 결정**
- 위 두 URL 중 어떤 것이 **현재 활성 도메인**인지 알려 주세요.
- 또는 둘 다 활성이면 어떤 URL을 사이트 외부 링크로 사용할지 결정 부탁드립니다.

**받은 후 교체 위치**
- `src/messages/en.json` 의 `solutionsDetail.digitalAssetManagement.cta.visitVisionIt`

---

### 4. 우즈베키스탄 고속철 운영 개시 실제 일자

**노출 위치**
- `/portfolios/uzbekistan-rail` — Uzbekistan HSR 포트폴리오 페이지
- 홈 Portfolios 미리보기 카드
- 회사 연혁 (Locations / Openings 섹션)

**현재 상태**
- 구성안 §1.3에 "**2026.05 Uzbekistan – High-speed Rail O&M Commenced**" 빨간색 강조로 명시되어 있어 이 일자로 노출 중
- 사이트 카피: `Coming May 2026` (홈 카드), `O&M operations launching May 2026` (포트폴리오 페이지)
- 일부 카피에 임시로 `2026.05.31` 일자가 들어가 있음 (LEANUP 일정표 마지막 납품일과 동일하게 잡아 둔 임시값)

**필요 정보**
- 실제 운영 개시 정확한 일자 (예: 2026.05.15 등)
- 또는 "2026년 5월 중" 같이 월 단위 표기로 변경 희망 여부

**받은 후 교체 위치**
- `src/messages/en.json` 의 `portfoliosDetail.uzbekistan.*` 및 `portfolios.uzbekistan.*`, `portfoliosPage.cases.uzbekistan.*`
- `locationsPage.offices` 배열 중 `tashkent`의 `since` 필드 / 연혁 타임라인의 2026.05 이벤트

---

## P1 — 런칭 후 1~2주 안에 채워 넣을 수 있음

### 5. 조직도 (Organization Chart)

**노출 위치**
- `/about/organization` — 회사 소개 > Organization 페이지

**현재 임시값** (`en.json` line 316~)
- `placeholderText`: `Organization Chart · diagram arriving from Harika`
- `awaitingNote`: `Awaiting org chart`

**필요 형식 (택1)**
- **이미지**: PNG 또는 SVG, 가로 1280 px 이상, 다크 배경(`#0B1F3A`) 위에서도 가독성 있도록 화이트/투명 처리
- **또는 구조 데이터**: 부서·팀명·인원수만 텍스트로 주시면 LEANUP이 SVG로 렌더링 가능

**받은 후 교체 위치**
- 이미지: `public/about/org-chart.{png|svg}` (신규 추가) + 컴포넌트 코드 갱신
- 데이터: `src/messages/en.json` 의 `about.organization.*`

---

### 6. 솔루션 5개 상세 페이지 카피

**근거**
- 구성안 §1.4 (Solutions 페이지 영역) — "**내용 추후 협의 후 구성 예정**" (빨간색 강조)
- 즉 현재 솔루션 5개 상세 페이지의 모든 내용 카피는 LEANUP이 작성한 임시값이고, **확정 카피를 하리카에서 주시면 교체**됩니다.

**노출 위치 (5개)**
1. `/solutions/light-maintenance` — 경정비
2. `/solutions/heavy-maintenance` — 중정비
3. `/solutions/supply-chain` — Rolling Stock SCM
4. `/solutions/digital-asset-management` — Digital Solutions & Asset Management
5. `/solutions/commercial-services` — Integrated Commercial & Ancillary Services

**솔루션별로 받아야 하는 카피 단위 (각 페이지 공통)**

각 솔루션 페이지마다:
- **Hero 헤드라인 / 서브헤드라인** (구성안 §1.2의 한 줄 정의는 이미 반영됨 — 더 길게 풀어 쓸지 결정)
- **WhatWeDo — 수행 업무 목록** (현재 임시 항목 노출 중 — 정식 분류·desc 필요)
- **KeyStats — 4개 수치 또는 정성 메트릭** (현재 구성안에서 검증된 수치만 노출)
- **CTA 카피** — `Contact our maintenance team` 등 (현재 임시)

**솔루션 4 — Digital Asset Management 별도 항목**
- 구성안 §1.2 H4: `Through our affiliate VISION IT's MMIS platform, we optimize operations and asset management with data-driven insights.` — 이 한 문장만 정식. MMIS의 5대 LIVE 기능(원격 모니터링 / 고장 분석 / CBM / 디지털 창고 / 디지털 직원)은 VISION IT 브로셔에서 확인했으나, 사이트에서는 본문에 포괄적으로만 인용 중. **별도 섹션으로 풀어 노출하려면 카피 보강 필요.**

**솔루션 3 — Supply Chain (Rolling Stock SCM) — 파트너 정보**
- 구성안 §1.2 H3 명시 수치: `50+ Global Partners`, `8,000+ Parts Managed` — 노출 완료
- **개별 파트너 6사** (Huawei / Huber+Suhner / Hyundai Corp / Knorr-Bremse / mRail / Entecerma) 로고는 자료 폴더에 있으나, **이 6개사가 실제 supply chain 파트너로 노출되어도 되는지** 확인 필요. 확정 후 노출/숨김 결정.

**받은 후 교체 위치**
- `src/messages/en.json` 의 `solutionsDetail.{lightMaintenance|heavyMaintenance|supplyChain|digitalAssetManagement|commercialServices}.*`

---

### 7. Partners 로고 (홈 페이지 Trusted-by 마퀴)

**노출 위치**
- 홈페이지 — Trusted By 무한 마퀴 섹션

**구성안 §1.2 명시 파트너 4종**
| 파트너 | 현재 상태 | 필요 |
|---|---|---|
| **VISION IT** | ✅ `public/partners/vision-it.png` 적용됨 | — |
| **Intel** | ✅ `public/partners/intel.png` 적용됨 (Intel Gold Alliance) | — |
| **MSB Housing** | ❌ 로고 없음 | PNG/SVG, 가로 480 px 이상, 배경 투명 |
| **Member of Cambridge University** | ❌ 로고 없음 | 동일 |

**받은 후 교체 위치**
- `public/partners/msb-housing.png` + `cambridge.png` (신규 추가)
- `src/components/sections/TrustedBy.tsx` 의 로고 manifest 배열 갱신 (LEANUP 작업)

---

### 8. 우즈베키스탄 포트폴리오 사진·영상

**노출 위치**
- `/portfolios/uzbekistan-rail` — Uzbekistan HSR 케이스 스터디

**현재 상태**
- 우즈베키스탄 운영은 **2026.05 개시 예정**이라 현재 사진·영상 없음 (`public/portfolios/uzbekistan-rail/` 폴더 자체 없음)
- 페이지 자체는 `Coming May 2026` placeholder + 카운트다운 UI로 운영 중

**필요 (운영 개시 후)**
- 디팟·차량·작업자 사진 5~10장 (JPG/WebP, 가로 1920 px 이상)
- 가능하면 짧은 영상 (mp4, 10~30초, 1920×1080)

**받은 후 교체 위치**
- `public/portfolios/uzbekistan-rail/` 폴더 신규 생성 + 파일 업로드
- `src/messages/en.json` 의 `portfoliosDetail.uzbekistan.gallery.*`

---

### 9. Privacy Policy / Terms of Use 정식 문구

**노출 위치**
- `/privacy` — 개인정보처리방침
- `/terms` — 이용약관

**현재 임시값**
- 두 페이지 모두 `Full privacy policy / terms of use is being prepared.` 임시 안내문구 노출
- 법무 검토 진행 중임을 사용자에게 알리고 있음

**필요 형식**
- 정식 본문 (영문), Markdown 또는 워드 파일
- EU GDPR + 폴란드 개인정보보호법 부합 권장 (한국 개인정보보호법은 영문 사이트 운영 범위에서 결정)
- 본문 구조 권장: 수집 항목 / 보관 기간 / 처리 목적 / 정보주체의 권리 / 문의처

**받은 후 교체 위치**
- `src/messages/en.json` 의 `privacyPage.*`, `termsPage.*`
- 본문이 길면 `src/content/privacy.en.mdx` 같은 MDX 파일로 분리 가능 (LEANUP 작업)

---

## P2 — 권장 (있으면 좋음, 없으면 현재 임시값 유지)

### 10. 본사·오피스 건물 사진

**노출 위치**
- `/locations` — 각 오피스 카드 (현재 텍스트 + 구글 지도 핀만 노출)

**현재 정책**
- 구성안 §1.6 명시: "**주소, 건물 사진은 구글 지도 위치로 대체, 연락처 전달 예정**" → 건물 사진은 필수가 아닙니다.

**필요 (선택)**
- 9개 오피스 외관 사진 (JPG, 가로 1280 px 이상)
- 있으면 카드에 노출, 없으면 현재처럼 구글 지도 핀만 노출

---

### 11. 추가 Hero·포트폴리오 고해상도 사진·영상

**현재 보유 자산** (Harika 측 제공 자료 활용 중)
- HRCS2 Depot Photos: 38장 → `public/hero/` 5장 + `public/portfolios/ukraine-emu/` 다수 적용
- Warsaw Tram Photos: 21장 → `public/portfolios/warsaw-tram/` season별 시리즈 적용
- DropMeFiles_K7A0i: 281개 raw 자산 (저작권 확인 후 사용)

**필요 (선택)**
- Hero용 와이드 사진 (2560 × 1440, WebP 우선) — 분기별 1~2회 갱신 권장
- 포트폴리오용 다양한 각도의 작업 현장 사진
- 가능하면 60초 이내 짧은 영상 (1080p, mp4)

**받은 후 교체 위치**
- `public/hero/` — Hero 슬라이드쇼
- `public/portfolios/{ukraine-emu|warsaw-tram|uzbekistan-rail}/` — 각 포트폴리오

---

## 부록 A — 자료 전달 방식

세 가지 중 편한 방법을 택해 주세요.

1. **이메일 첨부**: LEANUP 담당자(`contact@leanup.kr`)에게 ZIP / 폴더 압축 후 전달
2. **Google Drive 공유 폴더**: 폴더 URL을 받으면 LEANUP이 다운로드 후 정리
3. **DropMeFiles 등 임시 링크**: 7~14일 유효한 링크로도 무방

**파일명 권장**
- 카피 (텍스트): `[페이지명].docx` 또는 Markdown — 영문 본문만
- 사진: 원본 파일명 유지 (LEANUP이 web 최적화)
- 로고: 가능하면 SVG / 안 되면 투명 PNG (가로 480 px 이상)

---

## 부록 B — 운영팀이 직접 수정하는 가이드 (선택)

i18n 파일 한 개만 수정하시면 됩니다. 자세한 절차는 `OPERATIONS.md` 참고.

```
src/messages/en.json    # 영문 본문 (사이트의 유일한 언어 소스)
```

**원칙**
- JSON 따옴표 / 콤마 위치 주의 — 깨지면 빌드가 실패합니다
- 줄바꿈은 `\n`으로 입력
- 한국어 본문은 더 이상 운영하지 않으므로 추가하지 마세요 (사이트가 영문 단일 언어로 전환되었습니다 — 2026-05-19 결정)

**키 위치 빠른 찾기**

| 페이지 | i18n 키 prefix |
|---|---|
| 홈 / Hero | `hero.*` |
| Key Numbers | `keyNumbers.*` |
| 홈 — Solutions 카드 5개 | `solutions.items.*` |
| About > CEO | `about.ceo.*` |
| About > Organization | `about.organization.*` |
| About > Clients | `about.clients.*` |
| Solutions 상세 (5개) | `solutionsDetail.{slug}.*` |
| Portfolios 상세 (3개) | `portfoliosDetail.{slug}.*` |
| Locations 오피스 9개 | `locationsPage.offices[]` |
| Contact 정보 | `contactPage.info.*` |
| 푸터 | `footer.*` |
| Privacy / Terms | `privacyPage.*`, `termsPage.*` |

---

## 부록 C — 출처 신뢰도 우선순위 (현재 사이트 카피의 근거)

본 사이트의 모든 카피·일자·수치는 아래 순서로 결정되어 있습니다.

| 순위 | 자료 | 비고 |
|---|---|---|
| 1순위 | `xapika/260403 Harika Engineering 홈페이지 구성안.pdf` | **하리카 직접 제공 — 회사 연혁·통계·솔루션 카피 원천** |
| 2순위 | `xapika/01_사이트맵_IA문서_v1.0.docx` | LEANUP 작성 IA |
| 2순위 | `xapika/02_프로젝트수행일정표_v1.0.xlsx` | LEANUP 작성 일정표 |
| 2순위 | `xapika/260413 Xapika Homepage Renewal Contract.pdf` | 계약서 (서울 사무소 주소 출처) |
| 3순위 | `xapika/Harika Engineering/` 폴더 (하리카 직접 제공) | 로고·현장 사진 |
| 3순위 | `xapika/Vision IT/` 폴더 (VISION IT 제공) | MMIS 브로셔·로고 |

**1순위 자료와 충돌이 있을 경우 항상 1순위(구성안 PDF)를 따릅니다.**
자세한 내용은 `xapika/SOURCE_INDEX.md` 참조.

---

## 변경 이력

- 2026-05-19 (rev 2): 한국어 단일언어 정책 전환 반영 — KO 본문 요청 항목 제거, i18n 가이드를 `en.json` 단일 파일로 단순화. Footer 9개 오피스 풀 노출 반영. 솔루션 페이지 폴리시(speculative 섹션 제거) 후속 상태 동기화.
- 2026-05-19: 최초 작성 (P0~P2 11개 항목, 솔루션 5개 페이지 폴리시 작업 완료 시점 기준)
