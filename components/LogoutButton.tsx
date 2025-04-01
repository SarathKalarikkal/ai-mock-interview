"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signOut } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      router.push("/sign-in");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      className="ml-auto"
    >
      Logout
    </Button>
  );
};

export default LogoutButton; 