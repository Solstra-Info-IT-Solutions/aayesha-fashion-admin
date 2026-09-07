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
  } = useAdminAuth();

  return (
    <AdminGuard>
      <main className="min-h-screen bg-[#fcfbf9] p-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.2em] text-[#969696]">
            Aayesha Fashion Admin
          </p>

          <h1 className="mt-2 font-serif text-5xl text-[#171717]">
            Dashboard
          </h1>

          <div className="mt-8 border border-[#e7e2dd] bg-white p-6">
            <p className="text-sm text-[#6f706f]">
              Signed in as
            </p>

            <p className="mt-1 text-lg font-medium text-[#171717]">
              {user?.name ||
                user?.email}
            </p>

            {user?.adminRole && (
              <p className="mt-2 text-xs uppercase tracking-[0.15em] text-[#969696]">
                {user.adminRole}
              </p>
            )}
          </div>
        </div>
      </main>
    </AdminGuard>
  );
}