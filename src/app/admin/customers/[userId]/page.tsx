import CustomerDetailsPage from "@/components/admin/customers/CustomerDetailsPage";

type PageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function Page({
  params,
}: PageProps) {
  const { userId } = await params;

  return (
    <CustomerDetailsPage
      userId={userId}
    />
  );
}