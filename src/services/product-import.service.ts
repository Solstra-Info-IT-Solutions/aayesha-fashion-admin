import { API_BASE_URL, apiFetch } from "@/lib/api";

export type ImportState = "ok" | "warning" | "error" | "skipped" | "created" | "failed";

export type ImportRow = {
  line: number;
  name: string;
  state: ImportState;
  messages: string[];
  categoryName?: string;
  sellingPrice?: number;
  stock?: number;
  status?: string;
  images?: number;
};

export type ImportReport = {
  dryRun: boolean;
  totalRows: number;
  limit: number;
  counts: Record<ImportState, number>;
  unknownColumns: string[];
  rows: ImportRow[];
};

type ApiResponse<T> = { success: boolean; data: T; error?: { message?: string } };

/** dryRun=true validates and previews; dryRun=false creates the products. */
export async function uploadProductCsv(
  accessToken: string,
  file: File,
  dryRun: boolean,
): Promise<ImportReport> {
  const form = new FormData();

  form.append("file", file);

  const response = await apiFetch<ApiResponse<ImportReport>>(
    `/admin/products/import?dryRun=${dryRun}`,
    { method: "POST", body: form, accessToken },
  );

  if (!response.success) {
    throw new Error(response.error?.message || "The import failed.");
  }

  return response.data;
}

export async function downloadImportTemplate(accessToken: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/products/import/template`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });

  if (!response.ok) throw new Error("Could not download the template.");

  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");

  link.href = url;
  link.download = "product-import-template.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
