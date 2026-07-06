import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import Arrow from "../components/Arrow";
import { LINKS, reserveHref } from "../lib/site";

export const metadata = {
  title: "Partners — PICKLEBOX",
  description: "브랜드·공간·셀럽·글로벌 파트너와 함께 만드는 피클볼 컬처. 제휴·협업 제안을 기다립니다.",
};

const TYPES = [
  { k: "Brand", ko: "브랜드 협업", p: "굿즈·팝업·컬래버 등 브랜드와 함께하는 컬처 프로젝트." },
  { k: "Space", ko: "공간 · 시설", p: "코트·라운지 공간 제휴 및 무인 스마트 클럽 파트너십." },
  { k: "Talent", ko: "셀럽 · 크리에이터", p: "셀럽·인플루언서와 함께하는 이벤트·콘텐츠 협업." },
  { k: "Global", ko: "글로벌", p: "해외 브랜드·커뮤니티와의 교류 및 피클볼 투어 파트너십." },
];

const WHY = [
  { h: "성장하는 시장", p: "전 세계에서 가장 빠르게 크는 라켓 스포츠. 국내 피클볼 씬의 초기 파트너가 되세요." },
  { h: "컬처 브랜딩", p: "운동을 넘어 셀럽·커뮤니티·컬처로 확장하는 브랜드와 함께 노출됩니다." },
  { h: "서울숲 거점", p: "갤러리아 포레라는 프리미엄 로케이션에서 오프라인 접점을 만듭니다." },
];

export default function Partners() {
  return (
    <>
      <Nav />
      <PageHero
        eyebrow="Partners"
        title="함께 만드는 피클볼 컬처."
        lead="피클박스는 브랜드·공간·셀럽·글로벌 파트너와 함께 서울의 새로운 스포츠 컬처를 만들어 갑니다."
      />

      <section className="section">
        <div className="wrap">
          <div className="section__head section__head--split">
            <div><div className="eyebrow">Partnership</div></div>
            <div><h2 className="title">이런 방식으로 함께합니다.</h2></div>
          </div>
          <div className="grid-2">
            {TYPES.map((t, i) => (
              <Reveal key={t.k} className="feat" delay={(i % 2) * 80}>
                <div className="feat__ico">{String(i + 1).padStart(2, "0")}</div>
                <h3>{t.k} · {t.ko}</h3>
                <p>{t.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap">
          <div className="section__head section__head--split">
            <div><div className="eyebrow">Why partner</div></div>
            <div><h2 className="title">지금 함께해야 하는 이유.</h2></div>
          </div>
          <div className="grid-3">
            {WHY.map((w, i) => (
              <Reveal key={w.h} className="feat" delay={(i % 3) * 70}>
                <div className="feat__ico">{String(i + 1).padStart(2, "0")}</div>
                <h3>{w.h}</h3>
                <p>{w.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section join">
        <div className="wrap">
          <Reveal className="join__card">
            <div>
              <div className="eyebrow" style={{ marginBottom: 20 }}>Partner with Us</div>
              <h2 className="join__card--en">Let&apos;s build it.</h2>
              <p>제휴·협업 제안을 남겨주시면 담당자가 검토 후 연락드립니다. 브랜드·공간·셀럽·글로벌 모두 환영합니다.</p>
            </div>
            <div className="join__actions">
              <a href={LINKS.instagram[0].url} target="_blank" rel="noopener" className="btn btn--lime">
                제휴 제안하기 <Arrow />
              </a>
              <a href={reserveHref} target="_blank" rel="noopener" className="btn btn--ghost">방문·상담</a>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
