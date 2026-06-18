import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { JSX } from "react";
import type { Role } from "@/services/auth";

/**
 * Generic RBAC gate.
 *
 *   <RoleGuard allow={["admin","branch-manager"]}>...</RoleGuard>
 *
 * super-admin always passes. If the user is logged out, redirects to /login.
 * If logged in but missing the role, redirects to /dashboard.
 */
type Props = {
  children: JSX.Element;
  allow: Role[];
  fallback?: string;
};

const RoleGuard = ({ children, allow, fallback = "/dashboard" }: Props) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "super-admin") return children;
  if (!allow.includes(user.role)) return <Navigate to={fallback} replace />;
  return children;
};

export default RoleGuard;
