import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "./types";
import { formatKES } from "./types";

interface CartItemRowProps {
  item: CartItem;
  onQty: (id: string, q: number) => void;
  onRemove: (id: string) => void;
}

export function CartItemRow({ item, onQty, onRemove }: CartItemRowProps) {
  return (
    <li className="rounded-lg border bg-card p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{item.part.description}</p>
          <p className="font-mono text-[11px] text-muted-foreground">
            {item.part.part_no}
          </p>
        </div>
        <button
          onClick={() => onRemove(item.part._id)}
          className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          aria-label="Remove"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="inline-flex items-center rounded-md border bg-background">
          <button
            onClick={() => onQty(item.part._id, item.quantity - 1)}
            className="grid h-8 w-8 place-items-center text-muted-foreground hover:bg-muted disabled:opacity-50"
            disabled={item.quantity <= 1}
            aria-label="Decrease"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <input
            value={item.quantity}
            onChange={(e) => onQty(item.part._id, parseInt(e.target.value) || 1)}
            className="h-8 w-10 border-x bg-transparent text-center text-sm tabular-nums outline-none"
          />
          <button
            onClick={() => onQty(item.part._id, item.quantity + 1)}
            disabled={item.quantity >= item.part.qty}
            className="grid h-8 w-8 place-items-center text-muted-foreground hover:bg-muted disabled:opacity-40"
            aria-label="Increase"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold tabular-nums">
            {formatKES(item.quantity * item.part.selling_price)}
          </div>
          <div className="text-[11px] text-muted-foreground tabular-nums">
            {formatKES(item.part.selling_price)} ea
          </div>
        </div>
      </div>
    </li>
  );
}
