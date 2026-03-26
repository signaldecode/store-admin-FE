# MIREP 아카이빙 - 관리자 페이지

쇼핑몰 상품/카테고리/브랜드/사이트를 관리하는 비공개 어드민 웹앱입니다.

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| UI | React 19 + TypeScript |
| 상태관리 | Zustand |
| 스타일 | Tailwind CSS 4 + CSS Variables (OKLCH) |
| 컴포넌트 | shadcn/ui (base-vega) |
| 아이콘 | lucide-react |
| 에디터 | Tiptap (리치 텍스트) |
| 드래그앤드롭 | @dnd-kit |
| 백엔드 | Java Spring Boot (REST API) |
| 인증 | JWT + HttpOnly Cookie |

---

## 시작하기

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

http://localhost:3000 에서 확인할 수 있습니다.

---

## 주요 기능

### 인증
- 관리자 로그인 (JWT + HttpOnly Cookie)
- 역할 기반 접근 제어 (`SUPER_ADMIN` / `ADMIN`)
- 미인증 시 `/login`으로 자동 리다이렉트

### 상품 관리
- 상품 CRUD (목록/등록/상세/수정/삭제)
- 다중 필터 (사이트, 카테고리, 브랜드, 상태) + 검색 + 정렬 + 페이지네이션
- 옵션 시스템: 고정(FIXED) / 자유(FREE) 타입
- SKU 조합별 재고 관리 (색상 x 사이즈 매트릭스)
- 옵션별 추가금액 설정
- 다중 이미지 업로드 + 썸네일 지정
- Tiptap 리치 텍스트 에디터 (상품 설명)

### 카테고리 관리
- 계층형 트리 구조 (대분류/중분류/소분류)
- 드래그앤드롭 순서 변경
- 사이트 연동 (대분류 = 사이트)

### 브랜드 관리
- 브랜드 CRUD + 로고 이미지 업로드
- 활성/비활성 상태 토글
- 검색/정렬/페이지네이션

### 사이트 관리
- 사이트 CRUD (코드, 도메인, 설명)
- 카테고리 대분류와 연동
- 활성/비활성 상태 토글

### 관리자 계정
- 관리자 CRUD (`SUPER_ADMIN` 전용)
- 역할 할당

---

## 디렉토리 구조

```
├── app/
│   ├── (admin)/              # 인증 필요한 관리 페이지 (AdminLayout 적용)
│   │   ├── page.tsx          # 대시보드
│   │   ├── products/         # 상품 관리 (목록/등록/상세/수정)
│   │   ├── categories/       # 카테고리 관리
│   │   ├── brands/           # 브랜드 관리
│   │   ├── sites/            # 사이트 관리
│   │   └── admins/           # 관리자 계정
│   ├── (auth)/               # 인증 페이지 (레이아웃 제외)
│   │   └── login/
│   └── api/[...path]/        # CORS 프록시
│
├── components/
│   ├── ui/                   # shadcn/ui 기본 컴포넌트
│   ├── layout/               # AdminLayout, Sidebar, Header, MobileDrawer
│   ├── common/               # DataTable, Pagination, ConfirmDialog, ImageUploader 등
│   ├── products/             # ProductForm, OptionCombinationTable 등
│   ├── categories/           # CategoryTree, CategoryFormDialog
│   ├── brands/               # BrandFormDialog
│   ├── sites/                # SiteFormDialog
│   └── admins/               # AdminFormDialog
│
├── services/                 # API 서비스 레이어 (도메인별 분리)
├── stores/                   # Zustand 스토어 (auth, sidebar)
├── hooks/                    # useAuth, usePagination, useDebounce
├── types/                    # TypeScript 타입 정의
├── data/                     # 정적 설정 (labels, menuData, formFields)
├── lib/                      # api 래퍼, constants, utils
└── middleware.ts             # JWT 쿠키 기반 인증 미들웨어
```

---

## 라우팅

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | 대시보드 | 통계 카드 (상품, 브랜드, 카테고리 수) |
| `/login` | 로그인 | 이메일/비밀번호 인증 |
| `/products` | 상품 목록 | 테이블/카드 뷰 전환, 다중 필터 |
| `/products/new` | 상품 등록 | 사이트→카테고리 캐스케이드 선택 |
| `/products/[id]` | 상품 상세 | 상품 정보, 옵션, SKU 표시 |
| `/products/[id]/edit` | 상품 수정 | 기존 데이터 프리필 |
| `/categories` | 카테고리 | 트리 뷰 + DnD 정렬 |
| `/brands` | 브랜드 목록 | CRUD + 로고 관리 |
| `/brands/[id]` | 브랜드 상세 | 브랜드 정보 표시/수정 |
| `/sites` | 사이트 관리 | CRUD + 상태 토글 |
| `/admins` | 관리자 계정 | SUPER_ADMIN 전용 |

---

## API 연동

백엔드 REST API (`/api/v1/`)와 프록시를 통해 통신합니다.

- **인증**: `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`
- **상품**: `GET|POST /products`, `GET|PUT|DELETE /products/{id}`
- **카테고리**: `GET|POST|PUT|DELETE /admin/categories`
- **브랜드**: `GET|POST /admin/brands`, `PUT|DELETE /admin/brands/{id}`, `PATCH /admin/brands/{id}/status`
- **사이트**: `GET|POST /admin/sites`, `PUT|DELETE /admin/sites/{id}`, `PATCH /admin/sites/{id}/status`
- **관리자**: `GET|POST /admin/admins`, `PUT|DELETE /admin/admins/{id}`

모든 API 호출은 `credentials: 'include'`로 HttpOnly 쿠키를 전송합니다.

---

## 인증 흐름

1. 로그인 → 백엔드가 JWT를 HttpOnly Cookie로 발급
2. 모든 요청에 쿠키 자동 포함 (`credentials: 'include'`)
3. 페이지 진입 시 `useAuth()` 훅이 `/auth/me`로 세션 검증
4. 미들웨어가 `access_token` 쿠키 존재 여부로 라우트 보호
5. 인증 실패(401) 시 → `/login` 리다이렉트

---

## 설계 원칙

- **레이아웃 → 페이지 → 컨테이너 → 요소 → UI → 데이터 → A11y** 순서로 설계
- **구조 = 코드, 설정 = data/, 스타일 = Tailwind + 토큰** 분리
- UI 텍스트/라벨은 `data/labels.ts`에서 중앙 관리 (i18n 대비)
- CRUD 패턴 통일 (목록/등록/수정/상세/삭제)
- 웹 접근성(WCAG) 기본 준수 (`aria-*`, 시맨틱 HTML, 키보드 내비게이션)
- 반응형 디자인 (모바일 Drawer, 카드 뷰, 접힘 필터)

---

## 미커밋 변경 사항

- 앱 이름 변경: "시그널 디코드 스토어" → "MIREP 아카이빙"
- 사이트 라벨 수정: "코드" → "대분류", 플레이스홀더 업데이트
- 메타 정보 업데이트
