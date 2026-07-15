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

const SITE_COPY = [
  { key: "hero.tagline1", label: "홈 히어로 문구 1줄", value: "피클박스는 즐거움을 여는 선물상자입니다." },
  { key: "hero.tagline2", label: "홈 히어로 문구 2줄", value: "피클볼을 통해 운동, 만남, 휴식, 콘텐츠, 여행까지 이어지는 새로운 스포츠 라이프를 만듭니다." },
  { key: "hero.eyebrow", label: "홈 히어로 상단 라벨", value: "Premium Pickleball Club · Seoul" },
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
  // SiteCopy는 key 기준 upsert(항상 존재 보장, 기존 값은 유지)
  for (const c of SITE_COPY) {
    await db.siteCopy.upsert({ where: { key: c.key }, update: {}, create: c });
  }
  console.log(`  SiteCopy: ${SITE_COPY.length}건 보장(upsert)`);
  console.log("seed 완료.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
