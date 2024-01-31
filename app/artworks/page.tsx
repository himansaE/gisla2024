import { Metadata } from "next";
import { ArtworkClient } from "./client";
import { getPosts } from "./server";
export const metadata: Metadata = {
  title: "Artworks Gallery | GISLA 2024",
};

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const data = await getPosts(searchParams.page);
  return (
    <>
        <ArtworkClient data={{ ...data }} />
    </>
  );
}
