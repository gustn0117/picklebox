import { db } from "./db";

// 그룹의 문구를 { key: value } 로 반환한다.
// 값이 비어 있으면 키를 생략해, 호출부의 기본 문구(폴백)가 그대로 쓰이게 한다.
export async function getCopy(group) {
  try {
    const rows = await db.siteCopy.findMany({ where: { group } });
    const map = {};
    for (const r of rows) {
      // 이미지는 빈 값도 보존한다. 관리자가 이미지를 제거한 상태와
      // 아직 관리자 항목이 생성되지 않은 상태를 구분하기 위해서다.
      if (r.kind === "image") map[r.key] = (r.value || "").trim();
      else if (r.value && r.value.trim()) map[r.key] = r.value;
    }
    return map;
  } catch {
    return {};
  }
}

// 이미지 단일 키는 "항목 없음 → fallback", "항목은 있으나 빈 값 → 제거"를 구분한다.
export async function getCopyImageValue(key, fallback = "") {
  try {
    const r = await db.siteCopy.findUnique({ where: { key } });
    return r ? String(r.value || "").trim() : fallback;
  } catch {
    return fallback;
  }
}

// 단일 키의 값(없으면 fallback). 페이지 제목(SEO) 등 한 값만 필요할 때.
export async function getCopyValue(key, fallback = "") {
  try {
    const r = await db.siteCopy.findUnique({ where: { key } });
    return r && r.value && r.value.trim() ? r.value : fallback;
  } catch {
    return fallback;
  }
}

// 여러 그룹을 한 번에(예: 페이지 문구 + 사이트 정보)
export async function getCopyMulti(groups) {
  try {
    const rows = await db.siteCopy.findMany({ where: { group: { in: groups } } });
    const map = {};
    for (const r of rows) {
      if (r.kind === "image") map[r.key] = (r.value || "").trim();
      else if (r.value && r.value.trim()) map[r.key] = r.value;
    }
    return map;
  } catch {
    return {};
  }
}

// 값이 있으면 그 값, 없으면 기본 문구
export const pick = (map, key, fallback) => (map && map[key]) || fallback;

// "한 줄에 하나씩" 목록 파싱. 각 줄을 sep("||")로 나눠 부분 배열로 돌려준다.
// 값이 비면 fallback(문자열 또는 배열)을 파싱한다.
export function pickList(map, key, fallback, sep = "||") {
  const raw = (map && map[key]) || fallback || "";
  return String(raw)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(sep).map((s) => s.trim()));
}

// 외부 링크 보정(렌더 시점) — http(s):// 없이 저장된 기존 값이 상대경로로 오인돼 404 나는 것 방지.
export function extHref(raw) {
  const u = String(raw ?? "").trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (/^\/\//.test(u)) return "https:" + u;
  if (/^(mailto:|tel:|#)/i.test(u)) return u;
  if (u.startsWith("/")) return u;
  return "https://" + u;
}

// 인스타 URL에서 핸들(@아이디) 추출 — 관리자에서 주소를 바꾸면 표시도 따라 바뀐다.
export function handleFromUrl(url, fallback = "") {
  if (!url) return fallback;
  const m = String(url).replace(/\/+$/, "").match(/([^/]+)$/);
  return m ? `@${m[1]}` : fallback;
}
