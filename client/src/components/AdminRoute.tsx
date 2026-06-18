import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { JSX } from "react";

// Legacy gate: admin or super-admin. Prefer <RoleGuard allow={[...]}/> for new code.
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin" && user.role !== "super-admin") {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default AdminRoute;
