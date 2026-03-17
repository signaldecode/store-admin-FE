export interface Brand {
  id: number;
  name: string;
  description: string;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BrandFormData {
  name: string;
  description: string;
  logoUrl: string | null;
}

export interface BrandListParams {
  sort?: string;
  order?: "asc" | "desc";
}
