// import { auth } from "@/lib/auth/auth.config";
import { auth } from "@/lib/auth/auth";
import { font_poppins_one } from "@/lib/font";
import Link from "next/link";

export const IntroButton = async () => {
  const user = await auth();
  console.log(user);
  return (
    <Link
      href={user?.user ? "/submit" : "/auth/register"}
      className="rounded-2xl"
    >
      <div
        className={`py-7 px-12 rounded-2xl bg-white  hover:bg-gradient-to-b from-transparent to-green-100 transition-colors  text-bg-main-2 md:text-xl ${font_poppins_one.className}`}
      >
        {user?.user ? "Submit your Image" : "Registration Open Soon"}
      </div>
    </Link>
  );
};
