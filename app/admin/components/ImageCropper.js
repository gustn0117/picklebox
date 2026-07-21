"use client";
import { useEffect, useRef, useState } from "react";

// 업로드한 이미지를 권장 비율에 맞춰 자르고, 보일 위치를 조정하는 팝업.
// 드래그로 이동 + 슬라이더로 확대, "적용"하면 canvas 로 잘라 새 파일을 만들어 넘긴다.
const MAX_OUT = 1600; // 결과물 최대 가로(px)

export default function ImageCropper({ file, aspect = 16 / 9, onCancel, onDone }) {
  const boxRef = useRef(null);
  const imgRef = useRef(null);
  const [src, setSrc] = useState("");
  const [nat, setNat] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // 틀 크기(표시용)
  const boxW = 460;
  const boxH = Math.round(boxW / aspect);

  // 이미지를 틀에 꽉 채우는 기본 배율
  const baseScale = nat.w && nat.h ? Math.max(boxW / nat.w, boxH / nat.h) : 1;
  const scale = baseScale * zoom;
  const dispW = nat.w * scale;
  const dispH = nat.h * scale;

  // 빈 공간이 생기지 않도록 이동 범위 제한
  function clamp(p, w = dispW, h = dispH) {
    const minX = Math.min(0, boxW - w), minY = Math.min(0, boxH - h);
    return { x: Math.min(0, Math.max(minX, p.x)), y: Math.min(0, Math.max(minY, p.y)) };
  }
  useEffect(() => { setPos((p) => clamp(p)); /* eslint-disable-next-line */ }, [zoom, nat.w, nat.h]);

  function onDown(e) {
    const pt = e.touches ? e.touches[0] : e;
    drag.current = { sx: pt.clientX, sy: pt.clientY, ox: pos.x, oy: pos.y };
  }
  function onMove(e) {
    if (!drag.current) return;
    const pt = e.touches ? e.touches[0] : e;
    setPos(clamp({ x: drag.current.ox + (pt.clientX - drag.current.sx), y: drag.current.oy + (pt.clientY - drag.current.sy) }));
  }
  const onUp = () => { drag.current = null; };

  async function apply() {
    setBusy(true);
    const outW = Math.min(MAX_OUT, Math.round(boxW * 2));
    const outH = Math.round(outW / aspect);
    const canvas = document.createElement("canvas");
    canvas.width = outW; canvas.height = outH;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    const k = outW / boxW; // 표시 좌표 → 출력 좌표 배율
    ctx.drawImage(imgRef.current, pos.x * k, pos.y * k, dispW * k, dispH * k);
    const blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg", 0.9));
    setBusy(false);
    onDone(new File([blob], (file.name || "image").replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }));
  }

  return (
    <div className="cropper" onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp} onTouchMove={onMove} onTouchEnd={onUp}>
      <div className="cropper__panel">
        <div className="cropper__title">이미지 자르기 · 위치 조정</div>
        <p className="cropper__help">사진을 끌어 위치를 맞추고, 아래 막대로 크기를 조절하세요.</p>

        <div ref={boxRef} className="cropper__box" style={{ width: boxW, height: boxH }} onMouseDown={onDown} onTouchStart={onDown}>
          {src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imgRef} src={src} alt="" draggable={false}
              onLoad={(e) => setNat({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
              style={{ width: dispW, height: dispH, transform: `translate(${pos.x}px, ${pos.y}px)` }}
            />
          )}
          <div className="cropper__grid" aria-hidden="true" />
        </div>

        <div className="cropper__zoom">
          <span>축소</span>
          <input type="range" min="1" max="3" step="0.01" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} />
          <span>확대</span>
        </div>

        <div className="cropper__actions">
          <button type="button" className="a-btn a-btn--primary" onClick={apply} disabled={busy || !nat.w}>
            {busy ? "적용 중…" : "적용"}
          </button>
          <button type="button" className="a-btn" onClick={() => onDone(file)}>원본 그대로</button>
          <button type="button" className="a-btn" onClick={onCancel}>취소</button>
        </div>
      </div>
    </div>
  );
}
