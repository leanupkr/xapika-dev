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
    title: "1. 연습용과 실서비스 구분하기",
    blocks: [
      {
        kind: "text",
        body:
          "관리자 화면은 연습용과 실서비스용 두 개가 있습니다. 화면 모양은 똑같지만 글이 저장되는 곳이 서로 다릅니다.",
      },
      {
        kind: "mapping",
        rows: [
          {
            field: "개발(연습용)",
            label: "홈페이지 xapika-dev-git-develop-xapika.vercel.app",
            showsUp:
              "CMS 주소는 xapika-dev-git-develop-xapika.vercel.app/studio 입니다. 여기서 글을 쓰거나 지워도 실제 방문자에게는 보이지 않습니다.",
          },
          {
            field: "실서비스",
            label: "홈페이지 xapika.pl (xapika.co.kr도 같은 사이트)",
            showsUp:
              "CMS 주소는 xapika.pl/studio 입니다. 여기서 Publish를 누르면 실제 방문자에게 곧바로 공개됩니다.",
          },
        ],
      },
      {
        kind: "callout",
        tone: "warning",
        body:
          "연습용에 쓴 글은 실서비스 사이트(xapika.pl)에 나타나지 않고, 반대도 마찬가지입니다. 두 화면이 똑같이 생겼으니 글을 쓰기 전에 주소창을 확인해 주세요.",
      },
      {
        kind: "urlbar",
        tone: "dev",
        badge: "연습용",
        url: "xapika-dev-git-develop-xapika.vercel.app/studio",
        note: "주소에 dev 가 들어 있으면 연습용입니다. 여기서 하는 작업은 실제 방문자에게 보이지 않습니다.",
      },
      {
        kind: "urlbar",
        tone: "prod",
        badge: "실서비스",
        url: "xapika.pl/studio",
        note: "주소가 xapika.pl 로 시작하면 실서비스입니다. Publish를 누르면 바로 공개되니 확인 후 눌러주세요.",
      },
      {
        kind: "callout",
        tone: "info",
        body:
          "연습용 CMS에는 제목이 'Practice example'로 시작하는 예시 기사 두 개가 들어 있습니다. 하나는 본문과 사진이 있는 직접 쓴 기사이고, 다른 하나는 링크만 있는 외부 보도입니다. 연습용으로 만들어 둔 것이니 자유롭게 고치거나 지우셔도 됩니다. 가이드를 보면서 함께 따라 해보시면 익히기 쉽습니다.",
      },
      {
        kind: "steps",
        items: [
          "연습용 CMS를 열고 'Practice example'로 시작하는 기사 중 하나를 엽니다.",
          "제목이나 요약을 고친 뒤 Publish를 누릅니다.",
          "연습용 홈페이지의 News 페이지를 새로고침해 바뀐 내용이 반영됐는지 확인합니다.",
          "실서비스에서도 이 세 단계가 전부입니다.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // 2. 전체 흐름 한눈에
  // ────────────────────────────────────────────────────────────────
  {
    id: "full-flow",
    title: "2. 글이 사이트에 올라가기까지",
    blocks: [
      {
        kind: "text",
        body:
          "글을 새로 만들어 사이트에 올리기까지의 순서입니다. 따로 누르는 '저장' 버튼은 없고, 입력하는 대로 자동 저장됩니다.",
      },
      {
        kind: "steps",
        items: [
          "왼쪽 목록에서 새 글을 만듭니다. 이때 글은 '초안(draft)' 상태이고 아직 아무에게도 보이지 않습니다.",
          "내용을 채우는 동안 따로 저장할 필요가 없습니다. 브라우저를 닫았다가 다시 열어도 쓰던 내용이 그대로 남아 있습니다.",
          "다 썼으면 오른쪽 아래 Publish 버튼을 누릅니다. 이때 글이 '발행(published)' 상태가 되어 사이트에 공개됩니다.",
          "사이트에는 보통 몇 초 안에 반영됩니다. 화면이 바뀌지 않으면 새로고침을 해보세요.",
        ],
      },
      {
        kind: "callout",
        tone: "info",
        body:
          "Publish를 누르기 전까지는 몇 번을 고쳐도, 며칠이 지나도 사이트에 아무 영향이 없습니다. 사이트에 반영되는 버튼은 Publish 하나뿐입니다.",
      },
      { kind: "shot", shot: {
        name: "draft-vs-published-indicator",
        caption: "글 목록 오른쪽 끝의 작은 점. 주황색은 아직 발행하지 않은 초안, 초록색은 발행된 글입니다.",
      } },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // 3. 화면 둘러보기
  // ────────────────────────────────────────────────────────────────
  {
    id: "screen-tour",
    title: "3. 화면 구성",
    blocks: [
      {
        kind: "text",
        body:
          "왼쪽은 글을 찾는 목록 메뉴, 오른쪽은 글을 쓰는 편집 화면입니다.",
      },
      {
        kind: "mapping",
        rows: [
          { field: "왼쪽 메뉴", label: "All articles", showsUp: "전체 글 목록입니다. 최신 글이 맨 위에 옵니다." },
          { field: "왼쪽 메뉴", label: "Drafts", showsUp: "아직 발행하지 않은 초안만 모아서 봅니다." },
          { field: "왼쪽 메뉴", label: "Published", showsUp: "이미 발행되어 사이트에 공개된 글만 봅니다." },
          { field: "왼쪽 메뉴", label: "Pinned", showsUp: "맨 위에 고정해 둔 글만 봅니다." },
          { field: "왼쪽 메뉴", label: "By category", showsUp: "Company News, Project Update, Press Release, Media Coverage 네 가지로 나눠서 봅니다." },
        ],
      },
      { kind: "shot", shot: {
        name: "desk-nav",
        caption: "왼쪽 메뉴 다섯 개와 그 옆에 열리는 글 목록.",
      } },
      { kind: "shot", shot: {
        name: "studio-all-articles-list",
        caption: "All articles를 누르면 나오는 글 목록. 한 줄에 썸네일, 제목, 카테고리와 날짜가 함께 보입니다.",
      } },
      { kind: "shot", shot: {
        name: "studio-by-category-submenu",
        caption: "By category를 누르면 오른쪽에 카테고리 네 개가 펼쳐집니다.",
      } },
      {
        kind: "text",
        body:
          "글을 클릭하면 편집 화면이 열립니다. 위쪽에 탭이 두 개 있습니다.",
      },
      {
        kind: "callout",
        tone: "info",
        body:
          "편집 화면 맨 위에 크게 뜨는 제목은 눌러도 고쳐지지 않습니다. 지금 어떤 글을 열어놨는지 보여주는 미리보기일 뿐입니다. 제목을 고치려면 아래로 조금 내려 Content 탭의 Title (English — required) 칸에서 고치세요. 거기서 고치면 위의 큰 제목도 따라 바뀝니다.",
      },
      {
        kind: "callout",
        tone: "info",
        body:
          "제목 앞에 📌 가 붙어 있다면 그건 제목에 들어간 글자가 아닙니다. 이 글이 맨 위에 고정된 상태라는 표시가 자동으로 붙은 것입니다. 떼려면 Settings (optional) 탭의 Pin to top of list를 끄면 됩니다.",
      },
      {
        kind: "mapping",
        rows: [
          { field: "편집 화면 탭", label: "Content", showsUp: "기사 내용을 쓰는 칸입니다. 대부분의 작업은 여기서 끝납니다." },
          { field: "편집 화면 탭", label: "Settings (optional)", showsUp: "맨 위 고정, 검색결과에 나올 문구 등 추가 설정입니다." },
        ],
      },
      { kind: "shot", shot: {
        name: "editor-tabs",
        caption: "편집 화면 위쪽의 탭. All fields는 전체를 한 번에 보고, 보통은 Content만 쓰면 됩니다.",
      } },
      { kind: "shot", shot: {
        name: "editor-content-tab-full",
        caption: "Content 탭 위쪽. 여기서부터 아래로 Article type, Title, Web address, Summary 순서로 이어집니다.",
      } },
      { kind: "shot", shot: {
        name: "publish-button",
        caption: "편집 화면 오른쪽 아래의 Publish 버튼과 그 옆 점 세 개(⋯) 메뉴.",
      } },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // 4. 자체 기사 쓰기
  // ────────────────────────────────────────────────────────────────
  {
    id: "write-own-article",
    title: "4. 직접 쓴 기사 올리기",
    blocks: [
      {
        kind: "text",
        body:
          "회사에서 직접 작성한 기사입니다. 본문 전체를 사이트에 싣습니다. 다른 언론사가 쓴 기사는 방식이 다르니 5번을 참고해 주세요.",
      },
      {
        kind: "steps",
        items: [
          "새 글을 만들고 Article type에서 'Own article (written by us)'를 선택합니다. 기본값이라 대개 그대로 두면 됩니다.",
          "Title (English — required)에 영어 제목을 씁니다. 그다음 바로 아래 Web address (URL) 칸 옆의 Generate 버튼을 한 번 눌러주세요 — 제목을 그대로 주소로 바꿔줍니다. 이 버튼을 안 누르면 칸이 비어 빨갛게 표시되고 Publish가 눌리지 않습니다.",
          "Summary (English — required)에 두세 문장 정도로 요약을 씁니다. 240자를 넘으면 저장되지 않습니다.",
          "Category에서 글의 분류를 고릅니다.",
          "Published date는 현재 시각으로 채워져 있습니다. 날짜를 바꿀 때만 수정하면 됩니다.",
          "Cover image에 대표 사진을 올리고, 바로 아래 Photo description (alt text)도 한 줄 채웁니다.",
          "Body (English)에 본문을 씁니다. 문단 사이 원하는 위치에 사진을 넣을 수 있습니다.",
          "다 됐으면 Publish를 누릅니다.",
        ],
      },
      {
        kind: "callout",
        tone: "info",
        body:
          "Article type, Title, Web address, Summary, Category, Body 여섯 칸만 채우면 발행할 수 있습니다. Cover image, Photo gallery, Settings 탭은 채우면 좋지만 없어도 됩니다.",
      },
      { kind: "shot", shot: {
        name: "kind-radio-own",
        caption: "Article type에서 Own article이 선택된 상태입니다. 새 글의 기본값입니다.",
      } },
      { kind: "shot", shot: {
        name: "body-editor-toolbar",
        caption: "Body 칸 위의 서식 도구줄. 굵게, 기울임, 목록, 그리고 오른쪽에 사진을 넣는 Image 버튼이 있습니다.",
      } },
      { kind: "shot", shot: {
        name: "body-insert-image",
        caption: "Image를 누르면 열리는 창. 사진을 올리고 아래 설명까지 채운 뒤 창을 닫으면 본문에 들어갑니다.",
      } },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // 5. 외부 보도 스크랩하기
  // ────────────────────────────────────────────────────────────────
  {
    id: "external-coverage",
    title: "5. 외부 언론 보도 올리기",
    blocks: [
      {
        kind: "text",
        body:
          "다른 언론사가 회사를 다룬 기사를 사이트에 소개할 때 씁니다. 기사 본문은 옮기지 않고 제목, 출처, 짧은 요약과 원문 링크만 올립니다.",
      },
      {
        kind: "steps",
        items: [
          "Article type에서 'External press coverage (link out)'를 선택합니다. Body와 Photo gallery 칸이 사라지는데, 이 유형에서는 쓰지 않는 칸이라 자동으로 숨겨지는 것입니다.",
          "Title (English — required)에 사이트에 보여줄 제목을 씁니다. 원문 기사 제목을 그대로 써도 됩니다.",
          "Summary (English — required)에 직접 쓴 요약을 넣습니다. 사이트에서 보이는 유일한 본문이 이 요약입니다.",
          "Category를 고르고, 사진이 있다면 Cover image도 올립니다.",
          "Link to original article에 원문 기사 주소를 붙여넣습니다. https:// 로 시작해야 합니다.",
          "Publication name에 언론사 이름을 씁니다. 예: Rynek Kolejowy",
          "Publish를 누릅니다.",
        ],
      },
      { kind: "shot", shot: {
        name: "kind-radio-external",
        caption: "Article type에서 External press coverage를 고른 상태입니다.",
      } },
      { kind: "shot", shot: {
        name: "external-fields",
        caption: "외부 보도에서만 나타나는 두 칸. 원문 주소와 언론사 이름입니다.",
      } },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // 6. 필드 ↔ 화면 대응표 (핵심)
  // ────────────────────────────────────────────────────────────────
  {
    id: "field-mapping",
    title: "6. 입력한 내용이 사이트 어디에 나오는지",
    blocks: [
      {
        kind: "text",
        body:
          "가이드에서 가장 자주 보게 될 표입니다. Content 탭에 나오는 순서대로 정리했고, '화면 라벨'은 편집 화면에 표시되는 영문 그대로입니다.",
      },
      { kind: "shot", shot: {
        name: "news-list-live",
        caption: "/news 목록 페이지. 맨 위 고정 글 아래로 나머지 글이 카드로 놓입니다. 아래 표와 나란히 두고 보세요.",
      } },
      { kind: "shot", shot: {
        name: "home-rail-live",
        caption: "홈페이지 아래쪽 뉴스 구간. 최신 글 세 개가 카드로 나옵니다.",
      } },
      { kind: "shot", shot: {
        name: "article-detail-live",
        caption: "기사 상세 페이지 위쪽. 카테고리, 제목, 날짜, 커버 사진 순서로 놓입니다.",
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
            field: "featured",
            label: "Pin to top of list",
            showsUp:
              "/news 목록 맨 위에 가로로 넓고 큰 카드로 배치되고, 홈 3개 카드 레일에서도 항상 맨 앞자리를 차지합니다. Studio 글 목록에서는 제목 앞에 📌 표시가 붙습니다.",
          },
          {
            field: "seoTitle",
            label: "SEO title override (optional)",
            showsUp:
              "구글 검색결과에 나오는 제목을 Title 대신 이 문구로 바꿉니다. 사이트 화면에는 영향이 없고 검색결과에만 적용됩니다.",
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
          "스마트폰으로 찍은 사진을 그대로 올려도 됩니다. 크기를 미리 줄일 필요 없이, 사이트에서 화면에 맞게 자동으로 조절해 보여줍니다.",
      },
      {
        kind: "mapping",
        rows: [
          {
            field: "coverImage",
            label: "Cover image (optional)",
            showsUp:
              "비워두면 사진 자리에 점선 테두리와 'Photograph arriving' 문구가 표시됩니다. 오류가 아니라 사진이 없을 때 보여주는 기본 화면입니다.",
          },
        ],
      },
      { kind: "shot", shot: {
        name: "cover-image-upload",
        caption: "Cover image 칸. 사진을 끌어다 놓거나 Upload를 누르면 됩니다. Select는 전에 올린 사진을 다시 쓸 때 씁니다.",
      } },
      { kind: "shot", shot: {
        name: "cover-image-placeholder-live",
        caption: "커버 사진이 없는 글이 사이트에서 어떻게 보이는지. 점선 테두리 자리에 사진이 들어갑니다.",
      } },
      { kind: "shot", shot: {
        name: "alt-text-field",
        caption: "사진을 올리면 바로 아래에 Photo description 칸이 나타납니다.",
      } },
      {
        kind: "callout",
        tone: "warning",
        body:
          "사진을 넣었으면 Photo description (alt text)을 한 줄 채워주세요. 비워두면 발행이 되지 않습니다.",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // 8. 고정(featured)
  // ────────────────────────────────────────────────────────────────
  {
    id: "featured-pin",
    title: "8. 중요한 글 맨 위에 고정하기",
    blocks: [
      {
        kind: "text",
        body:
          "Settings (optional) 탭의 Pin to top of list를 켜면 그 글이 /news 목록 맨 위에 크게 표시됩니다. 홈 화면의 뉴스 카드 세 개 중에서도 맨 앞에 옵니다.",
      },
      { kind: "shot", shot: {
        name: "featured-toggle",
        caption: "Settings (optional) 탭의 Pin to top of list. 스위치가 켜진 상태입니다.",
      } },
      { kind: "shot", shot: {
        name: "featured-card-live",
        caption: "고정한 글은 /news 목록 맨 위에 가로 전체 폭으로 크게 나옵니다.",
      } },
      { kind: "shot", shot: {
        name: "featured-pin-emoji-studio",
        caption: "고정한 글은 Studio 목록에서 제목 앞에 📌 가 붙습니다.",
      } },
      {
        kind: "callout",
        tone: "warning",
        body:
          "새 글을 고정해도 기존에 고정해 둔 글은 자동으로 풀리지 않습니다. 하나만 고정하려면 이전 글의 Pin to top of list를 먼저 꺼주세요.",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // 9. 수정·삭제·되살리기
  // ────────────────────────────────────────────────────────────────
  {
    id: "edit-delete-restore",
    title: "9. 수정·삭제·되돌리기",
    blocks: [
      {
        kind: "text",
        body:
          "이미 발행한 글도 언제든 다시 열어 고칠 수 있습니다. 고친 내용은 Publish를 다시 눌러야 반영되고, 그 전까지 사이트에는 이전 내용이 그대로 보입니다.",
      },
      {
        kind: "steps",
        items: [
          "왼쪽 목록에서 고칠 글을 클릭해 엽니다.",
          "내용을 고칩니다. 자동 저장되지만 아직 사이트에는 반영되지 않은 상태입니다.",
          "Publish를 다시 눌러야 고친 내용이 사이트에 반영됩니다.",
        ],
      },
      {
        kind: "text",
        body:
          "편집 화면 오른쪽 위 점 세 개(⋯) 메뉴에서 History를 누르면 글이 언제 어떻게 바뀌었는지 볼 수 있습니다. 기록은 3일치만 남습니다.",
      },
      { kind: "shot", shot: {
        name: "document-history-panel",
        caption: "⋯ 메뉴에서 History를 누르면 오른쪽에 열리는 변경 이력 패널. 발행한 시각이 최근 순으로 쌓입니다.",
      } },
      {
        kind: "callout",
        tone: "danger",
        body:
          "변경 이력은 3일만 보관되고, 그 이전 버전으로는 되돌릴 수 없습니다. 글을 크게 고치기 전에는 기존 내용을 다른 곳에 복사해 두시는 것이 안전합니다.",
      },
      {
        kind: "text",
        body:
          "삭제는 오른쪽 아래 Publish 버튼 옆 점 세 개(⋯) 메뉴에서 빨간 Delete를 누르면 됩니다. 확인 창이 한 번 더 나옵니다.",
      },
      { kind: "shot", shot: {
        name: "delete-menu",
        caption: "Publish 버튼 옆 점 세 개(⋯)를 누르면 나오는 메뉴. Duplicate 아래 빨간 Delete가 삭제입니다.",
      } },
      {
        kind: "callout",
        tone: "danger",
        body:
          "삭제는 되돌릴 수 없습니다. 발행됐던 글을 삭제하면 그 주소로 들어온 방문자는 '페이지를 찾을 수 없음' 화면을 보게 됩니다. 지우지 않고 숨기고 싶다면 개발팀에 먼저 문의해 주세요.",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // 10. 주의사항
  // ────────────────────────────────────────────────────────────────
  {
    id: "must-know",
    title: "10. 주의사항",
    blocks: [
      {
        kind: "callout",
        tone: "danger",
        body:
          "① 한 번 발행한 글은 나중에 지우더라도 공개됐던 사실까지 되돌릴 수는 없습니다. 검색엔진에 이미 수집됐거나 누군가 링크를 저장해 뒀을 수 있습니다. 아직 확정되지 않은 내용은 발행 전에 한 번 더 확인해 주세요.",
      },
      {
        kind: "callout",
        tone: "warning",
        body:
          "② 변경 이력은 3일만 보관됩니다. 큰 수정 전에는 기존 내용을 따로 복사해 두세요. 자세한 내용은 9번을 참고해 주세요.",
      },
      {
        kind: "callout",
        tone: "danger",
        body:
          "③ 실서비스 CMS(xapika.pl/studio)의 Publish는 누르는 즉시 실제 방문자에게 공개됩니다.",
      },
    ],
  },
];
