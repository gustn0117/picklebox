import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import { getCopy, pick, pickList, getCopyValue } from "../lib/copy";
import Multiline from "../components/Multiline";
import Reveal from "../components/Reveal";
import Arrow from "../components/Arrow";
import { LINKS } from "../lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    title: await getCopyValue("seo.founder", "대표 소개 — PICKLEBOX"),
    description: "테니스에서 피클볼로 — 조민정 대표가 그리는 피클박스 이야기.",
  };
}


export default async function Founder() {
  const c = await getCopy("founder");
  const photo = pick(c, "founder.photo", "");
  const CAREER = pickList(c, "founder.career",
    "쫌치는언니(유튜브) 운영 · 테니스/피클볼 코치\n전 대한테니스협회 이사\nITF(국제테니스연맹) Level 1 Coaching 자격증\nITF(국제테니스연맹) Level 2 Coaching 이수\n명지대학교 졸업\n2025 제2회 오크밸리 피클볼대회 우승\n2025 피클볼 일본 Federation 우승 · 준우승").map((x) => x[0]);
  return (
    <>
      <Nav />
      <PageHero
        eyebrow="Founder"
        num="03"
        title={pick(c, "founder.hero.title", "테니스에서 피클볼로, 즐거움을 잇다.")}
        lead={pick(c, "founder.hero.lead", "라켓 하나로 사람과 사람을 연결해 온 조민정 대표가 피클박스를 시작한 이유.")}
      />

      {/* ── 프로필 ── */}
      <section className="section story">
        <div className="wrap story__grid">
          <Reveal className="story__mark photo-slot photo-slot--founder" style={{ aspectRatio: "4 / 5", ...(photo ? { backgroundImage: `url(${photo})` } : {}) }} />
          <Reveal className="story__body" delay={80}>
            <div className="eyebrow">조민정 · 대표</div>
            <h2 className="title">{pick(c, "founder.a.title", "코트 위의 즐거움을, 더 많은 사람에게.")}</h2>
            <p className="lead">{pick(c, "founder.a.lead", "오랜 시간 라켓 스포츠와 함께해 온 조민정 대표는, 피클볼이 가진 ‘쉽게 배우고 함께 웃는’ 힘에 매료되어 피클박스를 시작했습니다.")}</p>
            <ul className="career">
              {CAREER.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── 철학 ── */}
      <section className="section">
        <div className="wrap">
          <div className="section__head section__head--split">
            <div><div className="eyebrow">Philosophy</div></div>
            <div><h2 className="title">{pick(c, "founder.b.title", "운동을 넘어, 사람을 연결합니다.")}</h2></div>
          </div>
          <p className="lead" style={{ maxWidth: 720 }}>{pick(c, "founder.b.body", "피클박스가 만들고 싶은 것은 단순한 운동 공간이 아닙니다. 처음 온 사람도 편하게 어울리고, 좋은 사람들과 다시 만나고 싶어지는 곳 — 코트 위의 작은 즐거움이 일상의 활력이 되는 문화를 만들어 갑니다.")}</p>
        </div>
      </section>

      {/* ── 채널 ── */}
      <section className="section story">
        <div className="wrap">
          <div className="section__head section__head--split">
            <div><div className="eyebrow">Channels</div></div>
            <div><h2 className="title">{pick(c, "founder.channels.title", "대표의 이야기, 더 가까이")}</h2></div>
          </div>
          <div className="channels">
            <a href={LINKS.youtube} target="_blank" rel="noopener" className="channels__card">
              <span className="channels__tag">YouTube</span>
              <b>쫌치는언니</b>
              <span className="channels__go">채널 보기 <Arrow /></span>
            </a>
            {LINKS.instagram.map((ig) => (
              <a key={ig.url} href={ig.url} target="_blank" rel="noopener" className="channels__card">
                <span className="channels__tag">Instagram</span>
                <b>{ig.handle}</b>
                <span className="channels__go">팔로우 <Arrow /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
