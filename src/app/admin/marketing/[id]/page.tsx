import MarketingCampaignDetail from "@/components/admin/marketing/MarketingCampaignDetail";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MarketingCampaignDetailPage({
  params,
}: PageProps) {
  const { id } = await params;

  return (
    <MarketingCampaignDetail id={id} />
  );
}