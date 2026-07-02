"use client";
import { useEffect, useRef } from "react";

// 스크롤에 따라 미세하게 세로 이동하는 래퍼. reduced-motion 사용자는 이동 없음.
export default function Parallax({ children, speed = 0.15, className = "", style, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -speed;
        el.style.transform = `translateY(${offset.toFixed(1)}px)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [speed]);
  return (
    <span ref={ref} className={className} style={{ display: "block", willChange: "transform", ...style }} {...rest}>
      {children}
    </span>
  );
}
