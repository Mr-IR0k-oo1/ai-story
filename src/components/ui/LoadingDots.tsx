export function LoadingDots() {
  return (
    <div className="flex items-center gap-1.5 py-2">
      <span className="w-1.5 h-1.5 rounded-full bg-accent/50 animate-bounce-dot" />
      <span className="w-1.5 h-1.5 rounded-full bg-accent/50 animate-bounce-dot bounce-delay-200" />
      <span className="w-1.5 h-1.5 rounded-full bg-accent/50 animate-bounce-dot bounce-delay-400" />
    </div>
  );
}
