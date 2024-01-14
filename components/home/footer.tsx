import Image from "next/image";
import Link from "next/link";
import { BoxBg } from "./tutorial-page";
export const Footer = () => {
  return (
    <footer className="bg-black text-white border-t-[1px] border-white/25 overflow-hidden pt-24 pb-5  px-3 relative">
      <div className="absolute">
        <BoxBg />
      </div>
      <div className="flex flex-col justify-center items-center">
        <p className="text-sm pb-2">Proudly Present By</p>
        <Image
          src="/images/logo-bar h.webp"
          alt="IEEE SLTC"
          height={93}
          width={200}
          unoptimized
          className="h-[63.78px] w-[300px] sm:h-[74.4px] sm:w-[350px] object-contain"
        />
      </div>
      <div className="flex justify-evenly pt-16">
        <div className="flex flex-col items-start gap-1">
          {in_links.map((i) => (
            <Link href={i[1]} key={i[0]} className="hover:underline">
              {i[0]}
            </Link>
          ))}
        </div>
        <div className="flex flex-col items-start gap-1">
          {pages_link.map((i) => (
            <Link href={i[1]} key={i[0]} className="hover:underline">
              {i[0]}
            </Link>
          ))}
        </div>
      </div>
      <div className="text-center text-sm pt-10 text-gray-300">
        Copyright © GISLA 2024 • IEEE Student Branch SLTC <br />
        Designed & developed by{" "}
        <Link href="https://www.linkedin.com/in/himanse/" className="underline">
          Himansa Wickramasinghe
        </Link>
      </div>
    </footer>
  );
};

const in_links = [
  ["Home", "/#"],
  ["Tutorial", "/#tutorial"],
  ["Rules", "/#rules"],
  ["Contact Us", "/#contact_us"],
];

const pages_link = [
  ["Login", "/auth/login"],
  ["Register", "/auth/register"],
  ["Submit", "/submit"],
];
