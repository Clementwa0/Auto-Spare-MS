import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

/**
 * /select-branch — shown when the user belongs to multiple branches and has
 * not picked an active one (or wants to switch from a dedicated page).
 *
 * If the user has exactly one branch, this page auto-selects it.
 * If the user has zero branches, redirects to /branch/setup.
 */
const BranchSelector = () => {
  const { branches, activeBranchId, switchBranch, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!branches || branches.length === 0) {
      navigate("/branch/setup", { replace: true });
      return;
    }
    if (branches.length === 1 && !activeBranchId) {
      switchBranch(branches[0]._id)
        .then(() => navigate("/dashboard", { replace: true }))
        .catch(() => {/* stay on page */});
    }
  }, [branches, activeBranchId, navigate, switchBranch]);

  const pick = async (id: string) => {
    await switchBranch(id);
    navigate("/dashboard", { replace: true });
  };

  if (!branches || branches.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <Building2 className="w-10 h-10 mx-auto text-blue-600" />
          <h1 className="mt-3 text-2xl font-semibold">Choose a branch</h1>
          <p className="text-sm text-muted-foreground">
            Hi {user?.name}, you have access to multiple branches. Pick one to
            continue. You can switch later from the navbar.
          </p>
        </div>
        <ul className="space-y-2">
          {branches.map((b) => {
            const active = b._id === activeBranchId;
            const disabled = b.isActive === false;
            return (
              <li key={b._id}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => pick(b._id)}
                  className={`w-full flex items-center justify-between rounded-lg border bg-white dark:bg-gray-800 px-4 py-3 text-left transition hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${active ? "border-blue-600 ring-2 ring-blue-100 dark:ring-blue-900" : ""}`}
                >
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {b.name}
                      {b.isMainBranch && (
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                          Main
                        </span>
                      )}
                      {disabled && (
                        <span className="text-xs px-2 py-0.5 rounded bg-red-50 text-red-700">
                          Disabled
                        </span>
                      )}
                    </div>
                    {b.address && (
                      <div className="text-xs text-muted-foreground">{b.address}</div>
                    )}
                  </div>
                  {active && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 text-center">
          <Button variant="ghost" onClick={() => navigate("/login")}>
            Back to login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BranchSelector;
