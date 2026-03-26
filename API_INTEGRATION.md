# API 연동 현황 정리

> 최종 업데이트: 2026-03-26
> Frontend: `store-admin-FE` / Backend: `mirep-admin-api`

---

## 1. 아키텍처 개요

```
[Browser]
   │
   ▼
[Next.js App]  ── /api/v1/** ──▶  [Proxy Route]  ── path 분기 ──▶  [Store Backend :8080]
   │                                     │                           (상품/카테고리/브랜드/사이트/관리자/인증)
   │                                     │
   │                                     └─── MALL_PREFIXES ──▶     [Mall Backend] (미구현, mock)
   │
   ├── lib/api.ts         : fetch 래퍼 (credentials: include, 공통 에러 처리)
   ├── lib/apiConfig.ts   : 도메인→백엔드 라우팅 맵
   └── app/api/[...path]  : 서버사이드 프록시 (쿠키 포워딩)
```

### 인증 흐름
```
POST /auth/login  →  백엔드가 access_token, refresh_token을 HttpOnly Cookie로 발급
                  →  이후 모든 요청은 credentials: include로 쿠키 자동 전송
401 응답          →  middleware.ts에서 /login으로 리다이렉트
```

### 환경변수 (.env.local)
| 변수 | 현재 값 | 설명 |
|------|---------|------|
| `API_URL` | `http://13.124.163.110:9091` | Store 백엔드 URL |
| `API_MALL_URL` | (미설정, API_URL 폴백) | Mall 백엔드 URL |
| `API_UNIFIED_URL` | (미설정) | 통합 후 단일 URL |

---

## 2. API 연동 상태 요약

### 실제 API 연결 완료 (Store Backend)

| 도메인 | 프론트 서비스 | 백엔드 컨트롤러 | 상태 |
|--------|-------------|----------------|------|
| 인증 | `authService.ts` | `AuthController` | **연결됨** |
| 관리자 | `adminService.ts` | `AdminController` | **연결됨** |
| 상품 | `productService.ts` | `ProductController` | **연결됨** |
| 카테고리 | `categoryService.ts` | `CategoryController` | **연결됨** |
| 브랜드 | `brandService.ts` | `BrandController` | **연결됨** |
| 사이트 | `siteService.ts` | `TenantController` | **연결됨** (네이밍 불일치 있음) |
| 이미지 | `imageService.ts` | `S3Controller` | **연결됨** |

### Mock 데이터 사용 중 (Mall Backend 미구현)

| 도메인 | 프론트 서비스 | 백엔드 상태 | 비고 |
|--------|-------------|-----------|------|
| 주문 | `orderService.ts` | Entity만 존재, Controller 없음 | mock |
| 회원 | `memberService.ts` | Entity만 존재 | mock |
| 클레임 | `claimService.ts` | Entity 없음 | mock |
| 배너 | `bannerService.ts` | Entity만 존재 | mock |
| 공지 | `noticeService.ts` | Entity만 존재 | mock |
| 쿠폰 | `couponService.ts` | Entity만 존재 | mock |
| 프로모션 | `promotionService.ts` | Entity만 존재 | mock |
| 1:1 문의 | `inquiryService.ts` | Entity 없음 | mock |
| 상품 Q&A | `qnaService.ts` | Entity 없음 | mock |
| 리뷰 | `reviewService.ts` | Entity만 존재 | mock |
| FAQ | `faqService.ts` | Entity만 존재 | mock |
| 팝업 | `popupService.ts` | Entity만 존재 | mock |
| 태그 | `tagService.ts` | Entity 없음 | mock |
| 전시 | `displayService.ts` | Entity 없음 | mock |
| 대시보드 | `dashboardService.ts` | 없음 | mock |
| 배송 | `deliveryService.ts` | Entity만 존재 | mock |
| 환불 | `refundService.ts` | Entity 없음 | mock |
| 정책 | `policyService.ts` | Entity만 존재 | mock |
| 테넌트설정 | `tenantService.ts` | Entity 내 필드 | mock |

---

## 3. 엔드포인트 매핑 (실제 연결된 API)

### 3.1 인증 (`/api/v1/auth`)

| FE 함수 | Method | FE 경로 | BE 경로 | BE 메서드 |
|---------|--------|--------|--------|----------|
| `login(data)` | POST | `/auth/login` | `/api/v1/auth/login` | `AuthController.login` |
| `logout()` | POST | `/auth/logout` | `/api/v1/auth/logout` | `AuthController.logout` |
| `refresh()` | POST | `/auth/refresh` | `/api/v1/auth/refresh` | `AuthController.refresh` |
| `getMe()` | GET | `/auth/me` | `/api/v1/auth/me` | `AuthController.getMyInfo` |

**Request/Response:**
```
POST /auth/login
  Request:  { email: string, password: string }
  Response: CommonResponse<String> + Set-Cookie(access_token, refresh_token)

GET /auth/me
  Response: CommonResponse<AdminInfo> → { id, email, name, role }
```

### 3.2 관리자 (`/api/v1/admins`)

| FE 함수 | Method | FE 경로 | BE 경로 | BE 메서드 | 권한 |
|---------|--------|--------|--------|----------|------|
| `getAdmins()` | GET | `/admins` | `/api/v1/admins` | `AdminController.findAll` | SUPER_ADMIN |
| `createAdmin(data)` | POST | `/admins` | `/api/v1/admins` | `AdminController.create` | SUPER_ADMIN |
| `updateAdmin(id, data)` | PATCH | `/admins/:id` | `/api/v1/admins/:id` | `AdminController.update` | SUPER_ADMIN |
| `deactivateAdmin(id)` | DELETE | `/admins/:id` | `/api/v1/admins/:id` | `AdminController.deactivate` | SUPER_ADMIN |

### 3.3 상품 (`/api/v1/products`)

| FE 함수 | Method | FE 경로 | BE 경로 | BE 메서드 |
|---------|--------|--------|--------|----------|
| `getProducts(params)` | GET | `/products?keyword=&status=&brandId=&categoryId=&page=&size=&sort=` | `/api/v1/products` | `ProductController.findAll` |
| `getProduct(id)` | GET | `/products/:id` | `/api/v1/products/:id` | `ProductController.findById` |
| `createProduct(data, thumbnail)` | POST | `/products` | `/api/v1/products` | `ProductController.create` |
| `updateProduct(id, data, thumbnail)` | PUT | `/products/:id` | `/api/v1/products/:id` | `ProductController.update` |
| `deleteProduct(id)` | DELETE | `/products/:id` | `/api/v1/products/:id` | `ProductController.delete` |

**Multipart 구조:**
```
POST/PUT /products
  FormData:
    - data: JSON string (ProductCreateRequest)
    - thumbnail: File (optional)
```

### 3.4 카테고리 (`/api/v1/admin/categories`)

| FE 함수 | Method | FE 경로 | BE 경로 | BE 메서드 |
|---------|--------|--------|--------|----------|
| `getCategories()` | GET | `/admin/categories` | `/api/v1/admin/categories` | `CategoryController.findAll` |
| `createCategory(data)` | POST | `/admin/categories` | `/api/v1/admin/categories` | `CategoryController.create` |
| `updateCategories(tree)` | PUT | `/admin/categories` | `/api/v1/admin/categories` | `CategoryController.updateAll` |
| `deleteCategories(ids)` | DELETE | `/admin/categories` | `/api/v1/admin/categories` | `CategoryController.delete` |

**참고:** `getCategory(id)` 함수가 FE에 존재하지만 BE에 대응하는 단건 조회 API 없음.

### 3.5 브랜드 (`/api/v1/admin/brands`)

| FE 함수 | Method | FE 경로 | BE 경로 | BE 메서드 |
|---------|--------|--------|--------|----------|
| `getBrands(params)` | GET | `/admin/brands?keyword=&isActive=&page=&size=` | `/api/v1/admin/brands` | `BrandController.findAll` |
| `getBrand(id)` | GET | `/admin/brands/:id` | `/api/v1/admin/brands/:id` | `BrandController.findById` |
| `createBrand(data, logoImage)` | POST | `/admin/brands` | `/api/v1/admin/brands` | `BrandController.create` |
| `updateBrand(id, data, logoImage)` | PUT | `/admin/brands/:id` | `/api/v1/admin/brands/:id` | `BrandController.update` |
| `deleteBrand(id)` | DELETE | `/admin/brands/:id` | `/api/v1/admin/brands/:id` | `BrandController.delete` |
| `getActiveBrands()` | GET | `/admin/brands/active` | `/api/v1/admin/brands/active` | `BrandController.findActive` |
| `toggleBrandStatus(id)` | PATCH | `/admin/brands/:id/status` | `/api/v1/admin/brands/:id/status` | `BrandController.toggleStatus` |

### 3.6 사이트/테넌트 (`/api/v1/admin/sites` → `/api/v1/admin/tenants`)

| FE 함수 | Method | FE 경로 | BE 경로 | BE 메서드 |
|---------|--------|--------|--------|----------|
| `getSites(params)` | GET | `/admin/sites` | `/api/v1/admin/tenants` | `TenantController.findAll` |
| `getSite(id)` | GET | `/admin/sites/:id` | `/api/v1/admin/tenants/:id` | `TenantController.findById` |
| `createSite(data)` | POST | `/admin/sites` | `/api/v1/admin/tenants` | `TenantController.create` |
| `updateSite(id, data)` | PUT | `/admin/sites/:id` | `/api/v1/admin/tenants/:id` | `TenantController.update` |
| `deleteSite(id)` | DELETE | `/admin/sites/:id` | `/api/v1/admin/tenants/:id` | `TenantController.delete` |
| `getActiveSites()` | GET | `/admin/sites/active` | `/api/v1/admin/tenants/active` | `TenantController.findActive` |
| `toggleSiteStatus(id)` | PATCH | `/admin/sites/:id/status` | `/api/v1/admin/tenants/:id/status` | `TenantController.toggleStatus` |

> **경로 불일치:** FE는 `/admin/sites`를 호출하지만 BE는 `/admin/tenants`로 매핑됨.
> 프록시에서 sites→tenants 리매핑이 필요하거나, FE 경로를 tenants로 변경해야 함.

### 3.7 이미지 (`/api/v1/images`)

| FE 함수 | Method | FE 경로 | BE 경로 | BE 메서드 |
|---------|--------|--------|--------|----------|
| `uploadImage(file)` | POST | `/images` | `/api/v1/images` | `S3Controller.upload` |

---

## 4. 타입 매핑 & 불일치 분석

### 4.1 공통 응답 타입

| FE 타입 | BE 타입 | 일치 여부 |
|---------|---------|----------|
| `ApiResponse<T>` `{ success, data, message? }` | `CommonResponse<T>` `{ success, data, message }` | **일치** |
| `PaginatedResponse<T>` `{ success, data: { content, page, size, total_elements } }` | `CommonResponse<PageResponse<T>>` `{ success, data: { content, page, size, total_elements } }` | **일치** (`@JsonProperty("total_elements")`) |

### 4.2 Admin 타입

| FE 필드 (`types/admin.ts`) | BE 필드 (`AdminResponse`) | 불일치 |
|---------------------------|--------------------------|--------|
| `id: number` | `id: Long` | - |
| `email: string` | `email: String` | - |
| `name: string` | `name: String` | - |
| `role: AdminRole` | `role: String` | - |
| `isActive: boolean` | `isActive: Boolean` | - |
| `createdAt: string` | `createdAt: LocalDateTime` | - |

| FE 필드 (`AdminUpdateData`) | BE 필드 (`AdminUpdateRequest`) | 불일치 |
|-----------------------------|-------------------------------|--------|
| `name: string` | `name: String` | - |
| `role: AdminRole` | `role: String` | - |

### 4.3 Product 타입

#### ProductSummary (목록)

| FE 필드 (`ProductSummary`) | BE 필드 (`ProductListResponse`) | 불일치 |
|---------------------------|-------------------------------|--------|
| `id` | `id` | - |
| `thumbnailUrl` | `thumbnailUrl` | - |
| `name` | `name` | - |
| `price` | `price` | - |
| `discountPrice` | `discountPrice` | - |
| `status` | `status` | - |
| `isVisible` | `isVisible` | - |
| `brandName` | `brandName` | - |
| `categoryName` | `categoryName` | - |
| `createdAt` | `createdAt` | - |

#### Product (상세)

| FE 필드 (`Product`) | BE 필드 (`ProductDetailResponse`) | 불일치 |
|--------------------|--------------------------------|--------|
| 기본 필드 전체 | 전체 | **일치** |
| `images: ProductImage[]` | `images: List<ProductImageResponse>` | - |
| `options: ProductOption[]` | `options: List<ProductOptionResponse>` | - |
| `skus: ProductSku[]` | `skus: List<ProductSkuResponse>` | **구조 불일치 (아래 참조)** |

#### ProductSku 불일치

| FE 필드 (`ProductSku`) | BE 필드 (`ProductSkuResponse`) | 불일치 |
|----------------------|------------------------------|--------|
| `id: number` | `id: Long` | - |
| **`sku: string`** | **`skuCode: String`** | **필드명 불일치** |
| `stock: number` | `stock: Integer` | - |
| **`extraPrice: number`** | _(없음)_ | **FE에만 존재** |
| **`optionValues: Record<string, string>`** | **`optionValues: List<String>`** | **타입 불일치** |
| _(없음)_ | `isActive: Boolean` | **BE에만 존재** |

#### ProductOptionInput (등록/수정 요청)

| FE 필드 (`ProductOptionInput`) | BE 필드 (`ProductOptionRequest`) | 불일치 |
|-------------------------------|--------------------------------|--------|
| `optionName: string` | `optionName: String` | - |
| `sortOrder: number` | `sortOrder: Integer` | - |
| `values: { value: string }[]` | `values: List<ProductOptionValueRequest>` | **BE는 `value`, `extraPrice`, `sortOrder` 필요** |

#### ProductSkuInput (등록/수정 요청)

| FE 필드 (`ProductSkuInput`) | BE 필드 (`ProductSkuRequest`) | 일치 |
|----------------------------|------------------------------|------|
| `skuCode: string` | `skuCode: String` | **일치** |
| `stock: number` | `stock: Integer` | **일치** |
| `optionValues: string[]` | `optionValues: List<String>` | **일치** |

### 4.4 Category 타입

| FE 필드 (`Category`) | BE 필드 (`CategoryResponse`) | 불일치 |
|---------------------|---------------------------|--------|
| `id` | `id` | - |
| **`siteId: number`** | **`tenantId: Long`** | **네이밍 불일치** |
| **`siteName: string`** | **`tenantName: String`** | **네이밍 불일치** |
| `name` | `name` | - |
| `depth` | `depth` | - |
| `sortOrder` | `sortOrder` | - |
| `children` | `children` | - |
| `parentId` | _(없음)_ | **FE에만 존재** |
| `createdAt` | _(없음)_ | **FE에만 존재** |
| `updatedAt` | _(없음)_ | **FE에만 존재** |

| FE 필드 (`CategoryFormData`) | BE 필드 (`CategoryCreateRequest`) | 불일치 |
|-----------------------------|--------------------------------|--------|
| `name` | `name` | - |
| **`siteId`** | **`tenantId`** | **네이밍 불일치** |
| **`siteName`** | _(없음)_ | **FE에만 존재 (BE 불필요)** |
| `parentId` | `parentId` | - |
| `depth` | `depth` | - |

| FE 필드 (`CategoryUpdateNode`) | BE 필드 (`CategoryUpdateRequest`) | 불일치 |
|-------------------------------|--------------------------------|--------|
| `id` | `id` | - |
| **`siteId`** | **`tenantId`** | **네이밍 불일치** |
| **`siteName`** | _(없음)_ | **FE에만 존재** |
| `name` | `name` | - |
| `depth` | _(없음)_ | **FE에만 존재** |
| `sortOrder` | `sortOrder` | - |
| **`children: CategoryUpdateNode[]`** | _(없음, flat 구조)_ | **구조 불일치 — BE는 flat list** |
| _(없음)_ | `parentId` | **BE에만 존재 (트리→flat 변환 필요)** |

### 4.5 Brand 타입

| FE 필드 (`Brand`) | BE 필드 (`BrandResponse`) | 불일치 |
|------------------|--------------------------|--------|
| `id` | `id` | - |
| `name` | `name` | - |
| `description` | `description` | - |
| `logoUrl` | `logoUrl` | - |
| `isActive` | `isActive` | - |
| `createdAt` | `createdAt` | - |
| _(없음)_ | `updatedAt` | **BE에만 존재** |

### 4.6 Site/Tenant 타입

| FE 필드 (`Site`) | BE 필드 (`TenantResponse`) | 불일치 |
|----------------|--------------------------|--------|
| `id` | `id` | - |
| `code` | `code` | - |
| `name` | `name` | - |
| `domain` | _(없음)_ | **FE에만 존재** |
| `description` | _(없음)_ | **FE에만 존재** |
| `isActive` | `isActive` | - |
| `createdAt` | `createdAt` | - |
| _(없음)_ | `nameEn, businessNumber, ceoName, email, phone, address, ...` | **BE에 훨씬 많은 필드** |

| FE 필드 (`SiteFormData`) | BE 필드 (`TenantCreateRequest`) | 불일치 |
|--------------------------|-------------------------------|--------|
| `code` | `code` | - |
| `name` | `name` | - |
| **`domain`** | _(없음)_ | **FE에만 존재** |
| **`description`** | _(없음)_ | **FE에만 존재** |
| _(없음)_ | `nameEn` | **BE에만 존재** |

---

## 5. 백엔드 에러 코드 정리

### 공통
| 코드 | HTTP | 설명 |
|------|------|------|
| `INTERNAL_SERVER_ERROR` | 500 | 서버 내부 오류 |
| `INVALID_INPUT_VALUE` | 400 | 입력값 유효성 실패 |

### 인증
| 코드 | HTTP | 설명 |
|------|------|------|
| `ADMIN_NOT_FOUND` | 404 | 관리자 없음 |
| `INVALID_PASSWORD` | 400 | 비밀번호 불일치 |
| `INACTIVE_ACCOUNT` | 403 | 비활성 계정 |
| `INVALID_TOKEN` | 401 | 유효하지 않은 토큰 |
| `EXPIRED_TOKEN` | 401 | 만료된 토큰 |
| `INVALID_REFRESH_TOKEN` | 401 | 리프레시 토큰 불일치 |
| `DUPLICATE_EMAIL` | 409 | 이메일 중복 |
| `CANNOT_DELETE_SELF` | 400 | 본인 비활성화 불가 |
| `ACCESS_DENIED` | 403 | 권한 없음 |

### 상품
| 코드 | HTTP | 설명 |
|------|------|------|
| `PRODUCT_NOT_FOUND` | 404 | 상품 없음 |
| `DUPLICATE_SKU` | 409 | SKU 중복 |
| `DUPLICATE_SKU_CODE` | 409 | SKU 코드 중복 |
| `INVALID_OPTION_VALUE` | 400 | 옵션값 불일치 |
| `SKU_REQUIRED` | 400 | 옵션 상품은 SKU 필수 |

### 브랜드
| 코드 | HTTP | 설명 |
|------|------|------|
| `BRAND_NOT_FOUND` | 404 | 브랜드 없음 |
| `DUPLICATE_BRAND_NAME` | 409 | 브랜드명 중복 |
| `BRAND_HAS_PRODUCTS` | 400 | 상품 존재하여 삭제 불가 |

### 카테고리
| 코드 | HTTP | 설명 |
|------|------|------|
| `CATEGORY_NOT_FOUND` | 404 | 카테고리 없음 |
| `CATEGORY_INVALID_DEPTH` | 400 | 유효하지 않은 depth |
| `CATEGORY_PARENT_REQUIRED` | 400 | 하위 카테고리는 부모 필수 |
| `CATEGORY_DUPLICATE_NAME` | 409 | 동일 레벨 이름 중복 |
| `CATEGORY_HAS_PRODUCTS` | 400 | 상품 존재하여 삭제 불가 |
| `CATEGORY_TENANT_REQUIRED` | 400 | 대분류는 테넌트 필수 |

### 테넌트
| 코드 | HTTP | 설명 |
|------|------|------|
| `TENANT_NOT_FOUND` | 404 | 테넌트 없음 |
| `DUPLICATE_TENANT_CODE` | 409 | 코드 중복 |
| `DUPLICATE_TENANT_NAME` | 409 | 이름 중복 |
| `TENANT_HAS_CATEGORIES` | 400 | 카테고리 존재하여 삭제 불가 |

### S3
| 코드 | HTTP | 설명 |
|------|------|------|
| `S3_UPLOAD_FAILED` | 500 | 이미지 업로드 실패 |
| `S3_DELETE_FAILED` | 500 | 이미지 삭제 실패 |

---

## 6. 불일치 수정 현황

### 수정 완료

| # | 위치 | 문제 | 해결 |
|---|------|------|------|
| 1 | **FE 경로** | `/admin/sites` → BE `/admin/tenants` | siteService.ts 경로를 `/admin/tenants`로 변경 |
| 2 | **Category 타입** | `siteId/siteName` → BE `tenantId/tenantName` | 타입/컴포넌트 전체 변경 |
| 3 | **ProductSku 응답** | FE `sku` → BE `skuCode` | 타입 필드명 `skuCode`로 변경 |
| 4 | **ProductSku 응답** | FE `Record<string,string>` → BE `string[]` | 타입을 `string[]`로 변경, 컴포넌트에서 Record 변환 |
| 5 | **PaginatedResponse** | `total_elements` | BE가 `@JsonProperty("total_elements")`로 snake_case 응답 — FE 원본이 정확, 변경 불필요 |
| 6 | **CategoryUpdateNode** | 트리(children) → flat(parentId) | toUpdateNodes를 flat list 반환으로 변경 |
| 7 | **CategoryFormData** | `siteId` → `tenantId` | 타입 + CategoryFormDialog 변경 |
| 8 | **ProductOptionInput** | values에 `extraPrice`, `sortOrder` 누락 | 타입에 추가, ProductForm에서 sortOrder 전송 |
| 9 | **ProductSku 응답** | `isActive` 누락 | 타입에 `isActive` 추가 |
| 10 | **AdminUpdateData** | `isActive` BE 미지원 | 제거 + Switch UI 제거 (비활성화는 DELETE) |
| 12 | **ProductSku 응답** | `extraPrice` BE 미지원 | 타입에서 제거, 상세 페이지 컬럼 제거 |

### 미수정 (향후 필요 시)

| # | 위치 | 문제 | 비고 |
|---|------|------|------|
| 11 | **Site/Tenant 타입** | BE TenantResponse에 사업자 정보 등 다수 필드 존재 | FE Site 타입 확장은 사이트 상세 페이지 개발 시 진행 |

---

## 7. 백엔드 엔티티 구조 (DB 스키마)

### 핵심 엔티티 관계

```
Tenant (1) ──── (*) Category (self-ref: parent/children, max depth 2)
   │                    │
   └──── (*) Brand      └──── (*) Product
                                    │
                                    ├── (*) ProductImage
                                    ├── (*) ProductOption ── (*) ProductOptionValue
                                    └── (*) ProductSku ── (*) ProductSkuOption ── ProductOptionValue
```

### Product 옵션/SKU 구조
```
Product (hasOption=true)
  ├── Option: "색상" (sortOrder: 0)
  │     ├── Value: "블랙" (extraPrice: 0)
  │     └── Value: "화이트" (extraPrice: 0)
  ├── Option: "사이즈" (sortOrder: 1)
  │     ├── Value: "M" (extraPrice: 0)
  │     └── Value: "L" (extraPrice: 2000)
  └── SKU 목록:
        ├── SKU: "PRD-BK-M" (stock: 10, optionValues: ["블랙", "M"])
        ├── SKU: "PRD-BK-L" (stock: 5, optionValues: ["블랙", "L"])
        ├── SKU: "PRD-WH-M" (stock: 8, optionValues: ["화이트", "M"])
        └── SKU: "PRD-WH-L" (stock: 3, optionValues: ["화이트", "L"])
```

### Tenant 엔티티 주요 필드
```
Tenant
  ├── 기본: code, name, nameEn
  ├── 사업자: businessNumber, ceoName, businessName, businessType, businessCategory
  ├── 연락처: email, phone, address, addressDetail, zipCode
  ├── 브랜딩: logoUrl, faviconUrl, copyrightText
  ├── CS: csPhone, csFax, csEmail, csHours
  ├── 개인정보: privacyOfficer, privacyEmail, ecommerceLicense
  ├── 설정: themeConfig(JSON), seoConfig(JSON)
  ├── 플랜: planType, planExpiredAt
  └── 상태: isActive, createdAt, updatedAt, deletedAt
```

---

## 8. 백엔드 인프라

| 항목 | 값 |
|------|---|
| Framework | Spring Boot 3.x |
| Java | 17+ |
| DB | MySQL (port 3314, db: mirep) |
| ORM | JPA/Hibernate (ddl-auto: validate) |
| 마이그레이션 | Flyway |
| 캐시/토큰 | Redis (port 6383) |
| 파일저장 | AWS S3 + CloudFront |
| 비밀번호 | BCrypt |
| 세션 | Stateless (JWT) |
| Access Token TTL | 30분 |
| Refresh Token TTL | 7일 |
| API 문서 | Swagger (`/swagger-ui/`) |
| Dev 서버 포트 | 8080 |

---

## 9. 참고: BE에만 존재하는 Entity (Controller 미구현)

아래 엔티티는 DB 테이블과 JPA Entity만 존재하고, Controller/Service가 없어 API로 접근할 수 없음.
Mall 백엔드 개발 시 이 엔티티들을 기반으로 Controller를 구현해야 함.

- `Banner`
- `Coupon`
- `Faq`, `FaqCategory`
- `Notice`
- `Order`, `OrderItem`
- `Payment`
- `Policy`
- `Popup`
- `Promotion`
- `Review`
- `Shipping`
- `User`, `UserGrade`
