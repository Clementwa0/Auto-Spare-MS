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
  Login,
  POSPage,
  ProtectedRoute,
  CreateUser,
} from "@/components/index";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Admin-only routes */}
            <Route
              path="/users/create"
              element={
                <AdminRoute>
                  <CreateUser />
                </AdminRoute>
              }
            />
            <Route
              path="/parts/new"
              element={
                <AdminRoute>
                  <PartForm />
                </AdminRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <AdminRoute>
                  <CategoryList />
                </AdminRoute>
              }
            />
            <Route
              path="/suppliers"
              element={
                <AdminRoute>
                  <SupplierList />
                </AdminRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <AdminRoute>
                  <InventoryReport />
                </AdminRoute>
              }
            />
            <Route
              path="/reports/low-stock"
              element={
                <AdminRoute>
                  <LowStockReport />
                </AdminRoute>
              }
            />

            {/* Shared routes (Admin + Sales) */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/parts" element={<PartsList />} />
            <Route path="/pos-sale" element={<POSPage/>}/>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
