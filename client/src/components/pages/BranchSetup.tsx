import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { createBranch, listBranches, disableBranch, type Branch } from "@/services/branch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const BranchSetup: React.FC = () => {
  const { refreshUser, branch: currentBranch } = useAuth();
  const navigate = useNavigate();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const list = await listBranches();
      setBranches(list);
    } catch (err: any) {
      setError(err?.message || "Failed to load branches");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createBranch({ name, address, phone });
      setName("");
      setAddress("");
      setPhone("");
      await load();
      await refreshUser();
    } catch (err: any) {
      setError(err?.message || "Failed to create branch");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async (id: string) => {
    if (!confirm("Disable this branch?")) return;
    try {
      await disableBranch(id);
      await load();
    } catch (err: any) {
      setError(err?.message || "Failed to disable");
    }
  };

  return (
    <div className="p-4 grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Add a branch</CardTitle>
          <p className="text-sm text-muted-foreground">
            New branches are linked to your company automatically.
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Branch name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Creating..." : "Create branch"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
                Done
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Branches</CardTitle>
        </CardHeader>
        <CardContent>
          {branches.length === 0 && (
            <p className="text-sm text-muted-foreground">No branches yet.</p>
          )}
          <ul className="divide-y">
            {branches.map((b) => (
              <li key={b._id} className="py-3 flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium">
                    {b.name}
                    {b.isMainBranch && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                        main
                      </span>
                    )}
                    {currentBranch?._id === b._id && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">
                        active
                      </span>
                    )}
                    {b.isActive === false && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-700">
                        disabled
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {b.address || b.location || "—"} {b.phone ? `· ${b.phone}` : ""}
                  </div>
                </div>
                {b.isActive !== false && !b.isMainBranch && (
                  <Button size="sm" variant="outline" onClick={() => handleDisable(b._id)}>
                    Disable
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BranchSetup;
