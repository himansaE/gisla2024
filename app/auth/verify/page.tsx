import { withAuthProtection } from "@/lib/auth/guards";
import { validatePassword } from "@/lib/auth/lib.auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = (await withAuthProtection("/auth/login", false))?.user;

  if (!user) return redirect("/");

  const { id, user: user_id, for: _for, type, token } = searchParams;

  const res = await validate(user, user_id, token, id, _for, type);
  const error = typeof res === "string";
  return (
    <div className="w-full py-10 px-3">
      <h1 className="text-3xl font-semibold">Verify your Email Address</h1>
      <div className="flex justify-center items-center flex-col gap-8 my-16 py-14 px-4 text-center bg-bg-main-2/10">
        <div className="text-base font-normal ">
          {error
            ? `Verify your Email address is Unsuccessful. `
            : "Email validation successful."}
          <br />
          {error && res}
        </div>
        <Link
          href={error ? "/auth/verify-email?retry=true" : "/"}
          className="bg-bg-main-2 hover:bg-bg-main-2/90 transition-colors px-6 py-2 rounded-md text-white"
        >
          {error ? "Retry" : "Continue"}{" "}
        </Link>
      </div>
    </div>
  );
}

const validate = async (
  user: any,
  user_id?: string,
  token?: string,
  id?: string,
  _for?: string,
  type?: string
): Promise<string | boolean> => {
  if (type != "email") return "Invalid link.";
  if (_for != "verify_email") return "Invalid link.";
  if (user.id != user_id) return "Invalid account for validation.";
  if (user.id != user_id) return "Invalid account for validation.";
  if (!/^[0-9a-f]{24}$/i.test(id ?? "")) return "Invalid token.";

  if (user.emailVerified != null) {
    return true;
  }
  const otp = await prisma.otp.findFirst({
    where: {
      id,
      user_id: user.id,
      for: _for,
      type,
    },
  });

  if (otp == null) return "No validation request found. Resend Link again.";
  if (otp.expire < new Date())
    return "Validation link is expired. Resend Link again.";

  if (otp.validate_count >= 5) {
    await prisma.otp.delete({
      where: {
        id,
        user_id: user.id,
        for: _for,
        type,
      },
    });
    return "Maximum validation retries reached. Resend new  validation link.";
  }

  if (!validatePassword(token ?? "", otp.otp)) {
    await prisma.otp.update({
      where: {
        id,
        user_id: user.id,
        for: _for,
        type,
      },
      data: {
        validate_count: { increment: 1 },
      },
    });

    return "Invalid token. Recheck your Email inbox for new links.";
  }

  await prisma.$transaction([
    prisma.otp.delete({
      where: {
        id,
        user_id: user.id,
        for: _for,
        type,
      },
    }),
    prisma.user.update({
      where: { id: user_id },
      data: {
        emailVerified: new Date(),
      },
    }),
  ]);
  return true;
};
