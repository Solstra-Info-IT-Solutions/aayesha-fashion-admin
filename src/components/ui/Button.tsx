import type {
  ButtonHTMLAttributes,
} from "react";

type ButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean;
  };

export function Button({
  children,
  loading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={
        disabled || loading
      }
      className={`inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#b79a6a] px-5 text-sm font-semibold text-[#1a1816] transition hover:bg-[#c8ad7f] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {loading
        ? "Signing in..."
        : children}
    </button>
  );
}