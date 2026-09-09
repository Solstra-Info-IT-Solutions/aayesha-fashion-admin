import ProductEditor from "@/components/admin/products/ProductEditor";

interface ProductEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductEditPage({
  params,
}: ProductEditPageProps) {
  const {
    id,
  } = await params;

  return (
    <ProductEditor
      productId={id}
    />
  );
}