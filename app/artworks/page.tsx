import prisma from "@/lib/prisma";
import { AtSign } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RedirectType, redirect } from "next/navigation";
import {
  ArtworkPagination,
  POST_PER_PAGE,
  getPaginationItems,
} from "./Pagination";

export const metadata: Metadata = {
  title: "Artworks Gallery | GISLA 2024",
};

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  let page: number;

  try {
    page = Number(searchParams.page ?? "1");
    if (page < 1 || isNaN(page))
      return redirect("/artworks?page=1", RedirectType.replace);
  } catch (e) {
    return redirect("/artworks?page=1", RedirectType.replace);
  }
  const post_count = await prisma.post.count({
    where: {
      title: { not: "**test**" },
    },
  });

  const [pages, total_pages] = getPaginationItems(page, post_count);
  if (page > total_pages) {
    return redirect(`/artworks?page=${total_pages}`, RedirectType.replace);
  }
  const posts = await prisma.post.findMany({
    where: {
      title: { not: "**test**" },
    },
    orderBy: {
      created_on: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          lastName: true,
        },
      },
    },
    take: POST_PER_PAGE,
    skip: POST_PER_PAGE * (page - 1),
  });

  return (
    <>
      <div className="flex flex-wrap justify-center gap-4  md:gap-10 py-9 px-2">
        {posts.map((i) => (
          <Post {...i} key={i.id} />
        ))}
      </div>
      <ArtworkPagination page={page} pages={pages} total_pages={total_pages} />
    </>
  );
}

const Post = (
  post: {
    id: string;
    user_id: string;
    image_link: string;
    prompt: string;
    title: string;
    des: string;
    created_using: string;
    created_on: Date;
    state: string;
    fb_link: string | null;
    voted: boolean;
    marks: number | null;
  } & {
    user: {
      name: string;
      lastName: string | null;
    };
  }
) => (
  <Link
    href={`/artwork/${post.id}`}
    className="group border border-gray-300 p-2 rounded-lg max-w-full"
  >
    <div className="flex w-72 items-center justify-center max-w-full rounded-md overflow-hidden bg-bg-main-2/10 supports-[not(aspect-ratio:1/1)]:h-72 aspect-square">
      <Image
        src={post.image_link}
        height={300}
        width={300}
        className="object-contain max-w-full "
        alt={`image - ${post.title}`}
        unoptimized
      />
    </div>
    <div className="flex flex-col w-72 max-w-full my-2 px-1">
      <div className="overflow-hidden truncate group-hover:underline">
        {post.title}
      </div>
      <div className="flex justify-center items-center gap-1 text-gray-900 bg-slate-200 rounded-lg w-fit max-w-full text-xs pr-3 pl-2 py-0.5 overflow-hidden truncate min-w-0">
        <AtSign size={"1em"} />
        {post.user.name} {post.user.lastName}
      </div>
    </div>
  </Link>
);
