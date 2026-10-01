"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Loader2,
  SkipForward,
  UploadCloud,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  downloadImportTemplate,
  uploadProductCsv,
  type ImportReport,
  type ImportRow,
  type ImportState,
} from "@/services/product-import.service";

const STATE: Record<ImportState, { label: string; tone: string; icon: typeof CheckCircle2 }> = {
  ok: { label: "Ready", tone: "bg-[#e8f5ec] text-[#276541]", icon: CheckCircle2 },
  warning: { label: "Ready (note)", tone: "bg-[#fdf3e1] text-[#7f4806]", icon: AlertTriangle },
  error: { label: "Error", tone: "bg-[#fdecec] text-[#b3261e]", icon: XCircle },
  skipped: { label: "Skipped", tone: "bg-[#efe8d8] text-[#5f584d]", icon: SkipForward },
  created: { label: "Created", tone: "bg-[#e8f5ec] text-[#276541]", icon: CheckCircle2 },
  failed: { label: "Failed", tone: "bg-[#fdecec] text-[#b3261e]", icon: XCircle },
};

const money = (value?: number) => (value === undefined ? "—" : `₹${value.toLocaleString("en-IN")}`);

export default function ProductImportPage() {
  const { accessToken } = useAdminAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [report, setReport] = useState<ImportReport | null>(null);
  const [busy, setBusy] = useState<"preview" | "import" | null>(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [onlyIssues, setOnlyIssues] = useState(false);

  const preview = useCallback(
    async (chosen: File) => {
      if (!accessToken) return;

      if (!/\.csv$/i.test(chosen.name) && chosen.type !== "text/csv") {
        setError("Please choose a .csv file. In Excel or Sheets use File → Save as → CSV.");
        return;
      }

      setFile(chosen);
      setReport(null);
      setError("");
      setBusy("preview");

      try {
        setReport(await uploadProductCsv(accessToken, chosen, true));
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : "The file could not be read.");
      } finally {
        setBusy(null);
      }
    },
    [accessToken],
  );

  async function runImport() {
    if (!accessToken || !file || busy) return;

    setBusy("import");
    setError("");

    try {
      const result = await uploadProductCsv(accessToken, file, false);

      setReport(result);
      toast.success(`${result.counts.created} product${result.counts.created === 1 ? "" : "s"} created.`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The import failed.");
    } finally {
      setBusy(null);
    }
  }

  const importable = report ? report.counts.ok + report.counts.warning : 0;
  const finished = Boolean(report && !report.dryRun);
  const rows: ImportRow[] = report ? (onlyIssues ? report.rows.filter((row) => !["ok", "created"].includes(row.state)) : report.rows) : [];

  return (
    <div className="space-y-6">
      <div className="border-b border-[#e6dfcf] pb-6">
        <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#26221d] hover:underline">
          <ArrowLeft size={14} /> Back to products
        </Link>

        <h1 className="mt-3 text-[#2a2520]">Import products from CSV</h1>

        <p className="mt-2 max-w-2xl text-sm text-[#5f584d]">
          Upload a spreadsheet saved as CSV and the product list is created automatically. You will see a
          preview first; nothing is created until you confirm. Existing products (same ID or slug) are skipped,
          never overwritten.
        </p>
      </div>

      <section className="surface grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#756d62]">Step 1</p>
          <h2 className="mt-1 text-lg font-bold text-[#2a2520]">Get the template</h2>

          <p className="mt-2 text-sm leading-6 text-[#5f584d]">
            Required columns: <strong>name, category, selling_price, stock</strong>. Category can be the
            category name, slug or ID. Put several images in <strong>image_urls</strong> separated by{" "}
            <code>|</code>. Up to 500 products and 2&nbsp;MB per file.
          </p>

          <button
            type="button"
            onClick={() => accessToken && downloadImportTemplate(accessToken).catch((reason) => toast.error(reason.message))}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg border border-[#26221d] bg-white px-4 text-sm font-semibold text-[#26221d] hover:bg-[#f1ead9]"
          >
            <Download size={15} /> Download template
          </button>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#756d62]">Step 2</p>
          <h2 className="mt-1 text-lg font-bold text-[#2a2520]">Upload your file</h2>

          <div
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);

              const dropped = event.dataTransfer.files[0];

              if (dropped) void preview(dropped);
            }}
            className={`mt-3 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
              dragging ? "border-[#26221d] bg-[#f1ead9]" : "border-[#d6ccb6] bg-[#f7f2e7]"
            }`}
          >
            {busy === "preview" ? (
              <Loader2 className="animate-spin text-[#26221d]" size={28} />
            ) : (
              <UploadCloud className="text-[#26221d]" size={28} />
            )}

            <p className="mt-2 text-sm font-semibold text-[#2a2520]">
              {file ? file.name : "Drag a CSV here"}
            </p>

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy !== null}
              className="mt-3 inline-flex h-9 items-center gap-2 rounded-lg bg-[#26221d] px-4 text-sm font-semibold text-white hover:bg-[#3d372f] disabled:opacity-60"
            >
              <FileSpreadsheet size={15} /> {file ? "Choose another file" : "Choose file"}
            </button>

            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(event) => {
                const chosen = event.target.files?.[0];

                if (chosen) void preview(chosen);

                event.target.value = "";
              }}
            />
          </div>
        </div>
      </section>

      {error ? (
        <div role="alert" className="rounded-lg border border-[#f5b5b1] bg-[#fdecec] px-4 py-3 text-sm text-[#8f1f19]">
          {error}
        </div>
      ) : null}

      {report ? (
        <section className="surface p-5 sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#756d62]">
            {finished ? "Result" : "Step 3 · Preview"}
          </p>

          <h2 className="mt-1 text-lg font-bold text-[#2a2520]">
            {finished
              ? `${report.counts.created} created, ${report.counts.skipped} skipped, ${report.counts.error + report.counts.failed} with problems`
              : `${importable} of ${report.totalRows} rows are ready to import`}
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(
              finished
                ? ([["created", "Created"], ["skipped", "Skipped"], ["error", "Errors"], ["failed", "Failed"]] as const)
                : ([["ok", "Ready"], ["warning", "Ready (note)"], ["skipped", "Skipped"], ["error", "Errors"]] as const)
            ).map(([key, label]) => (
              <div key={key} className="rounded-xl border border-[#e6dfcf] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#5f584d]">{label}</p>
                <p className="mt-1 text-2xl font-bold text-[#2a2520]">{report.counts[key]}</p>
              </div>
            ))}
          </div>

          {report.unknownColumns.length > 0 ? (
            <p className="mt-4 rounded-lg border border-[#f6d08a] bg-[#fdf3e1] px-3 py-2 text-xs text-[#7f4806]">
              Ignored columns: {report.unknownColumns.join(", ")}
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-[#2a2520]">
              <input type="checkbox" checked={onlyIssues} onChange={(event) => setOnlyIssues(event.target.checked)} />
              Show only rows that need attention
            </label>

            {finished ? (
              <Link
                href="/admin/products"
                className="inline-flex h-10 items-center rounded-lg bg-[#26221d] px-5 text-sm font-semibold text-white hover:bg-[#3d372f]"
              >
                View product list
              </Link>
            ) : (
              <button
                type="button"
                onClick={runImport}
                disabled={importable === 0 || busy !== null}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#26221d] px-5 text-sm font-semibold text-white hover:bg-[#3d372f] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy === "import" ? <Loader2 size={15} className="animate-spin" /> : null}
                Import {importable} product{importable === 1 ? "" : "s"}
              </button>
            )}
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border border-[#e6dfcf]">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-[#f7f2e7] text-xs uppercase tracking-wide text-[#5f584d]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Line</th>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 text-right font-semibold">Price</th>
                  <th className="px-4 py-3 text-right font-semibold">Stock</th>
                  <th className="px-4 py-3 font-semibold">Result</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#e6dfcf]">
                {rows.map((row) => {
                  const meta = STATE[row.state];
                  const Icon = meta.icon;

                  return (
                    <tr key={row.line} className="align-top">
                      <td className="px-4 py-3 text-[#5f584d]">{row.line}</td>
                      <td className="px-4 py-3 font-medium text-[#2a2520]">{row.name || <em className="text-[#756d62]">(no name)</em>}</td>
                      <td className="px-4 py-3 text-[#5f584d]">{row.categoryName ?? "—"}</td>
                      <td className="px-4 py-3 text-right">{money(row.sellingPrice)}</td>
                      <td className="px-4 py-3 text-right">{row.stock ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.tone}`}>
                          <Icon size={13} /> {meta.label}
                        </span>

                        {row.messages.map((message) => (
                          <p key={message} className="mt-1.5 max-w-md text-xs leading-5 text-[#5f584d]">
                            {message}
                          </p>
                        ))}
                      </td>
                    </tr>
                  );
                })}

                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-[#756d62]">
                      Nothing to show.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}
