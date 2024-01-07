import { IntroPage } from "@/components/home/intro-page";
import { TitlePage } from "@/components/home/title";
import { TutorialPage } from "@/components/home/tutorial-page";

export default function Home() {
  return (
    <div>
      <IntroPage />
      <TitlePage />
      <TutorialPage />
    </div>
  );
}
