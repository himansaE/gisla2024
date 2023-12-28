import { font_lato, font_poppins_one } from "@/lib/font";
import { LoginForm } from "./form";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let error = { text: "", err_in: "" };
  if (searchParams != undefined) {
    if (searchParams["error"] === "AuthError")
      error = { text: "Invalid Credentials.", err_in: "all" };
  }

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
          <LoginForm error_text={error.text} error_in={error.err_in} />
        </div>
      </div>
    </main>
  );
}
