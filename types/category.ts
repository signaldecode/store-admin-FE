export interface Category {
  id: number;
  tenantId: number | null;
  tenantName: string | null;
  siteUrl: string | null;
  name: string;
  depth: number;
  sortOrder: number;
  children?: Category[];
  parentId: number | null;
}

export interface CategoryFormData {
  name: string;
  siteUrl?: string;
  parentId: number | null;
  depth: number;
}

/** PUT /admin/categories 요청용 트리 노드 */
export interface CategoryUpdateNode {
  id: number;
  siteUrl?: string;
  name: string;
  depth: number;
  sortOrder: number;
  children: CategoryUpdateNode[];
}