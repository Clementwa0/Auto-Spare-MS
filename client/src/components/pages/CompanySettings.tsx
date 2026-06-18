import { useEffect, useState } from "react";
import { Building2, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { toast } from "sonner";

/**
 * /company-settings — read-only-by-default panel for the admin to view and
 * (optionally) edit their company profile. Branch management lives under
 * /branches; user management under /users.
 */
const CompanySettings = () => {
  const { company, refreshUser, user } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (company) {
      setForm({
        name: company.name || "",
        email: company.email || "",
        phone: company.phone || "",
        address: company.address || "",
      });
    }
  }, [company]);

  const canEdit = user?.role === "admin" || user?.role === "super-admin";

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    setSaving(true);
    try {
      await api.put(`/companies/${company._id}`, form);
      await refreshUser();
      toast.success("Company updated");
    } catch (err: any) {
      toast.error(err?.message || "Update failed (endpoint may not exist yet)");
    } finally {
      setSaving(false);
    }
  };

  if (!company) {
    return (
      <div className="p-6 flex items-center gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading company...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="w-6 h-6 text-blue-600" />
        <h1 className="text-xl font-semibold">Company Settings</h1>
      </div>

      <form onSubmit={onSave} className="space-y-4">
        <div>
          <Label>Company name</Label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            disabled={!canEdit}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Email</Label>
            <Input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={!canEdit}
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              disabled={!canEdit}
            />
          </div>
        </div>
        <div>
          <Label>Address</Label>
          <Input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            disabled={!canEdit}
          />
        </div>

        {canEdit && (
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        )}
      </form>
    </div>
  );
};

export default CompanySettings;
