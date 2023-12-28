import { validatePassword } from "@/lib/auth/lib.auth";
import prisma from "@/lib/prisma";
import { AuthResponse, authError } from "./utils";

const local_validate = ({ email, password }: LoginProps) => {
  // validate email
  if (
    !(
      typeof email === "string" &&
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    )
  )
    return ["Enter valid Email address.", "email"];
  if (!(typeof password === "string" && password.length >= 8))
    return [
      "Invalid password. Please check your password and try again",
      "password",
    ];
  return { email, password };
};

type LoginProps = {
  email: string;
  password: string;
  csrfToken: string;
};

export async function LoginUserAPI(body: LoginProps): Promise<AuthResponse> {
  //TODO add reCAPTCHA

  const validated_body = local_validate(body);

  if (Array.isArray(validated_body))
    return authError(validated_body[0], validated_body[1]);

  // find user
  const user = await prisma.user.findFirst({
    where: { email: validated_body.email },
  });
  if (user == null)
    return authError(
      "User not found. Please check your details or sign up for a new account."
    );

  if (!user.providers.includes("password"))
    return authError(
      "This user is associated with a Google account. Please use the 'Sign in with Google' option to log in."
    );

  const key = await prisma.key.findFirst({ where: { userId: user.id } });
  if (key === null) {
    return authError(
      "Something went wrong. Please try again later or contact support for assistance."
    );
  }

  // validate the password
  if (validatePassword(validated_body.password, key?.hashed_password)) {
    return { done: true, user };
  }

  return authError(
    "Invalid password. Please check your password and try again.",
    "password"
  );
}
