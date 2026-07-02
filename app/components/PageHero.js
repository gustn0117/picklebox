import Ball from "./Ball";

// 하위 페이지 공통 상단 헤더 — 에디토리얼 넘버링 + 제목 + 리드.
export default function PageHero({ eyebrow, num, title, lead }) {
  return (
    <header className="pagehero">
      <div className="wrap">
        <div className="pagehero__head">
          <div className="eyebrow">{eyebrow}</div>
          {num && <span className="section__num">/ {num}</span>}
        </div>
        <h1 className="pagehero__title">{title}</h1>
        {lead && <p className="lead pagehero__lead">{lead}</p>}
        <span className="pagehero__ball" aria-hidden="true">
          <Ball body="#fff" dots="var(--green)" tail={false} />
        </span>
      </div>
    </header>
  );
}
