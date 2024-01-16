"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  copyText,
  downloadImage,
  openLinkInNewWindow,
} from "@/lib/client/actions";
import {
  Copy,
  Download,
  ExternalLink,
  FacebookIcon,
  Fullscreen,
  Instagram,
  MoreVertical,
  PlusCircle,
  Share2,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const ArtworkContextMenu = (post: {
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
}) => {
  const router = useRouter();
  const link = `https://gisla2024.vercel.app/artwork/${post.id}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="h-8 w-8 flex justify-center items-center bg-bg-main-2/5 rounded-full hover:bg-bg-main-2/10 focus:bg-bg-main-2/20 transition-colors outline-none focus:outline-bg-main-2/40"
        tabIndex={0}
      >
        <MoreVertical size={"1.2em"} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" collisionPadding={10}>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push(link)}>
            <Fullscreen className="mr-2 h-4 w-4" />
            <span>Open Artwork</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openLinkInNewWindow(link)}>
            <ExternalLink className="mr-2 h-4 w-4" />
            <span>Open in new window</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => copyText(link)}>
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy Link</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => downloadImage(post.image_link)}>
            <Download className="mr-2 h-4 w-4" />
            <span>Download Artwork</span>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Share2 className="mr-2 h-4 w-4" />
              <span>Share on</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => {
                    toast.warning(
                      "This option is in development. Use manual method instead."
                    );
                  }}
                >
                  <FacebookIcon className="mr-2 h-4 w-4" />
                  <span>Facebook</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    toast.warning(
                      "This option is in development. Use manual method instead."
                    );
                  }}
                >
                  <Instagram className="mr-2 h-4 w-4" />
                  <span>Instagram</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    toast.warning(
                      "This option is in development. Use manual method instead."
                    );
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>More...</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuItem disabled>
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
