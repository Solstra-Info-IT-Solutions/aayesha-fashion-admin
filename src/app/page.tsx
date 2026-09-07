"use client";

import { useEffect, useState } from "react";

import {
  API_BASE_URL,
  apiGet,
  ApiError,
} from "@/lib/api";

type HealthResponse = {
  success: boolean;
  service: string;
  message: string;
};

export default function HomePage() {
  const [status, setStatus] =
    useState<
      "checking" | "connected" | "error"
    >("checking");

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    async function checkBackend() {
      try {
        const response =
          await apiGet<HealthResponse>(
            "/health",
          );

        setStatus(
          response.success
            ? "connected"
            : "error",
        );

        setMessage(
          response.message ||
            "Backend connected.",
        );
      } catch (error) {
        setStatus("error");

        setMessage(
          error instanceof ApiError
            ? `${error.code || "API_ERROR"}: ${error.message}`
            : "Unable to connect to backend.",
        );
      }
    }

    checkBackend();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fcfbf9] px-6">
      <div className="w-full max-w-xl border border-[#e7e2dd] bg-white p-8 shadow-sm">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#969696]">
          Aayesha Fashion Admin
        </p>

        <h1 className="font-serif text-4xl text-[#171717]">
          Backend Connection
        </h1>

        <div className="mt-8 border-t border-[#e7e2dd] pt-6">
          <p className="text-sm text-[#6f706f]">
            API:
          </p>

          <p className="mt-1 break-all text-sm font-medium text-[#292c2c]">
            {API_BASE_URL || "Not configured"}
          </p>

          <div className="mt-6">
            <p className="text-sm text-[#6f706f]">
              Status
            </p>

            <p
              className={`mt-1 text-lg font-medium ${
                status ===
                "connected"
                  ? "text-green-700"
                  : status ===
                      "error"
                    ? "text-red-700"
                    : "text-[#292c2c]"
              }`}
            >
              {status ===
                "checking" &&
                "Checking..."}

              {status ===
                "connected" &&
                "Connected"}

              {status ===
                "error" &&
                "Connection failed"}
            </p>
          </div>

          {message && (
            <p className="mt-4 text-sm text-[#6f706f]">
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}