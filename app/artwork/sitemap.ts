import prisma from "@/lib/prisma";
import { MetadataRoute } from "next";

const BASE_URL = "https://gisla2024.vercel.app/artwork/";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const post = await prisma.post.findMany({
    where: {
      title: {
        not: "**test**",
      },
    },
  });

  return post.map((i) => ({
    url: `${BASE_URL}${i.id}`,
    lastModified: i.created_on,
    changeFrequency: "weekly",
  }));
}
0;
