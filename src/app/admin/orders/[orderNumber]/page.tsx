import {
  OrderDetailsPage,
} from "@/components/admin/orders/OrderDetailsPage";

type PageProps = {
  params: Promise<{
    orderNumber: string;
  }>;
};

export default async function OrderDetailsRoute({
  params,
}: PageProps) {
  const {
    orderNumber,
  } = await params;

  return (
    <OrderDetailsPage
      orderNumber={decodeURIComponent(
        orderNumber,
      )}
    />
  );
}