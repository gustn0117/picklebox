import { revalidatePath } from "next/cache";

// 콘텐츠 종류별로 갱신할 공개 경로. (Phase 5에서 각 페이지가 DB를 읽도록 전환됨)
const PATHS = {
  banner: ["/", "/about", "/events"],
  events: ["/events"],
  academy: ["/about"],
  tours: ["/about"],
  goods: ["/", "/about"],
  journal: ["/journal"],
  photos: ["/"],
  copy: ["/"],
};

export function revalidateFor(slug) {
  const paths = PATHS[slug] || ["/"];
  for (const p of paths) {
    try {
      revalidatePath(p);
    } catch {
      // 렌더 컨텍스트 밖 호출 등은 무시
    }
  }
  // 푸터·네비 등 전역 요소 반영을 위해 루트 레이아웃도 갱신
  try {
    revalidatePath("/", "layout");
  } catch {}
}
