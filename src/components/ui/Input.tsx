import type {
  InputHTMLAttributes,
} from "react";

type InputProps =
  InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
  };

export function Input({
  label,
  error,
  id,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-[#2a2520]"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={`h-12 w-full rounded-lg border border-[#d6ccb6] bg-[#fffdf8] px-4 text-sm text-[#2a2520] outline-none transition placeholder:text-[#756d62] focus:border-[#b08d57] focus:ring-2 focus:ring-[#b08d57]/20 disabled:cursor-not-allowed disabled:bg-[#efe8d8] ${className}`}
        {...props}
      />

      {error && (
        <p className="text-xs text-[#b3261e]">
          {error}
        </p>
      )}
    </div>
  );
}