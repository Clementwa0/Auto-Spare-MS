import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { JSX } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, branches, activeBranchId } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace />;

  // Multi-branch users land on /select-branch until they pick one.
  const onSelect = location.pathname.startsWith("/select-branch");
  const onSetup = location.pathname.startsWith("/branch/setup");
  if (branches.length > 1 && !activeBranchId && !onSelect && !onSetup) {
    return <Navigate to="/select-branch" replace />;
  }

  return children;
};

export default ProtectedRoute;
