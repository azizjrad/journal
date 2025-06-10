"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/admin-auth";

export function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      className="text-white border-red-400/30 bg-red-600/20 backdrop-blur-sm hover:bg-red-600/30 hover:border-red-400/50 hover:text-white transition-all duration-200"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  );
}
