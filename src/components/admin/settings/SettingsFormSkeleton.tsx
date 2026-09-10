"use client";

export default function SettingsFormSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="space-y-3">
        <div className="h-4 w-28 rounded bg-gray-200" />
        <div className="h-4 w-72 rounded bg-gray-100" />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 space-y-3">
          <div className="h-5 w-36 rounded bg-gray-200" />
          <div className="h-4 w-80 rounded bg-gray-100" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="h-11 w-full rounded-xl bg-gray-100" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="h-11 w-full rounded-xl bg-gray-100" />
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="h-4 w-16 rounded bg-gray-200" />
          <div className="h-48 w-full rounded-xl bg-gray-100" />
        </div>

        <div className="mt-6 h-20 w-full rounded-xl bg-gray-100" />

        <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-5">
          <div className="h-11 w-24 rounded-xl bg-gray-100" />
          <div className="h-11 w-32 rounded-xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
}