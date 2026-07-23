"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// 사이트 통합 검색 — 돋보기 클릭 → 오버레이 → 실시간 결과.
export default function SearchBox({ onClose }) {
  const [q, setQ] = useState("");
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const term = q.trim();
    if (!term) { setGroups([]); setLoading(false); return; }
    setLoading(true);
    const id = setTimeout(async () => {
      try {
        const r = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
        const d = await r.json();
        setGroups(d.groups || []);
      } catch { setGroups([]); }
      setLoading(false);
    }, 220);
    return () => clearTimeout(id);
  }, [q]);

  function go(item) {
    onClose();
    if (item.external) window.open(item.href, "_blank", "noopener");
    else router.push(item.href);
  }

  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="search" role="dialog" aria-label="검색">
      <div className="search__backdrop" onClick={onClose} />
      <div className="search__panel">
        <div className="search__bar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="이벤트, 굿즈, 투어, 저널 검색…"
            aria-label="검색어 입력"
          />
          <button className="search__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>

        {q.trim() && (
          <div className="search__results">
            {loading && <div className="search__empty">검색 중…</div>}
            {!loading && total === 0 && <div className="search__empty">‘{q}’에 대한 결과가 없습니다.</div>}
            {!loading && groups.map((g) => (
              <div className="search__group" key={g.label}>
                <div className="search__glabel">{g.label}</div>
                {g.items.map((it, i) => (
                  <button className="search__item" key={i} onClick={() => go(it)}>
                    <span className="search__title">{it.title}{it.external && <span className="search__ext"> ↗</span>}</span>
                    {it.sub && <span className="search__sub">{it.sub}</span>}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
