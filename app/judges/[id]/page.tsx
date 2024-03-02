import { withRoleAuthProtection } from "@/lib/auth/guards";
import prisma from "@/lib/prisma";
import { timeSince } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  if (!/^[0-9a-f]{24}$/i.test(params.id)) {
    return notFound();
  }
  const user = await withRoleAuthProtection(["judge", "admin"]);
  if ((user.user as any)?.role === "judge" && params.id !== user.user?.id)
    return notFound();

  const [judge, posts, judgement] = await prisma.$transaction([
    prisma.user.findFirst({
      where: { id: params.id },
    }),
    prisma.marks.findMany({
      where: { judge_id: params.id },

      select: {
        post: {
          select: {
            id: true,
            title: true,
            image_link: true,
          },
        },
        sum: true,
        time: true,
      },
    }),
    prisma.judging.findFirst({ where: { judge_id: params.id } }),
  ]);
  if (judge?.role != "judge") return notFound();
  return (
    <main className="py-5 ">
      <header className="px-5">
        <h1 className="text-2xl sm:text-4xl font-semibold">
          Judged by {user.user?.name}
        </h1>
        {judgement && (
          <p className="text-xs sm:text-sm mt-1">
            Last seen {timeSince(judgement.timeout, 1000 * 60 * 5)} ago
          </p>
        )}
      </header>
      <div className="flex flex-col justify-center items-center my-6">
        <div className="bg-green-50 py-5 my-5  w-full box-border flex items-center flex-col ring-1 ring-green-100">
          <div className="text-8xl font-semibold text-[#162f2f]">
            {String(posts.length).padStart(2, "0")}
          </div>
          <div className="text-center">Artworks Judged</div>
          {(user.user as any).role === "judge" && (
            <Link
              href="/judge/artworks"
              className="bg-[#2a726f] hover:bg-opacity-90 transition-opacity text-white px-5 py-1.5 mt-6 mb-3 rounded-md"
            >
              Judge Artwork
            </Link>
          )}
        </div>
      </div>
      <div>
        {posts.length != 0 ? (
          <div className="sm:px-5 my-10">
            {posts.map((i) => (
              <Link
                key={i.post.id}
                className="flex gap-6 px-3 sm:px-4 my-1 py-1.5 hover:bg-green-50/60 outline-none focus:bg-green-50 focus:ring-1 ring-[#e6f1eafc] transition-colors rounded"
                href={`/judges/${user.user?.id}/${i.post.id}`}
              >
                <div className="bg-green-100 overflow-hidden rounded-lg text-green-800 ">
                  <Image
                    src={i.post.image_link}
                    alt=""
                    width={50}
                    height={50}
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="font-semibold line-clamp-1">
                    {i.post.title}
                  </div>
                  <div className="flex gap-4 items-center text-xs px-2">
                    <div className="  text-green-900/90 rounded-full  py-0.5">
                      {i.sum}%
                    </div>
                    <div className="bg-green-100/40 text-green-900/90 rounded-full px-3 py-0.5 border border-[#5e92731b]">
                      {timeSince(i.time, 1000 * 60 * 5)} ago
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <></>
        )}
      </div>
    </main>
  );
}
