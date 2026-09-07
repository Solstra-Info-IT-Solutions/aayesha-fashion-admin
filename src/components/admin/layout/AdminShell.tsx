"use client";

import type { ReactNode } from "react";

import { AdminGuard } from "@/components/auth/AdminGuard";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({
  children,
}: AdminShellProps) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#fcfbf9]">
        <AdminSidebar />

        <div className="min-h-screen lg:pl-[250px]">
          <AdminHeader />

          <main className="px-5 py-6 sm:px-7 lg:px-8">
            <div className="mx-auto max-w-[1600px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}