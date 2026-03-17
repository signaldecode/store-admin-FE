/**
 * 개발용 Mock API
 * - api.ts에서 개발 모드일 때 실제 fetch 대신 이 핸들러를 사용
 * - 데이터는 메모리에서 관리 (새로고침 시 초기화)
 */
import {
  mockBrands,
  mockCategories,
  mockProducts,
  mockAdmins,
} from "./mock-data";
import type { Brand } from "@/types/brand";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import type { Admin } from "@/types/admin";

// 메모리 DB (뮤터블)
let brands: Brand[] = [...mockBrands];
let categories: Category[] = [...mockCategories];
let products: Product[] = [...mockProducts];
let admins: Admin[] = [...mockAdmins];
let nextId = 100;

const getId = () => ++nextId;
const now = () => new Date().toISOString();
const delay = () => new Promise((r) => setTimeout(r, 200));

function ok<T>(data: T) {
  return { success: true, data };
}

function paginated<T>(
  items: T[],
  page: number,
  size: number
) {
  const start = (page - 1) * size;
  const data = items.slice(start, start + size);
  return {
    success: true,
    data,
    pagination: {
      page,
      size,
      totalCount: items.length,
      totalPages: Math.ceil(items.length / size),
    },
  };
}

type MockHandler = (
  method: string,
  endpoint: string,
  body?: unknown
) => Promise<unknown> | unknown;

export const mockHandler: MockHandler = async (method, endpoint, body) => {
  await delay();

  // --- Auth ---
  if (endpoint === "/auth/me") {
    return ok(admins[0]);
  }
  if (endpoint === "/auth/login") {
    return ok(admins[0]);
  }
  if (endpoint === "/auth/logout") {
    return undefined;
  }

  // --- Brands ---
  if (endpoint.startsWith("/brands") && !endpoint.match(/^\/brands\/\d+/) && method === "GET") {
    const url = new URL(`http://x${endpoint}`);
    const sort = url.searchParams.get("sort") || "createdAt";
    const order = url.searchParams.get("order") || "desc";

    const sorted = [...brands].sort((a, b) => {
      const aVal = a[sort as keyof Brand];
      const bVal = b[sort as keyof Brand];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return order === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return 0;
    });

    return ok(sorted);
  }
  if (endpoint.match(/^\/brands\/\d+$/) && method === "GET") {
    const id = Number(endpoint.split("/")[2]);
    const brand = brands.find((b) => b.id === id);
    return brand ? ok(brand) : ok(null);
  }
  if (endpoint === "/brands" && method === "POST") {
    const data = body as { name: string };
    const brand: Brand = {
      id: getId(),
      name: data.name,
      createdAt: now(),
      updatedAt: now(),
    };
    brands.push(brand);
    return ok(brand);
  }
  if (endpoint.match(/^\/brands\/\d+$/) && method === "PUT") {
    const id = Number(endpoint.split("/")[2]);
    const data = body as { name: string };
    brands = brands.map((b) =>
      b.id === id ? { ...b, name: data.name, updatedAt: now() } : b
    );
    return ok(brands.find((b) => b.id === id));
  }
  if (endpoint.match(/^\/brands\/\d+$/) && method === "DELETE") {
    const id = Number(endpoint.split("/")[2]);
    brands = brands.filter((b) => b.id !== id);
    return undefined;
  }

  // --- Categories ---
  if (endpoint === "/categories" && method === "GET") {
    return ok(categories);
  }
  if (endpoint.match(/^\/categories\/\d+$/) && method === "GET") {
    const id = Number(endpoint.split("/")[2]);
    return ok(categories.find((c) => c.id === id));
  }
  if (endpoint === "/categories" && method === "POST") {
    const data = body as { name: string; parentId: number | null };
    const parentCat = data.parentId ? categories.find((c) => c.id === data.parentId) : null;
    const cat: Category = {
      id: getId(),
      name: data.name,
      parentId: data.parentId,
      level: parentCat ? parentCat.level + 1 : 1,
      sortOrder: categories.filter((c) => c.parentId === data.parentId).length,
      createdAt: now(),
      updatedAt: now(),
    };
    categories.push(cat);
    return ok(cat);
  }
  if (endpoint.match(/^\/categories\/\d+$/) && method === "PUT") {
    const id = Number(endpoint.split("/")[2]);
    const data = body as { name: string; parentId: number | null };
    categories = categories.map((c) =>
      c.id === id
        ? { ...c, name: data.name, parentId: data.parentId, updatedAt: now() }
        : c
    );
    return ok(categories.find((c) => c.id === id));
  }
  if (endpoint.match(/^\/categories\/\d+$/) && method === "DELETE") {
    const id = Number(endpoint.split("/")[2]);
    categories = categories.filter((c) => c.id !== id && c.parentId !== id);
    return undefined;
  }
  if (endpoint === "/categories/order" && method === "PUT") {
    const data = body as { orderedIds: number[] };
    data.orderedIds.forEach((id, idx) => {
      categories = categories.map((c) =>
        c.id === id ? { ...c, sortOrder: idx } : c
      );
    });
    return undefined;
  }

  // --- Products ---
  if (endpoint.startsWith("/products") && method === "GET") {
    // 단일 상품
    const singleMatch = endpoint.match(/^\/products\/(\d+)$/);
    if (singleMatch) {
      const id = Number(singleMatch[1]);
      return ok(products.find((p) => p.id === id));
    }

    // 목록 (쿼리 파라미터 파싱)
    const url = new URL(`http://x${endpoint}`);
    const page = Number(url.searchParams.get("page") || "1");
    const size = Number(url.searchParams.get("size") || "20");
    const keyword = url.searchParams.get("keyword") || "";
    const status = url.searchParams.get("status") || "";
    const mainCategoryId = url.searchParams.get("mainCategoryId") || "";
    const subCategoryId = url.searchParams.get("subCategoryId") || "";
    const detailCategoryId = url.searchParams.get("detailCategoryId") || "";
    const brandId = url.searchParams.get("brandId") || "";
    const sort = url.searchParams.get("sort") || "createdAt";
    const order = url.searchParams.get("order") || "desc";

    let filtered = [...products];

    if (keyword) {
      const kw = keyword.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(kw));
    }
    if (status) {
      filtered = filtered.filter((p) => p.status === status);
    }
    if (mainCategoryId) {
      filtered = filtered.filter((p) => p.mainCategoryId === Number(mainCategoryId));
    }
    if (subCategoryId) {
      filtered = filtered.filter((p) => p.subCategoryId === Number(subCategoryId));
    }
    if (detailCategoryId) {
      filtered = filtered.filter((p) => p.detailCategoryId === Number(detailCategoryId));
    }
    if (brandId) {
      filtered = filtered.filter((p) => p.brandId === Number(brandId));
    }

    // 정렬
    filtered.sort((a, b) => {
      const aVal = a[sort as keyof Product];
      const bVal = b[sort as keyof Product];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return order === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return order === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

    return paginated(filtered, page, size);
  }
  if (endpoint === "/products" && method === "POST") {
    const product: Product = {
      id: getId(),
      name: "새 상품",
      description: "",
      price: 0,
      stock: 0,
      marginPrice1: null,
      marginPrice2: null,
      status: "SALE",
      mainCategoryId: 1,
      mainCategoryName: "의류",
      subCategoryId: 2,
      subCategoryName: "상의",
      detailCategoryId: null,
      detailCategoryName: undefined,
      brandId: null,
      brandName: undefined,
      images: [],
      options: [],
      variants: [],
      createdAt: now(),
      updatedAt: now(),
    };
    products.push(product);
    return ok(product);
  }
  if (endpoint.match(/^\/products\/\d+$/) && method === "PUT") {
    const id = Number(endpoint.split("/")[2]);
    products = products.map((p) =>
      p.id === id ? { ...p, updatedAt: now() } : p
    );
    return ok(products.find((p) => p.id === id));
  }
  if (endpoint.match(/^\/products\/\d+$/) && method === "DELETE") {
    const id = Number(endpoint.split("/")[2]);
    products = products.filter((p) => p.id !== id);
    return undefined;
  }

  // --- Admins ---
  if (endpoint === "/admins" && method === "GET") {
    return ok(admins);
  }
  if (endpoint.match(/^\/admins\/\d+$/) && method === "GET") {
    const id = Number(endpoint.split("/")[2]);
    return ok(admins.find((a) => a.id === id));
  }
  if (endpoint === "/admins" && method === "POST") {
    const data = body as { email: string; name: string; role: string };
    const admin: Admin = {
      id: getId(),
      email: data.email,
      name: data.name,
      role: data.role as Admin["role"],
      createdAt: now(),
      updatedAt: now(),
    };
    admins.push(admin);
    return ok(admin);
  }
  if (endpoint.match(/^\/admins\/\d+$/) && method === "PUT") {
    const id = Number(endpoint.split("/")[2]);
    const data = body as { email: string; name: string; role: string };
    admins = admins.map((a) =>
      a.id === id
        ? { ...a, email: data.email, name: data.name, role: data.role as Admin["role"], updatedAt: now() }
        : a
    );
    return ok(admins.find((a) => a.id === id));
  }
  if (endpoint.match(/^\/admins\/\d+$/) && method === "DELETE") {
    const id = Number(endpoint.split("/")[2]);
    admins = admins.filter((a) => a.id !== id);
    return undefined;
  }

  console.warn(`[Mock API] Unhandled: ${method} ${endpoint}`);
  return ok(null);
};
