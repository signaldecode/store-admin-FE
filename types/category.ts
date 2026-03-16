export interface Category {
  id: number;
  name: string;
  parentId: number | null;
  sortOrder: number;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  parentId: number | null;
}
