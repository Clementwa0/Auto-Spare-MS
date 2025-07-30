import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import {
  DashboardPage,
  PartsList,
  PartForm,
  SupplierList,
  InventoryReport,
  LowStockReport,
  NotFound,
  Layout,
} from "@/components/index";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout/>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/parts" element={<PartsList />} />
        <Route path="/parts/new" element={<PartForm />} />
        <Route path="/suppliers" element={<SupplierList />} />
        <Route path="/reports" element={<InventoryReport />} />
        <Route path="/reports/low-stock" element={<LowStockReport />} />
        <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
