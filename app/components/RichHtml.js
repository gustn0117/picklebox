import { sanitizeHtml, textToHtml } from "../lib/sanitize";

// 관리자에서 저장한 서식 텍스트를 공개 페이지에 렌더한다.
// 저장 시 이미 정화되지만, 표시 단계에서 한 번 더 정화해 이중으로 막는다.
// 서식이 없는 옛 값(줄바꿈만 있는 텍스트)은 문단으로 변환해 보여준다.
export default function RichHtml({ text, className = "" }) {
  const html = sanitizeHtml(textToHtml(text));
  if (!html) return null;
  return <div className={`rt-body ${className}`.trim()} dangerouslySetInnerHTML={{ __html: html }} />;
}
