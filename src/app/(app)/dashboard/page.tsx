"use client";

import React from "react";
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
    <div>Dashboard - Welcome {session.user?.name || session.user?.username}</div>
  );
}

export default Page;
