import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import {
  DashboardPage,
  PartsList,
  PartForm,
  CategoryList,
  SupplierList,
  InventoryReport,
  LowStockReport,
  NotFound,
  Layout,
  AdminRoute,
  RoleGuard,
  Login,
  Register,
  BranchSetup,
  BranchSelector,
  CompanySettings,
  UsersPage,
  POSPage,
  ProtectedRoute,
  CreateUser,
} from "@/components/index";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "@/components/ui/sonner";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster richColors position="top-right" />
        <Routes>
          {/* PUBLIC */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Branch selection sits OUTSIDE the main layout (no sidebar). */}
          <Route
            path="/select-branch"
            element={
              <ProtectedRoute>
                <BranchSelector />
              </ProtectedRoute>
            }
          />

          {/* PROTECTED MAIN LAYOUT */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Onboarding — bootstrap admin creates first branch */}
            <Route
              path="/branch/setup"
              element={
                <AdminRoute>
                  <BranchSetup />
                </AdminRoute>
              }
            />

            {/* Branch management (admins) */}
            <Route
              path="/branches"
              element={
                <RoleGuard allow={["admin"]}>
                  <BranchSetup />
                </RoleGuard>
              }
            />

            {/* User management (admins) */}
            <Route
              path="/users"
              element={
                <RoleGuard allow={["admin"]}>
                  <UsersPage />
                </RoleGuard>
              }
            />
            <Route
              path="/users/create"
              element={
                <RoleGuard allow={["admin"]}>
                  <CreateUser />
                </RoleGuard>
              }
            />

            {/* Company settings (admins) */}
            <Route
              path="/company-settings"
              element={
                <RoleGuard allow={["admin"]}>
                  <CompanySettings />
                </RoleGuard>
              }
            />

            {/* Inventory — admin + storekeeper */}
            <Route
              path="/parts/new"
              element={
                <RoleGuard allow={["admin", "storekeeper", "branch-manager"]}>
                  <PartForm />
                </RoleGuard>
              }
            />
            <Route
              path="/categories"
              element={
                <RoleGuard allow={["admin", "storekeeper", "branch-manager"]}>
                  <CategoryList />
                </RoleGuard>
              }
            />
            <Route
              path="/suppliers"
              element={
                <RoleGuard allow={["admin", "storekeeper", "branch-manager"]}>
                  <SupplierList />
                </RoleGuard>
              }
            />

            {/* Reports — admin + branch-manager */}
            <Route
              path="/reports"
              element={
                <RoleGuard allow={["admin", "branch-manager"]}>
                  <InventoryReport />
                </RoleGuard>
              }
            />
            <Route
              path="/reports/low-stock"
              element={
                <RoleGuard allow={["admin", "branch-manager"]}>
                  <LowStockReport />
                </RoleGuard>
              }
            />

            {/* Shared — any authenticated user */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/parts" element={<PartsList />} />
            <Route
              path="/pos-sale"
              element={
                <RoleGuard
                  allow={["admin", "branch-manager", "cashier", "sales"]}
                >
                  <POSPage />
                </RoleGuard>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
