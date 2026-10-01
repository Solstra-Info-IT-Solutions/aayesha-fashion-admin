import type { ReactNode } from "react";

import { NavigationTracker } from "@/components/navigation/navigation-tracker";
import { AdminShell } from "@/components/admin/layout/AdminShell";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AdminShell>
      <NavigationTracker />
      {children}
    </AdminShell>
  );
}