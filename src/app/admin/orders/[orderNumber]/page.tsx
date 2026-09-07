import { OrderDetailsPage } from "@/components/admin/orders/OrderDetailsPage";

type OrderDetailsRoutePageProps = {
  params: Promise<{
    orderNumber: string;
  }>;
};

export default async function Page({
  params,
}: OrderDetailsRoutePageProps) {
  const { orderNumber } = await params;

  return <OrderDetailsPage orderNumber={orderNumber} />;
}