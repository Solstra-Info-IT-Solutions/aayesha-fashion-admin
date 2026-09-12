import { apiFetch } from "@/lib/api";

export interface UploadImageResponse {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

interface UploadApiResponse {
  success: boolean;
  data: UploadImageResponse;
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
}

export async function uploadImage(
  accessToken: string,
  file: File,
): Promise<UploadImageResponse> {
  const formData = new FormData();

  formData.append("image", file);

  const response =
    await apiFetch<UploadApiResponse>(
      "/admin/uploads",
      {
        method: "POST",
        accessToken,
        body: formData,
      },
    );

  if (!response.success) {
    throw new Error(
      response.error?.message ||
        "Failed to upload image.",
    );
  }

  return response.data;
}