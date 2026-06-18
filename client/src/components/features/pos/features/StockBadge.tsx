import { Badge } from "@/components/ui/badge";

export function StockBadge({ qty }: { qty: number }) {
  if (qty === 0)
    return (
      <Badge variant="outline" className="border-destructive/30 bg-destructive/5 text-destructive font-medium">
        Out of stock
      </Badge>
    );
  if (qty <= 5)
    return (
      <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 font-medium">
        Low · {qty} left
      </Badge>
    );
  return (
    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 font-medium">
      {qty} in stock
    </Badge>
  );
}
