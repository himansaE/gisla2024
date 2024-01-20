import { ContactsUs } from "@/components/home/contact_us";
import { Footer } from "@/components/home/footer";
import { IntroPage } from "@/components/home/intro-page";
import { HomeTerms } from "@/components/home/terms";
import { TitlePage } from "@/components/home/title";
import { TutorialPage } from "@/components/home/tutorial-page";
import { Event, WithContext } from "schema-dts";

export default function Home() {
  const event: WithContext<Event> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "GISLA 2024 AI Art Competition.",
    startDate: "2024-01-14T20:00:00+05:30",
    endDate: "2024-01-31T23:59:59+05:30",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    location: {
      "@type": "VirtualLocation",
      url: "https://gisla2024.vercel.app/",
    },
    image: [
      "https://gisla2024.vercel.app/images/banneers/announce.jpg",
      "https://gisla2024.vercel.app/images/banneers/start-now.jpg",
      "https://gisla2024.vercel.app/images/banneers/we-are-online.jpg",
    ],
    description:
      "The IEEE GISLA 2024 is a AI Art Competition focuses on the use of digital art and artificial intelligence to raise awareness about critical issues of climate change. We aim to awaken people's minds through a Global AI Art Competition under the theme 'A Global Call for Climate Action'.",
    organizer: {
      "@type": "Organization",
      name: "IEEE Student Branch of SLTC",
      url: "https://ieee.sltc.ac.lk/",
    },
  };
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(event) }}
      ></script>
      <IntroPage />
      <TitlePage />
      <TutorialPage />

      <HomeTerms />
      {/* <OldInsights /> */}
      <ContactsUs />
      <Footer />
    </div>
  );
}
