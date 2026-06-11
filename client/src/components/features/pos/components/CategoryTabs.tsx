import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryTabsProps {
  categories: string[];
  selected: string;
  onSelect: (c: string) => void;
}

export function CategoryTabs({
  categories,
  selected,
  onSelect,
}: CategoryTabsProps) {
  return (
    <div className="border-t bg-background/60 px-4 py-2 lg:px-6">
      <Select value={selected} onValueChange={onSelect}>
        <SelectTrigger className="w-full md:w-[250px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>

        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}