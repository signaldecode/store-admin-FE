export interface Category {
  id: number;
  siteId: number | null;
  siteName: string | null;
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
  siteId: number | null;
  siteName: string | null;
  parentId: number | null;
  depth: number;
}

/** PUT /admin/categories 요청용 트리 노드 */
export interface CategoryUpdateNode {
  id: number;
  siteId: number;
  siteName: string;
  name: string;
  depth: number;
  sortOrder: number;
  children: CategoryUpdateNode[];
}