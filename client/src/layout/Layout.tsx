import { Outlet } from "react-router-dom";

import { Header, Sidebar } from "@/components";

const Layout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto py-6 md:px-6 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
