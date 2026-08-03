import { getCopyImageValue } from "../lib/copy";

// 하위 페이지 공통 상단 헤더 — 관리자의 공통 배경 이미지가 전 페이지에 적용된다.
export default async function PageHero({ eyebrow, num, title, lead }) {
  const bg = await getCopyImageValue("site.pageHeroBg", "/assets/hero-court-green-orange.webp");
  return (
    <header className="pagehero" style={{ backgroundImage: bg ? `url(${bg})` : "none" }}>
      <div className="wrap">
        <div className="pagehero__head">
          <div className="eyebrow">{eyebrow}</div>
          {num && <span className="section__num">/ {num}</span>}
        </div>
        {title && <h1 className="pagehero__title pagehero__title--ko">{title}</h1>}
        {lead && <p className="lead pagehero__lead">{lead}</p>}
      </div>
    </header>
  );
}
