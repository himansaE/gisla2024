import { withAuthProtection } from "@/lib/auth/guards";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function Page() {
  const user = await withAuthProtection();
  const posts = await prisma.post.findMany({
    where: {
      user_id: user.user?.id,
    },
  });
  const p = [];
  return (
    <div className="px-3 py-7">
      <h1 className="text-3xl font-semibold">Your submitted Artworks.</h1>
      <p className="text-sm text-gray-700">
        You have {3 - posts.length} submissions left.
      </p>
      <div>
        {posts.length == 0 ? (
          <div className="flex justify-center items-center flex-col gap-8 my-10 py-10 px-4 text-center bg-bg-main-2/10">
            <div className="text-lg font-semibold ">
              You don&apos;t have any Artwork submitted.
              <br /> Let&apos;s try your first submission.
            </div>
            <Link
              href="/submit"
              className="bg-bg-main-2 px-3 py-2 text-white rounded-lg"
            >
              Submit now
            </Link>
          </div>
        ) : (
          <div>{}</div>
        )}
      </div>
    </div>
  );
}
