import { Card, CardContent } from "@/components/ui/card";
import { withAuthProtection } from "@/lib/auth/guards";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArtworkContextMenu } from "./context-menu";

export const metadata: Metadata = {
  title: "My Artworks | GISLA 2024",
};

export default async function Page() {
  const user = await withAuthProtection();
  if (user.user == undefined) return <></>;

  const posts = await prisma.post.findMany({
    where: {
      user_id: user.user.id,
    },
  });

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
          <div className="my-10 mb-5 grid justify-items-center gap-y-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:max-w-3xl lg:max-w-6xl">
            {posts.map((i) => (
              <Artwork key={i.id} post={i}></Artwork>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const Artwork = (props: {
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
  };
}) => {
  return (
    <Card className="">
      <CardContent className="flex flex-col gap-3 max-w-xs items-center px-3  py-3">
        <Image
          src={props.post.image_link}
          alt={props.post.title}
          height={300}
          width={300}
          className="object-contain rounded-lg  w-80 max-h-[20rem] max-w-full bg-bg-main-2/10"
        />

        <div className="w-full flex px-1 ">
          <div className="w-full">
            <Link
              href={`https://gisla2024.vercel.app/artwork/${props.post.id}`}
              className="overflow-hidden text-base h-6 text-ellipsis line-clamp-1"
            >
              {props.post.title}
            </Link>
            <div className="text-xs max-w-[20ch]  truncate overflow-hidden h-4 text-ellipsis line-clamp-1">
              Microsoft Bing
            </div>
          </div>
          <div className="flex justify-center">
            <ArtworkContextMenu {...props.post} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
