"use client";

import { SmartBackLink } from "@/components/navigation/smart-back-link";
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
  ok: { label: "Ready", tone: "bg-[#1a2419] text-[#8fb08a]", icon: CheckCircle2 },
  warning: { label: "Ready (note)", tone: "bg-[#2b2216] text-[#e0b56a]", icon: AlertTriangle },
  error: { label: "Error", tone: "bg-[#2b1a18] text-[#e08b84]", icon: XCircle },
  skipped: { label: "Skipped", tone: "bg-[#211e1b] text-[#cfc7bb]", icon: SkipForward },
  created: { label: "Created", tone: "bg-[#1a2419] text-[#8fb08a]", icon: CheckCircle2 },
  failed: { label: "Failed", tone: "bg-[#2b1a18] text-[#e08b84]", icon: XCircle },
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
      <div className="border-b border-[#2e2a26] pb-6">
        <SmartBackLink href="/admin/products" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#f8f3f1] hover:underline">
          <ArrowLeft size={14} /> Back to products
        </SmartBackLink>

        <h1 className="mt-3 text-[#f8f3f1]">Import products from CSV</h1>

        <p className="mt-2 max-w-2xl text-sm text-[#cfc7bb]">
          Upload a spreadsheet saved as CSV and the product list is created automatically. You will see a
          preview first; nothing is created until you confirm. Existing products (same ID or slug) are skipped,
          never overwritten.
        </p>
      </div>

      <section className="surface grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9a9185]">Step 1</p>
          <h2 className="mt-1 text-lg font-bold text-[#f8f3f1]">Get the template</h2>

          <p className="mt-2 text-sm leading-6 text-[#cfc7bb]">
            Required columns: <strong>name, category, selling_price, stock</strong>. Category can be the
            category name, slug or ID. Put several images in <strong>image_urls</strong> separated by{" "}
            <code>|</code>. Up to 500 products and 2&nbsp;MB per file.
          </p>

          <button
            type="button"
            onClick={() => accessToken && downloadImportTemplate(accessToken).catch((reason) => toast.error(reason.message))}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg border border-[#f8f3f1] bg-[#1a1816] px-4 text-sm font-semibold text-[#f8f3f1] hover:bg-[#2a241b]"
          >
            <Download size={15} /> Download template
          </button>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9a9185]">Step 2</p>
          <h2 className="mt-1 text-lg font-bold text-[#f8f3f1]">Upload your file</h2>

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
              dragging ? "border-[#f8f3f1] bg-[#2a241b]" : "border-[#3a352f] bg-[#111111]"
            }`}
          >
            {busy === "preview" ? (
              <Loader2 className="animate-spin text-[#f8f3f1]" size={28} />
            ) : (
              <UploadCloud className="text-[#f8f3f1]" size={28} />
            )}

            <p className="mt-2 text-sm font-semibold text-[#f8f3f1]">
              {file ? file.name : "Drag a CSV here"}
            </p>

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy !== null}
              className="mt-3 inline-flex h-9 items-center gap-2 rounded-lg bg-[#b79a6a] px-4 text-sm font-semibold text-[#111111] hover:bg-[#c8ad7f] disabled:opacity-60"
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
        <div role="alert" className="rounded-lg border border-[#5a2a27] bg-[#2b1a18] px-4 py-3 text-sm text-[#f0a39d]">
          {error}
        </div>
      ) : null}

      {report ? (
        <section className="surface p-5 sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9a9185]">
            {finished ? "Result" : "Step 3 · Preview"}
          </p>

          <h2 className="mt-1 text-lg font-bold text-[#f8f3f1]">
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
              <div key={key} className="rounded-xl border border-[#2e2a26] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#cfc7bb]">{label}</p>
                <p className="mt-1 text-2xl font-bold text-[#f8f3f1]">{report.counts[key]}</p>
              </div>
            ))}
          </div>

          {report.unknownColumns.length > 0 ? (
            <p className="mt-4 rounded-lg border border-[#5a4420] bg-[#2b2216] px-3 py-2 text-xs text-[#e0b56a]">
              Ignored columns: {report.unknownColumns.join(", ")}
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-[#f8f3f1]">
              <input type="checkbox" checked={onlyIssues} onChange={(event) => setOnlyIssues(event.target.checked)} />
              Show only rows that need attention
            </label>

            {finished ? (
              <Link
                href="/admin/products"
                className="inline-flex h-10 items-center rounded-lg bg-[#b79a6a] px-5 text-sm font-semibold text-[#111111] hover:bg-[#c8ad7f]"
              >
                View product list
              </Link>
            ) : (
              <button
                type="button"
                onClick={runImport}
                disabled={importable === 0 || busy !== null}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#b79a6a] px-5 text-sm font-semibold text-[#111111] hover:bg-[#c8ad7f] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy === "import" ? <Loader2 size={15} className="animate-spin" /> : null}
                Import {importable} product{importable === 1 ? "" : "s"}
              </button>
            )}
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border border-[#2e2a26]">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-[#111111] text-xs uppercase tracking-wide text-[#cfc7bb]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Line</th>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 text-right font-semibold">Price</th>
                  <th className="px-4 py-3 text-right font-semibold">Stock</th>
                  <th className="px-4 py-3 font-semibold">Result</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#2e2a26]">
                {rows.map((row) => {
                  const meta = STATE[row.state];
                  const Icon = meta.icon;

                  return (
                    <tr key={row.line} className="align-top">
                      <td className="px-4 py-3 text-[#cfc7bb]">{row.line}</td>
                      <td className="px-4 py-3 font-medium text-[#f8f3f1]">{row.name || <em className="text-[#9a9185]">(no name)</em>}</td>
                      <td className="px-4 py-3 text-[#cfc7bb]">{row.categoryName ?? "—"}</td>
                      <td className="px-4 py-3 text-right">{money(row.sellingPrice)}</td>
                      <td className="px-4 py-3 text-right">{row.stock ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.tone}`}>
                          <Icon size={13} /> {meta.label}
                        </span>

                        {row.messages.map((message) => (
                          <p key={message} className="mt-1.5 max-w-md text-xs leading-5 text-[#cfc7bb]">
                            {message}
                          </p>
                        ))}
                      </td>
                    </tr>
                  );
                })}

                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-[#9a9185]">
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
