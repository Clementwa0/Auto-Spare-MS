import type { Part } from "@/types/type";
import { Package } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { ProductCard } from "./ProductCard";
import { SkeletonGrid } from "./SkeletonGrid";

interface ProductGridProps {
  loading: boolean;
  parts: Part[];
  onAdd: (p: Part) => void;
}

export function ProductGrid({ loading, parts, onAdd }: ProductGridProps) {
  if (loading) return <SkeletonGrid />;
  if (parts.length === 0)
    return (
      <EmptyState
        icon={<Package className="h-7 w-7" />}
        title="No parts found"
        body="Try adjusting your search or category filter."
      />
    );
  return (
    <div className="grid gap-2 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {parts.map((p) => (
        <ProductCard key={p._id} part={p} onAdd={() => onAdd(p)} />
      ))}
    </div>
  );
}
