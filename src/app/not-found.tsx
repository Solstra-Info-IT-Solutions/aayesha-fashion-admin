import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#111111] px-6 text-center text-[#f8f3f1]">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d9c7a3]">
        Error 404
      </p>

      <h1 className="font-serif text-4xl">This page could not be found</h1>

      <Link
        href="/admin"
        className="rounded-lg bg-[#b79a6a] px-5 py-2.5 text-sm font-medium text-[#111111] hover:bg-[#c8ad7f]"
      >
        Back to the dashboard
      </Link>
    </main>
  );
}
