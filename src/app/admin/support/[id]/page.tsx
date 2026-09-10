"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import SupportDetail from "@/components/admin/support/SupportDetail";
import {
  closeSupportTicket,
  deleteSupportTicket,
  getSupportTicket,
  updateSupportTicket,
} from "@/services/support.service";
import type {
  SupportTicket,
  SupportUpdateInput,
} from "@/types/support";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminSupportDetailPage() {
  const params = useParams();
  const router = useRouter();

  const { accessToken, isLoading: authLoading } = useAdminAuth();

  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [closing, setClosing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadTicket = useCallback(async () => {
    if (!accessToken || !id) return;

    try {
      setLoading(true);

      const data = await getSupportTicket(accessToken, id);
      setTicket(data);
    } catch (error) {
      console.error("Failed to load support ticket:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load support ticket."
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken, id]);

  useEffect(() => {
    if (authLoading) return;

    if (!accessToken || !id) {
      setLoading(false);
      return;
    }

    void loadTicket();
  }, [authLoading, accessToken, id, loadTicket]);

  const handleUpdate = async (data: SupportUpdateInput) => {
    if (!accessToken || !id) return;

    try {
      setUpdating(true);

      const updatedTicket = await updateSupportTicket(
        accessToken,
        id,
        data
      );

      setTicket(updatedTicket);

      toast.success("Support ticket updated successfully.");
    } catch (error) {
      console.error("Failed to update support ticket:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update support ticket."
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleClose = async (resolutionNote?: string) => {
    if (!accessToken || !id) return;

    try {
      setClosing(true);

      const closedTicket = await closeSupportTicket(
        accessToken,
        id,
        resolutionNote ? { resolutionNote } : {}
      );

      setTicket(closedTicket);

      toast.success("Support ticket closed successfully.");
    } catch (error) {
      console.error("Failed to close support ticket:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to close support ticket."
      );
    } finally {
      setClosing(false);
    }
  };

  const handleDelete = async () => {
    if (!accessToken || !id) return;

    try {
      setDeleting(true);

      await deleteSupportTicket(accessToken, id);

      toast.success("Support ticket deleted successfully.");

      router.push("/admin/support");
    } catch (error) {
      console.error("Failed to delete support ticket:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete support ticket."
      );

      setDeleting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-slate-200" />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <div className="h-[300px] animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-[220px] animate-pulse rounded-2xl bg-slate-100" />
          </div>

          <div className="h-[500px] animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-slate-900">
            Support ticket not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            The ticket may have been deleted or you may not have access to it.
          </p>

          <button
            type="button"
            onClick={() => router.push("/admin/support")}
            className="mt-5 inline-flex h-10 items-center rounded-lg bg-[#9f1239] px-4 text-sm font-medium text-white transition hover:bg-[#881337]"
          >
            Back to Support
          </button>
        </div>
      </div>
    );
  }

  return (
    <SupportDetail
      ticket={ticket}
      updating={updating}
      closing={closing}
      deleting={deleting}
      onUpdate={handleUpdate}
      onClose={handleClose}
      onDelete={handleDelete}
    />
  );
}