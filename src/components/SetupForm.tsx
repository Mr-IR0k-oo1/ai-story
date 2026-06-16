"use client";

import { MAX_SETUP_LENGTH } from "@/lib/types";

interface SetupFormProps {
  onSubmit: (setup: { character: string; goal: string; problem: string }) => void;
}

export function SetupForm({ onSubmit }: SetupFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const character = (data.get("character") as string).trim();
    const goal = (data.get("goal") as string).trim();
    const problem = (data.get("problem") as string).trim();

    if (!character || !goal || !problem) return;

    onSubmit({ character, goal, problem });
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />

      <div className="relative mx-auto w-full max-w-md">
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            One Button Story
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            An absurd comedy storytelling app. You set the stage, then tap a
            single button as AI writes the next twist.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="character"
              className="block text-xs font-medium tracking-wide text-gray-400 uppercase mb-1.5"
            >
              Character
            </label>
            <input
              id="character"
              name="character"
              type="text"
              defaultValue="Goat accountant"
              required
              maxLength={MAX_SETUP_LENGTH}
              autoComplete="off"
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-gray-200 placeholder-gray-700 transition-colors focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20"
            />
          </div>

          <div>
            <label
              htmlFor="goal"
              className="block text-xs font-medium tracking-wide text-gray-400 uppercase mb-1.5"
            >
              Goal
            </label>
            <input
              id="goal"
              name="goal"
              type="text"
              defaultValue="Deliver taxes"
              required
              maxLength={MAX_SETUP_LENGTH}
              autoComplete="off"
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-gray-200 placeholder-gray-700 transition-colors focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20"
            />
          </div>

          <div>
            <label
              htmlFor="problem"
              className="block text-xs font-medium tracking-wide text-gray-400 uppercase mb-1.5"
            >
              Problem
            </label>
            <input
              id="problem"
              name="problem"
              type="text"
              defaultValue="Dragon stole calculator"
              required
              maxLength={MAX_SETUP_LENGTH}
              autoComplete="off"
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-gray-200 placeholder-gray-700 transition-colors focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-gray-950 transition-all hover:bg-amber-400 active:scale-[0.98]"
          >
            Begin
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-gray-600">
          The story runs 20 events. You can twist the plot at any time.
        </p>
      </div>
    </div>
  );
}
