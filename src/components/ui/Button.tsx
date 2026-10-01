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
      className={`inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#26221d] px-5 text-sm font-semibold text-[#fffdf8] transition hover:bg-[#3d372f] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {loading
        ? "Signing in..."
        : children}
    </button>
  );
}