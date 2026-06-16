export function LoadingDots() {
  return (
    <div className="flex items-center gap-1.5 py-4">
      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce-dot" />
      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce-dot bounce-delay-200" />
      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce-dot bounce-delay-400" />
    </div>
  );
}
