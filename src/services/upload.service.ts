import { apiFetch } from "@/lib/api";

export type UploadResource =
  | "category"
  | "collection"
  | "product"
  | "homepage";

export type UploadFolder =
  | "images"
  | "banners"
  | "hero"
  | "campaigns"
  | "desktop"
  | "mobile";

export interface UploadImageOptions {
  resource: UploadResource;
  resourceId?: string;
  folder: UploadFolder;
}

export interface UploadImageResponse {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  folder?: string;
}

export interface ListedImage {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  createdAt?: string;
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

interface ListImagesApiResponse {
  success: boolean;
  data: {
    images: ListedImage[];
    folder: string;
  };
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
}

export async function uploadImage(
  accessToken: string,
  file: File,
  options: UploadImageOptions,
): Promise<UploadImageResponse> {
  const formData = new FormData();

  formData.append("image", file);
  formData.append(
    "resource",
    options.resource,
  );
  formData.append(
    "folder",
    options.folder,
  );

  if (options.resourceId) {
    formData.append(
      "resourceId",
      options.resourceId,
    );
  }

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

export async function listImages(
  accessToken: string,
  options: UploadImageOptions,
): Promise<ListedImage[]> {
  const params = new URLSearchParams();

  params.set(
    "resource",
    options.resource,
  );

  params.set(
    "folder",
    options.folder,
  );

  if (options.resourceId) {
    params.set(
      "resourceId",
      options.resourceId,
    );
  }

  const response =
    await apiFetch<ListImagesApiResponse>(
      `/admin/uploads?${params.toString()}`,
      {
        method: "GET",
        accessToken,
      },
    );

  if (!response.success) {
    throw new Error(
      response.error?.message ||
        "Failed to load images.",
    );
  }

  return response.data.images;
}