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
    <div className="mx-auto max-w-sm px-4 pt-[15vh]">
      <h1 className="mb-8 text-center text-xl font-semibold text-white">
        One Button Story
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="character"
            className="block text-xs text-gray-500 mb-1"
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
            className="w-full border-b border-gray-800 bg-transparent px-0 py-2 text-sm text-gray-200 placeholder-gray-700 focus:border-gray-600 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label htmlFor="goal" className="block text-xs text-gray-500 mb-1">
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
            className="w-full border-b border-gray-800 bg-transparent px-0 py-2 text-sm text-gray-200 placeholder-gray-700 focus:border-gray-600 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label htmlFor="problem" className="block text-xs text-gray-500 mb-1">
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
            className="w-full border-b border-gray-800 bg-transparent px-0 py-2 text-sm text-gray-200 placeholder-gray-700 focus:border-gray-600 focus:outline-none transition-colors"
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-white py-2.5 text-sm font-medium text-gray-950 hover:bg-gray-200 active:scale-[0.98] transition-all"
        >
          Begin
        </button>
      </form>
    </div>
  );
}
