import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Receipt, ShoppingCart, User } from "lucide-react";
import { SearchBox } from "./SearchBox";

interface POSHeaderProps {
  userName?: string;
  searchTerm: string;
  onSearch: (v: string) => void;
  totalItems: number;
  onOpenCart: () => void;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (c: string) => void;
}

export function POSHeader({
  userName,
  searchTerm,
  onSearch,
  totalItems,
  onOpenCart,
  categories,
  selectedCategory,
  onSelectCategory,
}: POSHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col gap-1 px-3 py-1 lg:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Receipt className="h-4 w-4" />
            </div>

            <div className="leading-tight">
              <div className="text-sm font-semibold">
                Point of Sale
              </div>
              <div className="text-xs text-muted-foreground">
                Terminal POS-001
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs md:flex">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium">{userName || "—"}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="relative lg:hidden"
            onClick={onOpenCart}
          >
            <ShoppingCart className="h-4 w-4" />

            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {totalItems}
              </span>
            )}
          </Button>
        </div>

        <div className="flex flex-col gap-2 md:flex-row">
          <div className="flex-1">
            <SearchBox value={searchTerm} onChange={onSearch} />
          </div>

          <Select
            value={selectedCategory}
            onValueChange={onSelectCategory}
          >
            <SelectTrigger className="w-full md:w-[220px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                All Categories
              </SelectItem>

              {categories.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}