import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import Arrow from "../components/Arrow";
import { SUBBRANDS, reserveHref } from "../lib/site";

export const metadata = {
  title: "피클박스 안내 — PICKLEBOX",
  description: "PICKLEBOX 브랜드 스토리와 사업 소개, 피클볼을 중심으로 한 여섯 가지 서비스 라인업을 소개합니다.",
};

// 사업 소개 블록 — 확장 방향. [대괄호] = 확정 후 교체할 사실.
const BUSINESS_POINTS = [
  { h: "무인 스마트 클럽", p: "서울숲 갤러리아 포레의 24시간 무인 피클볼 클럽을 중심으로, 예약부터 입장까지 편리하게 운영합니다." },
  { h: "굿즈 제작 · 판매", p: "패들·웨어·액세서리 등 피클볼 라이프 굿즈를 직접 기획·제작해 스마트스토어에서 선보이고 있습니다." },
  { h: "레슨 · 커뮤니티", p: "처음이어도 쉽게 배우는 레슨과, 좋은 사람들이 모이는 커뮤니티로 피클볼 문화를 넓혀갑니다." },
  { h: "확장하는 브랜드", p: "매장을 시작으로 굿즈·여행·행사까지 — 피클볼을 즐기는 모든 순간을 하나의 브랜드로 연결합니다. [연혁·마일스톤]" },
];

export default function About() {
  return (
    <>
      <Nav />
      <PageHero
        eyebrow="About PICKLEBOX"
        num="01"
        title="하나의 상자를 열면, 피클볼의 모든 즐거움."
        lead="피클박스는 피클볼을 중심으로 코트·레슨·커뮤니티·굿즈·여행을 잇는 라이프스타일 브랜드입니다."
      />

      {/* ── 브랜드 스토리 ── */}
      <section className="section story">
        <div className="wrap story__grid">
          <Reveal className="story__mark photo-slot photo-slot--story" />
          <Reveal className="story__body" delay={80}>
            <div className="eyebrow">Brand Story</div>
            <h2 className="title">기대하지 못했던 선물상자를 열었을 때처럼.</h2>
            <p className="lead">
              피클볼 한 게임에는 운동의 즐거움만 있는 것이 아닙니다. 처음 만난 사람과 인사를 나누고,
              공을 주고받으며 함께 웃고, 일상의 스트레스를 잠시 내려놓는 시간이 담겨 있습니다.
            </p>
            <p style={{ color: "var(--ink-soft)", marginTop: 16 }}>
              PICKLEBOX에 들어오는 순간 설렘이 시작되고, 코트 위에서는 웃음과 에너지가 쌓이며,
              돌아갈 때는 좋은 기억과 새로운 인연을 담아갈 수 있습니다.
            </p>
            <p className="story__quote">피클볼을 치고, 웃고, 연결되며<br />일상에 즐거움을 선물하는 공간.</p>
          </Reveal>
        </div>
      </section>

      {/* ── 사업 소개 ── */}
      <section className="section">
        <div className="wrap">
          <div className="section__head">
            <div className="eyebrow">Our Business</div>
            <h2 className="title">피클볼을 중심으로, 사업을 넓혀갑니다.</h2>
            <p className="lead">
              매장은 한 곳이지만, 굿즈 제작·판매와 브랜딩으로 피클볼 라이프스타일 전반으로
              영역을 확장하고 있습니다.
            </p>
          </div>
          <div className="why__grid why__grid--light">
            {BUSINESS_POINTS.map((b, i) => (
              <Reveal key={b.h} className="feat" delay={(i % 4) * 60}>
                <div className="feat__ico">{String(i + 1).padStart(2, "0")}</div>
                <h3>{b.h}</h3>
                <p>{b.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 서브브랜드 6종 ── */}
      <section className="section" id="brands">
        <div className="wrap">
          <div className="section__head">
            <div className="eyebrow">Our Services</div>
            <h2 className="title">하나의 상자, 여섯 가지 즐거움</h2>
            <p className="lead">
              멤버십부터 여행까지 — PICKLEBOX의 여섯 브랜드가 피클볼을 중심으로 한 라이프스타일을 완성합니다.
            </p>
          </div>
          <div className="brands__grid">
            {SUBBRANDS.map((b, i) => (
              <Reveal key={b.key} className={`brand brand--${b.tint}`} delay={(i % 3) * 70}>
                <span className="brand__num">{String(i + 1).padStart(2, "0")}</span>
                <div className="brand__dot" />
                <div className="brand__key">
                  PICKLEBOX {b.key}
                  <small>{b.ko}</small>
                </div>
                <p className="brand__desc">{b.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section join">
        <div className="wrap">
          <Reveal className="join__card">
            <div>
              <h2>피클박스가 궁금하다면,<br />직접 만나보세요.</h2>
              <p>서울숲 갤러리아 포레에서 코트와 레슨, 커뮤니티를 경험할 수 있습니다.</p>
            </div>
            <div className="join__actions">
              <a href={reserveHref} target="_blank" rel="noopener" className="btn btn--lime">
                예약하기 <Arrow />
              </a>
              <Link href="/visit" className="btn btn--ghost" style={{ borderColor: "#fff", color: "#fff" }}>
                오시는 길 보기
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
