export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { NewResponse, ResponseDone, ResponseError } from "@/lib/request";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  //#region  get session token
  const token = cookies().get(
    process.env.AUTH_TOKEN_NAME ?? "authjs.session-token"
  )?.value;

  if (typeof token != "string") return NewResponse(null, 401);
  //#endregion

  //#region validate input
  let data;
  try {
    data = await req.json();
  } catch (e) {
    return NewResponse(ResponseError("Invalid Request"));
  }

  const user_id = data["user"];
  let draft_id = data["draft"];

  let post_data = {
    title: data["title"],
    des: data["des"],
    prompt: data["prompt"],
    used: data["used"],
  };

  const validated = validate_input(data, user_id, draft_id);

  if (validated != undefined) return NewResponse(ResponseError(validated));

  //#endregion

  // #region validated session token
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

  // #region check user has 3 or more posts
  const post_count_for_user = await prisma.post.count({
    where: { user_id },
  });
  if (post_count_for_user >= 3)
    return NewResponse(
      ResponseError("Maximum number of submissions has been reached.")
    );
  // #endregion

  // #region get the draft from db
  const draft = await prisma.draft.findFirst({
    where: { id: draft_id, user_id },
  });

  if (draft == null)
    return NewResponse(
      ResponseError("Current draft could not find on the server.")
    );
  // #endregion

  // #region submit post
  const post = await prisma.post.create({
    data: {
      user_id,
      image_link: draft?.url,
      prompt: post_data.prompt,
      created_using: post_data.used,
      title: post_data.title,
      des: post_data.des,
    },
  });

  if (post == null)
    return NewResponse(
      ResponseError("Submission unsuccessful. Try again later.")
    );
  // #endregion

  // #region delete old draft
  await prisma.draft.delete({
    where: {
      id: draft_id,
      user_id,
    },
  });
  // #endregion

  return NewResponse(ResponseDone({ id: post.id }));
}

const validate_input = (
  data: { [key: string]: string | null },
  user_id?: string,
  draft_id?: string
) => {
  for (const key in data) {
    if (typeof data[key] !== "string" || data[key]?.trim() == "") {
      return "All fields are required";
    }
    if (typeof user_id !== "string" || typeof draft_id !== "string")
      return "Error occurred in the server.";
  }
};
