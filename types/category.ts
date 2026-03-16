export interface Category {
  id: number;
  name: string;
  parentId: number | null;
  /** 1=대분류, 2=중분류, 3=소분류 */
  level: number;
  sortOrder: number;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  parentId: number | null;
}
