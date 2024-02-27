export const dynamic = "force-dynamic";

import { registerWithPassword } from "@/lib/auth/register";
import { NewAuthResponse, authError } from "@/lib/auth/utils";

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch (e) {}

  if (!body)
    return NewAuthResponse(
      authError(
        "Something went wrong. Please try again later or contact support if the issue persists."
      )
    );

    return  NewAuthResponse(
      authError(
        "Registration is closed."
      )
    );

  //TODO:: implement security

  const res = await registerWithPassword(
    body.fname,
    body.lname,
    body.email,
    body.password
  );

  return NewAuthResponse(res, 200);
}
