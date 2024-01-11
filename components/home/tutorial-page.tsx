import { font_pasti, font_poppins_one } from "@/lib/font";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Center } from "../ui/center";

export const TutorialPage = () => {
  return (
    <section
      id="tutorial"
      className={`${font_poppins_one.className} w-full h-scree text-white relative overflow-hidden py-20`}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black z-[-10]">
        <BoxBg className="-top-4" />
        <BoxBg className="left-[50%] top-[150vh] origin-top rotate-90" />
      </div>
      <div className="flex justify-center my-4 text-sm">
        <div className="bg-[#153938] px-3 py-0.5 rounded-2xl flex items-center ">
          Tutorial
        </div>
      </div>
      <h1 className="text-5xl px-6 font-semibold text-center leading-snug md:leading-relaxed">
        Here is how to Participate <br /> GISLA 2024.
      </h1>
      <Center maxWidth="1000px">
        <div className="py-16 gap-y-16 flex flex-col md:grid grid-cols-6 justify-items-center al items-center md:items-start">
          <StepBox
            index={1}
            title="Image Generation"
            img="/assets/tutorial-1.webp"
            className="col-span-6 col-start-1"
            des="You have the freedom to use any digital platform to generate images, such as Midjourney, Artsmart, or other Al art generators and arts should be under the theme."
          />
          <StepBox
            index={2}
            title="Registration"
            des="Individually register through our official website's registration section with your correct details."
            img="/assets/tutorial-2.webp"
            className="col-span-3 col-start-1"
          />
          <StepBox
            index={3}
            img="/assets/tutorial-3.webp"
            className="col-span-3 col-start-4"
            title="Submission"
            des="Submit your original artwork electronically through our website. A maximum of 3 arts can be submitted and read the submission guidelines before submitting."
          />
          <StepBox
            index={4}
            img="/assets/tutorial-4.webp"
            className="col-span-6 col-start-1"
            title="Announcing Winners"
            des="You will be informed via email if your art is selected and winners will be announced through the IEEE Student branch of SLTC Facebook page."
          />
        </div>
      </Center>
    </section>
  );
};

const StepBox = (props: {
  img: string;
  title: string;
  className?: string;
  des: string;
  index: number;
}) => {
  return (
    <div
      className={`${
        props.className ?? ""
      } max-w-[300px] flex flex-col items-center text-center gap-5 relative `}
    >
      <div
        className={`${font_pasti.className} absolute top-[-10px] left-5 h-16 w-16 text-6xl bg-black  rounded-xl flex justify-center items-center`}
      >
        {props.index}
      </div>
      <Image
        src={props.img}
        alt=""
        height={300}
        width={300}
        className="rounded-lg"
      />
      <div className="flex flex-col gap-3 ">
        <h2 className="text-xl font-semibold">{props.title}</h2>
        <div className="text-xs text-gray-300">{props.des}</div>
      </div>
    </div>
  );
};

export const BoxBg = (props: { className?: string }) => {
  return (
    <div
      className={cn(
        "absolute top-0 left-0 w-full h-full -z-10",
        props.className
      )}
    >
      <div
        className="w-full h-96 opacity-80"
        style={{
          background:
            " linear-gradient(#2a726f .1px, transparent 1px), linear-gradient(to right, #2a726f .1px, #000000 1px)",
          backgroundSize: "66px 66px ",
          backgroundPosition: "center center",
        }}
      />
      <div
        className="h-[60rem] w-full absolute top-[-26rem] left-0"
        style={{
          background: "radial-gradient(transparent, black 60vw)",
        }}
      />
    </div>
  );
};
