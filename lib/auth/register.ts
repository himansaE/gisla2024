import prisma from "../prisma";
import { generateHashedPassword } from "./lib.auth";
import { authError, AuthResponse } from "./utils";
import { SendEmailVerifyEmail } from "./verify-email";

export async function registerWithPassword(
  fname: string,
  lname: string,
  email: string,
  pass: string
): Promise<AuthResponse> {
  if (typeof fname !== "string" || fname.trim() === "")
    return authError("Enter valid first name.", "first-name");

  if (typeof lname !== "string" || lname.trim() === "")
    return authError("Enter valid last name.", "last-name");

  if (
    typeof email !== "string" ||
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
  )
    return authError(
      "Invalid email. Please enter a valid email address.",
      "email"
    );
  if (typeof pass !== "string" || pass.length < 8)
    return authError(
      "Invalid password. Please enter a password with at least eight characters.",
      "password"
    );

  const existing_user = await prisma.user.findFirst({ where: { email } });
  if (existing_user)
    return authError(
      "Provided email is already in use. Please use a different email address or consider resetting your password if you forgot it.",
      "email"
    );

  try {
    const user = await prisma.user.create({
      data: {
        name: fname,
        lastName: lname,
        email: email,
        role: "user",
        providers: ["password"],
        Key: {
          create: {
            hashed_password: generateHashedPassword(pass),
          },
        },
      },
    });
    if (user.id) {
      await SendEmailVerifyEmail(user.id, user.email);
      return {
        done: true,
        user,
      };
    }
  } catch (e) {
    return authError(
      "Something went wrong. Please try again later or contact support if the issue persists.",
      "all"
    );
  }
  return authError(
    "Something went wrong. Please try again later or contact support if the issue persists.",
    "all"
  );
}
