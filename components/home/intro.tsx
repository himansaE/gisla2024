"use client";
import { IntroCanvas } from "./intro-canvas";
import { useEffect, useRef } from "react";
import { font_poppins_one } from "@/lib/font";
import { Timer } from "./timer";
import Link from "next/link";
import Image from "next/image";
import { IntroButton } from "./intro-button";

export const IntroPage = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const _canvas = document.getElementById("intro-canvas");
    if (_canvas) (canvas.current as HTMLElement) = _canvas;
  });

  const mouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (canvas.current)
      canvas.current.dispatchEvent(
        new MouseEvent("mousemove", {
          ...event,
          bubbles: event.bubbles,
          view: window,
        })
      );
  };

  const touchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (canvas.current)
      canvas.current.dispatchEvent(
        new TouchEvent(
          "touchmove",
          event.nativeEvent as unknown as TouchEventInit
        )
      );
  };
  return (
    <>
      <section className="min-h-[max(500px,100vh)] relative" id="intro">
        <IntroCanvas />
        <div
          className={`${font_poppins_one.className} z-40 flex flex-col gap-8 h-full px-8 py-4 justify-center items-center min-h-[max(500px,calc(100vh_-_110px))]`}
          onMouseMove={mouseMove}
          onTouchMove={touchMove}
        >
          <h1
            className="text-center md:text-5xl sm:text-4xl text-2xl mix-blend-exclusion text-white font-black"
            style={font_poppins_one.style}
          >
            {" "}
            Exploit AI to Redefine
            <div className="md:text-9xl sm:text-8xl text-6xl tracking-tight">
              Creativity
            </div>
          </h1>
          <Timer />
        </div>
        <div
          className="flex flex-col gap-1 items-center pb-24"
          onMouseMove={mouseMove}
          onTouchMove={touchMove}
        >
          <Image
            src="/images/logo-for-dark.webp"
            alt="Gisla 2024 logo"
            height={136.62}
            width={300}
          />
          <h1 className="text-2xl text-white font-extrabold px-5 text-center">
            The Global AI Art Competition
          </h1>
        </div>
      </section>
      <section
        className="w-full h-20 bg-bg-main-2 sticky bottom-0 flex justify-center"
        onMouseMove={mouseMove}
        onTouchMove={touchMove}
      >
        <div className="translate-y-[-2.5rem]">
          <IntroButton />
        </div>
      </section>
    </>
  );
};
