import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listUsers, deleteUser, type AppUser } from "@/services/user";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, UserPlus, Shield } from "lucide-react";
import { toast } from "sonner";

/**
 * /users — company-scoped user list. Shows each user's role and the branches
 * they are members of. Admins can deactivate or delete users in their company.
 */
const UsersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  const canManage = user?.role === "admin" || user?.role === "super-admin";

  const load = async () => {
    setLoading(true);
    try {
      setUsers(await listUsers());
    } catch (e: any) {
      toast.error(e?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      toast.success("User deleted");
      load();
    } catch (e: any) {
      toast.error(e?.message || "Delete failed");
    }
  };

  const branchNames = (u: AppUser) => {
    if (!u.branches || u.branches.length === 0) return "—";
    return u.branches
      .map((b) => (typeof b === "string" ? b : b.name))
      .join(", ");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h1 className="text-xl font-semibold">Users</h1>
        </div>
        {canManage && (
          <Button onClick={() => navigate("/users/create")}>
            <UserPlus className="w-4 h-4 mr-2" /> New user
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading users...
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900 text-left">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Branches</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="px-4 py-2 font-medium">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">
                    <span className="inline-block px-2 py-0.5 text-xs rounded bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs">{branchNames(u)}</td>
                  <td className="px-4 py-2">
                    {u.isActive === false ? (
                      <span className="text-red-600 text-xs">disabled</span>
                    ) : (
                      <span className="text-green-600 text-xs">active</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {canManage && u._id !== user?._id && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(u._id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                    No users yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
