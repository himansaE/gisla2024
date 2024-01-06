export const dynamic = "force-dynamic";

import { signOut } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

async function signout(req: Request) {
  try {
    await signOut({
      redirectTo: "/",
    });
  } catch (e) {}
  return redirect("/");
}

export { signout as GET };
