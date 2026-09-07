import { EmptyState } from "@/components/admin/dashboard/EmptyState";

export default function ProductsPage() {
  return (
    <EmptyState
      title="Products"
      message="Product management will use the existing product, variant, media and SEO APIs."
    />
  );
}