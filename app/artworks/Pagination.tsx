import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { RedirectType, redirect } from "next/navigation";

export const POST_PER_PAGE = 9;
const PAGES_IN_PAGINATION = 5;

export const ArtworkPagination = ({
  page,

  pages,
  total_pages,
}: {
  page: number;
  pages: number[];
  total_pages: number;
}) => {
  if (pages.length === 0)
    redirect(`/artworks?page=${total_pages}`, RedirectType.replace);
  return (
    <Pagination>
      <PaginationContent>
        {page != 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={`/artworks?page=${page - 1}`}
              className="cursor-pointer select-none"
            />
          </PaginationItem>
        )}
        {pages.map((i) => (
          <PaginationItem key={i}>
            <PaginationLink
              href={`/artworks?page=${i}`}
              className="cursor-pointer select-none"
              isActive={i == page}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        ))}
        {page != total_pages && (
          <PaginationItem>
            <PaginationNext
              href={`/artworks?page=${page + 1}`}
              className="cursor-pointer select-none"
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export const getPaginationItems = (
  curr_page: number,
  post_count: number
): [number[], number] => {
  const total_pages = Math.ceil(post_count / POST_PER_PAGE);
  const half_pages = Math.floor(PAGES_IN_PAGINATION / 2);
  const start = Math.max(1, curr_page - half_pages);
  const end = Math.min(total_pages, start + PAGES_IN_PAGINATION - 1);
  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return [pages, total_pages];
};
