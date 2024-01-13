import { auth } from "@/lib/auth/auth";
import { NavBarClient } from "./client";

export const NavBar = async () => {
  const user = await auth();

  return <NavBarClient user={user} />;
};
