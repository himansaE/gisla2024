import { withRoleAuthProtection } from "@/lib/auth/guards";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function Page() {
  const user = (await withRoleAuthProtection("judge")).user;
  const left_to_judge = await prisma.post.count({
    where: {
      Marks: { isNot: {} },
      title: { not: "**test**" },
    },
  });

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
          <Link
            href="/judge/artworks"
            className="bg-[#2a726f] hover:bg-opacity-90 transition-opacity text-white px-5 py-1.5 mt-6 mb-3 rounded-md"
          >
            Judge Artwork
          </Link>
        </div>
      </div>
    </div>
  );
}
