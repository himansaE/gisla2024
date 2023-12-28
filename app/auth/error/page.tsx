import { RedirectType, redirect } from "next/navigation";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  if (searchParams["error"] == "AuthError") {
    return redirect("/auth/login?error=AuthError", RedirectType.replace);
  }

  return <></>;
}
