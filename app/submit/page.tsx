import { Center } from "@/components/ui/center";
import { font_poppins_one } from "@/lib/font";
import { FilePickerDialog } from "../../components/submit/file-picker";

export default async function Page() {
  return (
    <section
      className={`${font_poppins_one.className} min-h-screen bg-bg-main-2/10 py-8`}
    >
      <Center maxWidth="1300px" className="px-3 xsm:px-5">
        <h1 className="text-3xl font-semibold">
          GISLA 2024 AI ART COMPETITION
        </h1>
        <p>Submit Your Image via Upload</p>
        <FilePickerDialog />
      </Center>
    </section>
  );
}
