"use client";
import { useEffect, useRef, useState } from "react";

// 스크롤 진입 시 0 → to 로 카운트업. pad: 자릿수 0채움.
export default function CountUp({ to, pad = 0, className }) {
  const ref = useRef(null);
  const started = useRef(false);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(to); return; }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const dur = 1300, t0 = performance.now();
          const tick = (t) => {
            const p = Math.min(1, (t - t0) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(to * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  const text = pad > 0 ? String(n).padStart(pad, "0") : String(n);
  return <span ref={ref} className={className}>{text}</span>;
}
