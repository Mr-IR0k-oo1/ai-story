"use client";

import { Button } from "./ui/Button";

interface ActionBarProps {
  isLoading: boolean;
  error: string | null;
  onContinue: () => void;
  onTwist: () => void;
}

export function ActionBar({ isLoading, error, onContinue, onTwist }: ActionBarProps) {
  return (
    <div>
      {error && (
        <p className="mb-3 animate-fade-in text-center text-sm text-red-400">{error}</p>
      )}
      <div className="flex gap-3">
        <Button
          variant="primary"
          onClick={onContinue}
          disabled={isLoading}
          className="flex-1 py-3"
        >
          {isLoading ? "..." : "Continue"}
        </Button>
        <Button
          variant="secondary"
          onClick={onTwist}
          disabled={isLoading}
          className="flex-1 py-3"
        >
          {isLoading ? "..." : "Twist"}
        </Button>
      </div>
    </div>
  );
}
