import { ScrollArea } from "@/components/ui/scroll-area";

interface CategoryTabsProps {
  categories: string[];
  selected: string;
  onSelect: (c: string) => void;
}

export function CategoryTabs({ categories, selected, onSelect }: CategoryTabsProps) {
  return (
    <div className="border-t bg-background/60">
      <ScrollArea className="w-full">
        <div className="flex gap-2 px-4 py-2.5 lg:px-6">
          {categories.map((c) => {
            const active = c === selected;
            return (
              <button
                key={c}
                onClick={() => onSelect(c)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
