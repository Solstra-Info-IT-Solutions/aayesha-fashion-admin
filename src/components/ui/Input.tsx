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
          className="block text-sm font-medium text-[#0f172a]"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={`h-12 w-full border border-[#d3d7df] bg-[#ffffff] px-4 text-sm text-[#0f172a] outline-none transition placeholder:text-[#737a8c] focus:border-[#0f172a] disabled:cursor-not-allowed disabled:bg-[#eef0f4] ${className}`}
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