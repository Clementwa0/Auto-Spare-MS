import { useNavigate, useLocation } from "react-router-dom";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const getPageTitle = (pathname: string) => {
    const segments = pathname.split("/").filter(Boolean);
    return segments.length ? segments[segments.length - 1] : "Dashboard";
  };

  const title = getPageTitle(location.pathname);

  return (
    <header className="flex  justify-end md:flex items-center justify-between px-4 md:px-6 h-16 border-b bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm">
      {/* Left - Page Title */}
      <h1 className="hidden md:text-lg font-semibold capitalize text-gray-800 dark:text-white">
        {title}
      </h1>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="hidden md:block px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-sm text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700"
        />

        <Button size="icon" variant="ghost" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src="/srcy/assets/Admin.png" />
              <AvatarFallback>{user?.role}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/login")}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
