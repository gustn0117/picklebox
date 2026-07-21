import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import { getCopy, pick } from "../lib/copy";
import Arrow from "../components/Arrow";
import { LINKS, BUSINESS, reserveHref } from "../lib/site";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "오시는 길 — PICKLEBOX",
  description: "서울숲 갤러리아 포레의 PICKLEBOX. 예약·지도·문의 안내.",
};

const ACCESS = [
  { h: "대중교통", p: "수인분당선 서울숲역 [도보 N분]. 성수동 갤러리아 포레 지하 1층 B102호." },
  { h: "주차", p: "갤러리아 포레 주차장 이용 가능. [주차 요금·등록 안내]." },
  { h: "편의시설", p: "코트 · 라운지 · [샤워/탈의/락커 등 편의시설 안내]." },
  { h: "운영", p: "24시간 무인 운영. 레슨·상담은 [운영시간] 별도 안내." },
];

const FAQ = [
  { q: "처음인데 장비가 없어도 되나요?", a: "네, 패들과 공은 클럽에 준비되어 있습니다. 편한 운동복과 실내 운동화만 챙겨 오시면 됩니다." },
  { q: "무인인데 어떻게 입장하나요?", a: "네이버 예약 후 스마트 출입 방법을 안내해 드립니다. 예약한 시간에 맞춰 24시간 언제든 입장할 수 있습니다. [출입 방식 상세]" },
  { q: "피클볼이 처음이에요. 배울 수 있나요?", a: "물론입니다. ACADEMY 레슨으로 규칙부터 랠리까지 첫날에 익힐 수 있습니다. 인스타 DM 또는 예약으로 문의해 주세요." },
  { q: "몇 명이 함께 이용할 수 있나요?", a: "단식 2인, 복식 4인까지 즐기기 좋습니다. 커뮤니티·모임 이용은 [단체 안내]를 참고해 주세요." },
];

export default async function Visit() {
  const c = await getCopy("visit");
  return (
    <>
      <Nav />
      <PageHero
        eyebrow="Visit Us"
        num="04"
        title={pick(c, "visit.hero.title", "서울숲, 갤러리아 포레")}
        lead={pick(c, "visit.hero.lead", "지하철 수인분당선 서울숲역 인근, 갤러리아 포레에서 만나요.")}
      />

      <section className="section">
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
                  인스타그램 <a href={LINKS.instagram[0].url} target="_blank" rel="noopener" style={{ color: "var(--volt)", fontWeight: 600 }}>{LINKS.instagram[0].handle}</a> DM
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
                  네이버 스마트스토어
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

      {/* ── 이용 안내 ── */}
      <section className="section section--alt">
        <div className="wrap">
          <div className="section__head section__head--split">
            <div><div className="eyebrow">Access & Facility</div></div>
            <div><h2 className="title">{pick(c, "visit.notice.title", "방문 전, 이것만 알아두세요.")}</h2></div>
          </div>
          <div className="why__grid">
            {ACCESS.map((a, i) => (
              <div key={a.h} className="feat">
                <div className="feat__ico">{String(i + 1).padStart(2, "0")}</div>
                <h3>{a.h}</h3>
                <p>{a.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section">
        <div className="wrap">
          <div className="section__head section__head--split">
            <div><div className="eyebrow">FAQ</div></div>
            <div><h2 className="title">{pick(c, "visit.faq.title", "자주 묻는 질문")}</h2></div>
          </div>
          <div className="faq">
            {FAQ.map((f, i) => (
              <div key={f.q} className="faq__item">
                <div className="faq__n">// {String(i + 1).padStart(2, "0")}</div>
                <div className="faq__q">{f.q}</div>
                <div className="faq__a">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
