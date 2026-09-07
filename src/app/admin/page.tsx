"use client";

import {
  AdminGuard,
} from "@/components/auth/AdminGuard";

import {
  useAdminAuth,
} from "@/hooks/useAdminAuth";

export default function AdminPage() {
  const {
    user,
    logout,
  } =
    useAdminAuth();

  return (
    <AdminGuard>
      <main className="min-h-screen bg-[#fcfbf9]">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#969696]">
                Aayesha Fashion
              </p>

              <h1 className="mt-2 font-serif text-5xl text-[#171717]">
                Dashboard
              </h1>

              <p className="mt-3 text-sm text-[#6f706f]">
                Welcome back,
                {" "}
                {user?.name ||
                  user?.email}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                void logout()
              }
              className="border border-[#d8d1ca] bg-white px-4 py-2 text-sm text-[#292c2c] transition hover:border-[#292c2c]"
            >
              Sign out
            </button>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Revenue",
              "Orders",
              "Customers",
              "Products",
            ].map((label) => (
              <div
                key={label}
                className="border border-[#e7e2dd] bg-white p-6"
              >
                <p className="text-xs uppercase tracking-[0.16em] text-[#969696]">
                  {label}
                </p>

                <p className="mt-3 font-serif text-3xl text-[#171717]">
                  —
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </AdminGuard>
  );
}