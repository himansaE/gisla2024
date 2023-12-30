import { signOut } from "@/lib/auth/auth";

function signout(req: Request) {
  signOut({
    redirectTo: "/",
  });
}

export { signOut as GET };
