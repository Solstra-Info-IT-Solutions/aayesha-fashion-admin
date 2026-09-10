"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import { upsertSetting } from "@/services/settings.service";

import GeneralSettings from "@/components/admin/settings/GeneralSettings";
import SettingsFormHeader from "@/components/admin/settings/SettingsFormHeader";

const KEY_REGEX = /^[a-zA-Z0-9._-]+$/;

export default function CreateSettingPage() {
  const router = useRouter();
  const { accessToken } = useAdminAuth();

  const [settingKey, setSettingKey] = useState("");
  const [value, setValue] = useState<unknown>("");
  const [group, setGroup] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{
    key?: string;
    group?: string;
    value?: string;
  }>({});

  const validate = () => {
    const nextErrors: typeof errors = {};

    const trimmedKey = settingKey.trim();
    const trimmedGroup = group.trim();

    if (!trimmedKey) {
      nextErrors.key = "Setting key is required.";
    } else if (trimmedKey.length > 150) {
      nextErrors.key = "Setting key cannot exceed 150 characters.";
    } else if (!KEY_REGEX.test(trimmedKey)) {
      nextErrors.key =
        "Only letters, numbers, dots, underscores and hyphens are allowed.";
    }

    if (!trimmedGroup) {
      nextErrors.group = "Setting group is required.";
    } else if (trimmedGroup.length > 80) {
      nextErrors.group = "Setting group cannot exceed 80 characters.";
    } else if (!KEY_REGEX.test(trimmedGroup)) {
      nextErrors.group =
        "Only letters, numbers, dots, underscores and hyphens are allowed.";
    }

    if (value === undefined) {
      nextErrors.value = "Setting value is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!accessToken) {
      toast.error("Authentication session is not available.");
      return;
    }

    if (!validate()) {
      return;
    }

    try {
      setSaving(true);

      await upsertSetting(accessToken, {
        key: settingKey.trim(),
        value,
        group: group.trim(),
        isPublic,
      });

      toast.success("Setting created successfully.");
      router.push("/admin/settings");
      router.refresh();
    } catch (error) {
      console.error("Failed to create setting:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create setting.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <SettingsFormHeader
          title="Create Setting"
          description="Create a new store configuration setting."
        />

        <GeneralSettings
          settingKey={settingKey}
          value={value}
          group={group}
          isPublic={isPublic}
          onKeyChange={(nextValue) => {
            setSettingKey(nextValue);
            if (errors.key) {
              setErrors((current) => ({
                ...current,
                key: undefined,
              }));
            }
          }}
          onValueChange={(nextValue) => {
            setValue(nextValue);
            if (errors.value) {
              setErrors((current) => ({
                ...current,
                value: undefined,
              }));
            }
          }}
          onGroupChange={(nextValue) => {
            setGroup(nextValue);
            if (errors.group) {
              setErrors((current) => ({
                ...current,
                group: undefined,
              }));
            }
          }}
          onPublicChange={setIsPublic}
          onSubmit={handleSubmit}
          saving={saving}
          keyError={errors.key}
          valueError={errors.value}
          groupError={errors.group}
        />
      </main>
    </div>
  );
}