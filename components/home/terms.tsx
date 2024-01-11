"use client";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { RulesText } from "../submit/rules";

export const HomeTerms = () => {
  const [show, setShow] = useState(false);
  return (
    <section
      className="pt-16 pb-6 px-4 md:pl-20 bg-bg-main-2 text-white"
      id="rules"
    >
      <h1 className="text-5xl px-6 text-center font-semibold md:pr-20 pb-8 md:pb-16 leading-tight">
        Rules and Regulations
      </h1>
      <div className="grid xl:grid-cols-2">
        <div>
          <div
            className={`overflow-hidden relative transition-all duration-300 [&>div>div>div>div]:list-item [&>div>div>div>div]:list-decimal [&>div>div>div>div]:last-of-type:hidden ${
              show ? " max-h-full" : "max-h-screen"
            }`}
          >
            <RulesText hide_heading />
            <div
              className={`absolute bottom-0 w-full h-28 bg-gradient-to-t from-bg-main-2  via-bg-main-2/80 to-transparent ${
                show ? "opacity-0" : "opacity-100"
              }`}
            ></div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => setShow((i) => !i)}
              className="my-5 pr-6 pl-3 py-1.5 bg-bg-main rounded-full flex gap-2 items-center"
            >
              <ChevronDown
                height="1em"
                className={`${
                  show ? "rotate-180" : "rotate-0"
                } transition-transform`}
              />{" "}
              Show {show ? "less" : "more"}
            </button>
          </div>
        </div>
        <div className="py-16 w-full  xl:flex justify-center hidden ">
          <Image
            className="h-96 w-96 bg-black rounded-xl sticky top-12"
            src="/assets/rules-img.webp"
            alt=""
            height={400}
            width={400}
          ></Image>
        </div>
      </div>
    </section>
  );
};
