"use server";

import prisma from "@/lib/prisma";
import { RedirectType, redirect } from "next/navigation";
import { getPaginationItems } from "./Pagination";
import { POST_PER_PAGE } from "./cons";

export const getPosts = async (id?: string) => {
  "use server";

  let page;
  try {
    page = Number(id ?? "1");
    if (page < 1 || isNaN(page))
      return redirect("/artworks?page=1", RedirectType.replace);
  } catch (e) {
    return redirect("/artworks?page=1", RedirectType.replace);
  }

  const [post_count, posts] = await prisma.$transaction([
    prisma.post.count({
      where: {
        title: { not: "**test**" },
      },
    }),
    prisma.post.findMany({
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
    }),
  ]);
  const [pages, total_pages] = getPaginationItems(page, post_count);

  if (page > total_pages)
    return redirect(`/artworks?page=${total_pages}`, RedirectType.replace);
  return {
    post: posts,
    page,
    pages,
    total_pages,
  };
};
