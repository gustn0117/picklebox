import { sanitizeHtml } from "./sanitize";

// 관리자 CMS 모델 레지스트리 — 제네릭 CRUD API와 관리 UI가 공유하는 단일 설정.
// 모든 값은 직렬화 가능(함수 없음) → 서버 페이지에서 클라이언트 컴포넌트로 그대로 전달 가능.
//
// field.type: text | textarea | rich | url | image | select | videoIds | checkbox | number
// image 필드의 aspect: 자르기 팝업의 권장 비율
// slug = URL/식별자, prisma = PrismaClient 델리게이트 속성명.

export const MODELS = {
  banner: {
    slug: "banner", prisma: "banner", label: "배너", icon: "banner",
    ordered: true, hasVisible: true, canCreate: true, canDelete: true,
    titleKey: "title", subKey: "page",
    fields: [
      { key: "page", label: "페이지", type: "text", placeholder: "home / about / events …", required: true },
      { key: "imageUrl", label: "배너 이미지", type: "image", hint: "가로 1920×800 권장 · 넣어야 배너가 노출됩니다", aspect: 2.4 },
      { key: "title", label: "제목", type: "text" },
      { key: "subtitle", label: "부제목", type: "text" },
      { key: "linkUrl", label: "링크(선택)", type: "url" },
    ],
  },
  events: {
    slug: "events", prisma: "event", label: "이벤트", icon: "events",
    ordered: true, hasVisible: true, canCreate: true, canDelete: true,
    titleKey: "titleKo", subKey: "kind",
    fields: [
      { key: "kind", label: "구분", type: "select", options: [{ v: "lineup", t: "라인업" }, { v: "schedule", t: "일정" }], required: true },
      { key: "titleEn", label: "영문 제목", type: "text" },
      { key: "titleKo", label: "제목", type: "text", required: true },
      { key: "description", label: "설명", type: "rich" },
      { key: "period", label: "시기(선택)", type: "text", placeholder: "상반기 / 매월 / 상시 …" },
      { key: "imageUrl", label: "이미지(선택)", type: "image", hint: "가로 1600×900 권장 (16:9)", aspect: 16/9 },
    ],
  },
  academy: {
    slug: "academy", prisma: "academyProgram", label: "아카데미", icon: "academy",
    ordered: true, hasVisible: true, canCreate: true, canDelete: true,
    titleKey: "titleKo", subKey: "titleEn",
    fields: [
      { key: "titleEn", label: "영문 제목(선택)", type: "text" },
      { key: "titleKo", label: "프로그램명", type: "text", required: true },
      { key: "description", label: "설명", type: "rich" },
      { key: "imageUrl", label: "이미지(선택)", type: "image", hint: "가로 1600×1000 권장", aspect: 1.6 },
    ],
  },
  tours: {
    slug: "tours", prisma: "tour", label: "여행 상품", icon: "tours",
    ordered: true, hasVisible: true, canCreate: true, canDelete: true,
    titleKey: "title", subKey: "period",
    fields: [
      { key: "title", label: "상품명", type: "text", required: true },
      { key: "description", label: "상세 설명", type: "rich" },
      { key: "period", label: "기간(선택)", type: "text", placeholder: "예: 3박 4일 / 2026 봄" },
      { key: "schedule", label: "일정 (한 줄에 하나씩)", type: "textarea", placeholder: "1일차 — 인천 출발, 현지 도착\n2일차 — 오전 레슨, 오후 자유" },
      { key: "imageUrl", label: "대표 이미지", type: "image", hint: "가로 1600×900 권장 (16:9)", aspect: 16/9 },
      { key: "price", label: "가격(원) — 비우면 표시 안 됨", type: "number", placeholder: "예: 1290000" },
      { key: "bookingUrl", label: "예약 링크", type: "url" },
      { key: "linkUrl", label: "참고 링크(선택)", type: "url" },
    ],
  },
  goods: {
    slug: "goods", prisma: "goods", label: "굿즈", icon: "goods",
    ordered: true, hasVisible: true, canCreate: true, canDelete: true,
    titleKey: "name", subKey: "buyUrl",
    fields: [
      { key: "name", label: "상품명", type: "text", required: true },
      { key: "description", label: "설명(선택)", type: "rich" },
      { key: "imageUrl", label: "상품 이미지", type: "image", hint: "정사각형 800×800 권장 (1:1)", aspect: 1 },
      { key: "price", label: "가격(원) — 비우면 표시 안 됨", type: "number", placeholder: "예: 39000" },
      { key: "buyUrl", label: "구매 링크", type: "url" },
      { key: "soldOut", label: "품절 표시", type: "checkbox" },
    ],
  },
  partners: {
    slug: "partners", prisma: "partner", label: "파트너", icon: "partners",
    ordered: true, hasVisible: true, canCreate: true, canDelete: true,
    titleKey: "name", subKey: "linkUrl",
    fields: [
      { key: "name", label: "파트너명", type: "text", required: true },
      { key: "logoUrl", label: "로고", type: "image", hint: "가로 400×200 권장 · 배경 투명 PNG" },
      { key: "linkUrl", label: "링크(선택)", type: "url" },
      { key: "description", label: "설명(선택)", type: "textarea" },
    ],
  },
  journal: {
    slug: "journal", prisma: "journalPost", label: "저널", icon: "journal",
    ordered: true, hasVisible: true, canCreate: true, canDelete: true,
    titleKey: "title", subKey: "category",
    fields: [
      { key: "category", label: "카테고리", type: "text", placeholder: "Culture / Guide / Event …" },
      { key: "title", label: "제목", type: "text", required: true },
      { key: "type", label: "형태", type: "select", options: [{ v: "article", t: "기사 링크" }, { v: "video", t: "유튜브 영상" }, { v: "soon", t: "준비 중" }] },
      { key: "articleUrl", label: "기사 링크(형태=기사)", type: "url" },
      { key: "videoIds", label: "유튜브 영상 (형태=영상 · 여러 개는 줄바꿈)", type: "videoIds", placeholder: "유튜브 주소를 그대로 붙여넣으세요\nhttps://youtu.be/5QIzcd2lmPA?si=... → 자동으로 정리됩니다" },
      { key: "soon", label: "준비 중 배지", type: "checkbox" },
    ],
  },
  photos: {
    slug: "photos", prisma: "photo", label: "사진/갤러리", icon: "photos",
    ordered: true, hasVisible: true, canCreate: true, canDelete: true,
    titleKey: "caption", subKey: "album",
    fields: [
      { key: "imageUrl", label: "이미지", type: "image", required: true, hint: "가로 1200×900 권장 (4:3)", aspect: 4/3 },
      { key: "caption", label: "캡션(선택)", type: "text" },
      { key: "album", label: "분류(선택)", type: "text" },
    ],
  },
  copy: {
    slug: "copy", prisma: "siteCopy", label: "문구 · 사이트 정보", icon: "copy", grouped: true,
    ordered: false, hasVisible: false, canCreate: false, canDelete: false,
    titleKey: "label", subKey: "key",
    fields: [
      { key: "label", label: "이름", type: "text", readOnly: true },
      { key: "value", label: "문구", type: "textarea" },
    ],
  },
};

export const MODEL_LIST = Object.values(MODELS);

export function getModel(slug) {
  return MODELS[slug] || null;
}

// 유튜브 주소를 어떤 형태로 붙여넣어도 11자리 영상 ID만 뽑아낸다.
// 지원: 순수 ID / youtu.be/ID / watch?v=ID / embed·shorts·live/ID / 뒤에 ?si=·&t= 등이 붙은 경우
export function extractYouTubeId(raw) {
  const s = String(raw || "").trim();
  if (!s) return null;
  let m = s.match(/[?&]v=([A-Za-z0-9_-]{11})/); // watch?v=ID
  if (m) return m[1];
  m = s.match(/(?:youtu\.be\/|\/embed\/|\/shorts\/|\/live\/)([A-Za-z0-9_-]{11})/); // youtu.be/ID 등
  if (m) return m[1];
  m = s.match(/([A-Za-z0-9_-]{11})/); // 그 외: 첫 11자리(뒤에 &t 같은 꼬리표가 붙어도 안전)
  return m ? m[1] : null;
}

// 폼 값 → DB 저장값 강제 변환(필드 타입 기준).
export function coerceValue(field, raw) {
  if (field.type === "rich") return sanitizeHtml(raw);
  if (field.type === "number") {
    const n = parseInt(String(raw ?? "").replace(/[^0-9-]/g, ""), 10);
    return Number.isFinite(n) ? n : null;
  }
  if (field.type === "checkbox") return raw === true || raw === "true" || raw === "on" || raw === 1;
  if (field.type === "videoIds") {
    const list = Array.isArray(raw) ? raw : String(raw || "").split(/[\s,]+/);
    const ids = list.map(extractYouTubeId).filter(Boolean);
    return JSON.stringify([...new Set(ids)]); // 중복 제거
  }
  const s = raw == null ? "" : String(raw);
  return s;
}
