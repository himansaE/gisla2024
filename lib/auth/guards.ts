import { notFound, redirect } from "next/navigation";
import { auth } from "./auth";

export async function withAuthProtection(
  redirect_path?: string,
  need_email_validated: boolean = true
) {
  const user = await auth();

  if (user?.user) {
    if (need_email_validated && (user.user as any).emailVerified == null) {
      redirect("/auth/verify-email");
    }
    return user;
  }
  redirect(redirect_path ?? "/auth/login");
}
export async function withRoleAuthProtection(role?: string[] | string) {
  const user = await withAuthProtection();
  if (
    role == undefined ||
    (typeof role === "string" && (user.user as any).role === role) ||
    (Array.isArray(role) && role.includes((user.user as any).role))
  )
    return user;
  return notFound();
}
export async function withAPIAuthProtection(
  role?: string[] | string,
  need_email_validated: boolean = true
) {
  const user = await auth();
  if (user?.user) {
    if (need_email_validated && (user.user as any).emailVerified == null)
      return false;
    if (
      role == undefined ||
      (typeof role === "string" && (user.user as any).role === role) ||
      (Array.isArray(role) && role.includes((user.user as any).role))
    )
      return user;
  }
  return false;
}

export async function blockAuth(redirect_path?: string) {
  const user = await auth();
  if (user?.user) redirect(redirect_path ?? "/");
}
