import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchPartsByCategory } from "@/services/part";
import { fetchCategories } from "@/services/category";
import type { Part , Category } from "@/types/type";

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Parts Inventory</h1>
          <p className="text-muted-foreground">Manage your spare parts inventory</p>
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
      <Card>
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Part Info</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Compatible Models</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParts.map((part) => (
                    <TableRow key={part._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{part.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {part.brand} • {part.part_no} • {part.code}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {typeof part.category === "string"
                            ? "N/A"
                            : part.category?.name || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {getStockBadge(part.qty)}
                          <p className="text-sm text-muted-foreground">
                            {part.qty} {part.unit}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">KES {part.selling_price}</p>
                          <p className="text-sm text-muted-foreground">
                            Cost: KES {part.buying_price}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {part.compatible_models.slice(0, 2).map((model, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {model}
                            </Badge>
                          ))}
                          {part.compatible_models.length > 2 && (
                            <p className="text-xs text-muted-foreground">
                              +{part.compatible_models.length - 2} more
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link to={`/parts/${part._id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
