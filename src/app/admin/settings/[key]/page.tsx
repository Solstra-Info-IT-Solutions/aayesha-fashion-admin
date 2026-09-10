"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  getSetting,
  upsertSetting,
} from "@/services/settings.service";
import type { StoreSetting } from "@/types/settings";

import GeneralSettings from "@/components/admin/settings/GeneralSettings";
import SettingsFormHeader from "@/components/admin/settings/SettingsFormHeader";
import SettingsFormSkeleton from "@/components/admin/settings/SettingsFormSkeleton";

export default function EditSettingPage() {
  const router = useRouter();
  const params = useParams<{ key: string }>();
  const { accessToken } = useAdminAuth();

  const settingKey = decodeURIComponent(params.key);

  const [setting, setSetting] = useState<StoreSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [value, setValue] = useState<unknown>("");
  const [group, setGroup] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const [errors, setErrors] = useState<{
    group?: string;
    value?: string;
  }>({});

  const loadSetting = useCallback(async () => {
    if (!accessToken || !settingKey) return;

    try {
      setLoading(true);

      const data = await getSetting(accessToken, settingKey);

      setSetting(data);
      setValue(data.value);
      setGroup(data.group);
      setIsPublic(data.isPublic);
    } catch (error) {
      console.error("Failed to load setting:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load setting.",
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken, settingKey]);

  useEffect(() => {
    void loadSetting();
  }, [loadSetting]);

  const validate = () => {
    const nextErrors: typeof errors = {};

    const trimmedGroup = group.trim();

    if (!trimmedGroup) {
      nextErrors.group = "Setting group is required.";
    } else if (trimmedGroup.length > 80) {
      nextErrors.group = "Setting group cannot exceed 80 characters.";
    } else if (!/^[a-zA-Z0-9._-]+$/.test(trimmedGroup)) {
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
    if (!accessToken || !setting) {
      toast.error("Unable to update this setting.");
      return;
    }

    if (!validate()) {
      return;
    }

    try {
      setSaving(true);

      const updated = await upsertSetting(accessToken, {
        key: setting.key,
        value,
        group: group.trim(),
        isPublic,
      });

      setSetting(updated);
      setValue(updated.value);
      setGroup(updated.group);
      setIsPublic(updated.isPublic);

      toast.success("Setting updated successfully.");

      router.push("/admin/settings");
      router.refresh();
    } catch (error) {
      console.error("Failed to update setting:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update setting.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <SettingsFormHeader
          title="Edit Setting"
          description={
            setting
              ? `Update the configuration for "${setting.key}".`
              : "Update store configuration."
          }
        />

        {loading ? (
          <SettingsFormSkeleton />
        ) : !setting ? (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Setting not found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              The requested setting could not be loaded.
            </p>
          </div>
        ) : (
          <GeneralSettings
            settingKey={setting.key}
            value={value}
            group={group}
            isPublic={isPublic}
            onKeyChange={() => {
              // Setting keys are immutable during edit.
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
            keyError={undefined}
            valueError={errors.value}
            groupError={errors.group}
            isEdit
          />
        )}
      </main>
    </div>
  );
}