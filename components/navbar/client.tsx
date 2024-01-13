"use client";
import type { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const NavBarClient = (props: { user: Session | null }) => {
  const [path, setPath] = useState("/");
  const pathname = usePathname();

  useEffect(() => {
    setPath(pathname);
  }, [pathname]);

  return (
    <nav
      className={` top-0 h-20 w-full z-10 flex flex-col py-2 justify-center items-start px-5 ${
        path === "/"
          ? "bg-black/90 text-white fixed backdrop-blur-lg"
          : "bg-white text-black sticky"
      }`}
    >
      <Link href="/" title="Home">
        <Image
          src={
            path === "/"
              ? "/images/logo-for-dark.webp"
              : "/images/logo-for-light.webp"
          }
          height={50}
          width={105.53}
          alt="Gisla 2024 logo"
        />
      </Link>
      {/* <div>{!props.user?.user ? ["Submit Artwork"] : ["Login","Register"]}</div> */}
    </nav>
  );
};
