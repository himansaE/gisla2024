import { Center } from "@/components/ui/center";
import { font_poppins_one } from "@/lib/font";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cache } from "react";

export default async function Page({ params }: { params: { slug: string } }) {
  const post = await getArtwork(params.slug);
  return (
    <div
      className={`${font_poppins_one.className} lg:grid grid-cols-2 gap-4 mb-6`}
    >
      <div className="px-4 lg:px-4 py-4 flex min-h-min lg:[min-height:calc(100vh_-_6.25rem)] lg:max-h-[calc(max(500px,100vh))] justify-center items-center">
        <div className="flex h-full flex-col my-5 lg:my-0 items-center justify-center">
          <Image
            className="rounded-lg bg-bg-main-2/10 max-h-[500px] max-w-full object-contain"
            unoptimized
            src={post.image_link}
            alt="image"
            height={500}
            width={500}
          />
        </div>
      </div>
      <Center maxWidth="600px" className="px-3 lg:px-6 pt-6 lg:pt-28">
        <h1 className="text-2xl font-semibold">{post.title}</h1>
        <p>
          <span className="bg-bg-main-2/10 px-2 rounded-md text-opacity-70 text-black">
            @ {post.user.name} {post.user.lastName}
          </span>
        </p>

        <p className="text-sm">
          on{" "}
          {post.created_on.toLocaleDateString("default", {
            month: "short",
            year: "numeric",
            day: "2-digit",
          })}
        </p>
        <div className="py-4">
          <div>Created using {post.created_using}</div>
        </div>
        <p className="text-sm lg:text-base">{post.des}</p>
      </Center>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await getArtwork(params.slug);

  return {
    title: `${data.title} by ${data.user.name} | GISLA 2024`,
    description: data.des,
    openGraph: {
      title: `${data.title} by ${data.user.name}| GISLA 2024`,
      description: data.des,
      images: [data.image_link],
    },
  };
}

const getArtwork = cache(async (id: string) => {
  if (!/^[0-9a-f]{24}$/i.test(id)) {
    return notFound();
  }
  const post = await prisma.post.findFirst({
    where: {
      id,
    },
    include: {
      user: {},
    },
  });
  if (!post) return notFound();
  return post;
});
