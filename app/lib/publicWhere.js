import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "./auth";

// 공개 페이지가 콘텐츠를 조회할 때 쓰는 공통 조건.
// - 평소: 노출 ON + 휴지통 아님 + (예약 없음 또는 예약 시각 지남)
// - 미리보기(관리자 로그인 + ?preview=1): 비공개·예약 항목도 함께 보여준다(휴지통은 제외)
export function publishedWhere() {
  return {
    visible: true,
    deletedAt: null,
    OR: [{ publishAt: null }, { publishAt: { lte: new Date() } }],
  };
}

// 관리자가 미리보기로 접근했는지 판정 (searchParams 는 페이지에서 전달)
export async function isPreview(searchParams) {
  const sp = await searchParams;
  const on = sp && (sp.preview === "1" || sp.preview === "true");
  if (!on) return false;
  try {
    const c = await cookies();
    return await verifyToken(c.get(COOKIE_NAME)?.value);
  } catch {
    return false;
  }
}

// 미리보기 여부에 따른 조회 조건
export const contentWhere = (preview) => (preview ? { deletedAt: null } : publishedWhere());
