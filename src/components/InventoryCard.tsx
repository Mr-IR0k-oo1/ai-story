"use client";

interface InventoryCardProps {
  items: string[];
}

export function InventoryCard({ items }: InventoryCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <p className="text-[10px] font-medium tracking-wide text-gray-500 uppercase">
        Inventory
      </p>
      {items.length === 0 ? (
        <p className="mt-1 text-xs text-gray-600 italic">Empty</p>
      ) : (
        <div className="mt-1 space-y-0.5">
          {items.map((item, i) => (
            <p key={i} className="text-sm text-gray-300">&bull; {item}</p>
          ))}
        </div>
      )}
    </div>
  );
}
