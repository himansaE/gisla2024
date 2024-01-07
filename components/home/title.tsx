import { font_poppins_one } from "@/lib/font";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "./sparkle";

const image_list = ["ai-image (1).webp"];

export const TitlePage = () => {
  return (
    <section
      className={`${font_poppins_one.className} bg-bg-main-2 py-12 px-4 md:px-9`}
    >
      <div className="grid lg:grid-cols-2 justify-items-center gap-x-4 gap-y-16">
        <div className="flex flex-col items-center gap-5 w-full max-w-[400px]">
          <div className="w-full bg-[#3BA19A] rounded-xl">
            <Image
              src={"/assets/ai-image (1).webp"}
              alt=""
              height={400}
              width={400}
              className="aspect-square rounded-xl"
            />
          </div>
          <div className="w-full h-[70px] bg-[#2e5467] rounded-full flex items-center px-2 gap-5">
            <div className="bg-white h-14 w-14 flex justify-center items-center rounded-full">
              <Image
                src="/assets/microsoft-designer-logo.webp"
                height={30}
                width={40}
                alt=""
              />
            </div>
            <div className="text-white">Microsoft Designer (DALL·E 3)</div>
          </div>
        </div>
        <div className="w-full flex flex-col lg:justify-center mb-8 lg:mb-0">
          <h2 className="text-white ">
            A Global Call for
            <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold">
              Climate Action
            </div>
          </h2>
          <p className="my-5 md:pr-10 text-white">
            The IEEE GISLA 2024 project focuses on the use of digital art and
            artificial intelligence to raise awareness about critical issues of
            climate change. We aim to awaken people&apos;s minds through a
            Global AI Art Competition under the theme &apos;A Global Call for
            Climate Action&apos;.
          </p>
          <div className="flex">
            <Link
              href={""}
              className="bg-bg-main my-4 pl-5 pr-3 py-2 rounded-3xl text-white  hover:opacity-90 transition-opacity flex gap-1 items-center hover:underline"
            >
              Learn More
              <ArrowUpRight height="1.2em" />
            </Link>
          </div>
        </div>
      </div>
      <div className="pt-14 mt-5 lg:mt-16 lg:pt-28 pb-10 flex flex-col md:flex-row items-center justify-center md:items-start gap-4 border-t border-solid border-[#ffffff47]">
        <Sparkles size={1} fill="#d4ffcc" className="md:scale-100 scale-75" />
        <p className="text-center text-xl md:text-2xl xl:text-4xl text-white font-semibold w-fit">
          <span className="text-[#f9ff46]">JOIN US</span> ON THIS JOURNEY AS WE
          JOIN US
          <br />
          ON THIS AMAZING JOURNEY AND UNLEASH YOUR CREATIVITY USING THE{" "}
          <span className="text-[#f9ff46]">WONDERS OF AI.</span>
        </p>
        <Sparkles
          size={1}
          fill="#d4ffcc"
          className="rotate-180 md:scale-100 scale-75 mt-0 md:mt-auto"
        />
      </div>
      <div className="w-full flex justify-center">
        <Link
          href="#tutorial"
          className="bg-bg-main pr-4 pl-2 py-1.5 rounded-3xl text-white flex justify-center items-center gap-1 hover:opacity-80 transition-opacity "
        >
          <ChevronDown height="1em" /> Scroll Down
        </Link>
      </div>
    </section>
  );
};
