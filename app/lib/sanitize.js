// 관리자에서 저장되는 서식 HTML을 허용 목록 방식으로 정화한다.
// 외부 의존성 없이 동작하며, 서버(저장 시)에서 호출해 위험 태그·속성을 제거한다.

const ALLOWED = {
  p: [], br: [], strong: [], b: [], em: [], i: [], u: [], s: [],
  ul: [], ol: [], li: [], h3: [], h4: [], blockquote: [],
  a: ["href", "target", "rel"],
  span: ["style"], div: ["style"],
};
// style 은 아래 속성만 통과
const STYLE_OK = /^(text-align|font-size|font-weight)\s*:\s*[a-zA-Z0-9.%\s-]+$/;

function cleanStyle(value) {
  return String(value)
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s && STYLE_OK.test(s))
    .join("; ");
}

function safeHref(value) {
  const v = String(value).trim();
  // javascript:, data: 등 스킴 차단
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(v)) return v;
  return "";
}

// 태그 단위로 훑으며 허용된 것만 남긴다.
export function sanitizeHtml(input) {
  const src = String(input ?? "");
  if (!src) return "";

  // script/style 블록은 내용까지 통째로 제거
  let s = src.replace(/<(script|style|iframe|object|embed)[\s\S]*?<\/\1>/gi, "");
  s = s.replace(/<!--[\s\S]*?-->/g, "");

  s = s.replace(/<\/?([a-zA-Z0-9]+)((?:\s+[^<>]*)?)\/?>/g, (m, rawTag, rawAttrs) => {
    const tag = rawTag.toLowerCase();
    if (!Object.prototype.hasOwnProperty.call(ALLOWED, tag)) return "";
    if (m.startsWith("</")) return `</${tag}>`;

    const allowedAttrs = ALLOWED[tag];
    const out = [];
    const attrRe = /([a-zA-Z-]+)\s*=\s*("([^"]*)"|'([^']*)')/g;
    let a;
    while ((a = attrRe.exec(rawAttrs || "")) !== null) {
      const name = a[1].toLowerCase();
      let value = a[3] ?? a[4] ?? "";
      if (!allowedAttrs.includes(name)) continue;
      if (name === "style") {
        value = cleanStyle(value);
        if (!value) continue;
      }
      if (name === "href") {
        value = safeHref(value);
        if (!value) continue;
      }
      if (name === "target" && value !== "_blank") continue;
      out.push(`${name}="${value.replace(/"/g, "&quot;")}"`);
    }
    // 외부 링크는 안전 속성 강제
    if (tag === "a") {
      const hasHref = out.some((x) => x.startsWith("href="));
      if (!hasHref) return "";
      if (!out.some((x) => x.startsWith("rel="))) out.push('rel="noopener noreferrer"');
    }
    const selfClose = tag === "br" ? " /" : "";
    return `<${tag}${out.length ? " " + out.join(" ") : ""}${selfClose}>`;
  });

  // 여는 태그가 제거되어 홀로 남은 닫는 태그 정리(예: 위험한 링크를 걷어낸 뒤 남는 </a>)
  s = s.replace(/<\/([a-z0-9]+)>/gi, (m, tag) => {
    const open = new RegExp(`<${tag}\\b`, "i");
    return open.test(s) ? m : "";
  });

  return s.trim();
}

// 서식이 없는 옛 텍스트(줄바꿈만 있는 값)를 문단 HTML로 바꾼다.
export function textToHtml(text) {
  const t = String(text ?? "").trim();
  if (!t) return "";
  if (/<\/?(p|br|strong|em|ul|ol|li|h3|h4|a|span|div|u|s|b|i)\b/i.test(t)) return t; // 이미 HTML
  return t
    .split(/\n{2,}/)
    .map((para) => `<p>${para.split("\n").join("<br />")}</p>`)
    .join("");
}

// 값이 서식 HTML인지 여부(공개 페이지에서 렌더 방식 결정)
export const looksLikeHtml = (v) => /<\/?[a-z][\s\S]*>/i.test(String(v ?? ""));
