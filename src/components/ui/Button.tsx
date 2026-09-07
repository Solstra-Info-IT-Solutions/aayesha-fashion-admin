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
      className={`inline-flex h-12 w-full items-center justify-center bg-[#171717] px-5 text-sm font-medium text-white transition hover:bg-[#292c2c] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {loading
        ? "Signing in..."
        : children}
    </button>
  );
}