import Link from "next/link";
import Nav from "../components/Nav";
import Sections from "../components/Sections";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import Arrow from "../components/Arrow";
import { reserveHref } from "../lib/site";
import { db } from "../lib/db";
import { contentWhere, isPreview } from "../lib/publicWhere";
import { getCopy, pick, pickList, getCopyValue } from "../lib/copy";
import Multiline from "../components/Multiline";
import RichHtml from "../components/RichHtml";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    title: await getCopyValue("seo.about", "피클박스 안내 — PICKLEBOX"),
    description: "PICKLEBOX 브랜드 스토리와 사업 소개, 피클볼을 중심으로 한 여섯 가지 서비스 라인업을 소개합니다.",
  };
}

const VALUES = [
  { k: "Play", ko: "즐거움", p: "누구나 즐기는 피클볼. 진입 장벽을 낮춰 첫날의 재미를 선물합니다." },
  { k: "Connect", ko: "연결", p: "코트가 곧 커뮤니티. 좋은 사람과 좋은 경기를 자연스럽게 잇습니다." },
  { k: "Culture", ko: "컬처", p: "운동을 넘어 라이프스타일로. 굿즈·여행·행사로 확장하는 새로운 컬처." },
];

const PICKLE_APPEAL = [
  { h: "누구나 쉽게 시작", p: "라켓이 가볍고 룰이 간단해 초보자도 쉽게 적응할 수 있어요. 어린이부터 노년층까지 세대 구분 없이 함께 즐길 수 있는 스포츠입니다." },
  { h: "부상 위험이 적음", p: "테니스보다 코트가 작고 움직임이 적어 무릎·허리에 무리가 덜 갑니다. 격렬한 운동은 아니어서 운동 초보자에게도 좋아요." },
  { h: "운동 효과가 뛰어남", p: "유산소 운동, 순발력, 반사신경, 균형 감각 향상에 도움이 됩니다. 칼로리 소모량도 많아 다이어트·건강관리에도 효과적이에요." },
  { h: "사교성과 커뮤니티", p: "복식 위주의 경기로 자연스럽게 사람들과 소통하게 됩니다. 개방적이고 친화적인 피클볼 커뮤니티는 친구 만들기에도 좋아요." },
  { h: "빠른 진행과 재미", p: "게임 템포가 빨라 지루하지 않고, 짧은 시간에 여러 경기를 즐길 수 있어요. 라켓과 볼의 반응이 재미있고 중독성이 있습니다." },
  { h: "글로벌 트렌드", p: "미국을 중심으로 빠르게 성장 중인 스포츠로, 향후 올림픽 종목 가능성도 제기됩니다. 국제학교 도입 종목이라 유학 이력에도 도움이 됩니다." },
];

const TIMELINE = [
  { yr: "[2024]", h: "브랜드 출발", p: "조민정 대표, 테니스에서 피클볼로. 서울의 새로운 컬처를 구상." },
  { yr: "[2025]", h: "서울숲 1호점", p: "갤러리아 포레에 24시간 무인 스마트 클럽 오픈." },
  { yr: "[2026]", h: "라인업 확장", p: "굿즈·아카데미·투어까지 여섯 개 서비스 브랜드로 사업 구상." },
  { yr: "NOW", h: "컬처 플랫폼", p: "셀럽·커뮤니티·컬처를 잇는 피클볼 라이프스타일 플랫폼으로." },
];

export default async function About({ searchParams }) {
  const preview = await isPreview(searchParams);
  const WHERE = contentWhere(preview);
  const [academy, tours, c] = await Promise.all([
    db.academyProgram.findMany({ where: WHERE, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
    db.tour.findMany({ where: WHERE, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
    getCopy("about"),
  ]);
  const SUBBRANDS = pickList(c, "about.subbrands",
    "CLUB | 클럽 | 멤버십·셀럽 게임·커뮤니티가 모이는 피클박스의 중심\nHOUSE | 하우스 | 서울숲 라운지와 프라이빗 코트에서 즐기는 하루\nSEOUL | 서울 | K-피클볼 문화를 세계의 여행객과 도시생활자에게 소개하는 대표 스포츠 라이프스타일 브랜드\nACADEMY | 아카데미 | 레슨, 게임 매칭, 입문클래스, 멤버십, 정기 리그가 운영되는 커뮤니티 프로그램\nTOUR | 투어 | 코트를 넘어 떠나는 해외 피클볼 여행\nPARTY | 파티 | 브랜드 행사와 셀럽 파티로 이어지는 즐거움", "|")
    .map(([key, ko, desc]) => ({ key, ko, desc }));
  return (
    <>
      <Nav />
      <PageHero
        eyebrow="About PICKLEBOX"
        num="01"
      />

      <Sections page="about" position="top" preview={preview} />

      {/* ── 브랜드 스토리 ── */}
      <section className="section story">
        <div className="wrap story__grid">
          <Reveal className="story__mark story__logo" />
          <Reveal className="story__body" delay={80}>
            <div className="eyebrow">Brand Story</div>
            <h2 className="title title--sm">{pick(c, "about.story.title", "기대하지 못했던 선물상자를 열었을 때처럼.")}</h2>
<p className="lead">{pick(c, "about.story.p1", "피클볼 한 게임에는 운동의 즐거움만 있는 것이 아닙니다. 처음 만난 사람과 인사를 나누고, 공을 주고받으며 함께 웃고, 일상의 스트레스를 잠시 내려놓는 시간이 담겨 있습니다.")}</p>
<p style={{ color: "var(--ink-soft)", marginTop: 16 }}>{pick(c, "about.story.p2", "PICKLEBOX에 들어오는 순간 설렘이 시작되고, 코트 위에서는 웃음과 에너지가 쌓이며, 돌아갈 때는 좋은 기억과 새로운 인연을 담아갈 수 있습니다.")}</p>
            <p className="story__quote"><Multiline text={pick(c, "about.story.quote", "피클볼을 치고, 웃고, 연결되며\n일상에 즐거움을 선물하는 공간.")} /></p>
          </Reveal>
        </div>
      </section>

      {/* ── 왜 피클볼 ── */}
      <section className="section">
        <div className="wrap">
          <div className="section__head section__head--split">
            <div><div className="eyebrow">Why Pickleball</div></div>
            <div><h2 className="title title--sm"><Multiline text={pick(c, "about.why.title", "미국 1위 레저스포츠 상륙!\n5분 만에 중독되는 이것?")} /></h2></div>
          </div>
          <div className="grid-2">
            {PICKLE_APPEAL.map((item, i) => (
              <Reveal key={item.h} className="feat" delay={(i % 2) * 80}>
                <div className="feat__ico">{String(i + 1).padStart(2, "0")}</div>
                <h3>{item.h}</h3>
                <p>{item.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 서브브랜드 6종 ── */}
      <section className="section section--alt" id="brands">
        <div className="wrap">
          <div className="section__head section__head--split">
            <div><div className="eyebrow">Our Services</div></div>
            <div>
              <h2 className="title">{pick(c, "about.services.title", "하나의 상자, 여섯 가지 즐거움")}</h2>
<p className="lead">{pick(c, "about.services.lead", "멤버십부터 여행까지 — PICKLEBOX의 여섯 브랜드가 피클볼을 중심으로 한 라이프스타일을 완성합니다.")}</p>
            </div>
          </div>
          <div className="bento">
            {SUBBRANDS.map((b, i) => {
              const span = ["bento__card--feat", "bento__card--half", "bento__card--half", "bento__card--third", "bento__card--third", "bento__card--third"][i];
              return (
                <Reveal key={b.key} className={`bento__card ${span}`} delay={(i % 3) * 70}>
                  <span className="bento__num">// {String(i + 1).padStart(2, "0")}</span>
                  <div className={`bento__key ${i === 0 ? "bento__key--feat" : ""}`}>{b.key}</div>
                  <div className="bento__ko">{b.ko}</div>
                  <p className="bento__desc">{b.desc}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 아카데미 프로그램 (관리자 콘텐츠) ── */}
      {academy.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="section__head section__head--split">
              <div><div className="eyebrow">Academy</div></div>
              <div><h2 className="title title--sm">{pick(c, "about.academy.title", "아카데미 프로그램")}</h2></div>
            </div>
            <div className="grid-3">
              {academy.map((a, i) => (
                <Reveal key={a.id} className="feat" delay={(i % 3) * 70}>
                  {a.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="feat__img" src={a.imageUrl} alt="" loading="lazy" />
                  )}
                  <div className="feat__ico">{String(i + 1).padStart(2, "0")}</div>
                  <h3>{a.titleEn ? `${a.titleEn} · ` : ""}{a.titleKo}</h3>
                  <RichHtml text={a.description} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 피클볼 투어 (관리자 콘텐츠) ── */}
      {tours.length > 0 && (
        <section className="section section--alt">
          <div className="wrap">
            <div className="section__head section__head--split">
              <div><div className="eyebrow">Tour</div></div>
              <div><h2 className="title title--sm">{pick(c, "about.tour.title", "피클볼 투어")}</h2></div>
            </div>
            <div className="grid-2">
              {tours.map((t, i) => (
                <Reveal key={t.id} className="feat" delay={(i % 2) * 80}>
                  {t.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="feat__img" src={t.imageUrl} alt="" loading="lazy" />
                  )}
                  <h3>{t.title}{t.period ? ` · ${t.period}` : ""}</h3>
                  <RichHtml text={t.description} />
                  {t.linkUrl && (
                    <a href={t.linkUrl} target="_blank" rel="noopener" className="btn btn--ghost" style={{ marginTop: 14 }}>
                      자세히 보기 <Arrow />
                    </a>
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 가치 ── */}
      <section className="section">
        <div className="wrap">
          <div className="section__head section__head--split">
            <div><div className="eyebrow">Values</div></div>
            <div><h2 className="title">{pick(c, "about.values.title", "피클박스가 지키는 세 가지.")}</h2></div>
          </div>
          <div className="grid-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.k} className="feat" delay={(i % 3) * 70}>
                <div className="feat__ico">{String(i + 1).padStart(2, "0")}</div>
                <h3>{v.k} · {v.ko}</h3>
                <p>{v.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 연혁 ── */}
      <section className="section section--alt">
        <div className="wrap">
          <div className="section__head section__head--split">
            <div><div className="eyebrow">Timeline</div></div>
            <div><h2 className="title">{pick(c, "about.timeline.title", "피클박스가 걸어온 길.")}</h2></div>
          </div>
          <ul className="timeline">
            {TIMELINE.map((t) => (
              <li key={t.h}>
                <span className="yr">{t.yr}</span>
                <span className="ev"><b>{t.h}</b><span>{t.p}</span></span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Sections page="about" position="bottom" preview={preview} />

      {/* ── CTA ── */}
      <section className="section join">
        <div className="wrap">
          <Reveal className="join__card">
            <div>
              <h2><Multiline text={pick(c, "about.cta.title", "피클박스가 궁금하다면,\n직접 만나보세요.")} /></h2>
              <p>{pick(c, "about.cta.desc", "서울숲 갤러리아 포레에서 코트와 레슨, 커뮤니티를 경험할 수 있습니다.")}</p>
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
