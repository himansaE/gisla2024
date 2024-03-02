"use client";
import { Menu } from "lucide-react";
import type { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const NavBarClient = (props: { user: Session | null; url: string }) => {
  const [path, setPath] = useState(props.url);
  const [side_nav, setSideNav] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setPath(pathname);
  }, [pathname]);

  useEffect(() => {
    const ev = () => {
      setSideNav(false);
    };
    document.body.addEventListener("resize", ev);
    return document.body.removeEventListener("resize", ev);
  }, []);

  return (
    <>
      <nav
        className={` top-0 h-16 w-full flex flex-row py-2 items-center px-5 gap-12 z-40 sticky  ${
          side_nav
            ? "bg-white"
            : path === "/"
            ? "bg-black/50 text-white  backdrop-blur-lg"
            : "bg-white text-black  shadow-sm"
        }`}
      >
        <Link href="/" title="Home">
          <Image
            src={
              path === "/"
                ? "/images/logo-for-dark.webp"
                : "/images/logo-for-light.webp"
            }
            height={40}
            width={82.42}
            alt="Gisla 2024 logo"
            className={side_nav ? "hidden" : "block"}
          />
        </Link>
        <div
          className={`flex-row gap-4 hidden md:flex ${
            path === "/" ? "justify-center" : ""
          }`}
        >
          {get_links(props.user).map((i) => (
            <Link href={i[1]} key={i[0]} className="hover:underline text-sm">
              {i[0]}
            </Link>
          ))}
        </div>
        <Link
          className="hidden md:flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 ml-auto "
          href={
            props.user != null
              ? (props.user.user as any).role === "judge" ||
                (props.user.user as any).role === "admin"
                ? "/judge"
                : "/submit"
              : "/auth/register"
          }
        >
          {props.user?.user != null
            ? (props.user.user as any).role === "judge" ||
              (props.user.user as any).role === "admin"
              ? "Judge Artworks"
              : "View Artworks"
            : "View Artworks"}
        </Link>
        <button
          className="ml-auto md:-ml-6 cursor-pointer bg-bg-main-2/20 hover:bg-bg-main-2/30 transition-colors p-2 rounded-lg block md:hidden
          focus:outline-bg-main-2/40
          "
          onClick={() => setSideNav((i) => !i)}
          title="Side navigation"
        >
          <Menu />
        </button>
      </nav>
      <div
        className={`fixed h-screen w-screen z-30 top-0 left-0 bg-white backdrop-blur-lg md:hidden ${
          side_nav ? "flex flex-col gap-10" : "hidden"
        }`}
      >
        <div className="mt-20">
          <Image
            src="/images/logo-for-light.webp"
            height={113.6}
            width={250}
            alt="Gisla Logo"
            className="px-5"
          />
        </div>
        <div className="flex flex-col px-7 gap-2 ">
          {get_links(props.user, true).map((i) => (
            <Link
              href={i[1]}
              key={i[0]}
              className="hover:underline w-fit"
              onClick={() => {
                setSideNav(false);
              }}
            >
              {i[0]}
            </Link>
          ))}
          {["admin", "judge"].includes((props.user?.user as any)?.role) && (
            <Link
              href="/judge"
              className="hover:underline w-fit"
              onClick={() => {
                setSideNav(false);
              }}
            >
              Judge Dashboard
            </Link>
          )}
        </div>
        <div className="mt-auto mb-2">
          {" "}
          <div className="text-center text-sm pt-10 text-gray-800">
            Copyright © GISLA 2024 • IEEE Student Branch SLTC <br />
            Designed & developed by{" "}
            <Link
              href="https://www.linkedin.com/in/himanse/"
              className="underline"
            >
              Himansa Wickramasinghe
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

const get_links = (auth: Session | null, side?: boolean) => {
  const list: string[][] = [];
  if (side) list.push(["Home", "/"]);
  if (auth != null) {
    list.push(...authed_links);
    if (side) list.push(["Submit Artwork", "/submit"]);
  } else list.push(...unauthed_links);
  list.push(...default_links);
  return list;
};

const authed_links = [["View Submitted", "/my-artworks"]];
const default_links = [
  ["Art Gallery", "/artworks"],
  ["Contact Us", "/#contact_us", "Rules", "/#rules"],
];
const unauthed_links = [["Login", "/auth/login"]];
