# 상품 등록 고도화 계획

## 요구사항 정리

### 필수 데이터
| 필드 | 타입 | 설명 |
|------|------|------|
| 상품 이미지 | File[] | 최소 1장 필수, 다중 업로드 |
| 상품명 | string | 텍스트 입력 |
| 대분류 | select | 카테고리 level 1 |
| 중분류 | select | 대분류 선택 시 필터링 |
| 가격 | number | 판매가 |
| 재고 | number | 기본 재고 수량 |

### 선택 데이터
| 필드 | 타입 | 설명 |
|------|------|------|
| 소분류 | select | 중분류 선택 시 필터링 |
| 브랜드 | select | 브랜드 목록에서 선택 |
| 마진 1 가격 | number | 첫 번째 마진 기준 가격 |
| 마진 2 가격 | number | 두 번째 마진 기준 가격 |

### 사용자 정의 옵션 (동적 추가)
사이즈, 색상 등을 관리자가 자유롭게 추가/삭제할 수 있는 구조.

---

## 현재 상태 vs 변경 사항

### 현재 ProductForm이 가진 것
- 상품명, 설명, 가격, 상태, 카테고리(3단계), 브랜드, 이미지, 옵션, 조합(Variant)

### 변경/추가가 필요한 것
1. **재고 필드 추가** — 옵션 없는 단품의 기본 재고
2. **마진 1/마진 2 가격 필드 추가** — 새로운 필드
3. **이미지 필수 검증 추가** — 현재는 선택
4. **중분류 필수로 변경** — 현재도 필수이지만 재확인
5. **재고 필드 필수 검증** — 신규
6. **옵션 ↔ 재고 연동 로직** — 옵션이 있으면 조합별 재고, 없으면 기본 재고 사용

---

## 구조 설계

### 폼 섹션 레이아웃 (위 → 아래 순서)

```
ProductForm
├── 섹션 1: 기본 정보 (필수)
│   ├── 상품 이미지 업로드 (ImageUploader) *
│   ├── 상품명 *
│   ├── 대분류 선택 *
│   ├── 중분류 선택 *  (대분류 연동)
│   ├── 소분류 선택     (중분류 연동, 선택)
│   ├── 가격 *
│   └── 재고 *
│
├── 섹션 2: 추가 정보 (선택)
│   ├── 브랜드 선택
│   ├── 마진 1 가격
│   ├── 마진 2 가격
│   └── 상품 설명 (textarea)
│
├── 섹션 3: 사용자 정의 옵션 (선택)
│   ├── OptionTypeSelector (옵션 추가/삭제)
│   │   └── 옵션명 입력 + 옵션값 태그 추가
│   ├── OptionPriceEditor (고정 옵션의 추가금액 설정)
│   └── OptionCombinationTable (조합별 SKU/재고/추가금액)
│
└── 하단 액션
    ├── 취소 버튼
    └── 등록/수정 버튼
```

### 재고 관리 분기 로직

```
옵션 없음 → 섹션 1의 "재고" 필드 사용 (단일 재고)
옵션 있음 → 섹션 1의 "재고" 필드 비활성화 + 안내 문구 표시
            → 섹션 3의 OptionCombinationTable에서 조합별 재고 입력
```

---

## 수정 대상 파일 목록

### 1. 타입 수정 — `types/product.ts`

```diff
 interface Product {
   ...
+  stock: number;              // 기본 재고 (옵션 없을 때 사용)
+  marginPrice1?: number;      // 마진 1 가격
+  marginPrice2?: number;      // 마진 2 가격
 }

 interface ProductFormData {
   ...
+  stock: number;
+  marginPrice1?: number;
+  marginPrice2?: number;
 }
```

### 2. 라벨/텍스트 추가 — `data/labels.ts`

```ts
// product.form 섹션에 추가
stock: '재고',
stockPlaceholder: '재고 수량을 입력하세요',
stockDisabledHint: '옵션이 있는 상품은 조합별 재고를 입력하세요',
marginPrice1: '마진 1 가격',
marginPrice1Placeholder: '마진 1 가격을 입력하세요',
marginPrice2: '마진 2 가격',
marginPrice2Placeholder: '마진 2 가격을 입력하세요',
sectionBasic: '기본 정보',
sectionAdditional: '추가 정보',
sectionOptions: '사용자 정의 옵션',

// validation 섹션에 추가
imageRequired: '상품 이미지를 1장 이상 등록하세요',
stockRequired: '재고를 입력하세요',
stockMin: '재고는 0 이상이어야 합니다',
```

### 3. 폼 컴포넌트 수정 — `components/products/ProductForm.tsx`

주요 변경:
- **state 추가**: `stock`, `marginPrice1`, `marginPrice2`
- **섹션 분리**: Card 또는 시각적 구분으로 3개 섹션 나누기
- **이미지 필수 검증**: `validate()` 함수에 이미지 최소 1장 체크 추가
- **재고 필수 검증**: `validate()` 함수에 재고 체크 추가
- **재고 비활성화 로직**: 옵션이 1개 이상이면 기본 재고 입력 비활성화 + 안내 문구
- **FormData 전송**: 새 필드 포함

### 4. 목데이터 수정 — `data/mockProducts.ts` (존재 시)

새 필드(stock, marginPrice1, marginPrice2) 반영.

### 5. 상세/수정 페이지 반영

- `app/(admin)/products/[id]/page.tsx` — 재고, 마진 가격 표시
- `app/(admin)/products/[id]/edit/page.tsx` — ProductForm에 기존 데이터 전달

---

## 사용자 정의 옵션 동작 방식

### 현재 구현 (유지)
기존 `OptionTypeSelector` → `OptionPriceEditor` → `OptionCombinationTable` 흐름을 그대로 활용.

### 사용자 시나리오

#### 시나리오 A: 옵션 없는 단품
1. 기본 정보 입력 (이미지, 상품명, 카테고리, 가격, 재고)
2. 선택 정보 입력 (브랜드, 마진 가격)
3. 옵션 섹션 건드리지 않음
4. 등록 → stock 필드 값이 해당 상품의 재고

#### 시나리오 B: 옵션 있는 상품
1. 기본 정보 입력 (이미지, 상품명, 카테고리, 가격)
2. 재고 필드 → 옵션 추가 시 자동 비활성화
3. 옵션 섹션에서 "색상" 옵션 추가 → 값: 빨강, 파랑
4. "사이즈" 옵션 추가 → 값: S, M, L
5. 조합 테이블 자동 생성 (빨강-S, 빨강-M, ... 파랑-L)
6. 각 조합별 SKU, 재고, 추가금액 입력
7. 등록 → variants 배열로 전송

---

## 구현 순서

### Step 1: 타입 & 데이터 업데이트
- [ ] `types/product.ts` — stock, marginPrice1, marginPrice2 필드 추가
- [ ] `data/labels.ts` — 새 필드 라벨/placeholder/validation 메시지 추가
- [ ] `lib/constants.ts` — 필요 시 상수 추가

### Step 2: ProductForm 고도화
- [ ] 섹션 분리 (기본 정보 / 추가 정보 / 사용자 정의 옵션)
- [ ] 재고 필드 추가 + 옵션 유무에 따른 활성화/비활성화
- [ ] 마진 1, 마진 2 가격 필드 추가
- [ ] 이미지 필수 검증 추가
- [ ] 재고 필수 검증 추가 (옵션 없을 때만)
- [ ] FormData 전송에 새 필드 포함

### Step 3: 상세/목록 페이지 반영
- [ ] 상품 상세 페이지에 재고, 마진 가격 표시
- [ ] 상품 목록에 재고 컬럼 추가 (선택)

### Step 4: 목데이터 업데이트
- [ ] mockProducts에 새 필드 반영

---

## A11y 체크리스트

- [ ] 새 필드(재고, 마진1, 마진2)에 `<label htmlFor>` + `aria-required` 적용
- [ ] 재고 비활성화 시 `aria-disabled="true"` + 안내 문구 `aria-describedby` 연결
- [ ] 이미지 필수 에러 메시지 `role="alert"` 또는 `aria-live="polite"`
- [ ] 섹션 구분에 `<fieldset>` + `<legend>` 사용 (스크린리더 구조 전달)

---

## API 엔드포인트 (백엔드 참고)

```
POST   /api/products          — 상품 등록 (multipart/form-data)
PUT    /api/products/:id      — 상품 수정 (multipart/form-data)

Request Body (FormData):
  - images: File[]
  - name: string
  - mainCategoryId: number
  - subCategoryId: number
  - detailCategoryId?: number
  - brandId?: number
  - price: number
  - stock: number              ← 신규
  - marginPrice1?: number      ← 신규
  - marginPrice2?: number      ← 신규
  - description?: string
  - status: string
  - options: JSON string (ProductOption[])
  - variants: JSON string (ProductVariant[])
```
