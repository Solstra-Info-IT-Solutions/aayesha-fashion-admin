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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

export async function uploadImage(
  accessToken: string,
  file: File,
): Promise<UploadImageResponse> {
  const formData = new FormData();

  formData.append("image", file);

  const response = await fetch(
    `${API_BASE_URL}/admin/uploads`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    },
  );

  let result: UploadApiResponse;

  try {
    result =
      (await response.json()) as UploadApiResponse;
  } catch {
    throw new Error(
      "Invalid response received from upload server.",
    );
  }

  if (!response.ok || !result.success) {
    throw new Error(
      result.error?.message ||
        "Failed to upload image.",
    );
  }

  return result.data;
}