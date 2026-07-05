"use client";
import { useEffect, useRef } from "react";

// 전역 이펙트 레이어: 상단 스크롤 진행바 + 커서 스포트라이트.
export default function Fx() {
  const barRef = useRef(null);
  const spotRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bar = barRef.current;

    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? h.scrollTop / max : 0;
      if (bar) bar.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    let raf = 0;
    let removeSpot = () => {};
    const spot = spotRef.current;
    if (spot && !reduce && window.matchMedia("(pointer: fine)").matches) {
      let x = window.innerWidth / 2, y = window.innerHeight / 2, tx = x, ty = y;
      const move = (e) => { tx = e.clientX; ty = e.clientY; if (spot.style.opacity !== "1") spot.style.opacity = "1"; };
      const loop = () => {
        x += (tx - x) * 0.16; y += (ty - y) * 0.16;
        spot.style.transform = `translate(${x - spot.offsetWidth / 2}px, ${y - spot.offsetHeight / 2}px)`;
        raf = requestAnimationFrame(loop);
      };
      window.addEventListener("pointermove", move);
      loop();
      removeSpot = () => { window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      removeSpot();
    };
  }, []);

  return (
    <>
      <div ref={barRef} className="fx-progress" aria-hidden="true" />
      <div ref={spotRef} className="fx-spot" aria-hidden="true" />
    </>
  );
}
