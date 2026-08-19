# Xapika News CMS — 최종 통합 구현 계획서 v2

*작성일: 2026-08-18 · v1(632줄, 2026-08-18 이전 판) 실측 감사 결과 전면 반영판*
*근거 체인: v1 → 확인1(권한 심층조사)·확인2(무비용 적대감사)·확인3(DB 필요성 판정) → 개정A(§5.4 권한설계 재작성)·개정B(Day0~14 실행매뉴얼) → 감사1(비용 적대검증)·감사2(실행가능성 적대검증) → **v2 자체 재검증(이번 작성 시점, npm registry 3건 + Sanity CLI 공식문서 재대조로 감사1·감사2도 놓친 결함 2건 신규 발견)***

---

## 0. v2 읽는 법

이 문서는 v1을 처음부터 다시 쓴 게 아니다. v1의 데이터 모델(§5)·UI 스펙(§9)·클라이언트 커뮤니케이션 문구(§13)·Next.js 캐시 API 검증(부록 A)은 실측으로 무효화되지 않았으므로 그대로 보존했다. 바뀐 것은 **권한 설계 전체**(Free 플랜에 Editor가 없다는 사실 반영)와 **Day 0~14 실행 매뉴얼의 정확성**(코드 버그·CLI 오탈자·줄 번호 오류 수정)이다. §1의 변경 요약표를 먼저 읽고 자신이 알던 v1의 어느 부분이 왜 바뀌었는지 확인한 뒤 본문으로 들어갈 것을 권한다.

**이 문서에 이르기까지 6단계의 검증을 거쳤다**: ① Sanity Free 3대 제약(권한/공개데이터셋/히스토리) 심층 확인 ② "추가 비용 0" 무비용 적대 감사 ③ DB 필요성 판정 ④ 권한·안전 설계 재작성 ⑤ Day 0~14 실행 매뉴얼 신규 작성 ⑥ 비용·실행가능성 관점 적대적 검증(결함 7건 발견, 전량 반영). 그리고 이번 v2 작성 과정에서 **7번째 검증**을 추가로 수행했다 — npm registry에서 실제 패키지 버전·peerDependency·export 이름을 직접 조회하고, Sanity 공식 CLI 레퍼런스 문서를 재대조해 앞선 5단계 검증에서도 발견되지 않았던 결함 2건(styled-components 누락, 백업 CLI 명령어 오탈자)을 새로 찾아 고쳤다. 아래 §1 변경표 12~13행이 그 결과다.

---

## 1. 결론 요약

**채택 아키텍처는 v1과 동일하다 — Sanity Studio(Free 플랜) 임베디드 CMS + Next.js 16 `/news` 동적 라우트.** 이번 개정은 아키텍처를 바꾸지 않는다. 실측(Vercel 3개월 청구 실적, Sanity 정확한 가격표, 권한 구조 상세)이 v1의 결론을 뒤집기는커녕 "추가 비용 0가 구조적으로 지켜진다"는 확신을 강화했다. 바뀐 것은 실행 디테일이다.

### 변경 요약표

| # | 항목 | v1 서술 | v2 정정 | 근거 |
|---|---|---|---|---|
| 1 | 에디터 초대 방식 | "이주연 주임을 **Editor**로 초대" | Free 플랜엔 Editor 역할 자체가 없음(Administrator/Viewer 2종뿐). **Org Owner(`info@xapika.pl`) / Project Administrator(이주연 주임)** 구조로 재설계 — §6 | 확인1, sanity.io/pricing 실측(G2) |
| 2 | 비-admin 좌석 상한 | "비-admin 좌석 **2명** 상한" | 틀림. **좌석은 20석.** 진짜 제약은 좌석 수가 아니라 **역할 종류**(Editor 부재) | 확인1, G2 |
| 3 | Sanity Growth 가격 | "미확인, 착수 전 재확인 필요" | **$15/seat/월 확정** | G2 |
| 4 | Vercel $20/seat 자동과금 | "리스크"(§9 원문), "작업 기간 토글 off 협의" | 6·7·8월 3개월 연속 정확히 $20.00 고정, **좌석 추가 과금 미발생 확인**. 단 토글 자체는 여전히 ON — "우연히 안전했을 뿐"이므로 리스크 등급은 낮추되 토글은 지금 끈다 | G1, §11 |
| 5 | 별도 DB 필요 여부 | 암묵적 가정, 명시적 판정 없음 | **명시적으로 불필요 판정** — Sanity 계정 생성 자체가 완전관리형 저장소 프로비저닝. 저장소 매핑표로 근거 제시 — §3 | 확인3 |
| 6 | webhook 서명 검증 | `!isValidSignature(body, signature, SECRET)`(await 없음) | **치명적 버그**: `isValidSignature`는 async 함수. await 누락 시 `!Promise{}`는 항상 `false` → 서명 검증이 100% 무력화되어 누구나 revalidate 엔드포인트를 공짜로 두드릴 수 있었음. `next-sanity/webhook`의 `parseBody()`로 교체 | `next-sanity@13.3.3`/`@sanity/webhook@4.0.4` 패키지 소스 직접 대조 |
| 7 | `revalidateTag` 프로파일 | `revalidateTag("news", "max")`만 사용 | `"max"`는 stale-while-revalidate라 **발행 직후 1회는 구내용이 보임**. 웹훅 핸들러는 `{ expire: 0 }`으로 즉시 만료 | Next.js 16 공식문서(`revalidateTag.md`) 원문 |
| 8 | 이미지 렌더 경로 | `next/image` + `next.config.ts`에 `cdn.sanity.io` remotePatterns 추가 | Vercel Image Optimization을 아예 거치지 않는 게 제약(D)에 더 안전 — Sanity `@sanity/image-url`이 만든 URL을 원시 `<img>`로 렌더. `next.config.ts`에 Sanity 관련 remotePatterns **추가하지 않음** | 무비용 감사 |
| 9 | 설치 패키지 구성 | `sanity`/`next-sanity`/`@sanity/image-url`/`@portabletext/react` 4개 | `next-sanity@13.3.3`이 `@portabletext/react`와 `@sanity/client`를 전부 `export *`로 재노출 — 별도 설치 불필요. 대신 **v2 자체 재검증에서 `styled-components`가 `sanity` 패키지의 필수 peerDependency(`^6.1.15`, 자동 설치 안 됨)임을 발견** — 실제 설치 목록은 `sanity`/`next-sanity`/`@sanity/image-url`/`styled-components` 4개로 재조정 | npm registry `sanity@6.9.2` 실측(v2 신규) |
| 10 | `@sanity/image-url` API 이름 | (감사2가 "미검증 고위험"으로 지적) | **v2에서 실측 확정: `createImageUrlBuilder` named export가 실제로 존재한다**(`@sanity/image-url@2.1.1` 배포본 `.d.ts` 직접 열람). 기존 코드 그대로 유효, 감사2의 우려는 해소됨 | unpkg 배포본 실측(v2 신규) |
| 11 | `nav.ts` 삽입 위치 | "60번째 줄 직전" | 실물 파일(61줄, `src/data/nav.ts`) 재확인 결과 portfolios→locations 경계는 **59번째 줄 직전** | 감사2 + v2 파일 재열람 |
| 12 | 백업 CLI 명령어 | `sanity dataset export`(단수) | **v2 신규 발견(감사1·감사2도 놓친 결함)**: Sanity 공식 CLI 레퍼런스의 정식 명령은 **`sanity datasets export`(복수)**다 | sanity.io/docs/cli-reference/cli-datasets 직접 재대조(v2 신규) |
| 13 | 백업 자동화 설계 | 매일 + 에셋 포함 + 90일 보존 → 감사1이 "3개월~1년 내 저장용량 초과/백업 무력화" 지적 → 감사1 제안(주1회+7~14일 보존) | **v2에서 감사1의 제안치를 재계산한 결과 그마저도 낙관적 시나리오 기준 약 6주 내 GitHub Actions 무료 저장한도(500MB)를 넘을 수 있음을 확인 → 더 강한 조치로 대체**: 일간 백업은 문서만(`--no-assets`, 용량 무시 가능), 에셋 포함 전량 백업은 스케줄 자동화하지 않고 **수동 트리거(`workflow_dispatch`) 전용**으로 전환 — §11 | 감사1 + v2 자체 저장량 재계산(§11 상세 수식) |
| 14 | Sanity 계정 소유 구조 | 위 1행대로 "Org Owner(`info@xapika.pl`) / Project Administrator(이주연 주임 개별 Google 계정으로 초대)" 역할 분리 구조 | **사용자 결정(2026-08-19)으로 재확정, v2 원안을 대체**: 별도 멤버 초대 없이 `info@xapika.pl` 단일 계정을 에이전시(leanup)와 클라이언트가 공용으로 사용한다. 감사 추적 불가 + 같은 계정이 Vercel·GoDaddy·Resend 마스터라 이주연 주임이 그 대시보드들에도 접근 가능해진다는 트레이드오프, 그리고 좌석 추가는 Free 20석까지 무료라는 대안까지 고지했음에도 사용자가 공용 1계정을 최종 선택 — 카드 미등록 / `/studio` 외 화면 접근 금지 / 2단계 인증 유지 / 담당자 교체 시 비밀번호 교체 4대 방어 규칙으로 리스크를 상쇄한다(§6 전면 개정) | 사용자 확정 지시, 2026-08-19 |

### 해소된 v1 불확실성 (근거와 함께 확정)

v1 §12의 10개 항목 중 아래는 이번 실측으로 **확정 해소**됐다(남은 항목은 §15).

| v1 §12 항목 | 상태 | 확정 근거 |
|---|---|---|
| ① non-owner 멤버 Google 로그인 가능 여부 | **해소 — 가능** | G3: sanity.io/login에 "Continue with Google" 최상단 확인(단, 초대 수락 흐름 자체의 실측 리허설은 Day 1에 1회 권장 — 완전 미확정은 아니고 "확인 절차"로 격하) |
| ③ Sanity Growth 정확한 가격 | **해소** | G2: $15/seat/월 |
| ④ Sanity Free 정확한 한도 수치 | **해소** | G2: Seats 20 / Documents 10K / Assets 100GB / Bandwidth 100GB·월 / API 250K req·월(non-CDN) — §4 |
| `info@xapika.pl` 계정 실존 여부 | **해소(v1 F1에서 이미 확정, 재확인됨)** | G4: 실존·활성 Google 계정, GoDaddy/Resend/Vercel 3개 연결 확인 |

---

## 2. 사용자 질문 4건에 대한 직답

### (A) "계획대로 본인이 직접 개발할 수 있는 실행 매뉴얼인가?"

**예, 이번 v2로 가능하다.** v1은 "Sanity를 셋업한다" 식의 추상적 서술이 곳곳에 있었고, 그 사이 개정B가 이를 Day 0~14 커맨드/파일 전문 단위로 바꿨다. 이 v2는 거기서 한 단계 더 나아가 개정B 자체의 결함까지 전부 고쳤다 — 특히 webhook 서명검증 버그(고치지 않았으면 인증 우회가 가능한 심각한 보안 구멍이 그대로 배포될 뻔했다), 백업 CLI 명령어 오탈자, `nav.ts` 줄 번호 오류, 한국어 토글 미구현까지 이번 v2 §8에서 실행 가능한 코드로 채웠다. §10의 Day 0~14를 위에서 아래로 그대로 따라가면 된다.

### (B) "DB도 셋업해야 하는가?"

**아니다, 필요 없다.** Sanity 계정을 만드는 행위 자체가 이미 완전관리형 문서 저장소(Content Lake)를 프로비저닝하는 것이다. 본문/이미지/카테고리/검색/계정/권한/버전이력 — News 기능에 필요한 7가지 요소 전부가 Sanity 계정 하나 안에 이미 있다. §3의 저장소 매핑표에 "DB에 있을 법한데 실제로 어디 있는지"를 정리했다. Postgres/Neon/Supabase를 만드는 단계는 이 계획 어디에도 없고 만들 필요도 없다. (향후 조회수 카운터·뉴스레터 구독처럼 Sanity가 다루지 않는 기능이 생기면 그때 Neon 또는 Upstash를 `info@xapika.pl` Google 계정으로 가입해 붙이면 되지만, 이번 스코프 밖이다.)

### (C) "새로 만드는 서비스는 전부 client Google OAuth 소유인가?"

**예.** 이번 아키텍처가 새로 만드는 계정은 Sanity 조직/프로젝트 하나뿐이고, §6에서 확정한 대로 `info@xapika.pl`이 Organization Owner로 Day 1에 처음부터 직접 생성한다(에이전시 계정을 거쳐가지 않음). 백업 자동화(§11)에 쓰는 GitHub Actions는 신규 계정을 만드는 게 아니라 **기존** `leanupkr/xapika-dev` 저장소의 부속 기능이라 이 원칙의 적용 대상이 아니다 — 다만 이 저장소 자체가 에이전시 소유라는 별개의 갭이 v1부터 이어지고 있고, 이는 별도 협의 트랙으로 §14/§15에 그대로 남겨둔다.

### (D) "추가 비용이 절대 발생하지 않는가?"

**구조적으로는 그렇다. 단, 이번 v2가 새로 찾은 "무비용 백업 자동화 자체가 새는 지점이 될 뻔했다"는 감사1의 지적은 실제로 심각했고, v2는 재계산까지 해서 더 강하게 고쳤다.** Sanity 쪽(Free는 카드가 있어도 초과과금 요금표 자체가 없는 하드블록 구조)과 Vercel 쪽(3개월 연속 $20 고정 실적 + Spend Management 하드캡)은 감사할수록 안전하다는 결론이 나왔다. 반면 새로 추가된 GitHub Actions 백업 자동화는 설계를 잘못하면(에셋 포함 + 매일 + 장기보존) 몇 달 안에 GitHub Actions 저장 한도를 초과해, 카드가 걸려있으면 실제 청구로, 안 걸려있으면 백업의 조용한 실패로 이어질 뻔했다. §11에서 이 설계를 근본적으로 다시 짰다 — 자산 포함 전체 백업은 자동 스케줄에서 아예 빼고 수동 트리거로만 남긴다. §11 체크리스트 전항목을 Day 1·3에 적용하면 3년 누적 추가 비용의 현실적 상한은 **$0**이다.

---

## 3. 확정 스택 + 저장소 매핑표

| 레이어 | 제품 | 버전/플랜 | 월 비용 | 비고 |
|---|---|---|---|---|
| CMS | Sanity Studio(임베디드 `/studio`) | Free 플랜, 데이터셋 `production` | $0 | 카드 미등록 권장(§11) |
| Next.js 통합 | `sanity` | **6.9.2**(핀 고정) | — | Studio 엔진 |
| | `next-sanity` | **13.3.3**(핀 고정) | — | GROQ 클라이언트 + Studio 임베드 + `PortableText`/webhook 파서 재노출 |
| | `@sanity/image-url` | **2.1.1**(핀 고정) | — | `createImageUrlBuilder` named export(v2 실측 확인) |
| | `styled-components` | **6.5.3**(핀 고정, v2 신규 추가) | — | `sanity`의 필수 peerDependency(`^6.1.15`), Studio 내부 UI가 런타임에 직접 import |
| 호스팅 | Vercel Pro(기존) | Pro | $0 추가 | News는 기존 배포에 라우트만 추가 |
| 계정 소유 | `info@xapika.pl` | — | — | 실존·활성 Google 계정(G4), Sanity Org Owner로 Day 1 직접 생성 |
| **합계(기본 시나리오)** | | | **$0/월** | 조건: §11 체크리스트 전항목 적용 |

> 버전 3개(`sanity`/`next-sanity`/`@sanity/image-url`)는 2026-08-18 시점 npm registry에 직접 조회해 확정한 값이다(v2 신규 검증). `next-sanity@13.3.3`의 peerDependencies는 `next: "^16.0.0-0"` / `react: "^19.2.3"` / `react-dom: "^19.2.3"` / `sanity: "^5.29.0 || ^6.0.0"` / `@sanity/client: "^7.26.2"` / `styled-components: "^6.1"` — 이 프로젝트의 `next@16.2.3`/`react@19.2.4`와 정확히 호환된다.

### 저장소 매핑표 — "DB에 있을 법한데 실제로는 어디에 있는가"

| 기능/데이터 | "DB에 있을 것 같은" 직관 | 실제 저장 위치 | 비고 |
|---|---|---|---|
| 기사 본문/제목/카테고리 | Postgres 테이블 | Sanity Content Lake(`newsPost` JSON 문서) | 계정 생성 시 자동 프로비저닝 |
| 커버 이미지/갤러리 | S3/Blob 파일 스토리지 | Sanity Assets(`cdn.sanity.io`) | 브라우저→Sanity 직접 업로드, 우리 서버 미경유 |
| 이미지 리사이즈/포맷변환/hotspot crop | 별도 이미지 파이프라인 | Sanity Image CDN(`@sanity/image-url`) | Vercel Image Optimization 의도적 우회(§8.4) |
| 검색/정렬/필터 | SQL `WHERE`/`ORDER BY` | GROQ 쿼리 | Content Lake 자체 쿼리 엔진 |
| 에디터 계정/로그인 | `users` 테이블 + 세션 | Sanity 자체 계정 시스템(Google/이메일) | |
| 권한(역할) | RBAC 테이블 | sanity.io/manage → Members → Role | Free=Administrator/Viewer 2종(§6) |
| 버전 히스토리 | audit log 테이블 | Sanity Document History(Free=3일) | §11 백업이 이 한계를 보완 |
| 발행 상태(초안/공개) | `status` 컬럼 | Sanity draft/published 네이티브 쌍 | 커스텀 status 필드 미사용 |
| 정적 페이지(HTML) | — | Vercel(Next.js 빌드 산출물) | Sanity가 아니라 Vercel이 서빙 |
| 재검증 트리거 | — | Sanity Webhook → Vercel Route Handler | 상태 저장 없음, 이벤트만 전달 |

**결론: 이 아키텍처에 우리가 직접 만들고 관리하는 DB 서버는 하나도 없다.**

---

## 4. Sanity Free 플랜 실측 한도표 + 초과 시점 예측

G2(2026-08-18, sanity.io/pricing 실측) 기준.

| 항목 | Free 한도 | 이 사이트 대입 | 초과 예상 시점 |
|---|---|---|---|
| Seats | 20 | 이주연 주임 1인(+본사 합류 시 소수 추가) | 도달 불가 |
| Roles | Administrator / Viewer 2종(Editor 없음) | §6에서 구조적으로 대응 | 플랜 한도가 아니라 기능 부재 — 해당 없음 |
| Datasets | 2개(public only) | `production` 1개 사용 | 도달 불가 |
| Documents | 10,000 | 월 2~4건×36개월=최대 144건, draft 포함 10배 잡아도 1,440건 | 수백 년 |
| Assets(누적) | 100GB | 월 180MB(낙관)~800MB(비관) 신규 업로드 | 10~46년 |
| Bandwidth(월간) | 100GB/월 | Vercel Image Optimization 미사용이라 origin fetch는 신규 이미지 수에만 비례, 최악 월 12.8GB | 도달 불가 |
| API requests(non-CDN) | 250,000/월 | `useCdn:false` 확정, 월 5,000 PV 기준 15,000 req | 여유 16배 |
| Review Changes(문서 히스토리) | 3일 | §11 백업 자동화로 보완 | 플랜 한도, 업그레이드 전엔 불변 |
| 초과 시 동작 | overage 요금표 자체가 없음(공식 표기: "Not included —") | — | **Free는 구조적으로 "몰래 청구" 불가능 — 하드 블록만 존재** |

---

## 5. 데이터 모델

v1의 스키마 설계는 실측으로 무효화되지 않았다. 그대로 채택한다. Sanity 문서 타입 `newsPost` 하나로 자체 작성 글과 외부 언론 스크랩을 모두 수용한다. `status`(draft/published) 커스텀 필드는 만들지 않는다 — Sanity 네이티브 draft/publish가 이미 이 기능을 제공한다.

| 필드명 | 타입 | 필수 | 검증 | 설명 |
|---|---|---|---|---|
| `kind` | string(radio) | ✅ | `required()` | `"own"` \| `"external"` — discriminator |
| `title` | string | ✅(항상) | `required().max(120)` | 영어가 SSOT |
| `slug` | slug | ✅ | `required()`, source: title | 자동생성 + 수동 override 가능 |
| `excerpt` | text | ✅(항상) | `required().max(240)` | 카드/메타디스크립션/외부링크 요약 겸용 |
| `category` | string(select) | ✅ | `required()` | company-news / project-update / press-release / media-coverage |
| `publishedAt` | datetime | ✅ | `required()`, default now | 정렬 기준 |
| `coverImage` | image(hotspot:true) | ❌ | alt는 이미지 있으면 필수 | fallback: dashed-placeholder |
| `coverImage.alt` | string | 조건부 | 이미지 존재 시 필수 | 접근성 |
| `body` | array(Portable Text + image) | kind=own일 때만 필수 | custom validate | kind=external이면 hidden |
| `gallery` | array of image | ❌ | — | kind=own일 때만 노출 |
| `externalUrl` | url | kind=external일 때만 필수 | `uri({scheme:[http,https]})` | 원문 링크 |
| `externalSource` | string | kind=external일 때만 필수 | custom validate | 매체명, 예: "Rynek Kolejowy" |
| `titleKo` | string | ❌ | 검증 없음 | 채우면 해당 글에 EN/KO 토글 노출 |
| `excerptKo` | text | ❌ | 검증 없음 | |
| `bodyKo` | array(Portable Text) | ❌ | kind=own일 때만 노출 | |
| `featured` | boolean | ❌ | default false | 목록 상단 고정 |
| `seoTitle` | string | ❌ | — | 메타타이틀 override |
| `seoDescription` | text | ❌ | — | 메타디스크립션 override |

**영어 필수 검증**: `title`/`excerpt`가 kind 무관 항상 필수, `body`는 kind=own일 때 필수 — 스키마 레벨 강제이므로 한국어만 채우고 영어를 비운 채 발행하는 경로가 물리적으로 없다.

**한국어 토글 4대 결정** (변경 없음, v1 그대로):
- (a) 상태 저장: URL 쿼리 `?lang=ko`(localStorage/쿠키 기각 — 공유 링크 일관성 + 정적 캐시 유지)
- (b) SEO: hreflang 미적용, canonical은 항상 쿼리 없는 영어 URL 고정, `?lang=ko`는 sitemap 미등록
- (c) 목록 카드: 상세 페이지 단위로만 토글 노출(글에 `titleKo` 있을 때만), 카드에는 "KO" 배지만
- (d) 영어 필수: 위 스키마 검증으로 구조적 방어

> **v2에서 명확히 한 것 (감사2 발견 4 해소)**: (a)의 `?lang=ko` 쿼리는 v1·개정B 모두 "결정"으로만 언급되고 실제 페이지 컴포넌트 코드에는 반영되지 않았었다. §8.7에서 `NewsDetailPage`가 `searchParams`를 서버에서 읽어 `titleKo`/`bodyKo`를 조건 렌더하는 실제 코드로 구현했다. 이 페이지는 원래도(§8.9 참조) `generateMetadata`가 `getRequestOrigin()`으로 `headers()`를 호출해 이미 요청 시점 동적 렌더링 대상이므로, `searchParams`를 추가로 읽는다고 해서 캐시 특성이 새로 나빠지지 않는다 — 기존 리스크 등록부(§12)에 이미 기록된 "이 사이트 전 페이지가 host 감지 때문에 사실상 항상 dynamic"이라는 사실과 정합적이다.

**외부 기사 클릭 시 동작**(변경 없음): 곧장 리다이렉트 **금지**, 자체 요약+원문보기 상세 페이지 경유. 근거 — 저작권(전문 복제 금지), SEO(외부 리다이렉트는 색인 가치 0), 썸네일(외부 이미지 핫링크 금지).

---

## 6. 권한·인증·안전장치

> **사용자 결정(2026-08-19)으로 전면 개정.** v2 원안(§1 변경표 1행)은 "Org Owner(`info@xapika.pl`) / Project Administrator(이주연 주임 개별 Google 계정)" 역할 분리 구조였다. 사용자가 이를 바꿨다 — **Sanity 계정은 `info@xapika.pl` 하나를 에이전시(leanup)와 클라이언트가 공용으로 쓴다. 별도 멤버 초대를 하지 않는다.** 트레이드오프(감사 추적 불가, 같은 계정이 Vercel·GoDaddy·Resend 마스터라 이주연 주임이 그 대시보드에도 접근 가능해짐)를 명확히 고지했고, 좌석 추가가 Free 20석까지 무료라는 대안까지 제시했음에도 사용자가 공용 1계정을 선택했다. 이하는 이 결정을 전제로 재작성한 권한 설계다 — 반대하거나 재론하지 않고, **리스크를 운영 규칙으로 덮는 방식**으로 접근한다.

### 6.1 핵심 원리 — 공용 1계정, 역할 분리 없음

**이 프로젝트에는 Sanity 로그인 계정이 `info@xapika.pl` 하나뿐이다.** leanup 팀과 이주연 주임(및 향후 발행 담당자)이 전부 이 Google 계정 하나로 `/studio`에 로그인한다. Project Administrator/Viewer 같은 역할 분리도, "누가 무엇을 발행·삭제했는지" 구분하는 감사 추적도 이 구조에서는 존재하지 않는다.

이 결정의 기술적 의미를 정확히 짚어야 한다: 로그인하는 사람이 "그 프로젝트 하나에 한정된 Project Administrator"가 아니라 **`info@xapika.pl` = Organization Owner 그 자체**다. 즉 기술적으로는 결제 수단 변경, 요금제 업그레이드(Free→Growth), 조직 삭제까지 전부 이 로그인 하나로 가능하다 — v2 원안이 세웠던 "Project Administrator는 결제·요금제를 건드릴 수 없다"는 방어선이 공용 계정 구조에서는 통째로 사라진다. 게다가 `info@xapika.pl`은 Vercel·GoDaddy·Resend의 마스터 계정이기도 해(부록 B, F3~F4) 이 하나의 로그인이 **사이트 배포·도메인·이메일 발송까지 전부 건드릴 수 있다.**

**그래서 이번 방어는 Sanity 역할 설계가 아니라 운영 규칙으로 한다** — 아래 6.2.

### 6.2 방어 규칙 — 역할 분리 대신 이것으로 리스크를 상쇄한다

| # | 규칙 | 상태 | 이유 |
|---|---|---|---|
| 1 | **Sanity에 결제 카드를 등록하지 않는다** | Day 1 실행 시 확인·유지 | 카드가 없으면 Free→Growth 요금제 인상 자체가 물리적으로 막힌다 — Free는 초과 요금표 자체가 없는 하드 블록 구조(§4)다. 결제 권한이 계정별로 분리되지 않는 문제를 "애초에 결제 수단이 없음"으로 상쇄한다. |
| 2 | **매뉴얼에 "Sanity Studio(`/studio`) 외의 화면은 절대 열지 않는다"를 명시한다** | 매뉴얼 반영(§13, `docs/NEWS_CMS_GUIDE.md`) | 같은 Google 계정으로 로그인한 김에 `vercel.com` 대시보드에 들어가면 배포 삭제·도메인 변경·결제정보 조회가 전부 가능하다. **최악의 경우 사이트가 내려갈 수 있다.** `sanity.io/manage`도 동일 이유로 금지(6.4 경고 문구 참조). |
| 3 | **Google 계정 2단계 인증(2FA)을 유지한다** | 계정 소유자(client) 확인 필요 | 공용 계정일수록 유출 시 파급이 커서 — Vercel/GoDaddy/Resend/Sanity 4개 서비스가 동시에 뚫린다 — 2FA가 선택이 아니라 필수다. |
| 4 | **담당자 교체 시 계정 비밀번호를 즉시 교체한다** | 인수인계 절차에 명시 | 공용 계정 구조에는 "멤버 제거" 버튼이 없다 — 퇴사·교체 시 접근을 끊는 유일한 수단이 비밀번호 변경이다. |
| 5 | **인원이 늘면 그때 개별 초대로 전환한다(옵션으로 유보)** | 향후 트리거 발생 시 재검토 | 폴란드 본사 인원이 합류하는 등 사람이 늘면, `info@xapika.pl`을 Organization Owner로 두고 신규 인원만 개별 Google 계정으로 Project 레벨에 초대하는 구조(§1 변경표 1행의 v2 원안)로 전환할 수 있다. **좌석은 Free 20석까지 무료**이므로 그 시점에도 비용은 들지 않는다 — 지금 공용 계정을 쓰는 이유는 비용이 아니라 "현재는 발행 담당이 사실상 1명뿐이라 분리의 실익이 없다"는 판단이다. |

**결론**: 이 5개 규칙이 지켜지는 한 공용 계정의 두 실질 리스크(재무 사고·인프라 사고)는 낮게 유지된다 — 카드 미등록으로 재무 사고 경로가 막히고, "Studio 외 화면 금지" 교육으로 인프라 사고 확률이 낮아진다. 감사 추적 불가라는 한계는 그대로 남지만, 이 프로젝트 규모(발행 담당 사실상 1인)에서는 감수 가능하다고 사용자가 판단했다.

### 6.3 Growth($15/seat/월) 전환 여부 — 기본 방침: 전환하지 않는다

정당화 조건은 오직 하나 — 폴란드 본사 인원이 합류해 "삭제·계정관리 권한 없이 글쓰기만" 필요한 사람이 여럿 생길 때. 이때도 진짜 트리거는 좌석 수가 아니라 역할 종류(Editor)다. 이 결정이 절대 암묵적으로 일어나지 않도록, 클라이언트에게 A(Free 유지 — 공용 계정 지속 또는 6.2-규칙5의 개별 Administrator 초대)/B(Growth 전환) 중 서면 선택을 요구하는 절차를 문서화한다(§11-⑦).

> **클라이언트 안내 문구(그대로 사용)**
> "폴란드 본사에서 뉴스 작성 인원이 추가되면, 그분들에게 계정을 공유하는 대신 각자의 Google 계정으로 개별 초대하는 것을 고려할 시점이 됩니다 — 무료입니다(좌석 20석까지 무료). 다만 '삭제·설정 불가, 글쓰기만 가능'인 중간 권한(Editor)은 무료 플랜에 없어 두 선택지가 있습니다: **A. Free 유지, 개별 Administrator 초대** — 비용 $0. 각자 계정은 분리되지만 삭제 권한도 함께 갖게 됨(실수 삭제 시 백업으로 복구 가능, 재무적 리스크는 없음). **B. Growth 전환** — 월 $15×좌석 수 추가(예: 2석이면 월 $30). 이 경우 '글쓰기만 가능, 삭제·설정 불가'인 Editor를 정확히 드릴 수 있습니다. 저희 권장은 A이지만 결정은 사장님 몫입니다."

### 6.4 Draft 공개 노출 문제 — 최종 방침: 수용, 조건부

Public dataset이라 **한 번이라도 Publish된 문서는 인증 없이 누구나 GROQ/GraphQL API로 영구 조회 가능**(사이트 UI 노출 여부와 무관). Draft(미발행) 문서는 public dataset에서도 인증 없이는 조회되지 않는다. 뉴스 콘텐츠 특성상 이 구조는 실질적으로 수용 가능하다. 조건: ① 이 데이터셋에 뉴스 기사 외 민감 콘텐츠(내부 문서·연락처·계약 조건)를 절대 넣지 않는다(스키마에 `newsPost` 하나만 존재해 구조적으로도 이미 강제됨) ② 검토가 완전히 끝나기 전까지 Publish 버튼을 누르지 않는다 ③ Unpublish해도 발행되어 있던 시간 동안의 노출은 되돌릴 수 없음을 인지한다.

> **매뉴얼 문구(그대로 삽입)**: "⚠️ Publish 전 꼭 확인하세요: 'Publish' 버튼을 누르는 순간 그 글은 전 세계 누구나 볼 수 있게 됩니다(사이트에 링크가 없어도 마찬가지입니다). 발표 시점이 아직 아니라면 Publish 대신 임시저장만 눌러주세요."

> **매뉴얼 문구 추가(공용 계정 경고, 그대로 삽입)**: "⚠️ `/studio` 화면만 사용하세요: 로그인한 김에 `sanity.io/manage`나 `vercel.com` 같은 다른 화면에 들어가지 마세요. 같은 계정이 결제·배포·도메인까지 관리하고 있어, 실수로 무언가를 누르면 사이트 자체가 내려갈 수 있습니다."

### 6.5 무비용 안전장치 요약 (상세 설정값은 §11로 통합)

① 위험 구역 물리적 분리(삭제 버튼은 `/studio`가 아니라 `sanity.io/manage` 전용 — 매뉴얼에 "`/studio` 외 화면 금지" 명시, 6.2-규칙2) ② 정기 백업(§11) ③ 더미 프로젝트 삭제 플로우 Day 1 실측 ④ 카드 미등록 확인(6.2-규칙1) ⑤ 매뉴얼 "위험 구역" 경고 박스(6.4) ⑥ Google 2단계 인증 유지(6.2-규칙3) ⑦ 담당자 교체 시 비밀번호 교체 절차(6.2-규칙4) ⑧ Publish 규율 교육. **①·④·⑤·⑥·⑦·⑧은 순수 문서화**라 코드 없이 즉시 끝난다. **②만 코드(백업 워크플로우)가 필요**하다 — §11 참조. (v1/v2 원안에 있던 "초대→Google 로그인 Day 1 리허설"은 공용 계정 구조에서 별도 초대 자체가 없어져 삭제됐다 — §15 참조.)

---

## 7. 파일 트리

### 신규 생성

```
sanity.config.ts
sanity.cli.ts
eslint.config.js

src/sanity/
  env.ts                     # projectId/dataset/apiVersion
  client.ts                  # createClient — useCdn:false
  image.ts                   # urlFor()/srcSetFor()
  fetch.ts                   # sanityFetch<T>() — next:{tags} 패스스루
  queries.ts                 # GROQ: newsListQuery/newsBySlugQuery/newsSlugsQuery/newsCountQuery
  types.ts                   # NewsPost 등 프론트 소비 타입
  schemaTypes/
    index.ts
    newsPost.ts

src/app/
  studio/[[...tool]]/page.tsx           # NextStudio 임베드
  news/
    page.tsx                            # 목록
    [slug]/page.tsx                     # 상세(generateStaticParams + searchParams 언어토글)
    rss.xml/route.ts                    # RSS 피드(v2 신규 실구현)
  api/revalidate/route.ts               # Sanity webhook 수신(parseBody 기반, 서명검증 버그 수정)

src/components/
  ui/CategoryChip.tsx
  ui/SanityImage.tsx                    # next/image 대체 원시 <img>
  sections/
    NewsIndex.tsx / NewsHero.tsx / NewsBody.tsx
    NewsGallery.tsx / NewsExternalPanel.tsx
    RelatedNews.tsx / NewsPreview.tsx
    NewsLangToggle.tsx                  # 서버 컴포넌트(링크 2개, 클라이언트 상태 불필요)

src/lib/newsLd.ts                       # newsArticleLd()/newsCollectionLd()

.github/workflows/
  sanity-backup-daily.yml               # 문서만, 매일, 자동(v2 재설계)
  sanity-backup-full.yml                # 에셋 포함, 수동 트리거 전용(v2 재설계)

docs/
  NEWS_CMS_GUIDE.md                     # 영문 정본 매뉴얼
  뉴스_CMS_요약_국문.md                    # 국문 1-2p 치트시트
  NEWS_UI_KOREAN_GLOSSARY.md             # Studio 영문 필드명 ↔ 한국어 뜻 스크린샷 대조표
  NEWS_RECOVERY_PROCEDURE.md             # 실수 삭제 시 복구 절차, 스크린샷 포함
  NEWS_BACKUP.md                        # GitHub Actions 백업 설명 + 복구 사용법
```

### 기존 파일 수정

| 파일 | 변경 내용 | 근거 |
|---|---|---|
| `src/data/nav.ts` | **59번째 줄 직전**(portfolios 블록 `},` 다음, locations 앞)에 `{ key:"news", label:"News", href:"/news" }` 삽입 | v2 재확인(감사2 정정) |
| `src/app/sitemap.ts` | `ROUTES`에 `/news` 정적 추가 + `sitemap()` 내부에서 Sanity slug 목록 fetch해 동적 append(try/catch 가드 필수, 기존 PL/KR `alternates` 패턴 유지) | §8.10 |
| `src/app/robots.txt/route.ts` | `Disallow` 배열에 `/studio` 추가 | §8.11 |
| `src/app/page.tsx` | `<GlobalPresence/>` 뒤에 `<NewsPreview/>` 추가, `postCount===0`이면 미렌더 | §8.12 |
| `src/app/privacy/page.tsx` | 플레이스홀더 제거, 실제 GDPR 콘텐츠 작성 | 이번 작업 계기로 필수 해소(News와 직접 무관, 부수 작업) |
| `package.json` | `sanity`/`next-sanity`/`@sanity/image-url`/`styled-components` 추가(**`@portabletext/react` 별도 설치 안 함** — v1 대비 변경), `"lint"`/`"typecheck"` script 추가 | §8.1 |
| `.env.local.example` | `NEXT_PUBLIC_SANITY_PROJECT_ID`/`NEXT_PUBLIC_SANITY_DATASET`/`SANITY_REVALIDATE_SECRET` 추가 | §10 Day 2·9 |
| `HARIKA_ACCOUNT_SETUP.md` | Sanity를 4번째 "Continue with Google, `info@xapika.pl` 소유" 서비스로 등재. Growth 전환 트리거가 좌석 수가 아니라 "Editor 역할 필요성"임을 명시 | §6.3 |

> **`next.config.ts`는 v1과 달리 변경하지 않는다(의도적, §1 변경표 8행)** — Sanity 이미지는 `next/image`를 거치지 않으므로 `remotePatterns`에 `cdn.sanity.io`를 추가할 필요가 없다.

---

## 8. 핵심 구현 스펙

### 8.1 패키지 설치 (Day 2)

```bash
pnpm add sanity@6.9.2 next-sanity@13.3.3 @sanity/image-url@2.1.1 styled-components@6.5.3
```

버전을 핀으로 명시했다(`^` 없이) — Studio/클라이언트/webhook 파서가 peerDependency로 서로 물려 있어(`next-sanity@13.3.3`은 `next:^16.0.0-0`/`react:^19.2.3`/`sanity:^5.29.0||^6.0.0`/`@sanity/client:^7.26.2`/`styled-components:^6.1`을 요구 — 이 프로젝트의 `next@16.2.3`/`react@19.2.4`와 정확히 호환), 임의 마이너 업그레이드로 조합이 깨지는 걸 막기 위함.

> **v2 신규 검증 사항**: `sanity@6.9.2`의 `peerDependencies`에 `styled-components: "^6.1.15"`가 있고 이건 `dependencies`(자동 설치)가 아니라 `peerDependencies`(수동 설치 필요)다. pnpm의 `auto-install-peers` 기본 동작에 기대 이 패키지를 누락하면, 대부분의 경우 pnpm이 알아서 resolve해 node_modules에는 존재하게 되지만 **명시적으로 package.json에 남지 않아 향후 pnpm 설정 변경 시 조용히 깨질 수 있다**. 이 프로젝트는 "버전을 핀으로 명시한다"는 원칙을 이미 세웠으므로 일관되게 명시적으로 설치한다.

> **주의**: `@sanity/client`를 별도로 설치하지 마라. `next-sanity`가 내부에서 `@sanity/client@^7.26.2`를 요구하는데 최신 배포본은 `8.x`대라, 직접 설치하면 pnpm이 8.x를 최상위로 끌어올려 `next-sanity`의 peer 계약을 깰 수 있다. `createClient`는 항상 `next-sanity`에서 import한다. 같은 이유로 `@portabletext/react`도 별도 설치하지 않는다 — `PortableText`는 `next-sanity`에서 바로 import 가능하다(`next-sanity` 소스에 `export * from "@portabletext/react"` 확인됨).

### 8.2 `sanity.cli.ts`

```ts
// sanity.cli.ts
import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "여기에_Day1에서_메모한_Project_ID",
    dataset: "production",
  },
});
```

### 8.3 `sanity.config.ts`

```ts
// sanity.config.ts
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { projectId, dataset } from "./src/sanity/env";

export default defineConfig({
  name: "default",
  title: "Xapika News",
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
```

> GROQ 디버깅용 Vision 플러그인은 의도적으로 뺐다(최소 의존성 원칙). 필요하면 `pnpm add @sanity/vision`, `plugins: [structureTool(), visionTool()]`만 추가 — `sanity` 패키지 자체엔 포함되어 있지 않다.

### 8.4 데이터 접근 레이어

```ts
// src/sanity/env.ts
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

// 날짜 고정 — "latest" 절대 금지. API 스키마 변경이 조용히 프로덕션 쿼리
// 결과를 바꾸는 사고를 방지한다.
export const apiVersion = "2026-08-01";
```

```ts
// src/sanity/client.ts
import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "./env";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  // 필수 — Sanity CDN 자체 TTL(수십 초)이 Next의 revalidateTag/revalidatePath와
  // 독립적으로 동작해, useCdn:true였다면 "발행 후 반영"이 보장되지 않는다.
  // News는 웹훅 기반 즉시 재검증이 핵심 가치이므로 false로 고정한다.
  useCdn: false,
  perspective: "published",
});
```

```ts
// src/sanity/fetch.ts
import { sanityClient } from "./client";

export async function sanityFetch<T>(input: {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
}): Promise<T> {
  const { query, params = {}, tags } = input;
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    throw new Error(
      "[news] NEXT_PUBLIC_SANITY_PROJECT_ID is not set — check .env.local",
    );
  }
  return sanityClient.fetch<T>(query, params, {
    next: { tags: tags ?? ["news"] },
  });
}
```

```ts
// src/sanity/queries.ts
import { groq } from "next-sanity";

const CARD_FIELDS = groq`
  _id, kind, title, titleKo, "slug": slug.current, excerpt, excerptKo,
  category, publishedAt, coverImage, externalUrl, externalSource, featured
`;

export const newsListQuery = groq`
  *[_type == "newsPost"] | order(featured desc, publishedAt desc) { ${CARD_FIELDS} }
`;
export const newsBySlugQuery = groq`
  *[_type == "newsPost" && slug.current == $slug][0] {
    ${CARD_FIELDS}, body, bodyKo, gallery, seoTitle, seoDescription
  }
`;
export const newsSlugsQuery = groq`*[_type == "newsPost"]{ "slug": slug.current }`;
export const newsCountQuery = groq`count(*[_type == "newsPost"])`;
```

```ts
// src/sanity/types.ts
import type { PortableTextBlock } from "next-sanity";
import type { Image } from "sanity";

export type NewsCategory =
  | "company-news"
  | "project-update"
  | "press-release"
  | "media-coverage";

export type NewsCardData = {
  _id: string;
  kind: "own" | "external";
  title: string;
  titleKo?: string;
  slug: string;
  excerpt: string;
  excerptKo?: string;
  category: NewsCategory;
  publishedAt: string;
  coverImage?: (Image & { alt?: string }) | null;
  externalUrl?: string;
  externalSource?: string;
  featured: boolean;
};

export type NewsPost = NewsCardData & {
  body?: PortableTextBlock[];
  bodyKo?: PortableTextBlock[];
  gallery?: (Image & { alt?: string })[];
  seoTitle?: string;
  seoDescription?: string;
};
```

```ts
// src/sanity/image.ts
import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image } from "sanity";
import { projectId, dataset } from "./env";

// v2 실측 확인(2026-08-18): @sanity/image-url@2.1.1은 default export가
// deprecated이고 named export `createImageUrlBuilder`가 정식 API다
// (배포 .d.ts 직접 열람으로 확인). 감사2가 제기했던 "API 이름 미검증
// 위험"은 이 검증으로 해소됐다.
const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Sanity 이미지를 next/image가 아니라 원시 <img>로 렌더하기 위한 URL 빌더.
 * 이유(무비용 감사 결론): next/image로 감싸면 Vercel Image Optimization이
 * 개입해 별도 과금 리소스가 하나 더 붙는다. Sanity가 이미 리사이즈/포맷변환/
 * hotspot crop을 전부 제공하므로 이중으로 거칠 필요가 없다.
 */
export function urlFor(source: Image) {
  return builder.image(source);
}

/** 반응형 <img srcSet>용 다중 폭 URL 생성. */
export function srcSetFor(source: Image, widths: number[]): string {
  return widths
    .map((w) => `${urlFor(source).width(w).auto("format").quality(75).url()} ${w}w`)
    .join(", ");
}
```

### 8.5 `src/components/ui/SanityImage.tsx`

```tsx
// src/components/ui/SanityImage.tsx
import type { Image as SanityImageType } from "sanity";
import { urlFor, srcSetFor } from "@/sanity/image";
import { cn } from "@/lib/cn";

const DEFAULT_WIDTHS = [480, 768, 1024, 1440, 1920];

type SanityImageProps = {
  image: SanityImageType & { alt?: string };
  sizes?: string;
  className?: string;
  widths?: number[];
};

export default function SanityImage({
  image,
  sizes = "100vw",
  className,
  widths = DEFAULT_WIDTHS,
}: SanityImageProps) {
  const src = urlFor(image).width(widths[widths.length - 1]).auto("format").quality(75).url();
  return (
    <img
      src={src}
      srcSet={srcSetFor(image, widths)}
      sizes={sizes}
      alt={image.alt ?? ""}
      loading="lazy"
      decoding="async"
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
```

### 8.6 `src/sanity/schemaTypes/newsPost.ts`

```ts
// src/sanity/schemaTypes/newsPost.ts
import { defineField, defineType } from "sanity";

export const newsPost = defineType({
  name: "newsPost",
  title: "News Post",
  type: "document",
  fields: [
    defineField({
      name: "kind",
      title: "Article type",
      type: "string",
      options: {
        list: [
          { title: "Own article (written by us)", value: "own" },
          { title: "External press coverage (link out)", value: "external" },
        ],
        layout: "radio",
      },
      initialValue: "own",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title (English — required)",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt (English — required)",
      description: "Shown on cards, used as meta description, and as the summary for external articles.",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(240),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Company News", value: "company-news" },
          { title: "Project Update", value: "project-update" },
          { title: "Press Release", value: "press-release" },
          { title: "Media Coverage", value: "media-coverage" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (Rule) =>
            Rule.custom((alt, context) => {
              const hasImage = Boolean((context.parent as { asset?: unknown })?.asset);
              if (hasImage && !alt) return "Alt text is required when a cover image is set.";
              return true;
            }),
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Body (English)",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
      hidden: ({ document }) => document?.kind !== "own",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const kind = (context.document as { kind?: string })?.kind;
          if (kind === "own" && (!value || (Array.isArray(value) && value.length === 0))) {
            return "Body is required for own articles.";
          }
          return true;
        }),
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      hidden: ({ document }) => document?.kind !== "own",
    }),
    defineField({
      name: "externalUrl",
      title: "External article URL",
      type: "url",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const kind = (context.document as { kind?: string })?.kind;
          if (kind === "external" && !value) return "Required for external coverage.";
          return true;
        }).uri({ scheme: ["http", "https"] }),
      hidden: ({ document }) => document?.kind !== "external",
    }),
    defineField({
      name: "externalSource",
      title: "Source name (e.g. Rynek Kolejowy)",
      type: "string",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const kind = (context.document as { kind?: string })?.kind;
          if (kind === "external" && !value) return "Required for external coverage.";
          return true;
        }),
      hidden: ({ document }) => document?.kind !== "external",
    }),
    defineField({ name: "titleKo", title: "Title (Korean — optional)", description: "Fill this in to show an EN/KO toggle on this article's page.", type: "string" }),
    defineField({ name: "excerptKo", title: "Excerpt (Korean — optional)", type: "text", rows: 3 }),
    defineField({
      name: "bodyKo",
      title: "Body (Korean — optional)",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
      hidden: ({ document }) => document?.kind !== "own",
    }),
    defineField({ name: "featured", title: "Pin to top of list", type: "boolean", initialValue: false }),
    defineField({ name: "seoTitle", title: "SEO title override", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO description override", type: "text", rows: 2 }),
  ],
  preview: { select: { title: "title", subtitle: "category", media: "coverImage" } },
});
```

```ts
// src/sanity/schemaTypes/index.ts
import type { SchemaTypeDefinition } from "sanity";
import { newsPost } from "./newsPost";

export const schemaTypes: SchemaTypeDefinition[] = [newsPost];
```

### 8.7 `src/app/studio/[[...tool]]/page.tsx`

```tsx
// src/app/studio/[[...tool]]/page.tsx
export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

`export { metadata, viewport } from "next-sanity/studio"`가 `noindex` robots 메타와 뷰포트를 자동으로 넣어준다. `robots.txt`에도 별도로 `Disallow: /studio`를 추가한다(§8.11).

### 8.8 `/news` 목록 페이지

```tsx
// src/app/news/page.tsx
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestOrigin } from "@/lib/seo-host";
import { sanityFetch } from "@/sanity/fetch";
import { newsListQuery } from "@/sanity/queries";
import type { NewsCardData } from "@/sanity/types";
import PageHero from "@/components/ui/PageHero";
import SectionContainer from "@/components/ui/SectionContainer";
import SanityImage from "@/components/ui/SanityImage";
import CategoryChip from "@/components/ui/CategoryChip";
import Link from "next/link";

export const revalidate = 3600; // 웹훅 실패 시 안전망

export async function generateMetadata(): Promise<Metadata> {
  const origin = await getRequestOrigin();
  return buildPageMetadata({
    origin,
    path: "/news",
    title: "News & Press — Xapika Engineering",
    description: "Company announcements, project milestones, and press coverage.",
  });
}

async function getPosts(): Promise<NewsCardData[]> {
  try {
    return await sanityFetch<NewsCardData[]>({ query: newsListQuery, tags: ["news"] });
  } catch (err) {
    console.error("[news] list fetch failed", err);
    return [];
  }
}

export default async function NewsIndexPage() {
  const posts = await getPosts();

  return (
    <>
      <PageHero
        patternId="pattern-news-index"
        overline="News"
        title="From the depots to the newsroom."
        subtitle="Company announcements, project milestones, and press coverage — in one place."
      />
      <SectionContainer className="py-[clamp(80px,10vw,140px)]">
        <div className="mb-8 font-mono text-sm text-ink/60">
          Published — {String(posts.length).padStart(2, "0")}
        </div>

        {posts.length === 0 ? (
          <div className="border border-dashed border-ink/18 p-16 text-center text-ink/60">
            The newsroom is just getting started.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/news/${post.slug}`}
                className={
                  post.featured
                    ? "group block aspect-[4/3] border border-ink/15 sm:col-span-2 sm:aspect-[21/9] lg:col-span-3"
                    : "group block aspect-[16/10] border border-ink/15"
                }
              >
                {post.coverImage ? (
                  <SanityImage image={post.coverImage} />
                ) : (
                  <div className="h-full w-full bg-ink/6" />
                )}
                <div className="p-6">
                  <CategoryChip category={post.category} />
                  <h3 className="mt-3 text-lg font-semibold">{post.title}</h3>
                  <p className="mt-2 text-sm text-ink/70">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </SectionContainer>
    </>
  );
}
```

> **v2 정정(감사2 발견 5)**: v1/개정B 초안은 `text-[var(--color-ink)]/70`, `border-[color-mix(in_srgb,var(--color-ink)_15%,transparent)]` 같은 arbitrary-value 문법을 새로 발명했다. 이 코드베이스는 이미 `@theme inline`으로 `--color-ink`/`--color-accent`를 Tailwind 색상 토큰으로 노출하고 있어(`src/app/globals.css` 확인됨, `Header.tsx`/`MegaDropdownItem.tsx`가 실사용 중) `text-ink/70`, `border-ink/15`, `bg-ink/6` 같은 표준 Tailwind opacity-modifier 문법이 그대로 동작한다. 위 코드는 이 관례를 따르도록 전면 수정했다.

### 8.9 `CategoryChip.tsx`

```tsx
// src/components/ui/CategoryChip.tsx
import { cn } from "@/lib/cn";

const LABELS: Record<string, string> = {
  "company-news": "Company News",
  "project-update": "Project Update",
  "press-release": "Press Release",
  "media-coverage": "Media Coverage",
};

type CategoryChipProps = {
  category: string;
  active?: boolean;
  as?: "button" | "span";
  onClick?: () => void;
  className?: string;
};

export default function CategoryChip({
  category,
  active = false,
  as = "span",
  onClick,
  className,
}: CategoryChipProps) {
  const label = LABELS[category] ?? category;
  const base = cn(
    "inline-flex min-h-[44px] items-center rounded-full border px-4 text-sm font-medium transition-colors",
    active
      ? "border-accent bg-accent text-white"
      : "border-ink/15 text-ink hover:border-accent",
    className,
  );

  if (as === "button") {
    return (
      <button type="button" onClick={onClick} className={base}>
        {label}
      </button>
    );
  }
  return <span className={base}>{label}</span>;
}
```

### 8.10 `/news/[slug]` 상세 — `generateStaticParams` + 한국어 토글 구현

이 코드베이스에 **동적 라우트 세그먼트(`[slug]`)가 생기는 건 이번이 처음**이다(기존 32페이지는 전부 하드코딩된 정적 폴더).

```tsx
// src/app/news/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestOrigin } from "@/lib/seo-host";
import { sanityFetch } from "@/sanity/fetch";
import { newsBySlugQuery, newsSlugsQuery } from "@/sanity/queries";
import type { NewsPost } from "@/sanity/types";
import SectionContainer from "@/components/ui/SectionContainer";
import SanityImage from "@/components/ui/SanityImage";
import CategoryChip from "@/components/ui/CategoryChip";
import NewsLangToggle from "@/components/sections/NewsLangToggle";

export const revalidate = 3600; // 웹훅 실패 시 안전망

export async function generateStaticParams() {
  try {
    const slugs = await sanityFetch<{ slug: string }[]>({ query: newsSlugsQuery, tags: ["news"] });
    return slugs.map((s) => ({ slug: s.slug }));
  } catch (err) {
    // Sanity 장애 시 `next build` 전체를 실패시키지 않고 빈 배열로 폴백.
    // dynamicParams가 기본값 true라 새 글은 여전히 on-demand로 생성된다.
    console.error("[news] generateStaticParams failed, falling back to []", err);
    return [];
  }
}
export const dynamicParams = true;

async function getPost(slug: string): Promise<NewsPost | null> {
  return sanityFetch<NewsPost | null>({
    query: newsBySlugQuery,
    params: { slug },
    tags: ["news", `news:${slug}`],
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const origin = await getRequestOrigin();
  const post = await getPost(slug);
  if (!post) return buildPageMetadata({ origin, path: `/news/${slug}`, title: "News", description: "" });
  return buildPageMetadata({
    origin,
    path: `/news/${slug}`,
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
  });
}

export default async function NewsDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { slug } = await params;
  const { lang: langParam } = await searchParams;
  const post = await getPost(slug);
  if (!post) notFound();

  // 한국어 토글(§5 결정 a): titleKo가 채워진 글에서만 ?lang=ko가 실제로 KO를 노출한다.
  // 이 페이지는 generateMetadata가 getRequestOrigin()(→headers())을 호출해
  // 이미 요청 시점 동적 렌더링 대상이므로(§12 리스크 등록부 기존 항목과 정합),
  // searchParams를 서버에서 읽어도 캐시 특성이 추가로 나빠지지 않는다.
  const showKo = langParam === "ko" && Boolean(post.titleKo);
  const title = showKo ? (post.titleKo ?? post.title) : post.title;
  const body = showKo ? (post.bodyKo ?? post.body) : post.body;

  return (
    <SectionContainer className="py-[clamp(80px,10vw,140px)]">
      <div className="flex items-center justify-between gap-4">
        <CategoryChip category={post.category} />
        {post.titleKo ? <NewsLangToggle slug={slug} currentLang={showKo ? "ko" : "en"} /> : null}
      </div>

      <h1 className="mt-4 text-[clamp(28px,5vw,48px)] font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-ink/60">
        {new Date(post.publishedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {post.coverImage && (
        <div className="mt-8 aspect-[16/9]">
          <SanityImage image={post.coverImage} />
        </div>
      )}

      {post.kind === "own" && body && (
        <div className="prose-news mt-10 max-w-[68ch]">
          <PortableText
            value={body}
            components={{
              types: {
                image: ({ value }) => (
                  <div className="my-6 aspect-[16/10]">
                    <SanityImage image={value} />
                  </div>
                ),
              },
            }}
          />
        </div>
      )}

      {post.kind === "external" && (
        <div className="mt-10 border border-ink/15 p-8">
          <p className="text-ink/80">{showKo ? (post.excerptKo ?? post.excerpt) : post.excerpt}</p>
          <a
            href={post.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block border-b border-accent font-medium text-accent"
          >
            Read on {post.externalSource} →
          </a>
        </div>
      )}
    </SectionContainer>
  );
}
```

```tsx
// src/components/sections/NewsLangToggle.tsx
import Link from "next/link";
import { cn } from "@/lib/cn";

type NewsLangToggleProps = {
  slug: string;
  currentLang: "en" | "ko";
};

/**
 * 순수 서버 컴포넌트 — 클라이언트 상태가 필요 없다. 언어는 이미
 * NewsDetailPage가 서버에서 searchParams를 읽어 결정하므로, 이 컴포넌트는
 * 단순히 두 개의 링크(?lang 유무)를 렌더할 뿐이다. "use client"/
 * useSearchParams가 필요하다는 v1/개정B 초안의 가정은 틀렸다(감사2 발견4 정정).
 */
export default function NewsLangToggle({ slug, currentLang }: NewsLangToggleProps) {
  const base = "min-h-[44px] px-3 inline-flex items-center text-sm font-mono border";
  return (
    <div className="inline-flex" role="group" aria-label="Language">
      <Link
        href={`/news/${slug}`}
        className={cn(base, "border-r-0", currentLang === "en" ? "border-accent text-accent" : "border-ink/15 text-ink/60")}
      >
        EN
      </Link>
      <Link
        href={`/news/${slug}?lang=ko`}
        className={cn(base, currentLang === "ko" ? "border-accent text-accent" : "border-ink/15 text-ink/60")}
      >
        KO
      </Link>
    </div>
  );
}
```

> 나머지 UI 컴포넌트(`NewsGallery`/`RelatedNews`/`NewsPreview`)는 §9 UI 스펙의 정확한 Tailwind 클래스(`aspect-[4/3]`, `grid-cols-1 sm:grid-cols-2` 등)를 그대로 따르면 된다 — 위 두 페이지에서 패턴(`SanityImage`/`CategoryChip`/`SectionContainer` 재사용, `text-ink/*`·`border-ink/*`·`bg-accent` 토큰 사용)이 실증됐으므로 여기서 전문을 반복하지 않는다.

### 8.11 `/news/rss.xml` — RSS 피드 (v2 신규 구현)

> v1 파일트리에는 있었지만 Day 0~14 어디에도 실제로 만드는 단계가 없어 죽은 참조로 남아 있던 파일이다(감사2 발견 6). v2에서 실제로 구현해 참조를 닫는다.

```ts
// src/app/news/rss.xml/route.ts
import { sanityFetch } from "@/sanity/fetch";
import { newsListQuery } from "@/sanity/queries";
import type { NewsCardData } from "@/sanity/types";
import { PL_ORIGIN } from "@/lib/seo-host";

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(): Promise<Response> {
  let posts: NewsCardData[] = [];
  try {
    posts = await sanityFetch<NewsCardData[]>({ query: newsListQuery, tags: ["news"] });
  } catch (err) {
    console.error("[news] rss fetch failed", err);
  }

  const items = posts
    .slice(0, 30)
    .map((post) => {
      const url = `${PL_ORIGIN}/news/${post.slug}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Xapika Engineering — News</title>
    <link>${PL_ORIGIN}/news</link>
    <description>Company announcements, project milestones, and press coverage.</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
```

### 8.12 `src/app/api/revalidate/route.ts` — webhook 재검증 (서명검증 버그 수정판)

```ts
// src/app/api/revalidate/route.ts
import { revalidateTag, revalidatePath } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import type { NextRequest } from "next/server";

const SECRET = process.env.SANITY_REVALIDATE_SECRET;

type WebhookPayload = {
  _type?: string;
  slug?: { current?: string };
};

export async function POST(req: NextRequest): Promise<Response> {
  if (!SECRET) {
    console.error("[news] SANITY_REVALIDATE_SECRET is not set");
    return new Response("Server misconfigured", { status: 500 });
  }

  // parseBody가 내부에서 정확히 `await isValidSignature(...)`를 처리한다.
  // (v1 초안은 `!isValidSignature(body, signature, SECRET)`처럼 await 없이 직접
  //  호출했다 — isValidSignature는 async 함수이므로 `!Promise{}`는 항상 false로
  //  평가되어 서명 검증이 통째로 무력화되는 치명적 버그였다. next-sanity의
  //  헬퍼를 쓰면 이 실수 자체가 불가능하다.)
  const { isValidSignature, body } = await parseBody<WebhookPayload>(
    req,
    SECRET,
    false, // Content Lake eventual-consistency 대기 불필요 — 이 핸들러는
           // Sanity를 재조회하지 않고 Next 캐시만 무효화한다. 기본값 true를
           // 쓰면 웹훅 응답이 3초 지연된다.
  );

  if (!isValidSignature) return new Response("Invalid signature", { status: 401 });
  if (!body) return new Response("Empty payload", { status: 400 });

  // Next 16: revalidateTag는 2번째 인자 필수(단일 인자 형태는 deprecated).
  // 웹훅/서드파티 즉시무효화 시나리오는 공식 문서가 명시적으로 { expire: 0 }을
  // 권장한다 — "max"(SWR)를 쓰면 발행 직후 1회는 이전 콘텐츠가 보이는 현상이
  // 생긴다(부록 A-2 참조).
  revalidateTag("news", { expire: 0 });

  revalidatePath("/news");
  revalidatePath("/"); // 홈페이지 NewsPreview 레일
  revalidatePath("/news/rss.xml");
  if (body.slug?.current) {
    revalidatePath(`/news/${body.slug.current}`);
  }
  // 주의: revalidatePath("/sitemap.xml")은 넣지 않는다 — 이 프로젝트의
  // sitemap.ts는 이미 headers()를 호출해 항상 dynamic이라(캐시되지 않음)
  // revalidate 대상 자체가 없다(부록 A 참조).

  return Response.json({ revalidated: true, now: Date.now() });
}
```

Sanity 프로젝트 → API → Webhooks에서 `newsPost` create/update/delete 이벤트를 이 URL로 POST 등록(Include drafts는 반드시 OFF). §10 Day 9에서 등록 절차와 발행→반영 지연시간 실측 방법을 다룬다.

### 8.13 `src/data/nav.ts` — 59번째 줄 직전 삽입

```ts
  { key: "portfolios", label: "Portfolios", href: "/portfolios", children: [ /* 기존 그대로 */ ] },  // ← 58번째 줄 "}," 로 끝남
  { key: "news",       label: "News",       href: "/news" },   // ← 신규: 59번째 줄로 삽입
  { key: "locations", label: "Locations", href: "/locations" },  // 기존 59→60으로 밀림
  { key: "contact",   label: "Contact Us", href: "/contact" },   // 기존 60→61
```

이 한 줄로 Header/MobileMenu/Footer/MegaDropdown 4곳에 자동 반영된다(코드 추가 불필요 — SSOT 구조). SiteJsonLd 등 다른 소비처가 있다면 마찬가지로 자동 반영되는지 Day 8 QA에서 함께 확인한다.

### 8.14 `src/app/sitemap.ts` — `/news` 정적 항목 + 동적 slug append

`ROUTES` 배열에 추가:

```ts
  { path: "/news", changeFrequency: "daily", priority: 0.7 },
```

`sitemap()` 함수 본문 끝에 아래를 추가 — **기존 코드가 PL/KR 듀얼 도메인 `alternates.languages`를 모든 항목에 부여하는 패턴을 그대로 따른다**(v2 정정: 개정B 초안은 이 패턴을 news 항목에서 누락했었다):

```ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await getRequestOrigin();
  const lastModified = new Date();

  const staticEntries = ROUTES.map((route) => { /* 기존 로직 그대로 — alternates 포함 */ });

  let newsEntries: MetadataRoute.Sitemap = [];
  try {
    const { sanityFetch } = await import("@/sanity/fetch");
    const { newsSlugsQuery } = await import("@/sanity/queries");
    const slugs = await sanityFetch<{ slug: string }[]>({ query: newsSlugsQuery, tags: ["news"] });
    newsEntries = slugs.map((s) => {
      const cleanPath = `news/${s.slug}`;
      const selfUrl = `${origin}/${cleanPath}`;
      const plUrl = `${PL_ORIGIN}/${cleanPath}`;
      const krUrl = `${KR_ORIGIN}/${cleanPath}`;
      return {
        url: selfUrl,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.6,
        alternates: {
          languages: { "en-PL": plUrl, "en-KR": krUrl, "x-default": plUrl },
        },
      };
    });
  } catch (err) {
    // Sanity 장애 시 sitemap 빌드 자체를 막지 않는다 — 정적 페이지 32개는 항상 나간다.
    console.error("[sitemap] news slug fetch failed", err);
  }

  return [...staticEntries, ...newsEntries];
}
```

(`import()` 동적 임포트로 감싼 이유: sitemap.ts는 가장 먼저 실행되는 파일 중 하나라 Sanity 관련 모듈이 없는 상태에서도 빌드가 깨지지 않게 하려는 방어. `PL_ORIGIN`/`KR_ORIGIN`은 이미 파일 상단에서 `@/lib/seo-host`로부터 import돼 있으므로 추가 import 불필요.)

`?lang=ko` URL은 sitemap에 등록하지 않는다(§5 결정 b).

### 8.15 `src/app/robots.txt/route.ts`

```ts
  const body = [
    "User-Agent: *",
    "Allow: /",
    "Disallow: /design-system",
    "Disallow: /studio",              // ← 추가
    "Disallow: /contact/thank-you",
    "",
    `Sitemap: ${origin}/sitemap.xml`,
  ].join("\n");
```

### 8.16 `src/app/page.tsx` — 홈 프리뷰 섹션 추가

```tsx
import NewsPreview from "@/components/sections/NewsPreview";
// ...
      <GlobalPresence ... />
      <NewsPreview />   {/* 내부에서 postCount===0이면 자체적으로 null 반환 */}
```

`NewsPreview.tsx`는 `sanityFetch({query: newsListQuery})`로 최신 3건을 가져와 카드로 보여주는 비동기 서버 컴포넌트 — `/news` 목록 카드 렌더 로직(§8.8)을 재사용한다. `posts.length === 0`이면 `return null;`로 섹션 자체를 렌더하지 않는다(필수 가드). `page.tsx`는 기존에 완전히 정적(동기 함수, 데이터 페칭 0건)이므로 비동기 서버 컴포넌트를 그 안에 끼워 넣는 것 자체는 RSC 구조상 문제없다(v2 재확인).

### 8.17 `eslint.config.js`

```js
// eslint.config.js
import nextConfig from "eslint-config-next";

export default [
  ...nextConfig,
  { ignores: [".next/**", "node_modules/**"] },
];
```

(`eslint-config-next@16.2.3`의 기본 export가 이미 flat-config 배열이라 스프레드만 하면 된다 — 패키지 내부(`dist/index.js`/`dist/index.d.ts`) 직접 열람으로 확인 완료.)

`package.json` scripts에 추가:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit"
}
```

---

## 9. UI 스펙

v1 §6을 그대로 보존한다(실측으로 무효화된 부분 없음). 위 §8의 코드가 이 스펙을 실제로 구현한 형태다.

- **목록(`/news`)**: `PageHero`(patternId="pattern-news-index", overline="News") + "Published" 카운터. `CategoryChip`(신규 primitive, `rounded-full`, `min-h-[44px]` 터치타겟) 필터 행 — 모바일은 `-mx-6 px-6 overflow-x-auto`, `sm:` 이상 `flex-wrap`. 그리드는 `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8`, featured 카드(`sm:col-span-2 lg:col-span-3`, `aspect-[4/3] sm:aspect-[21/9]`) + 일반 카드(`aspect-[16/10]`). "Load more" 배치 9개, `PortfoliosPreview`의 ghost-button 재사용, 번호 URL/무한스크롤 모두 기각.
- **상세(`/news/[slug]`)**: `SectionContainer` + 메타/공유 행(`CategoryChip` + date + 언어 토글) + `.prose-news`(자체 제작 클래스, `@tailwindcss/typography` 미설치·미사용) + 갤러리(선택) + 관련 기사. `media-coverage`(외부기사)는 `NewsExternalPanel` 스타일(요약+"Read on {source}" CTA)로 대체.
- **홈 프리뷰**: `GlobalPresence` 뒤, Footer 앞에 신규 섹션 append. `postCount===0`이면 섹션 자체 미렌더(필수 가드).
- **nav**: `NAV_ITEMS`에 children 없이 삽입 — nav 컴포넌트들 자동 반영, 코드 추가 불필요.
- **빈 상태**: 카운터 `00`, 필터 칩 미노출, 중앙 dashed-placeholder 패널("The newsroom is just getting started.").
- **모바일 375px**: 카드 `grid-cols-1`, featured `aspect-[4/3]`, 칩 가로스크롤, 언어토글 버튼 `min-h-[44px]`, `.prose-news` `max-width:68ch` 자연스럽게 375px 컬럼 안에 수렴.
- **클리셰 준수**: 그라데이션 없음(단일 accent), Space Grotesk+Pretendard만(JetBrains Mono 의도적 미사용 — 이 코드베이스엔 mono 토큰 자체가 없어 도입하면 오히려 "기존 디자인 시스템 100% 준수" 원칙 위반. §8 코드의 `font-mono`는 시스템 fallback mono로 예외적으로 카운터/토글 등 최소 용도에만 사용), 카드/패널 corner radius 0px(칩만 999px pill), border 1~1.5px hairline, shadow 없음(hover만 border+scale+accent-bar).

---

## 10. Day 0~14 실행 매뉴얼

> **감사2의 일정 재평가 반영**: 이 스택 특유의 함정(Next.js 캐시 API, Turbopack 폴백, eslint flat-config)은 전부 정확히 검증됐고 리스크가 낮다. 반면 Day 6-7(상세 페이지+한국어 토글+RSS)은 원래도 타이트했는데, 이제는 §8.10~8.11에서 코드가 이미 확정돼 있으므로 "설계 고민" 시간이 줄어 오히려 리스크가 낮아졌다 — v2는 코드를 미리 다 써놨기 때문에 감사2가 우려했던 "설계 결정에 반나절 추가 소요"가 발생하지 않는다. 그럼에도 **Day 6-7과 Day 14 사이에 반나절 정도의 버퍼가 필요할 수 있다는 점은 그대로 유지**한다 — 착수 전 client에게 "14일이 이상적 완료, 15~16일도 정상 범위"로 고지할 것(§13).

### Day 0 — 착수 전(필수, 코드 없음)

1. 김영근 대리/영업 라인에 §13(b)의 scope 문구와 일정 리스크 고지 → 착수 승인 확보.
2. 이주연 주임에게 §13(c)의 확인 질문 발송, 회신 대기.
3. 로컬 환경 확인:
   ```bash
   node -v   # v20.9 이상 확인(Next 16 최소 요구)
   pnpm -v
   git status   # 미커밋 변경 없는지 확인 후 시작
   ```

**완료 판정**: 승인 확보 + 이주연 회신 도착(또는 무응답 시 기본값 진행 결정) + `node -v`가 20.9+.

### Day 1 — 계정·조직 생성 + 3대 실측 + 비용 안전장치(코드 없음)

**1-A. 브라우저 세션 위생**: 시크릿 창을 새로 열고 `info@xapika.pl`로만 로그인한 상태에서 아래를 전부 진행한다. 평소 쓰던 브라우저 프로필로 하면 Google 계정이 여러 개 겹쳐 있어 실수로 `admin@leanup.kr` 세션에 조직이 딸려 들어갈 수 있다.

**1-B. Sanity 조직/프로젝트 생성**:
1. 시크릿 창에서 `sanity.io/login` → "Continue with Google" → `info@xapika.pl`.
2. 가입 직후 카드 정보를 요구하는지 확인. **요구하지 않으면 절대 등록하지 않는다.** 요구하더라도 당황하지 않는다 — Free 플랜엔 overage 요금표 자체가 없어(§4) 카드 등록 여부와 무관하게 자동 초과청구는 구조적으로 불가능하다. 다만 등록한 카드로 수동으로 Growth 전환 버튼을 직접 누르지 않는 이상 청구가 발생하지 않는다는 점을 실행자가 인지할 것.
3. `sanity.io/manage` → **Create project** → 이름 `xapika-news`, Organization은 새로 생성(**"Create new organization"**, 예: `Xapika Engineering`) — **절대 기존 조직에 붙이지 말 것.**
4. 데이터셋 이름은 정확히 **`production`**(코드 전체가 이 이름을 하드코딩 전제로 짜여 있다). Visibility는 Public(Free는 선택지가 없음).
5. **Project ID**를 메모(예: `abc12345`, 8자리 영숫자) — Day 2 env 설정에 필요.

**1-C. 검증① — leanup 계정 오염 확인**: `sanity.io/manage` 우측 상단 아바타가 `info@xapika.pl`인지, Organization → Members에 `admin@leanup.kr` 등이 자동으로 들어와 있지 않은지 확인. **실패 시**: 콘텐츠가 없는 상태이므로 Project Settings → Delete project로 삭제 후 시크릿 창을 완전히 새로 열어 재시작.

**1-D. 권한 구조 확정 — 공용 1계정**(§6, 사용자 결정 2026-08-19): 별도 멤버 초대 없음. `info@xapika.pl` 단일 계정을 leanup과 client(이주연 주임)가 공용으로 사용한다. Day 1엔 이 계정으로 조직·프로젝트만 생성해두고, 실제 이주연 주임의 사용은 Day 10에 같은 계정 정보를 전달하는 방식으로 진행한다(§6.2 방어 규칙 5개 준수).

**1-E. 검증② — 카드 미등록 확인**(6.2-규칙1. v2 원안의 "non-owner 멤버 Google 로그인 실측"은 공용 계정 구조에서 별도 멤버 초대 자체가 없어져 불필요해졌으므로 이 항목으로 대체 — §15 참조): 가입 직후 카드 정보를 요구하는지 확인. **요구하지 않으면 절대 등록하지 않는다.** 요구하더라도 당황하지 않는다 — Free 플랜엔 overage 요금표 자체가 없어(§4) 카드 등록 여부와 무관하게 자동 초과청구는 구조적으로 불가능하다. 다만 공용 계정 구조에서는 "카드가 등록되어 있지 않다"는 사실 자체가 재무 사고를 막는 유일한 기술적 방어선이므로 반드시 확인·기록한다.

**1-F. 검증③ 분기 로직만 지금 확정**(실제 실행은 Day 2): 1차 폴백 `next dev --webpack`/`next build --webpack`(package.json script만 임시 추가). 그래도 실패하면 **임베드를 포기하고 `npx sanity deploy`**로 Sanity 자체 무료 호스팅(`https://xapika-news.sanity.studio`)에 전환, Footer 등에 링크 하나만 배치. 추가 비용 $0.

**1-G. Vercel 비용 안전장치 — 사전 적용 완료(2026-08-19)**: Vercel 팀은 Sanity 착수 여부와 무관하게 이미 존재하므로, 아래 2건은 브라우저로 직접 설정을 마쳤다. Day 1에는 여전히 살아있는지 재확인만 하면 된다.
1. **좌석 자동청구 토글 On → Off — 완료.** Vercel → 팀 `Xapika` → Settings → Members → *"Automatically add private repository committers as Developers for $20/mo per seat"*. ("Off = Require Owner approval to add each team member"). (근거: 6·7·8월 3개월 연속 $20 고정이었을 뿐 — 토글 자체는 여전히 On 상태였다. 운에 맡기지 않고 지금 구조적으로 껐다.)
2. **Spend Management — 완료.** 온디맨드 예산 **$200 → $10/월**로 변경. Notifications Web+Email+SMS 전부 ON. **Pause Production Deployments: Off**(의도적 — 상업용 기업 사이트가 다운되는 손해가 소액 초과 청구보다 크다는 판단. 알림으로 사람이 대응하는 쪽을 택함). 팀명 확인 모달까지 통과해 저장 확인함.

**완료 판정**: 검증①(leanup 계정 오염 확인)·검증②(카드 미등록 확인)·Vercel 안전장치 2건(이미 완료, Day 1엔 재확인만)이 문서로 남아있음 + 검증③은 Day 2로 이월(폴백 경로는 확정됨).

### Day 2 — 패키지 설치 + 데이터 레이어 + Studio 임베드 스모크

1. "DB 셋업은 어디 있나?" — Day 1-B에서 프로젝트를 만든 순간 이미 끝나 있다(§2(B) 참조).
2. §8.1 패키지 설치.
3. §8.2~8.7의 파일을 순서대로 생성(스키마는 Day 3에 채우므로 `schemaTypes/index.ts`는 지금 빈 배열로 스텁):
   ```ts
   // src/sanity/schemaTypes/index.ts (임시)
   import type { SchemaTypeDefinition } from "sanity";
   export const schemaTypes: SchemaTypeDefinition[] = [];
   ```
4. `.env.local` 작성(`.env.local.example` 복사 후):
   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID=Day1에서_메모한_Project_ID
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
5. Vercel 대시보드 → 프로젝트 `xapika-dev` → Settings → Environment Variables에 위 2개를 **Production+Preview+Development** 전부 체크로 등록.
6. 검증③ 실행:
   ```bash
   pnpm build
   pnpm dev
   ```
   `http://localhost:3000/studio` 접속.

**완료 판정**: `pnpm build` 에러 0건 + `/studio`에서 Studio 로그인 화면 또는 빈 Desk 화면 표시(스키마가 비었으니 콘텐츠 없음이 정상). **실패 시**: Day 1-F 폴백 적용.

### Day 3 — 스키마 작성 + HEIC 실측 + 무비용 백업 자동화(재설계판)

1. §8.6의 `newsPost.ts` 전문 반영, `schemaTypes/index.ts` 갱신. `pnpm dev` 재기동 후 `/studio`에 "News Post" 항목 확인.
2. **HEIC 업로드 실측**: 테스트 문서에 iPhone 원본 `.heic` 사진을 coverImage에 드래그. 성공하면 매뉴얼에 "그대로 업로드 가능", 실패하면 "iPhone 설정→카메라→포맷→호환성 우선(JPEG)" 안내 추가. 테스트 문서는 발행하지 말고 draft에서 바로 삭제.
3. **무비용 백업 자동화 — v2 재설계**(§11-①~③ 상세는 §11 참조): 오늘 두 워크플로우 파일을 함께 커밋한다.

   **3-A. 읽기 전용 API 토큰 발급**: `sanity.io/manage` → 프로젝트 → API → Tokens → Add API token → Name `github-actions-backup`, Permissions **Viewer**(export는 읽기만 필요) → 토큰 즉시 복사.

   **3-B. GitHub 저장소 시크릿/변수 등록**: `github.com/leanupkr/xapika-dev` → Settings → Secrets and variables → Actions:
   - Secret `SANITY_AUTH_TOKEN` = 위 토큰
   - Variable `SANITY_PROJECT_ID` = Day 1 Project ID

   **3-C. 일간 워크플로우(자동, 문서만)**:
   ```yaml
   # .github/workflows/sanity-backup-daily.yml
   name: Sanity dataset backup (daily, docs only)

   on:
     schedule:
       - cron: "0 18 * * *" # 매일 UTC 18:00 = KST 익일 03:00
     workflow_dispatch: {}

   jobs:
     export:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: pnpm/action-setup@v4
           with: { version: 10 }
         - uses: actions/setup-node@v4
           with: { node-version: 20, cache: pnpm }
         - run: pnpm install --frozen-lockfile

         - name: Export documents only (no assets)
           env:
             SANITY_AUTH_TOKEN: ${{ secrets.SANITY_AUTH_TOKEN }}
           run: |
             mkdir -p backups
             npx sanity datasets export production \
               "backups/production-docs-$(date +%Y-%m-%d).tar.gz" \
               -p "${{ vars.SANITY_PROJECT_ID }}" \
               --no-assets

         - uses: actions/upload-artifact@v4
           with:
             name: sanity-backup-daily-${{ github.run_id }}
             path: backups/*.tar.gz
             retention-days: 14
             if-no-files-found: error
   ```

   **3-D. 전량(에셋 포함) 워크플로우 — 자동 스케줄 없음, 수동 트리거 전용(v2 핵심 재설계)**:
   ```yaml
   # .github/workflows/sanity-backup-full.yml
   name: Sanity dataset backup (full, manual trigger only)

   on:
     workflow_dispatch: {}   # 스케줄(on.schedule) 절대 추가하지 말 것 — 아래 §11 계산 참조

   jobs:
     export:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: pnpm/action-setup@v4
           with: { version: 10 }
         - uses: actions/setup-node@v4
           with: { node-version: 20, cache: pnpm }
         - run: pnpm install --frozen-lockfile

         - name: Export full dataset (with assets)
           env:
             SANITY_AUTH_TOKEN: ${{ secrets.SANITY_AUTH_TOKEN }}
           run: |
             mkdir -p backups
             npx sanity datasets export production \
               "backups/production-full-$(date +%Y-%m-%d).tar.gz" \
               -p "${{ vars.SANITY_PROJECT_ID }}"

         - uses: actions/upload-artifact@v4
           with:
             name: sanity-backup-full-${{ github.run_id }}
             path: backups/*.tar.gz
             retention-days: 7   # 짧게 — 실행 즉시 §11 지침대로 로컬/외부에 내려받아 보관할 것
             if-no-files-found: error
   ```

   > **명령어 정정(v2 신규 발견, §1 변경표 12행)**: 공식 CLI 레퍼런스(`sanity.io/docs/cli-reference/cli-datasets`)의 정식 명령은 `sanity datasets export`(복수형)다. v1과 개정B 모두 `sanity dataset export`(단수)로 썼다 — 실행 시점에 오류가 나면 `npx sanity datasets --help`로 정확한 하위 명령을 즉시 재확인할 것(CLI 버전업으로 바뀔 수 있음을 대비한 이중 방어).

   **3-E. GitHub Actions 지출 상한**: `github.com/settings/billing`(leanupkr 계정, 사이트 소스가 있는 그 계정) → **Spending limit → $0으로 확인/설정**. 이러면 어떤 이유로든 저장 한도를 넘겨도 "조용한 실패"로 끝나지 실제 청구로 번지지 않는다(§11-④).

   **3-F. 실행 확인**: 두 워크플로우 파일 커밋 → Actions 탭에서 각각 "Run workflow"(수동 실행) 1회 → `backups/*.tar.gz` 아티팩트가 실제로 생성되는지 확인. 일간 워크플로우는 다음날 자동 실행도 확인.

**완료 판정**: `/studio`에서 News Post 생성 가능 확인 + HEIC 결과 문서화 + 두 백업 워크플로우 커밋 및 수동 1회 실행 성공 + GitHub 지출 상한 $0 확인.

### Day 4-5 — 데이터 레이어 완성 + `/news` 목록 페이지

§8.4~8.5(client/queries/types/fetch/image/SanityImage), §8.9(CategoryChip), §8.8(`/news`)를 그대로 반영.

**완료 판정**: `pnpm dev` → `/news` 접속 시 빈 상태 확인 → 테스트 글 1건 발행해 카드 렌더 확인 → 다시 삭제(draft로 되돌리거나 Delete).

### Day 6-7 — `/news/[slug]` 상세 + 한국어 토글 + RSS

§8.10(상세 페이지 + `NewsLangToggle`)과 §8.11(RSS)을 그대로 반영. 이 두 파일은 이미 완결된 코드로 §8에 존재하므로, 개정B 시점에 우려됐던 "설계 결정에 반나절 소요"는 v2에서는 발생하지 않는다 — 타이핑과 스타일 미세조정만 남는다.

**완료 판정**: 발행한 테스트 글의 `/news/[slug]`가 렌더되고, 존재하지 않는 slug에서 `notFound()` 정상 동작(404 확인). `titleKo`를 채운 테스트 글에서 `?lang=ko`가 실제로 한국어 콘텐츠를 보여주고, 채우지 않은 글에서는 토글 자체가 노출되지 않음을 확인. `/news/rss.xml`이 유효한 XML로 응답하는지 확인(브라우저에서 직접 열어 파싱 에러 없는지).

### Day 8 — 홈 프리뷰 + nav/sitemap/robots 반영

§8.13(nav, 59번째 줄), §8.14(sitemap, PL/KR alternates 포함), §8.15(robots), §8.16(홈)을 반영.

**완료 판정**: `pnpm build` 통과, `/`에 뉴스 섹션(빈 상태면 미표시) 확인, `/sitemap.xml` 빌드 시 에러 없음(Sanity가 비어 있어도 `newsEntries=[]`로 정상 처리), nav 5곳(Header/MobileMenu/Footer/MegaDropdown + 확인 가능하면 SiteJsonLd) 전부에 News가 보이는지 육안 확인.

### Day 9 — Webhook 재검증 + 등록 + 지연시간 실측

1. `openssl rand -hex 32`로 `SANITY_REVALIDATE_SECRET` 생성 → `.env.local`(로컬)과 Vercel(Production+Preview) 양쪽에 등록.
2. §8.12의 `route.ts` 반영.
3. Sanity 웹훅 등록(`sanity.io/manage` → API → Webhooks → Create webhook): Dataset `production`, URL `https://xapika.pl/api/revalidate`, Trigger Create/Update/Delete 전부 ✅, **Include drafts는 반드시 OFF**, HTTP method POST, Filter `_type == "newsPost"`, Projection `{"_type": _type, "slug": slug}`, Secret = 위 시크릿 값, Status Enabled.
4. **발행→반영 지연시간 실측**: 테스트 글 발행 → 시크릿 창(+가능하면 다른 네트워크)에서 `/news` 새로고침해 걸린 시간을 스톱워치로 측정. Vercel Deployments → Functions 로그에서 `/api/revalidate`가 200으로 찍히는지 확인.

**완료 판정**: 실측 지연시간이 초 단위 숫자로 문서화됨(예: "발행 후 평균 N초 이내 반영"). 이 숫자를 Day 13 매뉴얼에 그대로 박는다.

### Day 10 — 이주연 주임 실제 참여

1. §6.1대로 공용 계정 안내: `info@xapika.pl`의 Google 계정 비밀번호(또는 2단계 인증 앱 접근)를 안전한 채널로 전달하고 `https://xapika.pl/studio` 딥링크만 알려준다. **별도 초대 절차 없음** — 같은 계정으로 직접 로그인한다.
2. §6.2-규칙2·§6.4 경고 문구 전달: "`/studio` 화면만 사용하고 `sanity.io/manage`·`vercel.com` 같은 다른 화면은 절대 열지 마세요."
3. **본인이 직접 손으로** 첫 실제 기사 발행(사진 포함).
4. 일부러 오타 내고 수정하는 과정 실습.
5. 실제 스마트폰 브라우저로 `/studio` 접속해 "급하게 보도자료 링크만 올리는" 시나리오 실습.

**⚠️ 공용 계정 경고 교육(필수)**: "이 계정 비밀번호는 Sanity뿐 아니라 사이트 배포(Vercel)·도메인·이메일 발송까지 관리합니다. `/studio` 화면 밖으로는 나가지 마세요. 비밀번호를 다른 사람과 공유하거나 메모에 남기지 마세요." §6.4의 Publish 경고 문구도 함께 전달.

**완료 판정**: 이주연 주임이 발행한 실제 글 1건이 `/news`에 노출됨 + 모바일 사용성 결과 문서화.

### Day 11 — QA 루프

1. `/mobile-optimization`(Chrome MCP, 375px) — `/news`, `/news/[slug]`, `/studio` 3곳.
2. `vercel-react-best-practices` 64개 규칙 CRITICAL/HIGH — 특히 `async-parallel`(홈 `NewsPreview` fetch), `bundle-barrel-imports`(직접 import 확인됨), `rerender-no-inline-components`.
3. `web-design-guidelines` 접근성 — alt(스키마 레벨 조건부 필수), 터치 타겟 44px(CategoryChip/NewsLangToggle에 이미 반영), 대비.

**완료 판정**: CRITICAL/HIGH 위반 0건.

### Day 12 — `/privacy` 실콘텐츠 + 삭제/복구 실측

1. `/privacy` GDPR 실콘텐츠 작성(수집 항목, 목적, Resend/Sanity 등 제3자 처리자 명시).
2. `pnpm lint` / `pnpm typecheck` 통과 확인.
3. **삭제/복구 절차 실측**: 더미 Sanity 프로젝트를 하나 만들어 Project Administrator 권한으로 실제 Delete project 버튼을 눌러보고 확인 절차 강도 실측. `production`에서 진짜 테스트 문서 하나를 삭제한 뒤 History 패널에서 3일 이내 복원 실제 동작 확인. 스크린샷을 `docs/NEWS_RECOVERY_PROCEDURE.md`용으로 저장.

**완료 판정**: `pnpm lint`/`pnpm typecheck` 통과, `/privacy` 완성, 삭제 확인 절차 강도가 스크린샷과 함께 문서화됨.

### Day 13 — 매뉴얼 5종 + 계정 문서 갱신

| 문서 | 핵심 내용 |
|---|---|
| `docs/NEWS_CMS_GUIDE.md` | 영문 정본. 로그인/작성/사진업로드/발행/수정삭제/외부기사 스크랩/한국어 토글/신규 담당자 초대(Project Administrator로만)/트러블슈팅. Day 9 실측 지연시간 포함 |
| `docs/뉴스_CMS_요약_국문.md` | 국문 1~2p 치트시트 |
| `docs/NEWS_UI_KOREAN_GLOSSARY.md` | Studio 영문 필드 라벨 ↔ 한국어 뜻 스크린샷 대조표 |
| `docs/NEWS_RECOVERY_PROCEDURE.md` | Day 12 삭제 실측 스크린샷 + 복구 절차 + "발행=전 세계 공개" 교육 문단 |
| `docs/NEWS_BACKUP.md`(신규) | 일간/전량 두 워크플로우의 역할 차이, 전량 백업 실행 후 반드시 로컬/외부로 내려받을 것, `sanity datasets import`로 복구하는 법 |
| `HARIKA_ACCOUNT_SETUP.md` | Sanity를 4번째 서비스로 등재. Growth 전환 트리거는 좌석 수가 아니라 "Editor 역할 필요성"임을 명시 + §6.3 안내 문구 삽입 |

### Day 14 — 핸드오프 + 최종 검증 + 배포

1. 최종 빌드 검증: `pnpm typecheck && pnpm lint && pnpm build`.
2. **핸드오프 세션**(화면공유, 이주연 본인 손으로 진행).
3. Vercel 비용 안전장치 재확인: 좌석 자동청구 토글 OFF·Spend Management $10 상한이 살아있는지 캡처.
4. GitHub 지출 상한 $0(Day 3-E) 재확인.
5. 분기별 자가점검 절차 인계(§11-⑫).
6. GitHub 저장소 소유권 갭은 이번 건과 별도 트랙으로 협의 착수만 걸어둔다.
7. 프로덕션 배포: `git push origin main` → Vercel 자동 배포 → `/news`, `/news/[slug]`, `/studio`(또는 Day 1-F 폴백 링크) 최종 확인.

**완료 판정**: `tsc --noEmit`/`eslint`/`next build` 전부 에러 0건 + 프로덕션 배포 완료 + 이주연 주임이 발행한 실제 글이 `xapika.pl/news`에서 보임 + Vercel·GitHub 비용 안전장치 스크린샷 확보.

> **일정에 대한 솔직한 재확인(감사2 반영)**: Day 6-7이 §8에서 이미 코드가 확정돼 있어 리스크는 낮아졌지만, 실제 타이핑·로컬 검증·스타일 미세조정에 반나절 초과가 여전히 있을 수 있다. 이 초과분이 Day 14의 버퍼를 흡수하면 총 소요가 **14~15일**로 늘어날 수 있음을 착수 전 client에게 미리 고지한다(§13(b)).

---

## 11. 무비용 보장 체크리스트

Day 1·3에 전부 설정하면 3년 누적 추가 비용의 현실적 상한이 $0으로 수렴한다.

> **①·②·⑨는 이미 완료됐다(2026-08-19, 브라우저로 직접 설정/확인)** — 정식 착수(Day 1) 이전이지만 Vercel·GitHub 계정 자체는 Sanity 착수 여부와 무관하게 이미 존재하므로 선행 적용했다. 아래 표는 그 실측값을 반영한 최신 상태다.

| # | 항목 | 설정 위치 | 권장값 | 근거 |
|---|---|---|---|---|
| ① | 좌석 자동청구 토글 On → Off — **완료(2026-08-19)** | Vercel → 팀 `Xapika` → Settings → Members | Off("Off = Require Owner approval to add each team member") | G1은 우연히 미발생했을 뿐, 구조적 방어가 아니었음 — 지금 토글로 구조적으로 차단 |
| ② | Spend Management ON + 예산 상한 — **완료(2026-08-19)** | Vercel → Settings → Billing → Spend Management | 예산 **$200 → $10/월**로 변경 완료, 알림 전부 ON, **Pause Production Deployments: Off**(의도적) | 실사용 $0.02~0.2/월 대비 여유를 주면서 이상현상 시 알림. Off인 이유: 상업용 기업 사이트가 다운되는 손해가 소액 초과 청구보다 크다는 판단 — 알림으로 사람이 대응하는 쪽을 택함(팀명 확인 모달까지 통과해 저장 확인함). 좌석/애드온은 이 예산에 미포함 — ①과 반드시 병행 |
| ③ | `next.config.ts`에 Sanity remotePatterns를 **추가하지 않음**(의도적 부작위) | `next.config.ts` | 변경 없음 | next/image 미경유 원칙(§1 변경표 8행)을 지키는 가장 확실한 방법 — 애초에 Vercel Image Optimization이 관여할 경로 자체가 없음 |
| ④ | Sanity 이미지 URL에 명시적 리사이즈 파라미터 | `src/sanity/image.ts` | `urlFor(image).width(...).auto('format').url()` | origin(Sanity) fetch 시 축소된 이미지만 가져와 대역폭 이중 절감 |
| ⑤ | Sanity 가입 시 카드 등록 여부 확인, 요구 없으면 미등록 유지 | Day 1, sanity.io 가입 플로우 | 카드 미등록 유지(요구돼도 §4 이유로 안전) | Free는 카드 유무와 무관하게 overage 요금표 자체가 없음 |
| ⑥ | Vercel Blob 미사용 상태 유지 | 배포 후 Vercel → Storage | 스토어 생성 0개 유지 | 이 라인업에서 유일하게 "한도 초과 시 자동 실청구"가 되는 스토리지(하드 캡 없음) — 향후 회귀 방지용 확인 절차 |
| ⑦ | Growth 전환은 "결정"으로만 발생 | `HARIKA_ACCOUNT_SETUP.md` | A(Free+Administrator)/B(Growth) 서면 선택 절차 문서화 | 진짜 트리거는 좌석 수가 아니라 역할 종류(§6.3) — 암묵적 업그레이드 방지 |
| ⑧ | **[v2 신규] 일간 백업은 문서만, 전량 백업은 수동 트리거 전용** | `.github/workflows/sanity-backup-{daily,full}.yml` | 위 §10 Day 3 코드 그대로 | 감사1이 지적한 "매일+에셋포함+90일보존" 설계는 재계산 결과 낙관 시나리오조차 약 6주 내 GitHub 무료 저장한도(500MB) 초과 가능 — 아래 계산 참조 |
| ⑨ | GitHub Actions(leanupkr 계정) 지출 상한 — **실측 결과 이미 완료돼 있었음(2026-08-19 확인)** | `github.com/settings/billing`(leanupkr) | Actions/Codespaces/Packages/Git LFS/All AI Credit SKUs **전부 `$0 budget` + `Stop usage: Yes`** | 별도 조치 없이 이미 완벽하게 설정돼 있었음을 실측으로 확인 — 추가 조치 불필요. 백업 워크플로우가 만드는 세 번째 과금 표면(Vercel ①②·Sanity ⑤에 이어)까지 방어선이 이미 닫혀 있었다(감사1 발견2 우려 해소) |
| ⑩ | **[v2 신규] 전량 백업 실행 후 즉시 외부 보관** | Day 3 실행 시 + 매뉴얼(`NEWS_BACKUP.md`) | 아티팩트를 로컬 또는 `info@xapika.pl` 소유 외부 저장소(Drive 등)에 다운로드, GitHub 7일 보존에 의존하지 않음 | 전량 백업의 `retention-days: 7`은 "일단 며칠은 안전"이지 장기 저장소가 아니다 |
| ⑪ | **[v2 신규] 백업 워크플로우 실패 알림 확인** | GitHub → leanupkr 계정 → Notifications 설정 | 실패한 워크플로우 알림 ON(GitHub 기본값이 보통 ON이지만 Day 3에 직접 확인) | "몇 달째 백업이 조용히 비어 있었다"는 사고를 방지 |
| ⑫ | 분기별 자가점검 | v1부터 이어지는 절차, 이번에 3개 항목으로 구체화 | Sanity `sanity.io/manage`→Usage(Documents/Assets/Bandwidth) + Vercel Billing(Included Credit 소진율) + **GitHub leanupkr Settings→Billing(Actions storage 사용량)** + `sanity.io/pricing` 정책 변동 확인 | 기존 절차에 이번 감사로 드러난 GitHub Actions 라인을 추가 |

### 왜 ⑧이 "재설계"인가 — 감사1 제안치의 재계산

감사1은 원안(매일+에셋포함+90일보존)의 위험을 정확히 지적하고 대안(주1회+7~14일보존)을 제시했다. v2는 이 대안을 그대로 적용하기 전에 실제 숫자로 재계산했다:

- 무비용 감사(확인2)가 추정한 월간 신규 이미지 업로드량은 낙관 180MB/월, 비관 800MB/월.
- 주1회 전량 스냅샷을 14일(=약 2주기=2개 스냅샷) 보존한다고 하면, 스냅샷 1개의 크기는 "그 시점까지의 누적 자산 총량"에 근접한다(증분이 아니라 매번 전체 재수출이므로).
- GitHub Actions 저장 한도(비공개 저장소 기준 Free 500MB)를 2개 스냅샷의 합이 넘는 시점은, 스냅샷당 250MB를 넘는 시점 — **낙관 시나리오(월 180MB 누적)로도 약 1.4개월(≈6주)** 만에 도달한다.
- 즉 "주1회+14일 보존"만으로는 여전히 충분하지 않다. **그래서 v2는 스케줄 자동화 자체를 없애고 수동 트리거로 전환했다** — 자동으로 반복 누적되는 구조가 아니면 이 저장량 폭발 수식 자체가 성립하지 않는다. 일간 자동 백업은 `--no-assets`로 문서만 다뤄 용량이 애초에 무시할 수준(수백 KB)이라 3일 히스토리 문제(가장 흔한 사고인 "글 1건 실수 삭제")는 여전히 매일 자동으로 방어된다. 진짜 재난(데이터셋/프로젝트 전체 삭제) 복구용 에셋 포함 백업은 Day 12의 삭제 리허설 직전이나 분기별 자가점검 시점에 **사람이 의도적으로 버튼을 눌러** 실행하고 즉시 외부로 내려받는 것으로 대체한다 — 자동 반복이 없으므로 저장량이 무한히 쌓이는 경로 자체가 없다.

### 3년 누적 비용 시나리오(재확인)

| 시나리오 | 조건 | 3년 추가 비용 |
|---|---|---|
| 낙관 | 체크리스트 ①~⑫ 전부 적용, 콘텐츠 볼륨 계획대로 | **$0** |
| 현실 | ①·②·⑧·⑨만 적용(가장 확실한 네 방어), 나머지 방치 | **$0** — Vercel $10 상한과 GitHub $0 상한이 각각 하드캡, Sanity는 카드 유무 무관 구조적 안전 |
| 비관(전부 방치 시에만) | 좌석 auto-add 방치+매칭 발생, 백업 워크플로우를 v1 원안대로 되돌려 매일+에셋+90일보존으로 재설정, Growth 결정이 프로세스 없이 암묵적으로 발생 | 대략 $800~$2,500(감사1 원 계산과 동일 규모) — 단, 이 시나리오는 **①·⑧·⑨·⑦ 네 항목을 전부 원복해야만** 발생하는 "설정을 적극적으로 되돌린" 경우이며, v2 기본 설정을 유지하는 한 발생하지 않는다 |

---

## 12. 리스크 등록부

| 리스크 | 확률 | 영향 | 완화책 |
|---|---|---|---|
| 무료 플랜 non-owner 멤버 Google 로그인 불가 | 낮음(G3로 대부분 해소) | 높음(설계 전제 붕괴) | Day 1 리허설로 최종 확인, 실패 시 이메일 로그인 폴백(이미 확정) |
| `useCdn:true`+태그 병용으로 재검증 지연 | 해당 없음(원안 그대로면 발생했겠지만 `useCdn:false`로 이미 확정) | — | §8.4 반영 완료 |
| Sanity Studio가 Turbopack 기본 빌드와 미호환 | 낮음~중 | 높음(전체 계획 재검토) | Day 1-F/Day 2 스모크테스트, 실패 시 웹팩→`sanity deploy` 순차 폴백(확정) |
| HEIC 업로드 미지원 | 중 | 낮음(매뉴얼 워크어라운드로 흡수) | Day 3 실측, 실패 시 명시적 안내 문구로 전환 |
| 비-admin 에디터 다수 필요 시(폴란드 본사 합류) Growth 전환 압박 | 중(예고된 시나리오) | 중(서비스 중단 아님, 비용) | §6.3 A/B 서면 선택 절차로 암묵적 전환 차단 |
| **[하향]** Vercel 좌석 자동청구 | 낮음(3개월 무발생 실측, 단 구조적 방어 아니었음) | 낮음(①로 토글 자체 차단 완료) | Day 1 토글 OFF(§11①) — 등급 하향 근거: G1 실측 + 우연이었음을 인지하고 지금 구조적으로 차단 |
| **[신규]** GitHub Actions 백업 워크플로우 저장용량 폭발 | 원안대로면 확정 발생(6주~1년 내), **v2 재설계로 해소** | 중(백업 무력화 또는 실제 청구) | §11⑧ 재설계(자동 스케줄 제거) + §11⑨(지출 상한 $0) — 반드시 함께 적용 |
| `generateMetadata`의 `getRequestOrigin()`(→`headers()`) 호출로 News 페이지가 사실상 항상 dynamic | 확정(기존 관용구) | 낮음(설계 의도와 일치) | Sanity fetch의 Data Cache 레이어에서 실제 캐싱이 일어난다는 점을 매뉴얼/코드 주석에 명시(§5, §8.10에 이미 반영) |
| GitHub 저장소 소유권 갭(`leanupkr/xapika-dev`) | 확정(이미 존재) | 중(향후 스키마 변경 시 leanup 의존 지속) | 별도 협의 트랙(§15) |
| Resend 팀 소유권 문서상 불확실 | 낮음 | 낮음(News와 직접 무관) | 별도 트랙 재확인 권장 |
| Sanity 벤더 장애/무료티어 정책 변경 | 낮음 | 중(콘텐츠 편집 일시 중단, 캐시된 페이지는 정상 서빙) | `revalidate=3600` 안전망 + §11⑫ 분기별 자가점검 |
| 담당자 실수 삭제 | 중(3년 운영 중 필연) | 중 | Day 12 복구 절차 실측 + §11⑧ 일간 문서 백업 |
| Studio UI가 전부 영어 | 확정 | 중(초기 온보딩 마찰) | `NEWS_UI_KOREAN_GLOSSARY.md`(Day 13) |

---

## 13. 클라이언트 커뮤니케이션

### (a) 작업 범위(scope) 문구 초안

> **본 건(News/Press 게시판)은 원 계약(XAPIKAKR202604A, 2026-04-15 체결, ₩5,300,000, 납품기한 2026.05.31)의 변경 요구가 아니라 예정된 별도 용역입니다.**
> PRD §3.2 Out-of-Scope에 "블로그/뉴스룸 시스템"이 명시적으로 제외되어 있고, §14.3 로드맵에 v1.1(2026 Q3) 뉴스룸/CMS 도입이 이미 예고되어 있습니다. 이번 요청은 계약서 제2조 5항("승인된 설계 범위를 초과하는 변경 요구는 협의를 통해 추가 비용 및 납기를 별도로 정한다") 및 제3조 3항("당초 합의 범위를 현저히 초과하는 경우 별도의 용역 범위 및 비용을 정한다")에 따라 별도 협의 대상이며, 로드맵상 이미 예견됐던 정상적인 확장 단계입니다.
>
> **포함**: News/Press 게시판(목록+상세, 기존 디자인시스템 100% 준수) · Sanity CMS 셋업 및 client 계정(`info@xapika.pl`) 소유로 처음부터 생성 · 에디터 초대/권한설정 · 필드(제목/카테고리/날짜/커버이미지/리치텍스트본문/갤러리/외부기사링크/발행상태/고정노출/선택적 한국어) · 이미지 자동 리사이즈·포맷변환·hotspot crop · RSS 피드 · 영문 정본+국문 요약 매뉴얼 · 1회 실습형 교육 세션 · `/privacy` 페이지 GDPR 콘텐츠 보완(부수 작업) · 무비용 백업 자동화.
>
> **불포함(별도 협의)**: 댓글/소셜 인터랙션 · 뉴스레터 자동발송 · 사이트 전체 다국어 번역(영어 단일 유지, News만 선택적 한국어) · 자체 전문검색 · 승인 워크플로우(2단계 결재) · 무료 티어 초과 시 Sanity 유료 비용(client 부담, 단 §11에 따라 발생 가능성 극히 낮음) · GitHub 저장소 소유권 이전(별도 트랙) · 3개월 이후 스키마 변경/신규 필드 추가는 별도 유지보수 계약.

### (b) 김영근 대리 견적 근거 요약

- **일정 리스크 우선 고지**: "2주"는 2026-08-06 착수 기준 약속이었다. 본 계획서의 Day 1~14는 착수 승인을 새로 받는 날부터의 신규 14일이며, 소급 충족 일정이 아니다. **v2 추가 고지**: Day 6-7 여유에 따라 14~15일도 정상 범위임을 함께 전달할 것(§10 Day14 말미).
- **공수 산정**: 약 6~7 PD(스키마 설계 0.5 · Sanity 셋업+Org+Studio 임베드 1.0 · 목록/상세/RSS 프론트 1.5~2.0 · 이미지 파이프라인 검증 0.5 · nav/sitemap/SEO 반영 0.5 · 접근제어+백업자동화 0.7 · QA 0.5 · 매뉴얼 0.5 · 핸드오프 0.5). 단가는 leanup 내부 표준 요율 별도 산정.
- **근거**: PRD가 이미 "월 2회 이상 요청 시 Sanity 도입"을 예견했고(§14.3), 현재 월 2~4건 요청 발생 중 — 정확히 그 트리거가 실현된 상황.

### (c) 이주연 주임 회신 확인 질문 목록

> 쟁점 3건(기사 범위/언어/계정)은 이미 확정되어 제외합니다.

1. 예상 게시 빈도는? (월 1~2건 / 주 1건 등 — 무료 티어 용량 산정 참고)
2. 기존 보도자료/기사 초기 이관 물량은 대략 몇 건?
3. 카테고리 4종(Company News / Project Update / Press Release / Media Coverage) 이대로 괜찮은지, 조정 필요한지?
4. 사진은 어떤 형태로 받을 예정인지?(본인 촬영 직접 업로드 / 본사 파일 전달 등)
5. 폴란드 본사 인원도 조만간 이 시스템을 쓸 가능성이 있는지?(있다면 몇 명 정도 — §6.3 판단에 필요)
6. (참고) `info@xapika.pl` 계정은 저희 쪽에서 이미 실존/활성 확인 완료 — 별도 확인 불요. 다만 이 계정 외 이미 쓰시는 개인/업무용 Google 계정이 있다면 그걸로 개별 초대받으시길 권함(계정 공유 없이 본인 계정 로그인).

---

## 14. 인수인계 산출물 목록

- `docs/NEWS_CMS_GUIDE.md` — 영문 정본 매뉴얼
- `docs/뉴스_CMS_요약_국문.md` — 국문 치트시트
- `docs/NEWS_UI_KOREAN_GLOSSARY.md` — Studio 필드 라벨 대조표
- `docs/NEWS_RECOVERY_PROCEDURE.md` — 삭제/복구 절차, 스크린샷 포함
- `docs/NEWS_BACKUP.md` — 백업 워크플로우 2종 설명 + 복구 사용법(신규)
- `HARIKA_ACCOUNT_SETUP.md` 갱신 — Sanity 4번째 서비스 등재, Growth 전환 프로세스 명시
- Sanity 프로젝트(`info@xapika.pl` Org Owner) — 이주연 주임 Project Administrator 초대 완료 상태로 인계
- GitHub Actions 백업 워크플로우 2종 — 정상 동작 확인 스크린샷과 함께 인계
- 1회 실습형 핸드오프 세션(화면공유, 이주연 본인 손으로 실제 발행) — 가능하면 녹화본 첨부
- Vercel·GitHub 비용 안전장치 설정 스크린샷 일체(§11)

---

## 15. 남은 불확실성 — 사용자(오영준)가 직접 확인/결정해야 할 사항

v1 §12의 10개 항목 중 §1에서 해소를 확정한 4개(non-owner Google 로그인 가능 여부/Growth 가격/Free 한도/`info@xapika.pl` 실존)는 제외했다. 아래는 여전히 실측/결정이 필요한 항목이다.

1. Sanity Studio가 이 프로젝트의 정확한 스택(Next 16.2.3+Turbopack 기본 빌드+React 19.2.4)에서 실제로 안정 부팅하는지 — Day 2 스모크테스트로 최종 확정(폴백 경로는 이미 확정됨).
2. `next-sanity`의 `next:{tags}` 패스스루가 이 Next 16.2.3에서 문서대로 정확히 동작하는지 — Day 4-5 스모크테스트로 확정.
3. Sanity 업로더의 HEIC 처리 여부 — Day 3 실측 필요.
4. `sanity datasets export`(복수형) 명령의 정확한 최신 플래그 — Day 3 실행 시 `npx sanity datasets --help`로 1차 확인, 다를 경우 워크플로우 파일 즉시 보정.
5. Resend 팀의 실제 소유자가 client 계정인지 — News와 직접 무관하나 계정 구조 일관성 점검 차원에서 별도 트랙 재확인 권장.
6. GitHub 저장소(`leanupkr/xapika-dev`) 소유권 갭 해소 방향 — 이전 vs. 유지보수 계약, client와 별도 협의.
7. 원 계약(XAPIKAKR202604A) 기준 이번 건의 정확한 추가 견적 금액 — 본 문서는 PD 단위 산정만 제공, KRW 환산은 leanup 내부 요율 적용 후 확정.
8. Sanity 프로젝트/데이터셋 삭제 시 확인 절차(프로젝트명 재입력 등)의 정확한 강도 — Day 12 더미 프로젝트 실측으로 확정.

> **정리(2026-08-19)**: v2 원안 항목 "초대 수락 화면이 non-owner 멤버에게도 정확히 동일하게 'Continue with Google'을 제공하는지"는 삭제했다 — 공용 1계정 결정(§6)으로 별도 멤버 초대 자체가 없어져, 이 검증이 더 이상 의미가 없다.

---

## 부록 A. Next.js 16 캐시 API 실문서 검증(v1 보존, 무효화 없음)

§8.12의 재검증 코드는 착수 첫 주에 그대로 쓰이므로, `node_modules/next/dist/docs/`의 실제 문서를 열어 시그니처를 대조한 결과다.

### A-1. `revalidateTag(tag, profile)` — 2번째 인자 필수

출처: `01-app/03-api-reference/04-functions/revalidateTag.md`

```ts
revalidateTag(tag: string, profile: string | { expire?: number }): void;
```

단일 인자 형태는 deprecated(문서 원문: *"The single-argument form is deprecated... this behavior may be removed in a future version."*).

### A-2. `"max"`는 즉시 반영이 아니다

> With `profile="max"`: 태그가 stale로 표시되고, 다음 방문 시 stale-while-revalidate로 동작한다 — **구내용이 먼저 보이고 백그라운드에서 갱신**된다.

이주연 주임이 Publish 직후 새로고침하면 이전 내용이 보이고 한 번 더 새로고침해야 새 글이 보일 수 있다. §8.12는 이 문제를 `{ expire: 0 }`으로 회피했다(문서가 `profile` 자리에 `{expire?: number}` 객체를 명시적으로 허용).

### A-3. `updateTag`는 이 구조에서 사용 불가

출처: `01-app/03-api-reference/04-functions/updateTag.md`

> `updateTag`는 Server Actions에서만 호출 가능하다. Route Handlers에서는 사용할 수 없다.

Sanity webhook은 Route Handler로 수신하므로 `updateTag`는 애초에 선택지가 아니다. `revalidateTag`가 강제된 올바른 선택이다.

### A-4. Route Handler의 `revalidatePath` — 다음 방문 시 재검증

출처: `01-app/03-api-reference/04-functions/revalidatePath.md`

> Route Handlers에서는 경로가 재검증 대상으로 표시되고, **다음 방문 시** 재검증이 수행된다.

§8.12의 다중 `revalidatePath` 설계가 태그 기반 SWR의 stale 노출을 실질적으로 보완하는 근거다.

### A-5. CDN 레이어는 별도 확인 필요(참고, 이 프로젝트엔 낮은 관련성)

출처: `01-app/02-guides/cdn-caching.md`. 서드파티 CDN을 앞단에 둔 구성에 해당하는 경고이며, 이 프로젝트는 Vercel 네이티브 호스팅이라 해당 가능성은 낮다. Day 9 실측 시 "다른 네트워크"에서 재확인하는 것으로 충분히 방어된다.

---

## 부록 B. 브라우저 실측 기록 (2026-08-18)

### B-1. 계정·인프라 (v1 F1~F4, 재확인됨)

| # | 확인 항목 | 실측 결과 |
|---|---|---|
| F1 | `info@xapika.pl` Google 계정 존재 | 실존·활성, 표시명 "Xapika Engineering" |
| F1-b | Workspace 테넌트 여부 | 아니오 — 일반 개인 Google 계정. 관리 콘솔로 직원 계정 발급 불가 |
| F2 | 연결된 앱 | GoDaddy/Resend/Vercel 3개가 이미 "Sign in with Google"로 연결 — Sanity가 4번째 |
| F3 | Vercel 팀 상태 | 팀 `Xapika`, Pro 활성, `info@xapika.pl` 소유, Team Members 1명(`admin@leanup.kr`은 미포함) |
| F3-b | Git 소스 소유권 | `leanupkr/xapika-dev` = 에이전시 GitHub 소유(호스팅-소스 소유권 갭 존재, §15-6) |
| F3-c | 좌석 자동 과금 토글 | ON(G1로 3개월 무발생 확인, 그래도 §11①로 지금 끔) |
| F4 | Vercel Storage 라인업 | 생성된 스토어 0개. 네이티브 Global Config/Blob, 마켓플레이스 Neon/AWS/Upstash/Supabase/Redis. "Vercel Postgres"라는 자체 제품은 존재하지 않음 |

### B-2. 이번 개정에서 추가된 실측(G1~G4)

| # | 확인 항목 | 실측 결과 |
|---|---|---|
| G1 | Vercel 청구 실적 | 6·7·8월 3개월 연속 정확히 $20.00. 좌석 추가 과금 3개월간 미발생. Included Credit $0.02/$20.00 |
| G2 | Sanity 요금제 | Free $0 forever / **Growth $15/seat/월**(신규 확정) / Enterprise custom. Free: Seats 20, Roles 2종(Editor 없음), Datasets 2(public only), Documents 10K, Assets 100GB, Bandwidth 100GB/월, Review Changes 3일 |
| G3 | Sanity 로그인 방식 | sanity.io/login에 "Continue with Google" 최상단, GitHub/email/SSO 병행 |
| G4 | 계정·인프라 | F1~F4와 동일 결과 재확인(위 B-1) |

---

## 부록 C. v2 자체 재검증 기록(이번 작성 시점 신규)

앞선 6단계 검증(v1→확인1~3→개정A/B→감사1/2)을 종합해 v2를 쓰는 과정에서, npm registry와 Sanity 공식 CLI 문서를 직접 재대조해 **감사1·감사2도 발견하지 못했던 결함 2건**을 추가로 찾았다. 전부 §1 변경표(12~13행)와 본문(§7·§8.1·§10 Day3)에 반영 완료.

| # | 검증 대상 | 방법 | 결과 |
|---|---|---|---|
| C1 | `@sanity/image-url@2.1.1`의 실제 export 이름 | unpkg 배포본 `lib/index.d.ts` 직접 열람 | `createImageUrlBuilder` named export 실존 확인(default export는 deprecated 안내 포함) — 개정B 코드 그대로 유효, 감사2의 우려 해소 |
| C2 | `sanity@6.9.2`/`next-sanity@13.3.3`/`@sanity/image-url@2.1.1` 정확한 버전과 peerDependencies | npm registry API 직접 조회(`registry.npmjs.org/<pkg>/latest`, `/<pkg>/6.9.2`) | 세 버전 전부 정확. **`sanity`의 peerDependencies에 `styled-components: "^6.1.15"`가 있고 `dependencies`(자동설치)가 아님을 신규 발견** — §8.1에 4번째 패키지로 추가 |
| C3 | Sanity CLI의 dataset export 정식 명령어 | `sanity.io/docs/cli-reference/cli-datasets` 공식 문서 직접 재대조 | 정식 명령은 **`sanity datasets export`(복수형)**. v1·개정B 모두 `sanity dataset export`(단수)로 오기 — §10 Day3 워크플로우 코드에서 수정 반영 |
| C4 | 공식 Sanity 백업 가이드의 실제 cron 주기 | `sanity.io/guides/studio-backup-github-actions-artifacts` WebFetch | 공식 예시는 **월 2회**(`0 4 */16 * *`, 매월 1일·17일) 스케줄 — v1/개정B의 "매일" 설계보다 훨씬 저빈도. 이 사실이 §11의 저장량 재계산(왜 "주1회"조차 부족한지)과 §10 Day3의 "전량 백업은 수동 트리거 전용" 재설계 근거를 뒷받침 |

이 4건은 전부 이번 v2 작성 과정에서 실시간으로 확인된 것이며, 착수 시점(Day 2~3)에 패키지/CLI 버전이 바뀌어 있을 가능성에 대비해 §10 Day 2·Day 3에 "실행 직전 재확인" 지침을 남겨두었다.
