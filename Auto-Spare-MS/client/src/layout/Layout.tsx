import { Outlet } from "react-router-dom"

import { Header, Sidebar } from "@/components";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">
          <Outlet/>
        </main>
      </div>
    </div>
  );
};

export default Layout;
