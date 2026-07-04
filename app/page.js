import Link from "next/link";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Reveal from "./components/Reveal";
import Court from "./components/Court";
import Arrow from "./components/Arrow";
import { LINKS, reserveHref } from "./lib/site";

// 홈은 허브 역할 — 각 페이지로 안내하는 인덱스.
const EXPLORE = [
  { href: "/about", num: "01", key: "About PICKLEBOX", desc: "브랜드 스토리와 사업 소개, 여섯 가지 서비스 라인업.", tint: "green" },
  { href: "/pickleball", num: "02", key: "What is Pickleball", desc: "누구나 5분이면 배우는, 요즘 가장 빠르게 크는 라켓 스포츠.", tint: "lime" },
  { href: "/founder", num: "03", key: "The Founder", desc: "테니스에서 피클볼로 — 조민정 대표가 그리는 이야기.", tint: "tangerine" },
  { href: "/visit", num: "04", key: "Visit Us", desc: "서울숲 갤러리아 포레. 예약·지도·문의를 한 번에.", tint: "green" },
];

export default function Home() {
  return (
    <>
      <span id="top" />
      <Nav />

      {/* ── 히어로 ── */}
      <header className="hero">
        <div className="hero__bg"><Court /></div>
        <div className="hero__scan" aria-hidden="true" />
        <div className="wrap hero__inner">
          <div className="eyebrow hero__eyebrow">Premium Pickleball Club · Seoul</div>
          <div className="hero__status" aria-hidden="true">
            <span>37.5443°N 127.0374°E</span>
            <span>24/7 Smart Court</span>
            <span>Seoul Forest · KR</span>
          </div>
          <h1 className="hero__title">PICKLEBOX</h1>
          <div className="hero__accent">Play the Joy.</div>
          <p className="hero__ko">피클볼로 여는 즐거운 선물상자</p>
          <p className="hero__desc">
            셀럽·커뮤니티·컬처가 함께하는 서울숲의 프리미엄 피클볼 클럽.
            24시간 무인 스마트 코트부터 레슨·굿즈·투어까지 하나로.
          </p>
          <div className="hero__actions">
            <a href={reserveHref} target="_blank" rel="noopener" className="btn btn--primary">
              예약하기 <Arrow />
            </a>
            <Link href="/about" className="btn btn--ghost">클럽 안내</Link>
            <a href={LINKS.store} target="_blank" rel="noopener" className="btn btn--ghost">스마트스토어</a>
          </div>
          <div className="hero__stats frame">
            <div className="hero__stat"><b>24H</b><span>무인 스마트 클럽</span></div>
            <div className="hero__stat"><b>6</b><span>브랜드 라인업</span></div>
            <div className="hero__stat"><b>서울숲</b><span>갤러리아 포레</span></div>
          </div>
        </div>
        <div className="ticker">
          <div className="wrap ticker__inner">
            <span className="ticker__hot">Now Open</span>
            <span className="ticker__sep">/</span>
            <span className="ticker__item">서울숲 · 갤러리아 포레</span>
            <span className="ticker__sep">/</span>
            <span className="ticker__item">24시간 무인 스마트 클럽</span>
            <span className="ticker__sep">/</span>
            <span className="ticker__hot">예약 오픈</span>
          </div>
        </div>
      </header>

      {/* ── 둘러보기(허브 인덱스) ── */}
      <section className="section" id="explore">
        <div className="wrap">
          <div className="section__head">
            <div className="eyebrow">Explore</div>
            <span className="section__num">/ 01</span>
            <h2 className="title title--ko">피클박스, 어디부터 볼까요?</h2>
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

      {/* ── CTA 밴드 ── */}
      <section className="section join">
        <div className="wrap">
          <Reveal className="join__card">
            <div>
              <h2 className="join__card--en">Play the Culture.</h2>
              <p>
                피클볼이 처음이어도 괜찮습니다. 방문·예약 문의를 남겨주시면
                코트와 레슨, 멤버십까지 편하게 안내해 드립니다.
              </p>
            </div>
            <div className="join__actions">
              <a href={reserveHref} target="_blank" rel="noopener" className="btn btn--lime">
                예약하기 <Arrow />
              </a>
              <Link href="/visit" className="btn btn--ghost">오시는 길</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
