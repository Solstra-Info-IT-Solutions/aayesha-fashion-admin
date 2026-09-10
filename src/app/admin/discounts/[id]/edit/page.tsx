import DiscountForm from "@/components/admin/discounts/DiscountForm";

type EditDiscountPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditDiscountPage({
  params,
}: EditDiscountPageProps) {
  const { id } = await params;

  return (
    <DiscountForm
      mode="edit"
      discountId={id}
    />
  );
}