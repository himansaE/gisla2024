import Image from "next/image";
import Link from "next/link";
import { BoxBg } from "./tutorial-page";
export const Footer = () => {
  return (
    <footer className="bg-black text-white border-t-[1px] border-white/25 overflow-hidden pt-16 pb-10  px-3 relative">
      <div className="absolute">
        <BoxBg />
      </div>
      <div className="flex flex-col justify-center items-center">
        <p className="text-sm">Proudly Present By</p>
        <Image
          src="/images/IEEE logo white.webp"
          alt="IEEE SLTC"
          height={93}
          width={200}
        />
      </div>
      <div className="flex justify-evenly pt-10">
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
      {/* <div className="text-5xl sm:text-8xl md:text-9xl text-center font-black my-14 w-full ">
        {"GISLA 2024".split("").map((i) => (
          <span
            key={i}
            className="opacity-5 hover:opacity-30 transition-opacity select-none cursor-default"
          >
            {i}
          </span>
        ))}
      </div> */}
    </footer>
  );
};

const in_links = [
  ["Home", "/#"],
  ["Tutorial", "/#tutorial"],
  ["Rules", "/#rules"],
  ["Contact Us", "/#contact-us"],
];

const pages_link = [
  ["Login", "/auth/login"],
  ["Register", "/auth/register"],
  ["Submit", "/submit"],
];
