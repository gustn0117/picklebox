// 현재 사이트에 하드코딩된 콘텐츠를 DB로 이관하는 seed.
// 각 테이블은 "비어있을 때만" 채운다 → 재실행/재배포해도 기존 데이터 안전.
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

const EVENTS = [
  // 라인업
  { kind: "lineup", titleEn: "Celebrity Match", titleKo: "셀럽 매치", description: "방송인·인플루언서와 함께하는 이벤트 매치. 관전과 참여를 동시에.", sortOrder: 0 },
  { kind: "lineup", titleEn: "Open Tournament", titleKo: "오픈 토너먼트", description: "레벨별로 겨루는 정식 토너먼트. 초보부터 상급까지 누구나.", sortOrder: 1 },
  { kind: "lineup", titleEn: "PICKLEBOX Party", titleKo: "피클박스 파티", description: "경기 후 이어지는 브랜드 파티. 음악·굿즈·네트워킹까지.", sortOrder: 2 },
  // 일정
  { kind: "schedule", titleKo: "Seoul Celebrity Open", description: "광나루 · 셀럽 초청 오픈 매치 · [일정·라인업 공개 예정]", period: "상반기", sortOrder: 0 },
  { kind: "schedule", titleKo: "Monthly Open Match", description: "정기 오픈 매치 · 레벨별 참가 · 커뮤니티 랭킹", period: "매월", sortOrder: 1 },
  { kind: "schedule", titleKo: "Pickle Party Night", description: "브랜드 파티 · 음악 · 네트워킹", period: "수시", sortOrder: 2 },
];

const JOURNAL = [
  { category: "Culture", title: "피클볼이 서울의 새로운 컬처가 되기까지", type: "article", articleUrl: "https://v.daum.net/v/32pHevoMy5", sortOrder: 0 },
  { category: "Guide", title: "처음 피클볼, 5분이면 시작하는 법", type: "video", videoIds: JSON.stringify(["5QIzcd2lmPA"]), sortOrder: 1 },
  { category: "Event", title: "셀럽 피클볼 오픈 비하인드", type: "video", videoIds: JSON.stringify(["kXbj82FYCEg", "MmUg3iDA9gE", "iZNW57gY7PU"]), sortOrder: 2 },
  { category: "Interview", title: "조민정 대표가 그리는 피클박스", type: "video", videoIds: JSON.stringify(["_xoRmKzH21M"]), sortOrder: 3 },
  { category: "Goods", title: "패들 고르는 법 — 입문자를 위한 가이드", type: "soon", soon: true, sortOrder: 4 },
];

const GOODS = [
  { name: "네이버 스마트스토어", description: "피클박스 공식 스마트스토어", buyUrl: "https://smartstore.naver.com/joytennis", sortOrder: 0 },
  { name: "더카트", description: "더카트 브랜드관", buyUrl: "https://www.thecart.co.kr/Brand/501020224051", sortOrder: 1 },
  { name: "테니스메트로", description: "테니스메트로 브랜드관", buyUrl: "https://www.tennismetro.co.kr/goods/goods_list.php?brandCd=034", sortOrder: 2 },
];

const ACADEMY = [
  { titleEn: "Academy", titleKo: "아카데미", description: "레슨, 게임 매칭, 입문클래스, 멤버십, 정기 리그가 운영되는 커뮤니티 프로그램", sortOrder: 0 },
];

const TOURS = [
  { title: "해외 피클볼 투어", description: "코트를 넘어 떠나는 해외 피클볼 여행", sortOrder: 0 },
];

const BANNERS = [
  { page: "home", title: "PICKLEBOX", subtitle: "Open the Box, Play the Joy.", sortOrder: 0 },
];

// 사이트 전역 정보 + 전 페이지 문구. group 으로 묶어 관리자에서 탭으로 보여준다.
// value 는 현재 사이트에 나가는 실제 문구와 동일하게 둔다(바꿔도 폴백이 있어 안전).
const T = (key, label, value, extra = {}) => ({ key, label, value, kind: "text", ...extra });
const TA = (key, label, value) => T(key, label, value, { kind: "textarea" });
const URL_ = (key, label, value) => T(key, label, value, { kind: "url" });
const LIST = (key, label, value) => T(key, label, value, { kind: "list" }); // 한 줄에 하나씩
const IMG = (key, label, value) => T(key, label, value, { kind: "image" });

const SITE_COPY = [
  // ── 사이트 정보(전역)
  ...[
    URL_("site.reserveUrl", "예약 링크(모든 예약 버튼)", "https://naver.me/FCAfFuDm"),
    URL_("site.mapUrl", "지도 링크", "https://naver.me/FCAfFuDm"),
    URL_("site.storeUrl", "스마트스토어 링크", "https://smartstore.naver.com/joytennis"),
    URL_("site.instagram1", "인스타그램 ① 공식", "https://instagram.com/picklebox.official"),
    URL_("site.instagram2", "인스타그램 ② 조민정", "https://instagram.com/tennis_cmj"),
    URL_("site.instagram3", "인스타그램 ③ 테니스포레", "https://instagram.com/tennisfore"),
    URL_("site.youtube", "유튜브 링크", "https://www.youtube.com/results?search_query=쫌치는언니"),
    T("site.address", "주소", "서울특별시 성동구 서울숲2길 32-14, 지하1층 B102호 (성수동1가, 갤러리아 포레)"),
    T("site.hours", "영업시간", "24시간 무인 운영"),
    T("site.email", "이메일(제휴 문의)", "minjung93@naver.com"),
    T("site.phone", "전화번호", ""),
    T("site.bizName", "상호(사업자)", "테니스포레"),
    T("site.bizCeo", "대표자명", "조민정"),
    T("site.bizNo", "사업자등록번호", "407-10-93280"),
    TA("site.footerTagline", "푸터 소개 문구", "피클볼을 치고, 웃고, 연결되며 일상에 즐거움을 선물하는 공간. Play, Smile, Connect."),
  ].map((c, i) => ({ ...c, group: "site", sortOrder: i })),

  // ── 홈
  ...[
    T("home.hero.eyebrow", "히어로 상단 라벨", "Premium Pickleball Club · Seoul"),
    T("home.hero.accent", "히어로 영문 문구", "Open the Box, Play the Joy."),
    T("home.hero.tagline1", "히어로 문구 1줄", "피클박스는 즐거움을 여는 선물상자입니다."),
    TA("home.hero.tagline2", "히어로 문구 2줄", "피클볼을 통해 운동, 만남, 휴식, 콘텐츠, 여행까지 이어지는 새로운 스포츠 라이프를 만듭니다."),
    T("home.why.title", "‘왜 피클박스’ 제목", "누구나 쉽게,\n운동을 넘어 컬처까지."),
    T("home.how.title", "‘이용 방법’ 제목", "예약하고, 들어와,\n바로 플레이."),
    T("home.gallery.title", "갤러리 섹션 제목", "피클박스의 순간들."),
    T("home.cta.title", "하단 배너 제목", "Play the Culture."),
    TA("home.cta.desc", "하단 배너 설명", "피클볼이 처음이어도 괜찮습니다. 방문·예약 문의를 남겨주시면 코트와 레슨, 멤버십까지 편하게 안내해 드립니다."),
    T("home.cta.button", "하단 배너 버튼명", "예약하기"),
    T("home.cta.button2", "하단 배너 보조 버튼명", "오시는 길"),
    // 이미지
    IMG("home.hero.bg", "첫 화면 배경 이미지", ""),
    IMG("home.bento.about.img", "둘러보기 · About 카드 배경", ""),
    IMG("home.bento.visit.img", "둘러보기 · Visit 카드 배경", ""),
    // 매니페스토 · 티커
    TA("home.manifesto", "매니페스토 문구", "운동을 넘어,\n사람을 잇다. 서울숲에서 시작하는 새로운 피클볼 컬처."),
    LIST("home.ticker", "상단 흐르는 띠 (한 줄에 하나씩)", "Now Open\n서울숲 · 갤러리아 포레\n24시간 무인 스마트 클럽\n예약 오픈"),
    // 지표 4개 (숫자 | 단위 | 라벨)
    LIST("home.stats", "숫자 지표 (숫자 | 단위 | 라벨, 한 줄에 하나씩)", "45 | MIN | 한 게임의 온도\n6 |  | 서비스 브랜드\n24 | H | 무인 스마트 운영\n100 | % | 초보 환영"),
    // 왜 피클박스 카드 (제목 | 설명)
    LIST("home.why.items", "‘왜 피클박스’ 카드 (제목 | 설명, 한 줄에 하나씩)",
      "24시간 무인 스마트 클럽 | 언제든 문을 열고 들어와 나만의 시간에 피클볼을 즐기세요. 예약부터 입장까지 스마트하게.\n서울숲 라운지 | 갤러리아 포레의 프라이빗 코트와 라운지에서 보내는 하루. 도심 속 프리미엄 컬처 공간.\n레슨 · 커뮤니티 | 처음이어도 쉽게 배우고, 좋은 사람들과 자연스럽게 연결됩니다. 코치와 동호인이 함께.\n여행 · 컬처 | 코트를 넘어 서울 관광과 해외 피클볼 투어까지. 피클볼로 여는 새로운 라이프스타일."),
    // 이용 방법 3단계
    LIST("home.how.items", "이용 방법 단계 (제목 | 설명, 한 줄에 하나씩)",
      "예약 | 네이버 예약으로 원하는 시간을 선택하세요. 몇 번의 터치면 코트가 준비됩니다.\n입장 | 무인 스마트 출입으로 24시간 언제든. 기다림 없이 바로 나만의 코트로.\n플레이 | 패들과 공은 준비되어 있습니다. 처음이라면 레슨과 함께 첫날부터 랠리를."),
    // 둘러보기 카드 설명
    T("home.bento.about.desc", "둘러보기 · About 카드 설명", "피클박스는 즐거움을 여는 선물상자입니다."),
    T("home.bento.pickleball.desc", "둘러보기 · Pickleball 카드 설명", "누구나 5분이면 배우는, 요즘 가장 빠르게 크는 라켓 스포츠."),
    T("home.bento.founder.desc", "둘러보기 · Founder 카드 설명", "테니스에서 피클볼로 — 조민정 대표가 그리는 이야기."),
    T("home.bento.visit.desc", "둘러보기 · Visit 카드 설명", "서울숲 갤러리아 포레 · 예약·지도·문의를 한 번에. 24시간 언제든 문을 여는 스마트 클럽."),
    // 둘러보기 카드 제목(줄바꿈 가능)
    TA("home.bento.about.title", "둘러보기 · About 카드 제목", "About\nPICKLEBOX"),
    TA("home.bento.pickleball.title", "둘러보기 · Pickleball 카드 제목", "What is\nPickleball"),
    TA("home.bento.founder.title", "둘러보기 · Founder 카드 제목", "The\nFounder"),
    T("home.bento.visit.title", "둘러보기 · Visit 카드 제목", "Visit Us"),
  ].map((c, i) => ({ ...c, group: "home", sortOrder: i })),

  // ── 소개
  ...[
    T("about.story.title", "브랜드 스토리 제목", "기대하지 못했던 선물상자를 열었을 때처럼."),
    TA("about.story.p1", "브랜드 스토리 본문 1", "피클볼 한 게임에는 운동의 즐거움만 있는 것이 아닙니다. 처음 만난 사람과 인사를 나누고, 공을 주고받으며 함께 웃고, 일상의 스트레스를 잠시 내려놓는 시간이 담겨 있습니다."),
    TA("about.story.p2", "브랜드 스토리 본문 2", "PICKLEBOX에 들어오는 순간 설렘이 시작되고, 코트 위에서는 웃음과 에너지가 쌓이며, 돌아갈 때는 좋은 기억과 새로운 인연을 담아갈 수 있습니다."),
    TA("about.story.quote", "브랜드 스토리 인용 문구", "피클볼을 치고, 웃고, 연결되며\n일상에 즐거움을 선물하는 공간."),
    T("about.why.title", "‘왜 피클볼’ 제목", "미국 1위 레저스포츠 상륙!\n5분 만에 중독되는 이것?"),
    T("about.services.title", "서비스 섹션 제목", "하나의 상자, 여섯 가지 즐거움"),
    TA("about.services.lead", "서비스 섹션 설명", "멤버십부터 여행까지 — PICKLEBOX의 여섯 브랜드가 피클볼을 중심으로 한 라이프스타일을 완성합니다."),
    T("about.academy.title", "아카데미 섹션 제목", "아카데미 프로그램"),
    T("about.tour.title", "투어 섹션 제목", "피클볼 투어"),
    T("about.values.title", "가치 섹션 제목", "피클박스가 지키는 세 가지."),
    T("about.timeline.title", "연혁 섹션 제목", "피클박스가 걸어온 길."),
    T("about.cta.title", "하단 배너 제목", "피클박스가 궁금하다면,\n직접 만나보세요."),
    TA("about.cta.desc", "하단 배너 설명", "서울숲 갤러리아 포레에서 코트와 레슨, 커뮤니티를 경험할 수 있습니다."),
    LIST("about.subbrands", "6개 서비스 브랜드 (영문 | 한글 | 설명, 한 줄에 하나씩)",
      "CLUB | 클럽 | 멤버십·셀럽 게임·커뮤니티가 모이는 피클박스의 중심\nHOUSE | 하우스 | 서울숲 라운지와 프라이빗 코트에서 즐기는 하루\nSEOUL | 서울 | K-피클볼 문화를 세계의 여행객과 도시생활자에게 소개하는 대표 스포츠 라이프스타일 브랜드\nACADEMY | 아카데미 | 레슨, 게임 매칭, 입문클래스, 멤버십, 정기 리그가 운영되는 커뮤니티 프로그램\nTOUR | 투어 | 코트를 넘어 떠나는 해외 피클볼 여행\nPARTY | 파티 | 브랜드 행사와 셀럽 파티로 이어지는 즐거움"),
  ].map((c, i) => ({ ...c, group: "about", sortOrder: i })),

  // ── 이벤트
  ...[
    T("events.hero.title", "히어로 제목", "코트 위의 축제, 피클박스 이벤트."),
    TA("events.hero.lead", "히어로 설명", "셀럽·커뮤니티·컬처가 한 코트에서 만납니다. 셀럽 매치부터 오픈 토너먼트, 피클볼까지 — 서울의 새로운 스포츠 엔터테인먼트."),
    T("events.next.title", "NEXT UP 제목", "Seoul Celebrity\nPickleball Open"),
    T("events.next.meta", "NEXT UP 부가정보", "광나루 · 서울 / [2026 상반기]"),
    TA("events.next.desc", "NEXT UP 설명", "셀럽과 동호인이 한 코트에서 만나는 서울 최대 규모의 셀럽 피클볼 오픈. 참가 신청과 일정은 순차 공개됩니다."),
    T("events.next.button", "NEXT UP 버튼명", "참가·문의하기"),
    T("events.lineup.title", "라인업 섹션 제목", "이렇게 즐기는 이벤트."),
    T("events.schedule.title", "일정 섹션 제목", "다가오는 일정."),
    IMG("events.next.img", "NEXT UP 배경 이미지", ""),
    T("events.cta.title", "하단 배너 제목", "Play the Culture."),
    TA("events.cta.desc", "하단 배너 설명", "이벤트 참가·초청·제휴 문의를 남겨주시면 순차 안내해 드립니다."),
  ].map((c, i) => ({ ...c, group: "events", sortOrder: i })),

  // ── 저널
  ...[
    T("journal.hero.title", "히어로 제목", "피클박스 저널."),
    TA("journal.hero.lead", "히어로 설명", "피클볼 컬처와 입문 가이드, 이벤트 비하인드까지 — 피클박스가 전하는 이야기."),
    T("journal.latest.title", "목록 섹션 제목", "기사와 영상으로 만나는 피클박스."),
    T("journal.cta.title", "하단 배너 제목", "Follow the story."),
    TA("journal.cta.desc", "하단 배너 설명", "새 소식은 인스타그램과 유튜브에서 가장 먼저 전해드립니다."),
  ].map((c, i) => ({ ...c, group: "journal", sortOrder: i })),

  // ── 파트너
  ...[
    T("partners.hero.title", "히어로 제목", "함께 만드는 피클볼 컬처."),
    TA("partners.hero.lead", "히어로 설명", "피클박스는 브랜드·공간·셀럽·글로벌 파트너와 함께 서울의 새로운 스포츠 컬처를 만들어 갑니다."),
    T("partners.types.title", "협업 방식 섹션 제목", "이런 방식으로 함께합니다."),
    T("partners.why.title", "‘함께해야 하는 이유’ 제목", "지금 함께해야 하는 이유."),
    T("partners.list.title", "파트너사 섹션 제목", "함께하는 파트너"),
    T("partners.cta.title", "하단 배너 제목", "Let’s build it."),
    TA("partners.cta.desc", "하단 배너 설명", "제휴·협업 제안을 남겨주시면 담당자가 검토 후 연락드립니다. 브랜드·공간·셀럽·글로벌 모두 환영합니다."),
    T("partners.cta.button", "제휴 제안 버튼명", "제휴 제안하기"),
  ].map((c, i) => ({ ...c, group: "partners", sortOrder: i })),

  // ── 커뮤니티
  ...[
    T("community.hero.title", "히어로 제목", "서울에서 세계로, 피클박스 커뮤니티."),
    TA("community.hero.lead", "히어로 설명", "피클볼은 혼자여도 함께가 됩니다. 레벨별 매칭과 정기 모임, 글로벌 교류로 코트 위의 인연을 잇습니다."),
    T("community.a.title", "첫 섹션 제목", "코트가 곧 커뮤니티입니다."),
    T("community.b.title", "참여 방법 제목", "참여는 세 단계면 충분해요."),
  ].map((c, i) => ({ ...c, group: "community", sortOrder: i })),

  // ── 대표
  ...[
    T("founder.hero.title", "히어로 제목", "테니스에서 피클볼로, 즐거움을 잇다."),
    TA("founder.hero.lead", "히어로 설명", "라켓 하나로 사람과 사람을 연결해 온 조민정 대표가 피클박스를 시작한 이유."),
    T("founder.a.title", "첫 섹션 제목", "코트 위의 즐거움을, 더 많은 사람에게."),
    TA("founder.a.lead", "첫 섹션 소개 문구", "오랜 시간 라켓 스포츠와 함께해 온 조민정 대표는, 피클볼이 가진 ‘쉽게 배우고 함께 웃는’ 힘에 매료되어 피클박스를 시작했습니다."),
    T("founder.b.title", "두 번째 섹션 제목", "운동을 넘어, 사람을 연결합니다."),
    IMG("founder.photo", "대표 프로필 사진", ""),
    LIST("founder.career", "대표 약력 (한 줄에 하나씩)",
      "쫌치는언니(유튜브) 운영 · 테니스/피클볼 코치\n전 대한테니스협회 이사\nITF(국제테니스연맹) Level 1 Coaching 자격증\nITF(국제테니스연맹) Level 2 Coaching 이수\n명지대학교 졸업\n2025 제2회 오크밸리 피클볼대회 우승\n2025 피클볼 일본 Federation 우승 · 준우승"),
    TA("founder.b.body", "철학 섹션 본문", "피클박스가 만들고 싶은 것은 단순한 운동 공간이 아닙니다. 처음 온 사람도 편하게 어울리고, 좋은 사람들과 다시 만나고 싶어지는 곳 — 코트 위의 작은 즐거움이 일상의 활력이 되는 문화를 만들어 갑니다."),
    T("founder.channels.title", "채널 섹션 제목", "대표의 이야기, 더 가까이"),
    T("founder.cta.title", "하단 배너 제목", "대표에게 직접\n물어보고 싶다면."),
    TA("founder.cta.desc", "하단 배너 설명", "레슨·멤버십·방문 문의를 남겨주시면 편하게 안내해 드립니다."),
  ].map((c, i) => ({ ...c, group: "founder", sortOrder: i })),

  // ── 피클볼이란
  ...[
    T("pickleball.hero.title", "히어로 제목", "테니스 · 배드민턴 · 탁구를 하나로, 피클볼."),
    TA("pickleball.hero.lead", "히어로 설명", "작은 코트에서 가벼운 공과 패들로 즐기는 라켓 스포츠. 규칙이 쉽고 부담이 적어 누구나 첫날부터 랠리를 이어갈 수 있습니다."),
    T("pickleball.basics.title", "기본 섹션 제목", "이렇게 즐깁니다"),
    LIST("pickleball.basics", "기본 카드 (제목 | 설명, 한 줄에 하나씩)",
      "패들과 플라스틱 공 | 구멍 뚫린 가벼운 플라스틱 공과 나무·카본 패들로 즐깁니다. 공이 천천히 날아 초보도 쉽게 랠리를 이어갈 수 있어요.\n배드민턴 크기 코트 | 테니스보다 훨씬 작은 배드민턴 규격 코트에서 단식·복식으로 진행합니다. 넓게 뛰지 않아 체력 부담이 적습니다.\n쉬운 규칙 | 서브는 아래에서 위로, 네트 앞 '키친' 구역만 기억하면 끝. 5분이면 규칙을 익히고 바로 경기를 시작할 수 있습니다."),
    T("pickleball.start.title", "시작 섹션 제목", "오늘 처음이어도, 3단계면 충분해요."),
    LIST("pickleball.start", "시작 단계 (제목 | 설명, 한 줄에 하나씩)",
      "코트 예약 | 피클박스 코트를 예약하세요. 패들과 공은 준비되어 있어 몸만 오시면 됩니다.\n규칙 익히기 | 서브·키친·점수만 알면 끝. 레슨과 함께라면 5분이면 경기를 시작할 수 있습니다.\n첫 랠리 | 복식으로 함께 치면 더 재밌습니다. 웃고 떠들다 보면 어느새 한 게임이 끝나 있어요."),
    T("pickleball.faq.title", "FAQ 섹션 제목", "자주 묻는 질문"),
    LIST("pickleball.faq.items", "자주 묻는 질문 (질문 | 답변, 한 줄에 하나씩)",
      "운동을 안 해도 할 수 있나요? | 네. 격한 움직임이 적어 체력 부담이 적습니다. 남녀노소 누구나 가볍게 시작하기 좋은 생활 스포츠예요.\n테니스랑 뭐가 다른가요? | 코트가 훨씬 작고 공이 느리게 날아 진입이 쉽습니다. 넓게 뛰지 않아도 랠리가 오래 이어져 초보도 금방 재미를 느껴요.\n장비를 꼭 사야 하나요? | 처음엔 클럽에 비치된 장비로 충분합니다. 재미가 붙으면 스마트스토어에서 나만의 패들을 골라보세요.\n혼자 가도 즐길 수 있나요? | 네. 레슨과 커뮤니티를 통해 함께 칠 사람을 자연스럽게 만날 수 있습니다. 복식은 넷이 함께 즐기기 좋아요."),
    T("pickleball.cta.title", "하단 배너 제목", "처음이신가요?\n피클박스에서 시작하세요."),
    TA("pickleball.cta.desc", "하단 배너 설명", "패들과 공은 준비되어 있습니다. 레슨과 함께라면 오늘 처음이어도 바로 경기를 즐길 수 있어요."),
  ].map((c, i) => ({ ...c, group: "pickleball", sortOrder: i })),

  // ── 오시는 길
  ...[
    T("visit.hero.title", "히어로 제목", "서울숲, 갤러리아 포레"),
    TA("visit.hero.lead", "히어로 설명", "지하철 수인분당선 서울숲역 인근, 갤러리아 포레에서 만나요."),
    T("visit.notice.title", "안내 섹션 제목", "방문 전, 이것만 알아두세요."),
    T("visit.faq.title", "FAQ 섹션 제목", "자주 묻는 질문"),
    T("visit.hours", "영업 안내 문구", "24시간 무인 운영 · [레슨/상담 운영시간]"),
    LIST("visit.access", "방문 안내 (제목 | 설명, 한 줄에 하나씩)",
      "대중교통 | 수인분당선 서울숲역 [도보 N분]. 성수동 갤러리아 포레 지하 1층 B102호.\n주차 | 갤러리아 포레 주차장 이용 가능. [주차 요금·등록 안내].\n편의시설 | 코트 · 라운지 · [샤워/탈의/락커 등 편의시설 안내].\n운영 | 24시간 무인 운영. 레슨·상담은 [운영시간] 별도 안내."),
    LIST("visit.faq.items", "자주 묻는 질문 (질문 | 답변, 한 줄에 하나씩)",
      "처음인데 장비가 없어도 되나요? | 네, 패들과 공은 클럽에 준비되어 있습니다. 편한 운동복과 실내 운동화만 챙겨 오시면 됩니다.\n무인인데 어떻게 입장하나요? | 네이버 예약 후 스마트 출입 방법을 안내해 드립니다. 예약한 시간에 맞춰 24시간 언제든 입장할 수 있습니다. [출입 방식 상세]\n피클볼이 처음이에요. 배울 수 있나요? | 물론입니다. ACADEMY 레슨으로 규칙부터 랠리까지 첫날에 익힐 수 있습니다. 인스타 DM 또는 예약으로 문의해 주세요.\n몇 명이 함께 이용할 수 있나요? | 단식 2인, 복식 4인까지 즐기기 좋습니다. 커뮤니티·모임 이용은 [단체 안내]를 참고해 주세요."),
  ].map((c, i) => ({ ...c, group: "visit", sortOrder: i })),

  // ── 굿즈 페이지
  ...[
    T("goods.hero.title", "히어로 제목", "피클박스 굿즈."),
    TA("goods.hero.lead", "히어로 설명", "코트 위에서도, 일상에서도. 피클박스가 고른 피클볼 굿즈를 만나보세요."),
    T("goods.empty", "상품이 없을 때 문구", "준비 중입니다. 곧 새로운 굿즈로 찾아뵙겠습니다."),
  ].map((c, i) => ({ ...c, group: "goods", sortOrder: i })),

  // ── 투어 페이지
  ...[
    T("tours.hero.title", "히어로 제목", "피클볼 투어."),
    TA("tours.hero.lead", "히어로 설명", "코트를 넘어 떠나는 여행. 피클볼과 함께하는 특별한 일정으로 안내합니다."),
    T("tours.empty", "상품이 없을 때 문구", "준비 중입니다. 곧 새로운 투어로 찾아뵙겠습니다."),
  ].map((c, i) => ({ ...c, group: "tours", sortOrder: i })),
];

async function seedIfEmpty(name, delegate, rows, createFn) {
  const count = await delegate.count();
  if (count > 0) {
    console.log(`  ${name}: 이미 ${count}건 → 건너뜀`);
    return;
  }
  for (const row of rows) await (createFn ? createFn(row) : delegate.create({ data: row }));
  console.log(`  ${name}: ${rows.length}건 생성`);
}

async function main() {
  console.log("seed 시작…");
  await seedIfEmpty("Event", db.event, EVENTS);
  await seedIfEmpty("JournalPost", db.journalPost, JOURNAL);
  await seedIfEmpty("Goods", db.goods, GOODS);
  await seedIfEmpty("AcademyProgram", db.academyProgram, ACADEMY);
  await seedIfEmpty("Tour", db.tour, TOURS);
  await seedIfEmpty("Banner", db.banner, BANNERS);
  // 구버전 키 → 신버전 키로 값 이관(관리자에서 수정한 문구 보존)
  const RENAMED = {
    "hero.eyebrow": "home.hero.eyebrow",
    "hero.tagline1": "home.hero.tagline1",
    "hero.tagline2": "home.hero.tagline2",
  };
  for (const [oldKey, newKey] of Object.entries(RENAMED)) {
    const old = await db.siteCopy.findUnique({ where: { key: oldKey } });
    if (!old) continue;
    const def = SITE_COPY.find((c) => c.key === newKey);
    if (old.value && old.value.trim() && def) def.value = old.value; // 기존 값 승계
    await db.siteCopy.delete({ where: { key: oldKey } });
    console.log(`  SiteCopy: ${oldKey} → ${newKey} 값 이관`);
  }

  // SiteCopy는 key 기준 upsert. 메타(그룹·라벨·형태·순서)만 갱신하고 value(수정한 문구)는 보존.
  for (const c of SITE_COPY) {
    await db.siteCopy.upsert({
      where: { key: c.key },
      update: { group: c.group, label: c.label, kind: c.kind, sortOrder: c.sortOrder },
      create: c,
    });
  }
  console.log(`  SiteCopy: ${SITE_COPY.length}건 보장(upsert · 기존 문구 유지)`);
  console.log("seed 완료.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
