export interface Category {
  id: number;
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
  parentId: number;
  depth: number;
}

/** PUT /admin/categories 요청용 트리 노드 */
export interface CategoryUpdateNode {
  id: number;
  name: string;
  depth: number;
  sortOrder: number;
  children: CategoryUpdateNode[];
}
