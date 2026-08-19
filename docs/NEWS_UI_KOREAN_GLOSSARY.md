# Studio 화면 영-한 용어 대조표

Sanity Studio(`/studio`)는 국제 서비스라 영문 UI만 제공합니다. 이 표는
화면에 보이는 영문 라벨과 그 뜻을 그대로 대조한 것입니다 — 실제 화면
스크린샷은 추후 사용자가 직접 촬영해 각 항목 아래에 첨부할 예정입니다
(자리만 표시해 둠, `[screenshot: 항목명]`).

---

## 화면 공통 UI

| 영문 | 한국어 뜻 |
|---|---|
| News Post | 뉴스 게시물 (문서 종류 이름) |
| Create | 새로 만들기 |
| Publish | 발행 (전 세계 공개) |
| Unpublish | 발행 취소 (비공개로 전환) |
| Draft | 임시저장본 (미발행 상태) |
| Save | 저장 (자동 저장되므로 보통 직접 누를 일 없음) |
| Delete | 삭제 |
| History | 변경 이력 (되돌리기, 3일 제한) |
| Restore | (이력에서) 복원하기 |
| Members | 프로젝트 참여자 목록 |
| Invite | 초대하기 |
| Administrator | 관리자 권한 (이 프로젝트 한정) |

`[screenshot: 메인 목록 화면]`

---

## News Post 작성 화면 필드

| 영문 필드명 | 한국어 뜻 | 비고 |
|---|---|---|
| Article type | 글 종류 | Own article / External press coverage 중 선택 |
| Own article (written by us) | 자체 작성 글 | 우리가 직접 쓰는 기사 |
| External press coverage (link out) | 외부 언론 보도 (링크형) | 외부 기사 요약 + 원문 링크 |
| Title (English — required) | 제목(영어, 필수) | 항상 영어로 채워야 함 |
| URL slug | 웹주소 문자열 | 보통 자동 생성값 그대로 사용 |
| Generate | (slug) 자동 생성 버튼 | |
| Excerpt (English — required) | 요약(영어, 필수) | 카드/검색결과에 노출, 최대 240자 |
| Category | 분류 | 아래 표 참고 |
| Published date | 발행일 | 목록 정렬 기준 |
| Cover image | 대표 사진 | |
| Alt text | 대체 텍스트(사진 설명) | 사진 등록 시 필수, 시각장애인 스크린리더·검색엔진용 |
| Body (English) | 본문(영어) | 자체 작성 글에서만 표시·필수 |
| Gallery | 갤러리(추가 사진들) | 자체 작성 글에서만 표시 |
| External article URL | 외부 기사 원문 링크 | 외부 보도 글에서만 표시·필수 |
| Source name (e.g. Rynek Kolejowy) | 매체명(출처) | 외부 보도 글에서만 표시·필수 |
| Title (Korean — optional) | 제목(한국어, 선택) | 채우면 한국어 토글 노출 |
| Excerpt (Korean — optional) | 요약(한국어, 선택) | |
| Body (Korean — optional) | 본문(한국어, 선택) | 자체 작성 글에서만 표시 |
| Pin to top of list | 목록 맨 위 고정 | Featured 기능 |
| SEO title override | 검색엔진 노출 제목(직접 지정) | 거의 안 씀, 비워두면 Title 사용 |
| SEO description override | 검색엔진 노출 설명(직접 지정) | 거의 안 씀, 비워두면 Excerpt 사용 |

`[screenshot: 새 글 작성 화면 — 상단부]`
`[screenshot: 새 글 작성 화면 — Cover image / Alt text]`
`[screenshot: 새 글 작성 화면 — 하단부(Featured, SEO)]`

---

## Category(분류) 선택지

| 영문 | 한국어 뜻 |
|---|---|
| Company News | 회사 소식 |
| Project Update | 프로젝트 진행 소식 |
| Press Release | 보도자료 |
| Media Coverage | 언론 보도(외부 언론이 다룬 내용) |

---

## 위험 구역(Sanity.io/manage — 개발자 전용, `/studio`에는 없음)

혹시라도 이 화면들을 보게 되면 즉시 나가고 아무것도 클릭하지 마세요.
`/studio`에는 아래 버튼들이 원천적으로 존재하지 않습니다.

| 영문 | 한국어 뜻 |
|---|---|
| Delete project | 프로젝트(전체) 삭제 |
| Delete dataset | 데이터셋(전체 콘텐츠) 삭제 |
| Billing | 결제 |
| Plan / Upgrade to Growth | 요금제 / 유료 전환 |

`[screenshot: (참고용) sanity.io/manage 위험 구역 — 실제로는 접속하지 말 것]`
