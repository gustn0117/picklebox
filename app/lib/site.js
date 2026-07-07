// 사이트 전역 콘텐츠/링크 — 이후 자료가 채워지면 이 파일만 갱신하면 된다.
export const LINKS = {
  store: "https://smartstore.naver.com/joytennis",
  // 네이버 예약·문의 링크(네이버 플레이스). 예약·문의·오시는 길 버튼이 모두 이 링크로 연결된다.
  reserve: "https://naver.me/FCAfFuDm",
  instagram: [
    { handle: "@picklebox.official", url: "https://instagram.com/picklebox.official", label: "피클박스 공식" },
    { handle: "@tennis_cmj", url: "https://instagram.com/tennis_cmj", label: "조민정" },
    { handle: "@tennisfore", url: "https://instagram.com/tennisfore", label: "테니스포레" },
  ],
  youtube: "https://www.youtube.com/results?search_query=쫌치는언니",
  map: "https://naver.me/FCAfFuDm",
};

// 예약 링크 — reserve가 비어 있으면 인스타 DM으로 폴백.
export const reserveHref = LINKS.reserve || LINKS.instagram[0].url;

// 굿즈 판매처 — [URL]은 확보 후 교체.
export const SHOPS = [
  { name: "네이버 스마트스토어", url: LINKS.store },
  { name: "더카트", url: "" },
  { name: "테니스메트로", url: "" },
];

// 상단 내비게이션 — 레퍼런스와 동일 구성.
export const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About PICKLEBOX" },
  { href: "/events", label: "Events" },
  { href: "/founder", label: "Play with Minjung" },
  { href: "/community", label: "Global Community" },
  { href: "/partners", label: "Partners" },
  { href: "/journal", label: "Journal" },
  { href: "/visit", label: "Contact" },
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
  { key: "SEOUL", ko: "서울", desc: "K-피클볼 문화를 세계의 여행객과 도시생활자에게 소개하는 대표 스포츠 라이프스타일 브랜드", tint: "tangerine" },
  { key: "ACADEMY", ko: "아카데미", desc: "레슨, 게임 매칭, 입문클래스, 멤버십, 정기 리그가 운영되는 커뮤니티 프로그램", tint: "green" },
  { key: "TOUR", ko: "투어", desc: "코트를 넘어 떠나는 해외 피클볼 여행", tint: "tangerine" },
  { key: "PARTY", ko: "파티", desc: "브랜드 행사와 셀럽 파티로 이어지는 즐거움", tint: "lime" },
];
