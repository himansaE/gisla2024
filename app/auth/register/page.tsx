"use client";
import { font_lato, font_poppins_one } from "@/lib/font";
import { RegisterForm } from "./form";
import { auth } from "@/lib/firebase/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function LoginPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace("/");
  }, [user]);

  if (loading) return <>loading</>;
  return (
    <main
      className={`${font_lato.className} grid lg:grid-cols-2 justify-items-center`}
    >
      <div className="max-w-screen-sm w-full">
        {/* <Image src="/images/logo-for-light.webp" height={80} width={176} alt="" /> */}
        <h1
          className={`${font_poppins_one.className} text-lg leading-3 text-bg-main-2  px-3 xsm:px-10 py-14`}
        >
          Welcome to <div className="text-5xl font-extrabold ">GISLA 2024</div>{" "}
        </h1>

        <div className="px-4 xsm:px-10 mb-10">
          <RegisterForm />
        </div>
      </div>
      <div className="hidden lg:block bg-bg-main-2/30 w-full"></div>
    </main>
  );
}
