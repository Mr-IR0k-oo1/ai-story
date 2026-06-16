"use client";

interface StoryViewProps {
  createdAt: Date;
  id: string;
}

export function StoryView({ createdAt, id }: StoryViewProps) {
  const copyUrl = () => navigator.clipboard.writeText(window.location.href);

  return (
    <div className="mt-6 flex items-center justify-between">
      <span className="text-xs text-gray-600">
        {new Date(createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>

      <div className="flex items-center gap-3">
        <span className="text-[10px] text-gray-700 font-mono">{id}</span>
        <button
          onClick={copyUrl}
          className="text-xs px-3 py-1.5 rounded-lg border border-gray-800 text-gray-400 hover:text-gray-200 hover:border-gray-600 transition-colors"
        >
          Copy URL
        </button>
        <a
          href="/"
          className="text-xs px-3 py-1.5 rounded-lg bg-white text-gray-950 hover:bg-gray-200 transition-colors"
        >
          New Story
        </a>
      </div>
    </div>
  );
}
