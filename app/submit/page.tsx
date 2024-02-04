import { SubmitClient } from "@/components/submit/submit-client";
import { Center } from "@/components/ui/center";
import { withAuthProtection } from "@/lib/auth/guards";
import { font_poppins_one } from "@/lib/font";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import type { Session, User } from "next-auth";

export const metadata: Metadata = {
  title: "Submit Artwork | GISLA 2024",
};

export default async function Page() {
  const session = (await withAuthProtection()) as Session;
  const user = session.user as User;

  const [posts_count, draft] = await prisma.$transaction([
    prisma.post.count({ where: { user_id: user.id } }),
    prisma.draft.findFirst({
      where: {
        user_id: user.id,
      },
    }),
  ]);

  if (posts_count >= 3) {
    return (
      <div>
        <div className="text-center my-10">
          You already Submitted 3 Artworks
        </div>
      </div>
    );
  }

  return (
    <section
      className={`${font_poppins_one.className} min-h-screen bg-bg-main-2/5 py-8`}
    >
      <Center maxWidth="1300px" className="px-3 xsm:px-5">
        <h1 className="text-3xl font-semibold">
          GISLA 2024 AI ART COMPETITION
        </h1>
        <p className="">{3 - posts_count} Submissions left.</p>
        <SubmitClient user={user} draft_id={draft?.id} img_url={draft?.url} />
      </Center>
    </section>
  );
}

async function SubmissionClose() {
  return (
    <section
      className={`${font_poppins_one.className} min-h-screen bg-bg-main-2/5 py-8`}
    >
      <Center maxWidth="1300px" className="px-3 xsm:px-5">
        <h1 className="text-3xl font-semibold">
          GISLA 2024 AI ART COMPETITION
        </h1>
        <p className="text-center py-40"> Submissions Closed.</p>
      </Center>
    </section>
  );
}
