export const dynamic = "force-dynamic";

import { s3UploadFile } from "@/lib/aws/s3";
import prisma from "@/lib/prisma";
import { NewResponse, ResponseDone, ResponseError } from "@/lib/request";
import { readFile } from "fs/promises";
import { cookies } from "next/headers";
import path from "path";
import sharp from "sharp";

export async function POST(req: Request) {
  //#region  get session token
  const token = cookies().get(
    process.env.AUTH_TOKEN_NAME ?? "authjs.session-token"
  )?.value;

  if (typeof token != "string")
    return NewResponse(ResponseError("Invalid session"), 401);
  //#endregion

  //#region validate input
  let formData;
  try {
    formData = await req.formData();
  } catch (e) {
    return NewResponse(ResponseError("Invalid Request"));
  }

  const file = formData.get("file");
  const user_id = formData.get("user");
  let draft_id = formData.get("draft_id");

  if (
    !(
      file instanceof File &&
      file.type.startsWith("image/") &&
      typeof user_id === "string"
    )
  ) {
    return NewResponse(ResponseError("Invalid Request."));
  }
  //#endregion

  // #region validated session token
  const db_token = await prisma.session.findFirst({
    where: {
      sessionToken: token,
      userId: user_id,
    },
  });

  if (!db_token)
    return NewResponse(ResponseError("invalid session token"), 401);
  if (db_token.expires < new Date())
    return NewResponse(
      ResponseError("Session expired. Please reload the page and try again.")
    );

  // #endregion

  // #region check user has 3 or more posts
  const post_count_for_user = await prisma.post.findMany({
    where: { user_id },
  });
  if (post_count_for_user?.length >= 3)
    return NewResponse(
      ResponseError("Maximum number of submissions has been reached.")
    );
  // #endregion

  const buffer = await file.arrayBuffer();

  // #region get metadata
  let metadata: sharp.Metadata;
  const overlay_metadata = { height: 199, width: 380 };

  try {
    metadata = await sharp(buffer).metadata();
  } catch (e) {
    return NewResponse(
      ResponseError(
        "Invalid image submitted. Please upload a valid image file."
      )
    );
  }

  const targetWidth = Math.floor(
    metadata.width ? metadata.width * 0.3 : overlay_metadata.width
  );
  const targetHeight = Math.floor(
    metadata.height ? metadata.height * 0.3 : overlay_metadata.height
  );

  const overlayAspectRatio = overlay_metadata.width / overlay_metadata.height;

  let newWidth, newHeight;

  if (targetWidth / overlayAspectRatio < targetHeight) {
    newWidth = targetWidth;
    newHeight = Math.floor(newWidth / overlayAspectRatio);
  } else {
    newHeight = targetHeight;
    newWidth = Math.floor(newHeight * overlayAspectRatio);
  }

  // #endregion

  // #region adding watermark
  const watermark = await readFile(
    path.resolve("public/images/GISLA FOR WATERMARK.png")
  );
  let final_buffer: Buffer;
  try {
    final_buffer = await sharp(buffer)
      .composite([
        {
          input: await sharp(watermark)
            .resize({ height: newHeight, width: newWidth })
            .toBuffer(),
          gravity: sharp.gravity.southeast,
        },
      ])
      .toBuffer();
  } catch (e) {
    return NewResponse(
      ResponseError(
        "Invalid image submitted. Please upload a valid image file."
      )
    );
  }
  // #endregion

  // #region unloading to aws
  const img_path = `images/img_${user_id}_${new Date().getTime()}.${file.name
    .split(".")
    .pop()}`;
  const aws_url = `https://${process.env.AWS_S3_BUCKET}.s3.ap-southeast-1.amazonaws.com/${img_path}`;

  try {
    await s3UploadFile(img_path, final_buffer, undefined, undefined, file.type);
    const res = await prisma.draft.upsert({
      create: {
        url: aws_url,
        user_id: user_id,
      },
      where: {
        user_id,
      },
      update: {
        url: aws_url,
      },
    });
    draft_id = res.id;
  } catch (e) {
    return NewResponse(
      ResponseError("Something went wrong. Please try again later.")
    );
  }
  // #endregion
  return NewResponse(ResponseDone({ url: aws_url, draft_id }));
}
