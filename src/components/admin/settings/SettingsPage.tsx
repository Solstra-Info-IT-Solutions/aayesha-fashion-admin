"use client";

import { useConfirm } from "@/components/ui/useConfirm";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  deleteSetting,
  getSettings,
  updateSettingPublic,
} from "@/services/settings.service";
import type { StoreSetting } from "@/types/settings";

import SettingsHeader from "./SettingsHeader";
import SettingsSkeleton from "./SettingsSkeleton";
import SettingsTable from "./SettingsTable";
import SettingsMobileList from "./SettingsMobileList";
import SettingsEmptyState from "./SettingsEmptyState";
import SettingsGroupFilter from "./SettingsGroupFilter";
import SettingsOverview from "./SettingsOverview";
import SettingsSearch from "./SettingsSearch";

export default function SettingsPage() {
  const { confirm, dialog: confirmDialog } = useConfirm();
  const { accessToken } = useAdminAuth();

  const [settings, setSettings] = useState<StoreSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState("");
  const [search, setSearch] = useState("");

  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [updatingPublicKey, setUpdatingPublicKey] = useState<string | null>(
    null,
  );

  const loadSettings = useCallback(
    async (showRefreshState = false) => {
      if (!accessToken) return;

      try {
        if (showRefreshState) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const data = await getSettings(accessToken);
        setSettings(data);
      } catch (error) {
        console.error("Failed to load settings:", error);

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load settings.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [accessToken],
  );

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const groups = useMemo(() => {
    return Array.from(
      new Set(
        settings
          .map((setting) => setting.group)
          .filter(Boolean),
      ),
    ).sort((a, b) => a.localeCompare(b));
  }, [settings]);

  const filteredSettings = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return settings.filter((setting) => {
      const matchesGroup =
        !selectedGroup || setting.group === selectedGroup;

      if (!normalizedSearch) {
        return matchesGroup;
      }

      const valueText =
        typeof setting.value === "object" && setting.value !== null
          ? JSON.stringify(setting.value)
          : String(setting.value ?? "");

      const matchesSearch =
        setting.key.toLowerCase().includes(normalizedSearch) ||
        setting.group.toLowerCase().includes(normalizedSearch) ||
        valueText.toLowerCase().includes(normalizedSearch);

      return matchesGroup && matchesSearch;
    });
  }, [settings, selectedGroup, search]);

  const handleTogglePublic = async (setting: StoreSetting) => {
    if (!accessToken) return;

    try {
      setUpdatingPublicKey(setting.key);

      const updated = await updateSettingPublic(
        accessToken,
        setting.key,
        {
          isPublic: !setting.isPublic,
        },
      );

      setSettings((current) =>
        current.map((item) =>
          item.key === setting.key ? updated : item,
        ),
      );

      toast.success(
        updated.isPublic
          ? "Setting is now public."
          : "Setting is now private.",
      );
    } catch (error) {
      console.error("Failed to update setting visibility:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update setting visibility.",
      );
    } finally {
      setUpdatingPublicKey(null);
    }
  };

  const handleDelete = async (setting: StoreSetting) => {
    if (!accessToken) return;

    const confirmed = await confirm({
      title: "Delete this setting?",
      description: `"${setting.key}" will be permanently deleted. This cannot be undone.`,
      confirmLabel: "Delete setting",
    });

    if (!confirmed) return;

    try {
      setDeletingKey(setting.key);

      await deleteSetting(accessToken, setting.key);

      setSettings((current) =>
        current.filter((item) => item.key !== setting.key),
      );

      toast.success("Setting deleted successfully.");
    } catch (error) {
      console.error("Failed to delete setting:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete setting.",
      );
    } finally {
      setDeletingKey(null);
    }
  };

  const handleGroupChange = (group: string) => {
    setSelectedGroup(group);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedGroup("");
  };

  const hasFilters = Boolean(search || selectedGroup);

  return (
    <div className="min-h-full">
      {confirmDialog}
      <SettingsHeader
        onRefresh={() => void loadSettings(true)}
        refreshing={refreshing}
      />

      <div className="mx-auto max-w-7xl py-6">
        {loading ? (
          <SettingsSkeleton />
        ) : (
          <>
            <div className="mb-6">
              <div className="mb-5">
                <h2 className="display text-2xl font-semibold text-[#2a2520]">
                  Store Settings
                </h2>

                <p className="mt-1 text-sm text-[#756d62]">
                  Manage your store configuration and visibility.
                </p>
              </div>

              <SettingsOverview settings={settings} />
            </div>

            <div className="mb-5 rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] p-4 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <SettingsSearch
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search by key, group or value..."
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <SettingsGroupFilter
                    groups={groups}
                    value={selectedGroup}
                    onChange={handleGroupChange}
                  />

                  {hasFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="h-10 rounded-lg border border-[#e6dfcf] bg-[#fffdf8] px-4 text-sm font-medium text-[#5f584d] transition hover:bg-[#f7f2e7]"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>

              {hasFilters && (
                <div className="mt-3 text-xs text-[#756d62]">
                  Showing {filteredSettings.length} of {settings.length}{" "}
                  settings
                </div>
              )}
            </div>

            {filteredSettings.length === 0 ? (
              <SettingsEmptyState filtered={hasFilters} />
            ) : (
              <>
                <SettingsTable
                  settings={filteredSettings}
                  deletingKey={deletingKey}
                  updatingPublicKey={updatingPublicKey}
                  onTogglePublic={handleTogglePublic}
                  onDelete={handleDelete}
                />

                <SettingsMobileList
                  settings={filteredSettings}
                  deletingKey={deletingKey}
                  updatingPublicKey={updatingPublicKey}
                  onTogglePublic={handleTogglePublic}
                  onDelete={handleDelete}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}