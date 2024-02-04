import { font_pasti, font_poppins_one } from "@/lib/font";

export const PostCount = () => {
  // const posts = await prisma.post.count();

  return (
    <div className="bg-bg-main rounded-xl px-2 sm:px-5 pb-2">
      <div
        className="flex tabular-nums text-white  pt-2 sm:pt-4 justify-center items-center "
        style={font_pasti.style}
      >
        {String("157")
          .padStart(4, "0")
          .split("")
          .map((i, n) => (
            <span
              key={n}
              className="bg-bg-main-2 px-2 py-3 rounded-lg my-3 mr-3 w-[2ch] flex justify-center leading-none text-5xl sm:text-8xl h-[3.8rem] sm:h-[6.4rem]"
            >
              {i}
            </span>
          ))}
      </div>
      <div
        className={`${font_poppins_one.className} text-white fon text-center text-sm sm:text-base`}
      >
        {" "}
        All Artworks Submitted
      </div>
    </div>
  );
};
