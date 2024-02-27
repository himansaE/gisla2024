import { Center } from "@/components/ui/center";
import { withRoleAuthProtection } from "@/lib/auth/guards";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { JudgeForm } from "./client";
export default async function Page({ params }: { params: { id: string } }) {
  const user = await withRoleAuthProtection("judge");

  const { id } = params;

  if (!/^[0-9a-f]{24}$/i.test(id)) {
    return notFound();
  }
  const [judge, post] = await prisma.$transaction([
    prisma.judging.findFirst({
      where: {
        post_id: id,
        judge_id: user.user?.id,
      },
    }),
    prisma.post.findFirst({
      where: {
        id: id,
      },
      include: {
        user: true,
      },
    }),
  ]);

  if (!judge || !post) notFound();

  return (
    <main>
      <div className={` lg:grid grid-cols-2 gap-4 mb-6`}>
        <div className="px-4 lg:px-4 py-4 flex min-h-min lg:[min-height:calc(100vh_-_6.25rem)] lg:max-h-[calc(max(500px,100vh))] justify-center items-center">
          <div className="flex h-full flex-col my-5 lg:my-0 items-center justify-center">
            <Image
              className=" lg:fixed rounded-lg bg-bg-main-2/10 max-h-[500px] max-w-full object-contain"
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

          <Item text={post.des} title="Description" />
          <Item text={post.prompt} title="Prompt" />

          <h2 className="text-2xl font-semibold pt-5">Vote Artwork</h2>
          <JudgeForm id={post.id} token={judge.token} />
        </Center>
      </div>
    </main>
  );
}

const Item = (props: { title: string; text: string }) => {
  return (
    <div className="bg-gray-100 px-2 py-1 my-5 rounded-md ring-1 ring-gray-200 text-gray-900 ">
      <div className="text-xs text-gray-700 select-none pt-1">
        {props.title}
      </div>
      <div className="py-2">{props.text}</div>
    </div>
  );
};
