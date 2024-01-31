"use server";

import { Post } from "@/app/artworks/client";
import { CardLoading } from "@/app/artworks/loading";
import prisma from "@/lib/prisma";

export async function MoreByUser(props: {
  id: string;

  curr_id: string;
}) {
  const data = await prisma.post.findMany({
    where: { user_id: props.id, id: { not: props.curr_id } },
    take: 3,
  });

  if (data.length == 0)
    return (
      <p className="mx-10 py-5 block text-black/50 italic">
        This User doesn&apos;t have any other posts.
      </p>
    );
  return (
    <div className="flex flex-wrap md:flex-row flex-col items-center md:justify-start gap-4 md:mx-10  md:gap-10 py-4 px-2">
      {data.map((i) => (
        <Post
          key={i.id}
          id={i.id}
          title={i.title}
          image_link={i.image_link}
          name={i.created_using}
        />
      ))}
    </div>
  );
}

export async function LoadingMoreBy() {
  return (
    <div className="flex flex-wrap md:flex-row flex-col items-center md:justify-start gap-4 md:mx-10  md:gap-10 py-4 px-2">
      <CardLoading />
      <CardLoading />
    </div>
  );
}
