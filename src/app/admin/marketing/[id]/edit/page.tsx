import MarketingCampaignForm from "@/components/admin/marketing/MarketingCampaignForm";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditMarketingCampaignPage({
  params,
}: PageProps) {
  const { id } = await params;

  return (
    <MarketingCampaignForm
      mode="edit"
      campaignId={id}
    />
  );
}