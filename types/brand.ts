export interface Brand {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandFormData {
  name: string;
}

export interface BrandListParams {
  sort?: string;
  order?: "asc" | "desc";
}
