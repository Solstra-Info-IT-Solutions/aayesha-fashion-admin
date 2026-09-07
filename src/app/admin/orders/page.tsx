import { EmptyState } from "@/components/admin/dashboard/EmptyState";

export default function OrdersPage() {
  return (
    <EmptyState
      title="Orders"
      message="Order management is being connected to the existing admin order APIs."
    />
  );
}