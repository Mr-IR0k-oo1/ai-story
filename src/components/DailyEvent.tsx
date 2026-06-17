"use client";

import { LoadingDots } from "./ui/LoadingDots";

interface DailyEventData {
  title: string;
  description: string;
  choices: string[];
}

interface DailyEventProps {
  event: DailyEventData | null;
  phase: "event" | "loading" | "result";
  consequence: string | null;
  newItemName: string | null;
  error: string | null;
  onChoice: (index: number) => void;
  onDismiss: () => void;
}

export function DailyEvent({
  event,
  phase,
  consequence,
  newItemName,
  error,
  onChoice,
  onDismiss,
}: DailyEventProps) {
  if (phase === "loading") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
        <div className="w-full max-w-md rounded-xl border border-border bg-card px-6 py-8 text-center">
          <LoadingDots />
          <p className="mt-2 text-xs text-gray-600">The world stirs...</p>
        </div>
      </div>
    );
  }

  if (phase === "result" && consequence) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
        <div className="w-full max-w-md animate-fade-in-up rounded-xl border border-border bg-card px-6 py-6">
          <p className="font-display text-lg font-bold text-white mb-3">
            Outcome
          </p>
          <p className="text-sm leading-relaxed text-gray-300">{consequence}</p>
          {newItemName && (
            <div className="mt-4 rounded-lg border border-accent/20 bg-accent/5 px-3 py-2">
              <p className="text-[10px] font-medium tracking-wide text-accent/70 uppercase">
                Item acquired
              </p>
              <p className="text-sm font-medium text-gray-200">{newItemName}</p>
            </div>
          )}
          <button
            onClick={onDismiss}
            className="mt-5 w-full rounded-lg border border-border py-2.5 text-sm font-medium text-gray-400 transition-colors hover:text-gray-200"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md animate-fade-in-up rounded-xl border border-border bg-card px-6 py-6">
        <p className="text-[10px] font-medium tracking-wide text-accent/70 uppercase mb-1">
          Daily Event
        </p>
        <p className="font-display text-lg font-bold text-white">
          {event.title}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gray-400">
          {event.description}
        </p>

        {error && (
          <p className="mt-3 text-sm text-red-400">{error}</p>
        )}

        <div className="mt-5 space-y-2">
          {event.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => onChoice(i)}
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-left text-sm font-medium text-gray-300 transition-all hover:border-accent/30 hover:bg-accent/5 hover:text-white"
            >
              {choice}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
