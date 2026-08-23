# Studio 화면 영-한 용어 대조표

Sanity Studio(`/studio`)는 국제 서비스라 영문 UI만 제공합니다. 이 표는
화면에 보이는 영문 라벨과 그 뜻을 그대로 대조한 것입니다.

> **왜 "필드명(name)" 칸이 따로 있나요?**
> 화면에 보이는 영문 문구(라벨)는 나중에 더 친절하게 다듬어질 수 있습니다.
> 하지만 그 문구 뒤에 있는 "필드명"(코드 상의 고유 이름, 예: `title`,
> `excerpt`)은 바뀌지 않습니다. 만약 이 표의 영문 라벨과 실제 화면 문구가
> 조금 다르다면, 화면에서 비슷한 위치·비슷한 뜻의 칸을 찾으시거나 담당
> 개발자에게 "필드명 OOO가 안 보여요"라고 말씀하시면 바로 찾아드립니다.

---

## 화면 공통 UI

| 영문 | 한국어 뜻 |
|---|---|
| News Post | 뉴스 게시물 (문서 종류 이름) |
| Structure | 구조(메인 화면) — Studio를 열면 맨 처음 보이는 화면. 왼쪽에 News Post 같은 문서 종류 목록이 나옵니다. 그냥 지나쳐도 되는 화면 이름입니다 |
| Create | 새로 만들기 |
| Duplicate | 복제하기 — 지금 보는 글을 그대로 복사해 새 글로 만듭니다(제목까지 통째로 복사됨). 비슷한 글을 반복해서 쓸 때만 사용. `⋯`(더보기) 메뉴 안에 있습니다 |
| Publish | 발행 (누르는 즉시 전 세계에 공개) |
| Unpublish | 발행 취소 (사이트에서 숨기기. 글 자체는 남아있고 나중에 다시 Publish 가능) |
| Draft | 임시저장본 (아직 한 번도 발행하지 않았거나, 발행 후 다시 고치는 중인 상태) |
| Save | 저장 (Studio는 입력하는 동안 자동으로 저장되므로 이 버튼을 직접 누를 일은 거의 없습니다) |
| Review changes | 변경사항 검토 — 지금까지 무엇을 고쳤는지 하나하나 비교해서 보여주는 화면. 실수로 잘못 지우거나 붙여넣었는지 확인할 때 씁니다 |
| Discard changes | 변경사항 버리기 — **되돌릴 수 없음.** 이미 발행된 글을 고치던 중 방금 고친 내용을 취소하고, 마지막으로 Publish했던 상태로 되돌립니다 |
| Delete | 삭제 — **되돌릴 수 없음** (단, 3일 이내면 History에서 복원 가능) |
| History | 변경 이력 (되돌리기, 3일 제한) |
| Restore | (이력에서) 복원하기 |
| Releases | 릴리즈(예약 발행 묶음) — 여러 글을 묶어 나중에 한꺼번에 발행 예약하는 고급 기능. 화면 위쪽 달력 아이콘. **이 회사 운영에서는 사용하지 않는 기능입니다.** 실수로 눌러 화면을 봐도 아무 글도 바뀌지 않으니 그냥 뒤로 나오면 됩니다 |
| Members | 프로젝트 참여자 목록 |
| Invite | 초대하기 |
| Administrator | 관리자 권한 (이 프로젝트 한정) |

<!-- 여기에 스크린샷 첨부 -->
![](./img/studio-main-structure.png)

---

## News Post 작성 화면 필드 (전체 17개)

| 필드명(name) | 영문 라벨 (2026-08 기준) | 한국어 뜻 | 무엇을 넣나 | 필수? |
|---|---|---|---|---|
| `kind` | Article type | 글 종류 | 라디오 버튼. **Own article (written by us)**(자체 작성) 또는 **External press coverage (link out)**(외부 보도) 중 선택. 이 선택에 따라 아래 필드들이 나타나거나 숨겨짐 | 필수 (기본값이 "자체 작성"으로 미리 선택되어 있어 보통 신경 안 써도 됨) |
| `title` | Title (English — required) | 제목(영어) | 기사 제목. 항상 영어로 작성 (최대 120자) | 필수 |
| `slug` | URL slug | 웹주소 문자열 | 기사 페이지 주소에 쓰이는 영문 문자열. Title을 입력하면 자동으로 채워짐 — 손댈 필요 없음 (버튼 이름: **Generate**) | 필수이지만 자동 생성 |
| `excerpt` | Excerpt (English — required) | 요약(영어) | 목록 카드와 검색결과에 노출되는 1~3문장 요약 (최대 240자) | 필수 |
| `category` | Category | 분류 | 드롭다운에서 4가지 중 선택 — 아래 표 참고 | 필수 |
| `publishedAt` | Published date | 발행일 | 목록 정렬 기준이 되는 날짜. 새 글을 만들면 지금 시각으로 자동 채워지며, 필요하면 직접 바꿀 수 있음 | 필수 (자동 채워짐) |
| `coverImage` | Cover image | 대표 사진 | 목록 카드와 기사 상단에 쓰이는 사진 1장 | 필수는 아니지만 강력 권장 (없으면 카드가 밋밋함) |
| `coverImage.alt` | Alt text | 대체 텍스트(사진 설명) | 시각장애인용 화면읽기 프로그램과 검색엔진이 읽는 짧은 사진 설명 (예: "정비팀이 화물차량을 점검하는 모습") | **사진을 넣으면 필수** (사진 없으면 이 칸도 안 보임) |
| `body` | Body (English) | 본문(영어) | 자체 작성 글의 실제 기사 내용. 문단 사이에 사진도 끼워 넣을 수 있음 | **자체 작성(Own article) 글일 때만 보이고 필수.** 외부 보도 글에서는 아예 안 보임 |
| `gallery` | Gallery | 갤러리(추가 사진들) | 본문과 별도로 여러 장을 더 보여주고 싶을 때 | 자체 작성 글에서만 보임, 선택 사항 |
| `externalUrl` | External article URL | 외부 기사 원문 링크 | 그 언론사의 실제 기사 페이지 주소 (`http://` 또는 `https://`로 시작) | **외부 보도(External) 글일 때만 보이고 필수** |
| `externalSource` | Source name (e.g. Rynek Kolejowy) | 매체명(출처) | 어느 언론사·매체가 보도했는지 (예: Rynek Kolejowy) | **외부 보도 글일 때만 보이고 필수** |
| `titleKo` | Title (Korean — optional) | 제목(한국어) | 채우면 이 글에 한해 한국어 보기(EN/KO 전환)가 생김 | 선택 |
| `excerptKo` | Excerpt (Korean — optional) | 요약(한국어) | 위와 동일 목적, 요약문 | 선택 |
| `bodyKo` | Body (Korean — optional) | 본문(한국어) | 자체 작성 글에서만 보임. 본문을 한국어로도 쓰고 싶을 때만 | 선택 (제목·요약만 한국어로 채우고 본문은 영어만 둬도 됨) |
| `featured` | Pin to top of list | 목록 맨 위 고정 | 토글 스위치. 켜면 이 글이 뉴스 목록 맨 위에 고정 노출됨 | 선택, 기본값 꺼짐 (한 번에 하나만 켜두는 것을 권장) |
| `seoTitle` | SEO title override | 검색엔진 노출 제목(직접 지정) | 구글 검색결과 등에 Title과 다른 문구를 쓰고 싶을 때만. 비워두면 Title을 그대로 사용 | 선택, 평소엔 안 씀 |
| `seoDescription` | SEO description override | 검색엔진 노출 설명(직접 지정) | 비워두면 Excerpt를 그대로 사용 | 선택, 평소엔 안 씀 |

> `coverImage.alt`처럼 사진에 딸린 "Alt text" 칸은 갤러리(`gallery`)와 본문
> 안에 끼워 넣는 사진에도 똑같이 나타납니다 — 사진을 넣을 때마다 그 사진
> 바로 밑에 있는 Alt text 칸을 채워주시면 됩니다.

<!-- 여기에 스크린샷 첨부 -->
![](./img/newspost-form-top.png)

<!-- 여기에 스크린샷 첨부 -->
![](./img/newspost-form-coverimage-alt.png)

<!-- 여기에 스크린샷 첨부 -->
![](./img/newspost-form-bottom-seo.png)

---

## Category(분류) 선택지

| 영문 | 한국어 뜻 |
|---|---|
| Company News | 회사 소식 |
| Project Update | 프로젝트 진행 소식 |
| Press Release | 보도자료 |
| Media Coverage | 언론 보도(외부 언론이 다룬 내용) |

---

## 위험 구역 (`sanity.io/manage` — 개발자 전용, `/studio`에는 없음)

혹시라도 이 화면들을 보게 되면 즉시 나가고 아무것도 클릭하지 마세요.
`/studio`에는 아래 버튼들이 원천적으로 존재하지 않습니다.

| 영문 | 한국어 뜻 |
|---|---|
| Delete project | 프로젝트(전체) 삭제 |
| Delete dataset | 데이터셋(전체 콘텐츠) 삭제 |
| Billing | 결제 |
| Plan / Upgrade to Growth | 요금제 / 유료 전환 |

<!-- 여기에 스크린샷 첨부 (참고용 — 실제로는 접속하지 말 것) -->
![](./img/manage-danger-zone-reference-only.png)
