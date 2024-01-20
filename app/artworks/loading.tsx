import { Skeleton } from "@/components/ui/skeleton";
import { POST_PER_PAGE } from "./Pagination";

export default function Loading() {
  return (
    <>
      <div className="flex flex-wrap justify-center gap-4  md:gap-10 py-9 px-2">
        {Array.from({ length: POST_PER_PAGE }).map((_, i) => (
          <Card key={i} />
        ))}
      </div>
    </>
  );
}

export const Card = () => (
  <div className="border border-gray-300/30 p-2 rounded-lg max-w-full">
    <Skeleton className="flex w-72 items-center justify-center max-w-full rounded-md overflow-hidden supports-[not(aspect-ratio:1/1)]:h-72 aspect-square" />
    <div className="flex flex-col my-2 px-1 gap-1">
      <Skeleton className="h-6 w-56 max-w-full rounded-md" />
      <Skeleton className="h-4 w-24 max-w-full rounded-md" />
    </div>
  </div>
);
