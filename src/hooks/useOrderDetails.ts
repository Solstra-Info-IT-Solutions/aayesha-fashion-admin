"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useAdminAuth,
} from "@/hooks/useAdminAuth";

import {
  cancelOrder,
  getAdminOrder,
  updateOrderNotes,
  updateOrderPayment,
  updateOrderShipping,
  updateOrderStatus,
} from "@/services/order.service";

import type {
  AdminOrder,
  OrderStatus,
  PaymentStatus,
} from "@/types/order";

export function useOrderDetails(
  orderNumber: string,
) {
  const {
    accessToken,
    isAuthenticated,
    isInitialized,
  } = useAdminAuth();

  const [
    order,
    setOrder,
  ] = useState<AdminOrder | null>(
    null,
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const loadOrder =
    useCallback(async () => {
      if (
        !isInitialized ||
        !isAuthenticated ||
        !accessToken ||
        !orderNumber
      ) {
        return;
      }

      setLoading(true);
      setError("");

      try {
        const result =
          await getAdminOrder(
            orderNumber,
            accessToken,
          );

        setOrder(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load order.",
        );
      } finally {
        setLoading(false);
      }
    }, [
      accessToken,
      isAuthenticated,
      isInitialized,
      orderNumber,
    ]);

  useEffect(() => {
    void loadOrder();
  }, [loadOrder]);

  const performAction =
    useCallback(
      async (
        action: () => Promise<AdminOrder>,
      ) => {
        setActionLoading(true);
        setError("");

        try {
          const result =
            await action();

          setOrder(result);

          return result;
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : "Action failed.";

          setError(message);

          throw err;
        } finally {
          setActionLoading(false);
        }
      },
      [],
    );

  async function changeStatus(
    status: OrderStatus,
    note?: string,
  ) {
    if (!accessToken) {
      throw new Error(
        "Authentication is required.",
      );
    }

    return performAction(
      () =>
        updateOrderStatus(
          orderNumber,
          {
            status,
            ...(note
              ? { note }
              : {}),
          },
          accessToken,
        ),
    );
  }

  async function changePayment(
    input: {
      paymentStatus: PaymentStatus;
      paymentId?: string;
      paymentSource?: string;
      note?: string;
    },
  ) {
    if (!accessToken) {
      throw new Error(
        "Authentication is required.",
      );
    }

    return performAction(
      () =>
        updateOrderPayment(
          orderNumber,
          input,
          accessToken,
        ),
    );
  }

  async function changeShipping(
    input: {
      courierName?: string;
      trackingNumber?: string;
      trackingUrl?: string;
      note?: string;
    },
  ) {
    if (!accessToken) {
      throw new Error(
        "Authentication is required.",
      );
    }

    return performAction(
      () =>
        updateOrderShipping(
          orderNumber,
          input,
          accessToken,
        ),
    );
  }

  async function saveNotes(
    adminNotes: string,
  ) {
    if (!accessToken) {
      throw new Error(
        "Authentication is required.",
      );
    }

    return performAction(
      () =>
        updateOrderNotes(
          orderNumber,
          adminNotes,
          accessToken,
        ),
    );
  }

  async function cancel(
    reason: string,
  ) {
    if (!accessToken) {
      throw new Error(
        "Authentication is required.",
      );
    }

    return performAction(
      () =>
        cancelOrder(
          orderNumber,
          reason,
          accessToken,
        ),
    );
  }

  return {
    order,
    loading,
    actionLoading,
    error,
    refresh: loadOrder,
    changeStatus,
    changePayment,
    changeShipping,
    saveNotes,
    cancel,
  };
}