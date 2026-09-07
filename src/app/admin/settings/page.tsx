import { EmptyState } from "@/components/admin/dashboard/EmptyState";

export default function SettingsPage() {
  return (
    <EmptyState
      title="Settings"
      message="Store settings, admin users, roles and configuration will use the existing settings APIs."
    />
  );
}