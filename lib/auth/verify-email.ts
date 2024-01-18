import { MailVerifyComponent } from "@/components/mail/verify-email";
import { sendMail } from "../mail/send-mail";
import prisma from "../prisma";
import { generateHashedPassword, generateRandomToken } from "./lib.auth";

export const SendEmailVerifyEmail = async (id: string, email: string) => {
  const otp = generateRandomToken();
  const expire = new Date();
  expire.setTime(expire.getTime() + 60 * 60 * 1000);

  const token = await prisma.otp.create({
    data: {
      user_id: id,
      otp: generateHashedPassword(otp),
      type: "email",
      for: "verify_email",

      expire,
    },
  });
  const url = new URL("https://gisla2024.vercel.app/auth/verify");
  url.searchParams.append("id", token.id);
  url.searchParams.append("user", id);
  url.searchParams.append("type", "email");
  url.searchParams.append("for", "verify_email");
  url.searchParams.append("token", otp);
  await sendMail(
    email,
    "GISLA 2024 Account Verification.",
    MailVerifyComponent(url.href, email)
  );
  return otp;
};
