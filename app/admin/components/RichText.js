"use client";
import { useEffect, useRef, useState } from "react";

// 가벼운 서식 편집기 — 외부 라이브러리 없이 contentEditable + 서식 명령 사용.
// 저장 값은 HTML 문자열이며, 서버에서 허용 태그만 남기고 정화한다.
const CMD = (name, value) => document.execCommand(name, false, value);

function Btn({ title, onDo, active, children, wide }) {
  return (
    <button
      type="button"
      title={title}
      className={`rt-btn${active ? " rt-btn--on" : ""}${wide ? " rt-btn--wide" : ""}`}
      // mousedown 에서 막아야 편집 영역의 선택이 유지된다
      onMouseDown={(e) => { e.preventDefault(); onDo(); }}
    >
      {children}
    </button>
  );
}

export default function RichText({ value = "", onChange, placeholder }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  // 외부 값이 바뀌었을 때만 주입(입력 중 커서 튐 방지)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!ready) { el.innerHTML = value || ""; setReady(true); return; }
    if (document.activeElement !== el && el.innerHTML !== (value || "")) el.innerHTML = value || "";
  }, [value, ready]);

  const emit = () => onChange && onChange(ref.current?.innerHTML ?? "");
  const run = (fn) => { ref.current?.focus(); fn(); emit(); };

  function makeLink() {
    const url = prompt("연결할 주소를 입력하세요 (예: https://example.com)");
    if (!url) return;
    run(() => CMD("createLink", url));
  }

  return (
    <div className="rt">
      <div className="rt-bar">
        <Btn title="굵게" onDo={() => run(() => CMD("bold"))}><b>B</b></Btn>
        <Btn title="기울임" onDo={() => run(() => CMD("italic"))}><i>I</i></Btn>
        <Btn title="밑줄" onDo={() => run(() => CMD("underline"))}><u>U</u></Btn>
        <span className="rt-sep" />
        <Btn title="크게" onDo={() => run(() => CMD("fontSize", "5"))}>가+</Btn>
        <Btn title="보통" onDo={() => run(() => CMD("fontSize", "3"))}>가</Btn>
        <Btn title="작게" onDo={() => run(() => CMD("fontSize", "2"))}>가−</Btn>
        <span className="rt-sep" />
        <Btn title="왼쪽 정렬" onDo={() => run(() => CMD("justifyLeft"))}>≡</Btn>
        <Btn title="가운데 정렬" onDo={() => run(() => CMD("justifyCenter"))}>≣</Btn>
        <span className="rt-sep" />
        <Btn title="글머리 목록" onDo={() => run(() => CMD("insertUnorderedList"))}>• 목록</Btn>
        <Btn title="링크" onDo={makeLink}>링크</Btn>
        <Btn title="서식 지우기" onDo={() => run(() => CMD("removeFormat"))}>서식해제</Btn>
      </div>
      <div
        ref={ref}
        className="rt-area"
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder || "내용을 입력하세요"}
        onInput={emit}
        onBlur={emit}
      />
    </div>
  );
}
