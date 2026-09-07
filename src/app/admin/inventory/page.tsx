import { EmptyState } from "@/components/admin/dashboard/EmptyState";

export default function InventoryPage() {
  return (
    <EmptyState
      title="Inventory"
      message="Inventory operations will be connected to the existing stock, reservation and ledger APIs."
    />
  );
}