import { withRoleAuthProtection } from "@/lib/auth/guards";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";
import Link from "next/link";
import { notFound, redirect, RedirectType } from "next/navigation";

export default async function Page() {
  const user = await withRoleAuthProtection(["judge"]);
  if (!user.user) return notFound();

  // limit judge to  posts 53
  const judge_post_count = await prisma.marks.count({
    where: {
      judge_id: user.user.id,
    },
  });

  if (judge_post_count >= 53) {
    return <Render />;
  }

  // check if old opened post available
  const old_opened_post = await prisma.judging.findFirst({
    where: {
      judge_id: user.user.id,
      post: {
        Marks: undefined,
      },
    },
  });

  if (old_opened_post != null) {
    redirect(
      `/judge/artworks/${old_opened_post.post_id}`,
      RedirectType.replace
    );
  }

  // came here because no old opened posts for this judge

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
    return redirect(`/judge/artworks/${new_post.id}`, RedirectType.replace);
  }
  return <Render />;
}
const Render = () => {
  return (
    <div>
      <header className="p-3 sm:p-5">
        <h1 className="text-2xl sm:text-4xl font-semibold">
          All Artworks Judged!
        </h1>
      </header>
      <div className="flex flex-col justify-center items-center">
        <div className="bg-green-50 py-5 my-5  w-full box-border flex items-center flex-col ring-1 ring-green-100">
          <div className="text-center px-5 md:px-28">
            <div className="my-2 text-2xl font-semibold">
              Thank for Judging the artworks.
            </div>
            <div className="my-3">
              Your dedication and expertise are greatly appreciated. <br /> Stay
              tuned for the announcement of the winner.
            </div>
          </div>
          <Link
            href="/judge/"
            className="bg-[#2a726f] hover:bg-opacity-90 transition-opacity text-white px-5 py-1.5 m-3 rounded-md"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};
