import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BoxBg } from "./tutorial-page";

const contact_data = [
  {
    name: "Shakil Arifeen",
    title: "Advisor",
    wa: "mailto:shakilarifeen@ieee.org",
    img: "shakil-arifeen",
  },
  {
    name: " Manul Thanura",
    title: "Advisor",
    wa: "mailto:manulthanura@ieee.org",
    img: "manul_thanura",
  },
  {
    name: "Dhananjaya Yatigammana",
    title: "Co-chair",
    wa: "https://api.whatsapp.com/send?phone=94724250436",
    img: "dhananjaya-yatigammana",
  },
  {
    name: "Maleesha Dinujaya",
    title: "Co-chair",
    wa: "https://api.whatsapp.com/send?phone=94767169833",
    img: "maleesha-dinujaya",
  },
  {
    name: "Nipuni Herath",
    title: "Secretary",
    wa: "mailto:nipwimarshana@gmail.com",
    img: "nipuni-herath",
  },
];

export const ContactsUs = () => {
  return (
    <section className="pb-10 pt-16 text-white  relative" id="contact_us">
      <div className="flex justify-center my-4 text-sm">
        <div className="bg-[#153938] px-3 py-0.5 rounded-2xl flex items-center ">
          Meet Our Team
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-black z-[-10]">
        <BoxBg />
      </div>
      <h1 className="text-5xl px-6 font-semibold text-center leading-snug md:leading-relaxed">
        Further Information <br /> Contact Us
      </h1>

      <div className="flex pb-8 pt-12 px-2 md:px-20 2xl:px-60 gap-x-16 gap-y-8 flex-wrap justify-center">
        {contact_data.map((i) => (
          <Card key={i.name} {...i} />
        ))}
      </div>
    </section>
  );
};

const Card = (props: {
  name: string;
  title: string;
  wa: string;
  img: string;
}) => {
  return (
    <div
      className="animate-reveal sm:animate-none [animation-timeline:view()]
        [animation-range:entry_25%_cover_50%] text-center flex  flex-col w-60 max-w-full items-center"
      id="contact_us"
    >
      <Image
        src={`/images/contacts/${props.img}.webp`}
        height={300}
        width={300}
        className="rounded-3xl w-60 h-60 object-contain"
        alt={`${props.name}`}
      />
      <Link
        href={props.wa}
        title={`Contact ${props.name} on ${
          props.wa.startsWith("mail") ? "email" : "whatsapp"
        }.`}
        className="mt-1 text-lg flex items-center  focus:underline hover:underline px-2"
      >
        {props.name}
        <ArrowUpRight height=".9em" />
      </Link>
      <div className="text-sm text-slate-500">{props.title}</div>
    </div>
  );
};
