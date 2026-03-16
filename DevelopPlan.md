# 개발 계획 (Development Plan)

## 구현 순서 원칙

**의존성 순서**: 하위 레이어부터 → 상위 레이어로
**기능 순서**: 인증 → 기반 인프라 → 단순 CRUD → 복잡 CRUD

---

## Phase 1: 기반 인프라

모든 페이지가 의존하는 공통 레이어. 여기가 완성되어야 이후 기능 개발이 빠르다.

### 1-1. 프로젝트 초기 세팅
- [x] Next.js 보일러플레이트 정리
- [x] 디렉토리 구조 생성 (`types/`, `services/`, `stores/`, `data/`, `hooks/`)
- [x] `lib/api.ts` — fetch 래퍼 (credentials, 공통 에러 처리)
- [x] `lib/constants.ts` — 상품 상태, 옵션 타입 등 상수
- [x] `types/api.ts` — API 응답 공통 타입 (`ApiResponse<T>`, `PaginatedResponse<T>`)

### 1-2. 레이아웃
- [x] `components/layout/AdminLayout.tsx` — 사이드바 + 헤더 + 콘텐츠 영역
- [x] `components/layout/Sidebar.tsx` — 메뉴 네비게이션
- [x] `components/layout/Header.tsx` — 상단 바 (로그아웃 등)
- [x] `components/layout/MobileDrawer.tsx` — 모바일 사이드바
- [x] `stores/useSidebarStore.ts` — 사이드바 열림/닫힘
- [x] `data/menuData.ts` — 메뉴 항목 정의
- [x] `app/(admin)/layout.tsx` — AdminLayout 적용 (route group)
- [x] `app/(admin)/page.tsx` — 빈 대시보드 (placeholder)
- [x] `app/(auth)/layout.tsx` — 로그인 전용 레이아웃 (사이드바 없음)

### 1-3. 공통 컴포넌트 (shadcn/ui 설치 + 커스텀)
- [x] shadcn/ui 컴포넌트 추가 설치 (Table, Dialog, Select, Input, Textarea, Badge, DropdownMenu, Label)
- [x] `components/common/DataTable.tsx` — 범용 테이블
- [x] `components/common/SearchFilter.tsx` — 검색/필터 패널
- [x] `components/common/Pagination.tsx`
- [x] `components/common/ConfirmDialog.tsx`
- [x] `components/common/StatusBadge.tsx`
- [x] `components/common/EmptyState.tsx`
- [x] `components/common/ImageUploader.tsx`
- [x] `hooks/usePagination.ts`
- [x] `hooks/useDebounce.ts`

---

## Phase 2: 인증 (F-001, F-002)

레이아웃 다음으로 인증이 먼저. 이후 모든 페이지에 인증 가드가 필요하다.

### 2-1. 로그인 (F-001)
- [x] `app/(auth)/login/page.tsx` — 로그인 폼 (사이드바 없는 독립 레이아웃)
- [x] `services/authService.ts` — `login()`, `logout()`, `getMe()`
- [x] `stores/useAuthStore.ts` — 인증 상태 관리
- [x] `hooks/useAuth.ts` — 인증 가드 (미인증 시 로그인 리다이렉트)
- [x] `AdminLayout`에 인증 가드 적용 (로딩 → 인증 확인 → 리다이렉트)

### 2-2. 관리자 계정/권한 관리 (F-002)
- [x] `types/admin.ts` — Admin 타입
- [x] `services/adminService.ts` — CRUD 함수
- [x] `components/admins/AdminFormDialog.tsx` — 추가/수정 폼 다이얼로그
- [x] `app/(admin)/admins/page.tsx` — 관리자 목록/등록/수정/삭제
- [x] 역할(role) 기반 뱃지 표시 (SUPER/MANAGER)

---

## Phase 3: 브랜드 (F-030~032)

가장 단순한 CRUD. 공통 컴포넌트(DataTable, ConfirmDialog 등)의 실전 검증용.

- [x] `types/brand.ts`
- [x] `services/brandService.ts`
- [x] `components/brands/BrandFormDialog.tsx` — 추가/수정 폼 다이얼로그
- [x] `app/(admin)/brands/page.tsx` — 목록 + 모달로 추가/수정/삭제 (단일 페이지)

---

## Phase 4: 카테고리 (F-020~023)

브랜드보다 약간 복잡 — 트리 구조 + 순서 관리(드래그).

- [x] `types/category.ts` — Category (parentId로 트리 구조)
- [x] `services/categoryService.ts`
- [x] `components/categories/CategoryFormDialog.tsx` — 추가/수정 폼 (상위 카테고리 선택)
- [x] `components/categories/CategoryTree.tsx` — 트리 표시 + 드래그 순서 변경
- [x] `app/(admin)/categories/page.tsx` — 트리 뷰 + 추가/수정/삭제/순서 관리

---

## Phase 5: 상품 관리 — 기본 CRUD (F-010~014, F-019)

가장 복잡한 도메인. 먼저 옵션 없는 기본 상품 CRUD를 만들고, 그 다음 옵션을 추가한다.

### 5-1. 타입 & 서비스
- [x] `types/product.ts` — Product, ProductFormData, ProductListParams
- [x] `services/productService.ts`

### 5-2. 상품 목록 (F-011, F-019)
- [x] `app/(admin)/products/page.tsx` — DataTable + SearchFilter + 페이지네이션
- [x] `components/products/ProductListItem.tsx` — 모바일용 카드 (DropdownMenu 액션)
- [x] 검색(키워드) + 필터(상태/카테고리/브랜드) + 정렬 + 페이지네이션

### 5-3. 상품 등록 (F-010)
- [x] `components/products/ProductForm.tsx` — 기본 정보 폼 (이름, 가격, 설명, 카테고리, 브랜드, 상태, 이미지)
- [x] `app/(admin)/products/new/page.tsx`

### 5-4. 상품 상세 & 수정 (F-012, F-013)
- [x] `app/(admin)/products/[id]/page.tsx` — 상세 보기 (이미지, 정보, 설명)
- [x] `app/(admin)/products/[id]/edit/page.tsx` — ProductForm 재사용 (수정 모드)

### 5-5. 상품 삭제 (F-014)
- [x] ConfirmDialog 연동 (목록 + 상세 페이지 양쪽에서 삭제 가능)

---

## Phase 6: 상품 옵션 (F-010-1~5)

기본 상품 CRUD 위에 옵션 레이어를 추가한다.

### 6-1. 옵션 타입 정의 (F-010-1)
- [x] `types/product.ts`에 ProductOption, ProductVariant 타입 추가
- [x] `components/products/OptionTypeSelector.tsx` — 고정/자유 옵션 선택, 옵션값 태그 입력

### 6-2. 옵션 조합별 재고 (F-010-2)
- [x] `components/products/OptionCombinationTable.tsx` — 조합 매트릭스 테이블
- [x] 조합 자동 생성 로직 (고정 옵션 값의 데카르트 곱)
- [x] 각 variant별 SKU, 재고 수량, 추가금액 입력
- [x] 기존 데이터 매칭 (수정 시 입력값 유지)

### 6-3. 옵션별 가격 차이 (F-010-3)
- [x] `components/products/OptionPriceEditor.tsx` — 옵션값별 추가금액 빠른 설정
- [x] 추가금액 변경 시 조합 테이블에 자동 반영

### 6-4. 옵션 수정/삭제 정책 (F-010-5)
- [x] ProductForm에 옵션 섹션 통합 (등록/수정 모두)
- [x] 상품 상세 페이지에 옵션/variant 정보 표시

---

## Phase 7: 마무리

- [x] 대시보드 (`app/(admin)/page.tsx`) — 전체 상품 수, 품절 상품, 카테고리 수, 브랜드 수 카드
- [x] `app/(admin)/error.tsx` — 에러 바운더리 (재시도 버튼)
- [x] `app/(admin)/loading.tsx` — 스켈레톤 로딩 (대시보드)
- [x] `app/(admin)/products/loading.tsx` — 스켈레톤 로딩 (상품 목록)
- [x] `app/not-found.tsx` — 404 페이지
- [x] 반응형 점검 — Sidebar/MobileDrawer 전환, 상품 목록 테이블/카드 반응형
- [x] A11y 점검 — aria-label, aria-current, aria-sort, role="alert", 폼 레이블링
