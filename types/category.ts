export interface Category {
  id: number;
  tenantId: number | null;
  tenantName: string | null;
  name: string;
  depth: number;
  sortOrder: number;
  children?: Category[];
  parentId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  tenantId: number | null;
  parentId: number | null;
  depth: number;
}

/** PUT /admin/categories 요청용 flat 노드 (BE는 flat list + parentId) */
export interface CategoryUpdateNode {
  id: number;
  tenantId: number;
  name: string;
  sortOrder: number;
  parentId: number | null;
}