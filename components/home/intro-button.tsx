import { auth } from "@/lib/auth/auth";
import { font_poppins_one } from "@/lib/font";
import Link from "next/link";

export const IntroButtonInCompetition = async () => {
  const user = await auth();

  return (
    <Link
      href={
        process.env.testing === "1"
          ? "#"
          : user?.user
          ? "/submit"
          : "/auth/register"
      }
      className="rounded-2xl"
    >
      <div
        className={`py-7 px-12 rounded-2xl  bg-white  hover:bg-gradient-to-b from-transparent to-green-100 transition-colors  text-bg-main-2 font-semibold md:text-xl ${font_poppins_one.className}`}
      >
        {user?.user ? "Submit your Image" : "Register Now"}
      </div>
    </Link>
  );
};

export const IntroButton = () => (
  <Link href="/artworks" className="rounded-2xl">
    <div
      className={`py-7 px-12 rounded-2xl  bg-white  hover:bg-gradient-to-b from-transparent to-green-100 transition-colors  text-bg-main-2 font-semibold md:text-xl ${font_poppins_one.className}`}
    >
      View All Artworks
    </div>
  </Link>
);
