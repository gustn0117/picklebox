"use client";
import { useState } from "react";
import Ball from "./Ball";
import { LINKS } from "../lib/site";

const MENU = [
  { href: "#story", label: "브랜드" },
  { href: "#brands", label: "서비스" },
  { href: "#location", label: "오시는 길" },
  { href: "#contact", label: "문의" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="nav">
      <div className="wrap nav__inner">
        <a href="#top" className="nav__brand" aria-label="PICKLEBOX 홈">
          <Ball body="var(--green)" dots="#fff" />
          PICKLEBOX
        </a>

        <div className="nav__menu">
          {MENU.map((m) => (
            <a key={m.href} href={m.href} className="nav__link">{m.label}</a>
          ))}
          <a href={LINKS.store} target="_blank" rel="noopener" className="btn btn--primary nav__cta">
            스마트스토어
          </a>
        </div>

        <button
          className="btn btn--ghost nav__burger"
          aria-expanded={open}
          aria-label="메뉴 열기"
          onClick={() => setOpen((v) => !v)}
        >
          메뉴
        </button>
      </div>

      {open && (
        <div className="wrap" style={{ paddingBottom: 18, display: "flex", flexDirection: "column", gap: 10 }}>
          {MENU.map((m) => (
            <a key={m.href} href={m.href} className="nav__link" onClick={() => setOpen(false)}>{m.label}</a>
          ))}
          <a href={LINKS.store} target="_blank" rel="noopener" className="btn btn--primary" onClick={() => setOpen(false)}>
            스마트스토어 바로가기
          </a>
        </div>
      )}
    </nav>
  );
}
