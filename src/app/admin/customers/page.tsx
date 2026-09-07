import { EmptyState } from "@/components/admin/dashboard/EmptyState";

export default function CustomersPage() {
  return (
    <EmptyState
      title="Customers"
      message="Customer management will be connected to the existing admin customer APIs."
    />
  );
}