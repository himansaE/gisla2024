import { font_poppins_one } from "@/lib/font";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/firebase";

export const IntroButton = () => {
  const [user] = useAuthState(auth);

  return (
    <Link
      href={user?.uid ? "/submit" : "/auth/register"}
      className="rounded-2xl"
    >
      <div
        className={`py-7 px-12 rounded-2xl bg-white  hover:bg-gradient-to-b from-transparent to-green-100 transition-colors  text-bg-main-2 md:text-xl ${font_poppins_one.className}`}
      >
        {user?.uid ? "Submit your Image" : "Registration Open Soon"}
      </div>
    </Link>
  );
};
