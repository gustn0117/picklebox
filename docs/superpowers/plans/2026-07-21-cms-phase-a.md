# CMS A단계(편집 영역 확대) Implementation Plan

> 인라인 실행(superpowers:executing-plans). 단계별 커밋, 각 Task 끝에 검증.

**Goal:** 자주 바뀌는 모든 내용(전 페이지 문구·버튼·연락처·SNS·굿즈·여행상품·파트너)을 비개발자가 관리자에서 직접 수정하게 한다.

**Architecture:** 기존 설정기반 CRUD(`app/lib/adminModels.js` + `/api/admin/[model]`) 위에 확장한다. `SiteCopy`에 `group/kind/sortOrder`를 추가해 "사이트 정보 + 전 페이지 문구"를 담고, `Partner` 모델을 신규 추가하며 `Goods/Tour`에 필드를 더한다. 공개 페이지는 값이 없으면 기존 하드코딩 문구로 폴백한다.

**Tech Stack:** Next.js 15 App Router, Prisma + SQLite, 커스텀 CSS, Docker(standalone).

## Global Constraints

- 문구(`SiteCopy`)는 **추가·삭제 불가, 값만 수정**. 새 항목은 seed에서 upsert로 보장(기존 값 덮어쓰지 않음).
- 공개 페이지는 **값이 비면 기존 하드코딩 문구로 폴백**(빈 화면 금지).
- 가격은 비우면 **미표시**. 숫자만 저장하고 표시할 때 `원` 단위로 포맷.
- 이미지 필드는 관리 화면에 **권장 크기·비율 안내(hint)** 를 표시.
- 한글 줄바꿈 규칙 유지(`word-break: keep-all`), 기존 디자인 토큰/컴포넌트 재사용.
- 운영 DB 데이터 보존: 스키마 변경은 컨테이너 시작 시 `prisma db push`(추가 전용).
- 작업 브랜치 `feature/cms-phase-a`. 검증 후 main 병합·배포.

---

## Task 1: 스키마 확장 (SiteCopy/Partner/Goods/Tour)

**Files:** Modify `prisma/schema.prisma`

- [ ] **Step 1: SiteCopy에 group/kind/sortOrder 추가, Partner 신규, Goods/Tour 필드 추가**

```prisma
model SiteCopy {
  id        Int      @id @default(autoincrement())
  key       String   @unique
  group     String   @default("site")  // site | home | about | founder | community | partners | events | journal | visit | goods | tours
  label     String
  value     String   @default("")
  kind      String   @default("text")  // text | textarea | url
  sortOrder Int      @default(0)
  updatedAt DateTime @updatedAt
}

model Partner {
  id          Int      @id @default(autoincrement())
  name        String
  logoUrl     String?
  linkUrl     String?
  description String   @default("")
  visible     Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

`Goods`에 추가: `price Int?` / `soldOut Boolean @default(false)`
`Tour`에 추가: `price Int?` / `schedule String @default("")` / `bookingUrl String?`

- [ ] **Step 2: 로컬 DB 반영 후 컬럼 확인**

Run: `DATABASE_URL="file:./dev.db" npx prisma db push && DATABASE_URL="file:./dev.db" node -e "const{PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.partner.count().then(c=>console.log('partner ok',c)).finally(()=>p.\$disconnect())"`
Expected: `partner ok 0`

- [ ] **Step 3: Commit** — `git add prisma/schema.prisma && git commit -m "기능(CMS-A): 스키마 확장 — SiteCopy 그룹화, Partner 신규, 굿즈·투어 필드"`

---

## Task 2: 문구·사이트정보 seed (전 페이지)

**Files:** Modify `prisma/seed.js`

- [ ] **Step 1: `SITE_COPY`를 group/kind/sortOrder 포함 전체 목록으로 교체**

`group="site"`: 예약 링크, 스토어 링크, 인스타 3종 URL, 유튜브, 지도, 주소, 전화, 이메일, 영업시간.
`group="home"`: eyebrow, tagline1, tagline2, Explore 제목, Manifesto, Why 제목, How 제목, CTA 제목·설명·버튼명·버튼링크.
`group="about"|"founder"|"community"|"partners"|"events"|"journal"|"visit"|"goods"|"tours"`: 각 페이지 히어로 제목·리드 + 주요 섹션 제목·설명 + CTA 버튼명/링크.

각 항목은 `{ key, group, label, value, kind, sortOrder }` 형태. `label`은 "홈 · 히어로 문구 1줄"처럼 위치를 알 수 있게.

- [ ] **Step 2: upsert로 보장(기존 값 유지)**

```js
for (const c of SITE_COPY) {
  await db.siteCopy.upsert({
    where: { key: c.key },
    update: { group: c.group, label: c.label, kind: c.kind ?? "text", sortOrder: c.sortOrder ?? 0 }, // value는 건드리지 않음
    create: { ...c, kind: c.kind ?? "text", sortOrder: c.sortOrder ?? 0 },
  });
}
```

- [ ] **Step 3: 실행 후 그룹별 개수 확인**

Run: `DATABASE_URL="file:./dev.db" node prisma/seed.js`
Expected: `SiteCopy: N건 보장(upsert)` 출력, 재실행해도 값 유지

- [ ] **Step 4: Commit** — `git commit -m "기능(CMS-A): 전 페이지 문구·사이트 정보 seed"`

---

## Task 3: 관리자 모델 설정 확장 (파트너 추가, 필드·hint 확장)

**Files:** Modify `app/lib/adminModels.js`

- [ ] **Step 1: `partners` 모델 추가**

```js
partners: {
  slug: "partners", prisma: "partner", label: "파트너", icon: "partners",
  ordered: true, hasVisible: true, canCreate: true, canDelete: true,
  titleKey: "name", subKey: "linkUrl",
  fields: [
    { key: "name", label: "파트너명", type: "text", required: true },
    { key: "logoUrl", label: "로고", type: "image", hint: "가로 400×200 권장 (배경 투명 PNG)" },
    { key: "linkUrl", label: "링크(선택)", type: "url" },
    { key: "description", label: "설명(선택)", type: "textarea" },
  ],
},
```

- [ ] **Step 2: 굿즈·투어 필드 확장 + 이미지 hint 추가**

굿즈에 `{ key: "price", label: "가격(원, 비우면 미표시)", type: "number" }`, `{ key: "soldOut", label: "품절 표시", type: "checkbox" }` 추가. 이미지 hint: `"정사각형 800×800 권장"`.
투어에 `{ key: "price", label: "가격(원, 비우면 미표시)", type: "number" }`, `{ key: "schedule", label: "일정(줄바꿈으로 구분)", type: "textarea" }`, `{ key: "bookingUrl", label: "예약 링크", type: "url" }` 추가. 이미지 hint: `"가로 1600×900 (16:9) 권장"`.
배너 이미지 hint: `"가로 1920×800 권장"`, 사진 hint: `"가로 1200×900 (4:3) 권장"`, 아카데미 hint: `"가로 1600×1000 권장"`.

- [ ] **Step 3: `number` 타입 강제변환 추가**

```js
if (field.type === "number") {
  const n = parseInt(String(raw ?? "").replace(/[^0-9-]/g, ""), 10);
  return Number.isFinite(n) ? n : null;
}
```

- [ ] **Step 4: 문구 모델(`copy`)에 그룹 지원 표시**

`copy` 설정에 `grouped: true` 추가(관리 UI가 그룹 탭을 그리는 신호). 필드에 `value`의 `kind` 반영은 Task 4에서 처리.

- [ ] **Step 5: 빌드 확인 후 Commit**

Run: `npm run build` → Expected: `✓ Compiled successfully`
`git commit -m "기능(CMS-A): 관리자 설정 확장 — 파트너 모델, 굿즈·투어 필드, 이미지 권장크기 안내, 숫자 타입"`

---

## Task 4: 관리 UI — 문구 그룹 탭 · 이미지 hint · 숫자/체크 입력

**Files:** Modify `app/admin/components/AdminList.js`, `app/admin/components/ImageUpload.js`, `app/admin/admin.css`, `app/admin/components/Icon.js`

- [ ] **Step 1: `Icon.js`에 `partners` 아이콘 추가**

```jsx
partners: (<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>),
```

- [ ] **Step 2: `AdminList.js` — 그룹 탭 렌더**

`config.grouped`가 true면 rows의 `group` 값으로 탭을 만들고, 선택된 그룹의 행만 표시한다. 그룹 라벨 맵:
`{ site:"사이트 정보", home:"홈", about:"소개", founder:"대표", community:"커뮤니티", partners:"파트너", events:"이벤트", journal:"저널", visit:"오시는 길", goods:"굿즈", tours:"투어" }`

- [ ] **Step 3: 문구 항목은 목록에서 바로 편집(인라인)**

`config.grouped`인 경우 각 행을 라벨 + 입력칸(`kind`에 따라 input/textarea)으로 렌더하고, 값이 바뀌면 "저장" 버튼 활성화 → PATCH.

- [ ] **Step 4: 이미지 hint · number/checkbox 입력 지원**

`ImageUpload`에 `hint` prop 추가 → 업로드 영역 아래 회색 작은 글씨로 표시.
`FormCard`에 `type === "number"` 분기 추가(`<input type="number">`).

- [ ] **Step 5: 로컬에서 문구 그룹 탭·저장, 파트너 등록, 굿즈 가격 입력 확인 후 Commit**

Run: 브라우저로 `/admin/copy`, `/admin/partners`, `/admin/goods` 확인
`git commit -m "기능(CMS-A): 관리 UI — 문구 그룹 탭·인라인 편집, 이미지 권장크기 안내, 숫자 입력"`

---

## Task 5: 문구 조회 헬퍼 + 사이트 정보 반영(푸터·전역)

**Files:** Create `app/lib/copy.js`; Modify `app/components/Footer.js`, `app/lib/site.js`

- [ ] **Step 1: `app/lib/copy.js` 작성**

```js
import { db } from "./db";
// 그룹의 문구를 { key: value } 로 반환. 값이 비면 키 자체를 생략해 폴백이 동작하게 한다.
export async function getCopy(group) {
  try {
    const rows = await db.siteCopy.findMany({ where: { group } });
    const map = {};
    for (const r of rows) if (r.value && r.value.trim()) map[r.key] = r.value;
    return map;
  } catch { return {}; }
}
export const pick = (map, key, fallback) => (map[key] ?? fallback);
```

- [ ] **Step 2: 푸터가 사이트 정보(주소·SNS·예약링크)를 DB에서 읽도록 수정** (없으면 기존 `site.js` 값 폴백)

- [ ] **Step 3: 로컬 확인 후 Commit** — 푸터 렌더 정상, 값 비었을 때 기존 문구 유지
`git commit -m "기능(CMS-A): 문구 조회 헬퍼 + 푸터 사이트정보 DB 연결"`

---

## Task 6: 공개 페이지 문구 연결 (전 페이지)

**Files:** Modify `app/page.js`, `app/about/page.js`, `app/events/page.js`, `app/journal/page.js`, `app/partners/page.js`, `app/community/page.js`, `app/founder/page.js`, `app/visit/page.js`

- [ ] **Step 1: 각 페이지에서 `getCopy("<group>")` 호출 후 제목·리드·버튼명/링크를 `pick(map, key, 기존문구)` 로 교체**
- [ ] **Step 2: 페이지별로 렌더 확인(기존과 동일하게 보여야 함)**
Run: 각 페이지 curl로 기존 문구 존재 확인
- [ ] **Step 3: Commit** — `git commit -m "기능(CMS-A): 전 페이지 섹션 문구·버튼 DB 연결(폴백 유지)"`

---

## Task 7: 파트너 공개 섹션

**Files:** Modify `app/partners/page.js`, `app/globals.css`

- [ ] **Step 1: `/partners`에 파트너 로고 목록 섹션 추가(항목 있을 때만 렌더)**
- [ ] **Step 2: `.partner-grid` CSS 추가** — 로고 그리드, 링크 있으면 클릭 가능
- [ ] **Step 3: 파트너 1건 등록해 렌더 확인 후 Commit**

---

## Task 8: 굿즈 페이지 신설

**Files:** Create `app/goods/page.js`; Modify `app/globals.css`, `app/lib/site.js`(NAV)

- [ ] **Step 1: `/goods` 페이지 — 굿즈 카드 그리드(이미지·이름·가격·설명·구매 버튼·품절 배지)**
- [ ] **Step 2: `.shop-grid`/`.shop-card` CSS 추가**
- [ ] **Step 3: NAV에 "굿즈" 추가**
- [ ] **Step 4: 렌더 확인(가격 있는/없는, 품절) 후 Commit**

---

## Task 9: 투어 페이지 신설

**Files:** Create `app/tours/page.js`; Modify `app/globals.css`, `app/lib/site.js`(NAV)

- [ ] **Step 1: `/tours` 페이지 — 투어 카드(이미지·상품명·기간·가격·설명·일정·예약 버튼)**
- [ ] **Step 2: 일정은 줄바꿈으로 나눠 목록 렌더**
- [ ] **Step 3: NAV에 "투어" 추가 + 전체 메뉴 순서 정리**
- [ ] **Step 4: 렌더 확인 후 Commit**

---

## Task 10: 배포 — 스키마 자동 반영(운영 DB 보존)

**Files:** Modify `Dockerfile`, `docker-entrypoint.sh`

- [ ] **Step 1: runner 이미지에 prisma CLI·스키마 포함**

```dockerfile
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma
```

- [ ] **Step 2: 엔트리포인트에서 기존 DB에 스키마 반영 + 문구 seed upsert**

```sh
if [ ! -f /app/data/picklebox.db ]; then cp /app/seed-picklebox.db /app/data/picklebox.db;
else node node_modules/prisma/build/index.js db push --skip-generate || echo "[entrypoint] db push 실패(계속 진행)"; fi
node prisma/seed.js || echo "[entrypoint] seed 건너뜀"
```

- [ ] **Step 3: 로컬 docker build + 기존 DB로 컨테이너 실행해 데이터 보존·컬럼 추가 확인**

Run: `docker build -t pbtest .` 후 기존 데이터가 든 볼륨으로 실행 → 굿즈 건수 유지 + 새 컬럼 사용 가능
Expected: 기존 콘텐츠 그대로, 파트너/가격 기능 동작

- [ ] **Step 4: Commit**

---

## Task 11: 프로덕션 배포 및 검증

- [ ] **Step 1:** main 병합 후 push → webhook 빌드 완료 확인(`exit=0`)
- [ ] **Step 2:** 라이브 검증 — 기존 콘텐츠 보존, `/goods`·`/tours` 정상, 파트너 섹션, 관리자 문구 그룹 탭·가격 입력 동작
- [ ] **Step 3:** 다른 사이트 영향 없음 확인

---

## Self-Review

- **스펙 커버리지:** 4.1 SiteCopy 확장→Task1·2, 4.2 Partner→Task1·3·7, 4.3 Goods→Task1·3·8, 4.4 Tour→Task1·3·9, 5 공개페이지→Task5~9, 6 관리 UI→Task4, 7 마이그레이션→Task10, 배포→Task11. 누락 없음.
- **일관성:** `getCopy(group)`/`pick(map,key,fallback)` 이름을 Task5 정의 후 Task6에서 동일하게 사용. `grouped` 플래그는 Task3 정의 → Task4 사용.
- **범위:** A단계 단일 플랜으로 실행 가능. B~D는 범위 밖.
