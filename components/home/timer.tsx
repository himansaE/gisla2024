"use client";

import { font_pasti, font_poppins_one } from "@/lib/font";
import { useEffect, useState } from "react";

const timeDiff = () => {
  let diff = new Date(2024, 0, 14, 20, 0, 0).getTime() - new Date().getTime();
  const now_unformatted = [
    diff / 1000,
    diff / 1000 / 60,
    diff / 1000 / 60 / 60 - 6,
    diff / 1000 / 60 / 60 / 24,
  ].map((i) => Math.floor(i));
  const format = [60, 60, 24, 1000];
  const now = now_unformatted.map((i, n) =>
    String(i % format[n]).padStart(2, "0")
  );
  let before = now_unformatted.map((i, n) =>
    i + 1 <= 0 ? "01" : String((i + 1) % format[n]).padStart(2, "0")
  );
  return {
    sec: [before[0], now[0]],
    min: [before[1], now[1]],
    hour: [before[2], now[2]],
    day: [before[3], now[3]],
  };
};

export const Timer = () => {
  const [time, setTime] = useState(timeDiff());

  useEffect(() => {
    const t = setInterval(() => setTime(timeDiff()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-bg-main rounded-xl pl-2 pb-2">
      <div className="flex tabular-nums text-white" style={font_pasti.style}>
        <TimerNumber n={time.day} title="Days" />
        <TimerNumber n={time.hour} title="Hours" />
        <TimerNumber n={time.min} title="Mins" />
        <TimerNumber n={time.sec} title="Secs" className="xsm:flex hidden " />
      </div>
      <div
        className={`${font_poppins_one.className} text-white fon text-center text-sm sm:text-base`}
      >
        {" "}
        Registration Open in{" "}
        <span className="text-[#adffb8] font-semibold">
          14<sup>th</sup> Jan 2024
        </span>
      </div>
    </div>
  );
};
export const TimerNumber = ({
  n,
  title,
  className,
}: {
  n: string[];
  title: string;
  className?: string;
}) => {
  return (
    <div className={`flex ${className ?? ""}`}>
      <span className="[writing-mode:vertical-rl] rotate-180 text-center">
        {title}
      </span>
      <div className="bg-bg-main-2 px-2 py-3 rounded-lg my-3 mr-3">
        <div className="md:text-8xl sm:text-6xl text-4xl text-white h-9 sm:h-12 md:h-20 overflow-hidden w-[2ch] text-center relative">
          <div className="h-5 w-full absolute"></div>
          <div className="h-5 w-full absolute bottom-0"></div>
          <div
            suppressHydrationWarning
            key={n[0]}
            className="animate-margin-up md:animate-margin-up-md sm:animate-margin-up-sm"
          >
            {n[0]}
          </div>
          <div suppressHydrationWarning>{n[1]}</div>
        </div>
      </div>
    </div>
  );
};
