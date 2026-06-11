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
import Loader from "@/constants/Loader";

export default function Parts() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

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
      setCurrentPage(1); // reset page when filter changes
    };
    loadParts();
  }, [selectedCategory]);

  if (loading) return <Loader />;

  const filteredParts = parts.filter((part) =>
    [part.description, part.part_no, part.code, part.brand]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // ✅ pagination logic
  const totalPages = Math.ceil(filteredParts.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedParts = filteredParts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

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

      {/* Category + Search */}
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
          {/* TABLE */}
          <div className="overflow-x-auto hidden sm:block">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left">Part Info</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Models</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedParts.map((part) => (
                  <tr key={part._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      <p className="font-medium">{part.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {part.brand} • {part.part_no}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <Badge variant="outline">
                        {typeof part.category === "string"
                          ? "N/A"
                          : part.category?.name || "N/A"}
                      </Badge>
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {getStockBadge(part.qty)}
                      <p className="text-xs text-muted-foreground">
                        {part.qty} {part.unit}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-sm">
                      KES {part.selling_price}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {part.compatible_models.slice(0, 2).join(", ")}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/parts/${part._id}/edit`}>
                          <Button size="icon" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>

                        {/* ✅ KEPT YOUR TRASH BUTTON */}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
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

          {/* MOBILE */}
          <div className="sm:hidden divide-y text-xs">
            {paginatedParts.map((part) => (
              <div key={part._id} className="py-2 flex justify-between">
                <div className="min-w-0">
                  <p className="font-medium truncate">{part.description}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {part.part_no}
                  </p>
                </div>

                <div className="flex gap-1">
                  <Link to={`/parts/${part._id}/edit`}>
                    <Button size="icon" variant="ghost" className="h-6 w-6">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </Link>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages || 1}
            </p>

            <div className="flex gap-2">
              <Button
                onClick={goPrev}
                disabled={currentPage === 1}
                size="sm"
              >
                Prev
              </Button>

              <Button
                onClick={goNext}
                disabled={currentPage === totalPages || totalPages === 0}
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}