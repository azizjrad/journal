"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout} disabled={loading}>
      <LogOut className="h-4 w-4 mr-2" />
      {loading ? "Logging out..." : "Logout"}
    </Button>
  );
}
