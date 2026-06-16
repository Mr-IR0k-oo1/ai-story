"use client";

import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-white text-gray-950 hover:bg-gray-200 disabled:opacity-40 border border-transparent",
  secondary:
    "bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 disabled:opacity-40",
  ghost:
    "text-gray-500 hover:text-gray-300 hover:bg-gray-800 disabled:opacity-40 border border-transparent",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", isLoading, children, className = "", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`rounded-xl font-medium text-sm transition-all active:scale-[0.98] disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce-dot" />
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce-dot bounce-delay-200" />
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce-dot bounce-delay-400" />
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
