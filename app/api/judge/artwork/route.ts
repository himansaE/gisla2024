import { withAPIAuthProtection } from "@/lib/auth/guards";
import prisma from "@/lib/prisma";
import {
  NewResponse,
  ResponseDone,
  ResponseError,
  getJsonBody,
} from "@/lib/request";
import { randomUUID } from "crypto";

const inputs = [
  "relevance",
  "creativity",
  "artistic",
  "clarity",
  "impact",
  "technical",
  "diversity",
  "accessibility",
  "content",
  "completeness",
];
type ReqBody = {
  post: string;
  token: string;
  vote: { [key: string]: number };
};

export async function POST(req: Request) {
  const user = await withAPIAuthProtection(["judge"]);
  if (user == false) return NewResponse(ResponseError("unauthorized", 401));
  if (!user.user) return NewResponse(ResponseError("unauthorized", 401));

  const [body_error, body] = await getJsonBody(req);
  if (body_error) return NewResponse(body);

  const [validate_error, data] = validate(body);
  if (validate_error) return NewResponse(data);

  // validate judge
  const judge = await prisma.judging.findFirst({
    where: {
      judge_id: user.user?.id,
      post_id: data.post,
    },
  });

  if (judge == null)
    return NewResponse(ResponseError("No Post found for this judge."));

  if (judge.token != data.token)
    return NewResponse(ResponseError("Invalid token."));

  // check if post already judged

  const marks = await prisma.marks.findFirst({
    where: {
      post_id: data.post,
    },
  });
  if (marks != null) return NewResponse(ResponseError("Post already judged."));

  // make the marks

  await prisma.marks.create({
    data: {
      post_id: data.post,
      judge_id: user.user?.id,
      accessibility: data.vote.accessibility,
      relevance: data.vote.relevance,
      creativity: data.vote.creativity,
      artistic: data.vote.artistic,
      clarity: data.vote.clarity,
      impact: data.vote.impact,
      technical: data.vote.technical,
      diversity: data.vote.diversity,
      content: data.vote.content,
      completeness: data.vote.completeness,
      sum: data.sum,
    },
  });
  await prisma.judging.delete({
    where: {
      judge_id: user.user.id,
    },
  });
  // limit judge to  posts 53
  const judge_post_count = await prisma.marks.count({
    where: {
      judge_id: user.user.id,
    },
  });

  if (judge_post_count >= 53) {
    return NewResponse(ResponseDone({ next: null }));
  }
  const new_post = await prisma.post.findFirst({
    where: {
      title: { not: "**test**" },
      Marks: null,
      Judging: null,
    },
    select: {
      id: true,
    },
  });

  if (new_post != null) {
    await prisma.judging.upsert({
      where: {
        judge_id: user.user.id,
      },
      update: {
        post_id: new_post.id,
        timeout: new Date(new Date().getTime() + 1000 * 60 * 5),
        judge_id: user.user.id,
      },
      create: {
        post_id: new_post.id,
        timeout: new Date(new Date().getTime() + 1000 * 60 * 5),
        judge_id: user.user.id,
        token: btoa(randomUUID()),
      },
    });

    return NewResponse(
      ResponseDone({
        next: new_post.id,
      })
    );
  }
  return NewResponse(ResponseDone({ next: null }));
}

const validate = (
  data: ReqBody
): [true, ResponseError] | [false, ReqBody & { sum: number }] => {
  if (!(typeof data.post === "string" && /^[0-9a-f]{24}$/i.test(data.post)))
    return [true, ResponseError("Invalid post id.", "all")];
  if (typeof data.token != "string")
    return [true, ResponseError("token is missing.", "all")];

  if (typeof data.vote != "object")
    return [true, ResponseError("Something went wrong.", "all")];

  let sum = 0;
  for (const i of inputs) {
    if (
      !(
        typeof data.vote[i] === "number" &&
        data.vote[i] >= 0 &&
        data.vote[i] <= 10
      )
    )
      return [true, ResponseError("vote should be between 0-10.", i)];
    sum += data.vote[i];
  }
  return [false, { ...data, sum }];
};
