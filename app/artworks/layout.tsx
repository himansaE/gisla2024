import { Center } from "@/components/ui/center";
import { ReactNode } from "react";

export default function Layout(props: { children: ReactNode }) {
  return (
    <div className="pb-10">
      <Center maxWidth="1200px">
        <h1 className="text-3xl font-semibold px-3 pt-10">
          GISLA Artwork Gallery
        </h1>
        {props.children}
      </Center>
    </div>
  );
}
