export function DimensionShift({ text }: { text: string }) {
  const items = Array.from({ length: 8 }, (_, i) => (
    <span key={i} className="whitespace-nowrap">
      {text} <span className="text-[var(--color-yellow)]">✦</span>
    </span>
  ));
  return (
    <div className="dimension-shift" aria-hidden>
      <div className="dimension-shift__track">
        {items}
        {items}
      </div>
    </div>
  );
}
