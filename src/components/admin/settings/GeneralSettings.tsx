"use client";

import SettingFormActions from "./SettingFormActions";
import SettingGroupField from "./SettingGroupField";
import SettingKeyField from "./SettingKeyField";
import SettingValueField from "./SettingValueField";
import SettingVisibilityToggle from "./SettingVisibilityToggle";

type GeneralSettingsProps = {
  settingKey: string;
  value: unknown;
  group: string;
  isPublic: boolean;

  onKeyChange: (value: string) => void;
  onValueChange: (value: unknown) => void;
  onGroupChange: (value: string) => void;
  onPublicChange: (value: boolean) => void;

  onSubmit: () => void;

  saving?: boolean;
  keyError?: string;
  valueError?: string;
  groupError?: string;
  disabled?: boolean;
  isEdit?: boolean;
};

export default function GeneralSettings({
  settingKey,
  value,
  group,
  isPublic,
  onKeyChange,
  onValueChange,
  onGroupChange,
  onPublicChange,
  onSubmit,
  saving = false,
  keyError,
  valueError,
  groupError,
  disabled = false,
  isEdit = false,
}: GeneralSettingsProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="space-y-6"
    >
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-gray-900">
            {isEdit ? "Edit Setting" : "Create Setting"}
          </h2>

          <p className="mt-1 text-sm leading-6 text-gray-500">
            Configure the setting key, group, value and visibility.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SettingKeyField
            value={settingKey}
            onChange={onKeyChange}
            disabled={disabled || isEdit}
            error={keyError}
          />

          <SettingGroupField
            value={group}
            onChange={onGroupChange}
            error={groupError}
          />
        </div>

        <div className="mt-6">
          <SettingValueField
            value={value}
            onChange={onValueChange}
            error={valueError}
          />
        </div>

        <div className="mt-6">
          <SettingVisibilityToggle
            checked={isPublic}
            onChange={onPublicChange}
            disabled={disabled}
          />
        </div>

        <div className="mt-6">
          <SettingFormActions
            saving={saving}
            disabled={disabled}
            saveLabel={isEdit ? "Update Setting" : "Create Setting"}
          />
        </div>
      </div>
    </form>
  );
}