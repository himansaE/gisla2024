import { withAuthProtection } from "@/lib/auth/guards";
import { SendEmailVerifyEmail } from "@/lib/auth/verify-email";
import { redirect } from "next/navigation";
import { ResendButton } from "./client";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user: any = (await withAuthProtection("/auth/login", false)).user;

  if (user.emailVerified) redirect("/");

  if (searchParams["retry"] == "true") {
    await SendEmailVerifyEmail(user.id, user.email);
    redirect("/auth/verify-email");
  }

  return (
    <div className="w-full py-10 px-3">
      <h1 className="text-3xl font-semibold">Verify your Email Address</h1>
      <div className="flex justify-center items-center flex-col gap-8 my-16 py-14 px-4 text-center bg-bg-main-2/10">
        <div className="text-base font-normal ">
          We sent a your email verification link to your Email{" "}
          <b className="font-semibold [overflow-wrap:anywhere]">{user.email}</b>
          <br />
          Check your inbox and click Verify Email.
        </div>
        <ResendButton id={user.id} email={user.email} />
      </div>
    </div>
  );
}
