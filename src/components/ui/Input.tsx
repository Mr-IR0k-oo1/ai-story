"use client";

import { forwardRef, useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id: externalId, className = "", ...props }, ref) => {
    const generatedId = useId();
    const inputId = externalId || generatedId;

    return (
      <div>
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-gray-400 mb-1.5"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-4 py-2.5 bg-gray-900 border rounded-lg text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors ${
            error
              ? "border-red-500 focus:border-red-400"
              : "border-gray-800"
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
