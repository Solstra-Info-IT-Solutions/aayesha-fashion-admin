import ProductVariantsPage from "@/components/admin/products/variants/ProductVariantsPage";

interface ProductVariantsRouteProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ProductVariantsRoute({
  params,
}: ProductVariantsRouteProps) {
  const {
    productId,
  } = await params;

  return (
    <ProductVariantsPage
      productId={productId}
    />
  );
}