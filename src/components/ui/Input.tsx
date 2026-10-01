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
          className="block text-sm font-medium text-[#3f2d2a]"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={`h-12 w-full border border-[#d8cec5] bg-[#fbf9f5] px-4 text-sm text-[#3f2d2a] outline-none transition placeholder:text-[#958781] focus:border-[#3f2d2a] disabled:cursor-not-allowed disabled:bg-[#efe8df] ${className}`}
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