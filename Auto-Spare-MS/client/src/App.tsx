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
} from "@/components/index";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";

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
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/parts" element={<PartsList />} />
            <Route path="/parts/new" element={<PartForm />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/suppliers" element={<SupplierList />} />
            <Route path="/reports" element={<InventoryReport />} />
            <Route path="/reports/low-stock" element={<LowStockReport />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
