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
          className="block text-sm font-medium text-[#f8f3f1]"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={`h-12 w-full rounded-lg border border-[#3a352f] bg-[#1a1816] px-4 text-sm text-[#f8f3f1] outline-none transition placeholder:text-[#9a9185] focus:border-[#b79a6a] focus:ring-2 focus:ring-[#b79a6a]/20 disabled:cursor-not-allowed disabled:bg-[#211e1b] ${className}`}
        {...props}
      />

      {error && (
        <p className="text-xs text-[#e08b84]">
          {error}
        </p>
      )}
    </div>
  );
}