import { Lato, Poppins } from "next/font/google";

import localFont from "next/font/local";

export const font_poppins_one = Poppins({
  weight: ["900", "600"],
  subsets: ["latin"],
});

export const font_pasti = localFont({
  weight: "900",
  src: "../public/font/PastiRegular.otf",
});

export const font_lato = Lato({
  weight: "900",
  subsets: ["latin"],
});
