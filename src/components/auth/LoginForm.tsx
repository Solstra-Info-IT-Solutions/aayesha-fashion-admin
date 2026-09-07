"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import {
  ApiError,
} from "@/lib/api";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import {
  useAdminAuth,
} from "@/hooks/useAdminAuth";

export function LoginForm() {
  const router =
    useRouter();

  const {
    login,
  } = useAdminAuth();

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const normalizedEmail =
      email.trim();

    if (
      !normalizedEmail ||
      !password
    ) {
      toast.error(
        "Email and password are required.",
      );

      return;
    }

    setIsSubmitting(true);

    try {
      await login(
        normalizedEmail,
        password,
      );

      toast.success(
        "Welcome to Aayesha Fashion Admin.",
      );

      router.replace(
        "/admin",
      );
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Unable to sign in.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="relative">
        <Mail
          size={18}
          strokeWidth={1.7}
          className="absolute left-4 top-[42px] text-[#969696]"
        />

        <Input
          id="email"
          type="email"
          label="Email address"
          autoComplete="email"
          placeholder="admin@example.com"
          value={email}
          onChange={(event) =>
            setEmail(
              event.target.value,
            )
          }
          disabled={
            isSubmitting
          }
          className="pl-11"
        />
      </div>

      <div className="relative">
        <LockKeyhole
          size={18}
          strokeWidth={1.7}
          className="absolute left-4 top-[42px] text-[#969696]"
        />

        <Input
          id="password"
          type={
            showPassword
              ? "text"
              : "password"
          }
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) =>
            setPassword(
              event.target.value,
            )
          }
          disabled={
            isSubmitting
          }
          className="pl-11 pr-12"
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword(
              (current) =>
                !current,
            )
          }
          disabled={
            isSubmitting
          }
          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
          }
          className="absolute right-3 top-[42px] p-2 text-[#969696] hover:text-[#171717]"
        >
          {showPassword ? (
            <EyeOff
              size={18}
              strokeWidth={1.7}
            />
          ) : (
            <Eye
              size={18}
              strokeWidth={1.7}
            />
          )}
        </button>
      </div>

      <Button
        type="submit"
        loading={
          isSubmitting
        }
      >
        Sign in
      </Button>
    </form>
  );
}