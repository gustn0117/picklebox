"use client";
import { useState } from "react";
import ImageUpload from "./ImageUpload";
import RichText from "./RichText";
import Icon from "./Icon";

// 카드 목록 편집기 — 카드 추가·삭제·순서 이동. 값은 JSON 문자열로 주고받는다.
function parse(value) {
  if (Array.isArray(value)) return value;
  try {
    const v = JSON.parse(value || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

const EMPTY = { title: "", description: "", imageUrl: "", linkUrl: "" };

export default function CardsEditor({ value, onChange }) {
  const [cards, setCards] = useState(() => parse(value));
  const [open, setOpen] = useState(null);

  function push(next) {
    setCards(next);
    onChange(JSON.stringify(next));
  }
  const add = () => { push([...cards, { ...EMPTY }]); setOpen(cards.length); };
  const del = (i) => { if (!confirm("이 카드를 삭제할까요?")) return; push(cards.filter((_, k) => k !== i)); setOpen(null); };
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= cards.length) return;
    const next = [...cards];
    [next[i], next[j]] = [next[j], next[i]];
    push(next);
    setOpen(j);
  };
  const set = (i, key, val) => push(cards.map((c, k) => (k === i ? { ...c, [key]: val } : c)));

  return (
    <div className="cards-ed">
      {cards.length === 0 && <div className="cards-ed__empty">카드가 없습니다. 아래 “+ 카드 추가”를 눌러 만드세요.</div>}

      {cards.map((c, i) => (
        <div className="cards-ed__item" key={i}>
          <div className="cards-ed__head">
            <button type="button" className="cards-ed__toggle" onClick={() => setOpen(open === i ? null : i)}>
              <b>{i + 1}.</b> {c.title || "(제목 없음)"}
            </button>
            <div className="cards-ed__acts">
              <button type="button" className="a-icon" title="위로" onClick={() => move(i, -1)} disabled={i === 0}><Icon name="up" size={15} /></button>
              <button type="button" className="a-icon" title="아래로" onClick={() => move(i, 1)} disabled={i === cards.length - 1}><Icon name="down" size={15} /></button>
              <button type="button" className="a-btn a-btn--danger a-btn--sm" onClick={() => del(i)}>삭제</button>
            </div>
          </div>

          {open === i && (
            <div className="cards-ed__body">
              <div className="a-field">
                <label>카드 제목</label>
                <input type="text" value={c.title || ""} onChange={(e) => set(i, "title", e.target.value)} />
              </div>
              <div className="a-field">
                <label>설명</label>
                <RichText value={c.description || ""} onChange={(html) => set(i, "description", html)} placeholder="카드 설명을 입력하세요" />
              </div>
              <div className="a-field">
                <ImageUpload label="카드 이미지(선택)" hint="가로 1600×1000 권장" aspect={1.6} value={c.imageUrl || ""} onChange={(url) => set(i, "imageUrl", url)} />
              </div>
              <div className="a-field">
                <label>링크(선택)</label>
                <input type="url" value={c.linkUrl || ""} onChange={(e) => set(i, "linkUrl", e.target.value)} placeholder="https://" />
              </div>
            </div>
          )}
        </div>
      ))}

      <button type="button" className="a-btn a-btn--primary" onClick={add}>+ 카드 추가</button>
    </div>
  );
}
