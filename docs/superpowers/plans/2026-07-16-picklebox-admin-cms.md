# PICKLEBOX 관리자(CMS) Implementation Plan

> **For agentic workers:** 이 플랜은 인라인 실행(superpowers:executing-plans)으로 단계별 진행. 체크박스로 추적.

**Goal:** 비개발자가 사이트 콘텐츠(배너·이벤트·아카데미·여행·굿즈·저널·사진·핵심문구)를 직접 등록·수정·노출·순서관리할 수 있는 `/admin` CMS를 현재 Next.js 앱에 추가한다.

**Architecture:** 동일 Next.js 앱에 `/admin` + 관리 API 추가. SQLite(Prisma) DB와 업로드 이미지는 영속 볼륨 `/app/data`에 저장. 공개 페이지는 하드코딩 상수 대신 DB에서 읽고, 저장 시 `revalidatePath`로 갱신.

**Tech Stack:** Next.js 15 App Router, Prisma + SQLite, 서명 쿠키 세션, 커스텀 CSS. (미소투어와 동일 스택)

## Global Constraints

- Prisma schema `generator`에 `binaryTargets = ["native", "linux-musl-openssl-3.0.x"]` (Docker alpine 런타임 엔진). — 미소투어 검증값 그대로.
- `package.json` build 스크립트 = `prisma generate && next build`.
- DB 경로: `DATABASE_URL=file:/app/data/picklebox.db` (볼륨). 로컬 개발은 `file:./dev.db`.
- 업로드 이미지: `/app/data/uploads/<uuid>.<ext>` 저장, `/uploads/<file>` 라우트로 서빙.
- 관리자 비밀번호: env `ADMIN_PASSWORD`(기본 `1234`). 세션 서명: env `SESSION_SECRET`.
- 공개 페이지 한글 줄바꿈 규칙 유지(keep-all). 기존 디자인 토큰/컴포넌트 재사용.
- webhook 배포는 `git pull` + `docker compose up -d --build`만 함 → Dockerfile/compose를 **git으로 이관**(서버 untracked 파일은 최초 1회 제거 후 pull). 컨테이너 시작 시 `prisma db push`로 스키마 자동 동기화 + 최초 1회 seed.
- production 배포 전까지 `feature/admin-cms` 브랜치에서 작업. 검증 후 사용자 확인 하에 main 병합·배포.

---

## Phase 1 — 데이터 계층 (Prisma + SQLite + seed)

### Task 1.1: Prisma 설치 · 스키마 · 클라이언트
**Files:** Create `prisma/schema.prisma`, `app/lib/db.js`; Modify `package.json`

- [ ] `npm i @prisma/client && npm i -D prisma` 후 `package.json` scripts에 `"build": "prisma generate && next build"`, `"db:push": "prisma db push"`, `"db:seed": "node prisma/seed.js"` 추가, `"prisma": { "seed": "node prisma/seed.js" }`.
- [ ] `prisma/schema.prisma`: generator(binaryTargets 포함), datasource(sqlite, env DATABASE_URL), 8개 모델:
  - `Banner{ id, page, imageUrl?, title?, subtitle?, linkUrl?, visible=true, sortOrder=0, timestamps }`
  - `Event{ id, kind, titleEn?, titleKo, description, period?, imageUrl?, visible, sortOrder, ts }`
  - `AcademyProgram{ id, titleEn?, titleKo, description, imageUrl?, visible, sortOrder, ts }`
  - `Tour{ id, title, description, period?, imageUrl?, linkUrl?, visible, sortOrder, ts }`
  - `Goods{ id, name, description?, imageUrl?, buyUrl, visible, sortOrder, ts }`
  - `JournalPost{ id, category, title, type, articleUrl?, videoIds(String default "[]"), soon=false, visible, sortOrder, ts }`
  - `Photo{ id, imageUrl, caption?, album?, visible, sortOrder, ts }`
  - `SiteCopy{ id, key @unique, label, value, ts }`
- [ ] `app/lib/db.js`: PrismaClient 싱글턴 export (globalThis 캐시).
- [ ] `DATABASE_URL=file:./dev.db npx prisma db push` 로 로컬 DB 생성 확인.
- [ ] Commit.

### Task 1.2: 현재 하드코딩 콘텐츠 → seed
**Files:** Create `prisma/seed.js`
- [ ] 현재 `app/lib/site.js`(SUBBRANDS, SHOPS), events(LINEUP/SCHEDULE), journal(POSTS), 홈/어바웃 문구를 각 모델 레코드로 이관하는 seed 작성. **가드**: 각 테이블이 비어있을 때만 삽입(재실행 안전).
- [ ] `node prisma/seed.js` 실행 → 레코드 수 확인. Commit.

## Phase 2 — 인증

### Task 2.1: 세션 유틸 · 로그인 · 미들웨어
**Files:** Create `app/lib/auth.js`, `app/admin/login/page.js`, `app/api/admin/login/route.js`, `app/api/admin/logout/route.js`, `middleware.js`
- [ ] `app/lib/auth.js`: HMAC(SESSION_SECRET) 서명 토큰 생성/검증. `verifyPassword(pw)`= `pw===ADMIN_PASSWORD`.
- [ ] 로그인 API: 비번 확인 후 서명 쿠키 `pb_admin`(httpOnly, sameSite lax, 7d) 설정. 로그아웃: 쿠키 삭제.
- [ ] `middleware.js`: `/admin/*`(로그인 제외), `/api/admin/*`(login 제외) 요청에 유효 쿠키 없으면 `/admin/login` 리다이렉트/401.
- [ ] 로그인 페이지: 비밀번호 입력 폼(한국어, 단순).
- [ ] 로컬에서 로그인/로그아웃/보호 동작 확인. Commit.

## Phase 3 — 이미지 업로드

### Task 3.1: 업로드 API · 서빙 라우트 · 컴포넌트
**Files:** Create `app/api/admin/upload/route.js`, `app/uploads/[file]/route.js`, `app/admin/components/ImageUpload.js`
- [ ] 업로드 API: multipart 파일 수신, 확장자 검증(jpg/png/webp/gif), `/app/data/uploads/<uuid>.<ext>` 저장(로컬은 `./persistent-data/uploads`), `{ url: "/uploads/<file>" }` 반환. `UPLOAD_DIR` env로 경로 결정(기본 `/app/data/uploads`).
- [ ] 서빙 라우트: `/uploads/[file]` → UPLOAD_DIR에서 파일 읽어 적절한 content-type으로 응답(없으면 404).
- [ ] `ImageUpload.js`: 파일 선택/드래그 → 업로드 → 미리보기 + hidden value(url). 재사용.
- [ ] 로컬 업로드→서빙 확인. Commit.

## Phase 4 — 콘텐츠 CRUD (관리 API + 관리 UI)

공통 패턴을 한 번 만들고 8개 모델에 반복 적용.

### Task 4.1: 공통 CRUD 헬퍼 + Goods로 패턴 확립
**Files:** Create `app/lib/crud.js`, `app/api/admin/goods/route.js`, `app/api/admin/goods/[id]/route.js`, `app/admin/goods/page.js`, `app/admin/components/AdminList.js`, `app/admin/components/Field.js`
- [ ] `crud.js`: 모델별 list/create/update/delete/reorder/toggleVisible 제네릭 함수(Prisma delegate 주입).
- [ ] Goods API: GET(목록), POST(생성), PATCH/PUT([id] 수정·순서·노출), DELETE([id]).
- [ ] `AdminList.js`: 목록 렌더 + 노출 토글(눈), 순서 위/아래, 편집/삭제, "새로 추가" 폼(필드 config 기반). `Field.js`: text/textarea/image/url/checkbox 필드 렌더.
- [ ] Goods 관리 페이지에서 등록·수정·노출·순서·삭제 로컬 확인. Commit.

### Task 4.2~4.8: 나머지 7종 반복 (Banner, Event, Academy, Tour, JournalPost, Photo, SiteCopy)
각 모델: API 라우트 2개 + 관리 페이지 1개 (4.1 패턴·컴포넌트 재사용, 필드 config만 다름).
- [ ] 각 모델별로 Task 4.1과 동일 절차 → 로컬 확인 → Commit. (SiteCopy는 key/value 편집 전용, 순서·이미지 없음.)

### Task 4.9: 관리 대시보드
**Files:** Create `app/admin/page.js`, `app/admin/layout.js`, `app/admin/admin.css`
- [ ] 대시보드: 8종 카드(항목 수 표시) + 로그아웃. 관리 전용 밝은 스타일. Commit.

## Phase 5 — 공개 페이지가 DB를 읽도록 전환

### Task 5.1~5.n: 페이지별 상수 → DB 쿼리
**Files:** Modify `app/page.js`, `app/events/page.js`, `app/journal/page.js`, `app/about/page.js`, `app/lib/site.js`(SHOPS 등), 필요한 각 페이지
- [ ] 각 공개 페이지에서 하드코딩 상수를 `db` 쿼리(visible=true, sortOrder 정렬)로 교체. 서버 컴포넌트.
- [ ] 관리 API의 create/update/delete/reorder/toggle 후 관련 경로 `revalidatePath`.
- [ ] 각 페이지 seed 데이터로 기존과 동일하게 렌더되는지 스크린샷 확인. Commit.

## Phase 6 — 배포 통합 & 검증

### Task 6.1: Dockerfile/compose git 이관 + 스키마 자동 동기화
**Files:** Create `Dockerfile`, `docker-compose.yml`, `docker-entrypoint.sh`
- [ ] `Dockerfile`: 미소투어 기반. runner에 `prisma` CLI + `prisma/`(schema,migrations) + 엔진 포함되도록 COPY. entrypoint에서 `prisma db push --skip-generate` → 최초 seed(비어있으면) → `node server.js`.
- [ ] `docker-compose.yml`: 포트 3080:3000, container_name picklebox, 볼륨 `/home/server/apps/picklebox/persistent-data:/app/data`, `environment`: DATABASE_URL, ADMIN_PASSWORD, SESSION_SECRET, UPLOAD_DIR.
- [ ] `next.config`에 `output: 'standalone'` 확인/설정.
- [ ] 로컬에서 `docker build`로 이미지 빌드 성공 확인(가능 시). Commit.

### Task 6.2: 프로덕션 반영 (사용자 확인 후)
- [ ] 서버에서 기존 untracked `Dockerfile`,`docker-compose.yml` 백업·제거 → main 병합·push → webhook가 git의 Dockerfile/compose로 빌드.
- [ ] 배포 후 외부에서 공개 페이지 정상(기존과 동일 렌더) + `/admin` 로그인·CRUD·업로드·노출·순서 전 기능 검증.
- [ ] 다른 사이트·터널 영향 없음 확인.

## Self-Review 결과
- 스펙 8종 콘텐츠·인증·업로드·노출/순서·핵심문구·배포 안전 → 각 Phase에 매핑됨(Phase1~6).
- 미소투어 검증값(binaryTargets, build script)·webhook 동작(pull+compose build)·볼륨 경로 반영.
- 리스크: 표준 standalone+Prisma Docker 통합(Phase6) → 로컬 docker build로 사전검증, 프로덕션은 사용자 확인 후.
