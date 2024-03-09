import { withRoleAuthProtection } from "@/lib/auth/guards";
import prisma from "@/lib/prisma";
import { timeSince } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page() {
  const user = (await withRoleAuthProtection(["judge", "admin"])).user;
  if (!user) return notFound();
  const left_to_judge = await prisma.post.count({
    where: {
      Marks: { isNot: {} },
      title: { not: "**test**" },
    },
  });

  const judges_list =
    (user as any).role === "admin" &&
    (await prisma.user.findMany({
      where: {
        role: "judge",
      },
      select: {
        id: true,
        name: true,
        lastName: true,
        Judging: {
          select: {
            timeout: true,
          },
        },
        Marks: true,
      },
    }));

  const judgers_artworks =
    (user as any).role === "judge" &&
    (await prisma.$transaction([
      prisma.marks.findMany({
        where: {
          judge_id: user.id,
        },
        select: {
          id: true,
          post: true,
          sum: true,
          time: true,
        },
        take: 5,
      }),
      prisma.marks.count({
        where: {
          judge_id: user.id,
        },
      }),
    ]));

  return (
    <div>
      <header className="p-3 sm:p-5">
        <h1 className="text-2xl sm:text-4xl font-semibold">Judge Dashboard</h1>
        <h2 className="text-md sm:text-xl font-medium">
          {user?.name} {(user as any)?.lastName}
        </h2>
      </header>
      <div className="flex flex-col justify-center items-center">
        <div className="bg-green-50 py-5 my-5  w-full box-border flex items-center flex-col ring-1 ring-green-100">
          <div className="text-8xl font-semibold text-[#162f2f]">
            {left_to_judge}
          </div>
          <div className="text-center">Artworks left to judge</div>
          {(user as any).role === "judge" && (
            <Link
              href="/judge/artworks"
              className="bg-[#2a726f] hover:bg-opacity-90 transition-opacity text-white px-5 py-1.5 mt-6 mb-3 rounded-md"
            >
              Judge Artwork
            </Link>
          )}
        </div>
      </div>
      {judges_list && (
        <div className="sm:px-5 my-10">
          <div className="px-2 sm:px-0">
            <h2 className="text-2xl font-semibold ">Judges online </h2>
            <p className="text-sm px-1">
              {judges_list.filter((i) => i.Judging.length != 0).length} working
              of {judges_list.length} judges.
            </p>
          </div>{" "}
          <div className="my-5">
            {judges_list.map((i) => (
              <Link
                key={i.id}
                className="flex gap-6 px-3 sm:px-4 my-1 py-1.5 hover:bg-green-50/60 outline-none focus:bg-green-50 focus:ring-1 ring-[#e6f1eafc] transition-colors rounded"
                href={`/judges/${i.id}`}
              >
                <div className="bg-green-100 p-3 rounded-lg text-green-800 ">
                  <svg width="1.7em" height="1.7em" viewBox="0 0 24 24">
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="8" r="5"></circle>
                      <path d="M20 21a8 8 0 1 0-16 0"></path>
                    </g>
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">
                    {i.name} {i.lastName}
                  </div>
                  <div className="flex gap-2 items-center text-xs">
                    <div className="">{i.Marks.length} Artworks</div>
                    {i.Judging[0] && (
                      <div className="bg-green-100/60 text-green-900/90 rounded-full px-3 py-0.5 border border-[#5e927352]">
                        {timeSince(i.Judging[0]?.timeout, 1000 * 60 * 5)} ago
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      {judgers_artworks && (
        <div className="sm:px-5 my-10">
          <div className="px-2 sm:px-0">
            <h2 className="text-2xl font-semibold ">Judged By {user.name}</h2>
            <p className="text-sm">{judgers_artworks[1]} artworks </p>
          </div>
          <div className="my-5">
            {judgers_artworks[0].map((i) => (
              <Link
                key={i.id}
                className="flex gap-6 px-3 sm:px-4 my-1 py-1.5 hover:bg-green-50/60 outline-none focus:bg-green-50 focus:ring-1 ring-[#e6f1eafc] transition-colors rounded"
                href={`/judges/${user.id}/${i.id}`}
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
        </div>
      )}
    </div>
  );
}
export const dynamic = "force-dynamic";
