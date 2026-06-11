export function CartSummaryRow({
    label,
    value,
    muted,
  }: {
    label: string;
    value: string;
    muted?: boolean;
  }) {
    return (
      <div className="flex items-center justify-between">
        <span className={muted ? "text-muted-foreground" : ""}>{label}</span>
        <span className="tabular-nums">{value}</span>
      </div>
    );
  }
  