// src/sanity/guide/content.tsx
//
// Content for the Studio "Guide" tab — written for the actual person who
// will use it (비전잇 이주연 주임, non-developer, has never used Sanity).
// Every field label quoted below is copied verbatim from
// ../schemaTypes/newsPost.ts (the `title` string Studio actually renders
// for that field), and every "showsUp" description was written after
// reading the component that renders it — see the file list in the task
// brief this was generated from. Do not add a field here without reading
// where it renders first; do not describe a screen without reading its
// component first.
//
// Types are exported so the Studio-side tool component (GuideTool.tsx,
// built separately) can import them without duplicating this shape.

export type GuideShot = { name: string; caption: string };

export type GuideBlock =
  | { kind: "text"; body: string }
  | { kind: "steps"; items: string[] }
  | { kind: "shot"; shot: GuideShot }
  | { kind: "mapping"; rows: Array<{ field: string; label: string; showsUp: string }> }
  | { kind: "callout"; tone: "info" | "warning" | "danger"; body: string }
  /**
   * A drawn browser address bar, not a screenshot.
   *
   * §1's whole point is "check the address bar before you type" — which
   * needs the two Studio URLs shown the way the browser shows them. A
   * screenshot was the obvious answer and the wrong one: the browser's
   * own chrome sits outside the page, so it can only be captured by
   * photographing someone's actual screen, which then goes stale the
   * moment a URL changes and can quietly leak whatever else was open at
   * the time. Drawing the bar keeps the URLs in the same source of truth
   * as the rest of the guide.
   */
  | { kind: "urlbar"; tone: "dev" | "prod"; badge: string; url: string; note: string };

export type GuideSection = { id: string; title: string; blocks: GuideBlock[] };

export const GUIDE_SECTIONS: GuideSection[] = [
  // ────────────────────────────────────────────────────────────────
  // 1. 여기가 어디인가
  // ────────────────────────────────────────────────────────────────
  {
    id: "where-are-we",
    title: "1. 여기가 어디인가",
    blocks: [
      {
        kind: "text",
        body:
          "이 CMS(콘텐츠 관리 화면)는 두 벌이 있습니다. 완전히 똑같이 생겼지만, 서로 다른 글 저장소를 보고 있습니다.",
      },
      {
        kind: "mapping",
        rows: [
          {
            field: "개발(연습용)",
            label: "홈페이지 xapika-dev-git-develop-xapika.vercel.app",
            showsUp:
              "CMS는 xapika-dev-git-develop-xapika.vercel.app/studio. 연습용 저장소를 씁니다 — 여기서 쓰고 지우고 마음껏 연습해도 실제 손님은 절대 못 봅니다.",
          },
          {
            field: "실서비스(진짜)",
            label: "홈페이지 xapika.pl (xapika.co.kr도 같은 사이트)",
            showsUp:
              "CMS는 xapika.pl/studio. 실서비스 저장소를 씁니다 — 여기서 Publish를 누르면 실제 방문자에게 바로 보입니다.",
          },
        ],
      },
      {
        kind: "callout",
        tone: "warning",
        body:
          "개발(연습용) 저장소에 쓴 글은 실서비스 사이트(xapika.pl)에 절대 나타나지 않습니다. 반대도 마찬가지입니다. 두 CMS는 겉모습이 완전히 같으니, 글을 쓰기 전에 브라우저 주소창을 먼저 확인하는 습관을 들이세요 — 연습하려던 글을 실서비스에 올리는 사고를 막는 유일한 방법입니다.",
      },
      {
        kind: "urlbar",
        tone: "dev",
        badge: "연습용",
        url: "xapika-dev-git-develop-xapika.vercel.app/studio",
        note: "주소에 dev 가 들어가 있으면 연습용입니다. 여기서는 무엇을 쓰든 지우든 실제 방문자에게 보이지 않습니다.",
      },
      {
        kind: "urlbar",
        tone: "prod",
        badge: "실서비스",
        url: "xapika.pl/studio",
        note: "주소가 xapika.pl 로 시작하면 실서비스입니다. 여기서 Publish를 누르는 순간 실제 방문자에게 공개됩니다.",
      },
      {
        kind: "callout",
        tone: "info",
        body:
          "연습용 CMS에는 제목이 'Practice example'로 시작하는 연습용 기사가 미리 들어 있습니다. 하나는 자체 기사(본문·사진 있음), 하나는 외부 보도(링크만). 이 두 개는 마음대로 고치고, 사진을 바꾸고, 지워도 됩니다 — 바로 그러라고 넣어둔 것입니다. 이 가이드를 읽으면서 옆에 띄워놓고 똑같이 따라 해보세요.",
      },
      {
        kind: "steps",
        items: [
          "연습용 CMS(xapika-dev-...)를 열고, 'Practice example'로 시작하는 기사를 아무거나 하나 엽니다.",
          "제목이나 요약을 바꿔보고 Publish를 누릅니다.",
          "연습용 홈페이지의 News 페이지를 새로고침해서, 방금 바꾼 내용이 그대로 보이는지 확인합니다.",
          "이 세 단계가 익숙해지면 실서비스 CMS에서 해야 할 일도 정확히 이것뿐입니다.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // 2. 전체 흐름 한눈에
  // ────────────────────────────────────────────────────────────────
  {
    id: "full-flow",
    title: "2. 전체 흐름 한눈에",
    blocks: [
      {
        kind: "text",
        body:
          "글 하나가 만들어져서 사이트에 뜨기까지 거치는 흐름은 이렇습니다. 중간에 별도로 누르는 '저장' 버튼은 없습니다 — 칸에 뭔가 입력하는 순간부터 자동으로 계속 저장됩니다.",
      },
      {
        kind: "steps",
        items: [
          "왼쪽 목록에서 새 글을 만들면, 그 순간부터 이 글은 '초안(draft)' 상태입니다. 아직 아무에게도 안 보입니다.",
          "칸을 채우는 동안 아무것도 누르지 않아도 됩니다 — 타이핑하는 대로 자동 저장됩니다. 브라우저를 닫았다가 다시 열어도 쓰던 내용이 그대로 있습니다.",
          "다 썼으면 화면 오른쪽 위 Publish 버튼을 누릅니다. 이 순간 이 글이 '발행(published)' 상태가 되고, 사이트에 공개됩니다.",
          "사이트에는 보통 수 초 안에 반영됩니다. 화면이 바로 안 바뀌면 새로고침을 한두 번 해보세요. 아주 드물게(자동 갱신 신호를 못 받았을 때) 최대 1시간 정도 걸릴 수도 있습니다.",
        ],
      },
      {
        kind: "callout",
        tone: "info",
        body:
          "Publish를 누르기 전까지는 몇 번을 고쳐도, 며칠을 묵혀둬도 안전합니다. 사이트에 영향을 주는 유일한 버튼은 Publish입니다.",
      },
      { kind: "shot", shot: {
        name: "draft-vs-published-indicator",
        caption: "글 목록에서 제목 옆/앞에 나타나는 작은 점(도트) 표시를 확대 캡처. 초안 상태와 발행된 상태가 이 점 색깔로 구분되는 부분.",
      } },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // 3. 화면 둘러보기
  // ────────────────────────────────────────────────────────────────
  {
    id: "screen-tour",
    title: "3. 화면 둘러보기",
    blocks: [
      {
        kind: "text",
        body:
          "왼쪽에는 글을 찾는 목록 메뉴, 가운데에는 글을 쓰는 편집 화면이 있습니다.",
      },
      {
        kind: "mapping",
        rows: [
          { field: "왼쪽 메뉴", label: "All articles", showsUp: "전체 글 목록. 최신 글이 맨 위." },
          { field: "왼쪽 메뉴", label: "Drafts", showsUp: "아직 Publish 안 한 초안만 모아 보기." },
          { field: "왼쪽 메뉴", label: "Published", showsUp: "이미 Publish된, 즉 사이트에 공개된 글만 모아 보기." },
          { field: "왼쪽 메뉴", label: "Pinned", showsUp: "고정(featured) 켠 글만 모아 보기." },
          { field: "왼쪽 메뉴", label: "By category", showsUp: "Company News / Project Update / Press Release / Media Coverage 네 갈래로 나눠 보기." },
        ],
      },
      { kind: "shot", shot: {
        name: "desk-nav",
        caption: "Studio 왼쪽 전체 메뉴(All articles / Drafts / Published / Pinned / By category)가 다 보이게 캡처.",
      } },
      { kind: "shot", shot: {
        name: "studio-all-articles-list",
        caption: "'All articles'를 눌렀을 때 나오는 글 목록 화면. 각 줄에 제목, 썸네일, 카테고리·날짜가 보이는 상태로 캡처.",
      } },
      { kind: "shot", shot: {
        name: "studio-by-category-submenu",
        caption: "'By category'를 눌러 네 개 카테고리 하위 목록이 펼쳐진 상태 캡처.",
      } },
      {
        kind: "text",
        body:
          "글 하나를 클릭하면 편집 화면이 열립니다. 위쪽에 탭이 세 개 있습니다.",
      },
      {
        kind: "mapping",
        rows: [
          { field: "편집 화면 탭", label: "Content", showsUp: "실제 기사 내용을 쓰는 칸 전부. 대부분의 작업은 여기서 끝납니다." },
          { field: "편집 화면 탭", label: "Korean (optional)", showsUp: "한국어 번역을 넣는 칸. 비워도 전혀 문제없습니다." },
          { field: "편집 화면 탭", label: "Settings (optional)", showsUp: "고정(맨 위 배치), 구글 검색결과 문구 조정 등 부가 설정." },
        ],
      },
      { kind: "shot", shot: {
        name: "editor-tabs",
        caption: "편집 화면 상단의 Content / Korean (optional) / Settings (optional) 탭 세 개가 다 보이게 캡처.",
      } },
      { kind: "shot", shot: {
        name: "editor-content-tab-full",
        caption: "Content 탭을 위에서 아래까지 스크롤하며 모든 칸(Article type부터 Photo gallery까지)이 보이도록 캡처(여러 장으로 나눠도 됨).",
      } },
      { kind: "shot", shot: {
        name: "publish-button",
        caption: "편집 화면 오른쪽 위, Publish 버튼이 있는 부분을 확대 캡처. 그 옆 점 세 개(⋮) 메뉴도 함께 나오게.",
      } },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // 4. 자체 기사 쓰기
  // ────────────────────────────────────────────────────────────────
  {
    id: "write-own-article",
    title: "4. 자체 기사 쓰기",
    blocks: [
      {
        kind: "text",
        body:
          "우리가 직접 쓰는 기사입니다. 본문을 통째로 우리 사이트에 올릴 수 있는 유일한 방식입니다(외부 보도는 다릅니다 — 다음 섹션 참고).",
      },
      {
        kind: "steps",
        items: [
          "새 글을 만들고 Article type에서 'Own article (written by us)'를 선택합니다. (기본값이 이미 이것입니다.)",
          "Title (English — required)에 영어 제목을 씁니다. 그다음 바로 아래 Web address (URL) 칸 옆의 Generate 버튼을 한 번 눌러주세요 — 제목을 그대로 주소로 바꿔줍니다. 이 버튼을 안 누르면 칸이 비어 빨갛게 표시되고 Publish가 눌리지 않습니다.",
          "Summary (English — required)에 2~3문장짜리 짧은 요약을 씁니다. 240자 넘으면 저장이 안 되니 짧게.",
          "Category에서 이 글이 어디에 속하는지 고릅니다.",
          "Published date는 지금 시각으로 자동 채워져 있습니다. 날짜를 바꾸고 싶을 때만 손대면 됩니다.",
          "Cover image에 대표 사진을 올립니다. 사진을 올렸으면 바로 아래 Photo description (alt text)도 한 줄 채웁니다.",
          "Body (English)에 본문을 자유롭게 씁니다. 문단 중간 아무 곳에나 사진을 끼워 넣을 수 있습니다.",
          "다 됐으면 Publish.",
        ],
      },
      {
        kind: "callout",
        tone: "info",
        body:
          "이 여섯 칸(Article type, Title, Summary, Category, Body)만 채우면 발행할 수 있습니다. Cover image, Photo gallery, Korean 탭, Settings 탭은 전부 있으면 좋지만 없어도 됩니다.",
      },
      { kind: "shot", shot: {
        name: "kind-radio-own",
        caption: "Article type 칸에서 'Own article (written by us)'가 선택된(라디오 버튼이 켜진) 상태 캡처.",
      } },
      { kind: "shot", shot: {
        name: "body-editor-toolbar",
        caption: "Body (English) 칸 위쪽에 뜨는 서식 도구(굵게, 제목, 인용구, 목록 등 아이콘 줄) 확대 캡처.",
      } },
      { kind: "shot", shot: {
        name: "body-insert-image",
        caption: "본문을 쓰다가 커서가 있는 줄에 사진을 끼워 넣는 버튼/과정을 캡처(도구줄의 사진 추가 아이콘을 누른 직후 화면).",
      } },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // 5. 외부 보도 스크랩하기
  // ────────────────────────────────────────────────────────────────
  {
    id: "external-coverage",
    title: "5. 외부 보도 스크랩하기",
    blocks: [
      {
        kind: "text",
        body:
          "다른 언론사가 우리 회사를 취재해서 쓴 기사를 우리 사이트에도 알리고 싶을 때 씁니다. 이때는 기사 본문을 옮겨 적지 않습니다 — 제목·출처·짧은 요약과 원문 링크만 올립니다.",
      },
      {
        kind: "callout",
        tone: "warning",
        body:
          "다른 언론사가 쓴 기사의 문장을 그대로 복사해서 Body(또는 Summary)에 붙여넣지 마세요. 저작권이 그 언론사에 있습니다. 요약은 반드시 우리가 새로 쓴 짧은 문장이어야 합니다.",
      },
      {
        kind: "steps",
        items: [
          "Article type에서 'External press coverage (link out)'를 선택합니다. 그러면 Body와 Photo gallery 칸이 화면에서 사라집니다 — 이 유형에서는 쓰지 않는 칸이라서 자동으로 숨겨지는 것뿐, 고장이 아닙니다.",
          "Title (English — required)에 우리 사이트에서 보여줄 제목을 씁니다(그 언론사 기사 제목을 그대로 써도 됩니다).",
          "Summary (English — required)에 직접 쓴 짧은 요약을 넣습니다. 이 요약이 우리 사이트에서 유일하게 보이는 본문 텍스트입니다.",
          "Category와 Cover image(있으면)를 채웁니다.",
          "Link to original article에 그 언론사 기사의 정확한 주소(https://로 시작)를 붙여넣습니다.",
          "Publication name에 언론사 이름을 씁니다(예: Rynek Kolejowy).",
          "Publish.",
        ],
      },
      { kind: "shot", shot: {
        name: "kind-radio-external",
        caption: "Article type 칸에서 'External press coverage (link out)'가 선택된 상태 캡처. Body/Photo gallery 칸이 사라진 것도 함께 보이게.",
      } },
      { kind: "shot", shot: {
        name: "external-fields",
        caption: "Link to original article와 Publication name 두 칸이 채워진 상태를 캡처.",
      } },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // 6. 필드 ↔ 화면 대응표 (핵심)
  // ────────────────────────────────────────────────────────────────
  {
    id: "field-mapping",
    title: "6. 이 칸에 넣으면 사이트 어디에 뜨나 — 전체 대응표",
    blocks: [
      {
        kind: "text",
        body:
          "이 가이드에서 가장 중요한 표입니다. Content 탭 위에서 아래 순서 그대로 정리했습니다. '화면 라벨'은 편집 화면에 실제로 찍혀 있는 영문 그대로입니다.",
      },
      { kind: "shot", shot: {
        name: "news-list-live",
        caption: "실서비스(또는 개발) 사이트의 /news 목록 페이지 전체 화면 캡처. 아래 표와 나란히 대조하는 기준 화면.",
      } },
      { kind: "shot", shot: {
        name: "home-rail-live",
        caption: "홈페이지 맨 아래쪽, 뉴스 카드 3개가 나열된 구간 전체 캡처.",
      } },
      { kind: "shot", shot: {
        name: "article-detail-live",
        caption: "기사 하나를 열었을 때 나오는 상세 페이지 전체 캡처(맨 위 큰 사진부터 본문, 관련 뉴스까지 스크롤하며 여러 장).",
      } },
      {
        kind: "mapping",
        rows: [
          {
            field: "kind",
            label: "Article type",
            showsUp:
              "카드 오른쪽 위에 출처 배지(예: 🔗 Rynek Kolejowy)가 붙는지 안 붙는지, 상세 페이지에 본문이 통째로 나오는지 아니면 '~에서 읽기' 버튼 하나만 나오는지를 결정합니다. 화면에 직접 보이는 글자는 아니고, 뒤에서 레이아웃을 바꾸는 스위치입니다.",
          },
          {
            field: "title",
            label: "Title (English — required)",
            showsUp:
              "뉴스 목록 카드 제목, 홈 화면 3개 카드 제목, 기사 상세 페이지 맨 위 큰 제목, 관련 뉴스 카드 제목, 구글 검색결과 제목(Settings 탭 SEO title을 안 채웠을 때), RSS 피드 제목까지 전부 여기서 나옵니다.",
          },
          {
            field: "slug",
            label: "Web address (URL)",
            showsUp:
              "이 글의 웹주소가 됩니다. 예: xapika.pl/news/이-부분. 제목을 쓴 뒤 Generate를 한 번 누르면 채워지고, 그 뒤로는 손대지 않습니다.",
          },
          {
            field: "excerpt",
            label: "Summary (English — required)",
            showsUp:
              "뉴스 목록 카드의 2줄 요약, 홈 3개 카드의 요약, 외부 보도 글의 상세 페이지 본문 자리에 나오는 유일한 문단, 구글 검색결과 설명문(SEO description을 안 채웠을 때), RSS 설명문.",
          },
          {
            field: "category",
            label: "Category",
            showsUp:
              "카드와 상세 페이지 위쪽에 붙는 색깔 태그, /news 목록 상단의 필터 버튼들(그 카테고리 글이 하나라도 있어야 버튼이 나타남), Studio 왼쪽 'By category' 하위 목록.",
          },
          {
            field: "publishedAt",
            label: "Published date",
            showsUp:
              "목록·홈 정렬 기준(고정 글 다음으로 최신순), 카드와 상세 페이지에 찍히는 날짜 글자, RSS 피드의 발행일.",
          },
          {
            field: "coverImage / alt",
            label: "Cover image (optional) / Photo description (alt text)",
            showsUp:
              "카드 대표 사진, 홈 3개 카드 사진, 상세 페이지 맨 위 큰 사진. 비워두면 사진 대신 점선 테두리의 'Photograph arriving' 자리표시자가 뜹니다. alt 설명은 화면에 글자로 보이진 않지만, 화면읽기 프로그램이 대신 읽어주고 사진이 안 불러와졌을 때 그 자리에 대신 표시됩니다. 사진을 올렸는데 alt를 안 쓰면 발행이 막힙니다.",
          },
          {
            field: "body",
            label: "Body (English)",
            showsUp:
              "상세 페이지에서 큰 사진 아래 이어지는 본문 전체(자체 기사만 해당). 외부 보도 글에서는 이 칸 자체가 안 쓰입니다.",
          },
          {
            field: "gallery",
            label: "Photo gallery (optional)",
            showsUp:
              "상세 페이지 본문 아래에 추가로 붙는 사진 격자(자체 기사만). 아무 사진도 안 넣으면 이 구간 자체가 페이지에서 통째로 사라집니다.",
          },
          {
            field: "externalUrl",
            label: "Link to original article",
            showsUp:
              "외부 보도 글의 상세 페이지에 뜨는 'Read on {출처}' 버튼이 실제로 걸리는 주소.",
          },
          {
            field: "externalSource",
            label: "Publication name",
            showsUp:
              "카드 오른쪽 위 출처 배지에 찍히는 글자, 상세 페이지 'Read on {여기 이름}' 버튼 문구.",
          },
          {
            field: "titleKo",
            label: "Title (Korean — optional)",
            showsUp:
              "이 칸을 채우면 그 글에만 상세 페이지 오른쪽 위에 EN / KO 전환 버튼이 새로 나타납니다. 방문자가 KO를 누르면 이 제목이 뜹니다. 비워두면 전환 버튼 자체가 안 나타나고 영어만 보입니다.",
          },
          {
            field: "excerptKo",
            label: "Summary (Korean — optional)",
            showsUp:
              "KO로 전환했을 때 보이는 한국어 요약(외부 보도 글은 이게 상세 페이지 본문 자리를 대신 채웁니다).",
          },
          {
            field: "bodyKo",
            label: "Body (Korean — optional)",
            showsUp:
              "KO로 전환했을 때 보이는 한국어 본문 전체(자체 기사만).",
          },
          {
            field: "featured",
            label: "Pin to top of list",
            showsUp:
              "/news 목록 맨 위에 가로로 넓고 큰 카드로 배치되고, 홈 3개 카드 레일에서도 항상 맨 앞자리를 차지합니다. Studio 글 목록에서는 제목 앞에 📌 표시가 붙습니다.",
          },
          {
            field: "seoTitle",
            label: "SEO title override (optional)",
            showsUp:
              "구글 검색결과에 뜨는 제목을 Title 대신 이 문구로 바꿉니다. 사이트 화면 자체에는 영향 없음 — 구글 검색결과 줄에만 영향.",
          },
          {
            field: "seoDescription",
            label: "SEO description override (optional)",
            showsUp:
              "구글 검색결과에 뜨는 설명문을 Summary 대신 이 문구로 바꿉니다. 마찬가지로 사이트 화면 자체는 안 바뀌고 구글 검색결과에만 영향.",
          },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // 7. 사진 넣기
  // ────────────────────────────────────────────────────────────────
  {
    id: "adding-photos",
    title: "7. 사진 넣기",
    blocks: [
      {
        kind: "text",
        body:
          "스마트폰으로 찍은 사진을 그대로 올려도 됩니다. 별도 편집이나 리사이즈 없이 올리면 사이트가 알아서 화면 크기에 맞게 여러 사이즈로 줄여서 보여줍니다.",
      },
      {
        kind: "mapping",
        rows: [
          {
            field: "coverImage",
            label: "Cover image (optional)",
            showsUp:
              "안 채우면 사진 자리에 점선 테두리 박스와 'Photograph arriving' 글자가 대신 뜹니다. 깨진 화면이 아니라 의도된 자리표시자입니다.",
          },
        ],
      },
      { kind: "shot", shot: {
        name: "cover-image-upload",
        caption: "Cover image 칸에 사진을 업로드하는 화면(업로드 버튼을 누르거나 사진을 끌어다 놓는 순간).",
      } },
      { kind: "shot", shot: {
        name: "cover-image-placeholder-live",
        caption: "실제 사이트에서 커버 사진이 없는 글의 카드/상세 페이지 — 점선 테두리 자리표시자가 뜬 모습.",
      } },
      { kind: "shot", shot: {
        name: "alt-text-field",
        caption: "사진을 올린 직후 바로 아래 나타나는 Photo description (alt text) 입력 칸 확대.",
      } },
      {
        kind: "callout",
        tone: "warning",
        body:
          "사진을 넣었으면 Photo description (alt text)을 꼭 한 줄 채우세요. 안 채우면 저장 시 경고가 뜨고 발행이 막힙니다. 이 설명은 화면에는 안 보이지만 시각장애인을 위한 화면읽기 프로그램이 읽어주고, 사진이 어떤 이유로 안 불러와졌을 때 대신 보여집니다.",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // 8. 한국어 토글
  // ────────────────────────────────────────────────────────────────
  {
    id: "korean-toggle",
    title: "8. 한국어 번역 넣기",
    blocks: [
      {
        kind: "text",
        body:
          "Korean (optional) 탭은 완전히 선택 사항입니다. 비워두면 그 글은 영어로만 보입니다.",
      },
      {
        kind: "steps",
        items: [
          "Korean (optional) 탭을 엽니다.",
          "Title (Korean — optional)과 Summary (Korean — optional)를 채웁니다. 자체 기사라면 Body (Korean — optional)도 채웁니다.",
          "이 세 칸 중 제목만 채워도, 그 글의 상세 페이지에 EN / KO 전환 버튼이 바로 나타납니다.",
        ],
      },
      { kind: "shot", shot: {
        name: "korean-tab-empty",
        caption: "Korean (optional) 탭이 비어 있는 상태 캡처 — 이 상태의 글은 한국어 버튼이 안 나타남을 보여주는 기준 화면.",
      } },
      { kind: "shot", shot: {
        name: "korean-tab-filled",
        caption: "Korean (optional) 탭에 제목/요약이 채워진 상태 캡처.",
      } },
      { kind: "shot", shot: {
        name: "lang-toggle-live",
        caption: "실제 사이트 상세 페이지 오른쪽 위에 나타난 EN / KO 전환 버튼을 확대 캡처.",
      } },
      {
        kind: "callout",
        tone: "info",
        body: "한국어를 반만 채워도(예: 제목만) 괜찮습니다 — 비워둔 칸은 그냥 영어 원문이 대신 보입니다.",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // 9. 고정(featured)
  // ────────────────────────────────────────────────────────────────
  {
    id: "featured-pin",
    title: "9. 글 고정하기 (맨 위에 크게 보여주기)",
    blocks: [
      {
        kind: "text",
        body:
          "Settings (optional) 탭의 Pin to top of list를 켜면, 그 글이 /news 목록 맨 위에 가로로 넓고 크게 배치됩니다. 홈 화면 3개 카드 중에서도 항상 맨 앞자리를 차지합니다.",
      },
      { kind: "shot", shot: {
        name: "featured-toggle",
        caption: "Settings (optional) 탭의 Pin to top of list 스위치가 켜진 상태 확대 캡처.",
      } },
      { kind: "shot", shot: {
        name: "featured-card-live",
        caption: "/news 목록에서 고정된 글이 다른 카드보다 훨씬 크게 나온 모습 전체 캡처.",
      } },
      { kind: "shot", shot: {
        name: "featured-pin-emoji-studio",
        caption: "Studio 글 목록에서 고정된 글 제목 앞에 붙는 📌 표시 확대 캡처.",
      } },
      {
        kind: "callout",
        tone: "warning",
        body:
          "새 글을 고정해도 이전에 고정해뒀던 글이 자동으로 풀리지 않습니다. 한 번에 하나만 고정하고 싶다면, 새 글을 고정하기 전에 이전 글의 Pin to top of list를 먼저 직접 꺼주세요.",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // 10. 수정·삭제·되살리기
  // ────────────────────────────────────────────────────────────────
  {
    id: "edit-delete-restore",
    title: "10. 수정하기 · 삭제하기 · 되돌리기",
    blocks: [
      {
        kind: "text",
        body:
          "이미 발행한 글도 언제든 다시 열어서 고칠 수 있습니다. 고친 내용은 Publish를 다시 눌러야 사이트에 반영됩니다 — 그 전까지는 사이트에 예전 내용 그대로 보입니다.",
      },
      {
        kind: "steps",
        items: [
          "왼쪽 목록에서 고칠 글을 클릭해 엽니다.",
          "원하는 칸을 고칩니다. 자동 저장되지만, 아직 사이트에는 반영되지 않은 상태입니다.",
          "Publish를 다시 눌러야 고친 내용이 사이트에 반영됩니다.",
        ],
      },
      {
        kind: "text",
        body:
          "편집 화면 오른쪽 위 점 세 개(⋯) 메뉴 → History를 누르면 이 글이 언제 어떻게 바뀌어 왔는지 목록으로 볼 수 있습니다. 다만 기록은 3일치만 남습니다 — 그보다 오래된 버전으로는 되돌릴 수 없으니, 큰 폭으로 고치기 전에는 기존 내용을 따로 복사해 두세요.",
      },
      { kind: "shot", shot: {
        name: "document-history-panel",
        caption: "⋯ 메뉴에서 History를 누르면 오른쪽에 열리는 변경 이력 패널. 발행한 시각이 최근 순으로 쌓입니다.",
      } },
      {
        kind: "callout",
        tone: "danger",
        body:
          "변경 이력(History)은 3일 동안만 보관됩니다. 3일이 지나면 그 이전 버전으로는 되돌릴 수 없습니다. 글을 크게 고치기 전에는 원본 문장을 다른 곳에 따로 복사해두는 걸 권합니다.",
      },
      {
        kind: "text",
        body:
          "삭제는 편집 화면 오른쪽 아래, Publish 버튼 바로 옆 점 세 개(⋯) 메뉴 안에 있는 빨간 Delete를 누르면 됩니다. 확인 창이 한 번 더 뜹니다.",
      },
      { kind: "shot", shot: {
        name: "delete-menu",
        caption: "Publish 버튼 옆 점 세 개(⋯)를 누르면 나오는 메뉴. Duplicate 아래 빨간 Delete가 삭제입니다.",
      } },
      {
        kind: "callout",
        tone: "danger",
        body:
          "삭제는 되돌릴 수 없습니다. 이미 발행됐던 글을 삭제하면 그 주소(예: xapika.pl/news/글이름)로 들어오던 방문자는 '페이지를 찾을 수 없음' 화면을 보게 됩니다. 삭제 대신 글을 비공개로 돌리고 싶다면, 발행된 글을 다시 초안으로 내리는 방법을 팀에 먼저 물어보세요.",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // 11. 꼭 알아야 할 주의사항
  // ────────────────────────────────────────────────────────────────
  {
    id: "must-know",
    title: "11. 꼭 알아야 할 주의사항",
    blocks: [
      {
        kind: "callout",
        tone: "danger",
        body:
          "① 한 번 Publish를 눌렀던 글은, 나중에 다시 초안으로 내리거나 삭제해도 '그동안 공개돼 있었다'는 사실 자체는 지워지지 않습니다. 검색엔진에 이미 긁혀갔을 수도 있고, 누군가 링크를 저장해뒀을 수도 있습니다. 민감하거나 확정 안 된 내용은 Publish 전에 한 번 더 확인하세요.",
      },
      {
        kind: "callout",
        tone: "warning",
        body:
          "② 변경 이력은 3일만 보관됩니다(10번 섹션 참고). 큰 수정 전에는 원본을 따로 복사해두세요.",
      },
      {
        kind: "callout",
        tone: "danger",
        body:
          "③ 실서비스 CMS(xapika.pl/studio)에서 누르는 Publish는 연습이 아닙니다 — 누르는 즉시 실제 방문자에게 공개됩니다. 확실하지 않으면 먼저 개발(연습용) CMS에서 똑같이 써보고 화면을 확인한 다음, 실서비스에서 그대로 다시 작성하세요.",
      },
    ],
  },
];
