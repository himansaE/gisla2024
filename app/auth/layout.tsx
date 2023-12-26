import { COMPETITION_START_DATE } from "@/lib/constants";
import { redirect } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (
    COMPETITION_START_DATE.getTime() > new Date().getTime() &&
    process.env.NODE_ENV == "production" &&
    !(process.env.testing == "1")
  )
    // TODO:: make component for registration open soon
    return redirect("/");

  return <>{children}</>;
}
