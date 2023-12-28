import { registerWithPassword } from "@/lib/auth/register";
import { NewResponse, authError } from "@/lib/auth/utils";

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch (e) {}

  if (!body)
    return NewResponse(
      authError(
        "Something went wrong. Please try again later or contact support if the issue persists."
      )
    );

  //TODO:: implement security

  const res = await registerWithPassword(
    body.fname,
    body.lname,
    body.email,
    body.password
  );

  return NewResponse(res, 200);
}
