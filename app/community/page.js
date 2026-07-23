import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import { getCopy, pick, getCopyValue } from "../lib/copy";
import Reveal from "../components/Reveal";
import Arrow from "../components/Arrow";
import { LINKS, reserveHref } from "../lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    title: await getCopyValue("seo.community", "Global Community — PICKLEBOX"),
    description: "서울에서 세계로. 레벨별 매칭과 정기 모임, 글로벌 교류로 이어지는 피클박스 커뮤니티.",
  };
}

const OFFERS = [
  { h: "정기 모임", p: "레벨·시간대별 정기 세션으로 꾸준히 즐기는 커뮤니티. 혼자 와도 함께 치게 됩니다." },
  { h: "레벨 매칭", p: "실력에 맞는 상대와 매칭해 드립니다. 초보도 부담 없이 랠리를 이어가세요." },
  { h: "글로벌 교류", p: "서울을 찾는 해외 플레이어와 교류하는 오픈 세션. 코트에 언어는 필요 없습니다." },
  { h: "멤버 혜택", p: "코트·굿즈·이벤트 우선 예약 등 멤버 전용 혜택을 준비하고 있습니다. [혜택 상세]" },
];

const STEPS = [
  { s: "STEP 01", h: "가입", p: "인스타 DM·예약으로 커뮤니티 참여 의사를 남겨주세요." },
  { s: "STEP 02", h: "매칭", p: "레벨·시간대에 맞는 세션과 멤버를 안내해 드립니다." },
  { s: "STEP 03", h: "플레이", p: "정기 세션에서 함께 치고, 웃고, 연결되세요." },
];

export default async function Community() {
  const c = await getCopy("community");
  return (
    <>
      <Nav />
      <PageHero
        eyebrow="Global Community"
        title={pick(c, "community.hero.title", "서울에서 세계로, 피클박스 커뮤니티.")}
        lead={pick(c, "community.hero.lead", "피클볼은 혼자여도 함께가 됩니다. 레벨별 매칭과 정기 모임, 글로벌 교류로 코트 위의 인연을 잇습니다.")}
      />

      <section className="section">
        <div className="wrap">
          <div className="section__head section__head--split">
            <div><div className="eyebrow">What we offer</div></div>
            <div><h2 className="title">{pick(c, "community.a.title", "코트가 곧 커뮤니티입니다.")}</h2></div>
          </div>
          <div className="why__grid">
            {OFFERS.map((o, i) => (
              <Reveal key={o.h} className="feat" delay={(i % 4) * 60}>
                <div className="feat__ico">{String(i + 1).padStart(2, "0")}</div>
                <h3>{o.h}</h3>
                <p>{o.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap">
          <div className="section__head section__head--split">
            <div><div className="eyebrow">How to join</div></div>
            <div><h2 className="title">{pick(c, "community.b.title", "참여는 세 단계면 충분해요.")}</h2></div>
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

      <section className="section join">
        <div className="wrap">
          <Reveal className="join__card">
            <div>
              <div className="eyebrow" style={{ marginBottom: 20 }}>Join the Club</div>
              <h2 className="join__card--en">Play. Smile. Connect.</h2>
              <p>커뮤니티 참여·정기 모임 문의를 남겨주시면 편하게 안내해 드립니다.</p>
            </div>
            <div className="join__actions">
              <a href={reserveHref} target="_blank" rel="noopener" className="btn btn--lime">
                참여 문의하기 <Arrow />
              </a>
              <a href={LINKS.instagram[0].url} target="_blank" rel="noopener" className="btn btn--ghost">인스타 DM</a>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
