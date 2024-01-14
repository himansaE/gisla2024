import { blockAuth } from "@/lib/auth/guards";
import { font_lato, font_poppins_one } from "@/lib/font";
import { RegisterForm } from "./form";

export default async function LoginPage() {
  await blockAuth();
  return (
    <main
      className={`${font_lato.className} grid lg:grid-cols-2 justify-items-center`}
    >
      <div className="hidden lg:block bg-bg-main-2 w-full">
        <div
          className={`${font_poppins_one.className}  hidden lg:flex bg-bg-main-2 w-full h-screen sticky top-0 flex-col justify-center text-white font-bold px-[2vw] `}
        >
          <h1 className="text-5xl mt-auto">Welcome creators</h1>
          <p className="font-normal text-sm mb-20 text-white/80">
            Register to participate on Gisla 2024 : The Worldwide Awards.
            It&apos;s free.
          </p>
        </div>
      </div>{" "}
      <div className="max-w-screen-sm w-full">
        {/* <Image src="/images/logo-for-light.webp" height={80} width={176} alt="" /> */}
        <h1
          className={`${font_poppins_one.className} text-lg leading-3 text-bg-main-2  px-3 xsm:px-10 py-14`}
        >
          Welcome to <div className="text-5xl font-extrabold ">GISLA 2024</div>{" "}
        </h1>

        <div className="px-4 xsm:px-10 mb-10">
          <RegisterForm app_stage={process.env.APP_STAGE} />
        </div>
      </div>
    </main>
  );
}
