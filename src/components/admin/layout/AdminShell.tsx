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
      <div className="page-canvas min-h-screen">
        <AdminSidebar />

        <div className="min-h-screen lg:pl-[250px]">
          <AdminHeader />

          <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-[1600px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}