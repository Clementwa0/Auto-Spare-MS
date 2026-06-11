import type { Part } from "@/types/type";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { StockBadge } from "./StockBadge";
import { formatKES } from "./types";

interface ProductCardProps {
  part: Part;
  onAdd: () => void;
}

export function ProductCard({ part, onAdd }: ProductCardProps) {
  const disabled = part.qty === 0;

  return (
    <div
      className={`w-full rounded-lg border bg-card p-2.5 flex flex-col gap-2 ${
        disabled ? "opacity-60" : ""
      }`}
    >
      {/* Top Row */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-xs font-medium truncate">
            {part.description}
          </h3>

          <p className="text-[10px] text-muted-foreground truncate">
            {part.part_no}
          </p>
        </div>

        <StockBadge qty={part.qty} />
      </div>

      {/* Bottom Row */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">
          {formatKES(part.selling_price)}
        </div>

        <Button
          onClick={onAdd}
          disabled={disabled}
          size="sm"
          className="h-7 px-2 text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </Button>
      </div>
    </div>
  );
}