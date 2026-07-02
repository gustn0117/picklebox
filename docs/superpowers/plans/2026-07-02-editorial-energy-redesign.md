# Editorial Energy 리디자인 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 피클박스 원페이지를 Fingerlime식 밝은 에디토리얼 뼈대 + Celebrity Pickleball Bash식 에너지 액센트(큰 타이포·마키·컬러 팝·스크롤 모션·다크 CTA)로 전면 리스타일한다.

**Architecture:** 콘텐츠/구조/링크는 그대로 두고 비주얼 시스템만 교체한다. 작업은 대부분 `app/globals.css`(디자인 토큰·섹션 스타일) + `app/page.js`(섹션 헤더 넘버링·마키 배치 마크업) + 신규 재사용 컴포넌트(`Marquee`, `useParallax`)에서 일어난다. 새 라이브러리 없이 순수 CSS + 기존 React 19/Next 15 스택으로 구현한다.

**Tech Stack:** Next.js 15.1.6 (App Router), React 19, 순수 CSS(모듈 없음, `globals.css` 전역), Fredoka(디스플레이) + Pretendard(본문).

## Global Constraints

- 한글 줄바꿈: `word-break: keep-all` + `text-wrap: balance/pretty`. `break-all` 금지.
- 새 npm 의존성 추가 금지. 기존 스택만 사용.
- 콘텐츠·카피·사업자 정보·링크(`app/lib/site.js`) 변경 금지.
- 접근성: 모든 상시/스크롤 모션은 `@media (prefers-reduced-motion: reduce)`에서 정지. 포커스 링 유지.
- 브랜드 컬러 유지: `--ink #0f2a1b`, `--green #1fa84e`, `--green-deep #0e7a38`, `--lime #d8f34e`, `--tangerine #ff7a45`, `--cream #fbfbf2`.
- 검증 방식: 이 프로젝트는 자동화 테스트 하네스가 없다. 각 태스크의 "검증"은 **(1) `npm run build`가 에러 없이 통과 + (2) `npm run dev`로 육안 확인**이다. 완료 후 커밋.
- 반응형 브레이크포인트 유지: 900px, 560px.

---

### Task 1: 디자인 토큰 · 타이포 스케일 · 섹션 넘버링 기반

**Files:**
- Modify: `app/globals.css` (`:root` 블록, `.section__head`/`.eyebrow`/`.title` 영역)

**Interfaces:**
- Produces: 새 CSS 커스텀 프로퍼티 `--display-hero`, `--display-title`, 유틸 클래스 `.section__num`(섹션 넘버 뱃지), `.marquee`/`.marquee__track`(Task 2에서 채움). 다른 태스크가 이 토큰/클래스를 소비한다.

- [ ] **Step 1: `:root`에 타이포 스케일 토큰 추가**

`app/globals.css`의 `:root` 안, `--wrap: 1140px;` 위에 추가:

```css
  /* 에디토리얼 타이포 스케일 */
  --display-hero: clamp(2.9rem, 8vw, 5.4rem);
  --display-title: clamp(2.1rem, 5vw, 3.6rem);
  --track-tight: -0.03em;
```

- [ ] **Step 2: 히어로/타이틀 타이포를 새 스케일로 확대**

`.hero__en`의 `font-size`를 `var(--display-hero)`로, `letter-spacing`을 `var(--track-tight)`로 교체. `.title`의 `font-size`를 `var(--display-title)`로, `letter-spacing`을 `var(--track-tight)`로 교체.

- [ ] **Step 3: 섹션 넘버 뱃지 스타일 추가**

`.eyebrow` 규칙 아래에 추가. Fingerlime식 넘버링(예: `/ 02`)을 eyebrow 옆에 배치:

```css
.section__num {
  font-family: var(--font-display); font-weight: 600;
  font-size: 0.82rem; letter-spacing: 0.14em; color: var(--green);
  margin-left: 10px; opacity: 0.7;
}
.section__head .eyebrow { vertical-align: middle; }
```

- [ ] **Step 4: 검증 — 빌드 + 육안**

Run: `npm run build`
Expected: 에러 없이 컴파일 완료.
`npm run dev` 후 히어로 제목이 눈에 띄게 커지고 타이틀이 커졌는지 확인.

- [ ] **Step 5: 커밋**

```bash
git add app/globals.css
git commit -m "리디자인: 타이포 스케일 확대 + 섹션 넘버 뱃지 토큰"
```

---

### Task 2: Marquee 컴포넌트 (가로 흐르는 에너지 밴드)

**Files:**
- Create: `app/components/Marquee.js`
- Modify: `app/globals.css` (마키 스타일 + reduced-motion 규칙)

**Interfaces:**
- Consumes: 없음.
- Produces: `<Marquee items={string[]} tone?="light"|"dark" speed?=number />` 기본 export. `items` 문자열 배열을 무한 가로 스크롤로 반복 렌더한다. `tone`은 배경/글자색, `speed`는 애니메이션 초(기본 24).

- [ ] **Step 1: Marquee 컴포넌트 작성**

`app/components/Marquee.js` 생성:

```jsx
// 가로로 무한 반복되는 텍스트 밴드. reduced-motion 사용자는 CSS에서 정지.
export default function Marquee({ items = [], tone = "light", speed = 24 }) {
  const seq = [...items, ...items]; // 끊김 없는 루프용 2회 반복
  return (
    <div className={`marquee marquee--${tone}`} aria-hidden="true">
      <div className="marquee__track" style={{ animationDuration: `${speed}s` }}>
        {seq.map((t, i) => (
          <span className="marquee__item" key={i}>
            {t}
            <span className="marquee__dot" />
          </span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 마키 CSS 추가**

`app/globals.css`의 `/* ---------- 리본 ... ---------- */` 근처에 추가:

```css
/* ---------- 마키 ---------- */
.marquee { overflow: hidden; width: 100%; border-block: 1px solid var(--line); }
.marquee--light { background: var(--lime-soft); }
.marquee--dark { background: var(--ink); border-color: rgba(255,255,255,0.12); }
.marquee__track { display: inline-flex; align-items: center; white-space: nowrap; will-change: transform; animation: marquee-slide linear infinite; }
.marquee__item {
  display: inline-flex; align-items: center; gap: 22px;
  font-family: var(--font-display); font-weight: 700;
  font-size: clamp(1.3rem, 3vw, 2.1rem); letter-spacing: var(--track-tight);
  padding-inline: 22px; color: var(--ink);
}
.marquee--dark .marquee__item { color: var(--lime); }
.marquee__dot { width: 12px; height: 12px; border-radius: 50%; background: var(--tangerine); }
.marquee--dark .marquee__dot { background: var(--lime); }
@keyframes marquee-slide { from { transform: translateX(0); } to { transform: translateX(-50%); } }
```

- [ ] **Step 3: reduced-motion에서 마키 정지 확인**

`@media (prefers-reduced-motion: reduce)` 블록의 `* { animation: none !important; ... }`가 이미 마키를 정지시킨다. 별도 코드 불필요 — 확인만.

- [ ] **Step 4: 임시 배치로 검증**

`app/page.js` 상단 `import Ball from "./components/Ball";` 아래에 `import Marquee from "./components/Marquee";` 추가. `<div className="wrap"><div className="ribbon" /></div>` 줄을 다음으로 임시 교체:

```jsx
<Marquee items={["PLAY", "SMILE", "CONNECT", "PICKLEBOX"]} />
```

Run: `npm run build` → 통과. `npm run dev`에서 마키가 부드럽게 흐르는지 확인.

- [ ] **Step 5: 커밋**

```bash
git add app/components/Marquee.js app/globals.css app/page.js
git commit -m "리디자인: 가로 마키 밴드 컴포넌트 추가"
```

---

### Task 3: 섹션 헤더 넘버링 적용 (page.js)

**Files:**
- Modify: `app/page.js` (각 `.section__head`/`.eyebrow` 마크업)

**Interfaces:**
- Consumes: Task 1의 `.section__num` 클래스.
- Produces: 없음.

- [ ] **Step 1: 각 섹션 eyebrow에 넘버 추가**

`app/page.js`에서 아래 eyebrow들 뒤에 `<span className="section__num">/ NN</span>`을 붙인다(같은 줄, eyebrow 형제):

- `Brand Story` → `/ 01`
- `Our Services` → `/ 02`
- `Why PICKLEBOX` → `/ 03`
- `Store · Goods`(스토어) → `/ 04`
- `Visit Us` → `/ 05`

예시 (Brand Story):

```jsx
<div className="eyebrow">Brand Story</div>
<span className="section__num">/ 01</span>
```

CTA(`join`) 섹션은 eyebrow가 없으므로 넘버 생략.

- [ ] **Step 2: 검증**

Run: `npm run build` → 통과. `npm run dev`에서 각 섹션 제목 위에 `/ 01`~`/ 05` 넘버가 보이는지 확인.

- [ ] **Step 3: 커밋**

```bash
git add app/page.js
git commit -m "리디자인: 섹션 헤더 에디토리얼 넘버링(01~05) 적용"
```

---

### Task 4: 히어로 리스타일 (초대형 타이포 + 마키 + 사진 슬롯)

**Files:**
- Modify: `app/page.js` (히어로 마크업), `app/globals.css` (`.hero*`, 사진 슬롯)

**Interfaces:**
- Consumes: Task 1 타이포 토큰, Task 2 `Marquee`.
- Produces: `.photo-slot` 재사용 클래스(그라데이션+패턴 플레이스홀더) — Task 5가 소비.

- [ ] **Step 1: 사진 슬롯 유틸 클래스 추가**

`app/globals.css`에 추가:

```css
/* ---------- 사진 슬롯 (미래 이미지 자리) ---------- */
.photo-slot {
  position: relative; overflow: hidden; border-radius: var(--r-lg);
  background:
    radial-gradient(120% 120% at 20% 10%, var(--lime) 0%, transparent 45%),
    linear-gradient(135deg, var(--green), var(--green-deep));
}
.photo-slot::after {
  content: "PHOTO"; position: absolute; left: 18px; bottom: 14px;
  font-family: var(--font-display); font-weight: 700; font-size: 0.8rem;
  letter-spacing: 0.2em; color: rgba(255,255,255,0.55);
}
.photo-slot::before {
  content: ""; position: absolute; inset: 0;
  background-image: repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0 12px, transparent 12px 24px);
}
```

- [ ] **Step 2: 히어로 마키 배치**

`app/page.js`에서 `</header>` 바로 뒤(리본/마키 자리)의 임시 `<Marquee ... />`(Task 2에서 넣은 것)를 히어로 하단 밴드로 확정:

```jsx
</header>

<Marquee items={["PLAY", "SMILE", "CONNECT", "PICKLEBOX", "24H OPEN"]} speed={28} />
```

- [ ] **Step 3: 히어로 여백/그리드 에디토리얼화**

`app/globals.css` `.hero`의 상하 패딩을 키우고, `.hero::before` 광원을 라임 팝으로 강화:

```css
.hero { position: relative; overflow: hidden; padding-top: clamp(56px, 8vw, 104px); padding-bottom: clamp(72px, 10vw, 128px); }
.hero::before {
  content: ""; position: absolute; inset: -18% -12% auto auto; width: 720px; height: 720px;
  background: radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--lime) 55%, transparent), transparent 60%); z-index: 0;
}
```

- [ ] **Step 4: 검증**

Run: `npm run build` → 통과. `npm run dev`에서 히어로 제목이 화면을 크게 채우고, 히어로 아래 마키가 흐르는지 확인.

- [ ] **Step 5: 커밋**

```bash
git add app/page.js app/globals.css
git commit -m "리디자인: 히어로 초대형 타이포 + 하단 마키 + 사진 슬롯 유틸"
```

---

### Task 5: 브랜드 스토리 에디토리얼 + 사진 슬롯

**Files:**
- Modify: `app/page.js`(`.story__mark`), `app/globals.css`(`.story*`)

**Interfaces:**
- Consumes: Task 4 `.photo-slot`.
- Produces: 없음.

- [ ] **Step 1: 스토리 비주얼을 사진 슬롯으로 전환**

`app/page.js`의 `.story__mark` `<Reveal>` 안 마크업은 유지하되, `story__mark`가 사진 슬롯처럼 보이도록 CSS에서 처리(다음 스텝). 마크업 변경 없이 진행 가능.

- [ ] **Step 2: 스토리 CSS 에디토리얼화**

`app/globals.css` `.story__mark`를 사진 슬롯 스타일과 결합:

```css
.story__mark {
  display: grid; place-items: center; border-radius: var(--r-lg);
  aspect-ratio: 4 / 5; position: relative; overflow: hidden;
  background:
    radial-gradient(120% 120% at 20% 10%, var(--lime) 0%, transparent 45%),
    linear-gradient(135deg, var(--green), var(--green-deep));
}
```

`.story` 섹션 여백을 넉넉하게: `.story__grid`의 `gap`을 `clamp(36px, 6vw, 88px)`로 확대.

- [ ] **Step 3: 검증**

Run: `npm run build` → 통과. `npm run dev`에서 스토리 좌측이 라임→그린 그라데이션 슬롯으로 보이고 공/스파크가 그 위에 뜨는지 확인.

- [ ] **Step 4: 커밋**

```bash
git add app/page.js app/globals.css
git commit -m "리디자인: 브랜드 스토리 에디토리얼 여백 + 사진 슬롯화"
```

---

### Task 6: 서브브랜드 카드 — 넘버링 강화 + 컬러 팝

**Files:**
- Modify: `app/globals.css`(`.brand*`, `.brands__grid`)

**Interfaces:**
- Consumes: 없음. (`.brand__num`은 이미 page.js에서 렌더됨)
- Produces: 없음.

- [ ] **Step 1: 카드 넘버 크게 + 컬러 팝 강화**

`app/globals.css` `.brand__num`을 큰 에디토리얼 넘버로:

```css
.brand__num {
  position: absolute; top: 18px; right: 22px;
  font-family: var(--font-display); font-weight: 700; font-size: 2.4rem;
  color: var(--lime-soft); line-height: 1; z-index: 0;
}
```

`.brand` hover 시 컬러 팝 테두리:

```css
.brand--green:hover { border-color: var(--green); }
.brand--lime:hover { border-color: var(--lime); }
.brand--tangerine:hover { border-color: var(--tangerine); }
```

`.brand__key`, `.brand__desc` 등은 넘버 위에 오도록 `position: relative; z-index: 1;`를 `.brand__dot, .brand__key, .brand__desc`에 추가.

- [ ] **Step 2: 검증**

Run: `npm run build` → 통과. `npm run dev`에서 카드 우상단 큰 연라임 넘버가 배경처럼 깔리고, hover 시 컬러 테두리가 뜨는지 확인.

- [ ] **Step 3: 커밋**

```bash
git add app/globals.css
git commit -m "리디자인: 서브브랜드 카드 대형 넘버 + 컬러 팝 hover"
```

---

### Task 7: Why 섹션 라이트 에디토리얼화 + CTA 다크 전환

**Files:**
- Modify: `app/globals.css`(`.why*`, `.join*`), `app/page.js`(join 섹션에 마키/넘버 옵션)

**Interfaces:**
- Consumes: Task 2 `Marquee`(dark tone).
- Produces: 없음.

- [ ] **Step 1: Why 섹션을 라이트 에디토리얼로 전환**

현재 `.why`는 다크(`background: var(--ink)`). 스펙상 Why=라이트, CTA=다크. `.why` 및 하위 규칙을 라이트로 교체:

```css
.why { background: var(--cream); color: var(--ink); }
.why .title { color: var(--ink); }
.why .eyebrow { background: var(--lime-soft); color: var(--green-deep); }
.why .eyebrow::before { background: var(--green); }
.why__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-top: 12px; }
.feat { background: var(--paper); border: 1px solid var(--line); border-radius: var(--r-md); padding: 26px 22px; }
.feat__ico { font-family: var(--font-display); font-weight: 700; font-size: 1.3rem; color: var(--green-deep); background: var(--lime-soft); width: 46px; height: 46px; border-radius: 13px; display: grid; place-items: center; margin-bottom: 18px; }
.feat h3 { font-size: 1.12rem; }
.feat p { color: var(--ink-soft); font-size: 0.95rem; margin-top: 9px; }
```

- [ ] **Step 2: CTA(join) 섹션을 다크 잉크로 전환**

`.join__card`를 그린 그라데이션 → 다크 잉크 + 라임 팝으로:

```css
.join__card {
  background: var(--ink);
  border-radius: var(--r-lg); padding: clamp(40px, 6vw, 72px);
  color: #fff; position: relative; overflow: hidden;
  display: grid; grid-template-columns: 1.4fr 1fr; gap: 40px; align-items: center;
}
.join__card::after { content: ""; position: absolute; right: -60px; bottom: -80px; width: 340px; height: 340px; background: radial-gradient(circle, color-mix(in srgb, var(--lime) 40%, transparent), transparent 68%); }
.join__card::before { content: ""; position: absolute; left: -40px; top: -60px; width: 220px; height: 220px; background: radial-gradient(circle, color-mix(in srgb, var(--tangerine) 30%, transparent), transparent 65%); }
.join__card h2 { font-size: clamp(1.8rem, 3.6vw, 2.7rem); font-weight: 800; letter-spacing: var(--track-tight); position: relative; z-index: 1; }
.join__card p { color: rgba(255,255,255,0.82); margin-top: 14px; max-width: 420px; position: relative; z-index: 1; }
```

- [ ] **Step 3: CTA 위에 다크 마키 밴드 추가(대비 강조)**

`app/page.js`에서 `join` 섹션(`<section className="section join" id="contact">`) 바로 위에:

```jsx
<Marquee items={["JOIN NOW", "레슨", "멤버십", "커뮤니티", "PLAY THE JOY"]} tone="dark" speed={26} />
```

- [ ] **Step 4: 검증**

Run: `npm run build` → 통과. `npm run dev`에서 Why 섹션이 밝아지고, CTA 섹션이 다크 잉크 + 라임/탠저린 광원으로 바뀌며, 그 위 다크 마키가 흐르는지 확인. 스크롤 시 밝음→(다크 CTA)→밝음 리듬이 느껴지는지 확인.

- [ ] **Step 5: 커밋**

```bash
git add app/globals.css app/page.js
git commit -m "리디자인: Why 라이트 에디토리얼화 + CTA 다크 전환(대비 리듬)"
```

---

### Task 8: 스크롤 시차 모션 + 반응형/접근성 최종 점검

**Files:**
- Create: `app/components/Parallax.js`
- Modify: `app/page.js`(히어로 컨페티를 Parallax로 감쌀지 선택), `app/globals.css`(반응형에 마키/신규 요소 대응)

**Interfaces:**
- Consumes: 없음.
- Produces: `<Parallax speed?=number className? style? >children</Parallax>` — 스크롤 위치에 따라 `translateY`를 주는 클라이언트 래퍼. reduced-motion 시 비활성.

- [ ] **Step 1: Parallax 컴포넌트 작성**

`app/components/Parallax.js` 생성:

```jsx
"use client";
import { useEffect, useRef } from "react";

// 스크롤에 따라 미세하게 세로 이동하는 래퍼. reduced-motion 사용자는 이동 없음.
export default function Parallax({ children, speed = 0.15, className = "", style }) {
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
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [speed]);
  return <span ref={ref} className={className} style={{ display: "block", willChange: "transform", ...style }}>{children}</span>;
}
```

- [ ] **Step 2: 히어로 광원/컨페티에 시차 적용(선택적, 은은하게)**

`app/page.js`에서 히어로 `.box` 컨페티 래퍼 또는 `.hero::before` 근처에 시차를 주고 싶다면, `.box`를 `<Parallax speed={0.08} className="box" ...>`로 감싼다. 과하지 않게 `speed`는 0.05~0.1 유지. (구조 변경이 부담되면 이 스텝은 스킵 가능 — 마키/reveal만으로도 모션 요건 충족.)

- [ ] **Step 3: 반응형 점검 — 마키/신규 요소**

`app/globals.css` `@media (max-width: 560px)`에서 마키 아이템이 너무 크지 않도록 확인. 필요 시 추가:

```css
@media (max-width: 560px) {
  .marquee__item { font-size: 1.15rem; gap: 16px; }
  .brand__num { font-size: 1.9rem; }
}
```

- [ ] **Step 4: reduced-motion 최종 확인**

`@media (prefers-reduced-motion: reduce)` 블록이 마키 애니메이션과 float를 정지시키고 reveal을 즉시 노출하는지 확인. Parallax는 JS에서 early-return하므로 이동 없음 — 코드 확인만.

- [ ] **Step 5: 전체 빌드 + 반응형 육안 검증**

Run: `npm run build` → 에러 없이 통과.
`npm run dev`에서: 데스크톱/모바일(900px, 560px 이하) 폭에서 레이아웃 깨짐 없음, 마키·reveal·(선택)시차 동작, 다크 CTA 대비, 한글 줄바꿈 정상 확인.

- [ ] **Step 6: 커밋**

```bash
git add app/components/Parallax.js app/page.js app/globals.css
git commit -m "리디자인: 스크롤 시차 모션 + 반응형/접근성 최종 점검"
```

---

## Self-Review

**Spec coverage 체크:**
- 컬러 역할 재정의 → Task 1(토큰) + Task 7(다크/라이트 전환). ✓
- 타이포 확대 → Task 1. ✓
- 섹션 넘버링 → Task 1(스타일) + Task 3(적용). ✓
- 가로 마키 → Task 2 + Task 4/7 배치. ✓
- 스크롤 등장/시차 → 기존 Reveal 유지 + Task 8 Parallax. ✓
- 상시 미세 모션 → 기존 float 유지(변경 없음). ✓
- reduced-motion → Task 2/8에서 확인. ✓
- 섹션별 처리(히어로/스토리/서브브랜드/Why/CTA/스토어/오시는 길/푸터) → Task 4/5/6/7. 스토어·오시는 길·푸터는 기존 스타일 유지(스펙상 "정돈 유지")로 별도 태스크 불필요. ✓
- 사진 슬롯 → Task 4(.photo-slot) + Task 5(스토리 적용). ✓
- 스코프(새 페이지·콘텐츠·의존성 없음) → 전 태스크 준수. ✓

**Placeholder scan:** "적절히 처리" 류 없음. 모든 코드 스텝에 실제 코드 포함. ✓

**Type consistency:** `Marquee`(items/tone/speed), `Parallax`(speed/className/style), `.photo-slot`, `.section__num`, `--display-hero/--display-title/--track-tight` 이름이 전 태스크에서 일관. ✓
