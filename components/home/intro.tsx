"use client";
import { font_poppins_one } from "@/lib/font";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { IntroCanvas } from "./intro-canvas";
import { PostCount } from "./post-count";

export const IntroComponent = () => {
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
        <PostCount />
      </div>
      <div
        className="flex flex-col gap-1 items-center pb-24 mix-blend-exclusion"
        onMouseMove={mouseMove}
        onTouchMove={touchMove}
      >
        <Image
          src="/images/logo-for-dark.webp"
          alt="Gisla 2024 logo"
          height={136.62}
          width={300}
          className="object-contain "
          priority={false}
        />
        <h1 className="text-2xl text-white font-extrabold px-5 text-center">
          The Global AI Art Competition
        </h1>
      </div>
    </>
  );
};
