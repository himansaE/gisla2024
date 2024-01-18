import { SendEmailVerifyEmail } from "@/lib/auth/verify-email";
import prisma from "@/lib/prisma";
import {
  NewResponse,
  ResponseDone,
  ResponseError,
  getJsonBody,
} from "@/lib/request";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  // #region get req body
  const [body_error, data] = await getJsonBody(req);
  if (body_error) return NewResponse(data, 400);

  // #endregion

  //#region  get session token
  const token = cookies().get(
    process.env.AUTH_TOKEN_NAME ?? "authjs.session-token"
  )?.value;
  if (typeof token != "string") return NewResponse(null, 401);
  //#endregion

  // #region validate input
  const user_id = data["user"];
  let email = data["email"];

  if (typeof user_id != "string" || typeof email != "string")
    return NewResponse(null, 403);

  // #endregion

  // #region validate session
  const db_token = await prisma.session.findFirst({
    where: {
      sessionToken: token,
      userId: user_id,
    },
  });
  if (!db_token) return NewResponse(null, 401);
  if (db_token.expires < new Date())
    return NewResponse(
      ResponseError("Session expired. Please reload the page and try again.")
    );

  // #endregion

  // #region Check user already validated
  const user = await prisma.user.findFirst({
    where: {
      id: user_id,
      email: email,
    },
  });
  if (user == null)
    return NewResponse(ResponseError("User not found on the database."));
  if (user.emailVerified != null) {
    NewResponse(ResponseError("Email address is validated.", "refresh"));
  }
  // #endregion

  // #region Send email
  try {
    await SendEmailVerifyEmail(user.id, user.email);
    return NewResponse(ResponseDone());
  } catch (e) {
    console.log(e);
  }
  return NewResponse(
    ResponseError("Something went wrong while sending Email.")
  );
  // #endregion
}
