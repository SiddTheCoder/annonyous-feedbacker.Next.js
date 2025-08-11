"use client";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "../ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function Header() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="w-[95%] mx-auto my-2 rounded-md flex justify-between items-center p-4 bg-white shadow-2xl text-black">
      <h1 className="text-lg font-bold">Anonymous Feedbacker</h1>
      {!user && (
        <Button
          onClick={() => router.replace("/sign-up")}
          className="bg-slate-950 hover:bg-slate-800 text-white hover:text-white"
          variant="outline"
        >
          Sign Up
        </Button>
      )}
      {user && (
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="bg-slate-950 hover:bg-slate-800 text-white hover:text-white"
          variant="outline"
        >
          Sign Out
        </Button>
      )}
    </div>
  );
}

export default Header;
