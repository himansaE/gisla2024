import { ContactsUs } from "@/components/home/contact_us";
import { Footer } from "@/components/home/footer";
import { HomeTerms } from "@/components/home/terms";
import { TitlePage } from "@/components/home/title";
import { TutorialPage } from "@/components/home/tutorial-page";

export default function Home() {
  return (
    <div>
      {/* <IntroPage /> */}
      <TitlePage />
      <TutorialPage />

      <HomeTerms />
      {/* <OldInsights /> */}
      <ContactsUs />
      <Footer />
    </div>
  );
}
