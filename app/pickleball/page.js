import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import Arrow from "../components/Arrow";
import { reserveHref } from "../lib/site";

export const metadata = {
  title: "피클볼이란? — PICKLEBOX",
  description: "테니스·배드민턴·탁구를 합친 라켓 스포츠, 피클볼. 규칙과 장비, 매력까지 쉽게 알아봅니다.",
};

const BASICS = [
  { ico: "01", h: "패들과 플라스틱 공", p: "구멍 뚫린 가벼운 플라스틱 공과 나무·카본 패들로 즐깁니다. 공이 천천히 날아 초보도 쉽게 랠리를 이어갈 수 있어요." },
  { ico: "02", h: "배드민턴 크기 코트", p: "테니스보다 훨씬 작은 배드민턴 규격 코트에서 단식·복식으로 진행합니다. 넓게 뛰지 않아 체력 부담이 적습니다." },
  { ico: "03", h: "쉬운 규칙", p: "서브는 아래에서 위로, 네트 앞 '키친' 구역만 기억하면 끝. 5분이면 규칙을 익히고 바로 경기를 시작할 수 있습니다." },
];

const CHARMS = [
  { h: "5분이면 입문", p: "라켓 스포츠가 처음이어도 첫날부터 랠리가 됩니다. 진입 장벽이 낮아 온 가족이 함께 즐기기 좋아요." },
  { h: "전 연령 · 전 체력", p: "격한 움직임이 적어 남녀노소 누구나 부담 없이. 가볍게 땀 흘리며 즐기는 생활 스포츠입니다." },
  { h: "자연스러운 커뮤니티", p: "복식 위주라 함께 웃고 대화하는 시간이 많습니다. 운동을 넘어 사람과 연결되는 재미가 큽니다." },
  { h: "지금 가장 빠르게", p: "전 세계에서 가장 빠르게 성장하는 라켓 스포츠. 국내에서도 코트와 동호인이 빠르게 늘고 있습니다." },
];

export default function Pickleball() {
  return (
    <>
      <Nav />
      <PageHero
        eyebrow="What is Pickleball"
        num="02"
        title="테니스 · 배드민턴 · 탁구를 하나로, 피클볼."
        lead="작은 코트에서 가벼운 공과 패들로 즐기는 라켓 스포츠. 규칙이 쉽고 부담이 적어 누구나 첫날부터 랠리를 이어갈 수 있습니다."
      />

      {/* ── 기본 ── */}
      <section className="section">
        <div className="wrap">
          <div className="section__head">
            <div className="eyebrow">Basics</div>
            <h2 className="title">이렇게 즐깁니다</h2>
          </div>
          <div className="grid-3">
            {BASICS.map((b, i) => (
              <Reveal key={b.h} className="feat" delay={(i % 3) * 70}>
                <div className="feat__ico">{b.ico}</div>
                <h3>{b.h}</h3>
                <p>{b.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 매력 ── */}
      <section className="section story">
        <div className="wrap">
          <div className="section__head">
            <div className="eyebrow">Why so loved</div>
            <h2 className="title">왜 이렇게 빠르게 사랑받을까요?</h2>
          </div>
          <div className="grid-2">
            {CHARMS.map((c, i) => (
              <Reveal key={c.h} className="brand brand--green" delay={(i % 2) * 80}>
                <span className="brand__num">{String(i + 1).padStart(2, "0")}</span>
                <div className="brand__key" style={{ position: "relative", zIndex: 1 }}>{c.h}</div>
                <p className="brand__desc">{c.p}</p>
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
              <h2>처음이신가요?<br />피클박스에서 시작하세요.</h2>
              <p>패들과 공은 준비되어 있습니다. 레슨과 함께라면 오늘 처음이어도 바로 경기를 즐길 수 있어요.</p>
            </div>
            <div className="join__actions">
              <a href={reserveHref} target="_blank" rel="noopener" className="btn btn--lime">
                레슨 · 예약하기 <Arrow />
              </a>
              <Link href="/about" className="btn btn--ghost" style={{ borderColor: "#fff", color: "#fff" }}>
                피클박스 안내
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
