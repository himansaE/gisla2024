import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function withAuthProtection(redirect_path?: string) {
  const user = await auth();

  if (user?.user) return user;
  redirect(redirect_path ?? "/");
}

export async function blockAuth(redirect_path?: string) {
  const user = await auth();
  if (user?.user) redirect(redirect_path ?? "/");
}
