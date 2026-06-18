import { ChevronDown, Check, Building } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/**
 * Global branch switcher. Sits in the navbar; visible whenever the user has
 * 2+ branches. Switching calls /auth/switch-branch and refreshes scoped data
 * via React state — no logout required.
 */
const BranchSwitcher = () => {
  const { branches, activeBranchId, switchBranch, branch } = useAuth();
  const navigate = useNavigate();

  if (!branches || branches.length === 0) return null;

  const handlePick = async (id: string) => {
    if (id === activeBranchId) return;
    try {
      await switchBranch(id);
      toast.success("Branch switched");
      // Force the current page to reload its branch-scoped data.
      navigate(0 as never);
    } catch (e: any) {
      toast.error(e?.message || "Failed to switch branch");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border bg-white dark:bg-gray-800 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          <Building className="w-4 h-4 text-blue-600" />
          <span className="font-medium max-w-[160px] truncate">
            {branch?.name || "Select branch"}
          </span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[240px]">
        <DropdownMenuLabel>Switch branch</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {branches.map((b) => (
          <DropdownMenuItem
            key={b._id}
            onClick={() => handlePick(b._id)}
            disabled={b.isActive === false}
            className="flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              {b.name}
              {b.isMainBranch && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  Main
                </span>
              )}
            </span>
            {b._id === activeBranchId && <Check className="w-4 h-4 text-blue-600" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BranchSwitcher;
