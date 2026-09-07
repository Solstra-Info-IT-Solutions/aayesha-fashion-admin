"use client";

import {
  useMemo,
  useState,
} from "react";

import { useInventory } from "@/hooks/useInventory";

import type {
  InventoryItem,
  InventoryQuery,
  InventorySort,
  InventoryStatusFilter,
} from "@/types/inventory";

import InventoryHeader from "./InventoryHeader";
import InventorySummary from "./InventorySummary";
import InventoryToolbar from "./InventoryToolbar";
import InventoryTable from "./InventoryTable";
import InventoryPagination from "./InventoryPagination";
import InventoryEmptyState from "./InventoryEmptyState";
import StockAdjustmentModal from "./StockAdjustmentModal";
import ReservationModal from "./ReservationModal";
import ThresholdModal from "./ThresholdModal";
import InventoryLedgerModal from "./InventoryLedgerModal";

export default function InventoryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] =
    useState<InventoryStatusFilter>("all");
  const [sort, setSort] =
    useState<InventorySort>("newest");

  const [selectedItem, setSelectedItem] =
    useState<InventoryItem | null>(null);

  const [modal, setModal] = useState<
    | "adjust"
    | "reservation"
    | "threshold"
    | "ledger"
    | null
  >(null);

  const query = useMemo<InventoryQuery>(
    () => ({
      page,
      limit: 25,
      search: search.trim() || undefined,
      status,
      sort,
    }),
    [
      page,
      search,
      status,
      sort,
    ],
  );

  const {
    items,
    pagination,
    summary,
    loading,
    summaryLoading,
    error,
    refresh,
  } = useInventory(query);

  const openModal = (
    type:
      | "adjust"
      | "reservation"
      | "threshold"
      | "ledger",
    item: InventoryItem,
  ) => {
    setSelectedItem(item);
    setModal(type);
  };

  const closeModal = () => {
    setModal(null);
    setSelectedItem(null);
  };

  const handleSearchChange = (
    value: string,
  ) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (
    value: InventoryStatusFilter,
  ) => {
    setStatus(value);
    setPage(1);
  };

  const handleSortChange = (
    value: InventorySort,
  ) => {
    setSort(value);
    setPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setSort("newest");
    setPage(1);
  };

  const filtered =
    search.trim() !== "" ||
    status !== "all";

  return (
    <div className="space-y-6">
      <InventoryHeader
        onRefresh={() => void refresh()}
        loading={loading}
      />

      <InventorySummary
        summary={summary}
        loading={summaryLoading}
      />

      <InventoryToolbar
        search={search}
        status={status}
        sort={sort}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onSortChange={handleSortChange}
        onReset={resetFilters}
      />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      ) : items.length === 0 && !loading ? (
        <InventoryEmptyState filtered={filtered} />
      ) : (
        <InventoryTable
          items={items}
          loading={loading}
          onAdjust={(item) =>
            openModal("adjust", item)
          }
          onReserve={(item) =>
            openModal("reservation", item)
          }
          onThreshold={(item) =>
            openModal("threshold", item)
          }
          onLedger={(item) =>
            openModal("ledger", item)
          }
        />
      )}

      {!loading && items.length > 0 && (
        <InventoryPagination
          pagination={pagination}
          onPageChange={setPage}
        />
      )}

      <StockAdjustmentModal
        item={selectedItem}
        open={modal === "adjust"}
        onClose={closeModal}
        onSuccess={refresh}
      />

      <ReservationModal
        item={selectedItem}
        open={modal === "reservation"}
        onClose={closeModal}
        onSuccess={refresh}
      />

      <ThresholdModal
        item={selectedItem}
        open={modal === "threshold"}
        onClose={closeModal}
        onSuccess={refresh}
      />

      <InventoryLedgerModal
        item={selectedItem}
        open={modal === "ledger"}
        onClose={closeModal}
      />
    </div>
  );
}