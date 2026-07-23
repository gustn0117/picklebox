"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, reserveHref } from "../lib/site";
import SearchBox from "./SearchBox";

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
  </svg>
);

// 메뉴의 드롭다운 항목 배열 반환(고정 links 또는 /api/nav 동적 데이터)
function dropItems(m, navData) {
  if (m.links) return m.links;
  if (m.dynamic) {
    const items = navData[m.dynamic] || [];
    return items.length ? [...items, { label: m.moreLabel || "전체보기", href: m.href, more: true }] : [];
  }
  return [];
}

export default function Nav() {
  const [open, setOpen] = useState(false);      // 모바일 메뉴
  const [expanded, setExpanded] = useState(null); // 모바일 펼친 항목
  const [hover, setHover] = useState(null);      // 데스크톱 드롭다운
  const [search, setSearch] = useState(false);
  const [navData, setNavData] = useState({ events: [], goods: [], tours: [], journal: [] });
  const pathname = usePathname();
  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  useEffect(() => {
    fetch("/api/nav").then((r) => r.json()).then(setNavData).catch(() => {});
  }, []);

  const DropLink = ({ it, onClick }) =>
    it.external ? (
      <a className={`nav-drop__link${it.more ? " nav-drop__link--more" : ""}`} href={it.href} target="_blank" rel="noopener" onClick={onClick}>{it.label}{it.external && " ↗"}</a>
    ) : (
      <Link className={`nav-drop__link${it.more ? " nav-drop__link--more" : ""}`} href={it.href} onClick={onClick}>{it.label}</Link>
    );

  return (
    <nav className="nav" onMouseLeave={() => setHover(null)}>
      <div className="wrap nav__inner">
        <Link href="/" className="nav__brand" aria-label="PICKLEBOX 홈">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="nav__logo" src="/pb-logomark2.png" alt="PICKLEBOX" />
        </Link>

        <div className="nav__menu">
          {NAV.map((m) => {
            const items = dropItems(m, navData);
            return (
              <div key={m.href} className="nav__item" onMouseEnter={() => setHover(items.length ? m.href : null)}>
                <Link href={m.href} className={`nav__link ${isActive(m.href) ? "is-active" : ""}`}>{m.label}</Link>
                {items.length > 0 && hover === m.href && (
                  <div className="nav-drop">
                    {items.map((it, i) => <DropLink key={i} it={it} onClick={() => setHover(null)} />)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="nav__cta-group">
          <button className="nav__search" aria-label="검색" onClick={() => setSearch(true)}><SearchIcon /></button>
          <a href={reserveHref} target="_blank" rel="noopener" className="btn btn--primary nav__cta">Join the Game</a>
          <Link href="/partners" className="btn btn--ghost nav__cta">Partner with Us</Link>
        </div>

        <div className="nav__mobile-actions">
          <button className="nav__search" aria-label="검색" onClick={() => setSearch(true)}><SearchIcon /></button>
          <button className="btn btn--ghost nav__burger" aria-expanded={open} aria-label="메뉴 열기" onClick={() => setOpen((v) => !v)}>메뉴</button>
        </div>
      </div>

      {open && (
        <div className="wrap nav__mobile">
          {NAV.map((m) => {
            const items = dropItems(m, navData);
            return (
              <div key={m.href} className="nav__mrow">
                <div className="nav__mhead">
                  <Link href={m.href} className={`nav__link ${isActive(m.href) ? "is-active" : ""}`} onClick={() => setOpen(false)}>{m.label}</Link>
                  {items.length > 0 && (
                    <button className="nav__mexp" aria-label="펼치기" onClick={() => setExpanded((v) => (v === m.href ? null : m.href))}>
                      {expanded === m.href ? "−" : "+"}
                    </button>
                  )}
                </div>
                {items.length > 0 && expanded === m.href && (
                  <div className="nav__msub">
                    {items.map((it, i) => <DropLink key={i} it={it} onClick={() => setOpen(false)} />)}
                  </div>
                )}
              </div>
            );
          })}
          <a href={reserveHref} target="_blank" rel="noopener" className="btn btn--primary" onClick={() => setOpen(false)}>Join the Game</a>
          <Link href="/partners" className="btn btn--ghost" onClick={() => setOpen(false)}>Partner with Us</Link>
        </div>
      )}

      {search && <SearchBox onClose={() => setSearch(false)} />}
    </nav>
  );
}
