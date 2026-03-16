## 프로젝트 개요

쇼핑몰 **관리자 페이지** — 상품/카테고리/브랜드 관리 및 관리자 인증을 수행하는 비공개 어드민 웹앱.

---

## 기능 목록

### 인증
| ID | 기능 |
|----|------|
| F-001 | 관리자 로그인 |
| F-002 | 관리자 계정/권한 관리 |

### 상품관리
| ID | 기능 | 비고 |
|----|------|------|
| F-010 | 상품 등록 | |
| F-010-1 | 옵션 타입 정의 | 고정 vs 자유 생성 |
| F-010-2 | 옵션 조합별 재고 관리 | 색상+사이즈 조합별 SKU/재고 |
| F-010-3 | 옵션별 가격 차이 설정 | 추가금액 방식 |
| F-010-5 | 옵션 추가/수정/삭제 정책 | 기존 주문 영향 고려 |
| F-011 | 상품 전체 조회 | 검색/필터/정렬/페이지네이션 |
| F-012 | 상품 상세 조회 | |
| F-013 | 상품 수정 | |
| F-014 | 상품 삭제 | |
| F-019 | 검색 및 필터 | 이름/카테고리/브랜드/상태 |

### 카테고리
| ID | 기능 | 비고 |
|----|------|------|
| F-020 | 카테고리 추가 | |
| F-021 | 카테고리 수정 | |
| F-022 | 카테고리 삭제 | 하위 카테고리/상품 존재 시 처리 |
| F-023 | 카테고리 순서 관리 | 드래그 앤 드롭 정렬 |

### 브랜드
| ID | 기능 |
|----|------|
| F-030 | 브랜드 추가 |
| F-031 | 브랜드 수정 |
| F-032 | 브랜드 삭제 |

---

## 핵심 목표

1. **구조가 튼튼하고 재사용 가능한 관리자 템플릿 유지**
2. **구조 = 코드, 설정 = config/data, 스타일 = Tailwind + 토큰**으로 분리
3. **간결한 TypeScript 코드** (불필요한 추상화/과설계 금지)
4. **웹 접근성(WCAG, A11y)을 기본적으로 준수**
5. **CRUD 패턴 통일** — 목록/등록/수정/상세/삭제를 일관된 구조로

---

## 개발 사고 순서 (항상 이 순서로 설계)

레이아웃 → 페이지 → 컨테이너 → 블록/요소 → UI → 데이터(API) → A11y

---

## 기술 스택

- **Next.js 16 (App Router)**
- **React 19 + TSX (TypeScript)**
- **State: Zustand**
- **스타일: Tailwind CSS 4 + CSS Variables (토큰)**
- **UI 컴포넌트: shadcn/ui (base-vega 스타일)**
- **아이콘: lucide-react**
- **Backend: Java (Spring Boot, REST `/api/...`)**
- **인증: JWT + HttpOnly Cookie**

---

## 디렉토리 구조

```
shop-admin/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 루트 레이아웃 (AdminLayout 적용)
│   ├── page.tsx                  # 대시보드 (로그인 후 메인)
│   ├── login/
│   │   └── page.tsx              # F-001 로그인 (레이아웃 제외)
│   ├── products/                 # 상품관리
│   │   ├── page.tsx              # F-011 상품 목록 + F-019 검색/필터
│   │   ├── new/
│   │   │   └── page.tsx          # F-010 상품 등록 (옵션 포함)
│   │   └── [id]/
│   │       ├── page.tsx          # F-012 상품 상세
│   │       └── edit/
│   │           └── page.tsx      # F-013 상품 수정
│   ├── categories/               # 카테고리
│   │   └── page.tsx              # F-020~023 CRUD + 순서 관리 (단일 페이지)
│   ├── brands/                   # 브랜드
│   │   └── page.tsx              # F-030~032 CRUD (단일 페이지)
│   └── admins/                   # 관리자 계정
│       └── page.tsx              # F-002 계정/권한 관리
│
├── components/
│   ├── ui/                       # shadcn/ui 기본 컴포넌트
│   ├── layout/                   # 레이아웃
│   │   ├── AdminLayout.tsx       # 사이드바 + 헤더 + 콘텐츠 영역
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── MobileDrawer.tsx
│   ├── common/                   # 공통 재사용
│   │   ├── DataTable.tsx         # 범용 테이블 (정렬/페이지네이션)
│   │   ├── SearchFilter.tsx      # 검색/필터 패널
│   │   ├── Pagination.tsx
│   │   ├── ConfirmDialog.tsx     # 삭제 확인 등
│   │   ├── ImageUploader.tsx     # 이미지 업로드 (미리보기)
│   │   ├── StatusBadge.tsx       # 상태 뱃지 (판매중/품절/숨김)
│   │   ├── EmptyState.tsx        # 데이터 없을 때
│   │   └── SortableList.tsx      # 드래그 정렬 (카테고리 순서용)
│   ├── products/                 # 상품 도메인
│   │   ├── ProductForm.tsx       # 등록/수정 공용 폼
│   │   ├── ProductListItem.tsx   # 모바일용 카드
│   │   ├── ProductImageGallery.tsx
│   │   ├── OptionTypeSelector.tsx    # F-010-1 옵션 타입 (고정/자유)
│   │   ├── OptionCombinationTable.tsx # F-010-2 조합별 재고 관리
│   │   └── OptionPriceEditor.tsx     # F-010-3 옵션별 추가금액
│   ├── categories/               # 카테고리 도메인
│   │   ├── CategoryForm.tsx
│   │   └── CategoryTree.tsx      # F-023 트리 + 순서 관리
│   └── brands/                   # 브랜드 도메인
│       └── BrandForm.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── usePagination.ts
│   └── useDebounce.ts
│
├── lib/
│   ├── utils.ts                  # cn() 등 shadcn 유틸
│   ├── api.ts                    # fetch 래퍼 (credentials, 에러 처리)
│   └── constants.ts              # 상수 (상품 상태 등)
│
├── services/                     # API 호출 (도메인별)
│   ├── productService.ts
│   ├── categoryService.ts
│   ├── brandService.ts
│   └── authService.ts
│
├── stores/                       # Zustand 스토어
│   ├── useAuthStore.ts
│   └── useSidebarStore.ts
│
├── data/                         # 정적 설정 데이터
│   ├── menuData.ts               # 사이드바 메뉴 구성
│   └── formFields.ts             # 폼 필드 정의 (라벨, placeholder)
│
├── types/                        # TypeScript 타입
│   ├── product.ts                # Product, ProductOption, ProductVariant
│   ├── category.ts
│   ├── brand.ts
│   ├── admin.ts
│   └── api.ts                    # API 응답 공통 타입
│
└── public/
    └── images/
```

---

## 인증(Auth) 규칙

- JWT는 백엔드가 발급/검증, 토큰은 **HttpOnly Cookie**로 관리
- 프론트는 토큰 값에 직접 접근하지 않음
- 모든 API 호출: `credentials: 'include'`
- 인증 실패(401) 시 → 로그인 페이지로 리다이렉트
- 로그인 페이지는 레이아웃에서 사이드바/헤더 제외

---

## API 호출 규칙

### fetch 래퍼 (`lib/api.ts`)
- `credentials: 'include'` 기본 설정
- 공통 에러 처리: 401 → 로그인 리다이렉트, 403 → 권한 없음 표시, 500 → 에러 토스트
- `Content-Type: application/json` 기본 (파일 업로드 시 `multipart/form-data`)

### 서비스 레이어 (`services/`)
- 도메인별 파일 분리 (`productService.ts`, `categoryService.ts`, `brandService.ts`)
- 각 함수는 단일 API 엔드포인트에 대응
- 예: `getProducts(params)`, `getProduct(id)`, `createProduct(data)`, `updateProduct(id, data)`, `deleteProduct(id)`

---

## Data 설계 원칙

### API 데이터 (동적)
- 상품/주문/회원 등 비즈니스 데이터는 **항상 API에서** 가져온다
- 컴포넌트에 목업 데이터 하드코딩 금지

### 정적 설정 데이터 (`data/`)
- 사이드바 메뉴 구성, 폼 필드 정의, 상태값 라벨 등 **UI 설정**은 data 파일로 관리
- 컴포넌트 내부에 메뉴 항목, 라벨 문자열 직접 작성 금지

### 상수 (`lib/constants.ts`)
- 상품 상태(`SALE`, `SOLDOUT`, `HIDDEN`), 옵션 타입(`FIXED`, `FREE`) 등 열거형 값
- API 엔드포인트 base path

---

## 상품 옵션 설계 (핵심 복잡도)

### 옵션 타입 (F-010-1)
- **고정 옵션**: 관리자가 미리 정의한 선택지 (예: 색상 = 빨강/파랑/검정)
- **자유 생성 옵션**: 사용자가 텍스트 입력 (예: 각인 문구)

### 옵션 조합 = Variant (F-010-2)
- 색상 × 사이즈 조합마다 **개별 SKU, 재고 수량** 관리
- 예: 빨강-S(재고10), 빨강-M(재고5), 파랑-S(재고8)...
- 조합 테이블에서 일괄 입력/수정 가능해야 함

### 옵션별 추가금액 (F-010-3)
- 기본가격 + 옵션 추가금액 방식
- 예: 기본 29,000원, XL 사이즈 +2,000원

### 옵션 수정/삭제 정책 (F-010-5)
- 기존 주문이 있는 옵션 삭제 시 → 확인 다이얼로그 필수
- 옵션 추가는 자유, 삭제는 신중하게 (soft delete 고려)

---

## 네이밍 규칙

컴포넌트 파일명 (PascalCase):
- 레이아웃: `SomethingLayout.tsx`
- 큰 섹션/블록: `SomethingContainer.tsx`
- 소규모 래퍼: `SomethingWrap.tsx`
- 범용 박스: `SomethingBox.tsx`

리스트:
- ul → `XxxList`
- li → `XxxListItem`

타입 파일:
- `types/product.ts` → `Product`, `ProductFormData`, `ProductListParams`

서비스 파일:
- `services/productService.ts` → `getProducts()`, `createProduct()`

---

## 스타일 규칙

- **Tailwind CSS** 유틸리티 클래스 사용
- **shadcn/ui** 컴포넌트 적극 활용 (Button, Input, Table, Dialog, Select 등)
- inline style 금지
- 색상/간격 등은 **CSS Variables (Tailwind 토큰)** 사용 — 하드코딩된 HEX/px 금지
- 커스텀 스타일이 필요한 경우 `globals.css`에 CSS Variable로 정의
- 반응형: Tailwind 브레이크포인트 사용 (`sm:`, `md:`, `lg:`)

---

## 모바일 최적화

- 관리자 페이지도 **태블릿/모바일 대응**
- Sidebar → 모바일에서 Drawer로 전환
- DataTable → 모바일에서 카드형 레이아웃 또는 가로 스크롤
- 검색/필터 → 모바일에서 접힘 패널

---

## CRUD 페이지 패턴 (통일)

### 목록 페이지
```
SearchFilter → DataTable (정렬/페이지네이션) → 각 행에 상세/수정/삭제 액션
```

### 등록/수정 페이지
```
폼 컴포넌트 (공용) → 유효성 검사 → API 호출 → 성공 시 목록으로 이동
```

### 상세 페이지
```
데이터 표시 → 수정/삭제 버튼 → ConfirmDialog로 삭제 확인
```

---

## 폼 & 유효성 검사

- 필수 필드 표시: 라벨 옆 `*` (시각적) + `required` 속성 (HTML)
- 클라이언트 유효성 검사: 제출 시점에 검증, 에러 메시지 표시
- 서버 에러 응답(422 등)도 폼에 매핑하여 표시
- 이미지 업로드: 미리보기 제공, 파일 크기/형식 제한 클라이언트에서 사전 체크

---

## A11y 규칙 (필수)

### 폼 레이블링
- `<label htmlFor="id">` + `<input id="id">` 필수
- 에러/힌트는 `aria-describedby`로 연결
- 필수 필드: `aria-required="true"`

### 키보드 접근성
- 인터랙션 요소는 `<button>`, `<a>`, `<input>` 등 시맨틱 태그 사용
- `div`에 `onClick` 금지 → 반드시 `<button>` 사용
- 모달/드로어 열릴 때 포커스 트래핑
- Tab 순서가 논리적인 DOM 순서를 따른다

### 테이블 접근성
- `<table>`, `<thead>`, `<tbody>`, `<th scope="col">` 사용
- 정렬 가능한 컬럼: `aria-sort` 속성
- 빈 테이블: 안내 메시지 표시

### 상태 피드백
- 로딩 중: `aria-busy="true"` 또는 로딩 스피너에 `aria-label`
- 토스트/알림: `role="alert"` 또는 `aria-live="polite"`
- 삭제 확인 다이얼로그: `role="alertdialog"`

---

## 에러 처리 패턴

- **API 에러**: fetch 래퍼에서 공통 처리 (401 리다이렉트, 토스트 표시)
- **폼 유효성 에러**: 필드 옆 인라인 에러 메시지
- **빈 상태**: `EmptyState` 컴포넌트로 안내
- **로딩 상태**: 스켈레톤 UI 또는 스피너
- **네트워크 에러**: 재시도 버튼 제공

---

## 금지 (절대)

- inline style
- HEX / px 하드코딩 (Tailwind 토큰 사용)
- `div`에 `onClick` (시맨틱 태그 사용)
- 컴포넌트에 API 목업 데이터 하드코딩
- UI 텍스트/라벨을 컴포넌트에 직접 작성 (data 파일로 관리)
- `any` 타입 남발 (적절한 타입 정의)
- `console.log` 남기기 (개발 중 임시 사용 후 반드시 제거)
- API 호출에 `credentials: 'include'` 누락

---

## 기능/페이지 개발 시 답변 형식

1. 요구 요약
2. 구조 설계 트리 (레이아웃 → 페이지 → 컨테이너 → 요소)
3. 생성/수정 파일 목록 (상대 경로)
4. 코드 (TSX + TS + Tailwind)
5. 연결되는 API 엔드포인트 & 타입 정의
6. A11y 관점에서 준수한 내용 설명
