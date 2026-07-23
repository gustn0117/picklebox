import Link from "next/link";
import Nav from "./components/Nav";
import Sections from "./components/Sections";
import Footer from "./components/Footer";
import Reveal from "./components/Reveal";
import Court from "./components/Court";
import Arrow from "./components/Arrow";
import CountUp from "./components/CountUp";
import Multiline from "./components/Multiline";
import { reserveHref } from "./lib/site";
import { db } from "./lib/db";
import { contentWhere, isPreview } from "./lib/publicWhere";
import { getCopy, pick, pickList } from "./lib/copy";

export const dynamic = "force-dynamic";




export default async function Home({ searchParams }) {
  const preview = await isPreview(searchParams);
  const WHERE = contentWhere(preview);
  let copy = {};
  let banners = [];
  let photos = [];
  try {
    const [rows, bnr, pho] = await Promise.all([
      getCopy("home"),
      db.banner.findMany({ where: { page: "home", ...WHERE }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
      db.photo.findMany({ where: WHERE, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
    ]);
    copy = rows;
    banners = bnr.filter((b) => b.imageUrl); // 이미지 있는 배너만 노출
    photos = pho;
  } catch {
    copy = {};
  }
  const c = (k, d) => pick(copy, k, d);
  const heroBg = c("home.hero.bg", "");
  const STATS = pickList(copy, "home.stats",
    "45 | MIN | 한 게임의 온도\n6 |  | 서비스 브랜드\n24 | H | 무인 스마트 운영\n100 | % | 초보 환영", "|")
    .map(([n, u, l]) => { const num = parseInt(n, 10) || 0; return { n: num, pad: (!u && num < 10) ? 2 : 0, u: u || "", l: l || "" }; });
  const WHY = pickList(copy, "home.why.items",
    "24시간 무인 스마트 클럽 | 언제든 문을 열고 들어와 나만의 시간에 피클볼을 즐기세요. 예약부터 입장까지 스마트하게.\n서울숲 라운지 | 갤러리아 포레의 프라이빗 코트와 라운지에서 보내는 하루. 도심 속 프리미엄 컬처 공간.\n레슨 · 커뮤니티 | 처음이어도 쉽게 배우고, 좋은 사람들과 자연스럽게 연결됩니다. 코치와 동호인이 함께.\n여행 · 컬처 | 코트를 넘어 서울 관광과 해외 피클볼 투어까지. 피클볼로 여는 새로운 라이프스타일.", "|")
    .map(([h, p]) => ({ h, p }));
  const STEPS = pickList(copy, "home.how.items",
    "예약 | 네이버 예약으로 원하는 시간을 선택하세요. 몇 번의 터치면 코트가 준비됩니다.\n입장 | 무인 스마트 출입으로 24시간 언제든. 기다림 없이 바로 나만의 코트로.\n플레이 | 패들과 공은 준비되어 있습니다. 처음이라면 레슨과 함께 첫날부터 랠리를.", "|")
    .map(([h, p], i) => ({ s: `STEP ${String(i + 1).padStart(2, "0")}`, h, p }));
  const ticker = pickList(copy, "home.ticker", "Now Open\n서울숲 · 갤러리아 포레\n24시간 무인 스마트 클럽\n예약 오픈").map((x) => x[0]);
  const heroEyebrow = c("home.hero.eyebrow", "Premium Pickleball Club · Seoul");
  const heroAccent = c("home.hero.accent", "Open the Box, Play the Joy.");
  const heroLine1 = c("home.hero.tagline1", "피클박스는 즐거움을 여는 선물상자입니다.");
  const heroLine2 = c("home.hero.tagline2", "피클볼을 통해 운동, 만남, 휴식, 콘텐츠, 여행까지 이어지는 새로운 스포츠 라이프를 만듭니다.");

  return (
    <>
      <span id="top" />
      <Nav />

      {/* ── 히어로 ── */}
      <header className="hero">
        <div className="hero__bg" style={heroBg ? { backgroundImage: `url(${heroBg})` } : undefined}><Court /></div>
        <div className="hero__scan" aria-hidden="true" />
        <div className="hud" aria-hidden="true">
          <span className="hud__c hud__tl hud__brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/pb-icon-orange.png" alt="" className="hud__brand-ico" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/pb-wordmark-orange.png" alt="" className="hud__brand-txt" />
          </span>
          <span className="hud__c hud__tr">REC ●</span>
          <span className="hud__c hud__bl">EST. 2026</span>
          <span className="hud__c hud__br">SEOUL · KR</span>
        </div>
        <div className="wrap hero__inner">
          <div className="eyebrow hero__eyebrow">{heroEyebrow}</div>
          <h1 className="hero__title">PICKLEBOX</h1>
          <div className="hero__accent">{heroAccent}</div>
          <p className="hero__ko">{heroLine1}<br />{heroLine2}</p>
        </div>
        <div className="ticker">
          <div className="wrap ticker__inner">
            {ticker.map((it, i) => (
              <span key={i} style={{ display: "contents" }}>
                {i > 0 && <span className="ticker__sep">/</span>}
                <span className={i === 0 || i === ticker.length - 1 ? "ticker__hot" : "ticker__item"}>{it}</span>
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* ── 프로모 배너 (관리자 콘텐츠) ── */}
      {banners.length > 0 && (
        <section className="section">
          <div className="wrap">
            {banners.map((b) => (
              <a
                key={b.id}
                className="promo"
                href={b.linkUrl || undefined}
                target={b.linkUrl ? "_blank" : undefined}
                rel={b.linkUrl ? "noopener" : undefined}
                style={{ backgroundImage: `url(${b.imageUrl})` }}
              >
                <div className="promo__body">
                  {b.title && <h2 className="promo__title">{b.title}</h2>}
                  {b.subtitle && <p className="promo__sub">{b.subtitle}</p>}
                  {b.linkUrl && <span className="promo__go">자세히 보기 <Arrow /></span>}
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      <Sections page="home" position="top" preview={preview} />

      {/* ── 둘러보기(벤토) ── */}
      <section className="section" id="explore">
        <div className="wrap">
          <div className="section__head">
            <div className="eyebrow">Explore</div>
            <span className="section__num">/ 01</span>
          </div>
          <div className="bento">
            <Reveal
              as={Link}
              href="/about"
              className="bento__card bento__card--feat bento__card--img"
              style={{ backgroundImage: `url(${c("home.bento.about.img", "/assets/story-picklebox-still.webp")})` }}
            >
              <span className="bento__num">// 01</span>
              <div className="bento__key bento__key--feat"><Multiline text={c("home.bento.about.title", "About\nPICKLEBOX")} /></div>
              <p className="bento__desc">{c("home.bento.about.desc", "피클박스는 즐거움을 여는 선물상자입니다.")}</p>
              <span className="bento__go">바로가기 <Arrow /></span>
            </Reveal>

            <Reveal as={Link} href="/pickleball" className="bento__card bento__card--half" delay={70}>
              <span className="bento__num">// 02</span>
              <div className="bento__key"><Multiline text={c("home.bento.pickleball.title", "What is\nPickleball")} /></div>
              <p className="bento__desc">{c("home.bento.pickleball.desc", "누구나 5분이면 배우는, 요즘 가장 빠르게 크는 라켓 스포츠.")}</p>
              <span className="bento__go">바로가기 <Arrow /></span>
            </Reveal>

            <Reveal as={Link} href="/founder" className="bento__card bento__card--half" delay={140}>
              <span className="bento__num">// 03</span>
              <div className="bento__key"><Multiline text={c("home.bento.founder.title", "The\nFounder")} /></div>
              <p className="bento__desc">{c("home.bento.founder.desc", "테니스에서 피클볼로 — 조민정 대표가 그리는 이야기.")}</p>
              <span className="bento__go">바로가기 <Arrow /></span>
            </Reveal>

            <Reveal
              as={Link}
              href="/visit"
              className="bento__card bento__card--wide bento__card--img"
              style={{ backgroundImage: `url(${c("home.bento.visit.img", "/assets/join-lounge-court.webp")})` }}
              delay={90}
            >
              <span className="bento__num">// 04</span>
              <div className="bento__key">{c("home.bento.visit.title", "Visit Us")}</div>
              <p className="bento__desc">{c("home.bento.visit.desc", "서울숲 갤러리아 포레 · 예약·지도·문의를 한 번에. 24시간 언제든 문을 여는 스마트 클럽.")}</p>
              <span className="bento__go">오시는 길 <Arrow /></span>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 매니페스토 + 스탯 ── */}
      <section className="section section--alt">
        <div className="wrap">
          <div className="eyebrow">Manifesto</div>
          <div className="manifesto" style={{ marginTop: 26, marginBottom: "clamp(48px, 7vw, 84px)" }}>
            <p><Multiline text={c("home.manifesto", "운동을 넘어,\n사람을 잇다. 서울숲에서 시작하는 새로운 피클볼 컬처.")} /></p>
          </div>
          <div className="statband">
            {STATS.map((s) => (
              <div className="statband__cell" key={s.l}>
                <div className="statband__n"><CountUp to={s.n} pad={s.pad} /><em>{s.u}</em></div>
                <div className="statband__l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 왜 피클박스 ── */}
      <section className="section">
        <div className="wrap">
          <div className="section__head section__head--split">
            <div>
              <div className="eyebrow">Why PICKLEBOX</div>
              <span className="section__num">/ 02</span>
            </div>
            <h2 className="title title--ko"><Multiline text={c("home.why.title", "누구나 쉽게,\n운동을 넘어 컬처까지.")} /></h2>
          </div>
          <div className="why__grid">
            {WHY.map((f, i) => (
              <Reveal key={f.h} className="feat" delay={(i % 4) * 60}>
                <div className="feat__ico">{String(i + 1).padStart(2, "0")}</div>
                <h3>{f.h}</h3>
                <p>{f.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 이용 방법 ── */}
      <section className="section section--alt">
        <div className="wrap">
          <div className="section__head section__head--split">
            <div>
              <div className="eyebrow">How it works</div>
              <span className="section__num">/ 03</span>
            </div>
            <h2 className="title title--ko"><Multiline text={c("home.how.title", "예약하고, 들어와,\n바로 플레이.")} /></h2>
          </div>
          <div className="grid-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.h} className="feat" delay={(i % 3) * 70}>
                <div className="feat__ico feat__ico--step">{s.s}</div>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 갤러리 (관리자 콘텐츠) ── */}
      {photos.length > 0 && (
        <section className="section section--alt">
          <div className="wrap">
            <div className="section__head section__head--split">
              <div>
                <div className="eyebrow">Gallery</div>
                <span className="section__num">/ 04</span>
              </div>
              <h2 className="title title--ko">{c("home.gallery.title", "피클박스의 순간들.")}</h2>
            </div>
            <div className="gallery">
              {photos.map((p) => (
                <figure key={p.id} className="gallery__item">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.imageUrl} alt={p.caption || ""} loading="lazy" />
                  {p.caption && <figcaption>{p.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <Sections page="home" position="bottom" preview={preview} />

      {/* ── CTA 밴드 ── */}
      <section className="section join">
        <div className="wrap">
          <Reveal className="join__card">
            <div>
              <div className="eyebrow" style={{ marginBottom: 20 }}>Join the Club</div>
              <h2 className="join__card--en">{c("home.cta.title", "Play the Culture.")}</h2>
              <p>{c("home.cta.desc", "피클볼이 처음이어도 괜찮습니다. 방문·예약 문의를 남겨주시면 코트와 레슨, 멤버십까지 편하게 안내해 드립니다.")}</p>
            </div>
            <div className="join__actions">
              <a href={reserveHref} target="_blank" rel="noopener" className="btn btn--lime">
                {c("home.cta.button", "예약하기")} <Arrow />
              </a>
              <Link href="/visit" className="btn btn--ghost">{c("home.cta.button2", "오시는 길")}</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
