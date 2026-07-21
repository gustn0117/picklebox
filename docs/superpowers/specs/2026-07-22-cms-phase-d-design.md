# PICKLEBOX CMS D단계 — 섹션 빌더 설계

- 날짜: 2026-07-22
- 전제: A·B·C 배포 완료
- 목적: 기존 페이지 안에 **새 섹션·카드를 직접 추가하고, 순서를 바꾸고, 지웠다 되살리기**

## 1. 설계 방향 (중요)

페이지 전체를 블록으로 재구성하는 "완전 자유 빌더"는 지금의 디자인·안정성을 크게 흔든다.
대신 **기존 섹션은 그대로 두고, 그 위/아래에 관리자가 만든 섹션을 자유롭게 얹는** 방식으로 만든다.

- 기존 브랜드 섹션(히어로·스토리·서비스 등) = 유지 (디자인 일관성)
- 관리자 추가 섹션 = **페이지 상단부/하단부 중 선택**, 서로 순서 변경 가능, 노출 토글·휴지통·예약 공개 지원

## 2. 섹션 종류 (템플릿 4종)

기존 사이트 디자인 언어를 그대로 사용한다.

| 종류 | 구성 | 쓰임새 |
|---|---|---|
| `text` | 라벨 · 제목 · 본문(서식) | 공지, 안내문 |
| `cards` | 라벨 · 제목 · **카드 N개**(이미지·제목·설명·링크) | 프로그램·혜택 소개 |
| `image` | 배경 이미지 · 제목 · 설명 · 버튼 | 프로모션 배너 |
| `cta` | 제목 · 설명 · 버튼 | 문의·예약 유도 |

## 3. 데이터 모델

```prisma
model Section {
  id        Int      @id @default(autoincrement())
  page      String   @default("home")   // home|about|founder|community|partners|events|goods|tours|journal|visit
  type      String   @default("text")   // text|cards|image|cta
  position  String   @default("bottom") // top(히어로 아래) | bottom(하단 CTA 앞)
  eyebrow   String?                     // 작은 라벨
  title     String?
  body      String   @default("")       // 서식 HTML
  imageUrl  String?
  linkUrl   String?
  linkLabel String?
  cards     String   @default("[]")     // JSON: [{title, description, imageUrl, linkUrl}]
  altBg     Boolean  @default(false)    // 배경 교차
  visible   Boolean  @default(true)
  sortOrder Int      @default(0)
  publishAt DateTime?
  deletedAt DateTime?
}
```

카드는 별도 테이블 대신 **JSON 배열**로 저장한다(관계 복잡도 제거, 카드 추가·삭제·순서변경을 한 화면에서 처리).

## 4. 관리 UI

- 대시보드에 **"섹션"** 추가(총 10종)
- 섹션 목록: 페이지별 그룹 표시, 드래그 순서 변경, 노출 토글, 휴지통, 이력 (C단계 기능 그대로 재사용)
- 새 필드 타입 `cards`: **카드 반복 편집기** — 카드 추가/삭제/위아래 이동, 각 카드에 이미지 업로드·제목·설명·링크

## 5. 공개 렌더

`<Sections page="home" position="top|bottom" preview={preview} />` 서버 컴포넌트가 조회·렌더한다.
- 조회 조건은 C단계 공통 조건(`contentWhere`) 재사용 → 예약·휴지통·미리보기 자동 반영
- 종류별로 기존 CSS 클래스(`.section`, `.eyebrow`, `.title`, `.feat`, `.promo`, `.join`) 를 재사용해 디자인 일관성 유지
- 섹션이 없으면 아무것도 렌더하지 않음

삽입 위치: 각 페이지의 히어로 직후(`top`)와 하단 CTA 직전(`bottom`).

## 6. 마이그레이션

`prisma/migrate.js` 에 `Section` 테이블 생성 정의 추가(멱등). 기존 데이터 영향 없음.

## 7. 범위 밖

- 기존 브랜드 섹션(히어로·스토리 등)의 순서 변경·삭제
- 자유 드래그 레이아웃(다단 그리드 직접 구성)
- 섹션별 색상·폰트 등 디자인 커스터마이즈

## 8. 리스크

- 관리자가 만든 섹션이 페이지 흐름을 해칠 수 있음 → 템플릿 4종으로 제한하고 사이트 CSS를 강제 적용.
- 카드 JSON 파싱 실패 → 렌더 시 빈 배열로 폴백.
