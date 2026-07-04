// 하위 페이지 공통 상단 헤더 — 넘버링 + 제목 + 리드 (다크).
export default function PageHero({ eyebrow, num, title, lead }) {
  return (
    <header className="pagehero">
      <div className="wrap">
        <div className="pagehero__head">
          <div className="eyebrow">{eyebrow}</div>
          {num && <span className="section__num">/ {num}</span>}
        </div>
        <h1 className="pagehero__title pagehero__title--ko">{title}</h1>
        {lead && <p className="lead pagehero__lead">{lead}</p>}
      </div>
    </header>
  );
}
