import { db } from "./db";

// 그룹의 문구를 { key: value } 로 반환한다.
// 값이 비어 있으면 키를 생략해, 호출부의 기본 문구(폴백)가 그대로 쓰이게 한다.
export async function getCopy(group) {
  try {
    const rows = await db.siteCopy.findMany({ where: { group } });
    const map = {};
    for (const r of rows) if (r.value && r.value.trim()) map[r.key] = r.value;
    return map;
  } catch {
    return {};
  }
}

// 여러 그룹을 한 번에(예: 페이지 문구 + 사이트 정보)
export async function getCopyMulti(groups) {
  try {
    const rows = await db.siteCopy.findMany({ where: { group: { in: groups } } });
    const map = {};
    for (const r of rows) if (r.value && r.value.trim()) map[r.key] = r.value;
    return map;
  } catch {
    return {};
  }
}

// 값이 있으면 그 값, 없으면 기본 문구
export const pick = (map, key, fallback) => (map && map[key]) || fallback;

// 인스타 URL에서 핸들(@아이디) 추출 — 관리자에서 주소를 바꾸면 표시도 따라 바뀐다.
export function handleFromUrl(url, fallback = "") {
  if (!url) return fallback;
  const m = String(url).replace(/\/+$/, "").match(/([^/]+)$/);
  return m ? `@${m[1]}` : fallback;
}
