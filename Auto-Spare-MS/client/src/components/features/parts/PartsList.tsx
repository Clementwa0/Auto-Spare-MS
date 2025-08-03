import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchPartsByCategory } from "@/services/part";
import { fetchCategories } from "@/services/category";
import type { Part, Category } from "@/types/type";

export default function Parts() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadParts = async () => {
      setLoading(true);
      const data = await fetchPartsByCategory(selectedCategory);
      setParts(data);
      setLoading(false);
    };
    loadParts();
  }, [selectedCategory]);

  const filteredParts = parts.filter((part) =>
    [part.description, part.part_no, part.code, part.brand]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getStockBadge = (qty: number) => {
    if (qty === 0) return <Badge variant="destructive">Out of Stock</Badge>;
    if (qty < 10) return <Badge variant="destructive">Low Stock</Badge>;
    if (qty < 50)
      return <Badge className="bg-yellow-500 text-white">Medium Stock</Badge>;
    return <Badge className="bg-green-600 text-white">In Stock</Badge>;
  };

  return (
    <div className="space-y-6 p-2">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Parts Inventory</h1>
          <p className="text-muted-foreground">
            Manage your spare parts inventory
          </p>
        </div>
        <Link to="/parts/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Part
          </Button>
        </Link>
      </div>

      {/* Category Dropdown & Search */}
      <div className="flex flex-wrap gap-4 items-center">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search parts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <Card className="bg-card rounded-lg shadow-sm border border-border overflow-hidden dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            All Parts ({filteredParts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="p-4">Loading parts...</div>
          ) : (
            <div className="overflow-x-auto hidden sm:block">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b border-border dark:bg-gray-900">
                    <th className="px-4 py-3 text-sm font-medium text-left">
                      Part Info
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-left">
                      Category
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-left">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-left">
                      Price
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-left">
                      Compatible Models
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredParts.map((part) => (
                    <tr
                      key={part._id}
                      className="group hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <p className="font-medium">{part.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {part.brand} • {part.part_no} • {part.code}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="outline">
                          {typeof part.category === "string"
                            ? "N/A"
                            : part.category?.name || "N/A"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex flex-col gap-1">
                          {getStockBadge(part.qty)}
                          <p className="text-xs text-muted-foreground">
                            {part.qty} {part.unit}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <p className="font-medium">
                            KES {part.selling_price}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Cost: KES {part.buying_price}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="space-y-1">
                          {part.compatible_models
                            .slice(0, 2)
                            .map((model, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-xs"
                              >
                                {model}
                              </Badge>
                            ))}
                          {part.compatible_models.length > 2 && (
                            <p className="text-xs text-muted-foreground">
                              + {part.compatible_models.length - 2} more
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to={`/parts/${part._id}/edit`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-primary"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Mobile List View */}
          <div className="sm:hidden space-y-4">
            {filteredParts.map((part) => (
              <div
                key={part._id}
                className="border border-border rounded-lg p-4 shadow-sm bg-background"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-base font-semibold">
                    {part.description}
                  </h2>
                  {getStockBadge(part.qty)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {part.brand} • {part.part_no} • {part.code}
                </p>

                <div className="mt-2 text-sm">
                  <p>
                    <span className="font-medium">Category: </span>
                    {typeof part.category === "string"
                      ? "N/A"
                      : part.category?.name || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Price: </span>
                    KES {part.selling_price}{" "}
                    <span className="text-xs text-muted-foreground ml-1">
                      (Cost: KES {part.buying_price})
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Qty: </span>
                    {part.qty} {part.unit}
                  </p>
                  <p>
                    <span className="font-medium">Models: </span>
                    {part.compatible_models.slice(0, 2).join(", ")}
                    {part.compatible_models.length > 2 && (
                      <span className="text-muted-foreground">
                        {" "}
                        +{part.compatible_models.length - 2} more
                      </span>
                    )}
                  </p>
                </div>

                <div className="mt-3 flex gap-2 justify-end">
                  <Link to={`/parts/${part._id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
