"use client";
import { useState } from "react";

// 유튜브 썸네일 — maxresdefault가 없는 영상은 유튜브가 120x90 회색 기본 이미지를 200으로 돌려준다.
// 이를 감지해 hqdefault로 자동 대체한다. (컨테이너가 16:9 + object-fit:cover 라 4:3 여백은 잘려 자연스럽다)
export default function YtThumb({ id, alt = "" }) {
  const [fallback, setFallback] = useState(false);
  const src = fallback
    ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
    : `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={(e) => {
        // 회색 기본 이미지(120x90)면 기본화질로 교체
        if (!fallback && e.currentTarget.naturalWidth <= 121) setFallback(true);
      }}
      onError={() => {
        if (!fallback) setFallback(true);
      }}
    />
  );
}
