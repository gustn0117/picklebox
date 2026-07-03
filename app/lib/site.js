// 사이트 전역 콘텐츠/링크 — 이후 자료가 채워지면 이 파일만 갱신하면 된다.
export const LINKS = {
  store: "https://smartstore.naver.com/joytennis",
  // 네이버 예약·문의 링크(네이버 플레이스). 예약·문의·오시는 길 버튼이 모두 이 링크로 연결된다.
  reserve: "https://naver.me/FCAfFuDm",
  instagram: [
    { handle: "@picklebox.official_", url: "https://instagram.com/picklebox.official_", label: "피클박스 공식" },
    { handle: "@tennis_cmj", url: "https://instagram.com/tennis_cmj", label: "조민정" },
    { handle: "@tennisfore", url: "https://instagram.com/tennisfore", label: "테니스포레" },
  ],
  youtube: "https://www.youtube.com/results?search_query=쫌치는언니",
  map: "https://naver.me/FCAfFuDm",
};

// 예약 링크 — reserve가 비어 있으면 인스타 DM으로 폴백.
export const reserveHref = LINKS.reserve || LINKS.instagram[0].url;

// 상단 내비게이션 페이지 목록 — Nav/Footer 공유.
export const NAV = [
  { href: "/about", label: "피클박스 안내" },
  { href: "/pickleball", label: "피클볼이란?" },
  { href: "/founder", label: "대표 소개" },
  { href: "/visit", label: "오시는 길" },
];

export const BUSINESS = {
  name: "테니스포레",
  ceo: "조민정",
  bizNo: "407-10-93280",
  address: "서울특별시 성동구 서울숲2길 32-14, 지하1층 B102호 (성수동1가, 갤러리아 포레)",
};

export const SUBBRANDS = [
  { key: "CLUB", ko: "클럽", desc: "멤버십·셀럽 게임·커뮤니티가 모이는 피클박스의 중심", tint: "green" },
  { key: "HOUSE", ko: "하우스", desc: "서울숲 라운지와 프라이빗 코트에서 즐기는 하루", tint: "lime" },
  { key: "SEOUL", ko: "서울", desc: "관광·서울시 협업으로 서울에서만 만나는 피클볼", tint: "tangerine" },
  { key: "ACADEMY", ko: "아카데미", desc: "누구나 쉽게 시작하는 레슨과 코치 양성 프로그램", tint: "green" },
  { key: "TOUR", ko: "투어", desc: "코트를 넘어 떠나는 해외 피클볼 여행", tint: "tangerine" },
  { key: "PARTY", ko: "파티", desc: "브랜드 행사와 셀럽 파티로 이어지는 즐거움", tint: "lime" },
];
