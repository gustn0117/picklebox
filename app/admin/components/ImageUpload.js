"use client";
import { useState, useRef } from "react";

// 이미지 업로드 필드 — 파일 선택/드래그 → 업로드 → 미리보기. value(url)를 onChange로 부모에 전달.
export default function ImageUpload({ name, value = "", onChange, label = "이미지", hint }) {
  const [url, setUrl] = useState(value || "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);

  async function upload(file) {
    if (!file) return;
    setBusy(true);
    setErr("");
    const fd = new FormData();
    fd.append("file", file);
    const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const d = await r.json().catch(() => ({}));
    if (r.ok && d.url) {
      setUrl(d.url);
      onChange && onChange(d.url);
    } else {
      setErr(d.error || "업로드에 실패했습니다.");
    }
    setBusy(false);
  }

  function clear() {
    setUrl("");
    onChange && onChange("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>
        {label}
        {hint && <span style={{ fontWeight: 400, color: "#9a9aa4", marginLeft: 8, fontSize: 12 }}>{hint}</span>}
      </label>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); upload(e.dataTransfer.files?.[0]); }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${drag ? "#009eae" : "#d0d0d8"}`,
          borderRadius: 12, padding: 14, cursor: "pointer",
          background: drag ? "#eafcff" : "#fafafc", textAlign: "center",
        }}
      >
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" style={{ maxWidth: "100%", maxHeight: 160, borderRadius: 8, display: "block", margin: "0 auto" }} />
        ) : (
          <div style={{ color: "#999", fontSize: 14, padding: "24px 0" }}>
            {busy ? "업로드 중…" : "클릭하거나 이미지를 끌어다 놓으세요"}
          </div>
        )}
      </div>
      {err && <div style={{ color: "#d33", fontSize: 12 }}>{err}</div>}
      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}
          style={{ padding: "6px 12px", fontSize: 13, borderRadius: 8, border: "1px solid #ccc", background: "#fff", cursor: "pointer" }}>
          {url ? "변경" : "파일 선택"}
        </button>
        {url && (
          <button type="button" onClick={clear}
            style={{ padding: "6px 12px", fontSize: 13, borderRadius: 8, border: "1px solid #eecccc", background: "#fff", color: "#c33", cursor: "pointer" }}>
            제거
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files?.[0])} />
      <input type="hidden" name={name} value={url} readOnly />
    </div>
  );
}
