"use client";
import { AtSign } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ArtworkPagination } from "./Pagination";

import { ClientCache } from "@/lib/client/cache";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loading from "./loading";
import { getPosts } from "./server";

export type ArtworkPageData = {
  page: number;
  pages: number[];
  total_pages: number;
  post: ({
    user: {
      name: string;
      lastName: string | null;
    };
  } & {
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
  })[];
};

const cache = new ClientCache(60 * 5);
export const ArtworkClient = (props: { data: ArtworkPageData }) => {
  const [data, setData] = useState(props.data);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const updateData = async (index: number) => {
    setLoading(true);
    const url = new URL(window.location.href);
    url.searchParams.set("page", String(index));
    window.history.pushState({ page: index }, "", url);
    let posts;
    try {
      posts = await cache.fetch(String(index), getPosts, [String(index)]);
    } catch (e) {
      return;
    }
    if (posts == undefined) {
      return router.push("/page-not-found");
    }
    setData(posts);
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex flex-wrap justify-center gap-4  md:gap-10 py-9 px-2">
            {data.post.map((i) => (
              <Post
                id={i.id}
                image_link={i.image_link}
                title={i.title}
                name={`${i.user.name} ${i.user.lastName}`}
                key={i.id}
              />
            ))}
          </div>
        </>
      )}
      <ArtworkPagination
        setData={updateData}
        page={data.page}
        pages={data.pages}
        total_pages={data.total_pages}
      />
    </>
  );
};

export const Post = (post: {
  id: string;
  image_link: string;
  title: string;
  name: string;
}) => (
  <Link
    href={`/artwork/${post.id}`}
    className="group border border-gray-300 p-2 rounded-lg max-w-full w-fit"
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
        {post.name}
      </div>
    </div>
  </Link>
);
