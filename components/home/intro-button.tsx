import { auth } from "@/lib/auth/auth";
import { font_poppins_one } from "@/lib/font";
import Link from "next/link";

export const IntroButton = async () => {
  const user = await auth();

  let enable_link = false;

  if (process.env.APP_STAGE === "DEV") {
    if ((user?.user as any)?.role === "dev") enable_link = true;
  } else {
    if (user?.user) enable_link = true;
  }
  return (
    <Link
      href={enable_link ? (user?.user ? "/submit" : "/auth/register") : "#"}
      className="rounded-2xl"
    >
      <div
        className={`py-7 px-12 rounded-2xl  bg-white  hover:bg-gradient-to-b from-transparent to-green-100 transition-colors  text-bg-main-2 font-semibold md:text-xl ${font_poppins_one.className}`}
      >
        {enable_link ? "Submit your Image" : "Registration Open Soon"}
      </div>
    </Link>
  );
};
