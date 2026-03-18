import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";

/**
 * 에디터 이미지 업로드 (S3 → CloudFront URL 반환)
 * POST /api/v1/images  multipart/form-data { file: binary }
 */
export async function uploadEditorImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api<ApiResponse<string>>("/images", {
    method: "POST",
    body: formData,
  });

  return res.data;
}
