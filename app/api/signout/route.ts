import { signOut } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

function signout(req: Request) {
  signOut({
    redirectTo: "/",
  });
  return redirect("/");
}

export { signout as GET };
