import {
  isAuthenticated,
  getCurrentUser,
  signOut,
} from "@/lib/actions/auth.action";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";

const Rootlayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  const user = await getCurrentUser();

  if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <div className="root-layout">
      <nav className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="logo" width={38} height={32} />
          <h2 className="text-primary-100 max-sm:text-sm">MockXpert </h2>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-slate-300">{user?.name}</span>
          <form action={signOut}>
            <Button
              type="submit"
              variant="outline"
              className="hover:bg-red-500/10 hover:text-red-500 cursor-pointer"
            >
              Logout
            </Button>
          </form>
        </div>
      </nav>
      {children}
    </div>
  );
};
export default Rootlayout;
