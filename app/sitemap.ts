import prisma from "@/lib/prisma";
import { MetadataRoute } from "next";

const BASE_URL = "https://gisla2024.vercel.app/";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: "daily",
    },
    {
      url: `${BASE_URL}artworks`,
      lastModified:
        (
          await prisma.post.aggregate({
            _max: {
              created_on: true,
            },
          })
        )._max.created_on ?? new Date(),
      changeFrequency: "hourly",
    },
  ];
}
