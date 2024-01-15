import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { NavBarClient } from "./client";

export const NavBar = async () => {
  const user = await auth();
  const heads = headers();
  let pathname = heads.get("next-url");

  return <NavBarClient user={user} url={pathname ?? "/"} />;
};
