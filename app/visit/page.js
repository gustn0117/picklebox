import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import Arrow from "../components/Arrow";
import { LINKS, BUSINESS, reserveHref } from "../lib/site";

export const metadata = {
  title: "오시는 길 — PICKLEBOX",
  description: "서울숲 갤러리아 포레의 PICKLEBOX. 예약·지도·문의 안내.",
};

export default function Visit() {
  return (
    <>
      <Nav />
      <PageHero
        eyebrow="Visit Us"
        num="04"
        title="서울숲, 갤러리아 포레"
        lead="지하철 수인분당선 서울숲역 인근, 갤러리아 포레에서 만나요."
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="loc__grid">
            <div className="loc__info">
              <div className="loc__row">
                <span className="k">주소</span>
                <span className="v">{BUSINESS.address}</span>
              </div>
              <div className="loc__row">
                <span className="k">상호</span>
                <span className="v">{BUSINESS.name} · 대표 {BUSINESS.ceo}</span>
              </div>
              <div className="loc__row">
                <span className="k">영업</span>
                <span className="v">24시간 무인 운영 · [레슨/상담 운영시간]</span>
              </div>
              <div className="loc__row">
                <span className="k">문의</span>
                <span className="v">
                  인스타그램 <a href={LINKS.instagram[0].url} target="_blank" rel="noopener" style={{ color: "var(--green-deep)", fontWeight: 600 }}>{LINKS.instagram[0].handle}</a> DM
                </span>
              </div>

              <div className="loc__actions">
                <a href={reserveHref} target="_blank" rel="noopener" className="btn btn--primary">
                  예약하기 <Arrow />
                </a>
                <a href={LINKS.map} target="_blank" rel="noopener" className="btn btn--ghost">
                  네이버 지도로 열기
                </a>
                <a href={LINKS.store} target="_blank" rel="noopener" className="btn btn--ghost">
                  스마트스토어
                </a>
              </div>
            </div>
            <div className="loc__map">
              <iframe
                title="피클박스 오시는 길 지도"
                src="https://www.google.com/maps?q=서울특별시 성동구 서울숲2길 32-14 갤러리아 포레&z=16&hl=ko&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
