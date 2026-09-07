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
          className="block text-sm font-medium text-[#292c2c]"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={`h-12 w-full border border-[#d8d1ca] bg-white px-4 text-sm text-[#171717] outline-none transition placeholder:text-[#aaa] focus:border-[#292c2c] disabled:cursor-not-allowed disabled:bg-[#f5f1ec] ${className}`}
        {...props}
      />

      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}