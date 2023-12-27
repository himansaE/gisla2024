"use client";
import { font_lato, font_poppins_one } from "@/lib/font";
import { LoginForm } from "./form";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace("/");
  }, [user]);

  if (loading) return <>loading</>;

  return (
    <main className="grid lg:grid-cols-2 justify-items-center">
      <div
        className={`${font_poppins_one.className}  hidden lg:flex bg-bg-main-2 w-full h-screen sticky top-0 flex-col justify-center text-white font-bold px-[2vw] `}
      >
        <h1 className="text-5xl mt-auto">Welcome creators</h1>
        <p className="font-normal text-sm mb-20 text-white/80">
          Login to participate on Gisla 2024 : The Worldwide Awards. It&apos;s
          free.
        </p>
      </div>

      <div className="max-w-screen-sm w-full">
        <h1
          className={`${font_poppins_one.className} text-lg leading-3 text-bg-main-2  px-3 xsm:px-10 py-14`}
        >
          Welcome to <div className="text-5xl font-extrabold ">GISLA 2024</div>{" "}
        </h1>

        <div className={`${font_lato.className} px-4 xsm:px-10 mb-10`}>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
