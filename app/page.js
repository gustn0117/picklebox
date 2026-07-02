import Link from "next/link";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Reveal from "./components/Reveal";
import Ball from "./components/Ball";
import Parallax from "./components/Parallax";
import Arrow from "./components/Arrow";
import { LINKS, reserveHref } from "./lib/site";

// 홈은 허브 역할 — 각 페이지로 안내하는 카드.
const EXPLORE = [
  { href: "/about", num: "01", key: "피클박스 안내", desc: "브랜드 스토리와 사업 소개, 여섯 가지 서비스 라인업.", tint: "green" },
  { href: "/pickleball", num: "02", key: "피클볼이란?", desc: "누구나 5분이면 배우는, 요즘 가장 빠르게 크는 라켓 스포츠.", tint: "lime" },
  { href: "/founder", num: "03", key: "대표 소개", desc: "테니스에서 피클볼로 — 조민정 대표가 그리는 이야기.", tint: "tangerine" },
  { href: "/visit", num: "04", key: "오시는 길", desc: "서울숲 갤러리아 포레. 예약·지도·문의를 한 번에.", tint: "green" },
];

const CONFETTI = [
  { bg: "var(--lime)", size: 14, left: "6%", top: "16%" },
  { bg: "var(--green)", size: 10, left: "90%", top: "48%" },
  { bg: "var(--lime)", size: 9, left: "14%", top: "82%" },
];

export default function Home() {
  return (
    <>
      <span id="top" />
      <Nav />

      {/* ── 히어로 ── */}
      <header className="hero">
        <div className="wrap hero__grid">
          <div>
            <div className="eyebrow hero__tag">Pickleball Lifestyle Platform</div>
            <h1 className="hero__en">
              Open the Box,<br />Play the <span className="pop">Joy.</span>
            </h1>
            <p className="hero__ko">피클볼로 여는 즐거운 선물상자</p>
            <p className="hero__desc">
              PICKLEBOX는 24시간 무인 스마트 피클볼 클럽을 중심으로 코트, 레슨, 커뮤니티,
              굿즈, 여행을 연결하는 피클볼 라이프스타일 플랫폼입니다.
            </p>
            <div className="hero__actions">
              <a href={reserveHref} target="_blank" rel="noopener" className="btn btn--primary">
                예약하기 <Arrow />
              </a>
              <a href={LINKS.store} target="_blank" rel="noopener" className="btn btn--ghost">
                스마트스토어
              </a>
            </div>
            <div className="hero__stats">
              <div className="hero__stat"><b>24H</b><span>무인 스마트 클럽</span></div>
              <div className="hero__stat"><b>6</b><span>브랜드 라인업</span></div>
              <div className="hero__stat"><b>서울숲</b><span>갤러리아 포레</span></div>
            </div>
          </div>

          <Parallax className="box" speed={0.06} aria-hidden="true">
            {CONFETTI.map((c, i) => (
              <span
                key={i}
                className="box__confetti"
                style={{ background: c.bg, width: c.size, height: c.size, left: c.left, top: c.top }}
              />
            ))}
            <div className="box__ball"><Ball body="#fff" dots="var(--green)" tail={false} /></div>
            <div className="box__lid" />
            <div className="box__base" />
            <div className="box__ribbon" />
          </Parallax>
        </div>
      </header>

      <div className="wrap"><div className="ribbon" /></div>

      {/* ── 둘러보기(허브 카드) ── */}
      <section className="section" id="explore">
        <div className="wrap">
          <div className="section__head">
            <div className="eyebrow">Explore</div>
            <span className="section__num">/ 01</span>
            <h2 className="title">피클박스, 어디부터 볼까요?</h2>
            <p className="lead">
              브랜드 소개부터 피클볼 입문, 대표 이야기, 오시는 길까지 —
              궁금한 곳으로 바로 이동해 보세요.
            </p>
          </div>
          <div className="explore__grid">
            {EXPLORE.map((e, i) => (
              <Reveal key={e.href} delay={(i % 4) * 60}>
                <Link href={e.href} className={`explore__card explore__card--${e.tint}`}>
                  <span className="explore__num">{e.num}</span>
                  <div className="explore__key">{e.key}</div>
                  <p className="explore__desc">{e.desc}</p>
                  <span className="explore__go">바로가기 <Arrow /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA 밴드(다크) ── */}
      <section className="section join">
        <div className="wrap">
          <Reveal className="join__card">
            <div>
              <h2>레슨과 멤버십,<br />지금 시작해 보세요.</h2>
              <p>
                피클볼이 처음이어도 괜찮습니다. 방문·예약 문의를 남겨주시면
                코트와 레슨, 멤버십까지 편하게 안내해 드립니다.
              </p>
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
