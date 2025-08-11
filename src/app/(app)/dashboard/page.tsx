"use client";

import React from "react";
import Header from "@/components/localcomponents/Header";
import { useSession } from "next-auth/react";

function Page() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading session...</p>;
  }

  if (!session) {
    return <p>User not signed in</p>;
  }

  console.log("User:", session.user);

  return (
    <div className="flex justify-center items-center w-full h-[75vh]">
      <main className="">
        Dashboard - Welcome {session.user?.name || session.user?.username}
      </main>
    </div>
  );
}

export default Page;
