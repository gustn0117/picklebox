import Link from "next/link";
import { LINKS, BUSINESS } from "../lib/site";
import { db } from "../lib/db";
import { getCopy, pick, handleFromUrl } from "../lib/copy";

function IgIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YtIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="4.5" fill="currentColor" />
      <path d="M10 8.6 L16.2 12 L10 15.4 Z" fill="var(--bg)" />
    </svg>
  );
}

// 전 페이지 공유 푸터 — 외부 링크(스토어·인스타·유튜브·지도) 집약 + 사업자 정보.
// 굿즈 판매처는 관리자(CMS)에서 관리되는 Goods를 읽어 표시.
export default async function Footer() {
  let shops = [];
  try {
    shops = await db.goods.findMany({ where: { visible: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
  } catch {
    shops = [];
  }
  // 사이트 정보(주소·SNS·태그라인)는 관리자에서 수정 — 비어 있으면 기존 값 폴백
  const c = await getCopy("site");
  const igs = [
    { url: pick(c, "site.instagram1", LINKS.instagram[0].url), fallback: LINKS.instagram[0].handle },
    { url: pick(c, "site.instagram2", LINKS.instagram[1].url), fallback: LINKS.instagram[1].handle },
    { url: pick(c, "site.instagram3", LINKS.instagram[2].url), fallback: LINKS.instagram[2].handle },
  ].filter((x) => x.url);
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div>
            <Link href="/" className="footer__brand">PICKLEBOX</Link>
            <p className="footer__tagline">
              {pick(c, "site.footerTagline", "피클볼을 치고, 웃고, 연결되며 일상에 즐거움을 선물하는 공간. Play, Smile, Connect.")}
            </p>
          </div>

          <div>
            <h4>Follow</h4>
            <div className="footer__links">
              {igs.map((ig) => (
                <a key={ig.url} href={ig.url} target="_blank" rel="noopener" className="footer__soc">
                  <IgIcon /><span>Instagram {handleFromUrl(ig.url, ig.fallback)}</span>
                </a>
              ))}
              <a href={pick(c, "site.youtube", LINKS.youtube)} target="_blank" rel="noopener" className="footer__soc">
                <YtIcon /><span>YouTube 쫌치는언니</span>
              </a>
            </div>
          </div>

          <div>
            <h4>Shop & Visit</h4>
            <div className="footer__links">
              {shops.map((s) => (
                <a key={s.id} href={s.buyUrl || "#"} target="_blank" rel="noopener">{s.name}</a>
              ))}
              <Link href="/visit">오시는 길</Link>
              <Link href="/visit">예약 · 문의</Link>
            </div>
          </div>

          <div>
            <h4>Explore</h4>
            <div className="footer__links">
              <Link href="/about">피클박스 안내</Link>
              <Link href="/pickleball">피클볼이란?</Link>
              <Link href="/founder">대표 소개</Link>
            </div>
          </div>
        </div>

        <div className="footer__biz">
          <span>{BUSINESS.name} · 대표 {BUSINESS.ceo} · 사업자등록번호 {BUSINESS.bizNo}</span>
          <span>{pick(c, "site.address", BUSINESS.address)}</span>
          <span>© {2026} PICKLEBOX. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
