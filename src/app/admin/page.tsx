"use client";

import { AdminDashboard } from "@/components/admin/dashboard/DashboardHeader";
import { useDashboard } from "@/hooks/useDashboard";

export default function AdminDashboardPage() {
  const dashboard = useDashboard();

  return (
    <AdminDashboard
      {...dashboard}
    />
  );
}